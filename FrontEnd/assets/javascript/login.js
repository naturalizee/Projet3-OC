// Récupération des éléments du formulaire de login
const email = document.getElementById("email")
const password = document.getElementById("password")
const seConnecter = document.getElementById("seConnecter")

seConnecter.addEventListener("click", login)
// Stockage des données utilisateur
async function login(event) {
    event.preventDefault()
    const valeurEmail = email.value
    const valeurPassword = password.value
    console.log(valeurEmail, valeurPassword)

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ valeurEmail, valeurPassword })
        });
        const data = await response.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "../index.html";
            console.log("Connexion réussie");
        } else {
            afficherMessageErreur("L'adresse mail ou le mot de passe est incorrect");
        }
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
    }
}

// // Message d'erreur
// function afficherMessageErreur(message) {
//     const erreurPrecedente = document.querySelector(".message-erreur")
//     if (erreurPrecedente) {
//         erreurPrecedente.remove()
//     }
//     const erreurMessage = document.createElement("p");
//     erreurMessage.classList.add("message-erreur")
//     erreurMessage.textContent = message;
//     erreurMessage.style.color = "red";
//     erreurMessage.style.marginBottom = "10px";
//     seConnecter.parentNode.insertBefore(erreurMessage, seConnecter);
// }

// Mot de passe visible ou crypté
const togglePassword = document.getElementById('toggle-password');
const passwordField = document.getElementById('password');

togglePassword.addEventListener('click', function () {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye-slash');
    togglePassword.classList.toggle('fa-eye');
});
