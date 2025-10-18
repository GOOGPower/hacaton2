import { Vector2, Vector3 } from "three";


type Box = { position: Vector3, size: Vector3 }

export type Path = Array<{x:number, y:number}>
export type SectionTypeOld = {
	plan:number, // per week
	fact:number, // per week
	height:number,
	floors:number,
	path:Array<Array<number>>
}
export type WorkType = {
	name:string,
	sections:Array<SectionType>
}

const sectionHeight = 37;
const sectionFloors = 8;

export type PersonType = {
	type: string,
	name: string,
	contact: string,
}

export type FloorType = {
	id?:number, // autoset
	height: number,
	start: Date,
	fact?: Date,
	plan: Date,
	ready: boolean,
	persons: Array<PersonType>
}

export type PacketType = {
	name: string,
	floors: Array<FloorType>
}

export type SectionType = {
	packets:Array<PacketType>,
	path: Array<Array<number>>,
}

// type FunctionType = {
	// cons?: (win:FloorType) => Array<FloorType>|never|undefined;
// }
function createFloors():Array<FloorType> {
	return [
		{
			ready: false,
			height: 8,
			start: new Date("2025.01.01"), 
			plan:  new Date("2025.09.01"), 
			fact:  new Date("2025.08.30"),
			persons: []
		},
		{
			ready: false,
			height: 3,
			start: new Date("2025.01.01"), 
			plan:  new Date("2025.09.01"), 
			fact:  new Date("2025.08.30"),
			persons: [],
		},
		{
			ready: false,
			height: baseHeight,
			start: new Date("2025.01.01"), 
			plan:  new Date("2025.09.01"), 
			fact:  new Date("2025.08.30"),
			persons: [],
		},
		{
			ready: false,
			height: baseHeight,
			start: new Date("2025.01.01"), 
			plan:  new Date("2025.09.01"), 
			fact:  new Date("2025.08.30"),
			persons: [],
		},
		{
			ready: false,
			height: baseHeight,
			start: new Date("2025.01.01"), 
			plan:  new Date("2025.09.01"), 
			fact:  new Date("2025.08.30"),
			persons: [],
		},
		{
			ready: false,
			height: baseHeight,
			start: new Date("2025.01.01"), 
			plan:  new Date("2025.09.01"), 
			fact:  new Date("2025.08.30"),
			persons: [],
		},
		{
			ready: false,
			height: baseHeight,
			start: new Date("2025.01.01"), 
			plan:  new Date("2025.09.01"), 
			fact:  new Date("2025.08.30"),
			persons: [],
		},
		{
			ready: false,
			height: 9,
			start: new Date(2025, 0, 1), 
			plan: new Date(2025, 7, 1), 
			fact: undefined,
			persons: [],
		},
	]
}

// const paths = [
// 	[
// 		[ 0,		0	 ],
// 		[ 25.9,		20.3 ],
// 		[ 15.9,		33.2 ],
// 		[ -10.5,	12.8 ],
// 	],[
// 		[ 25.9,		20.3 ],
// 		[ 51.6,		40.7 ],
// 		[ 41.3,		53.3 ],
// 		[ 15.9,		33.2 ],
// 	],[
// 		[ 51.6,		40.7 ],
// 		[ 60.6,		50.9 ],
// 		[ 60.6,		75.8 ],
// 		[ 49.2,		75.8 ],
// 		[ 49.2,		58.2 ],
// 		[ 41.3,		53.3 ],
// 	]
// ];

const angle = Math.atan2(20.3, 25.9);

const paths = [

];



(() => {
	let path = [];
	let dx = new Vector2(Math.cos(angle), Math.sin(angle));
	let dy = new Vector2(Math.cos(angle+Math.PI/2), Math.sin(angle+Math.PI/2));
	let p = new Vector2(0,0);
	p.add(dx.clone().multiplyScalar(-2.5));
	p.add(dy.clone().multiplyScalar(-2));

	path.push([p.x,p.y]);
	p.add(dx.clone().multiplyScalar(35));
	path.push([p.x,p.y]);
	p.add(dy.clone().multiplyScalar(20));
	path.push([p.x,p.y]);
	p.add(dx.clone().multiplyScalar(-35));
	path.push([p.x,p.y]);

	let w = 10;
	let h = 10;
	paths.push(path);
})();
(() => {
	let path = [];
	let dx = new Vector2(Math.cos(angle), Math.sin(angle));
	let dy = new Vector2(Math.cos(angle+Math.PI/2), Math.sin(angle+Math.PI/2));
	let p = new Vector2(0,0);
	p.add(dx.clone().multiplyScalar(-2.5));
	p.add(dy.clone().multiplyScalar(-2));
	p.add(dx.clone().multiplyScalar(35));

	path.push([p.x,p.y]);
	p.add(dx.clone().multiplyScalar(35));
	path.push([p.x,p.y]);
	p.add(dy.clone().multiplyScalar(20));
	path.push([p.x,p.y]);
	p.add(dx.clone().multiplyScalar(-35));
	path.push([p.x,p.y]);

	let w = 10;
	let h = 10;
	paths.push(path);
})();

const angle2 = Math.atan2(244,23);

// 3 section
(() => {
	let path = [];
	let dx = new Vector2(Math.cos(angle), Math.sin(angle));
	let dy = new Vector2(Math.cos(angle+Math.PI/2), Math.sin(angle+Math.PI/2));
	let dx2 = new Vector2(Math.cos(angle2), Math.sin(angle2));
	let dy2 = new Vector2(Math.cos(angle2+Math.PI/2), Math.sin(angle2+Math.PI/2));
	let p = new Vector2(0,0);
	p.add(dx.clone().multiplyScalar(-2.5));
	p.add(dy.clone().multiplyScalar(-2));
	p.add(dx.clone().multiplyScalar(35*2));

	const src = new Vector2(p.x,p.y);
	path.push([p.x,p.y]);
	p.add(dx.clone().multiplyScalar(13));
	path.push([p.x,p.y]);


	p.add(dx2.clone().multiplyScalar(32));
	path.push([p.x,p.y]);



	p.add(dy2.clone().multiplyScalar(22));


	path.push([p.x,p.y]);

	p.add(dx2.clone().multiplyScalar(-25));
	path.push([p.x,p.y]);

	p.set(src.x, src.y);
	p.add(dy.clone().multiplyScalar(20));
	path.push([p.x,p.y]);

	let w = 10;
	let h = 10;
	paths.push(path);
})();
// (() => {
// 	let path = [];
// 	let dx = new Vector2(Math.cos(angle), Math.sin(angle));
// 	let dy = new Vector2(Math.cos(angle+Math.PI/2), Math.sin(angle+Math.PI/2));
// 	let dx2 = new Vector2(Math.cos(angle2), Math.sin(angle2));
// 	let dy2 = new Vector2(Math.cos(angle2+Math.PI/2), Math.sin(angle2+Math.PI/2));
// 	let p = new Vector2(0,0);
// 	p.add(dx.clone().multiplyScalar(-2.5));
// 	p.add(dy.clone().multiplyScalar(-2));
// 	p.add(dx.clone().multiplyScalar(35));
// 	p.add(dx.clone().multiplyScalar(33));

// 	path.push([p.x,p.y]);
// 	p.add(dx.clone().multiplyScalar(10));
// 	path.push([p.x,p.y]);
// 	p.add(new Vector2(0,50));
// 	path.push([p.x,p.y]);
// 	p.add(dx.clone().multiplyScalar(-33));
// 	path.push([p.x,p.y]);

// 	let w = 10;
// 	let h = 10;
// 	paths.push(path);
// })();


paths.push([
	[ 0,		0	 ],
	[ 25.9,		20.3 ],
	[ 15.9,		33.2 ],
	[ -10.5,	12.8 ],
]);
paths.push([
	[ 25.9,		20.3 ],
	[ 51.6,		40.7 ],
	[ 41.3,		53.3 ],
	[ 15.9,		33.2 ],
]);
paths.push([
	[ 51.6,		40.7 ],
	[ 60.6,		50.9 ],
	[ 60.6,		75.8 ],
	[ 49.2,		75.8 ],
	[ 49.2,		58.2 ],
	[ 41.3,		53.3 ],
]);

// const ab = Math.atan2(paths[0][1][1]-paths[0][0][1],paths[0][1][0]-paths[0][0][0]) - Math.PI/2;

// paths[0][0][0] += 2*Math.cos(ab);
// paths[0][0][1] += 2*Math.sin(ab);
// paths[0][1][0] += 2*Math.cos(ab);
// paths[0][1][1] += 2*Math.sin(ab);
const baseHeight = 3.03;

export const sections:Array<SectionType> = [
	{
		packets: [
			{
				name: "Витражи",
				floors: [
					{
						ready: false,
						height: 8,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.01.01"), 
						fact:  new Date("2025.01.01"),
						persons: [
							{type: "Тех. надзор", 	name: "Петров", 	contact: "	+7(999)999 99-99"},
							{type: "УСМР", 			name: "Сидоров", 	contact: "	+7(999)999 99-99"},
							{type: "ИП Иванов", 	name: "Иванов", 	contact: "	+7(999)999 99-99"},
						]
					},
					{
						ready: false,
						height: 3,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.16"), 
						fact:  undefined,
						persons: [],
					},
					{
						ready: false,
						height: baseHeight,
						start: new Date("2025.01.01"),
						plan:  new Date("2025.10.17"), 
						fact:  undefined,
						persons: [],
					},
					{
						ready: false,
						height: baseHeight,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.18"), 
						fact:  undefined,
						persons: [],
					},
					{
						ready: false,
						height: baseHeight,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.19"), 
						fact:  undefined,
						persons: [],
					},
					{
						ready: false,
						height: baseHeight,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.20"), 
						fact:  undefined,
						persons: [],
					},
					{
						ready: false,
						height: baseHeight,
						start: new Date(2025, 0, 1), 
						plan: new Date(2025, 7, 1), 
						fact: new Date(2025, 7, 15),
						persons: [],
					},
					{
						ready: false,
						height: 9,
						start: new Date(2025, 0, 1), 
						plan: new Date(2025, 7, 1), 
						fact: new Date(2025, 7, 15),
						persons: [],
					},
				]
			},
			{
				name: "Несущие стены",
				floors: [
					{
						ready: false,
						height: 8,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.08.01"), 
						fact:  new Date("2025.08.15"),
						persons: []
					},
					{
						ready: false,
						height: 3,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.16"), 
						fact:  undefined,
						persons: [],
					},
					{
						ready: false,
						height: baseHeight,
						start: new Date("2025.01.01"),
						plan:  new Date("2025.10.17"), 
						fact:  undefined,
						persons: [],
					},
					{
						ready: false,
						height: baseHeight,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.18"), 
						fact:  undefined,
						persons: [],
					},
					{
						ready: false,
						height: baseHeight,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.19"), 
						fact:  undefined,
						persons: [],
					},
					{
						ready: false,
						height: baseHeight,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.20"), 
						fact:  undefined,
						persons: [],
					},
					{
						ready: false,
						height: baseHeight,
						start: new Date(2025, 0, 1), 
						plan: new Date(2025, 7, 1), 
						fact: new Date(2025, 7, 15),
						persons: [],
					},
					{
						ready: false,
						height: 9,
						start: new Date(2025, 0, 1), 
						plan: new Date(2025, 7, 1), 
						fact: new Date(2025, 7, 15),
						persons: [],
					},
				]
			},
			{
				name: "Остекление окон",
				floors: [...createFloors()]
			},
			{
				name: "Отделка наружная",
				floors: [...createFloors()]
			},
			{
				name: "Отделка внутренняя",
				floors: [...createFloors()]
			}
		],
		path: paths[0],
	},
	// 2 section
	{
		packets: [
			{
				name: "Витражи",
				floors: [
					{
						ready: true,
						height: 3,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.09.01"), 
						fact:  new Date("2025.08.30"),
						persons: [
							{type: "Тех. надзор", name: "Безглазов", contact: "	+7(999)999 99-99"},
							{type: "УСМР", name: "Кирпичев", contact: "	+7(999)999 99-99"},
						],
					}
				]
			},
			{
				name: "Несущие стены",
				floors: createFloors()
			},
			{
				name: "Отделка наружная",
				floors: createFloors()
			},
			{
				name: "Остекление окон",
				floors: createFloors()
			},
			{
				name: "Отделка внутренняя",
				floors: createFloors()
			}
		],
		path: paths[1]
	},
	// 3 section
	{
		packets: [
			{
				name: "Витражи",
				floors: [
					{
						ready: false,
						height: 3,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.15"), 
						fact:  undefined,
						persons: [],
					}
				]
			},
			{
				name: "Несущие стены",
				floors: [
					{
						ready: false,
						height: 3,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.15"), 
						fact:  new Date("2025.10.10"), // 10 oct
						persons: [],
					}
				]
			},
			{
				name: "Остекление окон",
				floors: [
					{
						ready: false,
						height: 3,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.15"), 
						fact:  undefined,
						persons: [],
					}
				]
			},
			{
				name: "Отделка наружная",
				floors: [
					{
						ready: false,
						height: 3,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.15"), 
						fact:  undefined,
						persons: [],
					}
				]
			},
			{
				name: "Отделка внутренняя",
				floors: [
					{
						ready: false,
						height: 3,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.15"), 
						fact:  undefined,
						persons: [],
					}
				]
			}
		],
		path: paths[2]
	}

];

const createWorkTypes = () => {
	let set:any = {};
	for(let s of sections) {
		for(let p of s.packets) {
			set[p.name] = p.name;
		}
	}
	return Object.keys(set);
}
export const workTypes:Array<string> = createWorkTypes();

sections.forEach((s) => {
	s.packets.forEach(p => {
		p.floors.forEach((f,fi) => f.id = fi);
	})
});


// export const database:Array<WorkType> = [
// 	{ 
// 		name: 'Перегородки',
// 		sections: [
// 			// section1,
// 			{
// 				// 1
// 				plan: 500,
// 				fact: 450,
// 				height: sectionHeight,
// 				floors: sectionFloors,
// 				path: [
// 					[ 0,		0	 ],
// 					[ 25.9,		20.3 ],
// 					[ 15.9,		33.2 ],
// 					[ -10.5,	12.8],
// 					// [ 0,		0  ],
// 					// [ 10,		0 ],
// 					// [ 10,		10 ],
// 					// [ 0,		10],
// 				]
// 			},
// 			{
// 				// 2
// 				plan: 500,
// 				fact: 450,
// 				height: sectionHeight,
// 				floors: sectionFloors,
// 				path: [
// 					[ 25.9,		20.3 ],
// 					[ 51.6,		40.7 ],
// 					[ 41.3,		53.3 ],
// 					[ 15.9,		33.2 ],
// 				]
// 			},
// 			{
// 				// 3
// 				plan: 500,
// 				fact: 450,
// 				height: sectionHeight,
// 				floors: sectionFloors,
// 				path: [
// 					[ 51.6,		40.7 ],
// 					[ 60.6,		50.9 ],
// 					[ 60.6,		75.8 ],
// 					[ 49.2,		75.8 ],
// 					[ 49.2,		58.2 ],
// 					[ 41.3,		53.3 ],
// 				]
// 			}
// 		]
// 	},
// 	{ 
// 		name: 'Перегородки2',
// 		sections: []
// 	},
// 	// { name: 'Отделка наружная' },
// 	// { name: 'Остекление окон' },
// 	// { name: 'Несущие стены' },
// 	// { name: 'Покрытие кровли' },
// 	// { name: 'Витражи' },
// ];

// export const sections:Array<{position:Vector3, size:Vector3}> = [
// 	{
// 		position: new Vector3(0,0,0),
// 		size: new Vector3(10,10,10)
// 	},
// 	{
// 		position: new Vector3(50,0,50),
// 		size: new Vector3(10,100,10)
// 	}
// ];






