"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, Variants } from '../../lib/motion';
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
    <section id="listing-options" className="py-12 md:py-20 w-full relative scroll-mt-12">
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
              <div className="w-1.5 h-1.5 rounded-full bg-[#155e43]"></div>
              <span className="text-[11px] font-bold text-[#155e43] tracking-widest uppercase">
                Getting Started
              </span>
            </div>
            <h2 className="h2 font-extrabold text-gray-900 tracking-tight mb-3 sm:mb-5">
              How do you want to list your surplus?
            </h2>
            <p className="text-sm sm:text-base md:text-[17px] text-gray-500 leading-relaxed max-w-2xl">
              Click any method below to start listing instantly — Surplus Market handles the rest.
            </p>
          </motion.div>
        </div>

        {/* 2 Form Preview Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">

          {/* Card 1: Simple Inventory Listing */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="bg-white rounded-3xl p-6 sm:p-8 lg:p-9 border-2 border-[#155e43] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <span className="bg-[#155e43] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  RECOMMENDED
                </span>
                <span className="bg-[#ece8df] text-stone-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  FORM
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="h3 font-extrabold text-gray-900 mb-2 tracking-tight">
                Simple Inventory Listing
              </h3>
              <p className="text-stone-600 text-sm sm:text-[15px] leading-relaxed mb-6">
                Best for 1 to 10 items or small inventory. Quick and easy manual entry.
              </p>

              {/* Form Preview Container */}
              <div 
                onClick={handleSimpleListingClick}
                className="bg-[#f9f8f4] border border-[#e8e4db] rounded-2xl p-4 sm:p-5 mb-6 cursor-pointer hover:border-[#155e43]/40 transition-colors group select-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSimpleListingClick(); }}
              >
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-3 block">
                  PREVIEW OF THE FORM
                </span>

                <div className="space-y-2.5 text-xs sm:text-sm text-stone-500">
                  {/* Item Name */}
                  <div className="bg-white border border-[#e2ddd3] rounded-xl px-3.5 py-2.5 sm:py-3 shadow-2xs">
                    Item name
                  </div>

                  {/* Quantity & Condition (2 cols) */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-white border border-[#e2ddd3] rounded-xl px-3.5 py-2.5 sm:py-3 shadow-2xs">
                      Quantity
                    </div>
                    <div className="bg-white border border-[#e2ddd3] rounded-xl px-3.5 py-2.5 sm:py-3 shadow-2xs">
                      Condition
                    </div>
                  </div>

                  {/* Photos and media */}
                  <div className="bg-white border border-[#e2ddd3] rounded-xl px-3.5 py-2.5 sm:py-3 shadow-2xs">
                    Photos and media
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleSimpleListingClick}
              className="w-full bg-[#155e43] hover:bg-[#104833] text-white font-bold py-3.5 px-6 rounded-xl text-center text-sm sm:text-base flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span>Open Simple Listing Form</span>
              <span className="font-bold">→</span>
            </button>
          </motion.div>

          {/* Card 2: Lot Inventory Listing */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-3xl p-6 sm:p-8 lg:p-9 border border-gray-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <span className="bg-[#0f172a] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  &gt; 10 SKUS
                </span>
                <span className="bg-[#ece8df] text-stone-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  FORM
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="h3 font-extrabold text-gray-900 mb-2 tracking-tight">
                Lot Inventory Listing
              </h3>
              <p className="text-stone-600 text-sm sm:text-[15px] leading-relaxed mb-6">
                Only for more than 10 SKUs via spreadsheet upload. Built for bulk processing.
              </p>

              {/* Form Preview Container */}
              <div 
                onClick={handleLotListingClick}
                className="bg-[#f9f8f4] border border-[#e8e4db] rounded-2xl p-4 sm:p-5 mb-6 cursor-pointer hover:border-gray-400 transition-colors group select-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLotListingClick(); }}
              >
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-3 block">
                  PREVIEW OF THE FORM
                </span>

                <div className="space-y-2.5 text-xs sm:text-sm text-stone-500">
                  {/* Lot Name */}
                  <div className="bg-white border border-[#e2ddd3] rounded-xl px-3.5 py-2.5 sm:py-3 shadow-2xs">
                    Lot name
                  </div>

                  {/* Drop your spreadsheet here (Dropzone Mockup) */}
                  <div className="bg-white border border-dashed border-[#cfc9be] rounded-xl py-6 px-3 text-xs sm:text-sm text-stone-600 font-medium text-center flex items-center justify-center shadow-2xs">
                    Drop your spreadsheet here
                  </div>

                  {/* Photos and media */}
                  <div className="bg-white border border-[#e2ddd3] rounded-xl px-3.5 py-2.5 sm:py-3 shadow-2xs">
                    Photos and media
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleLotListingClick}
              className="w-full bg-[#0f172a] hover:bg-black text-white font-bold py-3.5 px-6 rounded-xl text-center text-sm sm:text-base flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span>Open Lot Listing Form</span>
              <span className="font-bold">→</span>
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
          setIsAuthModalOpen(false);
          setIsAuthMandatory(false);
          setPendingListingType(null);
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
