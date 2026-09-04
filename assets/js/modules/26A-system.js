/* ============================================================
   GoVara — STEP 26A
   System Configuration
   FRONTEND ONLY
   Backend / Database / API untouched
   ============================================================ */

window.GoVara26A = (function () {

  const STORAGE_KEY = "GOVARA_SYSTEM_CONFIG_26A_V1";

  const DEFAULT_CONFIG = {
    systemName: "GoVara",
    platformName: "GoVara Transport & Mobility Platform",
    environment: "TESTING",
    systemStatus: "ACTIVE",

    maintenanceMode: false,
    productionLock: true,
    testingMode: true,

    apiEndpoint: "",

    defaultLanguage: "English",
    supportedLanguages: ["English", "Hindi"],

    country: "India",
    currency: "INR",
    timezone: "Asia/Kolkata",
    dateFormat: "DD-MM-YYYY",
    timeFormat: "12-hour",

    customerRegistration: true,
    vendorRegistration: true,
    driverRegistration: true,

    bookingEnabled: true,
    fareEstimateEnabled: true,
    notificationsEnabled: true,

    welfareEnabled: true,

    realMoney: false,
    realPayment: false,
    bankTransfer: false,

    frontendAuthority: false,
    backendAuthority: true,

    lastUpdated: null
  };

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return { ...DEFAULT_CONFIG };

      const parsed = JSON.parse(saved);

      return {
        ...DEFAULT_CONFIG,
        ...parsed
      };
    } catch (error) {
      console.warn("GoVara 26A load error:", error);
      return { ...DEFAULT_CONFIG };
    }
  }

  function save(config) {
    const finalConfig = {
      ...DEFAULT_CONFIG,
      ...config,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(finalConfig)
    );

    return finalConfig;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function toggle(id, label, checked, description) {
    return `
      <label class="gv26a-toggle-row">
        <span>
          <strong>${label}</strong>
          <small>${description}</small>
        </span>

        <input
          type="checkbox"
          id="${id}"
          ${checked ? "checked" : ""}
        >
      </label>
    `;
  }

  function render() {

    const config = load();

    return `
      <div class="gv26a">

        <div class="gv26a-header">
          <div>
            <div class="gv26a-kicker">ADMINISTRATOR CONTROL CENTER</div>
            <h1>26A — System Configuration</h1>
            <p>
              Core system identity, environment, regional settings,
              operational controls and safety boundaries.
            </p>
          </div>

          <div class="gv26a-status">
            <span class="gv26a-dot"></span>
            FRONTEND CONFIGURATION
          </div>
        </div>


        <!-- SYSTEM IDENTITY -->
        <section class="gv26a-card">

          <div class="gv26a-card-title">
            <div>
              <span class="gv26a-number">01</span>
              <h2>System Identity</h2>
            </div>

            <span class="gv26a-badge">CONFIGURATION</span>
          </div>

          <div class="gv26a-grid">

            <div class="gv26a-field">
              <label>System Name</label>
              <input
                id="gv26a-systemName"
                value="${escapeHtml(config.systemName)}"
              >
            </div>

            <div class="gv26a-field">
              <label>Platform Name</label>
              <input
                id="gv26a-platformName"
                value="${escapeHtml(config.platformName)}"
              >
            </div>

            <div class="gv26a-field">
              <label>Environment</label>
              <select id="gv26a-environment">
                <option value="TESTING" ${config.environment === "TESTING" ? "selected" : ""}>
                  TESTING
                </option>
                <option value="STAGING" ${config.environment === "STAGING" ? "selected" : ""}>
                  STAGING
                </option>
                <option value="PRODUCTION" ${config.environment === "PRODUCTION" ? "selected" : ""}>
                  PRODUCTION
                </option>
              </select>
            </div>

            <div class="gv26a-field">
              <label>System Status</label>
              <select id="gv26a-systemStatus">
                <option value="ACTIVE" ${config.systemStatus === "ACTIVE" ? "selected" : ""}>
                  ACTIVE
                </option>
                <option value="PAUSED" ${config.systemStatus === "PAUSED" ? "selected" : ""}>
                  PAUSED
                </option>
                <option value="MAINTENANCE" ${config.systemStatus === "MAINTENANCE" ? "selected" : ""}>
                  MAINTENANCE
                </option>
              </select>
            </div>

          </div>
        </section>


        <!-- ENVIRONMENT & SAFETY -->
        <section class="gv26a-card">

          <div class="gv26a-card-title">
            <div>
              <span class="gv26a-number">02</span>
              <h2>Environment & Safety</h2>
            </div>

            <span class="gv26a-badge gv26a-badge-warning">
              TESTING MODE
            </span>
          </div>

          <div class="gv26a-toggle-grid">

            ${toggle(
              "gv26a-maintenanceMode",
              "Maintenance Mode",
              config.maintenanceMode,
              "Temporarily restrict normal system operations."
            )}

            ${toggle(
              "gv26a-productionLock",
              "Production Lock",
              config.productionLock,
              "Keep production-level operations protected."
            )}

            ${toggle(
              "gv26a-testingMode",
              "Testing Mode",
              config.testingMode,
              "Keep the frontend in controlled testing mode."
            )}

          </div>

          <div class="gv26a-warning">
            <strong>Safety Boundary</strong>
            <p>
              Real Money, Real Payment and Bank Transfer remain blocked.
              Frontend configuration does not become financial authority.
            </p>
          </div>

        </section>


        <!-- API -->
        <section class="gv26a-card">

          <div class="gv26a-card-title">
            <div>
              <span class="gv26a-number">03</span>
              <h2>API Configuration</h2>
            </div>

            <span class="gv26a-badge gv26a-badge-muted">
              NOT CONFIGURED
            </span>
          </div>

          <div class="gv26a-field">

            <label>Consolidated API Endpoint</label>

            <input
              id="gv26a-apiEndpoint"
              placeholder="API endpoint will be configured later"
              value="${escapeHtml(config.apiEndpoint)}"
            >

            <small class="gv26a-help">
              Endpoint configuration is stored locally only.
              No API connection is tested from 26A.
            </small>

          </div>

        </section>


        <!-- REGIONAL -->
        <section class="gv26a-card">

          <div class="gv26a-card-title">
            <div>
              <span class="gv26a-number">04</span>
              <h2>Regional Settings</h2>
            </div>

            <span class="gv26a-badge">INDIA</span>
          </div>

          <div class="gv26a-grid">

            <div class="gv26a-field">
              <label>Default Language</label>

              <select id="gv26a-defaultLanguage">
                <option value="English" ${config.defaultLanguage === "English" ? "selected" : ""}>
                  English
                </option>
                <option value="Hindi" ${config.defaultLanguage === "Hindi" ? "selected" : ""}>
                  Hindi
                </option>
              </select>
            </div>

            <div class="gv26a-field">
              <label>Country</label>

              <input
                id="gv26a-country"
                value="${escapeHtml(config.country)}"
              >
            </div>

            <div class="gv26a-field">
              <label>Currency</label>

              <input
                id="gv26a-currency"
                value="${escapeHtml(config.currency)}"
              >
            </div>

            <div class="gv26a-field">
              <label>Timezone</label>

              <input
                id="gv26a-timezone"
                value="${escapeHtml(config.timezone)}"
              >
            </div>

            <div class="gv26a-field">
              <label>Date Format</label>

              <select id="gv26a-dateFormat">
                <option value="DD-MM-YYYY" ${config.dateFormat === "DD-MM-YYYY" ? "selected" : ""}>
                  DD-MM-YYYY
                </option>
                <option value="MM-DD-YYYY" ${config.dateFormat === "MM-DD-YYYY" ? "selected" : ""}>
                  MM-DD-YYYY
                </option>
                <option value="YYYY-MM-DD" ${config.dateFormat === "YYYY-MM-DD" ? "selected" : ""}>
                  YYYY-MM-DD
                </option>
              </select>
            </div>

            <div class="gv26a-field">
              <label>Time Format</label>

              <select id="gv26a-timeFormat">
                <option value="12-hour" ${config.timeFormat === "12-hour" ? "selected" : ""}>
                  12-hour
                </option>
                <option value="24-hour" ${config.timeFormat === "24-hour" ? "selected" : ""}>
                  24-hour
                </option>
              </select>
            </div>

          </div>

        </section>


        <!-- REGISTRATION & SERVICES -->
        <section class="gv26a-card">

          <div class="gv26a-card-title">
            <div>
              <span class="gv26a-number">05</span>
              <h2>Registration & Services</h2>
            </div>

            <span class="gv26a-badge">CONTROLLED</span>
          </div>

          <div class="gv26a-toggle-grid">

            ${toggle(
              "gv26a-customerRegistration",
              "Customer Registration",
              config.customerRegistration,
              "Allow customer registration workflow."
            )}

            ${toggle(
              "gv26a-vendorRegistration",
              "Vendor Registration",
              config.vendorRegistration,
              "Allow vendor registration workflow."
            )}

            ${toggle(
              "gv26a-driverRegistration",
              "Driver Registration",
              config.driverRegistration,
              "Allow driver registration workflow."
            )}

            ${toggle(
              "gv26a-bookingEnabled",
              "Booking",
              config.bookingEnabled,
              "Enable the booking workflow."
            )}

            ${toggle(
              "gv26a-fareEstimateEnabled",
              "Fare Estimate",
              config.fareEstimateEnabled,
              "Enable customer fare estimation."
            )}

            ${toggle(
              "gv26a-notificationsEnabled",
              "Notifications",
              config.notificationsEnabled,
              "Enable notification-related frontend controls."
            )}

            ${toggle(
              "gv26a-welfareEnabled",
              "Welfare Services",
              config.welfareEnabled,
              "Enable welfare-related platform controls."
            )}

          </div>

        </section>


        <!-- FINANCIAL BOUNDARY -->
        <section class="gv26a-card gv26a-financial">

          <div class="gv26a-card-title">
            <div>
              <span class="gv26a-number">06</span>
              <h2>Financial Safety Boundary</h2>
            </div>

            <span class="gv26a-badge gv26a-badge-danger">
              BLOCKED
            </span>
          </div>

          <div class="gv26a-financial-grid">

            <div class="gv26a-financial-item">
              <strong>REAL MONEY</strong>
              <span>BLOCKED</span>
            </div>

            <div class="gv26a-financial-item">
              <strong>REAL PAYMENT</strong>
              <span>BLOCKED</span>
            </div>

            <div class="gv26a-financial-item">
              <strong>BANK TRANSFER</strong>
              <span>BLOCKED</span>
            </div>

            <div class="gv26a-financial-item">
              <strong>FRONTEND AUTHORITY</strong>
              <span>NO</span>
            </div>

            <div class="gv26a-financial-item">
              <strong>BACKEND AUTHORITY</strong>
              <span>YES</span>
            </div>

          </div>

        </section>


        <!-- ACTION BAR -->
        <section class="gv26a-actions">

          <div>
            <strong>System Configuration</strong>
            <small id="gv26a-saveStatus">
              Changes are stored locally in the browser.
            </small>
          </div>

          <div class="gv26a-action-buttons">

            <button
              type="button"
              class="gv26a-btn gv26a-btn-secondary"
              id="gv26a-reset"
            >
              Reset
            </button>

            <button
              type="button"
              class="gv26a-btn gv26a-btn-primary"
              id="gv26a-save"
            >
              Save Configuration
            </button>

          </div>

        </section>

      </div>


      <style>

        .gv26a {
          max-width: 1250px;
          margin: 0 auto;
          padding: 10px 0 50px;
        }

        .gv26a-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 22px;
        }

        .gv26a-kicker {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.6px;
          opacity: .58;
          margin-bottom: 6px;
        }

        .gv26a-header h1 {
          margin: 0 0 7px;
          font-size: 28px;
          letter-spacing: -.5px;
        }

        .gv26a-header p {
          margin: 0;
          opacity: .68;
          line-height: 1.5;
        }

        .gv26a-status {
          white-space: nowrap;
          padding: 10px 14px;
          border: 1px solid rgba(34,197,94,.25);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .7px;
          background: rgba(34,197,94,.08);
        }

        .gv26a-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          margin-right: 7px;
          vertical-align: 1px;
        }

        .gv26a-card {
          background: rgba(255,255,255,.025);
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 18px;
          padding: 22px;
          margin-bottom: 16px;
          box-shadow: 0 12px 35px rgba(0,0,0,.08);
        }

        .gv26a-card-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .gv26a-card-title > div {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .gv26a-card h2 {
          margin: 0;
          font-size: 17px;
        }

        .gv26a-number {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(255,255,255,.07);
          font-size: 11px;
          font-weight: 800;
        }

        .gv26a-badge {
          padding: 6px 9px;
          border-radius: 7px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .8px;
          background: rgba(59,130,246,.12);
          color: #93c5fd;
        }

        .gv26a-badge-warning {
          background: rgba(245,158,11,.12);
          color: #fbbf24;
        }

        .gv26a-badge-danger {
          background: rgba(239,68,68,.12);
          color: #f87171;
        }

        .gv26a-badge-muted {
          opacity: .65;
        }

        .gv26a-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .gv26a-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .gv26a-field label {
          font-size: 12px;
          font-weight: 750;
          opacity: .78;
        }

        .gv26a-field input,
        .gv26a-field select {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 13px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(0,0,0,.16);
          color: inherit;
          outline: none;
          font: inherit;
        }

        .gv26a-field input:focus,
        .gv26a-field select:focus {
          border-color: rgba(96,165,250,.65);
          box-shadow: 0 0 0 3px rgba(96,165,250,.08);
        }

        .gv26a-help {
          font-size: 11px;
          opacity: .55;
          line-height: 1.4;
        }

        .gv26a-toggle-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .gv26a-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 15px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.07);
          background: rgba(0,0,0,.10);
          cursor: pointer;
        }

        .gv26a-toggle-row span {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .gv26a-toggle-row strong {
          font-size: 12px;
        }

        .gv26a-toggle-row small {
          font-size: 10px;
          opacity: .52;
          line-height: 1.35;
        }

        .gv26a-toggle-row input {
          width: 18px;
          height: 18px;
          accent-color: #3b82f6;
          flex: 0 0 auto;
        }

        .gv26a-warning {
          margin-top: 17px;
          padding: 15px 17px;
          border-radius: 12px;
          background: rgba(245,158,11,.07);
          border: 1px solid rgba(245,158,11,.18);
        }

        .gv26a-warning strong {
          font-size: 12px;
        }

        .gv26a-warning p {
          margin: 5px 0 0;
          font-size: 11px;
          opacity: .65;
          line-height: 1.5;
        }

        .gv26a-financial {
          border-color: rgba(239,68,68,.14);
        }

        .gv26a-financial-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
        }

        .gv26a-financial-item {
          padding: 15px;
          border-radius: 12px;
          background: rgba(239,68,68,.045);
          border: 1px solid rgba(239,68,68,.09);
        }

        .gv26a-financial-item strong {
          display: block;
          font-size: 10px;
          opacity: .62;
          margin-bottom: 7px;
        }

        .gv26a-financial-item span {
          font-size: 12px;
          font-weight: 850;
        }

        .gv26a-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 18px 20px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.025);
        }

        .gv26a-actions strong {
          display: block;
          font-size: 13px;
        }

        .gv26a-actions small {
          display: block;
          margin-top: 4px;
          font-size: 10px;
          opacity: .55;
        }

        .gv26a-action-buttons {
          display: flex;
          gap: 9px;
        }

        .gv26a-btn {
          border: 0;
          border-radius: 10px;
          padding: 11px 16px;
          font: inherit;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .gv26a-btn-primary {
          background: #2563eb;
          color: white;
        }

        .gv26a-btn-secondary {
          background: rgba(255,255,255,.08);
          color: inherit;
        }

        .gv26a-btn:hover {
          transform: translateY(-1px);
        }

        @media (max-width: 850px) {

          .gv26a-header,
          .gv26a-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .gv26a-grid,
          .gv26a-toggle-grid {
            grid-template-columns: 1fr;
          }

          .gv26a-financial-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .gv26a-action-buttons {
            width: 100%;
          }

          .gv26a-btn {
            flex: 1;
          }
        }

        @media (max-width: 520px) {

          .gv26a-card {
            padding: 16px;
          }

          .gv26a-header h1 {
            font-size: 23px;
          }

          .gv26a-financial-grid {
            grid-template-columns: 1fr;
          }

          .gv26a-card-title {
            align-items: flex-start;
          }

        }

      </style>
    `;
  }


  function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : "";
  }

  function getChecked(id) {
    const element = document.getElementById(id);
    return element ? element.checked : false;
  }


  function collect() {

    return {

      systemName: getValue("gv26a-systemName"),
      platformName: getValue("gv26a-platformName"),
      environment: getValue("gv26a-environment"),
      systemStatus: getValue("gv26a-systemStatus"),

      maintenanceMode: getChecked("gv26a-maintenanceMode"),
      productionLock: getChecked("gv26a-productionLock"),
      testingMode: getChecked("gv26a-testingMode"),

      apiEndpoint: getValue("gv26a-apiEndpoint"),

      defaultLanguage: getValue("gv26a-defaultLanguage"),
      country: getValue("gv26a-country"),
      currency: getValue("gv26a-currency"),
      timezone: getValue("gv26a-timezone"),
      dateFormat: getValue("gv26a-dateFormat"),
      timeFormat: getValue("gv26a-timeFormat"),

      customerRegistration:
        getChecked("gv26a-customerRegistration"),

      vendorRegistration:
        getChecked("gv26a-vendorRegistration"),

      driverRegistration:
        getChecked("gv26a-driverRegistration"),

      bookingEnabled:
        getChecked("gv26a-bookingEnabled"),

      fareEstimateEnabled:
        getChecked("gv26a-fareEstimateEnabled"),

      notificationsEnabled:
        getChecked("gv26a-notificationsEnabled"),

      welfareEnabled:
        getChecked("gv26a-welfareEnabled"),

      realMoney: false,
      realPayment: false,
      bankTransfer: false,

      frontendAuthority: false,
      backendAuthority: true
    };
  }


  function bind() {

    const saveButton =
      document.getElementById("gv26a-save");

    const resetButton =
      document.getElementById("gv26a-reset");

    const status =
      document.getElementById("gv26a-saveStatus");


    if (saveButton) {

      saveButton.addEventListener("click", function () {

        const config = collect();

        save(config);

        if (status) {
          status.textContent =
            "Configuration saved successfully on this device.";
        }

        saveButton.textContent = "Saved ✓";

        setTimeout(function () {
          saveButton.textContent = "Save Configuration";
        }, 1500);

      });

    }


    if (resetButton) {

      resetButton.addEventListener("click", function () {

        const confirmed =
          window.confirm(
            "Reset 26A System Configuration to default values?"
          );

        if (!confirmed) return;

        localStorage.removeItem(STORAGE_KEY);

        const mount =
          document.getElementById("module-26A");

        if (mount) {
          mount.innerHTML = render();
          bind();
        }

      });

    }

  }


  function getConfig() {
    return load();
  }


  return {
    render,
    bind,
    getConfig,
    save,
    STORAGE_KEY
  };

})();
