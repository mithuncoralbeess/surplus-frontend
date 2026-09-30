"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Wrench, 
  ShieldCheck, 
  Mail, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  MailCheck, 
  ArrowRight,
  Phone,
  MessageSquare,
  Sparkles,
  Server
} from 'lucide-react';
import { sanitizeInput } from '../../lib/security/sanitizer';

export default function MaintenanceWidget() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = sanitizeInput(email).trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail('');
    }, 600);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#051611] via-[#09241c] to-[#040f0c] text-white flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Decorative Glows & Patterns */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0a5c48]/20 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#14b875]/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-3xl w-full text-center space-y-8 relative z-10 my-auto">
        
        {/* Brand Logo Header */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-lg">
            <Image 
              src="/surplus_main_logo.png" 
              alt="Surplus Market Logo" 
              width={180} 
              height={40} 
              className="object-contain brightness-0 invert"
              priority 
            />
          </div>
        </div>
        
        {/* Animated Status Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-[#14b875]/20 rounded-full blur-xl animate-pulse"></div>
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-[#0c4033] to-[#062019] border border-[#14b875]/30 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(20,184,117,0.15)] relative z-10">
            <Wrench className="w-12 h-12 text-[#14b875] animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute -top-1 -right-1 bg-[#0a5c48] border-2 border-[#09241c] text-[#14b875] p-2 rounded-full shadow-lg">
            <Server className="w-4 h-4" />
          </div>
        </div>

        {/* Maintenance Badge */}
        <div>
          <div className="inline-flex items-center gap-2 bg-[#0c4033]/80 border border-[#14b875]/30 text-[#14b875] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#14b875] animate-ping"></span>
            System Upgrade In Progress
          </div>
        </div>

        {/* Heading & Paragraph */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            We'll Be Back Shortly
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
            Surplus Market is currently undergoing scheduled infrastructure enhancements and database optimizations to bring you a faster, safer, and seamless trading experience.
          </p>
        </div>

        {/* Subscription Form / Notification Box */}
        <div className="max-w-md mx-auto pt-2">
          {isSubmitted ? (
            <div className="p-4 bg-[#0c4033]/90 border border-[#14b875]/40 rounded-2xl text-white text-sm font-semibold flex items-center justify-center gap-2.5 animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 text-[#14b875] shrink-0" />
              <span>Thank you! Weâ€™ll notify you as soon as we are live.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <p className="text-xs text-gray-300 font-medium mb-2">
                Want to know when we are back online? Leave your email below:
              </p>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your work email address"
                  className="w-full pl-11 pr-32 py-3.5 bg-[#08261e] border border-[#14b875]/30 rounded-2xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#14b875] focus:ring-2 focus:ring-[#14b875]/20 transition-all shadow-inner"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#0a5c48] hover:bg-[#084838] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      Notify Me <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
              {error && <p className="text-red-400 text-xs text-left pl-2 pt-1">{error}</p>}
            </form>
          )}
        </div>

        {/* Action Buttons & Contact Desk */}
        <div className="pt-6 border-t border-white/10 space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 bg-[#0a5c48] hover:bg-[#0c6651] text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-[#0a5c48]/20"
            >
              <RefreshCw className="w-4 h-4" /> Check Status Now
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-full text-sm font-bold border border-white/15 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-[#14b875]" /> Contact Support Desk
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 pt-2">
            <span className="flex items-center gap-1.5">
              <MailCheck className="w-3.5 h-3.5 text-[#14b875]" /> support@surplusmarket.com
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#14b875]" /> +974 3026 9988
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

