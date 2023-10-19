	import {
	Cartographic,
	Ion,
	ScreenSpaceEventHandler,
	ScreenSpaceEventType,
	Terrain,
	Viewer,
	defined,
	Math as CesiumMath,
} from 'cesium';

import { useEffect } from 'react';

Ion.defaultAccessToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMDI4ODUwYS1hYzg5LTQ0ZWEtOWZmMC04ZjNlOWI4NjlkYjAiLCJpZCI6MTY4Mzk0LCJpYXQiOjE2OTU2MzU4NDh9.SNGjXAB_YsCAvH0afN2RmR6Dem_UD5rpIyP4x15rZOY';

function App() {
	useEffect(() => {
		const viewer = new Viewer('cesiumApp', {
			infoBox: false,
			terrain: Terrain.fromWorldTerrain(),
		});

		const clickHandler = new ScreenSpaceEventHandler(viewer.scene.canvas);

		clickHandler.setInputAction((event) => {
			// 使用屏幕像素坐标制作视角射线
			const ray = viewer.camera.getPickRay(event.position);

			// 获得笛卡尔坐标系下的坐标
			let cartesianCoordinates = viewer.scene.globe.pick(ray, viewer.scene);

			if (defined(cartesianCoordinates)) {
				// WGS84下的大地坐标(弧度制)
				let cartographic = Cartographic.fromCartesian(cartesianCoordinates);

				let latitudeString = CesiumMath.toDegrees(cartographic.latitude).toFixed(3);
				let longitudeString = CesiumMath.toDegrees(cartographic.longitude).toFixed(3);
				let heightString = cartographic.height.toFixed(2);
				let lhtext = `Lat: ${latitudeString.slice(-8)}, Lon: ${longitudeString.slice(
					-8
				)}, Alt: ${heightString.slice(-7)}`;

				console.log(lhtext);

				console.log(viewer.scene.globe.getHeight(cartographic));
			}
		}, ScreenSpaceEventType.LEFT_CLICK);

		return () => viewer.destroy();
	});
	return (
		<>
			<div id="cesiumApp"></div>
		</>
	);
}

export default App;
