"use client";

export default function LoadingTicket() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backing-blur-sm">
      <div className="relative flex flex-col items-center">
        {/* Ticket Shape */}
        <div className="relative h-32 w-60 rounded-lg  bg-gradient-to-br from-purple-900/60 via-black to-purple-950/80 shadow-lg animate-pulse">
          {/* Perforated sides */}
          <div className="absolute left-0 top-1/2 h-8 w-4 -translate-y-1/2 rounded-r-full bg-black"></div>
          <div className="absolute right-0 top-1/2 h-8 w-4 -translate-y-1/2 rounded-l-full bg-black"></div>

          {/* Ticket Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-bold text-yellow-400 tracking-widest animate-pulse">
              PASSKET
            </span>
            <span className="mt-1 text-sm text-white/70">Loading...</span>
          </div>
        </div>

        {/* Glow under ticket */}
        <div className="absolute top-full mt-6 h-12 w-40 rounded-full bg-yellow-400/30 blur-2xl animate-ping"></div>
      </div>
    </div>
  );
}
