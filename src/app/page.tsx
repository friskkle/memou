import Link from "next/link";
import { PrimaryButton } from "../components/elements/primary-button";
import { AnimatedTitle } from "../components/ui/animated-title";

const Home = async () => {
  return (
    <div className="flex-1 font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-20 gap-16">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <AnimatedTitle  className="inline font-serif text-5xl sm:text-6xl font-medium text-center">
          Welcome to <span className="italic">Memou</span>
        </AnimatedTitle>
        <AnimatedTitle delay={0.3}>
          <Link href="/journal">
            <PrimaryButton>Start Memou</PrimaryButton>
          </Link>
        </AnimatedTitle>
      </main>
      <footer className="row-start-3 flex gap6 flex-wrap items-center justify-center">
        ❤️
      </footer>
    </div>
  );
}

export default Home;