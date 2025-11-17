import React from 'react';

interface BackgroundAnimationProps {
  orbOpacity?: number;
  gridOpacity?: number;
}

export function BackgroundAnimation({ orbOpacity = 60, gridOpacity = 40 }: BackgroundAnimationProps) {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0f0a1f] to-[#0a0a0f]"></div>

      {/* Animated gradient orbs */}
      <div 
        className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-blob"
        style={{ opacity: orbOpacity / 100 }}
      ></div>

      <div 
        className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"
        style={{ opacity: orbOpacity / 100 }}
      ></div>

      <div 
        className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"
        style={{ opacity: orbOpacity / 100 }}
      ></div>

      <div 
        className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-6000"
        style={{ opacity: orbOpacity / 100 }}
      ></div>

      {/* Additional smaller orbs for depth */}
      <div 
        className="absolute top-1/2 left-1/2 w-[32rem] h-[32rem] bg-purple-400 rounded-full mix-blend-screen filter blur-3xl animate-blob-slow"
        style={{ opacity: (orbOpacity * 0.83) / 100 }}
      ></div>

      <div 
        className="absolute top-1/3 right-1/3 w-80 h-80 bg-blue-400 rounded-full mix-blend-screen filter blur-3xl animate-blob-slow animation-delay-3000"
        style={{ opacity: (orbOpacity * 0.83) / 100 }}
      ></div>

      {/* Subtle grid overlay for depth */}
      <div 
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"
        style={{ opacity: gridOpacity / 100 }}
      ></div>
    </div>
  );
}

