class Canvas {
    constructor(width, height) {
        this.canvas = document.createElement("canvas")
        this.canvas.width = width
        this.canvas.height = height
        this.context = this.canvas.getContext("2d")
        this.imageData = this.context.getImageData(0, 0, width, height)
        this.pixels = this.imageData.data
        document.body.appendChild(this.canvas)
    }

    get Element() {
        return this.canvas
    }

    get Width() {
        return this.canvas.width
    }

    get Height() {
        return this.canvas.height
    }

    get Context() {
        return this.context
    }

    get Pixels() {
        return this.pixels
    }

    get CurrentPixels() {
        this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
        this.pixels = this.imageData.data
        return this.pixels
    }

    get Center() {
        return {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        }
    }

    set visible(isVisible) {
        if (isVisible) {
            canvas.sytle.display = "inline"
        }
        else {
            canvas.style.display = "none"
        }
    }

    drawPath(poly) {
        this.context.beginPath()
        this.context.moveTo(poly[0].x, poly[0].y)
        for (let i = 1; i < poly.length; ++i) {
            this.context.lineTo(poly[i].x, poly[i].y)
        }
        this.context.closePath()
        this.context.stroke()
    }

    drawLine(a, b) {
        this.context.beginPath()
        this.context.moveTo(a.x, a.y)
        this.context.lineTo(b.x, b.y)
        this.context.stroke()
    }

    drawPoint(point, radius) {
        this.context.beginPath()
        this.context.arc(point.x, point.y, radius, 0, Math.PI * 2, false)
        this.context.fill()
    }

    clearWhite() {
        this.context.fillStyle = "#ffffff"
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.fill()
    }

    clear(color) {
        this.context.fillStyle = color
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.fill()
    }

    resetTransform() {
        this.context.transform(1, 0, 0, 1, 0, 0)
    }

    putPixel() {
        this.context.putImageData(this.imageData, 0, 0)
    }

    setPixel(x, y, color) {
        var index = (y * this.canvas.width + x) * 4
        this.pixels[index + 0] = color.r
        this.pixels[index + 1] = color.g
        this.pixels[index + 2] = color.b
        this.pixels[index + 3] = color.a
    }

    feedback(alpha, white) {
        for (var y = 0; y < this.canvas.height; ++y) {
            for (var x = 0; x < this.canvas.width; ++x) {
                var index = (y * this.canvas.width + x) * 4
                this.pixels[index + 0] = Math.min(this.pixels[index + 0] * white, 255) // R
                this.pixels[index + 1] = Math.min(this.pixels[index + 1] * white, 255) // G
                this.pixels[index + 2] = Math.min(this.pixels[index + 2] * white, 255) // B
                this.pixels[index + 3] *= alpha // A
            }
        }
        this.context.putImageData(this.imageData, 0, 0)
    }
}

class Timer {
    constructor() {
        this.time_now = Date.now()
        this.time_previous = time_now
    }

    get dt() {
        this.time_now = Date.now()
        var delta = this.time_now - this.time_previous
        this.time_previous = this.time_now
        return delta
    }

    get now() {
        return this.time_now
    }
}

// 2次元のベクトル計算。
class Vec2 {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    get Length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    get unit() {
        var length = 1 / Math.sqrt(this.x * this.x + this.y * this.y)
        return new Vec2(this.x * length, this.y * length)
    }

    add(v) {
        return new Vec2(this.x + v.x, this.y + v.y)
    }

    sub(v) {
        return new Vec2(this.x - v.x, this.y - v.y)
    }

    dot(v) {
        return this.x * v.x + this.y * v.y
    }

    cross(v) {
        return this.x * v.y - this.y * v.x
    }
}

// 複素数。
class Complex {
    // ベクトル計算と混ぜて使うために（実部、虚部）を (x, y) で表現する。
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    // 絶対値。
    get Abs() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    // 角度を求める。
    get Arg() {
        return Math.atan2(this.y, this.x)
    }

    // 共役複素数 (conjugate) 。
    get Con() {
        return new Complex(
            this.x,
            -this.y
        )
    }

    // 指数関数。
    get Exp() {
        var re = Math.exp(this.x)

        return new Complex(
            re * Math.cos(this.y),
            re * Math.sin(this.y)
        )
    }

    // 逆数 (Inverse, 1 / z) 。
    get Inv() {
        var denom = 1 / (this.x * this.x + this.y * this.y)

        return new Complex(
            this.x * denom,
            -this.y * denom
        )
    }

    // x, y ともに計算できる値なら true、そうでなければ false。
    get IsNaN() {
        return isNaN(this.x) || isNaN(this.y)
    }

    // 自然対数。
    get Log() {
        var r = Math.sqrt(this.x * this.x + this.y + this.y)

        return new Complex(
            Math.log(r),
            Math.atan2(this.y, this.x)
        )
    }

    // 負の値。
    get Neg() {
        return new Complex(
            -this.x,
            -this.y
        )
    }

    // 平方根。
    get Sqrt() {
        var r = Math.sqrt(this.x * this.x + this.y * this.y)

        return new Complex(
            Math.sqrt((r + this.x) * 0.5),
            Math.sign(this.y) * Math.sqrt((r - this.x) * 0.5)
        )
    }

    get Sin() {
        return new Complex(
            Math.sin(this.x) * Math.cosh(this.y),
            Math.cos(this.x) * Math.sinh(this.y)
        )
    }

    get Cos() {
        return new Complex(
            Math.cos(this.x) * Math.cosh(this.y),
            -Math.sin(this.x) * Math.sinh(this.y)
        )
    }

    get Tan() {
        var A = 1 + Math.cos(2 * this.x),
            B = Math.sinh(this.y) * Math.sinh(this.y),
            denom = 1 / (A + 2 * B)

        return new Complex(
            Math.sin(2 * this.x) * denom,
            Math.sinh(2 * this.y) * denom
        )
    }

    get Sinh() {
        var A = this.Exp,
            B = this.Neg.Exp

        return new Complex(
            (A.x - B.x) * 0.5,
            (A.y - B.y) * 0.5
        )
    }

    get Cosh() {
        var A = this.Exp,
            B = this.Neg.Exp

        return new Complex(
            (A.x + B.x) * 0.5,
            (A.y + B.y) * 0.5
        )
    }

    get Tanh() {
        var A = this.Exp,
            B = this.Neg.Exp

        return A.sub(B).div(A.add(B))
    }

    // おかしな値を 0 にして計算できるようにする。
    validate() {
        if (isNaN(this.x)) {
            this.x = 0
        }
        if (isNaN(this.y)) {
            this.y = 0
        }
    }

    add(z) {
        return new Complex(
            this.x + z.x,
            this.y + z.y
        )
    }

    sub(z) {
        return new Complex(
            this.x - z.x,
            this.y - z.y
        )
    }

    mul(z) {
        return new Complex(
            this.x * z.x - this.y * z.y,
            this.x * z.y + this.y * z.x
        )
    }

    // 複素数 a に実数 r をかける。
    mulr(re) {
        return new Complex(
            this.x * re,
            this.y * re
        )
    }

    div(z) {
        var denom = 1 / (z.x * z.x + z.y * z.y)

        return new Complex(
            (this.x * z.x + this.y * z.y) * denom,
            (this.y * z.x - this.x * z.y) * denom
        )
    }

    pow(w) {
        return w.mul(this.Log).Exp
    }

    set(x, y) {
        this.x = x
        this.y = y
    }

    toString() {
        return "(" + this.x + ", " + this.y + ")"
    }
}

// Quaternion 。
class Quaternion {
    // 要素名 (x, y, z, w) は DirectX にならった。
    constructor(x, y, z, w) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }

    set(x, y, z, w) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }

    // rotation の定義から。
    get Angle() {
        return Math.acos(this.w) * 2
    }

    // 共役 Conjugation 。
    get Con() {
        return new Quaternion(-this.x, -this.y, -this.z, this.w)
    }

    get Exp() {
        var e = Math.exp(this.w),
            norm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z),
            coef

        if (norm === 0) {
            return new Quaternion(0, 0, 0, e)
        }

        coef = e * Math.sin(norm) / norm

        return new Quaternion(
            this.x * coef,
            this.y * coef,
            this.z * coef,
            e * Math.cos(norm)
        )
    }

    get Log() {
        var vn = this.x * this.x + this.y * this.y + this.z * this.z,
            q_norm = Math.sqrt(vn + this.w * this.w),
            v_norm = Math.sqrt(vn),
            coef = Math.acos(this.w / q_norm) / v_norm

        return new Quaternion(
            this.x * coef,
            this.y * coef,
            this.z * coef,
            Math.log(q_norm)
        )
    }

    // 逆数。
    get Inv() {
        var norm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w),
            denom = 1 / (norm * norm)

        return new Quaternion(
            -this.x * denom,
            -this.y * denom,
            -this.z * denom,
            this.w * denom
        )
    }

    get Neg() {
        return new Quaternion(
            -this.x,
            -this.y,
            -this.z,
            -this.w
        )
    }

    get Norm() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
    }

    get Unit() {
        var denom = 1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)

        if (Number.isFinite(denom)) {
            return new Quaternion(
                this.x * denom,
                this.y * denom,
                this.z * denom,
                this.w * denom
            )
        }
        return new Quaternion(0, 0, 0, 0)
    }

    add(q) {
        return new Quaternion(
            this.x + q.x,
            this.y + q.y,
            this.z + q.z,
            this.w + q.w
        )
    }

    sub(q) {
        return new Quaternion(
            this.x - q.x,
            this.y - q.y,
            this.z - q.z,
            this.w - q.w
        )
    }

    mul(q) {
        var a1 = this.x, b1 = this.y, c1 = this.z, d1 = this.w,
            a2 = q.x, b2 = q.y, c2 = q.z, d2 = q.w,
            x = a1 * a2 - b1 * b2 - c1 * c2 - d1 * d2,
            y = a1 * b2 + b1 * a2 + c1 * d2 - d1 * c2,
            z = a1 * c2 - b1 * d2 + c1 * a2 + d1 * b2,
            w = a1 * d2 + b1 * c2 - c1 * b2 + d1 * a2

        return new Quaternion(x, y, z, w)
    }

    mulr(r) {
        return new Quaternion(
            this.x * r,
            this.y * r,
            this.z * r,
            this.w * r
        )
    }

    pow(n) {
        return this.Log.mul(n).Exp
    }

    // n は実数。
    powr(n) {
        return this.Log.mulr(n).Exp
    }

    toString() {
        return "(" + this.x + ", " + this.y + ", " + this.z + ", " + this.w + ")"
    }
}

// ユーティリティ。
class U {
    // オブジェクトをスワップ。
    static swap(a, b) {
        var temp = a
        a = b
        b = temp
    }

    //
    // --- 双曲関数 Hyperbolic function
    //
    static sinh(x) {
        return (Math.exp(x) - Math.exp(-x)) * 0.5
    }

    static cosh(x) {
        return (Math.exp(x) + Math.exp(-x)) * 0.5
    }

    static tanh(x) {
        var a = Math.exp(x),
            b = Math.exp(-x)
        return (a - b) / (a + b)
    }

    static sech(x) {
        return 2 / (Math.exp(x) - Math.exp(-x))
    }

    static csch(x) {
        return 2 / (Math.exp(x) + Math.exp(-x))
    }

    static coth(x) {
        var a = Math.exp(x),
            b = Math.exp(-x)
        return (a + b) / (a - b)
    }

    // value を [min, max] の範囲に収める。
    static clamp(value, min, max) {
        return isNaN(value) ? 0 : Math.max(min, Math.min(value, max));
    }

    static randomPow(n) {
        var r = Math.random()
        return Math.pow(r, n)
    }

    //
    // --- 補間 Interpolation
    //

    // 線形補間。
    static linterp(a, b, r) {
        return a * r + b * (1 - r)
    }

    // 対数的に線形補間。
    static loginterp(a, b, r) {
        return Math.exp(Math.log(a) * r + Math.log(b) * (1 - r))
    }

    // p, q は unit quaternion 。
    static slerp(p, q, t) {
        return q.mul(p.Inv).powr(t).mul(p)
    }

    // normalized linear interpolation.
    // 線形補間してから単位ベクトルをとる。
    static nlerp(p, q, t) {
        var lerp = new Quaternion(
            p.x * t + (1 - t) * q.x,
            p.y * t + (1 - t) * q.y,
            p.z * t + (1 - t) * q.z,
            p.w * t + (1 - t) * q.w
        )

        return lerp.Unit
    }

    // 極座標。
    static toPolar(v) {
        return {
            x: V2(length),
            y: Math.atan2(v.y, v.x)
        }
    }

    // ベクトルと角度。
    static angle2D(origin, a, b) {
        var ax = a.x - origin.x,
            ay = a.y - origin.y,
            bx = b.x - origin.x,
            by = b.y - origin.y,
            c1 = Math.sqrt(ax * ax + ay * ay),
            c2 = Math.sqrt(bx * bx + by * by),
            c = (ax * bx + ay * by) / (c1 * c2)

        return isNaN(c) ? 0 : Math.acos(Math.min(c, 1))
    }

    // 当たり判定 (HitTest) 。
    static isPointInPath(point, poly) {
        var i = 0,
            j = poly.length - 1,
            c = false

        for (; i < poly.length; ++i) {
            if (((poly[i].y > point.y) != (poly[j].y > point.y))
                && (point.x < (poly[j].x - poly[i].x) * (point.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)) {
                c = !c
            }
            j = i
        }
        return c
    }

    //
    // --- 色 Color
    //

    // ランダムなカラーコードを生成。
    // 少し明るめの色。
    static randomColorCode() {
        return "#" + ("00000" + Math.floor(0x888880 * (1 + Math.random())).toString(16)).slice(-6)
    }

    static hsv2rgb(h, s, v, a) {
        var r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
            a: a
        };
    }

    //
    // --- その他 Miscellaneous
    //
}
