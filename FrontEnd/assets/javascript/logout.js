const instagram = document.querySelector(".instagram")

// Creation et fonctionnalités du bouton de logout
async function btnLogout() {
    let boutonLogout = document.createElement("li")
    boutonLogout.className = "LogOut"
    boutonLogout.textContent = "LogOut"
    instagram.parentNode.insertBefore(boutonLogout, instagram)
    
    boutonLogout.addEventListener("click", async () => {
        const token = localStorage.getItem("token")
        if (token) {
            localStorage.removeItem("token")
            console.log("Vous avez été déconnecté")
        } else {
            afficherMessageErreur("Vous n'êtes pas connecté")
        }
    })
}

btnLogout()
