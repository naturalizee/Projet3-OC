import { afficherTravaux, afficherMessage } from "./index.js";

document.addEventListener('DOMContentLoaded', (event) => {
    
    const token = localStorage.getItem("token");

    /* ===================================================== */
    ///     MODALE 1 - GALERIE PHOTO, SUPPRESSION PROJETS
    /* ===================================================== */

    // Création de l'overlay pour la modale
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    document.body.appendChild(overlay);
    let modal = null;

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
    async function afficherTravauxModale() {
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
                afficherTravauxModale();
                afficherTravaux();
            } else {
                console.error(`Erreur lors de la suppression du travail avec ID ${id}.`);
            }
        } catch (error) {
            console.error(`Erreur lors de la requête de suppression du travail avec ID ${id} :`, error);
        }
    }

    // Appel de la fonction pour afficher les travaux
    afficherTravauxModale();

    /* ===================================================== */
    ///        MODALE 2 - AJOUT PHOTO, TITRE, CATEGORIE
    /* ===================================================== */

    const modaleAjoutPhoto = document.createElement("div");
    modaleAjoutPhoto.className = "modale-ajout-photo";

    // Fonction pour ouvrir la modale d'ajout de photo
    const openAjoutPhotoModal = function (e) {
        e.preventDefault();

        // Création de la modale
        modaleAjoutPhoto.innerHTML = `
<div id="intModal">
    <div class="stop-modal">
        <button class="fa-solid fa-arrow-left js-retour-arriere"></button>
        <button class="fa-solid fa-xmark js-close-ajout-modal"></button>
    </div>
    <h3>Ajout photo</h2>
    <form id="formAjout">
        <div id="fondAjout">
            <span id="logoAjout" class="fa-regular fa-image"></span>
            <label for="photoProjet" class="styleAjoutPhoto">+ Ajouter Photo</label>
            <input type="file" id="photoProjet" class="hide">
            <p id="format">jpg, png: 4mo max</p>
        </div>
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
</div>`;

        // Ajout de l'overlay et de la modale au DOM
        if (!document.body.contains(overlay)) {
            document.body.appendChild(overlay);
        }
        document.body.appendChild(modaleAjoutPhoto);

        // Affichage de la modale et de l'overlay
        overlay.style.display = "block";
        modaleAjoutPhoto.style.display = "block";
        if (modal) {
            modal.style.display = "none";
        }

        console.log("Modale d'ajout de photo ouverte");

        // Ajout des écouteurs d'événements pour fermer la modale
        overlay.addEventListener("click", closeAjoutPhotoModal);
        modaleAjoutPhoto.querySelector(".js-close-ajout-modal").addEventListener("click", closeAjoutPhotoModal);

        // Empêcher la propagation de l'événement de clic dans la modale
        modaleAjoutPhoto.addEventListener("click", stopPropagation);

        // Ajout des écouteurs d'événements pour fermer la modale actuelle et ouvrir la précédente
        modaleAjoutPhoto.querySelector(".js-retour-arriere").addEventListener("click", function (e) {
            e.preventDefault();
            modaleAjoutPhoto.style.display = "none";
            openModal(e);
        });

        // Affiche l'image lorsqu'elle est sélectionnée
        document.getElementById('photoProjet').addEventListener('change', function (event) {
            const file = event.target.files[0];
            const fondAjout = document.getElementById('fondAjout');

            const reader = new FileReader();
            reader.onload = function (e) {
                fondAjout.innerHTML = '';
                const image = document.createElement('img');
                image.src = e.target.result;
                image.style.width = '100%';
                image.style.borderRadius = '10px';
                fondAjout.appendChild(image);
            };

            reader.readAsDataURL(file);
        });

        setupFormListeners(); // Ajouter les écouteurs d'événements pour le formulaire après l'ouverture de la modale
    };

    // Fonction pour ajouter les écouteurs d'événements au formulaire
    function setupFormListeners() {
        const titreInput = document.getElementById("titre");
        const categorieSelect = document.getElementById("categorie");
        const photoInput = document.getElementById("photoProjet");
        const boutonValider = document.getElementById("envoyerProjet");

        function checkInputs() {
            if (titreInput.value && categorieSelect.value && photoInput.files.length > 0) {
                boutonValider.style.backgroundColor = 'green';
                boutonValider.disabled = false;
            } else {
                boutonValider.style.backgroundColor = 'gray';
                boutonValider.disabled = true;
            }
        }
        titreInput.addEventListener('input', checkInputs);
        categorieSelect.addEventListener('change', checkInputs);
        photoInput.addEventListener('change', checkInputs);

        boutonValider.addEventListener("click", function (e) {
            e.preventDefault();
            validerProjet(e);
        });
    }

    // Fonction pour envoyer le projet et le stocker
    async function validerProjet(event) {
        // Empêcher le comportement par défaut du formulaire
        event.preventDefault();

        // Récupérer le formulaire et créer un nouvel objet FormData
        const formAjout = document.getElementById("formAjout");
        const nouveauProjet = new FormData(formAjout);
        console.log(nouveauProjet);

        try {
            // Effectuer la requête POST avec fetch
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: nouveauProjet
            });

            if (response.ok) {
                // Si la réponse est OK, afficher les travaux mis à jour
                const projetAjoute = await response.json();
                afficherTravaux();
                afficherTravauxModale();
                closeAjoutPhotoModal();
            } else {
                // Sinon, afficher le contenu de la réponse en cas d'erreur
                console.error("Erreur lors de l'ajout du projet:", response.status, response.statusText);
                const errorResponse = await response.json();
                console.error("Contenu de la réponse:", errorResponse);
                afficherMessage("Erreur lors de l'ajout du projet.");
            }
        } catch (error) {
            // Attraper les erreurs de la requête
            console.error("Erreur lors de la requête POST:", error);
            afficherMessage("Une erreur est survenue. Veuillez réessayer.");
        }
    }

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
});
