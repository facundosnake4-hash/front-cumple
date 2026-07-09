const API_BASE_URL = "cumple-production-7320.up.railway.app";
const INVITADOS_ENDPOINT = `${API_BASE_URL}/invitados`;

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initSmoothAnchors();
  initRsvpForm();
  initModal();
  initGuestsList();
});


/* ================================
   CONTADOR
================================ */

function initCountdown() {

  const targetDate = new Date("2026-07-12T16:00:00");

  const daysEl = document.getElementById("countdown-days");
  const hoursEl = document.getElementById("countdown-hours");
  const minutesEl = document.getElementById("countdown-minutes");
  const secondsEl = document.getElementById("countdown-seconds");
  const timerGrid = document.getElementById("countdown-timer-grid");
  const todayMessage = document.getElementById("countdown-today-message");

  if (!daysEl) return;


  function pad(value) {
    return String(value).padStart(2, "0");
  }


  function update() {

    const now = new Date();
    const diff = targetDate - now;


    if (diff <= 0) {

      timerGrid.hidden = true;
      todayMessage.hidden = false;
      return;

    }


    daysEl.textContent = pad(
      Math.floor(diff / (1000 * 60 * 60 * 24))
    );

    hoursEl.textContent = pad(
      Math.floor(diff / (1000 * 60 * 60) % 24)
    );

    minutesEl.textContent = pad(
      Math.floor(diff / (1000 * 60) % 60)
    );

    secondsEl.textContent = pad(
      Math.floor(diff / 1000 % 60)
    );

  }


  update();
  setInterval(update, 1000);

}


/* ================================
   SCROLL SUAVE
================================ */

function initSmoothAnchors() {

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", e => {

      const id = anchor.getAttribute("href");

      const target = document.querySelector(id);

      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth"
      });

    });

  });

}



/* ================================
   FORMULARIO INVITADO
================================ */

function initRsvpForm() {

  const form = document.getElementById("rsvp-form");

  const status = document.getElementById("rsvp-status");


  if (!form) return;


  form.addEventListener("submit", async e => {

    e.preventDefault();


    if (!form.checkValidity()) {

      form.reportValidity();
      return;

    }


    const data = new FormData(form);


    const invitado = {

      nombre: data.get("nombre").trim(),

      apellido: data.get("apellido").trim(),

      asistencia:
        data.get("asistencia") === "true",

      regalo:
        data.get("regalo")?.trim() || null,

      merienda:
        data.get("merienda")?.trim() || null

    };



    try {


      await guardarInvitado(invitado);


      mostrarEstado(
        "¡Gracias! Tu confirmación fue enviada.",
        false
      );


      form.reset();


      openModal();

      launchConfetti();


      cargarInvitados();



    } catch (error) {


      console.error(error);


      mostrarEstado(
        "No se pudo enviar la confirmación.",
        true
      );


    }


  });



  function mostrarEstado(texto, error) {

    status.hidden = false;

    status.textContent = texto;

    status.classList.toggle(
      "rsvp__status--error",
      error
    );

  }


}



async function guardarInvitado(invitado) {


  const response = await fetch(
    INVITADOS_ENDPOINT,
    {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(invitado)

    }
  );


  if (!response.ok) {

    throw new Error(
      "Error servidor " + response.status
    );

  }


  return response.json();

}



/* ================================
   LISTA DE INVITADOS
================================ */

function initGuestsList() {

  const btn =
    document.getElementById("guests-refresh");


  if (btn) {

    btn.addEventListener(
      "click",
      cargarInvitados
    );

  }


  cargarInvitados();

}



async function cargarInvitados() {

  const lista =
    document.getElementById("guests-list");


  const empty =
    document.getElementById("guests-empty");


  const error =
    document.getElementById("guests-error");


  if (!lista) return;


  try {


    const response =
      await fetch(INVITADOS_ENDPOINT);


    const invitados =
      await response.json();


    renderInvitados(invitados);



  } catch (e) {


    console.error(e);

    lista.innerHTML = "";

    error.hidden = false;


  }

}




function renderInvitados(invitados) {

  const lista =
    document.getElementById("guests-list");


  const empty =
    document.getElementById("guests-empty");


  lista.innerHTML = "";


  const aprobados =
    invitados.filter(inv =>
      inv.aprobado === true &&
      inv.asistencia === true
    );



  if (aprobados.length === 0) {

    empty.hidden = false;

    return;

  }


  empty.hidden = true;


  aprobados.forEach(inv => {

    const card =
      document.createElement("article");


    card.className = "guest-card";


    card.innerHTML = `

      <div class="guest-card__info">

        <span class="guest-card__name">
          ${inv.nombre} ${inv.apellido}
        </span>

        <span class="guest-card__meta">

          ${inv.merienda ?
        "Trae: " + inv.merienda : ""}

          ${inv.regalo ?
        " · Regalo: " + inv.regalo : ""}

        </span>

      </div>

      <span class="guest-card__status">
        Confirmado
      </span>

    `;


    lista.appendChild(card);


  });


}



/* ================================
   MODAL
================================ */


function initModal() {

  const modal =
    document.getElementById(
      "thank-you-modal"
    );


  if (!modal) return;


  modal.querySelectorAll(
    "[data-close-modal]"
  )
    .forEach(btn => {

      btn.onclick = closeModal;

    });


}



function openModal() {

  const modal =
    document.getElementById(
      "thank-you-modal"
    );


  if (!modal) return;


  modal.classList.add(
    "is-open"
  );


}



function closeModal() {

  const modal =
    document.getElementById(
      "thank-you-modal"
    );


  modal.classList.remove(
    "is-open"
  );

}



/* ================================
   CONFETI
================================ */


function launchConfetti() {

  const canvas =
    document.getElementById(
      "confetti-canvas"
    );


  if (!canvas) return;


  const ctx =
    canvas.getContext("2d");


  canvas.width =
    window.innerWidth;


  canvas.height =
    window.innerHeight;


  const piezas = [];


  for (let i = 0; i < 50; i++) {

    piezas.push({

      x: Math.random() * canvas.width,

      y: -20,

      size: Math.random() * 8 + 3,

      speed: Math.random() * 3 + 2

    });

  }



  function animar() {


    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    piezas.forEach(p => {


      p.y += p.speed;


      ctx.fillRect(
        p.x,
        p.y,
        p.size,
        p.size
      );


    });


    requestAnimationFrame(animar);


  }


  animar();


  setTimeout(() => {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

  }, 2000);


}