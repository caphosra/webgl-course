export function eval_quadratic_bezier(p0, p1, p2, t) {
    return vec2.scaleAndAdd_ip(vec2.scale([], p0, 1 - t), p2, t);
}
