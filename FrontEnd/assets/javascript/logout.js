const boutonLogout = document.querySelector(".LogOut")


// Creation des fonctionnalités du bouton de logout
async function btnLogout() {
    boutonLogout.addEventListener("click", async () => {
            
            if (localStorage.getItem("token")) {
                console.log("Token trouvé :", localStorage.getItem("token"));
                localStorage.removeItem("token")
            console.log("déconnexion réussie")
            window.location.href = "index.html";
            } else {
                console.log("Aucun token trouvé.");
            }
})}

btnLogout()
