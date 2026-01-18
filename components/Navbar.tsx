
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const navRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    gsap.fromTo(navRef.current, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.1 }
    );
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        duration: 0.8,
        clipPath: 'circle(150% at 95% 5%)',
        ease: 'power4.inOut',
      });
      tl.fromTo(linksRef.current, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power4.out' },
        '-=0.4'
      );
    } else {
      document.body.style.overflow = 'auto';
      gsap.to(overlayRef.current, {
        duration: 0.8,
        clipPath: 'circle(0% at 95% 5%)',
        ease: 'power4.inOut',
      });
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { label: 'The Vision', href: '#vision' },
    { label: 'Capabilities', href: '#services' },
    { label: 'Case Studies', href: '#projects' },
    { label: 'The Protocol', href: '#process' },
    { label: 'Neural Lab', href: '#lab' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <nav 
        ref={navRef} 
        className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'py-3.5 bg-black/90 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]' 
            : 'py-6 bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo HUD */}
          <div 
            className="flex items-center gap-5 group cursor-pointer relative z-[1010]" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            <div className="relative w-10 h-10 flex items-center justify-center">
               <div className="absolute inset-0 border-2 border-white/10 group-hover:border-white/80 group-hover:rotate-45 transition-all duration-700 ease-out"></div>
               <div className="absolute inset-[4px] border border-white/5 opacity-40 group-hover:opacity-100 transition-opacity"></div>
               <span className="text-xl font-heading font-black tracking-tighter uppercase text-white">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-heading font-black tracking-[0.6em] uppercase leading-none mb-1 text-white">NEBULA</span>
              <span className="text-[7px] font-mono text-white/40 tracking-[0.4em] uppercase hidden sm:block">CORE_V2.5 // PRESTIGE</span>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-12">
            {['Vision', 'Services', 'Lab', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="group relative text-[9px] font-bold text-white/60 hover:text-white transition-all uppercase tracking-[0.5em] px-2 py-1"
              >
                {item}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-white group-hover:w-full transition-all duration-500 rounded-full"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6 relative z-[1010]">
             <button className="hidden md:flex items-center gap-3 px-8 py-3.5 glass border border-white/20 text-[9px] font-bold uppercase tracking-[0.5em] text-white hover:bg-white hover:text-black hover:border-white transition-all duration-700 shadow-xl overflow-hidden group">
                <span className="relative z-10">Initialize_Node</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] group-hover:bg-black transition-colors"></div>
             </button>
             
             <button 
               onClick={toggleMenu}
               className="flex flex-col gap-1.5 group p-2 -mr-2"
               aria-label="Toggle Menu"
             >
                <div className={`w-7 h-[1.5px] bg-white transition-all duration-500 ease-expo ${isOpen ? 'rotate-45 translate-y-[4px]' : ''}`}></div>
                <div className={`w-9 h-[1.5px] bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-[1.5px] bg-white ml-auto transition-all duration-500 ease-expo ${isOpen ? '-rotate-45 -translate-y-[12px] w-7' : 'group-hover:w-9'}`}></div>
             </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white/5 overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
      </nav>

      {/* Full-screen Menu Overlay */}
      <div 
        ref={overlayRef}
        style={{ clipPath: 'circle(0% at 95% 5%)' }}
        className="fixed inset-0 z-[900] bg-black flex flex-col justify-center items-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        <div className="container mx-auto px-6 grid lg:grid-cols-2 h-full py-32 relative z-10">
          <div className="flex flex-col justify-center gap-6 lg:border-r border-white/10 pr-12">
            {menuItems.map((item, i) => (
              <a
                key={item.label}
                href={item.href}
                ref={(el) => { linksRef.current[i] = el; }}
                onClick={() => setIsOpen(false)}
                className="group flex items-baseline gap-8"
              >
                <span className="text-[10px] font-mono text-white/30 group-hover:text-white transition-colors">0{i + 1}</span>
                <h2 className="text-4xl md:text-7xl font-heading font-black uppercase tracking-tighter leading-none group-hover:translate-x-4 group-hover:text-white transition-all duration-700 text-white/40">
                  {item.label}
                </h2>
              </a>
            ))}
          </div>

          <div className="flex flex-col justify-end lg:pl-20 mt-16 lg:mt-0">
            <div className="grid sm:grid-cols-2 gap-12 mb-16">
              <div className="space-y-4">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/30">Network_Inquiries</h4>
                <p className="text-xl font-heading text-white/80 hover:text-white cursor-pointer transition-all">hello@nebula.io</p>
                <p className="text-xl font-heading text-white/80 hover:text-white cursor-pointer transition-all">+1 (555) NEB_W3</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/30">HQ_Coordinate</h4>
                <p className="text-xl font-heading text-white/80">Meta-Nexus One<br />San Francisco, CA</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-10">
              {['Twitter', 'Discord', 'Github', 'Instagram'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/30 hover:text-white transition-all relative group"
                >
                  {social}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all"></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
