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

    // 場合分けしたほうが速そう。
    get Sin() {
        if (this.y === 0) {
            return new Complex(
                Math.sin(this.x),
                0
            )
        }

        if (this.x === 0) {
            return new Complex(
                0,
                Math.sinh(this.y)
            )
        }

        return new Complex(
            Math.sin(this.x) * Math.cosh(this.y),
            Math.cos(this.x) * Math.sinh(this.y)
        )
    }

    get Cos() {
        if (this.y === 0) {
            return new Complex(
                Math.cos(this.x),
                0
            )
        }

        if (this.x === 0) {
            return new Complex(
                Math.cosh(this.y),
                0
            )
        }

        return new Complex(
            Math.cos(this.x) * Math.cosh(this.y),
            -Math.sin(this.x) * Math.sinh(this.y)
        )
    }

    // div() の各値が以下のように代入される。
    // ---
    // a.x: Math.sin(a.x) * Math.cosh(a.y),
    // a.y: Math.cos(a.x) * Math.sinh(a.y),
    // b.x: Math.cos(a.x) * Math.cosh(a.y),
    // b.y: -Math.sin(a.x) * Math.sinh(a.y),
    //
    // 以下は式変形。
    // ---
    // (b.x * b.x + b.y * b.y)
    // Math.cos(a.x) * Math.cosh(a.y) * Math.cos(a.x) * Math.cosh(a.y)
    // + Math.sin(a.x) * Math.sinh(a.y) * Math.sin(a.x) * Math.sinh(a.y)
    //
    // 0.5 * (1 + Math.cos(2 * a.x)) * Math.cosh(a.y) * Math.cosh(a.y)
    // + 0.5 * (1 - Math.cos(2 * a.x)) * Math.sinh(a.y) * Math.sinh(a.y)
    //
    // 0.5 * (1 + Math.cos(2 * a.x)) * (1 + Math.sinh(a.y) * Math.sinh(a.y))
    // + 0.5 * (1 - Math.cos(2 * a.x)) * Math.sinh(a.y) * Math.sinh(a.y)
    //
    // 0.5 * ((1 + Math.cos(2 * a.x)) * (1 + B) + (1 - Math.cos(2 * a.x)) * B)
    // ---
    // (a.x * b.x + a.y * b.y)
    // Math.sin(a.x) * Math.cosh(a.y) * Math.cos(a.x) * Math.cosh(a.y)
    // - Math.cos(a.x) * Math.sinh(a.y) * Math.sin(a.x) * Math.sinh(a.y)
    //
    // Math.sin(a.x) * Math.cos(a.x) * Math.cosh(a.y) * Math.cosh(a.y)
    // - Math.sin(a.x) * Math.cos(a.x) * Math.sinh(a.y) * Math.sinh(a.y)
    //
    // Math.sin(a.x) * Math.cos(a.x)
    // * (Math.cosh(a.y) * Math.cosh(a.y) - Math.sinh(a.y) * Math.sinh(a.y))
    //
    // 0.5 * Math.sin(2 * a.x)
    // ---
    // (a.y * b.x - a.x * b.y)
    //
    // Math.cos(a.x) * Math.sinh(a.y) * Math.cos(a.x) * Math.cosh(a.y)
    // + Math.sin(a.x) * Math.cosh(a.y) * Math.sin(a.x) * Math.sinh(a.y)
    //
    // Math.cos(a.x) * Math.cos(a.x) * Math.sinh(a.y) * Math.cosh(a.y)
    // + Math.sin(a.x) * Math.sin(a.x) * Math.sinh(a.y) * Math.cosh(a.y)
    //
    // (Math.cos(a.x) * Math.cos(a.x) + Math.sin(a.x) * Math.sin(a.x))
    // * Math.sinh(a.y) * Math.cosh(a.y)
    //
    // 0.5 * Math.sinh(2 * a.y)
    //
    get Tan() {
        var A = 1 + Math.cos(2 * this.x),
            B = Math.sinh(this.y) * Math.sinh(this.y),
            denom = 1 / (A + 2 * B)

        return new Complex(
            Math.sin(2 * this.x) * denom,
            Math.sinh(2 * this.y) * denom
        )
    }

    get Tan2() {
        // 結果がおかしい。
        return this.div(this.Sin, this.Cos)
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
        return this.div(this.Sinh, this.Cosh)
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

const MIN_SCALE = 4
const MAX_SCALE = 1e2

var canvas = []
for (let i = 0; i < 32; ++i) {
    canvas.push(new Canvas(64, 64))
}

var zz = new Complex(2 * (0.5 - Math.random()), 2 * (0.5 - Math.random()))

console.log(zz)
console.log("Abs: " + zz.Abs.toString())
console.log("Arg: " + zz.Arg.toString())
console.log("Con: " + zz.Con.toString())
console.log("Cos: " + zz.Cos.toString())
console.log("Cosh: " + zz.Cosh.toString())
console.log("Exp: " + zz.Exp.toString())
console.log("Inverse: " + zz.Inv.toString())
console.log("IsNaN: " + zz.IsNaN.toString())
console.log("Log: " + zz.Log.toString())
console.log("Neg: " + zz.Neg.toString())
console.log("Sin: " + zz.Sin.toString())
console.log("Sinh: " + zz.Sinh.toString())
console.log("Tan: " + zz.Tan.toString())
console.log("Tan2: " + zz.Tan2.toString())
console.log("Tanh: " + zz.Tanh.toString())
console.log("add: " + zz.add(zz).toString())
console.log("sub: " + zz.sub(zz).toString())
console.log("mul: " + zz.mul(zz).toString())
console.log("mulr: " + zz.mulr(10).toString())
console.log("div: " + zz.div(zz).toString())

!function init() {
    var time = Date.now()

    updateCanvas(time, canvas[0], somefractal1, one)
    updateCanvas(time, canvas[1], zeta, one)
    updateCanvas(time, canvas[2], mandelbrot, one)
    updateCanvas(time, canvas[3], mullog, one)
    updateCanvas(time, canvas[4], sinhinv, one)
    updateCanvas(time, canvas[5], sinhcosh, invZZ)
    updateCanvas(time, canvas[6], man2, one)
    updateCanvas(time, canvas[7], man3, abs10)
    updateCanvas(time, canvas[8], tan, invZZ)
    updateCanvas(time, canvas[9], tan2, invZZ)
    updateCanvas(time, canvas[10], inv, invZZ)
    updateCanvas(time, canvas[11], sin, invZZ)
    updateCanvas(time, canvas[12], cos, invZZ)
    updateCanvas(time, canvas[13], taninv, invZZ)
    updateCanvas(time, canvas[14], munch, one)
    updateCanvas(time, canvas[15], munchzeta, invZZ)
    updateCanvas(time, canvas[16], munchdelbrot, invZZ)
    updateCanvas(time, canvas[17], addmuldiv, invZZ)
    updateCanvas(time, canvas[18], sininv, invZZ)
    updateCanvas(time, canvas[19], cosinv, invZZ)
    updateCanvas(time, canvas[20], zetainv, one)
    updateCanvas(time, canvas[21], mundelinv, one)
    updateCanvas(time, canvas[22], euler, one)
    updateCanvas(time, canvas[23], somethinghyperbolic, invZZ)
    updateCanvas(time, canvas[24], klein, invZZ)
    updateCanvas(time, canvas[25], loginv, invZZ)
    updateCanvas(time, canvas[26], expinv, invZZ)
    updateCanvas(time, canvas[27], dini, invZZ)
    updateCanvas(time, canvas[28], conformalmap, invZZ)
    updateCanvas(time, canvas[29], omega_a, invZZ)
    updateCanvas(time, canvas[30], clausen, invZZ)
    updateCanvas(time, canvas[31], sinsinsin, invZZ)
} ()

// funcZ //
function sinsinsin(z) {
    return z.Inv.add(z.Sin).Sinh.div(z).Sin.mul(z.Sin.mul(z.Sin)).Sin
}

// Clausen_function
// https://en.wikipedia.org/wiki/Clausen_function
function clausen(z) {
    var num = new Complex(0, 0),
        sum = new Complex(0, 0)

    for (let n = 1; n <= 32; ++n) {
        num.set(n, 0)
        sum = sum.add(z.add(num).Sin.div(num.pow(num)))
    }

    return sum
}

// frequency warping 付近の omega_a
// https://en.wikipedia.org/wiki/Bilinear_transform
function omega_a(z) {
    var two = new Complex(2, 0),
        omega = 10

    return two.div(z).mul(z.div(two).mulr(omega).Tan)
}

function conformalmap(z) {
    var one = new Complex(1, 0)
    return one.add(z).div(one.sub(z))
}

function diniinv(z) {
    var v = Math.cos(z.x) + Math.log(Math.tan(z.x / 2)),
        u = 0.33 * z.y

    z.set(v, u)
    return z.Inv
}

// Dini's surface の z
// https://en.wikipedia.org/wiki/Dini%27s_surface
function dini(z) {
    var v = Math.cos(z.x) + Math.log(Math.tan(z.x / 2)),
        u = 0.33 * z.y

    z.set(v, u)
    return z
}

function expinv(z) {
    return z.Inv.Exp
}

function loginv(z) {
    return z.Inv.Log
}

function klein(z) {
    var one = new Complex(1, 0)
    return z.mulr(2).div(one.add(z.mul(z)))
}

function somethinghyperbolic(z) {
    var one = new Complex(1, 0)
    return one.add(z).div(one.sub(z)).Log
}

function euler(z) {
    var i1 = new Complex(0, 1),
        i2 = new Complex(0, -1)

    return z.mul(i1).Exp.add(z.mul(i2).Exp).mulr(0.5)
}

function mundelinv(z) {
    return mandelbrot(z.Inv)
}

function zetainv(z) {
    return zeta(z.Inv)
}

function cosinv(z) {
    return z.Inv.Cos
}

function sininv(z) {
    return z.Inv.Sin
}

function addmuldiv(z) {
    return z.mul(z).add(z)
}

function munchdelbrot(z) {
    z = mandelbrot(z)

    var step = 16,
        munch = parseInt(step * z.x) ^ parseInt(step * z.y)

    z.set(munch, z.y)
    return z
}

function munchzeta(z) {
    z = zeta(z)

    var step = 16,
        munch = parseInt(step * z.x) ^ parseInt(step * z.y)

    z.set(munch, z.y)
    return z
}

function munch(z) {
    var step = 4,
        munch = parseInt(step * z.x) ^ parseInt(step * z.y)

    z.set(munch, z.y)
    return z
}

function taninv(z) {
    return z.Inv.Tan
}

function sin(z) {
    return z.Sin
}

function cos(z) {
    return z.Cos
}

function inv(z) {
    return z.Inv
}

function tan2(z) {
    return z.Tan2
}

function tan(z) {
    return z.Tan
}

function man3(z) {
    var one = new Complex(1, 0)
    return mandelbrot(one.div(zeta(z)))
}

function man2(z) {
    var one = new Complex(1, 0)
    return mandelbrot(z.Exp.mul(z.Con.Log).add(one).Cos)
}

function sinhcosh(z) {
    return z.Sinh.Cosh
}

function sinhinv(z) {
    return z.Sinh.Inv.div(z.Cosh.Con)
}

function mullog(c) {
    return c.mul(c.Log)
}

function mandelbrot(c) {
    var z = c
    for (let i = 0; i < 128; ++i) {
        z = z.mul(z).add(c)
    }
    return z
}

function somefractal(c) {
    var z = c,
        one = new Complex(1, 0)

    for (let i = 0; i < 32; ++i) {
        z = z.Sinh.div(c).add(c)
    }
    return z
}

function somefractal1(c) {
    var z = c,
        n = new Complex(1.85, 0.02)

    for (let i = 0; i < 128; ++i) {
        z = z.Sin.add(c)
    }
    return z
}

function zeta(s) {
    var s_neg = s.Neg,
        num = new Complex(0, 0),
        sum = new Complex(0, 0)

    for (let n = 1; n <= 32; ++n) {
        num.set(n, 0)
        sum = sum.add(num.pow(s_neg))
    }

    return sum
}

// func V //


function one(zz) {
    return 1
}

function invZZ(zz) {
    return 1 / zz.Abs
}

function abs10(zz) {
    return zz.Abs * 10
}

// update Canvas //

function updateCanvas(time, cv, funcZ, funcV) {
    cv.clearWhite()

    var z = new Complex(0, 0),
        n = new Complex(1, 1),
        width = cv.Width,
        height = cv.Height,
        pixels = cv.Pixels,
        scale, index, h, s, v, color,
        x, y, zz

    //scale = U.loginterp(MIN_SCALE, MAX_SCALE, 0.5 * (1 + Math.sin(time * 0.001)))
    //scale = U.loginterp(MIN_SCALE, MAX_SCALE, 0.5)
    scale = 4
    for (x = 0; x < width; ++x) {
        for (y = 0; y < height; ++y) {
            z.set(
                scale * (0.5 - x / width),
                scale * (0.5 - y / height)
            )

            zz = funcZ(z)

            h = (zz.Arg + Math.PI) / Math.PI
            s = 1
            v = funcV(zz)

            color = U.hsv2rgb(h, s, v, 255)

            index = (y * width + x) * 4
            pixels[index + 0] = color.r
            pixels[index + 1] = color.g
            pixels[index + 2] = color.b
            pixels[index + 3] = color.a
        }
    }
    cv.putPixel()
    //console.log(z, h, s, v, color)
}