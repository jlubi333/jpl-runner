namespace Scale {
    export let scale: number;

    export function convert(a: number) {
        return a * scale;
    }
}
