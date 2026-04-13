export function Header() {
  return (
    <header className="bg-slate-950 text-white px-6 py-4 flex items-center gap-4 shadow-lg">
      {/* Mountain icon */}
      <div className="flex-shrink-0">
        <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,8 92,82 8,82" fill="#38bdf8"/>
          <polygon points="50,24 72,82 28,82" fill="white" fillOpacity="0.15"/>
          <polygon points="50,8 65,40 35,40" fill="white" fillOpacity="0.25"/>
        </svg>
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-tight text-white leading-none">
          Monarch Mountain
        </h1>
        <p className="text-sky-400 text-sm font-medium mt-0.5">
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
