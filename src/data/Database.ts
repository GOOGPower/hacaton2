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

export const sections:Array<SectionType> = [
	{
		packets: [
			{
				name: "Витражи",
				floors: [
					{
						ready: false,
						height: 5,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.01.01"), 
						fact:  new Date("2025.01.01"),
						persons: [
							{type: "Тех. надзор", name: "Петров", contact: "	+7(999)999 99-99"},
							{type: "УСМР", name: "Сидоров", contact: "	+7(999)999 99-99"},
							{type: "ИП Иванов", name: "Иванов", contact: "	+7(999)999 99-99"},
						]
					},
					{
						ready: false,
						height: 4,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.16"), 
						fact:  undefined,
						persons: [],
					},
					{
						ready: false,
						height: 3,
						start: new Date("2025.01.01"),
						plan:  new Date("2025.10.17"), 
						fact:  undefined,
						persons: [],
					},
					{
						ready: false,
						height: 3,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.18"), 
						fact:  undefined,
						persons: [],
					},
					{
						ready: false,
						height: 3,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.19"), 
						fact:  undefined,
						persons: [],
					},
					{
						ready: false,
						height: 3,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.10.20"), 
						fact:  undefined,
						persons: [],
					},
					{
						ready: false,
						height: 3,
						start: new Date(2025, 0, 1), 
						plan: new Date(2025, 7, 1), 
						fact: new Date(2025, 7, 15),
						persons: [],
					},
					{
						ready: false,
						height: 3,
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
						height: 3,
						start: new Date(2025, 0, 1), 
						plan: new Date(2025, 7, 1), 
						fact: new Date(2025, 7, 15),
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
						start: new Date(2025, 0, 1), 
						plan: new Date(2025, 7, 1), 
						fact: new Date(2025, 7, 15),
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
						start: new Date(2025, 0, 1), 
						plan: new Date(2025, 7, 1), 
						fact: new Date(2025, 7, 15),
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
						start: new Date(2025, 0, 1), 
						plan: new Date(2025, 7, 1), 
						fact: new Date(2025, 7, 15),
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
						start: new Date(2025, 0, 1), 
						plan: new Date(2025, 7, 1), 
						fact: new Date(2025, 7, 15),
						persons: [],
					}
				]
			}
		],
		path: [
			[ 0,		0	 ],
			[ 25.9,		20.3 ],
			[ 15.9,		33.2 ],
			[ -10.5,	12.8 ],
		]
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
				floors: [
					{
						ready: false,
						height: 3,
						start: new Date("2025.01.01"), 
						plan:  new Date("2025.09.01"), 
						fact:  new Date("2025.08.30"),
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
						plan:  new Date("2025.09.01"), 
						fact:  new Date("2025.08.30"),
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
						plan:  new Date("2025.09.01"), 
						fact:  new Date("2025.08.30"),
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
						plan:  new Date("2025.09.01"), 
						fact:  new Date("2025.08.30"),
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
						plan:  new Date("2025.09.01"), 
						fact:  new Date("2025.08.30"),
						persons: [],
					}
				]
			}
		],
		path: [
			[ 25.9,		20.3 ],
			[ 51.6,		40.7 ],
			[ 41.3,		53.3 ],
			[ 15.9,		33.2 ],
		]
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
		path: [
			[ 51.6,		40.7 ],
			[ 60.6,		50.9 ],
			[ 60.6,		75.8 ],
			[ 49.2,		75.8 ],
			[ 49.2,		58.2 ],
			[ 41.3,		53.3 ],
		]
	}

];


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






