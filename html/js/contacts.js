const searchForm = document.getElementById("search-form")
const searchBar = document.getElementById("search-bar")
const trash = document.getElementById("trash")
const add = document.getElementById("add")
const edit = document.getElementById("edit")
const editMsg = document.getElementById("edit-msg")
let editFlag = false
let deleteFlag = false

const testUser = {
  "id": 2,
  "firstname": "Clark",
  "lastname": "Kent",
  "username": "SuperMan",
  "password": "{MD5 Hashed Password String}"
}

sessionStorage.setItem("user", JSON.stringify(testUser))

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

  /* let userContacts = { results: [{id: 1, firstname: "John", lastname: "Smith", phone:"123-456-7891", email: "test@gmail.com" },
        { id: 1, firstname: "Jason", lastname: "Bourne", phone:"123-456-7891", email: "test@gmail.com" },
        { id: 1, firstname: "Matt", lastname: "Damon", phone:"123-456-7891", email: "test@gmail.com" },
        { id: 1, firstname: "John", lastname: "Smith", phone:"123-456-7891", email: "test@gmail.com" },
        { id: 1, firstname: "Jason", lastname: "Bourne", phone:"123-456-7891", email: "test@gmail.com" },
        { id: 1, firstname: "Matt", lastname: "Damon", phone:"123-456-7891", email: "test@gmail.com" },
        { id: 1, firstname: "John", lastname: "Smith", phone:"123-456-7891", email: "test@gmail.com" },
        { id: 1, firstname: "Jason", lastname: "Bourne", phone:"123-456-7891", email: "test@gmail.com" },
        { id: 1, firstname: "Matt", lastname: "Damon", phone:"123-456-7891", email: "test@gmail.com" }
    ]}*/

    displayContacts(userContacts)
     
}

function displayContacts(userContacts) {
    const contactsList = document.getElementById("contacts-list")
    contactsList.innerHTML = ""
    userContacts.results.forEach((e) => {
        const contact = document.createElement("div")
        contact.textContent = e.firstname + " " + e.lastname
        contactsList.append(contact)

        contact.addEventListener("click", async () => {
            if(!editFlag && !deleteFlag) {
                return
            }

            if(editFlag) {
                sessionStorage.setItem("editContact", JSON.stringify(e))
                window.location.href = "contactForm.html?mode=edit"
            } else if(deleteFlag) {
                const res = await deleteContact(e.id)
                window.location.href = "contacts.html"

                if(!res) {
                    return
                }
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
        const user = JSON.parse(sessionStorage.getItem("user"))
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