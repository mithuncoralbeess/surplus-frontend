import React from 'react';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

export interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  company: string;
  image: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  role,
  company,
  image,
}) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-full transition-transform hover:-translate-y-1">
      {/* Stars & Quote Icon */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <Quote className="w-8 h-8 text-gray-200" />
      </div>

      {/* Quote Text */}
      <p className="text-gray-700 leading-relaxed mb-8 flex-1 italic text-[15px]">
        "{quote}"
      </p>

      {/* Author Profile */}
      <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-[14px] leading-tight">
            {name}
          </h4>
          <p className="text-[12px] text-gray-500 mt-0.5">
            {role}, <span className="font-medium text-gray-700">{company}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
