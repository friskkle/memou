export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="font-serif text-5xl sm:text-6xl font-medium text-center">
          Welcome to <span className="italic">Memou</span>
        </h1>
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center">
          <li className="mb-2 tracking-[-.01em]">
            Get started:
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              <a href="/journal" className="ml-2 text-blue-600 hover:underline">Journal &rarr;</a>
            </code>
          </li>
        </ol>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        ❤️
      </footer>
    </div>
  );
}
