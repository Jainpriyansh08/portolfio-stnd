import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// A distorted glowing core surrounded by an orbiting particle "network" —
// a nod to distributed systems.
function Core() {
  const ref = useRef()
  useFrame((state, dt) => {
    ref.current.rotation.y += dt * 0.15
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.pointer.y * 0.4, 0.05)
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, -state.pointer.x * 0.3, 0.05)
  })
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={ref} scale={1.5}>
        <icosahedronGeometry args={[1, 24]} />
        <MeshDistortMaterial color="#7c5cff" emissive="#2a1a7a" roughness={0.25} metalness={0.6} distort={0.38} speed={1.6} />
      </mesh>
      <mesh scale={2.05}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.12} />
      </mesh>
    </Float>
  )
}

function Particles({ count = 900 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6
      p[i * 3 + 2] = r * Math.cos(phi)
    }
    return p
  }, [count])
  useFrame((_, dt) => {
    ref.current.rotation.y -= dt * 0.03
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#b9a8ff" transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  )
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 4, 5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-4, -2, -2]} intensity={30} color="#22d3ee" />
      <Core />
      <Particles />
    </Canvas>
  )
}
