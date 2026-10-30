"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, Variants } from '../../lib/motion';
import { LayoutList, FileSpreadsheet, ArrowRight, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { isProfileComplete } from '../../lib/profileUtils';

const SimpleListingModal = dynamic(() => import('../../components/SimpleListingModal'), { ssr: false });
const AuthModal = dynamic(() => import('../../components/AuthModal'), { ssr: false });
const LotImportModal = dynamic(() => import('../../components/LotImportModal'), { ssr: false });

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function InventoryListingOptions() {
  const [isSimpleModalOpen, setIsSimpleModalOpen] = useState(false);
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalStep, setAuthModalStep] = useState(1);
  const [isAuthMandatory, setIsAuthMandatory] = useState(false);
  const [pendingListingType, setPendingListingType] = useState<'simple' | 'lot' | null>(null);
  const { data: session } = useSession();

  const handleSimpleListingClick = () => {
    if (!session) {
      setPendingListingType('simple');
      setAuthModalStep(1);
      setIsAuthMandatory(false);
      setIsAuthModalOpen(true);
    } else if (!isProfileComplete(session.user)) {
      setPendingListingType('simple');
      setAuthModalStep(3);
      setIsAuthMandatory(true);
      setIsAuthModalOpen(true);
    } else {
      setIsSimpleModalOpen(true);
    }
  };

  const handleLotListingClick = () => {
    if (!session) {
      setPendingListingType('lot');
      setAuthModalStep(1);
      setIsAuthMandatory(false);
      setIsAuthModalOpen(true);
    } else if (!isProfileComplete(session.user)) {
      setPendingListingType('lot');
      setAuthModalStep(3);
      setIsAuthMandatory(true);
      setIsAuthModalOpen(true);
    } else {
      setIsLotModalOpen(true);
    }
  };

  return (
    <section className="py-12 md:py-20 w-full relative">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">

        {/* Header Section */}
        <div className="mb-10 sm:mb-14 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <span className="text-[11px] font-bold text-primary tracking-widest uppercase">
                Getting Started
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 sm:mb-5">
              How do you want to list your surplus?
            </h2>
            <p className="text-sm sm:text-base md:text-[17px] text-gray-500 leading-relaxed max-w-2xl">
              Click any method below to start listing instantly — Surplus Market handles the rest.
            </p>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

          {/* Simple Inventory Listing Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="group relative overflow-hidden bg-gradient-to-b from-[#f5fbf8] to-white border border-gray-200 rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-[#0a5c48]/5 hover:border-[#0a5c48]/30 flex flex-col justify-between"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#0a5c48]/5 rounded-full blur-3xl group-hover:bg-[#0a5c48]/10 transition-colors duration-500"></div>

            <div className="absolute top-5 right-5 sm:top-6 sm:right-6 lg:top-8 lg:right-8 bg-[#0a5c48] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3" />
              Recommended
            </div>

            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#0a5c48] rounded-2xl flex items-center justify-center mb-6 sm:mb-8 shadow-lg shadow-[#0a5c48]/20 group-hover:scale-110 transition-transform duration-500">
                <LayoutList className="text-white w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2 sm:mb-3 tracking-tight">
                Simple Inventory Listing
              </h3>
              <p className="text-sm sm:text-[16px] text-gray-500 mb-8 sm:mb-10 leading-relaxed max-w-sm">
                Best for 1 to 10 items or small inventory. Quick and easy manual entry.
              </p>
            </div>

            <button
              onClick={handleSimpleListingClick}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white border border-gray-200 text-gray-900 font-semibold px-6 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all group-hover:border-[#0a5c48]/30 group-hover:text-[#0a5c48] cursor-pointer"
            >
              <span>Use Simple Inventory Listing</span>
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Lot Inventory Listing Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.15 }}
            className="group relative overflow-hidden bg-gradient-to-b from-[#f5fbf8] to-white border border-gray-200 rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-[#0a5c48]/5 hover:border-[#0a5c48]/30 flex flex-col justify-between"
          >
            <div className="absolute top-5 right-5 sm:top-6 sm:right-6 lg:top-8 lg:right-8 bg-[#1e293b] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              &gt; 10 SKUS
            </div>

            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1e293b] rounded-2xl flex items-center justify-center mb-6 sm:mb-8 shadow-lg shadow-[#1e293b]/20 group-hover:scale-110 transition-transform duration-500">
                <FileSpreadsheet className="text-white w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2 sm:mb-3 tracking-tight">
                Lot Inventory Listing
              </h3>
              <p className="text-sm sm:text-[16px] text-gray-500 mb-8 sm:mb-10 leading-relaxed max-w-sm">
                Only for more than 10 SKUs via spreadsheet upload. Built for bulk processing.
              </p>
            </div>

            <button 
              onClick={handleLotListingClick} 
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white border border-gray-200 text-gray-900 font-semibold px-6 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all group-hover:text-gray-900 cursor-pointer"
            >
              <span>Use Lot Inventory Listing</span>
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

        </div>
      </div>

      {/* Modals */}
      <SimpleListingModal
        isOpen={isSimpleModalOpen}
        onClose={() => setIsSimpleModalOpen(false)}
      />
      <LotImportModal
        isOpen={isLotModalOpen}
        onClose={() => setIsLotModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          if (!isAuthMandatory) {
            setIsAuthModalOpen(false);
            setPendingListingType(null);
          }
        }}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setIsAuthMandatory(false);
          if (pendingListingType === 'simple') {
            setIsSimpleModalOpen(true);
          } else if (pendingListingType === 'lot') {
            setIsLotModalOpen(true);
          }
          setPendingListingType(null);
        }}
        initialStep={authModalStep}
        isMandatory={isAuthMandatory}
      />
    </section>
  );
}
