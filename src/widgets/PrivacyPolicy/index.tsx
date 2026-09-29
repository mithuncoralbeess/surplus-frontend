import React from 'react';
import CommonBanner from '../CommonBanner';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Eye, 
  UserCheck, 
  Share2, 
  Database, 
  Globe, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';

export default function PrivacyPolicyWidget() {
  return (
    <div className="w-full flex flex-col items-center bg-gray-50/50">
      <CommonBanner 
        title="Privacy Policy"
        subtitle="Surplus Market is committed to protecting the privacy and security of your personal information."
        align="center"
        image="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Privacy Policy' }
        ]}
      />

      <section className="w-full py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm space-y-12">
            
            {/* Introduction Box */}
            <div className="bg-[#e0f0e9]/50 border border-[#0a5c48]/20 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-3 text-[#0a5c48]">
                <ShieldCheck className="w-6 h-6 shrink-0" />
                <h2 className="text-xl font-bold text-gray-900">Our Privacy Commitment</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Surplus Market ("we," "our," or "us") is committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you interact with our website, mobile application, and services (collectively, the "Services").
              </p>
            </div>

            {/* 1. Information We Collect */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#0a5c48]" /> 1. Information We Collect
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                We may collect the following types of information from and about you:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#0a5c48]" /> 1.1 Personal Information
                  </h3>
                  <ul className="text-xs sm:text-sm text-gray-600 space-y-2 list-disc list-inside">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Shipping & billing address</li>
                    <li>Payment information (e.g. credit card details)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#0a5c48]" /> 1.2 Non-Personal Information
                  </h3>
                  <ul className="text-xs sm:text-sm text-gray-600 space-y-2 list-disc list-inside">
                    <li>IP address</li>
                    <li>Browser type & version</li>
                    <li>Device information</li>
                    <li>Usage data (e.g. pages viewed, time spent)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#0a5c48]" /> 1.3 Information You Provide
                  </h3>
                  <ul className="text-xs sm:text-sm text-gray-600 space-y-2 list-disc list-inside">
                    <li>Account registration details</li>
                    <li>Communications with support</li>
                    <li>Feedback, surveys & reviews</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 2. How We Use Your Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <Lock className="w-6 h-6 text-[#0a5c48]" /> 2. How We Use Your Information
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                We use the information we collect for the following purposes:
              </p>
              <ul className="space-y-3 pt-2">
                {[
                  "To provide and manage our Services",
                  "To process transactions and deliver products",
                  "To communicate with you about your orders, account, and promotional offers",
                  "To improve our Services and user experience",
                  "To comply with legal and regulatory obligations"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-[#0a5c48] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 3. Sharing Your Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <Share2 className="w-6 h-6 text-[#0a5c48]" /> 3. Sharing Your Information
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                We do not sell or rent your personal information. However, we may share your information in the following circumstances:
              </p>
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <strong className="block text-sm font-bold text-gray-900 mb-1">With Service Providers:</strong>
                  <p className="text-xs sm:text-sm text-gray-600">Third-party vendors who assist us with payment processing, shipping, marketing, or data analytics.</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <strong className="block text-sm font-bold text-gray-900 mb-1">For Legal Reasons:</strong>
                  <p className="text-xs sm:text-sm text-gray-600">When required by law or to protect our rights, property, or safety.</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <strong className="block text-sm font-bold text-gray-900 mb-1">Business Transfers:</strong>
                  <p className="text-xs sm:text-sm text-gray-600">In connection with a merger, sale, or acquisition of our company or assets.</p>
                </div>
              </div>
            </section>

            {/* 4. Data Security */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#0a5c48]" /> 4. Data Security
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* 5. Your Choices and Rights */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-[#0a5c48]" /> 5. Your Choices and Rights
              </h2>
              <div className="space-y-3 pt-2 text-sm text-gray-700">
                <p><strong className="text-gray-900">Access and Update:</strong> You may access and update your account information through your profile settings.</p>
                <p><strong className="text-gray-900">Opt-Out:</strong> You can opt out of receiving promotional communications by following the instructions in the communication or contacting us.</p>
                <p><strong className="text-gray-900">Cookies:</strong> You can manage your cookie preferences through your browser settings.</p>
              </div>
            </section>

            {/* 6. Children's Privacy */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <Eye className="w-6 h-6 text-[#0a5c48]" /> 6. Children's Privacy
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Our Services are not directed to individuals under the age of 13, and we do not knowingly collect personal information from children.
              </p>
            </section>

            {/* 7. International Users */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <Globe className="w-6 h-6 text-[#0a5c48]" /> 7. International Users
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                If you access our Services from outside Qatar or the GCC, your information may be transferred to, stored, and processed in Qatar and affiliated regional server hubs. By using our Services, you consent to such transfers.
              </p>
            </section>

            {/* 8. Changes to This Privacy Policy */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <Clock className="w-6 h-6 text-[#0a5c48]" /> 8. Changes to This Privacy Policy
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be effective when we post the revised policy on our website. We encourage you to review this policy periodically.
              </p>
            </section>

            {/* Contact Us Block */}
            <div className="bg-[#0a1e17] text-white rounded-2xl p-8 shadow-md relative overflow-hidden">
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-white/80 text-sm mb-6">
                If you have any questions about our Privacy Policy, please contact us:
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
