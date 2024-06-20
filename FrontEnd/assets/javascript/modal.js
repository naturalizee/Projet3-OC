/*global fetch, console, document, window, localStorage, FileReader, FormData */


import { afficherTravaux } from "./index.js";

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    // =====================================================
    //     MODALE 1 - GALERIE PHOTO ET SUPPRESSION DE PROJETS
    // =====================================================

    // =====================================================
    //     Général
    // =====================================================

    // Création de l'overlay pour la modale
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    document.body.appendChild(overlay);

    let modal = null;
    let formAjout;

    // Fonction d'écoute d'ouverture et fermeture de la modale
    function setupModalListeners() {
        document.querySelectorAll(".js-open-modal-trigger").forEach(
            function (button) {
                button.addEventListener("click", openModal);
            }
        );

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
    if (target) {
        target.style.display = "none";
    }

    /**
     * Fonction pour ouvrir la modale
     * @param {Event} e - L'événement de clic
     */
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

        // Vérifie que modal et les éléments existent
        // avant d'ajouter des écouteurs d'événements
        if (modal) {
            overlay.addEventListener("click", closeModal);
            const closeButton = modal.querySelector(".js-close-modal");
            if (closeButton) {
                closeButton.addEventListener("click", closeModal);
            }
        }
    };

    /**
     * Fonction pour fermer la modale
     */
    function closeModal() {
        if (!modal) {
            return;
        }
        overlay.style.display = "none";
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        modal.removeAttribute("aria-modal");
        modal = null;
    }

    setupModalListeners();

    /**
     * Fonction pour récupérer les travaux depuis l'API
     * @returns {Promise<Array>} Les travaux récupérés depuis l'API
     */
    async function fetchTravaux() {
        const reponseTravaux = await fetch("http://localhost:5678/api/works", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const travaux = await reponseTravaux.json();
        return travaux;
    }

    // =====================================================
    //     Affichage des travaux
    // =====================================================

    /**
     * Fonction pour afficher les travaux dans la modale
     */
    async function afficherTravauxModale() {
        try {
            const travaux = await fetchTravaux();
            const ajoutPhotoContainer = document.querySelector(
                ".ajoutPhotoContainer"
            );
            if (!ajoutPhotoContainer) {
                console.error(
                    "L'élément avec la classe ajoutPhotoContainer n'existe pas."
                );
                return;
            }

            // Vide le conteneur avant d'ajouter les nouveaux éléments
            ajoutPhotoContainer.innerHTML = "";

            // Vérifie si les éléments existent déjà avant de les créer
            if (!document.querySelector(".js-close-modal")) {
                const closeModalLink = document.createElement("a");
                closeModalLink.href = "#";
                closeModalLink.className = "js-close-modal fa-solid fa-x";
                ajoutPhotoContainer.prepend(closeModalLink);
                closeModalLink.addEventListener("click", closeModal);
            }

            if (!document.querySelector(".galeriePhoto")) {
                const galeriePhotoHeader = document.createElement("h3");
                galeriePhotoHeader.className = "galeriePhoto";
                galeriePhotoHeader.textContent = "Galerie photo";
                ajoutPhotoContainer.prepend(galeriePhotoHeader);
            }

            if (!document.getElementById("ajoutPhoto")) {
                const buttonElement = document.createElement("button");
                buttonElement.textContent = "Ajouter une photo";
                buttonElement.id = "ajoutPhoto";
                const modalElement = document.querySelector(".Modale");
                modalElement.appendChild(buttonElement);

                // Ajout de l'écouteur d'événement pour ouvrir la modale d'ajout de photo
                buttonElement.addEventListener("click", openAjoutPhotoModal);
            }

            // Crée un conteneur pour les images
            const imagesContainer = document.createElement("div");
            imagesContainer.className = "imagesContainer";

            travaux.forEach(function (travail) {
                const imageContainer = document.createElement("div");
                imageContainer.classList.add("imageContainer");

                const imgContainer = document.createElement("div");
                imgContainer.classList.add("imgContainer");

                const img = document.createElement("img");
                img.src = travail.imageUrl;
                img.alt = travail.title;

                const poubelleIcon = document.createElement("i");
                poubelleIcon.classList.add(
                    "fa-solid",
                    "fa-trash-can",
                    "poubelleIcon"
                );
                poubelleIcon.setAttribute("data-id", travail.id);

                // Fonction d'écoute des événements de suppression
                poubelleIcon.addEventListener("click", async function () {
                    await supprimerTravail(travail.id);
                    afficherTravauxModale();
                    afficherTravaux();
                });

                imgContainer.appendChild(img);
                imgContainer.appendChild(poubelleIcon);
                imageContainer.appendChild(imgContainer);
                imagesContainer.appendChild(imageContainer);
            });

            // Ajoute le conteneur des images à la suite de l'en-tête
            ajoutPhotoContainer.appendChild(imagesContainer);

        } catch (error) {
            console.error(
                "Une erreur est survenue lors de l'affichage des travaux :",
                error
            );
        }
    }

    // =====================================================
    //     Suppression des travaux
    // =====================================================

    /**
     * Fonction pour supprimer un travail
     * @param {number} id - L'ID du travail à supprimer
     */
    async function supprimerTravail(id) {
        try {
            const response = await fetch(
                `http://localhost:5678/api/works/${id}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    method: "DELETE"
                }
            );
            if (response.ok) {
                console.log(`Travail avec ID ${id} supprimé.`);
                await afficherTravauxModale();
            } else {
                console.error(
                    `Erreur lors de la suppression du travail avec ID ${id}.`
                );
            }
        } catch (error) {
            console.error(
                `Erreur de requête de suppression du travail ${id} :`,
                error
            );
        }
    }


    // Appel de la fonction pour afficher les travaux
    afficherTravauxModale();

    // =====================================================
    //     MODALE 2 - AJOUT DE PROJETS
    // =====================================================

    // =====================================================
    //     Général
    // =====================================================

    const modaleAjoutPhoto = document.querySelector(".modale-ajout-photo");

    // Création de la modale
    function openAjoutPhotoModal() {
        closeModal();
        overlay.style.display = "block";
        modaleAjoutPhoto.style.display = "block";
        setupFormListeners();

        // Appel de la fonction pour récupérer et afficher les catégories
        fetchCategories().then(result => {
            if (result && result.categories) {
                afficherCategories(result.categories);
            }
        });
    }

    // Appel à l'API pour l'affichage des catégories
    /**
    * Récupération des catégories avec l'API.
    * @returns {Object} Contient les catégories.
    */
    async function fetchCategories() {
        try {
            const reponseCategories = await fetch(
                "http://localhost:5678/api/categories"
            );
            if (!reponseCategories.ok) {
                console.error("Erreur lors de la récupération des catégories");
                return;
            }
            const categories = await reponseCategories.json();

            return { categories };
        } catch (error) {
            console.error(error);
            return;
        }
    }

    function afficherCategories(categories) {
        "use strict";
        const listeCategories = document.getElementById("categorie");
    
        categories.forEach(function (category) {
            if (!Array.from(listeCategories.options).some
            (option => option.value == category.id)) {
                const optionCategorie = document.createElement("option");
                optionCategorie.value = category.id;
                optionCategorie.textContent = category.name;
                listeCategories.appendChild(optionCategorie);
            }
        });
    }
    
    // Fonction pour réinitialiser les champs de la modale d'ajout de photo
    function resetAjoutPhotoModal() {
        const photoInput = document.getElementById("image");
        const titreInput = document.getElementById("titre");
        const categorieSelect = document.getElementById("categorie");
        const previewAjout = document.getElementById("previewAjout");
        const boutonValider = document.getElementById("envoyerProjet");
    
        if (photoInput) {
            photoInput.value = "";
        }
        if (titreInput) {
            titreInput.value = "";
        }
        if (categorieSelect) {
            categorieSelect.selectedIndex = 0;
        }
        if (previewAjout) {
            previewAjout.innerHTML = '<span id="logoAjout" class="fa-regular fa-image"></span><label for="image" class="styleAjoutPhoto">+ Ajouter Photo</label>';
        }
        if (boutonValider) {
            boutonValider.style.backgroundColor = "#B3B3B3";
            boutonValider.disabled = true;
        }
        clearErrorMessage();
    };
    

    // =====================================================
    //     Validation et prévisualisation
    // =====================================================

    /**
     * Fonction de vérification de remplissage
     * des champs et activer bouton de validation
     */
    function setupFormListeners() {
        const photoInput = document.getElementById("image");
        const titreInput = document.getElementById("titre");
        const categorieSelect = document.getElementById("categorie");
        const boutonValider = document.getElementById("envoyerProjet");

        function checkInputs() {
            if (
                titreInput.value &&
                categorieSelect.value &&
                photoInput.files.length > 0
            ) {
                boutonValider.style.backgroundColor = "#1D6154";
                boutonValider.disabled = false;
            } else {
                boutonValider.style.backgroundColor = "#B3B3B3";
                boutonValider.disabled = true;
            }
        }

        // Affiche l'image lorsqu'elle est sélectionnée
        photoInput.addEventListener("change", function (event) {
            checkInputs();
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                if (
                    photoInput.files[0].type !== "image/jpeg" &&
                    photoInput.files[0].type !== "image/png" ||
                    photoInput.files[0].size >= 4 * 1024 * 1024
                ) {
                    afficherMessage("Le format d'image est incorrect");
                    return;
                } else {
                    const previewAjout = document.getElementById(
                        "previewAjout"
                    );
                    previewAjout.innerHTML = "";
                    const image = document.createElement("img");
                    image.src = e.target.result;
                    image.style.width = "100%";
                    image.style.borderRadius = "10px";
                    previewAjout.appendChild(image);

                }
            };
            reader.readAsDataURL(file);
        });

        titreInput.addEventListener(
            "input",
            checkInputs
        );
        categorieSelect.addEventListener(
            "change",
            checkInputs
        );


        // Ajout des écouteurs pour fermer la modale d'ajout de photo
        const closeAjoutModal = document.querySelector(".js-close-ajout-modal");
        closeAjoutModal.addEventListener("click", closeAjoutPhotoModal);

        const retourArriere = document.querySelector(".js-retour-arriere");
        retourArriere.addEventListener("click", retourArriereModal);

        // Fermer la modale en cliquant en dehors de la modale
        overlay.addEventListener("click", function (event) {
            if (event.target === overlay) {
                closeAjoutPhotoModal(event);
            }
        });


        // Ajout de l'écouteur d'événement
        // pour fermer la modale avec la touche échapp
        window.addEventListener("keydown", function (e) {
            if (e.key === "Escape" || e.key === "Esc") {
                closeAjoutPhotoModal(e);
            }
        });

        // Ajout de l'écouteur d'événement pour le bouton Valider
        boutonValider.addEventListener("click", validerProjet);
    }

    /**
     * Fonction pour fermer la modale d'ajout de photo
     * @param {Event} e - L'événement de clic
     */
    const closeAjoutPhotoModal = function (e) {
        e.preventDefault();
        overlay.style.display = "none";
        modaleAjoutPhoto.style.display = "none";
        resetAjoutPhotoModal();
    };

    /**
     * Fonction pour revenir en arrière dans la modale
     * @param {Event} e - L'événement de clic
     */
    const retourArriereModal = function (e) {
        e.preventDefault();
        closeAjoutPhotoModal(e);
        openModal(e);
    };

    setupModalListeners();

    // =====================================================
    //     Envoi des projets
    // =====================================================

    /**
     * Fonction pour envoyer le projet et le stocker
     * @param {Event} event - L'événement de soumission du formulaire
     */
    async function validerProjet(event) {
        event.preventDefault();

        formAjout = document.getElementById("formAjout");
        if (!formAjout) {
            console.error("Le formulaire d'ajout n'a pas été trouvé.");
            return;
        }

        const title = document.getElementById("titre").value;
        const categoryId = document.getElementById("categorie").value;
        const imageId = document.getElementById("image").files[0];
        const photoInput = document.getElementById("image");

        if (!title ||
            !categoryId ||
            !imageId ||
            photoInput.files[0].type !== "image/jpeg" &&
            photoInput.files[0].type !== "image/png" ||
            photoInput.files[0].size > 4 * 1024 * 1024) {
            afficherMessage(
                "Tous les champs du formulaire ne sont pas remplis."
            );
            return;
        }
        try {
            const nouveauProjet = new FormData();
            nouveauProjet.append("title", title);
            nouveauProjet.append("image", imageId);
            nouveauProjet.append("category", categoryId);

            const tokenPost = localStorage.getItem("token");
            const response = await fetch("http://localhost:5678/api/works", {
                body: nouveauProjet,
                headers: {
                    "Authorization": `Bearer ${tokenPost}`
                },
                method: "POST"
            });
            if (response.ok) {
                afficherTravaux();
                afficherTravauxModale();
                closeAjoutPhotoModal(event);
                resetAjoutPhotoModal();
            } else {
                afficherMessage("Erreur lors de l'ajout du projet.");
            }
        } catch (error) {
            console.error("Erreur lors de la requête POST:", error);
            afficherMessage("Une erreur est survenue. Veuillez réessayer.");
        }
    }

    /**
     * Fonction pour afficher un message d'erreur
     * @param {string} message - Le message d'erreur à afficher
     */
    function afficherMessage(message) {
        clearErrorMessage();
        const boutonValider = document.getElementById("envoyerProjet");
        const erreurMessage = document.createElement("p");
        erreurMessage.classList.add("message-erreur");
        erreurMessage.textContent = message;
        erreurMessage.style.color = "red";
        erreurMessage.style.marginBottom = "10px";
        boutonValider.parentNode.insertBefore(erreurMessage, boutonValider);
    }
    

    // Fonction pour supprimer un message d'erreur précédent
    function clearErrorMessage() {
        const erreurPrecedente = document.querySelector(".message-erreur");
        if (erreurPrecedente) {
            erreurPrecedente.remove();
        }
    };

});
