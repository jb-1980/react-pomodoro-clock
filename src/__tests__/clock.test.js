import React from "react"
import { render, fireEvent, screen } from "@testing-library/react"

import { Clock } from "../Clock"

console.log({ jest })

test("clicking clock starts timer", async () => {
  render(<Clock />)
  jest.useFakeTimers()

  expect(screen.getByTestId("ticker-time").innerHTML).toBe("25:00")
  fireEvent.click(screen.getByTestId("ticker"))

  Promise.resolve().then(() => jest.advanceTimersByTime(60000))
  expect(screen.getByTestId("ticker-time").innerHTML).toBe("24:00")
})
