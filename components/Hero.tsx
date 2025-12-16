import React from 'react';
import Button from './Button';
import { FileSpreadsheet, CircleCheck, ShieldAlert, Zap } from 'lucide-react';

interface HeroProps {
  onNavigateToApp?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigateToApp }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-b from-neutralLight via-white to-white">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              New: ISO 27001 Auto-Mapping
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-neutralDark leading-tight mb-6">
              Automate Security Questionnaire Reviews in <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Minutes</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-neutralDark/70 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Upload any spreadsheet. Get validated, prioritised feedback and evidence requests—instantly. Eliminate the vendor risk bottleneck.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <Button onClick={onNavigateToApp} variant="primary" size="lg" icon>Start Free Trial</Button>
              <Button onClick={onNavigateToApp} variant="secondary" size="lg">Request Live Demo</Button>
            </div>
          </div>

          {/* Right Column: Interactive Visual */}
          <div className="relative animate-fade-in-up delay-200 hidden md:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main Card */}
              <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-float">
                {/* Header of fake UI */}
                <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center px-4 space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                
                {/* Body of fake UI */}
                <div className="p-6 flex-1 flex flex-col relative">
                  {/* Upload Step */}
                  <div className="absolute top-8 left-8 right-8 p-4 border-2 border-dashed border-primary/30 bg-primary/5 rounded-xl flex items-center justify-center space-x-3 text-primary animate-[pulse_3s_infinite]">
                    <FileSpreadsheet />
                    <span className="font-medium">vendor_security_assessment.xlsx</span>
                  </div>

                  {/* Processing Animation Lines */}
                  <div className="mt-24 space-y-3">
                    <div className="h-2 bg-gray-100 rounded w-3/4 overflow-hidden">
                       <div className="h-full bg-primary animate-[width_2s_ease-in-out_infinite] w-0"></div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded w-full overflow-hidden">
                       <div className="h-full bg-accent animate-[width_2.5s_ease-in-out_infinite_0.2s] w-0"></div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded w-5/6 overflow-hidden">
                       <div className="h-full bg-primary animate-[width_2.2s_ease-in-out_infinite_0.4s] w-0"></div>
                    </div>
                  </div>

                  {/* Result Badge Popup */}
                  <div className="absolute bottom-8 right-8 glass-card p-4 rounded-xl shadow-lg flex items-center space-x-3 transform translate-y-2 animate-[bounce_3s_infinite]">
                    <div className="bg-success/10 p-2 rounded-full text-success">
                      <CircleCheck size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase font-bold">Risk Score</div>
                      <div className="font-bold text-neutralDark">Low Risk (92/100)</div>
                    </div>
                  </div>
                  
                  {/* Alert Badge Popup */}
                   <div className="absolute bottom-24 left-4 glass-card p-3 rounded-lg shadow-md flex items-center space-x-2 transform -rotate-2 animate-pulse">
                    <div className="bg-warning/10 p-1.5 rounded-full text-warning">
                      <ShieldAlert size={16} />
                    </div>
                    <div className="text-xs font-semibold text-neutralDark">Missing SOC2 Type II</div>
                  </div>

                </div>
              </div>

              {/* Decorative elements behind */}
              <div className="absolute -z-10 -right-8 top-20 bg-accent/20 w-24 h-24 rounded-full blur-xl"></div>
              <div className="absolute -z-10 -left-8 bottom-20 bg-primary/20 w-32 h-32 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;