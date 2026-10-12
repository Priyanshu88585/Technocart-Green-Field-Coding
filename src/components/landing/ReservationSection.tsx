export function ReservationSection() {
  return (
    <section id="reserve" className="py-24 lg:py-32 border-b border-white/20">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
          <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-white/40 tracking-widest uppercase">
            <span className="w-12 h-px bg-white/30" />
            Private Dining &amp; Events
            <span className="w-12 h-px bg-white/30" />
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Reserve Your Table.
          </h2>
          <p className="text-sm sm:text-base text-white/40">
            For private dining rooms, corporate degustations, or evening tables, send an inquiry directly to the store manager.
          </p>
        </div>

        <div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-2xl border border-white/25 bg-background/60 backdrop-blur-sm space-y-6 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-white/50">Guest Name</label>
              <input
                type="text"
                placeholder="Vikramaditya Roy"
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/[0.02] text-sm text-white placeholder-white/20 focus:border-white/50 outline-none transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-white/50">Contact Phone</label>
              <input
                type="tel"
                placeholder="+91 98200 12345"
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/[0.02] text-sm text-white placeholder-white/20 focus:border-white/50 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-white/50">Party Size</label>
              <select className="w-full px-4 py-3 rounded-xl border border-white/20 bg-background text-sm text-white focus:border-white/50 outline-none transition-colors">
                <option value="2">2 Guests (Intimate)</option>
                <option value="4">4 Guests (Standard)</option>
                <option value="6">6 Guests (Booth)</option>
                <option value="8">8+ Guests (VIP Room)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-white/50">Preferred Dining Slot</label>
              <select className="w-full px-4 py-3 rounded-xl border border-white/20 bg-background text-sm text-white focus:border-white/50 outline-none transition-colors">
                <option value="lunch">Lunch Service (12:30 PM - 3:30 PM)</option>
                <option value="dinner">Dinner Service (7:00 PM - 11:30 PM)</option>
                <option value="late">Late Night Tasting (10:30 PM onwards)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-white/50">Special Dietary Requests</label>
            <textarea
              rows={3}
              placeholder="Allergies, anniversary arrangements, wine pairings..."
              className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/[0.02] text-sm text-white placeholder-white/20 focus:border-white/50 outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="button"
            className="w-full py-4 bg-white text-black font-semibold text-sm rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Confirm Reservation Request &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}
