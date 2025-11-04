'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Hide Header and Footer on admin pages
  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    // Small delay to ensure content starts rendering
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      {/* Footer only appears after initial content load */}
      <div className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <Footer />
      </div>
    </div>
  );
}
