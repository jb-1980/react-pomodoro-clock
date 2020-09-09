import React from "react"
import { render } from "react-dom"
import { Clock } from "./Clock"
import * as serviceWorker from "./serviceWorker"

const styles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
}

const App = () => (
  <div>
    <div style={styles}>
      <Clock />
    </div>
    <div style={{ textAlign: "center", color: "white", padding: 10 }}>
      © Gilgen Labs {new Date().getFullYear()}
    </div>
  </div>
)

render(<App />, document.getElementById("root"))

serviceWorker.register()
