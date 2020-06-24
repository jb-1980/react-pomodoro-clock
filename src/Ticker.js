import React from "react"

import { parametizeArc, formatTime } from "./lib"

export default ({ radians, inSession, time, clickHandler }) => {
  // noticed that when radians = 0 or 2PI the arc is not rendered, so getting it really close
  const angle = inSession ? radians + 0.0000001 : 1.999999 * Math.PI - radians
  const formattedTime = formatTime(time)
  return (
    <div
      style={{ textAlign: "center" }}
      onClick={clickHandler}
      data-testid="ticker"
    >
      <svg width="350" height="350" xmlns="http://www.w3.org/2000/svg">
        <path
          d={parametizeArc(175, 175, 165, 0, angle)}
          stroke={inSession ? "green" : "red"}
          strokeWidth="10"
          stroke-cap="butt"
          fillOpacity="0.5"
        />
        <path
          d={parametizeArc(175, 175, 165, angle, 2 * Math.PI)}
          stroke="black"
          strokeWidth="10"
          stroke-cap="butt"
          fillOpacity="0.5"
        />
        <text
          x="175"
          y="150"
          fontFamily="Gochi Hand"
          fontSize="4em"
          textAnchor="middle"
          fill="white"
          data-testid="ticker-label"
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
          data-testid="ticker-time"
        >
          {formattedTime}
        </text>
      </svg>
    </div>
  )
}
