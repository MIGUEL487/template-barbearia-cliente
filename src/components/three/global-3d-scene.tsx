"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
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

    // WebGL Availability Check
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
    scene.background = null;

    let width = window.innerWidth;
    let height = window.innerHeight;

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

    // Adaptive DPR
    const isMobile = width < 768;
    const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2.0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.pointerEvents = "none";
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Studio Lighting Rig
    const ambLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.2);
    keyLight.position.set(3.8, 5.0, 3.8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.1);
    fillLight.position.set(-3.5, 1.5, 2.8);
    scene.add(fillLight);

    // Subtle violet rim light (brand identity highlight)
    const violetRim = new THREE.DirectionalLight(0xa855f7, 1.8);
    violetRim.position.set(-2.5, -3.0, -2.5);
    scene.add(violetRim);

    // Top razor-sharp rim
    const topRim = new THREE.DirectionalLight(0xffffff, 1.6);
    topRim.position.set(1.5, 4.5, -3.0);
    scene.add(topRim);

    // 3. Contact Shadow Plane
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext("2d");
    if (sctx) {
      const grad = sctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, "rgba(10, 10, 14, 0.25)");
      grad.addColorStop(0.35, "rgba(10, 10, 14, 0.08)");
      grad.addColorStop(0.7, "rgba(10, 10, 14, 0.02)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 256, 256);
    }
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

    // 4. Model Group
    const modelGroup = new THREE.Group();
    modelGroup.name = "AutoStiloTrimmerContainer";
    scene.add(modelGroup);

    // Pose State
    const currentPose = {
      x: isMobile ? 0.30 : 1.25,
      y: isMobile ? 0.25 : 0.05,
      z: isMobile ? 0.15 : 0.50,
      rx: 0.10,
      ry: 0.15,
      rz: -0.25,
      scale: isMobile ? 0.65 : 0.95,
      opacity: isMobile ? 0.30 : 0.50,
    };

    const targetPose = { ...currentPose };
    let isAnimating = true;
    let isDisposed = false;

    // 5. Load Photoreal GLB
    const loader = new GLTFLoader();
    loader.load(
      "/3d/auto-stilo-trimmer.glb",
      (gltf) => {
        if (isDisposed) return;
        const root = gltf.scene;

        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            // Ensure no depth sorting conflicts
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => {
                m.transparent = false;
                m.depthWrite = true;
              });
            } else if (mesh.material) {
              mesh.material.transparent = false;
              mesh.material.depthWrite = true;
            }
          }
        });

        modelGroup.add(root);

        if (prefersReducedMotion) {
          modelGroup.position.set(currentPose.x, currentPose.y, currentPose.z);
          modelGroup.rotation.set(currentPose.rx, currentPose.ry, currentPose.rz);
          modelGroup.scale.set(currentPose.scale, currentPose.scale, currentPose.scale);
          container.style.opacity = "0.40";
          renderer.render(scene, camera);
          return;
        }

        // 6. Multi-Stage Scroll Timeline
        // Key stages matching the page flow
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              isAnimating = true;
              const p = self.progress;

              // Immediate reaction: first 40px scroll begins smooth motion
              if (p <= 0.12) {
                // Stage: Hero -> Início do Scroll
                const t = p / 0.12;
                targetPose.x = gsap.utils.interpolate(isMobile ? 0.30 : 1.25, isMobile ? -0.20 : -1.15, t);
                targetPose.y = gsap.utils.interpolate(isMobile ? 0.25 : 0.05, -0.05, t);
                targetPose.z = gsap.utils.interpolate(0.50, 0.70, t);
                targetPose.rx = gsap.utils.interpolate(0.10, -0.15, t);
                targetPose.ry = gsap.utils.interpolate(0.15, 0.65, t);
                targetPose.rz = gsap.utils.interpolate(-0.25, -0.10, t);
                targetPose.scale = gsap.utils.interpolate(isMobile ? 0.65 : 0.95, isMobile ? 0.75 : 1.05, t);
                targetPose.opacity = gsap.utils.interpolate(isMobile ? 0.30 : 0.50, 0.85, t);
              } else if (p <= 0.26) {
                // Stage: Assinatura (Profile view) -> Ritual (Macro blades)
                const t = (p - 0.12) / 0.14;
                targetPose.x = gsap.utils.interpolate(isMobile ? -0.20 : -1.15, isMobile ? 0.30 : 1.10, t);
                targetPose.y = gsap.utils.interpolate(-0.05, 0.08, t);
                targetPose.z = gsap.utils.interpolate(0.70, isMobile ? 0.90 : 1.40, t);
                targetPose.rx = gsap.utils.interpolate(-0.15, 0.25, t);
                targetPose.ry = gsap.utils.interpolate(0.65, 1.45, t);
                targetPose.rz = gsap.utils.interpolate(-0.10, -0.20, t);
                targetPose.scale = gsap.utils.interpolate(isMobile ? 0.75 : 1.05, isMobile ? 0.90 : 1.35, t);
                targetPose.opacity = gsap.utils.interpolate(0.85, 1.0, t);
              } else if (p <= 0.45) {
                // Stage: Ritual -> Catálogo Serviços (Recedes to lateral right, low opacity for text clarity)
                const t = (p - 0.26) / 0.19;
                targetPose.x = gsap.utils.interpolate(isMobile ? 0.30 : 1.10, isMobile ? 0.40 : 1.35, t);
                targetPose.y = gsap.utils.interpolate(0.08, -0.10, t);
                targetPose.z = gsap.utils.interpolate(isMobile ? 0.90 : 1.40, 0.35, t);
                targetPose.rx = gsap.utils.interpolate(0.25, 0.10, t);
                targetPose.ry = gsap.utils.interpolate(1.45, 2.65, t);
                targetPose.rz = gsap.utils.interpolate(-0.20, 0.45, t);
                targetPose.scale = gsap.utils.interpolate(isMobile ? 0.90 : 1.35, isMobile ? 0.60 : 0.75, t);
                targetPose.opacity = gsap.utils.interpolate(1.0, 0.28, t);
              } else if (p <= 0.65) {
                // Stage: Serviços -> História / Equipe (Diagonal presentation)
                const t = (p - 0.45) / 0.20;
                targetPose.x = gsap.utils.interpolate(isMobile ? 0.40 : 1.35, isMobile ? -0.25 : -1.05, t);
                targetPose.y = gsap.utils.interpolate(-0.10, 0.05, t);
                targetPose.z = gsap.utils.interpolate(0.35, 0.65, t);
                targetPose.rx = gsap.utils.interpolate(0.10, -0.12, t);
                targetPose.ry = gsap.utils.interpolate(2.65, 3.20, t);
                targetPose.rz = gsap.utils.interpolate(0.45, 0.20, t);
                targetPose.scale = gsap.utils.interpolate(isMobile ? 0.60 : 0.75, isMobile ? 0.70 : 0.90, t);
                targetPose.opacity = gsap.utils.interpolate(0.28, 0.65, t);
              } else if (p <= 0.85) {
                // Stage: História -> Agendamento Final (Points towards CTA)
                const t = (p - 0.65) / 0.20;
                targetPose.x = gsap.utils.interpolate(isMobile ? -0.25 : -1.05, 0.0, t);
                targetPose.y = gsap.utils.interpolate(0.05, -0.15, t);
                targetPose.z = gsap.utils.interpolate(0.65, 0.80, t);
                targetPose.rx = gsap.utils.interpolate(-0.12, 0.30, t);
                targetPose.ry = gsap.utils.interpolate(3.20, 3.85, t);
                targetPose.rz = gsap.utils.interpolate(0.20, 0.0, t);
                targetPose.scale = gsap.utils.interpolate(isMobile ? 0.70 : 0.90, isMobile ? 0.85 : 1.05, t);
                targetPose.opacity = gsap.utils.interpolate(0.65, 0.88, t);
              } else {
                // Stage: Agendamento -> Conclusão / Rodapé (Fades out gently)
                const t = (p - 0.85) / 0.15;
                targetPose.x = 0.0;
                targetPose.y = gsap.utils.interpolate(-0.15, -0.40, t);
                targetPose.z = gsap.utils.interpolate(0.80, 0.20, t);
                targetPose.rx = 0.30;
                targetPose.ry = gsap.utils.interpolate(3.85, 4.20, t);
                targetPose.rz = 0.0;
                targetPose.scale = gsap.utils.interpolate(isMobile ? 0.85 : 1.05, 0.65, t);
                targetPose.opacity = gsap.utils.interpolate(0.88, 0.0, t);
              }
            },
          },
        });
      },
      undefined,
      (err) => {
        console.error("Erro ao carregar auto-stilo-trimmer.glb:", err);
      }
    );

    // 7. Render Loop with Smooth Lerp & Energy Saving
    const lerpFactor = 0.08;
    const renderLoop = () => {
      if (isDisposed) return;

      if (document.hidden) {
        return;
      }

      // Smooth interpolation towards target pose
      currentPose.x += (targetPose.x - currentPose.x) * lerpFactor;
      currentPose.y += (targetPose.y - currentPose.y) * lerpFactor;
      currentPose.z += (targetPose.z - currentPose.z) * lerpFactor;
      currentPose.rx += (targetPose.rx - currentPose.rx) * lerpFactor;
      currentPose.ry += (targetPose.ry - currentPose.ry) * lerpFactor;
      currentPose.rz += (targetPose.rz - currentPose.rz) * lerpFactor;
      currentPose.scale += (targetPose.scale - currentPose.scale) * lerpFactor;
      currentPose.opacity += (targetPose.opacity - currentPose.opacity) * lerpFactor;

      modelGroup.position.set(currentPose.x, currentPose.y, currentPose.z);
      modelGroup.rotation.set(currentPose.rx, currentPose.ry, currentPose.rz);
      modelGroup.scale.set(currentPose.scale, currentPose.scale, currentPose.scale);

      shadowPlane.position.set(currentPose.x, -1.8, currentPose.z - 0.2);
      shadowMat.opacity = currentPose.opacity * 0.45;

      container.style.opacity = currentPose.opacity.toFixed(3);

      renderer.render(scene, camera);
    };

    gsap.ticker.add(renderLoop);

    // 8. Handle Window Resize
    const handleResize = () => {
      if (isDisposed) return;
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(
        width < 768
          ? Math.min(window.devicePixelRatio || 1, 1.5)
          : Math.min(window.devicePixelRatio || 1, 2.0)
      );
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    // 9. Full Cleanup on Unmount
    return () => {
      isDisposed = true;
      gsap.ticker.remove(renderLoop);
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === document.body) st.kill();
      });

      // Dispose Three.js objects
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
      shadowTex.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      renderer.dispose();
      container.innerHTML = "";
    };
  }, []);

  if (!hasWebGL) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-300"
      aria-hidden="true"
    />
  );
}
