import {
  BREAK,
  defaultState,
  LONGBREAK,
  POMODORO,
  type ClockState,
} from "./definitions"
import { persistState } from "./storage"

type Action =
  | { type: "TOGGLE_CLOCK_STATE" }
  | { type: "DECREMENT_TIME" }
  | { type: "CHANGE_BREAK_LENGTH"; value: number }
  | { type: "CHANGE_POMODORO_LENGTH"; value: number }
  | { type: "TOGGLE_PAUSE" }
  | { type: "TOGGLE_INCLUDE_LONG_BREAKS" }
  | { type: "CHANGE_LONG_BREAK_LENGTH"; value: number }
  | { type: "CHANGE_LONG_BREAK_CYCLES"; value: number }
  | { type: "RESET" }

export const reducer = (state: ClockState, action: Action) => {
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
              startTime: Date.now(),
            }
          }
          return {
            ...state,
            clockState: BREAK,
            cycle: state.cycle + 1,
            time: state.breakLength * 60 * 1000,
            startTime: Date.now(),
          }
        }
        case BREAK:
          return {
            ...state,
            clockState: POMODORO,
            time: state.pomodoroLength * 60 * 1000,
            startTime: Date.now(),
          }
        case LONGBREAK:
          return {
            ...state,
            clockState: POMODORO,
            cycle: 1,
            time: state.pomodoroLength * 60 * 1000,
            startTime: Date.now(),
          }
        default:
          return state
      }
    }

    case "DECREMENT_TIME": {
      const timeDelta = Date.now() - state.startTime
      return {
        ...state,
        time: state.time - timeDelta,
        startTime: Date.now(),
      }
    }

    case "CHANGE_BREAK_LENGTH": {
      const breakLength = state.breakLength + action.value
      if (breakLength < 1) return state

      const nextState =
        state.clockState === POMODORO
          ? { ...state, breakLength }
          : {
              ...state,
              breakLength,
              time: state.time + action.value * 1000 * 60, // add 1 minute * value
            }
      persistState(nextState)
      return nextState
    }

    case "CHANGE_POMODORO_LENGTH": {
      const pomodoroLength = state.pomodoroLength + action.value
      if (pomodoroLength < 1) return state
      const nextState =
        state.clockState === POMODORO
          ? {
              ...state,
              pomodoroLength,
              time: state.time + action.value * 1000 * 60, // add 1 minute * value
            }
          : { ...state, pomodoroLength }
      persistState(nextState)
      return nextState
    }
    case "TOGGLE_PAUSE": {
      // case initial start
      if (!state.startTime) {
        return { ...state, paused: false, startTime: Date.now() }
      }

      // case switch from pause to play
      if (state.paused) {
        return { ...state, paused: false, startTime: Date.now() }
      }

      // case switch from play to pause
      return { ...state, paused: true }
    }
    case "TOGGLE_INCLUDE_LONG_BREAKS": {
      const nextState = {
        ...state,
        includeLongBreaks: !state.includeLongBreaks,
      }
      persistState(nextState)
      return nextState
    }
    case "CHANGE_LONG_BREAK_LENGTH": {
      const longBreakLength = state.longBreakLength + action.value
      if (longBreakLength < 1) return state
      const nextState = { ...state, longBreakLength }
      persistState(nextState)
      return nextState
    }
    case "CHANGE_LONG_BREAK_CYCLES": {
      const longBreakCycles = state.longBreakCycles + action.value
      if (longBreakCycles < 1) return state
      const nextState = { ...state, longBreakCycles }
      persistState(nextState)
      return nextState
    }
    case "RESET": {
      persistState(defaultState)
      return defaultState
    }
  }
}
