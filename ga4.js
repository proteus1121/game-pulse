// GA4 access straight from the browser: Google Identity Services token for
// analytics.readonly, then the Data API (reports + realtime) and the Admin
// API (property list, time zone). Port of the old local server.py.
(function () {
  const CFG = window.GAME_PULSE;
  const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
  const DATA = 'https://analyticsdata.googleapis.com/v1beta/properties/';
  const ADMIN = 'https://analyticsadmin.googleapis.com/v1beta/';
  const TOKEN_KEY = 'gp.token';

  class NeedLogin extends Error {}

  // ------------------------------------------------------------ auth

  let token = null, tokenExp = 0, tokenClient = null, waiting = null;

  try {
    const t = JSON.parse(sessionStorage.getItem(TOKEN_KEY) || 'null');
    if (t && t.exp > Date.now()) { token = t.value; tokenExp = t.exp; }
  } catch { /* storage blocked - sign in again */ }

  function gisReady() {
    return new Promise(resolve => {
      const check = () => window.google?.accounts?.oauth2 ? resolve() : setTimeout(check, 100);
      check();
    });
  }

  async function initAuth() {
    await gisReady();
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CFG.clientId,
      scope: SCOPE,
      callback: resp => {
        if (resp.error) return settle(new NeedLogin(resp.error_description || resp.error));
        token = resp.access_token;
        // Renew a minute early so a request never goes out with a dying token.
        tokenExp = Date.now() + (Number(resp.expires_in) - 60) * 1000;
        try { sessionStorage.setItem(TOKEN_KEY, JSON.stringify({value: token, exp: tokenExp})); } catch {}
        settle(null, token);
      },
      error_callback: err => settle(new NeedLogin(err.type || 'login failed')),
    });
  }

  function settle(err, value) {
    const w = waiting; waiting = null;
    if (w) err ? w.reject(err) : w.resolve(value);
  }

  // Must be called from a click: the browser blocks the Google popup otherwise.
  function signIn() {
    if (!tokenClient) return Promise.reject(new NeedLogin('Google sign-in is still loading'));
    return new Promise((resolve, reject) => {
      waiting = {resolve, reject};
      tokenClient.requestAccessToken({prompt: token ? '' : undefined});
    });
  }

  function signOut() {
    if (token && window.google?.accounts?.oauth2) google.accounts.oauth2.revoke(token, () => {});
    token = null; tokenExp = 0;
    try { sessionStorage.removeItem(TOKEN_KEY); } catch {}
  }

  const signedIn = () => !!token && Date.now() < tokenExp;

  async function call(url, body) {
    if (!signedIn()) throw new NeedLogin('session expired');
    const r = await fetch(url, {
      method: body ? 'POST' : 'GET',
      headers: Object.assign({Authorization: 'Bearer ' + token}, body ? {'Content-Type': 'application/json'} : {}),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (r.status === 401) { signOut(); throw new NeedLogin('session expired'); }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${(j.error && j.error.message) || r.statusText}`);
    return j;
  }

  function rows(resp) {
    const names = (resp.dimensionHeaders || []).map(h => h.name).concat((resp.metricHeaders || []).map(h => h.name));
    return (resp.rows || []).map(r => {
      const vals = (r.dimensionValues || []).map(v => v.value).concat((r.metricValues || []).map(v => v.value));
      return Object.fromEntries(names.map((n, i) => [n, vals[i]]));
    });
  }

  // ------------------------------------------------------------ filters

  const not = (field, value, regex) => ({notExpression: {filter: {fieldName: field,
    stringFilter: regex ? {matchType: 'FULL_REGEXP', value} : {value}}}});

  function withFilter(body, realtime, extra) {
    const exprs = (CFG.excludeCountries || []).map(c => not('country', c));
    // deviceModel isn't a Realtime API dimension.
    if (!realtime && CFG.excludeDeviceRegex) exprs.push(not('deviceModel', CFG.excludeDeviceRegex, true));
    if (extra) exprs.push(extra);
    if (exprs.length === 1) body.dimensionFilter = exprs[0];
    else if (exprs.length) body.dimensionFilter = {andGroup: {expressions: exprs}};
    return body;
  }

  const eventIn = names => ({filter: {fieldName: 'eventName', inListFilter: {values: names}}});
  const dims = names => names.map(name => ({name}));

  // ------------------------------------------------------------ reports

  function realtimeReports() {
    const rt = (d, m, extra = {}) => withFilter(Object.assign({dimensions: dims(d), metrics: dims(m)}, extra), true);
    return {
      rt_total: rt([], ['activeUsers']),
      rt_minutes: rt(['minutesAgo'], ['activeUsers']),
      rt_countries: rt(['country'], ['activeUsers'], {limit: 15}),
      rt_events: rt(['eventName'], ['eventCount'], {limit: 25}),
    };
  }

  // period -> [days back to the start, days back to the end, days on the daily chart].
  // The previous period is the same length right before it.
  const PERIODS = {today: [0, 0, 14], yesterday: [1, 1, 14], week: [6, 0, 14], month: [29, 0, 30]};
  const ago = n => n === 0 ? 'today' : n === 1 ? 'yesterday' : n + 'daysAgo';

  function coreReports(period) {
    const [start, end, chart] = PERIODS[period];
    const len = start - end + 1;
    const cur = {startDate: ago(start), endDate: ago(end), name: 'cur'};
    const prev = {startDate: ago(start + len), endDate: ago(end + len), name: 'prev'};
    const rep = (d, m, ranges, extra, more = {}) =>
      withFilter(Object.assign({dateRanges: ranges, dimensions: dims(d), metrics: dims(m)}, more), false, extra);
    const top = metricName => ({orderBys: [{metric: {metricName}, desc: true}]});
    const reports = {
      // Without a date dimension GA4 de-duplicates users over the whole
      // range, so a week's active users are unique players, not a sum.
      totals: rep([], ['activeUsers', 'newUsers', 'sessions', 'userEngagementDuration', 'totalRevenue'], [cur, prev]),
      events: rep(['eventName'], ['eventCount', 'totalUsers'], [cur, prev], eventIn(CFG.keyEvents)),
      days: rep(['date'], ['activeUsers', 'newUsers'], [{startDate: ago(chart - 1), endDate: 'today'}]),
      countries: rep(['country'], ['activeUsers', 'newUsers'], [cur], null, Object.assign({limit: 15}, top('activeUsers'))),
      versions: rep(['appVersion'], ['activeUsers', 'newUsers'], [cur], null, Object.assign({limit: 10}, top('activeUsers'))),
      fail_reasons: rep(['eventName', 'customEvent:reason'], ['eventCount', 'totalUsers'], [cur],
        eventIn(['purchase_failed', 'level_failed']), Object.assign({limit: 20}, top('eventCount'))),
    };
    if (len === 1) {
      reports.hours = rep(['dateHour'], ['activeUsers', 'newUsers'], [{startDate: prev.startDate, endDate: cur.endDate}]);
    }
    return reports;
  }

  // Used when a property has no such custom dimension (GA4 answers 400
  // "... is not a valid dimension"): same report without that column.
  const FALLBACKS = {fail_reasons: body => Object.assign({}, body, {dimensions: dims(['eventName'])})};

  const cache = new Map();

  async function runGroup(prop, key, reports, method, ttlSec) {
    const ck = prop + '|' + key, hit = cache.get(ck);
    if (hit && Date.now() - hit.at < ttlSec * 1000) return hit.value;
    const url = DATA + prop + ':' + method;
    const entries = await Promise.all(Object.entries(reports).map(async ([name, body]) => {
      try {
        return [name, {rows: rows(await call(url, body))}];
      } catch (e) {
        if (e instanceof NeedLogin) throw e;
        if (FALLBACKS[name] && /is not a valid dimension/.test(e.message)) {
          try { return [name, {rows: rows(await call(url, FALLBACKS[name](body))), reduced: true}]; }
          catch (e2) { if (e2 instanceof NeedLogin) throw e2; return [name, {error: e2.message}]; }
        }
        return [name, {error: e.message}];
      }
    }));
    const value = Object.fromEntries(entries);
    cache.set(ck, {at: Date.now(), value});
    return value;
  }

  async function properties() {
    const hit = cache.get('props');
    if (hit && Date.now() - hit.at < 600e3) return hit.value;
    const resp = await call(ADMIN + 'accountSummaries?pageSize=200');
    const props = [];
    (resp.accountSummaries || []).forEach(acc => (acc.propertySummaries || []).forEach(p =>
      props.push({id: p.property.split('/').pop(), name: p.displayName || '', account: acc.displayName || ''})));
    cache.set('props', {at: Date.now(), value: props});
    return props;
  }

  async function timeZone(prop) {
    const k = 'tz|' + prop;
    if (!cache.has(k)) {
      let tz = '';
      try { tz = (await call(ADMIN + 'properties/' + prop)).timeZone || ''; }
      catch (e) { if (e instanceof NeedLogin) throw e; }
      cache.set(k, {value: tz});
    }
    return cache.get(k).value;
  }

  // Dates as YYYYMMDD in the property's own time zone - GA4's "today" - so a
  // quiet day without rows yet isn't mistaken for yesterday.
  function propertyDays(tz, period) {
    let parts;
    try {
      const f = new Intl.DateTimeFormat('en-CA', {timeZone: tz || undefined, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23'});
      parts = Object.fromEntries(f.formatToParts(new Date()).map(x => [x.type, x.value]));
    } catch {
      const d = new Date();
      parts = {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(), hour: d.getHours()};
    }
    const day = n => new Date(Date.UTC(+parts.year, +parts.month - 1, +parts.day - n)).toISOString().slice(0, 10).replace(/-/g, '');
    const [start, end, chart] = PERIODS[period];
    const len = start - end + 1, range = (a, b) => Array.from({length: a - b + 1}, (_, i) => day(a - i));
    return {
      period, hour: +parts.hour, time_zone: tz || 'local',
      cur_day: day(end), prev_day: day(end + len),
      chart_days: range(chart - 1, 0), period_days: range(start, end),
    };
  }

  async function realtime(prop) {
    return runGroup(prop, 'rt', realtimeReports(), 'runRealtimeReport', CFG.realtimeCacheSec);
  }

  async function reports(prop, period) {
    const [data, tz] = await Promise.all([
      runGroup(prop, 'core:' + period, coreReports(period), 'runReport', CFG.reportsCacheSec),
      timeZone(prop),
    ]);
    return Object.assign({}, data, propertyDays(tz, period));
  }

  window.GA4 = {NeedLogin, initAuth, signIn, signOut, signedIn, properties, realtime, reports,
                clearCache: () => cache.clear(), PERIODS};
})();
