import React from 'react';
import { Globe, Award } from 'lucide-react';

export default function SustainabilityGoals() {
  return (
    <section className="w-full py-16 sm:py-24 bg-[#051711] text-white border-b border-emerald-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/80 px-4 py-1.5 text-xs font-semibold text-emerald-300 shadow-xs">
            <Globe className="h-3.5 w-3.5" />
            <span>International &amp; National Goals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            How We Align with Global and National Sustainability Goals
          </h2>
          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal max-w-2xl mx-auto">
            Supporting the UN's Sustainable Development Goals (SDGs). Surplus Market is aligned with key sustainability and climate action goals, specifically:
          </p>
        </div>

        {/* UN SDGs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Goal 12 */}
          <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/40 backdrop-blur-md p-6 hover:border-emerald-600/60 hover:bg-emerald-950/60 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#bf8b2e] text-white">
                Goal 12
              </span>
              <span className="text-xs font-semibold text-emerald-300/80">
                United Nations SDG
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              Goal 12
            </h3>
            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed font-normal">
              Ensuring sustainable consumption and production patterns by promoting the reuse and repurposing of excess inventory.
            </p>
          </div>

          {/* Goal 12.5 */}
          <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/40 backdrop-blur-md p-6 hover:border-emerald-600/60 hover:bg-emerald-950/60 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#cf9938] text-white">
                Target 12.5
              </span>
              <span className="text-xs font-semibold text-emerald-300/80">
                United Nations SDG
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              Goal 12.5
            </h3>
            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed font-normal">
              By 2030, substantially reduce waste generation through prevention, reduction, recycling, and reuse.
            </p>
          </div>

          {/* Goal 12.7 */}
          <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/40 backdrop-blur-md p-6 hover:border-emerald-600/60 hover:bg-emerald-950/60 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#a87a27] text-white">
                Target 12.7
              </span>
              <span className="text-xs font-semibold text-emerald-300/80">
                United Nations SDG
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              Goal 12.7
            </h3>
            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed font-normal">
              Promote sustainable procurement practices that align with national policies and priorities.
            </p>
          </div>

          {/* Goal 9 */}
          <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/40 backdrop-blur-md p-6 hover:border-emerald-600/60 hover:bg-emerald-950/60 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#f26a2e] text-white">
                Goal 9
              </span>
              <span className="text-xs font-semibold text-emerald-300/80">
                United Nations SDG
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              Goal 9
            </h3>
            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed font-normal">
              Building resilient infrastructure and fostering sustainable industrialization.
            </p>
          </div>

          {/* Goal 9.4 */}
          <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/40 backdrop-blur-md p-6 hover:border-emerald-600/60 hover:bg-emerald-950/60 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#df561a] text-white">
                Target 9.4
              </span>
              <span className="text-xs font-semibold text-emerald-300/80">
                United Nations SDG
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              Goal 9.4
            </h3>
            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed font-normal">
              By 2030, upgrade infrastructure to improve resource efficiency and adopt clean technologies.
            </p>
          </div>
        </div>

        {/* Qatar National Vision 2030 Banner */}
        <div className="rounded-3xl border border-emerald-600/30 bg-gradient-to-r from-emerald-950/90 via-[#072d21]/90 to-emerald-950/90 p-6 sm:p-10 backdrop-blur-md shadow-lg flex flex-col md:flex-row items-start md:items-center gap-6">
          <span className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-300">
            <Award className="w-7 h-7" />
          </span>
          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              Qatar National Vision 2030
            </h3>
            <p className="text-sm sm:text-base text-emerald-100/90 max-w-4xl leading-relaxed font-normal">
              Qatar National Vision 2030. We proudly align with Qatar's national vision for environmental responsibility by actively supporting sustainable industry practices and encouraging the responsible use of resources.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
