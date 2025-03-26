import { trackMouseData } from "./tracker/mouse-movement.js";
import { trackTimeSpent } from "./tracker/time-tracker.js";
import { trackPageTransitions } from "./tracker/url-tracking.js";
import { trackJourney } from "./tracker/user-journey.js";
import { pageLoadTracker } from "./tracker/page-load-tracker.js";

trackMouseData();
trackTimeSpent();
trackPageTransitions();
trackJourney();
pageLoadTracker();
