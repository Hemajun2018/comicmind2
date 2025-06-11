'use client';

import { useEffect } from 'react';

export function StagewiseToolbar() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // 动态导入stagewise工具栏
      import('@stagewise/toolbar').then(({ initToolbar }) => {
        const stagewiseConfig = {
          plugins: []
        };
        
        // 初始化工具栏
        initToolbar(stagewiseConfig);
      }).catch(error => {
        console.warn('Failed to initialize stagewise toolbar:', error);
      });
    }
  }, []);

  // 在开发模式下返回一个隐藏的div作为容器
  if (process.env.NODE_ENV === 'development') {
    return <div id="stagewise-toolbar-container" style={{ display: 'none' }} />;
  }

  return null;
} 