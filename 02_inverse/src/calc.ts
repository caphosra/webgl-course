/*
    引用元: https://utokyo-iscg-2025-assignment-a1-ik.glitch.me/
    一部改変
*/

import { link } from "fs";

// ボーンの情報を格納するグローバル変数
// note: `position` の要素は関数 `update_position` を用いて計算する
export const linkages = [
    { position: [0, 0], angle: 0, length: 0.8 }, // index: 0
    { position: [0, 0], angle: 0, length: 0.9 }, // index: 1
    { position: [0, 0], angle: 0, length: 1.5 }, // index: 2
    { position: [0, 0], angle: 0, length: 0.7 }, // index: 3
];

// グローバル変数 `linkages` の各要素それぞれの `angle` と `length` の値を使い、
// Forward Kinematics (FK) の考え方でそれぞれのボーンの先端位置を計算して `position` に格納する
// note: この関数はCCD法の計算中にも呼び出されることになる
export function update_position() {
    linkages.forEach(function (linkage, index) {
        // note: このプログラムでは、ルートとなるボーン（index = 0）の根本位置は原点を仮定している
        linkage.position = [0, 0];

        // note: このプログラムでは角度はラジアンではなく度で保持する
        let angle_sum = 0;
        for (let j = 0; j <= index; ++j) {
            angle_sum += linkages[j].angle;
            linkage.position[0] +=
                linkages[j].length * Math.cos((angle_sum * Math.PI) / 180);
            linkage.position[1] +=
                linkages[j].length * Math.sin((angle_sum * Math.PI) / 180);
        }
    });
}

export let ik_iteration = 10;

// 指定された `target_position` を元にIKを計算して `linkages` の状態を更新する
export function compute_ik(target_position: number[]): void {
    const len = linkages.length;
    for (let iter = 0; iter < ik_iteration; iter++) {
        for (let idx = len - 1; idx >= 0; idx--) {
            const target_vec_x =
                idx == 0
                    ? target_position[0]
                    : target_position[0] - linkages[idx - 1].position[0];
            const target_vec_y =
                idx == 0
                    ? target_position[1]
                    : target_position[1] - linkages[idx - 1].position[1];

            const current_vec_x =
                idx == 0
                    ? linkages[len - 1].position[0]
                    : linkages[len - 1].position[0] -
                      linkages[idx - 1].position[0];
            const current_vec_y =
                idx == 0
                    ? linkages[len - 1].position[1]
                    : linkages[len - 1].position[1] -
                      linkages[idx - 1].position[1];

            if (target_vec_x === 0 && target_vec_y === 0) {
                continue;
            }
            const target_vec_angle = Math.atan2(target_vec_y, target_vec_x);

            if (current_vec_x === 0 && current_vec_y === 0) {
                continue;
            }
            const current_vec_angle = Math.atan2(current_vec_y, current_vec_x);

            linkages[idx].angle +=
                ((target_vec_angle - current_vec_angle) * 180) / Math.PI;
            linkages[idx].angle %= 360;
            update_position();
        }
    }
}
