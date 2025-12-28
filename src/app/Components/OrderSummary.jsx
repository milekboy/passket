"use strict";

const fmtNaira = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

export default function OrderSummary({ lines, fees, grandTotal }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <h3 className="mb-4 text-lg font-semibold text-white">Order Summary</h3>

      <div className="space-y-3">
        {lines.map((line) => (
          <div key={line.id} className="flex justify-between text-sm text-white/80">
            <span>
              {line.name} <span className="text-white/50">x{line.qty}</span>
            </span>
            <span>{fmtNaira(line.subtotal)}</span>
          </div>
        ))}
      </div>

      {(fees > 0) && (
        <div className="mt-3 flex justify-between text-sm text-white/60">
          <span>Fees</span>
          <span>{fmtNaira(fees)}</span>
        </div>
      )}

      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between text-base font-bold text-white">
          <span>Total</span>
          <span className="text-yellow-400">{fmtNaira(grandTotal)}</span>
        </div>
      </div>
      
      <div className="mt-4 rounded-xl bg-blue-500/10 border border-blue-500/20 p-3">
        <p className="text-xs text-blue-200 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Tickets reserved for 15 minutes
        </p>
      </div>
    </div>
  );
}
