import axios from "axios";
import { useState } from "react";

export default function Login() {
  const [cookie, setCookie] = useState("");

  const submit = async () => {
    await axios.post("http://localhost:5050/api/login", { cookie });
    alert("✅ Login Success");
  };

  return (
    <div>
      <h2>🔐 ID Login</h2>
      <textarea
        placeholder="Paste Facebook Cookie"
        onChange={(e) => setCookie(e.target.value)}
      />
      <button onClick={submit}>Login</button>
    </div>
  );
}