import React from "react"

import { parametizeArc, formatTime } from "./lib"

export default ({
  radians,
  clockState,
  time,
  clickHandler,
  includeLongBreaks,
  longBreakCycles,
  cycle,
}) => {
  // noticed that when radians = 0 or 2PI the arc is not rendered, so getting it really close
  const angle =
    clockState === "pomodoro"
      ? radians + 0.0000001
      : 1.999999 * Math.PI - radians
  const formattedTime = formatTime(time)

  const longBreakArcs = []
  if (includeLongBreaks) {
    let spaceAngle = (2.5 * Math.PI) / 180
    let currentAngle = spaceAngle / 2
    let angleLength = (2 * Math.PI) / longBreakCycles - spaceAngle
    for (let i = 0; i < longBreakCycles; i += 1) {
      longBreakArcs.push(
        <path
          key={i}
          d={parametizeArc(
            200,
            200,
            175,
            currentAngle,
            currentAngle + angleLength
          )}
          stroke={i + 1 >= cycle ? "#333" : "#e4e3e3"}
          strokeWidth="10"
          stroke-cap="butt"
          fillOpacity="0"
          fill="transparent"
        />
      )
      currentAngle += spaceAngle + angleLength
    }
  }
  return (
    <div
      style={{ textAlign: "center", width: 400, height: 400 }}
      onClick={clickHandler}
      data-testid="ticker"
    >
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <circle cx="200" cy="200" r="200" fill="#111" fillOpacity="0.5" />
        <path
          d={parametizeArc(200, 200, 190, 0, angle)}
          stroke={clockState === "pomodoro" ? "#32afa9" : "#cf1b1b"}
          strokeWidth="10"
          stroke-cap="butt"
          fill="transparent"
        />
        <path
          d={parametizeArc(200, 200, 190, angle, 2 * Math.PI)}
          stroke="black"
          strokeWidth="10"
          stroke-cap="butt"
          fill="transparent"
        />
        {longBreakArcs}
        <text
          x="200"
          y="200"
          style={{
            fontFamily: "Gochi Hand",
            fontSize: "4em",
            textAnchor: "middle",
            fill: "white",
            dominantBaseline: "baseline",
          }}
          data-testid="ticker-label"
        >
          {
            { pomodoro: "Work", break: "Break", longBreak: "Long Break" }[
              clockState
            ]
          }
        </text>
        <text
          x="200"
          y="200"
          style={{
            fontFamily: "Gochi Hand",
            fontSize: "4em",
            textAnchor: "middle",
            fill: "white",
            dominantBaseline: "hanging",
          }}
          data-testid="ticker-time"
        >
          {formattedTime}
        </text>
      </svg>
    </div>
  )
}
