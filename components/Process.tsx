
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const STEPS = [
  {
    number: '01',
    title: 'Extraction',
    desc: 'Deep discovery phase to extract your brand essence and technical constraints.',
    color: 'bg-purple-500'
  },
  {
    number: '02',
    title: 'Architecture',
    desc: 'Structuring logic, interfaces, and smart systems for high-performance scale.',
    color: 'bg-blue-500'
  },
  {
    number: '03',
    title: 'Synthesis',
    desc: 'The fusion of design and code. Rapid prototyping and internal audit.',
    color: 'bg-emerald-500'
  },
  {
    number: '04',
    title: 'Deployment',
    desc: 'Hard-launching your ecosystem into the global digital mainstream.',
    color: 'bg-white'
  }
];

const Process: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.process-step', {
        x: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-black border-t border-white/5 py-16" id="process">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-[9px] font-bold tracking-[0.5em] uppercase text-purple-600 mb-6">Methodology</h2>
            <h3 className="text-4xl md:text-5xl font-heading font-black uppercase leading-none mb-6">THE<br />NEBULA<br />PROTOCOL</h3>
            <p className="text-gray-500 text-base font-light leading-relaxed">
              We don't just build websites. We deploy end-to-end digital environments designed for the next generation of commerce.
            </p>
          </div>
          
          <div className="lg:col-span-8 flex flex-col gap-px bg-white/5 border border-white/5">
            {STEPS.map((step, i) => (
              <div key={i} className="process-step group bg-black p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between hover:bg-neutral-900/50 transition-colors">
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                  <span className="text-3xl font-heading font-black text-white/10 group-hover:text-purple-600 transition-colors">{step.number}</span>
                  <div>
                    <h4 className="text-xl font-heading font-bold uppercase mb-1">{step.title}</h4>
                    <p className="text-gray-500 max-w-sm text-xs md:text-sm">{step.desc}</p>
                  </div>
                </div>
                <div className={`w-10 h-1 md:w-1 md:h-10 ${step.color} opacity-20 group-hover:opacity-100 transition-opacity`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
