"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from '../../lib/motion';
import { 
  ArrowLeft, 
  Clock, 
  Share2, 
  Check, 
  Copy, 
  Sparkles, 
  BookOpen, 
  ChevronRight,
  User,
  Calendar,
  Globe,
  Plus,
  Minus,
  HelpCircle
} from 'lucide-react';
import { BlogPost, MOCK_BLOG_POSTS } from '../../data/blogData';
import { extractFaqsFromContent, stripFaqFromContent, fixContentImageUrls } from '../../services/blogService';
import { useTrackView } from '../../hooks/useTrackView';

interface BlogDetailProps {
  post: BlogPost;
}

export default function BlogDetail({ post }: BlogDetailProps) {
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Track blog view count
  useTrackView({
    entity_type: 'blog',
    entity_id: post.id,
    entity_slug: post.slug,
    title: post.title,
    path: typeof window !== 'undefined' ? window.location.pathname : `/blog/${post.slug}`,
  });

  const relatedPosts = MOCK_BLOG_POSTS.filter(p => p.id !== post.id && p.slug !== post.slug).slice(0, 3);

  // Extract FAQs from post object or content
  const faqs = (post.faqs && post.faqs.length > 0) 
    ? post.faqs 
    : extractFaqsFromContent(post.content || '');

  // Fix image URLs & strip raw FAQ text from main article HTML body
  const cleanContent = stripFaqFromContent(fixContentImageUrls(post.content || ''));

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article 
      className="w-full py-12 bg-gray-50/50"
      itemScope 
      itemType="https://schema.org/BlogPosting"
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        
        {/* Back Button / Breadcrumb link */}
        <nav aria-label="Breadcrumb">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#0a5c48] transition-colors mb-8 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>
        </nav>

        {/* Post Metadata Header */}
        <header className="mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 text-xs font-bold text-[#0a5c48] uppercase tracking-wider mb-4">
              <span className="bg-[#e0f0e9] px-3 py-1 rounded-full" itemProp="articleSection">{post.category}</span>
              <span>•</span>
              <time className="text-gray-500 font-medium flex items-center gap-1" itemProp="datePublished" dateTime={post.publishedAt}>
                <Calendar className="w-3.5 h-3.5" /> {post.publishedAt}
              </time>
              <span>•</span>
              <span className="text-gray-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {post.readTime}
              </span>
            </div>

            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6"
              itemProp="headline"
            >
              {post.title}
            </h1>

            <p 
              className="text-lg text-gray-600 leading-relaxed font-normal mb-8"
              itemProp="description"
            >
              {post.excerpt}
            </p>

            {/* Author & Share Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-gray-200">
              <div className="flex items-center gap-3" itemProp="author" itemScope itemType="https://schema.org/Person">
                <Image 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  width={48}
                  height={48}
                  sizes="48px"
                  itemProp="image"
                  className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full object-cover border-2 border-[#0a5c48]/20 shrink-0 aspect-square"
                />
                <div>
                  <span className="block text-sm font-bold text-gray-900" itemProp="name">{post.author.name}</span>
                  <span className="block text-xs text-gray-500 font-medium" itemProp="jobTitle">{post.author.role}</span>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 mr-1 uppercase tracking-wider">Share:</span>
                <button 
                  onClick={handleCopyLink}
                  className="p-2.5 bg-white border border-gray-200 text-gray-600 hover:text-[#0a5c48] hover:border-[#0a5c48] rounded-full transition-all shadow-sm"
                  title="Copy Link"
                  aria-label="Copy article link"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 bg-white border border-gray-200 text-gray-600 hover:text-[#0a5c48] hover:border-[#0a5c48] rounded-full transition-all shadow-sm"
                  title="Share Article"
                  aria-label="Share article"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Hero Cover Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg mb-12 border border-gray-200 h-[400px] sm:h-[480px]">
          <Image 
            src={post.coverImage} 
            alt={post.title} 
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            priority
            itemProp="image"
            className="object-cover"
          />
        </div>

        {/* Key Takeaways Card */}
        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <div className="bg-[#e0f0e9]/50 border border-[#0a5c48]/30 rounded-2xl p-6 sm:p-8 mb-12 shadow-sm">
            <h3 className="text-[25px] font-bold text-gray-900 mb-4 flex items-center gap-2 leading-tight">
              <Sparkles className="w-6 h-6 text-[#0a5c48]" /> Key Executive Takeaways
            </h3>
            <ul className="space-y-3">
              {post.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[16px] text-gray-700 leading-relaxed">
                  <span className="w-6 h-6 rounded-full bg-[#0a5c48] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Body Article Content */}
        <div 
          itemProp="articleBody"
          suppressHydrationWarning
          className="max-w-none text-gray-800 mb-16 space-y-6
            [&_h1]:hidden
            [&_h2]:text-[25px] [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:leading-snug
            [&_h3]:text-[25px] [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:leading-snug
            [&_h4]:text-[25px] [&_h4]:font-bold [&_h4]:text-gray-900 [&_h4]:mt-6 [&_h4]:mb-3 [&_h4]:leading-snug
            [&_h5]:text-[25px] [&_h5]:font-bold [&_h5]:text-gray-900 [&_h5]:mt-4 [&_h5]:mb-2 [&_h5]:leading-snug
            [&_h6]:text-[25px] [&_h6]:font-bold [&_h6]:text-gray-900 [&_h6]:mt-4 [&_h6]:mb-2 [&_h6]:leading-snug
            [&_p]:text-[16px] [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-5
            [&_a]:text-[16px] [&_a]:text-[#0a5c48] [&_a]:font-semibold [&_a]:underline [&_a]:hover:text-[#084838]
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2
            [&_li]:text-[16px] [&_li]:text-gray-700 [&_li]:leading-relaxed
            [&_img]:w-full [&_img]:max-w-full [&_img]:h-auto [&_img]:min-h-[250px] [&_img]:object-cover [&_img]:rounded-2xl [&_img]:border [&_img]:border-gray-200 [&_img]:shadow-sm [&_img]:my-8 [&_img]:mx-auto [&_img]:block
            [&_blockquote]:border-l-4 [&_blockquote]:border-[#0a5c48] [&_blockquote]:bg-[#e0f0e9]/40 [&_blockquote]:p-6 [&_blockquote]:rounded-r-2xl [&_blockquote]:my-6 [&_blockquote]:text-[16px] [&_blockquote]:text-gray-800 [&_blockquote]:font-medium [&_blockquote]:italic"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />

        {/* Article Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pb-8 border-b border-gray-200 mb-12">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Tags:</span>
            {post.tags.map((tag, idx) => (
              <span key={idx} className="bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-semibold text-gray-600">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Article FAQ Section */}
        {faqs.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#e0f0e9] flex items-center justify-center text-[#0a5c48]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[25px] font-bold text-gray-900 leading-tight">Frequently Asked Questions</h3>
                <p className="text-[16px] text-gray-500 font-medium mt-0.5">Key questions addressed in this article & category</p>
              </div>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                      isOpen 
                        ? 'border-[#0a5c48] bg-[#e0f0e9]/20 shadow-sm' 
                        : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer"
                    >
                      <span className="text-[16px] font-bold text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-[#0a5c48] text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </button>
                    
                    {isOpen && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 pb-5 pt-0 text-[16px] text-gray-600 leading-relaxed border-t border-[#0a5c48]/10 mt-1"
                      >
                        <p className="pt-3 text-[16px]">{faq.answer}</p>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Author Bio Footer Box */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-16">
          <Image 
            src={post.author.avatar} 
            alt={post.author.name}
            width={64}
            height={64}
            sizes="64px"
            className="w-16 h-16 min-w-[64px] min-h-[64px] rounded-full object-cover border-2 border-[#0a5c48]/30 shrink-0 aspect-square" 
          />
          <div>
            <span className="text-xs font-bold text-[#0a5c48] uppercase tracking-wider block mb-1">Written By</span>
            <h4 className="text-[25px] font-bold text-gray-900 mb-1 leading-snug">{post.author.name}</h4>
            <p className="text-xs font-semibold text-gray-500 mb-3">{post.author.role}</p>
            <p className="text-[16px] text-gray-600 leading-relaxed">
              Specializing in supply chain optimization, secondary B2B market trends, and circular economy liquidations across the GCC and international markets.
            </p>
          </div>
        </div>

        {/* Related Articles Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[25px] font-bold text-gray-900 leading-tight">Related Insights & Articles</h3>
            <Link href="/blog" className="text-xs font-bold text-[#0a5c48] hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(rel => (
              <Link 
                key={rel.id} 
                href={`/blog/${rel.slug}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="h-36 overflow-hidden bg-gray-100">
                  <img 
                    src={rel.coverImage} 
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold text-[#0a5c48] uppercase tracking-wider block mb-1">
                    {rel.category}
                  </span>
                  <h4 className="text-[16px] font-bold text-gray-900 group-hover:text-[#0a5c48] transition-colors line-clamp-2 mb-2">
                    {rel.title}
                  </h4>
                  <span className="text-xs text-gray-400 font-medium">{rel.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </article>
  );
}
