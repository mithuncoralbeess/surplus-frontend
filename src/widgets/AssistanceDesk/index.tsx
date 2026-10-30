"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Package, 
  TriangleAlert, 
  Lightbulb, 
  MessageSquare, 
  MessageCircle,
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
        activeTab === 'report-issue' ? 'ISS' : 'FTR';

      const email = 
        activeTab === 'request-product' ? productEmail :
        activeTab === 'report-issue' ? issueEmail : featureEmail;

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
          <h1 className="h1 text-gray-900">
            How can we assist you?
          </h1>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            Source specific surplus inventory, report bugs, share product suggestions, or receive immediate order assistance from our operations team.
          </p>
        </div>

        {/* Segmented Top Tab Bar */}
        <div className="flex justify-start sm:justify-center mb-8 w-full overflow-x-auto scrollbar-hide py-1">
          <div className="inline-flex items-center gap-1 sm:gap-2 p-1.5 rounded-full border border-gray-200/90 bg-white shadow-xs whitespace-nowrap">
            
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
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-sm p-5 sm:p-8 lg:p-12 mb-12">
          
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
                    <h2 className="h3 text-gray-900">
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
                    <h2 className="h3 text-gray-900">
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
                    <h2 className="h3 text-gray-900">
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
                <div className="py-12 sm:py-16 px-4 text-center max-w-lg mx-auto space-y-6 animate-in fade-in duration-300">
                  {/* Icon Badge */}
                  <div className="w-16 h-16 rounded-full bg-[#dcfce7] text-[#0f7a61] mx-auto flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-[#0f7a61]" strokeWidth={2} />
                  </div>

                  {/* Heading & Subtitle */}
                  <div className="space-y-3">
                    <h2 className="h2 text-gray-900">
                      Need Help with Your Order?
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto font-normal">
                      Stuck with something? Tap below to chat with our support team on WhatsApp - we're here to help!
                    </p>
                  </div>

                  {/* WhatsApp Chat Button */}
                  <div className="pt-2">
                    <a
                      href="https://wa.me/97430269988?text=Hello%20Surplus%20Market%20Support%2C%20I%20need%20help%20with%20my%20order."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer hover:scale-[1.02]"
                    >
                      <svg
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>

                  {/* Direct Contact Links */}
                  <div className="pt-4 space-y-1.5">
                    <div>
                      <a
                        href="tel:+97430269988"
                        className="text-base font-bold text-gray-900 hover:text-[#0f7a61] transition-colors inline-block"
                      >
                        +974 3026 9988
                      </a>
                    </div>
                    <div>
                      <a
                        href="mailto:sales@surplusmarket.com"
                        className="text-sm text-gray-600 hover:text-[#0f7a61] transition-colors inline-block"
                      >
                        sales@surplusmarket.com
                      </a>
                    </div>
                  </div>
                </div>
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
