<script>
	import { T, useTask } from '@threlte/core';

	let rotation = 0;
	useTask((delta) => {
		rotation += delta;
	});
</script>

<T.PerspectiveCamera
	makeDefault
	position={[2, 3, 10]}
	oncreate={(ref) => {
		ref.lookAt(0, 1, 0);
	}}
/>

<T.DirectionalLight position={[0, 10, 10]} castShadow />

<T.Mesh position.y={1} rotation.y={rotation} castShadow>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color="hotpink" />
</T.Mesh>

<T.Mesh rotation.x={-Math.PI / 2} receiveShadow>
	<T.CircleGeometry args={[4, 40]} />
	<T.MeshStandardMaterial color="white" />
</T.Mesh>
