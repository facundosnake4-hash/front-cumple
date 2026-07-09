const API = "https://cumple-production-7320.up.railway.app";

const loginSection = document.getElementById("login-section");
const adminPanel = document.getElementById("admin-panel");

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

const invitadosLista = document.getElementById("invitados-lista");


loginBtn.addEventListener("click", async () => {

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;


    const response = await fetch(
        `${API}/admin/login?usuario=${usuario}&password=${password}`,
        {
            method: "POST"
        }
    );


    const correcto = await response.json();


    if(correcto){

        loginSection.hidden = true;
        adminPanel.hidden = false;

        cargarInvitados();

    }else{

        document.getElementById("login-message").textContent =
        "Usuario o contraseña incorrectos";

    }

});



async function cargarInvitados(){

    const response = await fetch(
        `${API}/admin/invitados`
    );


    const invitados = await response.json();


    invitadosLista.innerHTML = "";


    invitados.forEach(inv => {


        const div = document.createElement("div");

        div.className = 
            inv.aprobado ? 
            "invitado aprobado" :
            "invitado";


        div.innerHTML = `

            <h3>
                ${inv.nombre} ${inv.apellido}
            </h3>

            <p>
                Asistencia:
                ${inv.asistencia ? "Sí" : "No"}
            </p>

            <p>
                Regalo:
                ${inv.regalo || "No indicó"}
            </p>

            <p>
                Merienda:
                ${inv.merienda || "No indicó"}
            </p>


            <div class="acciones">

                <button 
                    class="aprobar"
                    onclick="aprobar(${inv.id})">
                    Aprobar
                </button>


                <button 
                    class="eliminar"
                    onclick="eliminar(${inv.id})">
                    Eliminar
                </button>

            </div>

        `;


        invitadosLista.appendChild(div);

    });

}



async function aprobar(id){

    await fetch(
        `${API}/admin/aprobar/${id}`,
        {
            method:"PUT"
        }
    );


    cargarInvitados();

}



async function eliminar(id){

    await fetch(
        `${API}/admin/eliminar/${id}`,
        {
            method:"DELETE"
        }
    );


    cargarInvitados();

}



logoutBtn.addEventListener("click",()=>{

    adminPanel.hidden = true;
    loginSection.hidden = false;

});

document.getElementById("volver-btn")
.addEventListener("click", () => {

    window.location.href = "index.html";

});