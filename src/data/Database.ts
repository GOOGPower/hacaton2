import { Vector2, Vector3 } from "three";


type Box = { position: Vector3, size: Vector3 }

export type Path = Array<{x:number, y:number}>
export type SectionType = {
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

type FloorType = {
	height: number,
	start: Date,
	fact: Date,
	plan: Date,
	ready: boolean,
}

type PacketType = {
	name: string,
	floors: Array<FloorType>
}

type SelectionType = {
	packets:Array<PacketType>,
	path: Array<Array<number>>,
}

export const sections:Array<SelectionType> = [
	{
		packets: [
			{
				name: "Перегородки",
				floors: [
					{
						ready: false,
						height: 100,
						start: new Date(), 
						plan: new Date(), 
						fact: new Date(),
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
	}

	// {
	// 	packets: [
	// 		{
	// 			name: "Перегородки"
	// 		}
	// 	],
	// 	path: [
	// 		[ 25.9,		20.3 ],
	// 		[ 51.6,		40.7 ],
	// 		[ 41.3,		53.3 ],
	// 		[ 15.9,		33.2 ],
	// 	]
	// }, {
	// 	packets: [
	// 		{
	// 			name: "Перегородки"
	// 		}
	// 	],
	// 	path: [
	// 		[ 51.6,		40.7 ],
	// 		[ 60.6,		50.9 ],
	// 		[ 60.6,		75.8 ],
	// 		[ 49.2,		75.8 ],
	// 		[ 49.2,		58.2 ],
	// 		[ 41.3,		53.3 ],
	// 	]
	// }
];


export const database:Array<WorkType> = [
	{ 
		name: 'Перегородки',
		sections: [
			// section1,
			{
				// 1
				plan: 500,
				fact: 450,
				height: sectionHeight,
				floors: sectionFloors,
				path: [
					[ 0,		0	 ],
					[ 25.9,		20.3 ],
					[ 15.9,		33.2 ],
					[ -10.5,	12.8],
					// [ 0,		0  ],
					// [ 10,		0 ],
					// [ 10,		10 ],
					// [ 0,		10],
				]
			},
			{
				// 2
				plan: 500,
				fact: 450,
				height: sectionHeight,
				floors: sectionFloors,
				path: [
					[ 25.9,		20.3 ],
					[ 51.6,		40.7 ],
					[ 41.3,		53.3 ],
					[ 15.9,		33.2 ],
				]
			},
			{
				// 3
				plan: 500,
				fact: 450,
				height: sectionHeight,
				floors: sectionFloors,
				path: [
					[ 51.6,		40.7 ],
					[ 60.6,		50.9 ],
					[ 60.6,		75.8 ],
					[ 49.2,		75.8 ],
					[ 49.2,		58.2 ],
					[ 41.3,		53.3 ],
				]
			}
		]
	},
	{ 
		name: 'Перегородки2',
		sections: []
	},
	// { name: 'Отделка наружная' },
	// { name: 'Остекление окон' },
	// { name: 'Несущие стены' },
	// { name: 'Покрытие кровли' },
	// { name: 'Витражи' },
];

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






