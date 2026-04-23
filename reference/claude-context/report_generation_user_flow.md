# TW Report Generation — User Flow & Screen Map

## Context

**Problem:** YHs spend the bulk of their report-writing time manually copying the same student data from multiple digital sources into 3–4 different agency templates per child, each requiring the same information in different formats.

**Solution model:** Model B with collapsible PDF preview — a structured digital form in TW that pre-fills data from system sources (EduHub, School Cockpit, Case Sync, TCI), uses Appraiser to draft narrative sections, supports role-based editing (YH → P → Counsellor), and exports as the agency's exact PDF template.

**Prototype scope:** 2–3 agency templates for one student. Includes P review/sign-off flow. Ends at PDF export.

**Entry point:** Student Profile → Reports section (within existing TW prototype).

---

## Flow Overview

```
S1 Student Profile → S2 Reports Tab (Agency Reports) → S3 Template Selection
→ S4 Source Selection → S5 Report Form (Pre-filled + AI Narrative) → S6 Review & Resolve
→ S7 Submit for P Review → S8 P Review Interface → S9 YH Revisions (if needed)
→ S10 Export & Password → S11 Confirmation / Archive
```

---

## Screen-by-Screen Breakdown

---

### S1 — Student Profile (Existing — Minor Modification)

**What the user sees:**
The existing student profile page (e.g. `/students/1` for Chen Jun Kai) with all current sections: Attendance, Behaviour, Wellbeing, Academic, Family, Personal, and the existing **Reports** section at the bottom.

**What changes:**
The existing Reports section currently shows only HDP (Holistic Development Profile) reports with term-based cards. We add a second subsection within Reports:

- **Holistic Development Reports** (existing) — term-based HDP cards
- **Agency Reports** (new) — shows any in-progress or completed agency reports for this student, with a prominent **"+ New Agency Report"** button

If there are existing agency reports, they appear as cards showing: agency name, report type, status (Draft / Pending P Review / Approved / Sent), date created, and the assigned password (masked, click to reveal — 🔒 visible to YH, DM, and SLs only).

**Pain point addressed:**

> _"No tracking system for these different reports."_
> _"No centralised digital archive system; some schools have hard copies accumulate over the years."_

By surfacing agency reports alongside HDP reports on the student profile, we create a single place where all reports for a student are visible, trackable, and retrievable — solving the archive problem and the "digging through old emails for passwords" problem.

**Design justification:**
Nesting under the student profile (rather than a top-level nav item) respects the YH's mental model: reports are always _about_ a specific student. The YH is already on this student's profile because they received an email request — this is where they naturally land. Separating Agency Reports from HDP Reports keeps the two workflows distinct (they serve different purposes, different audiences, different triggers) while housing them in one place.

---

### S2 — New Agency Report: Template Selection

**What the user sees:**
After clicking **"+ New Agency Report"**, a modal or new page showing:

1. **Student context bar** (persistent across all report screens): Student name, class, photo, and a tag showing how many agency reports are currently in progress for this student.

2. **Template picker**: A list/grid of available agency templates, each showing:
   - Agency name and logo (e.g. CPS, Singapore Children's Society, NUH)
   - Report type (e.g. "CPS School Report", "SCS 7-Page Assessment", "NUH Referral Form")
   - Estimated fields to fill (e.g. "32 fields — ~18 auto-filled from system data")
   - A "Preview template" link that shows the blank agency PDF so the YH can confirm it's the right one

3. **Multi-select capability**: YH can select 1 or more templates to fill simultaneously. Even though they fill them one at a time (per your input), selecting multiple here allows the system to flag shared data across templates later.

**Pain point addressed:**

> _"Each agency has its own template with different fields, formats, and page lengths (e.g. CPS school report vs Singapore Children's Society 7-page form vs NUH referral)."_
> _"Oftentimes there are more than one (3–4 reports) that a teacher must fill up for ONE child."_

Showing all available templates in one place — with auto-fill estimates — immediately communicates the value proposition: "we know this is a lot of reports, and we can help." The preview link builds trust that we have the right template.

**Design justification:**
Multi-select (even with sequential filling) lets the system pre-confirm overlapping data once. Showing the "18 of 32 fields auto-filled" metric sets expectations and builds confidence before the YH commits to starting. The blank template preview addresses the anxiety of "is this the right form?" which currently requires digging through email attachments.

---

### S3 — Source Selection & Data Pull

**What the user sees:**
A pre-report setup screen showing:

1. **Data sources panel**: Checkboxes for available data sources, all checked by default:
   - ✅ School Cockpit (attendance, academics, family details, offences)
   - ✅ EduHub (student biodata, enrolment info)
   - ✅ Case Sync (counselling case notes, intervention plans)
   - ✅ TCI (Termly Check-In wellbeing data)

   Each source shows a brief description of what data it will pull, and a timestamp of when the data was last updated (e.g. "Last synced: 18 Apr 2026").

2. **Upload additional documents**: A drag-and-drop area for uploading supplementary documents (e.g. external assessment reports, parent correspondence, previous agency reports) that Appraiser can reference when drafting narrative sections.

3. **Data freshness warnings**: If any source has stale data (e.g. SC housing info last updated > 6 months ago), a yellow warning badge appears: "⚠ Housing data last updated 14 months ago — verify during review."

4. **"Pull data & begin" button**: Triggers the data pull and moves to the form.

**Pain point addressed:**

> _"SC sometimes may not have the most updated info. Housing type not updated."_
> _"YHs must manually copy data from each screen into the report."_
> _"Some data (e.g. parent occupation) is access-restricted and not visible even to VPs."_
> _"Information is behind access rights."_

This screen replaces the manual process of opening 4+ different systems, navigating to the right student in each, and copy-pasting data. It also surfaces data staleness _before_ the YH starts writing — rather than discovering it mid-report.

**Design justification:**
Showing sources with last-synced timestamps and freshness warnings addresses the trust deficit: YHs have been burned by stale data before. The upload area for additional documents ensures Appraiser has the richest possible context for narrative drafting — and acknowledges that not all relevant information lives in the system. Making sources deselectable gives the YH control (e.g. if they know Case Sync notes are incomplete for this student, they can skip that source and write manually).

---

### S4 — Report Form: The Core Authoring Experience

**What the user sees:**
A two-panel layout:

**Left panel (~70–75% width) — The digital form:**
The agency template's fields rendered as a structured form, organised into clearly labelled sections. Each field shows:

- **Field label** (matching the agency template's original label)
- **Pre-filled value** (from system data) with a small source tag (e.g. "From School Cockpit" in muted text)
- **Editable state**: All pre-filled fields are editable. The YH can override any value.
- **Conflict indicators**: If two sources provide different values for the same field (e.g. housing type differs between SC and a case note), a ⚠ badge appears with both values shown, asking the YH to confirm which is correct.

**Field types:**

- **Structured data fields** (attendance %, family composition, housing type, etc.): Pre-filled, editable, with source attribution.
- **Narrative fields** (behavioural observations, counsellor remarks, school's assessment): Show an **"AI Draft"** button. Clicking it generates a draft from the selected sources (Case Sync, TCI, uploaded docs). The draft appears with a persistent **"AI-assisted"** label that remains even after editing — this ensures transparency for the P and receiving agencies about AI involvement, while the "assisted" framing (rather than "drafted") communicates that the YH owns and has verified the content.
- **Restricted fields** (counsellor-only or P-only information): Shown as locked sections with a label: "🔒 To be completed by Principal" or "🔒 To be completed by School Counsellor". These sections are greyed out but visible, so the YH understands the full scope of the report.

**Section navigation:**
A sticky sidebar or tab bar showing all sections of the report (e.g. "Student Particulars → Family Background → Attendance & Academics → Behavioural Observations → Counsellor's Input → Principal's Remarks → Declaration"). The YH can jump between sections. Completed sections show a ✅ checkmark; sections with unresolved conflicts show ⚠.

**Right panel (~25–30% width) — Collapsible PDF preview:**
A thumbnail-scale rendering of the agency PDF template, showing how the current form data maps into the actual document. Updates as the YH edits. Collapsible to give more form space. Expandable for closer inspection.

**Pain point addressed:**

> _"The first ~5 pages of most reports are system data the YH copies manually; copy paste doesn't always work as formats differ." — THIS IS THE SINGLE BIGGEST PAIN POINT._
> _"Same data requested by every agency but in different formats (termly vs annual, percentage vs raw)."_
> _"No structured template — the YH wishes for a checkbox-style format instead of free text narrative for observations."_
> _"Oftentimes there are more than one (3–4 reports) that a teacher must fill up for ONE child."_

This screen directly eliminates the manual copy-paste workflow. System data is pre-filled. Narrative sections get an AI first draft. The YH's role shifts from data entry clerk to reviewer and editor.

**Design justification:**
The form-first layout (not the PDF) being the primary workspace ensures clean, reliable editing. Source attribution on every field builds trust ("where did this number come from?"). Conflict indicators surface data quality issues proactively rather than letting errors propagate silently. The restricted-section pattern (visible but locked) gives the YH full context on what the complete report looks like while making role boundaries clear — they know exactly what they're responsible for and what the P will handle. The collapsible PDF preview gives persistent reassurance without dominating the workspace.

---

### S5 — AI Narrative Drafting (Within S4)

**What the user sees:**
When the YH clicks **"AI Draft"** on a narrative field, a brief loading state appears, then:

1. **The drafted text** populates the field, with a persistent **"AI-assisted"** badge above it. This badge remains even after editing to maintain transparency.
2. **Source panel** (expandable): Below the text field, a collapsible section shows "Sources used for this draft" — listing the specific case notes, TCI entries, or uploaded documents that Appraiser drew from, with dates. Each source snippet is shown as a brief excerpt (1–2 lines) so the YH can verify.
3. **The YH edits freely.** The "AI-assisted" badge persists to ensure accountability and transparency, but the framing communicates that the YH has reviewed and owns the content.
4. **Regenerate option**: A small "↻ Redraft" button lets them regenerate if the first draft misses the mark. They can also adjust which sources to include before redrafting.

**Pain point addressed:**

> _"Time-consuming — need to wait for teacher availability."_
> _"Previously collected info on a student (e.g. PTM remarks on CCA, leadership) doesn't match what agencies ask for (social-emotional, behavioural triggers)."_

Appraiser bridges the gap between what schools normally document (academic, CCA) and what agencies ask for (social-emotional, behavioural). It drafts in the agency's framing from the school's existing data.

**Design justification:**
Showing sources alongside the draft addresses the accountability concern: YHs are putting their name on this report, and the P will review it. They need to verify, not blindly trust. The persistent "AI-assisted" label ensures full transparency throughout the review chain — the P and any future reviewer can see where AI was involved. Using "assisted" rather than "drafted" frames the AI as a tool the YH used (like spell-check or a calculator), not as the author. The regenerate option with source adjustment gives the YH control without forcing them to start from scratch.

---

### S6 — Review & Resolve

**What the user sees:**
Before submitting for P review, a summary screen showing:

1. **Completion checklist**: All sections listed with status:
   - ✅ Completed
   - ⚠ Has unresolved data conflicts (click to jump to field)
   - 🔒 Awaiting P / Counsellor input
   - ❌ Required field empty

2. **Data conflict resolution panel**: Any fields where sources disagreed, showing which value the YH selected and which was discarded. This creates an audit trail.

3. **Freshness summary**: Any fields where the source data was flagged as potentially stale, with the YH's confirmation that they've verified (or a note about what they updated).

4. **"Submit for Principal Review" button** — disabled until all YH-owned required fields are complete and all conflicts are resolved.

**Pain point addressed:**

> _"SC sometimes may not have the most updated info."_
> _"Some reports are time-sensitive, only 3–5 days turnaround."_

The review screen ensures nothing is missed before the P sees it, reducing back-and-forth cycles that eat into tight deadlines. The conflict audit trail protects the YH if questions arise later.

**Design justification:**
This is a deliberate friction point — but productive friction. It prevents incomplete reports from reaching the P (saving everyone time) and creates a record of data decisions. For time-sensitive reports, this checklist actually _speeds up_ the process by catching issues before they become P-review rejections.

---

### S7 — Submit for Principal Review

**What the user sees:**
A brief confirmation modal:

- Summary of what's being submitted (report type, student name, completion %)
- Which sections are marked for P input (🔒 fields)
- Optional: a note field where the YH can flag anything for the P's attention (e.g. "Counselling details needed in Section 5", "Housing info may be outdated — I've flagged it")
- **"Submit for Review"** button

After submission, the report status changes to **"Pending P Review"** on the student profile.

**Pain point addressed:**

> _"Send to Principal for vetting — some Ps find it important to add their inputs at this stage."_
> _"Sometimes this must be printed out for vetting due to sensitivity of information."_

Moving the P review into TW eliminates the print-review-scan cycle and keeps sensitive information within a controlled digital environment rather than on paper.

**Design justification:**
The note field is small but important — it replaces the informal "hey, can you look at Section 5" email or corridor conversation with a structured handoff. It ensures the P knows exactly where their input is needed, reducing review time.

---

### S8 — Principal Review Interface

**What the user sees:**
The P opens the report from their own TW view (either via notification or from the student profile). They see:

1. **The same two-panel layout** (form + collapsible PDF preview), but in a "review mode":
   - YH-completed fields are **read-only** for the P, shown with a subtle "Completed by [YH name]" tag
   - AI-assisted narrative sections show a persistent **"AI-assisted"** badge, giving the P full visibility into where AI was involved — even though the YH has reviewed and edited the content
   - **P-only sections are now editable** — these are highlighted with a distinct visual treatment (e.g. a blue left border) so the P can immediately see where their input is needed
   - **Counsellor sections** remain locked if the counsellor hasn't completed their part yet

2. **Comment capability**: On any field or section, the P can leave inline comments (similar to Google Docs comments). These appear as margin annotations that the YH will see if the report is sent back for revisions.

3. **Confidential information input**: P-only fields (e.g. counselling details visible only at principal level) are clearly marked and editable.

4. **Action buttons**:
   - **"Approve"** — report moves to export-ready status
   - **"Request Revisions"** — sends back to YH with comments highlighted
   - **"Add remarks & Approve"** — P adds their input and approves in one step

**Pain point addressed:**

> _"P adds in confidential information only they have access to (e.g. counselling details visible only at their level)."_
> _"P will sign and say ok."_
> _"Sometimes this must be printed out for vetting due to sensitivity of information."_

The role-based editing model means the P sees only what they need to act on, with clear visual cues. No printing, no email back-and-forth.

**Design justification:**
Making YH fields read-only for the P prevents accidental overwrites and respects the separation of responsibilities. The inline commenting (rather than a separate email thread) keeps feedback contextualised — the P's comment sits right next to the field it references, eliminating ambiguity. The three action buttons cover the real-world decision tree: approve as-is, send back, or contribute and approve.

---

### S9 — YH Revisions (If Requested)

**What the user sees:**
If the P selected "Request Revisions," the YH reopens the report and sees:

1. **P's comments** highlighted inline, with a comment counter badge at the top ("3 comments from Principal")
2. Each comment is anchored to a specific field or section
3. The YH can resolve comments one by one (similar to Google Docs: address → mark as resolved)
4. Once all comments are resolved, the **"Re-submit for Review"** button activates

**Pain point addressed:**

> _"YH work on feedback/comments from P."_

Today this happens over email or printed markups with no structured tracking. The inline comment → resolve workflow makes the feedback loop tight and traceable.

**Design justification:**
The resolve-by-comment pattern is familiar from Google Docs and reduces cognitive load. The YH doesn't have to figure out "what did the P mean?" — they see the comment right next to the relevant field. The re-submit triggers another P review, creating a clean audit loop.

---

### S10 — Export & Password Management

**What the user sees:**
Once the report is approved, the YH sees an export screen:

1. **Export preview**: A final full-page PDF preview showing the completed report exactly as it will be sent to the agency.

2. **Password management** (🔒 _Accessible to YH, DM, and School Leaders only_):
   - If a password was previously stored for this agency: "Password on file: ●●●●●●●● (click to reveal)" with option to use it
   - If no password exists: input field to enter the password provided by the agency, with a "Save for future reports to [agency name]" checkbox
   - The password is applied to the PDF automatically on export
   - All passwords are stored in the TW archive alongside their associated reports, access-restricted to YH, DM, and SL roles only. Passwords are retrievable from the student profile's Agency Reports section (also access-restricted).

3. **Export actions**:
   - **"Download PDF"** — downloads the password-protected PDF to the YH's device
   - **"Save to TW Archive"** — stores a copy within TW linked to the student profile

4. **Post-export prompt**: "Report downloaded. After emailing to [agency], you can mark this report as 'Sent' to update the status."

**Pain point addressed:**

> _"Need to convert each report into PDF/Word — need to be password protected."_
> _"Reports are password protected, and it's a hassle to dig through old emails for the password."_
> _"No centralised digital archive system."_

Password storage eliminates the "dig through emails for the password" problem. The archive copy solves the records retention need for legal disputes and future agency requests.

**Design justification:**
Storing passwords per agency (not per report) means the YH enters it once and reuses it. Access-restricting passwords to YH/DM/SL roles ensures sensitive credentials aren't exposed to staff who don't need them (e.g. form teachers, subject teachers). Archiving passwords alongside reports means they're always retrievable in context — no more searching through email threads. The archive is automatic, not optional — this ensures compliance with record-keeping requirements without adding a step. The "mark as sent" prompt (rather than auto-tracking email) respects the constraint that reports are sent via the YH's own email outside TW.

---

### S11 — Confirmation & Next Steps

**What the user sees:**
A brief confirmation state:

- ✅ "CPS School Report for Chen Jun Kai — Exported & Archived"
- Quick actions:
  - **"Start next report"** — if the YH selected multiple templates in S2, this takes them directly to the next template's form (with shared data already confirmed from the first report)
  - **"Open case in Case Sync"** — opens the student's case in Case Sync (external link) so the YH can log that the report was submitted, update case notes, or continue case management. This closes the loop between report generation and ongoing case work.
  - **"Return to student profile"** — back to the student profile where the Agency Reports section now shows the completed report with its status
  - **"View in Reports"** — jumps to the Reports nav section showing all agency reports

**Pain point addressed:**

> _"Oftentimes there are more than one (3–4 reports) that a teacher must fill up for ONE child."_
> _"School retains a copy — this is important for potential legal disputes (which can span 2–3 years), reintegration efforts, or future requests from agencies for historical context."_

The "Start next report" shortcut carries confirmed data forward, so the YH doesn't re-verify the same attendance figures and family details for template #2. The Case Sync link ensures continuity between the report and the student's ongoing case management — the report doesn't exist in isolation.

**Design justification:**
This is where the multi-template value becomes tangible. Even though reports are filled sequentially, the data confirmed in report #1 is pre-loaded into report #2. The YH only needs to handle template-specific fields and narrative sections for subsequent reports. The time saving compounds with each additional report. The "Open case in Case Sync" button acknowledges that report generation is one step in a larger case management workflow — giving the YH a natural bridge back to their ongoing work rather than a dead end.

---

## Flow Summary Table

| Screen                   | User action                                              | Pain point addressed                                                                | Key design decision                                                                    |
| ------------------------ | -------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| S1 — Student Profile     | Navigate to Reports section, click "+ New Agency Report" | No tracking system; no digital archive                                              | Entry point under student profile, not top-level nav                                   |
| S2 — Template Selection  | Select 1+ agency templates                               | Multiple templates per child; different formats                                     | Multi-select with auto-fill estimates builds confidence                                |
| S3 — Source Selection    | Confirm data sources, upload additional docs             | Manual data gathering from 4+ systems; stale data                                   | Freshness warnings surface issues before writing starts                                |
| S4 — Report Form         | Review pre-filled data, edit fields, trigger AI drafts   | Manual copy-paste (SINGLE BIGGEST PAIN POINT); role-based access                    | Form as primary workspace; PDF preview for trust                                       |
| S5 — AI Narrative        | Generate and edit AI-drafted narrative sections          | Time-consuming info gathering; format mismatch between school data and agency needs | Source attribution for accountability; persistent "AI-assisted" label for transparency |
| S6 — Review & Resolve    | Resolve conflicts, verify completeness                   | Stale data; tight deadlines                                                         | Productive friction — catches issues before P review                                   |
| S7 — Submit for P Review | Add notes, submit                                        | Paper-based vetting; informal handoff                                               | Structured handoff replaces corridor conversations                                     |
| S8 — P Review            | P edits restricted sections, comments, approves          | P needs to add confidential info; printing for review                               | Role-based editing; inline comments                                                    |
| S9 — YH Revisions        | Address P comments, re-submit                            | Email-based feedback loop                                                           | Anchored comments with resolve workflow                                                |
| S10 — Export & Password  | Download PDF, manage password, archive                   | Password hassle; no archive system                                                  | Per-agency password storage (access-restricted); automatic archiving                   |
| S11 — Confirmation       | Start next report, open Case Sync, or return             | Multiple reports per child; case management continuity                              | Data carries forward to next template; Case Sync bridge                                |
