// Retention: of the players who first opened the game on a given day, what
// share came back N days later. Cohorts = days of first session, last 35 days
// (ga4.js > retention). A game tab gets the curve and a heat table by install
// week; the "all games" tab gets the games side by side.
// Uses page helpers from index.html at call time ($, esc, fmt, num, niceMax,
// plural, swatch, props, fail, select).
(function () {
  const COLS = [1, 2, 3, 7, 14, 21, 28];
  const DAY = 864e5;
  const wall = s => Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8));
  const dm = t => { const d = new Date(t); return String(d.getUTCDate()).padStart(2, '0') + '.' + String(d.getUTCMonth() + 1).padStart(2, '0'); };

  // rows -> [{t (install day), size, a: [active on day 0..28]}], newest first.
  // A day that hasn't fully passed yet is left out (null), not counted as 0.
  function cohorts(d) {
    const today = wall(d.today), by = new Map();
    ((d.ret && d.ret.rows) || []).forEach(r => {
      const c = by.get(r.cohort) || by.set(r.cohort, Array(d.days + 1).fill(0)).get(r.cohort);
      const n = +r.cohortNthDay;
      if (n <= d.days) c[n] = num(r.cohortActiveUsers);
    });
    return [...by.entries()].map(([name, a]) => {
      const t = wall(name.slice(1)), age = Math.round((today - t) / DAY);
      return {t, size: a[0], a: a.map((v, n) => n < age ? v : null)};
    }).filter(c => c.size).sort((x, y) => y.t - x.t);
  }

  // Share back on day n over the cohorts that have lived that long.
  function rate(list, n) {
    let back = 0, base = 0;
    list.forEach(c => { if (c.a[n] != null) { back += c.a[n]; base += c.size; } });
    return base ? {v: back / base, back, base} : null;
  }

  const pc = r => r ? Math.round(r.v * 100) + '%' : '·';
  // heat: one hue, stronger = more came back; scaled to the best day-1 so later days still show
  function cell(r, top) {
    if (!r) return '<td class="n rc empty">·</td>';
    if (r.base < 10) return `<td class="n rc empty" title="мало данных: вернулись ${r.back} из ${r.base}">${pc(r)}</td>`;
    const k = top ? Math.min(1, r.v / top) : 0;
    return `<td class="n rc" style="background:color-mix(in srgb, var(--accent) ${Math.round(8 + k * 55)}%, transparent)" title="вернулись ${r.back} из ${r.base}">${pc(r)}</td>`;
  }

  function curve(list) {
    const pts = [];
    // a day is drawn only while enough players have lived that long: a tail of 5 people is noise
    const minBase = Math.max(20, list.reduce((s, c) => s + c.size, 0) * .15);
    for (let n = 1; n <= 28; n++) { const r = rate(list, n); if (r && r.base >= minBase) pts.push(Object.assign({n}, r)); }
    if (pts.length < 2) return '<div class="empty">Мало данных: когорты ещё молодые.</div>';
    const W = 900, H = 170, L = 36, B = 20, top = niceMax(Math.max(...pts.map(p => p.v)) * 100 * 1.15);
    const x = n => L + (n - 1) / 27 * (W - L - 12), y = v => 10 + (H - 10) * (1 - v * 100 / top);
    let s = `<svg viewBox="0 0 ${W} ${H + B}" role="img" aria-label="Доля вернувшихся по дням после установки">`;
    [0, .5, 1].forEach(f => { const v = top * f; s += `<line x1="${L}" x2="${W}" y1="${y(v / 100)}" y2="${y(v / 100)}" stroke="var(--line)"/><text x="${L - 6}" y="${y(v / 100) + 3}" text-anchor="end">${Math.round(v)}%</text>`; });
    [1, 7, 14, 21, 28].forEach(n => s += `<text x="${x(n)}" y="${H + 15}" text-anchor="${n === 1 ? 'start' : n === 28 ? 'end' : 'middle'}">день ${n}</text>`);
    const line = pts.map(p => `${x(p.n)},${y(p.v)}`).join(' ');
    s += `<polygon points="${x(pts[0].n)},${y(0)} ${line} ${x(pts[pts.length - 1].n)},${y(0)}" fill="var(--accent-soft)"/>`;
    s += `<polyline points="${line}" fill="none" stroke="var(--accent)" stroke-width="2"/>`;
    pts.forEach(p => {
      const lab = [1, 7, 14, 28].includes(p.n);
      s += `<g><title>День ${p.n}: вернулись ${Math.round(p.v * 100)}% (${p.back} из ${p.base})</title>` +
        `<rect x="${x(p.n) - 15}" y="0" width="30" height="${H}" fill="transparent"/>` +
        `<circle cx="${x(p.n)}" cy="${y(p.v)}" r="${lab ? 4 : 2.5}" fill="var(--accent)" stroke="var(--panel)" stroke-width="2"/>` +
        (lab ? `<text x="${x(p.n)}" y="${y(p.v) - 9}" text-anchor="middle" style="fill:var(--fg)">${Math.round(p.v * 100)}%</text>` : '') + '</g>';
    });
    return s + '</svg>';
  }

  // Cohorts folded by install week (newest first), then each day on demand.
  function heat(list) {
    const top = (rate(list, 1) || {v: 0}).v * 1.3 || 1;
    const head = '<tr><th>Установили</th><th class="n">Игроков</th>' + COLS.map(n => `<th class="n">День ${n}</th>`).join('') + '</tr>';
    const row = (label, group) => `<tr><td>${label}</td><td class="n">${fmt(group.reduce((s, c) => s + c.size, 0))}</td>` + COLS.map(n => cell(rate(group, n), top)).join('') + '</tr>';
    const weeks = [];
    for (let i = 0; i < list.length; i += 7) weeks.push(list.slice(i, i + 7));
    let s = '<div class="tbl"><table class="ret"><thead>' + head + '</thead><tbody>';
    s += row('<b>Все за 5 недель</b>', list);
    weeks.forEach(w => s += row(`${dm(w[w.length - 1].t)}–${dm(w[0].t)}`, w));
    s += '</tbody></table></div>';
    s += '<details class="more"><summary>по дням установки</summary><div class="tbl"><table class="ret"><thead>' + head + '</thead><tbody>' +
      list.map(c => row(dm(c.t), [c])).join('') + '</tbody></table></div></details>';
    return s;
  }

  async function game(prop) {
    const el = $('retention');
    try {
      const d = await GA4.retention(prop);
      if (prop !== current) return;
      if (d.ret.error) { el.innerHTML = `<div class="err">${esc(d.ret.error)}</div>`; $('retCards').innerHTML = ''; return; }
      const list = cohorts(d);
      if (!list.length) { el.innerHTML = '<div class="empty">Новых игроков за 5 недель нет.</div>'; $('retCards').innerHTML = $('retCurve').innerHTML = ''; return; }
      const total = list.reduce((s, c) => s + c.size, 0);
      $('retCards').innerHTML = [[1, 'на следующий день'], [7, 'через неделю'], [14, 'через 2 недели'], [28, 'через 4 недели']].map(([n, t]) => {
        const r = rate(list, n);
        return r && r.base >= 20 ? `<div class="insight"><b>${pc(r)}</b><span>вернулись ${t} · ${r.back} из ${r.base}</span></div>` : '';
      }).join('') + `<div class="insight"><b>${fmt(total)}</b><span>новых ${plural(total, 'игрок', 'игрока', 'игроков')} за 5 недель</span></div>`;
      $('retCurve').innerHTML = curve(list);
      el.innerHTML = heat(list);
    } catch (e) { fail(e); }
  }

  async function all(ids) {
    const el = $('ovRetention');
    try {
      const d = await GA4.retentionAll(ids);
      if (current !== 'all') return;
      const rows = ids.map(id => {
        const p = props.find(x => x.id === id) || {name: id}, g = d[id];
        if (g.ret.error) return {id, name: p.name, err: g.ret.error};
        const list = cohorts(g);
        return {id, name: p.name, list, size: list.reduce((s, c) => s + c.size, 0)};
      }).filter(r => r.err || r.size).sort((a, b) => (b.size || 0) - (a.size || 0));
      if (!rows.length) { el.innerHTML = '<div class="empty">Новых игроков за 5 недель нет.</div>'; return; }
      const top = Math.max(...rows.filter(r => r.list).map(r => (rate(r.list, 1) || {v: 0}).v)) * 1.1 || 1;
      el.innerHTML = '<div class="tbl"><table class="ret"><thead><tr><th>Игра</th><th class="n">Новых</th>' +
        [1, 3, 7, 14, 28].map(n => `<th class="n">День ${n}</th>`).join('') + '</tr></thead><tbody>' +
        rows.map(r => r.err
          ? `<tr><td class="game">${swatch(r.id)}${esc(r.name)}</td><td colspan="6" class="err">${esc(r.err)}</td></tr>`
          : `<tr class="click" data-id="${esc(r.id)}"><td class="game">${swatch(r.id)}${esc(r.name)}</td><td class="n">${fmt(r.size)}</td>` +
            [1, 3, 7, 14, 28].map(n => cell(rate(r.list, n), top)).join('') + '</tr>').join('') + '</tbody></table></div>';
      el.querySelectorAll('tr.click').forEach(tr => tr.onclick = () => select(tr.dataset.id));
    } catch (e) { fail(e); }
  }

  window.Retention = {game, all};
})();
