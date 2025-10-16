
import * as OBC from "@thatopen/components";
import * as THREE from 'three';
import initController from './controler';
import { fog } from "three/tsl";

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


	const tMaterial = new THREE.MeshLambertMaterial({ color: "#6528D7", transparent: true, opacity: .5 });
	const geometry = new THREE.BoxGeometry(50,25,50);
	const cube = new THREE.Mesh(geometry, tMaterial);
	World.scene.three.add(cube);

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


