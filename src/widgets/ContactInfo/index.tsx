"use client";

import React from 'react';
import { motion, Variants } from '../../lib/motion';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Headphones, 
  ShoppingBag, 
  Tag, 
  Truck, 
  Newspaper,
  Globe2,
  ShieldCheck
} from 'lucide-react';

const OFFICES = [
  {
    city: "Dubai Headquarters",
    country: "United Arab Emirates",
    address: "Level 14, Al Khatem Tower, ADGM Square, Dubai",
    phone: "+971 (4) 123-4567",
    email: "dubai@surplusmarket.com",
    hours: "Sun - Thu: 8:30 AM - 6:00 PM GST",
    isHQ: true
  },
  {
    city: "Riyadh Regional Office",
    country: "Kingdom of Saudi Arabia",
    address: "Building 4, King Abdullah Financial District (KAFD), Riyadh",
    phone: "+966 (11) 987-6543",
    email: "riyadh@surplusmarket.com",
    hours: "Sun - Thu: 9:00 AM - 6:00 PM AST",
    isHQ: false
  },
  {
    city: "International Operations Hub",
    country: "London & Global Desk",
    address: "100 Bishopsgate, London EC2N 4AG, United Kingdom",
    phone: "+44 (20) 7946-0912",
    email: "global@surplusmarket.com",
    hours: "Mon - Fri: 8:00 AM - 5:00 PM GMT",
    isHQ: false
  }
];

const CHANNELS = [
  {
    title: "Buyer Support",
    icon: ShoppingBag,
    description: "Assistance with bidding, buying lots, inspection reports, and order tracking.",
    email: "buyers@surplusmarket.com",
    badge: "24h SLA Response"
  },
  {
    title: "Seller & Vendor Desk",
    icon: Tag,
    description: "Help listing surplus inventory, manifest imports, and valuation reviews.",
    email: "sellers@surplusmarket.com",
    badge: "Dedicated Account Desk"
  },
  {
    title: "Logistics & Freight",
    icon: Truck,
    description: "Queries regarding LTL/FTL shipping, freight quotes, and warehouse dispatch.",
    email: "logistics@surplusmarket.com",
    badge: "Real-time Tracking"
  },
  {
    title: "Media & Press",
    icon: Newspaper,
    description: "Press releases, brand assets, media inquiries, and conference requests.",
    email: "press@surplusmarket.com",
    badge: "PR Team"
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function ContactInfo() {
  return (
    <section className="w-full pt-20 pb-16 bg-gray-50/50">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#e0f0e9] px-3.5 py-1.5 rounded-full mb-4">
            <Globe2 className="w-4 h-4 text-[#0a5c48]" />
            <span className="text-xs font-bold text-[#0a5c48] uppercase tracking-wider">Global Support & Presence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            We’re Here to Help You Navigate Surplus Inventory
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Reach out directly to our dedicated regional hubs or support desks for tailored assistance with listings, procurement, freight, or partnerships.
          </p>
        </motion.div>

        {/* Global Offices */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {OFFICES.map((office, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between group"
            >
              {office.isHQ && (
                <span className="absolute top-4 right-4 bg-[#0a5c48] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Global HQ
                </span>
              )}
              
              <div>
                <div className="w-12 h-12 bg-[#e0f0e9] text-[#0a5c48] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-1">{office.city}</h3>
                <p className="text-sm font-semibold text-[#0a5c48] mb-6">{office.country}</p>
                
                <div className="space-y-3 text-sm text-gray-600 mb-8">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                    <span>{office.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <a href={`tel:${office.phone}`} className="hover:text-[#0a5c48] transition-colors">{office.phone}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <a href={`mailto:${office.email}`} className="hover:text-[#0a5c48] transition-colors">{office.email}</a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-medium text-gray-500">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>{office.hours}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Contact Support Channels */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">Dedicated Department Support Desks</h3>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {CHANNELS.map((channel, idx) => {
              const Icon = channel.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:border-[#0a5c48]/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-gray-100 text-[#0a5c48] rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-[#0a5c48] bg-[#e0f0e9] px-2.5 py-1 rounded-md">
                        {channel.badge}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 mb-2">{channel.title}</h4>
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">{channel.description}</p>
                  </div>

                  <a 
                    href={`mailto:${channel.email}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#0a5c48] hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    {channel.email}
                  </a>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
