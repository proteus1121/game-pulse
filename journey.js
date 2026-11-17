// Player journeys: who played (country, city, phone), and what they did step
// by step - opened the game, started a mode, saw an ad, tapped "buy"...
// Two views: the last 30 minutes (Realtime API) and the selected period
// (regular reports). GA4 gives no player id: a player is country + city +
// phone model + Android version (see ga4.js > PKEY).
// Uses the page helpers from index.html at call time ($, esc, fmt, num, dur,
// nameOf, isUnset, plural, swatch, props, fail, PERIODS, period, current).
(function () {
  const C = window.GAME_PULSE;
  const R = rep => (rep && rep.rows) || [];
  const pad = n => String(n).padStart(2, '0');

  let regionDN = null;
  try { regionDN = new Intl.DisplayNames(['ru'], {type: 'region'}); } catch {}
  const countryName = id => { if (!id) return 'страна неизвестна'; try { return regionDN ? regionDN.of(id) : id; } catch { return id; } };

  // ------------------------------------------------------------ kinds of steps

  // What a step is about: picks its colour and marker shape (shape too, so it
  // never rests on colour alone).
  const KINDS = {
    play: {t: 'Игра', c: 'var(--c1)'},
    ads: {t: 'Реклама', c: 'var(--c4)'},
    money: {t: 'Покупки', c: 'var(--c3)'},
    session: {t: 'Вход / обновление', c: 'var(--muted)'},
    bad: {t: 'Удалил игру', c: 'var(--bad)'},
  };
  const BOUGHT = new Set(['purchase', 'in_app_purchase', 'iap_bought', 'remove_ads_bought']);
  function kindOf(ev) {
    if (ev === 'app_remove') return 'bad';
    if (/^(remove_ads|iap_|purchase|in_app_purchase|begin_checkout|full_|shop_open|item_bought|upgrade_bought)/.test(ev)) return 'money';
    if (/^(ad_|gift_ad|mp_ad)/.test(ev)) return 'ads';
    if (/^(session_start|first_open|app_open|app_update|game_ready|session_end|notif_open|reminder_open)$/.test(ev)) return 'session';
    return 'play';
  }
  function mark(kind, x, y, s = 1) {
    x = +x; y = +y; // callers pass toFixed() strings: "380.0" + 5 would glue
    const c = KINDS[kind].c, a = v => (v * s).toFixed(1);
    if (kind === 'ads') return `<circle cx="${x}" cy="${y}" r="${a(4)}" fill="${c}"/>`;
    if (kind === 'money') return `<path d="M${x} ${y - 5 * s}L${x + 5 * s} ${y}L${x} ${y + 5 * s}L${x - 5 * s} ${y}Z" fill="${c}"/>`;
    if (kind === 'session') return `<rect x="${x - 3.5 * s}" y="${y - 3.5 * s}" width="${a(7)}" height="${a(7)}" rx="1" fill="var(--panel)" stroke="${c}" stroke-width="2"/>`;
    if (kind === 'bad') return `<path d="M${x - 4 * s} ${y - 4 * s}L${x + 4 * s} ${y + 4 * s}M${x + 4 * s} ${y - 4 * s}L${x - 4 * s} ${y + 4 * s}" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`;
    return `<rect x="${x - 1.5}" y="${y - 7 * s}" width="3" height="${a(14)}" rx="1.5" fill="${c}"/>`;
  }
  const icon = kind => `<svg class="mk" viewBox="-7 -8 14 16" aria-hidden="true">${mark(kind, 0, 0, .85)}</svg>`;
  const legend = () => Object.entries(KINDS).map(([k, v]) => `<span class="gl">${icon(k)}${v.t}</span>`).join('');

  // ------------------------------------------------------------ per game

  const ctxCache = new Map();
  function ctx(prop) {
    if (ctxCache.has(prop)) return ctxCache.get(prop);
    const game = (C.games || {})[prop] || null, J = GA4.journeyCfg(game), lab = {}, title = {};
    ((game && game.breakdowns) || []).forEach(b => {
      if (b.scope === 'user') return;
      if (b.labels) { lab[b.event + '|' + b.dim] ||= b.labels; lab[b.dim] ||= b.labels; }
      if (b.col && title[b.dim] == null) title[b.dim] = b.col;
    });
    if (game && game.level) { if (game.levelLabels) lab[game.level] = game.levelLabels; title[game.level] = game.levelLabels ? '' : 'ур.'; }
    if (J.mode) { if (J.mode.labels) lab[J.mode.dim] = J.mode.labels; if (J.mode.labels) title[J.mode.dim] = ''; }
    const X = {prop, game, J, lab, title};
    ctxCache.set(prop, X);
    return X;
  }

  // Short names for the steps players take most; the rest from config.js > events.
  const SHORT = {
    session_start: 'Зашёл в игру', first_open: 'Установил и открыл', app_update: 'Обновил игру', app_remove: 'Удалил игру',
    level_end: 'Закончил забег',
  };
  const evName = ev => SHORT[ev] || (C.events || {})[ev] || ev;

  function paramText(X, ev, dim, v) {
    if (Array.isArray(v)) return v.map(([x, n]) => paramText(X, ev, dim, x) + (n > 1 ? ' ×' + n : '')).filter(Boolean).join(', ');
    if (isUnset(v)) return '';
    if (X.game && dim === X.game.outcome) return v === '1' ? '✓ успех' : v === '0' ? '✗ неудача' : v;
    const name = nameOf(v, X.lab[ev + '|' + dim] || X.lab[dim]), t = X.title[dim];
    if (!t) return String(name);
    return /\.$/.test(t) ? `${t} ${name}` : `${t.toLowerCase()}: ${name}`;
  }
  const stepText = (X, s, only) => [evName(s.ev)].concat(Object.entries(s.p)
    .filter(([d]) => !only || only.includes(d)).map(([d, v]) => paramText(X, s.ev, d, v)).filter(Boolean)).join(' · ');

  // ------------------------------------------------------------ time

  // GA4 dates are the property's wall clock; kept as ms read as UTC.
  const wall = s => Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8), +s.slice(8, 10), +(s.slice(10, 12) || 0));
  function wallNow(tz, at) {
    try {
      const f = new Intl.DateTimeFormat('en-CA', {timeZone: tz || undefined, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'});
      const x = Object.fromEntries(f.formatToParts(new Date(at)).map(p => [p.type, p.value]));
      return Date.UTC(+x.year, +x.month - 1, +x.day, +x.hour, +x.minute);
    } catch { const d = new Date(at); return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()); }
  }
  const hm = t => { const d = new Date(t); return pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()); };
  const dm = t => { const d = new Date(t); return pad(d.getUTCDate()) + '.' + pad(d.getUTCMonth() + 1); };
  const tzLabel = tz => !tz ? 'местное' : tz.replace(/^Etc\/GMT([+-])(\d+)$/, (m, s, n) => 'GMT' + (s === '-' ? '+' : '−') + n);
  const mins = ms => Math.round(ms / 60000);
  const span = m => m < 60 ? m + ' мин' : Math.floor(m / 60) + ' ч ' + pad(m % 60) + ' мин';

  // ------------------------------------------------------------ building players

  function newPlayer(X, k, r) {
    return {k, prop: X.prop, countryId: r.countryId || '', cityId: r.cityId || '', deviceModel: r.deviceModel || '',
      operatingSystemVersion: r.operatingSystemVersion || '', city: '', brand: '', name: '', versions: new Set(),
      store: '', users: 0, fresh: 0, sessions: 0, eng: 0, steps: [], devices: null};
  }

  // Sorts the steps (inside one minute GA4 keeps no order: entering first,
  // the outcome and removal last), merges duplicates and counts what matters.
  function finish(p, X) {
    const g = X.game || {}, J = X.J;
    const rank = s => s.ev === 'first_open' ? 0 : s.ev === 'app_update' ? 1 : s.ev === 'session_start' ? 2 : kindOf(s.ev) === 'session' ? 3
      : s.ev === g.start ? 4 : s.ev === 'app_remove' ? 9 : (s.ev === g.win || s.ev === g.lose) ? 7
      : /_(search|room)$/.test(s.ev) ? 4.2 : /_(start|open|offer|tap|click)$/.test(s.ev) ? 4.5
      : /_(end|leave|quit|result|bought|lose|win)$/.test(s.ev) ? 6 : 5;
    p.steps.sort((a, b) => a.t - b.t || rank(a) - rank(b));
    const merged = [];
    p.steps.forEach(s => {
      const id = s.t + '|' + s.ev + '|' + JSON.stringify(s.p), last = merged[merged.length - 1];
      if (last && last._id === id) last.n += s.n; else merged.push(Object.assign({_id: id}, s));
    });
    p.steps = merged;
    p.first = merged.length ? merged[0].t : null;
    p.last = merged.length ? merged[merged.length - 1].t : null;
    p.cnt = {play: 0, ads: 0, money: 0, session: 0, bad: 0};
    p.byEv = new Map(); p.modes = new Map(); p.starts = 0; p.wins = 0; p.loses = 0; p.bought = 0;
    merged.forEach(s => {
      p.cnt[kindOf(s.ev)] += s.n;
      p.byEv.set(s.ev, (p.byEv.get(s.ev) || 0) + s.n);
      if (BOUGHT.has(s.ev)) p.bought += s.n;
      if (s.ev === g.start) p.starts += s.n;
      if (J.mode && s.ev === J.mode.event && !isUnset(s.p[J.mode.dim])) p.modes.set(s.p[J.mode.dim], (p.modes.get(s.p[J.mode.dim]) || 0) + s.n);
      if (g.outcome && s.ev === g.win) {
        if (s.p[g.outcome] === '1') p.wins += s.n; else if (s.p[g.outcome] === '0') p.loses += s.n;
      } else {
        if (g.win && s.ev === g.win) p.wins += s.n;
        if (g.lose && s.ev === g.lose) p.loses += s.n;
      }
    });
    return p;
  }

  function periodPlayers(d, X) {
    const K = GA4.PKEY, by = new Map();
    const get = r => { const k = K.map(x => r[x] || '').join('|'); return by.get(k) || by.set(k, newPlayer(X, k, r)).get(k); };
    R(d.pl_who).forEach(r => {
      const p = get(r);
      if (!p.city && !isUnset(r.city)) p.city = r.city;
      if (!p.brand && !isUnset(r.mobileDeviceBranding)) p.brand = r.mobileDeviceBranding;
      if (!p.name && !isUnset(r.mobileDeviceMarketingName)) p.name = r.mobileDeviceMarketingName;
      if (!isUnset(r.appVersion)) p.versions.add(r.appVersion);
      // one person on two game versions is one row per version: people - the max, the rest add up
      p.users = Math.max(p.users, num(r.activeUsers));
      p.fresh += num(r.newUsers); p.sessions += num(r.sessions); p.eng += num(r.userEngagementDuration);
    });
    if (X.J.store) R(d.pl_store).forEach(r => { const v = r['customUser:' + X.J.store]; if (!isUnset(v)) get(r).store = v; });
    const pd = ((d.pl_steps && d.pl_steps.dims) || []).filter(n => n.startsWith('customEvent:'));
    R(d.pl_steps).forEach(r => {
      const t = r.dateHourMinute || r.dateHour;
      if (!t || isUnset(r.eventName)) return;
      const params = {};
      pd.forEach(n => { if (!isUnset(r[n])) params[n.slice(12)] = r[n]; });
      get(r).steps.push({t: wall(t), ev: r.eventName, n: num(r.eventCount), p: params});
    });
    return [...by.values()].map(p => finish(p, X));
  }

  // Realtime: a player is city + game version; the phone is looked up in the
  // last 7 days of regular reports (a brand-new player isn't there yet).
  function livePlayers(prop, d) {
    const X = ctx(prop), now = wallNow(d.tz, d.at), by = new Map();
    const get = (cityId, ver) => {
      const k = prop + '|' + cityId + '|' + ver;
      return by.get(k) || by.set(k, Object.assign(newPlayer(X, k, {cityId}), {ver})).get(k);
    };
    R(d.lp_who).forEach(r => {
      const p = get(r.cityId || '', r.appVersion || '');
      p.countryId = r.countryId || p.countryId; if (!isUnset(r.city)) p.city = r.city;
      p.users += num(r.activeUsers);
      if (!isUnset(r.appVersion)) p.versions.add(r.appVersion);
    });
    if (X.J.store) R(d.lp_store).forEach(r => { const v = r['customUser:' + X.J.store]; if (!isUnset(v)) get(r.cityId || '', r.appVersion || '').store = v; });
    R(d.lp_steps).forEach(r => {
      if (isUnset(r.eventName)) return;
      get(r.cityId || '', r.appVersion || '').steps.push({t: now - num(r.minutesAgo) * 60000, ev: r.eventName, n: num(r.eventCount), p: {}});
    });
    const dev = R(d.devices);
    // A player who only just opened the game has no row in lp_who yet: the country comes from the city's history.
    by.forEach(p => { if (!p.countryId && p.cityId) { const r = dev.find(x => x.cityId === p.cityId); if (r) p.countryId = r.countryId; } });
    // the developer's own country (config.js > excludeCountries) is dropped here, not in the query
    const skip = new Set(R(d.lp_cc).filter(r => (C.excludeCountries || []).includes(r.country)).map(r => r.countryId));
    let en = null;
    try { en = new Intl.DisplayNames(['en'], {type: 'region'}); } catch {}
    const excluded = id => skip.has(id) || (en && id && (C.excludeCountries || []).includes(en.of(id)));
    return [...by.values()].filter(p => !excluded(p.countryId)).map(p => {
      const same = r => r.countryId === p.countryId && (r.cityId || '') === p.cityId;
      let cand = dev.filter(r => same(r) && r.appVersion === p.ver), exact = true;
      if (!cand.length) { cand = dev.filter(same); exact = false; }
      const seen = new Map();
      cand.sort((a, b) => num(b.activeUsers) - num(a.activeUsers)).forEach(r => {
        if (!seen.has(r.deviceModel)) seen.set(r.deviceModel, {brand: r.mobileDeviceBranding, name: r.mobileDeviceMarketingName, model: r.deviceModel, os: r.operatingSystemVersion});
      });
      p.devices = {list: [...seen.values()], exact};
      p.now = now;
      return finish(p, X);
    });
  }

  // ------------------------------------------------------------ cells

  // Few words per row: country and city, the phone, numbers. Everything else is in tooltips.
  function whoCell(p) {
    const tip = [p.users > 1 ? `с такими же городом и телефоном ${p.users} человек — шаги смешаны` : '',
      p.versions.size ? 'версия игры ' + [...p.versions].sort().join(' → ') : '', p.store ? nameOf(p.store, 'store') : ''].filter(Boolean).join('\n');
    return `<td class="who" title="${esc(tip)}"><span class="cc">${esc(p.countryId || '??')}</span><span>${esc(countryName(p.countryId))}` +
      `${p.fresh ? '<i class="newdot" title="новый игрок"></i>' : ''}<small>${esc(p.city || '')}</small></span></td>`;
  }

  const phoneName = d => {
    const name = !isUnset(d.name) && d.name ? d.name : d.model;
    const brand = !isUnset(d.brand) && d.brand && !String(name).toLowerCase().startsWith(String(d.brand).toLowerCase()) ? d.brand + ' ' : '';
    return brand + name;
  };
  function phoneCell(p) {
    let d;
    if (p.devices) {
      const L = p.devices.list;
      if (!L.length) return '<td class="phone muted" title="Realtime GA4 модель не отдаёт, а в обычных отчётах игрок ещё не появился">модель позже</td>';
      d = L[0];
      if (L.length > 1) d = Object.assign({}, d, {tip: 'или: ' + L.slice(1).map(phoneName).join(', ')});
    } else d = {brand: p.brand, name: p.name, model: p.deviceModel || '?', os: p.operatingSystemVersion};
    const os = d.os && !isUnset(d.os) ? 'Android ' + d.os : '';
    return `<td class="phone" title="${esc([d.model, os, d.tip].filter(Boolean).join(' · '))}">${esc(phoneName(d))}<small>${esc(os)}</small></td>`;
  }

  // ------------------------------------------------------------ timelines

  // A player's steps on a time axis shared by every row, so rows can be compared:
  // grey bars are sessions, marks are steps (shape + colour = kind). Hover = what happened.
  const SW = 420, SH = 24;
  function strip(steps, t0, t1, opts = {}) {
    const x = t => 4 + Math.max(0, Math.min(1, (t - t0) / (t1 - t0))) * (SW - 8), y = SH / 2;
    let s = `<svg class="strip" viewBox="0 0 ${SW} ${SH}" role="img" aria-label="Шаги игрока по времени">`;
    if (opts.now && opts.now < t1) s += `<rect x="${x(opts.now)}" y="2" width="${SW - 4 - x(opts.now)}" height="${SH - 4}" fill="var(--line)" opacity=".35"/>`;
    (opts.days || []).forEach(t => s += `<line x1="${x(t)}" x2="${x(t)}" y1="2" y2="${SH - 2}" stroke="var(--line)"/>`);
    s += `<line x1="4" x2="${SW - 4}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-dasharray="1 4"/>`;
    sessionsOf(steps).forEach(ss => {
      const a = x(ss[0].t), b = Math.max(a + 3, x(ss[ss.length - 1].t + (opts.grain || 60000)));
      s += `<rect x="${a.toFixed(1)}" y="${y - 4}" width="${(b - a).toFixed(1)}" height="8" rx="4" fill="var(--line)"/>`;
    });
    const B = 4, buckets = new Map();
    steps.forEach(st => { const k = Math.round(x(st.t) / B); (buckets.get(k) || buckets.set(k, []).get(k)).push(st); });
    const order = ['session', 'play', 'ads', 'money', 'bad'];
    buckets.forEach((list, k) => {
      const cx = (k * B).toFixed(1);
      // lanes: ads above the line, purchases below, the rest on it
      order.filter(kd => list.some(st => kindOf(st.ev) === kd)).forEach(kd =>
        s += mark(kd, cx, y + (kd === 'ads' ? -6.5 : kd === 'money' ? 6.5 : 0), kd === 'play' ? .6 : .75));
      const cnt = new Map();
      list.forEach(st => cnt.set(evName(st.ev), (cnt.get(evName(st.ev)) || 0) + st.n));
      const when = opts.multiDay ? dm(list[0].t) + ' ' + hm(list[0].t) : hm(list[0].t);
      const tip = when + (list[list.length - 1].t !== list[0].t ? '–' + hm(list[list.length - 1].t) : '') + '\n' +
        [...cnt].map(([t, n]) => t + (n > 1 ? ' ×' + n : '')).join('\n');
      s += `<rect x="${k * B - B / 2}" y="0" width="${B}" height="${SH}" fill="transparent"><title>${esc(tip)}</title></rect>`;
    });
    return s + '</svg>';
  }

  // The axis for the column header: same width and scale as the strips.
  function axis(ticks) {
    let s = `<svg class="strip axis" viewBox="0 0 ${SW} 14" aria-hidden="true">`;
    ticks.forEach(([f, t], i) => s += `<text x="${4 + f * (SW - 8)}" y="11" text-anchor="${i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'middle'}">${esc(t)}</text>`);
    return s + '</svg>';
  }

  // One session of a player: its own time axis, a marker per minute and kind.
  function sessionStrip(steps, X) {
    const t0 = steps[0].t, t1 = Math.max(steps[steps.length - 1].t, t0 + 5 * 60000);
    const W = 640, H = 34, B = 14, x = t => 8 + (t - t0) / (t1 - t0) * (W - 16);
    const byT = new Map();
    steps.forEach(s => (byT.get(s.t) || byT.set(s.t, []).get(s.t)).push(s));
    let s = `<svg class="strip" viewBox="0 0 ${W} ${H + B}" role="img" aria-label="Шаги за сессию">`;
    s += `<line x1="8" x2="${W - 8}" y1="${H / 2}" y2="${H / 2}" stroke="var(--line)" stroke-width="4" stroke-linecap="round"/>`;
    const order = ['session', 'play', 'ads', 'money', 'bad'];
    byT.forEach((list, t) => {
      const kinds = order.filter(k => list.some(st => kindOf(st.ev) === k));
      // several kinds in one minute: stacked up and down a little so none hides another
      kinds.forEach((k, i) => s += mark(k, x(t).toFixed(1), H / 2 + (i - (kinds.length - 1) / 2) * 9, .9));
      const tip = hm(t) + ':\n' + list.map(st => stepText(X, st) + (st.n > 1 ? ' ×' + st.n : '')).join('\n');
      s += `<rect x="${(x(t) - 5).toFixed(1)}" y="0" width="10" height="${H}" fill="transparent"><title>${esc(tip)}</title></rect>`;
    });
    const ticks = t1 - t0 >= 20 * 60000 ? [t0, (t0 + t1) / 2, t1] : [t0, t1];
    ticks.forEach((t, i) => s += `<text x="${x(t)}" y="${H + B - 2}" text-anchor="${i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'middle'}">${hm(Math.round(t / 60000) * 60000)}</text>`);
    return s + '</svg>';
  }

  // Sessions: a gap of 30+ minutes, or a session_start after something else, starts a new one.
  function sessionsOf(steps) {
    const out = [];
    steps.forEach(s => {
      const cur = out[out.length - 1], prev = cur && cur[cur.length - 1];
      if (!cur || s.t - prev.t > 30 * 60000 || (s.ev === 'session_start' && cur.some(x => x.ev !== 'session_start' && kindOf(x.ev) !== 'session') && s.t - prev.t > 5 * 60000)) out.push([s]);
      else cur.push(s);
    });
    return out;
  }

  function stepList(steps, X, cap = 150) {
    const rows = [];
    steps.forEach(s => {
      const text = stepText(X, s), last = rows[rows.length - 1];
      if (last && last.text === text) { last.n += s.n; last.t1 = s.t; } else rows.push({text, n: s.n, kind: kindOf(s.ev), t0: s.t, t1: s.t, ev: s.ev});
    });
    const row = r => `<div class="jrow k-${r.kind}"><span class="tm">${hm(r.t0)}${r.t1 !== r.t0 ? '–' + hm(r.t1) : ''}</span>${icon(r.kind)}` +
      `<span class="tx" title="${esc(r.ev)}">${esc(r.text)}</span><span class="cnt">${r.n > 1 ? '×' + fmt(r.n) : ''}</span></div>`;
    let s = '<div class="jlist">' + rows.slice(0, cap).map(row).join('');
    if (rows.length > cap) s += `<details class="more"><summary>ещё ${rows.length - cap} шагов</summary>${rows.slice(cap).map(row).join('')}</details>`;
    return s + '</div>';
  }

  function journeyView(steps, X, multiDay) {
    if (!steps.length) return '<div class="empty">Своих событий игры нет — только служебные GA4 (экран, вовлечённость).</div>';
    const ss = sessionsOf(steps);
    return ss.map((list, i) => {
      const t0 = list[0].t, t1 = list[list.length - 1].t, k = {play: 0, ads: 0, money: 0};
      list.forEach(s => { const kk = kindOf(s.ev); if (kk in k) k[kk] += s.n; });
      const sum = [k.play && `игра ${fmt(k.play)}`, k.ads && `реклама ${fmt(k.ads)}`, k.money && `покупки ${fmt(k.money)}`].filter(Boolean).join(' · ');
      // newest first; with many sessions only the two latest start open
      const open = ss.length <= 3 || i >= ss.length - 2 ? ' open' : '';
      return `<details class="jsess"${open}><summary><h4>${ss.length > 1 ? 'Сессия ' + (i + 1) + ' · ' : ''}${multiDay ? dm(t0) + ' ' : ''}${hm(t0)}–${hm(t1)} <span class="note">${span(mins(t1 - t0) || 1)}${sum ? ' · ' + sum : ''}</span></h4></summary>` +
        sessionStrip(list, X) + stepList(list, X) + '</details>';
    }).reverse().join('');
  }

  // ------------------------------------------------------------ last 30 minutes

  let liveWant = '', liveOpen = new Set(), liveData = null;

  async function live(ids) {
    const want = ids.join(',');
    liveWant = want;
    try {
      const d = await GA4.livePlayers(ids);
      if (liveWant !== want) return;
      liveData = {d, ids};
      renderLive();
    } catch (e) { fail(e); }
  }

  function renderLive() {
    if (!liveData) return;
    const {d, ids} = liveData, many = ids.length > 1, errs = [];
    let list = [];
    ids.forEach(id => {
      const g = d[id];
      if (!g) return;
      if (g.error || (g.lp_steps && g.lp_steps.error)) return errs.push(gameName(id) + ': ' + (g.error || g.lp_steps.error));
      list = list.concat(livePlayers(id, g));
    });
    list.sort((a, b) => (b.last || 0) - (a.last || 0));
    const el = $('livePlayers');
    const tz = ids.map(id => d[id] && d[id].tz).find(Boolean);
    $('livePlayersTitle').textContent = list.length ? `Кто играет · ${list.length} ${plural(list.length, 'игрок', 'игрока', 'игроков')}` : 'Кто играет';
    let s = errs.map(e => `<div class="err">${esc(e)}</div>`).join('');
    if (!list.length) { el.innerHTML = s + '<div class="empty">За последние 30 минут никто не играл.</div>'; return; }
    const now = Math.max(...list.map(p => p.now)), t0 = now - 30 * 60000;
    s += '<div class="tbl"><table class="players"><thead><tr>' + (many ? '<th>Игра</th>' : '') +
      `<th>Игрок</th><th>Телефон</th><th class="axis">${axis([[0, '−30 мин'], [1 / 3, '−20'], [2 / 3, '−10'], [1, 'сейчас']])}</th><th class="n">Был</th></tr></thead><tbody>`;
    list.forEach(p => {
      const X = ctx(p.prop), open = liveOpen.has(p.k), cols = many ? 5 : 4;
      const ago = p.last != null ? mins(p.now - p.last) : null;
      s += `<tr class="pl${open ? ' open' : ''}" data-k="${esc(p.k)}" tabindex="0" aria-expanded="${open}">` +
        (many ? `<td class="game">${swatch(p.prop)}${esc(gameName(p.prop))}</td>` : '') +
        whoCell(p) + phoneCell(p) + `<td class="tl">${strip(p.steps, t0, now + 60000)}</td>` +
        `<td class="n">${ago == null ? '–' : ago ? ago + ' мин' : 'сейчас'}</td></tr>`;
      if (open) s += `<tr class="detail"><td colspan="${cols}">${p.steps.length ? stepList(p.steps, X) : '<div class="empty">Только служебные события GA4.</div>'}</td></tr>`;
    });
    s += '</tbody></table></div>';
    s += `<p class="foot">Время ${esc(tzLabel(tz))}. Наведи на отметку — что игрок сделал; нажми на строку — все шаги. Realtime не знает модель телефона: она взята из прошлых дней по городу.</p>`;
    el.innerHTML = s;
    bindRows(el, liveOpen, renderLive);
  }

  function bindRows(el, openSet, rerender, onOpen) {
    el.querySelectorAll('tr.pl').forEach(tr => {
      const toggle = () => {
        const k = tr.dataset.k;
        if (openSet.has(k)) openSet.delete(k); else { openSet.add(k); if (onOpen) onOpen(k); }
        rerender();
      };
      tr.onclick = toggle;
      tr.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } };
    });
  }

  const gameName = id => ((typeof props !== 'undefined' && props.find(p => p.id === id)) || {name: id}).name;

  // ------------------------------------------------------------ period

  const PV = {prop: null, period: null, d: null, list: [], X: null, shown: 40, q: '', sort: 'last', open: new Set(), details: new Map()};

  async function periodLoad(prop, per) {
    const want = prop + '|' + per;
    PV.want = want;
    $('playersPanel').classList.add('loading');
    try {
      const d = await GA4.players(prop, per);
      if (PV.want !== want) return;
      if (PV.prop !== prop || PV.period !== per) { PV.open.clear(); PV.details.clear(); PV.shown = 40; }
      PV.prop = prop; PV.period = per; PV.d = d; PV.X = ctx(prop);
      PV.list = d.pl_steps && d.pl_steps.error ? [] : periodPlayers(d, PV.X);
      renderPeriod();
      PV.open.forEach(k => loadDetail(k));
    } catch (e) { fail(e); }
    finally { if (PV.want === want) $('playersPanel').classList.remove('loading'); }
  }

  const SORTS = {
    last: {t: 'Последние', f: (a, b) => (b.last || 0) - (a.last || 0)},
    time: {t: 'Дольше всех в игре', f: (a, b) => b.eng / Math.max(1, b.users) - a.eng / Math.max(1, a.users)},
    runs: {t: 'Больше всего игр', f: (a, b) => b.starts - a.starts},
    ads: {t: 'Больше рекламы', f: (a, b) => b.cnt.ads - a.cnt.ads},
    money: {t: 'Ближе к покупке', f: (a, b) => b.bought - a.bought || b.cnt.money - a.cnt.money},
    fresh: {t: 'Новые сначала', f: (a, b) => (b.fresh > 0) - (a.fresh > 0) || (b.last || 0) - (a.last || 0)},
  };

  const searchText = p => [p.countryId, countryName(p.countryId), p.city, p.brand, p.name, p.deviceModel, ...p.versions, p.store].join(' ').toLowerCase();

  function funnel(list, X) {
    const g = X.game || {}, n = list.length;
    const steps = [
      ['Зашли в игру', n, 'session'],
      [g.start ? 'Начали ' + (X.J.mode && X.J.mode.labels === 'lift' ? 'забег' : 'уровень') : null, list.filter(p => p.starts).length, 'play'],
      [g.win ? (g.outcome ? 'Хоть раз дошли до конца' : 'Хоть раз победили') : null, list.filter(p => p.wins).length, 'play'],
      ['Видели рекламу', list.filter(p => p.cnt.ads).length, 'ads'],
      ['Смотрели покупки', list.filter(p => p.cnt.money).length, 'money'],
      ['Купили', list.filter(p => p.bought).length, 'money'],
      ['Удалили игру', list.filter(p => p.cnt.bad).length, 'bad'],
    ].filter(s => s[0] && (s[1] || s[2] !== 'bad'));
    return '<div class="hbars funnel">' + steps.map(([t, v, k]) =>
      `<div class="hrow" title="${esc(t)}: ${v} из ${n}"><span class="lab">${icon(k)}${esc(t)}</span>` +
      `<span class="track"><span class="fill" style="width:${n ? v / n * 100 : 0}%;background:${KINDS[k].c}"></span></span>` +
      `<span class="pct">${n ? Math.round(v / n * 100) : 0}%</span><span class="cnt">${fmt(v)} из ${fmt(n)}</span></div>`).join('') + '</div>';
  }

  function evTip(p, kind) {
    return [...p.byEv.entries()].filter(([ev]) => kindOf(ev) === kind).sort((a, b) => b[1] - a[1]).map(([ev, n]) => `${evName(ev)}: ${n}`).join('\n');
  }

  function renderPeriod() {
    const el = $('players'), X = PV.X, d = PV.d, P = PERIODS[PV.period] || PERIODS.today;
    $('playersTitle').textContent = 'Игроки ' + P.where;
    if (d.pl_steps && d.pl_steps.error) { el.innerHTML = `<div class="err">${esc(d.pl_steps.error)}</div>`; $('playersFunnel').innerHTML = ''; return; }
    const all = PV.list;
    $('playersFunnel').innerHTML = all.length ? funnel(all, X) : '';
    const q = PV.q.trim().toLowerCase();
    const list = (q ? all.filter(p => searchText(p).includes(q)) : all.slice()).sort(SORTS[PV.sort].f);
    const multiDay = PV.period === 'week' || PV.period === 'month';
    let s = `<div class="ctrl"><input type="search" id="plSearch" placeholder="Страна, город, телефон, версия…" value="${esc(PV.q)}" aria-label="Найти игрока">` +
      `<select id="plSort" aria-label="Сортировка">${Object.entries(SORTS).map(([k, v]) => `<option value="${k}"${k === PV.sort ? ' selected' : ''}>${v.t}</option>`).join('')}</select>` +
      `<span class="note">${q ? `найдено ${fmt(list.length)} из ${fmt(all.length)}` : `${fmt(all.length)} ${plural(all.length, 'игрок', 'игрока', 'игроков')}`}</span></div>`;
    if (!list.length) { el.innerHTML = s + `<div class="empty">${all.length ? 'Никого не нашлось.' : 'За период никого.'}</div>`; bindCtrl(); return; }
    const days = d.period_days || [], now = wallNow(d.tz, d._at || Date.now()), grain = PV.period === 'month' ? 36e5 : 6e4;
    let t0 = wall(days[0] + '0000'), t1 = wall(days[days.length - 1] + '0000') + 864e5, ticks;
    if (multiDay) ticks = days.map((day, i) => [i / days.length, day.slice(6) + '.' + day.slice(4, 6)]).filter((x, i) => i % (days.length > 10 ? 5 : 1) === 0);
    else {
      // one day: the axis spans only the hours someone played, so short sessions don't shrink to dots
      const fs = all.filter(p => p.first != null), H = 36e5;
      if (fs.length) {
        const a = Math.floor(Math.min(...fs.map(p => p.first)) / H) * H, b = Math.ceil((Math.max(...fs.map(p => p.last)) + 60000) / H) * H;
        t0 = Math.max(t0, Math.min(a, b - 3 * H)); t1 = Math.min(t1, Math.max(b, t0 + 3 * H));
      }
      const hours = (t1 - t0) / H, step = hours <= 8 ? 1 : hours <= 16 ? 2 : 3;
      ticks = [];
      for (let h = 0; h <= hours; h += step) ticks.push([h / hours, hm(t0 + h * H)]);
    }
    const midnights = multiDay ? days.slice(1).map(day => wall(day + '0000')) : [];
    s += '<div class="tbl"><table class="players"><thead><tr><th>Игрок</th><th>Телефон</th>' +
      `<th class="axis">${axis(ticks)}</th><th class="n" title="время в игре">Время</th>` +
      `<th class="n" title="${X.game && X.game.start ? 'начато уровней / забегов' : 'игровых действий'}">Игр</th><th class="n">Реклама</th><th class="n">Покупки</th></tr></thead><tbody>`;
    list.slice(0, PV.shown).forEach(p => {
      const open = PV.open.has(p.k), t = p.users ? p.eng / p.users : 0;
      const games = X.game && X.game.start ? p.starts : p.cnt.play;
      const res = p.wins || p.loses ? `✓ ${p.wins} · ✗ ${p.loses}` : '';
      s += `<tr class="pl${open ? ' open' : ''}" data-k="${esc(p.k)}" tabindex="0" aria-expanded="${open}">` +
        whoCell(p) + phoneCell(p) +
        `<td class="tl">${strip(p.steps, t0, t1, {now, days: midnights, multiDay, grain})}</td>` +
        `<td class="n">${t ? dur(t) : '–'}</td>` +
        `<td class="n" title="${esc(res)}">${games ? fmt(games) : '–'}</td>` +
        `<td class="n" title="${esc(evTip(p, 'ads'))}">${p.cnt.ads ? fmt(p.cnt.ads) : '–'}</td>` +
        `<td class="n" title="${esc(evTip(p, 'money'))}">${p.bought ? `<b class="ok">${fmt(p.bought)}</b>` : p.cnt.money ? fmt(p.cnt.money) : '–'}</td></tr>`;
      if (open) s += `<tr class="detail"><td colspan="7" id="det-${cssId(p.k)}">${detailHtml(p)}</td></tr>`;
    });
    s += '</tbody></table></div>';
    if (list.length > PV.shown) s += `<button class="ghost morebtn" id="plMore" type="button">Показать ещё ${Math.min(40, list.length - PV.shown)} из ${fmt(list.length - PV.shown)}</button>`;
    s += `<p class="foot">Время ${esc(tzLabel(d.tz))}. Наведи на отметку — что игрок сделал; нажми на строку — сессии и все шаги. ` +
      'Покупки: зелёным — купил, иначе сколько раз открывал покупки. Обычные отчёты GA4 отстают на 1–3 часа.</p>';
    el.innerHTML = s;
    bindCtrl();
    bindRows(el, PV.open, renderPeriod, loadDetail);
    const more = $('plMore');
    if (more) more.onclick = () => { PV.shown += 40; renderPeriod(); };
  }

  const cssId = k => k.replace(/[^a-zA-Z0-9]/g, c => '_' + c.charCodeAt(0).toString(16));

  function bindCtrl() {
    const q = $('plSearch'), so = $('plSort');
    if (q) q.oninput = () => {
      PV.q = q.value; PV.shown = 40;
      const pos = q.selectionStart;
      renderPeriod();
      const q2 = $('plSearch'); q2.focus(); try { q2.setSelectionRange(pos, pos); } catch {}
    };
    if (so) so.onchange = () => { PV.sort = so.value; PV.shown = 40; renderPeriod(); };
  }

  function detailHtml(p) {
    const det = PV.details.get(p.k), multiDay = PV.period !== 'today' && PV.period !== 'yesterday';
    if (det && det.steps) return journeyView(det.steps, PV.X, multiDay);
    const head = det && det.error ? `<div class="err">${esc(det.error)}</div>` : '<p class="note">Загружаю все шаги с подробностями…</p>';
    return head + journeyView(p.steps, PV.X, multiDay);
  }

  async function loadDetail(k) {
    const p = PV.list.find(x => x.k === k);
    if (!p) return;
    const prop = PV.prop, per = PV.period;
    try {
      const d = await GA4.playerDetail(prop, per, p);
      if (PV.prop !== prop || PV.period !== per) return;
      if (d.pd_steps.error) PV.details.set(k, {error: d.pd_steps.error});
      else {
        // params come one report each: minute + event -> value -> times
        const vals = new Map();
        Object.keys(d).filter(n => /^pd_p\d+$/.test(n)).forEach(n => {
          const rep = d[n], dim = ((rep.dims || []).find(x => x.startsWith('customEvent:')) || '').slice(12);
          if (!dim) return;
          R(rep).forEach(r => {
            const v = r['customEvent:' + dim];
            if (isUnset(v)) return;
            const id = r.dateHourMinute + '|' + r.eventName, m = vals.get(id) || vals.set(id, {}).get(id);
            (m[dim] ||= new Map()).set(v, num(r.eventCount));
          });
        });
        const one = newPlayer(PV.X, k, p), order = GA4.journeyCfg(PV.X.game).detail;
        R(d.pd_steps).forEach(r => {
          if (isUnset(r.eventName)) return;
          const m = vals.get(r.dateHourMinute + '|' + r.eventName) || {}, params = {};
          // two values in one minute (two anomalies...) are shown together: "Стук ×2, Лампа"
          order.forEach(dim => {
            const vm = m[dim];
            if (!vm) return;
            params[dim] = vm.size === 1 ? [...vm.keys()][0] : [...vm.entries()];
          });
          one.steps.push({t: wall(r.dateHourMinute), ev: r.eventName, n: num(r.eventCount), p: params});
        });
        PV.details.set(k, {steps: finish(one, PV.X).steps});
      }
      const cell = document.getElementById('det-' + cssId(k));
      if (cell) cell.innerHTML = detailHtml(p);
    } catch (e) { fail(e); }
  }

  window.Journey = {live, period: periodLoad, legend};
})();
