import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-400 mb-2">
            Payment Successful!
          </h1>
          <p className="text-green-300 mb-6">
            Welcome to ComicMind Pro! Your subscription is now active.
          </p>
          <Link
            href="/settings"
            className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 
                     text-white rounded-lg transition-colors"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    </div>
  );
} 