"use client";

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";

export interface HairClipperHandle {
  setProgress: (p: number) => void;
  getCanvas: () => HTMLCanvasElement | null;
}

interface HairClipperProps {
  progress?: number;
  className?: string;
  interactive?: boolean;
}

export const HairClipper = forwardRef<HairClipperHandle, HairClipperProps>(function HairClipper(
  { progress: externalProgress = 0, className = "", interactive = true },
  ref
) {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const progressRef = useRef(externalProgress);

  // Expose imperative handle for external scroll controllers (GSAP / Lenis)
  useImperativeHandle(ref, () => ({
    setProgress: (p: number) => {
      progressRef.current = Math.max(0, Math.min(1, p));
    },
    getCanvas: () => canvasRef.current,
  }));

  useEffect(() => {
    progressRef.current = externalProgress;
  }, [externalProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect WebGL support
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

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 2. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.2, 5.0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      setHasWebGL(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    canvasRef.current = renderer.domElement;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 3. Materials
    // Brushed Chrome / Steel Blade
    const brushedSteel = new THREE.MeshStandardMaterial({
      color: 0xd8dbe2,
      metalness: 0.95,
      roughness: 0.2,
    });

    // Dark Brushed Metal Upper Lid
    const upperLidMat = new THREE.MeshStandardMaterial({
      color: 0x22262e,
      metalness: 0.85,
      roughness: 0.3,
    });

    // Ergonomic Matte Polymer Lower Body
    const lowerBodyMat = new THREE.MeshStandardMaterial({
      color: 0x14161a,
      metalness: 0.35,
      roughness: 0.5,
    });

    // Auto Stilo Brand Violet Accent Ring / Details
    const violetAccentMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      metalness: 0.75,
      roughness: 0.25,
    });

    // Gold/Brass screw & lever accents
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc8a265,
      metalness: 0.9,
      roughness: 0.25,
    });

    // Group for the entire clipper assembly
    const clipperGroup = new THREE.Group();
    scene.add(clipperGroup);

    // --- A. Main Ergonomic Body ---
    // Body Chassis (tapered cylinder/cone with rounded curves)
    const bodyGeo = new THREE.CylinderGeometry(0.42, 0.32, 2.2, 32);
    bodyGeo.scale(1.15, 1, 0.75); // Flatten slightly for ergonomic grip
    const bodyMesh = new THREE.Mesh(bodyGeo, lowerBodyMat);
    bodyMesh.position.set(0, -0.4, 0);
    clipperGroup.add(bodyMesh);

    // Upper Lid Faceplate (Brushed Dark Metal Shield)
    const lidGeo = new THREE.CylinderGeometry(0.43, 0.33, 2.0, 32, 1, false, -Math.PI / 2, Math.PI);
    lidGeo.scale(1.16, 1, 0.78);
    const lidMesh = new THREE.Mesh(lidGeo, upperLidMat);
    lidMesh.position.set(0, -0.3, 0.01);
    clipperGroup.add(lidMesh);

    // Ergonomic Thumb Indent (grip oval)
    const thumbIndentGeo = new THREE.SphereGeometry(0.25, 24, 16);
    thumbIndentGeo.scale(0.8, 1.4, 0.3);
    const thumbIndent = new THREE.Mesh(thumbIndentGeo, lowerBodyMat);
    thumbIndent.position.set(0, -0.15, 0.26);
    clipperGroup.add(thumbIndent);

    // Brand Violet Trim Ring (Auto Stilo signature)
    const ringGeo = new THREE.TorusGeometry(0.42, 0.02, 16, 64);
    ringGeo.scale(1.16, 0.76, 1);
    ringGeo.rotateX(Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, violetAccentMat);
    ringMesh.position.set(0, 0.65, 0);
    clipperGroup.add(ringMesh);

    // Secondary Trim Ring near base
    const baseRingGeo = new THREE.TorusGeometry(0.33, 0.015, 16, 48);
    baseRingGeo.scale(1.16, 0.76, 1);
    baseRingGeo.rotateX(Math.PI / 2);
    const baseRingMesh = new THREE.Mesh(baseRingGeo, brushedSteel);
    baseRingMesh.position.set(0, -1.35, 0);
    clipperGroup.add(baseRingMesh);

    // --- B. Cutting Head & Precision Blade ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.75, 0);

    // Blade Angled Neck / Mount
    const neckGeo = new THREE.BoxGeometry(0.85, 0.35, 0.5);
    neckGeo.translate(0, 0.15, 0.04);
    const neckMesh = new THREE.Mesh(neckGeo, brushedSteel);
    headGroup.add(neckMesh);

    // Fixed Bottom Blade Base Plate
    const bladeBaseGeo = new THREE.BoxGeometry(1.05, 0.08, 0.35);
    const bladeBaseMesh = new THREE.Mesh(bladeBaseGeo, brushedSteel);
    bladeBaseMesh.position.set(0, 0.4, 0.12);
    bladeBaseMesh.rotation.x = -Math.PI / 10;
    headGroup.add(bladeBaseMesh);

    // --- C. Teeth of the Cutting Blade (Serrated comb teeth) ---
    // 21 distinct steel blade teeth along the front edge
    const teethGroup = new THREE.Group();
    teethGroup.position.set(0, 0.44, 0.18);
    teethGroup.rotation.x = -Math.PI / 10;

    const toothCount = 21;
    const toothWidth = 0.024;
    const toothGap = 0.024;
    const totalSpan = toothCount * (toothWidth + toothGap);
    const toothGeo = new THREE.BoxGeometry(toothWidth, 0.14, 0.03);

    for (let i = 0; i < toothCount; i++) {
      const tooth = new THREE.Mesh(toothGeo, brushedSteel);
      const x = -totalSpan / 2 + i * (toothWidth + toothGap) + toothWidth / 2;
      tooth.position.set(x, 0.06, 0);
      teethGroup.add(tooth);
    }
    headGroup.add(teethGroup);

    // Moving Top Cutting Blade (recessed behind comb teeth)
    const movingBladeGeo = new THREE.BoxGeometry(0.96, 0.06, 0.04);
    const movingBladeMesh = new THREE.Mesh(movingBladeGeo, upperLidMat);
    movingBladeMesh.position.set(0, 0.42, 0.13);
    movingBladeMesh.rotation.x = -Math.PI / 10;
    headGroup.add(movingBladeMesh);

    // Blade Screws (2 Allen screws holding the blade)
    const screwGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16);
    screwGeo.rotateX(Math.PI / 2);
    const screw1 = new THREE.Mesh(screwGeo, brassMat);
    screw1.position.set(-0.35, 0.32, 0.28);
    headGroup.add(screw1);
    const screw2 = new THREE.Mesh(screwGeo, brassMat);
    screw2.position.set(0.35, 0.32, 0.28);
    headGroup.add(screw2);

    // --- D. Side Taper Lever (Alavanca de regulagem de corte) ---
    const leverGroup = new THREE.Group();
    leverGroup.position.set(-0.48, 0.88, 0.05);

    const leverPivotGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16);
    leverPivotGeo.rotateZ(Math.PI / 2);
    const leverPivot = new THREE.Mesh(leverPivotGeo, brassMat);
    leverGroup.add(leverPivot);

    const leverArmGeo = new THREE.BoxGeometry(0.04, 0.32, 0.08);
    leverArmGeo.translate(0, -0.12, 0);
    const leverArm = new THREE.Mesh(leverArmGeo, brushedSteel);
    leverGroup.add(leverArm);

    // Lever Thumb Grip Knob
    const leverKnobGeo = new THREE.BoxGeometry(0.06, 0.1, 0.12);
    leverKnobGeo.translate(0, -0.26, 0.02);
    const leverKnob = new THREE.Mesh(leverKnobGeo, violetAccentMat);
    leverGroup.add(leverKnob);

    clipperGroup.add(leverGroup);
    clipperGroup.add(headGroup);

    // --- E. Power Switch (Interruptor Lateral) ---
    const switchBaseGeo = new THREE.BoxGeometry(0.08, 0.3, 0.12);
    const switchBase = new THREE.Mesh(switchBaseGeo, upperLidMat);
    switchBase.position.set(0.48, -0.2, 0);
    clipperGroup.add(switchBase);

    const switchToggleGeo = new THREE.BoxGeometry(0.12, 0.12, 0.08);
    const switchToggle = new THREE.Mesh(switchToggleGeo, brassMat);
    switchToggle.position.set(0.5, -0.15, 0);
    clipperGroup.add(switchToggle);

    // --- F. Base Cord Loop / Hanging Ring ---
    const loopGeo = new THREE.TorusGeometry(0.12, 0.02, 16, 32);
    const loopMesh = new THREE.Mesh(loopGeo, brushedSteel);
    loopMesh.position.set(0, -1.6, 0);
    loopMesh.rotation.y = Math.PI / 2;
    clipperGroup.add(loopMesh);

    // --- G. Realistic Contact Shadow Plane on Pure White ---
    // Create soft shadow texture via canvas
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext("2d")!;
    const grad = sctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(10, 10, 14, 0.28)");
    grad.addColorStop(0.35, "rgba(10, 10, 14, 0.14)");
    grad.addColorStop(0.7, "rgba(10, 10, 14, 0.04)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -1.8, 0);
    scene.add(shadowPlane);

    // --- 4. Studio Lighting Rig on White ---
    // Key Light (Main light highlighting metallic reflections)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(3.5, 4.0, 4.0);
    scene.add(keyLight);

    // Rim / Edge Light (Subtle lavender rim to sculpt silhouette against white)
    const rimLight = new THREE.DirectionalLight(0xe4d8ff, 1.8);
    rimLight.position.set(-4.0, 3.0, -2.5);
    scene.add(rimLight);

    // Fill Light from front-bottom
    const fillLight = new THREE.DirectionalLight(0xf5f6fa, 1.2);
    fillLight.position.set(0, -2.5, 3.5);
    scene.add(fillLight);

    // Soft Ambient Fill
    const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambLight);

    // Initial pose
    clipperGroup.position.set(0, 0.1, 0);
    clipperGroup.rotation.set(0.35, -0.45, 0.15);

    // --- 5. Interactive Mouse Parallax ---
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onPointerMove = (e: MouseEvent) => {
      if (!interactive || prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = Math.max(-1, Math.min(1, x)) * 0.25;
      targetMouseY = Math.max(-1, Math.min(1, y)) * 0.25;
    };

    if (interactive && !prefersReducedMotion) {
      window.addEventListener("mousemove", onPointerMove, { passive: true });
    }

    // --- 6. Resize Observer ---
    const onResize = () => {
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObs = new ResizeObserver(onResize);
    resizeObs.observe(container);

    // --- 7. Intersection Observer (Pause RAF when offscreen) ---
    let isVisible = true;
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    io.observe(container);

    // --- 8. Animation & Render Loop ---
    let animId: number;
    let currentScroll = progressRef.current;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      // Smooth dampening towards target scroll progress
      const targetScroll = progressRef.current;
      currentScroll += (targetScroll - currentScroll) * 0.08;

      // Mouse smoothing
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      if (!prefersReducedMotion) {
        // Coreographed rotation driven by scroll progress (0 to 1)
        // 0% -> Hero pose: angled 3/4 view
        // 25% -> Side view with lever
        // 50% -> Face-on blade view with teeth
        // 75% -> Back view showing ergonomic thumb indent
        // 100% -> Dynamic studio finish
        const rotY = -0.45 + currentScroll * Math.PI * 2.2 + mouseX;
        const rotX = 0.35 + Math.sin(currentScroll * Math.PI) * 0.45 - mouseY;
        const rotZ = 0.15 + Math.cos(currentScroll * Math.PI * 1.5) * 0.15;

        clipperGroup.rotation.set(rotX, rotY, rotZ);

        // Micro-animation: taper lever pivots as scroll advances
        leverGroup.rotation.x = Math.sin(currentScroll * Math.PI * 3) * 0.22;

        // Shadow follows rotation scale subtly
        shadowPlane.scale.set(
          1 + Math.sin(rotY) * 0.15,
          1 + Math.cos(rotX) * 0.15,
          1
        );
      } else {
        // Reduced motion: fixed hero pose
        clipperGroup.rotation.set(0.35, -0.45, 0.15);
      }

      renderer.render(scene, camera);
    };

    render();

    // --- 9. Clean Disposal on Unmount ---
    return () => {
      cancelAnimationFrame(animId);
      io.disconnect();
      resizeObs.disconnect();
      if (interactive) window.removeEventListener("mousemove", onPointerMove);

      // Dispose Geometries
      bodyGeo.dispose();
      lidGeo.dispose();
      thumbIndentGeo.dispose();
      ringGeo.dispose();
      baseRingGeo.dispose();
      neckGeo.dispose();
      bladeBaseGeo.dispose();
      toothGeo.dispose();
      movingBladeGeo.dispose();
      screwGeo.dispose();
      leverPivotGeo.dispose();
      leverArmGeo.dispose();
      leverKnobGeo.dispose();
      switchBaseGeo.dispose();
      switchToggleGeo.dispose();
      loopGeo.dispose();
      shadowGeo.dispose();

      // Dispose Materials & Textures
      brushedSteel.dispose();
      upperLidMat.dispose();
      lowerBodyMat.dispose();
      violetAccentMat.dispose();
      brassMat.dispose();
      shadowMat.dispose();
      shadowTex.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  if (!hasWebGL) {
    return (
      <div
        className={`hair-clipper-fallback ${className}`}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
          border: "1px solid rgba(10, 10, 12, 0.08)",
          borderRadius: "6px",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(124, 58, 237, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "32px" }}>✂️</span>
        </div>
        <h3
          style={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: "20px",
            fontWeight: 400,
            color: "#0A0A0C",
            margin: "0 0 8px",
          }}
        >
          Máquina de Corte Auto Stilo
        </h3>
        <p
          style={{
            fontFamily: "var(--font-sans), sans-serif",
            fontSize: "13px",
            color: "#4A4A52",
            maxWidth: "280px",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Instrumento de corte profissional com lâminas de titânio, micro-ajuste de altura e precisão milimétrica.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`hair-clipper-container ${className}`}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
      aria-label="Cena 3D interativa da máquina de cortar cabelo profissional Auto Stilo"
      role="img"
    />
  );
});
