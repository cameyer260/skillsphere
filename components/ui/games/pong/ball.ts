export default class Ball {
    x: number;
    y: number;
    radius: number;
    maxVelocity: number;
    xVelocity: number;
    yVelocity: number;

    constructor(canvas: HTMLCanvasElement | null, turn: boolean) {
        if (!canvas) {
            this.x = 0;
            this.y = 0;
            this.radius = 0;
            this.xVelocity = 0;
            this.yVelocity = 0;
            this.maxVelocity = 0;
            return;
        }

        this.radius = 10;
        this.maxVelocity = 5;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.xVelocity = this.maxVelocity; // ball goes to the right on first point, alternates after that
        if (turn) this.xVelocity *= -1;
        this.yVelocity = 0;
    }

    move(canvas: HTMLCanvasElement, handleScore: () => void) {
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
            handleScore();
        }
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.yVelocity *= -1;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}
