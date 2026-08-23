'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/**
 * ============================================================
 * AGUJERO NEGRO ESTILO "GARGANTÚA" (INTERSTELLAR)
 * ============================================================
 *
 * v2 — reescrito para arreglar el bug de la versión anterior
 * (el raymarching con "gravedad" mal calibrada capturaba casi
 * todos los rayos y llenaba la pantalla de negro con anillos
 * de banding).
 *
 * Esta versión usa una técnica 2D en espacio de pantalla,
 * mucho más robusta y sin riesgo de que la "física" se
 * descontrole:
 *
 *  1. Una esfera negra (el horizonte de eventos) en el centro.
 *  2. Un anillo/disco dibujado como una ELIPSE inclinada. Como
 *     la elipse es más alta que ancha en los lados, sus partes
 *     de arriba y abajo quedan visibles por fuera del círculo
 *     negro de forma natural — eso es lo que crea el efecto de
 *     "el disco envuelve la esfera" sin necesitar trazar rayos
 *     curvos de verdad.
 *  3. Gradiente de temperatura en el disco (blanco/amarillo
 *     cerca del horizonte, rojo/naranja hacia afuera) + un
 *     "doppler beaming" simple (un lado más brillante que el
 *     otro, como en la película).
 *  4. Un halo/anillo de fotones justo en el borde del horizonte.
 *  5. Estrellas de fondo con una distorsión radial simple
 *     (decae con 1/r², siempre acotada) que simula la lente
 *     gravitacional sin raymarching iterativo.
 *
 * ------------------------------------------------------------
 * INSTALACIÓN
 * ------------------------------------------------------------
 * npm install three
 * npm install -D @types/three
 *
 * ------------------------------------------------------------
 * USO
 * ------------------------------------------------------------
 * <BlackHole className="h-screen w-full" />
 *
 * IMPORTANTE: dale al contenedor una altura FIJA (h-screen,
 * o un alto en px). Si lo usas como fondo de una página con
 * `position: absolute` dentro de un padre sin altura definida,
 * el contenedor puede crecer con el contenido y el círculo se
 * ve gigante/recortado como en tu captura.
 */

const VERTEX_SHADER = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uRotation; // ángulo del disco (arrastra horizontal)
  uniform float uTilt;     // inclinación del disco (arrastra vertical)
  uniform float uZoom;     // zoom (scroll / pellizco)

  // ------------------------------------------------------------
  // ESTRELLAS DE FONDO (procedural, varias capas)
  // ------------------------------------------------------------

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  vec3 starField(vec2 uv) {
    vec3 col = vec3(0.0);

    for (float i = 0.0; i < 3.0; i += 1.0) {
      vec2 gv = uv * (260.0 + i * 180.0) + i * 57.0;
      vec2 id = floor(gv);

      float n = hash21(id);
      float threshold = 0.984 - i * 0.008;

      if (n > threshold) {
        float b = smoothstep(threshold, 1.0, n);
        vec2 f = fract(gv) - 0.5;
        float d = length(f);
        float star = smoothstep(0.35, 0.0, d) * b;

        vec3 tint = mix(
          vec3(0.72, 0.82, 1.0),
          vec3(1.0, 0.92, 0.82),
          hash21(id + 3.17)
        );

        col += star * tint * (1.0 - i * 0.22);
      }
    }

    return col;
  }

  // ------------------------------------------------------------
  // COLOR DEL DISCO (gradiente de temperatura + doppler)
  // ------------------------------------------------------------

  vec3 diskColor(float band, float doppler) {
    vec3 hot  = vec3(1.00, 0.97, 0.88);
    vec3 mid  = vec3(1.00, 0.55, 0.18);
    vec3 cool = vec3(0.55, 0.08, 0.03);

    float t = clamp(1.0 - band, 0.0, 1.0);
    vec3 base = mix(cool, mix(mid, hot, t), t);

    // lado que "gira hacia" la cámara: más brillante y blanco.
    // lado que se aleja: más tenue y rojo.
    base *= mix(0.35, 1.9, doppler);

    return base;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

    // zoom: acerca/aleja toda la escena
    uv *= uZoom;

    // radios en unidades de pantalla (relativos al alto del viewport)
    float horizonR  = 0.17;
    float diskInner = 0.21;
    float diskOuter = 0.66;

    // inclinación del disco (controlada por el arrastre vertical)
    float tilt = uTilt;

    float r = length(uv);

    vec3 col;

    if (r < horizonR) {
      // horizonte de eventos: negro absoluto
      col = vec3(0.0);
    } else {
      // --------------------------------------------------
      // FONDO DE ESTRELLAS + LENTE GRAVITACIONAL (acotada,
      // decae con 1/r², nunca diverge)
      // --------------------------------------------------

      vec2 dir = uv / max(r, 0.0001);

      // la distorsión decae con 1/r², pero cerca del horizonte el
      // gradiente es muy pronunciado y estira demasiado la
      // cuadrícula de estrellas (aliasing = rayitas radiales).
      // Bajamos la fuerza y la limitamos con un tope duro.
      float bend = (horizonR * horizonR) / (r * r) * 0.12;
      bend = min(bend, 0.14);

      vec2 lensedUV = uv + dir * bend;

      // además, apagamos gradualmente las estrellas justo pegadas
      // al horizonte: ahí la luz real quedaría demasiado desviada
      /// tragada como para verse como puntos nítidos.
      float starVisibility = smoothstep(horizonR, horizonR * 2.6, r);

      col = starField(lensedUV * 1.3 + vec2(uTime * 0.0025, 0.0)) * starVisibility;

      // --------------------------------------------------
      // DISCO DE ACRECIÓN (elipse inclinada)
      // --------------------------------------------------

      vec2 diskUV = vec2(uv.x, uv.y / tilt);
      float rd = length(diskUV);

      if (rd > diskInner && rd < diskOuter) {
        float ang = atan(diskUV.y, diskUV.x);
        float rot = ang - uRotation;

        float doppler = 0.5 + 0.5 * cos(rot);
        float band = (rd - diskInner) / (diskOuter - diskInner);

        float turbulence =
          0.85 + 0.15 * sin(rot * 7.0 + rd * 10.0 - uTime * 1.2);

        float edgeFade =
          smoothstep(diskInner, diskInner + 0.02, rd) *
          (1.0 - smoothstep(diskOuter - 0.03, diskOuter, rd));

        vec3 dCol = diskColor(band, doppler) * turbulence;
        col = mix(col, dCol, edgeFade);
      }

      // --------------------------------------------------
      // ANILLO DE FOTONES (halo justo en el borde del horizonte)
      // --------------------------------------------------

      float ring = exp(-pow((r - horizonR * 1.12) * 40.0, 2.0));
      col += vec3(1.0, 0.85, 0.65) * ring * 1.1;
    }

    // --------------------------------------------------
    // TONE MAPPING + VIÑETA
    // --------------------------------------------------

    col = col / (col + vec3(1.0));
    col = pow(col, vec3(1.0 / 2.2));

    float vig = 1.0 - smoothstep(0.55, 1.3, length(uv));
    col *= mix(0.8, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`

type BlackHoleProps = {
  className?: string
  style?: React.CSSProperties
  /** Muestra un pequeño texto de ayuda ("arrastra para rotar") al inicio. */
  showHint?: boolean
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Evita que la inclinación cruce por 0 (división por cero en el
 * shader) manteniendo el signo para poder "voltear" la vista.
 */
function clampTilt(value: number) {
  const MIN_ABS_TILT = 0.06
  const MAX_ABS_TILT = 0.9

  const sign = value < 0 ? -1 : 1
  const magnitude = clamp(Math.abs(value), MIN_ABS_TILT, MAX_ABS_TILT)

  return sign * magnitude
}

export default function BlackHole({
  className,
  style,
  showHint = true,
}: BlackHoleProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Estado de la "cámara" interactiva. Se leen dentro del loop de
  // animación con refs para no re-renderizar React en cada frame.
  const rotationRef = useRef(0)
  const tiltRef = useRef(0.32)
  const zoomRef = useRef(1)

  const isDraggingRef = useRef(false)
  const lastPointerRef = useRef({ x: 0, y: 0 })

  const [hintVisible, setHintVisible] = useState(showHint)

  useEffect(() => {
    if (!showHint) {
      return
    }

    const timer = setTimeout(() => setHintVisible(false), 5000)

    return () => clearTimeout(timer)
  }, [showHint])

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setClearColor(0x000000, 1)

    container.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uRotation: { value: rotationRef.current },
      uTilt: { value: tiltRef.current },
      uZoom: { value: zoomRef.current },
    }

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      depthWrite: false,
      depthTest: false,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    function resize() {
      if (!container) {
        return
      }

      const width = container.clientWidth || window.innerWidth
      const height = container.clientHeight || window.innerHeight

      renderer.setSize(width, height, false)
      uniforms.uResolution.value.set(
        width * renderer.getPixelRatio(),
        height * renderer.getPixelRatio()
      )
    }

    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    // --------------------------------------------------------
    // INTERACCIÓN: arrastrar para rotar/inclinar
    // --------------------------------------------------------

    const AUTO_SPIN_SPEED = 0.05 // rad/s cuando no se está interactuando
    const DRAG_ROTATE_SPEED = 0.006
    const DRAG_TILT_SPEED = 0.003

    function handlePointerDown(event: PointerEvent) {
      isDraggingRef.current = true
      lastPointerRef.current = { x: event.clientX, y: event.clientY }
      container?.setPointerCapture(event.pointerId)
      setHintVisible(false)
    }

    function handlePointerMove(event: PointerEvent) {
      if (!isDraggingRef.current) {
        return
      }

      const dx = event.clientX - lastPointerRef.current.x
      const dy = event.clientY - lastPointerRef.current.y

      lastPointerRef.current = { x: event.clientX, y: event.clientY }

      rotationRef.current += dx * DRAG_ROTATE_SPEED
      tiltRef.current = clampTilt(tiltRef.current - dy * DRAG_TILT_SPEED)
    }

    function handlePointerUp(event: PointerEvent) {
      isDraggingRef.current = false

      if (container?.hasPointerCapture(event.pointerId)) {
        container.releasePointerCapture(event.pointerId)
      }
    }

    function handleWheel(event: WheelEvent) {
      event.preventDefault()
      zoomRef.current = clamp(
        zoomRef.current + event.deltaY * 0.0012,
        0.55,
        2.4
      )
    }

    container.style.touchAction = 'none'
    container.style.cursor = 'grab'

    container.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    container.addEventListener('wheel', handleWheel, { passive: false })

    // --------------------------------------------------------
    // LOOP DE ANIMACIÓN
    // --------------------------------------------------------

    const clock = new THREE.Clock()
    let frameId = 0

    function animate() {
      const delta = clock.getDelta()

      if (!isDraggingRef.current) {
        rotationRef.current += AUTO_SPIN_SPEED * delta
      }

      if (container) {
        container.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab'
      }

      uniforms.uTime.value = clock.getElapsedTime()
      uniforms.uRotation.value = rotationRef.current
      uniforms.uTilt.value = tiltRef.current
      uniforms.uZoom.value = zoomRef.current

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()

      container.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      container.removeEventListener('wheel', handleWheel)

      geometry.dispose()
      material.dispose()
      renderer.dispose()

      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={className ?? 'h-screen w-full'}
      style={{ background: '#000', position: 'relative', ...style }}
    >
      {hintVisible && (
        <div
          style={{
            position: 'absolute',
            bottom: '1.25rem',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(6px)',
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '0.75rem',
            letterSpacing: '0.02em',
            pointerEvents: 'none',
            transition: 'opacity 0.6s ease',
            whiteSpace: 'nowrap',
          }}
        >
          🖱️ Arrastra para rotar · Scroll para zoom
        </div>
      )}
    </div>
  )
}
