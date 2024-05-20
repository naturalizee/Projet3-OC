const instagram = document.querySelector(".instagram")
const boutonLogout = document.querySelector(".LogOut")


// Creation des fonctionnalités du bouton de logout
async function btnLogout() {
    boutonLogout.addEventListener("click", async () => {
            localStorage.removeItem("token")
            console.log("déconnexion réussie")
            if (localStorage.getItem("token")) {
                console.log("Token trouvé :", localStorage.getItem("token"));
            } else {
                console.log("Aucun token trouvé.");
            }
})}

btnLogout()
