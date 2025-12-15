import React from 'react';
import { UploadCloud, Cpu, FileText } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <UploadCloud size={32} />,
      title: "1. Upload Spreadsheet",
      description: "Drag and drop any vendor questionnaire (Excel, CSV). Our parser instantly maps columns and identifies questions.",
      color: "bg-blue-100 text-primary"
    },
    {
      icon: <Cpu size={32} />,
      title: "2. AI Analysis",
      description: "Our engine checks answers against your knowledge base, flags risks, and generates compliance scores automatically.",
      color: "bg-teal-100 text-accent"
    },
    {
      icon: <FileText size={32} />,
      title: "3. Export & Share",
      description: "Review the pre-filled report, adjust if needed, and export a polished response back to the vendor or procurement.",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-neutralLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutralDark mb-4">How it works</h2>
          <p className="text-lg text-neutralDark/70 max-w-2xl mx-auto">
            From raw spreadsheet to risk assessment in three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200 -z-10"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center group">
              <div className={`w-24 h-24 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-neutralDark mb-3">{step.title}</h3>
              <p className="text-neutralDark/70 leading-relaxed px-4">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;