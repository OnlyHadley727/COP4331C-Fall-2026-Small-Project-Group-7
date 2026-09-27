const loginForm = document.getElementById("login-form")
const registerForm = document.getElementById("register-form")

const loginSection = document.getElementById("login-section")
const registerSection = document.getElementById("register-section")

const registerLink = document.getElementById("register-link")
const backToLogin = document.getElementById("back-to-login")

const loginError = document.getElementById("login-error")
const registerError = document.getElementById("register-error")
const registerSuccess = document.getElementById("register-success")

const API_BASE = "http://68.183.24.52/API"

registerLink.addEventListener("click", (e) => {
    e.preventDefault()

    loginSection.style.display = "none"
    registerSection.style.display = "block"

    loginError.textContent = ""
})

backToLogin.addEventListener("click", (e) => {
    e.preventDefault()

    registerSection.style.display = "none"
    loginSection.style.display = "block"

    registerError.textContent = ""
    registerSuccess.textContent = ""
})

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    loginError.textContent = ""

    const username = document.getElementById("login-username").value.trim()
    const password = document.getElementById("login-password").value

    if(username.length === 0 || password.length === 0) {
        loginError.textContent = "Enter a username and password."
        return
    }

    try {
        const res = await fetch(`${API_BASE}/Login.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })

        const data = await res.json()

        if(!res.ok || data.status !== "Success") {
            loginError.textContent = data.error || "Login failed, please try again."
            return
        }

        sessionStorage.setItem("user", JSON.stringify(data.result))

        sessionStorage.removeItem("editContact")

        window.location.href = "contacts.html"

    } catch(err) {
        console.error(err)
        loginError.textContent = "Could not connect to the server, please try again."
    }
})

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    registerError.textContent = ""
    registerSuccess.textContent = ""

    const firstname = document.getElementById("register-firstname").value.trim()

    const lastname = document.getElementById("register-lastname").value.trim()

    const username = document.getElementById("register-username").value.trim()

    const password = document.getElementById("register-password").value

    if(firstname.length === 0 || lastname.length === 0 || username.length === 0 || password.length === 0) {
        registerError.textContent = "Please fill in all fields."
        return
    }

    try {
        const res = await fetch(`${API_BASE}/Register.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                username: username,
                password: password
            })
        })

        const data = await res.json()

        if(!res.ok || data.status !== "Success") {
            registerError.textContent = data.error || "Registration failed. Please try again."
            return
        }

        registerSuccess.textContent = "Registration successful! You can now log in."

        registerForm.reset()

        setTimeout(() => {
            registerSection.style.display = "none"
            loginSection.style.display = "block"
            registerSuccess.textContent = ""
        }, 1500)

    } catch(err) {
        console.error(err)
        registerError.textContent = "Could not connect to the server. Please try again."
    }
})