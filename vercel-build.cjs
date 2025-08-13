// vercel-build.cjs
// This script writes the entire Next.js project to disk during Vercel build.
// You only had to paste 2 files: package.json + this file. 😊

const fs = require("fs");
const path = require("path");

function w(p, s) {
  const f = path.join(process.cwd(), p);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, s);
}

// ---------- Configs ----------
w("next.config.mjs", `
export default {
  experimental: {}
};
`);

w("postcss.config.js", `
module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} }
};
`);

w("tailwind.config.js", `
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./styles/**/*.{css}"],
  theme: {
    extend: {
      colors: {
        brand: { 50:"#F0F6FF",100:"#DBE9FF",200:"#BFD4FF",300:"#94B3FF",400:"#6A90FF",500:"#3F6CFB",600:"#2752D6",700:"#1E3EA8",800:"#1A327E",900:"#15285F" }
      }
    }
  },
  plugins: []
};
`);

w("styles/globals.css", `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light dark; }
body { @apply bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100; }
.container { @apply mx-auto max-w-6xl px-4 sm:px-6 lg:px-8; }
.btn { @apply inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium shadow-sm bg-brand-600 text-white hover:bg-brand-700 active:scale-[.99]; }
.btn-outline { @apply inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800; }
.card { @apply rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800; }
.h1 { @apply text-3xl font-semibold; }
.h3 { @apply text-xl font-semibold; }
.muted { @apply text-slate-500; }
kbd { @apply rounded-md border px-1.5 py-0.5 text-[10px]; }
`);

w("public/logo.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#3F6CFB"/><path d="M12 32h10l2-8 2 8h10l-6-16h-4l-2 6-2-6h-4l-6 16z" fill="#fff"/></svg>`);

w("public/manifest.json", `
{
  "name": "A&P Prep",
  "short_name": "A&P",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#3F6CFB",
  "icons": [{ "src": "/logo.svg", "sizes": "any", "type": "image/svg+xml" }]
}
`);

// ---------- Lib ----------
w("lib/utils.js", `export const fmt = (n, d=2) => Number.isFinite(n) ? n.toFixed(d) : '-';`);
w("lib/storage.js", `
export function loadProgress(){
  if (typeof window==='undefined') return { scores:{} };
  try { return JSON.parse(localStorage.getItem('ap-progress')||'') || { scores:{} }; }
  catch { return { scores:{} }; }
}
export function saveProgress(p){
  if (typeof window==='undefined') return;
  localStorage.setItem('ap-progress', JSON.stringify(p));
}
`);

// ---------- Components ----------
w("components/Navbar.jsx", `
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  { href: "/", label: "Home" },
  { href: "/general", label: "General" },
  { href: "/airframe", label: "Airframe" },
  { href: "/powerplant", label: "Powerplant" },
  { href: "/exams", label: "Practice Exams" },
  { href: "/progress", label: "Progress" }
];
export default function Navbar(){
  const pathname = usePathname();
  return (
    <header className="border-b bg-white/70 backdrop-blur dark:bg-slate-900/70 sticky top-0 z-40">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" className="h-7 w-7"/>
          <span className="font-semibold">A&P Prep</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          {links.map(l=>(
            <Link key={l.href} href={l.href}
              className={\`px-3 py-1.5 rounded-xl text-sm \${pathname===l.href? "bg-brand-600 text-white":"hover:bg-slate-100 dark:hover:bg-slate-800"}\`}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
`);

w("components/Footer.jsx", `
export default function Footer(){
  return (
    <footer className="border-t mt-10">
      <div className="container py-6 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3">
        <div>© {new Date().getFullYear()} A&P Prep</div>
        <div className="flex gap-3">
          <a className="hover:underline" href="https://www.faa.gov/regulations_policies/handbooks_manuals/aviation">FAA Handbooks</a>
          <a className="hover:underline" href="https://www.ecfr.gov/current/title-14">14 CFR</a>
        </div>
      </div>
    </footer>
  );
}
`);

w("components/ProgressBar.jsx", `
export default function ProgressBar({ value }){
  const pct = Math.max(0, Math.min(100, Math.round(value||0)));
  return (
    <div className="w-full h-3 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden">
      <div className="h-full bg-brand-600" style={{ width: \`\${pct}%\` }} />
    </div>
  );
}
`);

w("components/Lesson.jsx", `
export default function Lesson({ id, title, children, refs }){
  return (
    <section id={id} className="scroll-mt-28">
      <div className="card">
        <div className="h3 mb-2">{title}</div>
        {refs && <div className="muted text-sm mb-3">References: {refs}</div>}
        <div className="prose max-w-none dark:prose-invert prose-slate">{children}</div>
      </div>
    </section>
  );
}
`);

w("components/QuizEngine.jsx", `
"use client";
import { useMemo, useState, useEffect } from "react";
import ProgressBar from "@/components/ProgressBar";
import { loadProgress, saveProgress } from "@/lib/storage";
export default function QuizEngine({ slug, bank }){
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [correct, setCorrect] = useState(0);
  const shuffled = useMemo(()=>shuffle(bank),[bank]);
  const q = shuffled[idx];
  const total = shuffled.length;
  useEffect(()=>{ setSel(null); },[idx]);
  function choose(i){ setSel(i); if(i===q.answer) setCorrect(c=>c+1); }
  function next(){
    if(idx+1<total) setIdx(idx+1);
    else { const p=loadProgress(); p.scores[slug]=Math.max(p.scores[slug]||0, Math.round((correct/total)*100)); saveProgress(p); }
  }
  const finished = idx>=total-1 && sel!==null;
  const score = Math.round((correct/total)*100);
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-3">
        <div className="h3">Quiz</div><div className="text-sm text-slate-500">{idx+1}/{total}</div>
      </div>
      <ProgressBar value={(idx/total)*100}/>
      <div className="mt-4 text-lg font-medium">{q.q}</div>
      <div className="grid md:grid-cols-2 gap-2 mt-3">
        {q.choices.map((c,i)=>{
          const isC = sel!==null && i===q.answer;
          const isW = sel!==null && i===sel && i!==q.answer;
          return (
            <button key={i} onClick={()=>choose(i)} disabled={sel!==null}
              className={\`text-left rounded-xl border px-4 py-2 text-sm transition \${isC?'border-emerald-500 bg-emerald-50':isW?'border-red-500 bg-red-50':'hover:bg-slate-100 dark:hover:bg-slate-800'}\`}>
              {c}
            </button>
          );
        })}
      </div>
      {sel!==null && (
        <div className={\`mt-3 text-sm rounded-xl p-3 \${sel===q.answer?'bg-emerald-50 text-emerald-700':'bg-red-50 text-red-700'}\`}>
          {sel===q.answer?'Correct.':'Not quite.'} {q.explain} {q.ref && (<span className="block text-xs text-slate-500 mt-1">Ref: {q.ref}</span>)}
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <button onClick={next} className="btn">{finished? 'Finish' : sel===null ? 'Skip' : 'Next'}</button>
      </div>
      {finished && (<div className="mt-4"><div className="h3">Result: {score}%</div><div className="text-sm text-slate-500">Best score saved in Progress.</div></div>)}
    </div>
  );
}
function shuffle(a){ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }
`);

w("components/Interactive/ElectricitySimulator.jsx", `
"use client";
import { useMemo, useState } from "react";
import { fmt } from "@/lib/utils";
export default function ElectricitySimulator(){
  const [mode,setMode]=useState("series");
  const [V,setV]=useState(24), [R1,setR1]=useState(6), [R2,setR2]=useState(6);
  const Rt = useMemo(()=> mode==="series"? R1+R2: 1/(1/R1+1/R2), [mode,R1,R2]);
  const I = useMemo(()=> V/Rt,[V,Rt]), P=useMemo(()=>V*I,[V,I]);
  const V1=V*(R1/(R1+R2)), V2=V*(R2/(R1+R2)), I1=V/R1, I2=V/R2;
  return (
    <div className="card">
      <div className="h3 mb-2">Electricity Simulator</div>
      <div className="flex gap-2 mb-3">
        <button className={\`btn-outline \${mode==='series'&&'ring-2 ring-brand-600'}\`} onClick={()=>setMode('series')}>Series</button>
        <button className={\`btn-outline \${mode==='parallel'&&'ring-2 ring-brand-600'}\`} onClick={()=>setMode('parallel')}>Parallel</button>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <Field label="Voltage (V)" v={V} set={setV} min={0} max={120}/>
        <Field label="R1 (Ω)" v={R1} set={setR1} min={1} max={100}/>
        <Field label="R2 (Ω)" v={R2} set={setR2} min={1} max={100}/>
      </div>
      <div className="grid md:grid-cols-3 gap-3 mt-3">
        <Stat title="Total Resistance" value={\`\${fmt(Rt)} Ω\`}/>
        <Stat title="Current" value={\`\${fmt(I)} A\`}/>
        <Stat title="Power" value={\`\${fmt(P)} W\`}/>
      </div>
      <div className="grid md:grid-cols-2 gap-3 mt-4">
        {mode==='series'
          ? <Bar title="Series Voltage Drops" values={[V1,V2]} total={V} labels={[ \`V1 \${fmt(V1)}V\`, \`V2 \${fmt(V2)}V\` ]}/>
          : <Bar title="Parallel Branch Currents" values={[I1,I2]} total={I1+I2} labels={[ \`I1 \${fmt(I1)}A\`, \`I2 \${fmt(I2)}A\` ]}/>
        }
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <p className="mb-1"><b>Ohm's Law:</b> E = I × R</p>
          <p className="mb-1"><b>Power:</b> P = E × I</p>
          <p>Series adds resistance; parallel splits current. Tweak values and watch behavior change.</p>
        </div>
      </div>
    </div>
  );
}
function Field({label,v,set,min=0,max=100}){ return (<label className="text-sm"><div className="mb-1">{label}: <span className="font-mono">{fmt(v,0)}</span></div><input type="range" min={min} max={max} step={1} value={v} onChange={e=>set(Number(e.target.value))} className="w-full"/></label>); }
function Stat({title,value}){ return (<div className="rounded-xl border p-3"><div className="text-xs text-slate-500">{title}</div><div className="text-lg font-semibold">{value}</div></div>); }
function Bar({title,values,total,labels}){ const sum= total||values.reduce((s,v)=>s+v,0); return (
  <div className="rounded-xl border p-3">
    <div className="text-sm font-medium mb-2">{title}</div>
    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded overflow-hidden flex">
      {values.map((v,i)=>(<div key={i} className={\`h-full \${i%2?'bg-brand-400':'bg-brand-600'}\`} style={{width:\`\${Math.max(2,(v/sum)*100)}%\`}}/>))}
    </div>
    <div className="mt-1 text-xs text-slate-500 flex gap-3 flex-wrap">{labels.map((l,i)=>(<span key={i}>{l}</span>))}</div>
  </div>
); }
`);

// ---------- Data ----------
w("data/questions/general.json", JSON.stringify([
  {"id":"gen-elec-001","q":"In a series circuit, total resistance is:","choices":["Less than the smallest resistor","Equal to the sum of all resistors","Equal to the average of resistors","Zero"],"answer":1,"explain":"Series resistances add: R_T = R1 + R2 + ...","ref":"FAA-H-8083-30 Ch.12"},
  {"id":"gen-elec-002","q":"Power in an electrical circuit is given by:","choices":["P=I/R","P=E/I","P=E×I","P=E−I"],"answer":2,"explain":"Power equals voltage times current (Watts).","ref":"AC 65-9A"},
  {"id":"gen-wb-003","q":"CG is computed as:","choices":["Total Weight / Total Moment","Total Moment / Total Weight","Arm / Weight","Weight / Arm"],"answer":1,"explain":"CG = Total Moment ÷ Total Weight.","ref":"FAA-H-8083-30 Ch.10"},
  {"id":"gen-mat-004","q":"The standard flare angle for AN/MS tube fittings is:","choices":["45°","24°","60°","37°"],"answer":3,"explain":"Aircraft AN/JIC flares are 37°; automotive is typically 45°.","ref":"FAA-H-8083-30 Ch.11"}
], null, 2));

w("data/questions/airframe.json", JSON.stringify([
  {"id":"air-struct-001","q":"Composite sandwich panels typically consist of:","choices":["Core and two face sheets","Single layer laminate","Core only","Honeycomb only"],"answer":0,"explain":"A core (honeycomb/foam) bonded between two face sheets.","ref":"FAA-H-8083-31 Vol 1"},
  {"id":"air-controls-002","q":"Primary flight controls include:","choices":["Flaps, spoilers, slats","Ailerons, elevator (or stabilator), rudder","Trim tabs only","Speed brakes only"],"answer":1,"explain":"Primary: ailerons, elevator/stabilator, rudder.","ref":"FAA-H-8083-31 Vol 1"}
], null, 2));

w("data/questions/powerplant.json", JSON.stringify([
  {"id":"pp-recip-001","q":"Detonation in a reciprocating engine is best described as:","choices":["Normal flame front","Spontaneous combustion after normal ignition","Pre-ignition from hot spots","No abnormal condition"],"answer":1,"explain":"Detonation is the spontaneous combustion of the end-gas, causing pressure spikes.","ref":"FAA-H-8083-32 Vol 1"},
  {"id":"pp-turb-002","q":"An axial compressor increases pressure primarily by:","choices":["Decreasing air velocity in stators","Increasing fuel flow","Reducing rotor speed","Heating air only"],"answer":0,"explain":"Rotors add velocity; stators diffuse (reduce velocity) to increase pressure.","ref":"FAA-H-8083-32 Vol 2"}
], null, 2));

// ---------- App (Next.js app router) ----------
w("app/layout.js", `
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "A&P Prep — General · Airframe · Powerplant",
  description: "Interactive FAA A&P study platform with visuals, labs, and quizzes.",
  manifest: "/manifest.json",
  themeColor: "#3F6CFB",
  viewport: "width=device-width, initial-scale=1"
};

export default function RootLayout({ children }){
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        <main className="container py-6 md:py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
`);

w("app/page.js", `
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
export default function Home(){
  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="h1">A&P Prep — General · Airframe · Powerplant</h1>
        <p className="muted">Interactive lessons, hands-on labs, and FAA-style quizzes. Optimized for iPad — Add to Home Screen.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="btn" href="/general">Start General</Link>
          <Link className="btn-outline" href="/airframe">Airframe</Link>
          <Link className="btn-outline" href="/powerplant">Powerplant</Link>
          <Link className="btn-outline" href="/exams">Practice Exams</Link>
        </div>
      </section>
      <section className="grid md:grid-cols-3 gap-4">
        {[{t:'General',href:'/general'},{t:'Airframe',href:'/airframe'},{t:'Powerplant',href:'/powerplant'}].map((s,i)=>(
          <div key={i} className="card">
            <div className="h3">{s.t}</div>
            <ProgressBar value={20+i*10}/>
            <div className="mt-2 text-sm text-slate-500">Keep going — consistency beats cramming.</div>
            <Link className="btn mt-3" href={s.href}>Open</Link>
          </div>
        ))}
      </section>
    </div>
  );
}
`);

w("app/general/page.js", `
import Lesson from "@/components/Lesson";
import ElectricitySimulator from "@/components/Interactive/ElectricitySimulator";
import QuizEngine from "@/components/QuizEngine";
import bank from "@/data/questions/general.json";
export default function General(){
  return (
    <div className="space-y-6">
      <Lesson id="electricity-ohms-law" title="Ohm's Law & Power" refs="FAA-H-8083-30 Ch.12">
        <p>E = I × R. Power P = E × I. Use the simulator below.</p>
        <ElectricitySimulator />
      </Lesson>
      <Lesson id="quiz" title="General — Quick Quiz">
        <QuizEngine slug="gen-mixed" bank={bank} />
      </Lesson>
    </div>
  );
}
`);

w("app/airframe/page.js", `
import Lesson from "@/components/Lesson";
import QuizEngine from "@/components/QuizEngine";
import bank from "@/data/questions/airframe.json";
export default function Airframe(){
  return (
    <div className="space-y-6">
      <Lesson id="structures" title="Structures — Basics" refs="FAA-H-8083-31 Vol 1">
        <p>Composite sandwich panels: lightweight core + two face sheets. Inspect for delamination & damage.</p>
      </Lesson>
      <Lesson id="quiz" title="Airframe — Quick Quiz">
        <QuizEngine slug="air-mixed" bank={bank} />
      </Lesson>
    </div>
  );
}
`);

w("app/powerplant/page.js", `
import Lesson from "@/components/Lesson";
import QuizEngine from "@/components/QuizEngine";
import bank from "@/data/questions/powerplant.json";
export default function Powerplant(){
  return (
    <div className="space-y-6">
      <Lesson id="recip" title="Recip Engines — Ops & Troubleshooting" refs="FAA-H-8083-32 Vol 1">
        <p>Detonation vs preignition: recognize symptoms, causes, prevention.</p>
      </Lesson>
      <Lesson id="quiz" title="Powerplant — Quick Quiz">
        <QuizEngine slug="pp-mixed" bank={bank} />
      </Lesson>
    </div>
  );
}
`);

w("app/exams/page.js", `
"use client";
import { useMemo } from "react";
import QuizEngine from "@/components/QuizEngine";
import gen from "@/data/questions/general.json";
import air from "@/data/questions/airframe.json";
import pp from "@/data/questions/powerplant.json";
export default function Exams(){
  const bank = useMemo(()=>shuffle([...(gen), ...(air), ...(pp)]),[]);
  const subset = bank.slice(0, 25);
  return (
    <div className="space-y-4">
      <div className="card"><div className="h3">Practice Exam</div><p className="muted">25-question mixed set (demo).</p></div>
      <QuizEngine slug="exam-mixed" bank={subset}/>
    </div>
  );
}
function shuffle(a){ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }
`);

w("app/progress/page.js", `
"use client";
import { useEffect, useState } from "react";
import { loadProgress } from "@/lib/storage";
import ProgressBar from "@/components/ProgressBar";
export default function Progress(){
  const [scores, setScores] = useState({});
  useEffect(()=>{ setScores(loadProgress().scores || {}); },[]);
  const entries = Object.entries(scores);
  return (
    <div className="space-y-4">
      <div className="card"><div className="h3">Progress</div><p className="muted">Best quiz scores saved locally in your browser.</p></div>
      {entries.length===0 ? (<div className="card">No scores yet. Take a quiz and come back!</div>) :
        entries.map(([slug,score])=>(
          <div key={slug} className="card">
            <div className="flex items-center justify-between">
              <div className="font-medium">{slug}</div><div className="text-sm">{score}%</div>
            </div>
            <div className="mt-2"><ProgressBar value={score}/></div>
          </div>
        ))
      }
    </div>
  );
}
`);

// ---------- Middleware (optional privacy) ----------
w("middleware.js", `
import { NextResponse } from "next/server";
export function middleware(req){
  const USER = process.env.BASIC_AUTH_USER || "";
  const PASS = process.env.BASIC_AUTH_PASS || "";
  const publicPaths = ["/_next", "/favicon", "/logo.svg", "/manifest.json"];
  if (publicPaths.some(p=> req.nextUrl.pathname.startsWith(p))) return NextResponse.next();
  if (!USER || !PASS) return NextResponse.next();
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Basic ")) return new NextResponse("Auth required", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="A&P Prep"' }});
  const [u,p] = Buffer.from(auth.split(" ")[1], "base64").toString().split(":");
  if (u===USER && p===PASS) return NextResponse.next();
  return new NextResponse("Forbidden", { status: 403 });
}
export const config = { matcher: ["/((?!api).*)"] };
`);

// ---------- README ----------
w("README.md", `
# A&P Prep — General · Airframe · Powerplant
Built for iPad (PWA manifest included). Quizzes + interactives. Deploy on Vercel.

## Local dev (optional)
npm install && npm run dev

## Vercel
Import this repo in Vercel and deploy. Then on iPad: Safari → Share → Add to Home Screen.

## Privacy (optional)
Set BASIC_AUTH_USER and BASIC_AUTH_PASS in Vercel → Project → Settings → Environment Variables; redeploy.
`);

console.log("All project files written by vercel-build.cjs");
