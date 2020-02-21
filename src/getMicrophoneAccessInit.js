const debug = require('debug/dist/debug')('ym');

export default async () => {
  debug('GetMicrophoneAccessInit()');

  const tryInit = async (resolve, reject) => {
    debug('GetMicrophoneAccessInit tryInit()');
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      resolve();
    } catch (error) {
      debug(`GetUserMedia error: %o`, error);

      // TODO: Permission denied
      if (error.message === 'Failed due to shutdown') {
        chrome.tabs.query({ url: 'chrome-extension://*/ym-get-microphone-access.html' }, (tabs) => {
          if (!tabs.length ) chrome.tabs.create({
            url: chrome.extension.getURL("ym-get-microphone-access.html"),
            selected: true
          });
        });

        setTimeout(async () => await tryInit(resolve, reject), 2000);
      } else {
        reject(error);
      }
    }
  };

  return new Promise(async (resolve, reject) => {
    await tryInit(resolve, reject);
  });
}
