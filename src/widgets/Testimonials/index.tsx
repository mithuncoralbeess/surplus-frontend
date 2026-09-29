"use client";

import React from 'react';
import TestimonialCard from '../../components/TestimonialCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { motion } from '../../lib/motion';
import 'swiper/css';
import 'swiper/css/pagination';

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Surplus Market has completely transformed how we liquidate our excess inventory. We're seeing 30% higher recovery rates and the platform's verification process ensures we only deal with serious buyers.",
    name: "Sarah Jenkins",
    role: "VP of Supply Chain",
    company: "GlobalTech Electronics",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    id: 2,
    quote: "Finding high-quality, verified wholesale lots used to take weeks of negotiation. Now, we can browse certified manifests and close deals in a matter of days. The transparency is unmatched.",
    name: "Michael Chen",
    role: "Director of Sourcing",
    company: "Retail Partners LLC",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    id: 3,
    quote: "The ESG impact reporting was a game-changer for our sustainability goals. Not only did we recover capital from our overstock, but we can easily track our diverted waste metrics.",
    name: "Elena Rodriguez",
    role: "Operations Manager",
    company: "EcoGoods Wholesale",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    id: 4,
    quote: "Selling surplus used to be a logistical nightmare. The AI enrichment automatically categorizes our bulk uploads, saving our team hours of manual data entry every single week.",
    name: "David Kim",
    role: "Head of Operations",
    company: "NextGen Distributors",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    id: 5,
    quote: "We've sourced pallet deals here that have yielded incredible margins. The condition reports are always dead-on accurate, giving us the confidence to buy in bulk.",
    name: "Marcus Wright",
    role: "Purchasing Director",
    company: "Discount Retail Hub",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80",
  }
];

const Testimonials = () => {
  return (
    <section className="w-full bg-[#f8fcf9] pt-24 pb-8 border-b border-gray-100 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary-alt/5 blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span className="text-[11px] font-bold text-primary tracking-widest uppercase">
              Our Testimonial
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            See how businesses are <span className="text-[#185545]">growing with us.</span>
          </h2>
          <p className="text-[16px] text-gray-600">
            See how top buyers and sellers are optimizing their inventory and recovering value through our intelligent platform.
          </p>
        </motion.div>

        {/* Testimonials Swiper */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="pb-4"
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="w-full !pb-12"
            style={{
              '--swiper-pagination-color': '#185545',
              '--swiper-pagination-bullet-inactive-color': '#cbd5e1'
            } as React.CSSProperties}
          >
            {TESTIMONIALS.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="h-auto">
                <TestimonialCard {...testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;
