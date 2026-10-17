"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { previewNames, socialNames, type PortfolioDocument, type PortfolioContent, type Profile, type Project, type Experience, type Service } from "@/lib/portfolio-model";

const control = "min-h-11 w-full rounded-lg border border-[#d9dee7] bg-white px-3 py-2 text-[14px] text-[#202632] outline-none transition-shadow focus:border-[#65718a] focus:ring-2 focus:ring-[#65718a]/15 disabled:opacity-50";
const secondary = "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#d9dee7] bg-white px-4 text-[13px] font-medium text-[#364152] transition-colors hover:bg-[#f6f7f9] disabled:cursor-default disabled:opacity-35";
const primary = "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#202632] px-5 text-[13px] font-medium text-white hover:bg-[#343d4f] disabled:cursor-default disabled:opacity-40";

function Field({ label, value, onChange, multiline = false, type = "text", placeholder = "", required = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; type?: string; placeholder?: string; required?: boolean }) {
  const id = useId();
  return <label htmlFor={id} className="block text-[13px] font-medium text-[#364152]"><span className="mb-2 block">{label}{required && <span className="ml-1 text-[#8b95a7]">*</span>}</span>{multiline ? <textarea id={id} className={`${control} min-h-28 resize-y leading-relaxed`} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} /> : <input id={id} className={control} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} />}</label>;
}

function ImageField({ label, value, onChange, notify, uploadState }: { label: string; value: string; onChange: (value: string) => void; notify: (value: string) => void; uploadState: (busy: boolean) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    setError("");
    if (file.size > 8 * 1024 * 1024) { setError("Choose an image up to 8 MB."); return; }
    setBusy(true); uploadState(true);
    try {
      const form = new FormData(); form.set("file", file);
      const response = await fetch("/api/admin/uploads", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      onChange(result.url); notify("Image uploaded. Save changes to use it on the portfolio.");
    } catch (error) { setError(error instanceof Error ? error.message : "Upload failed. Try again."); }
    finally { setBusy(false); uploadState(false); if (input.current) input.current.value = ""; }
  }
  return <div className="space-y-3"><Field label={label} value={value} onChange={onChange} placeholder="Upload an image or paste its URL" />
    <div className="flex flex-wrap items-center gap-3">{value && <div className="relative h-20 w-32 overflow-hidden rounded-lg border border-[#e0e4eb] bg-[#f6f7f9]"><Image src={value} alt={`${label} preview`} fill sizes="128px" unoptimized className="object-contain" /></div>}<button type="button" disabled={busy} className={secondary} onClick={() => input.current?.click()}>{busy ? "Uploading…" : "Upload image"}</button>{value && <button type="button" className="min-h-10 cursor-pointer px-2 text-xs text-[#667085] underline underline-offset-4" onClick={() => onChange("")}>Remove image</button>}<span className="text-xs text-[#8b95a7]">PNG, JPEG, WebP · up to 8 MB</span></div>
    <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" aria-label={`Upload ${label.toLowerCase()}`} className="sr-only" tabIndex={-1} onChange={e => upload(e.target.files?.[0])} />{error && <p className="m-0 text-xs text-red-700" role="alert">{error}</p>}
  </div>;
}

function EntryTools({ index, count, title, up, down, remove }: { index: number; count: number; title: string; up: () => void; down: () => void; remove: () => void }) {
  return <div className="flex shrink-0 gap-1"><button type="button" disabled={index === 0} aria-label={`Move ${title} up`} className={`${secondary} size-9 min-h-9 px-0`} onClick={up}>↑</button><button type="button" disabled={index === count - 1} aria-label={`Move ${title} down`} className={`${secondary} size-9 min-h-9 px-0`} onClick={down}>↓</button><button type="button" className="min-h-9 cursor-pointer rounded-lg px-3 text-xs text-[#ab3441] hover:bg-red-50" aria-label={`Remove ${title}`} onClick={remove}>Remove</button></div>;
}

function move<T>(items: T[], index: number, direction: number) {
  const next = [...items]; const target = index + direction;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function Publication({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex min-h-10 cursor-pointer items-center gap-2 text-xs text-[#667085]"><input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="size-4 accent-[#202632]" />{checked ? "Published — visible after saving" : "Draft — hidden from visitors"}</label>;
}

export function AdminEditor({ initial }: { initial: PortfolioDocument }) {
  const [content, setContent] = useState<PortfolioContent>(initial.content);
  const [saved, setSaved] = useState(JSON.stringify(initial.content));
  const [revision, setRevision] = useState(initial.revision);
  const [tab, setTab] = useState("Profile");
  const [saving, setSaving] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [undo, setUndo] = useState<PortfolioContent | null>(null);
  const allowLeave = useRef(false);
  const dirty = JSON.stringify(content) !== saved;

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty && !allowLeave.current) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function profile(patch: Partial<Profile>) { setContent(p => ({ ...p, profile: { ...p.profile, ...patch } })); }
  function project(id: string, patch: Partial<Project>) { setContent(p => ({ ...p, projects: p.projects.map(item => item.id === id ? { ...item, ...patch } : item) })); }
  function experience(id: string, patch: Partial<Experience>) { setContent(p => ({ ...p, experience: p.experience.map(item => item.id === id ? { ...item, ...patch } : item) })); }
  function service(id: string, patch: Partial<Service>) { setContent(p => ({ ...p, services: p.services.map(item => item.id === id ? { ...item, ...patch } : item) })); }
  function remove(key: "projects" | "experience" | "services", id: string) {
    setUndo(content); setContent(p => ({ ...p, [key]: p[key].filter(item => item.id !== id) })); setMessage("Entry removed from this draft. Save changes to apply, or undo."); setError("");
  }
  function uploading(busy: boolean) { setUploadCount(count => count + (busy ? 1 : -1)); }

  async function save() {
    setSaving(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content, revision }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save changes.");
      setContent(result.content); setSaved(JSON.stringify(result.content)); setRevision(result.revision); setUndo(null);
      setMessage("Saved. Your published content is now live on the portfolio.");
    } catch (error) { setError(error instanceof Error ? error.message : "Could not connect. Your edits are still here; try saving again."); }
    finally { setSaving(false); }
  }

  async function reload() {
    if (dirty && !window.confirm("Discard your unsaved changes and load the saved version?")) return;
    setSaving(true); setError("");
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" }); const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load content.");
      setContent(result.content); setSaved(JSON.stringify(result.content)); setRevision(result.revision); setUndo(null); setMessage("Loaded the latest saved content.");
    } catch (error) { setError(error instanceof Error ? error.message : "Could not connect."); }
    finally { setSaving(false); }
  }

  async function logout() {
    if (dirty && !window.confirm("Sign out and discard unsaved changes?")) return;
    setSaving(true);
    try {
      const response = await fetch("/api/admin/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Could not sign out. Please try again.");
      allowLeave.current = true; setSaved(JSON.stringify(content)); window.location.reload();
    } catch (error) { setError(error instanceof Error ? error.message : "Could not sign out."); setSaving(false); }
  }

  const tabs = ["Profile", "Projects", "Experience", "Services"];
  const counts = [null, content.projects.length, content.experience.length, content.services.length];
  const card = "rounded-xl border border-[#e0e4eb] bg-white p-5 sm:p-7";
  return <main className="min-h-dvh bg-[#f6f7f9] text-[#202632]">
    <header className="sticky top-0 z-20 border-b border-[#e0e4eb] bg-white/95 px-5 backdrop-blur-md sm:px-8">
      <div className="mx-auto flex min-h-20 max-w-[1200px] flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-[#202632] font-mono text-xs text-white">AH</span><div><span className="block text-[15px] font-semibold">Your portfolio</span><span className="block text-xs text-[#8b95a7]">Amir.H Attarnia</span></div></div>
        <div className="flex flex-wrap items-center gap-2"><a href="/" target="_blank" rel="noopener noreferrer" className={secondary}>View portfolio ↗</a><button type="button" disabled={!dirty || saving || uploadCount > 0} onClick={save} className={primary}>{saving ? "Saving…" : "Save changes"}</button></div>
      </div>
    </header>
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-7 px-5 py-7 sm:px-8 sm:py-9 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-10">
      <aside className="min-w-0"><nav className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-[#e0e4eb] bg-white p-1.5 lg:flex-col" aria-label="Editor sections">{tabs.map((name,index) => <button key={name} type="button" aria-current={tab === name ? "page" : undefined} onClick={() => setTab(name)} className={`flex min-h-11 shrink-0 cursor-pointer items-center justify-between gap-4 rounded-lg px-3 text-sm transition-colors ${tab === name ? "bg-[#eef0f4] font-medium text-[#202632]" : "text-[#667085] hover:bg-[#f8f9fb]"}`}><span>{name}</span>{counts[index] !== null && <span className="rounded-md bg-[#e8ebf0] px-1.5 py-0.5 font-mono text-[10px] text-[#667085]">{counts[index]}</span>}</button>)}</nav>
        <div className="mt-5 flex flex-wrap gap-x-4 lg:flex-col lg:items-start lg:gap-1"><button type="button" disabled={saving} className="min-h-10 cursor-pointer text-xs text-[#667085] hover:text-[#202632]" onClick={reload}>Reload saved version</button><a href="/api/admin/content" download="portfolio-backup.json" className="flex min-h-10 items-center text-xs text-[#667085] hover:text-[#202632]">Download content backup</a><button type="button" disabled={saving} className="min-h-10 cursor-pointer text-xs text-[#667085] hover:text-[#202632]" onClick={logout}>Sign out</button></div>
      </aside>
      <section className="min-w-0" aria-labelledby="editor-heading">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><h1 id="editor-heading" className="mb-2 text-[28px] leading-tight font-semibold tracking-[-.04em] text-inherit">{tab}</h1><p className="m-0 text-sm leading-relaxed text-[#667085]">{tab === "Profile" ? "The details visitors see when they meet you." : tab === "Projects" ? "Add your work, upload a cover, and publish when it’s ready." : tab === "Experience" ? "Your roles, companies, and the work you did along the way." : "Keep your expertise and service descriptions up to date."}</p></div><span className={`mt-1 rounded-full px-2.5 py-1 text-[11px] ${dirty ? "bg-[#fff1d6] text-[#83570b]" : "bg-[#e8f4ec] text-[#347047]"}`}>{dirty ? "Unsaved changes" : "All changes saved"}</span></div>
        <div aria-live="polite">{message && <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#cfe3d4] bg-[#edf7f0] px-4 py-3 text-sm text-[#347047]"><span>{message}</span>{undo && <button type="button" className="cursor-pointer font-medium underline underline-offset-4" onClick={() => { setContent(undo); setUndo(null); setMessage("Removal undone."); }}>Undo</button>}</div>}</div>
        {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-700">{error}<a href="/admin" target="_blank" rel="noopener noreferrer" className="ml-2 underline underline-offset-4">Open sign-in in a new tab</a></div>}
        <fieldset disabled={saving} className="min-w-0 space-y-5 border-0 p-0">
          {tab === "Profile" && <>
            <div className={`${card} space-y-5`}><h2 className="m-0 text-base font-semibold text-inherit">Personal details</h2><div className="grid gap-5 sm:grid-cols-2"><Field label="First name" value={content.profile.firstName} onChange={v => profile({ firstName: v })} required /><Field label="Last name" value={content.profile.lastName} onChange={v => profile({ lastName: v })} required /></div><Field label="Position" value={content.profile.role} onChange={v => profile({ role: v })} required placeholder="Full Stack Developer" /><Field label="Short bio" value={content.profile.description} onChange={v => profile({ description: v })} multiline placeholder="A few sentences about you and the work you enjoy." /><div className="grid gap-5 sm:grid-cols-2"><Field label="Availability" value={content.profile.availability} onChange={v => profile({ availability: v })} /><Field label="Contact email" value={content.profile.email} onChange={v => profile({ email: v })} type="email" /></div></div>
            <div className={`${card} space-y-5`}><h2 className="m-0 text-base font-semibold text-inherit">Phone & WhatsApp</h2><p className="m-0 text-xs leading-relaxed text-[#667085]">Use the international format with a + and country code. Leave a number empty to hide its contact link.</p><div className="grid gap-5 sm:grid-cols-2"><Field label="Phone number" value={content.profile.phone} onChange={phone => profile({ phone })} type="tel" placeholder="+989934904062" /><Field label="WhatsApp number" value={content.profile.whatsapp} onChange={whatsapp => profile({ whatsapp })} type="tel" placeholder="+989934904062" /></div></div>
            <div className={`${card} space-y-5`}><h2 className="m-0 text-base font-semibold text-inherit">Search & sharing</h2><p className="m-0 text-xs leading-relaxed text-[#667085]">Set your live domain to enable search indexing, canonical links, and the sitemap. Localhost remains unindexed. Search engines may rewrite titles and descriptions. The server&apos;s PORTFOLIO_ORIGIN setting takes priority over this domain.</p><Field label="Live website URL" value={content.profile.siteUrl} onChange={siteUrl => profile({ siteUrl })} type="url" placeholder="https://your-domain.com" /><Field label="Search title" value={content.profile.seoTitle} onChange={seoTitle => profile({ seoTitle })} placeholder={`${content.profile.firstName} ${content.profile.lastName} — ${content.profile.role}`} /><Field label="Search description" value={content.profile.seoDescription} onChange={seoDescription => profile({ seoDescription })} multiline placeholder="Leave empty to use your bio or the automatic portfolio description." /></div>
            <div className={`${card} space-y-5`}><h2 className="m-0 text-base font-semibold text-inherit">Portrait</h2><ImageField label="Portrait image" value={content.profile.portrait.src} onChange={v => profile({ portrait: { ...content.profile.portrait, src: v } })} notify={setMessage} uploadState={uploading} /><Field label="Portrait description" value={content.profile.portrait.alt} onChange={v => profile({ portrait: { ...content.profile.portrait, alt: v } })} placeholder="A short description for screen readers." /></div>
            <div className={`${card} space-y-5`}><h2 className="m-0 text-base font-semibold text-inherit">Social links</h2><p className="m-0 text-xs text-[#667085]">Leave a link empty to hide it on your portfolio.</p>{socialNames.map(name => <Field key={name} label={name} value={content.profile.socials.find(s => s.name === name)?.href || ""} onChange={href => profile({ socials: [...content.profile.socials.filter(s => s.name !== name), { name, href }] })} placeholder="https://…" />)}</div>
          </>}
          {tab === "Projects" && <>
            {!content.projects.length && <div className={`${card} py-12 text-center`}><h2 className="mb-2 text-lg font-medium text-inherit">Your first project starts here.</h2><p className="m-0 text-sm text-[#667085]">Add a title, a cover image, and the story behind the work.</p></div>}
            {content.projects.map((item,index) => <article key={item.id} className={`${card} space-y-5`}><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="m-0 max-w-full text-base font-semibold break-words text-inherit">{item.title || "Untitled project"}</h2><EntryTools index={index} count={content.projects.length} title={item.title || "project"} up={() => setContent(p => ({ ...p, projects: move(p.projects, index, -1) }))} down={() => setContent(p => ({ ...p, projects: move(p.projects, index, 1) }))} remove={() => remove("projects", item.id)} /></div><Field label="Project title" value={item.title} onChange={title => project(item.id, { title })} /><div className="grid gap-5 sm:grid-cols-2"><label className="text-[13px] font-medium text-[#364152]">Category<select className={`${control} mt-2`} value={item.category} onChange={e => project(item.id, { category: e.target.value as Project["category"] })}><option>Projects</option><option>Explorations</option></select></label><Field label="Discipline / technology" value={item.tag} onChange={tag => project(item.id, { tag })} placeholder="Web application · React · Node.js" /></div><ImageField label="Project cover" value={item.image} onChange={image => project(item.id, { image })} notify={setMessage} uploadState={uploading} /><label className="block text-[13px] font-medium text-[#364152]">Fallback preview<select className={`${control} mt-2`} value={item.preview} onChange={e => project(item.id, { preview: e.target.value })}>{previewNames.map(name => <option key={name} value={name}>{name}</option>)}</select><span className="mt-2 block text-xs font-normal text-[#8b95a7]">Used only until you add a real cover image.</span></label><Field label="Project description" value={item.description} onChange={description => project(item.id, { description })} multiline /><Field label="Project website" value={item.url} onChange={url => project(item.id, { url })} placeholder="https://…" /><Publication checked={item.published} onChange={published => project(item.id, { published })} /></article>)}
            <button type="button" className={secondary} onClick={() => setContent(p => ({ ...p, projects: [...p.projects, { id: crypto.randomUUID(), title: "", category: "Projects", tag: "", image: "", preview: "editorial", description: "", url: "", published: false }] }))}>+ Add project</button>
          </>}
          {tab === "Experience" && <>
            {!content.experience.length && <div className={`${card} py-12 text-center`}><h2 className="mb-2 text-lg font-medium text-inherit">Add your first experience.</h2><p className="m-0 text-sm text-[#667085]">Jobs, freelance work, and internships all belong here.</p></div>}
            {content.experience.map((item,index) => <article key={item.id} className={`${card} space-y-5`}><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="m-0 text-base font-semibold text-inherit">{item.company || "New experience"}</h2><EntryTools index={index} count={content.experience.length} title={item.company || "experience"} up={() => setContent(p => ({ ...p, experience: move(p.experience, index, -1) }))} down={() => setContent(p => ({ ...p, experience: move(p.experience, index, 1) }))} remove={() => remove("experience", item.id)} /></div><div className="grid gap-5 sm:grid-cols-2"><Field label="Company / organization" value={item.company} onChange={company => experience(item.id, { company })} /><Field label="Role" value={item.role} onChange={role => experience(item.id, { role })} /></div><Field label="Dates" value={item.period} onChange={period => experience(item.id, { period })} placeholder="Oct 2024 – Jan 2025, or Jan 2025 – Present" /><Field label="Company website" value={item.url} onChange={url => experience(item.id, { url })} placeholder="https://…" /><Field label="What you worked on" value={item.description} onChange={description => experience(item.id, { description })} multiline /><Publication checked={item.published} onChange={published => experience(item.id, { published })} /></article>)}
            <button type="button" className={secondary} onClick={() => setContent(p => ({ ...p, experience: [...p.experience, { id: crypto.randomUUID(), company: "", role: "", period: "", description: "", url: "", published: false }] }))}>+ Add experience</button>
          </>}
          {tab === "Services" && <>{content.services.map((item,index) => <article key={item.id} className={`${card} space-y-5`}><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="m-0 text-base font-semibold text-inherit">{item.title || "New service"}</h2><EntryTools index={index} count={content.services.length} title={item.title || "service"} up={() => setContent(p => ({ ...p, services: move(p.services, index, -1) }))} down={() => setContent(p => ({ ...p, services: move(p.services, index, 1) }))} remove={() => remove("services", item.id)} /></div><Field label="Service title" value={item.title} onChange={title => service(item.id, { title })} /><Field label="Description" value={item.description} onChange={description => service(item.id, { description })} multiline /><label className="block text-[13px] font-medium text-[#364152]">Preview<select className={`${control} mt-2`} value={item.preview} onChange={e => service(item.id, { preview: e.target.value })}>{previewNames.map(name => <option key={name}>{name}</option>)}</select></label></article>)}<button type="button" className={secondary} onClick={() => setContent(p => ({ ...p, services: [...p.services, { id: crypto.randomUUID(), title: "New service", description: "", preview: "editorial" }] }))}>+ Add service</button></>}
        </fieldset>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#e0e4eb] pt-5"><span className="text-xs text-[#8b95a7]">{uploadCount > 0 ? "Uploading images…" : dirty ? "Your changes are only saved when you click Save changes." : `Saved version ${revision}`}</span><button type="button" onClick={save} disabled={!dirty || saving || uploadCount > 0} className={primary}>{saving ? "Saving…" : "Save changes"}</button></div>
      </section>
    </div>
  </main>;
}
