import { defaultState, type ClockState } from "./definitions"

const storageKey = "react-pomodo-clock-state"

export const persistState = (state: ClockState) => {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      breakLength: state.breakLength,
      pomodoroLength: state.pomodoroLength,
      includeLongBreaks: state.includeLongBreaks,
      longBreakCycles: state.longBreakCycles,
      longBreakLength: state.longBreakLength,
    })
  )
}

export const retrieveState = (): ClockState => {
  const storedState = localStorage.getItem(storageKey)
  if (!storedState) {
    return defaultState
  }

  const { breakLength, pomodoroLength, includeLongBreaks, longBreakLength, longBreakCycles } = JSON.parse(storedState)

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
