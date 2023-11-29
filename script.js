function V2(x, y) {
    this.x = x ?? 0;
    this.y = y ?? 0;
}

V2.prototype.add = function(other) {
    return new V2(this.x + other.x, this.y + other.y);
}

V2.prototype.sub = function(other) {
    return new V2(this.x - other.x, this.y - other.y);
}

V2.prototype.mul = function(scalar) {
    return new V2(this.x * scalar, this.y * scalar);
}

V2.prototype.div = function(scalar) {
    return new V2(this.x / scalar, this.y / scalar);
}

V2.prototype.dot = function(other) {
    return this.x * other.x + this.y * other.y;
}

V2.prototype.length = function() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
}

V2.prototype.normalize = function() {
    return this.mul(1 / this.length());
}

function Ball(position, number) {
    this.position = position;
    this.rotation = new V2(0, 0);
    this.r = 16;

    this.arcToDeg = (Math.PI * (this.r ** 2)) / 360;

    this.velocity = new V2(0, 0);
    this.friction = 0.01;

    const ball = document.createElement('div');
    ball.id = `ball-${number}`;
    ball.classList.add('ball', 'stack');

    if(number > 8) {
        const circleTopContainer = document.createElement('div');
        ball.append(circleTopContainer);

        const circleTop = document.createElement('div');
        circleTop.classList.add('circle', 'circle-alt', 'circle-top');
        circleTopContainer.append(circleTop);

        const circleBottomContainer = document.createElement('div');
        ball.append(circleBottomContainer);
        const circleBottom = document.createElement('div');
        circleBottom.classList.add('circle', 'circle-alt', 'circle-bottom');
        circleBottomContainer.append(circleBottom);
    }

    if(number < 16) {
        const circleFrontContainer = document.createElement('div');
        ball.append(circleFrontContainer);

        const circleFront = document.createElement('div');
        circleFront.classList.add('circle', 'circle-front');
        circleFrontContainer.append(circleFront);

        const circleText = document.createElement('div');
        circleFront.classList.add('circle-text');
        circleFront.append(circleText);

        circleText.append(document.createTextNode(number));
    }

    this.element = ball;

    if(Ball.balls === undefined) Ball.balls = [];
    Ball.balls.push(this);
}

Ball.prototype.move = function(frameTime) {
    const frameOffset = this.velocity.div(frameTime);
    this.position = this.position.add(frameOffset);
    this.rotation = this.rotation.add(frameOffset.mul(this.arcToDeg));
    this.velocity = this.velocity.mul(1 - this.friction);
}

Ball.prototype.collide = function(frameTime) {
    Ball.balls.filter(other => other !== this).forEach((other, i) => {
        const centerDistance = this.position.sub(other.position).length();
        if(this.position.sub(other.position).length() < this.r + other.r) {
            const hitPosition = other.position.sub(this.position);
            const hitPositionNormalized = hitPosition.normalize();
            const hitDot = this.velocity.normalize().dot(hitPositionNormalized);

            const hitVelocity = this.velocity.sub(other.velocity).length(); 
            const velocityChange = hitPositionNormalized.mul(hitVelocity * hitDot);
            other.velocity = other.velocity.add(velocityChange);
            this.velocity = this.velocity.sub(velocityChange);
            this.position = this.position.sub(hitPositionNormalized);
        }
    });
}

Ball.prototype.update = function(frameTime) {
    if(frameTime) {
        this.move(frameTime);
        this.collide(frameTime);
    }

    this.element.style.marginTop = `${this.position.y}px`;
    this.element.style.marginLeft = `${this.position.x}px`;
    this.element.style.setProperty('--rotationX', `${-this.rotation.x}deg`);
    this.element.style.setProperty('--rotationY', `${this.rotation.y}deg`);
}

const right = new V2(32.5, 0);
const angle = 60 / 180 * Math.PI;
const down = new V2(Math.cos(angle) * 32.5, Math.sin(angle) * 32.5);
const origin = new V2(window.innerWidth / 2 - 32 * 3, 50);

const positions = [
    origin.add(down.mul(4)), // 1
    origin.add(down.mul(2).add(right.mul(2))), // 2
    origin.add(right), // 3
    origin.add(down), // 4
    origin.add(down.mul(3)), // 5
    origin.add(right.mul(4)), // 6
    origin.add(down).add(right.mul(2)), // 7
    origin.add(down.mul(2).add(right)), // 8
    origin.add(down).add(right.mul(3)), // 9
    origin.add(down.mul(2)), // 10
    origin.add(down.mul(3).add(right)), // 11
    origin, // 12
    origin.add(right.mul(2)), // 13
    origin.add(down).add(right), // 14
    origin.add(right.mul(3)), // 15
    origin.add(right.mul(2)).add(new V2(0.1, 300))
];

let balls = positions.map((position, index) => new Ball(position, index + 1));

// balls[15].velocity.y = -100;
// balls[15].velocity.x = -10;

const table = document.getElementById('table');
balls.forEach(ball => table.append(ball.element));

const divClientRect = table.getBoundingClientRect();
const divOffset = new V2(divClientRect.top, divClientRect.left);

let relativePosition = new V2(0, -1);

window.addEventListener('mousemove', event => {
    const clientPosition = new V2(event.clientX, event.clientY);
    const divPosition = clientPosition.sub(divOffset);
    relativePosition = balls[15].position.add(new V2(16, 16)).sub(divPosition);
    stick.style.setProperty('--rotationZ', `${180 - Math.atan2(relativePosition.x, relativePosition.y) / Math.PI * 180}deg`)
});

let pull = 5;
window.addEventListener('wheel', event => {
    if(stick.style.display != 'hidden') {
        pull += event.deltaY / 20;
        if(pull > 100) pull = 100;
        if(pull < 5) pull = 5;
    }
});

window.addEventListener('click', () => {
    if(stick.style.visibility != 'hidden') {
        balls[15].velocity = relativePosition.normalize().mul((pull ** 2) / 50 + 25);
        pull = 5;
        stick.style.visibility = 'hidden';
        console.log(stick.style.visibility);
    }
});

const stick = document.getElementById('stick');

let lastTimeStamp = 0;
const animate = timeStamp => {
    const frameTime = timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;
    balls.forEach(ball => ball.update(frameTime));
    
    if(stick.style.visibility != 'hidden') {
        let stickPos = balls[15].position.add(new V2(12, 32));
        stick.style.marginLeft = `${stickPos.x}px`;
        stick.style.marginTop = `${stickPos.y}px`;
        stick.style.setProperty('--pull', `${pull}px`);
    } else {
        if(balls[15].velocity.length() < 0.5) {
            balls[15].velocity = new V2(0, 0);
            stick.style.visibility = '';
        }
    }

    requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
