import { useEffect, useReducer, useState } from "react"
import { Ticker } from "./Ticker"
import { Settings } from "./Settings"
import { reducer } from "../utils/reducer"
import { retrieveState } from "../utils/storage"

const styles = {
  textRancho: { fontFamily: "'Rancho', cursive" },
  textGochi: { fontFamily: "'Gochi Hand', cursive" },
  titleText: { fontSize: "5em", textAlign: "center", margin: "10px 0 0 0" },
} as const

const audio = new Audio("/assets/alert.mp3")

export const Clock = () => {
  const [
    {
      breakLength,
      pomodoroLength,
      clockState,
      paused,
      time,
      cycle,
      includeLongBreaks,
      longBreakLength,
      longBreakCycles,
    },
    dispatch,
  ] = useReducer(reducer, null, retrieveState)

  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const intervalTime = 500
    const intervalId = setInterval(() => {
      if (!paused) {
        if (time <= 0) {
          // time has run out
          audio.play().catch((e) => console.error("Error playing audio:", e))
          dispatch({ type: "TOGGLE_CLOCK_STATE" })
        } else {
          // decrement time
          dispatch({ type: "DECREMENT_TIME" })
        }
      }
    }, intervalTime)
    return () => clearInterval(intervalId)
  }, [paused, time])

  const calculateRadians = () => {
    const totalTime =
      {
        pomodoro: pomodoroLength,
        break: breakLength,
        longBreak: longBreakLength,
      }[clockState] *
      60 *
      1000
    return 2 * Math.PI * (1 - time / totalTime)
  }

  const radians = calculateRadians()
  return (
    <section
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1 style={{ ...styles.textRancho, ...styles.titleText }}>
        Pomodoro Clock
      </h1>
      <h2 style={{ ...styles.textGochi, textAlign: "center", margin: 0 }}>
        by Gilgen Labs
      </h2>
      <div
        style={{
          display: "flex",
          ...styles.textGochi,
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2em",
          margin: 10,
        }}
      >
        <button
          style={{
            padding: "5px 10px",
            fontSize: 20,
            ...styles.textGochi,
            color: "#fff",
            background: "transparent",
            border: "2px solid #fff",
            borderRadius: 5,
          }}
          onClick={() => setShowSettings(!showSettings)}
        >
          Settings
        </button>
      </div>
      {showSettings ? (
        <Settings
          breakLength={breakLength}
          pomodoroLength={pomodoroLength}
          includeLongBreaks={includeLongBreaks}
          longBreakLength={longBreakLength}
          longBreakCycles={longBreakCycles}
          dispatch={dispatch}
        />
      ) : (
        <Ticker
          clickHandler={() => dispatch({ type: "TOGGLE_PAUSE" })}
          radians={radians}
          clockState={clockState}
          time={time}
          includeLongBreaks={includeLongBreaks}
          longBreakCycles={longBreakCycles}
          cycle={cycle}
        />
      )}
      <button
        type="button"
        style={{
          ...styles.textRancho,
          cursor: "pointer",
          textAlign: "center",
          fontSize: "2em",
          background: "transparent",
          border: "none",
          padding: 0,
        }}
        onClick={() => dispatch({ type: "RESET" })}
      >
        reset
      </button>
    </section>
  )
}
