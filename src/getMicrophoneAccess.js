navigator.mediaDevices.getUserMedia({audio: true});

const interval = setInterval(
  async () => {
    try {
      const result = await navigator.permissions.query({ name:'microphone' });
      if (result?.state === 'granted') {
        clearInterval(interval);

        chrome.tabs.query({ url: 'chrome-extension://*/ym-get-microphone-access.html' }, (tabs) => {
          if (tabs.length ) {
            tabs.forEach((tab) => {
              chrome.tabs.remove(tab.id);
            })
          }
        });
      }
    } catch (error) {}
  }, 1000);
