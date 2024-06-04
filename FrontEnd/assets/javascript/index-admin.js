// =====================================================
//     Sélection des éléments DOM
// =====================================================

const body = document.querySelector("body");
const header = document.querySelector("header");
const mesProjets = document.querySelector(".mesProjets");
const login = document.querySelector(".login");
const instagram = document.querySelector(".instagram");

// =====================================================
//     Création bandeau d'édition
// =====================================================

/**
 * Crée le bandeau d'édition et l'ajoute avant l'en-tête.
 */
function creerBandeauEdition() {
    let bandeauEditionHTML = ` 
    <div class="bandeauEdition" 
        style="
        text-align: center;
        display:none;
        align-content: center;
        background-color: black;
        color: white;
        height: 60px;
        width: 100%;
        margin-top: 0px;
        box-sizing: border-box;
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
    "><i class="fa-solid fa-pen-to-square"></i> Mode édition</div>
    `;
    header.insertAdjacentHTML('beforebegin', bandeauEditionHTML);
    header.style.paddingTop = "calc(+50px)";
}

// Appel de la fonction pour créer le bandeau d'édition
creerBandeauEdition();

// =====================================================
//     Création nav Logout
// =====================================================

/**
 * Crée l'élément de déconnexion et l'ajoute à la navigation.
 */
function creerNavLogout() {
    let LogOutHTML = document.createElement("li");
    LogOutHTML.className = "LogOut";
    LogOutHTML.style.display = "none";
    LogOutHTML.textContent = "LogOut";
    instagram.parentNode.insertBefore(LogOutHTML, instagram);
}

// Appel de la fonction pour créer l'élément de déconnexion
creerNavLogout();

// =====================================================
//     Sélection des éléments DOM supplémentaires
// =====================================================

const btnCat = document.querySelectorAll(".btnCat");
const btnTous = document.getElementById("bouton-tous");
const bandeauEdition = document.querySelector(".bandeauEdition");
const boutonModifier = document.querySelector(".boutonModifier");
const LogOut = document.querySelector(".LogOut");
const openModalHTML = document.querySelector(".js-open-modal-trigger");
const filtresCategories = document.getElementById("filtres-categories");

// =====================================================
//     Apparition du bandeau et du bouton
// =====================================================

/**
 * Affiche les éléments d'édition si l'utilisateur est connecté.
 * @returns {Promise<void>} Une promesse qui est résolue quand l'apparition est terminée.
 */
async function apparitionEdition() {
    try {
        const verifConnection = localStorage.getItem("token");

        if (verifConnection) {
            openModalHTML.style.display = "block";
            bandeauEdition.style.display = "block";
            boutonModifier.style.display = "block";
            filtresCategories.style.display = "none";
            login.style.display = "none";
            LogOut.style.display = "block";
        }
    } catch (error) {
        console.error("Erreur lors de l'apparition de l'édition :", error);
    }
}

// Appel de la fonction pour vérifier la connexion et afficher les éléments d'édition
apparitionEdition();
