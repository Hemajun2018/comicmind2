import { Brain, Palette, Globe, Zap } from 'lucide-react';

export function FeatureCards() {
  const features = [
    {
      icon: Brain,
      title: 'AI Content Extraction',
      description: 'Smart AI analyzes your text and automatically creates structured mind map outlines with key concepts and relationships.',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Palette,
      title: 'Comic Rendering',
      description: 'Transform boring mind maps into engaging comic-style visuals with hand-drawn aesthetics and playful illustrations.',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Globe,
      title: '8 Language Support',
      description: 'Create mind maps in multiple languages including English, Chinese, Spanish, French, German, Japanese, Korean, and Portuguese.',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: Zap,
      title: 'Easy Generation',
      description: 'Create beautiful mind maps with simple text input. No complex software or professional design skills required.',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-semibold text-text mb-4">
          Why choose ComicMind?
        </h2>
        <p className="text-xl text-text-muted max-w-3xl mx-auto">
          Powerful AI meets creative design to make your ideas come alive in ways you never imagined.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-neutral-bg rounded-xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`${feature.bgColor} ${feature.color} rounded-xl p-3 w-fit mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">
                {feature.title}
              </h3>
              <p className="text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}