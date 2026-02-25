import React from 'react';
import { ShieldCheck, Users, ClipboardList, BrainCircuit, AlertTriangle, BookOpen, ArrowRight } from 'lucide-react';

const governancePillars = [
  {
    icon: ShieldCheck,
    title: 'Data Governance & Integrity',
    description: 'Vetted establishes a strong foundation by standardizing the data collection process. By providing structured templates and a clear upload process, we ensure that the training data (vendor responses) for our AI analysis is consistent, complete, and high-quality, which is critical for accurate and unbiased risk detection.'
  },
  {
    icon: Users,
    title: 'Executive Accountability & Board Oversight',
    description: 'The platform provides clear, quantifiable risk metrics (e.g., Security Score, Critical Risk counts) and detailed reports. This empowers board members and executives, who may not be security experts, to quickly grasp the organization\'s third-party risk posture, facilitating informed decision-making and effective oversight.'
  },
  {
    icon: ClipboardList,
    title: 'Systematic Risk Management',
    description: 'Vetted is a systematic risk management engine. It automates the classification of AI-identified risks (High, Medium, Low) and provides a formal, repeatable assessment process. The platform\'s analysis serves as a crucial impact assessment, making compliance with internal policies and external regulations straightforward.'
  },
  {
    icon: BrainCircuit,
    title: 'Human-in-the-Loop Oversight',
    description: 'While the AI provides the initial assessment, the final decision-making power always rests with a human. The platform presents the AI\'s findings and recommendations, but security personnel are expected to review, validate, and if necessary, override these conclusions, ensuring human control over the final audit decision.'
  },
  {
    icon: AlertTriangle,
    title: 'Mandatory Incident Reporting',
    description: 'The platform\'s detailed reports and historical data serve as a rigorous log of all third-party assessments. In the event of a supplier-related incident, these reports provide critical, time-stamped evidence of the due diligence performed, helping to meet the 72-hour reporting requirements of frameworks like GDPR.'
  },
  {
    icon: BookOpen,
    title: 'AI Literacy & Organisational Culture',
    description: 'By abstracting the complexity of AI analysis into a simple, intuitive interface, Vetted improves the AI literacy of the entire organization. It enables staff in procurement, legal, and compliance to engage with and understand AI-driven risk assessments, fostering a culture of security awareness across all departments.'
  }
];

const GovernanceView: React.FC = () => {
  return (
    <div className="animate-fade-in-up space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <h1 className="text-3xl font-bold text-neutralDark dark:text-white">The 6 Pillars of Corporate AI Governance</h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
          How Vetted aligns with a high-level blueprint for compliant AI frameworks.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {governancePillars.map((pillar, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
            <div className="flex items-center mb-4">
              <pillar.icon className="w-8 h-8 text-primary mr-4" />
              <h2 className="text-lg font-bold text-neutralDark dark:text-white">{pillar.title}</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>

       <div className="bg-primary/10 dark:bg-primary/20 rounded-xl border border-primary/20 dark:border-primary/30 p-6 text-center">
          <h3 className="text-xl font-bold text-primary dark:text-white">Built for Trust & Compliance</h3>
          <p className="mt-2 text-primary/80 dark:text-primary/90 max-w-3xl mx-auto">
            Vetted is designed not just to automate, but to provide the structure and evidence necessary for modern regulatory landscapes.
          </p>
       </div>

    </div>
  );
};

export default GovernanceView;
