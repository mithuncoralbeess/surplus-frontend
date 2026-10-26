"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Package, 
  TriangleAlert, 
  Lightbulb, 
  MessageSquare, 
  CheckCircle2, 
  X, 
  FileText, 
  PhoneCall, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Headphones, 
  ChevronRight, 
  Loader2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

type TabKey = 'request-product' | 'report-issue' | 'suggest-feature' | 'order-help';

interface FileItem {
  file: File;
  name: string;
  size: string;
}

export default function AssistanceDesk() {
  const [activeTab, setActiveTab] = useState<TabKey>('request-product');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{
    tab: TabKey;
    ticketId: string;
    email: string;
  } | null>(null);

  // Form states - Request a Product
  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productEmail, setProductEmail] = useState('');
  const [productLocation, setProductLocation] = useState('');
  const [productComment, setProductComment] = useState('');
  const [productFiles, setProductFiles] = useState<FileItem[]>([]);
  const productFileInputRef = useRef<HTMLInputElement>(null);

  // Form states - Report an Issue
  const [issueName, setIssueName] = useState('');
  const [issueEmail, setIssueEmail] = useState('');
  const [issuePhone, setIssuePhone] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [issueFiles, setIssueFiles] = useState<FileItem[]>([]);
  const issueFileInputRef = useRef<HTMLInputElement>(null);

  // Form states - Suggest a Feature
  const [featureName, setFeatureName] = useState('');
  const [featureEmail, setFeatureEmail] = useState('');
  const [featurePhone, setFeaturePhone] = useState('');
  const [featureDescription, setFeatureDescription] = useState('');
  const [featureFiles, setFeatureFiles] = useState<FileItem[]>([]);
  const featureFileInputRef = useRef<HTMLInputElement>(null);

  // Form states - Order Help
  const [orderId, setOrderId] = useState('');
  const [orderInquiryType, setOrderInquiryType] = useState('');
  const [orderEmail, setOrderEmail] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderDetails, setOrderDetails] = useState('');
  const [orderFiles, setOrderFiles] = useState<FileItem[]>([]);
  const orderFileInputRef = useRef<HTMLInputElement>(null);

  // File size formatter
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
  ) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);
    const validFiles: FileItem[] = [];

    for (const file of incoming) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 10 MB maximum limit.`);
        continue;
      }
      validFiles.push({
        file,
        name: file.name,
        size: formatFileSize(file.size),
      });
    }

    setFiles((prev) => [...prev, ...validFiles]);
    e.target.value = '';
  };

  const removeFile = (
    index: number,
    setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
  ) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Clear handlers
  const handleClear = () => {
    if (activeTab === 'request-product') {
      setProductName('');
      setProductQuantity('');
      setProductEmail('');
      setProductLocation('');
      setProductComment('');
      setProductFiles([]);
    } else if (activeTab === 'report-issue') {
      setIssueName('');
      setIssueEmail('');
      setIssuePhone('');
      setIssueDescription('');
      setIssueFiles([]);
    } else if (activeTab === 'suggest-feature') {
      setFeatureName('');
      setFeatureEmail('');
      setFeaturePhone('');
      setFeatureDescription('');
      setFeatureFiles([]);
    } else if (activeTab === 'order-help') {
      setOrderId('');
      setOrderInquiryType('');
      setOrderEmail('');
      setOrderPhone('');
      setOrderDetails('');
      setOrderFiles([]);
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate submission network call
      await new Promise((res) => setTimeout(res, 900));

      const randomTicketNum = Math.floor(10000 + Math.random() * 90000);
      const prefix = 
        activeTab === 'request-product' ? 'PRQ' :
        activeTab === 'report-issue' ? 'ISS' :
        activeTab === 'suggest-feature' ? 'FTR' : 'ORD';

      const email = 
        activeTab === 'request-product' ? productEmail :
        activeTab === 'report-issue' ? issueEmail :
        activeTab === 'suggest-feature' ? featureEmail : orderEmail;

      setSubmittedTicket({
        tab: activeTab,
        ticketId: `${prefix}-${randomTicketNum}`,
        email: email || 'your email',
      });
      handleClear();
    } catch {
      alert('An error occurred while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#fbfcfc] py-10 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 mb-8 font-medium">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[#0f7a61] font-semibold">
            Assistance Desk
          </span>
        </nav>

        {/* Page Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#e6f7ef] px-3.5 py-1 text-xs font-semibold text-[#0f7a61] border border-[#0f7a61]/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Dedicated Customer &amp; Enterprise Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            How can we assist you?
          </h1>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            Source specific surplus inventory, report bugs, share product suggestions, or receive immediate order assistance from our operations team.
          </p>
        </div>

        {/* Segmented Top Tab Bar */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-1 sm:gap-2 p-1.5 rounded-full border border-gray-200/90 bg-white shadow-xs flex-wrap sm:flex-nowrap justify-center max-w-full">
            
            {/* Tab 1: Request a Product */}
            <button
              type="button"
              onClick={() => { setActiveTab('request-product'); setSubmittedTicket(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'request-product'
                  ? 'bg-[#0f7a61] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span>Request a Product</span>
            </button>

            {/* Tab 2: Report an Issue */}
            <button
              type="button"
              onClick={() => { setActiveTab('report-issue'); setSubmittedTicket(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'report-issue'
                  ? 'bg-[#0f7a61] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <TriangleAlert className="w-4 h-4 shrink-0" />
              <span>Report an Issue</span>
            </button>

            {/* Tab 3: Suggest a Feature */}
            <button
              type="button"
              onClick={() => { setActiveTab('suggest-feature'); setSubmittedTicket(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'suggest-feature'
                  ? 'bg-[#0f7a61] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Lightbulb className="w-4 h-4 shrink-0" />
              <span>Suggest a Feature</span>
            </button>

            {/* Tab 4: Order Help */}
            <button
              type="button"
              onClick={() => { setActiveTab('order-help'); setSubmittedTicket(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'order-help'
                  ? 'bg-[#0f7a61] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Order Help</span>
            </button>

          </div>
        </div>

        {/* Main Content Card Container */}
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-10 lg:p-12 mb-12">
          
          {submittedTicket ? (
            /* Success confirmation screen */
            <div className="py-12 px-4 text-center max-w-lg mx-auto space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0f7a61] mx-auto flex items-center justify-center ring-8 ring-emerald-50/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0f7a61] bg-[#e6f7ef] px-3 py-1 rounded-full border border-[#0f7a61]/20">
                  Ticket #{submittedTicket.ticketId}
                </span>
                <h3 className="text-2xl font-bold text-gray-900">
                  Request Successfully Dispatched
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Thank you! Our operations specialists have received your submission. A confirmation email with reference tracking has been sent to <span className="font-semibold text-gray-800">{submittedTicket.email}</span>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 text-xs text-gray-600 text-left space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-gray-800">
                  <Clock className="w-3.5 h-3.5 text-[#0f7a61]" />
                  <span>Expected Response Time:</span>
                </div>
                <p>Enterprise sourcing requests and critical order inquiries are typically addressed within 2 business hours (Sun – Thu, 8:00 AM – 6:00 PM AST).</p>
              </div>

              <div className="pt-2 flex flex-wrap gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setSubmittedTicket(null)}
                  className="px-6 py-2.5 rounded-full bg-[#0f7a61] hover:bg-[#0c6651] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  Submit Another Request
                </button>
                <Link
                  href="/browse"
                  className="px-6 py-2.5 rounded-full border border-gray-300 hover:border-gray-400 text-gray-700 text-xs sm:text-sm font-semibold transition-colors"
                >
                  Browse Marketplace
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {/* TAB 1: Request a Product */}
              {activeTab === 'request-product' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Request a Product
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Can't find what you need? Tell us and we'll source it for you.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="e.g. Copper Cathodes, Industrial Valves, Solar Panels"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                        Product Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={productQuantity}
                        onChange={(e) => setProductQuantity(e.target.value)}
                        placeholder="e.g. 500 Units / 10 Metric Tons"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                        Company Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={productEmail}
                        onChange={(e) => setProductEmail(e.target.value)}
                        placeholder="procurement@company.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={productLocation}
                        onChange={(e) => setProductLocation(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 bg-white focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all cursor-pointer"
                      >
                        <option value="" disabled>Select location</option>
                        <option value="Qatar">Qatar</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Oman">Oman</option>
                        <option value="India">India</option>
                        <option value="International / Other">International / Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                      Comment (optional)
                    </label>
                    <textarea
                      rows={4}
                      value={productComment}
                      onChange={(e) => setProductComment(e.target.value)}
                      placeholder="Add details such as required manufacturer, target unit price, condition (brand new, overstock, refurbished), or delivery deadlines..."
                      className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all resize-y"
                    />
                  </div>

                  {/* Attachments */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                      Attachments (optional)
                    </label>
                    <input
                      type="file"
                      ref={productFileInputRef}
                      multiple
                      onChange={(e) => handleFileUpload(e, setProductFiles)}
                      className="hidden"
                      id="product-file-input"
                    />
                    <div className="w-full rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-3">
                        <label
                          htmlFor="product-file-input"
                          className="bg-[#e6f7ef] hover:bg-[#d5f3e4] text-[#0f7a61] text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-[#0f7a61]/20 cursor-pointer transition-colors"
                        >
                          Choose Files
                        </label>
                        <span className="text-xs text-gray-500">
                          {productFiles.length === 0
                            ? 'No file chosen'
                            : `${productFiles.length} file(s) selected`}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Up to 10 MB per file.
                    </p>

                    {/* File list preview */}
                    {productFiles.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {productFiles.map((f, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs text-gray-700"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#0f7a61]" />
                            <span className="max-w-[200px] truncate font-medium">{f.name}</span>
                            <span className="text-gray-400">({f.size})</span>
                            <button
                              type="button"
                              onClick={() => removeFile(idx, setProductFiles)}
                              className="text-gray-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#0f7a61] hover:bg-[#0c6651] text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-full transition-all shadow-sm cursor-pointer disabled:opacity-60 flex items-center gap-2"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>Send Request</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs sm:text-sm px-8 py-3 rounded-full border border-gray-200 transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Report an Issue */}
              {activeTab === 'report-issue' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Report an Issue
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Encountered a problem or technical glitch? Tell us so our team can resolve it.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={issueName}
                        onChange={(e) => setIssueName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={issueEmail}
                        onChange={(e) => setIssueEmail(e.target.value)}
                        placeholder="your.email@company.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={issuePhone}
                      onChange={(e) => setIssuePhone(e.target.value)}
                      placeholder="+974 4400 0000"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                      Describe Issue <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      placeholder="Please describe the issue or problem you encountered in detail..."
                      className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all resize-y"
                    />
                  </div>

                  {/* Attachments */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                      Screenshots / Error Logs (optional)
                    </label>
                    <input
                      type="file"
                      ref={issueFileInputRef}
                      multiple
                      onChange={(e) => handleFileUpload(e, setIssueFiles)}
                      className="hidden"
                      id="issue-file-input"
                    />
                    <div className="w-full rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-3">
                        <label
                          htmlFor="issue-file-input"
                          className="bg-[#e6f7ef] hover:bg-[#d5f3e4] text-[#0f7a61] text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-[#0f7a61]/20 cursor-pointer transition-colors"
                        >
                          Choose Files
                        </label>
                        <span className="text-xs text-gray-500">
                          {issueFiles.length === 0
                            ? 'No file chosen'
                            : `${issueFiles.length} file(s) selected`}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Up to 10 MB per file.
                    </p>

                    {issueFiles.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {issueFiles.map((f, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs text-gray-700"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#0f7a61]" />
                            <span className="max-w-[200px] truncate font-medium">{f.name}</span>
                            <span className="text-gray-400">({f.size})</span>
                            <button
                              type="button"
                              onClick={() => removeFile(idx, setIssueFiles)}
                              className="text-gray-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#0f7a61] hover:bg-[#0c6651] text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-full transition-all shadow-sm cursor-pointer disabled:opacity-60 flex items-center gap-2"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>Submit Issue</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs sm:text-sm px-8 py-3 rounded-full border border-gray-200 transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: Suggest a Feature */}
              {activeTab === 'suggest-feature' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Suggest a Feature
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Have an idea to make Surplus Market better? Help shape our product roadmap.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={featureName}
                        onChange={(e) => setFeatureName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={featureEmail}
                        onChange={(e) => setFeatureEmail(e.target.value)}
                        placeholder="your.email@company.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={featurePhone}
                      onChange={(e) => setFeaturePhone(e.target.value)}
                      placeholder="+974 4400 0000"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                      Describe Feature <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={featureDescription}
                      onChange={(e) => setFeatureDescription(e.target.value)}
                      placeholder="Please describe the feature you would like to suggest and how it would improve your workflow..."
                      className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all resize-y"
                    />
                  </div>

                  {/* Attachments */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                      Mockups or Reference Files (optional)
                    </label>
                    <input
                      type="file"
                      ref={featureFileInputRef}
                      multiple
                      onChange={(e) => handleFileUpload(e, setFeatureFiles)}
                      className="hidden"
                      id="feature-file-input"
                    />
                    <div className="w-full rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-3">
                        <label
                          htmlFor="feature-file-input"
                          className="bg-[#e6f7ef] hover:bg-[#d5f3e4] text-[#0f7a61] text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-[#0f7a61]/20 cursor-pointer transition-colors"
                        >
                          Choose Files
                        </label>
                        <span className="text-xs text-gray-500">
                          {featureFiles.length === 0
                            ? 'No file chosen'
                            : `${featureFiles.length} file(s) selected`}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Up to 10 MB per file.
                    </p>

                    {featureFiles.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {featureFiles.map((f, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs text-gray-700"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#0f7a61]" />
                            <span className="max-w-[200px] truncate font-medium">{f.name}</span>
                            <span className="text-gray-400">({f.size})</span>
                            <button
                              type="button"
                              onClick={() => removeFile(idx, setFeatureFiles)}
                              className="text-gray-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#0f7a61] hover:bg-[#0c6651] text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-full transition-all shadow-sm cursor-pointer disabled:opacity-60 flex items-center gap-2"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>Submit Suggestion</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs sm:text-sm px-8 py-3 rounded-full border border-gray-200 transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: Order Help */}
              {activeTab === 'order-help' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Order Help
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Need immediate assistance with an existing order, shipping tracking, or inspection verification?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                        Order Reference ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="e.g. SUR-2026-9481"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                        Assistance Needed <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={orderInquiryType}
                        onChange={(e) => setOrderInquiryType(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 bg-white focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all cursor-pointer"
                      >
                        <option value="" disabled>Select inquiry type</option>
                        <option value="Shipment Tracking & Status">Shipment Tracking &amp; Delivery ETA</option>
                        <option value="Inspection Report & Quality">Inspection Report &amp; Quality Verification</option>
                        <option value="Customs & Export Documentation">Customs &amp; Export Documentation</option>
                        <option value="Payment Confirmation & Escrow">Payment Confirmation &amp; Escrow Release</option>
                        <option value="Delivery Discrepancy or Damage">Delivery Discrepancy or Damage</option>
                        <option value="Other">Other Order Inquiries</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                        Company Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={orderEmail}
                        onChange={(e) => setOrderEmail(e.target.value)}
                        placeholder="your.email@company.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                        Contact Phone Number
                      </label>
                      <input
                        type="tel"
                        value={orderPhone}
                        onChange={(e) => setOrderPhone(e.target.value)}
                        placeholder="+974 4400 0000"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                      Order Details &amp; Request <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={orderDetails}
                      onChange={(e) => setOrderDetails(e.target.value)}
                      placeholder="Please provide specifics regarding the shipment, inspection condition, invoice, or questions you have..."
                      className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61] outline-none transition-all resize-y"
                    />
                  </div>

                  {/* Attachments */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                      Supporting Documents (BOL, PO, Photos) (optional)
                    </label>
                    <input
                      type="file"
                      ref={orderFileInputRef}
                      multiple
                      onChange={(e) => handleFileUpload(e, setOrderFiles)}
                      className="hidden"
                      id="order-file-input"
                    />
                    <div className="w-full rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-3">
                        <label
                          htmlFor="order-file-input"
                          className="bg-[#e6f7ef] hover:bg-[#d5f3e4] text-[#0f7a61] text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-[#0f7a61]/20 cursor-pointer transition-colors"
                        >
                          Choose Files
                        </label>
                        <span className="text-xs text-gray-500">
                          {orderFiles.length === 0
                            ? 'No file chosen'
                            : `${orderFiles.length} file(s) selected`}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Up to 10 MB per file.
                    </p>

                    {orderFiles.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {orderFiles.map((f, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs text-gray-700"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#0f7a61]" />
                            <span className="max-w-[200px] truncate font-medium">{f.name}</span>
                            <span className="text-gray-400">({f.size})</span>
                            <button
                              type="button"
                              onClick={() => removeFile(idx, setOrderFiles)}
                              className="text-gray-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#0f7a61] hover:bg-[#0c6651] text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-full transition-all shadow-sm cursor-pointer disabled:opacity-60 flex items-center gap-2"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>Request Order Support</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs sm:text-sm px-8 py-3 rounded-full border border-gray-200 transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Enterprise Highlights Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#e6f7ef] text-[#0f7a61] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Rapid 2-Hour Response SLA
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Our regional operations desk prioritizes enterprise procurement requests with fast turnaround times and direct supplier coordination.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#e6f7ef] text-[#0f7a61] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Verified Sourcing &amp; Inspection
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Every custom sourced lot undergoes specification verification and 3rd-party condition inspections prior to release.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#e6f7ef] text-[#0f7a61] flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Dedicated Account Desk
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Need personalized assistance? High-volume liquidators and enterprise buyers receive assigned specialists for bulk transactions.
            </p>
          </div>

        </div>

        {/* Direct Contact Banner */}
        <div className="rounded-3xl bg-[#07241c] text-white p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60 inline-block">
              Immediate Assistance
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Prefer to speak directly with an enterprise specialist?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Contact our GCC procurement desk directly for urgent tenders, multi-container liquidations, or contract escrow support.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#0f7a61] hover:bg-[#0c6651] text-white text-xs sm:text-sm font-bold px-6 py-3 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact Operations</span>
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 hover:border-white/40 bg-white/5 text-white text-xs sm:text-sm font-semibold px-6 py-3 transition-colors cursor-pointer"
            >
              <span>Explore FAQ</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
