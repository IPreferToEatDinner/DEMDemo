import { Cartesian3, CesiumTerrainProvider, Ion, Terrain, Viewer } from 'cesium';
import enrollHeightGetter from './handler/enrollHeightGetter';

export default class World {
	/**
	 *@type {Viewer}
	 */
	#viewer;

	constructor() {
		Ion.defaultAccessToken =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMDI4ODUwYS1hYzg5LTQ0ZWEtOWZmMC04ZjNlOWI4NjlkYjAiLCJpZCI6MTY4Mzk0LCJpYXQiOjE2OTU2MzU4NDh9.SNGjXAB_YsCAvH0afN2RmR6Dem_UD5rpIyP4x15rZOY';
	}

	init() {
		this.#viewer = new Viewer('cesiumApp', {
			infoBox: false,
		});

		const terrainProvider = CesiumTerrainProvider.fromIonAssetId(2323715);

		this.#viewer.scene.setTerrain(new Terrain(terrainProvider));

		this.#viewer.camera.flyTo({ destination: Cartesian3.fromDegrees(111.48, 27.13, 40000) });
	}

	registerHandlers() {
		enrollHeightGetter(this.#viewer);
	}

	mountVideo() {
		// 获取视频元素
		const videoElement = document.getElementById('myVideo');
		// 创建实体对象
		const rectangle = this.#viewer.entities.add({
			rectangle: {
				coordinates: Cesium.Rectangle.fromDegrees(-80.0, 39.0, -79.0, 40.0),
				material: videoElement,
			},
		});
		// 锁定实体对象（这句可有可无）
		this.#viewer.camera.flyTo({ destination: rectangle.position });
	}
}
