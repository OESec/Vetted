import React from 'react';
import { Shield, Zap, SlidersHorizontal, History, Globe, Lock } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Shield className="text-primary" />,
      title: "Bank-Grade Security",
      desc: "SOC2 Type II certified. Data encrypted at rest and in transit. Single-tenant options available."
    },
    {
      icon: <Zap className="text-warning" />,
      title: "Instant Automation",
      desc: "Reduce manual review time by 80%. AI automatically categorizes risks based on your policy."
    },
    {
      icon: <SlidersHorizontal className="text-accent" />,
      title: "Custom Logic",
      desc: "Define your own risk thresholds. Flag specific keywords or missing certifications automatically."
    },
    {
      icon: <History className="text-purple-500" />,
      title: "Full Audit Trail",
      desc: "Every change, comment, and approval is logged. Export detailed audit logs for compliance."
    },
    {
      icon: <Globe className="text-blue-400" />,
      title: "Seamless Integrations",
      desc: "Connects with Salesforce, HubSpot, Jira, and Slack. Push findings directly to your workflow."
    },
    {
      icon: <Lock className="text-green-500" />,
      title: "Knowledge Base",
      desc: "Stop answering the same questions. The system learns from past questionnaires to auto-fill answers."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutralDark mb-4">
            Everything you need to scale vendor risk
          </h2>
          <p className="text-lg text-neutralDark/70 max-w-2xl mx-auto">
            Powerful features designed for modern security teams who can't afford to be the bottleneck.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/5 transition-colors">
                {React.cloneElement(feature.icon as React.ReactElement, { size: 24 })}
              </div>
              <h3 className="text-xl font-bold text-neutralDark mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-neutralDark/70 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;