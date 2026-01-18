
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SERVICES = [
  {
    title: 'Brand Strategy',
    desc: 'High-concept identity systems designed for digital-native audiences.',
    tag: 'Identity'
  },
  {
    title: 'Product Engineering',
    desc: 'Complex web platforms and dApps built with cutting-edge stack stability.',
    tag: 'Engineering'
  },
  {
    title: 'AI Integration',
    desc: 'Automating enterprise workflows using custom LLMs and neural agents.',
    tag: 'Intelligence'
  },
  {
    title: 'Web3 Ecosystems',
    desc: 'Tokenomics, DAO structures, and decentralized governance frameworks.',
    tag: 'Blockchain'
  }
];

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.fromTo(cardsRef.current, 
      { y: 60, opacity: 0 }, 
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.15, 
        duration: 0.8, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="flex items-center bg-black py-12 md:py-16" id="services">
      <div className="container mx-auto px-6">
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8">
          <div className="max-w-3xl">
            <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-purple-600 mb-4">Our Capabilities</h2>
            <p className="text-3xl md:text-5xl font-heading font-black uppercase leading-[1.1]">
              WE DEPLOY <span className="text-white/20">PREMIER</span> DIGITAL INFRASTRUCTURE.
            </p>
          </div>
          <div className="text-right hidden lg:block">
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
              AGENCY CORE V2.0<br />
              GLOBAL DEPLOYMENT READY
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/10">
          {SERVICES.map((service, i) => (
            <div 
              key={i} 
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group p-8 md:p-10 border-white/10 border-b sm:border-r last:border-r-0 hover:bg-white hover:text-black transition-all duration-700 md:cursor-none"
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-purple-600 group-hover:text-black mb-6 block">{service.tag}</span>
              <h3 className="text-lg md:text-xl font-heading font-bold mb-4 uppercase leading-none">{service.title}</h3>
              <p className="text-gray-500 group-hover:text-black/70 text-xs md:text-sm leading-relaxed mb-8">{service.desc}</p>
              
              <div className="flex justify-between items-center opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-[8px] font-bold uppercase tracking-widest">Read Spec</span>
                <span className="text-lg">↗</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
