(function () {
    var $root = {};

    function setup() {
        $root.width = null;
        $root.height = null;
        $root.screen = null;
        $root.buffer = null;
        $root.palette = [
            0x000000, 0x110000, 0x220000, 0x330000, 0x440000, 0x551100,
            0x660000, 0x770000, 0x880000, 0xcc0000, 0xcc4400, 0xcc4400,
            0xcc4422, 0xcc5511, 0xcc5566, 0xcc6644, 0xee7766, 0xee8800,
            0xee8822, 0xee8855, 0xee9900, 0xee9922, 0xeeaa33, 0xeecc44,
            0xeecc55, 0xeecc66, 0xeecc77, 0xffee77, 0xffee84, 0xffee90,
            0xffee99, 0xffffaa, 0xffffbb, 0xffffcc, 0xffffdd, 0xffffff
        ];

        setupScreen($root);
        setupBuffer($root);
        setupSeed($root);
    }

    function mainLoop() {
        propagate($root, 0);
        renderBuffer($root);
    }

    window.addEventListener('load', function () {
        setup();
        window.mainLoopInterval = window.setInterval(mainLoop, 80);
    });

    function setupScreen ($) {
        canvas = document.querySelector('#screen');
        $.width = parseInt(canvas.width);
        $.height = parseInt(canvas.height);
        $.screen = canvas.getContext('2d');
    }

    function setupBuffer($) {
        $.buffer = new Uint8Array($.width * $.height).fill(0);
    }

    function setupSeed ($) {
        var i;

        for (i = $.buffer.length - $.width; i < $.buffer.length; i++) {
            $.buffer[i] = $.palette.length - 1;
        }
    };

    function propagate($, direction) {
        if (direction != 1 && direction != -1) {
            direction = 0;
        }
        
        for (var i = $.buffer.length - $.width - 1; i >= 0; i--) {
            $.buffer[i] = calculatePixel(
                $,
                i,
                calculateDecay(),
                calculateBehavior(direction));
        }
    }

    function renderBuffer ($) {
        $.screen.putImageData(createImageDataFromBuffer($), 0, 0);
    }

    function createImageDataFromBuffer ($) {
        var color, image = $.screen.createImageData($.width, $.height);

        for (var i = 0, j = 0; i < $.buffer.length; i++, j = i*4) {
            color = $.palette[$.buffer[i]];

            image.data[j + 0] = (color >> 16) & 0xFF;
            image.data[j + 1] = (color >> 8) & 0xFF;
            image.data[j + 2] = (color >> 0) & 0xFF;
            image.data[j + 3] = 0xFF;
        }

        return image;
    };

    function calculateDecay(reduction) {
        if (!reduction) {
            reduction = .15;
        }

        return Math.floor(Math.random() * (1+reduction));
    }

    function calculateBehavior(direction) {
        behavior = direction;
        if (direction == 0) {
            behavior = Math.floor(Math.random() * 4) % 2 ? 1 : -1;
        }

        return behavior;
    }
    
    function calculatePixel($, i, decay, behavior) {
        var reading, position, paletteEnd = $.palette.length - 1;

        position = i + $.width;
        if ((position % $.width) < $.width-1 || (position % $.height) < $.height-1) {
            position += (behavior * decay);
        }
        reading = $.buffer[position] - decay;

        if (reading < 0) {
            return 0;
        }

        if (reading > paletteEnd) {
            return paletteEnd;
        }

        return reading;
    }
})();
