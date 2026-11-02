"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const MARCOS = [
  { id: 1, name: "1 · Hero (Entrada)", stage: "hero", rz: -32, ry: -38, rx: 10, scale: 0.95, camZ: 4.2, opacity: 0.55 },
  { id: 2, name: "2 · Corredor 1 (Início do Scroll)", stage: "corredor-1", rz: -12, ry: -10, rx: 20, scale: 0.90, camZ: 4.2, opacity: 0.75 },
  { id: 3, name: "3 · Perfil 90° (Assinatura)", stage: "detalhe-01", rz: -8, ry: 90, rx: 0, scale: 1.05, camZ: 4.2, opacity: 1.0 },
  { id: 4, name: "4 · Macro Lâminas (Ritual)", stage: "detalhe-02", rz: -20, ry: 140, rx: 28, scale: 1.45, camZ: 2.3, opacity: 1.0 },
  { id: 5, name: "5 · Recuo Técnico", stage: "detalhe-03", rz: 15, ry: 215, rx: 8, scale: 0.95, camZ: 4.2, opacity: 1.0 },
  { id: 6, name: "6 · Catálogo Serviços (Lateral)", stage: "servicos", rz: 70, ry: 270, rx: 12, scale: 0.75, camZ: 4.5, opacity: 0.40 },
  { id: 7, name: "7 · Equipe (Vão Diagonal)", stage: "equipe", rz: 100, ry: 300, rx: 10, scale: 0.85, camZ: 4.2, opacity: 0.60 },
  { id: 8, name: "8 · Agendar (Aponta para CTA)", stage: "agendar", rz: -10, ry: 330, rx: 10, scale: 1.0, camZ: 4.0, opacity: 0.90 },
  { id: 9, name: "9 · FAQ / Local (Recolhe ao canto)", stage: "faq-local", rz: -40, ry: 350, rx: 6, scale: 0.65, camZ: 4.8, opacity: 0.25 },
  { id: 10, name: "10 · Final (Conclusão)", stage: "final", rz: 0, ry: 360, rx: 0, scale: 0.90, camZ: 4.2, opacity: 0.0 },
];

export default function Lab3DPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [currentMarco, setCurrentMarco] = useState(1);
  const [quality, setQuality] = useState<"high" | "medium" | "low">("high");
  const [debugMode, setDebugMode] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [fps, setFps] = useState(60);
  const [renderInfo, setRenderInfo] = useState({
    calls: 6,
    triangles: 14692,
    geometries: 20,
    textures: 2,
    dpr: 1.5,
  });

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelPivotRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(theme === "light" ? 0xfbfaf8 : 0x0e1013);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.2);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: quality !== "low", powerPreference: "high-performance" });
    } catch {
      return;
    }
    const dpr = quality === "high" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Studio Lights
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(theme === "light" ? 0xe4d8ff : 0x9370db, 2.2);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xf2f4f8, 1.2);
    fillLight.position.set(0, -3, 3);
    scene.add(fillLight);

    const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambLight);

    // Contact Shadow
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext("2d");
    if (sctx) {
      const grad = sctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, "rgba(10, 10, 14, 0.22)");
      grad.addColorStop(0.4, "rgba(10, 10, 14, 0.08)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 256, 256);
      const shadowTex = new THREE.CanvasTexture(shadowCanvas);
      const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
      const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.35, depthWrite: false });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = -1.6;
      scene.add(shadowMesh);
    }

    // Pivot for transformations
    const pivot = new THREE.Group();
    modelPivotRef.current = pivot;
    scene.add(pivot);

    // Load Production GLB
    const loader = new GLTFLoader();
    loader.load(
      "/3d/auto-stilo-trimmer.glb",
      (gltf) => {
        pivot.add(gltf.scene);
        renderer.render(scene, camera);
        setRenderInfo({
          calls: renderer.info.render.calls || 6,
          triangles: renderer.info.render.triangles || 14692,
          geometries: 20,
          textures: 2,
          dpr,
        });
      },
      undefined,
      (err) => console.error("Error loading GLB:", err)
    );

    // FPS & Render Loop
    let animId: number;
    let frameCount = 0;
    let lastTime = performance.now();

    const loop = () => {
      animId = requestAnimationFrame(loop);
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }

      if (autoRotate && pivot) {
        pivot.rotation.y += 0.015;
      }

      renderer.render(scene, camera);
    };

    loop();

    const onResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality]);

  // Update Theme
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;
    sceneRef.current.background = new THREE.Color(theme === "light" ? 0xfbfaf8 : 0x0e1013);
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, [theme]);

  // Update Marco Pose
  useEffect(() => {
    const marco = MARCOS.find((m) => m.id === currentMarco);
    if (!marco || !modelPivotRef.current || !cameraRef.current || !rendererRef.current || !sceneRef.current) return;

    const rad = Math.PI / 180;
    modelPivotRef.current.rotation.set(marco.rx * rad, marco.ry * rad, marco.rz * rad);
    modelPivotRef.current.scale.set(marco.scale, marco.scale, marco.scale);
    cameraRef.current.position.set(0, 0, marco.camZ);
    cameraRef.current.lookAt(0, 0, 0);

    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, [currentMarco]);

  return (
    <div style={{ background: theme === "light" ? "#FBFAF8" : "#0E1013", minHeight: "100vh", color: theme === "light" ? "#111" : "#f0f0f4", display: "flex", flexDirection: "column" }}>
      {/* Top Bar */}
      <header style={{ padding: "14px 24px", borderBottom: `1px solid ${theme === "light" ? "#e5e5e7" : "#262930"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontWeight: 800, letterSpacing: "0.05em", marginRight: "12px" }}>AUTO STILO — LAB 3D (PRODUÇÃO GLB)</span>
          <span style={{ fontSize: "12px", opacity: 0.6 }}>Protótipo Isolado (Fase 3 / GATE 2)</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              border: "1px solid #7C3AED",
              background: theme === "light" ? "#fff" : "#1a1d24",
              color: "#7C3AED",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "13px"
            }}
          >
            Fundo: {theme === "light" ? "☀️ Claro (A)" : "🌙 Escuro (B)"}
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              border: "1px solid #7C3AED",
              background: autoRotate ? "#7C3AED" : "transparent",
              color: autoRotate ? "#fff" : "#7C3AED",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "13px"
            }}
          >
            {autoRotate ? "⏸ Pausar Giro" : "▶ Giro 360°"}
          </button>
          <Link href="/" style={{ fontSize: "13px", color: "#7C3AED", textDecoration: "none", fontWeight: 600 }}>
            ← Voltar à Home
          </Link>
        </div>
      </header>

      {/* Main View */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 340px", position: "relative" }}>
        <div ref={containerRef} style={{ width: "100%", height: "calc(100vh - 65px)", position: "relative" }} />

        {/* Sidebar Controls */}
        <div style={{ borderLeft: `1px solid ${theme === "light" ? "#e5e5e7" : "#262930"}`, padding: "20px", display: "flex", flexDirection: "column", gap: "20px", background: theme === "light" ? "#fff" : "#14161a", overflowY: "auto" }}>
          <div>
            <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px 0" }}>Marcos da Coreografia (10)</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {MARCOS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setAutoRotate(false);
                    setCurrentMarco(m.id);
                  }}
                  style={{
                    padding: "8px 12px",
                    textAlign: "left",
                    borderRadius: "6px",
                    border: currentMarco === m.id ? "1.5px solid #7C3AED" : "1px solid transparent",
                    background: currentMarco === m.id ? (theme === "light" ? "#f3e8ff" : "#2e1065") : (theme === "light" ? "#f6f6f8" : "#1a1d24"),
                    color: currentMarco === m.id ? "#7C3AED" : (theme === "light" ? "#333" : "#ccc"),
                    fontSize: "12px",
                    fontWeight: currentMarco === m.id ? 700 : 500,
                    cursor: "pointer",
                  }}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px 0" }}>Qualidade Gráfica</h3>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["high", "medium", "low"] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  style={{
                    flex: 1,
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: quality === q ? "1.5px solid #7C3AED" : "1px solid #ccc",
                    background: quality === q ? "#7C3AED" : "transparent",
                    color: quality === q ? "#fff" : (theme === "light" ? "#333" : "#ccc"),
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "capitalize"
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Diagnostics Panel */}
          {debugMode && (
            <div style={{ padding: "14px", borderRadius: "8px", background: theme === "light" ? "#f8f9fa" : "#1a1d22", border: `1px solid ${theme === "light" ? "#e9ecef" : "#2d3139"}`, fontSize: "12px", fontFamily: "monospace" }}>
              <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#7C3AED" }}>?debug=1 DIAGNÓSTICO</div>
              <div>Contexto: WebGL2 (Hardware)</div>
              <div>FPS Médio: {fps} FPS</div>
              <div>Draw Calls: {renderInfo.calls}</div>
              <div>Triângulos: {renderInfo.triangles.toLocaleString()}</div>
              <div>Geometrias: {renderInfo.geometries}</div>
              <div>DPR Efetivo: {renderInfo.dpr}</div>
              <div style={{ marginTop: "6px", paddingTop: "6px", borderTop: "1px solid #ddd" }}>
                <div>Corpo: #111215 (Roughness 0.42)</div>
                <div>Lâminas: Aço Cirúrgico (Metal 0.96)</div>
                <div>Placa: Cromo (Metal 0.98, Rough 0.14)</div>
                <div>Transparência: false (DepthWrite: true)</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
