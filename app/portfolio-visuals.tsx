export function ProjectPreview({ kind }: { kind: string }) {
  if (kind === "wellness") {
    return (
      <div className="relative flex h-full min-h-[220px] flex-col overflow-hidden bg-[#211821] p-5 text-white sm:p-8" aria-hidden="true">
        <div className="flex items-center justify-between text-[9px]"><span className="font-semibold">bloom®</span><span className="rounded-full border border-white/20 px-3 py-1">A space for you</span></div>
        <div className="mt-5 text-center text-[clamp(16px,2.4vw,29px)] leading-tight tracking-tight">A little more space.<br /><span className="text-[#dba2c5]">A little more you.</span></div>
        <div className="absolute inset-x-[-10%] top-[65%] h-20 rounded-[50%] border-2 border-[#cf83b4] shadow-[0_0_30px_#cc73a7,inset_0_0_25px_#cc73a7]" />
        <div className="relative mx-auto mt-5 w-24 rotate-[-5deg] rounded-[17px] border-[4px] border-[#b9a5b2] bg-[#fcf2f8] p-2 text-[#674459] shadow-2xl sm:w-28">
          <div className="mx-auto h-1 w-8 rounded-full bg-[#5c4755]" />
          <div className="mt-3 text-[8px]">How are you feeling?</div>
          <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[12px]"><span>☀</span><span>☁</span><span>♡</span></div>
          <div className="mt-3 rounded-md bg-[#e5cbdf] p-2 text-[7px]">Small steps,<br />big feelings.<div className="mt-2 h-4 rounded bg-white/50" /></div>
          <div className="mt-2 flex gap-1"><span className="h-6 flex-1 rounded bg-[#e2bdd7]" /><span className="h-6 flex-1 rounded bg-[#f0dae9]" /></div>
        </div>
      </div>
    );
  }

  if (kind === "editorial") {
    return (
      <div className="relative grid h-full min-h-[220px] grid-cols-[1.4fr_1fr] overflow-hidden bg-[#e7e5de] p-4 text-[#262923] sm:p-7" aria-hidden="true">
        <div className="relative z-10 my-4 flex flex-col justify-between bg-[#202923] p-5 text-[#ece8db] shadow-2xl">
          <div className="flex justify-between text-[8px]"><span>FORME</span><span>EST. 2026</span></div>
          <div className="my-7 text-[clamp(26px,3.2vw,42px)] leading-[.9] tracking-[-.06em]">Objects.<br />With<br /><i>intention.</i></div>
          <div className="h-px bg-white/20" /><div className="mt-3 text-[7px]">Designed to become part of your everyday.</div>
        </div>
        <div className="relative -ml-3 flex flex-col justify-between border border-[#d1cfc5] bg-[#faf9f5] p-5 pl-8">
          <div className="text-[9px] tracking-[.15em]">THE ART OF LESS</div>
          <div className="mx-auto h-28 w-16 rounded-t-[50%] bg-[#b9b4a3] shadow-[12px_12px_0_#e3dfd3] sm:h-40 sm:w-24" />
          <div className="text-[9px] leading-relaxed">Thoughtful forms.<br />Lasting impressions.<div className="mt-3 h-px bg-[#c9c6b9]" /></div>
        </div>
      </div>
    );
  }

  if (kind === "dashboard") {
    return (
      <div className="flex h-full min-h-[220px] overflow-hidden bg-[#202124] p-4 text-[#f2f2f5] sm:p-7" aria-hidden="true">
        <div className="w-14 shrink-0 border-r border-white/10 py-2 pr-4 text-[8px] sm:w-20"><span className="font-semibold text-[#bfaaf1]">pulse</span><div className="mt-6 space-y-4 text-white/40"><p>Overview</p><p>Activity</p><p>Reports</p><p>Settings</p></div></div>
        <div className="min-w-0 flex-1 pl-4 sm:pl-6">
          <div className="flex justify-between text-[9px]"><span>Overview</span><span className="text-white/30">This month ↗</span></div>
          <div className="mt-5 grid grid-cols-3 gap-2">{["Activity", "Growth", "Overview"].map((label, i) => <div key={label} className="rounded-md border border-white/10 bg-white/5 p-2 text-[7px] text-white/40"><span>{label}</span><div className="mt-2 h-2 w-2/3 rounded bg-[#b9a4ef]/70" /><div className="mt-2 text-[#bdadc9]">{["↗", "↑", "↗"][i]} This month</div></div>)}</div>
          <div className="mt-4 rounded-md border border-white/10 p-3"><div className="flex justify-between text-[8px]"><span>Activity over time</span><span className="text-[#b9a4ef]">Monthly</span></div><svg className="mt-4 h-20 w-full" viewBox="0 0 300 80" preserveAspectRatio="none"><path d="M0 70H300M0 40H300M0 10H300" stroke="#ffffff12" fill="none" /><path d="M0 70 25 61 40 67 60 43 77 50 95 30 116 42 135 35 154 20 179 28 203 11 226 20 252 7 272 11 300 0" stroke="#bda3f1" strokeWidth="2" fill="none" /></svg></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-[220px] items-center justify-center gap-5 overflow-hidden bg-[#e7ebe8] p-6" aria-hidden="true">
      {[false, true].map((second) => (
        <div key={String(second)} className={`w-[110px] shrink-0 rounded-[22px] border-[5px] border-[#293b32] bg-[#122d20] p-3 text-white shadow-xl sm:w-[135px] ${second ? "translate-y-7 rotate-[8deg]" : "-translate-y-5 rotate-[-7deg]"}`}>
          <div className="mx-auto h-1 w-9 rounded-full bg-black" />
          <div className="mt-5 flex justify-between text-[7px]"><span>Good morning</span><span>↗</span></div>
          <div className="mt-4 text-[9px] text-[#a4c9ae]">Your daily balance</div>
          <div className="mt-1 text-[23px] tracking-tight">{second ? "In focus." : "Feel good."}</div>
          <div className="mt-4 rounded-lg bg-[#dcebc2] p-3 text-[8px] text-[#173422]">Small changes.<div className="mt-1 text-[14px]">A better day.</div><div className="mt-2 flex gap-1">{[1,2,3,4,5,6].map((v) => <span key={v} className="h-5 flex-1 rounded-sm bg-[#72926b]/30" />)}</div></div>
          <div className="mt-5 flex justify-between text-[11px] text-[#a4c9ae]"><span>⌂</span><span>◷</span><span>♡</span></div>
        </div>
      ))}
    </div>
  );
}
