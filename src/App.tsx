import { Clock } from "./components/Clock"

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
    <div style={{ textAlign: "center", color: "white", padding: 10 }}>© Gilgen Labs {new Date().getFullYear()}</div>
  </div>
)

export default App
