
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

	for(let section of Database.sections) {
		for(let packet of section.packets) {
			const shape = new THREE.Shape();
			let move = true;
			let pid = 0;
			for(let point of section.path) {
				const rotate = Math.PI;
				let x = Math.cos(rotate)*-point[0] - Math.sin(rotate)*point[1];
				let y = Math.sin(rotate)*-point[0] + Math.cos(rotate)*point[1];

				x += -53;
				y += 65;

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
					color: floor.fact ? 'green' : 'red', 
					transparent: true, 
					opacity: .25,
				});
				const glowMaterial = new THREE.MeshLambertMaterial({ 
					color: floor.fact ? 'green' : 'red', 
					transparent: true, 
					opacity: .15,
					depthTest: false,
				});
				const lineMaterial = new THREE.LineBasicMaterial({ 
					color: floor.fact ? 'green' : 'red', 
					side: THREE.BackSide, 
					linewidth: 20 
				})
	
				const mesh = new THREE.Mesh(geometry, baseMaterial);
				const glowMesh = new THREE.Mesh(geometry, glowMaterial);
				const lines = new THREE.LineSegments(egeometry, lineMaterial)
				glowMesh.position.y = lines.position.y = mesh.position.y = y + floor.height - 15;
				y += floor.height;

				WorldState.floors.push({
					section: section,
					packet: packet,
					floor: floor,

					material: baseMaterial,
					enable: (_e:boolean) => {
						if(_e) {
							baseMaterial.visible = true;
							lineMaterial.visible = true;
							glowMaterial.visible = true;
							console.log('enable');
							return;
						}
						baseMaterial.visible = false;
						lineMaterial.visible = false;
						glowMaterial.visible = false;
					}
				});
				World.scene.three.add(mesh, lines, glowMesh);
			}
		}
	}

	const objectAddListener = (e:{child:THREE.Object3D}) => {
		const obj = e.child;
		if(obj instanceof THREE.Mesh) {
			obj.translateX(0);
			if(obj.material instanceof THREE.MeshLambertMaterial) {
				obj.material.color.setHSL(obj.position.y/10%1,.5,.5);
				return;
			}
		} else console.warn(e);
		e.child.addEventListener("childadded", objectAddListener);
	};

	World.scene.three.addEventListener("childadded", objectAddListener);

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


