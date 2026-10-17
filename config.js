// Game Pulse settings. Nothing here is secret: the OAuth client ID is public
// by design - access to the numbers comes from the viewer's own Google
// account, which must have read access to the GA4 properties.
window.GAME_PULSE = {
  // Google Cloud console > APIs & Services > Credentials > OAuth client ID
  // (Web application). Authorized JavaScript origins must list the
  // GitHub Pages origin, e.g. https://<login>.github.io
  clientId: 'PASTE_CLIENT_ID.apps.googleusercontent.com',

  // Developer's own devices.
  excludeCountries: ['Ukraine'],
  // Google Play pre-launch robots and emulators (not filterable in the
  // realtime block - GA4 has no deviceModel there).
  excludeDeviceRegex: 'OnePlus8Pro|sdk_gphone.*',

  keyEvents: [
    'first_open', 'app_remove', 'level_start', 'level_up', 'level_failed',
    'tutorial_complete', 'begin_checkout', 'purchase', 'in_app_purchase', 'purchase_failed',
  ],

  realtimeCacheSec: 55,
  reportsCacheSec: 300,
};
