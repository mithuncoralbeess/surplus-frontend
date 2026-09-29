"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from '../../lib/motion';
import { Search, Clock, ArrowRight, Sparkles, Tag, ChevronRight, BookOpen } from 'lucide-react';
import { MOCK_BLOG_POSTS, BLOG_CATEGORIES, BlogPost } from '../../data/blogData';
import { getBlogs } from '../../services/blogService';

interface BlogListingProps {
  initialPosts?: BlogPost[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function BlogListing({ initialPosts }: BlogListingProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts || MOCK_BLOG_POSTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    if (!initialPosts || initialPosts.length === 0) {
      getBlogs().then((fetched) => {
        if (fetched && fetched.length > 0) {
          setPosts(fetched);
        }
      });
    }
  }, [initialPosts]);

  const featuredPost = useMemo(() => {
    return posts.find(post => post.featured) || posts[0];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch = searchQuery === "" || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.tags && post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <section className="w-full py-16 bg-gray-50/50">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

        {/* Featured Post Spotlight */}
        {featuredPost && selectedCategory === "All" && searchQuery === "" && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16 bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto min-h-[350px]">
                <Image 
                  src={featuredPost.coverImage} 
                  alt={featuredPost.title} 
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#0a5c48] text-white px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3.5 h-3.5" /> Featured Insights
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs font-bold text-[#0a5c48] uppercase tracking-wider mb-4">
                    <span>{featuredPost.category}</span>
                    <span>•</span>
                    <span className="text-gray-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
                    </span>
                  </div>

                  <Link href={`/blog/${featuredPost.slug}`}>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug mb-4 hover:text-[#0a5c48] transition-colors">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image 
                      src={featuredPost.author.avatar} 
                      alt={featuredPost.author.name}
                      width={40}
                      height={40}
                      sizes="40px"
                      className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full object-cover border border-gray-200 shrink-0 aspect-square" 
                    />
                    <div>
                      <span className="block text-sm font-bold text-gray-900">{featuredPost.author.name}</span>
                      <span className="block text-xs text-gray-500">{featuredPost.publishedAt}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center justify-center w-11 h-11 bg-[#e0f0e9] text-[#0a5c48] rounded-full hover:bg-[#0a5c48] hover:text-white transition-all shadow-sm"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {BLOG_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-[#0a5c48] text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-100/70"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search articles & topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a5c48] focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-md mx-auto my-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Articles Found</h3>
            <p className="text-sm text-gray-500 mb-6">We couldn't find any articles matching "{searchQuery}". Try searching for another topic or resetting filters.</p>
            <button 
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="px-6 py-2.5 bg-[#0a5c48] text-white rounded-full text-xs font-semibold hover:bg-[#084838] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          >
            {filteredPosts.map(post => (
              <motion.article 
                key={post.id}
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
                    <Image 
                      src={post.coverImage} 
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#0a5c48] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {post.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 pb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-2">
                      <span>{post.publishedAt}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3.5 h-3.5" /> {post.readTime}
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#0a5c48] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 sm:px-6 py-3.5 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2.5">
                    <Image 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      width={32}
                      height={32}
                      sizes="32px"
                      className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full object-cover border border-gray-200 shrink-0 aspect-square" 
                    />
                    <span className="text-xs font-semibold text-gray-800">{post.author.name}</span>
                  </div>

                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-[#0a5c48] hover:underline inline-flex items-center gap-1"
                  >
                    Read <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* Newsletter CTA Box */}
        <div className="bg-[#0a1e17] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">Stay Ahead of Global Surplus Trends</h3>
            <p className="text-white/70 text-sm sm:text-base mb-8 leading-relaxed">
              Get expert market insights, wholesale liquidation pricing intelligence, and secondary supply chain reports delivered to your inbox bi-weekly.
            </p>

            <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Enter your business email" 
                className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3.5 text-sm text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                required
              />
              <button 
                type="submit" 
                className="w-full sm:w-auto bg-[#0a5c48] hover:bg-[#084838] text-white px-8 py-3.5 rounded-full font-bold text-sm transition-all whitespace-nowrap shadow-md"
              >
                Subscribe Free
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
