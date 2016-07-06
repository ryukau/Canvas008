// https://en.wikipedia.org/wiki/Levenshtein_distance
function lev(a, b) {
    var sa = a.toString(),
        sb = b.toString()
    return levenshtein(sa, sb, sa.length, sb.length)
}
function levenshtein(a, b, i, j) {
    if (i === 0) {
        return j
    }
    if (j === 0) {
        return i
    }

    var cost
    if (a[i - 1] === b[j - 1]) {
        cost = 0
    }
    else {
        cost = 1
    }

    return Math.min(
        levenshtein(a, b, i - 1, j) + 1,
        levenshtein(a, b, i, j - 1) + 1,
        levenshtein(a, b, i - 1, j - 1) + cost
    )
}
console.log(lev("hoge", "huga"))

//
var canvas = []
for (let i = 0; i < 16; ++i) {
    canvas.push(new Canvas(64, 64))
}

!function animate() {
    var time = Date.now()
    updateCanvas(time, canvas[0], cartesian)
    updateCanvas(time, canvas[1], taxicab)
    updateCanvas(time, canvas[2], poincareDisk)
    updateCanvas(time, canvas[3], poincareUpperHalfPlane)
    updateCanvas(time, canvas[4], discrete)
    updateCanvas(time, canvas[5], abs)
    updateCanvas(time, canvas[6], BeltramikleinDisk)
    updateCanvas(time, canvas[7], poincareBall)
    updateCanvas(time, canvas[8], hyperboloid)
    updateCanvas(time, canvas[9], log)
    updateCanvas(time, canvas[10], polar)
    updateCanvas(time, canvas[11], complexInv)
    updateCanvas(time, canvas[12], complexTan)
    updateCanvas(time, canvas[13], quaternionExp)
    updateCanvas(time, canvas[14], quaternionLog)
    updateCanvas(time, canvas[15], quaternionInv)
    requestAnimationFrame(animate)
} ()

function quaternionInv(x, y) {
    var q = new Quaternion(0, y, x, x)
    return q.Inv.Angle
}

function quaternionLog(x, y) {
    var q = new Quaternion(0, x, y, y)
    return q.Log.Norm
}

function quaternionExp(x, y) {
    //var q = new Quaternion((Date.now() * 0.001) % 100, x, y, y)
    var q = new Quaternion(x * x, x + y, y, y * x)
    return q.Exp.Angle
}

function complexTan(x, y) {
    var c = new Complex(x, y)
    return c.Tan.Abs
}

function complexInv(x, y) {
    var c = new Complex(x, y)
    return c.Inv.Abs
}

function polar(x, y) {
    var r = x * x + y * y,
        theta = Math.atan2(y, x)
    return Math.sqrt(r * r + theta * theta)
}

function log(x, y) {
    return Math.log(Math.abs(y / x))
}

function hyperboloid(x, y) {
    var B = x * y
    return Math.acosh(Math.abs(B) * 1e2)
}

function poincareBall(x, y) {
    var s = BeltramikleinDisk(x, y)
    return s / (1 + Math.sqrt(1 - s * s))
}

function BeltramikleinDisk(x, y) {
    var u = poincareDisk(x, y)
    return 2 * u / (1 + u * u)
}

function abs(x, y) {
    return Math.abs(y - x)
}

function discrete(x, y) {
    return (x === y) ? 0 : 1
}

function taxicab(x, y) {
    return Math.abs(x) + Math.abs(y)
}

function cartesian(x, y) {
    return Math.sqrt(x * x + y * y)
}

function poincareDisk(x, y) {
    var n = x * x + y * y,
        delta = 2 * n / (1 - n)
    return Math.acosh(1 + delta)
}

function poincareUpperHalfPlane(x, y) {
    return Math.acosh(1 + (x * x + y * y) / (2 * y))
}

function updateCanvas(time, canvas, distanceFunction) {
    var context = canvas.Context,
        width = canvas.Width,
        height = canvas.Height,
        pixels = canvas.Pixels,
        x, y, distance, brightness

    for (x = 0; x < width; ++x) {
        for (y = 0; y < height; ++y) {
            distance = distanceFunction((x - width * 0.5) * 2 / width, (y - height * 0.5) * 2 / height)
            brightness = (time + distance * 1e3) % 256

            index = (y * width + x) * 4
            pixels[index + 0] = brightness
            pixels[index + 1] = brightness
            pixels[index + 2] = brightness
            pixels[index + 3] = 255
        }
    }
    canvas.putPixel()
}