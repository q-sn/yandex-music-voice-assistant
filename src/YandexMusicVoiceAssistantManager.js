console.log(`Yandex music voice assistant manager is started`);

const executeCode = ({ code }) => {
	const script = document.createElement('script');
	script.id = 'tmpScript';
	script.appendChild(document.createTextNode(code));
	(document.body || document.head || document.documentElement).appendChild(script);
	document.getElementById('tmpScript').remove();
};

const getVariable = ({ name }) => {
	executeCode({ code: `localStorage.setItem('yandexMusicVoiceAssistant', ${name})` });
	const variable = localStorage.getItem('yandexMusicVoiceAssistant');
	localStorage.removeItem('yandexMusicVoiceAssistant');

	return variable
};

let voices = window.speechSynthesis.getVoices();
setTimeout(function() { voices = window.speechSynthesis.getVoices(); }, 1000);

const findVoice = lang => {
	for (var i = 0; i < voices.length; i++) {
		if (voices[i].lang === lang) { return voices[i]; }
	}
	return null;
};

const speak = (s) => {
	if (!window.speechSynthesis) { return; }
	var utterance = new SpeechSynthesisUtterance(s);
	utterance.lang = "ru-RU";
	utterance.voice = findVoice(utterance.lang);
	console.log(`utterance`, utterance)
	window.speechSynthesis.speak(utterance);
};


let command = localStorage.getItem('yandexMusicVoiceAssistantCommand');

if (command) {
	console.log(`command`, command)
	executeCode({ code: command });
}



chrome.runtime.onMessage.addListener((request) => {
	if (!request.command) return;

	switch (request.command) {
		case 'trackNext':
			console.log('trackNext')
			executeCode({ code: `externalAPI.next();console.log('1trackNext');` });
			break;
		case 'trackPrev':
			console.log('trackPrev')
			executeCode({ code: `externalAPI.prev();console.log('1trackPrev');` });
			break;
		case 'trackPause':
			console.log('trackPause')
			executeCode({ code: `externalAPI.togglePause();console.log('1trackPause');` });
			break;
		case 'trackRepeat':
			console.log('trackRepeat')
			executeCode({ code: `externalAPI.setPosition(0);console.log('1trackRepeat');` });
			break;
		case 'trackPlay':
			console.log('trackPlay')
			executeCode({ code: `externalAPI.togglePause();console.log('1trackPlay');` });
			break;
		case 'playArtist':
			console.log('playArtist')

			localStorage.setItem('yandexMusicVoiceAssistantCommand', `
			let interval = setInterval(() => {
				console.log(1);
				
				if (document.getElementsByClassName('artist') && document.getElementsByClassName('artist')[0]) {
					
					document.getElementsByClassName('artist')[0].getElementsByClassName('d-link')[0].click();
					
					clearInterval(interval);
				}
			}, 100)
			
			let interval1 = setInterval(() => {
				console.log(2);
				
				if (document.getElementsByClassName('button-play') && document.getElementsByClassName('button-play')[0]) {
				
					document.getElementsByClassName('button-play')[0].click();
					
					localStorage.removeItem('yandexMusicVoiceAssistantCommand');
					clearInterval(interval1);
				}
				
			}, 100)
			`);


			// document.getElementsByClassName('artist')[0].getElementsByClassName('d-link')[0].click();
			//
			// localStorage.setItem('yandexMusicVoiceAssistantCommand', 'document.getElementsByClassName('button-play')[0].click();localStorage.removeItem('yandexMusicVoiceAssistantCommand');')
			executeCode({ code: `
			
			window.location = 'https://music.yandex.ru/search?text=${request.data}&type=artists';
			
			` });

			break;
		case 'playSong':
			console.log('playSong')

			localStorage.setItem('yandexMusicVoiceAssistantCommand', `
			let interval = setInterval(() => {
				console.log(1);
				
				if (document.getElementsByClassName('d-track__name') && document.getElementsByClassName('d-track__name')[0]) {
					
					document.getElementsByClassName('d-track__name')[0].getElementsByClassName('d-track__title')[0].click();
					
					clearInterval(interval);
				}
			}, 100)
			
			let interval1 = setInterval(() => {
        console.log(2);

        if (document.getElementsByClassName('sidebar-track__play') && document.getElementsByClassName('sidebar-track__play')[0]) {
        
          document.getElementsByClassName('sidebar-track__play')[0].click();
        
          localStorage.removeItem('yandexMusicVoiceAssistantCommand');
          clearInterval(interval1);
        }
        }, 100)     
      `);

			executeCode({ code: `
			
			window.location = 'https://music.yandex.ru/search?text=${request.data}&type=tracks';
			
			` });

			break;
		case 'trackName':
			console.log('trackName')
			const trackName = getVariable({ name: 'externalAPI.getCurrentTrack().title' });

			if (trackName) speak(trackName);
			break;
		case 'trackForward':
			let trackForward = getVariable({ name: 'externalAPI.getProgress().position' });

			if (trackForward) {
				trackForward = Number(trackForward) + 10;
			}

			executeCode({ code: `externalAPI.setPosition(${trackForward});` });
			break;
		case 'trackBack':
			let trackBack = getVariable({ name: 'externalAPI.getProgress().position' });

			if (trackBack) {
				trackBack = Number(trackBack) - 10;
			}

			executeCode({ code: `externalAPI.setPosition(${trackBack});` });
			break;
		case 'trackSave':
			console.log(`trackSave`);
			let trackSaveLiked = getVariable({ name: 'externalAPI.getCurrentTrack().liked' });

			if (trackSaveLiked === 'false') {
				executeCode({ code: `externalAPI.toggleLike();` });

				speak('Добавила');
			}
			break;
		case 'trackDelete':
			console.log(`trackDelete`);
			let trackDeleteLiked = getVariable({ name: 'externalAPI.getCurrentTrack().liked' });

			if (trackDeleteLiked === 'true') {
				executeCode({ code: `externalAPI.toggleLike();` });

				speak('Удалила');
			}
			break;
		case 'trackForwardOn':
			break;
		case 'trackBackOn':
			break;
		case 'volumeUp':
			let volumeUp = getVariable({ name: 'externalAPI.getVolume()' });

			if (volumeUp) {
				volumeUp = Number(volumeUp) + 0.15;
			}

			executeCode({ code: `externalAPI.setVolume(${volumeUp});` });
			break;
		case 'volumeDown':
			let volumeDown = getVariable({ name: 'externalAPI.getVolume()' });

			if (volumeDown) {
				volumeDown = Number(volumeDown) - 0.15;
			}

			executeCode({ code: `externalAPI.setVolume(${volumeDown});` });
			break;
		case 'volumeUpOn':
			break;
		case 'volumeDownOn':
			break;
	}
});
