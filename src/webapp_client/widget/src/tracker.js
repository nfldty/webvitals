import { trackImageAccessibility } from "./tracker/accessibility-check.js";
import { trackMouseData } from "./tracker/mouse-movement.js";
import { trackTimeSpent } from "./tracker/time-tracker.js";
import { trackPageTransitions } from "./tracker/url-tracking.js";
import { trackJourney } from "./tracker/user-journey.js";

trackMouseData();
trackTimeSpent();
trackPageTransitions();
trackJourney();
trackImageAccessibility();

