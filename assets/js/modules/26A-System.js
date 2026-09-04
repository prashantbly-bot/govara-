/* =========================================================
   GoVara — 26A System Configuration
   VERSION: GOVARA-26A-V2
   ---------------------------------------------------------
   Frontend-only System Configuration
   Backend / Database / API are NOT connected here.

   Safety:
   - Frontend is NOT financial authority
   - Backend remains authoritative
   - Real Money = BLOCKED
   - Real Payment = BLOCKED
   - Bank Transfer = BLOCKED
   - Production Lock = HARD LOCKED
   ========================================================= */

window.GoVara26A = (function () {

  "use strict";

  /* =======================================================
     CONSTANTS
     ======================================================= */

  const VERSION = "GOVARA-26A-V2";

  const STORAGE_KEY = "GOVARA_SYSTEM_CONFIG_26A_V2";

  const AUDIT_KEY = "GOVARA_SYSTEM_AUDIT_26A_V2";

  const LEGACY_STORAGE_KEY = "GOVARA_SYSTEM_CONFIG_26A_V1";

  /* =======================================================
     LANGUAGE CATALOG
     ======================================================= */

  const LANGUAGE_CATALOG = [
    {
      code: "English",
      name: "English",
      nativeName: "English"
    },
    {
      code: "Hindi",
      name: "Hindi",
      nativeName: "हिन्दी"
    }
  ];

  /* =======================================================
     MODULE CATALOG
     ======================================================= */

  const MODULE_CATALOG = [
    "Customer",
    "Vendor",
    "Driver",
    "Vehicle",
    "Booking",
    "Duty",
    "Fare",
    "Transaction",
    "Wallet",
    "Ledger",
    "Settlement",
    "Billing",
    "Documents",
    "Admin",
    "Audit"
  ];

  /* =======================================================
     DEFAULT CONFIGURATION
     ======================================================= */

  const DEFAULT_CONFIG = {

    systemName: "GoVara",

    platformName:
      "GoVara Transport & Mobility Platform",

    systemVersion: VERSION,

    systemStatus: "ACTIVE",

    environment: "TESTING",

    maintenanceMode: false,

    suspendedMode: false,

    productionLock: true,

    testingMode: true,

    apiEndpoint: "",

    configVersion: VERSION,

    configSource:
      "FRONTEND_LOCAL_CONFIGURATION",

    configurationValidated: false,

    defaultLanguage: "English",

    enabledLanguages: [
      "English",
      "Hindi"
    ],

    country: "India",

    currency: "INR",

    timezone: "Asia/Kolkata",

    dateFormat: "DD-MM-YYYY",

    timeFormat: "12-hour",

    platformEnabled: true,

    customerRegistration: true,

    vendorRegistration: true,

    driverRegistration: true,

    bookingEnabled: true,

    fareEstimateEnabled: true,

    notificationsEnabled: true,

    welfareEnabled: true,

    welfareMasterControl: true,

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

    realMoney: false,

    realPayment: false,

    bankTransfer: false,

    frontendAuthority: false,

    backendAuthority: true,

    auditLogging: true,

    healthMonitoring: true,

    lastAction: "INITIALIZED",

    lastUpdated: null
  };

  /* =======================================================
     INTERNAL STATE
     ======================================================= */

  let config = loadInitialConfig();

  /* =======================================================
     SAFE CLONE
     ======================================================= */

  function clone(value) {

    return JSON.parse(
      JSON.stringify(value)
    );
  }

  /* =======================================================
     LOAD CONFIG
     ======================================================= */

  function loadInitialConfig() {

    try {

      const current =
        localStorage.getItem(STORAGE_KEY);

      if (current) {

        const parsed =
          JSON.parse(current);

        return enforceSafety(
          mergeConfig(
            clone(DEFAULT_CONFIG),
            parsed
          )
        );
      }

      /* -----------------------------------------------
         Legacy V1 migration
         ----------------------------------------------- */

      const legacy =
        localStorage.getItem(
          LEGACY_STORAGE_KEY
        );

      if (legacy) {

        const legacyConfig =
          JSON.parse(legacy);

        const migrated =
          enforceSafety(
            mergeConfig(
              clone(DEFAULT_CONFIG),
              legacyConfig
            )
          );

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(migrated)
        );

        return migrated;
      }

    } catch (error) {

      console.warn(
        "GoVara 26A: configuration load failed.",
        error
      );
    }

    return clone(DEFAULT_CONFIG);
  }

  /* =======================================================
     MERGE CONFIG
     ======================================================= */

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
          mergeConfig(
            base[key],
            incoming[key]
          );

      } else {

        base[key] = incoming[key];
      }

    });

    return base;
  }

  /* =======================================================
     SAFETY ENFORCEMENT
     ======================================================= */

  function enforceSafety(input) {

    const safe =
      clone(input || DEFAULT_CONFIG);

    /*
     * These values are NEVER user-editable
     * from frontend 26A.
     */

    safe.productionLock = true;

    safe.testingMode = true;

    safe.environment = "TESTING";

    safe.realMoney = false;

    safe.realPayment = false;

    safe.bankTransfer = false;

    safe.frontendAuthority = false;

    safe.backendAuthority = true;

    safe.configSource =
      "FRONTEND_LOCAL_CONFIGURATION";

    safe.configVersion = VERSION;

    safe.systemVersion = VERSION;

    /*
     * API remains a configuration placeholder.
     * Actual connection belongs to STEP 27.
     */

    if (
      typeof safe.apiEndpoint !== "string"
    ) {
      safe.apiEndpoint = "";
    }

    /*
     * Validate languages.
     */

    if (
      !Array.isArray(
        safe.enabledLanguages
      )
    ) {

      safe.enabledLanguages =
        clone(
          DEFAULT_CONFIG.enabledLanguages
        );
    }

    safe.enabledLanguages =
      safe.enabledLanguages.filter(
        function (language) {

          return LANGUAGE_CATALOG.some(
            function (item) {
              return item.code === language;
            }
          );
        }
      );

    /*
     * At least English must remain enabled.
     */

    if (
      safe.enabledLanguages.indexOf(
        "English"
      ) === -1
    ) {

      safe.enabledLanguages.unshift(
        "English"
      );
    }

    /*
     * Default language must be enabled.
     */

    if (
      safe.enabledLanguages.indexOf(
        safe.defaultLanguage
      ) === -1
    ) {

      safe.defaultLanguage =
        "English";
    }

    /*
     * Validate modules.
     */

    if (
      !safe.modules ||
      typeof safe.modules !== "object"
    ) {

      safe.modules =
        clone(
          DEFAULT_CONFIG.modules
        );
    }

    MODULE_CATALOG.forEach(
      function (moduleName) {

        safe.modules[moduleName] =
          Boolean(
            safe.modules[moduleName]
          );

      }
    );

    return safe;
  }

  /* =======================================================
     GET CONFIG
     ======================================================= */

  function getConfig() {

    return clone(config);
  }

  /* =======================================================
     VALIDATION
     ======================================================= */

  function validateConfig(input) {

    const target =
      input
        ? enforceSafety(input)
        : enforceSafety(config);

    const errors = [];

    if (!target.systemName) {
      errors.push(
        "System name is required."
      );
    }

    if (!target.platformName) {
      errors.push(
        "Platform name is required."
      );
    }

    if (
      !Array.isArray(
        target.enabledLanguages
      ) ||
      target.enabledLanguages.length === 0
    ) {

      errors.push(
        "At least one language must be enabled."
      );
    }

    if (
      target.enabledLanguages.indexOf(
        target.defaultLanguage
      ) === -1
    ) {

      errors.push(
        "Default language must be enabled."
      );
    }

    if (
      target.environment !== "TESTING"
    ) {

      errors.push(
        "26A V2 must remain in TESTING mode."
      );
    }

    if (
      target.productionLock !== true
    ) {

      errors.push(
        "Production Lock must remain enabled."
      );
    }

    if (
      target.realMoney !== false
    ) {

      errors.push(
        "Real Money must remain BLOCKED."
      );
    }

    if (
      target.realPayment !== false
    ) {

      errors.push(
        "Real Payment must remain BLOCKED."
      );
    }

    if (
      target.bankTransfer !== false
    ) {

      errors.push(
        "Bank Transfer must remain BLOCKED."
      );
    }

    if (
      target.frontendAuthority !== false
    ) {

      errors.push(
        "Frontend cannot be financial authority."
      );
    }

    if (
      target.backendAuthority !== true
    ) {

      errors.push(
        "Backend must remain authoritative."
      );
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /* =======================================================
     SAVE
     ======================================================= */

  function save(nextConfig) {

    const candidate =
      enforceSafety(
        mergeConfig(
          clone(config),
          nextConfig || {}
        )
      );

    const validation =
      validateConfig(candidate);

    if (!validation.valid) {

      return {
        success: false,
        errors: validation.errors
      };
    }

    candidate.configurationValidated =
      true;

    candidate.lastAction =
      "CONFIGURATION_SAVED";

    candidate.lastUpdated =
      new Date().toISOString();

    config = candidate;

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(config)
      );

      createAuditEvent(
        "CONFIGURATION_SAVED",
        "System configuration updated locally."
      );

    } catch (error) {

      console.error(
        "GoVara 26A: save failed.",
        error
      );

      return {
        success: false,
        errors: [
          "Unable to save configuration locally."
        ]
      };
    }

    renderAndBind();

    return {
      success: true,
      config: getConfig()
    };
  }

  /* =======================================================
     RESET
     ======================================================= */

  function reset() {

    config =
      clone(DEFAULT_CONFIG);

    config =
      enforceSafety(config);

    config.lastAction =
      "RESET_TO_DEFAULTS";

    config.lastUpdated =
      new Date().toISOString();

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(config)
      );

      createAuditEvent(
        "CONFIGURATION_RESET",
        "System configuration reset to defaults."
      );

    } catch (error) {

      console.error(
        "GoVara 26A: reset failed.",
        error
      );
    }

    renderAndBind();

    return getConfig();
  }

  /* =======================================================
     RELOAD FROM LOCAL STORAGE
     ======================================================= */

  function reload() {

    try {

      const stored =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (stored) {

        config =
          enforceSafety(
            JSON.parse(stored)
          );

      } else {

        config =
          clone(DEFAULT_CONFIG);
      }

    } catch (error) {

      console.warn(
        "GoVara 26A: reload failed.",
        error
      );

      config =
        clone(DEFAULT_CONFIG);
    }

    renderAndBind();

    return getConfig();
  }

  /* =======================================================
     AUDIT EVENT
     ======================================================= */

  function createAuditEvent(
    action,
    description,
    metadata
  ) {

    if (!config.auditLogging) {
      return null;
    }

    const event = {

      id:
        "26A-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2, 8),

      module: "26A",

      action:
        action || "UNKNOWN_ACTION",

      description:
        description || "",

      metadata:
        metadata || {},

      environment:
        "TESTING",

      timestamp:
        new Date().toISOString()
    };

    let history = [];

    try {

      const stored =
        localStorage.getItem(
          AUDIT_KEY
        );

      if (stored) {

        history =
          JSON.parse(stored);

        if (!Array.isArray(history)) {
          history = [];
        }
      }

    } catch (error) {

      history = [];
    }

    history.unshift(event);

    /*
     * Keep local audit history controlled.
     */

    if (history.length > 100) {
      history = history.slice(0, 100);
    }

    try {

      localStorage.setItem(
        AUDIT_KEY,
        JSON.stringify(history)
      );

    } catch (error) {

      console.warn(
        "GoVara 26A: audit save failed.",
        error
      );
    }

    return event;
  }

  /* =======================================================
     AUDIT HISTORY
     ======================================================= */

  function getAuditHistory() {

    try {

      const stored =
        localStorage.getItem(
          AUDIT_KEY
        );

      if (!stored) {
        return [];
      }

      const history =
        JSON.parse(stored);

      return Array.isArray(history)
        ? history
        : [];

    } catch (error) {

      return [];
    }
  }

  /* =======================================================
     CLEAR AUDIT HISTORY
     ======================================================= */

  function clearAuditHistory() {

    try {

      localStorage.removeItem(
        AUDIT_KEY
      );

      return true;

    } catch (error) {

      console.warn(
        "GoVara 26A: audit clear failed.",
        error
      );

      return false;
    }
  }

  /* =======================================================
     LANGUAGE CONTROL
     ======================================================= */

  function setLanguageEnabled(
    language,
    enabled
  ) {

    const found =
      LANGUAGE_CATALOG.some(
        function (item) {
          return item.code === language;
        }
      );

    if (!found) {
      return {
        success: false,
        error: "Unknown language."
      };
    }

    let languages =
      config.enabledLanguages
        .slice();

    if (enabled) {

      if (
        languages.indexOf(language) === -1
      ) {

        languages.push(language);
      }

    } else {

      /*
       * English cannot be disabled.
       */

      if (language === "English") {

        return {
          success: false,
          error:
            "English must remain enabled."
        };
      }

      /*
       * Do not disable the current
       * default language.
       */

      if (
        language === config.defaultLanguage
      ) {

        return {
          success: false,
          error:
            "Change default language before disabling it."
        };
      }

      languages =
        languages.filter(
          function (item) {
            return item !== language;
          }
        );
    }

    config.enabledLanguages =
      languages;

    config =
      enforceSafety(config);

    config.lastAction =
      enabled
        ? "LANGUAGE_ENABLED"
        : "LANGUAGE_DISABLED";

    config.lastUpdated =
      new Date().toISOString();

    createAuditEvent(
      config.lastAction,
      language +
      " language " +
      (enabled ? "enabled." : "disabled."),
      {
        language: language,
        enabled: enabled
      }
    );

    save(config);

    return {
      success: true,
      config: getConfig()
    };
  }

  /* =======================================================
     DEFAULT LANGUAGE
     ======================================================= */

  function setDefaultLanguage(
    language
  ) {

    if (
      config.enabledLanguages.indexOf(
        language
      ) === -1
    ) {

      return {
        success: false,
        error:
          "Language must be enabled first."
      };
    }

    config.defaultLanguage =
      language;

    config.lastAction =
      "DEFAULT_LANGUAGE_CHANGED";

    config.lastUpdated =
      new Date().toISOString();

    createAuditEvent(
      "DEFAULT_LANGUAGE_CHANGED",
      "Default language changed.",
      {
        language: language
      }
    );

    save(config);

    return {
      success: true,
      config: getConfig()
    };
  }

  /* =======================================================
     MODULE CONTROL
     ======================================================= */

  function setModuleEnabled(
    moduleName,
    enabled
  ) {

    if (
      MODULE_CATALOG.indexOf(
        moduleName
      ) === -1
    ) {

      return {
        success: false,
        error: "Unknown module."
      };
    }

    /*
     * Admin and Audit remain available
     * for the Administrator Control Center.
     */

    if (
      moduleName === "Admin" ||
      moduleName === "Audit"
    ) {

      if (!enabled) {

        return {
          success: false,
          error:
            moduleName +
            " module cannot be disabled from 26A."
        };
      }
    }

    config.modules[moduleName] =
      Boolean(enabled);

    config.lastAction =
      enabled
        ? "MODULE_ENABLED"
        : "MODULE_DISABLED";

    config.lastUpdated =
      new Date().toISOString();

    createAuditEvent(
      config.lastAction,
      moduleName +
      " module " +
      (enabled ? "enabled." : "disabled."),
      {
        module: moduleName,
        enabled: enabled
      }
    );

    save(config);

    return {
      success: true,
      config: getConfig()
    };
  }

  /* =======================================================
     SYSTEM HEALTH
     ======================================================= */

  function getSystemHealth() {

    const validation =
      validateConfig(config);

    const enabledModules =
      MODULE_CATALOG.filter(
        function (moduleName) {
          return config.modules[moduleName];
        }
      );

    return {

      version: VERSION,

      lifecycle:
        "FRONTEND_CONFIGURATION_READY",

      validation:
        validation.valid
          ? "VALID"
          : "INVALID",

      environment:
        config.environment,

      systemStatus:
        config.systemStatus,

      platformEnabled:
        config.platformEnabled,

      apiAuthority:
        "STEP 27 — CONSOLIDATED API",

      backendAuthority:
        config.backendAuthority,

      frontendAuthority:
        config.frontendAuthority,

      financialSafety: {

        realMoney:
          config.realMoney
            ? "ENABLED"
            : "BLOCKED",

        realPayment:
          config.realPayment
            ? "ENABLED"
            : "BLOCKED",

        bankTransfer:
          config.bankTransfer
            ? "ENABLED"
            : "BLOCKED"
      },

      productionLock:
        config.productionLock
          ? "LOCKED"
          : "UNLOCKED",

      testingMode:
        config.testingMode
          ? "ON"
          : "OFF",

      enabledLanguageCount:
        config.enabledLanguages.length,

      enabledModuleCount:
        enabledModules.length,

      totalModuleCount:
        MODULE_CATALOG.length,

      auditLogging:
        config.auditLogging
          ? "ON"
          : "OFF",

      healthMonitoring:
        config.healthMonitoring
          ? "ON"
          : "OFF",

      lastAction:
        config.lastAction,

      lastUpdated:
        config.lastUpdated
    };
  }

  /* =======================================================
     HTML ESCAPE
     ======================================================= */

  function esc(value) {

    return String(
      value === undefined ||
      value === null
        ? ""
        : value
    )
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  }

  /* =======================================================
     OPTION HELPER
     ======================================================= */

  function option(
    value,
    label,
    selected
  ) {

    return (
      '<option value="' +
      esc(value) +
      '"' +
      (
        selected
          ? " selected"
          : ""
      ) +
      ">" +
      esc(label) +
      "</option>"
    );
  }

  /* =======================================================
     BOOLEAN CONTROL
     ======================================================= */

  function boolControl(
    key,
    label,
    checked,
    disabled
  ) {

    return `
      <label class="govara26a-control">
        <input
          type="checkbox"
          data-26a-field="${esc(key)}"
          ${checked ? "checked" : ""}
          ${disabled ? "disabled" : ""}
        >
        <span>${esc(label)}</span>
      </label>
    `;
  }

  /* =======================================================
     LANGUAGE SECTION
     ======================================================= */

  function renderLanguages() {

    return LANGUAGE_CATALOG.map(
      function (language) {

        const enabled =
          config.enabledLanguages.indexOf(
            language.code
          ) !== -1;

        const isDefault =
          config.defaultLanguage ===
          language.code;

        return `
          <div class="card govara26a-language-card">

            <div class="row between">

              <div>
                <b>${esc(language.nativeName)}</b>

                <div class="muted">
                  ${esc(language.name)}
                </div>
              </div>

              <div class="govara26a-language-actions">

                <label class="govara26a-control">

                  <input
                    type="checkbox"
                    data-26a-language="${esc(language.code)}"
                    ${enabled ? "checked" : ""}
                    ${
                      language.code === "English"
                        ? "disabled"
                        : ""
                    }
                  >

                  <span>
                    ${enabled ? "Enabled" : "Disabled"}
                  </span>

                </label>

                <label class="govara26a-control">

                  <input
                    type="radio"
                    name="govara26a-default-language"
                    data-26a-default-language="${esc(language.code)}"
                    ${
                      isDefault
                        ? "checked"
                        : ""
                    }
                  >

                  <span>Default</span>

                </label>

              </div>

            </div>

          </div>
        `;
      }
    ).join("");
  }

  /* =======================================================
     MODULE SECTION
     ======================================================= */

  function renderModules() {

    return MODULE_CATALOG.map(
      function (moduleName) {

        const enabled =
          Boolean(
            config.modules[moduleName]
          );

        const locked =
          moduleName === "Admin" ||
          moduleName === "Audit";

        return `
          <div class="card govara26a-module-card">

            <div class="row between">

              <div>
                <b>${esc(moduleName)}</b>

                <div class="muted">
                  GoVara module
                </div>
              </div>

              <label class="govara26a-control">

                <input
                  type="checkbox"
                  data-26a-module="${esc(moduleName)}"
                  ${
                    enabled
                      ? "checked"
                      : ""
                  }
                  ${
                    locked
                      ? "disabled"
                      : ""
                  }
                >

                <span>
                  ${
                    locked
                      ? "Core"
                      : (
                          enabled
                            ? "Enabled"
                            : "Disabled"
                        )
                  }
                </span>

              </label>

            </div>

          </div>
        `;
      }
    ).join("");
  }

  /* =======================================================
     AUDIT SECTION
     ======================================================= */

  function renderAudit() {

    const history =
      getAuditHistory();

    if (!history.length) {

      return `
        <div class="notice">
          No local 26A audit events yet.
        </div>
      `;
    }

    return history
      .slice(0, 10)
      .map(
        function (event) {

          return `
            <div class="govara26a-audit-row">

              <div>
                <b>${esc(event.action)}</b>

                <div class="muted">
                  ${esc(event.description)}
                </div>
              </div>

              <div class="muted">
                ${esc(event.timestamp)}
              </div>

            </div>
          `;
        }
      )
      .join("");
  }

  /* =======================================================
     MAIN RENDER
     ======================================================= */

  function render() {

    const health =
      getSystemHealth();

    const validation =
      validateConfig(config);

    return `

      <div class="page-head">

        <h1>
          26A — System Configuration
        </h1>

        <div class="muted">
          Frontend system configuration,
          platform settings and safety controls.
        </div>

      </div>

      <!-- ================================================
           STATUS
           ================================================ -->

      <section class="card">

        <h2>System Status</h2>

        <div class="grid four">

          <div>
            <b>${esc(health.systemStatus)}</b>
            <div class="muted">
              System
            </div>
          </div>

          <div>
            <b>${esc(health.environment)}</b>
            <div class="muted">
              Environment
            </div>
          </div>

          <div>
            <b>
              ${esc(health.productionLock)}
            </b>
            <div class="muted">
              Production Lock
            </div>
          </div>

          <div>
            <b>
              ${esc(health.testingMode)}
            </b>
            <div class="muted">
              Testing Mode
            </div>
          </div>

        </div>

        <div class="notice warn">

          API remains
          <b>NOT CONFIGURED</b>.

          STEP 27 owns the
          Consolidated API boundary.

          Backend and Database remain separate.

        </div>

      </section>

      <!-- ================================================
           BASIC SYSTEM CONFIGURATION
           ================================================ -->

      <section class="card">

        <h2>Basic Configuration</h2>

        <div class="grid two">

          <label>

            <span>System Name</span>

            <input
              type="text"
              data-26a-text="systemName"
              value="${esc(config.systemName)}"
            >

          </label>

          <label>

            <span>Platform Name</span>

            <input
              type="text"
              data-26a-text="platformName"
              value="${esc(config.platformName)}"
            >

          </label>

          <label>

            <span>Country</span>

            <input
              type="text"
              data-26a-text="country"
              value="${esc(config.country)}"
            >

          </label>

          <label>

            <span>Currency</span>

            <input
              type="text"
              data-26a-text="currency"
              value="${esc(config.currency)}"
            >

          </label>

          <label>

            <span>Timezone</span>

            <select data-26a-select="timezone">

              ${option(
                "Asia/Kolkata",
                "Asia/Kolkata",
                config.timezone === "Asia/Kolkata"
              )}

              ${option(
                "UTC",
                "UTC",
                config.timezone === "UTC"
              )}

            </select>

          </label>

          <label>

            <span>Date Format</span>

            <select data-26a-select="dateFormat">

              ${option(
                "DD-MM-YYYY",
                "DD-MM-YYYY",
                config.dateFormat === "DD-MM-YYYY"
              )}

              ${option(
                "MM-DD-YYYY",
                "MM-DD-YYYY",
                config.dateFormat === "MM-DD-YYYY"
              )}

              ${option(
                "YYYY-MM-DD",
                "YYYY-MM-DD",
                config.dateFormat === "YYYY-MM-DD"
              )}

            </select>

          </label>

          <label>

            <span>Time Format</span>

            <select data-26a-select="timeFormat">

              ${option(
                "12-hour",
                "12-hour",
                config.timeFormat === "12-hour"
              )}

              ${option(
                "24-hour",
                "24-hour",
                config.timeFormat === "24-hour"
              )}

            </select>

          </label>

          <label>

            <span>Default Language</span>

            <select
              data-26a-select="defaultLanguage"
            >

              ${LANGUAGE_CATALOG
                .filter(
                  function (language) {

                    return (
                      config.enabledLanguages.indexOf(
                        language.code
                      ) !== -1
                    );

                  }
                )
                .map(
                  function (language) {

                    return option(
                      language.code,
                      language.nativeName,
                      config.defaultLanguage ===
                        language.code
                    );

                  }
                )
                .join("")}

            </select>

          </label>

        </div>

      </section>

      <!-- ================================================
           PLATFORM CONTROLS
           ================================================ -->

      <section class="card">

        <h2>Platform Controls</h2>

        <div class="grid two">

          ${boolControl(
            "platformEnabled",
            "Platform Enabled",
            config.platformEnabled,
            false
          )}

          ${boolControl(
            "customerRegistration",
            "Customer Registration",
            config.customerRegistration,
            false
          )}

          ${boolControl(
            "vendorRegistration",
            "Vendor Registration",
            config.vendorRegistration,
            false
          )}

          ${boolControl(
            "driverRegistration",
            "Driver Registration",
            config.driverRegistration,
            false
          )}

          ${boolControl(
            "bookingEnabled",
            "Booking Enabled",
            config.bookingEnabled,
            false
          )}

          ${boolControl(
            "fareEstimateEnabled",
            "Fare Estimate Enabled",
            config.fareEstimateEnabled,
            false
          )}

          ${boolControl(
            "notificationsEnabled",
            "Notifications Enabled",
            config.notificationsEnabled,
            false
          )}

          ${boolControl(
            "welfareEnabled",
            "Welfare Enabled",
            config.welfareEnabled,
            false
          )}

          ${boolControl(
            "welfareMasterControl",
            "Welfare Master Control",
            config.welfareMasterControl,
            false
          )}

          ${boolControl(
            "maintenanceMode",
            "Maintenance Mode",
            config.maintenanceMode,
            false
          )}

          ${boolControl(
            "suspendedMode",
            "Suspended Mode",
            config.suspendedMode,
            false
          )}

        </div>

      </section>

      <!-- ================================================
           LANGUAGE CONTROL
           ================================================ -->

      <section class="card">

        <div class="row between">

          <div>

            <h2>Language Control</h2>

            <div class="muted">
              Enable supported platform languages
              and select the default language.
            </div>

          </div>

        </div>

        <div class="grid two">

          ${renderLanguages()}

        </div>

      </section>

      <!-- ================================================
           MODULE CONTROL
           ================================================ -->

      <section class="card">

        <div class="row between">

          <div>

            <h2>Module Control</h2>

            <div class="muted">
              Enable or disable frontend module visibility.
              Backend authority remains unchanged.
            </div>

          </div>

        </div>

        <div class="grid two">

          ${renderModules()}

        </div>

      </section>

      <!-- ================================================
           FINANCIAL SAFETY
           ================================================ -->

      <section class="card">

        <h2>Financial Safety Boundary</h2>

        <div class="grid four">

          <div>

            <b>BLOCKED</b>

            <div class="muted">
              Real Money
            </div>

          </div>

          <div>

            <b>BLOCKED</b>

            <div class="muted">
              Real Payment
            </div>

          </div>

          <div>

            <b>BLOCKED</b>

            <div class="muted">
              Bank Transfer
            </div>

          </div>

          <div>

            <b>BACKEND</b>

            <div class="muted">
              Financial Authority
            </div>

          </div>

        </div>

        <div class="notice warn">

          Frontend 26A cannot become the
          financial authority.

          Real financial execution remains blocked.

        </div>

      </section>

      <!-- ================================================
           API BOUNDARY
           ================================================ -->

      <section class="card">

        <h2>API Boundary</h2>

        <div class="grid two">

          <div>

            <b>
              ${
                config.apiEndpoint
                  ? "CONFIGURED"
                  : "NOT CONFIGURED"
              }
            </b>

            <div class="muted">
              Endpoint
            </div>

          </div>

          <div>

            <b>
              STEP 27
            </b>

            <div class="muted">
              Consolidated API Authority
            </div>

          </div>

        </div>

        <div class="notice">

          26A does not connect to the
          Backend or Database.

          Do not run API connection tests
          from this module.

        </div>

      </section>

      <!-- ================================================
           HEALTH
           ================================================ -->

      <section class="card">

        <h2>Configuration Health</h2>

        <div class="grid four">

          <div>

            <b>
              ${esc(health.validation)}
            </b>

            <div class="muted">
              Validation
            </div>

          </div>

          <div>

            <b>
              ${esc(
                health.enabledLanguageCount
              )}
            </b>

            <div class="muted">
              Enabled Languages
            </div>

          </div>

          <div>

            <b>
              ${esc(
                health.enabledModuleCount
              )}
              /
              ${esc(
                health.totalModuleCount
              )}
            </b>

            <div class="muted">
              Enabled Modules
            </div>

          </div>

          <div>

            <b>
              ${esc(
                health.lastAction
              )}
            </b>

            <div class="muted">
              Last Action
            </div>

          </div>

        </div>

        ${
          validation.valid
            ? `
              <div class="notice">
                Configuration is valid.
              </div>
            `
            : `
              <div class="notice danger">
                ${validation.errors
                  .map(
                    function (error) {
                      return (
                        "<div>" +
                        esc(error) +
                        "</div>"
                      );
                    }
                  )
                  .join("")}
              </div>
            `
        }

      </section>

      <!-- ================================================
           LOCAL AUDIT
           ================================================ -->

      <section class="card">

        <div class="row between">

          <div>

            <h2>26A Local Audit</h2>

            <div class="muted">
              Frontend configuration audit only.
            </div>

          </div>

          <button
            type="button"
            class="secondary"
            data-26a-action="clear-audit"
          >
            Clear Local Audit
          </button>

        </div>

        <div class="govara26a-audit-list">

          ${renderAudit()}

        </div>

      </section>

      <!-- ================================================
           ACTIONS
           ================================================ -->

      <section class="card">

        <div class="row gap">

          <button
            type="button"
            class="primary"
            data-26a-action="save"
          >
            Save Configuration
          </button>

          <button
            type="button"
            class="secondary"
            data-26a-action="reload"
          >
            Reload
          </button>

          <button
            type="button"
            class="secondary"
            data-26a-action="reset"
          >
            Reset Defaults
          </button>

        </div>

      </section>

      <div class="muted govara26a-version">
        ${esc(VERSION)}
      </div>

    `;
  }

  /* =======================================================
     READ FORM
     ======================================================= */

  function readForm(root) {

    const next =
      clone(config);

    /*
     * Text fields
     */

    root
      .querySelectorAll(
        "[data-26a-text]"
      )
      .forEach(
        function (element) {

          const key =
            element.getAttribute(
              "data-26a-text"
            );

          next[key] =
            element.value;

        }
      );

    /*
     * Select fields
     */

    root
      .querySelectorAll(
        "[data-26a-select]"
      )
      .forEach(
        function (element) {

          const key =
            element.getAttribute(
              "data-26a-select"
            );

          next[key] =
            element.value;

        }
      );

    /*
     * Boolean fields
     */

    root
      .querySelectorAll(
        "[data-26a-field]"
      )
      .forEach(
        function (element) {

          const key =
            element.getAttribute(
              "data-26a-field"
            );

          next[key] =
            element.checked;

        }
      );

    /*
     * Language controls
     */

    root
      .querySelectorAll(
        "[data-26a-language]"
      )
      .forEach(
        function (element) {

          const language =
            element.getAttribute(
              "data-26a-language"
            );

          if (element.checked) {

            if (
              next.enabledLanguages.indexOf(
                language
              ) === -1
            ) {

              next.enabledLanguages.push(
                language
              );
            }

          } else {

            if (language !== "English") {

              next.enabledLanguages =
                next.enabledLanguages.filter(
                  function (item) {
                    return item !== language;
                  }
                );
            }

          }

        }
      );

    /*
     * Module controls
     */

    root
      .querySelectorAll(
        "[data-26a-module]"
      )
      .forEach(
        function (element) {

          const moduleName =
            element.getAttribute(
              "data-26a-module"
            );

          if (
            moduleName === "Admin" ||
            moduleName === "Audit"
          ) {

            next.modules[moduleName] =
              true;

          } else {

            next.modules[moduleName] =
              element.checked;
          }

        }
      );

    return enforceSafety(next);
  }

  /* =======================================================
     BIND
     ======================================================= */

  function bind() {

    const root =
      document.getElementById(
        "module-26A"
      );

    if (!root) {

      console.warn(
        "GoVara 26A: mount #module-26A not found."
      );

      return;
    }

    /*
     * IMPORTANT:
     * All selectors below use valid
     * data attributes.
     *
     * No selector such as:
     * .26a-language-toggle
     *
     * is used anywhere.
     */

    root
      .querySelectorAll(
        "[data-26a-language]"
      )
      .forEach(
        function (element) {

          element.addEventListener(
            "change",
            function () {

              const language =
                element.getAttribute(
                  "data-26a-language"
                );

              setLanguageEnabled(
                language,
                element.checked
              );

            }
          );

        }
      );

    /*
     * Default language
     */

    root
      .querySelectorAll(
        "[data-26a-default-language]"
      )
      .forEach(
        function (element) {

          element.addEventListener(
            "change",
            function () {

              if (!element.checked) {
                return;
              }

              const language =
                element.getAttribute(
                  "data-26a-default-language"
                );

              setDefaultLanguage(
                language
              );

            }
          );

        }
      );

    /*
     * Module controls
     */

    root
      .querySelectorAll(
        "[data-26a-module]"
      )
      .forEach(
        function (element) {

          element.addEventListener(
            "change",
            function () {

              const moduleName =
                element.getAttribute(
                  "data-26a-module"
                );

              setModuleEnabled(
                moduleName,
                element.checked
              );

            }
          );

        }
      );

    /*
     * Save
     */

    const saveButton =
      root.querySelector(
        '[data-26a-action="save"]'
      );

    if (saveButton) {

      saveButton.addEventListener(
        "click",
        function () {

          const next =
            readForm(root);

          const result =
            save(next);

          if (!result.success) {

            alert(
              "26A configuration could not be saved:\n\n" +
              result.errors.join("\n")
            );

            return;
          }

          alert(
            "26A configuration saved successfully."
          );

        }
      );

    }

    /*
     * Reload
     */

    const reloadButton =
      root.querySelector(
        '[data-26a-action="reload"]'
      );

    if (reloadButton) {

      reloadButton.addEventListener(
        "click",
        function () {

          reload();

        }
      );

    }

    /*
     * Reset
     */

    const resetButton =
      root.querySelector(
        '[data-26a-action="reset"]'
      );

    if (resetButton) {

      resetButton.addEventListener(
        "click",
        function () {

          const confirmed =
            window.confirm(
              "Reset 26A System Configuration to defaults?"
            );

          if (!confirmed) {
            return;
          }

          reset();

        }
      );

    }

    /*
     * Clear audit
     */

    const clearAuditButton =
      root.querySelector(
        '[data-26a-action="clear-audit"]'
      );

    if (clearAuditButton) {

      clearAuditButton.addEventListener(
        "click",
        function () {

          const confirmed =
            window.confirm(
              "Clear local 26A audit history?"
            );

          if (!confirmed) {
            return;
          }

          clearAuditHistory();

          createAuditEvent(
            "AUDIT_HISTORY_CLEARED",
            "Local audit history was cleared."
          );

          renderAndBind();

        }
      );

    }

  }

  /* =======================================================
     RENDER + BIND
     ======================================================= */

  function renderAndBind() {

    const mount =
      document.getElementById(
        "module-26A"
      );

    if (!mount) {

      console.warn(
        "GoVara 26A: mount #module-26A not found."
      );

      return;
    }

    try {

      mount.innerHTML =
        render();

      bind();

    } catch (error) {

      console.error(
        "GoVara 26A render error:",
        error
      );

      mount.innerHTML = `
        <div class="notice danger">

          <b>26A System Configuration Error</b>

          <div>
            ${esc(error.message)}
          </div>

        </div>
      `;
    }
  }

  /* =======================================================
     PUBLIC API
     ======================================================= */

  return {

    VERSION: VERSION,

    STORAGE_KEY: STORAGE_KEY,

    AUDIT_KEY: AUDIT_KEY,

    LANGUAGE_CATALOG:
      clone(LANGUAGE_CATALOG),

    MODULE_CATALOG:
      clone(MODULE_CATALOG),

    render: render,

    bind: bind,

    renderAndBind:
      renderAndBind,

    getConfig:
      getConfig,

    save:
      save,

    reset:
      reset,

    reload:
      reload,

    validateConfig:
      validateConfig,

    getSystemHealth:
      getSystemHealth,

    createAuditEvent:
      createAuditEvent,

    getAuditHistory:
      getAuditHistory,

    clearAuditHistory:
      clearAuditHistory,

    setLanguageEnabled:
      setLanguageEnabled,

    setDefaultLanguage:
      setDefaultLanguage,

    setModuleEnabled:
      setModuleEnabled,

    languages:
      function () {
        return clone(
          LANGUAGE_CATALOG
        );
      },

    modules:
      function () {
        return clone(
          MODULE_CATALOG
        );
      }

  };

})();

/* =========================================================
   GLOBAL ALIAS
   ========================================================= */

window.GoVara26A =
  window.GoVara26A;


/* =========================================================
   END — GoVara 26A V2
   ========================================================= */
