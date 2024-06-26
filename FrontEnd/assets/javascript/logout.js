/*global fetch, console, document, window, localStorage */


// =====================================================
//     Sélection des éléments DOM
// =====================================================

const boutonLogout = document.querySelector(".LogOut");

// =====================================================
//     Création des fonctionnalités du bouton de logout
// =====================================================

/**
 * Gère la déconnexion de l"utilisateur.
 */
function btnLogout() {
    boutonLogout.addEventListener("click", function () {
        try {
            if (localStorage.getItem("token")) {
                localStorage.removeItem("token");
                window.location.href = "index.html";
            } else {
                console.error("Aucun token trouvé.");
            }
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    });
}

// Appel de la fonction pour initialiser les écouteurs d"événements
btnLogout();
