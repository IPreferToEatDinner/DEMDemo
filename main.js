import World from './World';

async function main() {
	const world = new World();

	world.init();

	world.registerHandlers();
}

main();
