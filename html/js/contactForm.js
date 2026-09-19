const save = document.getElementById("save")
const cancel = document.getElementById("cancel")
const firstName = document.getElementById("first-name")
const lastName = document.getElementById("last-name")
const phoneNumber = document.getElementById("phone-number")
const email = document.getElementById("email")
const error = document.getElementById("error")

const params = new URLSearchParams(window.location.search)
const mode = params.get("mode")
let contact

const user = JSON.parse(sessionStorage.getItem("user"))

if(mode === "edit") {
    contact = JSON.parse(sessionStorage.getItem("editContact")) 
    firstName.value = contact.firstname
    lastName.value = contact.lastname
    phoneNumber.value = contact.phone
    email.value = contact.email
} else if(mode === "add") {
    contact = { firstname: "", lastname: "", phone:"", email: "" }
}

save.addEventListener("click", async (e) => {
    e.preventDefault()
    error.textContent = ""
    if(firstName.value.trim().length === 0) {
        error.textContent = "First name cannot be left empty"
        return
    } else if(lastName.value.trim().length === 0) {
        error.textContent = "Last name cannot be left empty"
        return
    } else if(phoneNumber.value.trim().length === 0) {
        error.textContent = "Phone number cannot be left empty"
        return
    } else if(email.value.trim().length === 0) {
        error.textContent = "email cannot be left empty"
        return
    }

    contact.firstname = firstName.value.trim()
    contact.lastname = lastName.value.trim()
    contact.phone = phoneNumber.value.trim()
    contact.email = email.value.trim()

    if(mode === "edit") {
        const res = await editContact()

        if(!res) {
            error.textContent = "Save failed please try again"
            return
        }
    } else if(mode === "add") {
        const res = await addContact()

        if(!res) {
            error.textContent = "Save failed please try again"
            return
        }
    }


    window.location.href = "contacts.html"

})

cancel.addEventListener("click", () => {
    window.location.href = "contacts.html"
})

async function editContact() {
    try {
        const res = await fetch("API/EditContacts.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                id: contact.id,
                firstname: contact.firstname,
                lastname: contact.lastname,
                phone: contact.phone,
                email: contact.email
            })
        })

        if(!res.ok) {
            console.log(res.status)
            return
        }

        return res.json()

    } catch(err) {
        console.log(err)
        return
    }
}

async function addContact() {
    try {
        const res = await fetch("API/AddContacts.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                userID: user.id,
                firstname: contact.firstname,
                lastname: contact.lastname,
                phone: contact.phone,
                email: contact.email
            })
        })

        if(!res.ok) {
            console.log(res.status)
            return
        }

        return res.json()

    } catch(err) {
        console.log(err)
        return
    }
}