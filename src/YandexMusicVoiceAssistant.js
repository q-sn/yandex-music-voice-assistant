import annyang from './vendor/annyang.js'
console.log(`annyang`, annyang)

// TODO: черный список треков
// TODO: находится ли трек в избранном? удалить из избранного
class YandexMusicVoiceAssistant {

	constructor() {
		this._annyangCommands = {
			trackNext: {
				regexp: new RegExp('следующ'),
				callback: this.exec.bind(this, { command: 'trackNext' })
			},
			trackPrev: {
				regexp: new RegExp('предыдущ'),
				callback: this.exec.bind(this, { command: 'trackPrev' })
			},
			trackPause: {
				regexp: new RegExp('останови|выключи|пауз'),
				callback: this.exec.bind(this, { command: 'trackPause' })
			},
			trackRepeat: {
				regexp: new RegExp('повтор|заново'),
				callback: this.exec.bind(this, { command: 'trackRepeat' })
			},
			playArtist: {
				regexp: /([\w\W]?)+группа([\w\W]+)/i,
				callback: (garbage, artist) => this.exec({ command: 'playArtist', data: artist })
			},
			trackPlay: {
				regexp: new RegExp('включи'),
				callback: this.exec.bind(this, { command: 'trackPlay' })
			},
			trackName: {
				regexp: new RegExp('название|называется'),
				callback: this.exec.bind(this, { command: 'trackName' })
			},
			trackForward: {
				regexp: new RegExp('вперед|вперёд'),
				callback: this.exec.bind(this, { command: 'trackForward' })
			},
			trackBack: {
				regexp: new RegExp('назад'),
				callback: this.exec.bind(this, { command: 'trackBack' })
			},
			trackSave: {
				regexp: new RegExp('сохрани|добав'),
				callback: this.exec.bind(this, { command: 'trackSave' })
			},
			trackDelete: {
				regexp: new RegExp('удали'),
				callback: this.exec.bind(this, { command: 'trackDelete' })
			},
			volumeUp: {
				regexp: new RegExp('громче|увелич|повыс'),
				callback: this.exec.bind(this, { command: 'volumeUp' })
			},
			volumeDown: {
				regexp: new RegExp('тише|уменьш|пониз'),
				callback: this.exec.bind(this, { command: 'volumeDown' })
			},
		};
	}

	init() {
	  console.log(`init`)
		annyang.setLanguage('ru-RU');

		annyang.addCommands(this._annyangCommands);

		annyang.debug(true);

		annyang.start({ continuous: true });
	}

	exec({ command, data }) {
		this.sendMessage({ tabInfo: { url: '*://music.yandex.ru/*' }, command, data});
	}

	sendMessage({ tabInfo, command, data }) {
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

chrome.runtime.onInstalled.addListener(() => {
	console.log(`Yandex music voice assistant is started`);
	console.log(`annyang`, annyang)

	setTimeout(() => {
		navigator.mediaDevices.getUserMedia({ audio: true })
			.then(() => {
				let _YandexMusicVoiceAssistant = new YandexMusicVoiceAssistant();
				_YandexMusicVoiceAssistant.init();

				console.log(`_YandexMusicVoiceAssistant`, _YandexMusicVoiceAssistant)
			})
			.catch((error) => {
				console.log(3, error);
				chrome.tabs.create({
					url: chrome.extension.getURL("options.html"),
					selected: true
				})
			})

	}, 100);
});
