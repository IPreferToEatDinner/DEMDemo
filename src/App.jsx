import { Viewer, Ion } from 'cesium';
import { useEffect } from 'react';

function App() {
	useEffect(() => {
		Ion.defaultAccessToken =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMDI4ODUwYS1hYzg5LTQ0ZWEtOWZmMC04ZjNlOWI4NjlkYjAiLCJpZCI6MTY4Mzk0LCJpYXQiOjE2OTU2MzU4NDh9.SNGjXAB_YsCAvH0afN2RmR6Dem_UD5rpIyP4x15rZOY';
		const viewer = new Viewer('cesiumApp');

		return () => viewer.destroy();
	}, []);

	return (
		<>
			<div id="cesiumApp"></div>
		</>
	);
}

export default App;
