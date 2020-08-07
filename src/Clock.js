import React from "react"
import Ticker from "./Ticker"
import TimeToggler from "./time-toggler"

const styles = {
  textRancho: { fontFamily: "'Rancho', cursive" },
  textGochi: { fontFamily: "'Gochi Hand', cursive" },
  titleText: { fontSize: "5em", textAlign: "center", margin: "10px 0 0 0" },
}

const [POMODORO, BREAK, LONGBREAK] = ["pomodoro", "break", "longBreak"]

export const defaultState = {
  breakLength: 5,
  pomodoroLength: 25,
  clockState: POMODORO, // one of "pomodoro", "break", "longBreak"
  paused: true,
  time: 25 * 60 * 1000, // session time in milliseconds
  cycle: 1,
  includeLongBreaks: true,
  longBreakLength: 15,
  longBreakCycles: 4,
}

const getDefaultState = () => {
  const storedState = localStorage.getItem("react-pomodo-clock-state")
  if (!storedState) {
    return defaultState
  }

  let {
    breakLength,
    pomodoroLength,
    includeLongBreaks,
    longBreakLength,
    longBreakCycles,
  } = JSON.parse(storedState)

  return {
    ...defaultState,
    breakLength,
    pomodoroLength,
    includeLongBreaks,
    longBreakLength,
    longBreakCycles,
    time: pomodoroLength * 60000,
  }
}

const storeState = (state) => {
  let {
    breakLength,
    pomodoroLength,
    includeLongBreaks,
    longBreakLength,
    longBreakCycles,
  } = state
  localStorage.setItem(
    "react-pomodo-clock-state",
    JSON.stringify({
      breakLength,
      pomodoroLength,
      includeLongBreaks,
      longBreakCycles,
      longBreakLength,
    })
  )
}

export const reducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_CLOCK_STATE": {
      switch (state.clockState) {
        case POMODORO: {
          if (
            state.includeLongBreaks &&
            state.cycle % state.longBreakCycles === 0
          ) {
            return {
              ...state,
              clockState: LONGBREAK,
              cycle: state.cycle + 1,
              time: state.longBreakLength * 60 * 1000,
            }
          }
          return {
            ...state,
            clockState: BREAK,
            cycle: state.cycle + 1,
            time: state.breakLength * 60 * 1000,
          }
        }
        case BREAK:
          return {
            ...state,
            clockState: POMODORO,
            time: state.pomodoroLength * 60 * 1000,
          }
        case LONGBREAK:
          return {
            ...state,
            clockState: POMODORO,
            cycle: 1,
            time: state.pomodoroLength * 60 * 1000,
          }
        default:
          return state
      }
    }

    case "DECREMENT_TIME": {
      return {
        ...state,
        time: state.time - action.intervalTime,
      }
    }

    case "CHANGE_BREAK_LENGTH": {
      let breakLength = state.breakLength + action.value
      if (breakLength < 1) return state

      let nextState =
        state.clockState === POMODORO
          ? { ...state, breakLength }
          : {
              ...state,
              breakLength,
              time: state.time + action.value * 1000 * 60, // add 1 minute * value
            }
      storeState(nextState)
      return nextState
    }

    case "CHANGE_POMODORO_LENGTH": {
      let pomodoroLength = state.pomodoroLength + action.value
      if (pomodoroLength < 1) return state
      let nextState =
        state.clockState === POMODORO
          ? {
              ...state,
              pomodoroLength,
              time: state.time + action.value * 1000 * 60, // add 1 minute * value
            }
          : { ...state, pomodoroLength }
      storeState(nextState)
      return nextState
    }
    case "TOGGLE_PAUSE": {
      return { ...state, paused: !state.paused }
    }
    case "TOGGLE_INCLUDE_LONG_BREAKS": {
      let nextState = { ...state, includeLongBreaks: !state.includeLongBreaks }
      storeState(nextState)
      return nextState
    }
    case "CHANGE_LONG_BREAK_LENGTH": {
      let longBreakLength = state.longBreakLength + action.value
      if (longBreakLength < 1) return state
      let nextState = { ...state, longBreakLength }
      storeState(nextState)
      return nextState
    }
    case "CHANGE_LONG_BREAK_CYCLES": {
      let longBreakCycles = state.longBreakCycles + action.value
      if (longBreakCycles < 1) return state
      let nextState = { ...state, longBreakCycles }
      storeState(nextState)
      return { ...state, longBreakCycles }
    }
    case "RESET": {
      storeState(defaultState)
      return defaultState
    }

    default:
      throw Error(`no case for action.type ${action.type}`)
  }
}

const audio = new Audio("/assets/alert.mp3")

export const Clock = () => {
  let [
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
  ] = React.useReducer(reducer, getDefaultState())

  let [showSettings, setShowSettings] = React.useState(false)

  React.useEffect(() => {
    const intervalTime = 500
    let intervalId = setInterval(() => {
      if (!paused) {
        if (time - intervalTime <= 0) {
          // time has run out
          audio.play()
          dispatch({ type: "TOGGLE_CLOCK_STATE" })
        } else {
          // decrement time
          dispatch({ type: "DECREMENT_TIME", intervalTime })
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
        <div
          style={{
            width: 400,
            height: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            ...styles.textGochi,
          }}
        >
          <TimeToggler
            title="Break Length"
            time={breakLength}
            changeTime={(value) =>
              dispatch({ type: "CHANGE_BREAK_LENGTH", value })
            }
          />
          <TimeToggler
            title="Session Length"
            time={pomodoroLength}
            changeTime={(value) =>
              dispatch({ type: "CHANGE_POMODORO_LENGTH", value })
            }
          />
          <label>
            <input
              type="checkbox"
              checked={includeLongBreaks}
              onChange={() => dispatch({ type: "TOGGLE_INCLUDE_LONG_BREAKS" })}
            />
            Include long breaks
          </label>
          <div>
            <TimeToggler
              title="Long Break Length"
              time={longBreakLength}
              changeTime={(value) =>
                dispatch({ type: "CHANGE_LONG_BREAK_LENGTH", value })
              }
              disabled={!includeLongBreaks}
            />
            <TimeToggler
              title="Cycles between long breaks"
              time={longBreakCycles}
              changeTime={(value) =>
                dispatch({ type: "CHANGE_LONG_BREAK_CYCLES", value })
              }
              disabled={!includeLongBreaks}
            />
          </div>
        </div>
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
      <div
        style={{
          ...styles.textRancho,
          cursor: "pointer",
          textAlign: "center",
          fontSize: "2em",
        }}
        onClick={() => dispatch({ type: "RESET" })}
      >
        reset
      </div>
    </section>
  )
}
