import { reducer, defaultState } from "../Clock"

test("TOGGLE_SESSION", () => {
  let expectedState = {
    breakLength: 5,
    sessionLength: 25,
    inSession: false,
    paused: true,
    time: 5 * 60 * 1000,
  }
  let actualState = reducer(defaultState, { type: "TOGGLE_SESSION" })

  expect(expectedState).toEqual(actualState)

  let nextState = reducer(actualState, { type: "TOGGLE_SESSION" })

  expect(nextState).toEqual(defaultState)
})

test("DECREMENT_TIME", () => {
  let intervalTime = 1000
  let expectedState = {
    ...defaultState,
    time: 25 * 60 * 1000 - intervalTime,
  }
  let actualState = reducer(defaultState, {
    type: "DECREMENT_TIME",
    intervalTime,
  })

  expect(expectedState).toEqual(actualState)
})

test("CHANGE_BREAK_LENGTH while in session", () => {
  let expectedState = {
    ...defaultState,
    breakLength: 4,
  }
  let actualState = reducer(defaultState, {
    type: "CHANGE_BREAK_LENGTH",
    value: -1,
  })

  expect(expectedState).toEqual(actualState)
})

test("CHANGE_BREAK_LENGTH while in break", () => {
  let expectedState = {
    ...defaultState,
    inSession: false,
    breakLength: 4,
    time: 4 * 60000,
  }
  let actualState = reducer(
    { ...defaultState, inSession: false, time: 5 * 60000 },
    {
      type: "CHANGE_BREAK_LENGTH",
      value: -1,
    }
  )

  expect(expectedState).toEqual(actualState)
})

test("CHANGE_BREAK_LENGTH must be >= 1", () => {
  let expectedState = {
    ...defaultState,
    breakLength: 1,
  }
  let actualState = reducer(
    { ...defaultState, breakLength: 1 },
    {
      type: "CHANGE_BREAK_LENGTH",
      value: -1,
    }
  )

  expect(expectedState).toEqual(actualState)
})

test("CHANGE_SESSION_LENGTH while in session", () => {
  let expectedState = {
    ...defaultState,
    sessionLength: 24,
    time: 24 * 60000,
  }
  let actualState = reducer(defaultState, {
    type: "CHANGE_SESSION_LENGTH",
    value: -1,
  })

  expect(expectedState).toEqual(actualState)
})

test("CHANGE_SESSION_LENGTH while in break", () => {
  let expectedState = {
    ...defaultState,
    inSession: false,
    sessionLength: 24,
  }
  let actualState = reducer(
    { ...defaultState, inSession: false },
    {
      type: "CHANGE_SESSION_LENGTH",
      value: -1,
    }
  )

  expect(expectedState).toEqual(actualState)
})

test("CHANGE_SESSION_LENGTH must be >= 1", () => {
  let expectedState = {
    ...defaultState,
    sessionLength: 1,
  }
  let actualState = reducer(
    { ...defaultState, sessionLength: 1 },
    {
      type: "CHANGE_SESSION_LENGTH",
      value: -1,
    }
  )

  expect(expectedState).toEqual(actualState)
})

test("TOGGLE_PAUSE", () => {
  let expectedState = {
    ...defaultState,
    paused: false,
  }
  let actualState = reducer(defaultState, {
    type: "TOGGLE_PAUSE",
  })

  expect(expectedState).toEqual(actualState)

  let nextState = reducer(actualState, { type: "TOGGLE_PAUSE" })

  expect(defaultState).toEqual(nextState)
})

test("RESET", () => {
  let alteredState = {
    paused: false,
    time: 3 * 60000,
    inSession: false,
    breakLength: 3,
    sessionLength: 20,
  }
  let actualState = reducer(alteredState, { type: "RESET" })
  expect(defaultState).toEqual(actualState)
})
