<script>
	import { T, useTask } from '@threlte/core';
	import { OrbitControls, SoftShadows } from '@threlte/extras';

	let rotation = 0;
	useTask((delta) => {
		rotation += delta;
	});
</script>

<T.PerspectiveCamera
	makeDefault
	position={[-1.2, 4.5, 8.8]}
	rotation={[-Math.PI / 12, -Math.PI / 24, -Math.PI / 96]}
></T.PerspectiveCamera>

<T.DirectionalLight
	position={[-8.8, 15, 0]}
	color="#B3C2FF"
	castShadow
	shadow.mapSize.width={1024}
	shadow.mapSize.height={1024}
	shadow.bias={0.0001}
/>
<T.AmbientLight color="#B3C2FF" castShadow />
<SoftShadows focus={10} size={12} samples={50} />

<T.GridHelper args={[10, 10]} position.y={-0.001} />

<T.Mesh position={[0, 1, 0]} rotation={[0, -Math.PI / 2 - Math.PI / 6, 0]} castShadow>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color="hotpink" />
</T.Mesh>

<T.Mesh rotation.x={-Math.PI / 2} receiveShadow>
	<T.CircleGeometry args={[4, 40]} />
	<T.MeshLambertMaterial color="white" />
</T.Mesh>
