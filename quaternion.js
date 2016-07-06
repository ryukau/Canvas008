class Quaternion {
    // Quaternion
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

// 返り値が Quaternion なので注意。
// https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation
function rotate(v, theta) {
    var halftheta = theta * 0.5,
        sin = Math.sin(halftheta),
        cos = Math.cos(halftheta),
        p = new Quaternion(v.x, v.y, v.z, 0),
        q = new Quaternion(v.x * sin, v.y * sin, v.z * sin, cos),
        qcon = q.Con

    return q.mul(p).mul(qcon)
}

// p, q は unit quaternion 。
function slerp(p, q, t) {
    return q.mul(p.Inv).powr(t).mul(p)
}

// normalized linear interpolation.
function nlerp(p, q, t) {
    return lerp(p, q, t).Unit
}

function lerp(p, q, t) {
    return new Quaternion(
        p.x * t + (1 - t) * q.x,
        p.y * t + (1 - t) * q.y,
        p.z * t + (1 - t) * q.z,
        p.w * t + (1 - t) * q.w
    )
}

// [-1, 1) の乱数。
function rand() {
    return (Math.random() - 0.5) * 2
}

var canvas = []
for (let i = 0; i < 32; ++i) {
    canvas.push(new Canvas(128, 128))
}

var quat = new Quaternion(rand(), rand(), rand(), rand())

console.log(rand())
console.log(quat.toString())
console.log("Angle: " + quat.Angle.toString())
console.log("Con: " + quat.Con.toString())
console.log("Exp: " + quat.Exp.toString())
console.log("Log: " + quat.Log.toString())
console.log("Inv: " + quat.Inv.toString())
console.log("Norm: " + quat.Norm.toString())
console.log("Unit: " + quat.Unit.toString())
console.log("add: " + quat.add(quat).toString())
console.log("sub: " + quat.sub(quat).toString())
console.log("mul: " + quat.mul(quat).toString())
console.log("mulr: " + quat.mulr(10).toString())

!function init() {
    var time = Date.now()

    updateCanvas(time, canvas[0], con)
    updateCanvas(time, canvas[1], exp)
    updateCanvas(time, canvas[2], log)
    updateCanvas(time, canvas[3], inv)
    updateCanvas(time, canvas[4], add1)
    updateCanvas(time, canvas[5], add2)
    updateCanvas(time, canvas[6], add3)
    updateCanvas(time, canvas[7], add4)
    updateCanvas(time, canvas[8], sub1)
    updateCanvas(time, canvas[9], sub2)
    updateCanvas(time, canvas[10], sub3)
    updateCanvas(time, canvas[11], sub4)
    updateCanvas(time, canvas[12], mul1)
    updateCanvas(time, canvas[13], mul2)
    updateCanvas(time, canvas[14], mul3)
    updateCanvas(time, canvas[15], mul4)
    updateCanvas(time, canvas[16], square)
    updateCanvas(time, canvas[17], pow)
    updateCanvas(time, canvas[18], mandelbrot)
    updateCanvas(time, canvas[19], expmandelbrot)
    updateCanvas(time, canvas[20], logmandelbrot)
    updateCanvas(time, canvas[21], zeta)
    updateCanvas(time, canvas[22], expzeta)
    updateCanvas(time, canvas[23], logzeta)
    updateCanvas(time, canvas[24], uhhyou1)
    updateCanvas(time, canvas[25], uhhyou2)
    updateCanvas(time, canvas[26], uhhyou3)
    updateCanvas(time, canvas[27], uhhyou4)
    updateCanvas(time, canvas[28], uhhyou5)
    updateCanvas(time, canvas[29], uhhyou6)
    updateCanvas(time, canvas[30], uhhyou7)
    updateCanvas(time, canvas[31], uhhyou8)
} ()

function con(q) {
    return q.Con
}

function exp(q) {
    return q.Exp
}

function log(q) {
    return q.Log
}

function inv(q) {
    return q.Inv
}

function add1(q) {
    var p = new Quaternion(1, 0, 0, 0)
    return q.add(p)
}

function add2(q) {
    var p = new Quaternion(0, 1, 0, 0)
    return q.add(p)
}

function add3(q) {
    var p = new Quaternion(0, 0, 1, 0)
    return q.add(p)
}

function add4(q) {
    var p = new Quaternion(0, 0, 0, 1)
    return q.add(p)
}

function sub1(q) {
    var p = new Quaternion(1, 0, 0, 0)
    return q.sub(p)
}

function sub2(q) {
    var p = new Quaternion(0, 1, 0, 0)
    return q.sub(p)
}

function sub3(q) {
    var p = new Quaternion(0, 0, 1, 0)
    return q.sub(p)
}

function sub4(q) {
    var p = new Quaternion(0, 0, 0, 1)
    return q.sub(p)
}

function mul1(q) {
    var p = new Quaternion(1, 0, 0, 0)
    return q.mul(p)
}

function mul2(q) {
    var p = new Quaternion(0, 1, 0, 0)
    return q.mul(p)
}

function mul3(q) {
    var p = new Quaternion(0, 0, 1, 0)
    return q.mul(p)
}

function mul4(q) {
    var p = new Quaternion(0, 0, 0, 1)
    return q.mul(p)
}

function square(q) {
    return q.mul(q)
}

function pow(q) {
    return q.pow(q)
}

function mandelbrot(c) {
    var z = c.mulr(0.25)
    for (let i = 0; i < 128; ++i) {
        z = z.mul(z).add(c.mulr(0.25))
    }
    return z
}

function expmandelbrot(q) {
    return mandelbrot(q.Exp)
}

function logmandelbrot(q) {
    return mandelbrot(q.Log)
}

function zeta(s) {
    var s_neg = s.Neg.mulr(0.1),
        num = new Quaternion(0, 0, 0, 0),
        sum = new Quaternion(0, 0, 0, 0)

    for (let n = 1; n <= 32; ++n) {
        num.set(n, 0, 0, 0)
        sum = sum.add(num.pow(s_neg))
    }

    return sum
}

function expzeta(q) {
    return zeta(q.Exp)
}

function logzeta(q) {
    return zeta(q.Log)
}

function uhhyou1(q) {
    return q.mul(q.add(q)).sub(q).Exp.pow(q.mulr(0.01))
}

function uhhyou2(q) {
    return q.mul(q.add(q)).mul(q.Exp).mul(q.Log)
}

function uhhyou3(q) {
    return nlerp(q.Exp, q.Log, 0.5)
}

function uhhyou4(q) {
    return slerp(q.Exp, q.Log, Math.PI)
}

function uhhyou5(q) {
    return slerp(q, zeta(q), Math.PI * 0.5)
}

function uhhyou6(q) {
    return slerp(q.add(q), q.Neg, Math.PI * 0.5)
}

function uhhyou7(q) {
    return q.add(q.pow(q.add(q.pow(q))))
}

function uhhyou8(q) {
    return q.pow(q.pow(q.pow(q.pow(q))))
}

// update Canvas //

function updateCanvas(time, cv, funcQ) {
    cv.clearWhite()

    var q = new Quaternion(0, 0, 0, 0),
        n = new Quaternion(1, 1, 1, 1),
        width = cv.Width,
        height = cv.Height,
        pixels = cv.Pixels,
        scale, index, x, y, brightness, qq, xx, yy

    //scale = U.loginterp(MIN_SCALE, MAX_SCALE, 0.5 * (1 + Math.sin(time * 0.001)))
    //scale = U.loginterp(MIN_SCALE, MAX_SCALE, 0.5)
    scale = 8
    for (x = 0; x < width; ++x) {
        for (y = 0; y < height; ++y) {
            xx = scale * (0.5 - x / width)
            yy = scale * (0.5 - y / height)
            q.set(
                xx,
                yy,
                xx / yy,
                xx * yy
            )

            qq = funcQ(q).Unit
            brightness = 255 * qq.w * 1e1

            index = (y * width + x) * 4
            pixels[index + 0] = Math.abs(qq.x * brightness) % 255
            pixels[index + 1] = Math.abs(qq.y * brightness) % 255
            pixels[index + 2] = Math.abs(qq.z * brightness) % 255
            pixels[index + 3] = 255
        }
    }
    cv.putPixel()
}