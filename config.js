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
    ['561653748', 'Радионяня'],
    ['558926253', 'Cat Sort'],
    ['549814421', 'Booma Balls'],
    ['549388633', 'Candy Girl'],
    ['558513820', 'Neon Pigeon'],
    ['549835753', 'Zombie'],
  ],

  // Counted per game on the "all games" tab.
  overviewEvents: ['first_open', 'app_remove', 'level_start', 'purchase', 'in_app_purchase', 'remove_ads_bought', 'iap_bought'],

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
    iap_result: 'Ответ Google Play на покупку (не купил)',
    iap_bought: 'Купил (подтвердил Google Play)',
    remove_ads_tap: 'Нажал «убрать рекламу»',
    remove_ads_click: 'Нажал «убрать рекламу»',
    remove_ads_result: 'Ответ Google Play на покупку (не купил)',
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
    kid_report: 'Сообщил, что Соня встала',
    kid_lost: 'Соня ушла из квартиры',
    battery_dead: 'Сел телефон',
    camera_fixed: 'Починил повёрнутую/закрытую камеру',
    camera_reboot: 'Перезагрузил камеру',
    chat_reply: 'Ответил в чате',
    night_quit: 'Бросил ночь из паузы',
    night_continue: 'Продолжил проигранную ночь',
    quality_drop: 'Графика сама понизилась (мало FPS)',
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
    notif_open: 'Открыл игру из напоминания',
    notif_perm: 'Ответ на «напоминать?»',
    daily_streak: 'Серия рейсов дня',
    share: 'Поделился результатом',
    unlock_achievement: 'Получил достижение',
  },

  // Plain-words names for param values; a breakdown picks a set with `labels: '<set>'`.
  valueLabels: {
    // code of iap_result / remove_ads_result: Google Play Billing response name (Store.java > codeName)
    // or the game's own PENDING / NO_DETAILS; unknown numbers come as CODE_<n>
    play: {
      USER_CANCELED: 'Отменил сам',
      PENDING: 'Оплата отложена (ждёт оплаты наличными и т.п.)',
      NO_DETAILS: 'Товар ещё не загрузился из Play',
      SERVICE_UNAVAILABLE: 'Нет связи с Play',
      BILLING_UNAVAILABLE: 'Оплата недоступна на устройстве / в аккаунте',
      ITEM_UNAVAILABLE: 'Товар недоступен',
      DEVELOPER_ERROR: 'Ошибка разработчика (настройка товара)',
      ERROR: 'Ошибка Play',
      ITEM_ALREADY_OWNED: 'Уже куплено',
      ITEM_NOT_OWNED: 'Не куплено',
      SERVICE_DISCONNECTED: 'Сервис Play отключился',
      FEATURE_NOT_SUPPORTED: 'Не поддерживается',
      NETWORK_ERROR: 'Ошибка сети',
      OK: 'OK',
      // Huawei IAP (AppGallery build of Lift 13, src/huawei/.../Store.java > codeName)
      NOT_LOGGED_IN: 'Huawei: не вошёл в Huawei ID',
      LOGIN_CANCELED: 'Huawei: отменил вход в Huawei ID',
      AREA_NOT_SUPPORTED: 'Huawei: оплата недоступна в стране аккаунта',
      COUNTRY_NOT_SUPPORTED: 'Huawei: товар не продаётся в этой стране',
      IAP_NOT_ACTIVATED: 'Huawei: IAP не включён',
      PRODUCT_INVALID: 'Huawei: товар не найден / выключен',
      AGREEMENT_NOT_ACCEPTED: 'Huawei: не принял соглашение',
      HIGH_RISK: 'Huawei: отклонено антифродом',
      BAD_SIGNATURE: 'Huawei: подпись покупки не сошлась',
      RESOLUTION_FAILED: 'Huawei: окно оплаты не открылось',
      NO_RESOLUTION: 'Huawei: нет окна оплаты',
      NO_DATA: 'Huawei: окно оплаты закрылось без ответа',
      FAILED: 'Huawei: ошибка',
      PARAM_ERROR: 'Huawei: ошибка параметров',
      CALLS_FREQUENT: 'Huawei: слишком часто',
    },
    // step of the same events: where the purchase stopped
    playStep: {
      details: 'До окна Play (товар не загружен)',
      launch: 'Окно Play не открылось',
      retry: 'Окно Play не открылось и со 2-й попытки',
      flow: 'В окне Play',
      env: 'Huawei: проверка окружения (IAP недоступен)',
      login: 'Huawei: вход в Huawei ID',
      verify: 'Huawei: проверка подписи',
    },
    // user property store: which build the player installed
    store: {
      play: 'Google Play',
      huawei: 'AppGallery (Huawei)',
      // Play builds before the one after 0.8.0 do not set the property
      '(not set)': 'Google Play (старые версии без метки)',
    },
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
  //   breakdown scope: 'user' - dim is a user property (customUser:), keepUnset - keep the "(not set)" row
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
        {event: 'iap_result', dim: 'code', t: 'Покупки: ответ Play', col: 'Ответ', labels: 'play'},
        {event: 'iap_result', dim: 'step', t: 'Покупки: где сорвалось', col: 'Шаг', labels: 'playStep'},
        {event: 'iap_result', dim: 'id', t: 'Несостоявшиеся покупки по товарам', col: 'Товар'},
        {event: 'iap_bought', dim: 'id', t: 'Купленные товары', col: 'Товар'},
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
    '561653748': { // radionyanya (Baby Monitor)
      level: 'level_name', start: 'level_start', win: 'level_end', lose: 'level_end', outcome: 'success',
      cols: [{event: 'anomaly_found', t: 'Нашли аномалий'}, {event: 'anomaly_missed', t: 'Пропустили'}, {event: 'false_alarm', t: 'Ложные тревоги'},
             {event: 'kid_lost', t: 'Соня ушла'}, {event: 'battery_dead', t: 'Сел телефон'}, {event: 'night_quit', t: 'Бросили'},
             {event: 'night_continue', t: 'Продолжили'}, {event: 'ad_interstitial', t: 'Реклам'}],
      avgs: [{event: 'level_end', metric: 'time', t: 'Длина ночи', fmt: 'dur'},
             {event: 'anomaly_found', metric: 'ms', t: 'Реакция на аномалию', fmt: 'ms'}],
      breakdowns: [
        {event: 'level_end', dim: 'reason', t: 'Чем кончаются ночи', col: 'Причина'},
        {event: 'level_end', dim: 'hour', t: 'В котором часу проигрывают', col: 'Час'},
        {event: 'anomaly_missed', dim: 'anomaly', t: 'Какие аномалии пропускают', col: 'Аномалия'},
        {event: 'anomaly_found', dim: 'anomaly', t: 'Какие аномалии находят', col: 'Аномалия'},
        {event: 'false_alarm', dim: 'answer', t: 'Ложные тревоги: что отвечали', col: 'Ответ'},
        {event: 'chat_reply', dim: 'fx', t: 'Ответы в чате', col: 'Эффект'},
        {event: 'camera_fixed', dim: 'fault', t: 'Починенные камеры', col: 'Поломка'},
        {event: 'level_start', dim: 'monster', t: 'Монстры', col: 'Монстр'},
        {event: 'night_quit', dim: 'hour', t: 'В котором часу бросают', col: 'Час'},
        {event: 'remove_ads_tap', dim: 'from', t: 'Откуда жмут «убрать рекламу»', col: 'Откуда'},
        {event: 'remove_ads_result', dim: 'code', t: 'Покупка «без рекламы»: ответ Play', col: 'Ответ', labels: 'play'},
        {event: 'remove_ads_result', dim: 'step', t: 'Покупка «без рекламы»: где сорвалось', col: 'Шаг', labels: 'playStep'},
        {event: 'ad_interstitial', dim: 'from', t: 'Межуровневая реклама: где', col: 'Где'},
        {event: 'night_continue', dim: 'reason', t: 'Продолжения: после чего', col: 'Причина'},
      ],
    },
    '559461409': { // lift-13
      level: 'level_name', start: 'level_start', win: 'level_end', lose: 'level_end', outcome: 'success',
      cols: [{event: 'anomaly_found', t: 'Нашли аномалий'}, {event: 'anomaly_missed', t: 'Пропустили'}, {event: 'false_alarm', t: 'Ложные тревоги'},
             {event: 'run_continue', t: 'Продолжили'}, {event: 'run_quit', t: 'Бросили'},
             // together (mp.js, 2026-11-05): searches, matches started / finished
             {event: 'mp_search', t: 'Вместе: поиск'}, {event: 'mp_start', t: 'Вместе: матчи'}, {event: 'mp_end', t: 'Вместе: доиграли'}],
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
        {event: 'remove_ads_result', dim: 'code', t: 'Покупка «без рекламы»: ответ Play / Huawei', col: 'Ответ', labels: 'play'},
        {event: 'remove_ads_result', dim: 'step', t: 'Покупка «без рекламы»: где сорвалось', col: 'Шаг', labels: 'playStep'},
        {event: 'remove_ads_result', dim: 'msg', t: 'Покупка «без рекламы»: текст ошибки Play / Huawei', col: 'Текст'},
        {event: 'ad_interstitial', dim: 'from', t: 'Межуровневая реклама: где', col: 'Где'},
        {event: 'notif_perm', dim: 'result', t: 'Напоминания: ответ игрока', col: 'Ответ'},
        {event: 'share', dim: 'from', t: 'Чем делятся', col: 'Откуда'},
        {event: 'mp_end', dim: 'floor', t: 'Вместе: на каком этаже кончается матч', col: 'Этаж'},
        {event: 'mp_floor', dim: 'anomaly', t: 'Вместе: аномалии на этажах', col: 'Аномалия'},
        {event: 'mp_mic', dim: 'result', t: 'Вместе: микрофон', col: 'Ответ'},
        // store = user property (play / huawei), registered 2026-11-05 when the AppGallery build went to review
        {event: 'first_open', dim: 'store', scope: 'user', keepUnset: true, t: 'Установки по магазинам', col: 'Магазин', labels: 'store'},
        {event: 'level_start', dim: 'store', scope: 'user', keepUnset: true, t: 'Забеги по магазинам', col: 'Магазин', labels: 'store'},
        {event: 'level_end', dim: 'store', scope: 'user', keepUnset: true, t: 'Законченные забеги по магазинам', col: 'Магазин', labels: 'store'},
        {event: 'app_remove', dim: 'store', scope: 'user', keepUnset: true, t: 'Удаления по магазинам', col: 'Магазин', labels: 'store'},
      ],
    },
  },
  // When the level params were registered: older events have no level.
  levelsSince: '21.10.2026',

  realtimeCacheSec: 55,
  reportsCacheSec: 300,
};
