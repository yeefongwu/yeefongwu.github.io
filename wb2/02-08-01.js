let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("box2canvas"));
let context = canvas.getContext('2d');
let fr = 5; // firework radius
let dr = 2; //dot radius
let shootTime = 1000; // 1s for shoot time

let fireworks = [];
let explodeDots = [];
let colors = ["red", "blue", "green", "purple", "orange"];

canvas.onclick = function (event) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    let box = event.target.getBoundingClientRect();
    mouseX -= box.left;
    mouseY -= box.top;
    fireworks.push({
        "x": mouseX,
        "y": mouseY,
        "color": colors[Math.floor(Math.random() * colors.length)],
        "releaseTime": performance.now(),
    });
};

function animate(timestamp) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    //firework
    fireworks.forEach(function (firework, index) {
        let progress = (timestamp - firework.releaseTime) / shootTime;
        if (progress >= 1) {//explode
            fireworks.splice(index, 1); 
            for(let i = 0;i<10;i++){
                let vx = (Math.random()-0.5)*5;
                let vy = (Math.random()-0.5)*5;
                explodeDots.push({"x":firework.x,"y":firework.y,"vx":vx, "vy":vy,"color": colors[Math.floor(Math.random() * colors.length)]});
            }
        } else {
            let currentY = canvas.height - progress * (canvas.height - firework.y);
            context.fillStyle = firework.color;
            context.beginPath();
            context.arc(firework.x, currentY,fr,0,2*Math.PI,true);
            context.closePath();
            context.fill();
        }
    });

    explodeDots.forEach(function (dot, index) {
        dot.y -= dot.vy;
        dot.x -= dot.vx;

        context.fillStyle = dot.color;
        context.beginPath();
        context.arc(dot.x, dot.y, dr, 0, 2 * Math.PI, true);
        context.closePath();
        context.fill();

        if (!(dot.y > 0 && dot.x > 0 && dot.x < canvas.width && dot.y < canvas.height)) {
            explodeDots.splice(index, 1); 
        }
    });

    window.requestAnimationFrame(animate);
}

animate();

document.body.appendChild(Object.assign(document.createElement('button'), { innerText: 'reset', onclick: () => { fireworks = []; context.clearRect(0, 0, canvas.width, canvas.height); } }));
