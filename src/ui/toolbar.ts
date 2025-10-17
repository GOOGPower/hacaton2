import * as Database from "../data/Database";
import Vars from "../vars";
import { World, WorldState, type WorldSection, initWorld } from "../world/world";


let fullscreen:boolean = false;

const fullscreenText = ["Полный экран", "Обычный режим"];


const updateSelection = function<T>(
		elementId:string, 
		options:Array<T>, toContent:(o:T,id:number)=>string,
		listener:(value:T, all:boolean) => void,
		all=false
	) {

	let eSelect = document.getElementById(elementId) as HTMLSelectElement;
	const lVal = eSelect.value;
	console.log(lVal);
	eSelect.innerHTML = "";
	let oid = 0;
	for(let option of options) {
		let eOption = document.createElement('option');
		eOption.textContent = toContent(option, oid);
		eOption.value = `${oid}`;
		eSelect.appendChild(eOption);

		oid++;
	}
	if(all) {
		let eOption = document.createElement('option');
		eOption.textContent = "Все";
		eOption.value = `-1`;
		eSelect.appendChild(eOption);
	}
	if(lVal != '') eSelect.value = lVal;

	let lastSelected:T = options[0];
	eSelect.onchange = () => {
		if(eSelect.value != '-1') lastSelected = options[parseInt(eSelect.value)];
		listener(lastSelected, eSelect.value == '-1');
	};
	if(eSelect.value == '0') listener(lastSelected, false);
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

	const updateText = (id:string, value:string, cons?: (e:HTMLElement)=>void) => {
		let e = document.getElementById(id);
		if(e) e.textContent = value;
		if(e && cons) cons(e);
	}

	updateSelection<Database.SectionType>('select-section', Database.sections, (_s,id) => `${id+1} секция`, (s, sAny) => {
		updateSelection<Database.PacketType>('select-packet', s.packets, (p) => `${p.name}`, p => {
			updateSelection<Database.FloorType>('select-floor', p.floors, (_f,id) => `${id+1} захватка`, (f, fAny) => {
				WorldState.floors.forEach(obj => obj.enable((obj.section == s || sAny) && obj.packet.name == p.name && (obj.floor.id == f.id || fAny)));
				updateText('floor-start', f.start.toLocaleDateString('ru-RU'));
				updateText('floor-plan', f.plan.toLocaleDateString('ru-RU'));
				updateText('floor-fact', f.fact == undefined ? "Не готово" : f.fact.toLocaleDateString('ru-RU'));

				updateText('status-info', "", e => {
					if(f.fact) {
						e.style.color = 'var(--lime)';
						e.textContent = "Сдано";
						return;
					}
					if(Date.now() > f.plan.getTime()) {
						e.style.color = 'var(--red)';
						e.textContent = "Просрок";
						return;
					}
					const diff = Math.round((f.plan.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
					e.textContent = `Осталось ${diff <= 0 ? "менее 0 " : diff} дней`;
					e.style.color = "";
				});

				let eTable = document.getElementById('persons') as HTMLTableElement;
				eTable.replaceChildren();
				let eHRow = eTable.insertRow();
       			const eHeadName = document.createElement("th");
       			const eHeadHead = document.createElement("th");
       			const eHeadContact = document.createElement("th");
       			const eHeadBan = document.createElement("th");
       			eHeadName.textContent = 'Наименование';
       			eHeadHead.textContent = "ФИО";
       			eHeadContact.textContent = 'Контактная информация';
       			eHeadBan.textContent = "";
       			eHRow.appendChild(eHeadName);
       			eHRow.appendChild(eHeadHead);
       			eHRow.appendChild(eHeadContact);
       			eHRow.appendChild(eHeadBan);
				for(let person of f.persons) {
					let eRow = eTable.insertRow();
					// let eName = eRow.insertCell();
					eRow.insertCell().textContent = person.type;
					eRow.insertCell().textContent = person.name;
					eRow.insertCell().textContent = person.contact;
       				const eBan = document.createElement("button");
       				eBan.textContent = "Напрваить письмо";
       				eRow.insertCell().appendChild(eBan);
				}
			}, true);
		});
	}, true);

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



