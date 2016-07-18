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
                this.bb.y = Math.ceil(this.bb.y);
            } else if (this.velocity.y > 0) {
                this.bb.y = Math.floor(this.bb.bottom()) - this.bb.height;
                this.grounded = true;
                this.jumpsLeft = this.maxJumps;
            }
            this.velocity.y = 0;
        }

        this.handleInput();

        let currentTileInfo = this.game.tileInformationFromCoordinate(
            this.bb.x + this.bb.width / 2,
            this.bb.y + this.bb.height / 2
        );

        if (Scale.convert(this.bb.y) > window.innerHeight ||
            (currentTileInfo != null && currentTileInfo.isBlocked())) {
            this.die();
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        CanvasUtilities.scaledRect(
            ctx,
            "#00C6FF",
            "#FFFFFF",
            this.bb.x,
            this.bb.y,
            this.bb.width,
            this.bb.height,
            1 / Scale.scale
        );
    }

    private static collisionModifiers = [0.01, 0.5, 0.99];
    public collidesWithMap(d: CollisionDirection): boolean {
        let tileInfo: TileInformation;
        let modifier: number;

        for (let i = 0; i < 3; i++) {
            modifier = Player.collisionModifiers[i];
            if (d == CollisionDirection.X) {
                // Can only be moving right
                tileInfo = this.game.tileInformationFromCoordinate(
                    this.bb.right(), this.bb.y + this.bb.height * modifier
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
        SoundManager.jump.play();
        this.velocity.y = -this.jumpPower;
        this.jumpsLeft -= 1;
    }

    public die(): void {
        SoundManager.death.play();
        this.game.restart();
    }
}
