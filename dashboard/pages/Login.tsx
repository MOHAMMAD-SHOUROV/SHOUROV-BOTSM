async function loginBot(email, password) {
  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      mode: "prod"
    })
  });

  const data = await res.json();
  if (data.success) alert("Login Success!");
  else alert("Login Failed");
}
