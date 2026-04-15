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

  try {
    const retrievedState: unknown = JSON.parse(storedState)

    // validate retrieved state
    if (typeof retrievedState !== "object" || retrievedState === null) {
      throw new Error("Invalid state shape")
    }

    const state = retrievedState as Record<string, unknown>

    if (
      typeof state.breakLength !== "number" ||
      typeof state.pomodoroLength !== "number" ||
      typeof state.includeLongBreaks !== "boolean" ||
      typeof state.longBreakCycles !== "number" ||
      typeof state.longBreakLength !== "number"
    ) {
      throw new Error("Invalid state properties")
    }
    const breakLength = Number(state.breakLength)
    const pomodoroLength = Number(state.pomodoroLength)
    const includeLongBreaks = Boolean(state.includeLongBreaks)
    const longBreakCycles = Number(state.longBreakCycles)
    const longBreakLength = Number(state.longBreakLength)

    return {
      ...defaultState,
      breakLength,
      pomodoroLength,
      includeLongBreaks,
      longBreakLength,
      longBreakCycles,
      time: pomodoroLength * 60000,
    }
  } catch {
    localStorage.removeItem(storageKey)
    return defaultState
  }
}
