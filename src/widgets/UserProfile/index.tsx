"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  User, 
  Building2, 
  FileText, 
  Heart, 
  ShieldCheck, 
  Bell, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Package, 
  ExternalLink, 
  Save, 
  Sparkles,
  Layers,
  Edit3,
  Plus,
  Box,
  Boxes,
  Tag
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import Link from 'next/link';
import SimpleListingModal from '../../components/SimpleListingModal';
import LotImportModal from '../../components/LotImportModal';

export default function UserProfileWidget() {
  const { data: session } = useSession();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'profile' | 'rfqs' | 'listings' | 'saved' | 'settings'>('profile');

  // Listing Type Filter State inside Tab 3
  const [listingFilter, setListingFilter] = useState<'all' | 'single' | 'lot'>('all');

  // Modals state
  const [isSimpleModalOpen, setIsSimpleModalOpen] = useState(false);
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);

  // Form State - Empty if not logged in, populated dynamically from session user
  const u = (session?.user || {}) as any;
  const [fullName, setFullName] = useState(u.name || u.first_name || '');
  const [email, setEmail] = useState(u.email || '');
  const [phone, setPhone] = useState(u.phone || u.mobile || u.mobile_number || u.phone_number || '');
  const [businessLocation, setBusinessLocation] = useState(u.business_location || u.businessLocation || u.location || u.business_address || '');
  const [companyName, setCompanyName] = useState(u.company_name || u.companyName || u.company || u.business_name || '');
  const [taxId, setTaxId] = useState(u.tax_id || u.taxId || u.trn || u.trn_number || '');
  const [businessType, setBusinessType] = useState(u.business_type || u.businessType || 'Wholesaler / Distributor');
  const [address, setAddress] = useState(u.address || u.business_address || u.location || '');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Sync profile fields with logged-in session user data dynamically
  useEffect(() => {
    if (session?.user) {
      const userObj = session.user as any;
      setFullName(userObj.name || userObj.first_name || (userObj.first_name && userObj.last_name ? `${userObj.first_name} ${userObj.last_name}` : ''));
      setEmail(userObj.email || '');
      setPhone(userObj.phone || userObj.mobile || userObj.mobile_number || userObj.phone_number || '');
      setBusinessLocation(userObj.business_location || userObj.businessLocation || userObj.location || userObj.business_address || '');
      setCompanyName(userObj.company_name || userObj.companyName || userObj.company || userObj.business_name || '');
      setTaxId(userObj.tax_id || userObj.taxId || userObj.trn || userObj.trn_number || '');
      setBusinessType(userObj.business_type || userObj.businessType || 'Wholesaler / Distributor');
      setAddress(userObj.address || userObj.business_address || userObj.location || '');
    } else {
      // Clear all fields if user is not logged in
      setFullName('');
      setEmail('');
      setPhone('');
      setBusinessLocation('');
      setCompanyName('');
      setTaxId('');
      setBusinessType('');
      setAddress('');
    }
  }, [session]);

  // Settings State
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [rfqUpdates, setRfqUpdates] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const sampleRfqs = [
    { id: 'RFQ-8924', date: '2026-09-18', item: 'Milwaukee M18 Cordless Tools Lot (15 units)', qty: 15, totalUsd: 2775, status: 'Quote Received', statusColor: 'bg-green-100 text-green-700' },
    { id: 'RFQ-8810', date: '2026-09-10', item: 'Samsung 55" 4K Smart TV Pallet (10 units)', qty: 10, totalUsd: 3200, status: 'Under Review', statusColor: 'bg-amber-100 text-amber-700' },
    { id: 'RFQ-8640', date: '2026-08-28', item: 'DeWalt 20V Max Combo Kits Bulk Lot (40 units)', qty: 40, totalUsd: 6800, status: 'Completed', statusColor: 'bg-blue-100 text-blue-700' },
  ];

  const sampleListings = [
    { 
      id: 'PRD-1024', 
      title: 'Bosch Professional 18V Cordless Drill (Single Item)', 
      type: 'single', 
      condition: 'Brand New', 
      units: 1, 
      priceUsd: 185, 
      status: 'Active' 
    },
    { 
      id: 'LOT-3049', 
      title: 'Excess Stock - Apple iPad Air 5th Gen (64GB) Sealed Batch', 
      type: 'lot', 
      condition: 'Factory Sealed', 
      units: 50, 
      priceUsd: 18500, 
      status: 'Active' 
    },
    { 
      id: 'PRD-1088', 
      title: 'Milwaukee M12 Fuel Stubby Impact Wrench', 
      type: 'single', 
      condition: 'New in Box', 
      units: 1, 
      priceUsd: 145, 
      status: 'Active' 
    },
    { 
      id: 'LOT-2911', 
      title: 'Overstock Industrial Electrical Connectors Lot Batch', 
      type: 'lot', 
      condition: 'Factory Sealed', 
      units: 500, 
      priceUsd: 4200, 
      status: 'Active' 
    },
  ];

  const filteredListings = sampleListings.filter(item => {
    if (listingFilter === 'single') return item.type === 'single';
    if (listingFilter === 'lot') return item.type === 'lot';
    return true;
  });

  const sampleSaved = [
    { id: 'SAV-1', title: 'Bosch Professional Cordless Impact Drivers Lot', priceUsd: 1450, location: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&auto=format&fit=crop&q=80' },
    { id: 'SAV-2', title: 'LG UltraFine 27" 4K Monitors Wholesale Lot', priceUsd: 5400, location: 'Riyadh, Saudi Arabia', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300&auto=format&fit=crop&q=80' },
  ];

  return (
    <section className="py-10 bg-gray-50/60 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Profile Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Avatar & User Details */}
            <div className="flex items-center space-x-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#0f7a61] to-[#1bbd98] text-white flex items-center justify-center font-extrabold text-3xl shadow-md border-4 border-white">
                  {fullName ? fullName[0].toUpperCase() : 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-[#0f7a61]" />
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                  <span className="bg-[#e6f7ef] text-[#0f7a61] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Verified Business
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">{companyName} &bull; {businessType}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> {email}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> Dubai, UAE
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">{sampleRfqs.length}</div>
                <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Active RFQs</div>
              </div>
              <div className="border-x border-gray-200">
                <div className="text-lg font-bold text-[#0f7a61]">{sampleListings.length}</div>
                <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Listings</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{sampleSaved.length}</div>
                <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Saved</div>
              </div>
            </div>

          </div>
        </div>

        {/* Saved Toast Notification */}
        {isSavedNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold">Profile updated successfully!</span>
            </div>
          </div>
        )}

        {/* Main Profile Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Navigation Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-3 border border-gray-100 shadow-sm space-y-1">
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#0f7a61] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile Info</span>
              </button>

              <button
                onClick={() => setActiveTab('rfqs')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'rfqs'
                    ? 'bg-[#0f7a61] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>My RFQs & Quotes</span>
              </button>

              <button
                onClick={() => setActiveTab('listings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'listings'
                    ? 'bg-[#0f7a61] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>My Surplus Inventory</span>
              </button>

              <button
                onClick={() => setActiveTab('saved')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'saved'
                    ? 'bg-[#0f7a61] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Saved Deals</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-[#0f7a61] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Account & Settings</span>
              </button>

            </div>
          </div>

          {/* Tab View Content */}
          <div className="lg:col-span-3">

            {/* TAB 1: Profile Info */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Personal Details</h2>
                  <p className="text-gray-500 text-xs">Manage your personal contact info and credentials.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                      <input 
                        type="text" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Business Location</label>
                      <input 
                        type="text" 
                        value={businessLocation} 
                        onChange={(e) => setBusinessLocation(e.target.value)}
                        placeholder="Enter business location (e.g. Dubai, UAE)"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61]" 
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100"></div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Business & Company Details</h2>
                  <p className="text-gray-500 text-xs">Verified tax & business registration details.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name</label>
                      <input 
                        type="text" 
                        value={companyName} 
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter company name"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Tax Registration / TRN Number</label>
                      <input 
                        type="text" 
                        value={taxId} 
                        onChange={(e) => setTaxId(e.target.value)}
                        placeholder="Enter TRN / Tax ID"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Business Type</label>
                      <select 
                        value={businessType} 
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#0f7a61]"
                      >
                        <option value="">Select Business Type</option>
                        <option value="Wholesaler / Distributor">Wholesaler / Distributor</option>
                        <option value="Liquidator / Surplus Buyer">Liquidator / Surplus Buyer</option>
                        <option value="Retail Store Chain">Retail Store Chain</option>
                        <option value="Manufacturer / OEM">Manufacturer / OEM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Business Address</label>
                      <input 
                        type="text" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter business address"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0f7a61] focus:ring-1 focus:ring-[#0f7a61]" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button 
                    type="submit"
                    className="bg-[#0f7a61] hover:bg-[#0c6651] text-white font-semibold text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: My RFQs */}
            {activeTab === 'rfqs' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">RFQ & Quote History</h2>
                    <p className="text-gray-500 text-xs mt-0.5">Track submitted quote requests and seller proposals.</p>
                  </div>
                  <Link href="/browse" className="btn btn-secondary !py-2 !px-4 !text-xs rounded-full">
                    + New RFQ
                  </Link>
                </div>

                <div className="space-y-4">
                  {sampleRfqs.map((rfq) => (
                    <div key={rfq.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900 text-sm">{rfq.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rfq.statusColor}`}>
                            {rfq.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-800 mt-1">{rfq.item}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Submitted on {rfq.date} &bull; Qty: {rfq.qty} units</p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-3 sm:pt-0 border-gray-200">
                        <div className="text-left sm:text-right">
                          <div className="text-xs text-gray-400">Total Quote</div>
                          <div className="text-base font-extrabold text-[#0f7a61]">
                            {formatPrice(rfq.totalUsd)}
                          </div>
                        </div>
                        <button className="btn btn-secondary !py-2 !px-3 !text-xs rounded-full flex items-center gap-1">
                          View Details <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: My Surplus Inventory & Listings (Single Product + Lot Batch) */}
            {activeTab === 'listings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">My Surplus Inventory</h2>
                    <p className="text-gray-500 text-xs mt-0.5">Manage your single product listings and wholesale lot batches listed for liquidation.</p>
                  </div>
                  <div>
                    <button 
                      onClick={() => setIsLotModalOpen(true)} 
                      className="bg-[#0f7a61] hover:bg-[#0c6651] text-white font-semibold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Boxes className="w-3.5 h-3.5" />
                      <span>+ Import Lot Batch</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Tabs Filter (All / Single Products / Lot Batches) */}
                <div className="flex items-center space-x-2 border-b border-gray-100 pb-4 mb-6 overflow-x-auto">
                  <button
                    onClick={() => setListingFilter('all')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      listingFilter === 'all'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All Listings ({sampleListings.length})
                  </button>

                  <button
                    onClick={() => setListingFilter('single')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
                      listingFilter === 'single'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    <Box className="w-3 h-3" />
                    Single Products ({sampleListings.filter(i => i.type === 'single').length})
                  </button>

                  <button
                    onClick={() => setListingFilter('lot')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
                      listingFilter === 'lot'
                        ? 'bg-[#0f7a61] text-white'
                        : 'bg-[#e6f7ef] text-[#0f7a61] hover:bg-green-100'
                    }`}
                  >
                    <Boxes className="w-3 h-3" />
                    Wholesale Lots & Batches ({sampleListings.filter(i => i.type === 'lot').length})
                  </button>
                </div>

                {/* Listings Items */}
                <div className="space-y-4">
                  {filteredListings.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900 text-sm">{item.id}</span>
                          
                          {/* Single vs Lot Badge */}
                          {item.type === 'single' ? (
                            <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <Box className="w-3 h-3" /> Single Product
                            </span>
                          ) : (
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <Boxes className="w-3 h-3" /> Wholesale Lot Batch
                            </span>
                          )}

                          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {item.status}
                          </span>
                        </div>
                        
                        <h4 className="text-sm font-semibold text-gray-800 mt-1.5">{item.title}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{item.condition} &bull; {item.units} {item.units === 1 ? 'Unit' : 'Units'}</p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-3 sm:pt-0 border-gray-200">
                        <div className="text-left sm:text-right">
                          <div className="text-xs text-gray-400">Asking Price</div>
                          <div className="text-base font-extrabold text-[#0f7a61]">
                            {formatPrice(item.priceUsd)}
                          </div>
                        </div>
                        <button className="btn btn-secondary !py-2 !px-3 !text-xs rounded-full flex items-center gap-1">
                          Edit Listing <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Saved Deals */}
            {activeTab === 'saved' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Saved Deals</h2>
                    <p className="text-gray-500 text-xs mt-0.5">Bookmarked inventory lots for easy access.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sampleSaved.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex space-x-3">
                      <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-gray-900 truncate mb-1">{item.title}</h4>
                        <p className="text-[11px] text-gray-400 mb-2">{item.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-[#0f7a61]">{formatPrice(item.priceUsd)}</span>
                          <Link href="/browse" className="text-xs font-semibold text-[#0f7a61] hover:underline">View Deal</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Account & Notification Settings</h2>
                  <p className="text-gray-500 text-xs">Configure alerts and security preferences.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Email Notifications</h4>
                      <p className="text-xs text-gray-500">Receive updates when sellers reply to RFQs.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={emailNotifs} 
                      onChange={(e) => setEmailNotifs(e.target.checked)}
                      className="w-5 h-5 accent-[#0f7a61] rounded cursor-pointer" 
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">RFQ Status Alerts</h4>
                      <p className="text-xs text-gray-500">Get notified when a quote is approved or updated.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={rfqUpdates} 
                      onChange={(e) => setRfqUpdates(e.target.checked)}
                      className="w-5 h-5 accent-[#0f7a61] rounded cursor-pointer" 
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Price Drop Alerts</h4>
                      <p className="text-xs text-gray-500">Alert me when saved inventory lots drop in price.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={priceAlerts} 
                      onChange={(e) => setPriceAlerts(e.target.checked)}
                      className="w-5 h-5 accent-[#0f7a61] rounded cursor-pointer" 
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Listing Modals */}
      <SimpleListingModal 
        isOpen={isSimpleModalOpen} 
        onClose={() => setIsSimpleModalOpen(false)} 
      />
      <LotImportModal 
        isOpen={isLotModalOpen} 
        onClose={() => setIsLotModalOpen(false)} 
      />
    </section>
  );
}
