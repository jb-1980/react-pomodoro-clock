import React from "react"

export default ({ title, time, changeTime }) => (
  <div
    style={{
      WebkitTouchCallout: "none",
      WebkitUserSelect: "none",
      khtmlUserSelect: "none",
      MozUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none",
    }}
  >
    <h3 style={{ margin: 0, padding: "5px 13px 0 0" }}>{title}</h3>
    <div style={{ lineHeight: "1em", fontSize: "2em" }}>
      <span onClick={() => changeTime(-1)}>−</span>
      <span style={{ margin: "0 7px" }}>{time}</span>
      <span onClick={() => changeTime(1)}>+</span>
    </div>
  </div>
)
