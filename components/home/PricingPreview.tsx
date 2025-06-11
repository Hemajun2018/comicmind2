import Link from 'next/link';
import { Check } from 'lucide-react';

export function PricingPreview() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for trying out ComicMind',
      features: [
        '3 mind maps per day',
        'Basic comic styles',
        'Standard resolution',
        'Community support',
      ],
      buttonText: 'Get Started',
      buttonStyle: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/month',
      description: 'For serious mind mappers',
      features: [
        'Unlimited mind maps',
        'All premium styles',
        'High-resolution exports',
        'Priority processing',
        'Commercial license',
        'Advanced editing',
      ],
      buttonText: 'Start Pro',
      buttonStyle: 'bg-accent text-white hover-darken',
      popular: true,
    },
  ];

  return (
    <section className="py-20 bg-neutral-bg">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-text mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-neutral-card rounded-xl p-8 shadow-soft ${
                plan.popular ? 'ring-2 ring-accent transform lg:scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-text mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-semibold text-text">
                    {plan.price}
                  </span>
                  <span className="text-text-muted ml-1">
                    {plan.period}
                  </span>
                </div>
                <p className="text-text-muted mt-2">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mr-3" />
                    <span className="text-text">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing"
                className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition-colors-smooth ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/pricing"
            className="text-primary hover:text-primary/80 font-medium transition-colors-smooth"
          >
            View full pricing details →
          </Link>
        </div>
      </div>
    </section>
  );
}