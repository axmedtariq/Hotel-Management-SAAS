// client/src/features/rooms/RoomTable.tsx
import { Filter, Sparkles, ChevronDown, MoreHorizontal } from 'lucide-react';

const RoomTable = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
      {/* Table Header / Filters */}
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-sm font-semibold">
            <Sparkles size={16} /> AI Smart Sort
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm">
            <Filter size={16} /> Filter by Status
          </div>
        </div>
        <span className="text-slate-400 text-sm">Showing 48 Luxury Suites</span>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-slate-500 uppercase text-[10px] tracking-widest font-bold">
            <th className="px-6 py-4">Room Details</th>
            <th className="px-6 py-4">Floor</th>
            <th className="px-6 py-4">Current Rate</th>
            <th className="px-6 py-4">AI Demand</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <tr className="hover:bg-white/[0.03] transition-colors group">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/20 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=100&q=80" alt="room" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-white font-medium">Ocean Vista 402</div>
                  <div className="text-slate-500 text-xs">King Bed • Balcony</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 text-slate-300">Level 4</td>
            <td className="px-6 py-4 font-mono text-indigo-400">$450/nt</td>
            <td className="px-6 py-4">
               <div className="flex items-center gap-1.5 text-orange-400 text-xs font-bold">
                 <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" /> 
                 HIGH DEMAND
               </div>
            </td>
            <td className="px-6 py-4">
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold">Clean & Ready</span>
            </td>
            <td className="px-6 py-4 text-right">
              <button className="p-2 hover:bg-white/10 rounded-lg text-slate-500 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};