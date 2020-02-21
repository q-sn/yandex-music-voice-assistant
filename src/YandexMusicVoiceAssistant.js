import annyang from './vendor/annyang.js'
import backgroundInit from "./backgroundInit"

const debug = require('debug/dist/debug')('ym');

class YandexMusicVoiceAssistant {

	constructor(config) {
	  this._config = {
      runByKeyword: true,
      keyword: 'Катя',
    };
		this._annyangCommands = {
      music: {
        regexp: this._command({ command: `слушать музыку` }),
        callback: async () => {
          await this._createYandexMusicPage();
          this._exec({ command: 'trackPlay' });
        }
      },
			trackNext: {
        regexp: this._command({ command: `следующ` }),
				callback: this._exec.bind(this, { command: 'trackNext' })
			},
			trackPrev: {
        regexp: this._command({ command: `предыдущ` }),
				callback: this._exec.bind(this, { command: 'trackPrev' })
			},
			trackPause: {
        regexp: this._command({ command: `останови|выключи|пауз|стоп` }),
				callback: this._exec.bind(this, { command: 'trackPause' })
			},
			trackRepeat: {
        regexp: this._command({ command: `повтор|заново` }),
				callback: this._exec.bind(this, { command: 'trackRepeat' })
			},
			playArtist: {
        regexp: this._command({ command: '([\\w\\W]?)+группа([\\w\\W]+)' }),
				callback: (...args) => this._exec({ command: 'playArtist', data: args[args.length - 1].trim() })
			},
			playSong: {
        regexp: this._command({ command: '([\\w\\W]?)+песня([\\w\\W]+)' }),
				callback: (...args) => this._exec({ command: 'playSong', data: args[args.length - 1].trim() })
			},
			trackPlay: {
        regexp: this._command({ command: `включи` }),
				callback: this._exec.bind(this, { command: 'trackPlay' })
			},
			trackName: {
        regexp: this._command({ command: `название|называется|что играет` }),
				callback: this._exec.bind(this, { command: 'trackName' })
			},
			trackForward: {
        regexp: this._command({ command: `вперед|вперёд` }),
				callback: this._exec.bind(this, { command: 'trackForward' })
			},
			trackBack: {
        regexp: this._command({ command: `назад` }),
				callback: this._exec.bind(this, { command: 'trackBack' })
			},
			trackSave: {
        regexp: this._command({ command: `сохрани|добав` }),
				callback: this._exec.bind(this, { command: 'trackSave' })
			},
			trackDelete: {
        regexp: this._command({ command: `удали` }),
				callback: this._exec.bind(this, { command: 'trackDelete' })
			},
			volumeUp: {
        regexp: this._command({ command: `громче|увелич|повыс` }),
				callback: this._exec.bind(this, { command: 'volumeUp' })
			},
			volumeDown: {
				regexp: this._command({ command: `тише|уменьш|пониз` }),
				callback: this._exec.bind(this, { command: 'volumeDown' })
			},
		};
	}

	async init() {
    debug('YandexMusicVoiceAssistant init()');

    await this._createYandexMusicPage();

		annyang.setLanguage('ru-RU');

		annyang.addCommands(this._annyangCommands);

		annyang.debug(true);

		annyang.start({ continuous: true });

		setInterval(async () => {
		  try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        if (error.message === 'Failed due to shutdown') {
          await backgroundInit();
        }
      }
    }, 5000)
	}

	async _createYandexMusicPage() {
    debug('YandexMusicVoiceAssistant _createYandexMusicPage()');
	  return new Promise((resolve, reject) => {
      chrome.tabs.create({
        url: "https://music.yandex.ru/home",
        selected: true
      }, () => {
        // TODO: резолвить только тогда, когда от новой вкладки получили ответ о загрузке яндекс менеджера
        resolve();
      });
    })
  }

  _command({ command, method = true }) {
    debug('YandexMusicVoiceAssistant _command() %s', `${this._config.runByKeyword && `${this._config.keyword} `}${command}`);
    if (this._config.runByKeyword) {
      return new RegExp(`${this._config.keyword} (${command})`);
    } else {
      return new RegExp(command);
    }
  }

	_exec({ command, data }) {
	  debug(`YandexMusicVoiceAssistant _exec() command: %o, data: %o`, command, data);
		this._sendMessage({ tabInfo: { url: '*://music.yandex.ru/*' }, command, data});
	}

	_sendMessage({ tabInfo, command, data }) {
		chrome.tabs.query(tabInfo, (tabs) => {
			if (tabs.length) {
				const audibleTab = tabs.find(tab => !!tab.audible);

				chrome.tabs.sendMessage(
					audibleTab && audibleTab.id || tabs[0].id,
					{
						command,
						data,
					}
				);
			}
		});
	}
}

export default YandexMusicVoiceAssistant;
