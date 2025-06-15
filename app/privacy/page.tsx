import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ComicMind',
  description: 'Privacy Policy for ComicMind. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-neutral-bg">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-text sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-lg text-text-muted">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className="mt-12 prose prose-lg text-text-muted mx-auto">
          <p>
            Welcome to ComicMind ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect on the Service includes:
          </p>
          <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and profile picture, that you voluntarily give to us when you register with the Service (e.g., through Google OAuth).</li>
            <li><strong>Usage Data:</strong> Information our servers automatically collect when you access the Service, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Service.</li>
            <li><strong>Generated Content:</strong> All text prompts, generated mind map structures, and final images created through our service are stored on our secure servers to provide you with the service and improve our AI models.</li>
          </ul>

          <h2>2. Use of Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:
          </p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Provide and deliver the products and services you request.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
            <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
          </ul>

          <h2>3. Disclosure of Your Information</h2>
          <p>
            We do not share your personal information with third parties except as described in this Privacy Policy. We may share information we have collected about you in certain situations:
          </p>
          <ul>
            <li><strong>With Your Consent:</strong> We may share your information with third parties when you have given us consent to do so.</li>
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf (e.g., Supabase for database and authentication, Vercel for hosting).</li>
          </ul>
          
          <h2>4. Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:support@comicmind.com">support@comicmind.com</a>
          </p>
        </div>
      </div>
    </div>
  );
} 