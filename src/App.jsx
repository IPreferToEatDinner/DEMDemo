import {
	Viewer,
	Ion,
	Terrain,
	Cartesian3,
	Math as CesiumMath,
	createOsmBuildingsAsync,
} from 'cesium';
import { useEffect } from 'react';

function App() {
	useEffect(() => {
		Ion.defaultAccessToken =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMDI4ODUwYS1hYzg5LTQ0ZWEtOWZmMC04ZjNlOWI4NjlkYjAiLCJpZCI6MTY4Mzk0LCJpYXQiOjE2OTU2MzU4NDh9.SNGjXAB_YsCAvH0afN2RmR6Dem_UD5rpIyP4x15rZOY';
		const viewer = new Viewer('cesiumApp', {
			terrain: Terrain.fromWorldTerrain(),
		});

		viewer.camera.flyTo({
			destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
			orientation: {
				heading: CesiumMath.toRadians(0, 0),
				pitch: CesiumMath.toRadians(-15.0),
			},
		});

		(async () => {
			const buildingTileset = await createOsmBuildingsAsync();
			viewer.scene.primitives.add(buildingTileset);
		})();

		return () => viewer.destroy();
	}, []);

	return (
		<>
			<div id="cesiumApp"></div>
		</>
	);
}

export default App;
