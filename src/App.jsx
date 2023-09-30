import {
	Viewer,
	Ion,
	Cartesian3,
	createOsmBuildingsAsync,
	Color,
	JulianDate,
	SampledPositionProperty,
	TimeIntervalCollection,
	TimeInterval,
	PathGraphics,
	IonResource,
	VelocityOrientationProperty,
	Terrain,
} from 'cesium';

import flightData from './assets/flightData.js';
import { useEffect } from 'react';

const accessToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMDI4ODUwYS1hYzg5LTQ0ZWEtOWZmMC04ZjNlOWI4NjlkYjAiLCJpZCI6MTY4Mzk0LCJpYXQiOjE2OTU2MzU4NDh9.SNGjXAB_YsCAvH0afN2RmR6Dem_UD5rpIyP4x15rZOY';

function App() {
	/**
	 * @param {Viewer} viewer
	 */
	async function loadOSMBuildingsAysnc(viewer) {
		const osmBuildings = await createOsmBuildingsAsync();
		viewer.scene.primitives.add(osmBuildings);
	}

	useEffect(() => {
		const viewer = new Viewer('cesiumApp', { terrain: Terrain.fromWorldTerrain(), infoBox: false });

		Ion.defaultAccessToken = accessToken;

		loadOSMBuildingsAysnc(viewer);

		const timeStepInSeconds = 30;
		const totalSeconds = timeStepInSeconds * (flightData.length - 1);
		const start = JulianDate.fromIso8601('2020-03-09T23:10:00Z');
		const stop = JulianDate.addSeconds(start, totalSeconds, new JulianDate());
		viewer.clock.startTime = start.clone();
		viewer.clock.stopTime = stop.clone();
		viewer.clock.currentTime = start.clone();
		viewer.timeline.zoomTo(start, stop);
		// Speed up the playback speed 50x.
		viewer.clock.multiplier = 50;
		// Start playing the scene.
		viewer.clock.shouldAnimate = true;

		const positionProperty = new SampledPositionProperty();

		for (let i = 0; i < flightData.length; i++) {
			const dataPoint = flightData[i];

			// Declare the time for this individual sample and store it in a new JulianDate instance.
			const time = JulianDate.addSeconds(start, i * timeStepInSeconds, new JulianDate());
			const position = Cartesian3.fromDegrees(
				dataPoint.longitude,
				dataPoint.latitude,
				dataPoint.height
			);
			// Store the position along with its timestamp.
			// Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
			positionProperty.addSample(time, position);

			viewer.entities.add({
				description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
				position: position,
				point: { pixelSize: 10, color: Color.RED },
			});
		}

		async function loadModel() {
			// Load the glTF model from Cesium ion.
			const airplaneUri = await IonResource.fromAssetId(2295911);
			const airplaneEntity = viewer.entities.add({
				availability: new TimeIntervalCollection([new TimeInterval({ start: start, stop: stop })]),
				position: positionProperty,
				// Attach the 3D model instead of the green point.
				model: { uri: airplaneUri },
				// Automatically compute the orientation from the position.
				orientation: new VelocityOrientationProperty(positionProperty),
				path: new PathGraphics({ width: 3 }),
			});

			viewer.trackedEntity = airplaneEntity;
		}

		loadModel();

		return () => viewer.destroy();
	}, []);

	return (
		<>
			<div id="cesiumApp"></div>
		</>
	);
}

export default App;
