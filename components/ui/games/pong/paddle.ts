import Ball from "./ball";

export default class Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;

    constructor(side: string, canvas: HTMLCanvasElement | null) {
        // Handle case of null canvas
        if (!canvas) {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            this.speed = 0;
            return;
        }

        this.width = 0.02 * canvas.width;
        this.height = 0.25 * canvas.height;
        this.speed = 6;

        this.x = side === "left" ? this.width : canvas.width - this.width * 2;
        this.y = (canvas.height / 2) - (this.height / 2);
    }

    moveUp() {
        if (this.y > 0) {
            this.y -= this.speed;
        }
    }

    moveDown(canvas: HTMLCanvasElement) {
        if (this.y + this.height <= canvas.height) {
            this.y += this.speed;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillRect(
            Math.round(this.x),
            Math.round(this.y),
            Math.round(this.width),
            Math.round(this.height),
        );
    }

    detectCollision(ball: Ball) {
        const verticalCollision = ball.y + ball.radius >= this.y &&
            ball.y - ball.radius <= this.y + this.height;

        if (verticalCollision) {
            if (ball.xVelocity > 0) {
                // Right paddle case
                if (
                    ball.x + ball.radius >= this.x &&
                    ball.x + ball.radius <= this.x + this.width
                ) {
                    // increase speed with each hit
                    ball.maxVelocity += .5;
                    ball.xVelocity = ball.maxVelocity * -1;

                    const midpoint = this.y + (this.height / 2);
                    const differenceInY = ball.y - midpoint;
                    const reductionFactor = (this.height / 2) /
                        ball.maxVelocity;
                    ball.yVelocity = differenceInY / reductionFactor;
                }
            } else {
                // Left paddle case
                if (
                    ball.x - ball.radius <= this.x + this.width &&
                    ball.x - ball.radius >= this.x
                ) {
                    // increase speed with each hit
                    ball.maxVelocity += .5;
                    ball.xVelocity = ball.maxVelocity;

                    const midpoint = this.y + (this.height / 2);
                    const differenceInY = ball.y - midpoint;
                    const reductionFactor = (this.height / 2) /
                        ball.maxVelocity;
                    ball.yVelocity = differenceInY / reductionFactor;
                }
            }
            return;
        }

        // Check for collision with the top or bottom of the paddle
        if (
            ball.xVelocity < 0 && ball.x - ball.radius <= this.x + this.width &&
            ball.x + ball.radius >= this.x
        ) {
            // Left paddle case
            if (
                ball.yVelocity > 0 && ball.y + ball.radius >= this.y &&
                ball.y - ball.radius <= this.y + this.height
            ) {
                // Top of paddle collision
                ball.xVelocity *= -1;
                ball.yVelocity *= -1;
            } else if (
                ball.y - ball.radius <= this.y + this.height &&
                ball.y + ball.radius >= this.y
            ) {
                // Bottom of paddle collision
                ball.xVelocity *= -1;
                ball.yVelocity *= -1;
            }
        } else if (
            ball.x + ball.radius >= this.x &&
            ball.x - ball.radius <= this.x + this.width
        ) {
            // Right paddle case
            if (
                ball.yVelocity > 0 && ball.y + ball.radius >= this.y &&
                ball.y - ball.radius <= this.y + this.height
            ) {
                // Top of paddle collision
                ball.xVelocity *= -1;
                ball.yVelocity *= -1;
            } else if (
                ball.y - ball.radius <= this.y + this.height &&
                ball.y + ball.radius >= this.y
            ) {
                // Bottom of paddle collision
                ball.xVelocity *= -1;
                ball.yVelocity *= -1;
            }
        }
    }
}
