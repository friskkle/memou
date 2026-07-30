'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import CasinoOutlinedIcon from '@mui/icons-material/CasinoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import confetti from 'canvas-confetti';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { DateIdea } from '@/src/lib/definitions';

const cn = (...inputs: (string | undefined | null | false)[]) =>
  twMerge(clsx(inputs));

const ITEM_HEIGHT = 76;
const ITEM_GAP = 4;
const ITEM_SLOT = ITEM_HEIGHT + ITEM_GAP;

const CATEGORY_CLASSES: Record<
  string,
  { bg: string; border: string; text: string; gradient: string }
> = {
  'Cozy In': {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-700',
    gradient: 'from-blue-500 to-indigo-600',
  },
  Foodie: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-700',
    gradient: 'from-amber-500 to-orange-600',
  },
  Outdoor: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-700',
    gradient: 'from-emerald-500 to-teal-600',
  },
  Creative: {
    bg: 'bg-violet-50',
    border: 'border-violet-300',
    text: 'text-violet-700',
    gradient: 'from-violet-500 to-purple-600',
  },
  Adventure: {
    bg: 'bg-rose-50',
    border: 'border-rose-300',
    text: 'text-rose-700',
    gradient: 'from-rose-500 to-red-600',
  },
  'Errands Plus': {
    bg: 'bg-slate-50',
    border: 'border-slate-300',
    text: 'text-slate-700',
    gradient: 'from-slate-500 to-zinc-600',
  },
};

function IdeaStrip({ idea }: { idea: DateIdea }) {
  const colors = CATEGORY_CLASSES[idea.category] ?? {
    bg: 'bg-stone-50',
    border: 'border-stone-200',
    text: 'text-stone-700',
    gradient: 'from-stone-500 to-stone-600',
  };

  return (
    <div
      style={{ height: ITEM_HEIGHT }}
      className={cn(
        'flex shrink-0 items-center rounded-lg border px-3',
        colors.bg,
        colors.border,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-sm font-bold', colors.text)}>
          {idea.title}
        </p>
        <p className="truncate text-xs text-stone-500">
          {idea.category} &middot; {idea.budget}
        </p>
      </div>
    </div>
  );
}

interface SpinnerProps {
  ideas: DateIdea[];
  onSpin: (idea: DateIdea) => void;
  onPlan?: (idea: DateIdea) => void;
  disabled?: boolean;
}

export function Spinner({ ideas, onSpin, onPlan, disabled }: SpinnerProps) {
  const [spinning, setSpinning] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<DateIdea | null>(null);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);

  const reelItems = useMemo(() => {
    if (ideas.length === 0) return [];

    const weightedIdeas: DateIdea[] = ideas.flatMap(
      idea => Array.from({ length: idea.priority ?? 1 }, () => idea)
    ).sort(() => Math.random() - 0.5)

    const duplicates: DateIdea[] = [];
    for (let i = 0; i < 8; i++) {

      duplicates.push(...weightedIdeas);
    }
    return duplicates;
  }, [ideas]);

  const handleSpin = useCallback(async () => {
    if (ideas.length === 0 || spinning || disabled) return;

    setSpinning(true);
    setSelectedIdea(null);
    controls.set({ y: 0 });

    const targetIndex = Math.floor(Math.random() * reelItems.length/8);
    const cycles = 3 + Math.floor(Math.random() * 3);
    const targetOffset = (cycles * reelItems.length/8 + targetIndex) * ITEM_SLOT;

    const overshoot = ITEM_SLOT * (Math.random() * 0.5 - 0.15);

    await controls.start({
      y: -(targetOffset + overshoot),
      transition: {
        duration: 3.2 + Math.random() * 1.6,
        ease: [0.1, 0.8, 0.15, 1],
      },
    });

    await controls.start({
      y: -targetOffset,
      transition: { type: 'spring', stiffness: 300, damping: 28, mass: 0.6 },
    });

    const idea = reelItems[targetIndex];
    setSelectedIdea(idea);
    setSpinning(false);
    onSpin(idea);

    if(!confettiRef.current) return;
    const rect = confettiRef.current.getBoundingClientRect();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height) / window.innerHeight,
      },
    });
  }, [ideas, spinning, disabled, controls, onSpin]);

  return (
    <div className="rounded-lg border border-stone-200 bg-white shadow-sm h-fit">
      <div className="flex items-center justify-between gap-3 border-b border-stone-200 px-4 py-3">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Spinner</h2>
          <p className="text-sm text-stone-500">{ideas.length} in the pool</p>
        </div>
        <button
          type="button"
          onClick={handleSpin}
          disabled={ideas.length === 0 || spinning || disabled}
          className="inline-flex items-center gap-2 rounded-lg bg-jbrown px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-jbrown-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CasinoOutlinedIcon fontSize="small" />
          {spinning ? 'Spinning…' : 'Spin'}
        </button>
      </div>

      <div ref={containerRef} className="relative h-72 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-linear-to-b from-white via-white/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-linear-to-b from-transparent via-white/80 to-white" />

        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 items-center">
          <div className="ml-2 h-3 w-3 -translate-x-1/2 rotate-45 border-2 border-jbrown bg-white" />
          <div className="h-px flex-1 bg-linear-to-r from-jbrown to-transparent" />
          <div className="mx-2 h-2 w-2 rounded-full border-2 border-jbrown bg-white shadow-sm" />
          <div className="h-px flex-1 bg-linear-to-l from-jbrown to-transparent" />
          <div className="mr-2 h-3 w-3 translate-x-1/2 rotate-45 border-2 border-jbrown bg-white" />
        </div>

        <div className="relative h-full overflow-hidden py-[calc((18rem-76px)/2)]">
          <motion.div
            animate={controls}
            initial={{ y: 0 }}
            className="flex flex-col gap-1 px-4"
          >
            {reelItems.map((idea, idx) => (
              <IdeaStrip key={`${idea.id}-${idx}`} idea={idea} />
            ))}
          </motion.div>
        </div>
      </div>

      <div ref={confettiRef} className="flex flex-col min-h-[125px] justify-center border-t border-stone-200">
        {spinning ? (
          <div className="flex h-full w-full items-center animate-pulse justify-center py-8 text-sm text-stone-500">
            <span className='px-4 py-1 rounded-2xl bg-jbrown text-white animate-bounce'>
              Spinning...
            </span>
          </div>
        ) : selectedIdea ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 10, stiffness: 300 }}
            className="w-full px-4 py-2"
          >
            <div
              className={cn(
                'rounded-lg bg-linear-to-br px-4 py-3 text-white',
                CATEGORY_CLASSES[selectedIdea.category]?.gradient ??
                  'from-stone-500 to-stone-600',
              )}
            >
              <p className="text-lg font-bold">{selectedIdea.title}</p>
              {selectedIdea.description && (
                <p className="text-sm text-white/80 line-clamp-1">
                  {selectedIdea.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                  {selectedIdea.category}
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                  {selectedIdea.budget}
                </span>
                {onPlan ? (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onPlan(selectedIdea)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold transition hover:bg-white/30 disabled:opacity-50"
                  >
                    <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                    Mark planned
                  </button>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex h-full w-full items-center justify-center py-8 text-sm text-stone-500">
            {ideas.length === 0
              ? 'No eligible ideas in this view.'
              : 'Ready when you are.'}
          </div>
        )}
      </div>
    </div>
  );
}
