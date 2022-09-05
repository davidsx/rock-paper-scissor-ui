export function assertion(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(msg);
    }
}

export function isNullOrUndefined(e: any) {
    return e === null || e === undefined;
}