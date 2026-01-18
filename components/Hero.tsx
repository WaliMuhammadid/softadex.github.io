
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uAmplitude;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vNoise;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 h_ = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*h_.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*h_.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    float noise = snoise(position * 0.35 + uTime * 0.1) * 0.8;
    noise += snoise(position * 0.8 - uTime * 0.2) * 0.12;
    vNoise = noise;
    float mouseDist = distance(uv, uMouse);
    float mouseForce = smoothstep(0.4, 0.0, mouseDist) * uAmplitude;
    vec3 newPos = position + normal * (noise * 0.5 + mouseForce);
    vPosition = newPos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vNoise;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.2 - dot(viewDirection, vNormal), 3.0);
    vec3 baseColor = vec3(0.08, 0.08, 0.1);
    vec3 accentColor = vec3(0.4, 0.4, 0.45);
    vec3 rimColor = vec3(0.9, 0.9, 1.0);
    vec3 color = mix(baseColor, accentColor, fresnel * 0.7);
    color = mix(color, rimColor, pow(fresnel, 4.5));
    vec3 lightDir = normalize(vec3(5.0, 10.0, 5.0));
    float spec = pow(max(0.0, dot(vNormal, lightDir)), 48.0);
    color += spec * vec3(1.0, 1.0, 1.0) * 0.6;
    float pulse = sin(uTime * 1.2) * 0.03 + 0.97;
    color *= pulse;
    gl_FragColor = vec4(color, 0.45);
  }
`;

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbRef = useRef<THREE.Mesh | null>(null);
  const cageRef = useRef<THREE.Mesh | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const orbGeometry = new THREE.TorusKnotGeometry(2, 0.65, 300, 64);
    const orbMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uAmplitude: { value: 0.7 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orbRef.current = orb;
    scene.add(orb);

    const cageGeo = new THREE.BoxGeometry(6.5, 6.5, 6.5);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.04
    });
    const cage = new THREE.Mesh(cageGeo, cageMat);
    cageRef.current = cage;
    scene.add(cage);

    const starCount = 400;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for(let i=0; i<starCount*3; i++) {
        starPos[i] = (Math.random() - 0.5) * 35;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.025, color: 0xffffff, transparent: true, opacity: 0.25 });
    const stars = new THREE.Points(starGeo, starMat);
    starsRef.current = stars;
    scene.add(stars);

    const mouse = new THREE.Vector2(0.5, 0.5);
    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const onMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', onMouseMove);

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom center",
        scrub: 1.5,
      }
    });

    scrollTl.to(orb.scale, { x: 0.5, y: 0.5, z: 0.5, ease: "none" }, 0)
            .to(orb.position, { y: -8, ease: "none" }, 0)
            .to(orb.rotation, { z: Math.PI * 1.5, ease: "none" }, 0)
            .to(cage.rotation, { y: Math.PI, ease: "none" }, 0)
            .to(stars.position, { y: 10, ease: "none" }, 0);

    let frame = 0;
    const animate = () => {
      frame++;
      const time = frame * 0.01;
      orbMaterial.uniforms.uTime.value = time;
      mouse.lerp(targetMouse, 0.02);
      orbMaterial.uniforms.uMouse.value.set(mouse.x, mouse.y);
      const floatingY = Math.sin(time * 0.5) * 0.15;
      const floatingRotation = Math.cos(time * 0.3) * 0.05;
      orb.rotation.y = time * 0.08 + floatingRotation;
      orb.rotation.x = time * 0.04 + floatingRotation;
      orb.position.x = Math.sin(time * 0.2) * 0.1;
      cage.rotation.y = time * 0.015;
      cage.rotation.z = time * 0.01;
      stars.rotation.y = time * 0.005;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    gsap.from(orb.scale, { x: 0, y: 0, z: 0, duration: 4, ease: "expo.out", delay: 0.2 });

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      orbGeometry.dispose();
      orbMaterial.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen md:min-h-[110vh] w-full flex flex-col items-center justify-center overflow-hidden bg-black" 
      id="vision"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Decorative HUD Elements */}
      <div className="absolute inset-0 z-10 pointer-events-none select-none">
        <div className="absolute top-1/2 left-6 md:left-20 -translate-y-1/2 flex flex-col gap-6 md:gap-10 opacity-20">
            <div className="space-y-1">
                <p className="text-[6px] md:text-[7px] font-mono tracking-[0.4em] text-white uppercase">Engine_Status</p>
                <p className="text-[8px] md:text-[9px] font-mono text-white/50 font-bold">CORE_ACTIVE</p>
            </div>
            <div className="space-y-1 border-t border-white/10 pt-8 md:pt-10 hidden sm:block">
                <p className="text-[6px] md:text-[7px] font-mono tracking-[0.4em] text-white uppercase">Protocol_Sync</p>
                <p className="text-[8px] md:text-[9px] font-mono text-white font-bold">STABLE_FLOW</p>
            </div>
        </div>
      </div>
      
      {/* Centered Content Container - Reduced top padding to tighten with navbar */}
      <div className="container mx-auto px-6 relative z-20 flex flex-col items-center text-center justify-center h-full pt-16 md:pt-24">
        {/* Vanguard Badge - Reduced margin and tightened padding */}
        <div className="mb-6 md:mb-8 opacity-0 animate-[reveal_2s_ease-out_0.5s_forwards] pointer-events-auto">
            <div className="glass px-5 md:px-10 py-2.5 rounded-full border border-white/10 flex items-center gap-3 md:gap-4 group cursor-crosshair hover:border-white/30 transition-all duration-500">
                <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-white animate-pulse"></div>
                <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-[0.6em] md:tracking-[0.8em] text-white/70 group-hover:text-white transition-colors">Vanguard // Prestige_Node</span>
            </div>
        </div>
        
        {/* Heading - Reduced bottom margin */}
        <div className="relative pointer-events-none mb-8 md:mb-10">
            <h1 className="text-4xl md:text-[5.5rem] lg:text-[7.5rem] font-heading font-black leading-[0.85] tracking-tighter uppercase opacity-0 animate-[reveal_2s_ease-out_0.7s_forwards]">
                ENGINEERING<br />
                <span className="outline-text">PRESTIGE</span><br />
                DIGITAL
            </h1>
        </div>

        {/* Content Body - Refined spacing */}
        <div className="max-w-4xl flex flex-col items-center opacity-0 animate-[reveal_2.5s_cubic-bezier(0.19,1,0.22,1)_1.2s_forwards]">
          <p className="text-gray-400 text-xs md:text-xl font-light leading-relaxed mb-8 md:mb-12 px-4 md:px-10 tracking-[0.15em] md:tracking-[0.25em] uppercase border-b border-white/5 pb-8 md:pb-10">
            Deploying high-fidelity <span className="text-white">autonomous ecosystems</span> with surgical technical distinction.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-12 pointer-events-auto">
            <button className="relative group px-12 md:px-16 py-5 md:py-6 overflow-hidden bg-white text-black transition-all duration-700 hover:bg-neutral-200 hover:text-black shadow-2xl w-full sm:w-auto">
                <span className="relative z-10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em]">Initialize_Nexus</span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-black/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>
            
            <button className="group flex items-center gap-6 md:gap-10 opacity-60 hover:opacity-100 transition-all">
                <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-gray-400 group-hover:text-white">Deep_Archive</span>
                <div className="w-10 md:w-14 h-px bg-white/20 group-hover:w-24 group-hover:bg-white transition-all duration-700"></div>
            </button>
          </div>
        </div>

        {/* HUD Footnote */}
        <div className="mt-12 md:mt-24 text-[8px] md:text-[9px] font-mono text-white/20 tracking-[0.5em] uppercase hidden sm:block">
            System_Architecture_Index: 402.29 // Protocol: v.190_SMOOTHED
        </div>
      </div>

      <style>{`
        .outline-text {
            color: rgba(255, 255, 255, 0.05);
            -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
            text-shadow: 0 0 40px rgba(255, 255, 255, 0.1);
        }
        @media (min-width: 768px) {
          .outline-text { -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.6); }
        }
        @keyframes reveal {
            from { opacity: 0; transform: translateY(20px); filter: blur(10px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .glass {
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(30px);
        }
      `}</style>
    </section>
  );
};

export default Hero;
