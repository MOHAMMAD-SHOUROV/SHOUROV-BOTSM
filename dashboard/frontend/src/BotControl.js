import axios from "axios";

export default function BotControl() {
  return (
    <div>
      <h2>🤖 SHOUROV BOT CONTROL</h2>

      <button onClick={() => axios.post("http://localhost:5050/api/bot/start")}>
        ▶ Start Bot
      </button>

      <button onClick={() => axios.post("http://localhost:5050/api/bot/stop")}>
        ⛔ Stop Bot
      </button>

      <button onClick={() => axios.post("http://localhost:5050/api/bot/restart")}>
        🔄 Restart Bot
      </button>
    </div>
  );
}