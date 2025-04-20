export function eval_quadratic_bezier(
    p0: number[],
    p1: number[],
    p2: number[],
    t: number,
) {
    let a = vec2.scaleAndAdd_ip(vec2.scale([], p0, 1 - t), p2, t);
    return a;
}
