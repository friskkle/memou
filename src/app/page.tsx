import { redirect } from "next/navigation";
import { PrimaryButton } from "../components/elements/primary-button";

const Home = () => {
  return (
    <div className="flex-1 font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="font-serif text-5xl sm:text-6xl font-medium text-center">
          Welcome to <span className="italic">Memou</span>
        </h1>
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center">
          <PrimaryButton link={`/journal`}>Start Memou</PrimaryButton>
        </ol>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        ❤️
      </footer>
    </div>
  );
}

export default Home;