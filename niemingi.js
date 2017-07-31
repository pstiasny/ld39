"use strict";

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var noiseBuf = (function() {
    var bufferSize = 2 * audioCtx.sampleRate,
        noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
        output = noiseBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    return noiseBuffer;
})()
function makeNoise() {
    var whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuf;
    whiteNoise.loop = true;
    whiteNoise.connect(audioCtx.destination);
    return whiteNoise
}

function img(path) {
    var img = new Image()
    img.src = path;
    return img
}

function inlineImg(b64) {
    return img('data:image/png;base64,' + b64)
}

let types = {
    _: null, // continuation
    G: 0, // guy
    g: 1, // grass
    w: 2, // walkway
    c: 3, // caffe
    l: 4, // landmark
    P: 5, // guy taking a photo
    s: 6, // phone screen
    gy: 7, // gym
};

let images = {
    [types.G]: img('ludek1.png'),
    [types.g]: img('trawa.png'),
    [types.w]: img('chodnik_lr.png'),
    [types.c]: img('kaf1.png'),
    [types.l]: img('monum1.png'),
    [types.P]: img('photo.png'),
    [types.s]: img('phone.png'),
    building1: img('buliding1.png'),
    building2: img('buliding2.png'),
    building3: img('buliding3.png'),
    coffeeLogo1: img('coffeelogo1.png'),
    coffeeLogo2: img('coffeelogo2.png'),
    coffeeLogo3: img('coffeelogo3.png'),
    gymLogo: img('gymlogo.png'),
}

let ratings = {
    [types.g]: 0,
    [types.w]: 0,
    [types.c]: 1,
    [types.l]: 3,
    [types.gy]: 4,
}


const green = '#00aa00'
    , red = '#ff0000'
    ;

function Sprite(img) {
    this.draw = function(ctx, x, y) {
        ctx.drawImage(img, x, y, img.width * 2, img.height * 2)
    }

    return this
}

var variants = [
    [
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
        [1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
        [0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0],
        [0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    ],
]
var _walkways = variants[0];
let worldWidth = 8, worldHeight = 6;
var world, map, worldI, worldJ;
function canPlace(i, j, t) {
    let dim = mapItemDimensions(t)
    if ((t == types.c || t == types.gy) && (!(_walkways[j+2]||[])[i])) return false

    if (j + dim.r > _walkways.length) return false;
    for (let l = j; l < j + dim.r; ++l) {
        if (i + dim.c > _walkways[l].length) return false
        for (let k = i; k < i + dim.c; ++k) {
            if (_walkways[l][k]) return false;
        }
    }

    return true;
}
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}
function initMap() {
    var i, j;
    let map = [];
    for (j = 0; j < _walkways.length; ++j) {
        map.push([]);
    }

    let placeable = [
        types.g, types.g, types.g, types.c, types.c, types.l,
        types.gy];
    for (j = 0; j < _walkways.length; ++j) {
        for (i = 0; i < _walkways[j].length; ++i) {
            if (_walkways[j][i]) {
                map[j][i] = makeSpot(types.w, i, j);
            } else {
                if (map[j][i]) continue;
                shuffle(placeable);
                for (let t of placeable) {
                    if (canPlace(i, j, t)) {
                        let spot = makeSpot(t, i, j);
                        let dim = mapItemDimensions(t)
                        for (let k = i; k < i + dim.c; ++k)
                            for (let l = j; l < j + dim.r; ++l)
                                map[l][k] = spot;
                        break;
                    }
                }
            }
        }
    }
    return map;
}
function initWorld() {
    let i, j;
    world = [];
    for (j = 0; j < worldHeight; ++j) {
        let row = []
        for (i = 0; i < worldWidth; ++i) {
            _walkways = variants[Math.floor(Math.random() * variants.length)]
            row.push(initMap());
        }
        world.push(row);
    }
    worldI = 0; worldJ = 0; map = world[0][0];
}

var maxId = 1;
function makeSpot(t, i, j) {
    return { 
        type: t,
        id: maxId++,
        startI: i,
        startJ: j,
        awesome: ratings[t] || 0,
        seen: 0,
        dim: mapItemDimensions(t),
    };
}

function typeAt({i, j}) {
    return  map[j][i].type;
}

var buildingImages = [
    images.building1, images.building2, images.building3
];
var coffeeLogos = [
    images.coffeeLogo1, images.coffeeLogo2, images.coffeeLogo3
]
var drawFuns = {
    [types._]: function(ctx, type, x, y, dim) {
    },
    [types.c]: function(ctx, spot, x, y) {
        let dim = spot.dim;
        let b = buildingImages[spot.id % buildingImages.length];
        let l = coffeeLogos[(spot.id >> 2)  % coffeeLogos.length];
        ctx.drawImage(b, x, y + dim.vpad, dim.w, dim.h)
        ctx.drawImage(l, x, y + dim.vpad, dim.w, dim.h)
    },
    [types.gy]: function(ctx, spot, x, y) {
        let dim = spot.dim;
        let b = buildingImages[spot.id % buildingImages.length];
        ctx.drawImage(b, x, y + dim.vpad, dim.w, dim.h)
        ctx.drawImage(images.gymLogo, x, y + dim.vpad, dim.w, dim.h)
    },
}

function drawMapItem(ctx, spot, x, y) {
    let dim = spot.dim, type = spot.type;

    let drawFun = drawFuns[type];
    if (drawFun) return drawFun(ctx, spot, x, y);

    let img = images[type];
    if (!img) return;
    ctx.drawImage(images[type], x, y + dim.vpad, dim.w, dim.h)
}

function mapItemDimensions(type) {
    switch (type) {
        case types.c:
        case types.gy:
            return { r: 2, c: 2, w: 120, h: 120, vpad: 0 }
        default: return { r:1, c:1, w: 60, h: 66, vpad: -6 }
    }
}

let pos , battr , dead , money , followers , 
    currentContract, contractProposition, nextFollowers,
    nextPayPerFollower;

function photoArea({i, j}) {
    var awesome = 0, k, l, t, spotIds = new Set(), spots = [], noveltySum = 0;
    for (k = i - 1; k <= i + 1; ++k) {
        for (l = j - 1; l <= j + 1; ++l) {
            let spot = (map[l]||[])[k];
            if (!spot) continue;

            // make sure each spot is counted once
            if (spotIds.has(spot.id))
                continue;
            spotIds.add(spot.id)
            spots.push(spot);

            awesome += spot.awesome;
            let spotNovelty = 1 / (1 << spot.seen)
            noveltySum += spotNovelty;
        }
    }

    return {awesome, spots, novelty: noveltySum / spotIds.size};
}

function canMove(pos) {
    return typeAt(pos) == types.w;
}

function die() {
    dead = true; activeInputHandler = deadControls;

    var oscillator = audioCtx.createOscillator();
    oscillator.type = 'triange';
    oscillator.frequency.value = 120; // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1)

}

function useBattery(perc) {
    battr -= perc;
    if (battr <= 0) {
        battr = 0;
        die();
    }
}

function enterCaffe() { 
    let coffeePrice = 10;
    if (money < coffeePrice) {
        addPopMessage(playerX, playerY, 'You are broke', red)
        return;
    }
    battr = 100; money -= 10;
    addPopMessage(playerX, playerY - 10, 'Battery recharged', green)
    addPopMessage(playerX, playerY, '-$10', red)
}

function move(nextFun, canEnter) {
    let next = nextFun(pos), {i,j} = pos;
    let moved = false;

    if (next.i < 0) {
        worldI = (worldI - 1 + worldWidth) % worldWidth;
        pos.i = map[j].length - 1;
        moved = true;
    }
    else if (next.i >= map[j].length) {
        worldI = (worldI + 1) % worldWidth
        pos.i = 0
        moved = true;
    }
    else if (next.j < 0) {
        worldJ = (worldJ - 1 + worldHeight) % worldHeight
        pos.j = map.length - 1;
        moved = true;
    }
    else if (next.j >= map.length) {
        worldJ = (worldJ + 1) % worldHeight
        pos.j = 0
        moved = true;
    }
    else {

        let nextSpot = map[next.j][next.i];

        if (canEnter && nextSpot.type == types.c && nextSpot.startI == next.i) {
            enterCaffe();
        }

        if (!canMove(next)) 
            return;
        pos = next;
        moved = true;
    }

    map = world[worldJ][worldI];
    if (moved) {
        useBattery(5);

        var oscillator = audioCtx.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.value = 100; // value in hertz
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1)
    }
}
let goRight = move.bind(null, ({i, j}) => ({i: i+1, j}));
let goLeft = move.bind(null, ({i, j}) => ({i: i-1, j}));
let goUp = move.bind(null, ({i, j}) => ({i, j: j-1}), true);
let goDown = move.bind(null, ({i, j}) => ({i, j: j+1}));

function takePhoto() {
    activeInputHandler = lockedControls

    let photoArea_ = photoArea(pos)
      , totalAwesome = Math.round(
          photoArea_.novelty * photoArea_.awesome)
      ;
    for (let spot of photoArea_.spots)
        spot.seen++;
    guyType = types.P;
    setTimeout(flashSection, 1000);

    function flashSection() {
        useBattery(10);
        activateFlash();
        setTimeout(resetGuySection, 1000);
        let noise = makeNoise();
        noise.start();
        noise.stop(audioCtx.currentTime + 0.02);
    }

    function resetGuySection() {
        guyType = types.G;
        setTimeout(messageSection, 500);
    }

    function messageSection() {
        if (currentContract && followers >= currentContract.minFollowers) {
            let contractPay = followers * currentContract.payPerFollower;
            addPopMessage(playerX, playerY - 10, `Contract +\$${contractPay.toFixed(2)}`, green)
            money += contractPay;
        }

        if (totalAwesome > 0) {
            addPopMessage(playerX, playerY, `+${totalAwesome} followers`, green);
            followers += totalAwesome;
        } else {
            addPopMessage(playerX, playerY, 'Boring!', red);
        }

        if (!dead) {
            activeInputHandler = motionControls
            if (followers >= nextFollowers)
                proposeContract();
        }
    }
}

function motionControls(ev) {
    switch (ev.code) {
        case 'KeyD': case 'ArrowRight': goRight(); break;
        case 'KeyA': case 'ArrowLeft': goLeft(); break;
        case 'KeyW': case 'ArrowUp': goUp(); break;
        case 'KeyS': case 'ArrowDown': goDown(); break;
        case 'Space': takePhoto(); break;
        case 'KeyC': openCurrentContract(); break;
    }
}

function contractControls(ev) {
    switch (ev.code) {
        case 'KeyY': acceptContract(); break;
        case 'KeyN': declineContract(); break;
    }
}

function deadControls(ev) {
    if (ev.code == 'KeyR')
        reset();
}

function lockedControls(ev) {
}

function messageControls(ev) {
    //if (ev.code == 'Space') {
        message = null;
        activeInputHandler = motionControls;
    //}
}

var activeInputHandler = motionControls;
function input() {
    document.addEventListener('keydown', function(ev) {
        activeInputHandler(ev);
    });
}

var popMessages = [];
function addPopMessage(x, y, text, color) {
    popMessages.push({
        x: x,
        y: y,
        life: 2000,
        text,
        color,
    });
}
function drawPopMessages(ctx, step) {
    ctx.save()

    ctx.shadowColor = 'black';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 0;
    for (let message of popMessages) {
        ctx.fillStyle = message.color;
        ctx.fillText(message.text, message.x, message.y);
        message.y -= step * 0.005;
        message.life -= step;
    }

    popMessages = popMessages.filter(m => m.life > 0);

    ctx.restore()
}

function activateFlash() {
    flash = 0.6;
}
function drawFlash(ctx, dt) {
    if (flash > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flash})`;
        ctx.fillRect(playerX - 60, playerY, 3 * 60, 3 * 60)
        flash -= dt * 0.005
    }
}

function breakText(ctx, t, w) {
    let line = '';
    let lines = [];
    let words = t.split(' '), i = 0, lw = 0;
    while (i < words.length) {
        let word = (i ? ' ':'') + words[i];
        let m = ctx.measureText(' ' + word);
        if (m.width + lw > w) {
            lines.push(line);
            line = words[i];
            lw = m.width;
        } else {
            line += word;
            lw += m.width;
        }
        i++;
    }
    if (line.length>0) lines.push(line);
    return lines;
}

function proposeContract() {
    activeInputHandler = contractControls;
    contractProposition = {
        minFollowers: nextFollowers * 1.5,
        payPerFollower: nextPayPerFollower,
    };

    var oscillator = audioCtx.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 120; // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.4)

    var oscillator = audioCtx.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 120; // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start(audioCtx.currentTime + 0.8);
    oscillator.stop(audioCtx.currentTime + 1.2)
}
function acceptContract() {
    currentContract = contractProposition;
    contractProposition = null;
    activeInputHandler = motionControls;
    nextFollowers = followers * 2;
    nextPayPerFollower = nextPayPerFollower * 2;
}
function declineContract() {
    contractProposition = null;
    activeInputHandler = motionControls;
    nextFollowers = followers * 2;
    nextPayPerFollower = nextPayPerFollower * 2;
}
function fmtContract(c) {
    return `Get over ${c.minFollowers} followers. Receive \$${c.payPerFollower}/follower for each photo with ecorp shirt.`;
}
function openCurrentContract() {
    if (!currentContract) {
        setMessageBox('NO ACTIVE CONTRACT');
        return;
    }
    setMessageBox(fmtContract(currentContract))
}
function drawContract(ctx) {
    let screen = new Sprite(images[types.s])
    screen.draw(ctx, 20, 20);
    ctx.fillStyle = '#000000'
    ctx.fillText('NEW EMAIL', 50, 80);
    ctx.fillText('---------', 50, 100);
    ctx.fillText('From:', 50, 120);
    ctx.fillText(' marketing@ecorp.com', 50, 140);
    ctx.fillText('Subject:', 50, 160);
    ctx.fillText(' Contract opportunity', 50, 180);

    let y = 200;
    let lines = breakText(ctx, fmtContract(contractProposition), 180);
    for (let line of lines)
        ctx.fillText(line, 50, y += 20);

    if (currentContract) {
        ctx.fillText('Replace current', 50, y+=40);
        ctx.fillText('contract? (y/n)', 50, y+=20);
    } else {
        ctx.fillText('Accept? (y/n)', 50, y+=40);
    }

    if (currentContract) {
        drawMessageBox(ctx, 'Current contract: ' + fmtContract(currentContract));
    }
}

var message = null;
function setMessageBox(m) {
    message = m;
    activeInputHandler = messageControls;
}
function drawMessageBox(ctx, m) {
    let lines = breakText(ctx, m, 300);
    let h = lines.length * 20, y = 300 - h/2, w = 0;

    for (let line of lines) {
        let m = ctx.measureText(line);
        w = Math.max(m.width, w)
    }

    let x = 400 - w/2;

    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#0000aa';
    ctx.lineWidth = 4;
    ctx.fillRect(x - 10, y - 5, w + 20, h + 20);
    ctx.strokeRect(x - 10, y - 5, w + 20, h + 20);

    ctx.fillStyle = '#ffffff';

    for (let line of lines) {
        ctx.fillText(line, x, y += 20);
    }
}

var lastTime = null, playerX, playerY, flash = 0, guyType = types.G;
function draw(ctx, time = 0) {
    requestAnimationFrame(draw.bind(null, ctx));
    var dt = 0;
    if (lastTime) dt = time - lastTime;
    lastTime = time;

    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    ctx.font = '20px VT323,monospace';

    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, 800, 600)

    var i, j, type;
    for (j = 0; j < map.length; j++) {
        for (i = 0; i < map[j].length; i++) {
            let spot = map[j][i];
            if (spot.startI == i && spot.startJ == j)
                drawMapItem(ctx, spot, 10 + i * 60, 10 + j * 60);
        }
    }

    let s1 = new Sprite(images[guyType])
    playerX = 10 + pos.i * 60
    playerY = 10 + (pos.j - 1) * 60
    s1.draw(ctx, playerX, playerY);

    drawFlash(ctx, dt);

    drawPopMessages(ctx, dt);

    if (contractProposition)
        drawContract(ctx);

    if (message)
        drawMessageBox(ctx, message);

    ctx.fillStyle = '#ffffff'
    const messageY = 575;
    if (dead) {
        ctx.fillText('Your phone died. Press R to restart.', 10, messageY)
    } else {
        ctx.fillText(`Battery ${battr}% `, 10, messageY)
        ctx.fillText(`Money \$${money.toFixed(2)}`, 160, messageY)
        ctx.fillText(`Followers ${followers}`, 310, messageY)
        ctx.fillText('[C]ontract', 460, messageY)
    }
}

function reset() {
    initWorld();
    pos = {i: 0, j: 4}
    battr = 100
    dead = false
    money = 100;
    followers = 0;
    //proposeContract();
    activeInputHandler = motionControls
    nextFollowers = 10;
    nextPayPerFollower = 0.01
    currentContract = null;
    contractProposition = null;
}
reset();



!function() {
    var canv = document.createElement('canvas')
    canv.setAttribute('width', '800')
    canv.setAttribute('height', '600')
    document.body.appendChild(canv)

    draw(canv.getContext('2d'))
    input();
}()
