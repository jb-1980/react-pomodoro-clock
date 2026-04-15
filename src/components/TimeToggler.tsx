export const TimeToggler = ({
  title,
  time,
  changeTime,
  disabled,
}: {
  title: string
  time: number
  changeTime: (value: number) => void
  disabled?: boolean
}) => {
  const normalizedTitle = title.toLowerCase()

  return (
    <div
      style={{
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        KhtmlUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
        fontFamily: '"Gochi Hand", cursive',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "inherit",
        margin: 10,
        fontSize: 20,
      }}
    >
      <h3 style={{ margin: 0, padding: "5px 13px 0 0" }}>{title}</h3>
      <div style={{ lineHeight: "1em", fontSize: "2em" }}>
        <button
          type="button"
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
            background: "none",
            border: "none",
            padding: 0,
            font: "inherit",
            lineHeight: "inherit",
          }}
          onClick={() => changeTime(-1)}
          aria-label={`Decrement ${normalizedTitle}`}
          disabled={disabled}
        >
          −
        </button>
        <span aria-label={`${normalizedTitle} time`} style={{ margin: "0 7px" }}>
          {time}
        </span>
        <button
          type="button"
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
            background: "none",
            border: "none",
            padding: 0,
            font: "inherit",
            lineHeight: "inherit",
          }}
          onClick={() => changeTime(1)}
          aria-label={`Increment ${normalizedTitle}`}
          disabled={disabled}
        >
          +
        </button>
      </div>
    </div>
  )
}
