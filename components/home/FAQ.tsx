'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does ComicMind work?',
      answer: 'ComicMind uses advanced AI to analyze your text content, extract key concepts, and automatically generate a structured mind map. You can then choose from various comic art styles to transform your mind map into an engaging visual representation.',
    },
    {
      question: 'What art styles are available?',
      answer: 'We offer 8+ unique styles including Doodle, Cartoon, Chalk Board, Watercolor, Healing/Zen, Hacker/Tech, Corporate, and Hand-drawn. Each style brings a different personality to your mind maps.',
    },
    {
      question: 'Can I edit the generated mind maps?',
      answer: 'Yes! After AI generates your initial structure, you can edit text, add or remove nodes, reorganize branches, and fine-tune the layout before generating the final comic visualization.',
    },
    {
      question: 'What languages do you support?',
      answer: 'ComicMind supports 8 languages: English, Chinese (Simplified & Traditional), Spanish, French, German, Japanese, Korean, and Portuguese. The AI understands context in all these languages.',
    },
    {
      question: 'How many mind maps can I create for free?',
      answer: 'Free users can create 3 mind maps per day without any account required. Pro users get unlimited generations with priority processing and high-resolution exports.',
    },
    {
      question: 'Can I use ComicMind for commercial purposes?',
      answer: 'Free tier is for personal use only. Pro subscribers get a commercial license allowing them to use generated mind maps in business presentations, educational materials, and commercial projects.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-neutral-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-text mb-4">
            Frequently asked questions
          </h2>
          <p className="text-xl text-text-muted">
            Everything you need to know about ComicMind
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-neutral-bg rounded-xl shadow-soft overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-neutral-card/50 transition-colors-smooth"
              >
                <span className="text-lg font-semibold text-text pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-text-muted flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-text-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-text-muted mb-4">
            Still have questions?
          </p>
          <Link
            href="/help"
            className="text-primary hover:text-primary/80 font-medium transition-colors-smooth"
          >
            Visit our help center →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Link({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}