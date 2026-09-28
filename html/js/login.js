const loginForm = document.getElementById("login-form")
const registerForm = document.getElementById("register-form")
const loginSection = document.getElementById("login-section")
const registerSection = document.getElementById("register-section")
const registerPage = document.getElementById("register-link")
const loginPage = document.getElementById("back-to-login")
const loginError = document.getElementById("login-error")
const registerError = document.getElementById("register-error")
const registerSuccess = document.getElementById("register-success")

const API_BASE = "http://cop4331-contact-manager.xyz/API"

registerPage.addEventListener("click", (e) => {
    e.preventDefault()
    loginSection.style.display = "none"
    registerSection.style.display = "block"
    loginError.textContent = ""
})

loginPage.addEventListener("click", (e) => {
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
    const password = md5( document.getElementById("login-password").value )
    if(username.length === 0 || password.length === 0){
        loginError.textContent = "Enter a username and password."
        return
    }

    try{
        const result = await fetch(`${API_BASE}/Login.php`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: username, password: password})
        })

        const data = await result.json()

        if(!result.ok || data.status !== "Success"){
            loginError.textContent = data.error || "Login failed, please try again."
            return
        }

        sessionStorage.setItem("user", JSON.stringify(data.result))

        sessionStorage.removeItem("editContact")

        window.location.href = "contacts.html"

    }catch(error){
        console.error(error)
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
    const password = md5( document.getElementById("register-password").value )

    if(firstname.length === 0 || lastname.length === 0 || username.length === 0 || password.length === 0){
        registerError.textContent = "Please fill in all fields."
        return
    }

    try{
        const result = await fetch(`${API_BASE}/Register.php`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({firstname: firstname, lastname: lastname, username: username, password: password})
        })

        const data = await result.json()

        if(!result.ok || data.status !== "Success"){
            registerError.textContent = data.error || "Registration failed, please try again."
            return
        }

        registerSuccess.textContent = "Registration successful, you can now log in."
        registerForm.reset()

    }catch(error){
        console.error(error)
        registerError.textContent = "Could not connect to the server, please try again."
    }
})
