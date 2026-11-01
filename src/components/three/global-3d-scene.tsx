"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Global3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // WebGL Check
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    // Transparent background so the light page background shows through
    scene.background = null;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setHasWebGL(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.pointerEvents = "none";
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Studio Lighting Rig
    // Key Light (warm studio white)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4.0, 5.0, 4.0);
    scene.add(keyLight);

    // Rim Light (Auto Stilo subtle lavender rim light to carve metallic edges)
    const rimLight = new THREE.DirectionalLight(0xe4d8ff, 2.2);
    rimLight.position.set(-4.0, 3.5, -3.0);
    scene.add(rimLight);

    // Fill Light (soft cool fill from below-front)
    const fillLight = new THREE.DirectionalLight(0xf2f4f8, 1.4);
    fillLight.position.set(0, -3.0, 3.5);
    scene.add(fillLight);

    // Soft Ambient Light
    const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambLight);

    // 3. Contact Shadow Plane
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext("2d")!;
    const grad = sctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(10, 10, 14, 0.22)");
    grad.addColorStop(0.35, "rgba(10, 10, 14, 0.09)");
    grad.addColorStop(0.7, "rgba(10, 10, 14, 0.02)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.35,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -1.8, 0);
    scene.add(shadowPlane);

    // 4. Model Group & Material
    const clipperPivot = new THREE.Group();
    scene.add(clipperPivot);

    const texLoader = new THREE.TextureLoader();
    const texture = texLoader.load(
      "/models/hair-clipper/hair-clipper-basecolor.jpg",
      () => {
        texture.needsUpdate = true;
        clipperMaterial.needsUpdate = true;
      }
    );
    texture.colorSpace = THREE.SRGBColorSpace;

    const clipperMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.65,
      roughness: 0.28,
      transparent: true,
      opacity: 0.40, // Initial discrete opacity at hero
    });

    let modelMesh: THREE.Mesh | null = null;
    let modelLoaded = false;

    // Trajectory Transform State (driven by GSAP ScrollTrigger)
    const isMobile = window.innerWidth < 768;
    const state = {
      x: isMobile ? 0.35 : 1.25,
      y: isMobile ? 0.35 : 0.05,
      z: isMobile ? 0.2 : 0.6,
      rotX: -0.15,
      rotY: 0.15,
      rotZ: 0.10,
      scale: isMobile ? 0.70 : 1.0,
      opacity: isMobile ? 0.25 : 0.40,
      shadowOpacity: 0.35,
    };

    let gsapTimeline: gsap.core.Timeline | null = null;

    const objLoader = new OBJLoader();
    objLoader.load(
      "/models/hair-clipper/hair-clipper.obj",
      (obj) => {
        // Center the geometry
        const box = new THREE.Box3().setFromObject(obj);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);

        const maxDim = Math.max(size.x, size.y, size.z);
        const baseScale = 2.8 / (maxDim || 1);

        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.material = clipperMaterial;
            m.geometry.center();
            modelMesh = m;
          }
        });

        obj.scale.set(baseScale, baseScale, baseScale);
        // Upright base orientation with blade head on top facing front
        obj.rotation.set(-Math.PI / 4, Math.PI / 3, 0);
        clipperPivot.add(obj);
        modelLoaded = true;

        if (prefersReducedMotion) {
          // Static hero angle
          clipperPivot.position.set(state.x, state.y, state.z);
          clipperPivot.rotation.set(state.rotX, state.rotY, state.rotZ);
          clipperMaterial.opacity = 0.32;
          renderer.render(scene, camera);
          return;
        }

        // Setup Choreographed Scroll Trajectory across the whole page
        gsapTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // STAGE 1: Hero to Signature (0.00 -> 0.10)
        // Moves from top-right to left flank, opacity rises to 0.72
        gsapTimeline.to(
          state,
          {
            x: isMobile ? -0.3 : -1.25,
            y: -0.10,
            z: isMobile ? 0.35 : 0.75,
            rotX: -0.20,
            rotY: 0.55,
            rotZ: -0.12,
            scale: isMobile ? 0.80 : 1.05,
            opacity: 0.72,
            shadowOpacity: 0.45,
            ease: "power2.inOut",
          },
          0.10
        );

        // STAGE 2: Signature to Ritual (0.10 -> 0.20)
        // Moves to right side of Ritual, dramatic close-up showing precision blade and teeth
        gsapTimeline.to(
          state,
          {
            x: isMobile ? 0.35 : 1.15,
            y: 0.02,
            z: isMobile ? 0.70 : 1.20,
            rotX: 0.05,
            rotY: -0.10,
            rotZ: 0.02,
            scale: isMobile ? 0.95 : 1.20,
            opacity: 0.88,
            shadowOpacity: 0.55,
            ease: "power2.inOut",
          },
          0.19
        );

        // STAGE 3: Ritual to Services Catalog (0.19 -> 0.27)
        // Recedes back into the far right background with low opacity for 100% reading clarity
        gsapTimeline.to(
          state,
          {
            x: isMobile ? 0.5 : 1.75,
            y: -0.25,
            z: isMobile ? -0.4 : -0.75,
            rotX: -0.35,
            rotY: 0.85,
            rotZ: 0.18,
            scale: isMobile ? 0.55 : 0.75,
            opacity: 0.14, // Subtle faint background presence behind catalog
            shadowOpacity: 0.12,
            ease: "power2.inOut",
          },
          0.27
        );

        // STAGE 4: Services to History & Space (0.27 -> 0.42)
        // Shifts to left flank, medium opacity
        gsapTimeline.to(
          state,
          {
            x: isMobile ? -0.4 : -1.65,
            y: 0.10,
            z: isMobile ? 0.25 : 0.60,
            rotX: -0.25,
            rotY: 1.30,
            rotZ: -0.15,
            scale: isMobile ? 0.75 : 0.95,
            opacity: 0.45,
            shadowOpacity: 0.30,
            ease: "power2.inOut",
          },
          0.42
        );

        // STAGE 5: Reviews to Footer (0.42 -> 0.75)
        // Recedes upward into deep background and smoothly fades to zero well before footer
        gsapTimeline.to(
          state,
          {
            x: 0,
            y: 0.65,
            z: -2.0,
            rotX: -0.50,
            rotY: 2.10,
            rotZ: 0.10,
            scale: 0.50,
            opacity: 0.0,
            shadowOpacity: 0.0,
            ease: "power2.in",
          },
          0.75
        );

        // Notify ScrollTrigger to sync
        ScrollTrigger.refresh();
      },
      undefined,
      (err) => {
        console.warn("Erro ao carregar modelo 3D OBJ:", err);
        setHasWebGL(false);
      }
    );

    // 5. Interactive Mouse Parallax (subtle tilt)
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onPointerMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetMouseX = x * 0.18;
      targetMouseY = y * 0.18;
    };

    if (!prefersReducedMotion) {
      window.addEventListener("mousemove", onPointerMove, { passive: true });
    }

    // 6. Resize Observer
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize, { passive: true });

    // 7. Render Loop
    let animId: number;
    let isVisible = true;

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    io.observe(container);

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      if (modelLoaded && !prefersReducedMotion) {
        // Mouse smoothing
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Apply state transforms + mouse tilt
        clipperPivot.position.set(state.x + mouseX * 0.3, state.y + mouseY * 0.3, state.z);
        clipperPivot.rotation.set(
          state.rotX - mouseY * 0.4,
          state.rotY + mouseX * 0.5,
          state.rotZ
        );
        clipperPivot.scale.set(state.scale, state.scale, state.scale);

        // Apply dynamic opacity
        clipperMaterial.opacity = state.opacity;
        shadowMat.opacity = state.shadowOpacity;

        // Shadow follows model X and Z
        shadowPlane.position.x = clipperPivot.position.x;
        shadowPlane.position.z = clipperPivot.position.z;
        shadowPlane.scale.set(state.scale, state.scale, state.scale);
      }

      renderer.render(scene, camera);
    };

    render();

    // 8. Strict Resource Disposal on Unmount
    return () => {
      cancelAnimationFrame(animId);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      if (!prefersReducedMotion) {
        window.removeEventListener("mousemove", onPointerMove);
      }

      gsapTimeline?.scrollTrigger?.kill();
      gsapTimeline?.kill();

      if (modelMesh) {
        modelMesh.geometry.dispose();
      }
      shadowGeo.dispose();
      shadowTex.dispose();
      shadowMat.dispose();
      texture.dispose();
      clipperMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!hasWebGL) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="global-3d-scene"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100svh",
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
      aria-hidden="true"
    />
  );
}
