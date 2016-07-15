class Player implements Updatable, Renderable {
    private grounded: boolean;
    private jumpsLeft: number;
    private canJumpAgain: boolean = true;

    constructor(public game: Game,
                public bb: BoundingBox,
                public velocity: Vector,
                public jumpPower: number,
                public maxJumps: number) {
        this.jumpsLeft = maxJumps;
    }

    public update(dt: number): void {
        this.velocity.y += this.game.gravity * dt;

        this.bb.y += this.velocity.y * dt;
        this.grounded = false;
        if (this.collidesWithMap(CollisionDirection.Y)) {
            if (this.velocity.y < 0) {
                this.bb.y =
                    Math.ceil(this.bb.y / ChunkManager.TILE_SIZE)
                        * ChunkManager.TILE_SIZE;
            } else if (this.velocity.y > 0) {
                this.bb.y =
                    Math.floor(this.bb.bottom() / ChunkManager.TILE_SIZE)
                        * ChunkManager.TILE_SIZE - this.bb.height;
                this.grounded = true;
                this.jumpsLeft = this.maxJumps;
            }
            this.velocity.y = 0;
        }

        this.handleInput();
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "red";
        ctx.fillRect(this.bb.x,
                     this.bb.y,
                     this.bb.width,
                     this.bb.height);
    }

    private static collisionModifiers = [0.01, 0.5, 0.99];
    public collidesWithMap(d: CollisionDirection): boolean {
        let tileInfo: TileInformation;
        let modifier: number;

        for (let i = 0; i < 3; i++) {
            modifier = Player.collisionModifiers[i];
            if (d == CollisionDirection.X) {
                tileInfo = this.game.tileInformationFromCoordinate(
                    this.bb.x, this.bb.y + this.bb.height * modifier
                );
            } else if (d == CollisionDirection.Y) {
                if (this.velocity.y < 0) {
                    tileInfo = this.game.tileInformationFromCoordinate(
                        this.bb.x + this.bb.width * modifier, this.bb.y
                    );
                } else if (this.velocity.y > 0) {
                    tileInfo = this.game.tileInformationFromCoordinate(
                        this.bb.x + this.bb.width * modifier, this.bb.bottom()
                    );
                }
            }
            if (tileInfo != null && tileInfo.isBlocked()) {
                return true;
            }
        }
        return false;
    }

    public handleInput(): void {
        let jumpPressed = Keyboard.isKeyDown(32) || Mouse.isMouseDown();

        if (!jumpPressed) {
            this.canJumpAgain = true;
        }
        if (this.canJump() && jumpPressed) {
            this.jump();
            this.canJumpAgain = false;
        }
    }

    public canJump(): boolean {
        return this.grounded || (this.jumpsLeft > 0 && this.canJumpAgain);
    }

    public jump(): void {
        this.velocity.y = -this.jumpPower;
        this.jumpsLeft -= 1;
    }
}
