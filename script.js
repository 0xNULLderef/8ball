

function Ball(x, y, number) {
    this.x = x;
    this.y = y;
    this.rotationX = 0;
    this.rotationY = 0;
    this.r = 16;

    this.arcToDeg = (Math.PI * (this.r ** 2)) / 360;

    this.velocityX = 0;
    this.velocityY = 0;
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

    const circleFrontContainer = document.createElement('div');
    ball.append(circleFrontContainer);

    const circleFront = document.createElement('div');
    circleFront.classList.add('circle', 'circle-front');
    circleFrontContainer.append(circleFront);

    const circleText = document.createElement('div');
    circleFront.classList.add('circle-text');
    circleFront.append(circleText);

    circleText.append(document.createTextNode(number));

    this.element = ball;

    this.update();
}

Ball.prototype.update = function(frameTime) {
    if(frameTime) {
        const frameX = this.velocityX / frameTime;
        const frameY = this.velocityY / frameTime;

        this.x += frameX;
        this.y += frameY;
        
        this.rotationX += frameX * this.arcToDeg;
        this.rotationY -= frameY * this.arcToDeg;

        this.velocityX *= 1 - this.friction;
        this.velocityY *= 1 - this.friction;
    }
    this.element.style.marginTop = `${this.x}px`;
    this.element.style.marginLeft = `${this.y}px`;
    this.element.style.setProperty('--rotationX', `${this.rotationX}deg`);
    this.element.style.setProperty('--rotationY', `${this.rotationY}deg`);
}

// const thirteen = ;/  
const eight = new Ball(0, 0, 8);
document.body.append(eight.element);
eight.velocityX = 30;
eight.velocityY = 5;
// document.body.append(new Ball(0, 0, 8).element);

let lastTimeStamp = 0;
const animate = timeStamp => {
    // const timeStampNonNaN = timeStamp ?? 16;
    const frameTime = timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;
    eight.update(frameTime);

    requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
