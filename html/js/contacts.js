const searchForm = document.getElementById("search-form")
const searchBar = document.getElementById("search-bar")
const trash = document.getElementById("trash")
const add = document.getElementById("add")
const edit = document.getElementById("edit")
const editMsg = document.getElementById("edit-msg")
let editFlag = false
let deleteFlag = false
let warningOpen = false

contacts()

async function contacts() {

    trash.addEventListener("click", () => {
        if(!deleteFlag) {
            deleteFlag = true
            editFlag = false
            editMsg.textContent = "Select contact to delete"
            trash.style.backgroundColor = "rgb(189, 188, 188)"
            edit.style.backgroundColor = "rgb(222, 221, 221)"
        } else {
            deleteFlag = false
            editMsg.textContent = ""
            trash.style.backgroundColor = "rgb(222, 221, 221)"
            return
        }
    })

    add.addEventListener("click", () => {
        window.location.href = "contactForm.html?mode=add"
    })

    edit.addEventListener("click", () => {
        if(!editFlag) {
            editFlag = true
            deleteFlag = false
            editMsg.textContent = "Select contact to edit"
            edit.style.backgroundColor = "rgb(189, 188, 188)"
            trash.style.backgroundColor = "rgb(222, 221, 221)"
        } else {
            editFlag = false
            editMsg.textContent = ""
            edit.style.backgroundColor = "rgb(222, 221, 221)"
            return
        }
    })

    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        const searched = await fetchContacts()
        const contactsList = document.getElementById("contacts-list")

        if(!searched || searched.results.length === 0) {
            contactsList.textContent = "No contacts"
            console.log("No results")
            return
        }

        displayContacts(searched)
    })

    let userContacts = await fetchContacts()
    
    if(!userContacts) {
        return
    }

    displayContacts(userContacts)
     
}

function displayContacts(userContacts) {
    const contactsList = document.getElementById("contacts-list")
    contactsList.innerHTML = ""
    userContacts.results.forEach((e) => {
        console.log(e)
        const contact = document.createElement("div")
        contact.classList.add("contact")
        const name = document.createElement("div")
        name.classList.add("info")
        name.id = "name"
        name.textContent = e.firstname + " " + e.lastname
        const phoneNumber = document.createElement("div")
        phoneNumber.classList.add("info")
        phoneNumber.id = "phone"
        phoneNumber.textContent = e.phone
        contact.append(name, phoneNumber)
        
        contactsList.append(contact)

        contact.addEventListener("click", async () => {
            if(!editFlag && !deleteFlag || warningOpen) {
                return
            }

            if(editFlag) {
                sessionStorage.setItem("editContact", JSON.stringify(e))
                window.location.href = "contactForm.html?mode=edit"
            } else if(deleteFlag) {
                trash.disabled = true
                warningOpen = true
                const warning = document.createElement("div")
                warning.classList.add("warning")
                const msg = document.createElement("div")
                msg.textContent = "Are you sure you want to delete this contact?"
                const buttonRow = document.createElement("div")
                buttonRow.classList.add("buttonRow")
                const yes = document.createElement("button")
                yes.textContent = "Yes"
                const no = document.createElement("button")
                no.textContent = "No"
                buttonRow.append(yes, no)
                warning.append(msg, buttonRow)
                document.body.append(warning)

                yes.addEventListener("click", async () => {
                    const res = await deleteContact(e.id)

                    if(!res) {
                        warning.remove()
                        trash.disabled = false
                        warningOpen = false
                        return
                    }

                    window.location.href = "contacts.html"
                })

                no.addEventListener("click", () => {
                    warning.remove()
                    trash.disabled = false
                    warningOpen = false
                })
            }
        })        
    });
}

async function fetchContacts() {
    try {
        const user = JSON.parse(sessionStorage.getItem("user"))
        const res = await fetch("http://68.183.24.52/API/SearchContacts.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                search: searchBar.value,
                userID: user.id
            })
        })

        if(!res.ok) {
            console.log("response error")
            return
        }

        return res.json()
    } catch(err) {
        console.log("Contacts could not be retrieved due to " + err)
    }
}

async function deleteContact(id) {
    try {
        const res = await fetch("http://68.183.24.52/API/RemoveContacts.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id
            })
        })

        if(!res.ok) {
            console.log("response error")
            return
        }

        return res.json()
    } catch(err) {
        console.log("Contacts could not be deleted due to " + err)
    }
}