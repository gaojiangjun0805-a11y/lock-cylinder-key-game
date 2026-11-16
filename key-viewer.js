import * as THREE from './vendor/three.module.js';
const host=document.getElementById('viewer3d');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0x000000,0);host.appendChild(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,0.1,100);camera.position.set(0,0,7.5);const keyRoot=new THREE.Group();scene.add(keyRoot);
scene.add(new THREE.HemisphereLight(0xd5f2ff,0x22334a,2));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(-3,5,8);scene.add(light);const rim=new THREE.DirectionalLight(0x73bdeb,2.3);rim.position.set(4,-2,-5);scene.add(rim);
const metal=new THREE.MeshStandardMaterial({color:0xb2c3c9,metalness:.8,roughness:.26}),edge=new THREE.MeshStandardMaterial({color:0x889da5,metalness:.8,roughness:.34});
let current=null,dragging=false,lastX=0,lastY=0,rx=.45,ry=-.12;const station=[-1.32,-.50,.32,1.14],rise=[.33,.57,.81];
function mesh(g,m=metal){const o=new THREE.Mesh(g,m);o.castShadow=false;current.add(o);return o}
function build(values){if(current){keyRoot.remove(current);current.traverse(o=>{if(o.geometry)o.geometry.dispose()})}current=new THREE.Group();keyRoot.add(current);
 const core=mesh(new THREE.BoxGeometry(3.75,.30,.30));core.position.x=-.05;
 const shape=new THREE.Shape();shape.moveTo(-1.88,.14);shape.lineTo(1.83,.14);shape.lineTo(1.83,.19);for(let i=3;i>=0;i--){shape.lineTo(station[i]+.20,rise[values[0][i]]);shape.lineTo(station[i]-.20,rise[values[0][i]])}shape.lineTo(-1.88,.19);shape.closePath();
 function fin(index,angle){const p=new THREE.Shape();p.moveTo(-1.88,.13);p.lineTo(1.83,.13);p.lineTo(1.83,.19);for(let i=3;i>=0;i--){p.lineTo(station[i]+.20,rise[values[index][i]]);p.lineTo(station[i]-.20,rise[values[index][i]])}p.lineTo(-1.88,.19);p.closePath();const geom=new THREE.ExtrudeGeometry(p,{depth:.13,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:2,curveSegments:8});geom.translate(0,0,-.065);const fin=mesh(geom);fin.rotation.x=angle}
 fin(0,0);fin(1,Math.PI/2);fin(2,Math.PI);fin(3,-Math.PI/2);
 const bow=new THREE.Shape();bow.absellipse(-2.28,0,.66,.63,0,Math.PI*2,false,0);const hole=new THREE.Path();hole.absellipse(-2.28,0,.30,.28,0,Math.PI*2,true,0);bow.holes.push(hole);const bowGeom=new THREE.ExtrudeGeometry(bow,{depth:.24,bevelEnabled:true,bevelThickness:.035,bevelSize:.035,bevelSegments:3,curveSegments:40});bowGeom.translate(0,0,-.12);mesh(bowGeom);const neck=mesh(new THREE.BoxGeometry(.62,.30,.25),edge);neck.position.x=-1.84;
 current.position.x=.3;host.setAttribute('aria-label','钥匙三维模型：拖动旋转，四面可观察');}
function resize(){const rect=host.getBoundingClientRect();const w=Math.max(1,Math.floor(rect.width)),h=Math.max(1,Math.floor(rect.height));renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(host);resize();
function render(){keyRoot.rotation.x=rx;keyRoot.rotation.y=ry;renderer.render(scene,camera);requestAnimationFrame(render)}render();
host.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;host.setPointerCapture(e.pointerId);host.classList.add('dragging')});host.addEventListener('pointermove',e=>{if(!dragging)return;rx+=(e.clientX-lastX)*.012;ry=Math.max(-.75,Math.min(.75,ry+(e.clientY-lastY)*.008));lastX=e.clientX;lastY=e.clientY});function end(){dragging=false;host.classList.remove('dragging')}host.addEventListener('pointerup',end);host.addEventListener('pointercancel',end);
window.showKey3D=(i)=>{build(window.lockOptions[i]);rx=.45;ry=-.12;document.getElementById('viewer-label').textContent=`${'ABCDEFGHIJK'[i]} 号钥匙`;document.getElementById('viewer-hint').textContent='左右拖动，旋转查看钥匙四面'};
document.querySelectorAll('[data-side]').forEach(b=>b.addEventListener('click',()=>{rx={up:0,right:-Math.PI/2,down:Math.PI,left:Math.PI/2}[b.dataset.side];ry=0}));
window.showKey3D(0);document.getElementById('viewer-label').textContent='请选择一把钥匙';
