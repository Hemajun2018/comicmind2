import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ComicMind',
  description: 'Terms of Service for ComicMind. Read the terms and conditions for using our service.',
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-neutral-bg">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-text sm:text-5xl">Terms of Service</h1>
          <p className="mt-4 text-lg text-text-muted">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className="mt-12 prose prose-lg text-text-muted mx-auto">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using ComicMind ("the Service"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to all of these terms, do not use the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            ComicMind provides users with AI-powered tools to generate mind maps and other visual content. You understand and agree that the Service is provided "AS-IS" and that we assume no responsibility for the timeliness, deletion, mis-delivery, or failure to store any user communications or personalization settings.
          </p>

          <h2>3. User Account</h2>
          <p>
            You are responsible for safeguarding your account. You agree that you will not disclose your password to any third party and that you will take sole responsibility for any activities or actions under your account, whether or not you have authorized such activities or actions.
          </p>

          <h2>4. User Conduct</h2>
          <p>
            You agree not to use the Service to create any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable. We reserve the right to terminate accounts that are found to be in violation of these terms.
          </p>
          
          <h2>5. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of ComicMind and its licensors. You retain ownership of the content you create using the Service. However, by using the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display the content solely for the purpose of operating and improving the Service.
          </p>
          
          <h2>6. Termination</h2>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2>7. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms of Service on this page.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at: <a href="mailto:support@comicmind.com">support@comicmind.com</a>
          </p>
        </div>
      </div>
    </div>
  );
} 