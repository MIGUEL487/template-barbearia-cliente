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

    const isMobile = width < 768;
    const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2.0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.90; // Calibrada para estúdio claro sem queimar brancos
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.pointerEvents = "none";
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Calibrated Studio Lighting Rig (Fase 1.2)
    const ambLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.2);
    keyLight.position.set(3.5, 4.5, 3.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.9);
    fillLight.position.set(-3.0, 1.5, 2.5);
    scene.add(fillLight);

    const violetRim = new THREE.DirectionalLight(0xa855f7, 1.6);
    violetRim.position.set(-2.5, -2.5, -2.5);
    scene.add(violetRim);

    const topRim = new THREE.DirectionalLight(0xffffff, 1.2);
    topRim.position.set(1.0, 4.0, -2.5);
    scene.add(topRim);

    // 3. Contact Shadow Plane
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext("2d");
    if (sctx) {
      const grad = sctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, "rgba(10, 10, 14, 0.22)");
      grad.addColorStop(0.35, "rgba(10, 10, 14, 0.07)");
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

    // Pose State — EM PÉ NO HERO (vertical rz = 0.0, lâmina para cima)
    const currentPose = {
      x: isMobile ? 0.35 : 1.25,
      y: isMobile ? 0.20 : 0.05,
      z: 0.50,
      rx: 0.07,  // leve inclinação frontal (4°)
      ry: -0.35, // pose três quartos (-20°)
      rz: 0.0,   // EIXO LONGO PERFEITAMENTE VERTICAL
      scale: isMobile ? 0.65 : 0.95,
      opacity: isMobile ? 0.35 : 0.50,
    };

    const targetPose = { ...currentPose };
    let isDisposed = false;
    let scrollProgress = 0;

    // 5. Load Photoreal GLB with 6 PBR Materials
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
          container.style.opacity = "0.50";
          renderer.render(scene, camera);
          return;
        }

        // 6. Multi-Stage Scroll Timeline Acoplada aos 12 Marcos Reais do DOM
        gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              scrollProgress = p;

              // Reação imediata no primeiro scroll (0 a 40px, p <= 0.04)
              if (p <= 0.08) {
                // Marco 1: Hero -> Início do Scroll (reação rápida com giro angular >= 2° e translação >= 8px)
                const t = p / 0.08;
                targetPose.x = gsap.utils.interpolate(isMobile ? 0.35 : 1.25, isMobile ? 0.15 : 0.85, t);
                targetPose.y = gsap.utils.interpolate(isMobile ? 0.20 : 0.05, isMobile ? 0.12 : 0.0, t);
                targetPose.z = gsap.utils.interpolate(0.50, 0.60, t);
                targetPose.rx = gsap.utils.interpolate(0.07, 0.02, t);
                targetPose.ry = gsap.utils.interpolate(-0.35, -0.15, t); // giro de 0.2 rad (~11.5°)
                targetPose.rz = 0.0;
                targetPose.scale = gsap.utils.interpolate(isMobile ? 0.65 : 0.95, isMobile ? 0.70 : 1.0, t);
                targetPose.opacity = gsap.utils.interpolate(isMobile ? 0.35 : 0.50, 0.80, t);
              } else if (p <= 0.18) {
                // Marco 2: Diretriz da Marca (#assinatura)
                const t = (p - 0.08) / 0.10;
                targetPose.x = gsap.utils.interpolate(isMobile ? 0.15 : 0.85, isMobile ? -0.25 : -1.15, t);
                targetPose.y = gsap.utils.interpolate(isMobile ? 0.12 : 0.0, -0.05, t);
                targetPose.z = gsap.utils.interpolate(0.60, 0.75, t);
                targetPose.rx = gsap.utils.interpolate(0.02, -0.15, t);
                targetPose.ry = gsap.utils.interpolate(-0.15, 0.55, t);
                targetPose.rz = gsap.utils.interpolate(0.0, -0.12, t);
                targetPose.scale = gsap.utils.interpolate(isMobile ? 0.70 : 1.0, isMobile ? 0.78 : 1.08, t);
                targetPose.opacity = gsap.utils.interpolate(0.80, 0.90, t);
              } else if (p <= 0.30) {
                // Marco 3: O Ritual (#ritual, detalhe e macro da lâmina)
                const t = (p - 0.18) / 0.12;
                targetPose.x = gsap.utils.interpolate(isMobile ? -0.25 : -1.15, isMobile ? 0.25 : 0.95, t);
                targetPose.y = gsap.utils.interpolate(-0.05, 0.10, t);
                targetPose.z = gsap.utils.interpolate(0.75, isMobile ? 0.95 : 1.35, t);
                targetPose.rx = gsap.utils.interpolate(-0.15, 0.25, t);
                targetPose.ry = gsap.utils.interpolate(0.55, 1.35, t);
                targetPose.rz = gsap.utils.interpolate(-0.12, -0.18, t);
                targetPose.scale = gsap.utils.interpolate(isMobile ? 0.78 : 1.08, isMobile ? 0.90 : 1.30, t);
                targetPose.opacity = 1.0;
              } else if (p <= 0.45) {
                // Marco 4: Catálogo de Serviços (#servicos, recua para margem direita com opacidade confortável)
                const t = (p - 0.30) / 0.15;
                targetPose.x = gsap.utils.interpolate(isMobile ? 0.25 : 0.95, isMobile ? 0.35 : 1.35, t);
                targetPose.y = gsap.utils.interpolate(0.10, -0.10, t);
                targetPose.z = gsap.utils.interpolate(isMobile ? 0.95 : 1.35, 0.40, t);
                targetPose.rx = gsap.utils.interpolate(0.25, 0.10, t);
                targetPose.ry = gsap.utils.interpolate(1.35, 2.45, t);
                targetPose.rz = gsap.utils.interpolate(-0.18, 0.25, t);
                targetPose.scale = gsap.utils.interpolate(isMobile ? 0.90 : 1.30, isMobile ? 0.60 : 0.75, t);
                targetPose.opacity = gsap.utils.interpolate(1.0, 0.40, t);
              } else if (p <= 0.58) {
                // Marco 5: História & Tradição (#historia)
                const t = (p - 0.45) / 0.13;
                targetPose.x = gsap.utils.interpolate(isMobile ? 0.35 : 1.35, isMobile ? -0.25 : -1.05, t);
                targetPose.y = gsap.utils.interpolate(-0.10, 0.05, t);
                targetPose.z = gsap.utils.interpolate(0.40, 0.65, t);
                targetPose.rx = gsap.utils.interpolate(0.10, -0.12, t);
                targetPose.ry = gsap.utils.interpolate(2.45, 3.15, t);
                targetPose.rz = gsap.utils.interpolate(0.25, 0.15, t);
                targetPose.scale = gsap.utils.interpolate(isMobile ? 0.60 : 0.75, isMobile ? 0.70 : 0.90, t);
                targetPose.opacity = gsap.utils.interpolate(0.40, 0.72, t);
              } else if (p <= 0.70) {
                // Marco 6: O Espaço & Storytelling (#galeria, lateral livre sem sobrepor foto com zoom)
                const t = (p - 0.58) / 0.12;
                targetPose.x = gsap.utils.interpolate(isMobile ? -0.25 : -1.05, isMobile ? 0.30 : 1.20, t);
                targetPose.y = gsap.utils.interpolate(0.05, 0.0, t);
                targetPose.z = gsap.utils.interpolate(0.65, 0.75, t);
                targetPose.rx = gsap.utils.interpolate(-0.12, 0.15, t);
                targetPose.ry = gsap.utils.interpolate(3.15, 3.75, t);
                targetPose.rz = gsap.utils.interpolate(0.15, -0.15, t);
                targetPose.scale = gsap.utils.interpolate(isMobile ? 0.70 : 0.90, isMobile ? 0.75 : 0.95, t);
                targetPose.opacity = gsap.utils.interpolate(0.72, 0.68, t);
              } else if (p <= 0.80) {
                // Marco 7: Player de Vídeo (.films-section)
                const t = (p - 0.70) / 0.10;
                targetPose.x = gsap.utils.interpolate(isMobile ? 0.30 : 1.20, isMobile ? 0.35 : 1.30, t);
                targetPose.y = gsap.utils.interpolate(0.0, -0.15, t);
                targetPose.z = gsap.utils.interpolate(0.75, 0.45, t);
                targetPose.rx = gsap.utils.interpolate(0.15, 0.05, t);
                targetPose.ry = gsap.utils.interpolate(3.75, 4.30, t);
                targetPose.rz = gsap.utils.interpolate(-0.15, 0.10, t);
                targetPose.scale = gsap.utils.interpolate(isMobile ? 0.75 : 0.95, isMobile ? 0.60 : 0.72, t);
                targetPose.opacity = gsap.utils.interpolate(0.68, 0.48, t);
              } else if (p <= 0.92) {
                // Marco 8 & 9: Depoimentos & Como Funciona (.how-editorial, flutua suavemente)
                const t = (p - 0.80) / 0.12;
                targetPose.x = gsap.utils.interpolate(isMobile ? 0.35 : 1.30, isMobile ? -0.20 : -0.95, t);
                targetPose.y = gsap.utils.interpolate(-0.15, 0.0, t);
                targetPose.z = gsap.utils.interpolate(0.45, 0.65, t);
                targetPose.rx = gsap.utils.interpolate(0.05, -0.10, t);
                targetPose.ry = gsap.utils.interpolate(4.30, 5.15, t);
                targetPose.rz = gsap.utils.interpolate(0.10, 0.0, t);
                targetPose.scale = gsap.utils.interpolate(isMobile ? 0.60 : 0.72, isMobile ? 0.70 : 0.88, t);
                targetPose.opacity = gsap.utils.interpolate(0.48, 0.75, t);
              } else if (p <= 0.97) {
                // Marco 10 & 11: Contato & Agendamento Final (aponta para o CTA de conversão)
                const t = (p - 0.92) / 0.05;
                targetPose.x = gsap.utils.interpolate(isMobile ? -0.20 : -0.95, 0.0, t);
                targetPose.y = gsap.utils.interpolate(0.0, -0.15, t);
                targetPose.z = gsap.utils.interpolate(0.65, 0.85, t);
                targetPose.rx = gsap.utils.interpolate(-0.10, 0.25, t);
                targetPose.ry = gsap.utils.interpolate(5.15, 5.80, t);
                targetPose.rz = 0.0;
                targetPose.scale = gsap.utils.interpolate(isMobile ? 0.70 : 0.88, isMobile ? 0.85 : 1.05, t);
                targetPose.opacity = gsap.utils.interpolate(0.75, 0.85, t);
              } else {
                // Marco 12: Saída Suave no Rodapé (últimos 30vh antes do fim da página)
                const t = (p - 0.97) / 0.03;
                targetPose.x = 0.0;
                targetPose.y = gsap.utils.interpolate(-0.15, -0.45, t);
                targetPose.z = gsap.utils.interpolate(0.85, 0.20, t);
                targetPose.rx = 0.25;
                targetPose.ry = 5.80;
                targetPose.rz = 0.0;
                targetPose.scale = gsap.utils.interpolate(isMobile ? 0.85 : 1.05, 0.65, t);
                targetPose.opacity = gsap.utils.interpolate(0.85, 0.0, t);
              }
            },
          },
        });

        ScrollTrigger.refresh();
      },
      undefined,
      (err) => {
        console.error("Erro ao carregar auto-stilo-trimmer.glb:", err);
      }
    );

    // 7. Render Loop com Lerp Suave e Economia de Energia
    const lerpFactor = 0.08;
    const renderLoop = () => {
      if (isDisposed) return;
      if (document.hidden) return;

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
    gsap.ticker.lagSmoothing(0);

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

    // 9. Debug Panel Interface window.__AS3D__ (Fase 8 QA)
    if (typeof window !== "undefined") {
      (window as unknown as { __AS3D__: unknown }).__AS3D__ = {
        getPose: () => ({ ...currentPose }),
        getScreenBBox: () => {
          const box = new THREE.Box3().setFromObject(modelGroup);
          const points = [
            new THREE.Vector3(box.min.x, box.min.y, box.min.z),
            new THREE.Vector3(box.min.x, box.min.y, box.max.z),
            new THREE.Vector3(box.min.x, box.max.y, box.min.z),
            new THREE.Vector3(box.min.x, box.max.y, box.max.z),
            new THREE.Vector3(box.max.x, box.min.y, box.min.z),
            new THREE.Vector3(box.max.x, box.min.y, box.max.z),
            new THREE.Vector3(box.max.x, box.max.y, box.min.z),
            new THREE.Vector3(box.max.x, box.max.y, box.max.z),
          ];
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          points.forEach((p) => {
            p.project(camera);
            const sx = ((p.x + 1) * width) / 2;
            const sy = ((-p.y + 1) * height) / 2;
            if (sx < minX) minX = sx;
            if (sx > maxX) maxX = sx;
            if (sy < minY) minY = sy;
            if (sy > maxY) maxY = sy;
          });
          return {
            x: Math.round(minX),
            y: Math.round(minY),
            width: Math.round(maxX - minX),
            height: Math.round(maxY - minY),
          };
        },
        getMode: () => "webgl",
        info: () => renderer.info,
        getMemoryInfo: () => ({ ...renderer.info.memory }),
        progress: () => scrollProgress,
        materials: () => {
          const mats: { name: string; roughness: number; metalness: number; transparent: boolean }[] = [];
          modelGroup.traverse((c) => {
            if ((c as THREE.Mesh).isMesh && (c as THREE.Mesh).material) {
              const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
              mats.push({
                name: m.name,
                roughness: m.roughness,
                metalness: m.metalness,
                transparent: m.transparent,
              });
            }
          });
          return mats;
        },
      };
    }

    // 10. Full Cleanup on Unmount
    return () => {
      isDisposed = true;
      if (typeof window !== "undefined") {
        delete (window as unknown as { __AS3D__?: unknown }).__AS3D__;
      }
      gsap.ticker.remove(renderLoop);
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === document.body) st.kill();
      });

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
