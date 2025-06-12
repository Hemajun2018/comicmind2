'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Chrome } from 'lucide-react';
import Image from 'next/image';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    // Simulate Google OAuth flow
    try {
      // In a real implementation, you would integrate with Google OAuth
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would handle the actual Google authentication
      console.log('Google login initiated');
      
      // Close modal after successful login
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = () => {
    // For now, just show that email login is coming soon
    alert('Email login coming soon! Please use Google login for now.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary to-accent p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Image 
                src="/icon128.png"
                alt="ComicMind Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to ComicMind</h2>
            <p className="text-white/90">Sign in to unlock unlimited mind maps</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-xl font-semibold text-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Chrome className="w-6 h-6 text-[#4285F4]" />
              )}
              <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Email Login Button */}
            <button
              onClick={handleEmailLogin}
              className="w-full flex items-center justify-center space-x-3 bg-neutral-bg border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-xl font-semibold text-lg hover:border-accent hover:bg-accent/5 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Mail className="w-6 h-6 text-accent" />
              <span>Continue with Email</span>
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">What you'll get:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Unlimited mind map generations</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span>High-resolution exports</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full" />
                <span>Priority processing</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Save and organize your mind maps</span>
              </li>
            </ul>
          </div>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}