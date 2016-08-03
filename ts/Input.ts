namespace Mouse {
    export let pos: Vector;

    let mouseDown: boolean;

    export function handle(parentElement: HTMLElement,
                           initialPos: Vector =
                               new Vector(window.innerWidth / 2,
                                          window.innerHeight / 2)): void {
        pos = initialPos;
        mouseDown = false;

        parentElement.addEventListener("mousemove", (event) => {
            pos.x = event.pageX;
            pos.y = event.pageY;
        });

        parentElement.addEventListener("mousedown", (event) => {
            mouseDown = true;
        });
        parentElement.addEventListener("touchstart", (event: UIEvent) => {
            mouseDown = true;
        });

        parentElement.addEventListener("mouseup", (event) => {
            mouseDown = false;
        });
        parentElement.addEventListener("touchend", (event: UIEvent) => {
            mouseDown = false;
        });
    }

    export function isMouseDown(): boolean {
        return mouseDown;
    }
}

namespace Keyboard {
    let keysDown: {[key: number]: boolean} = {};

    export function isKeyDown(keyCode: number): boolean {
        // Cannot just return Keyboard.keys[keyCode] because it may be null
        return keysDown[keyCode] == true;
    }

    window.addEventListener("keydown", (event) => {
        keysDown[event.keyCode] = true;
    });

    window.addEventListener("keyup", (event) => {
        keysDown[event.keyCode] = false;
    });
}
