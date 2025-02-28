import { trackMouseData } from "./tracker/mouse-movement.js";
import { trackTimeSpent } from "./tracker/time-tracker.js";
import { trackPageTransitions } from "./tracker/url-tracking.js";

trackMouseData();
trackTimeSpent();
trackPageTransitions();
