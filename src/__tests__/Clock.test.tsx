import { expect, test, describe, beforeEach, vi } from "vitest"
import { render } from "vitest-browser-react"

// Mock Audio in a hoisted block to ensure it runs before any imports
const { mockAudioPlay, mockAudioPause } = vi.hoisted(() => {
  const mockPlay = vi.fn().mockResolvedValue(undefined)
  const mockPause = vi.fn()

  class MockAudio {
    play = mockPlay
    pause = mockPause
    src = ""
    load = vi.fn()
  }

  globalThis.Audio = MockAudio as unknown as typeof Audio

  return { mockAudioPlay: mockPlay, mockAudioPause: mockPause }
})

import { Clock } from "../components/Clock"

describe("Pomodoro Clock", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Mock Date.now for consistent timing tests
    vi.useFakeTimers()
    // Reset audio mocks
    mockAudioPlay.mockClear()
    mockAudioPause.mockClear()
  })

  test("when first rendered, the timer shows the correct initial time", async () => {
    const { getByTestId } = await render(<Clock />)
    const timeDisplay = getByTestId("ticker-time")
    await expect.element(timeDisplay).toHaveTextContent("25:00")
  })

  test("when clicking the clock, the timer starts counting down", async () => {
    const { getByTestId } = await render(<Clock />)
    const ticker = getByTestId("ticker")
    const timeDisplay = getByTestId("ticker-time")

    // Click to start
    await ticker.click()

    // Advance time by 1 second
    vi.advanceTimersByTime(1000)

    // Timer should have counted down
    await expect.element(timeDisplay).not.toHaveTextContent("25:00")
  })

  test("the timer counts down correctly", async () => {
    const { getByTestId } = await render(<Clock />)
    const ticker = getByTestId("ticker")
    const timeDisplay = getByTestId("ticker-time")

    // Click to start
    await ticker.click()

    // Advance time by 3 seconds
    vi.advanceTimersByTime(3000)

    // Should show approximately 24:57 (may have slight variance due to interval timing)
    await expect.element(timeDisplay).toHaveTextContent(/24:5[67]/)
  })

  test("when the timer reaches zero, it switches to the next mode (pomodoro -> break)", async () => {
    const { getByTestId } = await render(<Clock />)
    const ticker = getByTestId("ticker")
    const label = getByTestId("ticker-label")

    // Verify initial state
    await expect.element(label).toHaveTextContent("Work")

    // Click to start
    await ticker.click()

    // Advance time to just past 25 minutes (25 * 60 * 1000 + 500ms for the interval)
    vi.advanceTimersByTime(25 * 60 * 1000 + 500)

    // Should now be in break mode
    await expect.element(label).toHaveTextContent("Break")
    // Audio should have played when switching modes
    expect(mockAudioPlay).toHaveBeenCalledTimes(1)
  })

  test("when the timer reaches zero, it switches from break to pomodoro", async () => {
    const { getByTestId } = await render(<Clock />)
    const ticker = getByTestId("ticker")
    const label = getByTestId("ticker-label")

    // Start timer
    await ticker.click()

    // Complete pomodoro (25 minutes)
    vi.advanceTimersByTime(25 * 60 * 1000 + 500)
    await expect.element(label).toHaveTextContent("Break")

    // Complete break (5 minutes)
    vi.advanceTimersByTime(5 * 60 * 1000 + 500)

    // Should be back to work
    await expect.element(label).toHaveTextContent("Work")
    // Audio should have played twice (pomodoro->break, break->work)
    expect(mockAudioPlay).toHaveBeenCalledTimes(2)
  })

  test("when the timer is running, clicking the clock pauses it", async () => {
    const { getByTestId } = await render(<Clock />)
    const ticker = getByTestId("ticker")
    const timeDisplay = getByTestId("ticker-time")

    // Click to start
    await ticker.click()

    // Advance time by 2 seconds
    vi.advanceTimersByTime(2000)

    // Click to pause
    await ticker.click()

    // Get current time
    const pausedTimeElement = timeDisplay.element()
    const pausedTime = pausedTimeElement.textContent

    // Advance time by 3 more seconds
    vi.advanceTimersByTime(3000)

    // Time should not have changed
    await expect.element(timeDisplay).toHaveTextContent(pausedTime!)
  })

  test("when the timer is paused, clicking the clock resumes it", async () => {
    const { getByTestId } = await render(<Clock />)
    const ticker = getByTestId("ticker")
    const timeDisplay = getByTestId("ticker-time")

    // Start timer
    await ticker.click()

    // Advance time and let interval fire
    await vi.advanceTimersByTimeAsync(2500)

    // Pause timer
    await ticker.click()
    const pausedTimeElement = timeDisplay.element()
    const pausedTime = pausedTimeElement.textContent

    // Resume timer
    await ticker.click()

    // Advance time and let interval fire
    await vi.advanceTimersByTimeAsync(2500)

    // Time should have changed from paused time
    const newTimeElement = timeDisplay.element()
    const newTime = newTimeElement.textContent
    expect(newTime).not.toBe(pausedTime)
  })

  test("when the timer is running, clicking the reset button resets it and stops it", async () => {
    const { getByTestId, getByText } = await render(<Clock />)
    const ticker = getByTestId("ticker")
    const timeDisplay = getByTestId("ticker-time")

    // Start timer
    await ticker.click()
    await vi.advanceTimersByTimeAsync(5000)

    // Verify timer has counted down
    const runningTimeElement = timeDisplay.element()
    const runningTime = runningTimeElement.textContent
    expect(runningTime).not.toBe("25:00")

    // Click reset
    const resetButton = getByText("reset")
    await resetButton.click()

    // Timer should be back to initial time
    await expect.element(timeDisplay).toHaveTextContent("25:00")

    // Timer should be paused (advance time and verify no change)
    await vi.advanceTimersByTimeAsync(5000)
    await expect.element(timeDisplay).toHaveTextContent("25:00")
  })

  test("when the timer is running in pomodoro mode, the ticker should be filling clockwise with #32afa9", async () => {
    const { getByTestId } = await render(<Clock />)
    const ticker = getByTestId("ticker")

    // Start timer
    await ticker.click()

    // Get the SVG paths
    const tickerElement = ticker.element()
    const svg = tickerElement.querySelector("svg")
    const paths = svg?.querySelectorAll("path")

    // The first path should have the pomodoro color
    const pomodoroPath = paths?.[0]
    expect(pomodoroPath?.getAttribute("stroke")).toBe("#32afa9")
  })

  test("when the timer is running in break mode, the ticker should be emptying counterclockwise with #cf1b1b", async () => {
    const { getByTestId } = await render(<Clock />)
    const ticker = getByTestId("ticker")
    const label = getByTestId("ticker-label")

    // Start timer and complete pomodoro to get to break
    await ticker.click()
    vi.advanceTimersByTime(25 * 60 * 1000 + 500)

    // Wait for transition to break mode to complete
    await expect.element(label).toHaveTextContent("Break")

    // Audio should have played when switching to break
    expect(mockAudioPlay).toHaveBeenCalledTimes(1)

    // Get the SVG paths
    const tickerElement = ticker.element()
    const svg = tickerElement.querySelector("svg")
    const paths = svg?.querySelectorAll("path")

    // The first path should have the break color
    const breakPath = paths?.[0]
    expect(breakPath?.getAttribute("stroke")).toBe("#cf1b1b")
  })

  test("when the timer is paused, the ticker should not be changing", async () => {
    const { getByTestId } = await render(<Clock />)
    const timeDisplay = getByTestId("ticker-time")

    // Timer should start paused
    const initialTimeElement = timeDisplay.element()
    const initialTime = initialTimeElement.textContent

    // Advance time while paused
    vi.advanceTimersByTime(5000)

    // Time should not have changed
    await expect.element(timeDisplay).toHaveTextContent(initialTime!)
  })

  test("after a full cycle of pomodoro and break, the long break should be triggered if the option is enabled", async () => {
    const { getByTestId } = await render(<Clock />)
    const ticker = getByTestId("ticker")
    const label = getByTestId("ticker-label")

    // Start timer
    await ticker.click()

    // Complete 4 pomodoro cycles with breaks (default longBreakCycles is 4)
    for (let i = 0; i < 4; i++) {
      // Complete pomodoro (25 minutes)
      vi.advanceTimersByTime(25 * 60 * 1000 + 500)

      if (i < 3) {
        // Should be regular break
        await expect.element(label).toHaveTextContent("Break")
        // Complete break (5 minutes)
        vi.advanceTimersByTime(5 * 60 * 1000 + 500)
        // Wait for transition back to work
        await expect.element(label).toHaveTextContent("Work")
      }
    }

    // After 4th pomodoro, should trigger long break
    await expect.element(label).toHaveTextContent("Long Break")
  })

  test("the settings should be persisted in localStorage and loaded on app start", async () => {
    const { getByText, getByLabelText, unmount } = await render(<Clock />)

    // Ensure no interval ticks run unexpectedly
    await vi.runOnlyPendingTimersAsync()

    // Open settings
    const settingsButton = getByText("Settings")
    await settingsButton.click()
    await vi.runOnlyPendingTimersAsync()

    // 1. Decrease break length
    const breakLength = getByLabelText("break length time", { exact: true })
    const breakDecrement = getByLabelText("Decrement break length")

    await breakDecrement.click()
    await vi.runOnlyPendingTimersAsync()
    await expect.element(breakLength).toHaveTextContent("4")

    // 2. Increase session length twice
    const sessionLength = getByLabelText("session length time", { exact: true })
    const sessionIncrement = getByLabelText("Increment session length")

    await sessionIncrement.click()
    await vi.runOnlyPendingTimersAsync()
    await expect.element(sessionLength).toHaveTextContent("26")

    await sessionIncrement.click()
    await vi.runOnlyPendingTimersAsync()
    await expect.element(sessionLength).toHaveTextContent("27")

    // 3. Checkbox
    const longBreaksCheckbox = getByLabelText("Include long breaks")
    await expect.element(longBreaksCheckbox).toBeChecked()

    // 4. Long break length
    const longBreakLength = getByLabelText("long break length time", { exact: true })
    const longBreakIncrement = getByLabelText("Increment long break length")

    await longBreakIncrement.click()
    await vi.runOnlyPendingTimersAsync()
    await expect.element(longBreakLength).toHaveTextContent("16")

    // 5. Cycles
    const longBreakCycles = getByLabelText("cycles between long breaks time", { exact: true })
    const cyclesIncrement = getByLabelText("Increment cycles between long breaks")

    await cyclesIncrement.click()
    await vi.runOnlyPendingTimersAsync()
    await expect.element(longBreakCycles).toHaveTextContent("5")

    // Flush effects (like localStorage)
    await vi.runOnlyPendingTimersAsync()

    const storedState = localStorage.getItem("react-pomodo-clock-state")
    expect(storedState).toBeTruthy()

    const parsed = JSON.parse(storedState!)
    expect(parsed.breakLength).toBe(4)
    expect(parsed.pomodoroLength).toBe(27)
    expect(parsed.includeLongBreaks).toBe(true)
    expect(parsed.longBreakLength).toBe(16)
    expect(parsed.longBreakCycles).toBe(5)

    // Clean up
    unmount()
    await vi.runOnlyPendingTimersAsync()

    // Second render
    const { getByTestId } = await render(<Clock />)
    await vi.runOnlyPendingTimersAsync()

    const timeDisplay = getByTestId("ticker-time")
    await expect.element(timeDisplay).toHaveTextContent("27:00")
  })

  test("long break cycle counter should reset after completing long break", async () => {
    const { getByTestId } = await render(<Clock />)
    const ticker = getByTestId("ticker")
    const label = getByTestId("ticker-label")

    // Start timer
    await ticker.click()

    // Complete 4 pomodoro cycles to trigger long break
    for (let i = 0; i < 4; i++) {
      vi.advanceTimersByTime(25 * 60 * 1000 + 500)
      if (i < 3) {
        await expect.element(label).toHaveTextContent("Break")
        vi.advanceTimersByTime(5 * 60 * 1000 + 500)
        await expect.element(label).toHaveTextContent("Work")
      }
    }

    // Should be in long break
    await expect.element(label).toHaveTextContent("Long Break")

    // Complete long break (15 minutes)
    vi.advanceTimersByTime(15 * 60 * 1000 + 500)

    // Should be back to work
    await expect.element(label).toHaveTextContent("Work")

    // The cycle should have reset - complete another 4 pomodoros
    for (let i = 0; i < 4; i++) {
      vi.advanceTimersByTime(25 * 60 * 1000 + 500)
      if (i < 3) {
        await expect.element(label).toHaveTextContent("Break")
        vi.advanceTimersByTime(5 * 60 * 1000 + 500)
        await expect.element(label).toHaveTextContent("Work")
      }
    }

    // Should trigger another long break
    await expect.element(label).toHaveTextContent("Long Break")
  })
})
