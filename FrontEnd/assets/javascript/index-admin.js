const body = document.querySelector("body")
const header = document.querySelector("header")
const mesProjets = document.querySelector(".mesProjets")
const login = document.querySelector(".login")
const instagram = document.querySelector(".instagram")


// Création bandeau d'édition
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

// Création nav Logout
let LogOutHTML = document.createElement("li");
LogOutHTML.className = "LogOut";
LogOutHTML.style.display = "none";
LogOutHTML.textContent = "LogOut";
instagram.parentNode.insertBefore(LogOutHTML, instagram)


//Selection des éléments DOM
const btnCat = document.querySelectorAll(".btnCat");
const btnTous = document.getElementById("bouton-tous");
const bandeauEdition = document.querySelector(".bandeauEdition")
const boutonModifier = document.querySelector(".boutonModifier")
const LogOut = document.querySelector(".LogOut")
const openModalHTML = document.querySelector(".js-open-modal-trigger")
const filtresCategories = document.getElementById("filtres-categories");

//Apparition du bandeau et du bouton

async function apparitionEdition() {
    const verifConnection = localStorage.getItem("token");
    console.log("Token vérifié:", verifConnection);

    if (verifConnection) {
        openModalHTML.style.display = "block";
        bandeauEdition.style.display = "block";
        boutonModifier.style.display = "block";
        filtresCategories.style.display = "none";
        login.style.display = "none";
        LogOut.style.display = "block";
        console.log("ok");
    } else {
        console.log("Erreur !");
    }
}

apparitionEdition()


