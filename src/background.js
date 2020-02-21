import backgroundInit from "./backgroundInit"

const debug = require('debug/dist/debug')('ym');

localStorage.setItem('debug', 'ym');

chrome.runtime.onInstalled.addListener(async () => {
  debug('Yandex music voice assistant is started.');

  await backgroundInit();
});
