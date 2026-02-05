const handleLogin = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email, Password: password }),
    });

    // Read text first to avoid JSON.parse error when server returned HTML
    const text = await response.text();

    // If not JSON, log body and return early
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error("Non-JSON response from login endpoint:", text);
      alert("Server did not return JSON. Check backend URL and that the API is running.");
      return;
    }

    const data = JSON.parse(text);

    if (response.ok) {
      setUser(data.user);
      setView(data.user.role?.toLowerCase() === "admin" ? "admin" : "home");
      localStorage.setItem("finance_user", JSON.stringify(data.user));
      localStorage.setItem("finance_token", data.token);
    } else {
      console.error("Login failed:", data);
      alert("Login failed: " + (data?.message || "Check credentials / backend console."));
    }
  } catch (err) {
    console.error("Login request error:", err);
    alert("Connection error. Is the backend running at " + API_URL + " ?");
  }
};