class Boid {
    constructor(x, y, vx = 1, vy = 0) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = "black"; 
        this.collisionCounter = 0; 
        this.steerCounter = 20;
        this.collided = false; 
    }

    draw(context) {
        if (this.collisionCounter > 0) {
            this.color = "red"; 
            this.collisionCounter--;
        } else {
            this.color = "black"; 
        }
        
        context.save();
        context.translate(this.x, this.y);
        context.rotate(Math.atan2(this.vy, this.vx) + Math.PI / 2);
    
        //head and whisker
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(0, 5, 5, 0, 2 * Math.PI, true);
        context.fill();
        context.closePath();

        context.beginPath();
        context.lineWidth=1;
        context.moveTo(0,5);
        context.lineTo(-10,-10);
        context.moveTo(0,5);
        context.lineTo(10,-10);
        context.stroke();
        context.closePath();
   


        context.beginPath();
        context.lineWidth = 3;

        //leg
        for(let i=0;i<2;i++){
            context.save();
            context.translate(0,20+i*10);
            context.rotate(i%2==0 ? leg_angle/180*Math.PI : -leg_angle/180*Math.PI);
            context.moveTo(0,0);
            context.lineTo(-15,(i-1)*5);
            context.moveTo(0,0);
            context.lineTo(15,(i-1)*5);  
            context.stroke();
            context.restore();
        }

        context.closePath();


        //body
        context.beginPath();
        context.ellipse(0, 25, 5, 20, 0, 0, 2 * Math.PI, true);
        context.fillStyle = "green";
        context.fill();
    
        context.restore();
    }
    
    steer(flock) {

        if(this.steerCounter>0){
            this.steerCounter-=1;
        }else{
            this.steerCounter=20;
            const angle = 2 * Math.PI / 180;
            const s = Math.sin(angle);
            const c = Math.cos(angle);
    
            let ovx = this.vx;
            let ovy = this.vy;
    
            this.vx =  ovx * c + ovy * s;
            this.vy = -ovx * s + ovy * c;
        }

        this.collided = false; // Reset collision flag each frame
        flock.forEach(other => {
            if (other !== this) {
                const dx = this.x - other.x;
                const dy = this.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 20) { // Simple collision detection
                    this.collided = true; // Mark both boids as collided
                    other.collided = true;
                    // Simple bounce logic
                    this.vx = -this.vx;
                    this.vy = -this.vy;
                    other.vx = -other.vx;
                    other.vy = -other.vy;
                }
            }
        });



    }
}



 /** @type Array<Boid> */
let boids = [];
let leg_angle = 0;
let rr=true;


let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("flock"));
let context = canvas.getContext("2d");

let speedSlider = /** @type {HTMLInputElement} */ (document.getElementById("speed"));

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    boids.forEach(boid => boid.draw(context));
}



/**
 * Create some initial boids
 * STUDENT: may want to replace this
 */
boids.push(new Boid(100, 100));
boids.push(new Boid(200, 200, -1, 0));
boids.push(new Boid(300, 300, 0, -1));
boids.push(new Boid(400, 400, 0, 1));

/**
 * Handle the buttons
 */
document.getElementById("add").onclick = function () {
    for (let i = 0; i < 10; i++) {
        boids.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2 - 1, Math.random() * 2 - 1));
    }
};
document.getElementById("clear").onclick = function () {
    boids = [];
    context.clearRect(0,0,canvas.width,canvas.height);
};

let lastTime; // will be undefined by default


function updateLegAngle(){
    if(leg_angle<=-10) rr = true;
    if(leg_angle>=10) rr=false;
    leg_angle += rr ? 0.5 : -0.5;
}

/**
 * The Actual Execution
 */
function loop(timestamp) {
    // time step - convert to 1/60th of a second frames
    // 1000ms / 60fps
    const delta = (lastTime ? timestamp-lastTime : 0) * 1000.0/60.0;
    let speed = Number(speedSlider.value);
    updateLegAngle();
    // change directions
    boids.forEach(boid => {
        boid.steer(boids);
        if (boid.x + boid.vx * speed > canvas.width || boid.x + boid.vx * speed < 0) {
            boid.vx *= -1;             
            boid.collisionCounter = 10;
        }
        if (boid.y + boid.vy * speed > canvas.height || boid.y + boid.vy * speed < 0) {
            boid.vy *= -1;
            boid.collisionCounter = 10;
        }
        boid.x += boid.vx * speed;
        boid.y += boid.vy * speed;
    });

    draw();
    // and loop
    window.requestAnimationFrame(loop);

}
// start the loop with the first iteration
window.requestAnimationFrame(loop);


