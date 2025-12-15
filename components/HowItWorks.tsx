
import React from 'react';
import { CloudUpload, Cpu, FileCheck } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <FileCheck size={32} />,
      title: "1. Define Standards",
      description: "First, upload your 'Master' spreadsheet containing your ideal answers. This establishes the ground truth for your security policy.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <CloudUpload size={32} />,
      title: "2. Upload Vendor Responses",
      description: "Drag and drop any vendor questionnaire (Excel, CSV). Our parser instantly maps their columns to your standard.",
      color: "bg-blue-100 text-primary"
    },
    {
      icon: <Cpu size={32} />,
      title: "3. AI Gap Analysis",
      description: "Our engine compares the vendor's answers against your Master Standard, automatically flagging risks and missing evidence.",
      color: "bg-teal-100 text-accent"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-neutralLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutralDark mb-4">How it works</h2>
          <p className="text-lg text-neutralDark/70 max-w-2xl mx-auto">
            Setup your standard once, then automate every review.
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
