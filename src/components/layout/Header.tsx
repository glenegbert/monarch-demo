export function Header() {
  return (
    <header className="bg-slate-950 text-white px-6 py-4 flex items-center gap-4 shadow-lg">
      <img
        src="/monarch-logo.png"
        alt="Monarch Mountain"
        className="h-10 w-auto flex-shrink-0"
      />

      <div className="border-l border-slate-700 pl-4">
        <p className="text-sky-400 text-sm font-medium leading-none">
          Season Pass Sales Dashboard
        </p>
      </div>

      <div className="ml-auto text-right">
        <span className="text-xs text-slate-400 uppercase tracking-widest font-medium">
          Off-Season Sales Monitor
        </span>
        <p className="text-slate-300 text-sm font-semibold">2026 Season</p>
      </div>
    </header>
  );
}
