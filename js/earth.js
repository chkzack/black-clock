/**
 * 地球背景
 * 需要先引入THREEJS
 */
var camera,scene,renderer,container;
		
container = document.body;
renderer = new THREE.WebGLRenderer({ alpha:true, antialias: true });
renderer.setSize( window.innerWidth-5, window.innerHeight-5);

container.appendChild( renderer.domElement );

scene = new THREE.Scene();
//scene.background = new THREE.Color( 'rgba( 0, 0, 0, 0.5)' );
scene.background = new THREE.TextureLoader().load('img/bk1.jpg');

var SCREEN_WIDTH = window.innerWidth-5, SCREEN_HEIGHT = window.innerHeight-5;
var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 100000;
camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
scene.add(camera);
camera.position.set( 195, 514, 0 );
camera.lookAt( -10000, 510, 0 );

var light = new THREE.AmbientLight( 0xffffff, 0.9);
scene.add(light);

var plight = new THREE.PointLight( 0xffffff, 1);
plight.position.set( -5000, 10000, 0);
scene.add(plight);

var ball_g = new THREE.SphereBufferGeometry(500, 100, 100);
var ball_t = new THREE.TextureLoader().load('img/earth_lighter.jpg');
var ball_m = new THREE.MeshLambertMaterial({transparent:true, color:0xaaaaaa, map:ball_t, opacity:0.75, side:THREE.FrontSide});
var ball = new THREE.Mesh( ball_g, ball_m);
ball.position.set( 0, 0, 0);
scene.add(ball);

var animate = function () {
	requestAnimationFrame( animate );
	//ball.rotation.y += 0.00015;
	//ball.rotation.x -= 0.00015;
	ball.rotation.y += 0.005;
	if(camera.position.x <= 4000){
		if(camera.position.x >= 300){
			camera.position.x += 2;
			if(camera.position.x >= 800){
				camera.position.x += 3;
				ball.position.z -= 1;
			}
		}else{
			camera.position.x += 1;
		}
	}
	renderer.render( scene, camera );
};

animate();
