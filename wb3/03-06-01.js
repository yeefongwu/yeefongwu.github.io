// @ts-ignored
export {};
let rotateTime = 10000;
let propellerLength = 10;
let arm = 20;
let distance = 50; //distance from center to drone
let dw = 50; //drone width
let dh = 70;


// somewhere in your program you'll want a line
// that looks like:
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
let context = canvas.getContext('2d');

function drawQuadCopter(angle,tripodColor,droneColor){
    context.save();
    context.fillStyle = "green";
    context.fillRect(0,0,10,10);
    context.rotate(angle);
    context.save();
        context.fillStyle = droneColor;
        context.fillRect(dw,-dh / 2,dw,dh);
        context.fillStyle = tripodColor;
        context.beginPath();
        context.arc(distance + (dw / 2),angle>0 ? dh/2 : -dh/2,10,Math.PI,Math.PI*2,angle>0);
        context.closePath();
        context.fill();
        context.stroke();
    context.restore();

    for(let x = 0; x < 2; x++){
        for(let y = 0; y < 2; y++){
            context.save();
                context.lineWidth = 4;
                context.beginPath();
                context.moveTo(x ? distance : distance + dw, y ? -dh/2 : dh/2);
                context.lineTo(x ? distance-arm : distance+dw+arm, y ? -dh/2 - arm : dh/2+arm);
                context.closePath();
                context.fill();
                context.stroke();
                context.save();
                    context.translate(x ? distance-arm : distance+dw+arm, y ? -dh/2 - arm : dh/2+arm);
                    context.rotate((x+y+1)*2*angle);
                    context.beginPath();
                    context.lineWidth = 2;
                    context.arc(0,0,propellerLength,0,2*Math.PI,true);
                    context.moveTo(0,propellerLength);
                    context.lineTo(0,-propellerLength);
                    context.moveTo(propellerLength,0);
                    context.lineTo(-propellerLength,0);
                    context.closePath();
                    context.fill();
                    context.stroke();
                context.restore();
            context.restore();
        }
    }

    context.restore();
}

// and you will want to make an animation loop with something like:
/**
 * the animation loop gets a timestamp from requestAnimationFrame
 * 
 * @param {DOMHighResTimeStamp} timestamp 
 */
function loop(timestamp) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    let angle = (timestamp % rotateTime) / rotateTime * 360 * Math.PI / 180; // Angle in radian, rotates within 5 seconds
    context.save();
        context.scale(1, -1);
        context.translate(0, -canvas.height);
        context.save();
            context.translate(canvas.width/4,canvas.height/4);
            drawQuadCopter(angle,"yellow","#000000");
        context.restore();
        context.save();
            context.translate(canvas.width/1.5,canvas.height/1.5);
            drawQuadCopter(-angle,"red","#0000F7");
        context.restore();
    context.restore();
    window.requestAnimationFrame(loop);
};

// and then you would start the loop with:
window.requestAnimationFrame(loop);


