import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { sectors, edges } from '../../data'
import { useSimulator } from '../../context/SimulatorContext'

/* ══════════════════════════════════════════════════
   3D LOOM CANVAS
   WebGL constellation of threads and sector nodes.
   Uses vanilla Three.js for maximum performance and 
   React 19 compatibility.
══════════════════════════════════════════════════ */

const COLOR_MAP = {
  '#4C8CFF': 0x4A8FA8,  // Stable (steel blue)
  '#E8B96A': 0xD4923A,  // Warning (amber gold)
  '#E8506A': 0xC44B6E,  // Critical (decay red)
  '#9D6FE0': 0x7B5EA8,  // Core (violet)
}

export default function LoomCanvas() {
  const containerRef = useRef(null)
  const { state: sim } = useSimulator()
  // Pass live integrity into Three.js loop via ref (no remount needed)
  const integrityRef = useRef(sim.integrity)
  useEffect(() => { integrityRef.current = sim.integrity }, [sim.integrity])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ── Setup Scene ──────────────────────────────────
    const width = container.clientWidth
    const height = container.clientHeight
    const scene = new THREE.Scene()

    // Fog for depth
    scene.fog = new THREE.FogExp2(0x06040e, 0.04)

    // ── Camera ───────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(0, 0, 14)

    // ── Renderer ─────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // ── Starfield (Ambient dust) ──────────────────────
    const dustCount = 200
    const dustGeom = new THREE.BufferGeometry()
    const dustPos = new Float32Array(dustCount * 3)
    const dustSpeed = []

    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3]     = (Math.random() - 0.5) * 20
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 20
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 15
      dustSpeed.push({
        y: 0.002 + Math.random() * 0.005,
        x: (Math.random() - 0.5) * 0.002,
        phase: Math.random() * Math.PI * 2
      })
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
    const dustMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xD4923A,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending
    })
    const dust = new THREE.Points(dustGeom, dustMat)
    scene.add(dust)

    // ── Node Constellation ───────────────────────────
    const nodesGroup = new THREE.Group()
    scene.add(nodesGroup)

    const nodeMeshes = {}
    const nodeData = {}

    // Map 2D sector data to 3D space
    sectors.forEach((s, idx) => {
      // Scale coordinates from (0..100) to (-6..6)
      const x = ((s.x - 50) / 100) * 12
      const y = -((s.y - 50) / 100) * 10
      // Offset Z dynamically to create volumetric depth
      const z = s.id === 'CORE' ? 0 : Math.sin(idx * 2) * 2.5

      nodeData[s.id] = { x, y, z, integrity: s.integrity / 100, color: s.color }

      const rawColor = COLOR_MAP[s.color] || 0xD4923A

      // Sphere geometry
      const size = s.id === 'CORE' ? 0.75 : 0.44
      const geom = new THREE.SphereGeometry(size, 24, 24)

      // Holographic wireframe mesh
      const wireMat = new THREE.MeshBasicMaterial({
        color: rawColor,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      })
      const innerMesh = new THREE.Mesh(geom, wireMat)

      // Glowing solid mesh
      const coreMat = new THREE.MeshBasicMaterial({
        color: rawColor,
        transparent: true,
        opacity: 0.75,
      })
      const outerMesh = new THREE.Mesh(new THREE.SphereGeometry(size * 0.75, 16, 16), coreMat)

      const singleNodeGroup = new THREE.Group()
      singleNodeGroup.position.set(x, y, z)
      singleNodeGroup.add(innerMesh)
      singleNodeGroup.add(outerMesh)

      // Interactive hover halo (invisible by default)
      const haloMat = new THREE.MeshBasicMaterial({
        color: rawColor,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      })
      const haloMesh = new THREE.Mesh(new THREE.SphereGeometry(size * 1.5, 16, 16), haloMat)
      singleNodeGroup.add(haloMesh)

      nodesGroup.add(singleNodeGroup)

      nodeMeshes[s.id] = {
        group: singleNodeGroup,
        inner: innerMesh,
        outer: outerMesh,
        halo: haloMesh,
        baseSize: size,
        integrity: s.integrity / 100
      }
    })

    // ── Animated Bezier Threads ─────────────────────
    const threadsList = []

    edges.forEach((edge, idx) => {
      const fromNode = nodeData[edge.from]
      const toNode = nodeData[edge.to]
      if (!fromNode || !toNode) return

      const avgIntegrity = (fromNode.integrity + toNode.integrity) / 2
      const isCritical = avgIntegrity < 0.4

      // Create quadratic bezier curve path
      const p1 = new THREE.Vector3(fromNode.x, fromNode.y, fromNode.z)
      const p2 = new THREE.Vector3(toNode.x, toNode.y, toNode.z)

      // Control point curved outwards to make it look woven
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)
      mid.y += Math.sin(idx * 2) * 1.4
      mid.z += Math.cos(idx * 2.5) * 1.2

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2)
      const points = curve.getPoints(36)

      // Mesh line geometry
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points)

      const baseColor = isCritical ? 0xC44B6E : 0xD4923A
      const lineMat = new THREE.LineBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: isCritical ? 0.15 : 0.45,
        blending: THREE.AdditiveBlending
      })

      const line = new THREE.Line(lineGeom, lineMat)
      scene.add(line)

      // Glow thread (thick soft layer)
      const glowMat = new THREE.LineBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: isCritical ? 0.04 : 0.12,
        linewidth: 2,
        blending: THREE.AdditiveBlending
      })
      const glowLine = new THREE.Line(lineGeom, glowMat)
      scene.add(glowLine)

      // Particle flowing along thread
      const pMat = new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      })
      const pMesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), pMat)
      scene.add(pMesh)

      threadsList.push({
        curve,
        mesh: pMesh,
        speed: 0.15 + Math.random() * 0.15,
        progress: Math.random(),
        isCritical
      })
    })

    // ── Raycaster & Mouse Hover ──────────────────────
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    let hoveredNodeId = null

    const onPointerMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    container.addEventListener('pointermove', onPointerMove)

    // ── Animation loop ───────────────────────────────
    let animationFrameId
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsed = clock.getElapsedTime()

      // 1. Slow orbit camera movement
      const orbitRadius = 13.5
      camera.position.x = Math.sin(elapsed * 0.08) * orbitRadius
      camera.position.z = Math.cos(elapsed * 0.08) * orbitRadius
      camera.position.y = Math.sin(elapsed * 0.05) * 1.5
      camera.lookAt(0, 0, 0)

      // 2. Animate Dust particles (gentle vertical float)
      const positions = dust.geometry.attributes.position.array
      for (let i = 0; i < dustCount; i++) {
        const speed = dustSpeed[i]
        positions[i * 3 + 1] += speed.y // Rise
        positions[i * 3]     += speed.x // Drift X

        // Boundary wrap
        if (positions[i * 3 + 1] > 10) positions[i * 3 + 1] = -10
        if (positions[i * 3] > 10) positions[i * 3] = -10
        if (positions[i * 3] < -10) positions[i * 3] = 10
      }
      dust.geometry.attributes.position.needsUpdate = true

      // 3. Animate thread flow particles
      threadsList.forEach((t) => {
        t.progress += t.speed * clock.getDelta() * 0.1
        if (t.progress > 1) t.progress = 0

        const pt = t.curve.getPointAt(t.progress)
        t.mesh.position.copy(pt)

        // Pulsing glow size
        const scale = 1 + 0.3 * Math.sin(elapsed * 8 + t.progress * 10)
        t.mesh.scale.set(scale, scale, scale)
      })

      // 4. Node breathing, tremor, and live-integrity-driven decay
      const liveInt = integrityRef.current / 100  // 0..1
      const isCollapsing = liveInt < 0.35
      const isCritical   = liveInt < 0.20

      Object.entries(nodeMeshes).forEach(([id, nm]) => {
        // Core breathing — faster when collapsing
        const breatheFreq = isCollapsing ? 2.8 : 1.2
        const breathe = 1 + (isCollapsing ? 0.08 : 0.04) * Math.sin(elapsed * breatheFreq + nm.integrity * 20)
        nm.inner.scale.set(breathe, breathe, breathe)
        nm.inner.rotation.y += isCollapsing ? 0.012 : 0.005
        nm.inner.rotation.x += isCollapsing ? 0.006 : 0.002

        // Shift node color to decay red as integrity drops
        if (isCollapsing) {
          nm.outer.material.color.setHex(isCritical ? 0xC44B6E : 0xB8711A)
          nm.outer.material.opacity = 0.5 + 0.25 * Math.sin(elapsed * 6)
        } else {
          nm.outer.material.opacity = 0.75
        }

        // Critical tremor — stronger as integrity approaches zero
        if (nm.integrity < 0.4 || isCollapsing) {
          const tremorAmp = isCollapsing ? 0.03 * (1 - liveInt) : 0.015
          const tremor = tremorAmp * Math.sin(elapsed * 45)
          nm.group.position.x = nodeData[id].x + tremor
          nm.group.position.y = nodeData[id].y + tremor * 0.6
        }
      })

      // Live-integrity thread opacity shift
      threadsList.forEach(t => {
        if (isCollapsing) {
          t.mesh.material.color.setHex(isCritical ? 0xC44B6E : 0xB8711A)
          t.mesh.material.opacity = 0.5 + 0.4 * Math.sin(elapsed * 5 + t.progress * 8)
        } else {
          t.mesh.material.color.setHex(t.isCritical ? 0xC44B6E : 0xD4923A)
          t.mesh.material.opacity = 0.9
        }
      })

      // Dust color reacts to integrity
      dustMat.color.setHex(isCollapsing ? 0xC44B6E : 0xD4923A)
      dustMat.opacity = isCollapsing ? 0.4 : 0.28

      // 5. Raycast check for hover selection
      raycaster.setFromCamera(mouse, camera)
      let currentHover = null

      Object.entries(nodeMeshes).forEach(([id, nm]) => {
        // Test hit on inner core mesh
        const intersects = raycaster.intersectObject(nm.inner)
        if (intersects.length > 0) {
          currentHover = id
        }
      })

      if (currentHover !== hoveredNodeId) {
        // Reset previous hover
        if (hoveredNodeId && nodeMeshes[hoveredNodeId]) {
          const prev = nodeMeshes[hoveredNodeId]
          prev.halo.material.opacity = 0
          prev.outer.scale.set(1, 1, 1)
        }
        // Hover target activated
        if (currentHover) {
          const next = nodeMeshes[currentHover]
          next.halo.material.opacity = 0.35
          next.outer.scale.set(1.2, 1.2, 1.2)
        }
        hoveredNodeId = currentHover
      }

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // ── Resize Listener ──────────────────────────────
    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // ── Cleanup ──────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('pointermove', onPointerMove)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      scene.clear()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      style={{ minHeight: '320px' }}
    >
      {/* Topology scale overlays */}
      <div className="absolute top-3 left-3 tele text-[8px] text-white/20 select-none">
        GRID RES: 0.003 QUANTUM/ANCHOR
      </div>
      <div className="absolute top-3 right-3 tele text-[8px] text-white/20 select-none">
        COORD MAP: X/Y/Z VOLUMETRIC
      </div>
    </div>
  )
}
