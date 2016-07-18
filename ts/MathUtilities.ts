namespace MathUtilities {
    // Returns a random integer in the range [min, max).
    export function randInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    export function randSelection<T>(array: T[]): T {
        return array[randInt(0, array.length)];
    }
}

