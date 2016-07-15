namespace Mouse {
    export let pos: Vector;

    let mouseDown: boolean;

    export function init(initialPos: Vector =
                             new Vector(window.innerWidth / 2,
                                        window.innerHeight / 2)) {
        pos = initialPos;
        mouseDown = false;
    }

    export function isMouseDown() {
        return mouseDown;
    }

    window.onmousemove = (event) => {
        pos.x = event.pageX;
        pos.y = event.pageY;
    };

    window.onmousedown = (event) => {
        mouseDown = true;
    }

    window.onmouseup = (event) => {
        mouseDown = false;
    }
}


namespace Keyboard {
    let keysDown: {[key: number]: boolean};

    export function init() {
        keysDown = {};
    }

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
