
import React, { useState, useRef } from 'react';
import gsap from 'gsap';

const QUERIES = [
  { 
    q: 'How does Nebula handle network scalability?', 
    a: 'We utilize elastic sharding protocols and ZK-rollup architectures to ensure your digital infrastructure handles 1M+ simultaneous requests without latency degradation.' 
  },
  { 
    q: 'What is the standard protocol for engagement?', 
    a: 'Our engagement lifecycle follows a strict Extraction -> Synthesis -> Deployment framework, typically spanning 12-16 cycles of high-fidelity iteration.' 
  },
  { 
    q: 'Can legacy systems be integrated into the Web3 stack?', 
    a: 'Yes. Our middleware adapters bridge Web2 databases with decentralized ledgers, ensuring data integrity while maintaining modern security standards.' 
  },
  { 
    q: 'What neural models are used in the Lab?', 
    a: 'We deploy custom Gemini 1.5 Pro instances fine-tuned on decentralized finance (DeFi) and tokenomic datasets for predictive market modeling.' 
  }
];

const FAQ: React.FC = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="py-16 bg-black border-t border-white/5" id="faq">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 md:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-[9px] font-bold tracking-[0.4em] uppercase text-purple-600 mb-6">System_Support</h2>
            <h3 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter leading-[0.9] mb-6">
              PROTOCOL<br />QUERIES_
            </h3>
            <p className="text-gray-500 text-base font-light leading-relaxed max-w-sm">
              Navigating the future requires technical clarity. Find core documentation answers below.
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-3">
            {QUERIES.map((item, i) => (
              <div 
                key={i} 
                className={`group border border-white/5 transition-all duration-500 hover:border-white/20 ${active === i ? 'bg-white/5 border-purple-600/30' : 'bg-black'}`}
              >
                <button 
                  onClick={() => setActive(active === i ? null : i)}
                  className="w-full text-left p-6 md:p-10 flex justify-between items-center group cursor-none"
                >
                  <span className="text-base md:text-lg font-heading font-bold uppercase tracking-tight group-hover:text-purple-500 transition-colors">
                    {item.q}
                  </span>
                  <div className={`w-6 h-6 rounded-full border border-white/10 flex items-center justify-center transition-transform duration-500 ${active === i ? 'rotate-180 border-purple-600' : ''}`}>
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-700 ease-in-out ${active === i ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-6 md:p-10 pt-0 text-gray-400 text-sm font-light leading-relaxed border-t border-white/5">
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
