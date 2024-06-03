import { afficherTravaux, afficherMessage } from "./index.js";

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("token");

    /* ===================================================== */
    ///     MODALE 1 - GALERIE PHOTO, SUPPRESSION PROJETS
    /* ===================================================== */

    // Création de l'overlay pour la modale
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    document.body.appendChild(overlay);
    let modal = null;
    let formAjout;  // Déclaration du formulaire en dehors des fonctions pour le rendre accessible

    // Fonction d'écoute d'ouverture et fermeture de la modale
    function setupModalListeners() {
        document.querySelectorAll(".js-open-modal-trigger").forEach(button => {
            button.addEventListener("click", openModal);
        });
        // Fermer la modale en cliquant en dehors de la modale
        overlay.addEventListener("click", function (event) {
            if (event.target === overlay) {
                closeModal();
            }
        });
        // Fermer la modale avec la touche échapp
        window.addEventListener("keydown", function (e) {
            if (e.key === "Escape" || e.key === "Esc") {
                closeModal();
            }
        });
    }

    // Fonction pour ouvrir la modale
    const target = document.querySelector(".js-open-modal");
    target.style.display = "none";
    const openModal = function (e) {
        e.preventDefault();

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
    function closeModal() {
        if (!modal) return;
        overlay.style.display = "none";
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        modal.removeAttribute("aria-modal");
        modal = null;
    }

    setupModalListeners();

    // Fonction pour récupérer les travaux depuis l'API
    async function fetchTravaux() {
        const reponseTravaux = await fetch("http://localhost:5678/api/works", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
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

                // Fonction d'écoute des événements de suppression
                poubelleIcon.addEventListener('click', async function () {
                    await supprimerTravail(travail.id);
                    afficherTravaux();
                });

                imgContainer.appendChild(img);
                imgContainer.appendChild(poubelleIcon);
                imageContainer.appendChild(imgContainer);
                ajoutPhotoContainer.appendChild(imageContainer);
            });

        } catch (error) {
            console.error("Une erreur est survenue lors de l'affichage des travaux :", error);
        }
    }

    // Fonction pour supprimer un travail
    async function supprimerTravail(id) {
        try {
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                console.log(`Travail avec ID ${id} supprimé.`);
                afficherTravauxModale();
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
    modaleAjoutPhoto.style.display = "none";
    document.body.appendChild(modaleAjoutPhoto);

    // Fonction pour ouvrir la modale d'ajout de photo
    document.getElementById("ajoutPhoto").addEventListener("click", openAjoutPhotoModal);

    // Création de la modale
    function openAjoutPhotoModal() {
        closeModal();
        modaleAjoutPhoto.innerHTML = `
        <div id="intModal">
            <div class="stop-modal">
                <button class="fa-solid fa-arrow-left js-retour-arriere"></button>
                <button class="fa-solid fa-xmark js-close-ajout-modal"></button>
            </div>
            <h3>Ajout photo</h3>
            <form id="formAjout" enctype="multipart/form-data">
                <div id="fondAjout">
                <div id="previewAjout">
                    <span id="logoAjout" class="fa-regular fa-image"></span>
                    <label for="image" class="styleAjoutPhoto">+ Ajouter Photo</label>
                </div>
                    <input id="image" type="file" class="hide" name="image" accept="image/png, image/jpeg">
                    <p id="format">jpg, png: 4mo max</p>
                </div>
                <label id="labelTitre" for="titre">Titre</label>
                <input id="titre" type="text" name="title">
                <label id="labelCategorie" for="categorie">Catégorie</label>
                <select id="categorie" name="category">
                <option value="" disabled selected></option>
                <option value="1">Objets</option>
                <option value="2">Appartements</option>
                <option value="3">Hotels & restaurants</option>
                </select>
                <input type="submit" id="envoyerProjet" value="Valider">
            </form>
        </div>`;
        overlay.style.display = "block";
        modaleAjoutPhoto.style.display = "block";
        formAjout = document.getElementById("formAjout");  // Assignation du formulaire ici
        setupFormListeners();
    }

    //Fonction de vérification de remplissage des champs et activer bouton de validation
    function setupFormListeners() {
        const photoInput = document.getElementById("image");
        const titreInput = document.getElementById("titre");
        const categorieSelect = document.getElementById("categorie");
        const boutonValider = document.getElementById("envoyerProjet");

        function checkInputs() {
            if (titreInput.value && categorieSelect.value && photoInput.files.length > 0) {
                boutonValider.style.backgroundColor = 'green';
                boutonValider.disabled = false;
            } else {
                boutonValider.style.backgroundColor = 'gray';
                boutonValider.disabled = true;
                return;
            }
        }

        // Affiche l'image lorsqu'elle est sélectionnée
        photoInput.addEventListener('change', function (event) {
            checkInputs();
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                const previewAjout = document.getElementById('previewAjout');
                previewAjout.innerHTML = '';
                const image = document.createElement('img');
                image.src = e.target.result;
                image.style.width = '100%';
                image.style.borderRadius = '10px';
                previewAjout.appendChild(image);
            };
            reader.readAsDataURL(file);
        });

        titreInput.addEventListener('input', checkInputs);
        categorieSelect.addEventListener('change', checkInputs);

        // Ajout des écouteurs pour fermer la modale d'ajout de photo
        document.querySelector(".js-close-ajout-modal").addEventListener("click", closeAjoutPhotoModal);
        document.querySelector(".js-retour-arriere").addEventListener("click", retourArriereModal);

        // Fermer la modale en cliquant en dehors de la modale
        overlay.addEventListener("click", function (event) {
            if (event.target === overlay) {
                closeAjoutPhotoModal(event);
            }
        });

        // Ajout de l'écouteur d'événement pour fermer la modale avec la touche echap
        window.addEventListener("keydown", function (e) {
            if (e.key === "Escape" || e.key === "Esc") {
                closeAjoutPhotoModal(e);
            }
        });

        // Ajout de l'écouteur d'événement pour le bouton Valider
        boutonValider.addEventListener("click", validerProjet);
    }

    const closeAjoutPhotoModal = function (e) {
        e.preventDefault();
        overlay.style.display = "none";
        modaleAjoutPhoto.style.display = "none";
    };

    const retourArriereModal = function (e) {
        e.preventDefault();
        closeAjoutPhotoModal(e);
        openModal(e);
    };

    // Ajout de l'écouteur d'événement pour ouvrir la modale d'ajout de photo
    const ajoutPhotoButton = document.getElementById("ajoutPhoto");
    if (ajoutPhotoButton) {
        ajoutPhotoButton.addEventListener("click", openAjoutPhotoModal);
        console.log("Écouteur d'événement ajouté à 'ajoutPhoto'");
    } else {
        console.error("L'élément avec l'ID 'ajoutPhoto' n'existe pas.");
    }

    setupModalListeners();



// Fonction pour envoyer le projet et le stocker
async function validerProjet(event) {
    event.preventDefault();  // Empêcher le comportement par défaut du formulaire

    const formAjout = document.getElementById("formAjout");
    if (!formAjout) {
        console.error("Le formulaire d'ajout n'a pas été trouvé.");
        return;
    }

    const title = document.getElementById("titre").value;
    const categoryId = document.getElementById("categorie").value;
    const image = document.getElementById("image").files[0];

    if (!title || !categoryId || !image) {
        console.error("Tous les champs du formulaire ne sont pas remplis.");
        return;
    }

    try {
        const nouveauProjet = new FormData();
        nouveauProjet.append("title", title);
        nouveauProjet.append("image", image);
        nouveauProjet.append("category", categoryId);
        

        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: nouveauProjet
        });
        if (response.ok) {
            const projetAjoute = await response.json();
            afficherTravaux();
            afficherTravauxModale();
            closeAjoutPhotoModal(event);
        } else {
            console.error("Erreur lors de l'ajout du projet:", response.status, response.statusText);
            const errorResponse = await response.json();
            console.error("Contenu de la réponse:", errorResponse);
            afficherMessage("Erreur lors de l'ajout du projet.");
        }
    } catch (error) {
        console.error("Erreur lors de la requête POST:", error);
        afficherMessage("Une erreur est survenue. Veuillez réessayer.");
    }
};
});