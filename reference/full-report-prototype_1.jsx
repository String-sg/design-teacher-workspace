import { useState } from "react";

// =============================================
// DATA
// =============================================
const REPORTS = [
  { id: "police-ssa", name: "School Report for Police / Social Service Agency", agency: "Police / CNB", deadline: "5 days", icon: "🔵" },
  { id: "msf-probation", name: "MSF School Report Request (Probation Report)", agency: "MSF", deadline: "5 days", icon: "🟡" },
  { id: "cps", name: "School Report for CPS", agency: "MSF – CPS", deadline: "5 days", icon: "🟠" },
  { id: "navh-part1", name: "MSF – NAVH Intake Assessment (Part 1)", agency: "MSF – NAVH", deadline: "3 working days", icon: "🟣" },
  { id: "navh-known", name: "MSF – NAVH Additional Info (Student known to school)", agency: "MSF – NAVH", deadline: "6 working days", icon: "🟣" },
  { id: "navh-unknown", name: "MSF – NAVH Additional Info (Student NOT known to school)", agency: "MSF – NAVH", deadline: "6 working days", icon: "🟣" },
  { id: "scs", name: "Singapore Children's Society – Social Investigation Report", agency: "SCS", deadline: "7 days", icon: "🔴" },
  { id: "reach", name: "REACH Referral, Triage & Assessment Forms", agency: "REACH", deadline: "No specific timing", icon: "🟢" },
  { id: "imh", name: "IMH / Child Guidance Clinic School Report", agency: "IMH", deadline: "No specific timeline", icon: "⚪" },
  { id: "childrens-home", name: "School Report for Children's Home", agency: "Children's Home", deadline: "No specific timing", icon: "🏠" },
  { id: "sps", name: "SPS Reformative Sentencing Pre-Training Report", agency: "SPS", deadline: "5 working days", icon: "🔵" },
  { id: "mental-health", name: "Sharing of Mental/Psychological Health Info with Law Enforcement", agency: "Police", deadline: "As needed", icon: "🧠" },
  { id: "feiyue", name: "Fei Yue / Shine – Guidance Programme School Feedback Report", agency: "Fei Yue / Shine", deadline: "No specific timing", icon: "🌱" },
  { id: "msf-psv", name: "MSF School Report for PSV (Protective Service)", agency: "MSF – PSV", deadline: "5 days", icon: "🟡" },
  { id: "probation-msf23", name: "Probation Report for MSF", agency: "MSF", deadline: "23 days", icon: "🟡" },
];

const FIELDS = [
  { key: "officerName", label: "Name of Officer / Social Worker", section: "Police / SSA Information", type: "text", source: null, prefill: "" },
  { key: "policeDivision", label: "Police Division / SSA", section: "Police / SSA Information", type: "text", source: null, prefill: "" },
  { key: "officerContact", label: "Contact No.", section: "Police / SSA Information", type: "text", source: null, prefill: "" },
  { key: "officerEmail", label: "Email Address", section: "Police / SSA Information", type: "text", source: null, prefill: "" },
  { key: "studentName", label: "Student Name", section: "Student Particulars", type: "text", source: "SIS", prefill: "Tan Wei Lin" },
  { key: "age", label: "Age", section: "Student Particulars", type: "text", source: "SIS", prefill: "15" },
  { key: "nric", label: "NRIC/FIN No.", section: "Student Particulars", type: "text", source: "SIS", prefill: "T11XXXXX" },
  { key: "school", label: "Name of School/Institution", section: "Student Particulars", type: "text", source: "SIS", prefill: "Kranji Secondary School" },
  { key: "class", label: "Class", section: "Student Particulars", type: "text", source: "SIS", prefill: "3E1" },
  { key: "descOffence", label: "Description of Offence(s)", section: "Student Particulars", type: "textarea", source: null, prefill: "" },
  { key: "contactPerson", label: "Contact Person", section: "School Contact", type: "text", source: null, prefill: "" },
  { key: "contactDesignation", label: "Designation", section: "School Contact", type: "text", source: null, prefill: "" },
  { key: "contactNo", label: "Contact No.", section: "School Contact", type: "text", source: null, prefill: "" },
  { key: "contactEmail", label: "Email Address", section: "School Contact", type: "text", source: null, prefill: "" },
  { key: "attendance", label: "Attendance", section: "Attendance & Punctuality", type: "select", options: ["Very Regular", "Regular", "Irregular"], source: "Attendance", prefill: "Regular" },
  { key: "absentDays", label: "Days absent without valid reasons (YTD)", section: "Attendance & Punctuality", type: "text", source: "Attendance", prefill: "3" },
  { key: "punctuality", label: "Punctuality", section: "Attendance & Punctuality", type: "select", options: ["Good", "Fair", "Poor"], source: "Attendance", prefill: "Good" },
  { key: "lateDays", label: "Days late for school (YTD)", section: "Attendance & Punctuality", type: "text", source: "Attendance", prefill: "1" },
  { key: "conduct", label: "Conduct", section: "Conduct", type: "select", options: ["Excellent", "Very Good", "Good", "Fair", "Poor"], source: "Discipline", prefill: "Good" },
  { key: "academicPerf", label: "Academic Performance", section: "Academic Performance", type: "select", options: ["Good", "Fair", "Poor"], source: "Gradebook", prefill: "Fair" },
  { key: "disciplinaryRecords", label: "Disciplinary Records", section: "Conduct", type: "textarea", source: "Discipline", prefill: "" },
  { key: "conductChecklist", label: "Conduct Checklist", section: "Conduct (Checklist)", type: "checklist", source: null, prefill: "" },
  { key: "overallConduct", label: "Overall Conduct", section: "Overall Conduct", type: "select", options: ["Excellent", "Good", "Fair", "Poor"], source: null, prefill: "" },
  { key: "conductComments", label: "Comments", section: "Overall Conduct", type: "textarea", source: null, prefill: "" },
  { key: "academicRemarks", label: "Other Remarks on Academic Performance", section: "Academic Performance", type: "textarea", source: null, prefill: "" },
];

const POSITIVE = ["Responsive", "Responsible", "Polite", "Honest", "Helpful", "Attentive", "Hardworking", "Respectful"];
const NEGATIVE = ["Associates with Gangs", "Plays Truant", "Engages in Fights", "Pilfers/Steals", "Smokes", "Abuses other Substances", "Defies Authority", "Resists School Counselling", "Bullies"];

const REVIEWERS = [
  { id: 1, name: "Mrs Lim Siew Eng", role: "Form Teacher", avatar: "LS" },
  { id: 2, name: "Mr David Koh", role: "Year Head", avatar: "DK" },
  { id: 3, name: "Mdm Faridah", role: "HOD Student Development", avatar: "FA" },
  { id: 4, name: "Ms Priya Nair", role: "School Counsellor", avatar: "PN" },
  { id: 5, name: "VP Koo Tiannuo", role: "Vice-Principal", avatar: "KT" },
];

// =============================================
// STYLES
// =============================================
const ff = `'DM Sans', system-ui, sans-serif`;
const mono = `'SF Mono', 'JetBrains Mono', monospace`;
const C = {
  bg: "#F3F2ED", surface: "#FFFFFF", alt: "#FAFAF7",
  border: "#E3E1DA", bHover: "#C8C5BA", bFocus: "#3D6B4F",
  text: "#1C1C1A", sec: "#6B6960", ter: "#9E9A8F",
  accent: "#3D6B4F", accentBg: "#EAF2EC", accentHover: "#2F5740",
  prefillBg: "#EDF5EF", prefillBorder: "rgba(61,107,79,0.25)",
  warn: "#B8802A", warnBg: "#FDF5E8", warnText: "#7A5A1A",
  urgent: "#C0453A", urgentBg: "#FCEAE8", urgentText: "#8B3328",
  blue: "#3A6B96", blueBg: "#E8F0F8",
};

function Pill({ children, bg = C.accentBg, color = C.accent, style = {} }) {
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 9px", borderRadius: 20, fontSize: 10.5, fontWeight: 650, letterSpacing: 0.2, background: bg, color, fontFamily: ff, whiteSpace: "nowrap", ...style }}>{children}</span>;
}
function DeadlinePill({ deadline }) {
  const u = deadline.includes("3");
  const w = deadline.includes("5") || deadline.includes("7") || deadline.includes("23");
  return <Pill bg={u ? C.urgentBg : w ? C.warnBg : C.alt} color={u ? C.urgentText : w ? C.warnText : C.ter}>⏱ {deadline}</Pill>;
}

// =============================================
// MAIN
// =============================================
export default function App() {
  const [view, setView] = useState("select"); // select | fill
  const [selectedReport, setSelectedReport] = useState(null);
  const [formData, setFormData] = useState({});
  const [prefilledKeys, setPrefilledKeys] = useState(new Set());
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [prefilling, setPrefilling] = useState(false);
  const [checklist, setChecklist] = useState({ pos: {}, neg: {} });
  const [previewScale, setPreviewScale] = useState(0.68);
  const [search, setSearch] = useState("");
  const [agencyFilter, setAgencyFilter] = useState("All");
  const [studentSearch, setStudentSearch] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);
  const [chosenReviewers, setChosenReviewers] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const agencies = ["All", ...new Set(REPORTS.map(r => r.agency.split(" –")[0].split(" /")[0]))];
  const filtered = REPORTS.filter(r => {
    const ms = r.name.toLowerCase().includes(search.toLowerCase()) || r.agency.toLowerCase().includes(search.toLowerCase());
    const ma = agencyFilter === "All" || r.agency.startsWith(agencyFilter);
    return ms && ma;
  });

  function pickReport(r) {
    setSelectedReport(r);
    const d = {};
    FIELDS.forEach(f => d[f.key] = "");
    setFormData(d);
    setPrefilledKeys(new Set());
    setIsPrefilled(false);
    setChecklist({ pos: {}, neg: {} });
    setReviewSent(false);
    setChosenReviewers([]);
    setStudentSearch("");
    setShowSuccess(false);
    setView("fill");
  }

  function doPrefill() {
    setPrefilling(true);
    setTimeout(() => {
      const d = { ...formData };
      const pf = new Set();
      FIELDS.forEach(f => { if (f.prefill) { d[f.key] = f.prefill; pf.add(f.key); } });
      setFormData(d);
      setPrefilledKeys(pf);
      setIsPrefilled(true);
      setPrefilling(false);
    }, 800);
  }

  function setField(k, val) { setFormData(p => ({ ...p, [k]: val })); }
  function toggleReviewer(id) { setChosenReviewers(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); }
  function sendReview() {
    setReviewSent(true);
    setTimeout(() => { setShowReview(false); setShowSuccess(true); }, 1500);
  }

  const v = formData;
  const sections = [];
  let lastSec = null;
  FIELDS.forEach(f => {
    if (f.section !== lastSec) { sections.push({ title: f.section, fields: [] }); lastSec = f.section; }
    sections[sections.length - 1].fields.push(f);
  });
  const autoCount = FIELDS.filter(f => f.source).length;
  const filledCount = FIELDS.filter(f => f.type !== "checklist" && formData[f.key]?.trim()).length;
  const totalCount = FIELDS.filter(f => f.type !== "checklist").length;
  const pct = totalCount ? Math.round((filledCount / totalCount) * 100) : 0;
  const chk = (val, opt) => val === opt ? "☑" : "☐";

  // =============== SELECT VIEW ===============
  if (view === "select") {
    return (
      <div style={{ fontFamily: ff, background: C.bg, minHeight: "100vh" }}>
        <div style={{ background: C.accent, padding: "28px 32px 24px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.8, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 5 }}>Teacher Workspace</div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>Inter-Agency Report Generator</h1>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
              {REPORTS.length} report templates · Auto-fill from SIS, Attendance, Gradebook & Discipline · Live preview in official format
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 820, margin: "0 auto", padding: "20px 32px 0" }}>
          {/* Steps */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 22 }}>
            {[
              { n: "1", t: "Select report", d: "Choose agency template" },
              { n: "2", t: "Pick student & auto-fill", d: "Pull from school systems" },
              { n: "3", t: "Fill & preview", d: "See official format live" },
              { n: "4", t: "Route & export", d: "Review, then PDF & email" },
            ].map(s => (
              <div key={s.n} style={{ background: C.surface, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.border}` }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.accentBg, color: C.accent, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>{s.n}</div>
                <div style={{ fontSize: 12.5, fontWeight: 650, color: C.text, marginBottom: 2 }}>{s.t}</div>
                <div style={{ fontSize: 11, color: C.ter }}>{s.d}</div>
              </div>
            ))}
          </div>
          {/* Search */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
            <input placeholder="Search reports or agencies..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 180, padding: "9px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface, fontFamily: ff, fontSize: 13, outline: "none" }}
              onFocus={e => e.target.style.borderColor = C.bFocus} onBlur={e => e.target.style.borderColor = C.border} />
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {agencies.map(a => (
                <button key={a} onClick={() => setAgencyFilter(a)} style={{
                  padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: ff, fontSize: 10.5, fontWeight: 600,
                  background: agencyFilter === a ? C.accent : C.surface, color: agencyFilter === a ? "#fff" : C.sec,
                  boxShadow: agencyFilter === a ? "none" : `inset 0 0 0 1px ${C.border}`, transition: "all 0.12s",
                }}>{a}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 32px 60px" }}>
          {filtered.map(r => (
            <button key={r.id} onClick={() => pickReport(r)} style={{
              display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "14px 18px",
              background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, cursor: "pointer",
              fontFamily: ff, textAlign: "left", marginBottom: 7, transition: "all 0.12s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = "translateX(2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ fontSize: 18, width: 32, textAlign: "center", flexShrink: 0 }}>{r.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 620, color: C.text, marginBottom: 4, lineHeight: 1.3 }}>{r.name}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <Pill bg={C.blueBg} color={C.blue}>{r.agency}</Pill>
                  <DeadlinePill deadline={r.deadline} />
                </div>
              </div>
              <div style={{ color: C.ter, fontSize: 14, flexShrink: 0 }}>→</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // =============== FILL VIEW (split) ===============
  return (
    <div style={{ fontFamily: ff, background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "8px 20px",
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0, zIndex: 50,
      }}>
        <button onClick={() => setView("select")} style={{
          background: "none", border: "none", cursor: "pointer", fontFamily: ff, fontSize: 12, color: C.sec,
          padding: "4px 8px", borderRadius: 6,
        }} onMouseEnter={e => e.currentTarget.style.background = C.alt} onMouseLeave={e => e.currentTarget.style.background = "none"}>
          ← Reports
        </button>
        <div style={{ width: 1, height: 16, background: C.border }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 620, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedReport?.name}</div>
        </div>
        <DeadlinePill deadline={selectedReport?.deadline || ""} />
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, fontFamily: mono, fontWeight: 700, color: pct === 100 ? C.accent : C.text }}>{pct}%</span>
          <div style={{ width: 50, height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? C.accent : C.warn, borderRadius: 2, transition: "width 0.3s" }} />
          </div>
        </div>
        <button onClick={() => { setReviewSent(false); setShowSuccess(false); setShowReview(true); }} style={{
          padding: "6px 14px", borderRadius: 7, border: `1px solid ${C.border}`, background: C.surface,
          fontFamily: ff, fontSize: 11.5, fontWeight: 600, color: C.sec, cursor: "pointer",
        }}>Route for Review</button>
        <button style={{
          padding: "6px 14px", borderRadius: 7, border: "none", background: C.accent, color: "#fff",
          fontFamily: ff, fontSize: 11.5, fontWeight: 700, cursor: "pointer",
        }}>Export PDF</button>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div style={{
          background: C.accentBg, border: `1px solid ${C.prefillBorder}`, padding: "10px 20px",
          display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: C.accent, fontWeight: 600,
        }}>
          <span>✓</span> Report sent to {chosenReviewers.length} reviewer(s) for vetting. You'll be notified when they respond.
          <button onClick={() => setShowSuccess(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: C.accent, cursor: "pointer", fontFamily: ff, fontSize: 16, fontWeight: 400 }}>×</button>
        </div>
      )}

      {/* Main split */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* LEFT: Form */}
        <div style={{ width: "40%", minWidth: 320, overflow: "auto", padding: "18px 22px 80px", borderRight: `1px solid ${C.border}` }}>
          {/* Prefill */}
          {!isPrefilled ? (
            <div style={{ background: C.accentBg, borderRadius: 10, border: `1.5px solid ${C.prefillBorder}`, padding: "16px 18px", marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 650, color: C.accent, marginBottom: 3 }}>⚡ Auto-fill student data</div>
              <div style={{ fontSize: 11.5, color: C.sec, marginBottom: 10, lineHeight: 1.4 }}>
                {autoCount} of {totalCount} fields can be pulled from SIS, Attendance, Gradebook & Discipline.
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input placeholder="Search student name, NRIC, or class..." value={studentSearch} onChange={e => setStudentSearch(e.target.value)}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 7, border: `1px solid ${C.border}`, fontFamily: ff, fontSize: 12, outline: "none" }}
                  onFocus={e => e.target.style.borderColor = C.bFocus} onBlur={e => e.target.style.borderColor = C.border} />
              </div>
              {studentSearch && (
                <div onClick={doPrefill} style={{ padding: "8px 12px", borderRadius: 7, background: C.surface, border: `1px solid ${C.border}`, cursor: "pointer", marginBottom: 8 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text }}>Tan Wei Lin</div>
                  <div style={{ fontSize: 10.5, color: C.sec }}>3E1 · T11XXXXX · Kranji Secondary School</div>
                </div>
              )}
              <button onClick={doPrefill} disabled={prefilling} style={{
                padding: "8px 0", borderRadius: 7, border: "none", background: C.accent, color: "#fff",
                fontFamily: ff, fontSize: 12, fontWeight: 700, cursor: "pointer", width: "100%", opacity: prefilling ? 0.7 : 1,
              }}>{prefilling ? "Fetching data..." : "⚡ Pull & Auto-fill"}</button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.prefillBg, borderRadius: 8, padding: "10px 14px", marginBottom: 18, border: `1px solid ${C.prefillBorder}` }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>TW</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 650, color: C.text }}>Tan Wei Lin · 3E1</div>
                <div style={{ fontSize: 10.5, color: C.accent }}>{prefilledKeys.size} fields auto-filled ✓</div>
              </div>
              <button onClick={() => { setIsPrefilled(false); setStudentSearch(""); const d = {}; FIELDS.forEach(f => d[f.key] = ""); setFormData(d); setPrefilledKeys(new Set()); }}
                style={{ fontSize: 10.5, color: C.ter, background: "none", border: "none", cursor: "pointer", fontFamily: ff, textDecoration: "underline" }}>Change</button>
            </div>
          )}

          {/* Fields */}
          {sections.map((sec, si) => (
            <div key={si} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: C.ter, marginBottom: 7, paddingBottom: 4, borderBottom: `1px solid ${C.border}` }}>{sec.title}</div>
              {sec.fields.map(f => {
                const filled = prefilledKeys.has(f.key);
                const val = formData[f.key] || "";
                if (f.type === "checklist") {
                  return (
                    <div key={f.key} style={{ background: C.surface, borderRadius: 8, border: `1px solid ${C.border}`, padding: "12px 14px", marginBottom: 7 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 620, color: C.text, marginBottom: 8 }}>Tick where appropriate</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: C.accent, letterSpacing: 0.5, marginBottom: 5, textTransform: "uppercase" }}>Positive</div>
                          {POSITIVE.map(t => (
                            <label key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: C.text, marginBottom: 3, cursor: "pointer" }}>
                              <input type="checkbox" checked={!!checklist.pos[t]} onChange={() => setChecklist(p => ({ ...p, pos: { ...p.pos, [t]: !p.pos[t] } }))} style={{ accentColor: C.accent, margin: 0 }} />{t}
                            </label>
                          ))}
                        </div>
                        <div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: "#B0453A", letterSpacing: 0.5, marginBottom: 5, textTransform: "uppercase" }}>Concerns</div>
                          {NEGATIVE.map(t => (
                            <label key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: C.text, marginBottom: 3, cursor: "pointer" }}>
                              <input type="checkbox" checked={!!checklist.neg[t]} onChange={() => setChecklist(p => ({ ...p, neg: { ...p.neg, [t]: !p.neg[t] } }))} style={{ accentColor: "#B0453A", margin: 0 }} />{t}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={f.key} style={{ background: C.surface, borderRadius: 8, border: `1px solid ${filled ? C.prefillBorder : C.border}`, padding: "9px 13px", marginBottom: 7 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                      <label style={{ fontSize: 11, fontWeight: 620, color: C.text }}>{f.label}</label>
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        {filled && <span style={{ fontSize: 9, color: C.accent, fontWeight: 650 }}>● Pre-filled</span>}
                        {f.source
                          ? <span style={{ fontSize: 9, fontWeight: 650, padding: "1px 6px", borderRadius: 10, background: C.accentBg, color: C.accent }}>⚡ {f.source}</span>
                          : <span style={{ fontSize: 9, fontWeight: 650, padding: "1px 6px", borderRadius: 10, background: "#F5F0E5", color: "#8A7D5A" }}>✎ Manual</span>
                        }
                      </div>
                    </div>
                    {f.type === "textarea" ? (
                      <textarea value={val} onChange={e => setField(f.key, e.target.value)} rows={2} placeholder="Enter details..."
                        style={{ width: "100%", padding: "6px 9px", borderRadius: 6, border: `1px solid ${C.border}`, fontFamily: ff, fontSize: 12, resize: "vertical", outline: "none", boxSizing: "border-box", background: filled ? "#f0f7f2" : C.alt, color: C.text, lineHeight: 1.45 }}
                        onFocus={e => e.target.style.borderColor = C.bFocus} onBlur={e => e.target.style.borderColor = C.border} />
                    ) : f.type === "select" ? (
                      <select value={val} onChange={e => setField(f.key, e.target.value)}
                        style={{ width: "100%", padding: "6px 9px", borderRadius: 6, border: `1px solid ${C.border}`, fontFamily: ff, fontSize: 12, outline: "none", cursor: "pointer", background: filled ? "#f0f7f2" : C.alt, color: val ? C.text : C.ter }}
                        onFocus={e => e.target.style.borderColor = C.bFocus} onBlur={e => e.target.style.borderColor = C.border}>
                        <option value="">Select...</option>
                        {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type="text" value={val} onChange={e => setField(f.key, e.target.value)} placeholder="Enter value..."
                        style={{ width: "100%", padding: "6px 9px", borderRadius: 6, border: `1px solid ${C.border}`, fontFamily: ff, fontSize: 12, outline: "none", boxSizing: "border-box", background: filled ? "#f0f7f2" : C.alt, color: C.text }}
                        onFocus={e => e.target.style.borderColor = C.bFocus} onBlur={e => e.target.style.borderColor = C.border} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* RIGHT: Live Preview */}
        <div style={{ flex: 1, overflow: "auto", background: "#E8E6E0", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 4px" }}>
            <span style={{ fontSize: 10.5, fontWeight: 650, color: C.sec, letterSpacing: 0.5 }}>LIVE PREVIEW — Official format</span>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <span style={{ fontSize: 9.5, color: C.ter }}>Zoom</span>
              {[0.55, 0.68, 0.82, 1].map(s => (
                <button key={s} onClick={() => setPreviewScale(s)} style={{
                  width: 28, height: 20, borderRadius: 4, border: "none", cursor: "pointer", fontSize: 9, fontWeight: 700, fontFamily: mono,
                  background: previewScale === s ? C.accent : C.surface, color: previewScale === s ? "#fff" : C.sec,
                }}>{Math.round(s * 100)}%</button>
              ))}
            </div>
          </div>

          <div style={{ transformOrigin: "top center", transform: `scale(${previewScale})`, width: `${100 / previewScale}%` }}>
            <div style={{
              background: "#fff", width: 680, margin: "0 auto", padding: "40px 50px",
              fontFamily: "'Times New Roman', serif", boxShadow: "0 2px 20px rgba(0,0,0,0.1)",
              fontSize: 12, lineHeight: 1.5, color: "#000",
            }}>
              {/* Page 1 */}
              <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>CONFIDENTIAL</div>
              <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 14, marginBottom: 2 }}>SCHOOL REPORT FOR POLICE / SOCIAL SERVICE AGENCY</div>
              <div style={{ textAlign: "center", fontSize: 11, marginBottom: 12, color: "#555" }}>[Period of Reporting: _______ to _______]</div>
              <div style={{ fontSize: 11.5, marginBottom: 8 }}><strong>Purpose of School Report:</strong><br />For police&emsp;☑&emsp;(Police Report / Case No: _________)</div>

              {/* 1. Police/SSA */}
              <div style={{ border: "1.5px solid #000", padding: "8px 12px", marginBottom: 12 }}>
                <div style={{ fontWeight: "bold", fontSize: 11.5, marginBottom: 8, borderBottom: "1px solid #ccc", paddingBottom: 4 }}>1 &ensp; Police / SSA Information (to be completed by Police / SSA)</div>
                <table style={{ width: "100%", fontSize: 11.5, borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: "3px 0", width: "38%" }}><strong>Name of Officer/Social Worker:</strong></td>
                      <td style={{ padding: "3px 0", borderBottom: "1px dotted #999" }}>{v.officerName || <span style={{ color: "#ccc" }}>_______________</span>}</td>
                      <td style={{ padding: "3px 0", width: "22%" }}><strong>Police Division / SSA:</strong></td>
                      <td style={{ padding: "3px 0", borderBottom: "1px dotted #999" }}>{v.policeDivision || <span style={{ color: "#ccc" }}>_______________</span>}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "3px 0" }}><strong>Contact No.:</strong></td>
                      <td style={{ borderBottom: "1px dotted #999" }}>{v.officerContact || <span style={{ color: "#ccc" }}>_______________</span>}</td>
                      <td><strong>Email Address:</strong></td>
                      <td style={{ borderBottom: "1px dotted #999" }}>{v.officerEmail || <span style={{ color: "#ccc" }}>_______________</span>}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* (I) Student Particulars */}
              <div style={{ border: "1.5px solid #000", padding: "8px 12px", marginBottom: 12 }}>
                <div style={{ fontWeight: "bold", fontSize: 11.5, marginBottom: 8, borderBottom: "1px solid #ccc", paddingBottom: 4 }}>(I) Student Particulars (to be completed by Police / SSA)</div>
                <table style={{ width: "100%", fontSize: 11.5, borderCollapse: "collapse" }}><tbody>
                  <tr><td style={{ padding: "4px 0" }}><strong>Name:</strong> {v.studentName || <span style={{ color: "#ccc" }}>________</span>}</td><td style={{ textAlign: "right" }}><strong>Age:</strong> {v.age || <span style={{ color: "#ccc" }}>____</span>}</td></tr>
                  <tr><td colSpan={2} style={{ padding: "4px 0" }}><strong>NRIC/FIN No:</strong> {v.nric || <span style={{ color: "#ccc" }}>_______________</span>}</td></tr>
                  <tr><td style={{ padding: "4px 0" }}><strong>Name of School/Institution:</strong> {v.school || <span style={{ color: "#ccc" }}>_______________</span>}</td><td style={{ textAlign: "right" }}><strong>Class:</strong> {v.class || <span style={{ color: "#ccc" }}>____</span>}</td></tr>
                  <tr><td colSpan={2} style={{ padding: "4px 0" }}><strong>Description of Offence(s):</strong> {v.descOffence || <span style={{ color: "#ccc" }}>_______________</span>}</td></tr>
                </tbody></table>
              </div>

              {/* (II) Student Information */}
              <div style={{ border: "1.5px solid #000", padding: "8px 12px", marginBottom: 12 }}>
                <div style={{ fontWeight: "bold", fontSize: 10.5, marginBottom: 8, borderBottom: "1px solid #ccc", paddingBottom: 4 }}>(II) Student Information (to be completed by School) – Please read the explanatory notes at the end of this document before you begin</div>
                <table style={{ width: "100%", fontSize: 11.5, borderCollapse: "collapse" }}><tbody>
                  <tr><td style={{ padding: "3px 0" }}><strong>Contact Person:</strong></td><td style={{ borderBottom: "1px dotted #999" }}>{v.contactPerson || <span style={{ color: "#ccc" }}>_______________</span>}</td><td><strong>Designation:</strong></td><td style={{ borderBottom: "1px dotted #999" }}>{v.contactDesignation || <span style={{ color: "#ccc" }}>_______________</span>}</td></tr>
                  <tr><td style={{ padding: "3px 0" }}><strong>Contact No.:</strong></td><td style={{ borderBottom: "1px dotted #999" }}>{v.contactNo || <span style={{ color: "#ccc" }}>_______________</span>}</td><td><strong>Email Address:</strong></td><td style={{ borderBottom: "1px dotted #999" }}>{v.contactEmail || <span style={{ color: "#ccc" }}>_______________</span>}</td></tr>
                </tbody></table>

                <div style={{ marginTop: 12, fontSize: 11.5 }}><strong>Attendance</strong>&emsp;{chk(v.attendance, "Very Regular")} Very Regular&emsp;{chk(v.attendance, "Regular")} Regular&emsp;{chk(v.attendance, "Irregular")} Irregular</div>
                <div style={{ fontSize: 10.5, color: "#555", marginTop: 2 }}>No. of days absent without valid reasons (for the year up till date of this report): <strong>{v.absentDays || "___"}</strong></div>

                <div style={{ marginTop: 10, fontSize: 11.5 }}><strong>Punctuality</strong>&emsp;{chk(v.punctuality, "Good")} Good&emsp;{chk(v.punctuality, "Fair")} Fair&emsp;{chk(v.punctuality, "Poor")} Poor</div>
                <div style={{ fontSize: 10.5, color: "#555", marginTop: 2 }}>No. of days late for school (for the year till the date of this report): <strong>{v.lateDays || "___"}</strong></div>

                <div style={{ marginTop: 10, fontSize: 11.5 }}><strong>Conduct</strong>&emsp;{chk(v.conduct, "Excellent")} Excellent&emsp;{chk(v.conduct, "Very Good")} V Good&emsp;{chk(v.conduct, "Good")} Good&emsp;{chk(v.conduct, "Fair")} Fair&emsp;{chk(v.conduct, "Poor")} Poor</div>
                <div style={{ marginTop: 10, fontSize: 11.5 }}><strong>Academic Performance</strong>&emsp;{chk(v.academicPerf, "Good")} Good&emsp;{chk(v.academicPerf, "Fair")} Fair&emsp;{chk(v.academicPerf, "Poor")} Poor <span style={{ fontSize: 10, color: "#555" }}>(Please attach a copy of the latest academic results)</span></div>

                <div style={{ marginTop: 12, padding: "8px 10px", background: "#FFF8F0", border: "1px solid #E8D8C0", borderRadius: 3, fontSize: 11 }}>
                  <strong>Disciplinary Records (if any):</strong> [brief description of the offence(s) committed and corrective action(s) being meted out]
                  <div style={{ marginTop: 4, minHeight: 24, borderBottom: "1px dotted #ccc", whiteSpace: "pre-wrap" }}>{v.disciplinaryRecords || ""}</div>
                </div>
              </div>

              {/* Page 2: Conduct Checklist */}
              <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 11, letterSpacing: 1, marginTop: 20, marginBottom: 8, borderTop: "2px solid #000", paddingTop: 12 }}>RESTRICTED</div>
              <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 10 }}>B &emsp; Conduct: (Please tick where appropriate)*</div>
              <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                <tbody>
                  {POSITIVE.map((pt, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ textAlign: "center", padding: "3px 0", width: "4%" }}>{i + 1}.</td>
                      <td style={{ padding: "3px 0", width: "18%" }}>{pt}</td>
                      <td style={{ textAlign: "center", width: "5%" }}>{checklist.pos[pt] ? "☑" : "☐"}</td>
                      <td style={{ textAlign: "center", width: "5%" }}>{!checklist.pos[pt] ? "☑" : "☐"}</td>
                      <td style={{ width: "4%" }}></td>
                      <td style={{ textAlign: "center", width: "4%" }}>{i < NEGATIVE.length ? `${i + 1}.` : ""}</td>
                      <td style={{ padding: "3px 0", width: "22%" }}>{NEGATIVE[i] || ""}</td>
                      <td style={{ textAlign: "center", width: "5%" }}>{NEGATIVE[i] ? (checklist.neg[NEGATIVE[i]] ? "☑" : "☐") : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 10. Overall Conduct */}
              <div style={{ marginTop: 16, marginBottom: 10 }}>
                <div style={{ fontSize: 11.5, marginBottom: 4 }}><strong>10. Overall Conduct</strong> <em style={{ fontSize: 10, color: "#555" }}>(Please include Disciplinary Records)</em></div>
                <div style={{ fontSize: 11.5 }}>{chk(v.overallConduct, "Excellent")} <strong><em>Excellent</em></strong>&emsp;{chk(v.overallConduct, "Good")} <strong><em>Good</em></strong>&emsp;{chk(v.overallConduct, "Fair")} <strong><em>Fair</em></strong>&emsp;{chk(v.overallConduct, "Poor")} <strong><em>Poor</em></strong></div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11.5, fontWeight: "bold", marginBottom: 4 }}>Comments, if any:</div>
                <div style={{ borderBottom: "1px solid #000", minHeight: 18, padding: "2px 0", whiteSpace: "pre-wrap", fontSize: 11.5 }}>{v.conductComments || ""}</div>
                <div style={{ borderBottom: "1px solid #000", minHeight: 14, marginTop: 6 }}></div>
              </div>

              {/* Page 3: Academic */}
              <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 11, letterSpacing: 1, marginTop: 16, marginBottom: 8, borderTop: "2px solid #000", paddingTop: 12 }}>RESTRICTED</div>
              <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 4 }}>C &emsp; Academic Performance</div>
              <div style={{ fontSize: 10, fontStyle: "italic", color: "#555", marginBottom: 8 }}>(Please include copies of all academic results)</div>
              <div style={{ fontSize: 11.5, marginBottom: 8 }}>{chk(v.academicPerf, "Good")} <strong>Good</strong>&emsp;{chk(v.academicPerf, "Fair")} <strong>Satisfactory</strong>&emsp;{chk(v.academicPerf, "Poor")} <strong>Poor</strong></div>
              <div style={{ fontSize: 11.5, fontWeight: "bold", marginBottom: 4 }}>Other Remarks Pertaining to Academic Performance</div>
              <div style={{ borderBottom: "1px solid #000", minHeight: 18, padding: "2px 0", whiteSpace: "pre-wrap", fontSize: 11.5 }}>{v.academicRemarks || ""}</div>
              <div style={{ borderBottom: "1px solid #000", minHeight: 14, marginTop: 6 }}></div>
              <div style={{ borderBottom: "1px solid #000", minHeight: 14, marginTop: 6 }}></div>

              <div style={{ textAlign: "center", marginTop: 30, fontWeight: "bold", fontSize: 11, letterSpacing: 1 }}>CONFIDENTIAL</div>
            </div>
          </div>
        </div>
      </div>

      {/* Review modal */}
      {showReview && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(3px)" }}
          onClick={() => !reviewSent && setShowReview(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: 14, padding: "26px", width: 400, maxWidth: "90vw", boxShadow: "0 16px 48px rgba(0,0,0,0.14)" }}>
            {reviewSent ? (
              <div style={{ textAlign: "center", padding: "14px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>✓</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>Sent for review</div>
                <div style={{ fontSize: 12, color: C.sec }}>{chosenReviewers.length} reviewer(s) notified via email with a direct link to review and co-fill.</div>
              </div>
            ) : (
              <>
                <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: C.text }}>Route for Review</h2>
                <p style={{ margin: "0 0 16px", fontSize: 12, color: C.sec, lineHeight: 1.5 }}>
                  Select colleagues to review, co-fill, or vet this report before PDF export and submission.
                </p>
                {/* Progress */}
                <div style={{ background: C.alt, borderRadius: 8, padding: "9px 14px", marginBottom: 14, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.sec }}>Report: </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{selectedReport?.name?.substring(0, 36)}...</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, fontFamily: mono, fontWeight: 700, color: pct === 100 ? C.accent : C.text }}>{pct}%</span>
                    <div style={{ width: 40, height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: C.accent, borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
                {/* Reviewers */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                  {REVIEWERS.map(r => {
                    const on = chosenReviewers.includes(r.id);
                    return (
                      <button key={r.id} onClick={() => toggleReviewer(r.id)} style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8,
                        border: `1.5px solid ${on ? C.accent : C.border}`, background: on ? C.accentBg : C.surface,
                        fontFamily: ff, textAlign: "left", width: "100%", cursor: "pointer", transition: "all 0.12s",
                      }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 5, border: `2px solid ${on ? C.accent : C.border}`,
                          background: on ? C.accent : "transparent", color: "#fff", fontSize: 11, fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>{on && "✓"}</div>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.accentBg, color: C.accent, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{r.avatar}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text }}>{r.name}</div>
                          <div style={{ fontSize: 10.5, color: C.sec }}>{r.role}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button onClick={() => setShowReview(false)} style={{ padding: "8px 16px", borderRadius: 7, border: `1px solid ${C.border}`, background: C.surface, fontFamily: ff, fontSize: 12, fontWeight: 600, color: C.sec, cursor: "pointer" }}>Cancel</button>
                  <button onClick={sendReview} disabled={!chosenReviewers.length} style={{
                    padding: "8px 20px", borderRadius: 7, border: "none", fontFamily: ff, fontSize: 12, fontWeight: 700,
                    background: chosenReviewers.length ? C.accent : C.border, color: chosenReviewers.length ? "#fff" : C.ter,
                    cursor: chosenReviewers.length ? "pointer" : "not-allowed",
                  }}>Send to {chosenReviewers.length || "..."} reviewer{chosenReviewers.length !== 1 ? "s" : ""}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
