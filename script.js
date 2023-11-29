const circle = document.getElementById('circle');

let rotation = 0;

function Ball(x, y) {
    this.x = x;
    this.y = y;
}

const table = document.getElementById('table');

const animate = () => {
    circle.style.transform = `rotateX(${rotation}deg)`;

    rotation += 2;
    // if(rotation > 360) rotation %= 360;

    requestAnimationFrame(animate);
};

animate();
