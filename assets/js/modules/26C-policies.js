/* =========================================================
   GoVara — 26C Business Policies
   Frontend-only Policy Control Center
   Version: 26C-V1
   ========================================================= */

window.GoVara26C = (function () {

  "use strict";

  const STORAGE_KEY = "GOVARA_BUSINESS_POLICIES_26C_V1";

  const DEFAULT_CONFIG = {
    version: "26C-V1",

    environment: {
      mode: "TESTING",
      realMoney: false,
      realPayment: false,
      bankTransfer: false,
      frontendAuthority: false,
      backendAuthority: true
    },

    fare: {
      enabled: true,
      currency: "INR",

      baseFare: 100,
      perKm: 15,
      perHour: 100,
      minimumFare: 100,

      waitingPerMinute: 2,

      vehicleRates: {
        mini: 1.00,
        sedan: 1.20,
        suv: 1.50,
        premium: 2.00,
        tempoTraveller: 2.50
      }
    },

    charges: {
      platformChargeEnabled: true,
      platformChargeType: "PERCENTAGE",
      platformChargeValue: 5,

      convenienceChargeEnabled: false,
      convenienceChargeType: "FIXED",
      convenienceChargeValue: 0,

      cancellationChargeEnabled: true,
      cancellationChargeType: "PERCENTAGE",
      cancellationChargeValue: 10
    },

    discount: {
      enabled: true,
      type: "PERCENTAGE",
      value: 0,
      maximumAmount: 500,
      minimumBookingAmount: 0
    },

    advance: {
      enabled: true,
      required: false,
      defaultPercent: 20,
      minimumPercent: 0,
      maximumPercent: 100
    },

    booking: {
      enabled: true,

      customerBookingAllowed: true,
      vendorBookingAllowed: true,

      cancellationAllowed: true,
      modificationAllowed: true,

      cancellationWindowMinutes: 60,
      modificationWindowMinutes: 30,

      futureBookingAllowed: true,
      sameDayBookingAllowed: true
    },

    kyc: {
      customerRequired: false,
      vendorRequired: true,
      driverRequired: true,

      documentVerificationRequired: true
    },

    rating: {
      enabled: true,

      customerToDriver: true,
      customerToVendor: true,
      customerToGoVara: true,

      mandatory: false,
      minimumRating: 1,
      maximumRating: 5
    },

    notification: {
      bookingConfirmation: true,
      bookingCancellation: true,
      fareUpdate: true,
      paymentUpdate: true,
      documentUpdate: true
    }
  };


  /* =========================================================
     Helpers
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
    return Number.isFinite(n) ? n : fallback;
  }

  function getConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return clone(DEFAULT_CONFIG);
      }

      const parsed = JSON.parse(saved);

      return mergeDeep(
        clone(DEFAULT_CONFIG),
        parsed
      );

    } catch (error) {
      console.warn("26C: Unable to load saved policy configuration.", error);
      return clone(DEFAULT_CONFIG);
    }
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


  function save(config) {

    const validation = validate(config);

    if (!validation.valid) {
      showNotice(
        "26C validation failed: " + validation.errors.join(" | "),
        "error"
      );

      return false;
    }

    try {

      /*
       * Financial safety invariants.
       * These cannot be enabled from frontend policy controls.
       */
      config.environment.realMoney = false;
      config.environment.realPayment = false;
      config.environment.bankTransfer = false;
      config.environment.frontendAuthority = false;
      config.environment.backendAuthority = true;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(config)
      );

      createAuditEvent(
        "26C_POLICY_SAVE",
        "Business policy configuration saved locally."
      );

      showNotice(
        "Business policies saved successfully.",
        "success"
      );

      return true;

    } catch (error) {

      console.error("26C save error:", error);

      showNotice(
        "Unable to save business policies.",
        "error"
      );

      return false;
    }
  }


  function reset() {

    try {

      localStorage.removeItem(STORAGE_KEY);

      createAuditEvent(
        "26C_POLICY_RESET",
        "Business policies reset to default values."
      );

      showNotice(
        "Business policies reset to defaults.",
        "success"
      );

      renderAndBind();

      return true;

    } catch (error) {

      console.error("26C reset error:", error);

      return false;
    }
  }


  function validate(config) {

    const errors = [];

    if (number(config.fare.baseFare) < 0) {
      errors.push("Base fare cannot be negative.");
    }

    if (number(config.fare.perKm) < 0) {
      errors.push("Per-km rate cannot be negative.");
    }

    if (number(config.fare.perHour) < 0) {
      errors.push("Per-hour rate cannot be negative.");
    }

    if (number(config.fare.minimumFare) < 0) {
      errors.push("Minimum fare cannot be negative.");
    }

    if (
      number(config.discount.value) < 0 ||
      number(config.discount.maximumAmount) < 0
    ) {
      errors.push("Discount values cannot be negative.");
    }

    if (
      number(config.advance.minimumPercent) < 0 ||
      number(config.advance.maximumPercent) > 100
    ) {
      errors.push("Advance percentage must remain between 0 and 100.");
    }

    if (
      number(config.advance.minimumPercent) >
      number(config.advance.maximumPercent)
    ) {
      errors.push("Advance minimum cannot exceed maximum.");
    }

    if (
      number(config.rating.minimumRating) < 1 ||
      number(config.rating.maximumRating) > 5
    ) {
      errors.push("Rating range must remain between 1 and 5.");
    }

    /*
     * Hard safety checks.
     */
    if (config.environment.realMoney !== false) {
      errors.push("Real Money must remain BLOCKED.");
    }

    if (config.environment.realPayment !== false) {
      errors.push("Real Payment must remain BLOCKED.");
    }

    if (config.environment.bankTransfer !== false) {
      errors.push("Bank Transfer must remain BLOCKED.");
    }

    if (config.environment.frontendAuthority !== false) {
      errors.push("Frontend financial authority must remain disabled.");
    }

    if (config.environment.backendAuthority !== true) {
      errors.push("Backend must remain authoritative.");
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }


  function createAuditEvent(action, message) {

    try {

      const key = "GOVARA_AUDIT_EVENTS";

      const existing =
        JSON.parse(localStorage.getItem(key) || "[]");

      existing.push({
        id: "26C-" + Date.now(),
        timestamp: new Date().toISOString(),
        module: "26C",
        action: action,
        message: message,
        mode: "TESTING"
      });

      localStorage.setItem(
        key,
        JSON.stringify(existing.slice(-200))
      );

    } catch (error) {
      console.warn("26C audit event failed.", error);
    }
  }


  function showNotice(message, type) {

    const el = document.getElementById("module-26C-notice");

    if (!el) {
      return;
    }

    el.className = "notice " + (type || "info");
    el.textContent = message;

    window.setTimeout(function () {
      if (el) {
        el.textContent = "";
        el.className = "notice";
      }
    }, 4000);
  }


  /* =========================================================
     UI helpers
     ========================================================= */

  function toggle(id, checked) {

    return `
      <label class="switch-row">
        <span>${escapeHTML(id)}</span>
        <input
          type="checkbox"
          data-field="${escapeHTML(id)}"
          ${checked ? "checked" : ""}
        >
      </label>
    `;
  }


  function input(label, field, value, type = "number", step = "any") {

    return `
      <label class="field">
        <span>${escapeHTML(label)}</span>
        <input
          type="${type}"
          data-field="${escapeHTML(field)}"
          value="${escapeHTML(value)}"
          ${type === "number" ? `step="${step}"` : ""}
        >
      </label>
    `;
  }


  function select(label, field, value, options) {

    return `
      <label class="field">
        <span>${escapeHTML(label)}</span>

        <select data-field="${escapeHTML(field)}">

          ${options.map(function (option) {

            return `
              <option
                value="${escapeHTML(option.value)}"
                ${option.value === value ? "selected" : ""}
              >
                ${escapeHTML(option.label)}
              </option>
            `;

          }).join("")}

        </select>
      </label>
    `;
  }


  function section(title, subtitle, body) {

    return `
      <section class="card policy-section">

        <div class="section-title">
          <div>
            <h2>${escapeHTML(title)}</h2>
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
          <h1>26C — Business Policies</h1>

          <div class="muted">
            Central administrator control for fare, charges,
            discounts, advance, booking, KYC, ratings and notifications.
          </div>
        </div>

        <div class="status-row">

          <span class="badge good">
            POLICY CONTROL READY
          </span>

          <span class="badge warn">
            FRONTEND ONLY
          </span>

          <span class="badge danger">
            REAL MONEY BLOCKED
          </span>

        </div>

      </div>


      <div id="module-26C-notice" class="notice"></div>


      ${section(
        "Fare & Rate Policy",
        "Default fare calculation inputs for the frontend policy layer.",
        `

          <div class="grid four">

            ${input(
              "Base Fare (₹)",
              "fare.baseFare",
              c.fare.baseFare
            )}

            ${input(
              "Per KM (₹)",
              "fare.perKm",
              c.fare.perKm
            )}

            ${input(
              "Per Hour (₹)",
              "fare.perHour",
              c.fare.perHour
            )}

            ${input(
              "Minimum Fare (₹)",
              "fare.minimumFare",
              c.fare.minimumFare
            )}

            ${input(
              "Waiting / Minute (₹)",
              "fare.waitingPerMinute",
              c.fare.waitingPerMinute
            )}

            ${select(
              "Fare Currency",
              "fare.currency",
              c.fare.currency,
              [
                { value: "INR", label: "INR — Indian Rupee" }
              ]
            )}

          </div>


          <h3>Vehicle Rate Multipliers</h3>

          <div class="grid five">

            ${input("Mini", "fare.vehicleRates.mini", c.fare.vehicleRates.mini)}

            ${input("Sedan", "fare.vehicleRates.sedan", c.fare.vehicleRates.sedan)}

            ${input("SUV", "fare.vehicleRates.suv", c.fare.vehicleRates.suv)}

            ${input("Premium", "fare.vehicleRates.premium", c.fare.vehicleRates.premium)}

            ${input(
              "Tempo Traveller",
              "fare.vehicleRates.tempoTraveller",
              c.fare.vehicleRates.tempoTraveller
            )}

          </div>

        `
      )}


      ${section(
        "Charges & Fees",
        "Platform, convenience and cancellation charge policy.",
        `

          <div class="grid three">

            <div>
              <h3>Platform Charge</h3>

              ${toggle(
                "platformChargeEnabled",
                c.charges.platformChargeEnabled
              )}

              ${select(
                "Charge Type",
                "charges.platformChargeType",
                c.charges.platformChargeType,
                [
                  { value: "PERCENTAGE", label: "Percentage" },
                  { value: "FIXED", label: "Fixed Amount" }
                ]
              )}

              ${input(
                "Charge Value",
                "charges.platformChargeValue",
                c.charges.platformChargeValue
              )}
            </div>


            <div>
              <h3>Convenience Charge</h3>

              ${toggle(
                "convenienceChargeEnabled",
                c.charges.convenienceChargeEnabled
              )}

              ${select(
                "Charge Type",
                "charges.convenienceChargeType",
                c.charges.convenienceChargeType,
                [
                  { value: "PERCENTAGE", label: "Percentage" },
                  { value: "FIXED", label: "Fixed Amount" }
                ]
              )}

              ${input(
                "Charge Value",
                "charges.convenienceChargeValue",
                c.charges.convenienceChargeValue
              )}
            </div>


            <div>
              <h3>Cancellation Charge</h3>

              ${toggle(
                "cancellationChargeEnabled",
                c.charges.cancellationChargeEnabled
              )}

              ${select(
                "Charge Type",
                "charges.cancellationChargeType",
                c.charges.cancellationChargeType,
                [
                  { value: "PERCENTAGE", label: "Percentage" },
                  { value: "FIXED", label: "Fixed Amount" }
                ]
              )}

              ${input(
                "Charge Value",
                "charges.cancellationChargeValue",
                c.charges.cancellationChargeValue
              )}
            </div>

          </div>

        `
      )}


      ${section(
        "Discount Policy",
        "Configure discount availability and limits.",
        `

          ${toggle("discountEnabled", c.discount.enabled)}

          <div class="grid four">

            ${select(
              "Discount Type",
              "discount.type",
              c.discount.type,
              [
                { value: "PERCENTAGE", label: "Percentage" },
                { value: "FIXED", label: "Fixed Amount" }
              ]
            )}

            ${input(
              "Discount Value",
              "discount.value",
              c.discount.value
            )}

            ${input(
              "Maximum Discount (₹)",
              "discount.maximumAmount",
              c.discount.maximumAmount
            )}

            ${input(
              "Minimum Booking (₹)",
              "discount.minimumBookingAmount",
              c.discount.minimumBookingAmount
            )}

          </div>

        `
      )}


      ${section(
        "Advance Payment Policy",
        "Controls the advance requirement for booking flows.",
        `

          <div class="grid four">

            ${toggle(
              "advanceEnabled",
              c.advance.enabled
            )}

            ${toggle(
              "advanceRequired",
              c.advance.required
            )}

            ${input(
              "Default Advance %",
              "advance.defaultPercent",
              c.advance.defaultPercent
            )}

            ${input(
              "Minimum Advance %",
              "advance.minimumPercent",
              c.advance.minimumPercent
            )}

            ${input(
              "Maximum Advance %",
              "advance.maximumPercent",
              c.advance.maximumPercent
            )}

          </div>

          <div class="notice warn">
            Real payment processing is not enabled by this policy.
            Payment authority remains with the backend.
          </div>

        `
      )}


      ${section(
        "Booking Policy",
        "Customer, vendor and booking lifecycle controls.",
        `

          <div class="grid three">

            <div>
              <h3>Booking Access</h3>

              ${toggle(
                "bookingEnabled",
                c.booking.enabled
              )}

              ${toggle(
                "customerBookingAllowed",
                c.booking.customerBookingAllowed
              )}

              ${toggle(
                "vendorBookingAllowed",
                c.booking.vendorBookingAllowed
              )}
            </div>


            <div>
              <h3>Booking Changes</h3>

              ${toggle(
                "cancellationAllowed",
                c.booking.cancellationAllowed
              )}

              ${toggle(
                "modificationAllowed",
                c.booking.modificationAllowed
              )}

              ${input(
                "Cancellation Window (minutes)",
                "booking.cancellationWindowMinutes",
                c.booking.cancellationWindowMinutes
              )}

              ${input(
                "Modification Window (minutes)",
                "booking.modificationWindowMinutes",
                c.booking.modificationWindowMinutes
              )}
            </div>


            <div>
              <h3>Booking Timing</h3>

              ${toggle(
                "futureBookingAllowed",
                c.booking.futureBookingAllowed
              )}

              ${toggle(
                "sameDayBookingAllowed",
                c.booking.sameDayBookingAllowed
              )}
            </div>

          </div>

        `
      )}


      ${section(
        "KYC Policy",
        "Role-specific KYC and document verification requirements.",
        `

          <div class="grid three">

            <div class="card inner-card">
              <h3>Customer</h3>
              ${toggle(
                "customerKYCRequired",
                c.kyc.customerRequired
              )}
            </div>

            <div class="card inner-card">
              <h3>Vendor</h3>
              ${toggle(
                "vendorKYCRequired",
                c.kyc.vendorRequired
              )}
            </div>

            <div class="card inner-card">
              <h3>Driver</h3>
              ${toggle(
                "driverKYCRequired",
                c.kyc.driverRequired
              )}
            </div>

          </div>

          ${toggle(
            "documentVerificationRequired",
            c.kyc.documentVerificationRequired
          )}

        `
      )}


      ${section(
        "Rating Policy",
        "Optional customer feedback and rating controls.",
        `

          ${toggle(
            "ratingEnabled",
            c.rating.enabled
          )}

          <div class="grid four">

            ${toggle(
              "customerToDriver",
              c.rating.customerToDriver
            )}

            ${toggle(
              "customerToVendor",
              c.rating.customerToVendor
            )}

            ${toggle(
              "customerToGoVara",
              c.rating.customerToGoVara
            )}

            ${toggle(
              "ratingMandatory",
              c.rating.mandatory
            )}

            ${input(
              "Minimum Rating",
              "rating.minimumRating",
              c.rating.minimumRating
            )}

            ${input(
              "Maximum Rating",
              "rating.maximumRating",
              c.rating.maximumRating
            )}

          </div>

        `
      )}


      ${section(
        "Notification Policy",
        "Control standard customer and operational notifications.",
        `

          <div class="grid three">

            ${toggle(
              "bookingConfirmation",
              c.notification.bookingConfirmation
            )}

            ${toggle(
              "bookingCancellation",
              c.notification.bookingCancellation
            )}

            ${toggle(
              "fareUpdate",
              c.notification.fareUpdate
            )}

            ${toggle(
              "paymentUpdate",
              c.notification.paymentUpdate
            )}

            ${toggle(
              "documentUpdate",
              c.notification.documentUpdate
            )}

          </div>

        `
      )}


      ${section(
        "Financial Safety Boundary",
        "These controls are intentionally locked by system architecture.",
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
            <h2>Policy Actions</h2>

            <div class="muted">
              Save, reload or restore the frontend policy configuration.
            </div>
          </div>

        </div>

        <div class="button-row">

          <button
            id="btn-26C-save"
            class="primary"
          >
            Save Policies
          </button>

          <button
            id="btn-26C-reload"
          >
            Reload
          </button>

          <button
            id="btn-26C-reset"
            class="danger-btn"
          >
            Reset Defaults
          </button>

          <button
            id="btn-26C-validate"
          >
            Validate Configuration
          </button>

        </div>

      </section>

    `;
  }


  /* =========================================================
     Field mapping
     ========================================================= */

  function setPath(obj, path, value) {

    const parts = path.split(".");
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {

      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }

      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
  }


  function getFieldValue(field, config) {

    const parts = field.split(".");
    let value = config;

    for (let i = 0; i < parts.length; i++) {

      if (value == null) {
        return undefined;
      }

      value = value[parts[i]];
    }

    return value;
  }


  function collectConfig() {

    const config = getConfig();

    const mount =
      document.getElementById("module-26C");

    if (!mount) {
      return config;
    }


    mount.querySelectorAll("[data-field]").forEach(function (el) {

      const key = el.getAttribute("data-field");

      if (!key) {
        return;
      }


      let value;


      if (el.type === "checkbox") {

        value = el.checked;


      } else if (el.type === "number") {

        value = number(el.value);


      } else {

        value = el.value;

      }


      const mapping = {

        platformChargeEnabled:
          "charges.platformChargeEnabled",

        convenienceChargeEnabled:
          "charges.convenienceChargeEnabled",

        cancellationChargeEnabled:
          "charges.cancellationChargeEnabled",

        discountEnabled:
          "discount.enabled",

        advanceEnabled:
          "advance.enabled",

        advanceRequired:
          "advance.required",

        bookingEnabled:
          "booking.enabled",

        customerBookingAllowed:
          "booking.customerBookingAllowed",

        vendorBookingAllowed:
          "booking.vendorBookingAllowed",

        cancellationAllowed:
          "booking.cancellationAllowed",

        modificationAllowed:
          "booking.modificationAllowed",

        futureBookingAllowed:
          "booking.futureBookingAllowed",

        sameDayBookingAllowed:
          "booking.sameDayBookingAllowed",

        customerKYCRequired:
          "kyc.customerRequired",

        vendorKYCRequired:
          "kyc.vendorRequired",

        driverKYCRequired:
          "kyc.driverRequired",

        documentVerificationRequired:
          "kyc.documentVerificationRequired",

        ratingEnabled:
          "rating.enabled",

        customerToDriver:
          "rating.customerToDriver",

        customerToVendor:
          "rating.customerToVendor",

        customerToGoVara:
          "rating.customerToGoVara",

        ratingMandatory:
          "rating.mandatory",

        bookingConfirmation:
          "notification.bookingConfirmation",

        bookingCancellation:
          "notification.bookingCancellation",

        fareUpdate:
          "notification.fareUpdate",

        paymentUpdate:
          "notification.paymentUpdate",

        documentUpdate:
          "notification.documentUpdate"

      };


      if (mapping[key]) {

        setPath(
          config,
          mapping[key],
          value
        );

      } else {

        setPath(
          config,
          key,
          value
        );

      }

    });


    /*
     * Hard financial safety boundary.
     */
    config.environment.realMoney = false;
    config.environment.realPayment = false;
    config.environment.bankTransfer = false;
    config.environment.frontendAuthority = false;
    config.environment.backendAuthority = true;

    return config;
  }


  /* =========================================================
     Bind
     ========================================================= */

  function bind() {

    const saveButton =
      document.getElementById("btn-26C-save");

    const reloadButton =
      document.getElementById("btn-26C-reload");

    const resetButton =
      document.getElementById("btn-26C-reset");

    const validateButton =
      document.getElementById("btn-26C-validate");


    if (saveButton) {

      saveButton.addEventListener(
        "click",
        function () {

          const config = collectConfig();

          save(config);

        }
      );

    }


    if (reloadButton) {

      reloadButton.addEventListener(
        "click",
        function () {

          renderAndBind();

          showNotice(
            "Policy configuration reloaded.",
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
              "Reset all 26C Business Policies to default values?"
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

          const config = collectConfig();

          const result = validate(config);

          if (result.valid) {

            showNotice(
              "26C configuration is valid.",
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
      document.getElementById("module-26C");

    if (!mount) {

      console.warn(
        "26C mount #module-26C was not found."
      );

      return false;
    }

    mount.innerHTML = render();

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
