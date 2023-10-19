import {
	Cartographic,
	ScreenSpaceEventHandler,
	ScreenSpaceEventType,
	Viewer,
	defined,
	Math as CesiumMath,
} from 'cesium';

/**
 *@param {Viewer} viewer
 */
export default function enrollHeightGetter(viewer) {
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
}
