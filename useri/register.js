const { ipcRenderer } = require("electron")

const name = document.getElementById("name")
const email = document.getElementById("email")
const password = document.getElementById("password")


const login = document.getElementById("registerForm")

login.addEventListener("submit", async(event) => {
    event.preventDefault()

    const user = {
        userName: name.value,
        email: email.value,
        password: password.value
    }

    ipcRenderer.send('newUser', user);
})


ipcRenderer.on('createUserError', (e, args) => {
    const error = JSON.parse(args);

    alert(error.message);
});