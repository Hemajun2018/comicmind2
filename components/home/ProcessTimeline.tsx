import { FileText, Brain, Edit, Palette } from 'lucide-react';

export function ProcessTimeline() {
  const steps = [
    {
      icon: FileText,
      title: 'Input Content',
      description: 'Paste your text, article, or ideas into our smart editor',
      color: 'text-primary',
      bgColor: 'bg-primary',
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our AI extracts key concepts and creates a structured outline',
      color: 'text-accent',
      bgColor: 'bg-accent',
    },
    {
      icon: Edit,
      title: 'Edit Structure',
      description: 'Fine-tune your mind map structure with our visual editor',
      color: 'text-secondary',
      bgColor: 'bg-secondary',
    },
    {
      icon: Palette,
      title: 'Generate Comic',
      description: 'Choose your style and watch your mind map come to life',
      color: 'text-primary',
      bgColor: 'bg-primary',
    },
  ];

  return (
    <section className="py-20 bg-neutral-bg">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-text mb-4">
            How it works
          </h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            From text to comic mind map in 4 simple steps. No design experience needed.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-border transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Timeline connector */}
                  <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className={`${step.bgColor} rounded-full p-4 shadow-soft`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Card */}
                  <div className="bg-neutral-card rounded-xl p-6 shadow-soft mt-16 lg:mt-24">
                    <div className="lg:hidden mb-4">
                      <div className={`${step.bgColor} ${step.color} rounded-xl p-3 w-fit`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="text-center lg:text-left">
                      <div className="text-sm font-medium text-text-muted mb-2">
                        Step {index + 1}
                      </div>
                      <h3 className="text-xl font-semibold text-text mb-3">
                        {step.title}
                      </h3>
                      <p className="text-text-muted leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}