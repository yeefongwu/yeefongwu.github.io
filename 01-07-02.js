// script.js

let text = document.getElementById("ex3-span");
let starttime;
let lastbg = { r: 255, g: 255, b: 255 };
let nextBg;

function createButton(color) {
    let button = document.createElement("button");
    button.textContent = color.charAt(0).toUpperCase() + color.slice(1);
    button.onclick = function () {
        text.innerText = `some text that will become ${color.toUpperCase()}`;
        nextBg = color;
        changeColor();
    };
    document.body.appendChild(button);
}

createButton('red');
createButton('yellow');
createButton('green');

function changeColor(timestamp) {
    if (starttime === undefined) starttime = timestamp;
    let progress = (timestamp - starttime) / 2000;
    progress = Math.min(progress, 1);

    let r = Math.round((1-progress) * lastbg.r + progress * stringToRgb(nextBg).r);
    let g = Math.round((1-progress) * lastbg.g + progress * stringToRgb(nextBg).g);
    let b = Math.round((1-progress) * lastbg.b + progress * stringToRgb(nextBg).b);

    text.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    if (progress >= 1) {
        starttime = undefined; 
        lastbg = stringToRgb(nextBg);
        return;
    }

    window.requestAnimationFrame(changeColor);
}


function stringToRgb(colorName) {
    let hiddenElement = document.createElement('div');
    hiddenElement.style.color = colorName;
    hiddenElement.style.display = 'none';
    document.body.appendChild(hiddenElement);
    let computedColor = window.getComputedStyle(hiddenElement).color;
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = computedColor;
    ctx.fillRect(0, 0, 1, 1);
    let pixel = ctx.getImageData(0, 0, 1, 1).data;
    document.body.removeChild(hiddenElement);
    return { r: pixel[0], g: pixel[1], b: pixel[2] };
}
