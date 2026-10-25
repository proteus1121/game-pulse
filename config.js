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

  // Tab names and the order of games (GA4 property id -> name). Properties
  // not listed here go after them under their GA4 name. A game keeps its
  // colour on every chart.
  // (A list, not an object: JS would sort numeric keys on its own.)
  titles: [
    ['559461409', 'Lift 13'],
    ['558926253', 'Cat Sort'],
    ['549814421', 'Booma Balls'],
    ['549388633', 'Candy Girl'],
    ['558513820', 'Neon Pigeon'],
    ['549835753', 'Zombie'],
  ],

  // Counted per game on the "all games" tab.
  overviewEvents: ['first_open', 'app_remove', 'level_start', 'purchase', 'in_app_purchase', 'remove_ads_bought'],

  // GA4's automatic events: left out of the per-game events table.
  hiddenEvents: ['screen_view', 'user_engagement', 'session_start', 'app_clear_data', 'app_update',
    'os_update', 'app_exception', 'firebase_campaign', 'notification_receive', 'notification_dismiss',
    '(not set)', ''],

  // What each event means, shown next to its name. Unknown events show the bare name.
  events: {
    first_open: 'Установил и открыл игру',
    app_remove: 'Удалил игру',
    app_open: 'Открыл игру',
    level_start: 'Начал уровень',
    level_up: 'Прошёл уровень',
    level_win: 'Прошёл уровень',
    level_complete: 'Прошёл уровень',
    level_failed: 'Проиграл уровень',
    level_fail: 'Проиграл уровень',
    level_lose: 'Проиграл уровень',
    level_quit: 'Вышел из уровня',
    level_end: 'Закончил забег (победа или поражение)',
    level_select: 'Выбрал уровень в меню',
    post_score: 'Доиграл трек до конца',
    tutorial: 'Прошёл обучение',
    tutorial_begin: 'Начал обучение',
    tutorial_complete: 'Закончил обучение',
    first_shot: 'Первый выстрел',
    first_hit: 'Первое попадание',
    session_end: 'Закрыл игру (длина сессии)',
    begin_checkout: 'Нажал «купить»',
    purchase: 'Купил',
    in_app_purchase: 'Купил',
    purchase_failed: 'Покупка не прошла',
    ad_shown: 'Увидел рекламу',
    ad_skipped: 'Реклама не показалась (причина в разбивке)',
    update_prompt: 'Показали экран «вышла новая версия»',
    iap_click: 'Нажал на товар',
    iap_grant: 'Получил купленное',
    remove_ads_tap: 'Нажал «убрать рекламу»',
    remove_ads_click: 'Нажал «убрать рекламу»',
    remove_ads_result: 'Ответ Google Play на покупку',
    remove_ads_bought: 'Купил отключение рекламы',
    ad_reward: 'Досмотрел рекламу за награду',
    ad_offer: 'Увидел предложение рекламы',
    ad_interstitial: 'Показана межуровневая реклама',
    gift_ad: 'Взял подарок за рекламу',
    gift_take: 'Взял подарок',
    review_ask: 'Попросили оценить игру',
    run_continue: 'Продолжил забег после ошибки',
    run_quit: 'Бросил забег',
    anomaly_found: 'Нашёл аномалию',
    anomaly_missed: 'Пропустил аномалию',
    false_alarm: 'Ложная тревога',
    booster: 'Использовал бустер',
    boost_used: 'Использовал бустер',
    food_fill: 'Насыпал корм котам',
    house_build: 'Построил комнату',
    house_buy: 'Купил предмет в дом',
    house_upgrade: 'Улучшил комнату',
    house_collect: 'Собрал рыбу из дома',
    perk_pick: 'Выбрал перк',
    perk_reset: 'Сбросил перки',
    chest_open: 'Открыл сундук',
    game_over_choice: 'Выбор после проигрыша',
    upgrade_bought: 'Купил улучшение',
    item_bought: 'Купил предмет',
    item_used: 'Использовал предмет',
    mission_complete: 'Выполнил задание',
    daily_complete: 'Прошёл ежедневный уровень',
    reminder_open: 'Открыл игру из напоминания',
    unlock_achievement: 'Получил достижение',
  },

  // Per game (GA4 property id): which events and custom dimensions make up the
  // level funnel. Every name here must be registered in GA4 > Custom definitions
  // (event params are only reported from the day they were registered).
  //   level    - event param with the level number or name
  //   start / win / lose - event names; outcome: a param that tells win (1) from lose (0)
  //              when one event carries both
  //   cols     - more events counted per level
  //   avgs     - per-level average of a custom metric on one event (fmt 'dur' = seconds, 'ms' = milliseconds)
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
        {event: 'house_build', dim: 'room', t: 'Котодом: построенные комнаты', col: 'Комната'},
        {event: 'house_upgrade', dim: 'room', t: 'Котодом: улучшения комнат', col: 'Комната'},
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
        {event: 'perk_pick', dim: 'perk_id', t: 'Какие перки выбирают', col: 'Перк'},
        {event: 'chest_open', dim: 'chapter', t: 'Сундуки по главам', col: 'Глава'},
        {event: 'ad_shown', dim: 'ad_format', t: 'Показы рекламы', col: 'Формат'},
        {event: 'ad_skipped', dim: 'reason', t: 'Почему реклама не показалась', col: 'Причина'},
      ],
    },
    '549388633': { // candy-girl
      level: 'level', start: 'level_start', win: 'level_complete', lose: 'level_fail', ordered: true,
      cols: [{event: 'level_quit', t: 'Вышли'}, {event: 'item_used', t: 'Предметы'}, {event: 'boost_used', t: 'Бустеры'}],
      avgs: [{event: 'level_complete', metric: 'seconds', t: 'Время победы', fmt: 'dur'},
             {event: 'level_fail', metric: 'progress_pct', t: 'Собрано при проигрыше, %'}],
      breakdowns: [
        {event: 'game_over_choice', dim: 'choice', t: 'Выбор после проигрыша', col: 'Выбор'},
        {event: 'level_complete', dim: 'stars', t: 'Звёзды за победу', col: 'Звёзд'},
        {event: 'upgrade_bought', dim: 'upgrade', t: 'Улучшения', col: 'Улучшение'},
        {event: 'item_bought', dim: 'item', t: 'Покупки предметов', col: 'Предмет'},
        {event: 'mission_complete', dim: 'mission', t: 'Выполненные задания', col: 'Задание'},
        {event: 'level_select', dim: 'replay', t: 'Выбор уровня: переигровка?', col: 'Переигровка'},
      ],
    },
    '558513820': { // pigeon
      level: 'level_name', start: 'level_start', win: 'post_score', winLabel: 'Доиграли', lose: 'level_fail',
      avgs: [{event: 'post_score', metric: 'score', t: 'Средний счёт'}],
      breakdowns: [{event: 'unlock_achievement', dim: 'achievement_id', t: 'Достижения', col: 'Достижение'}],
    },
    '559461409': { // lift-13
      level: 'level_name', start: 'level_start', win: 'level_end', lose: 'level_end', outcome: 'success',
      cols: [{event: 'anomaly_found', t: 'Нашли аномалий'}, {event: 'anomaly_missed', t: 'Пропустили'}, {event: 'false_alarm', t: 'Ложные тревоги'},
             {event: 'run_continue', t: 'Продолжили'}, {event: 'run_quit', t: 'Бросили'}],
      avgs: [{event: 'level_end', metric: 'time', t: 'Время забега', fmt: 'dur'},
             {event: 'anomaly_found', metric: 'ms', t: 'Реакция на аномалию', fmt: 'ms'}],
      breakdowns: [
        {event: 'anomaly_missed', dim: 'anomaly', t: 'Какие аномалии пропускают', col: 'Аномалия'},
        {event: 'anomaly_found', dim: 'anomaly', t: 'Какие аномалии находят', col: 'Аномалия'},
        {event: 'false_alarm', dim: 'floor', t: 'Ложные тревоги по этажам', col: 'Этаж'},
        {event: 'gift_take', dim: 'gift', t: 'Подарки', col: 'Подарок'},
        {event: 'level_end', dim: 'floor', t: 'На каком этаже проигрывают', col: 'Этаж'},
        {event: 'run_quit', dim: 'floor', t: 'На каком этаже бросают забег', col: 'Этаж'},
        {event: 'remove_ads_tap', dim: 'from', t: 'Откуда жмут «убрать рекламу»', col: 'Откуда'},
        {event: 'remove_ads_result', dim: 'code', t: 'Покупка «без рекламы»: ответ Play', col: 'Код'},
        {event: 'ad_interstitial', dim: 'from', t: 'Межуровневая реклама: где', col: 'Где'},
      ],
    },
  },
  // When the level params were registered: older events have no level.
  levelsSince: '21.10.2026',

  realtimeCacheSec: 55,
  reportsCacheSec: 300,
};
