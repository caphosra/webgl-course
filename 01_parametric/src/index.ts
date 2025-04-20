/*
    引用元: https://utokyo-iscg-2025-assigment-m1-spline.glitch.me/
    一部改変
*/

import { set_control_point_size } from "./control_points";
import { init, draw } from "./legacygl";

window.onload = function () {
    init();
    draw();

    let input_controlpoints_elem = document.getElementById(
        "input_controlpoints",
    ) as HTMLInputElement;
    input_controlpoints_elem.onchange = function () {
        set_control_point_size(Number(input_controlpoints_elem.value));
        init();
        draw();
    };

    let input_show_controlpoints_elem = document.getElementById(
        "input_show_controlpoints",
    ) as HTMLInputElement;
    input_show_controlpoints_elem.onchange = function () {
        draw();
    };

    let input_numsteps_elem = document.getElementById(
        "input_numsteps",
    ) as HTMLInputElement;
    input_numsteps_elem.onchange = function () {
        draw();
    };

    let input_show_samplepoints_elem = document.getElementById(
        "input_show_samplepoints",
    ) as HTMLInputElement;
    input_show_samplepoints_elem.onchange = function () {
        draw();
    };
};
