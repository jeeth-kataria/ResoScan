const MEMBERS = [
  { name: "Yashas N",       department: "AI & Data Science",     role: "Software & AI",   color: "#06b6d4" },
  { name: "Jeeth Kataria",  department: "AI & Data Science",     role: "Hardware & DSP",  color: "#8b5cf6" },
  { name: "Naveen G Patil", department: "AI & Machine Learning", role: "ML Engineering",  color: "#22c55e" },
];

const GUIDE = {
  name: "Dr. Sowmya B. J.",
  department: "AI & Data Science · Associate Professor",
  role: "Project Guide",
  color: "#06b6d4",
};

export function LandingTeam() {
  return (
    <section id="team" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.16em] text-text-faint">
            The team
          </div>
          <h2 className="mt-2 font-display text-3xl font-semibold text-text md:text-4xl">
            Built at{" "}
            <span className="text-accent">Ramaiah Institute of Technology.</span>
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-text-muted">
            A cross-disciplinary student team solving a clinical problem with hardware, signal processing, and AI.
          </p>
        </div>

        {/* Members grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MEMBERS.map((m) => (
            <Member key={m.name} {...m} />
          ))}
        </div>

        {/* Guide — full width card */}
        <div className="mt-5">
          <Member {...GUIDE} highlight />
        </div>
      </div>
    </section>
  );
}

function Member({
  name,
  department,
  role,
  color,
  highlight = false,
}: {
  name: string;
  department: string;
  role: string;
  color: string;
  highlight?: boolean;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={
        "surface card-hover flex flex-col gap-4 p-6 " +
        (highlight ? "lg:flex-row lg:items-center lg:justify-between" : "")
      }
      style={highlight ? { borderColor: `${color}40` } : undefined}
    >
      {/* Avatar + info */}
      <div className="flex items-center gap-4">
        {/* Avatar with gradient background */}
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-bold text-[#001619]"
          style={{
            background: highlight
              ? `linear-gradient(135deg, ${color}, ${color}cc)`
              : `linear-gradient(135deg, ${color}30, ${color}15)`,
            color: highlight ? "#001619" : color,
            border: `1.5px solid ${color}40`,
          }}
        >
          {initials}
        </span>

        <div className="leading-tight">
          <div className="font-display text-[15px] font-semibold text-text">
            {name}
          </div>
          <div className="mt-0.5 text-[11.5px] text-text-faint">{department}</div>
        </div>
      </div>

      {/* Role badge */}
      <span
        className="badge"
        style={{
          background: `${color}18`,
          color,
          border: `1px solid ${color}35`,
        }}
      >
        {role}
      </span>
    </div>
  );
}
