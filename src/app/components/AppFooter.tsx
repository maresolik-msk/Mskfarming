import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import { RainEffect } from './RainEffect';
import { MilaLogo } from './MilaLogo';
import imgFooterIllustrstion1 from "figma:asset/172b9bdf4429e9780a0743b76be1fdd2d87b53b5.png";

export function AppFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#812f0f] relative w-full overflow-hidden font-sans">
        {/* Background Illustration - Precisely positioned as per import */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[393px] h-[370px] pointer-events-none">
             <img src={imgFooterIllustrstion1} alt="" className="w-full h-full object-cover" />
        </div>
        
        <RainEffect />

        {/* Main Content Container - Matches the 'Container' structure */}
        <div className="relative z-10 max-w-7xl mx-auto p-[24px] pt-[24px] pb-[23px] flex flex-col items-center pr-[24px] pl-[24px]">
            
            {/* Logo at the top */}
            <div className="w-full max-w-[1200px] flex justify-start mb-12">
                <Link to="/" onClick={scrollToTop} className="block text-white/90 hover:text-white transition-colors">
                     <MilaLogo className="h-12 w-auto" />
                </Link>
            </div>

            {/* Top Section: Brand & Links */}
            <div className="w-full max-w-[1200px] flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-24 mb-20">
                
                {/* Left Column: Brand & Newsletter */}
                <div className="flex flex-col gap-8 max-w-[345px]">
                    <div className="relative h-[98px] w-full">
                         <h2 className="absolute top-[4px] left-0 text-[48px] leading-[54px] tracking-[-2.4px] font-['Clash_Display_Variable',sans-serif] font-medium text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                            Smart Farming. <br/>
                            <span className="font-light">Zero Waste.</span>
                        </h2>
                    </div>
                    
                    <p className="font-['Mplus_1p',sans-serif] text-[18px] leading-[26px] text-white/70 font-light">
                        Empowering Indian farmers with data-driven insights.
                    </p>

                    <div className="h-[113px] relative w-full mt-4">
                        <div className="absolute top-0 left-0 w-full h-[50px] bg-white/5 border border-white/10 flex items-center px-6">
                             <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="w-full bg-transparent border-none text-[16px] text-white placeholder:text-white/20 focus:outline-none font-['Inter',sans-serif]"
                            />
                        </div>
                        <button className="absolute left-0 top-[65px] w-[190px] h-[48px] bg-white shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] flex items-center justify-center hover:bg-gray-100 transition-colors">
                            <span className="text-[#812f0f] text-[16px] font-medium font-['Inter',sans-serif]">Join Community</span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Links Grid */}
                <div className="flex flex-wrap gap-x-16 gap-y-12">
                     {/* Platform */}
                     <div className="flex flex-col gap-6 w-[148px]">
                        <h4 className="text-[12px] font-bold uppercase tracking-[1.2px] text-white/60 font-['Inter',sans-serif]">Platform</h4>
                        <ul className="flex flex-col gap-4">
                            <li><Link to="/how-it-works" onClick={scrollToTop} className="text-[14px] text-white/40 hover:text-white transition-colors uppercase tracking-[0.35px] font-['Inter',sans-serif]">How it Works</Link></li>
                            <li><Link to="/features" onClick={scrollToTop} className="text-[14px] text-white/40 hover:text-white transition-colors uppercase tracking-[0.35px] font-['Inter',sans-serif]">Features</Link></li>
                            <li><Link to="/impact" onClick={scrollToTop} className="text-[14px] text-white/40 hover:text-white transition-colors uppercase tracking-[0.35px] font-['Inter',sans-serif]">Impact</Link></li>
                            <li><Link to="/communities" onClick={scrollToTop} className="text-[14px] text-white/40 hover:text-white transition-colors uppercase tracking-[0.35px] font-['Inter',sans-serif]">Communities</Link></li>
                        </ul>
                     </div>

                     {/* Company */}
                     <div className="flex flex-col gap-6 w-[148px]">
                        <h4 className="text-[12px] font-bold uppercase tracking-[1.2px] text-white/60 font-['Inter',sans-serif]">Company</h4>
                        <ul className="flex flex-col gap-4">
                            <li><Link to="/about" onClick={scrollToTop} className="text-[14px] text-white/40 hover:text-white transition-colors uppercase tracking-[0.35px] font-['Inter',sans-serif]">About Us</Link></li>
                            <li><Link to="/contact" onClick={scrollToTop} className="text-[14px] text-white/40 hover:text-white transition-colors uppercase tracking-[0.35px] font-['Inter',sans-serif]">Contact</Link></li>
                        </ul>
                     </div>

                     {/* Connect */}
                     <div className="flex flex-col gap-6 w-[148px]">
                        <h4 className="text-[12px] font-bold uppercase tracking-[1.2px] text-white/60 font-['Inter',sans-serif]">Connect</h4>
                        <div className="flex gap-4">
                             <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-[34px] h-[34px] rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group">
                                <Instagram size={14} className="text-white/40 group-hover:text-white" />
                             </a>
                             <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-[34px] h-[34px] rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group">
                                <Twitter size={14} className="text-white/40 group-hover:text-white" />
                             </a>
                             <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-[34px] h-[34px] rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group">
                                <Linkedin size={14} className="text-white/40 group-hover:text-white" />
                             </a>
                             <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-[34px] h-[34px] rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group">
                                <Facebook size={14} className="text-white/40 group-hover:text-white" />
                             </a>
                        </div>
                     </div>
                </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-white/10 max-w-[1200px] mb-8" />

            {/* Bottom Section */}
            <div className="w-full max-w-[1200px] flex flex-col md:flex-row justify-between items-start md:items-end relative z-20 pb-12">
                
                {/* Legal & Status */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                         <Link to="#" className="text-[16px] font-medium text-white/40 hover:text-white transition-colors uppercase font-['Inter',sans-serif]">Privacy Policy</Link>
                         <Link to="#" className="text-[16px] font-medium text-white/40 hover:text-white transition-colors uppercase font-['Inter',sans-serif]">Terms of Service</Link>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-2">
                        <p className="text-[12px] text-white/40 font-['Inter',sans-serif]">© 2025 MILA</p>
                        <div className="flex items-center gap-2 text-[12px] font-['Inter',sans-serif]">
                            <span className="text-white/40 uppercase">System Status:</span>
                            <span className="text-[#ff7640] uppercase animate-pulse">Operational</span>
                        </div>
                    </div>
                </div>

                {/* Product By & Big Logo */}
                <div className="flex flex-col items-center md:items-end mt-12 md:mt-0 w-full md:w-auto">
                     <p className="text-[11px] font-semibold tracking-[4.4px] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white/20 via-[#ffc6b3] to-white/20 font-['Inter',sans-serif] mb-8 text-center md:text-right">
                        Product by MARESOLIK INC.
                    </p>
                    
                    <h1 className="font-['Merriweather',serif] font-bold text-[70px] leading-[1] text-white/5 tracking-[-3.5px] select-none pointer-events-none whitespace-nowrap">
                        MILA
                    </h1>
                </div>
            </div>
        </div>
    </div>
  );
}
