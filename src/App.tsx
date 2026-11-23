import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhitepaperModal } from './components/WhitepaperModal';
import { ConsultationModal } from './components/ConsultationModal';
import { HomePage } from './pages/HomePage';
import { TechnologyPage } from './pages/TechnologyPage';
import { SolutionsPage } from './pages/SolutionsPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { WhitepapersPage } from './pages/WhitepapersPage';
import { CompanyPage } from './pages/CompanyPage';
import { WHITEPAPERS } from './data/bloomData';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedWhitepaperId, setSelectedWhitepaperId] = useState<string | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationPrefill, setConsultationPrefill] = useState<{ industry: string; capacity: number }>({
    industry: 'AI & 하이퍼스케일 데이터센터',
    capacity: 10,
  });

  // Sync with browser URL Hash (#home, #technology, #solutions, etc.)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      const validPages: PageId[] = ['home', 'technology', 'solutions', 'sustainability', 'whitepapers', 'company'];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWhitepaper = (id: string) => {
    setSelectedWhitepaperId(id);
  };

  const handleOpenConsultationWithParams = (industry: string, capacity: number) => {
    setConsultationPrefill({ industry, capacity });
    setIsConsultationOpen(true);
  };

  const selectedWhitepaper = WHITEPAPERS.find((w) => w.id === selectedWhitepaperId) || null;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#8CC63F]/20 selection:text-[#002D56]">
      {/* Top Bar Header with Navigation */}
      <Header
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      {/* Main Content Area with Smooth Page Transitions */}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <HomePage
                onNavigate={navigateTo}
                onOpenWhitepaper={handleOpenWhitepaper}
                onOpenConsultation={() => setIsConsultationOpen(true)}
              />
            </motion.div>
          )}

          {currentPage === 'technology' && (
            <motion.div
              key="technology"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <TechnologyPage
                onNavigate={navigateTo}
                onOpenWhitepaper={handleOpenWhitepaper}
                onOpenConsultation={() => setIsConsultationOpen(true)}
              />
            </motion.div>
          )}

          {currentPage === 'solutions' && (
            <motion.div
              key="solutions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <SolutionsPage
                onNavigate={navigateTo}
                onOpenConsultationWithParams={handleOpenConsultationWithParams}
                onOpenWhitepaper={handleOpenWhitepaper}
              />
            </motion.div>
          )}

          {currentPage === 'sustainability' && (
            <motion.div
              key="sustainability"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <SustainabilityPage
                onNavigate={navigateTo}
                onOpenWhitepaper={handleOpenWhitepaper}
                onOpenConsultation={() => setIsConsultationOpen(true)}
              />
            </motion.div>
          )}

          {currentPage === 'whitepapers' && (
            <motion.div
              key="whitepapers"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <WhitepapersPage
                onNavigate={navigateTo}
                onOpenWhitepaper={handleOpenWhitepaper}
                selectedWhitepaperId={selectedWhitepaperId || undefined}
              />
            </motion.div>
          )}

          {currentPage === 'company' && (
            <motion.div
              key="company"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <CompanyPage
                onNavigate={navigateTo}
                onOpenConsultation={() => setIsConsultationOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Modals */}
      <WhitepaperModal
        whitepaper={selectedWhitepaper}
        onClose={() => setSelectedWhitepaperId(null)}
        onOpenConfigurator={() => navigateTo('solutions')}
      />

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        initialIndustry={consultationPrefill.industry}
        initialCapacity={consultationPrefill.capacity}
      />

      {/* Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />
    </div>
  );
}
