export const [POMODORO, BREAK, LONGBREAK] = [
  "pomodoro",
  "break",
  "longBreak",
] as const

export type ClockState = {
  breakLength: number
  clockState: "pomodoro" | "break" | "longBreak"
  cycle: number
  includeLongBreaks: boolean
  longBreakCycles: number
  longBreakLength: number
  paused: boolean
  pomodoroLength: number
  startTime: number
  time: number // how many milliseconds are left in cycle
}

export const defaultState = {
  breakLength: 5,
  pomodoroLength: 25,
  clockState: POMODORO,
  paused: true,
  time: 25 * 60 * 1000,
  cycle: 1,
  includeLongBreaks: true,
  longBreakLength: 15,
  longBreakCycles: 4,
  startTime: Date.now(),
}
