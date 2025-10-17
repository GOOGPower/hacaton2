import * as Database from "../data/Database";
import Vars from "../vars";
import { World, WorldState, type WorldSection, initWorld } from "../world/world";


let fullscreen:boolean = false;

const fullscreenText = ["Полный экран", "Обычный режим"];


const updateSelection = function<T>(
		elementId:string, 
		options:Array<T>, toContent:(o:T,id:number)=>string,
		listener:(value:T) => void,
	) {

	let eSelect = document.getElementById(elementId) as HTMLSelectElement;
	eSelect.innerHTML = "";
	let oid = 0;
	for(let option of options) {
		let eOption = document.createElement('option');
		eOption.textContent = toContent(option, oid);
		eOption.value = `${oid}`;
		eSelect.appendChild(eOption);

		oid++;
	}

	eSelect.onchange = () => {
		listener(options[parseInt(eSelect.value)]);
	};
	// console.log(`value: "${eSelect.value}"`);
	if(eSelect.value == '0') listener(options[0]);
}

export default function initToolbar() {
	let eToolbar = document.getElementById('toolbar');
	let eToggleFullscreen = document.getElementById('toggle-fullscreen');
	let eContainer = document.getElementById('container');

	if(eToggleFullscreen) {
		eToggleFullscreen.textContent = fullscreenText[0];
		eToggleFullscreen.onclick = () => {
			fullscreen = !fullscreen;
			if(fullscreen && eContainer) eContainer.requestFullscreen();
			else document.exitFullscreen();
			eToggleFullscreen.textContent = fullscreenText[fullscreen?1:0];
		};
	}


	updateSelection<Database.SectionType>('select-section', Database.sections, (_s,id) => `${id+1} секция`, s => {
		console.log(s);
		updateSelection<Database.PacketType>('select-packet', s.packets, (p) => `${p.name}`, p => {
			updateSelection<Database.FloorType>('select-floor', p.floors, (_f,id) => `${id+1} захватка`, f => {
				WorldState.floors.forEach(obj => obj.enable(obj.section == s && obj.packet == p && obj.floor == f));
			});
		});
	});

	// eFloorSelect.addEventListener('change', () => selectFloor(parseInt(eFloorSelect.value)));





	// let ePlay = document.getElementById('play-animation-rotate');
	// if(ePlay) ePlay.onclick = () => Vars.animation.rotate.enabled = !Vars.animation.rotate.enabled;

	// let eSelect = document.getElementById('work-types') as HTMLSelectElement;
	// let eFloorSelect = document.getElementById('work-types-floor') as HTMLSelectElement;

	// type OptionElement = {
	// 	id:number,
	// 	world:WorldSection,
	// 	workType:WorkType,
	// 	section:SectionType,
	// }
	// const workTypesElements:Array<OptionElement> = [];

	// for(let workType of database) {
	// 	let id = 0;
	// 	for(let section of workType.sections) {
	// 		let eOption = document.createElement('option');
	// 		eOption.value = `${id}`;
	// 		workTypesElements.push({
	// 			id: id,
	// 			workType: workType,
	// 			section: section,
	// 			world: WorldState.sections[id],
	// 		});
	// 		eOption.textContent = `${workType.name}: ${++id} секция`;
	// 		eSelect?.appendChild(eOption);
	// 	}
	// }

	// const state:{
	// 	section:OptionElement|null,
	// 	floor:number|null
	// } = {
	// 	section: null,
	// 	floor: null,
	// };

	// const selectSection = (id:number) => {
	// 	eSelect.value = `${id}`;
	// 	const section = workTypesElements[id];
	// 	const oldFloor = eFloorSelect.value;
	// 	state.section = section;
	// 	eFloorSelect.innerHTML = "";
	// 	for (var i = 0; i < section.section.floors; i++) {
	// 		let eOption = document.createElement('option');
	// 		eOption.value = `${i}`;
	// 		eOption.textContent = `${i+1} этаж`;
	// 		eFloorSelect.appendChild(eOption);
	// 	}
	// 	eFloorSelect.value = oldFloor;
	// } 
	// const selectFloor = (floor:number) => {
	// 	eFloorSelect.value = `${floor}`;
	// 	const section = state.section;

	// 	console.log(state, JSON.stringify(state.section?.world), floor);
	// 	WorldState.sections.forEach(s => s.floors.forEach(f => f.enable(false)));
	// 	// section.world?.floors[floor]?.enable(true);
	// } 

	// eSelect.addEventListener('change', () => selectSection(parseInt(eSelect.value)));
	// eFloorSelect.addEventListener('change', () => selectFloor(parseInt(eFloorSelect.value)));

	// selectSection(0);
	// selectFloor(0);

}



