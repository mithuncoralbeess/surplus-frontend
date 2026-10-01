import React, { forwardRef } from 'react';

const createMotionComponent = (Tag: string) => {
  const Component = forwardRef<any, any>(({ 
    initial, 
    animate, 
    exit, 
    transition, 
    variants, 
    whileHover, 
    whileTap, 
    whileInView, 
    viewport, 
    layout,
    layoutId,
    'data-aos': dataAos,
    'data-aos-delay': dataAosDelay,
    'data-aos-duration': dataAosDuration,
    'data-aos-easing': dataAosEasing,
    ...props 
  }, ref) => {
    // Auto-map motion scroll triggers to AOS fade-up animations if no custom data-aos is provided
    const aosAttr = dataAos || (whileInView ? 'fade-up' : undefined);

    return React.createElement(Tag, { 
      ...props, 
      ref,
      'data-aos': aosAttr,
      'data-aos-delay': dataAosDelay,
      'data-aos-duration': dataAosDuration,
      'data-aos-easing': dataAosEasing,
    });
  });
  Component.displayName = `Motion(${Tag})`;
  return Component;
};

const componentCache = new Map<string, any>();

export const motion = new Proxy({} as any, {
  get: (_, prop: string) => {
    if (!componentCache.has(prop)) {
      componentCache.set(prop, createMotionComponent(prop));
    }
    return componentCache.get(prop);
  },
});

export const AnimatePresence: React.FC<{ children: React.ReactNode; mode?: string; initial?: boolean }> = ({ children }) => <>{children}</>;

export type Variants = any;
