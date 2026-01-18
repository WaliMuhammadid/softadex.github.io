
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const ARCHITECTS = [
  { name: 'X_AVIER', role: 'CORE PROTOCOL', specialty: 'RUST / ZK-SNARKS' },
  { name: 'V_ALERIE', role: 'NEURAL DESIGN', specialty: 'WEBGL / GEN-AI' },
  { name: 'K_AELTHAS', role: 'STRATEGY LEAD', specialty: 'TOKENOMICS' },
  { name: 'M_IRAGE', role: 'UX ARCHITECT', specialty: 'SPATIAL WEB' }
];

const Team: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.architect-card', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-16 bg-black border-t border-white/5 overflow-hidden" id="team">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col md:flex-row items-baseline justify-between gap-4">
          <h2 className="text-4xl md:text-7xl font-heading font-black tracking-tighter uppercase leading-none">
            THE <span className="text-white/20">ARCHITECTS</span>
          </h2>
          <p className="text-[9px] font-mono text-purple-600 tracking-[0.4em] uppercase font-bold">
            Human_Core // Distributed_Intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {ARCHITECTS.map((member, i) => (
            <div 
              key={i} 
              className="architect-card group relative bg-black p-10 hover:bg-white transition-all duration-700 cursor-none"
            >
              <div className="relative z-10">
                <span className="text-[9px] font-bold text-gray-600 group-hover:text-purple-600 mb-6 block tracking-widest uppercase">NODE_{i + 1}</span>
                <h3 className="text-3xl font-heading font-black uppercase mb-1 group-hover:text-black transition-colors">{member.name}</h3>
                <p className="text-[9px] font-bold text-purple-600 group-hover:text-black/60 tracking-widest uppercase mb-8">{member.role}</p>
                
                <div className="pt-6 border-t border-white/10 group-hover:border-black/10">
                   <p className="text-[8px] font-mono text-gray-500 group-hover:text-black uppercase leading-relaxed">
                     Specialty_Index:<br />
                     <span className="text-white group-hover:text-black font-bold">{member.specialty}</span>
                   </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="w-10 h-10 border border-black/10 rounded-full flex items-center justify-center animate-spin-slow">
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </section>
  );
};

export default Team;
