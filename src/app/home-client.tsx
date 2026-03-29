"use client";

import Link from "next/link";
import { PrimaryButton } from "../components/elements/primary-button";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

export const HomeClient = () => {
  // Animation variants for smooth entering and exiting
  const sectionVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 40 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: "easeInOut"
      } 
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2 
      }
    }
  };

  return (
    <main className="flex-1 font-sans h-dvh overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-transparent text-stone-900">
      {/* Segment 1: Hero Start */}
      <section className="snap-always min-h-dvh w-full snap-start flex flex-col items-center justify-center p-8 md:p-20 relative">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3, margin: "100px 0px 0px 0px" }}
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center space-y-8 z-10 flex flex-col items-center"
        >
          <motion.h1 
            variants={sectionVariants} 
            className="inline font-serif text-5xl sm:text-7xl font-medium tracking-tight"
          >
            Welcome to <span className="italic text-[#D49273]">Memou</span>
          </motion.h1>
          <motion.p variants={sectionVariants} className="text-xl sm:text-2xl text-stone-600 max-w-2xl mx-auto font-light mt-6">
            Your personal space to capture thoughts, ideas, and memories with your loved ones effortlessly.
          </motion.p>
          <motion.div variants={sectionVariants} className="mt-12">
            <Link href="/journal" aria-label="Go to your journal">
              <PrimaryButton size="medium">Start Journaling</PrimaryButton>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-stone-400 font-light flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="text-sm tracking-widest uppercase">Scroll</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </motion.div>
      </section>

      {/* Segment 2: Introduction & Features Placeholder */}
      <section className="snap-always min-h-dvh w-full snap-start flex flex-col items-center justify-between pl-8 md:pl-20 py-8 md:py-20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-6 lg:gap-24 items-center"
        >
          <div className="space-y-6 pr-8 text-left">
            <motion.h2 
              variants={sectionVariants} 
              className="text-4xl sm:text-6xl font-serif font-medium text-stone-800"
            >
              Clear your mind.
            </motion.h2>
            <motion.p variants={sectionVariants} className="text-xl text-stone-600 font-light leading-relaxed">
              Memou provides a simple collaborative environment to log your memories and thoughts, all you have to do is type, and Memou will handle the rest.
            </motion.p>
            <motion.ul variants={containerVariants} className="space-y-4 pt-4 text-stone-600 text-lg select-none">
              <motion.li variants={sectionVariants} className="flex items-center gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D49273]/20 text-[#D49273] text-sm" aria-hidden="true">✨</span> 
                Minimalist interface
              </motion.li>
              <motion.li variants={sectionVariants} className="flex items-center gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D49273]/20 text-[#D49273] text-sm" aria-hidden="true">🔒</span> 
                Secure and private
              </motion.li>
              <motion.li variants={sectionVariants} className="flex items-center gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D49273]/20 text-[#D49273] text-sm" aria-hidden="true">⚡</span> 
                Seamless sharing
              </motion.li>
            </motion.ul>
          </div>
          <motion.div 
            variants={sectionVariants} 
            className="md:-mr-[40%] ml-auto p-5 rounded-2xl md:rounded-l-[40px] md:rounded-r-none overflow-hidden"
          >
            <Image 
              src="/screenshot.png" 
              alt="Screenshot" 
              width={904} 
              height={532} 
              className="max-w-2xl md:max-w-none rounded-2xl shadow-lg transition-transform duration-700 group-hover:-translate-y-2 group-hover:-translate-x-2" 
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Segment 3: Free Tier Highlight */}
      <section className="snap-always min-h-dvh w-full snap-start flex flex-col items-center justify-center p-8 md:p-20 bg-[#D49273] text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute right-0 top-0 w-[80vh] h-[80vh] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" aria-hidden="true"></div>
        <div className="absolute left-0 bottom-0 w-[60vh] h-[60vh] bg-black/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" aria-hidden="true"></div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center space-y-10 relative z-10 flex flex-col items-center"
        >
          <motion.div variants={sectionVariants} className="inline-block px-5 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-sm font-medium tracking-widest uppercase shadow-sm">
            Zero Cost
          </motion.div>
          <motion.h2 
            variants={sectionVariants} 
            className="text-5xl sm:text-7xl md:text-8xl font-serif font-medium leading-[1.1]"
          >
            Completely Free.<br/>
            Forever.
          </motion.h2>
          <motion.p variants={sectionVariants} className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
            No paywalls. No premium tiers. No hidden costs. 
            Because your inner thoughts shouldn&apos;t come with a price tag.
          </motion.p>
          <motion.div variants={sectionVariants} className="pt-8">
            <Link href="/journal" aria-label="Get started for free" className="no-underline hover:no-underline">
              <button className="px-10 py-5 bg-white text-[#9A654B] rounded-[18px] font-medium text-xl shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl flex items-center gap-3 group">
                Start Exploring Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Segment 4: GitHub Link & Footer */}
      <section className="snap-always min-h-dvh w-full snap-start flex flex-col items-center justify-center p-8 md:p-20 bg-stone-900 text-stone-100 relative">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="max-w-3xl mx-auto text-center space-y-12"
        >
          <motion.div variants={sectionVariants} className="space-y-6">
            <motion.h2 
              variants={sectionVariants} 
              className="text-4xl sm:text-6xl font-serif font-medium"
            >
              Open Source
            </motion.h2>
            <p className="text-xl text-stone-400 font-light leading-relaxed max-w-xl mx-auto">
              Memou is a public open-source project, initially made as a private project for me and my close ones to share notes without any restrictions or relying on public services.
            </p>
            <br/>
            <p className="text-xl text-stone-400 font-light leading-relaxed max-w-xl mx-auto">
              You can contribute to the project, report issues, or just check out how it works under the hood.
            </p>
          </motion.div>
          
          <motion.a
            variants={sectionVariants}
            href="https://github.com/friskkle/memou" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="View Memou on GitHub"
            className="inline-flex items-center gap-4 px-10 py-5 bg-stone-800 hover:bg-stone-700/80 rounded-full transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] group border border-stone-700 hover:border-stone-600 no-underline hover:no-underline"
          >
            <svg className="w-8 h-8 fill-current group-hover:rotate-360 transition-transform duration-700 ease-in-out" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-.131.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <span className="font-medium text-xl">View on GitHub</span>
          </motion.a>
        </motion.div>
        
        <footer className="absolute bottom-10 text-stone-500 font-medium flex items-center gap-2 text-sm tracking-wide">
          Memou <span className="text-[#D49273]">©</span> {new Date().getFullYear()} ❤️
        </footer>
      </section>
    </main>
  );
};
