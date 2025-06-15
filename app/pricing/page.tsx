import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Shield, Heart, Sparkles, CreditCard } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Plans - ComicMind',
  description: 'Choose the perfect plan for your mind mapping needs. Start free or upgrade to Pro for unlimited access.',
};

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      badge: null,
      features: [
        '3 mind maps per day',
        'Basic comic styles (5 styles)',
        'Standard resolution exports',
        'Community support',
        'Public gallery sharing',
      ],
      limitations: [
        'Daily usage limits',
        'Basic styles only',
        'Standard resolution',
      ],
      buttonText: 'Get Started Free',
      buttonStyle: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/month',
      description: 'For serious mind mappers',
      badge: 'Most Popular',
      features: [
        'Unlimited mind map generation',
        'All premium comic styles (8+ styles)',
        'High-resolution exports (4K)',
        'Priority processing speed',
        'Commercial usage license',
        'Advanced editing tools',
        'Priority customer support',
        'Export to multiple formats',
        'Team collaboration (soon)',
        'API access (soon)',
      ],
      limitations: [],
      buttonText: 'Start Pro Trial',
      buttonStyle: 'bg-accent text-white hover-darken',
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-text mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto mb-8">
            Start free and upgrade anytime. No hidden fees, cancel whenever you want.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-text-muted">
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-green-500" />
              <span>30-day money back guarantee</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span>No setup fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-neutral-card rounded-2xl p-8 shadow-soft h-full flex flex-col ${
                  plan.popular ? 'ring-2 ring-accent scale-105' : ''
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-white px-4 py-1 text-sm font-medium">
                      <Sparkles className="w-4 h-4 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-text mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-5xl font-bold text-text">
                      {plan.price}
                    </span>
                    <span className="text-text-muted ml-1">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-text-muted">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex-grow mb-8">
                  <h4 className="font-semibold text-text mb-4">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mr-3 mt-0.5" />
                        <span className="text-text-muted">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.name === 'Free' ? '/create' : '/settings'}
                  className={`block w-full text-center px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${plan.buttonStyle} ${
                    plan.popular ? 'shadow-lg hover:shadow-xl' : ''
                  }`}
                >
                  {plan.buttonText}
                </Link>

                {plan.name === 'Pro' && (
                  <p className="text-center text-sm text-text-muted mt-3">
                    7-day free trial • Cancel anytime
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-neutral-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">
              Feature Comparison
            </h2>
            <p className="text-xl text-text-muted">
              See exactly what you get with each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-soft overflow-hidden">
              <thead>
                <tr className="bg-neutral-bg">
                  <th className="px-6 py-4 text-left font-semibold text-text">Features</th>
                  <th className="px-6 py-4 text-center font-semibold text-text">Free</th>
                  <th className="px-6 py-4 text-center font-semibold text-text">
                    <div className="flex items-center justify-center space-x-1">
                      <Crown className="w-4 h-4 text-accent" />
                      <span>Pro</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                {[
                  { feature: 'Daily mind maps', free: '3 per day', pro: 'Unlimited' },
                  { feature: 'Comic styles', free: '5 basic styles', pro: '8+ premium styles' },
                  { feature: 'Export resolution', free: 'Standard (1080p)', pro: 'High-res (4K)' },
                  { feature: 'Processing speed', free: 'Standard', pro: 'Priority (2x faster)' },
                  { feature: 'Commercial license', free: '❌', pro: '✅' },
                  { feature: 'Customer support', free: 'Community', pro: 'Priority email' },
                  { feature: 'Advanced editing', free: '❌', pro: '✅' },
                  { feature: 'Export formats', free: 'PNG only', pro: 'PNG, SVG, PDF' },
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-neutral-bg/50">
                    <td className="px-6 py-4 font-medium text-text">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-text-muted">{row.free}</td>
                    <td className="px-6 py-4 text-center text-text font-medium">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: 'Can I switch between plans?',
                answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, or at the end of your billing cycle for downgrades.',
              },
              {
                question: 'Is there a free trial for Pro?',
                answer: 'Yes, we offer a 7-day free trial for Pro plans. No credit card required to start, and you can cancel anytime during the trial.',
              },
              {
                question: 'What happens to my mind maps if I downgrade?',
                answer: 'All your existing mind maps remain accessible. However, you\'ll be limited to the Free plan restrictions for creating new ones.',
              },
              {
                question: 'Do you offer refunds?',
                answer: 'Yes, we offer a 30-day money-back guarantee for all Pro subscriptions. Contact our support team for assistance.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-neutral-card rounded-xl p-6 shadow-soft">
                <h3 className="font-semibold text-text mb-2">{faq.question}</h3>
                <p className="text-text-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Amazing Mind Maps?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who are already creating beautiful mind maps with ComicMind
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-neutral-bg transition-colors inline-flex items-center justify-center"
            >
              Start Free
            </Link>
            <Link
              href="/settings"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary transition-colors inline-flex items-center justify-center"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 