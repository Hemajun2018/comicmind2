'use client';

import { useEffect } from 'react';

export function StagewiseToolbar() {
  useEffect(() => {
    // Only load in development mode
    if (process.env.NODE_ENV === 'development') {
      // Dynamic import to ensure it's only loaded in development
      import('@stagewise/toolbar')
        .then(({ initToolbar }) => {
          const stagewiseConfig = {
            plugins: [],
          };
          
          // Initialize toolbar
          initToolbar(stagewiseConfig);
        })
        .catch((error) => {
          console.warn('Failed to initialize stagewise toolbar:', error);
        });
    }
  }, []);

  // Return null in all cases - the toolbar is managed by the imported library
  return null;
} 