
import React, { useState } from 'react';
import { ShieldCheck, Twitter, Linkedin, Github, X } from 'lucide-react';

const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'security' | 'cookies' | null>(null);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const LegalModal = () => {
    if (!activeModal) return null;

    const content = {
      privacy: {
        title: "Privacy Policy",
        text: "Vetted respects your privacy. We collect only essential information required to operate the service. Any data uploaded for analysis is processed in memory and not permanently stored on our servers for Starter plans. We do not sell your data to third parties."
      },
      terms: {
        title: "Terms of Service",
        text: "By using Vetted, you agree to our terms. The service is provided 'as-is' without warranties. You retain ownership of your data. We reserve the right to terminate accounts that violate usage policies or attempt to reverse-engineer the platform."
      },
      security: {
        title: "Security",
        text: "We utilize industry-standard encryption (AES-256) for all data at rest and TLS 1.3 for data in transit. Our infrastructure is hosted on AWS with strict access controls. Regular automated vulnerability scans are performed to ensure platform integrity."
      },
      cookies: {
        title: "Cookie Settings",
        text: "We use essential cookies to maintain your session and preferences. We may use anonymous analytics cookies to improve platform performance. You can disable non-essential cookies in your browser settings."
      }
    };

    const current = content[activeModal];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
          <button 
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-neutralDark"
          >
            <X size={20} />
          </button>
          <h3 className="text-xl font-bold text-neutralDark mb-4">{current.title}</h3>
          <p className="text-neutralDark/80 leading-relaxed text-sm">
            {current.text}
          </p>
          <div className="mt-6 text-right">
            <button 
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-neutralDark rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <footer className="bg-neutralDark text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <ShieldCheck className="text-primary" size={32} />
              <span className="text-2xl font-serif font-bold">Vetted</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Automating third-party risk management for the modern enterprise. Secure, fast, and intelligent.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Product</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="#features" onClick={(e) => handleScrollTo(e, 'features')} className="hover:text-primary transition-colors">Features</a>
              </li>
              <li>
                <a href="#pricing" onClick={(e) => handleScrollTo(e, 'pricing')} className="hover:text-primary transition-colors">Pricing</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><button onClick={() => setActiveModal('privacy')} className="hover:text-primary transition-colors text-left">Privacy Policy</button></li>
              <li><button onClick={() => setActiveModal('terms')} className="hover:text-primary transition-colors text-left">Terms of Service</button></li>
              <li><button onClick={() => setActiveModal('security')} className="hover:text-primary transition-colors text-left">Security</button></li>
              <li><button onClick={() => setActiveModal('cookies')} className="hover:text-primary transition-colors text-left">Cookie Settings</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Vetted Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
      
      <LegalModal />
    </footer>
  );
};

export default Footer;
