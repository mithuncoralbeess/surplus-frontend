import React from 'react';
import { Globe, Award } from 'lucide-react';

export default function SustainabilityGoals() {
  return (
    <section className="w-full py-10 sm:py-14 bg-slate-50/50 border-b border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-3.5 py-1 text-xs font-semibold text-[#0a5c48]">
            <Globe className="h-3.5 w-3.5 text-[#0a5c48]" />
            <span>International & National Goals</span>
          </div>
          <h2 className="h2 text-slate-900">
            How We Align with Global and National Sustainability Goals
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Supporting the UN&apos;s Sustainable Development Goals (SDGs). Surplus Market is aligned with key sustainability and climate action goals, specifically:
          </p>
        </div>

        {/* UN SDGs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Goal 12 */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all space-y-3.5 group">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                Goal 12
              </span>
              <span className="text-xs font-semibold text-slate-400">
                United Nations SDG
              </span>
            </div>
            <h3 className="h4 text-slate-900">
              Goal 12
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Ensuring sustainable consumption and production patterns by promoting the reuse and repurposing of excess inventory.
            </p>
          </div>

          {/* Goal 12.5 */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all space-y-3.5 group">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                Target 12.5
              </span>
              <span className="text-xs font-semibold text-slate-400">
                United Nations SDG
              </span>
            </div>
            <h3 className="h4 text-slate-900">
              Goal 12.5
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              By 2030, substantially reduce waste generation through prevention, reduction, recycling, and reuse.
            </p>
          </div>

          {/* Goal 12.7 */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all space-y-3.5 group">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                Target 12.7
              </span>
              <span className="text-xs font-semibold text-slate-400">
                United Nations SDG
              </span>
            </div>
            <h3 className="h4 text-slate-900">
              Goal 12.7
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Promote sustainable procurement practices that align with national policies and priorities.
            </p>
          </div>

          {/* Goal 9 */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all space-y-3.5 group">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200/80">
                Goal 9
              </span>
              <span className="text-xs font-semibold text-slate-400">
                United Nations SDG
              </span>
            </div>
            <h3 className="h4 text-slate-900">
              Goal 9
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Building resilient infrastructure and fostering sustainable industrialization.
            </p>
          </div>

          {/* Goal 9.4 */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all space-y-3.5 group">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200/80">
                Target 9.4
              </span>
              <span className="text-xs font-semibold text-slate-400">
                United Nations SDG
              </span>
            </div>
            <h3 className="h4 text-slate-900">
              Goal 9.4
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              By 2030, upgrade infrastructure to improve resource efficiency and adopt clean technologies.
            </p>
          </div>
        </div>

        {/* Qatar National Vision 2030 Banner */}
        <div className="rounded-3xl border border-emerald-200/90 bg-white p-6 sm:p-8 md:p-10 shadow-2xs flex flex-col md:flex-row items-start md:items-center gap-5 sm:gap-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 text-[#0a5c48]">
            <Award className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="h3 text-slate-900">
              Qatar National Vision 2030
            </h3>
            <p className="text-sm sm:text-base text-slate-600 max-w-4xl leading-relaxed font-normal">
              Qatar National Vision 2030. We proudly align with Qatar&apos;s national vision for environmental responsibility by actively supporting sustainable industry practices and encouraging the responsible use of resources.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
