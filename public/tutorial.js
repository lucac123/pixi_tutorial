// * Aliases
const Application = PIXI.Application,
	  Container = PIXI.Container,
	  loader = PIXI.Loader.shared,
	  resources = PIXI.Loader.shared.resources,
	  TextureCache = PIXI.utils.TextureCache,
	  Sprite = PIXI.Sprite,
	  Rectangle = PIXI.Rectangle;

const app = new Application({
	antialias: true,
	resizeTo: window
});

const SCALE = 3;

const BLOCK_SIZE = 16*SCALE;

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;

document.body.appendChild(app.view);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;


const draw_height = { height: app.view.height };
const MOVE_SPEED = 5;

let galooeh, state;

loader
	.add('images/assets.json')
	.load(setup);
	
function setup () {
	drawGrass(1);
	drawRoad(3);
	drawGrass(1);
	drawRoad(1);
	drawGrass(2);
	drawRoad(2);
	drawGrass(1);
	drawRoad(4);

	galooeh = drawCharacter('galooeh.png', 0, 0);


	const left = keyboard("ArrowLeft"),
		  right = keyboard("ArrowRight"),
		  up = keyboard("ArrowUp"),
		  down = keyboard("ArrowDown");
	
	left.press = () => {
		galooeh.vx = -5;
	};
	left.release = () => {
		if (galooeh.vx < 0)
			galooeh.vx = 0;
	};

	right.press = () => {
		galooeh.vx = 5;
	};
	right.release = () => {
		if (galooeh.vx > 0)
			galooeh.vx = 0;
	}

	up.press = () => {
		galooeh.vy = -5;
	}
	up.release = () => {
		if (galooeh.vy < 0)
			galooeh.vy = 0;
	}

	down.press = () => {
		galooeh.vy = 5;
	}
	down.release = () => {
		if (galooeh.vy > 0)
			galooeh.vy = 0;
	}

	state = play;

	app.ticker.add(gameLoop);
}

let gameLoop = (delta) => {
	state(delta);
}

let play = (delta) => {
	galooeh.x += galooeh.vx*delta;
	galooeh.y += galooeh.vy*delta;
}

let drawCharacter = (sprite_name, x, y) => {
	let sprite = new Sprite(TextureCache[sprite_name]);
	sprite.scale.set(SCALE);

	sprite.anchor.set(0.5, 1);
	sprite.position.set(app.view.width/2 + (BLOCK_SIZE * x), app.view.height - BLOCK_SIZE*y - 3*SCALE);

	sprite.vx = 0;
	sprite.vy = 0;

	app.stage.addChild(sprite);
	return sprite;
}

let drawRoad = (lanes) => {
	if (lanes == 1)
		drawRow('road_one_lane.png');
	else if (lanes > 1) {
		drawRow('road_bot_lane.png');
		for (let i = lanes-2; i > 0; i--)
			drawRow('road_mid_lane.png');
		drawRow('road_top_lane.png');
	}
}

let drawGrass = (height) => {
	drawBlock('grass.png', height);
}

let drawBlock = (sprite_name, height) => {
	for (let i = 1; i <= height; i++)
		drawRow(sprite_name);
}

let drawRow = (sprite_name) => {
	let sprite;
	let i = 0;
	while (i < app.view.width) {
		sprite = new Sprite(TextureCache[sprite_name]);
		sprite.scale.set(SCALE);
		sprite.position.set(i, draw_height.height - sprite.height);

		app.stage.addChild(sprite);
		i += sprite.width;
	}
	draw_height.height -= sprite.height;
}

function keyboard(value) {
	const key = {};
	key.value = value;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;
	//The `downHandler`
	key.downHandler = (event) => {
	  if (event.key === key.value) {
		if (key.isUp && key.press) {
		  key.press();
		}
		key.isDown = true;
		key.isUp = false;
		event.preventDefault();
	  }
	};
  
	//The `upHandler`
	key.upHandler = (event) => {
	  if (event.key === key.value) {
		if (key.isDown && key.release) {
		  key.release();
		}
		key.isDown = false;
		key.isUp = true;
		event.preventDefault();
	  }
	};
  
	//Attach event listeners
	const downListener = key.downHandler.bind(key);
	const upListener = key.upHandler.bind(key);
	
	window.addEventListener("keydown", downListener, false);
	window.addEventListener("keyup", upListener, false);
	
	// Detach event listeners
	key.unsubscribe = () => {
	  window.removeEventListener("keydown", downListener);
	  window.removeEventListener("keyup", upListener);
	};
	
	return key;
  }