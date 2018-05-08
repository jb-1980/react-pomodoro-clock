// helper function to convert the angle in radians to cartesian coordinates
export const polarToCartesian = (xCenter = 0, yCenter = 0, radius, angle) => [
  xCenter + radius * Math.sin(angle),
  yCenter - radius * Math.cos(angle),
]

// helper function to create the arc path for the svg element
export const parametizeArc = (
  xCenter,
  yCenter,
  radius = 165,
  startAngle,
  endAngle
) => {
  const start = polarToCartesian(xCenter, yCenter, radius, startAngle)
  const end = polarToCartesian(xCenter, yCenter, radius, endAngle)
  const arcsweep = Math.abs(endAngle - startAngle) <= Math.PI ? 0 : 1

  // path of an arc.
  // Has form M start-x, start-y A x-radius,y-radius x-rotation larg-arc-flag, sweep-flag end-x, end-y
  return `
    M ${start[0]},${start[1]}
    A ${radius},${radius}
      0
      ${arcsweep},1
      ${end[0]},${end[1]}`
}

export const pad = (num, size) => {
  const s = "0".repeat(size) + num
  return s.substr(s.length - size)
}

export const formatTime = time => {
  // get the number of minutes from our milliseconds
  const m = Math.floor(time / (60 * 1000))

  // strip off the minutes, then get number of seconds
  time = time % (60 * 1000)
  const s = Math.floor(time / 1000)

  // we want to make sure we always have 2 character displayed
  const formattedTime = pad(m, 2) + ":" + pad(s, 2)

  return formattedTime
}
