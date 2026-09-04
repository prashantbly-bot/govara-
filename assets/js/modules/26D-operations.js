/* =========================================================
   GoVara — 26D Operations Control Center
   Version: 26D-V2
   Frontend-only / LocalStorage
   Backend + API + Database: NOT CONNECTED
   ========================================================= */

window.GoVara26D = (function () {

  "use strict";

  const STORAGE_KEY = "GOVARA_OPERATIONS_CONTROL_26D_V2";

  const DEFAULT_CONFIG = {

    version: "26D-V2",

    /* =====================================================
       PLATFORM OPERATIONS
       ===================================================== */

    platform: {
      operational: true,
      bookingOperational: true,
      customerOperations: true,
      vendorOperations: true,
      driverOperations: true,
      vehicleOperations: true,
      supportOperations: true
    },


    /* =====================================================
       OPERATING HOURS
       ===================================================== */

    operatingHours: {
      enabled: false,
      twentyFourSeven: true,

      monday:    { enabled: true, start: "00:00", end: "23:59" },
      tuesday:   { enabled: true, start: "00:00", end: "23:59" },
      wednesday: { enabled: true, start: "00:00", end: "23:59" },
      thursday:  { enabled: true, start: "00:00", end: "23:59" },
      friday:    { enabled: true, start: "00:00", end: "23:59" },
      saturday:  { enabled: true, start: "00:00", end: "23:59" },
      sunday:    { enabled: true, start: "00:00", end: "23:59" }
    },


    /* =====================================================
       BOOKING OPERATIONS
       ===================================================== */

    booking: {

      intakeEnabled: true,

      newBookingEnabled: true,
      acceptBookingEnabled: true,
      rejectBookingEnabled: true,
      cancelBookingEnabled: true,
      modificationEnabled: true,

      customerBookingAllowed: true,
      vendorBookingAllowed: true,

      futureBookingAllowed: true,
      sameDayBookingAllowed: true,

      assignmentRequired: true,

      maxPendingMinutes: 15,
      maxAssignmentAttempts: 3,

      reassignmentEnabled: true,
      maxReassignmentAttempts: 3,

      unassignedEscalationEnabled: true,
      unassignedEscalationMinutes: 10,

      noShowEnabled: true,

      statuses: {
        NEW: true,
        PENDING: true,
        ASSIGNED: true,
        ACCEPTED: true,
        REJECTED: true,
        DRIVER_ARRIVING: true,
        TRIP_STARTED: true,
        TRIP_COMPLETED: true,
        CANCELLED: true,
        NO_SHOW: true
      }
    },


    /* =====================================================
       DISPATCH
       ===================================================== */

    dispatch: {

      enabled: true,

      manualDispatchEnabled: true,
      autoDispatchEnabled: false,

      reassignmentEnabled: true,

      driverSelectionEnabled: true,
      vendorSelectionEnabled: true,
      vehicleSelectionEnabled: true,

      unassignedQueueEnabled: true,

      dispatchTimeoutMinutes: 10,

      maxAssignmentAttempts: 3,
      maxReassignmentAttempts: 3,

      requireDriverAvailability: true,
      requireVehicleAvailability: true,

      blockOfflineDriver: true,
      blockBusyDriver: true,
      blockUnavailableVehicle: true,

      escalationEnabled: true,
      escalationMinutes: 10
    },


    /* =====================================================
       DUTY / DRIVER OPERATIONS
       ===================================================== */

    duty: {

      enabled: true,

      dutyStartEnabled: true,
      dutyEndEnabled: true,

      breakEnabled: true,
      unavailableStatusEnabled: true,

      onlineStatusEnabled: true,
      offlineStatusEnabled: true,

      tripStartEnabled: true,
      tripEndEnabled: true,

      maximumDutyDurationHours: 12,
      minimumRestHours: 8,

      approvalRequired: false,

      states: {
        OFFLINE: true,
        ONLINE: true,
        ON_DUTY: true,
        BREAK: true,
        ON_TRIP: true,
        UNAVAILABLE: true
      }
    },


    /* =====================================================
       DRIVER OPERATIONS
       ===================================================== */

    driver: {

      managementEnabled: true,

      registrationOperational: true,
      profileUpdateEnabled: true,

      bookingAcceptanceEnabled: true,
      bookingRejectionEnabled: true,

      dutyManagementEnabled: true,

      locationSharingEnabled: false,
      tripTrackingEnabled: false,

      driverAvailabilityRequired: true,

      ratingVisibleToDriver: true,

      blockedDriverCannotReceiveBooking: true,
      offlineDriverCannotReceiveBooking: true,
      onTripDriverCannotReceiveBooking: true
    },


    /* =====================================================
       VEHICLE OPERATIONS
       ===================================================== */

    vehicle: {

      managementEnabled: true,
      registrationEnabled: true,

      assignmentEnabled: true,
      availabilityTrackingEnabled: true,

      inactiveVehicleBookingBlocked: true,
      maintenanceVehicleBookingBlocked: true,
      blockedVehicleBookingBlocked: true,
      expiredDocumentVehicleBlocked: true,

      states: {
        AVAILABLE: true,
        ASSIGNED: true,
        ON_TRIP: true,
        OFFLINE: true,
        MAINTENANCE: true,
        BLOCKED: true,
        DOCUMENT_EXPIRED: true
      }
    },


    /* =====================================================
       VENDOR OPERATIONS
       ===================================================== */

    vendor: {

      managementEnabled: true,

      bookingManagementEnabled: true,
      driverManagementEnabled: true,
      vehicleManagementEnabled: true,
      dutyManagementEnabled: true,

      assignmentManagementEnabled: true,

      vendorCanAssignDriver: true,
      vendorCanAssignVehicle: true,

      blockedVendorCannotReceiveBooking: true,
      inactiveVendorCannotReceiveBooking: true,

      approvalRequired: false
    },


    /* =====================================================
       VENDOR / VEHICLE / DRIVER RELATIONSHIP
       ===================================================== */

    assignment: {

      relationshipControlEnabled: true,

      vendorDriverAssignment: true,
      vendorVehicleAssignment: true,

      driverVehicleAssignment: true,

      requireVendorForVendorVehicle: true,
      requireDriverForTrip: true,
      requireVehicleForTrip: true,

      preventCrossVendorAssignment: true,

      assignmentHistoryEnabled: true
    },


    /* =====================================================
       LOCATION / TRACKING
       ===================================================== */

    tracking: {

      locationTrackingEnabled: false,

      driverLocationEnabled: false,
      vehicleLocationEnabled: false,

      trackingDuringDuty: false,
      trackingDuringTrip: false,

      locationUpdateIntervalSeconds: 30,

      trackingFailureHandlingEnabled: true,

      maximumLocationFailureMinutes: 5,

      notifyOnTrackingFailure: true
    },


    /* =====================================================
       CAPACITY CONTROL
       ===================================================== */

    capacity: {

      capacityControlEnabled: false,

      bookingIntakeLimitEnabled: false,
      dispatchCapacityEnabled: false,

      vendorCapacityEnabled: false,
      driverCapacityEnabled: false,
      vehicleCapacityEnabled: false,

      maximumPendingBookings: 100,
      maximumDispatchQueue: 50,

      maximumBookingsPerVendor: 50,
      maximumBookingsPerDriver: 5,
      maximumBookingsPerVehicle: 1,

      rejectWhenCapacityReached: true,
      queueWhenCapacityReached: true
    },


    /* =====================================================
       CUSTOMER SUPPORT
       ===================================================== */

    support: {

      enabled: true,

      customerSupportEnabled: true,
      complaintHandlingEnabled: true,

      ticketCreationEnabled: true,
      ticketAssignmentEnabled: true,

      escalationEnabled: true,

      supportResponseMinutes: 30,
      escalationAfterMinutes: 60,

      emergencySupportEnabled: false,

      complaintCategories: {
        BOOKING: true,
        DRIVER: true,
        VEHICLE: true,
        VENDOR: true,
        FARE: true,
        PAYMENT: true,
        DOCUMENT: true,
        OTHER: true
      }
    },


    /* =====================================================
       INCIDENT / EMERGENCY
       ===================================================== */

    incident: {

      incidentManagementEnabled: true,

      emergencyMode: false,

      emergencyBookingFreeze: false,
      emergencyDispatchFreeze: false,
      emergencyDriverFreeze: false,
      emergencyVendorFreeze: false,

      incidentCreationEnabled: true,
      incidentEscalationEnabled: true,

      emergencyNotificationEnabled: true,

      incidentTypes: {
        ACCIDENT: true,
        DRIVER_ISSUE: true,
        VEHICLE_ISSUE: true,
        CUSTOMER_ISSUE: true,
        SERVICE_FAILURE: true,
        SAFETY: true,
        SYSTEM: true,
        OTHER: true
      }
    },


    /* =====================================================
       NOTIFICATIONS
       ===================================================== */

    notifications: {

      bookingCreated: true,
      bookingAssigned: true,
      bookingAccepted: true,
      bookingRejected: true,

      driverArriving: true,

      tripStarted: true,
      tripCompleted: true,

      bookingCancelled: true,
      bookingNoShow: true,

      driverDutyChange: true,
      vehicleAssignment: true,

      dispatchTimeout: true,
      unassignedEscalation: true,

      supportUpdate: true,
      escalationAlert: true,

      incidentAlert: true,
      emergencyAlert: true,

      trackingFailure: true
    },


    /* =====================================================
       OPERATIONAL SAFETY
       ===================================================== */

    safety: {

      globalBookingFreeze: false,
      globalDispatchFreeze: false,

      customerBookingFreeze: false,
      vendorBookingFreeze: false,
      driverDispatchFreeze: false,

      maintenanceMode: false,

      emergencyMode: false,

      realMoney: false,
      realPayment: false,
      bankTransfer: false,

      frontendAuthority: false,
      backendAuthority: true
    }

  };


  /* =========================================================
     HELPERS
     ========================================================= */

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }


  function escapeHTML(value) {

    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function number(value, fallback = 0) {

    const n = Number(value);

    return Number.isFinite(n)
      ? n
      : fallback;
  }


  function mergeDeep(target, source) {

    if (!source || typeof source !== "object") {
      return target;
    }

    Object.keys(source).forEach(function (key) {

      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key]) &&
        target[key] &&
        typeof target[key] === "object"
      ) {

        mergeDeep(
          target[key],
          source[key]
        );

      } else {

        target[key] = source[key];

      }

    });

    return target;
  }


  function getConfig() {

    try {

      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return clone(DEFAULT_CONFIG);
      }

      return mergeDeep(
        clone(DEFAULT_CONFIG),
        JSON.parse(saved)
      );

    } catch (error) {

      console.warn(
        "26D: configuration load failed.",
        error
      );

      return clone(DEFAULT_CONFIG);
    }
  }


  /* =========================================================
     VALIDATION
     ========================================================= */

  function validate(config) {

    const errors = [];


    if (
      number(config.booking.maxPendingMinutes) < 0
    ) {

      errors.push(
        "Maximum pending booking time cannot be negative."
      );

    }


    if (
      number(config.booking.maxAssignmentAttempts) < 1
    ) {

      errors.push(
        "Maximum assignment attempts must be at least 1."
      );

    }


    if (
      number(config.booking.maxReassignmentAttempts) < 0
    ) {

      errors.push(
        "Maximum reassignment attempts cannot be negative."
      );

    }


    if (
      number(config.dispatch.dispatchTimeoutMinutes) < 0
    ) {

      errors.push(
        "Dispatch timeout cannot be negative."
      );

    }


    if (
      number(config.duty.maximumDutyDurationHours) <= 0
    ) {

      errors.push(
        "Maximum duty duration must be greater than zero."
      );

    }


    if (
      number(config.duty.minimumRestHours) < 0
    ) {

      errors.push(
        "Minimum rest hours cannot be negative."
      );

    }


    if (
      number(config.tracking.locationUpdateIntervalSeconds) <= 0
    ) {

      errors.push(
        "Location update interval must be greater than zero."
      );

    }


    if (
      number(config.tracking.maximumLocationFailureMinutes) < 0
    ) {

      errors.push(
        "Maximum location failure time cannot be negative."
      );

    }


    if (
      number(config.capacity.maximumPendingBookings) < 0 ||
      number(config.capacity.maximumDispatchQueue) < 0
    ) {

      errors.push(
        "Capacity limits cannot be negative."
      );

    }


    if (
      number(config.capacity.maximumBookingsPerVendor) < 0 ||
      number(config.capacity.maximumBookingsPerDriver) < 0 ||
      number(config.capacity.maximumBookingsPerVehicle) < 0
    ) {

      errors.push(
        "Entity capacity limits cannot be negative."
      );

    }


    if (
      number(config.support.escalationAfterMinutes) <
      number(config.support.supportResponseMinutes)
    ) {

      errors.push(
        "Support escalation time cannot be less than response time."
      );

    }


    /* =====================================================
       HARD FINANCIAL SAFETY
       ===================================================== */

    if (config.safety.realMoney !== false) {

      errors.push(
        "Real Money must remain BLOCKED."
      );

    }


    if (config.safety.realPayment !== false) {

      errors.push(
        "Real Payment must remain BLOCKED."
      );

    }


    if (config.safety.bankTransfer !== false) {

      errors.push(
        "Bank Transfer must remain BLOCKED."
      );

    }


    if (config.safety.frontendAuthority !== false) {

      errors.push(
        "Frontend financial authority must remain FALSE."
      );

    }


    if (config.safety.backendAuthority !== true) {

      errors.push(
        "Backend authority must remain TRUE."
      );

    }


    return {

      valid: errors.length === 0,

      errors

    };
  }


  /* =========================================================
     PERSISTENCE
     ========================================================= */

  function save(config) {

    const validation =
      validate(config);

    if (!validation.valid) {

      showNotice(
        validation.errors.join(" | "),
        "error"
      );

      return false;
    }


    /*
     * Immutable architecture boundary.
     */

    config.safety.realMoney = false;
    config.safety.realPayment = false;
    config.safety.bankTransfer = false;

    config.safety.frontendAuthority = false;
    config.safety.backendAuthority = true;


    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(config)
      );


      createAuditEvent(
        "26D_OPERATIONS_SAVE",
        "Operations configuration saved locally."
      );


      showNotice(
        "26D Operations configuration saved successfully.",
        "success"
      );


      return true;

    } catch (error) {

      console.error(
        "26D save failed:",
        error
      );


      showNotice(
        "Unable to save 26D configuration.",
        "error"
      );


      return false;
    }
  }


  function reset() {

    try {

      localStorage.removeItem(
        STORAGE_KEY
      );


      createAuditEvent(
        "26D_OPERATIONS_RESET",
        "Operations configuration reset to defaults."
      );


      renderAndBind();


      showNotice(
        "26D reset to default configuration.",
        "success"
      );


      return true;

    } catch (error) {

      console.error(
        "26D reset failed:",
        error
      );

      return false;
    }
  }


  /* =========================================================
     AUDIT
     ========================================================= */

  function createAuditEvent(
    action,
    message
  ) {

    try {

      const key =
        "GOVARA_AUDIT_EVENTS";

      const events =
        JSON.parse(
          localStorage.getItem(key) || "[]"
        );


      events.push({

        id:
          "26D-" + Date.now(),

        timestamp:
          new Date().toISOString(),

        module:
          "26D",

        action,

        message,

        mode:
          "TESTING"

      });


      localStorage.setItem(
        key,
        JSON.stringify(
          events.slice(-200)
        )
      );

    } catch (error) {

      console.warn(
        "26D audit event failed.",
        error
      );
    }
  }


  /* =========================================================
     UI HELPERS
     ========================================================= */

  function toggle(
    label,
    field,
    checked
  ) {

    return `
      <label class="switch-row">

        <span>
          ${escapeHTML(label)}
        </span>

        <input
          type="checkbox"
          data-field="${escapeHTML(field)}"
          ${checked ? "checked" : ""}
        >

      </label>
    `;
  }


  function input(
    label,
    field,
    value
  ) {

    return `
      <label class="field">

        <span>
          ${escapeHTML(label)}
        </span>

        <input
          type="number"
          step="1"
          data-field="${escapeHTML(field)}"
          value="${escapeHTML(value)}"
        >

      </label>
    `;
  }


  function timeInput(
    label,
    field,
    value
  ) {

    return `
      <label class="field">

        <span>
          ${escapeHTML(label)}
        </span>

        <input
          type="time"
          data-field="${escapeHTML(field)}"
          value="${escapeHTML(value)}"
        >

      </label>
    `;
  }


  function section(
    title,
    subtitle,
    body
  ) {

    return `
      <section class="card policy-section">

        <div class="section-title">

          <div>

            <h2>
              ${escapeHTML(title)}
            </h2>

            <div class="muted">
              ${escapeHTML(subtitle)}
            </div>

          </div>

        </div>

        <div class="policy-body">
          ${body}
        </div>

      </section>
    `;
  }


  function stateCard(
    label,
    enabled
  ) {

    return `
      <div class="card inner-card">

        <strong>
          ${escapeHTML(label)}
        </strong>

        <div class="badge ${
          enabled ? "good" : "warn"
        }">

          ${enabled ? "ENABLED" : "DISABLED"}

        </div>

      </div>
    `;
  }


  /* =========================================================
     RENDER
     ========================================================= */

  function render() {

    const c = getConfig();


    return `

      <div class="page-head">

        <div>

          <h1>
            26D — Operations Control
          </h1>

          <div class="muted">

            Complete operational control center for
            platform availability, booking, dispatch,
            duty, driver, vendor, vehicle, tracking,
            capacity, support and incidents.

          </div>

        </div>


        <div class="status-row">

          <span class="badge good">
            OPERATIONS CONTROL READY
          </span>

          <span class="badge warn">
            FRONTEND ONLY
          </span>

          <span class="badge danger">
            REAL MONEY BLOCKED
          </span>

        </div>

      </div>


      <div
        id="module-26D-notice"
        class="notice"
      ></div>


      ${section(
        "Platform Operations",
        "Global operational availability.",
        `

          <div class="grid three">

            ${toggle(
              "Platform Operational",
              "platform.operational",
              c.platform.operational
            )}

            ${toggle(
              "Booking Operations",
              "platform.bookingOperational",
              c.platform.bookingOperational
            )}

            ${toggle(
              "Customer Operations",
              "platform.customerOperations",
              c.platform.customerOperations
            )}

            ${toggle(
              "Vendor Operations",
              "platform.vendorOperations",
              c.platform.vendorOperations
            )}

            ${toggle(
              "Driver Operations",
              "platform.driverOperations",
              c.platform.driverOperations
            )}

            ${toggle(
              "Vehicle Operations",
              "platform.vehicleOperations",
              c.platform.vehicleOperations
            )}

            ${toggle(
              "Support Operations",
              "platform.supportOperations",
              c.platform.supportOperations
            )}

          </div>

        `
      )}


      ${section(
        "Operating Hours",
        "Platform service availability by operating schedule.",
        `

          ${toggle(
            "Operating Hours Control",
            "operatingHours.enabled",
            c.operatingHours.enabled
          )}

          ${toggle(
            "24 × 7 Operations",
            "operatingHours.twentyFourSeven",
            c.operatingHours.twentyFourSeven
          )}


          <div class="grid three">

            ${timeInput(
              "Monday Start",
              "operatingHours.monday.start",
              c.operatingHours.monday.start
            )}

            ${timeInput(
              "Monday End",
              "operatingHours.monday.end",
              c.operatingHours.monday.end
            )}

            ${toggle(
              "Monday",
              "operatingHours.monday.enabled",
              c.operatingHours.monday.enabled
            )}


            ${timeInput(
              "Tuesday Start",
              "operatingHours.tuesday.start",
              c.operatingHours.tuesday.start
            )}

            ${timeInput(
              "Tuesday End",
              "operatingHours.tuesday.end",
              c.operatingHours.tuesday.end
            )}

            ${toggle(
              "Tuesday",
              "operatingHours.tuesday.enabled",
              c.operatingHours.tuesday.enabled
            )}


            ${timeInput(
              "Wednesday Start",
              "operatingHours.wednesday.start",
              c.operatingHours.wednesday.start
            )}

            ${timeInput(
              "Wednesday End",
              "operatingHours.wednesday.end",
              c.operatingHours.wednesday.end
            )}

            ${toggle(
              "Wednesday",
              "operatingHours.wednesday.enabled",
              c.operatingHours.wednesday.enabled
            )}


            ${timeInput(
              "Thursday Start",
              "operatingHours.thursday.start",
              c.operatingHours.thursday.start
            )}

            ${timeInput(
              "Thursday End",
              "operatingHours.thursday.end",
              c.operatingHours.thursday.end
            )}

            ${toggle(
              "Thursday",
              "operatingHours.thursday.enabled",
              c.operatingHours.thursday.enabled
            )}


            ${timeInput(
              "Friday Start",
              "operatingHours.friday.start",
              c.operatingHours.friday.start
            )}

            ${timeInput(
              "Friday End",
              "operatingHours.friday.end",
              c.operatingHours.friday.end
            )}

            ${toggle(
              "Friday",
              "operatingHours.friday.enabled",
              c.operatingHours.friday.enabled
            )}


            ${timeInput(
              "Saturday Start",
              "operatingHours.saturday.start",
              c.operatingHours.saturday.start
            )}

            ${timeInput(
              "Saturday End",
              "operatingHours.saturday.end",
              c.operatingHours.saturday.end
            )}

            ${toggle(
              "Saturday",
              "operatingHours.saturday.enabled",
              c.operatingHours.saturday.enabled
            )}


            ${timeInput(
              "Sunday Start",
              "operatingHours.sunday.start",
              c.operatingHours.sunday.start
            )}

            ${timeInput(
              "Sunday End",
              "operatingHours.sunday.end",
              c.operatingHours.sunday.end
            )}

            ${toggle(
              "Sunday",
              "operatingHours.sunday.enabled",
              c.operatingHours.sunday.enabled
            )}

          </div>

        `
      )}


      ${section(
        "Booking Lifecycle",
        "Complete operational booking status controls.",
        `

          <div class="grid three">

            ${toggle(
              "Booking Intake",
              "booking.intakeEnabled",
              c.booking.intakeEnabled
            )}

            ${toggle(
              "New Booking",
              "booking.newBookingEnabled",
              c.booking.newBookingEnabled
            )}

            ${toggle(
              "Accept Booking",
              "booking.acceptBookingEnabled",
              c.booking.acceptBookingEnabled
            )}

            ${toggle(
              "Reject Booking",
              "booking.rejectBookingEnabled",
              c.booking.rejectBookingEnabled
            )}

            ${toggle(
              "Cancel Booking",
              "booking.cancelBookingEnabled",
              c.booking.cancelBookingEnabled
            )}

            ${toggle(
              "Modification",
              "booking.modificationEnabled",
              c.booking.modificationEnabled
            )}

            ${toggle(
              "Customer Booking",
              "booking.customerBookingAllowed",
              c.booking.customerBookingAllowed
            )}

            ${toggle(
              "Vendor Booking",
              "booking.vendorBookingAllowed",
              c.booking.vendorBookingAllowed
            )}

            ${toggle(
              "Future Booking",
              "booking.futureBookingAllowed",
              c.booking.futureBookingAllowed
            )}

            ${toggle(
              "Same Day Booking",
              "booking.sameDayBookingAllowed",
              c.booking.sameDayBookingAllowed
            )}

            ${toggle(
              "Assignment Required",
              "booking.assignmentRequired",
              c.booking.assignmentRequired
            )}

            ${toggle(
              "Reassignment",
              "booking.reassignmentEnabled",
              c.booking.reassignmentEnabled
            )}

            ${toggle(
              "Unassigned Escalation",
              "booking.unassignedEscalationEnabled",
              c.booking.unassignedEscalationEnabled
            )}

            ${toggle(
              "No-Show Workflow",
              "booking.noShowEnabled",
              c.booking.noShowEnabled
            )}

          </div>


          <h3>
            Booking Timing
          </h3>

          <div class="grid four">

            ${input(
              "Max Pending (minutes)",
              "booking.maxPendingMinutes",
              c.booking.maxPendingMinutes
            )}

            ${input(
              "Max Assignment Attempts",
              "booking.maxAssignmentAttempts",
              c.booking.maxAssignmentAttempts
            )}

            ${input(
              "Max Reassignment Attempts",
              "booking.maxReassignmentAttempts",
              c.booking.maxReassignmentAttempts
            )}

            ${input(
              "Unassigned Escalation (minutes)",
              "booking.unassignedEscalationMinutes",
              c.booking.unassignedEscalationMinutes
            )}

          </div>


          <h3>
            Booking Statuses
          </h3>

          <div class="grid five">

            ${stateCard("NEW", c.booking.statuses.NEW)}
            ${stateCard("PENDING", c.booking.statuses.PENDING)}
            ${stateCard("ASSIGNED", c.booking.statuses.ASSIGNED)}
            ${stateCard("ACCEPTED", c.booking.statuses.ACCEPTED)}
            ${stateCard("REJECTED", c.booking.statuses.REJECTED)}
            ${stateCard("DRIVER ARRIVING", c.booking.statuses.DRIVER_ARRIVING)}
            ${stateCard("TRIP STARTED", c.booking.statuses.TRIP_STARTED)}
            ${stateCard("TRIP COMPLETED", c.booking.statuses.TRIP_COMPLETED)}
            ${stateCard("CANCELLED", c.booking.statuses.CANCELLED)}
            ${stateCard("NO SHOW", c.booking.statuses.NO_SHOW)}

          </div>

          <div class="notice warn">
            Booking status cards are currently configuration indicators.
            Backend enforcement will be connected during API integration.
          </div>

        `
      )}


      ${section(
        "Dispatch Control",
        "Manual, automatic and reassignment controls.",
        `

          <div class="grid three">

            ${toggle(
              "Dispatch Enabled",
              "dispatch.enabled",
              c.dispatch.enabled
            )}

            ${toggle(
              "Manual Dispatch",
              "dispatch.manualDispatchEnabled",
              c.dispatch.manualDispatchEnabled
            )}

            ${toggle(
              "Auto Dispatch",
              "dispatch.autoDispatchEnabled",
              c.dispatch.autoDispatchEnabled
            )}

            ${toggle(
              "Reassignment",
              "dispatch.reassignmentEnabled",
              c.dispatch.reassignmentEnabled
            )}

            ${toggle(
              "Driver Selection",
              "dispatch.driverSelectionEnabled",
              c.dispatch.driverSelectionEnabled
            )}

            ${toggle(
              "Vendor Selection",
              "dispatch.vendorSelectionEnabled",
              c.dispatch.vendorSelectionEnabled
            )}

            ${toggle(
              "Vehicle Selection",
              "dispatch.vehicleSelectionEnabled",
              c.dispatch.vehicleSelectionEnabled
            )}

            ${toggle(
              "Unassigned Queue",
              "dispatch.unassignedQueueEnabled",
              c.dispatch.unassignedQueueEnabled
            )}

            ${toggle(
              "Require Driver Availability",
              "dispatch.requireDriverAvailability",
              c.dispatch.requireDriverAvailability
            )}

            ${toggle(
              "Require Vehicle Availability",
              "dispatch.requireVehicleAvailability",
              c.dispatch.requireVehicleAvailability
            )}

            ${toggle(
              "Block Offline Driver",
              "dispatch.blockOfflineDriver",
              c.dispatch.blockOfflineDriver
            )}

            ${toggle(
              "Block Busy Driver",
              "dispatch.blockBusyDriver",
              c.dispatch.blockBusyDriver
            )}

            ${toggle(
              "Block Unavailable Vehicle",
              "dispatch.blockUnavailableVehicle",
              c.dispatch.blockUnavailableVehicle
            )}

            ${toggle(
              "Dispatch Escalation",
              "dispatch.escalationEnabled",
              c.dispatch.escalationEnabled
            )}

          </div>


          <div class="grid four">

            ${input(
              "Dispatch Timeout (minutes)",
              "dispatch.dispatchTimeoutMinutes",
              c.dispatch.dispatchTimeoutMinutes
            )}

            ${input(
              "Assignment Attempts",
              "dispatch.maxAssignmentAttempts",
              c.dispatch.maxAssignmentAttempts
            )}

            ${input(
              "Reassignment Attempts",
              "dispatch.maxReassignmentAttempts",
              c.dispatch.maxReassignmentAttempts
            )}

            ${input(
              "Escalation After (minutes)",
              "dispatch.escalationMinutes",
              c.dispatch.escalationMinutes
            )}

          </div>

        `
      )}


      ${section(
        "Driver Duty & Lifecycle",
        "Complete duty and driver operational states.",
        `

          <div class="grid three">

            ${toggle(
              "Duty Control",
              "duty.enabled",
              c.duty.enabled
            )}

            ${toggle(
              "Duty Start",
              "duty.dutyStartEnabled",
              c.duty.dutyStartEnabled
            )}

            ${toggle(
              "Duty End",
              "duty.dutyEndEnabled",
              c.duty.dutyEndEnabled
            )}

            ${toggle(
              "Break",
              "duty.breakEnabled",
              c.duty.breakEnabled
            )}

            ${toggle(
              "Unavailable Status",
              "duty.unavailableStatusEnabled",
              c.duty.unavailableStatusEnabled
            )}

            ${toggle(
              "Online Status",
              "duty.onlineStatusEnabled",
              c.duty.onlineStatusEnabled
            )}

            ${toggle(
              "Offline Status",
              "duty.offlineStatusEnabled",
              c.duty.offlineStatusEnabled
            )}

            ${toggle(
              "Trip Start",
              "duty.tripStartEnabled",
              c.duty.tripStartEnabled
            )}

            ${toggle(
              "Trip End",
              "duty.tripEndEnabled",
              c.duty.tripEndEnabled
            )}

            ${toggle(
              "Duty Approval Required",
              "duty.approvalRequired",
              c.duty.approvalRequired
            )}

          </div>


          <div class="grid two">

            ${input(
              "Maximum Duty Duration (hours)",
              "duty.maximumDutyDurationHours",
              c.duty.maximumDutyDurationHours
            )}

            ${input(
              "Minimum Rest (hours)",
              "duty.minimumRestHours",
              c.duty.minimumRestHours
            )}

          </div>


          <h3>
            Driver Operational States
          </h3>

          <div class="grid three">

            ${stateCard("OFFLINE", c.duty.states.OFFLINE)}
            ${stateCard("ONLINE", c.duty.states.ONLINE)}
            ${stateCard("ON DUTY", c.duty.states.ON_DUTY)}
            ${stateCard("BREAK", c.duty.states.BREAK)}
            ${stateCard("ON TRIP", c.duty.states.ON_TRIP)}
            ${stateCard("UNAVAILABLE", c.duty.states.UNAVAILABLE)}

          </div>

        `
      )}


      ${section(
        "Driver Operations",
        "Driver account and trip-operation boundaries.",
        `

          <div class="grid three">

            ${toggle(
              "Driver Management",
              "driver.managementEnabled",
              c.driver.managementEnabled
            )}

            ${toggle(
              "Driver Registration",
              "driver.registrationOperational",
              c.driver.registrationOperational
            )}

            ${toggle(
              "Profile Update",
              "driver.profileUpdateEnabled",
              c.driver.profileUpdateEnabled
            )}

            ${toggle(
              "Booking Acceptance",
              "driver.bookingAcceptanceEnabled",
              c.driver.bookingAcceptanceEnabled
            )}

            ${toggle(
              "Booking Rejection",
              "driver.bookingRejectionEnabled",
              c.driver.bookingRejectionEnabled
            )}

            ${toggle(
              "Duty Management",
              "driver.dutyManagementEnabled",
              c.driver.dutyManagementEnabled
            )}

            ${toggle(
              "Location Sharing",
              "driver.locationSharingEnabled",
              c.driver.locationSharingEnabled
            )}

            ${toggle(
              "Trip Tracking",
              "driver.tripTrackingEnabled",
              c.driver.tripTrackingEnabled
            )}

            ${toggle(
              "Availability Required",
              "driver.driverAvailabilityRequired",
              c.driver.driverAvailabilityRequired
            )}

            ${toggle(
              "Rating Visible",
              "driver.ratingVisibleToDriver",
              c.driver.ratingVisibleToDriver
            )}

            ${toggle(
              "Block Driver When Blocked",
              "driver.blockedDriverCannotReceiveBooking",
              c.driver.blockedDriverCannotReceiveBooking
            )}

            ${toggle(
              "Block Offline Driver",
              "driver.offlineDriverCannotReceiveBooking",
              c.driver.offlineDriverCannotReceiveBooking
            )}

            ${toggle(
              "Block Driver On Trip",
              "driver.onTripDriverCannotReceiveBooking",
              c.driver.onTripDriverCannotReceiveBooking
            )}

          </div>

        `
      )}


      ${section(
        "Vehicle Operations",
        "Vehicle availability, assignment and operational states.",
        `

          <div class="grid three">

            ${toggle(
              "Vehicle Management",
              "vehicle.managementEnabled",
              c.vehicle.managementEnabled
            )}

            ${toggle(
              "Vehicle Registration",
              "vehicle.registrationEnabled",
              c.vehicle.registrationEnabled
            )}

            ${toggle(
              "Vehicle Assignment",
              "vehicle.assignmentEnabled",
              c.vehicle.assignmentEnabled
            )}

            ${toggle(
              "Availability Tracking",
              "vehicle.availabilityTrackingEnabled",
              c.vehicle.availabilityTrackingEnabled
            )}

            ${toggle(
              "Block Inactive Vehicle",
              "vehicle.inactiveVehicleBookingBlocked",
              c.vehicle.inactiveVehicleBookingBlocked
            )}

            ${toggle(
              "Block Maintenance Vehicle",
              "vehicle.maintenanceVehicleBookingBlocked",
              c.vehicle.maintenanceVehicleBookingBlocked
            )}

            ${toggle(
              "Block Blocked Vehicle",
              "vehicle.blockedVehicleBookingBlocked",
              c.vehicle.blockedVehicleBookingBlocked
            )}

            ${toggle(
              "Block Expired Documents",
              "vehicle.expiredDocumentVehicleBlocked",
              c.vehicle.expiredDocumentVehicleBlocked
            )}

          </div>


          <h3>
            Vehicle Operational States
          </h3>

          <div class="grid four">

            ${stateCard("AVAILABLE", c.vehicle.states.AVAILABLE)}
            ${stateCard("ASSIGNED", c.vehicle.states.ASSIGNED)}
            ${stateCard("ON TRIP", c.vehicle.states.ON_TRIP)}
            ${stateCard("OFFLINE", c.vehicle.states.OFFLINE)}
            ${stateCard("MAINTENANCE", c.vehicle.states.MAINTENANCE)}
            ${stateCard("BLOCKED", c.vehicle.states.BLOCKED)}
            ${stateCard("DOCUMENT EXPIRED", c.vehicle.states.DOCUMENT_EXPIRED)}

          </div>

        `
      )}


      ${section(
        "Vendor Operations",
        "Vendor/company operational controls.",
        `

          <div class="grid three">

            ${toggle(
              "Vendor Management",
              "vendor.managementEnabled",
              c.vendor.managementEnabled
            )}

            ${toggle(
              "Booking Management",
              "vendor.bookingManagementEnabled",
              c.vendor.bookingManagementEnabled
            )}

            ${toggle(
              "Driver Management",
              "vendor.driverManagementEnabled",
              c.vendor.driverManagementEnabled
            )}

            ${toggle(
              "Vehicle Management",
              "vendor.vehicleManagementEnabled",
              c.vendor.vehicleManagementEnabled
            )}

            ${toggle(
              "Duty Management",
              "vendor.dutyManagementEnabled",
              c.vendor.dutyManagementEnabled
            )}

            ${toggle(
              "Assignment Management",
              "vendor.assignmentManagementEnabled",
              c.vendor.assignmentManagementEnabled
            )}

            ${toggle(
              "Vendor Can Assign Driver",
              "vendor.vendorCanAssignDriver",
              c.vendor.vendorCanAssignDriver
            )}

            ${toggle(
              "Vendor Can Assign Vehicle",
              "vendor.vendorCanAssignVehicle",
              c.vendor.vendorCanAssignVehicle
            )}

            ${toggle(
              "Block Inactive Vendor",
              "vendor.inactiveVendorCannotReceiveBooking",
              c.vendor.inactiveVendorCannotReceiveBooking
            )}

            ${toggle(
              "Block Vendor",
              "vendor.blockedVendorCannotReceiveBooking",
              c.vendor.blockedVendorCannotReceiveBooking
            )}

            ${toggle(
              "Vendor Approval Required",
              "vendor.approvalRequired",
              c.vendor.approvalRequired
            )}

          </div>

        `
      )}


      ${section(
        "Vendor ↔ Vehicle ↔ Driver Assignment",
        "Operational relationship and assignment boundaries.",
        `

          <div class="grid three">

            ${toggle(
              "Relationship Control",
              "assignment.relationshipControlEnabled",
              c.assignment.relationshipControlEnabled
            )}

            ${toggle(
              "Vendor → Driver",
              "assignment.vendorDriverAssignment",
              c.assignment.vendorDriverAssignment
            )}

            ${toggle(
              "Vendor → Vehicle",
              "assignment.vendorVehicleAssignment",
              c.assignment.vendorVehicleAssignment
            )}

            ${toggle(
              "Driver → Vehicle",
              "assignment.driverVehicleAssignment",
              c.assignment.driverVehicleAssignment
            )}

            ${toggle(
              "Vehicle Requires Vendor",
              "assignment.requireVendorForVendorVehicle",
              c.assignment.requireVendorForVendorVehicle
            )}

            ${toggle(
              "Trip Requires Driver",
              "assignment.requireDriverForTrip",
              c.assignment.requireDriverForTrip
            )}

            ${toggle(
              "Trip Requires Vehicle",
              "assignment.requireVehicleForTrip",
              c.assignment.requireVehicleForTrip
            )}

            ${toggle(
              "Prevent Cross-Vendor Assignment",
              "assignment.preventCrossVendorAssignment",
              c.assignment.preventCrossVendorAssignment
            )}

            ${toggle(
              "Assignment History",
              "assignment.assignmentHistoryEnabled",
              c.assignment.assignmentHistoryEnabled
            )}

          </div>


          <div class="notice info">

            Operational relationship:

            <strong>
              Vendor → Vehicle → Driver → Duty → Booking
            </strong>

          </div>

        `
      )}


      ${section(
        "Location & Tracking",
        "Location-sharing and trip-tracking controls.",
        `

          <div class="grid three">

            ${toggle(
              "Location Tracking",
              "tracking.locationTrackingEnabled",
              c.tracking.locationTrackingEnabled
            )}

            ${toggle(
              "Driver Location",
              "tracking.driverLocationEnabled",
              c.tracking.driverLocationEnabled
            )}

            ${toggle(
              "Vehicle Location",
              "tracking.vehicleLocationEnabled",
              c.tracking.vehicleLocationEnabled
            )}

            ${toggle(
              "Tracking During Duty",
              "tracking.trackingDuringDuty",
              c.tracking.trackingDuringDuty
            )}

            ${toggle(
              "Tracking During Trip",
              "tracking.trackingDuringTrip",
              c.tracking.trackingDuringTrip
            )}

            ${toggle(
              "Tracking Failure Handling",
              "tracking.trackingFailureHandlingEnabled",
              c.tracking.trackingFailureHandlingEnabled
            )}

            ${toggle(
              "Notify Tracking Failure",
              "tracking.notifyOnTrackingFailure",
              c.tracking.notifyOnTrackingFailure
            )}

          </div>


          <div class="grid two">

            ${input(
              "Location Update Interval (seconds)",
              "tracking.locationUpdateIntervalSeconds",
              c.tracking.locationUpdateIntervalSeconds
            )}

            ${input(
              "Maximum Tracking Failure (minutes)",
              "tracking.maximumLocationFailureMinutes",
              c.tracking.maximumLocationFailureMinutes
            )}

          </div>

        `
      )}


      ${section(
        "Capacity Control",
        "Booking, dispatch, vendor, driver and vehicle capacity limits.",
        `

          <div class="grid three">

            ${toggle(
              "Capacity Control",
              "capacity.capacityControlEnabled",
              c.capacity.capacityControlEnabled
            )}

            ${toggle(
              "Booking Intake Limit",
              "capacity.bookingIntakeLimitEnabled",
              c.capacity.bookingIntakeLimitEnabled
            )}

            ${toggle(
              "Dispatch Capacity",
              "capacity.dispatchCapacityEnabled",
              c.capacity.dispatchCapacityEnabled
            )}

            ${toggle(
              "Vendor Capacity",
              "capacity.vendorCapacityEnabled",
              c.capacity.vendorCapacityEnabled
            )}

            ${toggle(
              "Driver Capacity",
              "capacity.driverCapacityEnabled",
              c.capacity.driverCapacityEnabled
            )}

            ${toggle(
              "Vehicle Capacity",
              "capacity.vehicleCapacityEnabled",
              c.capacity.vehicleCapacityEnabled
            )}

            ${toggle(
              "Reject At Capacity",
              "capacity.rejectWhenCapacityReached",
              c.capacity.rejectWhenCapacityReached
            )}

            ${toggle(
              "Queue At Capacity",
              "capacity.queueWhenCapacityReached",
              c.capacity.queueWhenCapacityReached
            )}

          </div>


          <div class="grid five">

            ${input(
              "Max Pending Bookings",
              "capacity.maximumPendingBookings",
              c.capacity.maximumPendingBookings
            )}

            ${input(
              "Max Dispatch Queue",
              "capacity.maximumDispatchQueue",
              c.capacity.maximumDispatchQueue
            )}

            ${input(
              "Max / Vendor",
              "capacity.maximumBookingsPerVendor",
              c.capacity.maximumBookingsPerVendor
            )}

            ${input(
              "Max / Driver",
              "capacity.maximumBookingsPerDriver",
              c.capacity.maximumBookingsPerDriver
            )}

            ${input(
              "Max / Vehicle",
              "capacity.maximumBookingsPerVehicle",
              c.capacity.maximumBookingsPerVehicle
            )}

          </div>

        `
      )}


      ${section(
        "Customer Support & Escalation",
        "Support, complaint and escalation workflow.",
        `

          <div class="grid three">

            ${toggle(
              "Support",
              "support.enabled",
              c.support.enabled
            )}

            ${toggle(
              "Customer Support",
              "support.customerSupportEnabled",
              c.support.customerSupportEnabled
            )}

            ${toggle(
              "Complaint Handling",
              "support.complaintHandlingEnabled",
              c.support.complaintHandlingEnabled
            )}

            ${toggle(
              "Ticket Creation",
              "support.ticketCreationEnabled",
              c.support.ticketCreationEnabled
            )}

            ${toggle(
              "Ticket Assignment",
              "support.ticketAssignmentEnabled",
              c.support.ticketAssignmentEnabled
            )}

            ${toggle(
              "Escalation",
              "support.escalationEnabled",
              c.support.escalationEnabled
            )}

            ${toggle(
              "Emergency Support",
              "support.emergencySupportEnabled",
              c.support.emergencySupportEnabled
            )}

          </div>


          <div class="grid two">

            ${input(
              "Support Response (minutes)",
              "support.supportResponseMinutes",
              c.support.supportResponseMinutes
            )}

            ${input(
              "Escalation After (minutes)",
              "support.escalationAfterMinutes",
              c.support.escalationAfterMinutes
            )}

          </div>


          <h3>
            Complaint Categories
          </h3>

          <div class="grid four">

            ${toggle(
              "Booking",
              "support.complaintCategories.BOOKING",
              c.support.complaintCategories.BOOKING
            )}

            ${toggle(
              "Driver",
              "support.complaintCategories.DRIVER",
              c.support.complaintCategories.DRIVER
            )}

            ${toggle(
              "Vehicle",
              "support.complaintCategories.VEHICLE",
              c.support.complaintCategories.VEHICLE
            )}

            ${toggle(
              "Vendor",
              "support.complaintCategories.VENDOR",
              c.support.complaintCategories.VENDOR
            )}

            ${toggle(
              "Fare",
              "support.complaintCategories.FARE",
              c.support.complaintCategories.FARE
            )}

            ${toggle(
              "Payment",
              "support.complaintCategories.PAYMENT",
              c.support.complaintCategories.PAYMENT
            )}

            ${toggle(
              "Document",
              "support.complaintCategories.DOCUMENT",
              c.support.complaintCategories.DOCUMENT
            )}

            ${toggle(
              "Other",
              "support.complaintCategories.OTHER",
              c.support.complaintCategories.OTHER
            )}

          </div>

        `
      )}


      ${section(
        "Incident & Emergency Control",
        "Incident management and emergency response controls.",
        `

          <div class="grid three">

            ${toggle(
              "Incident Management",
              "incident.incidentManagementEnabled",
              c.incident.incidentManagementEnabled
            )}

            ${toggle(
              "Emergency Mode",
              "incident.emergencyMode",
              c.incident.emergencyMode
            )}

            ${toggle(
              "Emergency Booking Freeze",
              "incident.emergencyBookingFreeze",
              c.incident.emergencyBookingFreeze
            )}

            ${toggle(
              "Emergency Dispatch Freeze",
              "incident.emergencyDispatchFreeze",
              c.incident.emergencyDispatchFreeze
            )}

            ${toggle(
              "Emergency Driver Freeze",
              "incident.emergencyDriverFreeze",
              c.incident.emergencyDriverFreeze
            )}

            ${toggle(
              "Emergency Vendor Freeze",
              "incident.emergencyVendorFreeze",
              c.incident.emergencyVendorFreeze
            )}

            ${toggle(
              "Incident Creation",
              "incident.incidentCreationEnabled",
              c.incident.incidentCreationEnabled
            )}

            ${toggle(
              "Incident Escalation",
              "incident.incidentEscalationEnabled",
              c.incident.incidentEscalationEnabled
            )}

            ${toggle(
              "Emergency Notifications",
              "incident.emergencyNotificationEnabled",
              c.incident.emergencyNotificationEnabled
            )}

          </div>


          <h3>
            Incident Types
          </h3>

          <div class="grid four">

            ${toggle(
              "Accident",
              "incident.incidentTypes.ACCIDENT",
              c.incident.incidentTypes.ACCIDENT
            )}

            ${toggle(
              "Driver Issue",
              "incident.incidentTypes.DRIVER_ISSUE",
              c.incident.incidentTypes.DRIVER_ISSUE
            )}

            ${toggle(
              "Vehicle Issue",
              "incident.incidentTypes.VEHICLE_ISSUE",
              c.incident.incidentTypes.VEHICLE_ISSUE
            )}

            ${toggle(
              "Customer Issue",
              "incident.incidentTypes.CUSTOMER_ISSUE",
              c.incident.incidentTypes.CUSTOMER_ISSUE
            )}

            ${toggle(
              "Service Failure",
              "incident.incidentTypes.SERVICE_FAILURE",
              c.incident.incidentTypes.SERVICE_FAILURE
            )}

            ${toggle(
              "Safety",
              "incident.incidentTypes.SAFETY",
              c.incident.incidentTypes.SAFETY
            )}

            ${toggle(
              "System",
              "incident.incidentTypes.SYSTEM",
              c.incident.incidentTypes.SYSTEM
            )}

            ${toggle(
              "Other",
              "incident.incidentTypes.OTHER",
              c.incident.incidentTypes.OTHER
            )}

          </div>

        `
      )}


      ${section(
        "Operational Notifications",
        "Events that may generate operational notifications.",
        `

          <div class="grid three">

            ${toggle(
              "Booking Created",
              "notifications.bookingCreated",
              c.notifications.bookingCreated
            )}

            ${toggle(
              "Booking Assigned",
              "notifications.bookingAssigned",
              c.notifications.bookingAssigned
            )}

            ${toggle(
              "Booking Accepted",
              "notifications.bookingAccepted",
              c.notifications.bookingAccepted
            )}

            ${toggle(
              "Booking Rejected",
              "notifications.bookingRejected",
              c.notifications.bookingRejected
            )}

            ${toggle(
              "Driver Arriving",
              "notifications.driverArriving",
              c.notifications.driverArriving
            )}

            ${toggle(
              "Trip Started",
              "notifications.tripStarted",
              c.notifications.tripStarted
            )}

            ${toggle(
              "Trip Completed",
              "notifications.tripCompleted",
              c.notifications.tripCompleted
            )}

            ${toggle(
              "Booking Cancelled",
              "notifications.bookingCancelled",
              c.notifications.bookingCancelled
            )}

            ${toggle(
              "No Show",
              "notifications.bookingNoShow",
              c.notifications.bookingNoShow
            )}

            ${toggle(
              "Driver Duty Change",
              "notifications.driverDutyChange",
              c.notifications.driverDutyChange
            )}

            ${toggle(
              "Vehicle Assignment",
              "notifications.vehicleAssignment",
              c.notifications.vehicleAssignment
            )}

            ${toggle(
              "Dispatch Timeout",
              "notifications.dispatchTimeout",
              c.notifications.dispatchTimeout
            )}

            ${toggle(
              "Unassigned Escalation",
              "notifications.unassignedEscalation",
              c.notifications.unassignedEscalation
            )}

            ${toggle(
              "Support Update",
              "notifications.supportUpdate",
              c.notifications.supportUpdate
            )}

            ${toggle(
              "Escalation Alert",
              "notifications.escalationAlert",
              c.notifications.escalationAlert
            )}

            ${toggle(
              "Incident Alert",
              "notifications.incidentAlert",
              c.notifications.incidentAlert
            )}

            ${toggle(
              "Emergency Alert",
              "notifications.emergencyAlert",
              c.notifications.emergencyAlert
            )}

            ${toggle(
              "Tracking Failure",
              "notifications.trackingFailure",
              c.notifications.trackingFailure
            )}

          </div>

        `
      )}


      ${section(
        "Global Operational Safety",
        "High-impact operational freeze controls.",
        `

          <div class="grid three">

            ${toggle(
              "Global Booking Freeze",
              "safety.globalBookingFreeze",
              c.safety.globalBookingFreeze
            )}

            ${toggle(
              "Global Dispatch Freeze",
              "safety.globalDispatchFreeze",
              c.safety.globalDispatchFreeze
            )}

            ${toggle(
              "Customer Booking Freeze",
              "safety.customerBookingFreeze",
              c.safety.customerBookingFreeze
            )}

            ${toggle(
              "Vendor Booking Freeze",
              "safety.vendorBookingFreeze",
              c.safety.vendorBookingFreeze
            )}

            ${toggle(
              "Driver Dispatch Freeze",
              "safety.driverDispatchFreeze",
              c.safety.driverDispatchFreeze
            )}

            ${toggle(
              "Maintenance Mode",
              "safety.maintenanceMode",
              c.safety.maintenanceMode
            )}

            ${toggle(
              "Emergency Mode",
              "safety.emergencyMode",
              c.safety.emergencyMode
            )}

          </div>


          <div class="notice warn">

            These controls currently represent frontend
            configuration only. Actual operational enforcement
            will be performed by the authoritative backend
            after API integration.

          </div>

        `
      )}


      ${section(
        "Financial Safety Boundary",
        "Locked architectural safeguards.",
        `

          <div class="grid five">

            <div class="card inner-card">
              <strong>Real Money</strong>
              <div class="badge danger">
                BLOCKED
              </div>
            </div>

            <div class="card inner-card">
              <strong>Real Payment</strong>
              <div class="badge danger">
                BLOCKED
              </div>
            </div>

            <div class="card inner-card">
              <strong>Bank Transfer</strong>
              <div class="badge danger">
                BLOCKED
              </div>
            </div>

            <div class="card inner-card">
              <strong>Frontend Authority</strong>
              <div class="badge danger">
                FALSE
              </div>
            </div>

            <div class="card inner-card">
              <strong>Backend Authority</strong>
              <div class="badge good">
                TRUE
              </div>
            </div>

          </div>

        `
      )}


      <section class="card">

        <div class="section-title">

          <div>

            <h2>
              Operations Actions
            </h2>

            <div class="muted">

              Save, reload, reset and validate the
              complete 26D frontend configuration.

            </div>

          </div>

        </div>


        <div class="button-row">

          <button
            id="btn-26D-save"
            class="primary"
          >
            Save Operations
          </button>

          <button
            id="btn-26D-reload"
          >
            Reload
          </button>

          <button
            id="btn-26D-reset"
            class="danger-btn"
          >
            Reset Defaults
          </button>

          <button
            id="btn-26D-validate"
          >
            Validate Configuration
          </button>

        </div>

      </section>

    `;
  }


  /* =========================================================
     COLLECT FORM DATA
     ========================================================= */

  function setPath(
    object,
    path,
    value
  ) {

    const parts =
      path.split(".");

    let current =
      object;


    for (
      let i = 0;
      i < parts.length - 1;
      i++
    ) {

      if (
        !current[parts[i]] ||
        typeof current[parts[i]] !== "object"
      ) {

        current[parts[i]] = {};

      }

      current =
        current[parts[i]];
    }


    current[
      parts[parts.length - 1]
    ] = value;
  }


  function collectConfig() {

    const config =
      getConfig();


    const mount =
      document.getElementById(
        "module-26D"
      );


    if (!mount) {
      return config;
    }


    mount
      .querySelectorAll("[data-field]")
      .forEach(function (element) {

        const field =
          element.getAttribute(
            "data-field"
          );


        let value;


        if (
          element.type === "checkbox"
        ) {

          value =
            element.checked;

        } else if (
          element.type === "number"
        ) {

          value =
            number(
              element.value,
              0
            );

        } else {

          value =
            element.value;

        }


        setPath(
          config,
          field,
          value
        );

      });


    /*
     * Financial safety cannot be changed
     * through the frontend.
     */

    config.safety.realMoney = false;
    config.safety.realPayment = false;
    config.safety.bankTransfer = false;

    config.safety.frontendAuthority = false;
    config.safety.backendAuthority = true;


    return config;
  }


  /* =========================================================
     NOTICE
     ========================================================= */

  function showNotice(
    message,
    type
  ) {

    const element =
      document.getElementById(
        "module-26D-notice"
      );


    if (!element) {
      return;
    }


    element.className =
      "notice " + (
        type || "info"
      );


    element.textContent =
      message;


    window.setTimeout(
      function () {

        element.textContent =
          "";

        element.className =
          "notice";

      },
      4500
    );
  }


  /* =========================================================
     BIND
     ========================================================= */

  function bind() {

    const saveButton =
      document.getElementById(
        "btn-26D-save"
      );

    const reloadButton =
      document.getElementById(
        "btn-26D-reload"
      );

    const resetButton =
      document.getElementById(
        "btn-26D-reset"
      );

    const validateButton =
      document.getElementById(
        "btn-26D-validate"
      );


    if (saveButton) {

      saveButton.addEventListener(
        "click",
        function () {

          save(
            collectConfig()
          );

        }
      );

    }


    if (reloadButton) {

      reloadButton.addEventListener(
        "click",
        function () {

          renderAndBind();

          showNotice(
            "26D configuration reloaded.",
            "info"
          );

        }
      );

    }


    if (resetButton) {

      resetButton.addEventListener(
        "click",
        function () {

          const confirmed =
            window.confirm(
              "Reset the complete 26D Operations configuration to defaults?"
            );


          if (confirmed) {
            reset();
          }

        }
      );

    }


    if (validateButton) {

      validateButton.addEventListener(
        "click",
        function () {

          const result =
            validate(
              collectConfig()
            );


          if (result.valid) {

            showNotice(
              "26D configuration is valid.",
              "success"
            );

          } else {

            showNotice(
              result.errors.join(" | "),
              "error"
            );

          }

        }
      );

    }

  }


  /* =========================================================
     ROUTER
     ========================================================= */

  function renderAndBind() {

    const mount =
      document.getElementById(
        "module-26D"
      );


    if (!mount) {

      console.warn(
        "26D mount #module-26D was not found."
      );

      return false;
    }


    mount.innerHTML =
      render();


    bind();


    return true;
  }


  /* =========================================================
     PUBLIC API
     ========================================================= */

  return {

    render,
    bind,
    renderAndBind,

    getConfig,
    save,
    reset,
    validate,

    collectConfig,
    createAuditEvent,

    STORAGE_KEY,
    DEFAULT_CONFIG

  };

})();
