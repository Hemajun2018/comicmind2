import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  const footerSections = [
    {
      title: 'About us',
      links: [
        { name: 'Features', href: '/#features' },
        { name: 'Pricing', href: '/#pricing' },
        { name: 'FAQs', href: '/#faqs' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com', icon: Github },
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { name: 'YouTube', href: 'https://youtube.com', icon: Youtube },
  ];

  return (
    <footer className="bg-gradient-to-br from-neutral-bg to-neutral-card border-t border-border text-text">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        {/* Top section with logo and links */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Logo and description */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Image 
                src="/icon128.png"
                alt="ComicMind Logo"
                width={64}
                height={64}
                className="w-10 h-10"
              />
              <span className="text-2xl font-semibold">ComicMind</span>
            </Link>
            <p className="text-text-muted text-sm max-w-xs">
              Transforming your ideas into stunning mind maps with the power of AI.
            </p>
          </div>

          {/* Links grid - moved to the right */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-8 lg:justify-items-end">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-text-muted hover:text-primary transition-colors-smooth text-sm">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar with copyright */}
        <div className="flex justify-start py-6 border-t border-border">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Manthinking. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}