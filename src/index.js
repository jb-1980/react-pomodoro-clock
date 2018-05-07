import React from "react"
import { render } from "react-dom"
import Clock from "./Clock"

const styles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
}

const App = () => (
  <React.Fragment>
    <div style={styles}>
      <Clock />
    </div>
    <div style={{ textAlign: "center", color: "white", padding: 10 }}>
      © Gilgen Labs 2018
    </div>
  </React.Fragment>
)

render(<App />, document.getElementById("root"))
