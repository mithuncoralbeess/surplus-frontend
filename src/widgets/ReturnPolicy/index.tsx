import React from 'react';
import CommonBanner from '../CommonBanner';
import { 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  PackageCheck, 
  Truck, 
  CreditCard, 
  AlertTriangle, 
  RefreshCw, 
  Gift, 
  Mail, 
  Phone, 
  Building2,
  FileCheck
} from 'lucide-react';

export default function ReturnPolicyWidget() {
  return (
    <div className="w-full flex flex-col items-center bg-gray-50/50">
      <CommonBanner 
        title="Return & Refund Policy"
        subtitle="Conditions, timeline, RMA processes, and guidelines for returning products purchased on Surplus Market."
        align="center"
        image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Return Policy' }
        ]}
      />

      <section className="w-full py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm space-y-12">
            
            {/* Overview Box */}
            <div className="bg-[#e0f0e9]/50 border border-[#0a5c48]/20 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-3 text-[#0a5c48]">
                <RotateCcw className="w-6 h-6 shrink-0" />
                <h2 className="text-xl font-bold text-gray-900">Return Commitment</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                This Return Policy outlines the conditions and processes for returning products purchased from Surplus Market. By purchasing from our website, you agree to these terms.
              </p>
            </div>

            {/* 1. Return Eligibility & Non-Returnable Items */}
            <section className="space-y-6">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#0a5c48]" /> 1. Return Eligibility & Exclusions
              </h2>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Eligibility Criteria</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  To be eligible for a return, your item must meet the following conditions:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0a5c48] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-bold text-gray-900">30-Day Window</strong>
                      <span className="text-xs sm:text-sm text-gray-600">Item must be returned within 30 days from the date of purchase.</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3">
                    <PackageCheck className="w-5 h-5 text-[#0a5c48] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-bold text-gray-900">Original Condition</strong>
                      <span className="text-xs sm:text-sm text-gray-600">Item must be unused with all original packaging and tags intact.</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3 md:col-span-2">
                    <FileCheck className="w-5 h-5 text-[#0a5c48] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-bold text-gray-900">Proof of Purchase</strong>
                      <span className="text-xs sm:text-sm text-gray-600">A receipt or order confirmation must be provided.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Non-Returnable Items</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Certain types of items cannot be returned:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Gift cards",
                    "Downloadable software or digital products",
                    "Health and personal care items",
                    "Products purchased as part of a clearance or final sale"
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-red-50/50 border border-red-200/60 rounded-xl flex items-center gap-2.5">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. Step-by-Step Return Process */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <RotateCcw className="w-6 h-6 text-[#0a5c48]" /> 2. Return Process (RMA)
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                If your item meets the return eligibility criteria, follow these steps to initiate a return:
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#0a5c48] text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Request RMA Number</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Contact our support team via email at{' '}
                      <a href="mailto:support@surplusmarket.com" className="text-[#0a5c48] font-semibold underline">
                        support@surplusmarket.com
                      </a>{' '}
                      or call{' '}
                      <a href="tel:+97430269988" className="text-[#0a5c48] font-semibold underline">
                        +974 3026 9988
                      </a>{' '}
                      to request a Return Merchandise Authorization (RMA) number.
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#0a5c48] text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Pack Item Securely</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Once you receive your RMA number, pack the item securely in its original packaging, including all manuals, accessories, and documentation.
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#0a5c48] text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Ship to Return Address</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      Write the RMA number clearly on the outside of the package and ship the item to:
                    </p>
                    <div className="p-3 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 font-semibold">
                      Surplus Market Building: 2nd Floor, Al Kazim Building, Opposite Crown Plaza, Doha - Qatar
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Shipping Costs & Tracking */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <Truck className="w-6 h-6 text-[#0a5c48]" /> 3. Shipping Costs
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                The customer is responsible for paying return shipping costs unless the return is due to a defective product or an error on our part.
              </p>
              <div className="p-4 bg-[#e0f0e9]/40 border border-[#0a5c48]/20 rounded-xl text-xs sm:text-sm text-gray-700">
                <strong>Tip:</strong> We recommend using a trackable shipping service or purchasing shipping insurance. We are not responsible for lost or damaged return shipments.
              </div>
            </section>

            {/* 4. Refunds & Processing Timeline */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-[#0a5c48]" /> 4. Refunds & Processing
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within <strong>5-10 business days</strong>.
              </p>

              <div className="pt-2">
                <h3 className="text-base font-bold text-gray-900 mb-3">Partial Refunds</h3>
                <p className="text-sm text-gray-600 mb-3">
                  In some cases, only partial refunds are granted. This includes but is not limited to:
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0a5c48]"></span>
                    <span>Items that show signs of use</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0a5c48]"></span>
                    <span>Items missing parts or accessories not due to our error</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0a5c48]"></span>
                    <span>Items returned after the 30-day window</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Late or Missing Refunds
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  If you haven’t received your refund after 10 business days, first check your bank account again. Then contact your credit card company, as it may take some time before your refund is officially posted. If you’ve done this and still have not received your refund, please contact us at{' '}
                  <a href="mailto:support@surplusmarket.com" className="text-[#0a5c48] font-semibold underline">
                    support@surplusmarket.com
                  </a>.
                </p>
              </div>
            </section>

            {/* 5. Exchanges & Promotional Items */}
            <section className="space-y-6">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <RefreshCw className="w-6 h-6 text-[#0a5c48]" /> 5. Exchanges & Promotional Items
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-[#0a5c48]" /> Product Exchanges
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at{' '}
                    <a href="mailto:support@surplusmarket.com" className="text-[#0a5c48] font-semibold underline">
                      support@surplusmarket.com
                    </a>{' '}
                    to receive further instructions.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[#0a5c48]" /> Promotional Items
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    If you received a free or discounted item as part of a promotion, you must return the promotional item along with the item you are returning. Failure to return the promotional item may result in a reduction in your refund amount equivalent to the retail price of the promotional item.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Box */}
            <div className="bg-[#0a1e17] text-white rounded-2xl p-8 shadow-md relative overflow-hidden">
              <h3 className="text-xl font-bold mb-4">Questions About Returns?</h3>
              <p className="text-white/80 text-sm mb-6">
                If you have any questions about our Return Policy or need help requesting an RMA number:
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#0a5c48] bg-white rounded-full p-0.5 shrink-0" />
                  <span>Email: <a href="mailto:support@surplusmarket.com" className="font-semibold text-white hover:underline">support@surplusmarket.com</a></span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#0a5c48] bg-white rounded-full p-0.5 shrink-0" />
                  <span>Phone: <a href="tel:+97430269988" className="font-semibold text-white hover:underline">+974 3026 9988</a></span>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-[#0a5c48] bg-white rounded-full p-0.5 shrink-0 mt-1" />
                  <span>Return Address: 2nd Floor, Al Kazim Building, Opposite Crown Plaza, Doha - Qatar</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
