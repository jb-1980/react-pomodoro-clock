import React from "react"
import Ticker from "./Ticker"
import TimeToggler from "./time-toggler"

const styles = {
  textRancho: { fontFamily: "'Rancho', cursive" },
  textGochi: { fontFamily: "'Gochi Hand', cursive" },
  titleText: { fontSize: "5em", textAlign: "center", margin: "10px 0 0 0" },
}

const defaultState = {
  breakLength: 5,
  sessionLength: 25,
  inSession: true,
  paused: true,
  time: 25 * 60 * 1000, // session time in milliseconds
}

const getDefaultState = () => {
  const storedState = localStorage.getItem("react-pomodo-clock-state")
  if (!storedState) {
    return defaultState
  }

  let { breakLength, sessionLength } = JSON.parse(storedState)

  return {
    ...defaultState,
    breakLength,
    sessionLength,
    time: sessionLength * 60000,
  }
}

const storeState = state => {
  let { breakLength, sessionLength } = state
  localStorage.setItem(
    "react-pomodo-clock-state",
    JSON.stringify({ breakLength, sessionLength })
  )
}

const reducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_SESSION": {
      if (state.inSession) {
        // in a session and not a break
        // switch over to a break and set timer

        return {
          ...state,
          inSession: false,
          time: state.breakLength * 60 * 1000,
        }
      } else {
        // in a break and not a session
        // switch over to session and set timer
        return {
          ...state,
          inSession: true,
          time: state.sessionLength * 60 * 1000,
        }
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

      let nextState = state.inSession
        ? { ...state, breakLength }
        : {
            ...state,
            breakLength,
            time: state.time + action.value * 1000 * 60, // add 1 minute * value
          }
      storeState(nextState)
      return nextState
    }

    case "CHANGE_SESSION_LENGTH": {
      let sessionLength = state.sessionLength + action.value
      if (sessionLength < 1) return state
      let nextState = state.inSession
        ? {
            ...state,
            sessionLength,
            time: state.time + action.value * 1000 * 60, // add 1 minute * value
          }
        : { ...state, sessionLength }
      storeState(nextState)
      return nextState
    }
    case "TOGGLE_PAUSE": {
      return { ...state, paused: !state.paused }
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
    { breakLength, sessionLength, inSession, paused, time },
    dispatch,
  ] = React.useReducer(reducer, getDefaultState())

  React.useEffect(() => {
    const intervalTime = 500
    let intervalId = setInterval(() => {
      if (!paused) {
        if (time - intervalTime <= 0) {
          // time has run out
          audio.play()
          dispatch({ type: "TOGGLE_SESSION" })
        } else {
          // decrement time
          dispatch({ type: "DECREMENT_TIME", intervalTime })
        }
      }
    }, intervalTime)
    return () => clearInterval(intervalId)
  }, [paused, time])

  const calculateRadians = () => {
    const totalTime = inSession
      ? sessionLength * 60 * 1000
      : breakLength * 60 * 1000
    return 2 * Math.PI * (1 - time / totalTime)
  }

  const radians = calculateRadians()
  return (
    <section>
      <h1 style={{ ...styles.textRancho, ...styles.titleText }}>
        Pomodo Clock
      </h1>
      <h2 style={{ ...styles.textGochi, textAlign: "center", marginTop: 0 }}>
        by Gilgen Labs
      </h2>
      <div
        style={{
          display: "flex",
          ...styles.textGochi,
          textAlign: "center",
          fontSize: "2em",
        }}
      >
        <TimeToggler
          title="Break Length"
          time={breakLength}
          changeTime={value => dispatch({ type: "CHANGE_BREAK_LENGTH", value })}
        />
        <TimeToggler
          title="Session Length"
          time={sessionLength}
          changeTime={value =>
            dispatch({ type: "CHANGE_SESSION_LENGTH", value })
          }
        />
      </div>
      <Ticker
        clickHandler={() => dispatch({ type: "TOGGLE_PAUSE" })}
        radians={radians}
        inSession={inSession}
        time={time}
      />
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
