import Vars from "../vars";


let fullscreen:boolean = false;

const fullscreenText = ["Полный экран", "Обычный режим"];

export default function initToolbar() {
	let eToolbar = document.getElementById('toolbar');
	let eToggleFullscreen = document.getElementById('toggle-fullscreen');

	if(eToggleFullscreen) {
		eToggleFullscreen.textContent = fullscreenText[0];
		eToggleFullscreen.onclick = () => {
			fullscreen = !fullscreen;
			if(fullscreen) document.body.requestFullscreen();
			else document.exitFullscreen();
			eToggleFullscreen.textContent = fullscreenText[fullscreen?1:0];
		};
	}

	let ePlay = document.getElementById('play-animation-rotate');
	if(ePlay) ePlay.onclick = () => Vars.animation.rotate.enabled = !Vars.animation.rotate.enabled;
}



