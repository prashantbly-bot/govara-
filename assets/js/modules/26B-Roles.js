/* =========================================================
   GoVara — 26B User & Role Control
   VERSION: GOVARA-26B-V2
   ---------------------------------------------------------
   Frontend-only Role & Permission Configuration

   Authority:
   - Backend remains authoritative
   - Frontend is NOT authority
   - API belongs to STEP 27
   - Database remains separate

   Financial Safety:
   - Real Money = BLOCKED
   - Real Payment = BLOCKED
   - Bank Transfer = BLOCKED
   ========================================================= */

window.GoVara26B = (function () {

  "use strict";

  /* =======================================================
     CONSTANTS
     ======================================================= */

  const VERSION = "GOVARA-26B-V2";

  const STORAGE_KEY =
    "GOVARA_USER_ROLE_CONTROL_26B_V2";

  const AUDIT_KEY =
    "GOVARA_USER_ROLE_AUDIT_26B_V2";

  const LEGACY_STORAGE_KEY =
    "GOVARA_USER_ROLE_CONTROL_26B_V1";

  /* =======================================================
     CORE ROLES
     ======================================================= */

  const ROLE_CATALOG = [
    "Admin",
    "Customer",
    "Vendor",
    "Driver"
  ];

  /* =======================================================
     PERMISSION CATALOG
     ======================================================= */

  const PERMISSION_CATALOG = [

    {
      group: "Platform",
      permissions: [
        "VIEW_DASHBOARD",
        "VIEW_PROFILE",
        "EDIT_PROFILE",
        "VIEW_NOTIFICATIONS"
      ]
    },

    {
      group: "Customer",
      permissions: [
        "CUSTOMER_REGISTER",
        "CUSTOMER_LOGIN",
        "CUSTOMER_PROFILE_VIEW",
        "CUSTOMER_PROFILE_EDIT",
        "CUSTOMER_CREATE_BOOKING",
        "CUSTOMER_VIEW_BOOKING",
        "CUSTOMER_CANCEL_BOOKING",
        "CUSTOMER_VIEW_FARE_ESTIMATE",
        "CUSTOMER_VIEW_TRANSACTION",
        "CUSTOMER_VIEW_WALLET",
        "CUSTOMER_VIEW_BILLING",
        "CUSTOMER_VIEW_DOCUMENTS",
        "CUSTOMER_RATE_DRIVER",
        "CUSTOMER_RATE_VENDOR",
        "CUSTOMER_RATE_GOVARA"
      ]
    },

    {
      group: "Vendor",
      permissions: [
        "VENDOR_REGISTER",
        "VENDOR_LOGIN",
        "VENDOR_PROFILE_VIEW",
        "VENDOR_PROFILE_EDIT",
        "VENDOR_VIEW_BOOKINGS",
        "VENDOR_ACCEPT_BOOKING",
        "VENDOR_REJECT_BOOKING",
        "VENDOR_ASSIGN_DRIVER",
        "VENDOR_ASSIGN_VEHICLE",
        "VENDOR_VIEW_DUTY",
        "VENDOR_VIEW_TRANSACTION",
        "VENDOR_VIEW_SETTLEMENT",
        "VENDOR_VIEW_BILLING",
        "VENDOR_VIEW_DOCUMENTS",
        "VENDOR_RATE_GOVARA"
      ]
    },

    {
      group: "Driver",
      permissions: [
        "DRIVER_REGISTER",
        "DRIVER_LOGIN",
        "DRIVER_PROFILE_VIEW",
        "DRIVER_PROFILE_EDIT",
        "DRIVER_VIEW_DUTY",
        "DRIVER_CHANGE_DUTY",
        "DRIVER_VIEW_ASSIGNED_BOOKING",
        "DRIVER_ACCEPT_BOOKING",
        "DRIVER_REJECT_BOOKING",
        "DRIVER_UPDATE_TRIP",
        "DRIVER_UPDATE_LOCATION",
        "DRIVER_VIEW_VEHICLE",
        "DRIVER_VIEW_TRANSACTION",
        "DRIVER_VIEW_DOCUMENTS",
        "DRIVER_RATE_GOVARA"
      ]
    },

    {
      group: "Vehicle",
      permissions: [
        "VEHICLE_VIEW",
        "VEHICLE_ADD",
        "VEHICLE_EDIT",
        "VEHICLE_ASSIGN",
        "VEHICLE_UNASSIGN",
        "VEHICLE_MAINTENANCE_VIEW",
        "VEHICLE_DOCUMENT_VIEW"
      ]
    },

    {
      group: "Booking",
      permissions: [
        "BOOKING_VIEW",
        "BOOKING_CREATE",
        "BOOKING_EDIT",
        "BOOKING_ASSIGN",
        "BOOKING_REASSIGN",
        "BOOKING_CANCEL",
        "BOOKING_STATUS_UPDATE"
      ]
    },

    {
      group: "Fare",
      permissions: [
        "FARE_VIEW",
        "FARE_ESTIMATE",
        "FARE_POLICY_VIEW"
      ]
    },

    {
      group: "Transaction",
      permissions: [
        "TRANSACTION_VIEW",
        "TRANSACTION_CREATE_TEST",
        "TRANSACTION_VIEW_HISTORY"
      ]
    },

    {
      group: "Wallet",
      permissions: [
        "WALLET_VIEW",
        "WALLET_TEST_CREDIT",
        "WALLET_TEST_DEBIT",
        "WALLET_VIEW_HISTORY"
      ]
    },

    {
      group: "Ledger",
      permissions: [
        "LEDGER_VIEW"
      ]
    },

    {
      group: "Settlement",
      permissions: [
        "SETTLEMENT_VIEW",
        "SETTLEMENT_REQUEST",
        "SETTLEMENT_HISTORY"
      ]
    },

    {
      group: "Billing",
      permissions: [
        "BILLING_VIEW",
        "BILLING_HISTORY",
        "BILLING_DOCUMENT_VIEW"
      ]
    },

    {
      group: "Documents",
      permissions: [
        "DOCUMENT_VIEW",
        "DOCUMENT_UPLOAD",
        "DOCUMENT_UPDATE",
        "DOCUMENT_KYC_VIEW",
        "DOCUMENT_KYC_SUBMIT"
      ]
    },

    {
      group: "Admin",
      permissions: [
        "ADMIN_DASHBOARD",
        "ADMIN_USER_VIEW",
        "ADMIN_USER_MANAGE",
        "ADMIN_ROLE_VIEW",
        "ADMIN_ROLE_MANAGE",
        "ADMIN_POLICY_VIEW",
        "ADMIN_POLICY_MANAGE",
        "ADMIN_OPERATION_VIEW",
        "ADMIN_OPERATION_MANAGE",
        "ADMIN_FINANCIAL_VIEW",
        "ADMIN_DOCUMENT_VIEW",
        "ADMIN_AUDIT_VIEW",
        "ADMIN_SYSTEM_CONFIG"
      ]
    },

    {
      group: "Audit",
      permissions: [
        "AUDIT_VIEW",
        "AUDIT_EXPORT"
      ]
    }

  ];

  /* =======================================================
     DEFAULT ROLE PERMISSIONS
     ======================================================= */

  const DEFAULT_ROLE_PERMISSIONS = {

    Admin: [

      "VIEW_DASHBOARD",
      "VIEW_PROFILE",
      "EDIT_PROFILE",
      "VIEW_NOTIFICATIONS",

      "ADMIN_DASHBOARD",
      "ADMIN_USER_VIEW",
      "ADMIN_USER_MANAGE",
      "ADMIN_ROLE_VIEW",
      "ADMIN_ROLE_MANAGE",
      "ADMIN_POLICY_VIEW",
      "ADMIN_POLICY_MANAGE",
      "ADMIN_OPERATION_VIEW",
      "ADMIN_OPERATION_MANAGE",
      "ADMIN_FINANCIAL_VIEW",
      "ADMIN_DOCUMENT_VIEW",
      "ADMIN_AUDIT_VIEW",
      "ADMIN_SYSTEM_CONFIG",

      "AUDIT_VIEW",
      "AUDIT_EXPORT",

      "VEHICLE_VIEW",
      "VEHICLE_ADD",
      "VEHICLE_EDIT",
      "VEHICLE_ASSIGN",
      "VEHICLE_UNASSIGN",
      "VEHICLE_MAINTENANCE_VIEW",
      "VEHICLE_DOCUMENT_VIEW",

      "BOOKING_VIEW",
      "BOOKING_CREATE",
      "BOOKING_EDIT",
      "BOOKING_ASSIGN",
      "BOOKING_REASSIGN",
      "BOOKING_CANCEL",
      "BOOKING_STATUS_UPDATE",

      "FARE_VIEW",
      "FARE_ESTIMATE",
      "FARE_POLICY_VIEW",

      "TRANSACTION_VIEW",
      "TRANSACTION_VIEW_HISTORY",

      "WALLET_VIEW",
      "WALLET_VIEW_HISTORY",

      "LEDGER_VIEW",

      "SETTLEMENT_VIEW",
      "SETTLEMENT_HISTORY",

      "BILLING_VIEW",
      "BILLING_HISTORY",
      "BILLING_DOCUMENT_VIEW",

      "DOCUMENT_VIEW",
      "DOCUMENT_UPLOAD",
      "DOCUMENT_UPDATE",
      "DOCUMENT_KYC_VIEW",
      "DOCUMENT_KYC_SUBMIT"

    ],

    Customer: [

      "VIEW_DASHBOARD",
      "VIEW_PROFILE",
      "EDIT_PROFILE",
      "VIEW_NOTIFICATIONS",

      "CUSTOMER_REGISTER",
      "CUSTOMER_LOGIN",
      "CUSTOMER_PROFILE_VIEW",
      "CUSTOMER_PROFILE_EDIT",
      "CUSTOMER_CREATE_BOOKING",
      "CUSTOMER_VIEW_BOOKING",
      "CUSTOMER_CANCEL_BOOKING",
      "CUSTOMER_VIEW_FARE_ESTIMATE",
      "CUSTOMER_VIEW_TRANSACTION",
      "CUSTOMER_VIEW_WALLET",
      "CUSTOMER_VIEW_BILLING",
      "CUSTOMER_VIEW_DOCUMENTS",
      "CUSTOMER_RATE_DRIVER",
      "CUSTOMER_RATE_VENDOR",
      "CUSTOMER_RATE_GOVARA",

      "FARE_VIEW",
      "FARE_ESTIMATE",

      "TRANSACTION_VIEW",
      "TRANSACTION_VIEW_HISTORY",

      "WALLET_VIEW",
      "WALLET_TEST_CREDIT",
      "WALLET_TEST_DEBIT",
      "WALLET_VIEW_HISTORY",

      "BILLING_VIEW",
      "BILLING_HISTORY",
      "BILLING_DOCUMENT_VIEW",

      "DOCUMENT_VIEW",
      "DOCUMENT_KYC_VIEW",
      "DOCUMENT_KYC_SUBMIT"

    ],

    Vendor: [

      "VIEW_DASHBOARD",
      "VIEW_PROFILE",
      "EDIT_PROFILE",
      "VIEW_NOTIFICATIONS",

      "VENDOR_REGISTER",
      "VENDOR_LOGIN",
      "VENDOR_PROFILE_VIEW",
      "VENDOR_PROFILE_EDIT",
      "VENDOR_VIEW_BOOKINGS",
      "VENDOR_ACCEPT_BOOKING",
      "VENDOR_REJECT_BOOKING",
      "VENDOR_ASSIGN_DRIVER",
      "VENDOR_ASSIGN_VEHICLE",
      "VENDOR_VIEW_DUTY",
      "VENDOR_VIEW_TRANSACTION",
      "VENDOR_VIEW_SETTLEMENT",
      "VENDOR_VIEW_BILLING",
      "VENDOR_VIEW_DOCUMENTS",
      "VENDOR_RATE_GOVARA",

      "BOOKING_VIEW",
      "BOOKING_ASSIGN",
      "BOOKING_REASSIGN",
      "BOOKING_STATUS_UPDATE",

      "VEHICLE_VIEW",
      "VEHICLE_ASSIGN",
      "VEHICLE_UNASSIGN",

      "FARE_VIEW",
      "FARE_ESTIMATE",

      "TRANSACTION_VIEW",
      "TRANSACTION_VIEW_HISTORY",

      "SETTLEMENT_VIEW",
      "SETTLEMENT_REQUEST",
      "SETTLEMENT_HISTORY",

      "BILLING_VIEW",
      "BILLING_HISTORY",

      "DOCUMENT_VIEW",
      "DOCUMENT_UPLOAD",
      "DOCUMENT_UPDATE",
      "DOCUMENT_KYC_VIEW",
      "DOCUMENT_KYC_SUBMIT"

    ],

    Driver: [

      "VIEW_DASHBOARD",
      "VIEW_PROFILE",
      "EDIT_PROFILE",
      "VIEW_NOTIFICATIONS",

      "DRIVER_REGISTER",
      "DRIVER_LOGIN",
      "DRIVER_PROFILE_VIEW",
      "DRIVER_PROFILE_EDIT",
      "DRIVER_VIEW_DUTY",
      "DRIVER_CHANGE_DUTY",
      "DRIVER_VIEW_ASSIGNED_BOOKING",
      "DRIVER_ACCEPT_BOOKING",
      "DRIVER_REJECT_BOOKING",
      "DRIVER_UPDATE_TRIP",
      "DRIVER_UPDATE_LOCATION",
      "DRIVER_VIEW_VEHICLE",
      "DRIVER_VIEW_TRANSACTION",
      "DRIVER_VIEW_DOCUMENTS",
      "DRIVER_RATE_GOVARA",

      "BOOKING_VIEW",
      "BOOKING_STATUS_UPDATE",

      "VEHICLE_VIEW",

      "FARE_VIEW",

      "TRANSACTION_VIEW",
      "TRANSACTION_VIEW_HISTORY",

      "DOCUMENT_VIEW",
      "DOCUMENT_KYC_VIEW",
      "DOCUMENT_KYC_SUBMIT"

    ]

  };

  /* =======================================================
     DEFAULT CONFIG
     ======================================================= */

  const DEFAULT_CONFIG = {

    version: VERSION,

    environment: "TESTING",

    roleControlEnabled: true,

    registrationControlEnabled: true,

    kycControlEnabled: true,

    permissionControlEnabled: true,

    roles: {

      Admin: {
        enabled: true,
        registrationEnabled: true,
        kycRequired: true,
        permissions:
          DEFAULT_ROLE_PERMISSIONS.Admin.slice()
      },

      Customer: {
        enabled: true,
        registrationEnabled: true,
        kycRequired: false,
        permissions:
          DEFAULT_ROLE_PERMISSIONS.Customer.slice()
      },

      Vendor: {
        enabled: true,
        registrationEnabled: true,
        kycRequired: true,
        permissions:
          DEFAULT_ROLE_PERMISSIONS.Vendor.slice()
      },

      Driver: {
        enabled: true,
        registrationEnabled: true,
        kycRequired: true,
        permissions:
          DEFAULT_ROLE_PERMISSIONS.Driver.slice()
      }

    },

    security: {

      selfRoleChangeAllowed: false,

      frontendAuthority: false,

      backendAuthority: true,

      roleEnforcementBackend: true,

      permissionEnforcementBackend: true,

      sessionAuthority: "BACKEND",

      identityAuthority: "BACKEND"

    },

    financialSafety: {

      realMoney: false,

      realPayment: false,

      bankTransfer: false,

      frontendFinancialAuthority: false,

      backendFinancialAuthority: true

    },

    audit: {

      enabled: true,

      localHistoryEnabled: true,

      maxLocalEvents: 100

    },

    lastAction: "INITIALIZED",

    lastUpdated: null

  };

  /* =======================================================
     INTERNAL STATE
     ======================================================= */

  let config = loadInitialConfig();

  /* =======================================================
     CLONE
     ======================================================= */

  function clone(value) {

    return JSON.parse(
      JSON.stringify(value)
    );

  }

  /* =======================================================
     MERGE
     ======================================================= */

  function mergeConfig(base, incoming) {

    if (
      !incoming ||
      typeof incoming !== "object"
    ) {
      return base;
    }

    Object.keys(incoming)
      .forEach(function (key) {

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

  /* =======================================================
     LOAD INITIAL CONFIG
     ======================================================= */

  function loadInitialConfig() {

    try {

      const current =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (current) {

        return enforceSafety(
          mergeConfig(
            clone(DEFAULT_CONFIG),
            JSON.parse(current)
          )
        );

      }

      /*
       * V1 migration
       */

      const legacy =
        localStorage.getItem(
          LEGACY_STORAGE_KEY
        );

      if (legacy) {

        const migrated =
          enforceSafety(
            mergeConfig(
              clone(DEFAULT_CONFIG),
              JSON.parse(legacy)
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
        "GoVara 26B: configuration load failed.",
        error
      );

    }

    return clone(DEFAULT_CONFIG);
  }

  /* =======================================================
     SAFETY ENFORCEMENT
     ======================================================= */

  function enforceSafety(input) {

    const safe =
      clone(
        input || DEFAULT_CONFIG
      );

    safe.version =
      VERSION;

    safe.environment =
      "TESTING";

    /*
     * Backend remains authority.
     */

    safe.security.frontendAuthority =
      false;

    safe.security.backendAuthority =
      true;

    safe.security.roleEnforcementBackend =
      true;

    safe.security.permissionEnforcementBackend =
      true;

    safe.security.sessionAuthority =
      "BACKEND";

    safe.security.identityAuthority =
      "BACKEND";

    /*
     * Self role change cannot be enabled
     * from frontend.
     */

    safe.security.selfRoleChangeAllowed =
      false;

    /*
     * Financial safety.
     */

    safe.financialSafety.realMoney =
      false;

    safe.financialSafety.realPayment =
      false;

    safe.financialSafety.bankTransfer =
      false;

    safe.financialSafety.frontendFinancialAuthority =
      false;

    safe.financialSafety.backendFinancialAuthority =
      true;

    /*
     * Ensure all core roles exist.
     */

    ROLE_CATALOG.forEach(
      function (role) {

        if (
          !safe.roles[role] ||
          typeof safe.roles[role] !== "object"
        ) {

          safe.roles[role] =
            clone(
              DEFAULT_CONFIG.roles[role]
            );

        }

        safe.roles[role].enabled =
          Boolean(
            safe.roles[role].enabled
          );

        safe.roles[role].registrationEnabled =
          Boolean(
            safe.roles[role].registrationEnabled
          );

        safe.roles[role].kycRequired =
          Boolean(
            safe.roles[role].kycRequired
          );

        if (
          !Array.isArray(
            safe.roles[role].permissions
          )
        ) {

          safe.roles[role].permissions =
            DEFAULT_ROLE_PERMISSIONS[
              role
            ]
              ? DEFAULT_ROLE_PERMISSIONS[
                  role
                ].slice()
              : [];

        }

        safe.roles[role].permissions =
          uniquePermissions(
            safe.roles[role].permissions
          );

      }
    );

    /*
     * Admin must always remain enabled.
     */

    safe.roles.Admin.enabled =
      true;

    safe.roles.Admin.registrationEnabled =
      true;

    /*
     * Admin control permissions cannot
     * accidentally disappear.
     */

    const requiredAdminPermissions = [
      "ADMIN_DASHBOARD",
      "ADMIN_ROLE_VIEW",
      "ADMIN_ROLE_MANAGE",
      "ADMIN_USER_VIEW",
      "ADMIN_USER_MANAGE",
      "ADMIN_SYSTEM_CONFIG",
      "AUDIT_VIEW"
    ];

    requiredAdminPermissions.forEach(
      function (permission) {

        if (
          safe.roles.Admin.permissions.indexOf(
            permission
          ) === -1
        ) {

          safe.roles.Admin.permissions.push(
            permission
          );

        }

      }
    );

    return safe;
  }

  /* =======================================================
     UNIQUE PERMISSIONS
     ======================================================= */

  function uniquePermissions(list) {

    if (!Array.isArray(list)) {
      return [];
    }

    return Array.from(
      new Set(
        list.filter(function (item) {
          return (
            typeof item === "string" &&
            item.trim() !== ""
          );
        })
      )
    );

  }

  /* =======================================================
     ALL PERMISSIONS
     ======================================================= */

  function getAllPermissions() {

    const result = [];

    PERMISSION_CATALOG.forEach(
      function (group) {

        group.permissions.forEach(
          function (permission) {

            if (
              result.indexOf(
                permission
              ) === -1
            ) {

              result.push(
                permission
              );

            }

          }
        );

      }
    );

    /*
     * Include custom permissions
     * found in saved configuration.
     */

    ROLE_CATALOG.forEach(
      function (role) {

        const list =
          config.roles[role].permissions;

        list.forEach(
          function (permission) {

            if (
              result.indexOf(
                permission
              ) === -1
            ) {

              result.push(
                permission
              );

            }

          }
        );

      }
    );

    return result.sort();
  }

  /* =======================================================
     PERMISSION GROUP LOOKUP
     ======================================================= */

  function getPermissionGroup(
    permission
  ) {

    for (
      let i = 0;
      i < PERMISSION_CATALOG.length;
      i++
    ) {

      if (
        PERMISSION_CATALOG[i].permissions
          .indexOf(permission) !== -1
      ) {

        return PERMISSION_CATALOG[i].group;

      }

    }

    return "Custom";
  }

  /* =======================================================
     VALIDATION
     ======================================================= */

  function validateConfig(input) {

    const target =
      enforceSafety(
        input || config
      );

    const errors = [];

    if (!target.roleControlEnabled) {

      errors.push(
        "Role control must remain enabled."
      );

    }

    if (!target.permissionControlEnabled) {

      errors.push(
        "Permission control must remain enabled."
      );

    }

    if (!target.roles.Admin.enabled) {

      errors.push(
        "Admin role must remain enabled."
      );

    }

    if (
      target.security.frontendAuthority !== false
    ) {

      errors.push(
        "Frontend authority must remain false."
      );

    }

    if (
      target.security.backendAuthority !== true
    ) {

      errors.push(
        "Backend authority must remain true."
      );

    }

    if (
      target.security.selfRoleChangeAllowed !== false
    ) {

      errors.push(
        "Self role change must remain disabled."
      );

    }

    if (
      target.financialSafety.realMoney !== false
    ) {

      errors.push(
        "Real Money must remain BLOCKED."
      );

    }

    if (
      target.financialSafety.realPayment !== false
    ) {

      errors.push(
        "Real Payment must remain BLOCKED."
      );

    }

    if (
      target.financialSafety.bankTransfer !== false
    ) {

      errors.push(
        "Bank Transfer must remain BLOCKED."
      );

    }

    ROLE_CATALOG.forEach(
      function (role) {

        if (
          !Array.isArray(
            target.roles[role].permissions
          )
        ) {

          errors.push(
            role +
            " permissions must be an array."
          );

        }

      }
    );

    return {

      valid:
        errors.length === 0,

      errors:
        errors

    };

  }

  /* =======================================================
     GET CONFIG
     ======================================================= */

  function getConfig() {

    return clone(config);

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
      validateConfig(
        candidate
      );

    if (!validation.valid) {

      return {

        success: false,

        errors:
          validation.errors

      };

    }

    candidate.lastAction =
      "CONFIGURATION_SAVED";

    candidate.lastUpdated =
      new Date().toISOString();

    config =
      candidate;

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(config)
      );

      createAuditEvent(
        "CONFIGURATION_SAVED",
        "26B role and permission configuration saved locally."
      );

    } catch (error) {

      console.error(
        "GoVara 26B: save failed.",
        error
      );

      return {

        success: false,

        errors: [
          "Unable to save 26B configuration locally."
        ]

      };

    }

    renderAndBind();

    return {

      success: true,

      config:
        getConfig()

    };

  }

  /* =======================================================
     RESET
     ======================================================= */

  function reset() {

    config =
      enforceSafety(
        clone(DEFAULT_CONFIG)
      );

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
        "26B role and permission configuration reset to defaults."
      );

    } catch (error) {

      console.warn(
        "GoVara 26B: reset failed.",
        error
      );

    }

    renderAndBind();

    return getConfig();

  }

  /* =======================================================
     RELOAD
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
          enforceSafety(
            clone(DEFAULT_CONFIG)
          );

      }

    } catch (error) {

      console.warn(
        "GoVara 26B: reload failed.",
        error
      );

      config =
        enforceSafety(
          clone(DEFAULT_CONFIG)
        );

    }

    renderAndBind();

    return getConfig();

  }

  /* =======================================================
     ROLE CONTROL
     ======================================================= */

  function setRoleEnabled(
    role,
    enabled
  ) {

    if (
      ROLE_CATALOG.indexOf(role) === -1
    ) {

      return {
        success: false,
        error: "Unknown role."
      };

    }

    if (
      role === "Admin" &&
      !enabled
    ) {

      return {
        success: false,
        error:
          "Admin role cannot be disabled."
      };

    }

    config.roles[role].enabled =
      Boolean(enabled);

    config.lastAction =
      enabled
        ? "ROLE_ENABLED"
        : "ROLE_DISABLED";

    config.lastUpdated =
      new Date().toISOString();

    createAuditEvent(
      config.lastAction,
      role +
      " role " +
      (
        enabled
          ? "enabled."
          : "disabled."
      ),
      {
        role: role,
        enabled: enabled
      }
    );

    return save(config);

  }

  /* =======================================================
     REGISTRATION CONTROL
     ======================================================= */

  function setRegistrationEnabled(
    role,
    enabled
  ) {

    if (
      ROLE_CATALOG.indexOf(role) === -1
    ) {

      return {
        success: false,
        error: "Unknown role."
      };

    }

    config.roles[role].registrationEnabled =
      Boolean(enabled);

    config.lastAction =
      "REGISTRATION_POLICY_CHANGED";

    config.lastUpdated =
      new Date().toISOString();

    createAuditEvent(
      "REGISTRATION_POLICY_CHANGED",
      role +
      " registration " +
      (
        enabled
          ? "enabled."
          : "disabled."
      ),
      {
        role: role,
        enabled: enabled
      }
    );

    return save(config);

  }

  /* =======================================================
     KYC CONTROL
     ======================================================= */

  function setKYCRequired(
    role,
    required
  ) {

    if (
      ROLE_CATALOG.indexOf(role) === -1
    ) {

      return {
        success: false,
        error: "Unknown role."
      };

    }

    config.roles[role].kycRequired =
      Boolean(required);

    config.lastAction =
      "KYC_POLICY_CHANGED";

    config.lastUpdated =
      new Date().toISOString();

    createAuditEvent(
      "KYC_POLICY_CHANGED",
      role +
      " KYC requirement changed.",
      {
        role: role,
        required: required
      }
    );

    return save(config);

  }

  /* =======================================================
     PERMISSION CHECK
     ======================================================= */

  function hasPermission(
    role,
    permission
  ) {

    if (
      ROLE_CATALOG.indexOf(role) === -1
    ) {

      return false;
    }

    if (
      !config.roles[role].enabled
    ) {

      return false;
    }

    return (
      config.roles[role].permissions
        .indexOf(permission) !== -1
    );

  }

  /* =======================================================
     SET PERMISSION
     ======================================================= */

  function setPermission(
    role,
    permission,
    enabled
  ) {

    if (
      ROLE_CATALOG.indexOf(role) === -1
    ) {

      return {
        success: false,
        error: "Unknown role."
      };

    }

    if (
      typeof permission !== "string" ||
      permission.trim() === ""
    ) {

      return {
        success: false,
        error: "Invalid permission."
      };

    }

    /*
     * Protect essential Admin permissions.
     */

    const protectedAdminPermissions = [
      "ADMIN_DASHBOARD",
      "ADMIN_ROLE_VIEW",
      "ADMIN_ROLE_MANAGE",
      "ADMIN_USER_VIEW",
      "ADMIN_USER_MANAGE",
      "ADMIN_SYSTEM_CONFIG",
      "AUDIT_VIEW"
    ];

    if (
      role === "Admin" &&
      !enabled &&
      protectedAdminPermissions.indexOf(
        permission
      ) !== -1
    ) {

      return {
        success: false,
        error:
          permission +
          " is a protected Admin permission."
      };

    }

    const list =
      config.roles[role].permissions;

    const index =
      list.indexOf(permission);

    if (enabled) {

      if (index === -1) {

        list.push(permission);

      }

    } else {

      if (index !== -1) {

        list.splice(
          index,
          1
        );

      }

    }

    config.roles[role].permissions =
      uniquePermissions(list);

    config.lastAction =
      enabled
        ? "PERMISSION_ENABLED"
        : "PERMISSION_DISABLED";

    config.lastUpdated =
      new Date().toISOString();

    createAuditEvent(
      config.lastAction,
      role +
      " permission " +
      permission +
      " " +
      (
        enabled
          ? "enabled."
          : "disabled."
      ),
      {
        role: role,
        permission: permission,
        enabled: enabled
      }
    );

    return save(config);

  }

  /* =======================================================
     ADD CUSTOM PERMISSION
     ======================================================= */

  function addPermission(
    role,
    permission
  ) {

    if (
      ROLE_CATALOG.indexOf(role) === -1
    ) {

      return {
        success: false,
        error: "Unknown role."
      };

    }

    const clean =
      String(permission || "")
        .trim()
        .toUpperCase()
        .replace(
          /[^A-Z0-9_]/g,
          "_"
        );

    if (!clean) {

      return {
        success: false,
        error: "Permission name is required."
      };

    }

    const existing =
      getAllPermissions();

    if (
      existing.indexOf(clean) !== -1
    ) {

      return {
        success: false,
        error:
          "Permission already exists."
      };

    }

    config.roles[role].permissions.push(
      clean
    );

    config.roles[role].permissions =
      uniquePermissions(
        config.roles[role].permissions
      );

    config.lastAction =
      "CUSTOM_PERMISSION_ADDED";

    config.lastUpdated =
      new Date().toISOString();

    createAuditEvent(
      "CUSTOM_PERMISSION_ADDED",
      "Custom permission added to role.",
      {
        role: role,
        permission: clean
      }
    );

    return save(config);

  }

  /* =======================================================
     REMOVE PERMISSION
     ======================================================= */

  function removePermission(
    role,
    permission
  ) {

    if (
      ROLE_CATALOG.indexOf(role) === -1
    ) {

      return {
        success: false,
        error: "Unknown role."
      };

    }

    const protectedAdminPermissions = [
      "ADMIN_DASHBOARD",
      "ADMIN_ROLE_VIEW",
      "ADMIN_ROLE_MANAGE",
      "ADMIN_USER_VIEW",
      "ADMIN_USER_MANAGE",
      "ADMIN_SYSTEM_CONFIG",
      "AUDIT_VIEW"
    ];

    if (
      role === "Admin" &&
      protectedAdminPermissions.indexOf(
        permission
      ) !== -1
    ) {

      return {
        success: false,
        error:
          "Protected Admin permission cannot be removed."
      };

    }

    const list =
      config.roles[role].permissions;

    const index =
      list.indexOf(permission);

    if (index === -1) {

      return {
        success: false,
        error:
          "Permission not assigned."
      };

    }

    list.splice(
      index,
      1
    );

    config.roles[role].permissions =
      uniquePermissions(list);

    config.lastAction =
      "PERMISSION_REMOVED";

    config.lastUpdated =
      new Date().toISOString();

    createAuditEvent(
      "PERMISSION_REMOVED",
      "Permission removed from role.",
      {
        role: role,
        permission: permission
      }
    );

    return save(config);

  }

  /* =======================================================
     GROUP TOGGLE
     ======================================================= */

  function setPermissionGroup(
    role,
    groupName,
    enabled
  ) {

    if (
      ROLE_CATALOG.indexOf(role) === -1
    ) {

      return {
        success: false,
        error: "Unknown role."
      };

    }

    const group =
      PERMISSION_CATALOG.find(
        function (item) {
          return item.group === groupName;
        }
      );

    if (!group) {

      return {
        success: false,
        error:
          "Unknown permission group."
      };

    }

    for (
      let i = 0;
      i < group.permissions.length;
      i++
    ) {

      const permission =
        group.permissions[i];

      const result =
        setPermission(
          role,
          permission,
          enabled
        );

      if (!result.success) {

        return result;

      }

    }

    config.lastAction =
      enabled
        ? "PERMISSION_GROUP_ENABLED"
        : "PERMISSION_GROUP_DISABLED";

    config.lastUpdated =
      new Date().toISOString();

    return save(config);

  }

  /* =======================================================
     ROLE SUMMARY
     ======================================================= */

  function getRoleSummary() {

    return ROLE_CATALOG.map(
      function (role) {

        const roleConfig =
          config.roles[role];

        return {

          role: role,

          enabled:
            roleConfig.enabled,

          registrationEnabled:
            roleConfig.registrationEnabled,

          kycRequired:
            roleConfig.kycRequired,

          permissionCount:
            roleConfig.permissions.length

        };

      }
    );

  }

  /* =======================================================
     AUDIT
     ======================================================= */

  function createAuditEvent(
    action,
    description,
    metadata
  ) {

    if (
      !config.audit.enabled ||
      !config.audit.localHistoryEnabled
    ) {

      return null;

    }

    const event = {

      id:
        "26B-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2, 8),

      module:
        "26B",

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

    let history =
      getAuditHistory();

    history.unshift(event);

    const max =
      Number(
        config.audit.maxLocalEvents
      ) || 100;

    history =
      history.slice(
        0,
        max
      );

    try {

      localStorage.setItem(
        AUDIT_KEY,
        JSON.stringify(history)
      );

    } catch (error) {

      console.warn(
        "GoVara 26B: audit save failed.",
        error
      );

    }

    return event;

  }

  /* =======================================================
     GET AUDIT
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

      const parsed =
        JSON.parse(stored);

      return Array.isArray(parsed)
        ? parsed
        : [];

    } catch (error) {

      return [];

    }

  }

  /* =======================================================
     CLEAR AUDIT
     ======================================================= */

  function clearAuditHistory() {

    try {

      localStorage.removeItem(
        AUDIT_KEY
      );

      return true;

    } catch (error) {

      console.warn(
        "GoVara 26B: audit clear failed.",
        error
      );

      return false;

    }

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
     ROLE SELECTOR
     ======================================================= */

  function renderRoleSelector() {

    return `
      <label>

        <span>Selected Role</span>

        <select
          data-26b-role-selector
        >

          ${ROLE_CATALOG
            .map(
              function (role) {

                return `
                  <option
                    value="${esc(role)}"
                  >
                    ${esc(role)}
                  </option>
                `;

              }
            )
            .join("")}

        </select>

      </label>
    `;

  }

  /* =======================================================
     ROLE CARDS
     ======================================================= */

  function renderRoles() {

    return ROLE_CATALOG
      .map(
        function (role) {

          const item =
            config.roles[role];

          const core =
            role === "Admin";

          return `

            <div class="card govara26b-role-card">

              <div class="row between">

                <div>

                  <h3>
                    ${esc(role)}
                  </h3>

                  <div class="muted">
                    ${item.permissions.length}
                    permissions assigned
                  </div>

                </div>

                <label class="govara26b-control">

                  <input
                    type="checkbox"
                    data-26b-role-enabled="${esc(role)}"
                    ${
                      item.enabled
                        ? "checked"
                        : ""
                    }
                    ${
                      core
                        ? "disabled"
                        : ""
                    }
                  >

                  <span>
                    ${
                      core
                        ? "Core Role"
                        : (
                            item.enabled
                              ? "Enabled"
                              : "Disabled"
                          )
                    }
                  </span>

                </label>

              </div>

              <div class="grid two">

                <label class="govara26b-control">

                  <input
                    type="checkbox"
                    data-26b-registration="${esc(role)}"
                    ${
                      item.registrationEnabled
                        ? "checked"
                        : ""
                    }
                  >

                  <span>
                    Registration Enabled
                  </span>

                </label>

                <label class="govara26b-control">

                  <input
                    type="checkbox"
                    data-26b-kyc="${esc(role)}"
                    ${
                      item.kycRequired
                        ? "checked"
                        : ""
                    }
                  >

                  <span>
                    KYC Required
                  </span>

                </label>

              </div>

            </div>

          `;

        }
      )
      .join("");

  }

  /* =======================================================
     PERMISSION GROUPS
     ======================================================= */

  function renderPermissionGroups(
    selectedRole
  ) {

    const roleConfig =
      config.roles[selectedRole];

    return PERMISSION_CATALOG
      .map(
        function (group) {

          let enabledCount = 0;

          group.permissions.forEach(
            function (permission) {

              if (
                roleConfig.permissions
                  .indexOf(permission) !== -1
              ) {

                enabledCount++;

              }

            }
          );

          const allEnabled =
            enabledCount ===
            group.permissions.length;

          const someEnabled =
            enabledCount > 0 &&
            !allEnabled;

          return `

            <div class="card govara26b-permission-group">

              <div class="row between">

                <div>

                  <h3>
                    ${esc(group.group)}
                  </h3>

                  <div class="muted">
                    ${enabledCount}
                    /
                    ${group.permissions.length}
                    enabled
                  </div>

                </div>

                <div class="row gap">

                  <button
                    type="button"
                    class="secondary"
                    data-26b-group-action="enable"
                    data-26b-group="${esc(group.group)}"
                    data-26b-role="${esc(selectedRole)}"
                  >
                    Enable All
                  </button>

                  <button
                    type="button"
                    class="secondary"
                    data-26b-group-action="disable"
                    data-26b-group="${esc(group.group)}"
                    data-26b-role="${esc(selectedRole)}"
                  >
                    Disable All
                  </button>

                </div>

              </div>

              <div class="govara26b-permission-list">

                ${group.permissions
                  .map(
                    function (permission) {

                      const enabled =
                        roleConfig.permissions
                          .indexOf(permission) !== -1;

                      const protectedPermission =
                        selectedRole === "Admin" &&
                        [
                          "ADMIN_DASHBOARD",
                          "ADMIN_ROLE_VIEW",
                          "ADMIN_ROLE_MANAGE",
                          "ADMIN_USER_VIEW",
                          "ADMIN_USER_MANAGE",
                          "ADMIN_SYSTEM_CONFIG",
                          "AUDIT_VIEW"
                        ].indexOf(permission) !== -1;

                      return `

                        <label
                          class="govara26b-permission"
                        >

                          <input
                            type="checkbox"
                            data-26b-permission="${esc(permission)}"
                            data-26b-permission-role="${esc(selectedRole)}"
                            ${
                              enabled
                                ? "checked"
                                : ""
                            }
                            ${
                              protectedPermission
                                ? "disabled"
                                : ""
                            }
                          >

                          <span>
                            ${esc(permission)}
                          </span>

                        </label>

                      `;

                    }
                  )
                  .join("")}

              </div>

            </div>

          `;

        }
      )
      .join("");

  }

  /* =======================================================
     CUSTOM PERMISSION SECTION
     ======================================================= */

  function renderCustomPermissions(
    selectedRole
  ) {

    const knownPermissions =
      getAllPermissions();

    const rolePermissions =
      config.roles[selectedRole]
        .permissions;

    const custom =
      rolePermissions.filter(
        function (permission) {

          return (
            knownPermissions.indexOf(
              permission
            ) !== -1 &&
            getPermissionGroup(
              permission
            ) === "Custom"
          );

        }
      );

    if (!custom.length) {

      return `
        <div class="notice">
          No custom permissions assigned
          to this role.
        </div>
      `;

    }

    return custom
      .map(
        function (permission) {

          return `

            <div
              class="govara26b-custom-permission"
            >

              <div>

                <b>
                  ${esc(permission)}
                </b>

                <div class="muted">
                  Custom permission
                </div>

              </div>

              <button
                type="button"
                class="secondary"
                data-26b-remove-permission="${esc(permission)}"
                data-26b-remove-role="${esc(selectedRole)}"
              >
                Remove
              </button>

            </div>

          `;

        }
      )
      .join("");

  }

  /* =======================================================
     AUDIT RENDER
     ======================================================= */

  function renderAudit() {

    const history =
      getAuditHistory();

    if (!history.length) {

      return `
        <div class="notice">
          No local 26B audit events yet.
        </div>
      `;

    }

    return history
      .slice(0, 10)
      .map(
        function (event) {

          return `

            <div class="govara26b-audit-row">

              <div>

                <b>
                  ${esc(event.action)}
                </b>

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
      getHealth();

    const validation =
      validateConfig(config);

    /*
     * Default role for first render.
     */

    const selectedRole =
      ROLE_CATALOG[0];

    return `

      <div class="page-head">

        <h1>
          26B — User & Role Control
        </h1>

        <div class="muted">
          Roles, registration, KYC and permission
          configuration for the GoVara platform.
        </div>

      </div>

      <!-- ================================================
           STATUS
           ================================================ -->

      <section class="card">

        <h2>Role Control Status</h2>

        <div class="grid four">

          <div>

            <b>
              ENABLED
            </b>

            <div class="muted">
              Role Control
            </div>

          </div>

          <div>

            <b>
              ${esc(health.enabledRoles)}
              /
              ${esc(health.totalRoles)}
            </b>

            <div class="muted">
              Active Roles
            </div>

          </div>

          <div>

            <b>
              ${esc(health.totalPermissions)}
            </b>

            <div class="muted">
              Permissions
            </div>

          </div>

          <div>

            <b>
              ${esc(health.validation)}
            </b>

            <div class="muted">
              Validation
            </div>

          </div>

        </div>

        <div class="notice warn">

          Backend remains the authoritative
          identity, role and permission authority.

          26B is frontend configuration only.

        </div>

      </section>

      <!-- ================================================
           SECURITY BOUNDARY
           ================================================ -->

      <section class="card">

        <h2>Security Boundary</h2>

        <div class="grid four">

          <div>

            <b>
              BACKEND
            </b>

            <div class="muted">
              Identity Authority
            </div>

          </div>

          <div>

            <b>
              BACKEND
            </b>

            <div class="muted">
              Role Enforcement
            </div>

          </div>

          <div>

            <b>
              BACKEND
            </b>

            <div class="muted">
              Permission Enforcement
            </div>

          </div>

          <div>

            <b>
              DISABLED
            </b>

            <div class="muted">
              Self Role Change
            </div>

          </div>

        </div>

      </section>

      <!-- ================================================
           ROLE CARDS
           ================================================ -->

      <section class="card">

        <h2>Core Roles</h2>

        <div class="grid two">

          ${renderRoles()}

        </div>

      </section>

      <!-- ================================================
           PERMISSION CONTROL
           ================================================ -->

      <section class="card">

        <div class="row between">

          <div>

            <h2>Permission Control</h2>

            <div class="muted">
              Configure permissions for each role.
            </div>

          </div>

          ${renderRoleSelector()}

        </div>

        <div
          data-26b-permission-container
        >

          ${renderPermissionGroups(
            selectedRole
          )}

        </div>

      </section>

      <!-- ================================================
           CUSTOM PERMISSION
           ================================================ -->

      <section class="card">

        <h2>Custom Permission</h2>

        <div class="grid two">

          <label>

            <span>
              Role
            </span>

            <select
              data-26b-custom-role
            >

              ${ROLE_CATALOG
                .map(
                  function (role) {

                    return `
                      <option
                        value="${esc(role)}"
                      >
                        ${esc(role)}
                      </option>
                    `;

                  }
                )
                .join("")}

            </select>

          </label>

          <label>

            <span>
              Permission Name
            </span>

            <input
              type="text"
              placeholder="Example: CUSTOMER_SPECIAL_ACCESS"
              data-26b-custom-permission
            >

          </label>

        </div>

        <div class="row gap">

          <button
            type="button"
            class="primary"
            data-26b-action="add-permission"
          >
            Add Permission
          </button>

        </div>

        <div class="govara26b-custom-list">

          ${renderCustomPermissions(
            selectedRole
          )}

        </div>

      </section>

      <!-- ================================================
           FINANCIAL SAFETY
           ================================================ -->

      <section class="card">

        <h2>Financial Safety Boundary</h2>

        <div class="grid four">

          <div>

            <b>
              BLOCKED
            </b>

            <div class="muted">
              Real Money
            </div>

          </div>

          <div>

            <b>
              BLOCKED
            </b>

            <div class="muted">
              Real Payment
            </div>

          </div>

          <div>

            <b>
              BLOCKED
            </b>

            <div class="muted">
              Bank Transfer
            </div>

          </div>

          <div>

            <b>
              BACKEND
            </b>

            <div class="muted">
              Financial Authority
            </div>

          </div>

        </div>

        <div class="notice warn">

          Role permissions cannot authorize
          real financial execution.

          Real Money, Real Payment and
          Bank Transfer remain BLOCKED.

        </div>

      </section>

      <!-- ================================================
           AUDIT
           ================================================ -->

      <section class="card">

        <div class="row between">

          <div>

            <h2>
              26B Local Audit
            </h2>

            <div class="muted">
              Frontend role-control configuration
              audit history.
            </div>

          </div>

          <button
            type="button"
            class="secondary"
            data-26b-action="clear-audit"
          >
            Clear Local Audit
          </button>

        </div>

        <div class="govara26b-audit-list">

          ${renderAudit()}

        </div>

      </section>

      <!-- ================================================
           VALIDATION
           ================================================ -->

      <section class="card">

        <h2>
          Configuration Validation
        </h2>

        ${
          validation.valid
            ? `
              <div class="notice">
                26B configuration is valid.
              </div>
            `
            : `
              <div class="notice danger">

                ${validation.errors
                  .map(
                    function (error) {

                      return `
                        <div>
                          ${esc(error)}
                        </div>
                      `;

                    }
                  )
                  .join("")}

              </div>
            `
        }

      </section>

      <!-- ================================================
           ACTIONS
           ================================================ -->

      <section class="card">

        <div class="row gap">

          <button
            type="button"
            class="primary"
            data-26b-action="save"
          >
            Save Configuration
          </button>

          <button
            type="button"
            class="secondary"
            data-26b-action="reload"
          >
            Reload
          </button>

          <button
            type="button"
            class="secondary"
            data-26b-action="reset"
          >
            Reset Defaults
          </button>

        </div>

      </section>

      <div class="muted govara26b-version">

        ${esc(VERSION)}

      </div>

    `;

  }

  /* =======================================================
     HEALTH
     ======================================================= */

  function getHealth() {

    const enabledRoles =
      ROLE_CATALOG.filter(
        function (role) {

          return config.roles[role].enabled;

        }
      );

    const validation =
      validateConfig(config);

    return {

      version:
        VERSION,

      validation:
        validation.valid
          ? "VALID"
          : "INVALID",

      totalRoles:
        ROLE_CATALOG.length,

      enabledRoles:
        enabledRoles.length,

      totalPermissions:
        getAllPermissions().length,

      roleControl:
        config.roleControlEnabled
          ? "ENABLED"
          : "DISABLED",

      registrationControl:
        config.registrationControlEnabled
          ? "ENABLED"
          : "DISABLED",

      kycControl:
        config.kycControlEnabled
          ? "ENABLED"
          : "DISABLED",

      permissionControl:
        config.permissionControlEnabled
          ? "ENABLED"
          : "DISABLED",

      frontendAuthority:
        "NOT AUTHORITY",

      backendAuthority:
        "AUTHORITATIVE",

      realMoney:
        "BLOCKED",

      realPayment:
        "BLOCKED",

      bankTransfer:
        "BLOCKED",

      selfRoleChange:
        "DISABLED",

      lastAction:
        config.lastAction,

      lastUpdated:
        config.lastUpdated

    };

  }

  /* =======================================================
     BIND
     ======================================================= */

  function bind() {

    const root =
      document.getElementById(
        "module-26B"
      );

    if (!root) {

      console.warn(
        "GoVara 26B: mount #module-26B not found."
      );

      return;

    }

    /* -----------------------------------------------
       Role enable / disable
       ----------------------------------------------- */

    root
      .querySelectorAll(
        "[data-26b-role-enabled]"
      )
      .forEach(
        function (element) {

          element.addEventListener(
            "change",
            function () {

              const role =
                element.getAttribute(
                  "data-26b-role-enabled"
                );

              setRoleEnabled(
                role,
                element.checked
              );

            }
          );

        }
      );

    /* -----------------------------------------------
       Registration
       ----------------------------------------------- */

    root
      .querySelectorAll(
        "[data-26b-registration]"
      )
      .forEach(
        function (element) {

          element.addEventListener(
            "change",
            function () {

              const role =
                element.getAttribute(
                  "data-26b-registration"
                );

              setRegistrationEnabled(
                role,
                element.checked
              );

            }
          );

        }
      );

    /* -----------------------------------------------
       KYC
       ----------------------------------------------- */

    root
      .querySelectorAll(
        "[data-26b-kyc]"
      )
      .forEach(
        function (element) {

          element.addEventListener(
            "change",
            function () {

              const role =
                element.getAttribute(
                  "data-26b-kyc"
                );

              setKYCRequired(
                role,
                element.checked
              );

            }
          );

        }
      );

    /* -----------------------------------------------
       Role selector
       ----------------------------------------------- */

    const roleSelector =
      root.querySelector(
        "[data-26b-role-selector]"
      );

    if (roleSelector) {

      roleSelector.addEventListener(
        "change",
        function () {

          const selectedRole =
            roleSelector.value;

          const container =
            root.querySelector(
              "[data-26b-permission-container]"
            );

          if (container) {

            container.innerHTML =
              renderPermissionGroups(
                selectedRole
              );

            bindPermissionControls(
              root
            );

          }

        }
      );

    }

    /* -----------------------------------------------
       Permission controls
       ----------------------------------------------- */

    bindPermissionControls(root);

    /* -----------------------------------------------
       Custom permission
       ----------------------------------------------- */

    const addPermissionButton =
      root.querySelector(
        '[data-26b-action="add-permission"]'
      );

    if (addPermissionButton) {

      addPermissionButton.addEventListener(
        "click",
        function () {

          const roleElement =
            root.querySelector(
              "[data-26b-custom-role]"
            );

          const permissionElement =
            root.querySelector(
              "[data-26b-custom-permission]"
            );

          const role =
            roleElement
              ? roleElement.value
              : "";

          const permission =
            permissionElement
              ? permissionElement.value
              : "";

          const result =
            addPermission(
              role,
              permission
            );

          if (!result.success) {

            alert(
              result.error
            );

            return;

          }

          alert(
            "Custom permission added successfully."
          );

        }
      );

    }

    /* -----------------------------------------------
       Remove custom permission
       ----------------------------------------------- */

    root
      .querySelectorAll(
        "[data-26b-remove-permission]"
      )
      .forEach(
        function (element) {

          element.addEventListener(
            "click",
            function () {

              const permission =
                element.getAttribute(
                  "data-26b-remove-permission"
                );

              const role =
                element.getAttribute(
                  "data-26b-remove-role"
                );

              const result =
                removePermission(
                  role,
                  permission
                );

              if (!result.success) {

                alert(
                  result.error
                );

                return;

              }

            }
          );

        }
      );

    /* -----------------------------------------------
       Save
       ----------------------------------------------- */

    const saveButton =
      root.querySelector(
        '[data-26b-action="save"]'
      );

    if (saveButton) {

      saveButton.addEventListener(
        "click",
        function () {

          const result =
            save(config);

          if (!result.success) {

            alert(
              "26B configuration could not be saved:\n\n" +
              result.errors.join("\n")
            );

            return;

          }

          alert(
            "26B configuration saved successfully."
          );

        }
      );

    }

    /* -----------------------------------------------
       Reload
       ----------------------------------------------- */

    const reloadButton =
      root.querySelector(
        '[data-26b-action="reload"]'
      );

    if (reloadButton) {

      reloadButton.addEventListener(
        "click",
        function () {

          reload();

        }
      );

    }

    /* -----------------------------------------------
       Reset
       ----------------------------------------------- */

    const resetButton =
      root.querySelector(
        '[data-26b-action="reset"]'
      );

    if (resetButton) {

      resetButton.addEventListener(
        "click",
        function () {

          const confirmed =
            window.confirm(
              "Reset 26B User & Role Control to defaults?"
            );

          if (!confirmed) {
            return;
          }

          reset();

        }
      );

    }

    /* -----------------------------------------------
       Clear audit
       ----------------------------------------------- */

    const clearAuditButton =
      root.querySelector(
        '[data-26b-action="clear-audit"]'
      );

    if (clearAuditButton) {

      clearAuditButton.addEventListener(
        "click",
        function () {

          const confirmed =
            window.confirm(
              "Clear local 26B audit history?"
            );

          if (!confirmed) {
            return;
          }

          clearAuditHistory();

          renderAndBind();

        }
      );

    }

  }

  /* =======================================================
     PERMISSION BINDING
     ======================================================= */

  function bindPermissionControls(
    root
  ) {

    root
      .querySelectorAll(
        "[data-26b-permission]"
      )
      .forEach(
        function (element) {

          element.addEventListener(
            "change",
            function () {

              const permission =
                element.getAttribute(
                  "data-26b-permission"
                );

              const role =
                element.getAttribute(
                  "data-26b-permission-role"
                );

              setPermission(
                role,
                permission,
                element.checked
              );

            }
          );

        }
      );

    root
      .querySelectorAll(
        "[data-26b-group-action]"
      )
      .forEach(
        function (element) {

          element.addEventListener(
            "click",
            function () {

              const action =
                element.getAttribute(
                  "data-26b-group-action"
                );

              const group =
                element.getAttribute(
                  "data-26b-group"
                );

              const role =
                element.getAttribute(
                  "data-26b-role"
                );

              const result =
                setPermissionGroup(
                  role,
                  group,
                  action === "enable"
                );

              if (!result.success) {

                alert(
                  result.error
                );

              }

            }
          );

        }
      );

  }

  /* =======================================================
     RENDER + BIND
     ======================================================= */

  function renderAndBind() {

    const mount =
      document.getElementById(
        "module-26B"
      );

    if (!mount) {

      console.warn(
        "GoVara 26B: mount #module-26B not found."
      );

      return;

    }

    try {

      mount.innerHTML =
        render();

      bind();

    } catch (error) {

      console.error(
        "GoVara 26B render error:",
        error
      );

      mount.innerHTML = `

        <div class="notice danger">

          <b>
            26B User & Role Control Error
          </b>

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

    VERSION:
      VERSION,

    STORAGE_KEY:
      STORAGE_KEY,

    AUDIT_KEY:
      AUDIT_KEY,

    ROLE_CATALOG:
      clone(ROLE_CATALOG),

    PERMISSION_CATALOG:
      clone(PERMISSION_CATALOG),

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

    reload:
      reload,

    validate:
      validateConfig,

    validateConfig:
      validateConfig,

    getHealth:
      getHealth,

    hasPermission:
      hasPermission,

    setRoleEnabled:
      setRoleEnabled,

    setRegistrationEnabled:
      setRegistrationEnabled,

    setKYCRequired:
      setKYCRequired,

    setPermission:
      setPermission,

    setPermissionGroup:
      setPermissionGroup,

    addPermission:
      addPermission,

    removePermission:
      removePermission,

    getRoleSummary:
      getRoleSummary,

    permissions:
      function () {
        return getAllPermissions();
      },

    roles:
      function () {
        return clone(
          ROLE_CATALOG
        );
      },

    createAuditEvent:
      createAuditEvent,

    getAuditHistory:
      getAuditHistory,

    clearAuditHistory:
      clearAuditHistory

  };

})();

/* =========================================================
   END — GoVara 26B V2
   ========================================================= */
