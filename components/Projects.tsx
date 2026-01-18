
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const PROJECTS = [
  {
    id: '01',
    title: 'AETHER PROTOCOL',
    category: 'DeFi Ecosystem',
    description: 'Next-generation liquidity layer for cross-chain assets.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '02',
    title: 'NEURAL NODE',
    category: 'AI Integration',
    description: 'Autonomous agents managing complex multi-sig operations.',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '03',
    title: 'ONYX MARKET',
    category: 'Digital Assets',
    description: 'High-fidelity marketplace for fractionalized real-world assets.',
    image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '04',
    title: 'CYBER CORE',
    category: 'Brand Identity',
    description: 'Total digital redesign for a legacy fintech conglomerate.',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1000'
  }
];

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uHover;
  uniform float uTime;

  void main() {
    vec2 uv = vUv;
    float distortion = sin(uv.y * 10.0 + uTime) * 0.02 * uHover;
    uv.x += distortion;
    uv.y += sin(uv.x * 10.0 + uTime) * 0.02 * uHover;
    vec4 color = texture2D(uTexture, uv);
    color.rgb *= (1.0 - uHover * 0.3);
    gl_FragColor = color;
  }
`;

const ProjectCard: React.FC<{ project: typeof PROJECTS[0] }> = ({ project }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    const loader = new THREE.TextureLoader();
    const texture = loader.load(project.image);
    texture.minFilter = THREE.LinearFilter;
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uHover: { value: 0 },
        uTime: { value: 0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;
    materialRef.current = material;
    const animate = (time: number) => {
      material.uniforms.uTime.value = time * 0.002;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate(0);
    const handleResize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      texture.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [project.image]);

  const handleMouseEnter = () => {
    if (materialRef.current) {
      gsap.to(materialRef.current.uniforms.uHover, { value: 1, duration: 0.8, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    if (materialRef.current) {
      gsap.to(materialRef.current.uniforms.uHover, { value: 0, duration: 0.8, ease: "power2.out" });
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="project-item relative h-[400px] md:h-[550px] overflow-hidden group cursor-none border border-white/5 bg-neutral-950"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" />
      <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between z-10 pointer-events-none">
        <div className="flex justify-between items-start">
          <span className="text-5xl font-heading font-black text-white/5 group-hover:text-purple-600 transition-colors duration-700">{project.id}</span>
          <span className="text-[8px] font-bold uppercase tracking-[0.4em] bg-white text-black px-4 py-1 shadow-xl">{project.category}</span>
        </div>
        <div className="transform group-hover:-translate-y-2 transition-transform duration-700">
          <h3 className="text-4xl md:text-6xl font-heading font-black uppercase mb-3 tracking-tighter leading-none">{project.title}</h3>
          <p className="text-gray-400 text-xs md:text-sm max-w-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-100">{project.description}</p>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20"></div>
    </div>
  );
};

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  return (
    <section ref={sectionRef} className="bg-black py-16" id="projects">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <p className="text-[10px] font-bold tracking-[0.8em] uppercase text-purple-600 mb-6">Selected Case Studies</p>
          <h2 className="text-5xl md:text-8xl font-heading font-black uppercase leading-[0.85] tracking-tighter">
            IMPACTFUL<br />
            <span className="text-transparent outline-text">SOLUTIONS</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="mt-16 flex justify-center">
           <button className="group relative px-16 py-6 glass border border-white/5 overflow-hidden transition-colors hover:border-white">
              <span className="relative z-10 text-[9px] font-bold uppercase tracking-[0.5em] group-hover:text-black transition-colors duration-500">View Global Index</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo"></div>
           </button>
        </div>
      </div>
      <style>{`
        .outline-text { -webkit-text-stroke: 1px rgba(255,255,255,0.15); color: transparent; }
        .ease-expo { transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1); }
      `}</style>
    </section>
  );
};

export default Projects;
