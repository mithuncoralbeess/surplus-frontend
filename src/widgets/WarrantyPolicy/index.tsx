import React from 'react';
import CommonBanner from '../CommonBanner';
import { 
  ShieldCheck, 
  Wrench, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  RefreshCcw, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

export default function WarrantyPolicyWidget() {
  return (
    <div className="w-full flex flex-col items-center bg-gray-50/50">
      <CommonBanner 
        title="Service and Warranty Policy"
        subtitle="This Service and Warranty Policy outlines the terms and conditions under which our products are serviced and the warranty period associated with each product."
        align="center"
        image="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Service and Warranty Policy' }
        ]}
      />

      <section className="w-full py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm space-y-12">
            
            {/* Introduction Box */}
            <div className="bg-[#e0f0e9]/50 border border-[#0a5c48]/20 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-3 text-[#0a5c48]">
                <ShieldCheck className="w-6 h-6 shrink-0" />
                <h2 className="text-xl font-bold text-gray-900">Service and Warranty Overview</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                This Service and Warranty Policy outlines the terms and conditions under which our products are serviced and the warranty period associated with each product. By using our services or purchasing our products, you agree to these terms.
              </p>
            </div>

            {/* 1. Service Overview */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <Wrench className="w-6 h-6 text-[#0a5c48]" /> 1. Service Overview
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                We offer comprehensive services to ensure the optimal performance of our products. This includes technical support, maintenance, and repair services, subject to the terms and conditions outlined in this policy.
              </p>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <strong className="block text-sm font-bold text-gray-900 mb-1">1.1 Eligibility for Service</strong>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600 list-disc list-inside">
                  <li>Products must be within the warranty period or covered under an extended service agreement.</li>
                  <li>Proof of purchase (such as a receipt or invoice) must be provided.</li>
                  <li>Services are only available to products purchased from our authorized distributors or directly from our website.</li>
                </ul>
              </div>
            </section>

            {/* 2. Warranty Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#0a5c48]" /> 2. Warranty Information
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <strong className="block text-sm font-bold text-gray-900 mb-1">2.1 Standard Warranty</strong>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Our products come with a standard 12-month warranty starting from the date of purchase. This warranty covers any manufacturing defects or malfunctions during normal usage.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="p-4 bg-white border border-gray-200 rounded-xl">
                      <strong className="block text-xs font-bold text-[#0a5c48] uppercase tracking-wider mb-2">What is Covered</strong>
                      <ul className="text-xs sm:text-sm text-gray-600 space-y-2 list-disc list-inside">
                        <li>Manufacturing defects</li>
                        <li>Non-functioning components</li>
                        <li>Mechanical or electrical failures due to normal use</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-white border border-gray-200 rounded-xl">
                      <strong className="block text-xs font-bold text-red-500 uppercase tracking-wider mb-2">What is Not Covered</strong>
                      <ul className="text-xs sm:text-sm text-gray-600 space-y-2 list-disc list-inside">
                        <li>Accidental damage or misuse</li>
                        <li>Damage caused by unauthorized repairs or modifications</li>
                        <li>Damage from environmental conditions such as floods or power surges</li>
                        <li>Cosmetic damage (scratches, dents, etc.)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <strong className="block text-sm font-bold text-gray-900 mb-1">2.2 Extended Warranty</strong>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    You can purchase an extended warranty, which provides coverage for up to an additional 24 months beyond the standard warranty. The extended warranty must be purchased within 30 days of the original purchase date.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                  <strong className="block text-sm font-bold text-gray-900 mb-1">Claiming Warranty Service</strong>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    If you believe your product is eligible for warranty service, you can contact our service team through one of the following channels:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0a5c48] shrink-0" />
                      <span><strong>By email:</strong> support@surplusmarket.com</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0a5c48] shrink-0" />
                      <span><strong>By phone:</strong> +974 3026 9988</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0a5c48] shrink-0" />
                      <span><strong>By visiting the service request page:</strong> <a href="/contact" className="text-[#0a5c48] font-semibold underline">Service Request Page</a></span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. Repair and Replacement Policy */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <RefreshCcw className="w-6 h-6 text-[#0a5c48]" /> 3. Repair and Replacement Policy
              </h2>

              <div className="space-y-4 pt-2">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <strong className="block text-sm font-bold text-gray-900 mb-1">3.1 Repair Services</strong>
                  <p className="text-xs sm:text-sm text-gray-600">If a product is repairable under warranty, our service team will repair it free of charge. In case the product is out of warranty, repair fees will apply as per the service price list.</p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <strong className="block text-sm font-bold text-gray-900 mb-1">3.2 Replacement Services</strong>
                  <p className="text-xs sm:text-sm text-gray-600">If a product cannot be repaired, we will replace it with the same model or a comparable model at no additional cost, subject to availability. If the product is no longer available, you will be offered an equivalent or upgraded model.</p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <strong className="block text-sm font-bold text-gray-900 mb-1">3.4 Limitation of Liability</strong>
                  <p className="text-xs sm:text-sm text-gray-600">Our warranty is limited to the repair or replacement of defective products under the specified warranty period. We are not liable for any indirect, incidental, or consequential damages arising from the use or inability to use the product, even if we have been advised of the possibility of such damages.</p>
                </div>
              </div>
            </section>

            {/* Contact Us Block */}
            <div className="bg-[#0a1e17] text-white rounded-2xl p-8 shadow-md relative overflow-hidden">
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-white/80 text-sm mb-6">
                If you have any questions about our Return Policy, please contact us:
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#0a5c48] bg-white rounded-full p-0.5 shrink-0" />
                  <span>By email: <a href="mailto:support@surplusmarket.com" className="font-semibold text-white hover:underline">support@surplusmarket.com</a></span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#0a5c48] bg-white rounded-full p-0.5 shrink-0" />
                  <span>By phone: <a href="tel:+97430269988" className="font-semibold text-white hover:underline">+974 3026 9988</a></span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#0a5c48] bg-white rounded-full p-0.5 shrink-0 mt-1" />
                  <span>By mail: 2nd Floor, Al Kazim Building, Opposite Crown Plaza, Doha - Qatar</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
