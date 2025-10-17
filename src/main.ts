import './style.css'
import initToolbar from './ui/toolbar';
// import typetscriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'
// import * as OBC from "@thatopen/components";
// import * as THREE from 'three';
// import {Vector3} from 'three';
import { initWorld } from './world/world';

await initWorld();
await initToolbar();