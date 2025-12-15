
import React, { useState } from 'react';
import { Check, Lock } from 'lucide-react';
import Button from './Button';

const Pricing: React.FC = () => {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-20 bg-neutralLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutralDark mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-neutralDark/70 mb-8">Choose the plan that fits your security team's scale.</p>
          
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm font-medium ${!annual ? 'text-neutralDark' : 'text-gray-400'}`}>Monthly</span>
            <button 
              onClick={() => setAnnual(!annual)}
              className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${annual ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${annual ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-sm font-medium ${annual ? 'text-neutralDark' : 'text-gray-400'}`}>Annual <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-0.5 rounded-full ml-1">-20%</span></span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter - Active */}
          <div className="bg-white rounded-2xl p-8 border-2 border-primary shadow-lg hover:shadow-xl transition-shadow flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
              Live Now
            </div>
            <h3 className="text-xl font-bold text-neutralDark mb-2">Starter</h3>
            <p className="text-sm text-gray-500 mb-6">For small teams just getting started.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-neutralDark">${annual ? '29' : '39'}</span>
              <span className="text-gray-500">/mo</span>
            </div>
            <Button variant="primary" className="w-full mb-8">Start Free Trial</Button>
            <ul className="space-y-4 flex-1">
              {['Up to 50 vendors/year', 'Standard AI Analysis', 'Email Support', '1 User Seat', 'Basic Export (PDF)'].map((feat, i) => (
                <li key={i} className="flex items-center text-sm text-neutralDark/80">
                  <Check size={16} className="text-success mr-3 flex-shrink-0" /> {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Growth - Coming Soon */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 opacity-75 relative flex flex-col grayscale-[0.5]">
             <div className="absolute inset-0 bg-white/40 z-10 pointer-events-none"></div>
             <div className="absolute top-4 right-4 z-20 bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center">
               <Lock size={12} className="mr-1" /> Coming Soon
             </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Growth</h3>
            <p className="text-sm text-gray-500 mb-6">For growing teams needing automation.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-400">${annual ? '69' : '79'}</span>
              <span className="text-gray-400">/mo</span>
            </div>
            <button disabled className="w-full py-3 px-6 rounded-lg bg-gray-200 text-gray-400 font-semibold cursor-not-allowed mb-8">Join Waitlist</button>
            <ul className="space-y-4 flex-1">
              {['Up to 200 vendors/year', 'Advanced Risk Customization', 'Slack & Jira Integrations', '5 User Seats', 'Priority Support', 'Audit Logs'].map((feat, i) => (
                <li key={i} className="flex items-center text-sm text-gray-400">
                  <Check size={16} className="text-gray-300 mr-3 flex-shrink-0" /> {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Enterprise - Coming Soon */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 opacity-75 relative flex flex-col grayscale-[0.5]">
            <div className="absolute inset-0 bg-white/40 z-10 pointer-events-none"></div>
             <div className="absolute top-4 right-4 z-20 bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center">
               <Lock size={12} className="mr-1" /> Coming Soon
             </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Enterprise</h3>
            <p className="text-sm text-gray-500 mb-6">For large organizations with strict compliance.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-400">Custom</span>
            </div>
            <button disabled className="w-full py-3 px-6 rounded-lg bg-gray-200 text-gray-400 font-semibold cursor-not-allowed mb-8">Contact Sales</button>
            <ul className="space-y-4 flex-1">
              {['Unlimited vendors', 'Custom AI Models', 'SSO (SAML/OAuth)', 'Unlimited Seats', 'Dedicated Success Manager', 'On-premise option'].map((feat, i) => (
                <li key={i} className="flex items-center text-sm text-gray-400">
                  <Check size={16} className="text-gray-300 mr-3 flex-shrink-0" /> {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
