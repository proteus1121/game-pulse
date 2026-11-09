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
    // Lift 13 together mode
    mp_search: 'Вместе: начал искать попутчиков',
    mp_start: 'Вместе: матч начался',
    mp_floor: 'Вместе: этаж пройден (голосование)',
    mp_hunt: 'Вместе: лифт проголодался, охота',
    mp_end: 'Вместе: матч закончился',
    mp_mic: 'Вместе: ответ на запрос микрофона',
    mp_limit: 'Вместе: бесплатная поездка на сегодня уже была',
    full_show: 'Открыл экран полной версии',
    ad_load_fail: 'Реклама не загрузилась (ошибка, не no fill)',
    ad_consent_block: 'Реклама запрещена согласием (UMP)',
    floor1_down: 'Нажал ▼ на 1-м этаже (он всегда нормальный, без штрафа)',
    mp_ad: 'Вместе: ещё поездка за рекламу',
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
    },
    // Lift 13 (src: app/src/main/assets/game.js > an, lifts; mp.js > roles)
    anomaly: {
      lamp_red: 'Красная лампа', lamp_swing: 'Лампа качается', open_door: 'Открытая дверь', peephole: 'Глазок смотрит',
      mirror_number: 'Зеркальный номер', stencil_wrong: 'Чужой этаж', tall_door: 'Высокая дверь', mail_open: 'Ящики открыты',
      knock: 'Стук', mat_ceiling: 'Коврик на потолке', ballerina: 'Балерина', santa: 'Санта', shoes_line: 'Чужая обувь', graffiti_change: 'Надпись',
      window_face: 'Лицо в окне', footprints: 'Мокрые следы', behind_you: 'За спиной', long_hall: 'Длинный коридор',
      extra_door: 'Дверь вместо окна', neighbor_faces: 'Сосед смотрит', neighbor_head: 'Голова назад',
      neighbor_close: 'Сосед у лифта', neighbor_gone: 'Соседа нет', neighbor_tall: 'Высокий сосед', neighbor_arms: 'Длинные руки',
      lamp_off: 'Лампа не горит', neighbor_twin: 'Два соседа', low_ceiling: 'Низкий потолок', red_sky: 'Красное небо',
      door_same: 'Одинаковые номера', cabin_lcd: 'Табло врёт', cactus_gone: 'Подоконник пуст',
      rules_changed: 'Правила изменились', crate_moved: 'Ящик выгрузили', lamp_on: 'Свет горит', self_open: 'Двери открылись сами',
      none: 'Без аномалии (чисто)',
    },
    lift: {pass: 'Пассажирский', cargo: 'Грузовой', night: 'Ночной', endless: 'Без конца', daily: 'Рейс дня', mp: 'Вместе'},
    // `from` of remove_ads_tap / full_show / ad_interstitial / share
    from: {
      menu: 'Главное меню', mp: 'Игра вместе', ride: 'Между этажами', end: 'Экран конца забега', pause: 'Пауза',
      quit: 'Выход из забега', buy_cancel: 'После отмены покупки', win: 'Победа', endless: 'Без конца', daily: 'Рейс дня',
    },
    answer: {granted: 'Разрешил', denied: 'Запретил (окно системы)', declined: 'Отказался в игре'},
    role: {lamp: 'Фонарщик', ear: 'Слухач', mech: 'Механик', med: 'Санитар'},
    gift: {smoke: '+1 нерв', cat: 'Кот на 3 этажа', pies: '+1 открытие дверей', bat: 'Фонарик 100%'},
    win: {'1': 'Доехали', '0': 'Не доехали'},
    humans: {'1': 'Один (остальные боты)', '2': '2 человека', '3': '3 человека', '4': '4 человека'},
    // Cat Sort (src: app/src/main/assets/i18n.js > it_*, room_*, boosters)
    booster: {shelf: 'Полка', undo: 'Отмена хода', hint: 'Подсказка', shuffle: 'Перемешать', light: 'Фонарик'},
    room: {bedroom: 'Спальня', bath: 'Ванная', play: 'Игровая', library: 'Библиотека', attic: 'Чердак', living: 'Гостиная', kitchen: 'Кухня', garden: 'Сад',
      hospital: 'Котоград: больница', police: 'Котоград: полиция', church: 'Котоград: церковь', castle: 'Котоград: замок'},
    kind: {plain: 'Обычный', hard: 'Сложный', boss: 'Босс', speed: 'Гонка', puzzle: 'Головоломка', order: 'Голодный котик', daily: 'Ежедневный', weekly: 'Недельный', marathon: 'Марафон'},
    place: {house: 'Котодом', town: 'Котоград'},
    houseItem: {hs_cross: 'Красный крест', hs_xray: 'Рентген', hs_chart: 'Таблица для глаз', hs_drip: 'Капельница', hs_bed: 'Койка', hs_scale: 'Весы', hs_cabinet: 'Аптечный шкаф', pd_siren: 'Мигалка', pd_board: 'Доска «Розыск»', pd_map: 'Карта города', pd_locker: 'Шкафчики', pd_desk: 'Стол дежурного', pd_cooler: 'Кулер', pd_cell: 'Камера', ch_rose: 'Окно-роза', ch_window: 'Витраж', ch_flowers: 'Цветы', ch_candles: 'Подсвечник', ch_rug: 'Дорожка', ch_pews: 'Скамьи', ch_organ: 'Орган', ca_banner: 'Знамя', ca_shield: 'Щит и мечи', ca_chandelier: 'Люстра', ca_armor: 'Доспехи', ca_carpet: 'Королевский ковёр', ca_chest: 'Сундук с сокровищами', ca_throne: 'Трон',
      b_window: 'Ночное окно', b_mobile: 'Мобиль', b_wardrobe: 'Шкаф', b_bed: 'Кровать', b_night: 'Тумбочка', b_rug: 'Коврик', w_mirror: 'Зеркало', w_sink: 'Раковина', w_tub: 'Ванна', w_towel: 'Полотенца', w_ducks: 'Уточки', w_mat: 'Коврик', p_wheel: 'Беговое колесо', p_slide: 'Горка', p_shelf: 'Игрушки', p_balls: 'Сухой бассейн', p_tunnel: 'Тоннель', p_mice: 'Мышки', l_books: 'Книжный шкаф', l_chair: 'Кресло', l_lamp: 'Торшер', l_globe: 'Глобус', l_painting: 'Картина', l_rug: 'Ковёр', a_window: 'Круглое окно', a_lamp: 'Лампочка', a_boxes: 'Коробки', a_trunk: 'Сундук', a_rocker: 'Кресло-качалка', a_hammock: 'Гамак', rug: 'Коврик', bed: 'Лежанка', bowls: 'Миски', plant: 'Цветок', window: 'Окно', tower: 'Когтеточка', painting: 'Картина', lamp: 'Лампа', shelf: 'Полочка', aquarium: 'Аквариум', k_clock: 'Часы', k_shelf: 'Банки', k_window: 'Окошко', k_fridge: 'Холодильник', k_mat: 'Коврик', k_table: 'Стол', k_basket: 'Клубочки', k_bowls: 'Золотые миски', g_tree: 'Дерево', g_feeder: 'Кормушка', g_fence: 'Заборчик', g_house: 'Будка', g_flowers: 'Клумба', g_hammock: 'Гамак', g_pond: 'Пруд', g_bush: 'Кусты'},
    mode: {level: 'Обычные уровни', daily: 'Ежедневный', weekly: 'Недельный', marathon: 'Марафон'},
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
  //   levelLabels - valueLabels set for level names
  //   breakdown: scope 'user' - dim is a user property (customUser:); labels - valueLabels set;
  //              vs - a second event over the same dim, drawn as a/m share (found vs missed);
  //              view - 'bars' | 'split' | 'hist' (picked from the values when left out);
  //              hint - line under the title; short - column name in the store table.
  //              Events without the param (versions that didn't send it yet) are ignored.
  games: {
    '558926253': { // cat-sort
      level: 'level', start: 'level_start', win: 'level_win', lose: 'level_lose', ordered: true,
      cols: [{event: 'booster', t: 'Бустеры'}],
      avgs: [{event: 'level_win', metric: 'sec', t: 'Время победы', fmt: 'dur'}, {event: 'level_win', metric: 'moves', t: 'Ходов'}],
      // marathon_end carries level = the board the clock ran out on; shelves = the score
      breakdowns: [
        {event: 'booster', dim: 'k', t: 'Какие бустеры берут', col: 'Бустер', labels: 'booster'},
        {event: 'level_win', dim: 'stars', t: 'Звёзды за победу', col: 'Звёзд'},
        {event: 'level_start', dim: 'mode', t: 'Режимы', col: 'Режим', labels: 'mode'},
        {event: 'level_lose', dim: 'kind', t: 'Проигрыши по типу уровня (с 1.7.0)', col: 'Тип', labels: 'kind'},
        {event: 'level_leave', dim: 'kind', t: 'Уходы из уровня по типу (с 1.7.0)', col: 'Тип', labels: 'kind'},
        {event: 'marathon_end', dim: 'level', t: 'Марафон: на каком поле кончилось время', col: 'Поле', view: 'hist'},
        {event: 'house_buy', dim: 'place', t: 'Покупки: дом или город', col: 'Где', labels: 'place'},
        {event: 'house_buy', dim: 'item', t: 'Котодом: покупки', col: 'Предмет', labels: 'houseItem'},
        {event: 'house_build', dim: 'room', t: 'Котодом: построенные комнаты', col: 'Комната', labels: 'room'},
        {event: 'house_upgrade', dim: 'room', t: 'Котодом: улучшения комнат', col: 'Комната', labels: 'room'},
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
        {event: 'anomaly_found', vs: 'anomaly_missed', dim: 'anomaly', a: 'нашли', m: 'пропустили', t: 'Какие аномалии замечают', col: 'Аномалия',
         hint: 'доля найденных из всех появлений аномалии'},
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
      levelLabels: 'lift',
      level: 'level_name', start: 'level_start', win: 'level_end', lose: 'level_end', outcome: 'success',
      cols: [{event: 'anomaly_found', t: 'Нашли аномалий'}, {event: 'anomaly_missed', t: 'Пропустили'}, {event: 'false_alarm', t: 'Ложные тревоги'},
             {event: 'run_continue', t: 'Продолжили'}, {event: 'run_quit', t: 'Бросили'},
             // together (mp.js, 2026-11-05): searches, matches started / finished
             {event: 'mp_search', t: 'Вместе: поиск'}, {event: 'mp_start', t: 'Вместе: матчи'}, {event: 'mp_end', t: 'Вместе: доиграли'},
             // 0.9.1: without the full version one ride together a day; mp_limit = hit it, full_show = the full version screen
             {event: 'mp_limit', t: 'Вместе: упёрлись в лимит'}, {event: 'full_show', t: 'Экран полной версии'},
             // 0.9.7: ▼ on floor 1 no longer a false alarm
             {event: 'floor1_down', t: '▼ на 1-м этаже'}],
      avgs: [{event: 'level_end', metric: 'time', t: 'Время забега', fmt: 'dur'},
             {event: 'anomaly_found', metric: 'ms', t: 'Реакция на аномалию', fmt: 'ms'}],
      breakdowns: [
        {event: 'anomaly_found', vs: 'anomaly_missed', dim: 'anomaly', a: 'нашли', m: 'пропустили', t: 'Какие аномалии замечают', col: 'Аномалия',
         labels: 'anomaly', hint: 'доля найденных из всех появлений аномалии'},
        {event: 'false_alarm', dim: 'floor', t: 'Ложные тревоги по этажам', col: 'Этаж'},
        {event: 'gift_take', dim: 'gift', t: 'Подарки', col: 'Подарок', labels: 'gift'},
        {event: 'level_end', dim: 'floor', t: 'На каком этаже проигрывают', col: 'Этаж', hint: 'этаж, на котором забег кончился ошибкой'},
        {event: 'run_quit', dim: 'floor', t: 'На каком этаже бросают забег', col: 'Этаж'},
        {event: 'remove_ads_tap', dim: 'from', t: 'Откуда жмут «купить полную версию»', col: 'Откуда', labels: 'from'},
        {event: 'remove_ads_result', dim: 'code', t: 'Покупка «без рекламы»: ответ Play / Huawei', col: 'Ответ', labels: 'play'},
        {event: 'remove_ads_result', dim: 'step', t: 'Покупка «без рекламы»: где сорвалось', col: 'Шаг', labels: 'playStep'},
        {event: 'remove_ads_result', dim: 'msg', t: 'Покупка «без рекламы»: текст ошибки Play / Huawei', col: 'Текст'},
        {event: 'ad_interstitial', dim: 'from', t: 'Межуровневая реклама: где', col: 'Где', labels: 'from'},
        {event: 'notif_perm', dim: 'result', t: 'Напоминания: ответ игрока', col: 'Ответ', labels: 'answer'},
        {event: 'share', dim: 'from', t: 'Чем делятся', col: 'Откуда', labels: 'from'},
        {event: 'mp_end', dim: 'floor', t: 'Вместе: на каком этаже кончается матч', col: 'Этаж'},
        {event: 'mp_floor', dim: 'anomaly', t: 'Вместе: аномалии на этажах', col: 'Аномалия', labels: 'anomaly'},
        {event: 'mp_mic', dim: 'result', t: 'Вместе: микрофон', col: 'Ответ', labels: 'answer'},
        {event: 'mp_start', dim: 'humans', t: 'Вместе: сколько людей в матче', col: 'Людей', labels: 'humans'},
        {event: 'mp_start', dim: 'role', t: 'Вместе: роли', col: 'Роль', labels: 'role'},
        {event: 'mp_end', dim: 'alive', t: 'Вместе: сколько доехало', col: 'Доехало'},
        {event: 'mp_end', dim: 'success', t: 'Вместе: доехали ли до конца', col: 'Итог', labels: 'win'},
        {event: 'mp_hunt', dim: 'floor', t: 'Вместе: охота по этажам', col: 'Этаж'},
        {event: 'full_show', dim: 'from', t: 'Экран полной версии: откуда', col: 'Откуда', labels: 'from'},
        // 0.9.5: why an ad never came (no fill is ad_nofill_pause)
        {event: 'ad_load_fail', dim: 'code', t: 'Реклама не загрузилась: код ошибки', col: 'Код'},
        {event: 'ad_consent_block', dim: 'result', t: 'Реклама запрещена согласием: статус', col: 'Статус'},
        {event: 'ad_consent_block', dim: 'msg', t: 'Реклама запрещена согласием: ошибка UMP', col: 'Ошибка'},
        // 0.9.7: a rewarded video for one more ride together (tap / earned / not_earned)
        {event: 'mp_ad', dim: 'result', t: 'Вместе: поездка за рекламу', col: 'Результат'},
        {event: 'tutorial', dim: 'found', t: 'Туториал: нашли открытую дверь (1) / нет (0)', col: 'Нашли'},
        // store = user property (play / huawei), registered 2026-11-05 when the AppGallery build went to review.
        // first_open is sent before the property is set, so it is never split; events without it are ignored.
        {event: 'level_start', dim: 'store', scope: 'user', t: 'Забеги по магазинам', short: 'Начали забег', col: 'Магазин', labels: 'store'},
        {event: 'level_end', dim: 'store', scope: 'user', t: 'Законченные забеги по магазинам', short: 'Закончили забег', col: 'Магазин', labels: 'store'},
        {event: 'app_remove', dim: 'store', scope: 'user', t: 'Удаления по магазинам', short: 'Удалили', col: 'Магазин', labels: 'store'},
      ],
    },
  },
  // When the level params were registered: older events have no level.
  levelsSince: '21.10.2026',

  realtimeCacheSec: 55,
  reportsCacheSec: 300,
};
