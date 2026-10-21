// Game Pulse settings. Nothing here is secret: the OAuth client ID is public
// by design - access to the numbers comes from the viewer's own Google
// account, which must have read access to the GA4 properties.
window.GAME_PULSE = {
  // Google Cloud console > APIs & Services > Credentials > OAuth client ID
  // (Web application). Authorized JavaScript origins must list the
  // GitHub Pages origin, e.g. https://<login>.github.io
  clientId: '380825317265-tiffv9an6h027f8mionv4c1hsh0kuusn.apps.googleusercontent.com',

  // Developer's own devices.
  excludeCountries: ['Ukraine'],
  // Google Play pre-launch robots and emulators (not filterable in the
  // realtime block - GA4 has no deviceModel there).
  excludeDeviceRegex: 'OnePlus8Pro|sdk_gphone.*',

  keyEvents: [
    'first_open', 'app_remove', 'level_start', 'level_up', 'level_failed',
    'level_win', 'level_lose', 'level_complete', 'level_fail', 'level_quit', 'level_end', 'post_score',
    'tutorial_complete', 'begin_checkout', 'purchase', 'in_app_purchase', 'purchase_failed',
  ],

  // Per game (GA4 property id): which events and custom dimensions make up the
  // level funnel. Every name here must be registered in GA4 > Custom definitions
  // (event params are only reported from the day they were registered).
  //   level    - event param with the level number or name
  //   start / win / lose - event names; outcome: a param that tells win (1) from lose (0)
  //              when one event carries both
  //   cols     - more events counted per level
  //   avgs     - per-level average of a custom metric on one event (fmt 'dur' = seconds)
  //   breakdowns - small tables: one event split by one param
  //   ordered  - levels are numbers played in order (enables "reached" and drop-off)
  games: {
    '558926253': { // cat-sort
      level: 'level', start: 'level_start', win: 'level_win', lose: 'level_lose', ordered: true,
      cols: [{event: 'booster', t: 'Бустеры'}],
      avgs: [{event: 'level_win', metric: 'sec', t: 'Время победы', fmt: 'dur'}, {event: 'level_win', metric: 'moves', t: 'Ходов'}],
      breakdowns: [
        {event: 'booster', dim: 'k', t: 'Какие бустеры берут', col: 'Бустер'},
        {event: 'level_win', dim: 'stars', t: 'Звёзды за победу', col: 'Звёзд'},
        {event: 'level_start', dim: 'mode', t: 'Режимы', col: 'Режим'},
        {event: 'house_buy', dim: 'item', t: 'Котодом: покупки', col: 'Предмет'},
        {event: 'iap_click', dim: 'id', t: 'Нажатия на покупки', col: 'Товар'},
      ],
    },
    '549814421': { // booma-balls
      level: 'level_num', start: 'level_start', win: 'level_up', lose: 'level_failed', ordered: true,
      avgs: [{event: 'level_up', metric: 'score', t: 'Очки за победу'}],
      breakdowns: [
        {event: 'level_up', dim: 'stars', t: 'Звёзды за победу', col: 'Звёзд'},
        {event: 'level_start', dim: 'attempt', t: 'Номер попытки при старте', col: 'Попытка'},
        {event: 'begin_checkout', dim: 'product_id', t: 'Нажатия на покупки', col: 'Товар'},
      ],
    },
    '549388633': { // candy-girl
      level: 'level', start: 'level_start', win: 'level_complete', lose: 'level_fail', ordered: true,
      cols: [{event: 'level_quit', t: 'Вышли'}, {event: 'item_used', t: 'Предметы'}],
      avgs: [{event: 'level_complete', metric: 'seconds', t: 'Время победы', fmt: 'dur'},
             {event: 'level_fail', metric: 'progress_pct', t: 'Собрано при проигрыше, %'}],
      breakdowns: [
        {event: 'game_over_choice', dim: 'choice', t: 'Выбор после проигрыша', col: 'Выбор'},
        {event: 'level_complete', dim: 'stars', t: 'Звёзды за победу', col: 'Звёзд'},
        {event: 'upgrade_bought', dim: 'upgrade', t: 'Улучшения', col: 'Улучшение'},
        {event: 'item_bought', dim: 'item', t: 'Покупки предметов', col: 'Предмет'},
        {event: 'mission_complete', dim: 'mission', t: 'Выполненные задания', col: 'Задание'},
      ],
    },
    '558513820': { // pigeon
      level: 'level_name', start: 'level_start', win: 'post_score', winLabel: 'Доиграли',
      avgs: [{event: 'post_score', metric: 'score', t: 'Средний счёт'}],
      breakdowns: [{event: 'unlock_achievement', dim: 'achievement_id', t: 'Достижения', col: 'Достижение'}],
    },
    '559461409': { // lift-13
      level: 'level_name', start: 'level_start', win: 'level_end', lose: 'level_end', outcome: 'success',
      cols: [{event: 'anomaly_found', t: 'Нашли аномалий'}, {event: 'anomaly_missed', t: 'Пропустили'}, {event: 'false_alarm', t: 'Ложные тревоги'}],
      avgs: [{event: 'level_end', metric: 'time', t: 'Время забега', fmt: 'dur'}],
      breakdowns: [
        {event: 'anomaly_missed', dim: 'anomaly', t: 'Какие аномалии пропускают', col: 'Аномалия'},
        {event: 'anomaly_found', dim: 'anomaly', t: 'Какие аномалии находят', col: 'Аномалия'},
        {event: 'false_alarm', dim: 'floor', t: 'Ложные тревоги по этажам', col: 'Этаж'},
        {event: 'gift_take', dim: 'gift', t: 'Подарки', col: 'Подарок'},
      ],
    },
  },
  // When the level params were registered: older events have no level.
  levelsSince: '21.10.2026',

  realtimeCacheSec: 55,
  reportsCacheSec: 300,
};
