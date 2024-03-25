// Options

const numberOfParticles = 6000; // 생성할 입자의 수

const particleImg = // 입자 이미지의 URL을 저장하는 변수
		"https://motionarray.imgix.net/preview-34649aJ93evd9dG_0008.jpg?w=660&q=60&fit=max&auto=format",
	particleColor = "oxFFFFFF", // 입자의 색상
	particleSize = 0.2; // 입자의 크기

const defaultAnimationSpeed = 1;
const morphAnimationSpeed = -3; // 모프 애니메이션의 속도를 나타내는 변수

// Triggers
const triggers = document
	.getElementsByClassName("triggers")[0]
	.querySelectorAll("span");

var stats = new Stats();
stats.showPanel(0);

// Renderer
var renderer = new THREE.WebGLRenderer(); // WebGL 렌더러를 생성하는 변수
renderer.setPixelRatio(window.devicePixelRatio); // 픽셀 비율을 설정
renderer.setSize(window.innerWidth, window.innerHeight); // 렌더러의 크기를 설정
document.body.appendChild(renderer.domElement); // 렌더러를 문서에 추가

// Ensure Full Screen on Resize
function fullScreen() {
	camera.aspect = window.innerWidth / window.innerHeight; // 카메라의 가로 세로 비율 업데이트
	camera.updateProjectionMatrix();
	// 투영 행렬을 업데이트.. 카메라의 시야각, 종횡비, 근거리 평면 및 원거리 평면과 같은 매개변수를 고려하여 화면에 표시되는 3D 객체를 정확하게 렌더링하기 위해 사용

	renderer.setSize(window.innerWidth, window.innerHeight); // 렌더러의 크기를 조정하여 전체 화면 유지
}

window.addEventListener("resize", fullScreen, false); // 창 크기 변경 이벤트에 대한 리스너 추가

// Scene
var scene = new THREE.Scene(); // Scene을 생성하는 변수

// Camera and position
var camera = new THREE.PerspectiveCamera( // 피사체 카메라를 생성하는 변수
	45,
	window.innerWidth / window.innerHeight,
	1,
	10000
);

camera.position.y = 25; // 카메라의 y 좌표
camera.position.z = 36; // 카메라의 z 좌표

// Orbit Controls
var controls = new THREE.OrbitControls(camera); // 카메라 컨트롤을 생성하는 변수
controls.update(); // 컨트롤을 업데이트

// Particle Vars
var particleCount = numberOfParticles; // 입자 수

let spherePoints, cubePoints, rocketPoints, spacemanPoints; // 입자들의 위치를 저장할 변수

var particles = new THREE.Geometry(), // 입자들을 포함하는 Geometry 객체
	sphereParticles = new THREE.Geometry(), // 구 형태 입자를 포함하는 Geometry 객체
	cubeParticles = new THREE.Geometry(), // 상자 형태 입자를 포함하는 Geometry 객체
	rocketParticles = new THREE.Geometry(), // 로켓 모양 입자를 포함하는 Geometry 객체
	spacemanParticles = new THREE.Geometry(); // 우주인 모양 입자를 포함하는 Geometry 객체

var pMaterial = new THREE.PointCloudMaterial({
	// 입자를 렌더링하는 데 사용되는 재질을 설정하는 변수
	color: particleColor, // 입자의 색상
	size: particleSize, // 입자의 크기
	map: THREE.ImageUtils.loadTexture(particleImg), // 입자의 텍스처
	blending: THREE.AdditiveBlending, // 입자 간 혼합 방법
	transparent: true, // 투명한 입자를 설정
});

// Objects

var geometry = new THREE.SphereGeometry(5, 30, 30); // 구 형태의 Geometry를 생성하는 변수

spherePoints = THREE.GeometryUtils.randomPointsInGeometry(
	// Geometry 내에서 무작위로 점을 생성하여 저장
	geometry,
	particleCount
);

var geometry = new THREE.BoxGeometry(9, 9, 9); // 상자 형태의 Geometry를 생성하는 변수

cubePoints = THREE.GeometryUtils.randomPointsInGeometry(
	// Geometry 내에서 무작위로 점을 생성하여 저장
	geometry,
	particleCount
);

// Custom Objects
const codepenAssetUrl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/605067/"; // 사용자 정의 객체의 URL

var objLoader = new THREE.OBJLoader(); // OBJ 파일을 로드하는 OBJLoader 객체 생성

objLoader.setPath(codepenAssetUrl); // 로드할 OBJ 파일의 경로 설정
objLoader.load("CartoonRocket.obj", function (object) {
	// CartoonRocket.obj 파일을 로드하는 함수
	object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
			// Mesh 객체인 경우에만 실행
			let scale = 2.1; // 크기 비율

			let area = new THREE.Box3(); // 바운딩 박스 생성
			area.setFromObject(child); // 객체의 바운딩 박스 설정
			let yOffset = (area.max.y * scale) / 2; // y 오프셋 계산

			child.geometry.scale(scale, scale, scale); // Geometry의 크기 조정
			rocketPoints = THREE.GeometryUtils.randomPointsInBufferGeometry(
				// Geometry 내에서 무작위로 점을 생성하여 저장
				child.geometry,
				particleCount
			);
			createVertices(rocketParticles, rocketPoints, yOffset, 2); // Vertex 생성 함수 호출
		}
	});
});

var objLoader = new THREE.OBJLoader(); // OBJ 파일을 로드하는 OBJLoader 객체 생성

objLoader.setPath(codepenAssetUrl); // 로드할 OBJ 파일의 경로 설정
objLoader.load("Astronaut.obj", function (object) {
	// Astronaut.obj 파일을 로드하는 함수
	object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
			// Mesh 객체인 경우에만 실행
			let scale = 4.6; // 크기 비율

			let area = new THREE.Box3(); // 바운딩 박스 생성
			area.setFromObject(child); // 객체의 바운딩 박스 설정
			let yOffset = (area.max.y * scale) / 2; // y 오프셋 계산

			child.geometry.scale(scale, scale, scale); // Geometry의 크기 조정
			spacemanPoints = THREE.GeometryUtils.randomPointsInBufferGeometry(
				// Geometry 내에서 무작위로 점을 생성하여 저장
				child.geometry,
				particleCount
			);
			createVertices(spacemanParticles, spacemanPoints, yOffset, 3); // Vertex 생성 함수 호출
		}
	});
});

// Particles
for (var p = 0; p < particleCount; p++) {
	// 입자의 수만큼 반복
	var vertex = new THREE.Vector3(); // 새로운 Vector3 객체 생성
	vertex.x = 0; // x 좌표 설정
	vertex.y = 0; // y 좌표 설정
	vertex.z = 0; // z 좌표 설정

	particles.vertices.push(vertex); // 입자 배열에 추가
}

createVertices(sphereParticles, spherePoints, null, null); // 구 형태 입자의 Vertex 생성 함수 호출
createVertices(cubeParticles, cubePoints, null, 1); // 상자 형태 입자의 Vertex 생성 함수 호출

function createVertices(emptyArray, points, yOffset = 0, trigger = null) {
	// Vertex를 생성하는 함수
	for (var p = 0; p < particleCount; p++) {
		// 입자의 수만큼 반복
		var vertex = new THREE.Vector3(); // 새로운 Vector3 객체 생성
		vertex.x = points[p]["x"]; // x 좌표 설정
		vertex.y = points[p]["y"] - yOffset; // y 좌표 설정
		vertex.z = points[p]["z"]; // z 좌표 설정

		emptyArray.vertices.push(vertex); // 빈 배열에 Vertex 추가
	}
	if (trigger !== null) {
		// 트리거가 null이 아닌 경우
		triggers[trigger].setAttribute("data-disabled", false); // 트리거의 data-disabled 속성을 false로 설정
	}
}

var particleSystem = new THREE.PointCloud(particles, pMaterial); // 입자 시스템 생성

particleSystem.sortParticles = true; // 입자 정렬 설정

// Add the particles to the scene
scene.add(particleSystem); // 입자 시스템을 Scene에 추가

// Animate
const normalSpeed = defaultAnimationSpeed / 100, // 애니메이션의 기본 속도
	fullSpeed = morphAnimationSpeed / 100; // 모프 애니메이션의 속도

let animationVars = {
	// 애니메이션 변수
	speed: normalSpeed, // 속도
};

function animate() {
	// 애니메이션 함수
	stats.begin(); // 성능 통계 시작
	particleSystem.rotation.y += animationVars.speed; // 입자 시스템 회전
	particles.verticesNeedUpdate = true; // 입자의 Vertex 업데이트 필요

	stats.end(); // 성능 통계 끝

	window.requestAnimationFrame(animate); // 다음 프레임 요청
	renderer.render(scene, camera); // Scene 렌더링
}

animate(); // 애니메이션 시작
setTimeout(toSphere, 500); // 0.5초 후에 구 형태로 변경하는 함수 호출

function toSphere() {
	// 구 형태로 변경하는 함수
	handleTriggers(0); // 트리거 처리
	morphTo(sphereParticles); // 구 형태로 모프
}

function toCube() {
	// 상자 형태로 변경하는 함수
	handleTriggers(1);
	morphTo(cubeParticles);
}

function toRocket() {
	// 로켓 형태로 변경하는 함수
	handleTriggers(2);
	morphTo(rocketParticles);
}

function toSpaceman() {
	// 우주인 형태로 변경하는 함수
	handleTriggers(3);
	morphTo(spacemanParticles);
}

function morphTo(newParticles, color = "0xffffff") {
	// 새로운 입자로 모프하는 함수
	TweenMax.to(animationVars, 0.3, {
		// TweenMax 라이브러리를 사용하여 애니메이션 속도 조절
		ease: Power4.easeIn, // 이징 함수 설정
		speed: fullSpeed, // 애니메이션 속도 설정
		onComplete: slowDown, // 애니메이션 완료 후 실행될 함수 설정
	});
	particleSystem.material.color.setHex(color); // 입자 시스템의 색상 설정

	for (var i = 0; i < particles.vertices.length; i++) {
		// 입자의 수만큼 반복
		TweenMax.to(particles.vertices[i], 4, {
			// TweenMax 라이브러리를 사용하여 입자의 위치 조절
			ease: Elastic.easeOut.config(1, 0.75), // 이징 함수 설정
			x: newParticles.vertices[i].x, // x 좌표 설정
			y: newParticles.vertices[i].y, // y 좌표 설정
			z: newParticles.vertices[i].z, // z 좌표 설정
		});
	}
}

function slowDown() {
	// 속도를 줄이는 함수
	TweenMax.to(animationVars, 4, {
		// TweenMax 라이브러리를 사용하여 애니메이션 속도 조절
		ease: Power2.easeOut, // 이징 함수 설정
		speed: normalSpeed, // 기본 속도로 설정
		delay: 1, // 지연 시간 설정
	});
}

triggers[0].addEventListener("click", toSphere);
triggers[1].addEventListener("click", toCube);
triggers[2].addEventListener("click", toRocket);
triggers[3].addEventListener("click", toSpaceman);

function handleTriggers(disable) {
	// 트리거를 처리하는 함수
	for (var x = 0; x < triggers.length; x++) {
		// 트리거의 수만큼 반복
		if (disable === x) {
			// 비활성화할 트리거인 경우
			triggers[x].setAttribute("data-disabled", true); // data-disabled 속성을 true로 설정
		} else {
			triggers[x].setAttribute("data-disabled", false); // 그 외의 경우 data-disabled 속성을 false로 설정
		}
	}
}
