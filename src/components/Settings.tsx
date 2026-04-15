import { TimeToggler } from "./TimeToggler"
import type { ClockState } from "../utils/definitions"
import type { Dispatch } from "react"

type Action =
  | { type: "CHANGE_BREAK_LENGTH"; value: number }
  | { type: "CHANGE_POMODORO_LENGTH"; value: number }
  | { type: "CHANGE_LONG_BREAK_LENGTH"; value: number }
  | { type: "CHANGE_LONG_BREAK_CYCLES"; value: number }
  | { type: "TOGGLE_INCLUDE_LONG_BREAKS" }

const styles = {
  textGochi: { fontFamily: "'Gochi Hand', cursive" },
} as const

export const Settings = ({
  breakLength,
  pomodoroLength,
  includeLongBreaks,
  longBreakLength,
  longBreakCycles,
  dispatch,
}: Pick<
  ClockState,
  | "breakLength"
  | "pomodoroLength"
  | "includeLongBreaks"
  | "longBreakLength"
  | "longBreakCycles"
> & {
  dispatch: Dispatch<Action>
}) => {
  return (
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
        changeTime={(value) => dispatch({ type: "CHANGE_BREAK_LENGTH", value })}
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
          aria-label="Include long breaks"
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
  )
}
