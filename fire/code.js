const ROOT = {};

const setupSeed = ($) => {
  for (let i = $.buffer.length - $.width; i < $.buffer.length; i += 1) {
    $.buffer[i] = $.palette.length - 1;
  }
};

const setup = () => {
  const canvas = document.getElementById('screen');
  ROOT.screen = canvas.getContext('2d');
  ROOT.width = parseInt(canvas.width, 10);
  ROOT.height = parseInt(canvas.height, 10);
  ROOT.buffer = new Uint8Array(ROOT.width * ROOT.height).fill(0);
  ROOT.palette = [
    0x000000, 0x110000, 0x220000, 0x330000, 0x440000, 0x551100,
    0x660000, 0x770000, 0x880000, 0xcc0000, 0xcc4400, 0xcc4400,
    0xcc4422, 0xcc5511, 0xcc5566, 0xcc6644, 0xee7766, 0xee8800,
    0xee8822, 0xee8855, 0xee9900, 0xee9922, 0xeeaa33, 0xeecc44,
    0xeecc55, 0xeecc66, 0xeecc77, 0xffee77, 0xffee84, 0xffee90,
    0xffee99, 0xffffaa, 0xffffbb, 0xffffcc, 0xffffdd, 0xffffff
  ];
  setupSeed(ROOT);
};


const calculateDecay = () => Math.floor(Math.random() * (1.15));

const calculateBehavior = (direction) => {
  let behavior = direction;
  if (direction === 0) {
    behavior = Math.floor(Math.random() * 4) % 2 ? 1 : -1;
  }
  return behavior;
};

const calculatePixel = ($, idx, decay, behavior) => {
  const paletteEnd = $.palette.length - 1;
  let position = idx + $.width;
  const reading = $.buffer[position] - decay;

  if ((position % $.width) < $.width - 1 || (position % $.height) < $.height - 1) {
    position += (behavior * decay);
  }

  if (reading < 0) {
    return 0;
  }
  if (reading > paletteEnd) {
    return paletteEnd;
  }
  return reading;
};

const propagate = ($, direction) => {
  if (direction !== 1 && direction !== -1) {
    direction = 0;
  }

  for (let i = $.buffer.length - $.width - 1; i >= 0; i -= 1) {
    $.buffer[i] = calculatePixel(
      $,
      i,
      calculateDecay(),
      calculateBehavior(direction)
    );
  }
};

const createImageDataFromBuffer = ($) => {
  let color;
  const image = $.screen.createImageData($.width, $.height);

  for (let i = 0, j = 0; i < $.buffer.length; i += 1, j = i * 4) {
    color = $.palette[$.buffer[i]];

    image.data[j + 0] = (color >> 16) & 0xFF;
    image.data[j + 1] = (color >> 8) & 0xFF;
    image.data[j + 2] = (color >> 0) & 0xFF;
    image.data[j + 3] = 0xFF;
  }

  return image;
};

const renderBuffer = ($) => {
  $.screen.putImageData(createImageDataFromBuffer($), 0, 0);
};

const mainLoop = () => {
  propagate(ROOT, 0);
  renderBuffer(ROOT);
};

window.addEventListener('load', () => {
  setup();
  window.mainLoopInterval = window.setInterval(mainLoop, 80);
});
