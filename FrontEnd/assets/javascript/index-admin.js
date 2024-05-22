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
    z-index: 1000;
    top: 0;
    left: 0;
"><i class="fa-solid fa-pen-to-square"></i> Mode édition</div>
`;
header.insertAdjacentHTML('beforebegin', bandeauEditionHTML);
header.style.paddingTop = "calc(+50px)";

// Création bouton modifier
let boutonModifierHTML = `
        <div class="boutonModifier"
        style="
        display:none";>
        Modifier</div>`;
mesProjets.insertAdjacentHTML('afterend', boutonModifierHTML);

// Création nav Logout
let LogOutHTML = document.createElement("li");
LogOutHTML.className = "LogOut";
LogOutHTML.style.display = "none";
LogOutHTML.textContent = "LogOut";
instagram.parentNode.insertBefore(LogOutHTML, instagram)


//Selection des éléments DOM
const bandeauEdition = document.querySelector(".bandeauEdition")
const boutonModifier = document.querySelector(".boutonModifier")
const LogOut = document.querySelector(".LogOut")

// Apparition du bandeau et du bouton
function apparitionEdition() {
    const verifConnection =
        localStorage.getItem("token")
    if (verifConnection) {
        boutonModifier.style.display = "block"
        bandeauEdition.style.display = "block"
        login.style.display = "none"
        LogOut.style.display = "block"

        console.log("ok")
    } else {
        console.log("Erreur !")
    }
}

apparitionEdition()