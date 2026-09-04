/* =========================================================
   GoVara — 26D Operations Control
   Frontend-only Operations Administration
   Version: 26D-V1
   ========================================================= */

window.GoVara26D = (function () {

  "use strict";

  const STORAGE_KEY = "GOVARA_OPERATIONS_CONTROL_26D_V1";

  const DEFAULT_CONFIG = {

    version: "26D-V1",

    operations: {
      platformOperational: true,
      bookingOperational: true,
      customerServiceOperational: true,
      vendorOperationsOperational: true,
      driverOperationsOperational: true,

      autoAssignmentEnabled: false,
      manualAssignmentAllowed: true,

      dutyTrackingEnabled: true,
      vehicleTrackingEnabled: true,
      locationTrackingEnabled: false
    },

    booking: {
      newBookingEnabled: true,
      acceptBookingEnabled: true,
      rejectBookingEnabled: true,
      cancelBookingEnabled: true,
      modifyBookingEnabled: true,

      assignmentRequired: true,
      autoAssignment: false,

      maxPendingMinutes: 15,
      maxAssignmentAttempts: 3
    },

    driver: {
      dutyEnabled: true,
      onlineStatusEnabled: true,
      offlineStatusEnabled: true,

      tripStartAllowed: true,
      tripEndAllowed: true,

      locationSharingEnabled: false
    },

    vendor: {
      vendorOperationsEnabled: true,
      bookingManagementEnabled: true,
      vehicleManagementEnabled: true,
      driverManagementEnabled: true,
      dutyManagementEnabled: true
    },

    vehicle: {
      vehicleManagementEnabled: true,
      vehicleAssignmentEnabled: true,
      vehicleAvailabilityTracking: true,

      inactiveVehicleBookingBlocked: true,
      expiredDocumentVehicleBlocked: true
    },

    service: {
      customerSupportEnabled: true,
      complaintHandlingEnabled: true,
      escalationEnabled: true,

      emergencyWorkflowEnabled: false,

      supportResponseMinutes: 30,
      escalationAfterMinutes: 60
    },

    notifications: {
      bookingCreated: true,
      bookingAssigned: true,
      bookingStarted: true,
      bookingCompleted: true,
      bookingCancelled: true,

      driverDutyChange: true,
      vehicleAssignment: true,
      supportUpdate: true,
      escalationAlert: true
    },

    safety: {
      emergencyMode: false,
      globalBookingFreeze: false,
      driverDispatchFreeze: false,
      vendorDispatchFreeze: false,

      realMoney: false,
      realPayment: false,
      bankTransfer: false,
      frontendAuthority: false,
      backendAuthority: true
    }
  };


  /* =========================================================
     Helpers
     ========================================================= */

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }


  function number(value, fallback) {

    const n = Number(value);

    return Number.isFinite(n)
      ? n
      : (fallback || 0);
  }


  function escapeHTML(value) {

    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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

        mergeDeep(target[key], source[key]);

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
        "26D: Unable to load saved configuration.",
        error
      );

      return clone(DEFAULT_CONFIG);
    }
  }


  /* =========================================================
     Validation
     ========================================================= */

  function validate(config) {

    const errors = [];

    if (number(config.booking.maxPendingMinutes) < 0) {
      errors.push(
        "Maximum pending booking time cannot be negative."
      );
    }

    if (number(config.booking.maxAssignmentAttempts) < 1) {
      errors.push(
        "Assignment attempts must be at least 1."
      );
    }

    if (number(config.service.supportResponseMinutes) < 0) {
      errors.push(
        "Support response time cannot be negative."
      );
    }

    if (number(config.service.escalationAfterMinutes) < 0) {
      errors.push(
        "Escalation time cannot be negative."
      );
    }

    if (
      number(config.service.escalationAfterMinutes) <
      number(config.service.supportResponseMinutes)
    ) {

      errors.push(
        "Escalation time cannot be less than support response time."
      );
    }


    /* Hard financial boundary */

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
        "Frontend authority must remain disabled."
      );
    }

    if (config.safety.backendAuthority !== true) {
      errors.push(
        "Backend must remain authoritative."
      );
    }


    return {
      valid: errors.length === 0,
      errors
    };
  }


  /* =========================================================
     Persistence
     ========================================================= */

  function save(config) {

    const result = validate(config);

    if (!result.valid) {

      showNotice(
        result.errors.join(" | "),
        "error"
      );

      return false;
    }


    /*
     * Immutable safety boundary.
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
        "Operations configuration saved successfully.",
        "success"
      );

      return true;

    } catch (error) {

      console.error(
        "26D save error:",
        error
      );

      showNotice(
        "Unable to save operations configuration.",
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
        "Operations configuration reset to defaults.",
        "success"
      );

      return true;

    } catch (error) {

      console.error(
        "26D reset error:",
        error
      );

      return false;
    }
  }


  /* =========================================================
     Audit
     ========================================================= */

  function createAuditEvent(action, message) {

    try {

      const key =
        "GOVARA_AUDIT_EVENTS";

      const events =
        JSON.parse(
          localStorage.getItem(key) || "[]"
        );

      events.push({

        id: "26D-" + Date.now(),

        timestamp:
          new Date().toISOString(),

        module: "26D",

        action,

        message,

        mode: "TESTING"

      });

      localStorage.setItem(
        key,
        JSON.stringify(events.slice(-200))
      );

    } catch (error) {

      console.warn(
        "26D audit event failed.",
        error
      );
    }
  }


  /* =========================================================
     UI
     ========================================================= */

  function toggle(label, field, checked) {

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


  function input(label, field, value) {

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


  function section(title, subtitle, body) {

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


  /* =========================================================
     Render
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
            Central operational controls for booking,
            dispatch, duty, vehicles, vendors, support
            and operational safety.
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
        "Global operational availability controls.",
        `

          <div class="grid three">

            ${toggle(
              "Platform Operational",
              "operations.platformOperational",
              c.operations.platformOperational
            )}

            ${toggle(
              "Booking Operational",
              "operations.bookingOperational",
              c.operations.bookingOperational
            )}

            ${toggle(
              "Customer Service Operational",
              "operations.customerServiceOperational",
              c.operations.customerServiceOperational
            )}

            ${toggle(
              "Vendor Operations",
              "operations.vendorOperationsOperational",
              c.operations.vendorOperationsOperational
            )}

            ${toggle(
              "Driver Operations",
              "operations.driverOperationsOperational",
              c.operations.driverOperationsOperational
            )}

            ${toggle(
              "Auto Assignment",
              "operations.autoAssignmentEnabled",
              c.operations.autoAssignmentEnabled
            )}

            ${toggle(
              "Manual Assignment",
              "operations.manualAssignmentAllowed",
              c.operations.manualAssignmentAllowed
            )}

            ${toggle(
              "Duty Tracking",
              "operations.dutyTrackingEnabled",
              c.operations.dutyTrackingEnabled
            )}

            ${toggle(
              "Vehicle Tracking",
              "operations.vehicleTrackingEnabled",
              c.operations.vehicleTrackingEnabled
            )}

            ${toggle(
              "Location Tracking",
              "operations.locationTrackingEnabled",
              c.operations.locationTrackingEnabled
            )}

          </div>

        `
      )}


      ${section(
        "Booking Operations",
        "Operational controls for the booking lifecycle.",
        `

          <div class="grid three">

            <div>

              <h3>
                Booking Lifecycle
              </h3>

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
                "Modify Booking",
                "booking.modifyBookingEnabled",
                c.booking.modifyBookingEnabled
              )}

            </div>


            <div>

              <h3>
                Assignment
              </h3>

              ${toggle(
                "Assignment Required",
                "booking.assignmentRequired",
                c.booking.assignmentRequired
              )}

              ${toggle(
                "Auto Assignment",
                "booking.autoAssignment",
                c.booking.autoAssignment
              )}

              ${input(
                "Max Pending Time (minutes)",
                "booking.maxPendingMinutes",
                c.booking.maxPendingMinutes
              )}

              ${input(
                "Max Assignment Attempts",
                "booking.maxAssignmentAttempts",
                c.booking.maxAssignmentAttempts
              )}

            </div>

          </div>

        `
      )}


      ${section(
        "Driver Operations",
        "Driver duty, trip and operational status controls.",
        `

          <div class="grid three">

            ${toggle(
              "Duty Management",
              "driver.dutyEnabled",
              c.driver.dutyEnabled
            )}

            ${toggle(
              "Online Status",
              "driver.onlineStatusEnabled",
              c.driver.onlineStatusEnabled
            )}

            ${toggle(
              "Offline Status",
              "driver.offlineStatusEnabled",
              c.driver.offlineStatusEnabled
            )}

            ${toggle(
              "Trip Start",
              "driver.tripStartAllowed",
              c.driver.tripStartAllowed
            )}

            ${toggle(
              "Trip End",
              "driver.tripEndAllowed",
              c.driver.tripEndAllowed
            )}

            ${toggle(
              "Location Sharing",
              "driver.locationSharingEnabled",
              c.driver.locationSharingEnabled
            )}

          </div>

        `
      )}


      ${section(
        "Vendor Operations",
        "Operational controls for vendor/company management.",
        `

          <div class="grid three">

            ${toggle(
              "Vendor Operations",
              "vendor.vendorOperationsEnabled",
              c.vendor.vendorOperationsEnabled
            )}

            ${toggle(
              "Booking Management",
              "vendor.bookingManagementEnabled",
              c.vendor.bookingManagementEnabled
            )}

            ${toggle(
              "Vehicle Management",
              "vendor.vehicleManagementEnabled",
              c.vendor.vehicleManagementEnabled
            )}

            ${toggle(
              "Driver Management",
              "vendor.driverManagementEnabled",
              c.vendor.driverManagementEnabled
            )}

            ${toggle(
              "Duty Management",
              "vendor.dutyManagementEnabled",
              c.vendor.dutyManagementEnabled
            )}

          </div>

        `
      )}


      ${section(
        "Vehicle Operations",
        "Vehicle availability, assignment and safety controls.",
        `

          <div class="grid three">

            ${toggle(
              "Vehicle Management",
              "vehicle.vehicleManagementEnabled",
              c.vehicle.vehicleManagementEnabled
            )}

            ${toggle(
              "Vehicle Assignment",
              "vehicle.vehicleAssignmentEnabled",
              c.vehicle.vehicleAssignmentEnabled
            )}

            ${toggle(
              "Availability Tracking",
              "vehicle.vehicleAvailabilityTracking",
              c.vehicle.vehicleAvailabilityTracking
            )}

            ${toggle(
              "Block Inactive Vehicles",
              "vehicle.inactiveVehicleBookingBlocked",
              c.vehicle.inactiveVehicleBookingBlocked
            )}

            ${toggle(
              "Block Expired Documents",
              "vehicle.expiredDocumentVehicleBlocked",
              c.vehicle.expiredDocumentVehicleBlocked
            )}

          </div>

        `
      )}


      ${section(
        "Customer Service & Escalation",
        "Support and escalation workflow controls.",
        `

          <div class="grid three">

            <div>

              <h3>
                Support
              </h3>

              ${toggle(
                "Customer Support",
                "service.customerSupportEnabled",
                c.service.customerSupportEnabled
              )}

              ${toggle(
                "Complaint Handling",
                "service.complaintHandlingEnabled",
                c.service.complaintHandlingEnabled
              )}

              ${toggle(
                "Escalation",
                "service.escalationEnabled",
                c.service.escalationEnabled
              )}

              ${toggle(
                "Emergency Workflow",
                "service.emergencyWorkflowEnabled",
                c.service.emergencyWorkflowEnabled
              )}

            </div>


            <div>

              <h3>
                Response Targets
              </h3>

              ${input(
                "Support Response (minutes)",
                "service.supportResponseMinutes",
                c.service.supportResponseMinutes
              )}

              ${input(
                "Escalation After (minutes)",
                "service.escalationAfterMinutes",
                c.service.escalationAfterMinutes
              )}

            </div>

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
              "Booking Started",
              "notifications.bookingStarted",
              c.notifications.bookingStarted
            )}

            ${toggle(
              "Booking Completed",
              "notifications.bookingCompleted",
              c.notifications.bookingCompleted
            )}

            ${toggle(
              "Booking Cancelled",
              "notifications.bookingCancelled",
              c.notifications.bookingCancelled
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
              "Support Update",
              "notifications.supportUpdate",
              c.notifications.supportUpdate
            )}

            ${toggle(
              "Escalation Alert",
              "notifications.escalationAlert",
              c.notifications.escalationAlert
            )}

          </div>

        `
      )}


      ${section(
        "Operational Safety Controls",
        "Emergency and dispatch freeze controls.",
        `

          <div class="grid four">

            ${toggle(
              "Emergency Mode",
              "safety.emergencyMode",
              c.safety.emergencyMode
            )}

            ${toggle(
              "Global Booking Freeze",
              "safety.globalBookingFreeze",
              c.safety.globalBookingFreeze
            )}

            ${toggle(
              "Driver Dispatch Freeze",
              "safety.driverDispatchFreeze",
              c.safety.driverDispatchFreeze
            )}

            ${toggle(
              "Vendor Dispatch Freeze",
              "safety.vendorDispatchFreeze",
              c.safety.vendorDispatchFreeze
            )}

          </div>

          <div class="notice warn">

            These operational safety switches only represent
            frontend configuration at this stage.
            Backend enforcement will be connected later.

          </div>

        `
      )}


      ${section(
        "Financial Safety Boundary",
        "These controls are locked by the platform architecture.",
        `

          <div class="grid five">

            <div class="card inner-card">
              <strong>Real Money</strong>
              <div class="badge danger">BLOCKED</div>
            </div>

            <div class="card inner-card">
              <strong>Real Payment</strong>
              <div class="badge danger">BLOCKED</div>
            </div>

            <div class="card inner-card">
              <strong>Bank Transfer</strong>
              <div class="badge danger">BLOCKED</div>
            </div>

            <div class="card inner-card">
              <strong>Frontend Authority</strong>
              <div class="badge danger">FALSE</div>
            </div>

            <div class="card inner-card">
              <strong>Backend Authority</strong>
              <div class="badge good">TRUE</div>
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
              frontend operations configuration.
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
     Field handling
     ========================================================= */

  function setPath(obj, path, value) {

    const parts = path.split(".");

    let current = obj;

    for (
      let i = 0;
      i < parts.length - 1;
      i++
    ) {

      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }

      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
  }


  function collectConfig() {

    const config = getConfig();

    const mount =
      document.getElementById("module-26D");

    if (!mount) {
      return config;
    }


    mount
      .querySelectorAll("[data-field]")
      .forEach(function (el) {

        const field =
          el.getAttribute("data-field");

        let value;


        if (el.type === "checkbox") {

          value = el.checked;

        } else if (el.type === "number") {

          value = number(el.value, 0);

        } else {

          value = el.value;

        }


        setPath(
          config,
          field,
          value
        );

      });


    /*
     * Immutable financial safety boundary.
     */

    config.safety.realMoney = false;
    config.safety.realPayment = false;
    config.safety.bankTransfer = false;
    config.safety.frontendAuthority = false;
    config.safety.backendAuthority = true;


    return config;
  }


  /* =========================================================
     Notice
     ========================================================= */

  function showNotice(message, type) {

    const el =
      document.getElementById(
        "module-26D-notice"
      );

    if (!el) {
      return;
    }

    el.className =
      "notice " + (type || "info");

    el.textContent = message;


    window.setTimeout(function () {

      el.textContent = "";
      el.className = "notice";

    }, 4000);
  }


  /* =========================================================
     Bind
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
            "Operations configuration reloaded.",
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
              "Reset all 26D Operations settings to default values?"
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
     Router integration
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
     Public API
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
