// Profiles – Export View Modal Wireframe
// Run in Figma: Plugins → Development → Open Console → paste & Enter

(async () => {
  const page = figma.currentPage;

  // ── font loader ──────────────────────────────────────────────────────────
  const loaded = new Set();
  async function loadFont(style) {
    const key = `Inter-${style}`;
    if (!loaded.has(key)) {
      await figma.loadFontAsync({ family: 'Inter', style });
      loaded.add(key);
    }
  }

  // ── helpers ──────────────────────────────────────────────────────────────
  function box(name, x, y, w, h, fill, radius = 0) {
    const n = figma.createRectangle();
    n.name = name;
    n.x = x; n.y = y; n.resize(w, h);
    n.fills = fill ? [{ type: 'SOLID', color: fill }] : [];
    if (radius) n.cornerRadius = radius;
    return n;
  }

  async function txt(str, x, y, size, weight = 'Regular', color = { r: 0.1, g: 0.1, b: 0.1 }) {
    await loadFont(weight);
    const n = figma.createText();
    n.fontName = { family: 'Inter', style: weight };
    n.characters = str;
    n.fontSize = size;
    n.fills = [{ type: 'SOLID', color }];
    n.x = x; n.y = y;
    return n;
  }

  function ellipse(x, y, d, fill) {
    const n = figma.createEllipse();
    n.x = x; n.y = y; n.resize(d, d);
    n.fills = [{ type: 'SOLID', color: fill }];
    return n;
  }

  // ── root frame 1280×800 ──────────────────────────────────────────────────
  const frame = figma.createFrame();
  frame.name = 'Profiles – Export View Modal';
  frame.resize(1280, 800);
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  page.appendChild(frame);

  const all = [];

  // ════════════════════════════════════════════════════════════════════════
  // BACKGROUND (dimmed Profiles page)
  // ════════════════════════════════════════════════════════════════════════

  // sidebar
  const sidebar = box('Sidebar', 0, 0, 220, 800, { r: 0.15, g: 0.15, b: 0.18 });
  all.push(sidebar);
  all.push(await txt('Teacher Workspace', 16, 14, 12, 'SemiBold', { r: 0.9, g: 0.9, b: 0.9 }));

  const navLabels = ['Home', 'Analytics', 'Profiles', 'Insight Buddy'];
  for (let i = 0; i < navLabels.length; i++) {
    const y = 60 + i * 36;
    const active = navLabels[i] === 'Profiles';
    if (active) all.push(box(`Nav Active – ${navLabels[i]}`, 8, y - 2, 204, 30, { r: 0.25, g: 0.27, b: 0.35 }, 6));
    all.push(box(`Nav Icon – ${navLabels[i]}`, 16, y + 4, 16, 16, { r: 0.4, g: 0.4, b: 0.45 }, 3));
    all.push(await txt(navLabels[i], 40, y + 5, 12, active ? 'Medium' : 'Regular', active ? { r: 0.95, g: 0.95, b: 0.95 } : { r: 0.55, g: 0.55, b: 0.6 }));
  }

  // topbar
  all.push(box('Topbar', 220, 0, 1060, 44, { r: 0.12, g: 0.12, b: 0.15 }));
  all.push(await txt('Profiles', 236, 13, 13, 'SemiBold', { r: 0.85, g: 0.85, b: 0.85 }));
  all.push(ellipse(1216, 12, 20, { r: 0.25, g: 0.27, b: 0.35 }));
  all.push(ellipse(1244, 12, 20, { r: 0.25, g: 0.27, b: 0.35 }));

  // page header
  all.push(await txt('Profiles', 236, 56, 18, 'Bold', { r: 0.85, g: 0.85, b: 0.85 }));
  all.push(await txt('You can view and manage student profiles.', 236, 80, 11, 'Regular', { r: 0.45, g: 0.45, b: 0.48 }));
  all.push(await txt('Secondary 3', 236, 104, 16, 'SemiBold', { r: 0.85, g: 0.85, b: 0.85 }));

  // stat cards (blurred bg)
  for (let i = 0; i < 3; i++) {
    all.push(box(`Stat Card ${i}`, 236 + i * 220, 132, 200, 68, { r: 0.18, g: 0.18, b: 0.22 }, 8));
    all.push(box(`Stat Bar ${i}`, 248 + i * 220, 152, 80, 12, { r: 0.3, g: 0.3, b: 0.35 }, 3));
    all.push(box(`Stat Bar2 ${i}`, 248 + i * 220, 172, 120, 8, { r: 0.25, g: 0.25, b: 0.30 }, 3));
  }

  // table header row
  all.push(box('Table Header', 220, 218, 1060, 36, { r: 0.16, g: 0.16, b: 0.20 }));
  const cols = ['Name', 'Class', 'Attendance (%)', 'Class Standing (%)', 'Risk (1-5)'];
  const colX = [240, 420, 540, 660, 820];
  for (let i = 0; i < cols.length; i++) {
    all.push(await txt(cols[i], colX[i], 227, 11, 'Medium', { r: 0.55, g: 0.55, b: 0.60 }));
  }

  // table rows (8 rows, blurred)
  for (let r = 0; r < 8; r++) {
    const rowY = 256 + r * 44;
    all.push(box(`Row Divider ${r}`, 220, rowY, 1060, 1, { r: 0.20, g: 0.20, b: 0.24 }));
    all.push(box(`Row Avatar ${r}`, 240, rowY + 10, 22, 22, { r: 0.28, g: 0.30, b: 0.38 }, 11));
    all.push(box(`Row Name ${r}`, 270, rowY + 14, 120, 10, { r: 0.30, g: 0.30, b: 0.35 }, 3));
    all.push(box(`Row Col2 ${r}`, 420, rowY + 14, 60, 10, { r: 0.28, g: 0.28, b: 0.32 }, 3));
    all.push(box(`Row Col3 ${r}`, 560, rowY + 14, 40, 10, { r: 0.28, g: 0.28, b: 0.32 }, 3));
    all.push(box(`Row Col4 ${r}`, 680, rowY + 14, 40, 10, { r: 0.28, g: 0.28, b: 0.32 }, 3));
    all.push(box(`Row Col5 ${r}`, 830, rowY + 14, 20, 10, { r: 0.28, g: 0.28, b: 0.32 }, 3));
  }

  // ════════════════════════════════════════════════════════════════════════
  // OVERLAY SCRIM
  // ════════════════════════════════════════════════════════════════════════
  const scrim = box('Overlay Scrim', 0, 0, 1280, 800, { r: 0.05, g: 0.05, b: 0.08 });
  scrim.opacity = 0.6;
  all.push(scrim);

  // ════════════════════════════════════════════════════════════════════════
  // MODAL  (490 × 390, centred)
  // ════════════════════════════════════════════════════════════════════════
  const mw = 490, mh = 300;
  const mx = (1280 - mw) / 2;
  const my = (800 - mh) / 2;

  // modal shadow
  const shadow = box('Modal Shadow', mx - 8, my - 8, mw + 16, mh + 16, { r: 0, g: 0, b: 0 }, 20);
  shadow.opacity = 0.18;
  all.push(shadow);

  // modal card
  const modal = box('Modal', mx, my, mw, mh, { r: 1, g: 1, b: 1 }, 16);
  modal.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
  modal.strokeWeight = 1;
  all.push(modal);

  // title row
  all.push(await txt('Export view', mx + 24, my + 22, 16, 'SemiBold'));

  // close button (×)
  const closeBtn = box('Close Button', mx + mw - 44, my + 18, 28, 28, { r: 0.95, g: 0.95, b: 0.95 }, 6);
  all.push(closeBtn);
  all.push(await txt('✕', mx + mw - 36, my + 22, 12, 'Regular', { r: 0.4, g: 0.4, b: 0.4 }));

  // divider
  const divider1 = box('Modal Divider', mx, my + 56, mw, 1, { r: 0.90, g: 0.90, b: 0.90 });
  all.push(divider1);

  // ── Section: What to export? (checkboxes) ───────────────────────────────
  all.push(await txt('What to export?', mx + 24, my + 72, 13, 'SemiBold'));

  // Helper: draw a checkbox (checked = blue fill + tick, unchecked = border only)
  function checkbox(x, y, checked) {
    const cb = box(`Checkbox`, x, y, 16, 16, checked ? { r: 0.25, g: 0.47, b: 0.95 } : { r: 1, g: 1, b: 1 }, 4);
    cb.strokes = [{ type: 'SOLID', color: checked ? { r: 0.25, g: 0.47, b: 0.95 } : { r: 0.70, g: 0.70, b: 0.70 } }];
    cb.strokeWeight = 1.5;
    return cb;
  }

  // option 1 – As shown (checked, blue border)
  const opt3 = box('Option – As Shown', mx + 24, my + 96, mw - 48, 60, { r: 0.94, g: 0.96, b: 1.0 }, 8);
  opt3.strokes = [{ type: 'SOLID', color: { r: 0.33, g: 0.53, b: 0.95 } }];
  opt3.strokeWeight = 1.5;
  all.push(opt3);
  all.push(checkbox(mx + 38, my + 110, true));
  // tick mark (two lines forming a checkmark using a small rotated rect as approximation)
  all.push(await txt('✓', mx + 38, my + 108, 12, 'Bold', { r: 1, g: 1, b: 1 }));
  all.push(await txt('As shown', mx + 62, my + 107, 13, 'Medium'));
  all.push(await txt('Export data as shown in the table', mx + 62, my + 124, 11, 'Regular', { r: 0.55, g: 0.55, b: 0.55 }));

  // option 2 – Redacted (unchecked)
  const opt4 = box('Option – Redacted', mx + 24, my + 164, mw - 48, 60, { r: 0.99, g: 0.99, b: 0.99 }, 8);
  opt4.strokes = [{ type: 'SOLID', color: { r: 0.88, g: 0.88, b: 0.88 } }];
  opt4.strokeWeight = 1;
  all.push(opt4);
  all.push(checkbox(mx + 38, my + 178, false));
  all.push(await txt('Redacted', mx + 62, my + 175, 13, 'Regular', { r: 0.3, g: 0.3, b: 0.3 }));
  all.push(await txt('Export with sensitive-high data masked', mx + 62, my + 192, 11, 'Regular', { r: 0.55, g: 0.55, b: 0.55 }));

  // ── Export button ────────────────────────────────────────────────────────
  const exportBtn = box('Export View Button', mx + mw - 148, my + mh - 52, 124, 36, { r: 0.25, g: 0.47, b: 0.95 }, 8);
  all.push(exportBtn);
  all.push(await txt('Export view', mx + mw - 126, my + mh - 42, 13, 'SemiBold', { r: 1, g: 1, b: 1 }));

  // ════════════════════════════════════════════════════════════════════════
  // Assemble
  // ════════════════════════════════════════════════════════════════════════
  for (const n of all) frame.appendChild(n);

  figma.viewport.scrollAndZoomIntoView([frame]);
  figma.notify('✅ Wireframe created: "Profiles – Export View Modal v2"');
})();
