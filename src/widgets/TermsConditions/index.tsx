import React from 'react';
import CommonBanner from '../CommonBanner';
import { 
  FileText, 
  UserCheck, 
  ShieldCheck, 
  AlertCircle, 
  Receipt, 
  Ban, 
  Globe, 
  Mail, 
  Phone, 
  CheckCircle2,
  Lock,
  Scale,
  Building2
} from 'lucide-react';

export default function TermsConditionsWidget() {
  return (
    <div className="w-full flex flex-col items-center bg-gray-50/50">
      <CommonBanner 
        title="Terms & Conditions"
        subtitle="Please review the rules, listing requirements, and legal responsibilities governing buyers and sellers on Surplus Market."
        align="center"
        image="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=2000&q=80"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Terms & Conditions' }
        ]}
      />

      <section className="w-full py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm space-y-12">
            
            {/* Overview Box */}
            <div className="bg-[#e0f0e9]/50 border border-[#0a5c48]/20 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-3 text-[#0a5c48]">
                <Scale className="w-6 h-6 shrink-0" />
                <h2 className="text-xl font-bold text-gray-900">User Agreement Summary</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Welcome to Surplus Market. By accessing or registering on our site as a prospective buyer or seller, you agree to comply with and be bound by the following Terms and Conditions. These terms establish the legal rights, listing accuracy guidelines, and operational standards required for trading surplus assets on our marketplace.
              </p>
            </div>

            {/* 1. User Registration & Account Responsibilities */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-[#0a5c48]" /> 1. User Registration & Account Responsibilities
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                <p>
                  Users who wish to become prospective buyers or sellers of products shall register with the site by selecting a login ID and personal password and providing any other required registration information.
                </p>
                <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0a5c48] shrink-0 mt-0.5" />
                    <p className="text-gray-700">
                      <strong>Accuracy Warranty:</strong> Users who log in represent and warrant that all information provided during registration is accurate and complete and will be updated when needed.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-[#0a5c48] shrink-0 mt-0.5" />
                    <p className="text-gray-700">
                      <strong>Account Conduct:</strong> Users are responsible for all conduct and transmissions that take place under their respective login ID and passwords.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#0a5c48] shrink-0 mt-0.5" />
                    <p className="text-gray-700">
                      <strong>Termination Rights:</strong> Surplus Market, in its sole and absolute discretion, may refuse to accept a user's registration and may terminate a user's rights to continue using the site for any reason at any time.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Seller Obligations & Product Listings */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#0a5c48]" /> 2. Seller Obligations & Product Listings
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                <p>
                  A seller of products must have the legal authority to sell the products it lists for sale on the site, free and clear of any liens, claims, or other encumbrances.
                </p>
                <p>
                  The seller must provide commercially accurate information for each listing of products, including quantity and condition (in the 'Description'). Surplus Market has no responsibility for the items' 'Description.' Surplus Market reserves the right to reject any products from being posted on the site if our team finds any irregularities.
                </p>
                <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl">
                  <h3 className="font-bold text-gray-900 mb-2">Resale Terms & Special Conditions</h3>
                  <p className="text-sm text-gray-600">
                    Any resale restrictions, taxes, fees, or special conditions required by the seller must be clearly set forth in the description. Since the terms of any sale of products are strictly between the buyer and the seller, the enforcement of any resale restrictions shall be as agreed between the seller and buyer.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Condition Updates & Disclaimer of Sales Guarantee */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-[#0a5c48]" /> 3. Condition Updates & Sales Disclaimer
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#0a5c48]" /> Mandatory Condition Updates
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    The seller is solely responsible and obliged to inform Surplus Market through{' '}
                    <a href="mailto:contact@surplusmarket.com" className="text-[#0a5c48] font-semibold underline">
                      contact@surplusmarket.com
                    </a>{' '}
                    of any changes or updates regarding the condition and/or quantity of the product that have occurred since it was listed on our site. Please contact us using your product reference number.
                  </p>
                </div>

                <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0a5c48]" /> Sales Guarantee Disclaimer
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Surplus Market, under any condition, does not provide any sort of guarantee of sales of the product listed on the website.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Tax Responsibilities */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <Receipt className="w-6 h-6 text-[#0a5c48]" /> 4. Tax Responsibilities
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                In any transaction on the site, the buyer and seller are responsible for determining if any taxes from any taxing authority apply to the transaction and for collecting, reporting, and remitting the correct tax to the appropriate tax authority.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Surplus Market is not obligated to determine whether any such taxes apply and is not responsible for collecting, remitting, or reporting any such taxes arising from any transaction. If any such taxes are applicable, it is the obligation of the seller to disclose this in the description.
              </p>
            </section>

            {/* 5. Prohibited Conduct & Content Restrictions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <Ban className="w-6 h-6 text-[#0a5c48]" /> 5. Prohibited Conduct & User Compliance
              </h2>
              
              <div className="space-y-4 pt-2">
                <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl">
                  <h3 className="font-bold text-gray-900 mb-2">Legal Compliance</h3>
                  <p className="text-sm text-gray-600">
                    Each buyer and seller agree to comply with all applicable laws and regulations regarding the sale or purchase of products on this site.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl">
                  <h3 className="font-bold text-gray-900 mb-2">Illegal & Inappropriate Activities</h3>
                  <p className="text-sm text-gray-600">
                    Each buyer and seller agree not to use this site or any content contained in it for any illegal or inappropriate activities, which include harassing or bribing others, misappropriating or copying the contents of this site or any listing, or selling non-existent, fraudulent, stolen, or counterfeit products.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl">
                  <h3 className="font-bold text-gray-900 mb-2">Content Transmission Rules</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    No buyer or seller shall submit, publish, distribute, or transmit through this site or its email links any content that is libelous, defamatory, obscene, pornographic, threatening, invasive of privacy or publicity rights, abusive, illegal, hateful, racially or ethnically discriminatory, or that would constitute or encourage a criminal or civil offense, or that would otherwise give rise to liability or violate any law.
                  </p>
                  <p className="text-sm text-gray-600">
                    Buyer or seller shall not submit, publish, distribute, or transmit anything through this site that will violate or infringe, or cause Surplus Market to violate or infringe, the intellectual property or other rights of any third party, including copyright, trademark, trade secret, privacy, or other proprietary rights. No buyer or seller shall use this site to send unsolicited advertising, promotional material, or other forms of solicitation to other users.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. International Trade & Import/Export Due Diligence */}
            <section className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 pb-2 border-b border-gray-200 flex items-center gap-3">
                <Globe className="w-6 h-6 text-[#0a5c48]" /> 6. Import & Export Due Diligence
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Any buyer or seller who exports or imports any products shall conduct their own due diligence and make best efforts to comply with and become knowledgeable about any restrictions, taxes or duties, and government filings involved with importing such products.
              </p>
            </section>

            {/* Contact Support Box */}
            <div className="bg-[#0a1e17] text-white rounded-2xl p-8 shadow-md relative overflow-hidden">
              <h3 className="text-xl font-bold mb-4">Have Questions About Our Terms?</h3>
              <p className="text-white/80 text-sm mb-6">
                If you need clarification on listing rules, reference numbers, or trading guidelines, reach out to our team:
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#0a5c48] bg-white rounded-full p-0.5 shrink-0" />
                  <span>Email: <a href="mailto:contact@surplusmarket.com" className="font-semibold text-white hover:underline">contact@surplusmarket.com</a></span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#0a5c48] bg-white rounded-full p-0.5 shrink-0" />
                  <span>Phone: <a href="tel:+97430269988" className="font-semibold text-white hover:underline">+974 3026 9988</a></span>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-[#0a5c48] bg-white rounded-full p-0.5 shrink-0 mt-1" />
                  <span>Office: 15th Floor, Trans World 1, Near National Museum of Qatar, Doha</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
