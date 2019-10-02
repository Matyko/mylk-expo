export default function (canvas) {
    let ctx,
        objects,
        stopped,
        highestAmount,
        gravity,
        damping,
        maxWidth;


    class Ball {

        constructor() {
            this.color = 'black';
            this.radius = Math.floor(Math.random() * 15);
            this.x = canvas.width / 2 + ((Math.random() - 0.5 ) * 100);
            this.y =  0 - this.radius * 2;
            this.px = this.x;
            this.py = this.y;
            this.vx = 0;
            this.vy = 5;
            this.lifetime = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            this.vy = this.y - this.py;
            this.vx = this.x - this.px;
            if (this.x + this.radius >= canvas.width) {
                this.vx = -this.vx * damping;
                this.x = canvas.width - this.radius;
            } else if (this.x - this.radius <= 0) {
                this.vx = -this.vx * damping;
                this.x = this.radius;
            }
            if (this.y + this.radius >= canvas.height) {
                this.vy = -this.vy * damping;
                this.y = canvas.height - this.radius;
            } else if (this.y - this.radius <= 0) {
                this.vy = -this.vy * damping;
                this.y = this.radius;
            }
            this.vy += gravity;
            this.vy = this.vy * (this.lifetime / 100000);
            let nx = this.x + this.vx;
            let ny = this.y + this.vy;
            this.px = this.x;
            this.py = this.y;
            this.x = nx;
            this.y = ny;
            this.lifetime++;
            this.draw();
        }
    }

    function init() {
        stopped = false;
        ctx = canvas.getContext('2d');
        objects = [];
        highestAmount = 1;
        gravity = 0.1;
        damping = 0.6;
        maxWidth = canvas.width > canvas.height ? canvas.height : canvas.width;
        for (let i = 0; i < 100; i ++) {
            setTimeout(() => {
                objects.push(new Ball())
            }, i * 200)
        }
        animate()
    }

    function resolveCollision() {
        let i = objects.length;
        if (i > 1) {
            while (i--) {
                let obj1 = objects[i];
                let n = objects.length;
                while (n--) {
                    if (n === i) continue;
                    let obj2 = objects[n];
                    let diffX = obj1.x - obj2.x;
                    let diffY = obj1.y - obj2.y;
                    let length = diffX * diffX + diffY * diffY;
                    let dist = Math.sqrt(length);
                    let realDist = dist - (obj1.radius + obj2.radius);
                    if (realDist < 0) {
                        let velX1 = obj1.x - obj1.px;
                        let velY1 = obj1.y - obj1.py;
                        let velX2 = obj2.x - obj2.px;
                        let velY2 = obj2.y - obj2.py;
                        let depthX = diffX * (realDist / dist);
                        let depthY = diffY * (realDist / dist);
                        obj1.x -= depthX * 0.5;
                        obj1.y -= depthY * 0.5;
                        obj2.x += depthX * 0.5;
                        obj2.y += depthY * 0.5;
                        let pr1 = damping * (diffX * velX1 + diffY * velY1) / length;
                        let pr2 = damping * (diffX * velX2 + diffY * velY2) / length;
                        velX1 += pr2 * diffX - pr1 * diffX;
                        velX2 += pr1 * diffX - pr2 * diffX;
                        velY1 += pr2 * diffY - pr1 * diffY;
                        velY2 += pr1 * diffY - pr2 * diffY;
                        obj1.px = obj1.x - velX1;
                        obj1.py = obj1.y - velY1;
                        obj2.px = obj2.x - velX2;
                        obj2.py = obj2.y - velY2
                    }
                }
            }
        }
    }

    function animate() {
        resolveCollision();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for (let i = 0; i < objects.length; i++) {
            objects[i].update();
        }
        if (objects.reduce(getArea, 0) > canvas.width * canvas.height * 0.9) {
            highestAmount++
        }
        window.requestAnimationFrame(animate);
    }

    function getArea(total, obj) {
        return total + obj.radius * obj.radius * Math.PI
    }

    init();
}
