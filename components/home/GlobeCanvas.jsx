"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

/* Palette sampled from the Figma globe section */
const GLOBE_BODY = "#FAF7F2";

const GLOBE_RADIUS = 4.0;
const GLOBE_URL = "/models/Globe.glb";
/* Arctic-facing view: pole tilted toward the camera so Greenland/Iceland sit
   centre and Mexico→Japan wrap the lower rim, as in the design. */
const TILT = THREE.MathUtils.degToRad(62);
const SPIN_SPEED = 0.08; // rad/s — continuous drift, surface moves rightward
const INITIAL_SPIN = -Math.PI / 3; // start on the Greenland/Atlantic face

/* Drag interaction: horizontal drag spins the globe, vertical drag tilts it.
   Released momentum eases back into the baseline rightward drift. */
const YAW_PER_PX = 0.005; // rad per pixel dragged horizontally
const PITCH_PER_PX = 0.004; // rad per pixel dragged vertically
const MIN_TILT = THREE.MathUtils.degToRad(-80);
const MAX_TILT = THREE.MathUtils.degToRad(85);
const MAX_FLING = 3; // rad/s cap on release momentum
const RETURN_TAU = 0.9; // s — momentum settle time back to the drift

/* Plain globe body — fallback shown only if Globe.glb has no geometry. */
function ProceduralGlobe() {
  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS, 96, 96]} />
      <meshBasicMaterial color={GLOBE_BODY} />
    </mesh>
  );
}

/* Renders Globe.glb centred and normalised to the scene's radius. The map
   artwork (country shapes and names) is baked into the model's texture, and
   the material uses a warm golden tint so continents match the design. */
function GlobeModel() {
  const { scene } = useGLTF(GLOBE_URL);
  const prepared = useMemo(() => {
    let hasMesh = false;
    scene.traverse((object) => {
      if (!object.isMesh) return;
      hasMesh = true;
      if (object.material && object.material.map) {
        const map = object.material.map;
        map.anisotropy = 16; // Maximize crispness of text at oblique angles
        map.generateMipmaps = true;
        map.minFilter = THREE.LinearMipMapLinearFilter;
        map.magFilter = THREE.LinearFilter;
        map.colorSpace = THREE.SRGBColorSpace;
        object.material = new THREE.MeshBasicMaterial({
          map,
          color: new THREE.Color("#EAD6B5"),
        });
      }
    });
    if (!hasMesh) return null;
    const sphere = new THREE.Box3()
      .setFromObject(scene)
      .getBoundingSphere(new THREE.Sphere());
    return {
      scale: sphere.radius > 0 ? GLOBE_RADIUS / sphere.radius : 1,
      offset: sphere.center.clone().negate(),
    };
  }, [scene]);

  if (!prepared) return <ProceduralGlobe />;
  return (
    <group scale={prepared.scale}>
      <primitive object={scene} position={prepared.offset.toArray()} />
    </group>
  );
}

function GlobeScene() {
  const spinRef = useRef(null);
  const tiltRef = useRef(null);
  const drag = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    velocity: SPIN_SPEED,
  });
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const el = gl.domElement;
    const d = drag.current;
    /* pan-y keeps vertical touch scrolling alive over the section; horizontal
       touch gestures (and any mouse drag) rotate the globe instead. */
    el.style.touchAction = "pan-y";
    el.style.cursor = "grab";

    const onDown = (e) => {
      if (!e.isPrimary) return;
      d.active = true;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      d.lastT = performance.now();
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };

    const onMove = (e) => {
      if (!d.active || !e.isPrimary) return;
      const dx = e.clientX - d.lastX;
      const dy = e.clientY - d.lastY;
      const now = performance.now();
      const dt = (now - d.lastT) / 1000;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      d.lastT = now;

      const yaw = dx * YAW_PER_PX;
      if (spinRef.current) spinRef.current.rotation.y += yaw;
      if (tiltRef.current) {
        tiltRef.current.rotation.x = THREE.MathUtils.clamp(
          tiltRef.current.rotation.x + dy * PITCH_PER_PX,
          MIN_TILT,
          MAX_TILT,
        );
      }
      /* Smoothed instantaneous yaw velocity, kept for release momentum. */
      if (dt > 0) d.velocity = 0.8 * (yaw / dt) + 0.2 * d.velocity;
    };

    const onUp = () => {
      if (!d.active) return;
      d.active = false;
      d.velocity = THREE.MathUtils.clamp(d.velocity, -MAX_FLING, MAX_FLING);
      el.style.cursor = "grab";
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const d = drag.current;
    if (d.active || !spinRef.current) return;
    /* Clamped because the first frame after the canvas resumes from
       frameloop="never" carries the whole paused interval as its delta, which
       would snap the globe forward by however long it was off screen. */
    const dt = Math.min(delta, 1 / 30);
    /* Ease momentum back to the baseline drift, then keep drifting right. */
    d.velocity += (SPIN_SPEED - d.velocity) * (1 - Math.exp(-dt / RETURN_TAU));
    spinRef.current.rotation.y += d.velocity * dt;
  });

  return (
    <group ref={tiltRef} position={[0, -1.09, 0]} rotation={[TILT, 0, 0]}>
      <group ref={spinRef} rotation={[0, INITIAL_SPIN, 0]}>
        <GlobeModel />
      </group>
      <ambientLight intensity={1.2} />
    </group>
  );
}

export default function GlobeCanvas() {
  const wrapRef = useRef(null);
  const [onScreen, setOnScreen] = useState(false);

  /* R3F renders every frame by default, so without this the globe keeps doing
     a full antialiased WebGL draw at up to 2x DPR for the whole life of the
     page — including the long stretches when it is nowhere near the viewport.
     That competes for frame budget with everything else on the page, the
     marquees included. rootMargin resumes it just before it scrolls in, so the
     globe is already turning by the time it appears. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas
        flat
        frameloop={onScreen ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ fov: 40, near: 0.1, far: 100, position: [0, 0, 4.2] }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <GlobeScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(GLOBE_URL);
