let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
let context = canvas.getContext('2d');

context.save();
    let gradient = context.createRadialGradient(250, 250, 0, 250, 250, 200);
    gradient.addColorStop(1, "red"); 
    gradient.addColorStop(0, "rgba(255, 255, 255, 0)"); //transparency
    context.fillStyle = gradient;
    context.strokeStyle = "black";
    context.lineWidth = 10;
    context.beginPath();
    context.arc(250, 250, 200, 0, 2 * Math.PI, true); //big circle
    context.moveTo(250, 50);
    context.lineTo(250, 250);
    context.moveTo(250 - 200 / Math.sqrt(2), 250 + 200 / Math.sqrt(2));
    context.lineTo(250, 250);
    context.moveTo(250 + 200 / Math.sqrt(2), 250 + 200 / Math.sqrt(2))
    context.lineTo(250, 250);
    context.fill();
    context.stroke();
context.restore();

context.save();//order
    context.fillStyle = "white";
    context.beginPath();
    context.arc(350,200,30,0,2*Math.PI,true);
    context.arc(150,200,30,0,2*Math.PI,true);
    context.fill();
context.restore();