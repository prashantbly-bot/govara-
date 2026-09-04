/* ============================================================
   GoVara — 26A System Configuration
   VERSION: GOVARA-26A-V2
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
   - Production Lock = ALWAYS ON
============================================================ */

window.GoVara26A = (function () {

  "use strict";

  const STORAGE_KEY =
    "GOVARA_SYSTEM_CONFIG_26A_V2";

  const LEGACY_STORAGE_KEY =
    "GOVARA_SYSTEM_CONFIG_26A_V1";

  const AUDIT_STORAGE_KEY =
    "GOVARA_SYSTEM_AUDIT_26A_V2";

  const CONFIG_VERSION =
    "GOVARA-26A-V2";


  /* ==========================================================
     MODULE REGISTRY
  ========================================================== */

  const MODULE_DEFINITIONS = [
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


  /* ==========================================================
     DEFAULT CONFIGURATION
  ========================================================== */

  const DEFAULT_CONFIG = {

    /* ---------- SYSTEM IDENTITY ---------- */

    systemName:
      "GoVara",

    platformName:
      "GoVara Transport & Mobility Platform",

    systemVersion:
      "26A-V2",

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
      CONFIG_VERSION,

    configSource:
      "FRONTEND_LOCAL_CONFIGURATION",

    configurationValidated:
      false,


    /* ---------- REGIONAL SETTINGS ---------- */

    defaultLanguage:
      "English",

    enabledLanguages:
      ["English", "Hindi"],

    availableLanguages:
      [
        "English",
        "Hindi"
      ],

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


    /* ---------- AUDIT / HEALTH ---------- */

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

    return JSON.parse(
      JSON.stringify(obj)
    );

  }


  function mergeConfig(base, incoming) {

    if (
      !incoming ||
      typeof incoming !== "object"
    ) {
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

        base[key] =
          incoming[key];

      }

    });

    return base;
  }


  function getStoredConfig() {

    try {

      let stored =
        localStorage.getItem(
          STORAGE_KEY
        );

      let source =
        "V2";


      /*
       * V1 → V2 migration
       */

      if (!stored) {

        stored =
          localStorage.getItem(
            LEGACY_STORAGE_KEY
          );

        source =
          "V1";

      }


      if (!stored) {

        return {
          config:
            clone(DEFAULT_CONFIG),
          source:
            "DEFAULT"
        };

      }


      const parsed =
        JSON.parse(stored);


      const config =
        mergeConfig(
          clone(DEFAULT_CONFIG),
          parsed
        );


      /*
       * Force current V2 metadata
       */

      config.configVersion =
        CONFIG_VERSION;

      config.systemVersion =
        "26A-V2";

      config.configSource =
        "FRONTEND_LOCAL_CONFIGURATION";


      /*
       * Ensure all modules exist
       */

      MODULE_DEFINITIONS.forEach(
        function (moduleName) {

          if (
            typeof config.modules[moduleName]
            !== "boolean"
          ) {

            config.modules[moduleName] =
              true;

          }

        }
      );


      /*
       * Ensure language arrays exist
       */

      if (
        !Array.isArray(
          config.enabledLanguages
        )
      ) {

        config.enabledLanguages =
          ["English", "Hindi"];

      }


      if (
        !Array.isArray(
          config.availableLanguages
        )
      ) {

        config.availableLanguages =
          [
            "English",
            "Hindi"
          ];

      }


      /*
       * Migration write
       */

      if (source === "V1") {

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(config)
        );

      }


      return {
        config:
          config,
        source:
          source
      };

    } catch (error) {

      console.warn(
        "GoVara26A: configuration load failed.",
        error
      );

      return {
        config:
          clone(DEFAULT_CONFIG),
        source:
          "ERROR"
      };

    }

  }


  function getConfig() {

    return getStoredConfig().config;

  }


  /* ==========================================================
     LANGUAGE HELPERS
  ========================================================== */

  function normalizeLanguages(config) {

    if (
      !Array.isArray(
        config.availableLanguages
      )
    ) {

      config.availableLanguages =
        [];

    }


    if (
      !Array.isArray(
        config.enabledLanguages
      )
    ) {

      config.enabledLanguages =
        [];

    }


    config.availableLanguages =
      config.availableLanguages
        .map(function (language) {
          return String(language)
            .trim();
        })
        .filter(Boolean);


    config.enabledLanguages =
      config.enabledLanguages
        .map(function (language) {
          return String(language)
            .trim();
        })
        .filter(Boolean);


    /*
     * Remove duplicates
     */

    config.availableLanguages =
      Array.from(
        new Set(
          config.availableLanguages
        )
      );


    config.enabledLanguages =
      Array.from(
        new Set(
          config.enabledLanguages
        )
      );


    /*
     * Every enabled language must
     * exist in available languages.
     */

    config.enabledLanguages.forEach(
      function (language) {

        if (
          !config.availableLanguages
            .includes(language)
        ) {

          config.availableLanguages
            .push(language);

        }

      }
    );


    /*
     * Default language must remain enabled.
     */

    if (
      config.defaultLanguage &&
      !config.enabledLanguages
        .includes(
          config.defaultLanguage
        )
    ) {

      config.enabledLanguages
        .push(
          config.defaultLanguage
        );

    }

  }


  function addLanguage(language) {

    const config =
      getConfig();

    const name =
      String(language || "")
        .trim();


    if (!name) {

      return {
        success:
          false,
        message:
          "Language name is required."
      };

    }


    if (
      !config.availableLanguages
        .includes(name)
    ) {

      config.availableLanguages
        .push(name);

    }


    if (
      !config.enabledLanguages
        .includes(name)
    ) {

      config.enabledLanguages
        .push(name);

    }


    config.lastAction =
      "LANGUAGE_ADDED";


    return save(config);

  }


  function removeLanguage(language) {

    const config =
      getConfig();

    const name =
      String(language || "")
        .trim();


    if (!name) {

      return {
        success:
          false,
        message:
          "Language name is required."
      };

    }


    if (
      name ===
      config.defaultLanguage
    ) {

      return {
        success:
          false,
        message:
          "Default language cannot be removed."
      };

    }


    config.enabledLanguages =
      config.enabledLanguages
        .filter(function (item) {
          return item !== name;
        });


    config.availableLanguages =
      config.availableLanguages
        .filter(function (item) {
          return item !== name;
        });


    config.lastAction =
      "LANGUAGE_REMOVED";


    return save(config);

  }


  function toggleLanguage(language) {

    const config =
      getConfig();

    const name =
      String(language || "")
        .trim();


    if (!name) {

      return {
        success:
          false,
          message:
            "Language name is required."
      };

    }


    if (
      name ===
      config.defaultLanguage
    ) {

      return {
        success:
          false,
        message:
          "Default language must remain enabled."
      };

    }


    const index =
      config.enabledLanguages
        .indexOf(name);


    if (index >= 0) {

      config.enabledLanguages
        .splice(index, 1);

      config.lastAction =
        "LANGUAGE_DISABLED";

    } else {

      if (
        !config.availableLanguages
          .includes(name)
      ) {

        config.availableLanguages
          .push(name);

      }

      config.enabledLanguages
        .push(name);

      config.lastAction =
        "LANGUAGE_ENABLED";

    }


    return save(config);

  }


  /* ==========================================================
     MODULE HELPERS
  ========================================================== */

  function setModuleEnabled(
    moduleName,
    enabled
  ) {

    const config =
      getConfig();


    if (
      !MODULE_DEFINITIONS
        .includes(moduleName)
    ) {

      return {
        success:
          false,
        message:
          "Unknown GoVara module."
      };

    }


    /*
     * Admin and Audit remain
     * available for control/audit
     * integrity.
     */

    if (
      moduleName === "Admin" ||
      moduleName === "Audit"
    ) {

      if (!enabled) {

        return {
          success:
            false,
          message:
            moduleName +
            " cannot be disabled from 26A."
        };

      }

    }


    config.modules[moduleName] =
      !!enabled;


    config.lastAction =
      enabled
        ? "MODULE_ENABLED"
        : "MODULE_DISABLED";


    return save(config);

  }


  function isModuleEnabled(
    moduleName
  ) {

    const config =
      getConfig();

    return !!(
      config.modules &&
      config.modules[moduleName]
    );

  }


  /* ==========================================================
     VALIDATION
  ========================================================== */

  function validateConfig(config) {

    const errors = [];
    const warnings = [];


    if (!config) {

      errors.push(
        "Configuration is missing."
      );

      return {
        valid:
          false,
        errors:
          errors,
        warnings:
          warnings
      };

    }


    /* ---------- IDENTITY ---------- */

    if (!config.systemName) {

      errors.push(
        "System name is required."
      );

    }


    if (!config.platformName) {

      errors.push(
        "Platform name is required."
      );

    }


    if (!config.systemVersion) {

      errors.push(
        "System version is required."
      );

    }


    if (!config.environment) {

      errors.push(
        "Environment is required."
      );

    }


    if (
      ![
        "TESTING",
        "STAGING",
        "PRODUCTION"
      ].includes(
        config.environment
      )
    ) {

      errors.push(
        "Invalid environment."
      );

    }


    if (!config.systemStatus) {

      errors.push(
        "System status is required."
      );

    }


    if (
      ![
        "ACTIVE",
        "MAINTENANCE",
        "SUSPENDED",
        "INACTIVE"
      ].includes(
        config.systemStatus
      )
    ) {

      errors.push(
        "Invalid system status."
      );

    }


    /* ---------- REGIONAL ---------- */

    if (
      !config.defaultLanguage
    ) {

      errors.push(
        "Default language is required."
      );

    }


    if (
      !Array.isArray(
        config.enabledLanguages
      )
    ) {

      errors.push(
        "Enabled languages must be an array."
      );

    }


    if (
      !Array.isArray(
        config.availableLanguages
      )
    ) {

      errors.push(
        "Available languages must be an array."
      );

    }


    if (
      Array.isArray(
        config.enabledLanguages
      ) &&
      config.defaultLanguage &&
      !config.enabledLanguages
        .includes(
          config.defaultLanguage
        )
    ) {

      errors.push(
        "Default language must be enabled."
      );

    }


    if (!config.country) {

      errors.push(
        "Country is required."
      );

    }


    if (!config.currency) {

      errors.push(
        "Currency is required."
      );

    }


    if (!config.timezone) {

      errors.push(
        "Timezone is required."
      );

    }


    /* ---------- MODULE REGISTRY ---------- */

    if (
      !config.modules ||
      typeof config.modules !== "object"
    ) {

      errors.push(
        "Module registry is invalid."
      );

    } else {

      MODULE_DEFINITIONS.forEach(
        function (moduleName) {

          if (
            typeof config.modules[
              moduleName
            ] !== "boolean"
          ) {

            errors.push(
              "Module state missing: " +
              moduleName
            );

          }

        }
      );

    }


    /* ---------- SAFETY ---------- */

    if (
      config.realMoney !== false
    ) {

      errors.push(
        "Real Money must remain BLOCKED."
      );

    }


    if (
      config.realPayment !== false
    ) {

      errors.push(
        "Real Payment must remain BLOCKED."
      );

    }


    if (
      config.bankTransfer !== false
    ) {

      errors.push(
        "Bank Transfer must remain BLOCKED."
      );

    }


    if (
      config.frontendAuthority !== false
    ) {

      errors.push(
        "Frontend must never become financial authority."
      );

    }


    if (
      config.backendAuthority !== true
    ) {

      errors.push(
        "Backend must remain authoritative."
      );

    }


    if (
      config.productionLock !== true
    ) {

      errors.push(
        "Production Lock must remain enabled."
      );

    }


    /* ---------- ENVIRONMENT GUARDS ---------- */

    if (
      config.environment ===
      "TESTING" &&
      config.testingMode !== true
    ) {

      warnings.push(
        "Testing environment normally uses Testing Mode."
      );

    }


    if (
      config.environment ===
      "PRODUCTION" &&
      config.testingMode === true
    ) {

      errors.push(
        "Testing Mode must be OFF in Production."
      );

    }


    if (
      config.environment ===
      "PRODUCTION" &&
      config.productionLock !== true
    ) {

      errors.push(
        "Production Lock must remain enabled."
      );

    }


    /* ---------- LIFECYCLE GUARDS ---------- */

    if (
      config.maintenanceMode === true &&
      config.systemStatus === "ACTIVE"
    ) {

      warnings.push(
        "Maintenance Mode is ON while system status is ACTIVE."
      );

    }


    if (
      config.suspendedMode === true &&
      config.systemStatus === "ACTIVE"
    ) {

      warnings.push(
        "Suspended Mode is ON while system status is ACTIVE."
      );

    }


    if (
      config.systemStatus ===
      "MAINTENANCE" &&
      config.maintenanceMode !== true
    ) {

      warnings.push(
        "System status is MAINTENANCE but Maintenance Mode is OFF."
      );

    }


    if (
      config.systemStatus ===
      "SUSPENDED" &&
      config.suspendedMode !== true
    ) {

      warnings.push(
        "System status is SUSPENDED but Suspended Mode is OFF."
      );

    }


    if (
      config.platformEnabled !== true &&
      config.systemStatus === "ACTIVE"
    ) {

      warnings.push(
        "Platform is disabled while system status is ACTIVE."
      );

    }


    return {
      valid:
        errors.length === 0,

      errors:
        errors,

      warnings:
        warnings
    };

  }


  /* ==========================================================
     HARD SAFETY NORMALIZATION
  ========================================================== */

  function enforceSafety(config) {

    config.realMoney =
      false;

    config.realPayment =
      false;

    config.bankTransfer =
      false;

    config.frontendAuthority =
      false;

    config.backendAuthority =
      true;

    config.productionLock =
      true;

    config.configVersion =
      CONFIG_VERSION;

    config.systemVersion =
      "26A-V2";

    config.configSource =
      "FRONTEND_LOCAL_CONFIGURATION";


    normalizeLanguages(config);


    /*
     * Admin and Audit are mandatory
     * for configuration integrity.
     */

    if (!config.modules) {

      config.modules = {};

    }


    MODULE_DEFINITIONS.forEach(
      function (moduleName) {

        if (
          typeof config.modules[
            moduleName
          ] !== "boolean"
        ) {

          config.modules[
            moduleName
          ] = true;

        }

      }
    );


    config.modules.Admin =
      true;

    config.modules.Audit =
      true;


    return config;

  }


  /* ==========================================================
     AUDIT STORAGE
  ========================================================== */

  function getAuditHistory() {

    try {

      const stored =
        localStorage.getItem(
          AUDIT_STORAGE_KEY
        );


      if (!stored) {

        return [];

      }


      const parsed =
        JSON.parse(stored);


      return Array.isArray(parsed)
        ? parsed
        : [];

    } catch (error) {

      console.warn(
        "GoVara26A: audit history load failed.",
        error
      );

      return [];

    }

  }


  function writeAuditEvent(
    action,
    details
  ) {

    const config =
      getConfig();


    if (
      config.auditLogging !== true
    ) {

      return null;

    }


    const event =
      createAuditEvent(
        action,
        details
      );


    const history =
      getAuditHistory();


    history.push(event);


    /*
     * Keep latest 200 local events.
     */

    const trimmed =
      history.slice(-200);


    localStorage.setItem(
      AUDIT_STORAGE_KEY,
      JSON.stringify(trimmed)
    );


    return event;

  }


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


  function clearAuditHistory() {

    localStorage.removeItem(
      AUDIT_STORAGE_KEY
    );

    return true;

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


    enforceSafety(current);


    current.lastUpdated =
      new Date().toISOString();


    if (
      !current.lastAction ||
      current.lastAction ===
      "INITIALIZED"
    ) {

      current.lastAction =
        "CONFIGURATION_SAVED";

    }


    const validation =
      validateConfig(current);


    if (!validation.valid) {

      console.error(
        "GoVara26A validation failed:",
        validation.errors
      );


      writeAuditEvent(
        "CONFIGURATION_REJECTED",
        validation.errors.join("; ")
      );


      return {
        success:
          false,

        validation:
          validation
      };

    }


    current.configurationValidated =
      true;


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(current)
    );


    writeAuditEvent(
      current.lastAction,
      "26A configuration saved locally."
    );


    return {

      success:
        true,

      config:
        current,

      validation:
        validation

    };

  }


  /* ==========================================================
     RESET
  ========================================================== */

  function reset() {

    const previous =
      getConfig();


    const config =
      clone(DEFAULT_CONFIG);


    config.lastAction =
      "CONFIGURATION_RESET";


    config.lastUpdated =
      new Date().toISOString();


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(config)
    );


    writeAuditEvent(
      "CONFIGURATION_RESET",
      "26A configuration reset to defaults."
    );


    return clone(config);

  }


  /* ==========================================================
     STATUS / HEALTH
  ========================================================== */

  function getSystemHealth(config) {

    const c =
      config || getConfig();


    const validation =
      validateConfig(c);


    let lifecycle =
      "ACTIVE";


    if (
      c.suspendedMode
    ) {

      lifecycle =
        "SUSPENDED";

    } else if (
      c.maintenanceMode
    ) {

      lifecycle =
        "MAINTENANCE";

    } else if (
      c.platformEnabled !== true
    ) {

      lifecycle =
        "DISABLED";

    } else if (
      c.systemStatus ===
      "INACTIVE"
    ) {

      lifecycle =
        "INACTIVE";

    }


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

      lifecycle:
        lifecycle,

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
          : "DISABLED",

      healthMonitoring:
        c.healthMonitoring
          ? "ENABLED"
          : "DISABLED",

      productionLock:
        c.productionLock
          ? "LOCKED"
          : "ERROR"

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


  function option(
    value,
    label,
    selected
  ) {

    return `
      <option
        value="${esc(value)}"
        ${selected === value
          ? "selected"
          : ""}
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

        <div
          class="govara26a-control-main"
        >

          <label
            class="govara26a-toggle"
            for="${esc(id)}"
          >

            <input
              type="checkbox"
              id="${esc(id)}"
              ${value ? "checked" : ""}
              ${locked ? "disabled" : ""}
            >

            <span
              class="govara26a-switch"
            ></span>

            <span>

              <strong>
                ${esc(label)}
              </strong>

              ${
                description
                  ? `
                    <small>
                      ${esc(description)}
                    </small>
                  `
                  : ""
              }

            </span>

          </label>

          ${
            locked
              ? `
                <span
                  class="govara26a-lock"
                >
                  LOCKED
                </span>
              `
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
      MODULE_DEFINITIONS;


    return `

      <style>

        .govara26a-wrap {
          display:flex;
          flex-direction:column;
          gap:18px;
        }

        .govara26a-head {
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          gap:16px;
          flex-wrap:wrap;
        }

        .govara26a-head h1 {
          margin:0 0 6px;
        }

        .govara26a-head p {
          margin:0;
          opacity:.72;
        }

        .govara26a-statusbar {
          display:grid;
          grid-template-columns:
            repeat(auto-fit,minmax(145px,1fr));
          gap:10px;
        }

        .govara26a-status {
          padding:14px;
          border:1px solid rgba(255,255,255,.08);
          border-radius:14px;
          background:rgba(255,255,255,.035);
        }

        .govara26a-status strong {
          display:block;
          margin-bottom:5px;
        }

        .govara26a-status small {
          opacity:.65;
        }

        .govara26a-grid {
          display:grid;
          grid-template-columns:
            repeat(auto-fit,minmax(280px,1fr));
          gap:16px;
        }

        .govara26a-section {
          padding:20px;
          border:1px solid rgba(255,255,255,.08);
          border-radius:16px;
          background:rgba(255,255,255,.025);
        }

        .govara26a-section h2 {
          margin:0 0 6px;
          font-size:18px;
        }

        .govara26a-section-desc {
          margin:0 0 18px;
          opacity:.62;
          font-size:13px;
        }

        .govara26a-fields {
          display:grid;
          grid-template-columns:
            repeat(auto-fit,minmax(220px,1fr));
          gap:14px;
        }

        .govara26a-field {
          display:flex;
          flex-direction:column;
          gap:7px;
        }

        .govara26a-field label {
          font-size:12px;
          font-weight:700;
          opacity:.72;
        }

        .govara26a-field input,
        .govara26a-field select {
          width:100%;
          box-sizing:border-box;
          padding:11px 12px;
          border-radius:10px;
          border:1px solid rgba(255,255,255,.10);
          background:rgba(0,0,0,.18);
          color:inherit;
          outline:none;
        }

        .govara26a-field input:focus,
        .govara26a-field select:focus {
          border-color:rgba(120,170,255,.55);
        }

        .govara26a-controls {
          display:grid;
          gap:8px;
        }

        .govara26a-control {
          padding:12px;
          border-radius:12px;
          background:rgba(255,255,255,.025);
          border:1px solid rgba(255,255,255,.06);
        }

        .govara26a-control-main {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:10px;
        }

        .govara26a-toggle {
          display:flex;
          align-items:center;
          gap:10px;
          cursor:pointer;
        }

        .govara26a-toggle input {
          display:none;
        }

        .govara26a-switch {
          width:42px;
          height:23px;
          border-radius:20px;
          background:rgba(255,255,255,.15);
          position:relative;
          flex-shrink:0;
        }

        .govara26a-switch::after {
          content:"";
          width:17px;
          height:17px;
          border-radius:50%;
          position:absolute;
          left:3px;
          top:3px;
          background:white;
          transition:.2s;
        }

        .govara26a-toggle input:checked
        + .govara26a-switch {
          background:rgba(70,190,120,.75);
        }

        .govara26a-toggle input:checked
        + .govara26a-switch::after {
          transform:translateX(19px);
        }

        .govara26a-toggle strong {
          display:block;
        }

        .govara26a-toggle small {
          display:block;
          opacity:.58;
          margin-top:2px;
        }

        .govara26a-lock {
          font-size:10px;
          font-weight:800;
          opacity:.55;
        }

        .govara26a-module-grid {
          display:grid;
          grid-template-columns:
            repeat(auto-fit,minmax(190px,1fr));
          gap:10px;
        }

        .govara26a-module {
          padding:12px;
          border-radius:11px;
          background:rgba(255,255,255,.035);
          border:1px solid rgba(255,255,255,.07);
          display:flex;
          flex-direction:column;
          gap:9px;
        }

        .govara26a-module-top {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:8px;
        }

        .govara26a-module span {
          font-weight:700;
          font-size:13px;
        }

        .govara26a-badge {
          font-size:10px;
          padding:4px 7px;
          border-radius:20px;
          font-weight:800;
        }

        .govara26a-on {
          background:rgba(70,190,120,.15);
        }

        .govara26a-off {
          background:rgba(255,90,90,.12);
        }

        .govara26a-module button,
        .govara26a-language button {
          padding:8px 10px;
          border-radius:8px;
          border:1px solid rgba(255,255,255,.09);
          background:rgba(255,255,255,.05);
          color:inherit;
          cursor:pointer;
          font-weight:700;
        }

        .govara26a-safe {
          display:grid;
          grid-template-columns:
            repeat(auto-fit,minmax(190px,1fr));
          gap:10px;
        }

        .govara26a-safe-card {
          padding:15px;
          border-radius:13px;
          background:rgba(255,255,255,.025);
          border:1px solid rgba(255,255,255,.07);
        }

        .govara26a-safe-card strong {
          display:block;
          margin-bottom:6px;
        }

        .govara26a-blocked {
          font-weight:900;
          letter-spacing:.4px;
        }

        .govara26a-health-grid {
          display:grid;
          grid-template-columns:
            repeat(auto-fit,minmax(160px,1fr));
          gap:10px;
        }

        .govara26a-health {
          padding:14px;
          border-radius:12px;
          background:rgba(255,255,255,.03);
        }

        .govara26a-health b {
          display:block;
          margin-bottom:4px;
        }

        .govara26a-health small {
          opacity:.58;
        }

        .govara26a-notice {
          padding:14px 16px;
          border-radius:12px;
          background:rgba(255,190,70,.08);
          border:1px solid rgba(255,190,70,.16);
          font-size:13px;
        }

        .govara26a-error {
          padding:14px 16px;
          border-radius:12px;
          background:rgba(255,80,80,.10);
          border:1px solid rgba(255,80,80,.18);
        }

        .govara26a-actions {
          position:sticky;
          bottom:12px;
          display:flex;
          justify-content:flex-end;
          gap:10px;
          flex-wrap:wrap;
          padding:12px;
          border-radius:15px;
          background:rgba(10,12,18,.92);
          border:1px solid rgba(255,255,255,.09);
          backdrop-filter:blur(12px);
        }

        .govara26a-actions button {
          padding:11px 17px;
          border-radius:10px;
          border:1px solid rgba(255,255,255,.10);
          cursor:pointer;
          background:rgba(255,255,255,.06);
          color:inherit;
          font-weight:800;
        }

        .govara26a-actions button:hover {
          background:rgba(255,255,255,.11);
        }

        .govara26a-save {
          background:rgba(70,150,255,.20)!important;
        }

        .govara26a-meta {
          display:flex;
          justify-content:space-between;
          gap:12px;
          flex-wrap:wrap;
          opacity:.55;
          font-size:12px;
        }

        .govara26a-language {
          display:grid;
          gap:8px;
        }

        .govara26a-language-row {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:10px;
          padding:10px 12px;
          border-radius:10px;
          background:rgba(255,255,255,.025);
          border:1px solid rgba(255,255,255,.06);
        }

        .govara26a-language-actions {
          display:flex;
          gap:6px;
          flex-wrap:wrap;
        }

        .govara26a-language-add {
          display:flex;
          gap:8px;
          margin-top:10px;
        }

        .govara26a-language-add input {
          flex:1;
          min-width:0;
          padding:10px;
          border-radius:9px;
          border:1px solid rgba(255,255,255,.10);
          background:rgba(0,0,0,.18);
          color:inherit;
        }

        .govara26a-audit-list {
          max-height:280px;
          overflow:auto;
          display:grid;
          gap:7px;
          margin-top:14px;
        }

        .govara26a-audit-item {
          padding:10px;
          border-radius:9px;
          background:rgba(255,255,255,.025);
          border:1px solid rgba(255,255,255,.06);
          font-size:12px;
        }

        .govara26a-audit-item b {
          display:block;
          margin-bottom:4px;
        }

        .govara26a-small-btn {
          padding:7px 10px!important;
          font-size:11px;
        }

      </style>


      <div
        class="govara26a-wrap"
        id="govara26a-root"
      >


        <!-- HEADER -->

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


        <!-- HEALTH -->

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
              ${esc(health.lifecycle)}
            </strong>
            <small>
              Lifecycle
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
              ${esc(health.productionLock)}
            </strong>
            <small>
              Production Lock
            </small>
          </div>

        </div>


        <!-- VALIDATION -->

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
                      .map(function (e) {
                        return `
                          <li>
                            ${esc(e)}
                          </li>
                        `;
                      })
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
                  26A V2 is operating as a frontend
                  configuration layer. No backend or
                  database changes are performed here.
                </div>

                ${
                  validation.warnings.length
                    ? `
                      <div style="margin-top:8px;">
                        Warnings:
                        ${validation.warnings
                          .map(esc)
                          .join(" • ")}
                      </div>
                    `
                    : ""
                }

              </div>
            `
        }


        <div class="govara26a-grid">


          <!-- SYSTEM IDENTITY -->

          <section
            class="govara26a-section"
          >

            <h2>
              1. System Identity
            </h2>

            <p class="govara26a-section-desc">
              Core platform identity and lifecycle.
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
                  disabled
                >

              </div>


              <div class="govara26a-field">

                <label>
                  System Status
                </label>

                <select
                  id="26a-systemStatus"
                >

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

                <select
                  id="26a-environment"
                >

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


          <!-- ENVIRONMENT -->

          <section
            class="govara26a-section"
          >

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
                "Hard production safety boundary.",
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


          <!-- API -->

          <section
            class="govara26a-section"
          >

            <h2>
              3. Central Configuration & API
            </h2>

            <p class="govara26a-section-desc">
              Endpoint is only a configuration placeholder.
              Actual API connection belongs to STEP 27.
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
                  value="${esc(CONFIG_VERSION)}"
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
                API STATUS:
                ${
                  c.apiEndpoint
                    ? "CONFIGURED"
                    : "NOT CONFIGURED"
                }
              </strong>

              <div>
                No API connection or test is executed
                from 26A.
              </div>

            </div>

          </section>


          <!-- REGIONAL -->

          <section
            class="govara26a-section"
          >

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

                <select
                  id="26a-defaultLanguage"
                >

                  ${
                    c.availableLanguages
                      .map(function (language) {

                        return option(
                          language,
                          language,
                          c.defaultLanguage
                        );

                      })
                      .join("")
                  }

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

                <select
                  id="26a-dateFormat"
                >

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

                <select
                  id="26a-timeFormat"
                >

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


            <!-- LANGUAGE MANAGER -->

            <div
              class="govara26a-notice"
              style="margin-top:16px;"
            >

              <strong>
                Language Manager
              </strong>

              <div
                class="govara26a-language"
                style="margin-top:10px;"
              >

                ${
                  c.availableLanguages
                    .map(function (language) {

                      const enabled =
                        c.enabledLanguages
                          .includes(language);

                      const isDefault =
                        language ===
                        c.defaultLanguage;

                      return `

                        <div
                          class="govara26a-language-row"
                        >

                          <div>

                            <strong>
                              ${esc(language)}
                            </strong>

                            <div
                              style="
                                opacity:.55;
                                font-size:11px;
                                margin-top:3px;
                              "
                            >
                              ${
                                isDefault
                                  ? "DEFAULT"
                                  : enabled
                                    ? "ENABLED"
                                    : "DISABLED"
                              }
                            </div>

                          </div>

                          <div
                            class="govara26a-language-actions"
                          >

                            ${
                              isDefault
                                ? `
                                  <button
                                    type="button"
                                    disabled
                                  >
                                    DEFAULT
                                  </button>
                                `
                                : `
                                  <button
                                    type="button"
                                    class="26a-language-toggle"
                                    data-language="${esc(language)}"
                                  >
                                    ${
                                      enabled
                                        ? "Disable"
                                        : "Enable"
                                    }
                                  </button>

                                  <button
                                    type="button"
                                    class="26a-language-remove govara26a-small-btn"
                                    data-language="${esc(language)}"
                                  >
                                    Remove
                                  </button>
                                `
                            }

                          </div>

                        </div>

                      `;

                    })
                    .join("")
                }

              </div>


              <div
                class="govara26a-language-add"
              >

                <input
                  id="26a-newLanguage"
                  placeholder="Add language"
                >

                <button
                  type="button"
                  id="26a-addLanguage"
                >
                  + Add Language
                </button>

              </div>


              <small
                style="
                  display:block;
                  margin-top:8px;
                  opacity:.58;
                "
              >
                Translation packs remain frontend-based.
                No translation API/backend is used.
              </small>

            </div>

          </section>


          <!-- PLATFORM -->

          <section
            class="govara26a-section"
          >

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


          <!-- WELFARE -->

          <section
            class="govara26a-section"
          >

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


          <!-- MODULE REGISTRY -->

          <section
            class="govara26a-section"
            style="grid-column:1/-1;"
          >

            <h2>
              7. Module Registry & Controls
            </h2>

            <p class="govara26a-section-desc">
              Frontend module availability registry.
              No backend tables are created or modified.
            </p>

            <div
              class="govara26a-module-grid"
            >

              ${
                modules
                  .map(function (moduleName) {

                    const enabled =
                      !!c.modules[
                        moduleName
                      ];

                    const locked =
                      moduleName === "Admin" ||
                      moduleName === "Audit";


                    return `

                      <div
                        class="govara26a-module"
                      >

                        <div
                          class="govara26a-module-top"
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


                        ${
                          locked

                            ? `
                              <button
                                type="button"
                                disabled
                              >
                                REQUIRED
                              </button>
                            `

                            : `
                              <button
                                type="button"
                                class="26a-module-toggle"
                                data-module="${esc(moduleName)}"
                              >
                                ${
                                  enabled
                                    ? "Disable"
                                    : "Enable"
                                }
                              </button>
                            `
                        }

                      </div>

                    `;

                  })
                  .join("")
              }

            </div>

          </section>


          <!-- FINANCIAL -->

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


          <!-- AUDIT -->

          <section
            class="govara26a-section"
            style="grid-column:1/-1;"
          >

            <h2>
              9. Audit & Health Monitoring
            </h2>

            <p class="govara26a-section-desc">
              Local configuration monitoring and audit
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
                <b>System</b>
                <small>
                  ${esc(health.system)}
                </small>
              </div>

              <div class="govara26a-health">
                <b>Configuration</b>
                <small>
                  ${esc(health.configuration)}
                </small>
              </div>

              <div class="govara26a-health">
                <b>Lifecycle</b>
                <small>
                  ${esc(health.lifecycle)}
                </small>
              </div>

              <div class="govara26a-health">
                <b>API</b>
                <small>
                  ${esc(health.api)}
                </small>
              </div>

              <div class="govara26a-health">
                <b>Financial</b>
                <small>
                  ${esc(health.financial)}
                </small>
              </div>

              <div class="govara26a-health">
                <b>Backend</b>
                <small>
                  AUTHORITATIVE
                </small>
              </div>

              <div class="govara26a-health">
                <b>Production Lock</b>
                <small>
                  ${esc(health.productionLock)}
                </small>
              </div>

            </div>


            <!-- LOCAL AUDIT HISTORY -->

            <div
              class="govara26a-notice"
              style="margin-top:16px;"
            >

              <strong>
                Local Audit History
              </strong>

              <div
                id="26a-audit-history"
                class="govara26a-audit-list"
              >
                Loading...
              </div>

              <button
                type="button"
                id="26a-clearAudit"
                style="
                  margin-top:10px;
                  padding:8px 12px;
                  border-radius:8px;
                  border:1px solid rgba(255,255,255,.09);
                  background:rgba(255,255,255,.05);
                  color:inherit;
                  cursor:pointer;
                  font-weight:700;
                "
              >
                Clear Local Audit
              </button>

            </div>

          </section>


        </div>


        <!-- ACTION BAR -->

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
            ${esc(CONFIG_VERSION)}
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
      value(
        "26a-systemName"
      );

    config.platformName =
      value(
        "26a-platformName"
      );

    config.systemStatus =
      value(
        "26a-systemStatus"
      );

    config.environment =
      value(
        "26a-environment"
      );


    /* ---------- SAFETY ---------- */

    config.maintenanceMode =
      checked(
        "26a-maintenanceMode"
      );

    config.suspendedMode =
      checked(
        "26a-suspendedMode"
      );

    config.testingMode =
      checked(
        "26a-testingMode"
      );

    config.platformEnabled =
      checked(
        "26a-platformEnabled"
      );


    /*
     * Production Lock is always hard enforced.
     */

    config.productionLock =
      true;


    /* ---------- API ---------- */

    config.apiEndpoint =
      value(
        "26a-apiEndpoint"
      );


    /* ---------- REGIONAL ---------- */

    config.defaultLanguage =
      value(
        "26a-defaultLanguage"
      );

    config.country =
      value(
        "26a-country"
      );

    config.currency =
      value(
        "26a-currency"
      );

    config.timezone =
      value(
        "26a-timezone"
      );

    config.dateFormat =
      value(
        "26a-dateFormat"
      );

    config.timeFormat =
      value(
        "26a-timeFormat"
      );


    /* ---------- SERVICES ---------- */

    config.customerRegistration =
      checked(
        "26a-customerRegistration"
      );

    config.vendorRegistration =
      checked(
        "26a-vendorRegistration"
      );

    config.driverRegistration =
      checked(
        "26a-driverRegistration"
      );

    config.bookingEnabled =
      checked(
        "26a-bookingEnabled"
      );

    config.fareEstimateEnabled =
      checked(
        "26a-fareEstimateEnabled"
      );

    config.notificationsEnabled =
      checked(
        "26a-notificationsEnabled"
      );


    /* ---------- WELFARE ---------- */

    config.welfareEnabled =
      checked(
        "26a-welfareEnabled"
      );

    config.welfareMasterControl =
      checked(
        "26a-welfareMasterControl"
      );


    /* ---------- AUDIT ---------- */

    config.auditLogging =
      checked(
        "26a-auditLogging"
      );

    config.healthMonitoring =
      checked(
        "26a-healthMonitoring"
      );


    /* ---------- HARD SAFETY ---------- */

    enforceSafety(config);


    return config;

  }


  /* ==========================================================
     AUDIT UI
  ========================================================== */

  function renderAuditHistory() {

    const mount =
      document.getElementById(
        "26a-audit-history"
      );


    if (!mount) {
      return;
    }


    const history =
      getAuditHistory()
        .slice()
        .reverse();


    if (!history.length) {

      mount.innerHTML =
        `
          <div
            style="
              opacity:.55;
              padding:8px 0;
            "
          >
            No local audit events yet.
          </div>
        `;

      return;

    }


    mount.innerHTML =
      history
        .map(function (event) {

          return `

            <div
              class="govara26a-audit-item"
            >

              <b>
                ${esc(event.action)}
              </b>

              <div>
                ${esc(event.details)}
              </div>

              <div
                style="
                  opacity:.45;
                  margin-top:4px;
                "
              >
                ${esc(event.timestamp)}
              </div>

            </div>

          `;

        })
        .join("");

  }


  /* ==========================================================
     BIND EVENTS
  ========================================================== */

  function bind() {

    const saveButton =
      document.getElementById(
        "26a-save"
      );


    const resetButton =
      document.getElementById(
        "26a-reset"
      );


    const reloadButton =
      document.getElementById(
        "26a-reload"
      );


    /* ---------- SAVE ---------- */

    if (saveButton) {

      saveButton.onclick =
        function () {

          const config =
            readForm();


          /*
           * Lifecycle normalization.
           */

          if (
            config.maintenanceMode
          ) {

            config.systemStatus =
              "MAINTENANCE";

          }


          if (
            config.suspendedMode
          ) {

            config.systemStatus =
              "SUSPENDED";

          }


          const result =
            save(config);


          if (!result.success) {

            alert(
              "Configuration validation failed:\n\n" +
              result.validation.errors
                .join("\n")
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


          setTimeout(
            function () {

              saveButton.textContent =
                "Save Configuration";

            },
            1600
          );


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


    /* ---------- LANGUAGE ADD ---------- */

    const addLanguageButton =
      document.getElementById(
        "26a-addLanguage"
      );


    if (addLanguageButton) {

      addLanguageButton.onclick =
        function () {

          const input =
            document.getElementById(
              "26a-newLanguage"
            );


          const language =
            input
              ? input.value.trim()
              : "";


          if (!language) {

            alert(
              "Please enter a language name."
            );

            return;

          }


          const result =
            addLanguage(language);


          if (!result.success) {

            alert(
              result.message ||
              "Unable to add language."
            );

            return;

          }


          renderAndBind();

        };

    }


    /* ---------- LANGUAGE TOGGLE ---------- */

    document
      .querySelectorAll(
        ".26a-language-toggle"
      )
      .forEach(
        function (button) {

          button.onclick =
            function () {

              const language =
                button.dataset.language;


              const result =
                toggleLanguage(
                  language
                );


              if (!result.success) {

                alert(
                  result.message ||
                  "Unable to change language."
                );

                return;

              }


              renderAndBind();

            };

        }
      );


    /* ---------- LANGUAGE REMOVE ---------- */

    document
      .querySelectorAll(
        ".26a-language-remove"
      )
      .forEach(
        function (button) {

          button.onclick =
            function () {

              const language =
                button.dataset.language;


              const confirmed =
                window.confirm(
                  "Remove language '" +
                  language +
                  "'?"
                );


              if (!confirmed) {
                return;
              }


              const result =
                removeLanguage(
                  language
                );


              if (!result.success) {

                alert(
                  result.message ||
                  "Unable to remove language."
                );

                return;

              }


              renderAndBind();

            };

        }
      );


    /* ---------- MODULE TOGGLE ---------- */

    document
      .querySelectorAll(
        ".26a-module-toggle"
      )
      .forEach(
        function (button) {

          button.onclick =
            function () {

              const moduleName =
                button.dataset.module;


              const config =
                getConfig();


              const current =
                !!config.modules[
                  moduleName
                ];


              const result =
                setModuleEnabled(
                  moduleName,
                  !current
                );


              if (!result.success) {

                alert(
                  result.message ||
                  "Unable to change module."
                );

                return;

              }


              renderAndBind();

            };

        }
      );


    /* ---------- CLEAR AUDIT ---------- */

    const clearAuditButton =
      document.getElementById(
        "26a-clearAudit"
      );


    if (clearAuditButton) {

      clearAuditButton.onclick =
        function () {

          const confirmed =
            window.confirm(
              "Clear all local 26A audit history?"
            );


          if (!confirmed) {
            return;
          }


          clearAuditHistory();


          renderAuditHistory();

        };

    }


    renderAuditHistory();

  }


  /* ==========================================================
     RENDER + BIND
  ========================================================== */

  function renderAndBind() {

    const mount =
      document.getElementById(
        "module-26A"
      );


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

    getAuditHistory:
      getAuditHistory,

    clearAuditHistory:
      clearAuditHistory,

    addLanguage:
      addLanguage,

    removeLanguage:
      removeLanguage,

    toggleLanguage:
      toggleLanguage,

    setModuleEnabled:
      setModuleEnabled,

    isModuleEnabled:
      isModuleEnabled,

    permissions:
      MODULE_DEFINITIONS,

    modules:
      MODULE_DEFINITIONS,

    STORAGE_KEY:
      STORAGE_KEY,

    AUDIT_STORAGE_KEY:
      AUDIT_STORAGE_KEY,

    VERSION:
      CONFIG_VERSION

  };

})();
