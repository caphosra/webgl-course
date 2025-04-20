// 講義資料を参考にバーンスタイン基底関数を用いて実装

export function eval_bezier(points: number[][], t: number): number[] {
    let point = [0, 0];
    let n = points.length - 1;
    for (let i = 0; i <= n; i++) {
        let b = combination(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i);
        point[0] += points[i][0] * b;
        point[1] += points[i][1] * b;
    }
    return point;
}

function combination(n: number, k: number): number {
    let result = 1;
    for (let i = 0; i < k; i++) {
        result *= (n - i) / (i + 1);
    }
    return result;
}
