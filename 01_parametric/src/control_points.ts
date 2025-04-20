export let control_point_size = 3;
export let control_points: number[][] = [];
export const CONTROL_POINTS_INTERVAL = 1;

/**
 * 制御点を円周上に配置する
 */
export function init_control_points() {
    control_points = [];
    for (let i = 0; i < control_point_size; i++) {
        control_points.push([
            Math.cos((2 * Math.PI * i) / control_point_size) *
                CONTROL_POINTS_INTERVAL,
            Math.sin((2 * Math.PI * i) / control_point_size) *
                CONTROL_POINTS_INTERVAL,
        ]);
    }
}

export function set_control_point_size(size: number) {
    control_point_size = size;
}
