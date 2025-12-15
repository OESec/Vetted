import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '../types';

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "Vetted reduced our vendor onboarding time from 3 weeks to 2 days. The AI accuracy on ISO 27001 mapping is incredibly impressive.",
      author: "Sarah Jenkins",
      role: "CISO",
      company: "FinTech Global",
      image: "https://picsum.photos/100/100?random=1"
    },
    {
      id: 2,
      quote: "Finally, a tool that understands the context of security answers. It doesn't just look for keywords, it actually understands risk.",
      author: "Michael Chen",
      role: "Head of GRC",
      company: "CloudScale Inc.",
      image: "https://picsum.photos/100/100?random=2"
    },
    {
      id: 3,
      quote: "The audit trail feature alone is worth the subscription. Passing our own SOC2 audit was a breeze because we had every vendor review logged.",
      author: "Elena Rodriguez",
      role: "Security Analyst",
      company: "HealthPlus",
      image: "https://picsum.photos/100/100?random=3"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutralDark">Trusted by the experts</h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Card */}
          <div className="bg-neutralLight rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-sm">
            <Quote className="absolute top-8 left-8 text-primary/10 w-24 h-24 -z-0" />
            
            <div className="relative z-10 text-center">
              <p className="text-xl md:text-2xl font-medium text-neutralDark leading-relaxed mb-8">
                "{testimonials[activeIndex].quote}"
              </p>
              
              <div className="flex flex-col items-center">
                <img 
                  src={testimonials[activeIndex].image} 
                  alt={testimonials[activeIndex].author} 
                  className="w-16 h-16 rounded-full border-2 border-white shadow-md mb-4"
                />
                <h4 className="text-lg font-bold text-neutralDark">{testimonials[activeIndex].author}</h4>
                <p className="text-sm text-neutralDark/60">{testimonials[activeIndex].role}, {testimonials[activeIndex].company}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <button 
            onClick={prev}
            className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 p-3 rounded-full bg-white shadow-lg border border-gray-100 text-neutralDark hover:text-primary transition-colors focus:outline-none"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={next}
            className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 p-3 rounded-full bg-white shadow-lg border border-gray-100 text-neutralDark hover:text-primary transition-colors focus:outline-none"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === activeIndex ? 'bg-primary' : 'bg-gray-300'}`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;