/*
    引用元: https://utokyo-iscg-2025-assignment-a1-ik.glitch.me/
    一部改変
*/

import { linkages, update_position, compute_ik } from "./calc";

let gl;
let canvas;
let legacygl;
let drawutil;
let camera;
let is_dragging = false;

export function draw() {
    // 描画を開始する前にキャンバスを初期化する
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // カメラの設定を行う
    mat4.perspective(
        legacygl.uniforms.projection.value,
        Math.PI / 6,
        canvas.aspect_ratio(),
        0.1,
        1000,
    );
    const modelview = legacygl.uniforms.modelview;
    camera.lookAt(modelview.value);

    // xy gridを描画する
    gl.lineWidth(1);
    legacygl.color(0.5, 0.5, 0.5);
    drawutil.xygrid(100);

    // linkagesを描画する
    const selected = Number(
        (document.getElementById("input_selected") as HTMLInputElement).value,
    );
    legacygl.begin(gl.LINES);
    linkages.forEach(function (linkage, index) {
        // ボーンの色を指定する
        if (index == selected) {
            legacygl.color(1, 0, 0); // 選択されていれば赤
        } else {
            legacygl.color(0, 0, 0); // そうでなければ黒
        }

        // ボーンの根本の座標を指定する
        if (index == 0) {
            // note: このプログラムでは、ルートとなるボーン（index = 0）の根本位置は原点を仮定している
            legacygl.vertex(0, 0, 0);
        } else {
            legacygl.vertex2(linkages[index - 1].position);
        }

        // ボーンの先端の座標を指定する
        legacygl.vertex2(linkage.position);
    });
    legacygl.end();
    legacygl.begin(gl.POINTS);
    legacygl.color(0, 0, 0);
    legacygl.vertex(0, 0, 0);
    linkages.forEach(function (linkage, index) {
        if (index == selected) legacygl.color(1, 0, 0);
        else legacygl.color(0, 0, 0);
        legacygl.vertex2(linkage.position);
    });
    legacygl.end();
}

export function init() {
    // OpenGL context
    canvas = document.getElementById("canvas");
    gl = canvas.getContext("experimental-webgl");
    if (!gl) alert("Could not initialise WebGL, sorry :-(");
    const vertex_shader_src =
        "\
        attribute vec3 a_vertex;\
        attribute vec3 a_color;\
        varying vec3 v_color;\
        uniform mat4 u_modelview;\
        uniform mat4 u_projection;\
        void main(void) {\
          gl_Position = u_projection * u_modelview * vec4(a_vertex, 1.0);\
          v_color = a_color;\
          gl_PointSize = 5.0;\
        }\
        ";
    const fragment_shader_src =
        "\
        precision mediump float;\
        varying vec3 v_color;\
        void main(void) {\
          gl_FragColor = vec4(v_color, 1.0);\
        }\
        ";
    legacygl = get_legacygl(gl, vertex_shader_src, fragment_shader_src);
    legacygl.add_uniform("modelview", "Matrix4f");
    legacygl.add_uniform("projection", "Matrix4f");
    legacygl.add_vertex_attribute("color", 3);
    legacygl.vertex2 = function (p) {
        this.vertex(p[0], p[1], 0);
    };
    drawutil = get_drawutil(gl, legacygl);
    camera = get_camera(canvas.width);
    camera.center = [2, 0, 0];
    camera.eye = [2, 0, 7];
    update_position();

    const input_selected = document.getElementById(
        "input_selected",
    ) as HTMLInputElement;
    const input_angle = document.getElementById(
        "input_angle",
    ) as HTMLInputElement;
    const ik_mode = document.getElementById("ik_mode") as HTMLInputElement;
    const fk_mode = document.getElementById("fk_mode") as HTMLInputElement;

    // イベントハンドラを定義する
    canvas.onmousedown = function (evt) {
        const mouse_win = this.get_mousepos(evt);
        if (ik_mode.checked) {
            is_dragging = true;
        }
    };
    canvas.onmousemove = function (evt) {
        // IKモードでドラッグしていない場合は何もせず処理を終える
        if (!is_dragging) return;

        const mouse_win = this.get_mousepos(evt);
        mouse_win.push(1); // 3次元の座標とみなすために仮のz座標値を追加

        // 3次元の場合のソースコードを再利用して、同様の処理を実行する
        const viewport = [0, 0, canvas.width, canvas.height];
        const mouse_obj = glu.unproject(
            mouse_win,
            legacygl.uniforms.modelview.value,
            legacygl.uniforms.projection.value,
            viewport,
        );
        const plane_origin = [0, 0, 0];
        const plane_normal = [0, 0, 1];
        const eye_to_mouse = vec3.sub([], mouse_obj, camera.eye);
        const eye_to_origin = vec3.sub([], plane_origin, camera.eye);
        const s1 = vec3.dot(eye_to_mouse, plane_normal);
        const s2 = vec3.dot(eye_to_origin, plane_normal);
        const eye_to_intersection = vec3.scale([], eye_to_mouse, s2 / s1);
        const target_position = vec3.add([], camera.eye, eye_to_intersection);

        // マウスの2次元座標（ワールド座標系）を入力としてIKを計算する
        compute_ik([target_position[0], target_position[1]]);

        // IKを計算した結果を表示する
        draw();

        input_selected.onchange(undefined);
    };
    document.onmouseup = function (evt) {
        is_dragging = false;
    };

    // IKモードとFKモードの切り替え
    ik_mode.onchange = function (_) {
        if (ik_mode.checked) {
            input_selected.disabled = true;
            input_angle.disabled = true;
        }
    };
    fk_mode.onchange = function (_) {
        if (fk_mode.checked) {
            input_selected.disabled = false;
            input_angle.disabled = false;
        }
    };

    input_selected.max = (linkages.length - 1).toString();
    input_selected.onchange = function () {
        input_angle.value = linkages[input_selected.value].angle;
        draw();
    };
    input_angle.onchange = function () {
        const selected = Number(input_selected.value);
        linkages[selected].angle = Number(input_angle.value);
        update_position();
        draw();
    };

    // OpenGLの初期設定を行う
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);
}
