let ww = window.innerWidth;
let wh = window.innerHeight;
const options = {
  bg: {
    src: "/static/img/bluetick-bg-3950-2800.jpeg",
    ratio: 2800 / 3950
  },
  displacementMap: {
    intensity: 0,
    maxIntensity: 20,
    mouseDelay: 0.05,
    speed: 0.6,
    size: {
      height: 1000,
      width: 1000,
    },
    src: "/static/img/displacement-map.jpg",
    wrapMode: PIXI.WRAP_MODES.REPEAT
  }
};

const calculateResourceDimensions = (windowWidth, windowHeight, bgHeightToWidthRatio) => {
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
  height: window.innerHeight,
  transparent: true,
});


const stage = new PIXI.Container();

let bgResource = null;
let displacementMapResource = null;
let displacementIntensityInterval = null;

const pixiLoader = new PIXI.loaders.Loader();
pixiLoader.add("bg", options.bg.src)
  .add("displacementMap", options.displacementMap.src);
pixiLoader.onComplete.add(() => {
  document.querySelector("#pixi-renderer-container").appendChild(renderer.view);
  // console.log('Done loading assets, ramping up intensity to', options.displacementMap.maxIntensity);
  displacementIntensityInterval = setTimeout(() => {
    setInterval(() => {
      if (options.displacementMap.intensity < options.displacementMap.maxIntensity) {
        options.displacementMap.intensity += 1;
      }
    }, 80);
  }, 2000); // slightly more than the time taken to fade in the canvas

})
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
  bgResource.height = resourceWidthHeight.height;
  bgResource.width = resourceWidthHeight.width;
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
  if (bgResource && options.displacementMap.intensity < options.displacementMap.maxIntensity) {
    // console.log('Intensity at', options.displacementMap.intensity, 'recreating displacement filter');
    bgResource.filters = [
      new PIXI.filters.DisplacementFilter(
        displacementMapResource,
        options.displacementMap.intensity
      )
    ];
  }
  if (options.displacementMap.intensity >= options.displacementMap.maxIntensity && displacementIntensityInterval) {
    // console.log('Max intensity reached, clearing ramp interval');
    clearInterval(displacementIntensityInterval);
    displacementIntensityInterval = null;
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
  bgResource.height = resourceWidthHeight.height;
  bgResource.width = resourceWidthHeight.width;
  bgResource.x = ww / 2;
  bgResource.y = wh / 2;
  renderer.resize(ww, wh);
});
