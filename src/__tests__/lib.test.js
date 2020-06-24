import { parametizeArc, formatTime, pad } from "../lib"

test("parametizeArc returns correct path string", () => {
  const centerX = 100
  const centerY = 100
  const radius = 100
  const startAngle = 0 //radians
  const endAngle = Math.PI / 4
  const path = parametizeArc(centerX, centerY, radius, startAngle, endAngle)

  expect(path.replace(/\s/g, "")).toBe(
    `
    M 100,0
    A 100,100
      0
      0,1
      170.71067811865476,29.289321881345245`.replace(/\s/g, "")
  )
})

test("pad returns correct padding", () => {
  expect(pad(42, 3)).toBe("042")
  expect(pad(42, 2)).toBe("42")
})

test("formatTime returns correctly when no padding", () => {
  const time = 25.2 * 60 * 1000 // 25 minutes 12 seconds
  const paddedTime = formatTime(time)
  expect(paddedTime).toBe("25:12")
})

test("formatTime returns correct padding", () => {
  const time = 5.1 * 60 * 1000 // 5 minutes 6 seconds
  const paddedTime = formatTime(time)
  expect(paddedTime).toBe("05:06")
})
