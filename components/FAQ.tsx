import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQItem } from '../types';

const FAQ: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      question: "Is my data secure?",
      answer: "Absolutely. We are SOC2 Type II certified. All data is encrypted AES-256 at rest and TLS 1.3 in transit. We perform regular penetration testing and vulnerability scans."
    },
    {
      question: "What file formats do you support?",
      answer: "We support .xlsx, .csv, and Google Sheets formats. Our parser is smart enough to identify questions and answer columns even in complex multi-tab spreadsheets."
    },
    {
      question: "Can I customize the risk scoring logic?",
      answer: "Yes. On the Growth and Enterprise plans, you can define custom risk rules, keywords to flag, and weightings for different security domains."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer a 14-day free trial on our Starter and Growth plans. No credit card is required to start testing the platform."
    },
    {
      question: "How does the AI work?",
      answer: "We use a combination of Large Language Models (LLMs) and deterministic rule sets. The AI understands the semantic meaning of vendor answers to map them against your security controls."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-neutralDark mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-100 rounded-xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 text-left focus:outline-none"
              >
                <span className="font-semibold text-neutralDark text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="text-primary flex-shrink-0" size={20} />
                ) : (
                  <Plus className="text-neutralDark/50 flex-shrink-0" size={20} />
                )}
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 pt-0 text-neutralDark/70 leading-relaxed bg-white">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;