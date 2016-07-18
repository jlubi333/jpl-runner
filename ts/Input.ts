namespace Mouse {
    export let pos: Vector;

    let mouseDown: boolean;

    export function handle(parentElement: HTMLElement,
                           initialPos: Vector =
                               new Vector(window.innerWidth / 2,
                                          window.innerHeight / 2)): void {
        pos = initialPos;
        mouseDown = false;

        parentElement.onmousemove = (event) => {
            pos.x = event.pageX;
            pos.y = event.pageY;
        };

        parentElement.onmousedown = (event) => {
            mouseDown = true;
        };
        parentElement.ontouchstart = (event: UIEvent) => {
            mouseDown = true;
        };

        parentElement.onmouseup = (event) => {
            mouseDown = false;
        };
        parentElement.ontouchend = (event: UIEvent) => {
            mouseDown = false;
        };
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

    window.onkeydown = (event) => {
        keysDown[event.keyCode] = true;
    }

    window.onkeyup = (event) => {
        keysDown[event.keyCode] = false;
    }
}
