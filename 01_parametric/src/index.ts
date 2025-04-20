/*
    引用元: https://utokyo-iscg-2025-assigment-m1-spline.glitch.me/
    一部改変
*/

import { init, draw } from "./legacygl";

window.onload = function () {
    init();
    draw();

    let input_steps_elem = document.getElementById(
        "input_show_controlpoints",
    ) as HTMLInputElement;
    input_steps_elem.onchange = function () {
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
