import React from "react"

// helper function to convert the angle to cartesian coordinates
const polarToCartesian = (xCenter = 0, yCenter = 0, radius, angle) => [
  xCenter + radius * Math.sin(angle),
  yCenter - radius * Math.cos(angle),
]

// helper function to create the arc path for the svg element
const parametizeArc = (
  xCenter,
  yCenter,
  radius = 165,
  startAngle,
  endAngle
) => {
  const start = polarToCartesian(xCenter, yCenter, radius, startAngle)
  const end = polarToCartesian(xCenter, yCenter, radius, endAngle)
  console.log(endAngle, startAngle)
  const arcsweep = Math.abs(endAngle - startAngle) <= Math.PI ? 0 : 1

  // path of an arc.
  // Has form M start-x, start-y A x-radius,y-radius x-rotation larg-arc-flag, sweep-flag end-x, end-y
  return `M ${start[0]},${start[1]} A ${radius},${radius} 0 ${arcsweep},1 ${
    end[0]
  },${end[1]}`
}

const pad = (num, size) => {
  const s = "0".repeat(size) + num
  return s.substr(s.length - size)
}

function formatTime(time) {
  // get the number of minutes from our milliseconds
  const m = Math.floor(time / (60 * 1000))

  // strip off the minutes, then get number of seconds
  time = time % (60 * 1000)
  const s = Math.floor(time / 1000)

  // we want to make sure we always have 2 character displayed
  const formattedTime = pad(m, 2) + ":" + pad(s, 2)

  return formattedTime
}

export default ({ radians, inSession, time, clickHandler }) => {
  const angle = inSession ? radians + 0.0001 : 1.999999 * Math.PI - radians
  const formattedTime = formatTime(time)
  return (
    <div style={{ textAlign: "center" }} onClick={clickHandler}>
      <svg width="350" height="350" xmlns="http://www.w3.org/2000/svg">
        <path
          d={parametizeArc(175, 175, 165, 0, angle)}
          stroke={inSession ? "green" : "red"}
          strokeWidth="10"
          strokeCap="butt"
          fillOpacity="0.5"
        />
        <path
          d={parametizeArc(175, 175, 165, angle, 1.99999999 * Math.PI)}
          stroke="black"
          strokeWidth="10"
          strokeCap="butt"
          fillOpacity="0.5"
        />
        <text
          x="175"
          y="150"
          fontFamily="Gochi Hand"
          fontSize="4em"
          textAnchor="middle"
          fill="white"
        >
          {inSession ? "Session" : "Break"}
        </text>
        <text
          x="175"
          y="190"
          fontFamily="Gochi Hand"
          fontSize="4em"
          textAnchor="middle"
          fill="white"
        >
          {formattedTime}
        </text>
      </svg>
    </div>
  )
}
