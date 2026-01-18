
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-20 border-t border-white/10" id="contact">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center font-heading font-bold text-lg">N</div>
              <span className="text-xl font-heading font-bold tracking-tighter uppercase">Nebula<span className="text-purple-500">.</span></span>
            </div>
            <p className="text-gray-400 max-w-sm mb-10 leading-relaxed">
              Leading the technological shift toward a fair, decentralized, and user-owned internet.
            </p>
            <div className="flex gap-6">
              {['Twitter', 'Discord', 'Github', 'LinkedIn'].map((link) => (
                <a key={link} href="#" className="text-sm font-medium text-gray-500 hover:text-white transition-colors">{link}</a>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-200 mb-6">Directory</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Vision</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lab</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-200 mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-200 mb-6">Newsletter</h4>
              <div className="flex items-center">
                <input 
                  type="email" 
                  placeholder="E-mail address" 
                  className="w-full bg-white/5 border border-white/10 rounded-l-lg px-4 py-2 text-xs focus:outline-none focus:border-purple-500"
                />
                <button className="bg-white text-black px-4 py-2 rounded-r-lg text-xs font-bold">→</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">&copy; 2025 Nebula Web3 Systems. All nodes synchronized.</p>
          <div className="flex gap-8 text-[10px] text-gray-600 uppercase tracking-widest">
            <a href="#" className="hover:text-white">Privacy Protocol</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
