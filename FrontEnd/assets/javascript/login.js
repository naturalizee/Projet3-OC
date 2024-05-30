// Récupération des éléments du formulaire de login
const email = document.getElementById("email")
const password = document.getElementById("password")
const seConnecter = document.getElementById("seConnecter")


seConnecter.addEventListener("click", login)
// Stockage des données utilisateur lors du login
async function login(event) {
    event.preventDefault()
    const valeurEmail = email.value
    const valeurPassword = password.value

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email: valeurEmail, password: valeurPassword })
        });
        const data = await response.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "../../index.html";
            console.log("Connexion réussie");
            console.log("Token trouvé :", localStorage.getItem("token"));
        } else {
            afficherMessage("Erreur dans l’identifiant ou le mot de passe")
        }
    } catch (error) {
        afficherMessage("Une erreur est survenue")
        console.error("Erreur lors de la connexion:", error);
    }
}


// Message d'erreur mail ou mdp
function afficherMessage(message) {
    const erreurPrecedente = document.querySelector(".message-erreur")
    if (erreurPrecedente) {
        erreurPrecedente.remove()
    }
    const erreurMessage = document.createElement("p");
    erreurMessage.classList.add("message-erreur")
    erreurMessage.textContent = message;
    erreurMessage.style.color = "red";
    erreurMessage.style.marginBottom = "10px";
    seConnecter.parentNode.insertBefore(erreurMessage, seConnecter);
}

// Mot de passe visible ou crypté
const togglePassword = document.getElementById('toggle-password');
const passwordField = document.getElementById('password');

togglePassword.addEventListener('click', function () {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye-slash');
    togglePassword.classList.toggle('fa-eye');
});



