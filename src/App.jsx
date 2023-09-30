import {
	Viewer,
	Ion,
	Terrain,
	Cartesian3,
	createOsmBuildingsAsync,
	IonResource,
	GeoJsonDataSource,
	ClassificationType,
	Cesium3DTileStyle,
	Cesium3DTileset,
} from 'cesium';

import { useEffect } from 'react';

const accessToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMDI4ODUwYS1hYzg5LTQ0ZWEtOWZmMC04ZjNlOWI4NjlkYjAiLCJpZCI6MTY4Mzk0LCJpYXQiOjE2OTU2MzU4NDh9.SNGjXAB_YsCAvH0afN2RmR6Dem_UD5rpIyP4x15rZOY';

function App() {
	useEffect(() => {
		const viewer = new Viewer('cesiumApp', { terrain: Terrain.fromWorldTerrain(), infoBox: false });

		Ion.defaultAccessToken = accessToken;

		viewer.camera.flyTo({
			destination: Cartesian3.fromDegrees(-104.9965, 39.74248, 4000),
		});

		async function addBuildingGeoJSON() {
			// Load the GeoJSON file from Cesium ion.
			const geoJSONURL = await IonResource.fromAssetId(2295981);
			// Create the geometry from the GeoJSON, and clamp it to the ground.
			const geoJSON = await GeoJsonDataSource.load(geoJSONURL, { clampToGround: true });
			// Add it to the scene.
			const dataSource = await viewer.dataSources.add(geoJSON);
			// By default, polygons in CesiumJS will be draped over all 3D content in the scene.
			// Modify the polygons so that this draping only applies to the terrain, not 3D buildings.
			for (const entity of dataSource.entities.values) {
				entity.polygon.classificationType = ClassificationType.TERRAIN;
			}
			// Move the camera so that the polygon is in view.
			viewer.flyTo(dataSource);
		}

		(async () => {
			const buildingsTileset = await createOsmBuildingsAsync();
			viewer.scene.primitives.add(buildingsTileset);

			await addBuildingGeoJSON();

			buildingsTileset.style = new Cesium3DTileStyle({
				show: {
					conditions: [
						// Any building that has this elementId will have `show = false`.
						['${elementId} === 332469316', false],
						['${elementId} === 332469317', false],
						['${elementId} === 235368665', false],
						['${elementId} === 530288180', false],
						['${elementId} === 530288179', false],
						// If a building does not have one of these elementIds, set `show = true`.
						[true, true],
					],
				},

				// Set the default color style for this particular 3D Tileset.
				// For any building that has a `cesium#color` property, use that color, otherwise make it white.
				color:
					"Boolean(${feature['cesium#color']}) ? color(${feature['cesium#color']}) : color('#ffffff')",
			});

			// STEP 6 CODE
			// Add the 3D Tileset you created from your Cesium ion account.
			const newBuildingTileset = await Cesium3DTileset.fromIonAssetId(2296027);
			viewer.scene.primitives.add(newBuildingTileset);

			// Move the camera to the new building.
			viewer.flyTo(newBuildingTileset);
		})();

		return () => viewer.destroy();
	}, []);

	return (
		<>
			<div id="cesiumApp"></div>
			<button onClick={() => []}>切换</button>
		</>
	);
}

export default App;
