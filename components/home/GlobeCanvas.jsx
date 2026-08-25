"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
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
const SILHOUETTE_WIDTH_RATIO = 0.74; // sphere diameter ÷ canvas width
const APEX_OFFSET_RATIO = 0.065; // apex below canvas top, ÷ sphere radius

/* Opening orientation. The tilt sets which latitude band fills the visible
   cap; the spin picks the meridian it opens on — the apex of the cap sits on
   spin + 180, so 270 brings Asia up first. */
const TILT_DEG = 62;
const SPIN_DEG = 270;
const SPIN_SPEED = 0.075; // rad/s — idle drift when nobody is dragging

/* Palette sampled from the Figma globe frame: the cream the oceans read as,
   and the tan the landmasses are filled with. The shell's own baked material
   is a different tan, so it is overridden rather than reused. */
const BODY_COLOR = "#F3E8D9";
const CONTINENT_COLOR = "#EAD6B4";

/* Pins sit in the same warm family as the map — the continent tan taken down
   in lightness rather than a foreign accent hue, so they read as part of the
   globe while staying legible against both the tan land and the cream ocean. */
const PIN_COLOR = "#A87C46";
const PIN_PING = "rgba(168, 124, 70, 0.32)";
const PIN_HALO = "rgba(168, 124, 70, 0.16)";

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
      object.material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(CONTINENT_COLOR),
        side: THREE.FrontSide,
      });
      object.renderOrder = 1;
    });
    return root;
  }, [scene]);

  return <primitive object={prepared} scale={GLOBE_RADIUS / SHELL_WORLD_RADIUS} />;
}

/* Drag interaction. The globe carries a single orientation quaternion instead
   of a tilt/spin pair, and a drag applies a rotation about the camera's own up
   and right axes — so it turns whichever way the pointer moves, from any
   orientation, with nothing to clamp and no pole to gimbal-lock against.
   Momentum from the release decays back into the idle drift. */
const YAW_PER_PX = 0.003; // rad per pixel dragged horizontally
const PITCH_PER_PX = 0.003; // rad per pixel dragged vertically
const MAX_FLING = 2.5; // rad/s cap on release momentum
const RETURN_TAU = 0.9; // s — time constant decaying that momentum away

/* Attaches drag handling to the canvas element. Kept on the DOM node rather
   than on R3F's pointer events because the globe should stay draggable from
   anywhere in the section, including the empty sky above the horizon. */
function useDragRotation(globeRef) {
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  /* `velocity` is a world-space angular velocity: direction is the axis,
     magnitude is rad/s. That is what makes a flick in any direction keep
     going in that direction. */
  const drag = useRef({
    active: false,
    x: 0,
    y: 0,
    velocity: new THREE.Vector3(),
  });

  useEffect(() => {
    const el = gl.domElement;
    const d = drag.current;
    const axis = new THREE.Vector3();
    const step = new THREE.Quaternion();

    /* pan-y keeps vertical touch scrolling working over the section; only
       horizontal touch gestures (and any mouse drag) reach the globe. */
    el.style.touchAction = "pan-y";
    el.style.cursor = "grab";

    const onDown = (event) => {
      if (!event.isPrimary) return;
      d.active = true;
      d.x = event.clientX;
      d.y = event.clientY;
      d.velocity.set(0, 0, 0);
      el.setPointerCapture(event.pointerId);
      el.style.cursor = "grabbing";
    };

    const onMove = (event) => {
      if (!d.active || !event.isPrimary || !globeRef.current) return;
      const dx = event.clientX - d.x;
      const dy = event.clientY - d.y;
      d.x = event.clientX;
      d.y = event.clientY;

      /* Camera basis, so the gesture reads the same however the globe is
         already turned: drag right rotates about the screen's vertical axis,
         drag down about its horizontal one. */
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);

      axis
        .copy(up)
        .multiplyScalar(dx * YAW_PER_PX)
        .addScaledVector(right, dy * PITCH_PER_PX);
      const angle = axis.length();
      if (angle < 1e-6) return;

      step.setFromAxisAngle(axis.normalize(), angle);
      /* Pre-multiplied: the rotation happens in world space, not in the
         globe's already-rotated local frame. */
      globeRef.current.quaternion.premultiply(step);

      /* Keep the gesture's axis and rate for release momentum. Scaled by a
         nominal frame time rather than measured dt, which stays steady when
         pointer events batch unevenly. */
      d.velocity.copy(axis).multiplyScalar(angle * 60);
    };

    const onUp = (event) => {
      if (!d.active) return;
      d.active = false;
      if (d.velocity.length() > MAX_FLING) d.velocity.setLength(MAX_FLING);
      el.releasePointerCapture?.(event.pointerId);
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
  }, [gl, camera, globeRef]);

  return drag;
}

function GlobeScene({ tilt, spin, spinSpeed, labelNodes, pinNodes, driftPaused }) {
  useDesignFraming();
  const globeRef = useRef(null);
  const drag = useDragRotation(globeRef);

  /* The design's opening view, as one quaternion: tilt about world X applied
     after a spin about the globe's own polar axis. */
  const initialQuaternion = useMemo(
    () =>
      new THREE.Quaternion()
        .setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(tilt))
        .multiply(
          new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            THREE.MathUtils.degToRad(spin),
          ),
        ),
    [tilt, spin],
  );

  const scratch = useMemo(
    () => ({ axis: new THREE.Vector3(), step: new THREE.Quaternion() }),
    [],
  );

  useFrame((_, delta) => {
    const d = drag.current;
    const globe = globeRef.current;
    if (d.active || !globe) return;

    /* Clamped: the first frame after frameloop resumes carries the whole
       paused interval as its delta, which would snap the globe forward by
       however long the section was off screen. */
    const dt = Math.min(delta, 1 / 30);
    const { axis, step } = scratch;

    /* Leftover fling, decaying to nothing. */
    const speed = d.velocity.length();
    if (speed > 1e-4) {
      step.setFromAxisAngle(axis.copy(d.velocity).normalize(), speed * dt);
      globe.quaternion.premultiply(step);
      d.velocity.multiplyScalar(Math.exp(-dt / RETURN_TAU));
    }

    /* Idle drift. Taken about the world's vertical axis — pre-multiplied, not
       globe.rotateY, which turns about the globe's own polar axis. The design
       tilts that axis 62° toward the camera and frames the cap around it, so a
       polar spin traces small circles there and reads as vertical drift. About
       the screen's vertical the surface always travels left to right.

       Held still while a destination pin is hovered or focused, so the pin
       does not slide out from under the pointer as you go to click it. Read
       from a ref rather than state: this runs every frame, and re-rendering
       the whole canvas tree on hover would be wasteful. */
    if (spinSpeed && !driftPaused.current) {
      step.setFromAxisAngle(axis.set(0, 1, 0), spinSpeed * dt);
      globe.quaternion.premultiply(step);
    }
  });

  return (
    <group ref={globeRef} quaternion={initialQuaternion}>
      <GlobeBody />
      <Continents />
      <PinnedAnchors points={LABELS} nodes={labelNodes} />
      <PinnedAnchors points={DESTINATIONS} nodes={pinNodes} />
    </group>
  );
}

/* Continent labels. The GLB carries no type, so these are DOM text nodes pinned
   to points on the sphere: an empty Object3D per label rides inside the
   spinning group, and every frame its world position is projected to canvas
   pixels and written straight to the node's transform. Keeping the text in the
   DOM means it renders at device resolution in the site's own font, upright
   whatever the globe is doing — which is how the design draws it. */
/* Destinations pinned on the globe. Slugs match the cards in
   DestinationsSection, so the globe never links anywhere the rest of the page
   does not — /destinations/[slug] sets dynamicParams=false and 404s on
   anything the CMS has no entry for. */
const DESTINATIONS = [
  { name: "Japan", href: "/destinations/japan", lat: 36.2, lon: 138.25 },
  { name: "Switzerland", href: "/destinations/switzerland", lat: 46.8, lon: 8.2 },
  { name: "India", href: "/destinations/india", lat: 22, lon: 79 },
  { name: "Norway", href: "/destinations/norway", lat: 62, lon: 9 },
];

const LABELS = [
  { name: "North America", lat: 46, lon: -100 },
  { name: "South America", lat: -15, lon: -60 },
  { name: "Europe", lat: 52, lon: 15 },
  { name: "Africa", lat: 2, lon: 20 },
  { name: "Asia", lat: 45, lon: 90 },
  { name: "Australia", lat: -25, lon: 134 },
  { name: "Antarctica", lat: -82, lon: 0 },
];

/* Longitude runs anticlockwise about +Y in this model's baked frame, so the
   sine term is negated; lon 0 faces +Z. Verified against the coastlines. */
function positionFromLatLon(lat, lon, radius) {
  const phi = THREE.MathUtils.degToRad(lat);
  const theta = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    -radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.cos(theta),
  );
}

/* Where a label fades out, measured as the surface normal's dot with the view
   direction — 1 facing the camera, 0 exactly on the limb. The design crops to
   the arctic cap, so everything on screen is already close to the limb; these
   sit low enough that labels stay solid across the visible band and only
   dissolve in the last few degrees before they turn away. */
const LABEL_FADE_START = 0.05;
const LABEL_FADE_END = 0.005;

/* Projects a list of lat/lon points onto their DOM nodes every frame. Used for
   both the continent labels and the destination pins — they differ only in what
   is rendered at the projected point. Nodes hidden past the limb are given
   visibility:hidden as well as opacity:0, which also takes the pins out of
   hit-testing so the far side of the globe is never clickable. */
function PinnedAnchors({ points, nodes }) {
  const anchors = useRef([]);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const scratch = useMemo(
    () => ({
      world: new THREE.Vector3(),
      normal: new THREE.Vector3(),
      toCamera: new THREE.Vector3(),
    }),
    [],
  );

  useFrame(() => {
    const { world, normal, toCamera } = scratch;

    anchors.current.forEach((object, index) => {
      const node = nodes.current[index];
      if (!object || !node) return;

      object.getWorldPosition(world);
      /* The globe is centred on the origin, so a point's surface normal is
         just its normalised world position — no matrix inversion needed. */
      normal.copy(world).normalize();
      toCamera.copy(camera.position).sub(world).normalize();
      const facing = normal.dot(toCamera);

      if (facing <= LABEL_FADE_END) {
        node.style.opacity = "0";
        node.style.visibility = "hidden";
        return;
      }

      world.project(camera);
      const x = (world.x * 0.5 + 0.5) * size.width;
      const y = (-world.y * 0.5 + 0.5) * size.height;

      node.style.visibility = "visible";
      node.style.opacity = String(
        THREE.MathUtils.smoothstep(facing, LABEL_FADE_END, LABEL_FADE_START),
      );
      node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    });
  });

  /* Real scene children, so the globe's tilt and spin carry them along. */
  return points.map((point, index) => (
    <object3D
      key={point.name}
      ref={(object) => {
        anchors.current[index] = object;
      }}
      position={positionFromLatLon(point.lat, point.lon, GLOBE_RADIUS)}
    />
  ));
}

export default function GlobeCanvas({
  tilt = TILT_DEG,
  spin = SPIN_DEG,
  spinSpeed = SPIN_SPEED,
}) {
  const wrapRef = useRef(null);
  const labelNodes = useRef([]);
  const pinNodes = useRef([]);
  const driftPaused = useRef(false);
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
    <div ref={wrapRef} className="relative h-full w-full">
      <Canvas
        flat
        frameloop={onScreen ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ fov: FOV }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <GlobeScene
            tilt={tilt}
            spin={spin}
            spinSpeed={spinSpeed}
            labelNodes={labelNodes}
            pinNodes={pinNodes}
            driftPaused={driftPaused}
          />
        </Suspense>
      </Canvas>

      {/* Label layer. aria-hidden because the globe is decorative — the same
          places are reachable as real links elsewhere in the section — and
          pointer-events stay off so labels never break a drag. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {LABELS.map((label, index) => (
          <span
            key={label.name}
            ref={(node) => {
              labelNodes.current[index] = node;
            }}
            className="absolute left-0 top-0 whitespace-nowrap font-top text-black"
            style={{
              visibility: "hidden",
              willChange: "transform",
              /* Scales with the section rather than stepping at breakpoints,
                 because the globe itself is sized as a fraction of the canvas
                 width — a fixed size would read huge on a phone and small on a
                 wide desktop. The bounds keep it legible at both ends. */
              fontSize: "clamp(11px, 1.3vw, 20px)",
              /* Between light and regular; variable faces honour it exactly and
                 static ones round to the nearer weight they ship. */
              fontWeight: 350,
            }}
          >
            {label.name}
          </span>
        ))}
      </div>

      {/* Destination pins. Real links rather than canvas hit-testing, so they
          are keyboard reachable and announced, and a click navigates natively.
          The layer itself stays pointer-events-none and only the dots opt back
          in — a full-size interactive layer would swallow every drag. The dots
          are small enough that the globe is still grabbable all around them. */}
      {/* enter/leave rather than over/out: they fire once for the whole
          subtree, so moving between a dot's halo and its label — or straight
          from one pin to another — does not flicker the drift back on. The
          layer is pointer-events-none, but events from the dots still bubble
          through it, so one pair of handlers here covers every pin. */}
      <nav
        aria-label="Destinations on the globe"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        onPointerEnter={() => {
          driftPaused.current = true;
        }}
        onPointerLeave={() => {
          driftPaused.current = false;
        }}
        onFocus={() => {
          driftPaused.current = true;
        }}
        onBlur={() => {
          driftPaused.current = false;
        }}
      >
        {DESTINATIONS.map((destination, index) => (
          <span
            key={destination.href}
            ref={(node) => {
              pinNodes.current[index] = node;
            }}
            className="absolute left-0 top-0"
            style={{ visibility: "hidden", willChange: "transform" }}
          >
            <Link
              href={destination.href}
              className="group pointer-events-auto relative grid h-7 w-7 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: PIN_COLOR }}
            >
              {/* Radar ping. Runs continuously so the pins read as live rather
                  than as static map dots, staggered per pin so the four never
                  pulse in lockstep. Transform/opacity only, so it stays off the
                  main thread and costs nothing next to the WebGL draw. */}
              <span
                aria-hidden="true"
                className="absolute h-3.5 w-3.5 animate-ping rounded-full"
                style={{
                  backgroundColor: PIN_PING,
                  animationDelay: `${index * 700}ms`,
                  animationDuration: "2.4s",
                }}
              />
              {/* Soft disc that blooms under the dot on approach. */}
              <span
                aria-hidden="true"
                className="absolute h-7 w-7 scale-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-100 group-focus-visible:scale-100"
                style={{ backgroundColor: PIN_HALO }}
              />
              <span
                aria-hidden="true"
                className="relative h-[8px] w-[8px] rounded-full shadow-[0_0_0_2px_rgba(255,255,255,0.9)] transition-transform duration-300 ease-out group-hover:scale-[1.6] group-focus-visible:scale-[1.6]"
                style={{ backgroundColor: PIN_COLOR }}
              />
              {/* Name, rising into place on hover. aria-hidden because the link
                  already carries it as its accessible name, and pointer-events
                  stay off so the pill never catches the cursor. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full bg-white/85 px-2.5 py-1 font-top text-navy opacity-0 shadow-[0_2px_10px_rgba(31,41,55,0.12)] backdrop-blur-sm transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                style={{ fontSize: "clamp(11px, 1.1vw, 16px)", fontWeight: 400 }}
              >
                {destination.name}
              </span>
              <span className="sr-only">{destination.name}</span>
            </Link>
          </span>
        ))}
      </nav>
    </div>
  );
}

useGLTF.preload(SHELL_URL);
