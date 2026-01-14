// client/src/features/bookings/BookingSummary.tsx
const BookingSummary = ({ room, priceDetails }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl sticky top-8">
      <h3 className="text-xl font-bold text-white mb-6">Booking Summary</h3>
      
      <div className="space-y-4 border-b border-white/5 pb-6 mb-6">
        <div className="flex justify-between">
          <span className="text-slate-400">Base Rate</span>
          <span className="text-white">${priceDetails.baseRate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-indigo-400 flex items-center gap-1 text-sm">
            <Sparkles size={14} /> AI Dynamic Adjustment
          </span>
          <span className="text-indigo-400">+${priceDetails.aiSurge}</span>
        </div>
      </div>

      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Total Price</p>
          <h2 className="text-4xl font-black text-white">${priceDetails.totalAmount}</h2>
        </div>
        <span className="text-xs text-slate-400 italic">Taxes included</span>
      </div>

      <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]">
        Confirm & Pay Securely
      </button>
    </div>
  );
};