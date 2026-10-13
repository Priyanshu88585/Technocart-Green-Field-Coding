const HERITAGE_FEATURES = [
  {
    idx: "01",
    title: "Awadhi Dum Cooking",
    desc: "Handi pots sealed with natural dough, cooked over charcoal embers to capture every aroma molecule.",
  },
  {
    idx: "02",
    title: "Strict Integer Arithmetic",
    desc: "Zero floating-point inaccuracies in financial calculations. All line totals, SGST, CGST, and discounts computed down to individual paise.",
  },
  {
    idx: "03",
    title: "Thermal Invoice Engine",
    desc: "Direct browser-native 80mm thermal receipt generation with legal tax breakdown and instant order settlement.",
  },
  {
    idx: "04",
    title: "Real-Time Floor Orchestration",
    desc: "Live visibility over 12 dining tables, occupied durations, and kitchen order ticket statuses without page reloads.",
  },
];

export function HeritageSection() {
  return (
    <section id="about" className="py-24 lg:py-32 border-b border-border">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-muted-foreground mb-6 tracking-widest uppercase">
              <span className="w-12 h-px bg-border" />
              The Gastronomic Standard
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight mb-8">
              Slow Crafted.
              <span className="block text-muted-foreground/40">Fast Billed.</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
              Rooted in royal Awadhi and Mughlai culinary traditions, The Grand Kitchen blends timeless slow-cooking methods with a bleeding-edge operational backbone.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-10">
              Every grain of aged basmati rice is slow-steamed under dough-sealed purdah. Every table ticket is digitally dispatched to kitchen screens in under 50ms.
            </p>

            <div className="p-6 rounded-2xl border border-border bg-card/60 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-foreground font-mono text-xs uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Certified Food Safety &amp; Legal Compliance</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono text-muted-foreground pt-2 border-t border-border">
                <div>
                  <span className="text-muted-foreground/60 block text-[10px]">GSTIN NUMBER</span>
                  <span className="text-foreground font-semibold">27AAACG0123M1Z5</span>
                </div>
                <div>
                  <span className="text-muted-foreground/60 block text-[10px]">FSSAI LICENSE</span>
                  <span className="text-foreground font-semibold">11521008000451</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {HERITAGE_FEATURES.map((item) => (
              <div
                key={item.idx}
                className="p-8 rounded-2xl border border-border bg-card/60 hover:border-foreground/30 transition-all space-y-3 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-mono font-medium text-muted-foreground/50">
                    {item.idx}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
