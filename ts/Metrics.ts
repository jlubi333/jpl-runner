class Vector {
    constructor(public x: number, public y: number) {}
}

class BoundingBox {
    constructor(public x: number,
                public y: number,
                public width: number,
                public height: number) {}

    public right(): number {
        return this.x + this.width;
    }

    public bottom(): number {
        return this.y + this.height;
    }
}
