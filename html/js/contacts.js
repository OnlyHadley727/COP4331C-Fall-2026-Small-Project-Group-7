const searchForm = document.getElementById("search-form")
const searchBar = document.getElementById("search-bar")
const trash = document.getElementById("trash")
const add = document.getElementById("add")

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

    trash.addEventListener("click", () => {
        //window.location.href = "deleteContacts.html"
        console.log("navigating to deleteContacts")
    })

    add.addEventListener("click", () => {
        //window.location.href = "addContacts.html"
        console.log("navigating to addContacts")
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

   /*let userContacts = { results: [{ firstName: "John", lastName: "Smith" } ,
        { firstname: "Jason", lastname: "Bourne" },
        { firstname: "Matt", lastname: "Damon" },
        { firstname: "John", lastname: "Smith" } ,
        { firstname: "Jason", lastname: "Bourne" },
        { firstname: "Matt", lastname: "Damon" },
        { firstname: "John", lastname: "Smith" } ,
        { firstname: "Jason", lastname: "Bourne" },
        { firstname: "Matt", lastname: "Damon" }
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