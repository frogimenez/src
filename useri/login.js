const { ipcRenderer } = require("electron")


const loginForm = document.getElementById("loginForm")

loginForm.addEventListener("submit", async(event) => {
    event.preventDefault()

    const email = document.getElementById("email")
    const password = document.getElementById("password")

    const user = {
        email: email.value,
        password: password.value
    }


    ipcRenderer.send("login", user)
})


ipcRenderer.on('loginUserFailed', (e, args) => {
    const error = args

    alert(error);
});