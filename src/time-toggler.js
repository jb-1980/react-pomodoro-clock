import React from "react"

export default ({ title, time, changeTime, disabled }) => (
  <div
    style={{
      WebkitTouchCallout: "none",
      WebkitUserSelect: "none",
      khtmlUserSelect: "none",
      MozUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none",
      fontFamily: '"Gochi Hand", cursive',
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? "not-allowed" : "inherit",
      margin: 10,
      fontSize: 20,
    }}
  >
    <h3 style={{ margin: 0, padding: "5px 13px 0 0" }}>{title}</h3>
    <div style={{ lineHeight: "1em", fontSize: "2em" }}>
      <span
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        onClick={() => (disabled ? null : changeTime(-1))}
      >
        −
      </span>
      <span style={{ margin: "0 7px" }}>{time}</span>
      <span
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        onClick={() => (disabled ? null : changeTime(1))}
      >
        +
      </span>
    </div>
  </div>
)
