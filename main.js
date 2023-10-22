import World from './src/World';

async function main() {
	const world = new World();

	world.init();

	world.registerHandlers();

	// world.mountVideo();
}

main();
