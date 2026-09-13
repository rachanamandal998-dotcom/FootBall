import { useEffect, useRef } from "react";

export default function Football3D({ className = "w-52 h-52" }) {
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer;
    let frame;
    let disposed = false;

    (async () => {
      try {
        const THREE = await import("three");
        if (disposed) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
        camera.position.z = 3.2;
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(el.clientWidth, el.clientHeight);
        el.innerHTML = "";
        el.appendChild(renderer.domElement);

        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#f4f1e8";
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = "#111";
        ctx.lineWidth = 10;
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.arc(256, 256, 40 + i * 28, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = "#111";
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(256, 256);
          ctx.arc(256, 256, 90, a, a + 0.35);
          ctx.closePath();
          ctx.fill();
        }
        const tex = new THREE.CanvasTexture(canvas);
        const geo = new THREE.SphereGeometry(1, 48, 48);
        const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45, metalness: 0.08 });
        const ball = new THREE.Mesh(geo, mat);
        scene.add(ball);
        scene.add(new THREE.AmbientLight(0xffffff, 0.85));
        const key = new THREE.DirectionalLight(0xffe6a8, 1.1);
        key.position.set(2, 2, 3);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0x7dcea0, 0.5);
        fill.position.set(-2, -1, 2);
        scene.add(fill);

        const spin = reduce ? 0 : 0.008;
        const loop = () => {
          ball.rotation.y += spin;
          ball.rotation.x = 0.25;
          renderer.render(scene, camera);
          frame = requestAnimationFrame(loop);
        };
        loop();
      } catch {
        el.innerHTML =
          '<div class="w-full h-full rounded-full border-4 border-[#C7A344] bg-[conic-gradient(from_140deg,#C7A344_0deg_60deg,#F5F2E8_60deg_120deg,#0E3B2E_120deg_180deg,#C7A344_180deg_240deg,#F5F2E8_240deg_300deg,#0E3B2E_300deg_360deg)]"></div>';
      }
    })();

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      renderer?.dispose?.();
    };
  }, []);

  return <div ref={host} className={`float-ball ${className}`} />;
}
