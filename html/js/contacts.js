const search = document.getElementById("search")
const trash = document.getElementById("trash")
const add = document.getElementById("add")

const testUser = {
      firstname: "Count",
      lastname: "Dracula",
      email: "batsRbest@transylvania.com",
      phone: "(123)-456-7890",
      id: 2
    }

contacts()

async function contacts() {

    search.addEventListener("click", () => {
        //window.location.href = "searchContacts.html"
        console.log("navigating to searchContacts")
    })

    trash.addEventListener("click", () => {
        //window.location.href = "deleteContacts.html"
        console.log("navigating to deleteContacts")
    })

    add.addEventListener("click", () => {
        //window.location.href = "addContacts.html"
        console.log("navigating to addContacts")
    })

    /*let userContacts = await fetchContacts()
    
    if(!userContacts) {
        return
    }*/

   let userContacts = { results: [{ firstName: "John", lastName: "Smith" } ,
        { firstName: "Jason", lastName: "Bourne" },
        { firstName: "Matt", lastName: "Damon" },
        { firstName: "John", lastName: "Smith" } ,
        { firstName: "Jason", lastName: "Bourne" },
        { firstName: "Matt", lastName: "Damon" },
        { firstName: "John", lastName: "Smith" } ,
        { firstName: "Jason", lastName: "Bourne" },
        { firstName: "Matt", lastName: "Damon" }
    ]}

    const contactsList = document.getElementById("contacts-list")
    userContacts.results.forEach((e) => {
        const contact = document.createElement("div")
        contact.textContent = e.firstName + " " + e.lastName
        contactsList.append(contact)
    });
     


}

async function fetchContacts() {
    try {
        const res = await fetch("")

        if(!res.ok) {
            console.log("response error")
            return
        }

        return res.json()
    } catch(err) {
        console.log("Contacts could not be retrieved due to " + err)
    }
}