let ww = window.innerWidth;
let wh = window.innerHeight;
const options = {
  bg: {
    // src: "https://res.cloudinary.com/dheeu8pj9/image/upload/v1540179278/HvSDhSJ.jpg",
    src: "/static/img/bluetick-bg-3950-2800.jpeg",
    ratio: 2800 / 3950
  },
  displacementMap: {
    intensity: 20,
    mouseDelay: 0.05,
    speed: 0.6,
    size: {
      height: 1000,
      width: 1000,
    },
    src: "https://res.cloudinary.com/dheeu8pj9/image/upload/v1540179223/filter_NRM.jpg",
    wrapMode: PIXI.WRAP_MODES.REPEAT
  }
};

const calculateResourceDimensions = (windowWidth, windowHeight, bgHeightToWidthRatio) => {
  console.log("window", windowHeight / windowWidth, "bg", bgHeightToWidthRatio);

  if (windowHeight / windowWidth < bgHeightToWidthRatio) {
    // Return a width that, when accounting for bg aspect ratio, fills the entire height
    return {width: windowWidth, height: windowWidth * bgHeightToWidthRatio};
  } else {
    // Return a height that, when accounting for bg aspect ratio, fills the entire width
    return {width: windowHeight / bgHeightToWidthRatio, height: windowHeight};
  }
}

const renderer = new PIXI.autoDetectRenderer({
  width: window.innerWidth,
  height: window.innerHeight
});

document.querySelector("#pixi-renderer-container").appendChild(renderer.view);
console.log(renderer.view);

const stage = new PIXI.Container();

let bgResource = null;
let displacementMapResource = null;

const pixiLoader = new PIXI.loaders.Loader();
pixiLoader.add("bg", options.bg.src);
pixiLoader.add("displacementMap", options.displacementMap.src);
pixiLoader.load((loader, { bg, displacementMap }) => {
  displacementMapResource = new PIXI.Sprite(displacementMap.texture);
  displacementMapResource.width = options.displacementMap.size.width;
  displacementMapResource.height = options.displacementMap.size.height;
  displacementMapResource.texture.baseTexture.wrapMode =
    options.displacementMap.wrapMode;

  bgResource = new PIXI.Sprite(bg.texture);
  bgResource.anchor.x = 0.5;
  bgResource.anchor.y = 0.5;
  // Pick up the anchor coordinate and shift it by x,y
  bgResource.x = ww / 2;
  bgResource.y = wh / 2;
  const resourceWidthHeight = calculateResourceDimensions(ww, wh, options.bg.ratio);
  // Prevent black edges from showing through due to distortion
  bgResource.height = resourceWidthHeight.height * 1.01;
  bgResource.width = resourceWidthHeight.width * 1.01;
  bgResource.interactive = true;
  bgResource.filters = [
    new PIXI.filters.DisplacementFilter(
      displacementMapResource,
      options.displacementMap.intensity
    )
  ];
  stage.addChild(bgResource, displacementMapResource);
});

let oldX = 0;
let oldY = 0;
let currentY = 0;
let currentX = 0;

// This causes the ripple to "follow" the mouse motion
/*
window.addEventListener("mousemove", e => {
  currentY = e.pageX;
  currentX = e.pageY;
});
*/

const ticker = new PIXI.ticker.Ticker();
ticker.stop();
ticker.add(deltaTime => {
  const diffX = currentY - oldX;
  const diffY = currentX - oldY;

  if (displacementMapResource) {
    displacementMapResource.x =
      displacementMapResource.x +
      options.displacementMap.speed -
      diffX * options.displacementMap.mouseDelay;
    displacementMapResource.y =
      displacementMapResource.y -
      options.displacementMap.speed +
      diffY * options.displacementMap.mouseDelay;
  }

  oldX = oldX + diffX * options.displacementMap.mouseDelay;
  oldY = oldY + diffY * options.displacementMap.mouseDelay;
  renderer.render(stage);
});
ticker.start();

window.addEventListener("resize", e => {
  ww = window.innerWidth;
  wh = window.innerHeight;
  const resourceWidthHeight = calculateResourceDimensions(ww, wh, options.bg.ratio);
  // Prevent black edges from showing through due to distortion
  bgResource.height = resourceWidthHeight.height * 1.01;
  bgResource.width = resourceWidthHeight.width * 1.01;
  bgResource.x = ww / 2;
  bgResource.y = wh / 2;
  renderer.resize(ww, wh);
});
