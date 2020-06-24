import React from "react"
import { render, fireEvent, screen } from "@testing-library/react"

import TimeToggler from "../time-toggler"

test("renders title and time", async () => {
  const title = "Test"
  const time = 25000
  render(<TimeToggler title={title} time={time} changeTime={() => {}} />)

  expect(screen.getByText(title, { selector: "h3" })).toBeTruthy()
  expect(screen.getByText(String(time))).toBeTruthy()
})

test("Increments time on + click", async () => {
  const title = "Test"
  let time = 25
  const setTime = delta => {
    time = time + delta
  }
  render(<TimeToggler title={title} time={time} changeTime={setTime} />)

  fireEvent.click(screen.getByText("+"))

  expect(time).toBe(26) // 26 minutes
})

test("Decrements time on - click", async () => {
  const title = "Test"
  let time = 25
  const setTime = delta => {
    time = time + delta
  }
  render(<TimeToggler title={title} time={time} changeTime={setTime} />)

  fireEvent.click(screen.getByText("−"))

  expect(time).toBe(24) // 26 minutes
})
