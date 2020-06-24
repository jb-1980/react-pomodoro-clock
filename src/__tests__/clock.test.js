import React from "react"
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react"

import { Clock, defaultState } from "../Clock"
import { formatTime } from "../lib"

test("clicking clock starts timer", () => {
  render(<Clock />)
  jest.useFakeTimers()

  let time = formatTime(defaultState.sessionLength * 60000)
  expect(screen.getByTestId("ticker-time").innerHTML).toBe(time)
  expect(screen.getByTestId("ticker-label").innerHTML).toBe("Session")
  fireEvent.click(screen.getByTestId("ticker"))

  let intervalTime = 1000
  act(() => jest.advanceTimersByTime(intervalTime))
  expect(screen.getByTestId("ticker-label").innerHTML).toBe("Session")
  expect(screen.getByTestId("ticker-time").innerHTML).toBe(
    formatTime(defaultState.time - intervalTime)
  )
})

test("session/break toggle works", async () => {
  render(<Clock />)
  jest.useFakeTimers()

  let fn = jest.fn()

  // used to mock when audio.play is called in Clock.js
  window.HTMLMediaElement.prototype.play = () => {
    fn()
  }

  let time = formatTime(defaultState.time)
  expect(screen.getByTestId("ticker-time").innerHTML).toBe(time)
  expect(screen.getByTestId("ticker-label").innerHTML).toBe("Session")
  fireEvent.click(screen.getByTestId("ticker"))

  act(() => jest.advanceTimersByTime(defaultState.sessionLength * 60000))
  await waitFor(() => {
    expect(screen.getByTestId("ticker-time").innerHTML).toBe(
      formatTime(defaultState.breakLength * 60000)
    )
    expect(screen.getByTestId("ticker-label").innerHTML).toBe("Break")
    expect(fn).toHaveBeenCalledTimes(1)
  })

  act(() => jest.advanceTimersByTime(defaultState.breakLength * 60000))
  await waitFor(() => {
    expect(screen.getByTestId("ticker-time").innerHTML).toBe(
      formatTime(defaultState.sessionLength * 60000)
    )
    expect(screen.getByTestId("ticker-label").innerHTML).toBe("Session")
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
