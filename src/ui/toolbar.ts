import { string } from "three/tsl";
import * as Database from "../data/Database";
import Vars from "../vars";
import { World, WorldState, type WorldSection, initWorld } from "../world/world";
import { BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from "chart.js";


let fullscreen:boolean = false;

const updateSelection = function<T>(
		elementId:string, 
		options:Array<T>, toContent:(o:T,id:number)=>string,
		listener:(value:T, all:boolean) => void,
		all=false
	) {

	let eSelect = document.getElementById(elementId) as HTMLSelectElement;
	const lVal = eSelect.value;
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
		if(!all) return listener(options[parseInt(eSelect.value)], false);
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
		eToggleFullscreen.onclick = () => {
			eContainer?.requestFullscreen();
		};
	}

	const updateText = (id:string, value:string, cons?: (e:HTMLElement)=>void) => {
		let e = document.getElementById(id);
		if(e) e.textContent = value;
		if(e && cons) cons(e);
	}

	const state = {
		selection: Database.sections[0],
		packet: Database.sections[0].packets[0],
		floor: Database.sections[0].packets[0].floors[0],
		anySelection: false,
		anyFloor: false
	}

	const update = () => {
		const s = state.selection;
		const p = state.packet;
		const f = state.floor;

		const sAny = state.anySelection;
		const fAny = state.anyFloor;
		WorldState.floors.forEach(obj => obj.enable((obj.section == s || sAny) && obj.packet.name == p.name && (obj.floor.id == f.id || fAny)));
			for(let o of document.getElementsByClassName('single-data')) o.setAttribute('hide', `${sAny || fAny}`);

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
	}
	updateSelection<Database.SectionType>('select-section', Database.sections, (_s,id) => `${id+1} секция`, (s, sAny) => {
		state.selection = s;
		state.anySelection = sAny;
		update();
		updateSelection<Database.PacketType>('select-packet', s.packets, (p) => `${p.name}`, p => {
			state.packet = p;
			update();
			updateSelection<Database.FloorType>('select-floor', p.floors, (_f,id) => `${id+1} захватка`, (f, fAny) => {
				state.floor = f;
				state.anyFloor = fAny;
				update();
			}, true);
		});
	}, true);


	(() => {
		const map:any = {};
		Database.workTypes.forEach((t,ti) => map[t] = ti);

		let cols:Array<Array<string|HTMLElement>> = [
			["", ...Database.workTypes.map(s => `<b>${s}</b>`).sort()],
			...Database.sections.map((s,si) => [`${si+1} секция`, ...[...s.packets].sort((p1,p2) => map[p1.name] - map[p2.name]).map((p) => {
				let eCell = document.createElement('span');
				p.floors.forEach((f,fi) => {
					let eRow = document.createElement('span');
					eRow.textContent = `${fi} захватка\n`;
					eRow.style.color = f.fact ? 'var(--lime)' : 'var(--red)';
					eCell.append(eRow);
					eCell.append(document.createElement('br'));
				});
				return eCell;
			})]),
		];
		let eTable = document.getElementById('all-data') as HTMLTableElement;
		for(let col of cols) {
			let eRow = eTable.insertRow();
			for(let cell of col) {
				if (typeof(cell) == 'string') eRow.insertCell().innerHTML = cell;
				else eRow.insertCell().appendChild(cell);
			}
		}



		// let eHeadRow = eTable.insertRow();
		// eHeadRow.insertCell();
		// Database.sections.forEach((s,si) => {
		// 	let eCell = document.createElement('th');
		// 	eCell.textContent = `${si+1} секция`;
		// 	eHeadRow.appendChild(eCell);
		// 	// let eRow = eAllData.insertRow();
		// 	// eRow.insertCell().textContent = ;
		// 	// eRow.insertCell().textContent = `${p.name}`;
		// });

	})();

	(() => {
		Chart.register(
			BarElement,
			BarController,
			LinearScale,
			CategoryScale,
			LineController,
			PointElement,
			LineElement,
			Title,
			Tooltip,
			Legend
		);

		const datasets:Array<any> = [];

		const data:Array<any> = [];

		Database.sections.forEach((s,_si) => {
			let completed = 0;
			let uncompleted = 0;
			s.packets.forEach(p => {
				p.floors.forEach(f => {
					completed += f.fact?1:0;
					uncompleted += f.fact?0:1;
				});
			});
			data.push([completed, uncompleted]);
		});
		datasets.push({
			label: 'Готовность секции (%)',
			data: data.map(e => e[0]*100/(e[0] + e[1])),
			fill: false,
			backgroundColor: `#FF480055`,
			borderColor: `#FF4800`,
		});
		// datasets.push({
		// 	label: 'err',
		// 	data: data.map(e => e[1]*100/(e[0] + e[1])),
		// 	fill: false,
		// 	backgroundColor: `#f00`,
		// 	borderColor: `#f00`,
		// });

		let eChart = document.getElementById('chart') as HTMLCanvasElement;
		const chart = new Chart(eChart.getContext('2d') as CanvasRenderingContext2D, {
			type: 'bar',
			data: {
				labels: Database.sections.map((_s,si) => `${si+1} секция`),
				datasets: datasets
			},
			options: {
				elements: {
					bar: {
						borderWidth: 2,
					}
    			},
				scales: {
					x: {stacked: true},
					y: {stacked: true},
				}
			}
		});
		// const datasets:Array<any> = [];

		// Database.workTypes.forEach((type, typeId) => {
		// 	const data:Array<any> = [];

		// 	Database.sections.forEach((s,_si) => {
		// 		let value = 0;
		// 		s.packets.forEach(p => {
		// 			if(p.name != type) return;
		// 			p.floors.forEach(f => {
		// 				value += f.fact?1:0;
		// 			});
		// 		});
		// 		data.push(value);
		// 	});

		// 	datasets.push({
		// 		label: type,
		// 		data: data,
		// 		fill: false,
		// 			// tension: 0.1
		// 		backgroundColor: `hsl(${0}deg, 80%, 80%)`,
		// 		borderColor: `hsl(${typeId*360/Database.workTypes.length}deg, 80%, 80%)`,
		// 	});
		// });
		// console.log(datasets);

		// let eChart = document.getElementById('chart') as HTMLCanvasElement;
		// const chart = new Chart(eChart.getContext('2d') as CanvasRenderingContext2D, {
		// 	type: 'bar',
		// 	data: {
		// 		labels: Database.sections.map((_s,si) => `${si+1} секция`),
		// 		datasets: datasets
		// 	},
		// 	options: {
		// 		scales: {
		// 			x: {stacked: true},
		// 			y: {stacked: true},
		// 		}
		// 	}
		// });

	})();

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



