const save = document.getElementById("save")
const cancel = document.getElementById("cancel")
const firstName = document.getElementById("first-name")
const lastName = document.getElementById("last-name")
const phoneNumber = document.getElementById("phone-number")
const email = document.getElementById("email")
const error = document.getElementById("error")

const params = new URLSearchParams(window.location.search)
const mode = params.get("mode")
const contact = JSON.parse(sessionStorage.getItem("editContact"))

if(mode === "edit") {
    editContacts()
}

function editContacts() {
    firstName.value = contact.firstname
    lastName.value = contact.lastname
    phoneNumber.value = contact.phone
    email.value = contact.email
}

save.addEventListener("click", async (e) => {
    e.preventDefault()
    error.textContent = ""
    if(firstName.value.trim().length === 0) {
        error.textContent = "First name cannot be left empty"
        return
    } else if(phoneNumber.value.trim().length === 0) {
        error.textContent = "Phone number cannot be left empty"
        return
    }

    contact.firstname = firstName.value.trim()
    contact.lastname = lastName.value.trim()
    contact.phone = phoneNumber.value.trim()
    contact.email = email.value.trim()

    const res = await saveContact()

    if(!res) {
        error.textContent = "Save failed please try again"
        return
    }

    window.location.href = "contacts.html"

})

cancel.addEventListener("click", () => {
    window.location.href = "contacts.html"
})

async function saveContact() {
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