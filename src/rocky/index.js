var rocky = require('rocky');

var init = false,
    stageWidth,
    stageHeight,
    centerx,
    centery,
    ctx;
// 上下文缓存

var color = "mediumspringgreen";

var week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

rocky.on('draw', function(event) {
    if (!init) {
        ctx = event.context;
        // 缓存Canvas上下文
        stageWidth = ctx.canvas.clientWidth;
        stageHeight = ctx.canvas.clientHeight;
        centerx = stageWidth / 2;
        centery = stageHeight / 2;
        // 缓存舞台信息
        init = true;
        // 初始化完成
    }

    ctx.clearRect(0, 0, stageWidth, stageHeight);
    // 重绘舞台

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, stageWidth, stageHeight);

    ctx.fillStyle = "white";
    ctx.rockyFillRadial(centerx, stageHeight + 110, 0, 110 + 50, 0, 2 * Math.PI);

    var d = new Date();
    ctx.font = "49px Roboto-subset";
    ctx.textAlign = "center";
    ctx.fillText(fixtime(d.getHours()), centerx, centery - 75);
    ctx.fillText(fixtime(d.getMinutes()), centerx, centery - 30);

    ctx.fillStyle = color;
    ctx.font = "24px Gothic"
    ctx.fillText(week[d.getDay() - 1], centerx, stageHeight - 40);

});

rocky.on("minutechange", function() {
    rocky.requestDraw();
});

rocky.on('message', function(event) {
    var settings = event.data;
    color = cssColor(settings.color);
    rocky.requestDraw();
});

rocky.postMessage({ command: 'settings' });

function fixtime(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num;
    }
}

function cssColor(color) {
    if (typeof color === 'number') {
        color = color.toString(16);
    } else if (!color) {
        return 'transparent';
    }

    color = padColorString(color);

    return '#' + color;
}

function padColorString(color) {
    color = color.toLowerCase();

    while (color.length < 6) {
        color = '0' + color;
    }

    return color;
}