import getMicrophoneAccessInit from "./getMicrophoneAccessInit"
import yandexMusicVoiceAssistant from "./YandexMusicVoiceAssistant"

const debug = require('debug/dist/debug')('ym');

export default async () => {
  debug('BackgroundInit()');
  try {
    await getMicrophoneAccessInit();

    const YandexMusicVoiceAssistant = new yandexMusicVoiceAssistant();
    debug(`YandexMusicVoiceAssistant: %o`, YandexMusicVoiceAssistant);
    await YandexMusicVoiceAssistant.init();
  } catch (error) {
    debug(`Background error: %o`, error);
  }
}
