/* ============================================================
   GoVara — 26A System Configuration
   VERSION: GOVARA-26A-V1
   FRONTEND-ONLY CONFIGURATION MODULE

   RULES:
   - No backend call
   - No database call
   - No API test
   - No financial authority in frontend
   - Backend remains authoritative
   - Real Money = BLOCKED
   - Real Payment = BLOCKED
   - Bank Transfer = BLOCKED
============================================================ */

window.GoVara26A = (function () {

  "use strict";

  const STORAGE_KEY = "GOVARA_SYSTEM_CONFIG_26A_V1";

  /* ==========================================================
     DEFAULT CONFIGURATION
  ========================================================== */

  const DEFAULT_CONFIG = {

    /* ---------- SYSTEM IDENTITY ---------- */

    systemName: "GoVara",

    platformName:
      "GoVara Transport & Mobility Platform",

    systemVersion:
      "26A-V1",

    systemStatus:
      "ACTIVE",

    environment:
      "TESTING",


    /* ---------- SYSTEM LIFECYCLE ---------- */

    maintenanceMode:
      false,

    suspendedMode:
      false,

    productionLock:
      true,

    testingMode:
      true,


    /* ---------- CENTRAL CONFIGURATION ---------- */

    apiEndpoint:
      "",

    configVersion:
      "GOVARA-26A-V1",

    configSource:
      "FRONTEND_LOCAL_CONFIGURATION",

    configurationValidated:
      false,


    /* ---------- REGIONAL SETTINGS ---------- */

    defaultLanguage:
      "English",

    enabledLanguages:
      ["English", "Hindi"],

    country:
      "India",

    currency:
      "INR",

    timezone:
      "Asia/Kolkata",

    dateFormat:
      "DD-MM-YYYY",

    timeFormat:
      "12-hour",


    /* ---------- GLOBAL PLATFORM CONTROLS ---------- */

    platformEnabled:
      true,

    customerRegistration:
      true,

    vendorRegistration:
      true,

    driverRegistration:
      true,

    bookingEnabled:
      true,

    fareEstimateEnabled:
      true,

    notificationsEnabled:
      true,


    /* ---------- SOCIAL WELFARE ---------- */

    welfareEnabled:
      true,

    welfareMasterControl:
      true,


    /* ---------- MODULE REGISTRY ---------- */

    modules: {
      Customer: true,
      Vendor: true,
      Driver: true,
      Vehicle: true,
      Booking: true,
      Duty: true,
      Fare: true,
      Transaction: true,
      Wallet: true,
      Ledger: true,
      Settlement: true,
      Billing: true,
      Documents: true,
      Admin: true,
      Audit: true
    },


    /* ---------- FINANCIAL SAFETY ---------- */

    realMoney:
      false,

    realPayment:
      false,

    bankTransfer:
      false,

    frontendAuthority:
      false,

    backendAuthority:
      true,


    /* ---------- HEALTH / AUDIT ---------- */

    auditLogging:
      true,

    healthMonitoring:
      true,

    lastAction:
      "INITIALIZED",

    lastUpdated:
      null

  };


  /* ==========================================================
     UTILITIES
  ========================================================== */

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }


  function getConfig() {

    try {

      const stored =
        localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        return clone(DEFAULT_CONFIG);
      }

      const parsed =
        JSON.parse(stored);

      return mergeConfig(
        clone(DEFAULT_CONFIG),
        parsed
      );

    } catch (error) {

      console.warn(
        "GoVara26A: configuration load failed.",
        error
      );

      return clone(DEFAULT_CONFIG);
    }
  }


  function mergeConfig(base, incoming) {

    if (!incoming || typeof incoming !== "object") {
      return base;
    }

    Object.keys(incoming).forEach(function (key) {

      if (
        incoming[key] &&
        typeof incoming[key] === "object" &&
        !Array.isArray(incoming[key]) &&
        base[key] &&
        typeof base[key] === "object" &&
        !Array.isArray(base[key])
      ) {

        base[key] =
          mergeConfig(base[key], incoming[key]);

      } else {

        base[key] =
          incoming[key];
      }

    });

    return base;
  }


  /* ==========================================================
     VALIDATION
  ========================================================== */

  function validateConfig(config) {

    const errors = [];
    const warnings = [];

    if (!config.systemName) {
      errors.push("System name is required.");
    }

    if (!config.platformName) {
      errors.push("Platform name is required.");
    }

    if (!config.environment) {
      errors.push("Environment is required.");
    }

    if (!config.systemStatus) {
      errors.push("System status is required.");
    }

    if (!config.defaultLanguage) {
      errors.push("Default language is required.");
    }

    if (!Array.isArray(config.enabledLanguages)) {
      errors.push("Enabled languages must be an array.");
    }

    if (!config.country) {
      errors.push("Country is required.");
    }

    if (!config.currency) {
      errors.push("Currency is required.");
    }

    if (!config.timezone) {
      errors.push("Timezone is required.");
    }

    /* ---------- SAFETY ENFORCEMENT ---------- */

    if (config.realMoney !== false) {
      errors.push(
        "Real Money must remain BLOCKED."
      );
    }

    if (config.realPayment !== false) {
      errors.push(
        "Real Payment must remain BLOCKED."
      );
    }

    if (config.bankTransfer !== false) {
      errors.push(
        "Bank Transfer must remain BLOCKED."
      );
    }

    if (config.frontendAuthority !== false) {
      errors.push(
        "Frontend must never become financial authority."
      );
    }

    if (config.backendAuthority !== true) {
      errors.push(
        "Backend must remain authoritative."
      );
    }

    /* ---------- TESTING SAFETY ---------- */

    if (
      config.environment === "TESTING" &&
      config.testingMode !== true
    ) {

      warnings.push(
        "Testing environment normally uses Testing Mode."
      );
    }

    if (
      config.environment === "PRODUCTION" &&
      config.productionLock !== true
    ) {

      errors.push(
        "Production Lock must remain enabled."
      );
    }

    return {
      valid: errors.length === 0,
      errors: errors,
      warnings: warnings
    };
  }


  /* ==========================================================
     SAVE
  ========================================================== */

  function save(config) {

    const current =
      mergeConfig(
        clone(DEFAULT_CONFIG),
        config || {}
      );


    /* ------------------------------------------
       HARD SAFETY BOUNDARY
    ------------------------------------------ */

    current.realMoney = false;
    current.realPayment = false;
    current.bankTransfer = false;

    current.frontendAuthority = false;
    current.backendAuthority = true;

    current.productionLock = true;


    current.lastUpdated =
      new Date().toISOString();

    current.lastAction =
      "CONFIGURATION_SAVED";


    const validation =
      validateConfig(current);

    if (!validation.valid) {

      console.error(
        "GoVara26A validation failed:",
        validation.errors
      );

      return {
        success: false,
        validation: validation
      };
    }


    current.configurationValidated =
      true;


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(current)
    );


    return {
      success: true,
      config: current,
      validation: validation
    };
  }


  /* ==========================================================
     RESET
  ========================================================== */

  function reset() {

    localStorage.removeItem(
      STORAGE_KEY
    );

    return clone(DEFAULT_CONFIG);
  }


  /* ==========================================================
     STATUS HELPERS
  ========================================================== */

  function getSystemHealth(config) {

    const c =
      config || getConfig();

    const validation =
      validateConfig(c);

    return {

      system:
        c.platformEnabled
          ? "HEALTHY"
          : "DISABLED",

      configuration:
        validation.valid
          ? "VALID"
          : "ERROR",

      environment:
        c.environment,

      api:
        c.apiEndpoint
          ? "CONFIGURED"
          : "NOT CONFIGURED",

      backend:
        "AUTHORITATIVE",

      financial:
        (
          c.realMoney === false &&
          c.realPayment === false &&
          c.bankTransfer === false
        )
          ? "SAFE"
          : "BLOCKED",

      audit:
        c.auditLogging
          ? "ENABLED"
          : "DISABLED"

    };
  }


  /* ==========================================================
     AUDIT EVENT
  ========================================================== */

  function createAuditEvent(
    action,
    details
  ) {

    return {

      module:
        "26A",

      action:
        action || "UNKNOWN",

      details:
        details || "",

      timestamp:
        new Date().toISOString(),

      authority:
        "FRONTEND_CONFIGURATION_ONLY",

      backendModified:
        false,

      databaseModified:
        false

    };
  }


  /* ==========================================================
     HTML HELPERS
  ========================================================== */

  function esc(value) {

    return String(
      value === undefined ||
      value === null
        ? ""
        : value
    )
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function option(value, label, selected) {

    return `
      <option
        value="${esc(value)}"
        ${selected === value ? "selected" : ""}
      >
        ${esc(label)}
      </option>
    `;
  }


  function boolControl(
    id,
    label,
    value,
    description,
    locked
  ) {

    return `
      <div class="govara26a-control">

        <div class="govara26a-control-main">

          <label
            class="govara26a-toggle"
            for="${id}"
          >

            <input
              type="checkbox"
              id="${id}"
              ${value ? "checked" : ""}
              ${locked ? "disabled" : ""}
            >

            <span class="govara26a-switch"></span>

            <span>
              <strong>${esc(label)}</strong>

              ${
                description
                  ? `<small>${esc(description)}</small>`
                  : ""
              }

            </span>

          </label>

          ${
            locked
              ? `<span class="govara26a-lock">LOCKED</span>`
              : ""
          }

        </div>

      </div>
    `;
  }


  /* ==========================================================
     RENDER
  ========================================================== */

  function render() {

    const c =
      getConfig();

    const health =
      getSystemHealth(c);

    const validation =
      validateConfig(c);


    const modules =
      Object.keys(c.modules);


    return `

      <style>

        .govara26a-wrap {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .govara26a-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
        }

        .govara26a-head h1 {
          margin: 0 0 6px;
        }

        .govara26a-head p {
          margin: 0;
          opacity: .72;
        }

        .govara26a-statusbar {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(145px, 1fr));
          gap: 10px;
        }

        .govara26a-status {
          padding: 14px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 14px;
          background: rgba(255,255,255,.035);
        }

        .govara26a-status strong {
          display: block;
          margin-bottom: 5px;
        }

        .govara26a-status small {
          opacity: .65;
        }

        .govara26a-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .govara26a-section {
          padding: 20px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 16px;
          background: rgba(255,255,255,.025);
        }

        .govara26a-section h2 {
          margin: 0 0 6px;
          font-size: 18px;
        }

        .govara26a-section-desc {
          margin: 0 0 18px;
          opacity: .62;
          font-size: 13px;
        }

        .govara26a-fields {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }

        .govara26a-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .govara26a-field label {
          font-size: 12px;
          font-weight: 700;
          opacity: .72;
        }

        .govara26a-field input,
        .govara26a-field select {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 12px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,.10);
          background: rgba(0,0,0,.18);
          color: inherit;
          outline: none;
        }

        .govara26a-field input:focus,
        .govara26a-field select:focus {
          border-color: rgba(120,170,255,.55);
        }

        .govara26a-controls {
          display: grid;
          gap: 8px;
        }

        .govara26a-control {
          padding: 12px;
          border-radius: 12px;
          background: rgba(255,255,255,.025);
          border: 1px solid rgba(255,255,255,.06);
        }

        .govara26a-control-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .govara26a-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .govara26a-toggle input {
          display: none;
        }

        .govara26a-switch {
          width: 42px;
          height: 23px;
          border-radius: 20px;
          background: rgba(255,255,255,.15);
          position: relative;
          flex-shrink: 0;
        }

        .govara26a-switch::after {
          content: "";
          width: 17px;
          height: 17px;
          border-radius: 50%;
          position: absolute;
          left: 3px;
          top: 3px;
          background: white;
          transition: .2s;
        }

        .govara26a-toggle input:checked
        + .govara26a-switch {
          background: rgba(70,190,120,.75);
        }

        .govara26a-toggle input:checked
        + .govara26a-switch::after {
          transform: translateX(19px);
        }

        .govara26a-toggle strong {
          display: block;
        }

        .govara26a-toggle small {
          display: block;
          opacity: .58;
          margin-top: 2px;
        }

        .govara26a-lock {
          font-size: 10px;
          font-weight: 800;
          opacity: .55;
        }

        .govara26a-module-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
        }

        .govara26a-module {
          padding: 12px;
          border-radius: 11px;
          background: rgba(255,255,255,.035);
          border: 1px solid rgba(255,255,255,.07);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .govara26a-module span {
          font-weight: 700;
          font-size: 13px;
        }

        .govara26a-badge {
          font-size: 10px;
          padding: 4px 7px;
          border-radius: 20px;
          font-weight: 800;
        }

        .govara26a-on {
          background: rgba(70,190,120,.15);
        }

        .govara26a-off {
          background: rgba(255,90,90,.12);
        }

        .govara26a-safe {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(190px, 1fr));
          gap: 10px;
        }

        .govara26a-safe-card {
          padding: 15px;
          border-radius: 13px;
          background: rgba(255,255,255,.025);
          border: 1px solid rgba(255,255,255,.07);
        }

        .govara26a-safe-card strong {
          display: block;
          margin-bottom: 6px;
        }

        .govara26a-blocked {
          font-weight: 900;
          letter-spacing: .4px;
        }

        .govara26a-health-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(160px, 1fr));
          gap: 10px;
        }

        .govara26a-health {
          padding: 14px;
          border-radius: 12px;
          background: rgba(255,255,255,.03);
        }

        .govara26a-health b {
          display: block;
          margin-bottom: 4px;
        }

        .govara26a-health small {
          opacity: .58;
        }

        .govara26a-notice {
          padding: 14px 16px;
          border-radius: 12px;
          background: rgba(255,190,70,.08);
          border: 1px solid rgba(255,190,70,.16);
          font-size: 13px;
        }

        .govara26a-error {
          padding: 14px 16px;
          border-radius: 12px;
          background: rgba(255,80,80,.10);
          border: 1px solid rgba(255,80,80,.18);
        }

        .govara26a-actions {
          position: sticky;
          bottom: 12px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
          padding: 12px;
          border-radius: 15px;
          background: rgba(10,12,18,.92);
          border: 1px solid rgba(255,255,255,.09);
          backdrop-filter: blur(12px);
        }

        .govara26a-actions button {
          padding: 11px 17px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,.10);
          cursor: pointer;
          background: rgba(255,255,255,.06);
          color: inherit;
          font-weight: 800;
        }

        .govara26a-actions button:hover {
          background: rgba(255,255,255,.11);
        }

        .govara26a-save {
          background: rgba(70,150,255,.20) !important;
        }

        .govara26a-meta {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          opacity: .55;
          font-size: 12px;
        }

      </style>


      <div
        class="govara26a-wrap"
        id="govara26a-root"
      >

        <!-- ============================================
             HEADER
        ============================================= -->

        <div class="govara26a-head">

          <div>

            <h1>
              26A — System Configuration
            </h1>

            <p>
              Central frontend configuration and platform
              safety control. Backend and database remain
              authoritative.
            </p>

          </div>

        </div>


        <!-- ============================================
             HEALTH STATUS
        ============================================= -->

        <div class="govara26a-statusbar">

          <div class="govara26a-status">
            <strong>
              ${esc(health.system)}
            </strong>
            <small>
              Platform
            </small>
          </div>

          <div class="govara26a-status">
            <strong>
              ${esc(health.configuration)}
            </strong>
            <small>
              Configuration
            </small>
          </div>

          <div class="govara26a-status">
            <strong>
              ${esc(health.environment)}
            </strong>
            <small>
              Environment
            </small>
          </div>

          <div class="govara26a-status">
            <strong>
              ${esc(health.api)}
            </strong>
            <small>
              API
            </small>
          </div>

          <div class="govara26a-status">
            <strong>
              ${esc(health.financial)}
            </strong>
            <small>
              Financial Safety
            </small>
          </div>

          <div class="govara26a-status">
            <strong>
              ${esc(health.audit)}
            </strong>
            <small>
              Audit
            </small>
          </div>

        </div>


        <!-- ============================================
             VALIDATION MESSAGE
        ============================================= -->

        ${
          !validation.valid

            ? `
              <div class="govara26a-error">

                <strong>
                  Configuration Validation Error
                </strong>

                <ul>
                  ${
                    validation.errors
                      .map(
                        e => `<li>${esc(e)}</li>`
                      )
                      .join("")
                  }
                </ul>

              </div>
            `

            : `
              <div class="govara26a-notice">

                <strong>
                  Configuration Safe
                </strong>

                <div>
                  26A is operating as a frontend
                  configuration layer. No backend or
                  database changes are performed here.
                </div>

              </div>
            `
        }


        <div class="govara26a-grid">


          <!-- ==========================================
               SYSTEM IDENTITY
          =========================================== -->

          <section class="govara26a-section">

            <h2>
              1. System Identity
            </h2>

            <p class="govara26a-section-desc">
              Core platform identity and system lifecycle.
            </p>

            <div class="govara26a-fields">

              <div class="govara26a-field">

                <label>
                  System Name
                </label>

                <input
                  id="26a-systemName"
                  value="${esc(c.systemName)}"
                >

              </div>


              <div class="govara26a-field">

                <label>
                  Platform Name
                </label>

                <input
                  id="26a-platformName"
                  value="${esc(c.platformName)}"
                >

              </div>


              <div class="govara26a-field">

                <label>
                  System Version
                </label>

                <input
                  id="26a-systemVersion"
                  value="${esc(c.systemVersion)}"
                >

              </div>


              <div class="govara26a-field">

                <label>
                  System Status
                </label>

                <select id="26a-systemStatus">

                  ${option(
                    "ACTIVE",
                    "ACTIVE",
                    c.systemStatus
                  )}

                  ${option(
                    "MAINTENANCE",
                    "MAINTENANCE",
                    c.systemStatus
                  )}

                  ${option(
                    "SUSPENDED",
                    "SUSPENDED",
                    c.systemStatus
                  )}

                  ${option(
                    "INACTIVE",
                    "INACTIVE",
                    c.systemStatus
                  )}

                </select>

              </div>


              <div class="govara26a-field">

                <label>
                  Environment
                </label>

                <select id="26a-environment">

                  ${option(
                    "TESTING",
                    "TESTING",
                    c.environment
                  )}

                  ${option(
                    "STAGING",
                    "STAGING",
                    c.environment
                  )}

                  ${option(
                    "PRODUCTION",
                    "PRODUCTION",
                    c.environment
                  )}

                </select>

              </div>

            </div>

          </section>


          <!-- ==========================================
               ENVIRONMENT & SAFETY
          =========================================== -->

          <section class="govara26a-section">

            <h2>
              2. Environment & Safety
            </h2>

            <p class="govara26a-section-desc">
              Operational lifecycle and production protection.
            </p>

            <div class="govara26a-controls">

              ${boolControl(
                "26a-maintenanceMode",
                "Maintenance Mode",
                c.maintenanceMode,
                "Temporarily place platform into maintenance.",
                false
              )}

              ${boolControl(
                "26a-suspendedMode",
                "Suspended Mode",
                c.suspendedMode,
                "Suspend normal platform operations.",
                false
              )}

              ${boolControl(
                "26a-productionLock",
                "Production Lock",
                c.productionLock,
                "Production safety boundary.",
                true
              )}

              ${boolControl(
                "26a-testingMode",
                "Testing Mode",
                c.testingMode,
                "Keeps current platform operation in testing mode.",
                false
              )}

              ${boolControl(
                "26a-platformEnabled",
                "Platform Enabled",
                c.platformEnabled,
                "Global platform availability.",
                false
              )}

            </div>

          </section>


          <!-- ==========================================
               CENTRAL CONFIGURATION / API
          =========================================== -->

          <section class="govara26a-section">

            <h2>
              3. Central Configuration & API
            </h2>

            <p class="govara26a-section-desc">
              API endpoint is only a configuration placeholder.
              No connection test is performed.
            </p>

            <div class="govara26a-fields">

              <div class="govara26a-field">

                <label>
                  API Endpoint
                </label>

                <input
                  id="26a-apiEndpoint"
                  value="${esc(c.apiEndpoint)}"
                  placeholder="API endpoint — not configured"
                >

              </div>


              <div class="govara26a-field">

                <label>
                  Configuration Version
                </label>

                <input
                  value="${esc(c.configVersion)}"
                  disabled
                >

              </div>


              <div class="govara26a-field">

                <label>
                  Configuration Source
                </label>

                <input
                  value="${esc(c.configSource)}"
                  disabled
                >

              </div>

            </div>


            <div
              class="govara26a-notice"
              style="margin-top:16px;"
            >

              <strong>
                API STATUS: ${
                  c.apiEndpoint
                    ? "CONFIGURED"
                    : "NOT CONFIGURED"
                }
              </strong>

              <div>
                API testConnection() is intentionally not
                executed from 26A.
              </div>

            </div>

          </section>


          <!-- ==========================================
               REGIONAL SETTINGS
          =========================================== -->

          <section class="govara26a-section">

            <h2>
              4. Regional Settings & i18n
            </h2>

            <p class="govara26a-section-desc">
              Admin-configurable regional defaults and
              scalable language configuration.
            </p>

            <div class="govara26a-fields">

              <div class="govara26a-field">

                <label>
                  Default Language
                </label>

                <select id="26a-defaultLanguage">

                  ${option(
                    "English",
                    "English",
                    c.defaultLanguage
                  )}

                  ${option(
                    "Hindi",
                    "Hindi",
                    c.defaultLanguage
                  )}

                </select>

              </div>


              <div class="govara26a-field">

                <label>
                  Country
                </label>

                <input
                  id="26a-country"
                  value="${esc(c.country)}"
                >

              </div>


              <div class="govara26a-field">

                <label>
                  Currency
                </label>

                <input
                  id="26a-currency"
                  value="${esc(c.currency)}"
                >

              </div>


              <div class="govara26a-field">

                <label>
                  Timezone
                </label>

                <input
                  id="26a-timezone"
                  value="${esc(c.timezone)}"
                >

              </div>


              <div class="govara26a-field">

                <label>
                  Date Format
                </label>

                <select id="26a-dateFormat">

                  ${option(
                    "DD-MM-YYYY",
                    "DD-MM-YYYY",
                    c.dateFormat
                  )}

                  ${option(
                    "MM-DD-YYYY",
                    "MM-DD-YYYY",
                    c.dateFormat
                  )}

                  ${option(
                    "YYYY-MM-DD",
                    "YYYY-MM-DD",
                    c.dateFormat
                  )}

                </select>

              </div>


              <div class="govara26a-field">

                <label>
                  Time Format
                </label>

                <select id="26a-timeFormat">

                  ${option(
                    "12-hour",
                    "12-hour",
                    c.timeFormat
                  )}

                  ${option(
                    "24-hour",
                    "24-hour",
                    c.timeFormat
                  )}

                </select>

              </div>

            </div>


            <div
              class="govara26a-notice"
              style="margin-top:16px;"
            >

              <strong>
                Enabled Languages
              </strong>

              <div>
                ${c.enabledLanguages
                  .map(esc)
                  .join(" • ")}
              </div>

              <small>
                Translation packs remain frontend-based.
                No translation API/backend is used.
              </small>

            </div>

          </section>


          <!-- ==========================================
               REGISTRATION & SERVICES
          =========================================== -->

          <section class="govara26a-section">

            <h2>
              5. Platform & Service Controls
            </h2>

            <p class="govara26a-section-desc">
              Global registration, booking and service
              availability controls.
            </p>

            <div class="govara26a-controls">

              ${boolControl(
                "26a-customerRegistration",
                "Customer Registration",
                c.customerRegistration,
                "Primary booking initiator.",
                false
              )}

              ${boolControl(
                "26a-vendorRegistration",
                "Vendor Registration",
                c.vendorRegistration,
                "Vendor/company onboarding.",
                false
              )}

              ${boolControl(
                "26a-driverRegistration",
                "Driver Registration",
                c.driverRegistration,
                "Driver onboarding.",
                false
              )}

              ${boolControl(
                "26a-bookingEnabled",
                "Booking Enabled",
                c.bookingEnabled,
                "Global booking capability.",
                false
              )}

              ${boolControl(
                "26a-fareEstimateEnabled",
                "Fare Estimate",
                c.fareEstimateEnabled,
                "Customer-side fare estimation.",
                false
              )}

              ${boolControl(
                "26a-notificationsEnabled",
                "Notifications",
                c.notificationsEnabled,
                "Platform notification capability.",
                false
              )}

            </div>

          </section>


          <!-- ==========================================
               SOCIAL WELFARE
          =========================================== -->

          <section class="govara26a-section">

            <h2>
              6. Social Welfare Master Control
            </h2>

            <p class="govara26a-section-desc">
              Global master switch for welfare-related
              platform functionality.
            </p>

            <div class="govara26a-controls">

              ${boolControl(
                "26a-welfareEnabled",
                "Welfare Module Enabled",
                c.welfareEnabled,
                "Enables welfare functionality.",
                false
              )}

              ${boolControl(
                "26a-welfareMasterControl",
                "Welfare Master Control",
                c.welfareMasterControl,
                "Administrator-level master control.",
                false
              )}

            </div>

          </section>


          <!-- ==========================================
               MODULE REGISTRY
          =========================================== -->

          <section
            class="govara26a-section"
            style="grid-column:1/-1;"
          >

            <h2>
              7. Module Registry
            </h2>

            <p class="govara26a-section-desc">
              Current GoVara module availability registry.
              This does not create or modify backend tables.
            </p>

            <div class="govara26a-module-grid">

              ${
                modules
                  .map(function (moduleName) {

                    const enabled =
                      !!c.modules[moduleName];

                    return `

                      <div
                        class="govara26a-module"
                      >

                        <span>
                          ${esc(moduleName)}
                        </span>

                        <span
                          class="
                            govara26a-badge
                            ${
                              enabled
                                ? "govara26a-on"
                                : "govara26a-off"
                            }
                          "
                        >
                          ${
                            enabled
                              ? "ENABLED"
                              : "DISABLED"
                          }
                        </span>

                      </div>

                    `;

                  })
                  .join("")
              }

            </div>

          </section>


          <!-- ==========================================
               FINANCIAL SAFETY
          =========================================== -->

          <section
            class="govara26a-section"
            style="grid-column:1/-1;"
          >

            <h2>
              8. Financial Safety Boundary
            </h2>

            <p class="govara26a-section-desc">
              Hard frontend safety boundary. Financial
              authority remains with the backend.
            </p>

            <div class="govara26a-safe">


              <div class="govara26a-safe-card">

                <strong>
                  REAL MONEY
                </strong>

                <span class="govara26a-blocked">
                  BLOCKED
                </span>

              </div>


              <div class="govara26a-safe-card">

                <strong>
                  REAL PAYMENT
                </strong>

                <span class="govara26a-blocked">
                  BLOCKED
                </span>

              </div>


              <div class="govara26a-safe-card">

                <strong>
                  BANK TRANSFER
                </strong>

                <span class="govara26a-blocked">
                  BLOCKED
                </span>

              </div>


              <div class="govara26a-safe-card">

                <strong>
                  FRONTEND AUTHORITY
                </strong>

                <span>
                  NO
                </span>

              </div>


              <div class="govara26a-safe-card">

                <strong>
                  BACKEND AUTHORITY
                </strong>

                <span>
                  YES
                </span>

              </div>

            </div>

          </section>


          <!-- ==========================================
               AUDIT & HEALTH
          =========================================== -->

          <section
            class="govara26a-section"
            style="grid-column:1/-1;"
          >

            <h2>
              9. Audit & Health Indicators
            </h2>

            <p class="govara26a-section-desc">
              Frontend configuration monitoring and audit
              visibility.
            </p>

            <div class="govara26a-controls">

              ${boolControl(
                "26a-auditLogging",
                "Audit Logging",
                c.auditLogging,
                "Records configuration actions locally.",
                false
              )}

              ${boolControl(
                "26a-healthMonitoring",
                "Health Monitoring",
                c.healthMonitoring,
                "Shows configuration health indicators.",
                false
              )}

            </div>


            <div
              class="govara26a-health-grid"
              style="margin-top:16px;"
            >

              <div class="govara26a-health">

                <b>
                  System
                </b>

                <small>
                  ${esc(health.system)}
                </small>

              </div>


              <div class="govara26a-health">

                <b>
                  Configuration
                </b>

                <small>
                  ${esc(health.configuration)}
                </small>

              </div>


              <div class="govara26a-health">

                <b>
                  API
                </b>

                <small>
                  ${esc(health.api)}
                </small>

              </div>


              <div class="govara26a-health">

                <b>
                  Financial
                </b>

                <small>
                  ${esc(health.financial)}
                </small>

              </div>


              <div class="govara26a-health">

                <b>
                  Backend
                </b>

                <small>
                  AUTHORITATIVE
                </small>

              </div>

            </div>

          </section>


        </div>


        <!-- ============================================
             ACTION BAR
        ============================================= -->

        <div class="govara26a-actions">

          <button
            type="button"
            id="26a-reload"
          >
            Reload
          </button>

          <button
            type="button"
            id="26a-reset"
          >
            Reset Defaults
          </button>

          <button
            type="button"
            class="govara26a-save"
            id="26a-save"
          >
            Save Configuration
          </button>

        </div>


        <div class="govara26a-meta">

          <span>
            Config:
            ${esc(c.configVersion)}
          </span>

          <span>
            Last Action:
            ${esc(c.lastAction)}
          </span>

          <span>
            Last Updated:
            ${
              c.lastUpdated
                ? esc(c.lastUpdated)
                : "Not saved yet"
            }
          </span>

        </div>


      </div>

    `;
  }


  /* ==========================================================
     READ FORM
  ========================================================== */

  function readForm() {

    const current =
      getConfig();


    function value(id) {

      const el =
        document.getElementById(id);

      return el
        ? el.value
        : "";
    }


    function checked(id) {

      const el =
        document.getElementById(id);

      return el
        ? !!el.checked
        : false;
    }


    const config =
      clone(current);


    /* ---------- IDENTITY ---------- */

    config.systemName =
      value("26a-systemName");

    config.platformName =
      value("26a-platformName");

    config.systemVersion =
      value("26a-systemVersion");

    config.systemStatus =
      value("26a-systemStatus");

    config.environment =
      value("26a-environment");


    /* ---------- SAFETY ---------- */

    config.maintenanceMode =
      checked("26a-maintenanceMode");

    config.suspendedMode =
      checked("26a-suspendedMode");

    config.productionLock =
      true;

    config.testingMode =
      checked("26a-testingMode");

    config.platformEnabled =
      checked("26a-platformEnabled");


    /* ---------- API ---------- */

    config.apiEndpoint =
      value("26a-apiEndpoint");


    /* ---------- REGIONAL ---------- */

    config.defaultLanguage =
      value("26a-defaultLanguage");

    config.country =
      value("26a-country");

    config.currency =
      value("26a-currency");

    config.timezone =
      value("26a-timezone");

    config.dateFormat =
      value("26a-dateFormat");

    config.timeFormat =
      value("26a-timeFormat");


    /* ---------- SERVICES ---------- */

    config.customerRegistration =
      checked("26a-customerRegistration");

    config.vendorRegistration =
      checked("26a-vendorRegistration");

    config.driverRegistration =
      checked("26a-driverRegistration");

    config.bookingEnabled =
      checked("26a-bookingEnabled");

    config.fareEstimateEnabled =
      checked("26a-fareEstimateEnabled");

    config.notificationsEnabled =
      checked("26a-notificationsEnabled");


    /* ---------- WELFARE ---------- */

    config.welfareEnabled =
      checked("26a-welfareEnabled");

    config.welfareMasterControl =
      checked("26a-welfareMasterControl");


    /* ---------- AUDIT ---------- */

    config.auditLogging =
      checked("26a-auditLogging");

    config.healthMonitoring =
      checked("26a-healthMonitoring");


    /* ---------- HARD SAFETY ---------- */

    config.realMoney = false;
    config.realPayment = false;
    config.bankTransfer = false;

    config.frontendAuthority = false;
    config.backendAuthority = true;

    config.productionLock = true;


    return config;
  }


  /* ==========================================================
     BIND EVENTS
  ========================================================== */

  function bind() {

    const saveButton =
      document.getElementById("26a-save");

    const resetButton =
      document.getElementById("26a-reset");

    const reloadButton =
      document.getElementById("26a-reload");


    /* ---------- SAVE ---------- */

    if (saveButton) {

      saveButton.onclick =
        function () {

          const config =
            readForm();

          const result =
            save(config);


          if (!result.success) {

            alert(
              "Configuration validation failed:\n\n" +
              result.validation.errors.join("\n")
            );

            return;
          }


          if (
            result.validation.warnings &&
            result.validation.warnings.length
          ) {

            console.warn(
              "GoVara26A warnings:",
              result.validation.warnings
            );
          }


          saveButton.textContent =
            "Saved ✓";


          setTimeout(function () {

            saveButton.textContent =
              "Save Configuration";

          }, 1600);


          renderAndBind();
        };

    }


    /* ---------- RESET ---------- */

    if (resetButton) {

      resetButton.onclick =
        function () {

          const confirmed =
            window.confirm(
              "Reset 26A System Configuration to defaults?"
            );


          if (!confirmed) {
            return;
          }


          reset();


          renderAndBind();

        };

    }


    /* ---------- RELOAD ---------- */

    if (reloadButton) {

      reloadButton.onclick =
        function () {

          renderAndBind();

        };

    }

  }


  /* ==========================================================
     RENDER + BIND
  ========================================================== */

  function renderAndBind() {

    const mount =
      document.getElementById("module-26A");

    if (!mount) {

      console.error(
        "GoVara26A: #module-26A mount not found."
      );

      return;
    }


    mount.innerHTML =
      render();

    bind();

  }


  /* ==========================================================
     PUBLIC API
  ========================================================== */

  return {

    render:
      render,

    bind:
      bind,

    renderAndBind:
      renderAndBind,

    getConfig:
      getConfig,

    save:
      save,

    reset:
      reset,

    validateConfig:
      validateConfig,

    getSystemHealth:
      getSystemHealth,

    createAuditEvent:
      createAuditEvent,

    STORAGE_KEY:
      STORAGE_KEY

  };

})();
