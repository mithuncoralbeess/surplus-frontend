import React from 'react';
import AboutHero from '../AboutHero';
import AboutHowWeOperate from '../AboutHowWeOperate';
import AboutOurStory from '../AboutOurStory';
import AboutMissionVision from '../AboutMissionVision';
import AboutWhatWeDo from '../AboutWhatWeDo';
import AboutCTA from '../AboutCTA';

export default function AboutUsWidget() {
  return (
    <div className="w-full flex flex-col items-center bg-gray-50/50">
      <AboutHero />
      <AboutHowWeOperate />
      <AboutOurStory />
      <AboutMissionVision />
      <AboutWhatWeDo />
      <AboutCTA />
    </div>
  );
}

export {
  AboutHero,
  AboutHowWeOperate,
  AboutOurStory,
  AboutMissionVision,
  AboutWhatWeDo,
  AboutCTA
};
