
import Vars from '../vars.ts';
import {World, WorldControl} from './world.ts'
import { Clock, Vector3, Vector2 } from 'three';


const config = {
	animation: {
		rotate: true
	}
}


export default function initController() {
	console.log('initController');

	const clock = new Clock();

	type KeyControls = {
		back:boolean, forward:boolean,
        right:boolean, left:boolean,
        up:boolean, down:boolean,
        azimuthRight: boolean, azimuthLeft: boolean, 
        polarUp: boolean, polarDown: boolean,
	}

	const keys:KeyControls = {
        back: false, forward: false,
        right: false, left: false,
        up: false, down: false,
        azimuthRight: false, azimuthLeft: false, 
        polarUp: false, polarDown: false,
    };
	const velosity = new Vector3();
	const angleVelosity = new Vector2();
	const tmpVector3 = new Vector3();

	const position = new Vector3();
	const look = new Vector3();

	async function animate() {
		const dist = World.camera.controls.distance;
		let speed = .2;// * dist;
        const elapsedTime = clock.getElapsedTime();

        // console.log(World.camera.controls.distance);
		requestAnimationFrame(animate);
		
		const angle = World.camera.controls.azimuthAngle;
		// y
		if(keys.up) velosity.y = speed;  
		if(keys.down) velosity.y = -speed;  

		// x,z
		if(keys.forward) {
			velosity.x = -Math.sin(angle)*speed; 
			velosity.z = -Math.cos(angle)*speed; 
		}
		if(keys.back) {
			velosity.x = Math.sin(angle)*speed;  
			velosity.z = Math.cos(angle)*speed;  
		}
		if(keys.right) {
			velosity.x = Math.sin(angle+Math.PI/2)*speed; 
			velosity.z = Math.cos(angle+Math.PI/2)*speed; 
		}
		if(keys.left) {
			velosity.x = -Math.sin(angle+Math.PI/2)*speed; 
			velosity.z = -Math.cos(angle+Math.PI/2)*speed;  
		}

		// angle
		if(keys.polarUp) angleVelosity.y += .01;
		if(keys.polarDown) angleVelosity.y -= .01;
		if(keys.azimuthRight) angleVelosity.x -= .01;
		if(keys.azimuthLeft) angleVelosity.x += .01;


		// if(keys.right) angleVelosity.x = -.1;
		// if(keys.left) angleVelosity.x = .1;  

		World.camera.controls.rotate(angleVelosity.x, angleVelosity.y);
		angleVelosity.multiplyScalar(.5);

		// console.log(position.x, World.camera.controls.camera.position.x);
		if(velosity.length() > .001) {
			// position.set(World.camera.controls.camera.lookAt(), World.camera.controls.camera.position.y, World.camera.controls.camera.position.z);
			// position = World.camera.controls.camera.position;

			World.camera.controls.getPosition(position);
			World.camera.controls.getTarget(look);

			position.distanceTo(look);

			tmpVector3.set(look.x - position.x, look.y - position.y, look.z - position.z);
			tmpVector3.normalize();

			position.add(velosity);
			// console.log(position);

			look.set(position.x, position.y, position.z);
			look.add(tmpVector3);

			await World.camera.controls.setLookAt(position.x, position.y, position.z, look.x, look.y, look.z);

			velosity.multiplyScalar(.5);

			WorldControl.update();

			await World.renderer?.dispose
		} else {
			if(Vars.animation.rotate.playing || Vars.animation.rotate.enabled) {
				await World.camera.controls.setLookAt(100*Math.cos(elapsedTime/5), 0, 100*Math.sin(elapsedTime/5), 0, 0, 0);
				WorldControl.update();
			}
		}
	}
	
	animate();


	const updateKeys = (e:KeyboardEvent, down:boolean) => {
		if(e.code == 'KeyW')	keys.forward = down;
		if(e.code == 'KeyS')	keys.back 	 = down;
		if(e.code == 'KeyD')	keys.right 	 = down;
		if(e.code == 'KeyA')	keys.left 	 = down;

		if(e.code == 'ArrowUp')		keys.polarUp = down;
		if(e.code == 'ArrowDown')	keys.polarDown 	 = down;
		if(e.code == 'ArrowRight')	keys.azimuthRight 	 = down;
		if(e.code == 'ArrowLeft')	keys.azimuthLeft 	 = down;

		// if(e.code == 'KeyW' || e.code == 'ArrowUp') 	keys.forward = down;
		// if(e.code == 'KeyS' || e.code == 'ArrowDown') 	keys.back 	 = down;
		// if(e.code == 'KeyD' || e.code == 'ArrowRight') 	keys.right 	 = down;
		// if(e.code == 'KeyA' || e.code == 'ArrowLeft') 	keys.left 	 = down;
		if(e.code == 'Space') keys.up = down;
		if(e.code == 'ShiftLeft') keys.down = down;
	} 
	window.addEventListener('keydown', e => updateKeys(e, true));
	window.addEventListener('keyup', e => updateKeys(e, false));
	window.addEventListener('click', () => Vars.animation.rotate.playing = false);

};