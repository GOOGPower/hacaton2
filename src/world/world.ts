
import * as OBC from "@thatopen/components";
import * as THREE from 'three';
import initController from './controler';
import { fog } from "three/tsl";
import * as Database from "../data/Database";

const config = {
	frag: 'R241.frag', //'school_arq.frag',//"",
	cube: true,
};

const container = document.getElementById("container")!;
const components = new OBC.Components();
const worlds = components.get(OBC.Worlds);

export const WorldControl:{
	update:() => void,
	cube?:THREE.Mesh
} = {
	update: ()=>{},
};

type WorldFloor = {
	section : Database.SectionType,
	packet: Database.PacketType,
	floor: Database.FloorType,

	material: THREE.Material,
	enable: (enabled:boolean) => void
}

export type WorldSection = {
	floors:Array<WorldFloor>
}
type WorldStateType = {
	floors:Array<WorldFloor>
}

export const WorldState:WorldStateType = {
	floors: []
};

export const World = worlds.create<OBC.SimpleScene, OBC.SimpleCamera, OBC.SimpleRenderer>();

export async function initWorld() {
	World.scene = new OBC.SimpleScene(components);
	World.renderer = new OBC.SimpleRenderer(components, container);
	World.camera = new OBC.SimpleCamera(components);
	components.init();

	if(config.cube) {
		const material = new THREE.MeshLambertMaterial({ color: "#6528D7" });
		const geometry = new THREE.BoxGeometry(.1,.1,.1);
		const cube = new THREE.Mesh(geometry, material);
		World.scene.three.add(cube);
		eval("window['cube'] = cube")
		WorldControl.cube = cube;
	}

	World.scene.setup();
	await World.camera.controls.setLookAt(1, 1, 1, 0, 0, 0);
	initController();


	// const tMaterial = new THREE.MeshLambertMaterial({ color: "#6528D7", transparent: true, opacity: .5 });
	// const geometry = new THREE.BoxGeometry(50,25,50);
	// const cube = new THREE.Mesh(geometry, tMaterial);
	// World.scene.three.add(cube);


	// await World.camera.controls.setLookAt(100, 0, 100, Database.sections[0].position.x, Database.sections[0].position.y, Database.sections[0].position.z);

	// for(let section of Database.sections) {
	// 	const geometry = new THREE.BoxGeometry(section.size.x,section.size.y,section.size.z);
	// 	(() => {
	// 		const tMaterial = new THREE.MeshLambertMaterial({ 
	// 			color: "#6528D7", 
	// 			transparent: true, 
	// 			opacity: .25,
	// 			depthTest: false,
	// 		});
	// 		const cube = new THREE.Mesh(geometry, tMaterial);
	// 		cube.position.set(section.position.x, section.position.y, section.position.z);
	// 		// cube.renderOrder = 1;
	// 		World.scene.three.add(cube);

	// 		const egeometry = new THREE.EdgesGeometry(geometry);
	// 		const lines = new THREE.LineSegments(
	// 		    egeometry,
	// 		    new THREE.LineBasicMaterial({ 
	// 		    	color: 0xff0000, 
	// 		    	side: THREE.BackSide, 
	// 		    	linewidth: 20 
	// 		    })
	// 		)
	// 		// lines.renderOrder = 1;
	// 		cube.add(lines);
	// 	})();

	// 	(() => {
	// 		const tMaterial = new THREE.MeshLambertMaterial({ 
	// 			color: "#6528D7", 
	// 			transparent: true, 
	// 			opacity: .25,
	// 		});
	// 		const cube = new THREE.Mesh(geometry, tMaterial);
	// 		cube.position.set(section.position.x, section.position.y, section.position.z);
	// 		World.scene.three.add(cube);
	// 	})();
	// }

		
		// (() => {
						    
		// 	var pts = [
		// 		new THREE.Vector3(-1, 0, -1),
		// 		new THREE.Vector3(0, 0, -2),
		// 		new THREE.Vector3(2, 0, -2),
		// 		new THREE.Vector3(2, 0, 1)
		// 	];
			
		// 	var ptsShape = pts.map( p => {return new THREE.Vector2(p.x, -p.z)});
		// 	console.log(ptsShape);
			
		// 	var shape = new THREE.Shape(ptsShape);
			
		// 	var shapeGeom = new THREE.ShapeGeometry(shape);
		// 	shapeGeom.rotateX(-Math.PI * 0.5);
			
		// 	var shapeMat = new THREE.MeshBasicMaterial({color: "aqua"});
			
		// 	World.scene.three.add(new THREE.Mesh(shapeGeom, shapeMat));
		// })();
		for(let section of Database.sections) {
			for(let packet of section.packets) {
				const shape = new THREE.Shape();
				let move = true;
				let pid = 0;
				for(let point of section.path) {
					// point[0] *= -1;
					const rotate = Math.PI;
					let x = Math.cos(rotate)*-point[0] - Math.sin(rotate)*point[1];
					let y = Math.sin(rotate)*-point[0] + Math.cos(rotate)*point[1];

					x += -53;
					y += 65;

					// point[0] *= -1;
					// point[0] += 53;
					// point[1] += 65;

					if(move) shape.moveTo(x, y);
					else shape.lineTo(x, y);
					move = false;

					const material = new THREE.MeshLambertMaterial({ color: "#6528D7" });
					material.color.setHSL(pid++/6, .5, .5);
					const geometry = new THREE.BoxGeometry(1,1,1);
					const cube = new THREE.Mesh(geometry, material);
					cube.position.set(x, 0, y);
					World.scene.three.add(cube);

				}
				shape.closePath();

				const worldFloors:Array<WorldFloor> = [];

				let y = 0;
				for (let floor of packet.floors) {
					const geometry = new THREE.ExtrudeGeometry(shape, {
						depth: floor.height,
						bevelEnabled: false
    				});
    				geometry.rotateX(Math.PI/2);
					
					const egeometry = new THREE.EdgesGeometry(geometry);
	
					const baseMaterial = new THREE.MeshLambertMaterial({ 
						color: floor.ready ? 'green' : 'red', 
						transparent: true, 
						opacity: .25,
					});
					const glowMaterial = new THREE.MeshLambertMaterial({ 
						color: floor.ready ? 'green' : 'red', 
						transparent: true, 
						opacity: .15,
						depthTest: false,
					});
					const lineMaterial = new THREE.LineBasicMaterial({ 
						color: floor.ready ? 'green' : 'red', 
						side: THREE.BackSide, 
						linewidth: 20 
					})
	
					const mesh = new THREE.Mesh(geometry, baseMaterial);
					const glowMesh = new THREE.Mesh(geometry, glowMaterial);
					const lines = new THREE.LineSegments(egeometry, lineMaterial)
					glowMesh.position.y = lines.position.y = mesh.position.y = y + floor.height - 15;
					y += floor.height;


	// 	(() => {
	// 		const tMaterial = new THREE.MeshLambertMaterial({ 
	// 			color: "#6528D7", 
	// 			transparent: true, 
	// 			opacity: .25,
	// 			depthTest: false,
	// 		});
	// 		const cube = new THREE.Mesh(geometry, tMaterial);
	// 		cube.position.set(section.position.x, section.position.y, section.position.z);
	// 		// cube.renderOrder = 1;
	// 		World.scene.three.add(cube);

	// 		const lines = new THREE.LineSegments(
	// 		    egeometry,
	// 		    new THREE.LineBasicMaterial({ 
	// 		    	color: 0xff0000, 
	// 		    	side: THREE.BackSide, 
	// 		    	linewidth: 20 
	// 		    })
	// 		)
	// 		// lines.renderOrder = 1;
	// 		cube.add(lines);
	// 	})();

	// 	(() => {
	// 		const tMaterial = new THREE.MeshLambertMaterial({ 
	// 			color: "#6528D7", 
	// 			transparent: true, 
	// 			opacity: .25,
	// 		});
	// 		const cube = new THREE.Mesh(geometry, tMaterial);
	// 		cube.position.set(section.position.x, section.position.y, section.position.z);
	// 		World.scene.three.add(cube);
	// 	})();

					WorldState.floors.push({
						section: section,
						packet: packet,
						floor: floor,

						material: baseMaterial,
						enable: (_e:boolean) => {
							if(_e) {
								// baseMaterial.opacity = .25;
								// lineMaterial.opacity = 1;
								baseMaterial.visible = true;
								lineMaterial.visible = true;
								glowMaterial.visible = true;
								console.log('enable');
								return;
							}
							// baseMaterial.opacity = 0;
							// lineMaterial.opacity = 0;
							// glowMaterial.opacity = 0;
							baseMaterial.visible = false;
							lineMaterial.visible = false;
							glowMaterial.visible = false;
						}
					});
					World.scene.three.add(mesh, lines, glowMesh);

					// WorldState.floors.push({
					// 	floors: worldFloors
					// });
				}
			}
		}

		// const size = 150; // The size of the grid in units
    	// const divisions = 10; // The number of divisions across the grid
    	// const centerLineColor = 0x0000ff; // Blue center line
    	// const gridColor = 0x888888; // Grey grid lines

    	// const gridHelper = new THREE.GridHelper(size, divisions, centerLineColor, gridColor);
		// World.scene.three.add(gridHelper);


		// cube.add(new THREE.LineSegments(
		//     egeometry,
		//     new THREE.LineBasicMaterial({ color: 0x000000, side: THREE.BackSide, linewidth: 2 })
		// ));

		// Контурный материал
		// const outlineMaterial = new THREE.ShaderMaterial({
		//     uniforms: {
		//         outlineColor: { value: new THREE.Color(0xff0000) }, // Красный
		//         outlineThickness: { value: 0.01 }
		//     },
		//     vertexShader: `
		//         varying vec3 vNormal;
		//         uniform float outlineThickness;
		
		//         void main() {
		//             vNormal = normalize(normal);
		//             vec3 outlineVertex = position - vNormal * outlineThickness; // Инвертированная нормаль
		//             gl_Position = projectionMatrix * modelViewMatrix * vec4(outlineVertex, 1.0);
		//         }
		//     `,
		//     fragmentShader: `
		//         uniform vec3 outlineColor;
		
		//         void main() {
		//             gl_FragColor = vec4(outlineColor, 1.0);
		//         }
		//     `,
		//     side: THREE.BackSide // Важно: рисуем только задние грани
		// });
		
		// const outlineMesh = new THREE.Mesh(geometry.clone(), outlineMaterial); // Клонируем геометрию
		// outlineMesh.renderOrder = 2; // Высокий приоритет, чтобы рисоваться поверх
		// World.scene.three.add(outlineMesh);


	const objectAddListener = (e:{child:THREE.Object3D}) => {
		const obj = e.child;
		if(obj instanceof THREE.Mesh) {
			// obj.position.set(0,0,0);
			obj.translateX(0);
			// console.log(e);
			if(obj.material instanceof THREE.MeshLambertMaterial) {
				// console.log(obj.material);
				obj.material.color.setHSL(obj.position.y/10%1,.5,.5);

				// obj.parent?.remove(obj);
				return;
			}
		} else console.warn(e);
		e.child.addEventListener("childadded", objectAddListener);
	};

	World.scene.three.addEventListener("childadded", objectAddListener);


	// const injected = 

	// World.scene.three.add = function(..._object: THREE.Object3D[]):THREE.Scene {
	// 	for (let o of _object) {
	// 		console.log(o);
	// 		// if(o instanceof THREE.Mesh) {
	// 		// 	o.position.set(0,0,0);
	// 		// 	defaultAdd(o);
	// 		// }
	// 	}
	// 	return World.scene.three;
	// };


	const githubUrl = "worker.mjs";
	const fetchedUrl = await fetch(githubUrl);
	const workerBlob = await fetchedUrl.blob();
	const workerFile = new File([workerBlob], "worker.mjs", {
		type: "text/javascript",
	});
	const workerUrl = URL.createObjectURL(workerFile);
	const fragments = components.get(OBC.FragmentsManager);
	fragments.onFragmentsLoaded.add(e => {
		console.log('loaded', e);
	})
	fragments.init(workerUrl);

	WorldControl.update = () => fragments.core.update(true);

	World.camera.controls.addEventListener("rest", () =>
		fragments.core.update(true),
	);

	fragments.list.onItemSet.add(({ value: model }) => {
		model.useCamera(World.camera.three);
		World.scene.three.add(model.object);
		console.log(model);
		fragments.core.update(true);
	});
	
	if(config.frag !== '') {
		const fragPaths = [config.frag];
		await Promise.all(
			fragPaths.map(async (path) => {
				const modelId = path.split("/").pop()?.split(".").shift();
				if (!modelId) return null;
				const file = await fetch(path);
				const buffer = await file.arrayBuffer();
				return fragments.core.load(buffer, { modelId });
			}),
		);
	}
	const material = new THREE.MeshLambertMaterial({ color: "#6528D7" });


	const eachObject = (obj:THREE.Object3D) => {
		// console.log(obj.children.length);
		for(let c of obj.children) {
			eachObject(c);
		}
		if(obj instanceof THREE.Mesh) {
			if(Array.isArray(obj.material)) {
				for(let mat of obj.material) {
					if(mat instanceof THREE.MeshLambertMaterial) {
						mat.color.setHSL(obj.position.y/10%1,.5,.5);
						obj.parent?.remove(obj);
					}
				}
			}
			if(obj.material instanceof THREE.MeshLambertMaterial) {
				console.log(obj.material);
				obj.material.color.setHSL(obj.position.y/10%1,.5,.5);
				obj.parent?.remove(obj);
				return;
			}
			return;
		}
	}



	console.log(World.scene.three.children);
	// let intervalId = setInterval(() => {
		// console.log(World.scene.three.children[3].children.length);
		// if(World.scene.three.children[3].children.length > 0) {
		// 	clearInterval(intervalId);

		// 	setTimeout(() => {
		// 		for(let c of World.scene.three.children) {
		// 			eachObject(c);
		// 		}
		// 		fragments.core.update(true);
		// 	}, 10000);
		// }
	// }, 10);

}


