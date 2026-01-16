const signInBtn = document.querySelector(".SignIn-btn");

signInBtn.addEventListener("click", () => {
  const email = document.getElementById("Email").value.trim();
  const password = document.getElementById("Password").value.trim();

  if (!email || !password) {
    alert("Please enter email & password");
    return;
  }

  fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then(res => {
      return res.json().then(data => ({
        statusCode: res.status,
        body: data,
      }));
    })
    .then(({ statusCode, body }) => {
      if (statusCode === 200 && body.status) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "admin-dashboard.html";
      } else {
        alert(body.message || "Login failed");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Server error");
    });
});
