import React from 'react';

const TrustBar: React.FC = () => {
  const logos = [
    "Acme Corp", "Global Bank", "TechFlow", "Nebula", "Fortress"
  ];
  
  // Placeholder images for standards
  const standards = [
    "SOC2", "ISO 27001", "GDPR", "HIPAA"
  ];

  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-neutralDark/40 uppercase tracking-wider mb-8">
          Trusted by security teams at industry leaders
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo, idx) => (
             <div key={idx} className="text-xl md:text-2xl font-serif font-bold text-neutralDark/60 flex items-center space-x-2">
                {/* Placeholder for actual SVGs */}
                <div className="w-8 h-8 bg-neutralDark/20 rounded-full"></div>
                <span>{logo}</span>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;