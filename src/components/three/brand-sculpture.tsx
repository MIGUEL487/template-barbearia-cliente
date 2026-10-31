"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function BrandSculpture() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsLowPower(true);
      return;
    }

    // Check WebGL availability
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // Three.js Scene Setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    let renderer: THREE.WebGLRenderer | null = null;
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
    container.appendChild(renderer.domElement);

    // Root sculpture group
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // 1. Parametric Blade Curve (Precision Straight-Razor / Scissor sweep)
    class RazorCurve extends THREE.Curve<THREE.Vector3> {
      scale: number;
      constructor(scale = 1.4) {
        super();
        this.scale = scale;
      }
      getPoint(t: number, optionalTarget = new THREE.Vector3()) {
        const u = t * Math.PI * 2;
        // Modified trefoil / Mobius ribbon formula with sharpened blade curvature
        const x = Math.sin(u) * (1.2 + 0.5 * Math.cos(2 * u)) * this.scale;
        const y = Math.cos(u) * (1.2 - 0.5 * Math.cos(2 * u)) * this.scale * 0.75;
        const z = Math.sin(3 * u) * 0.45 * this.scale;
        return optionalTarget.set(x, y, z);
      }
    }

    const path = new RazorCurve(1.15);
    const bladeGeometry = new THREE.TubeGeometry(path, 128, 0.085, 16, true);

    // Brushed titanium / Damascus dark metallic material
    const bladeMaterial = new THREE.MeshStandardMaterial({
      color: 0x182038,
      metalness: 0.94,
      roughness: 0.18,
      wireframe: false,
    });

    const bladeMesh = new THREE.Mesh(bladeGeometry, bladeMaterial);
    sculptureGroup.add(bladeMesh);

    // 2. Concentric Precision Bevel Ring (representing razor geometry)
    const ringGeometry = new THREE.TorusGeometry(1.65, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x7b61ff,
      metalness: 0.85,
      roughness: 0.25,
      transparent: true,
      opacity: 0.6,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 3;
    sculptureGroup.add(ringMesh);

    // 3. Central Core Pivot (Stylized barber tool joint)
    const coreGeometry = new THREE.CylinderGeometry(0.22, 0.22, 0.45, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a3658,
      metalness: 0.95,
      roughness: 0.12,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    coreMesh.rotation.z = Math.PI / 4;
    sculptureGroup.add(coreMesh);

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x0a1020, 1.2);
    scene.add(ambientLight);

    // Key studio white light (simulating barbershop spotlight)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // Signature Auto Stilo Violet rim light
    const violetRimLight = new THREE.DirectionalLight(0x7b61ff, 4.2);
    violetRimLight.position.set(-4, -3, 2);
    scene.add(violetRimLight);

    // Subtle warm golden amber rim fill (representing barber craft warmth)
    const amberFillLight = new THREE.PointLight(0xffb74d, 1.8, 10);
    amberFillLight.position.set(2, -2, -2);
    scene.add(amberFillLight);

    // Interactive pointer parallax tracking
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.45;
      targetY = y * 0.35;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    // GSAP ScrollTrigger Integration: subtle pitch and spin as user scrolls
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom top",
      scrub: 1.2,
      onUpdate: (self) => {
        if (sculptureGroup) {
          sculptureGroup.rotation.y = self.progress * Math.PI * 1.5;
          sculptureGroup.position.z = -self.progress * 1.2;
        }
      },
    });

    // Animation Loop with Visibility Observer for 60fps performance
    let animationFrameId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible || !renderer) return;

      const delta = clock.getDelta();

      // Gentle continuous ambient orbit
      sculptureGroup.rotation.x += delta * 0.22;
      sculptureGroup.rotation.z += delta * 0.15;

      // Smooth pointer interpolation
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      camera.position.x = currentX;
      camera.position.y = currentY;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      st.kill();

      if (renderer && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }

      // Dispose Three.js objects
      bladeGeometry.dispose();
      bladeMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      renderer?.dispose();
    };
  }, []);

  if (!hasWebGL || isLowPower) {
    return (
      <div className="sculpture-fallback" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="fallback-emblem" fill="none">
          <circle cx="100" cy="100" r="70" stroke="rgba(123, 97, 255, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M50 100 Q100 40 150 100 T250 100" stroke="#7B61FF" strokeWidth="2.5" />
          <path d="M50 100 Q100 160 150 100 T250 100" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="8" fill="#7B61FF" />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="brand-sculpture-canvas"
      aria-hidden="true"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "360px",
        position: "relative",
        pointerEvents: "auto",
      }}
    />
  );
}
