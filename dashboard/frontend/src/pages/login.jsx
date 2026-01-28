import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("prod");

  const login = async () => {
    await axios.post("http://localhost:5050/api/login", {
      email,
      password,
      mode
    });
    alert("✅ Login successful");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>SHOUROV BOT LOGIN</h2>

      <input
        placeholder="Facebook Email"
        onChange={e => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Facebook Password"
        onChange={e => setPassword(e.target.value)}
      /><br /><br />

      <select onChange={e => setMode(e.target.value)}>
        <option value="prod">Production</option>
        <option value="dev">Development</option>
      </select><br /><br />

      <button onClick={login}>LOGIN</button>
    </div>
  );
}