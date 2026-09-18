const searchForm = document.getElementById("search-form")
const searchBar = document.getElementById("search-bar")
const trash = document.getElementById("trash")
const add = document.getElementById("add")
const edit = document.getElementById("edit")
const editMsg = document.getElementById("edit-msg")
let editFlag = false

const testUser = {
      firstname: "Count",
      lastname: "Dracula",
      email: "batsRbest@transylvania.com",
      phone: "(123)-456-7890",
      id: 2
    }

sessionStorage.setItem("user", JSON.stringify(testUser))

contacts()

async function contacts() {

    /*trash.addEventListener("click", () => {

    })*/

    add.addEventListener("click", () => {
        window.location.href = "contactForm.html?mode=add"
    })

    edit.addEventListener("click", () => {
        if(!editFlag) {
            editFlag = true
            editMsg.textContent = "Select contact to edit"
            edit.style.backgroundColor = "rgb(189, 188, 188)"
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

    /*let userContacts = await fetchContacts()
    
    if(!userContacts) {
        return
    }*/

   let userContacts = { results: [{ firstname: "John", lastname: "Smith", phone:"123-456-7891", email: "test@gmail.com" },
        { id: 1, firstname: "Jason", lastname: "Bourne", phone:"123-456-7891", email: "test@gmail.com" },
        { id: 1, firstname: "Matt", lastname: "Damon", phone:"123-456-7891", email: "test@gmail.com" },
        { id: 1, firstname: "John", lastname: "Smith", phone:"123-456-7891", email: "test@gmail.com" },
        { id: 1, firstname: "Jason", lastname: "Bourne", phone:"123-456-7891", email: "test@gmail.com" },
        { id: 1, firstname: "Matt", lastname: "Damon", phone:"123-456-7891", email: "test@gmail.com" },
        { id: 1, firstname: "John", lastname: "Smith", phone:"123-456-7891", email: "test@gmail.com" },
        { id: 1, firstname: "Jason", lastname: "Bourne", phone:"123-456-7891", email: "test@gmail.com" },
        { id: 1, firstname: "Matt", lastname: "Damon", phone:"123-456-7891", email: "test@gmail.com" }
    ]}

    displayContacts(userContacts)
     
}

function displayContacts(userContacts) {
    const contactsList = document.getElementById("contacts-list")
    contactsList.innerHTML = ""
    userContacts.results.forEach((e) => {
        const contact = document.createElement("div")
        contact.textContent = e.firstname + " " + e.lastname
        contactsList.append(contact)

        contact.addEventListener("click", () => {
            if(!editFlag) {
                return
            }
            sessionStorage.setItem("editContact", JSON.stringify(e))
            window.location.href = "contactForm.html?mode=edit"
        })        
    });
}

async function fetchContacts() {
    try {
        const user = JSON.parse(sessionStorage.getItem("user"))
        const res = await fetch("API/SearchContacts.php", {
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