/**
 * =====================================================
 * MÓDULO DE POSTURAS
 * =====================================================
 */

"use strict";

import { POSTURES } from "../../data/postures.js";
import { incrementarCiclos } from "./cycleCounter.js";
import { EVENTS } from "./events.js";



/* ==========================================
   CONFIGURACIÓN
========================================== */

const IMAGE_RADIUS = 30;


/* ==========================================
   ESTADO DEL MÓDULO
========================================== */

let posturaActiva = 0;

let imagenesPosturas = [];


/* ==========================================
   UTILIDADES
========================================== */

function obtenerIndicacionRespiracion(tipo) {

    switch (tipo) {

        case "inhale":
            return "INHALA";

        case "exhale":
            return "EXHALA";

        case "hold":
            return "RETÉN";

        default:
            return "";

    }

}

export function notificarCambioPostura() {

    const postura = POSTURES[posturaActiva];

    if (!postura) {
        return;
    }

    document.dispatchEvent(

        new CustomEvent(
            EVENTS.POSTURE_CHANGED,

            {
                detail: {

                    postura: postura.name,

                    respiracion: postura.breathing

                }
            }

        )

    );

}


/* ==========================================
   CREAR TARJETA DE POSTURA ACTIVA
========================================== */

function actualizarPosturaActiva(indice) {

    const container =
        document.getElementById("active-posture");

    if (!container) {

        console.error(
            "No existe #active-posture"
        );

        return;

    }


    const posture =
        POSTURES[indice];


    container.innerHTML = `

        <article class="active-posture-card">

            <div class="active-posture-header">

                ${posture.name}

            </div>


            <img
                class="active-posture-image"
                src="${posture.image}"
                alt="${posture.name}">


            <p class="active-posture-subtitle">

                ${posture.subtitle}

            </p>


            <div
                class="
                    active-breathing-label
                    breathing-${posture.breathing}
                ">

                ${obtenerIndicacionRespiracion(
                    posture.breathing
                )}

            </div>

        </article>

    `;

}


/* ==========================================
   CREAR IMÁGENES DEL CÍRCULO
========================================== */

export function crearPosturas() {

    const container =
        document.getElementById("postures");


    if (!container) {

        console.error(
            "No existe #postures"
        );

        return;

    }


    container.innerHTML = "";

    imagenesPosturas = [];


    const total =
        POSTURES.length;


    POSTURES.forEach(
        (posture, index) => {

            const angle =
                (
                    (360 / total) * index - 90
                ) * Math.PI / 180;


            const image =
                document.createElement("img");


            image.className =
                "posture-circle-image";


            image.dataset.index =
                index;


            image.dataset.angle =
                angle;


            image.src =
                posture.image;


            image.alt =
                posture.name;


            posicionarImagen(
                image,
                angle
            );


            container.appendChild(image);

            imagenesPosturas.push(image);

        }
    );


    activarPostura(0);


    console.log(
        "✔ Posturas creadas"
    );

}


/* ==========================================
   POSICIONAR IMAGEN
========================================== */

function posicionarImagen(
    image,
    angle
) {

    const x =
        50 +
        Math.cos(angle) *
        IMAGE_RADIUS;


    const y =
        50 +
        Math.sin(angle) *
        IMAGE_RADIUS;


    image.style.left =
        `${x}%`;


    image.style.top =
        `${y}%`;

}


/* ==========================================
   REINICIAR POSTURAS
========================================== */

export function reiniciarPosturas() {

    posturaActiva = 0;

    activarPostura(0);

}


/* ==========================================
   ACTIVAR POSTURA
========================================== */

export function activarPostura(indice) {

    if (
        indice < 0 ||
        indice >= POSTURES.length
    ) {

        return;

    }


    /*
     * Quitar estado activo
     * de todas las imágenes.
     */

    imagenesPosturas.forEach(
        image => {

            image.classList.remove(
                "active"
            );

        }
    );


    /*
     * Activar la nueva imagen.
     */

    const actual =
        imagenesPosturas[indice];


    if (actual) {

        actual.classList.add(
            "active"
        );

    }


    /*
     * Actualizar la tarjeta
     * independiente.
     */

    actualizarPosturaActiva(
        indice
    );


    /*
     * Guardar postura actual.
     */

    posturaActiva =
        indice;


    notificarCambioPostura();


}


/* ==========================================
   SIGUIENTE POSTURA
========================================== */

export function siguientePostura() {

    let siguiente =
        posturaActiva + 1;


    /*
     * Si hemos llegado al final
     * completamos un ciclo.
     */

    if (
        siguiente >=
        imagenesPosturas.length
    ) {

        incrementarCiclos();

        siguiente = 0;

    }


    activarPostura(
        siguiente
    );

}


/* ==========================================
   POSTURA ANTERIOR
========================================== */

export function anteriorPostura() {

    let anterior =
        posturaActiva - 1;


    if (anterior < 0) {

        anterior =
            imagenesPosturas.length - 1;

    }


    activarPostura(
        anterior
    );

}