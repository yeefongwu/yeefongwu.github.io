let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("box2canvas"));
let context = canvas.getContext('2d');
let fr = 5; // firework radius
let dr = 2; //dot radius
let shootTime = 1000; // 1s for shoot time
let fadeTime = 3000; //fade out time

let fireworks = [];
let explodeDots = [];
let colors = ["#FF0000FF", "#FF7F00FF", "#FFFF00FF", "#00FF00FF", "#0000FFFF", "#4B0082FF", "#8B00FFFF"];

canvas.onclick = function (event) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    let box = event.target.getBoundingClientRect();
    mouseX -= box.left;
    mouseY -= box.top;
    fireworks.push({"x": mouseX, "y": mouseY, "rx": Math.random() * canvas.width, "color": colors[Math.floor(Math.random() * colors.length)], "releaseTime": performance.now()});

};

function adjustAlpha(color, alpha) {
    return color.replace(/.{2}$/, Math.round(alpha * 255).toString(16).padStart(2, '0').toUpperCase());
}

function animate(timestamp) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    //random firework
    if(Math.random()<0.01){
        fireworks.push({"x": Math.random() * canvas.width, "y": Math.random() * canvas.height, "rx": Math.random() * canvas.width, "color": colors[Math.floor(Math.random() * colors.length)], "releaseTime": performance.now()});
    }

    //firework
    fireworks.forEach(function (firework, index) {
        let progress = (timestamp - firework.releaseTime) / shootTime;
        if (progress >= 1) {//explode
            fireworks.splice(index, 1); 
            for(let i = 0;i<10;i++){
                let angle = (Math.random() - 0.5) * Math.PI * 0.5; 
                let speed = (Math.random()-0.5) * 5;
                let vx = speed * Math.cos(angle);
                let vy = speed * Math.sin(angle);
                explodeDots.push({"x":firework.x,"y":firework.y,"vx":vx, "vy":vy,"color": colors[Math.floor(Math.random() * colors.length)],"explodeTime":timestamp});
            }
        } else {
            let currentY = canvas.height - progress * (canvas.height - firework.y);
            let currentX = firework.rx > firework.x ? firework.rx - progress * (firework.rx - firework.x) : firework.rx + progress * (firework.x - firework.rx);
            context.fillStyle = adjustAlpha(firework.color,progress);
            context.beginPath();
            context.arc(currentX, currentY,fr,0,2*Math.PI,true);
            context.closePath();
            context.fill();
        }
    });

    explodeDots.forEach(function (dot, index) {
        let progress = (timestamp - dot.explodeTime) / fadeTime;
        if(progress>=1)explodeDots.splice(index, 1); 
        else{
            dot.y += dot.vy;
            dot.x += dot.vx;
            dot.vy += 0.05; //accelerate
    
            context.fillStyle = adjustAlpha(dot.color,1-progress);
            context.beginPath();
            context.arc(dot.x, dot.y, dr, 0, 2 * Math.PI, true);
            context.closePath();
            context.fill();
    
            if (!(dot.y > 0 && dot.x > 0 && dot.x < canvas.width && dot.y < canvas.height))  explodeDots.splice(index, 1); 
        }
    });

    window.requestAnimationFrame(animate);
}

animate();

document.body.appendChild(Object.assign(document.createElement('button'), { innerText: 'reset', onclick: () => { fireworks = []; explodeDots = []; context.clearRect(0, 0, canvas.width, canvas.height); } }));

