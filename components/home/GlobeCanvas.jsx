"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

/* The GLB is a continents-only shell — a thin extruded landmass crust with no
   ocean body and no country labels. The cream sphere it sits on is drawn here
   as geometry, sized to the shell so no gap shows along the coastlines.

   Both GLBs in public/models ship byte-identical geometry and differ only in
   material, so only the coloured one is loaded. The spaces in the filename are
   percent-encoded because useGLTF keys its cache on the raw URL string. */
const SHELL_URL = "/models/globe%20with%20texture%201.glb";

/* Least-squares sphere fit over the shell's 7512 vertices, measured AFTER the
   glTF node transform (-90° about X, uniform 0.5162, small translation). That
   transform already lands the shell's centre on the origin, so only the radius
   is needed to normalise it. */
const SHELL_WORLD_RADIUS = 0.4733;
/* The crust's inner face sits at 0.9992 of the fit radius; the body tucks
   further in than that. Coincident surfaces z-fight, and a tessellated sphere's
   chords cut inside its nominal radius, so the two would interleave. */
const BODY_RADIUS_RATIO = 0.995;

/* Scene-space radius every other measurement here is expressed in. */
const GLOBE_RADIUS = 4;

/* Framing, read off the Figma frame: the sphere is a shade wider than the
   section and sits almost entirely below it, so only the arctic cap shows.
   Both are ratios rather than pixels, so the crop survives every breakpoint. */
const FOV = 30;
const SILHOUETTE_WIDTH_RATIO = 1.05; // sphere diameter ÷ canvas width
const APEX_OFFSET_RATIO = 0.065; // apex below canvas top, ÷ sphere radius

/* Orientation. The tilt brings the arctic latitudes to the centre of frame and
   the spin turns Greenland to face the camera, matching the design's view. */
const TILT_DEG = 62;
const SPIN_DEG = 130;
const SPIN_SPEED = 0.04; // rad/s — slow continuous drift

/* Palette sampled from the Figma globe frame. The continents keep the tan the
   model was authored with; this is the cream the oceans read as. */
const BODY_COLOR = "#FBF4E9";

/* Places the camera and the globe so the silhouette lands on the design's crop
   whatever the canvas measures. Perspective is accounted for exactly: the
   silhouette of a sphere subtends asin(R/d), not atan(R/d). */
function useDesignFraming() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useLayoutEffect(() => {
    const { width, height } = size;
    if (!width || !height) return undefined;

    const halfFovY = THREE.MathUtils.degToRad(FOV) / 2;
    const tanHalfFovX = Math.tan(halfFovY) * (width / height);

    /* Distance at which the silhouette is exactly the target fraction wide. */
    const halfAngle = Math.atan(SILHOUETTE_WIDTH_RATIO * tanHalfFovX);
    const distance = GLOBE_RADIUS / Math.sin(halfAngle);

    camera.position.set(0, 0, distance);
    camera.near = Math.max(0.01, distance - GLOBE_RADIUS * 2);
    camera.far = distance + GLOBE_RADIUS * 2;

    /* With the globe on the camera axis its silhouette is a circle centred in
       frame, so cropping to the design is a pure pixel translation — which is
       what offsetting the frustum does. Sliding the globe in world space would
       not: an off-axis sphere silhouettes as an ellipse whose centre is not
       the projection of the sphere's centre, so the apex would drift. */
    const radiusPx = (SILHOUETTE_WIDTH_RATIO * width) / 2;
    const centrePx = radiusPx * (1 + APEX_OFFSET_RATIO);
    camera.setViewOffset(width, height, 0, height / 2 - centrePx, width, height);
    camera.updateProjectionMatrix();

    return () => {
      camera.clearViewOffset();
      camera.updateProjectionMatrix();
    };
  }, [camera, size]);
}

function GlobeBody() {
  return (
    <mesh renderOrder={0}>
      <sphereGeometry args={[GLOBE_RADIUS * BODY_RADIUS_RATIO, 160, 160]} />
      <meshBasicMaterial color={BODY_COLOR} />
    </mesh>
  );
}

/* Continents. The lit materials the model ships with are swapped for unlit
   ones so the globe reads as the flat illustration the design calls for —
   which also means the scene needs no lights at all. */
function Continents() {
  const { scene } = useGLTF(SHELL_URL);

  const prepared = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((object) => {
      if (!object.isMesh) return;
      const source = object.material;
      object.material = new THREE.MeshBasicMaterial({
        color: source?.color?.clone() ?? new THREE.Color("#D9BE9A"),
        side: THREE.FrontSide,
      });
      object.renderOrder = 1;
    });
    return root;
  }, [scene]);

  return <primitive object={prepared} scale={GLOBE_RADIUS / SHELL_WORLD_RADIUS} />;
}

function GlobeScene({ tilt, spin, spinSpeed }) {
  useDesignFraming();
  const spinRef = useRef(null);

  useFrame((_, delta) => {
    if (!spinRef.current) return;
    /* Clamped: the first frame after frameloop resumes carries the whole
       paused interval as its delta, which would snap the globe forward by
       however long the section was off screen. */
    spinRef.current.rotation.y += spinSpeed * Math.min(delta, 1 / 30);
  });

  return (
    <group rotation={[THREE.MathUtils.degToRad(tilt), 0, 0]}>
      <group ref={spinRef} rotation={[0, THREE.MathUtils.degToRad(spin), 0]}>
        <GlobeBody />
        <Continents />
      </group>
    </group>
  );
}

export default function GlobeCanvas({
  tilt = TILT_DEG,
  spin = SPIN_DEG,
  spinSpeed = SPIN_SPEED,
}) {
  const wrapRef = useRef(null);
  const [onScreen, setOnScreen] = useState(false);

  /* R3F draws every frame by default. Without this gate the globe keeps doing
     a full antialiased WebGL pass at up to 2x DPR for the whole life of the
     page, including the long stretches when it is nowhere near the viewport.
     rootMargin resumes it just before it scrolls into view. */
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
        camera={{ fov: FOV }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <GlobeScene tilt={tilt} spin={spin} spinSpeed={spinSpeed} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(SHELL_URL);
