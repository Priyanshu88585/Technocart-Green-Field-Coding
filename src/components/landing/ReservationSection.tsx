export function ReservationSection() {
  return (
    <section id="reserve" className="py-24 lg:py-32 border-b border-border">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
          <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-muted-foreground tracking-widest uppercase">
            <span className="w-12 h-px bg-border" />
            Private Dining &amp; Events
            <span className="w-12 h-px bg-border" />
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Reserve Your Table.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            For private dining rooms, corporate degustations, or evening tables, send an inquiry directly to the store manager.
          </p>
        </div>

        <div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-2xl border border-border bg-card/80 backdrop-blur-sm space-y-6 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Guest Name</label>
              <input
                type="text"
                placeholder="Vikramaditya Roy"
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/40 outline-none transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Contact Phone</label>
              <input
                type="tel"
                placeholder="+91 98200 12345"
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/40 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Party Size</label>
              <select className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground focus:border-foreground/40 outline-none transition-colors">
                <option value="2">2 Guests (Intimate)</option>
                <option value="4">4 Guests (Standard)</option>
                <option value="6">6 Guests (Booth)</option>
                <option value="8">8+ Guests (VIP Room)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Preferred Dining Slot</label>
              <select className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground focus:border-foreground/40 outline-none transition-colors">
                <option value="lunch">Lunch Service (12:30 PM - 3:30 PM)</option>
                <option value="dinner">Dinner Service (7:00 PM - 11:30 PM)</option>
                <option value="late">Late Night Tasting (10:30 PM onwards)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Special Dietary Requests</label>
            <textarea
              rows={3}
              placeholder="Allergies, anniversary arrangements, wine pairings..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/40 outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="button"
            className="w-full py-4 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            Confirm Reservation Request &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}
