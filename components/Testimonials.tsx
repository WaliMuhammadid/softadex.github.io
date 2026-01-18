
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const NODES = [
  {
    id: "01",
    client: "PROTOCOL X",
    lead: "ALEX RIVERA",
    role: "CHIEF EXECUTIVE",
    quote: "NEBULA ARCHITECTED AN ENTIRE ECOSYSTEM. CONVERSION INCREASED BY 300% POST-DEPLOYMENT. SYSTEM INTEGRITY: 100%.",
    metric: "300% GROWTH",
    color: "#8b5cf6"
  },
  {
    id: "02",
    client: "LUMINANCE",
    lead: "SARAH CHENG",
    role: "FOUNDER",
    quote: "THE TECHNICAL PRECISION IN THEIR SMART CONTRACTS AND DESIGN SENSE IS UNMATCHED. DEPLOYMENT WAS FLAWLESS.",
    metric: "ZERO EXPLOITS",
    color: "#3b82f6"
  },
  {
    id: "03",
    client: "GALAXY VENTURES",
    lead: "MARCUS VANCE",
    role: "CTO",
    quote: "THEIR NEURAL INTEGRATION STRATEGY REVOLUTIONIZED OUR DAO GOVERNANCE. TRULY NEXT-GENERATION WORK.",
    metric: "14+ NODES",
    color: "#10b981"
  },
  {
    id: "04",
    client: "SYNTH WAVE",
    lead: "ELARA VOX",
    role: "DIRECTOR",
    quote: "WORKING WITH NEBULA IS VISITING THE FUTURE. THEY UNDERSTAND THE INTERSECTION OF AESTHETICS AND UTILITY.",
    metric: "TOP 10 RANKED",
    color: "#ec4899"
  }
];

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const isVisible = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % NODES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particlesMat = new THREE.PointsMaterial({
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      color: 0x8b5cf6
    });

    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);
    particlesRef.current = particles;

    const animate = (time: number) => {
      if (isVisible.current) {
        const t = time * 0.001;
        particles.rotation.y = t * 0.05;
        particles.rotation.x = t * 0.02;
        const pos = particlesGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particlesCount; i++) {
          const x = pos[i * 3];
          pos[i * 3 + 1] += Math.sin(t + x) * 0.002;
        }
        particlesGeo.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
      }
      requestAnimationFrame(animate);
    };
    animate(0);

    const observer = new IntersectionObserver(([entry]) => {
      isVisible.current = entry.isIntersecting;
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
    };
  }, []);

  useEffect(() => {
    if (particlesRef.current) {
      const color = new THREE.Color(NODES[activeIndex].color);
      gsap.to((particlesRef.current.material as THREE.PointsMaterial).color, {
        r: color.r,
        g: color.g,
        b: color.b,
        duration: 1.5,
        ease: "power2.inOut"
      });
      gsap.to(particlesRef.current.scale, {
        x: 1.2, y: 1.2, z: 1.2,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: "power4.out"
      });
    }

    if (contentRef.current) {
      gsap.fromTo(contentRef.current.querySelectorAll('.animate-text'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "power3.out" }
      );
    }
  }, [activeIndex]);

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-[80vh] md:min-h-[90vh] bg-black overflow-hidden flex flex-col items-center justify-center py-16 md:py-20" 
      id="testimonials"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-30" />

      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col items-center mb-12 md:mb-16 text-center">
          <p className="text-[8px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.8em] uppercase text-purple-600 mb-4">Vanguard_Testimonials // SECURE_SYNC</p>
          <h2 className="text-3xl md:text-7xl font-heading font-black uppercase tracking-tighter leading-tight md:leading-none">
            TRUSTED BY THE <br />
            <span className="text-white/20">NEW VANGUARD</span>
          </h2>
        </div>

        <div className="max-w-5xl mx-auto relative min-h-[450px] flex items-center justify-center">
          <div 
            ref={contentRef}
            className="w-full glass p-8 md:p-20 border border-white/10 backdrop-blur-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-10 mb-8 md:mb-16">
              <div className="animate-text">
                <span className="text-[8px] font-mono font-bold text-purple-500 tracking-[0.3em] md:tracking-[0.4em] uppercase mb-2 md:mb-4 block">
                  NODE_ID: {NODES[activeIndex].id} // ENCRYPTED
                </span>
                <h3 className="text-3xl md:text-6xl font-heading font-black tracking-tighter uppercase leading-none">
                  {NODES[activeIndex].client}
                </h3>
              </div>
              <div className="text-left md:text-right shrink-0 animate-text">
                <p className="text-[8px] font-bold text-gray-600 tracking-[0.3em] uppercase mb-1 md:mb-2">Performance_Delta</p>
                <div className="text-xl md:text-2xl font-heading font-bold text-white border-b border-purple-600/30 pb-1 md:pb-2">
                  {NODES[activeIndex].metric}
                </div>
              </div>
            </div>

            <p className="animate-text text-lg md:text-3xl font-light italic text-gray-300 leading-relaxed font-heading mb-8 md:mb-16 max-w-4xl">
              "{NODES[activeIndex].quote}"
            </p>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-6 md:pt-10 border-t border-white/5 gap-6 md:gap-8">
              <div className="flex items-center gap-4 md:gap-6 animate-text">
                <div className="w-8 md:w-12 h-[1px] bg-purple-600"></div>
                <div>
                  <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest">{NODES[activeIndex].lead}</h4>
                  <p className="text-[8px] md:text-[9px] text-gray-500 uppercase tracking-[0.3em] mt-1">{NODES[activeIndex].role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                {NODES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className="group relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
                  >
                    <div className={`absolute inset-0 border border-white/10 transition-all duration-500 ${i === activeIndex ? 'rotate-45 border-purple-600 bg-purple-600/10' : 'group-hover:rotate-45'}`}></div>
                    <span className={`relative text-[8px] md:text-[10px] font-mono ${i === activeIndex ? 'text-white' : 'text-gray-600'}`}>{i + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-6 md:-bottom-8 left-0 w-full h-[2px] bg-white/5">
            <div 
              className="h-full bg-purple-600 transition-all duration-700 ease-linear"
              style={{ width: `${((activeIndex + 1) / NODES.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <style>{`
        .glass {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
