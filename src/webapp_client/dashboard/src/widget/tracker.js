import { trackImageAccessibility } from "./tracker/accessibility-check.js";
import { trackMouseData } from "./tracker/mouse-movement.js";
import { trackTimeSpent } from "./tracker/time-tracker.js";
import { trackPageTransitions } from "./tracker/url-tracking.js";
import { trackJourney } from "./tracker/user-journey.js";


const urlParams = new URLSearchParams(window.location.search);
const trackingEnabled = urlParams.get('webvitals-tracking-switch') !== 'False';

if (trackingEnabled) {
  // TRACKER STUFFS
  trackMouseData();
  trackTimeSpent();
  trackPageTransitions();
  trackJourney();
  trackImageAccessibility();
} else {
  console.log('Tracking is disabled');
}


//SESSION REPLAY 
const canvas = document.createElement("canvas");
canvas.id = "lineCanvas";
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "1000";
canvas.style.display = "none"; // Initially hidden
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lastX = null, lastY = null;
let isClicking = false;

// Create and append the virtual cursor
const cursor = document.createElement("div");
cursor.id = "virtual-cursor";
cursor.style.display = "none"; // Initially hidden
document.body.appendChild(cursor);

// Apply styles dynamically
const style = document.createElement("style");
style.textContent = `
    #virtual-cursor {
        position: absolute;
        width: 15px;
        height: 15px;
        background-color: red;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
    }
    .click-effect {
        position: absolute;
        width: 30px;
        height: 30px;
        background-color: rgba(255, 0, 0, 0.6);
        border-radius: 50%;
        animation: vanish 0.5s forwards;
        pointer-events: none;
        z-index: 9998;
    }
    @keyframes vanish {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(3);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Listen for messages from the parent window
window.addEventListener('message', function(event) {
    if (event.origin !== 'http://localhost:5000') return;

    const data = event.data;
    if (data.type === 'event') {
        processEvent(data.event);
    }
});

function processEvent(event) {
    // Show cursor and canvas only when replay starts
    cursor.style.display = "block";
    canvas.style.display = "block";

    if (event.type === 'mousemove') {
        simulateMouseMove(event.x, event.y);
    } else if (event.type === 'click') {
        simulateClick(event.x, event.y);
    }
}

function simulateMouseMove(x, y) {
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;

    if (lastX !== null && lastY !== null && !isClicking) {
        drawVanishingLine(lastX, lastY, x, y);
    }

    lastX = x;
    lastY = y;
}

function simulateClick(x, y) {
    // Temporarily hide the vanishing line when clicking
    canvas.style.display = 'none';
    isClicking = true;

    // Create and display click effect
    const clickEffect = document.createElement("div");
    clickEffect.classList.add("click-effect");
    clickEffect.style.left = `${x - 15}px`;
    clickEffect.style.top = `${y - 15}px`;
    document.body.appendChild(clickEffect);

    setTimeout(() => {
        clickEffect.remove();
        canvas.style.display = 'block'; // Show canvas again
        isClicking = false;
    }, 500);

    // Simulate actual click on element under cursor
    const element = document.elementFromPoint(x, y);
    if (element) {
        const clickEvent = new Event('click', {
            bubbles: true,
            cancelable: true,
        });
        element.dispatchEvent(clickEvent);
    }
}

function drawVanishingLine(startX, startY, endX, endY) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 0, 0, 0.6)";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 100);
}

// Hide cursor and canvas when the session ends
function hideReplayElements() {
    cursor.style.display = "none";
    canvas.style.display = "none";
}

// Optional: Listen for stop event to hide elements
window.addEventListener("message", function(event) {
    if (event.data.type === "stop") {
        hideReplayElements();
    }
});



