const instagram = document.querySelector(".instagram")
const btnLogin = document.querySelector(".login")
let boutonLogout = document.createElement("li")

// Creation et fonctionnalités du bouton de logout
async function btnLogout() {
    boutonLogout.className = "LogOut"
    boutonLogout.textContent = "LogOut"
    instagram.parentNode.insertBefore(boutonLogout, instagram)
    
    boutonLogout.addEventListener("click", async () => {
        const token = localStorage.getItem("token")
        if (token) {
            localStorage.removeItem("token")
            console.log("Vous avez été déconnecté")
            afficherMessage("Vous avez été déconnecté")
        } else {
            afficherMessage("Vous n'êtes pas connecté")
        }
    })
}

btnLogout()


//Affichage ou non du menu login/logout

async function affichageLoginLogout () {
    const token = localStorage.getItem("token")
    if (token) {
        btnLogin.style.display = "none"
        boutonLogout.style.display = "block"
    } else {
        btnLogin.style.display = "block"
        boutonLogout.style.display = "none"
    }
}

affichageLoginLogout ()