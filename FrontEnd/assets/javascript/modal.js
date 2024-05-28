/* ===================================================== */
///     MODALE 1 - GALERIE PHOTO, SUPPRESSION PROJETS
/* ===================================================== */

// Création de l'overlay pour la modale
const overlay = document.createElement("div");
overlay.className = "modal-overlay";
document.body.appendChild(overlay);

// Fonction pour ouvrir la modale
const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(".js-open-modal");
    if (!target) {
        console.error("Modale inexistante");
        return;
    }
    // Affichage de la modale et de l'overlay
    overlay.style.display = "block";
    target.style.display = "block";
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", "true");
    modal = target;
    overlay.addEventListener("click", closeModal);
    modal.querySelector(".js-close-modal").addEventListener("click", closeModal);
};

// Fonction pour fermer la modale
const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    overlay.style.display = "none";
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    overlay.removeEventListener("click", closeModal);
    modal.querySelector(".js-close-modal").removeEventListener("click", closeModal);
    modal = null;
};

// Fonction pour arrêter la propagation de l'événement
const stopPropagation = function (e) {
    e.stopPropagation();
};

// Ajout des écouteurs d'événements pour ouvrir la modale
document.querySelectorAll(".js-open-modal-trigger").forEach(a => {
    a.addEventListener("click", openModal);
});

// Ajout de l'écouteur d'événement pour fermer la modale avec la touche echap
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
});

// Fonction pour récupérer les travaux depuis l'API
async function fetchTravaux() {
    const reponseTravaux = await fetch("http://localhost:5678/api/works");
    const travaux = await reponseTravaux.json();
    return travaux;
}

// Fonction pour afficher les travaux dans la modale
async function afficherTravaux() {
    try {
        const travaux = await fetchTravaux();

        const ajoutPhotoContainer = document.querySelector('.ajoutPhotoContainer');
        if (!ajoutPhotoContainer) {
            console.error("L'élément avec la classe 'ajoutPhotoContainer' n'existe pas.");
            return;
        }

        ajoutPhotoContainer.innerHTML = '';

        travaux.forEach(travail => {
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('imageContainer');

            const imgContainer = document.createElement('div');
            imgContainer.classList.add('imgContainer');

            const img = document.createElement('img');
            img.src = travail.imageUrl;
            img.alt = travail.title;

            const poubelleIcon = document.createElement('i');
            poubelleIcon.classList.add('fa-solid', 'fa-trash-can', 'poubelleIcon');
            poubelleIcon.setAttribute('data-id', travail.id);

            imgContainer.appendChild(img);
            imgContainer.appendChild(poubelleIcon);

            imageContainer.appendChild(imgContainer);
            ajoutPhotoContainer.appendChild(imageContainer);
        });

        ecouteurSuppressionTravail();

    } catch (error) {
        console.error("Une erreur est survenue lors de l'affichage des travaux :", error);
    }
}

// Fonction pour écouter les événements de suppression
function ecouteurSuppressionTravail() {
    document.querySelectorAll('.poubelleIcon').forEach(icon => {
        icon.addEventListener('click', async function () {
            const id = this.getAttribute('data-id');
            await supprimerTravail(id);
        });
    });
}

// Fonction pour supprimer un travail
async function supprimerTravail(id) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.ok) {
            console.log(`Travail avec ID ${id} supprimé.`);
            afficherTravaux();
        } else {
            console.error(`Erreur lors de la suppression du travail avec ID ${id}.`);
        }
    } catch (error) {
        console.error(`Erreur lors de la requête de suppression du travail avec ID ${id} :`, error);
    }
}

// Appel de la fonction pour afficher les travaux
afficherTravaux();

/* ===================================================== */
///        MODALE 2 - AJOUT PHOTO, TITRE, CATEGORIE
/* ===================================================== */

// Fonction pour ouvrir la modale d'ajout de photo
const openAjoutPhotoModal = function (e) {
    e.preventDefault();

    // Création de la modale
    const modaleAjoutPhoto = document.createElement("div");
    modaleAjoutPhoto.className = "modale-ajout-photo";
    modaleAjoutPhoto.innerHTML = `
        <div id="intModal">
            <div id="fondAjout">
                <span id="logoAjout" class="fa-regular fa-image"></span>
                <label for="photoProjet" class="styleAjoutPhoto">+ Ajouter Photo</label>
                <input type="file" id="photoProjet" class="hide">
                <p id="format">jpg, png: 4mo max</p>
            </div>
            <form id="formAjout">
                <label id="labelTitre" for="titre">Titre</label>
                <input id="titre" type="text" name="titre">
                <label id="labelCategorie" for="categorie">Catégorie</label>
                <select id="categorie" name="categorie">
                    <option value="" disabled selected></option>
                    <option value="Objets">Objets</option>
                    <option value="Appartements">Appartements</option>
                    <option value="Hotels & restaurants">Hotels & restaurants</option>
                </select>
                <input type="submit" id="envoyerProjet" value="Valider">
            </form>
            <button class="js-close-ajout-modal">Fermer</button>
        </div>`;

    // Ajout de l'overlay et de la modale au DOM si nécessaire
    if (!document.body.contains(overlay)) {
        document.body.appendChild(overlay);
    }
    document.body.appendChild(modaleAjoutPhoto);

    // Affichage de la modale et de l'overlay
    overlay.style.display = "block";
    modaleAjoutPhoto.style.display = "block";
    modal.style.display= "none";


    console.log("Modale d'ajout de photo ouverte");

    // Ajout des écouteurs d'événements pour fermer la modale
    overlay.addEventListener("click", closeAjoutPhotoModal);
    modaleAjoutPhoto.querySelector(".js-close-ajout-modal").addEventListener("click", closeAjoutPhotoModal);

    // Empêcher la propagation de l'événement de clic dans la modale
    modaleAjoutPhoto.addEventListener("click", stopPropagation);
};

// Fonction pour fermer la modale d'ajout de photo
const closeAjoutPhotoModal = function (e) {
    e.preventDefault();

    // Cacher l'overlay et la modale
    overlay.style.display = "none";
    const modaleAjoutPhoto = document.querySelector(".modale-ajout-photo");
    if (modaleAjoutPhoto) {
        modaleAjoutPhoto.style.display = "none";
        document.body.removeChild(modaleAjoutPhoto);
    }

    // Retirer les écouteurs d'événements
    overlay.removeEventListener("click", closeAjoutPhotoModal);
    if (modaleAjoutPhoto) {
        modaleAjoutPhoto.removeEventListener("click", stopPropagation);
    }

    console.log("Modale d'ajout de photo fermée");
};

// Ajout de l'écouteur d'événement pour ouvrir la modale d'ajout de photo
const ajoutPhotoButton = document.getElementById("ajoutPhoto");
if (ajoutPhotoButton) {
    ajoutPhotoButton.addEventListener("click", openAjoutPhotoModal);
    console.log("Écouteur d'événement ajouté à 'ajoutPhoto'");
} else {
    console.error("L'élément avec l'ID 'ajoutPhoto' n'existe pas.");
}

// Ajout de l'écouteur d'événement pour fermer la modale avec la touche echap
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeAjoutPhotoModal(e);
    }
});
