<script>
	import { T, useTask } from '@threlte/core';
	import { OrbitControls, SoftShadows } from "@threlte/extras"

	let rotation = 0;
	useTask((delta) => {
		rotation += delta;
	});
</script>

<T.PerspectiveCamera makeDefault position={[-1.8, 4, 8.5]}>
</T.PerspectiveCamera>

<T.DirectionalLight position={[-8, 20, 20]} color="#B3C2FF" castShadow 
	shadow.mapSize.width={1024}
    shadow.mapSize.height={1024}
    shadow.bias={0.0001}/>
<T.AmbientLight color="#B3C2FF" castShadow/>
<SoftShadows focus={10} size={25} samples={50}/>

<T.GridHelper args={[10, 10]} position.y = {-0.001}/>

<T.Mesh position={[0, 1, 0]} rotation.y={rotation} castShadow>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color="hotpink" />
</T.Mesh>

<T.Mesh rotation.x={-Math.PI / 2} receiveShadow>
	<T.CircleGeometry args={[4, 40]} />
	<T.MeshLambertMaterial color="white" />
</T.Mesh>
