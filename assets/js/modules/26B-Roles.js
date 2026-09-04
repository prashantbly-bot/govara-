/* ============================================================
   GoVara — 26B User & Role Control
   VERSION: GOVARA-26B-V1
   FRONTEND ADMIN CONTROL MODULE

   RULES:
   - Frontend configuration only
   - No backend call
   - No database call
   - No API test
   - Backend remains authoritative
   - Financial authority is NOT granted here
============================================================ */

window.GoVara26B = (function () {

  "use strict";

  const STORAGE_KEY = "GOVARA_USER_ROLE_CONTROL_26B_V1";


  /* ==========================================================
     DEFAULT ROLE CONFIGURATION
  ========================================================== */

  const DEFAULT_CONFIG = {

    systemRoles: {

      Admin: {
        enabled: true,
        description: "Platform administrator",
        permissions: [
          "dashboard.view",
          "users.view",
          "users.manage",
          "roles.view",
          "roles.manage",
          "policies.view",
          "operations.view",
          "financial.view",
          "documents.view",
          "audit.view"
        ]
      },

      Customer: {
        enabled: true,
        description: "Primary booking initiator",
        permissions: [
          "profile.view",
          "profile.edit",
          "booking.create",
          "booking.view",
          "fare.estimate",
          "billing.view",
          "documents.view"
        ]
      },

      Vendor: {
        enabled: true,
        description: "Vendor / transport company",
        permissions: [
          "profile.view",
          "profile.edit",
          "vehicle.view",
          "vehicle.manage",
          "booking.view",
          "duty.view",
          "documents.view"
        ]
      },

      Driver: {
        enabled: true,
        description: "Driver / service operator",
        permissions: [
          "profile.view",
          "profile.edit",
          "duty.view",
          "duty.update",
          "booking.view",
          "documents.view"
        ]
      }

    },


    /* ========================================================
       ACCESS POLICY
    ======================================================== */

    policies: {

      userRegistration: true,

      customerRegistration: true,

      vendorRegistration: true,

      driverRegistration: true,

      roleSelection: true,

      multipleRoleAssignment: false,

      selfRoleChange: false,

      disabledUserLogin: false,

      disabledRoleLogin: false,

      adminApprovalRequired: false,

      kycRequiredForVendor: true,

      kycRequiredForDriver: true,

      kycRequiredForCustomer: false

    },


    /* ========================================================
       SECURITY
    ======================================================== */

    security: {

      permissionEnforcement: true,

      sessionControl: true,

      auditRoleChanges: true,

      auditPermissionChanges: true,

      frontendAuthority: false,

      backendAuthority: true

    },


    lastAction: "INITIALIZED",

    lastUpdated: null

  };


  /* ==========================================================
     UTILITIES
  ========================================================== */

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }


  function merge(base, incoming) {

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
          merge(base[key], incoming[key]);

      } else {

        base[key] =
          incoming[key];

      }

    });

    return base;
  }


  function getConfig() {

    try {

      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return clone(DEFAULT_CONFIG);
      }

      return merge(
        clone(DEFAULT_CONFIG),
        JSON.parse(saved)
      );

    } catch (error) {

      console.warn(
        "GoVara26B: configuration load failed.",
        error
      );

      return clone(DEFAULT_CONFIG);
    }
  }


  /* ==========================================================
     ESCAPE
  ========================================================== */

  function esc(value) {

    return String(
      value === undefined || value === null
        ? ""
        : value
    )
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* ==========================================================
     PERMISSION CATALOG
  ========================================================== */

  const PERMISSIONS = [

    {
      group: "Dashboard",
      items: [
        ["dashboard.view", "View Dashboard"]
      ]
    },

    {
      group: "Users",
      items: [
        ["users.view", "View Users"],
        ["users.manage", "Manage Users"]
      ]
    },

    {
      group: "Roles",
      items: [
        ["roles.view", "View Roles"],
        ["roles.manage", "Manage Roles"]
      ]
    },

    {
      group: "Profile",
      items: [
        ["profile.view", "View Profile"],
        ["profile.edit", "Edit Profile"]
      ]
    },

    {
      group: "Booking",
      items: [
        ["booking.create", "Create Booking"],
        ["booking.view", "View Booking"]
      ]
    },

    {
      group: "Fare",
      items: [
        ["fare.estimate", "Fare Estimate"]
      ]
    },

    {
      group: "Vehicle",
      items: [
        ["vehicle.view", "View Vehicle"],
        ["vehicle.manage", "Manage Vehicle"]
      ]
    },

    {
      group: "Duty",
      items: [
        ["duty.view", "View Duty"],
        ["duty.update", "Update Duty"]
      ]
    },

    {
      group: "Billing",
      items: [
        ["billing.view", "View Billing"]
      ]
    },

    {
      group: "Documents",
      items: [
        ["documents.view", "View Documents"]
      ]
    },

    {
      group: "Policies",
      items: [
        ["policies.view", "View Policies"],
        ["policies.manage", "Manage Policies"]
      ]
    },

    {
      group: "Operations",
      items: [
        ["operations.view", "View Operations"],
        ["operations.manage", "Manage Operations"]
      ]
    },

    {
      group: "Financial",
      items: [
        ["financial.view", "View Financial"],
        ["financial.manage", "Manage Financial"]
      ]
    },

    {
      group: "Audit",
      items: [
        ["audit.view", "View Audit"],
        ["audit.manage", "Manage Audit"]
      ]
    }

  ];


  /* ==========================================================
     VALIDATION
  ========================================================== */

  function validate(config) {

    const errors = [];


    if (!config.systemRoles.Admin) {
      errors.push(
        "Admin role configuration is required."
      );
    }


    if (
      config.security.frontendAuthority !== false
    ) {
      errors.push(
        "Frontend cannot become authority."
      );
    }


    if (
      config.security.backendAuthority !== true
    ) {
      errors.push(
        "Backend must remain authoritative."
      );
    }


    if (
      config.policies.selfRoleChange !== false
    ) {
      errors.push(
        "Users cannot change their own role."
      );
    }


    return {
      valid: errors.length === 0,
      errors: errors
    };

  }


  /* ==========================================================
     SAVE
  ========================================================== */

  function save(config) {

    const current =
      merge(
        clone(DEFAULT_CONFIG),
        config || {}
      );


    /* ---------- HARD SECURITY ---------- */

    current.security.frontendAuthority =
      false;

    current.security.backendAuthority =
      true;

    current.policies.selfRoleChange =
      false;


    current.lastAction =
      "ROLE_CONFIGURATION_SAVED";

    current.lastUpdated =
      new Date().toISOString();


    const validation =
      validate(current);


    if (!validation.valid) {

      return {
        success: false,
        validation: validation
      };

    }


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
     ROLE CARD
  ========================================================== */

  function roleCard(
    roleName,
    role
  ) {

    return `

      <div
        class="govara26b-role-card"
        data-role="${esc(roleName)}"
      >

        <div class="govara26b-role-head">

          <div>

            <h3>
              ${esc(roleName)}
            </h3>

            <p>
              ${esc(role.description)}
            </p>

          </div>

          <label class="govara26b-mini-toggle">

            <input
              type="checkbox"
              class="26b-role-enabled"
              data-role="${esc(roleName)}"
              ${role.enabled ? "checked" : ""}
            >

            <span>
              Enabled
            </span>

          </label>

        </div>


        <div class="govara26b-permission-count">

          ${role.permissions.length}
          permissions assigned

        </div>


        <div class="govara26b-permission-list">

          ${
            role.permissions
              .map(function (permission) {

                return `
                  <span class="govara26b-permission">
                    ${esc(permission)}
                  </span>
                `;

              })
              .join("")
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

    const validation =
      validate(c);

    const roles =
      Object.keys(c.systemRoles);


    return `

      <style>

        .govara26b-wrap {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .govara26b-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
        }

        .govara26b-head h1 {
          margin: 0 0 6px;
        }

        .govara26b-head p {
          margin: 0;
          opacity: .65;
        }

        .govara26b-status {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(170px, 1fr));
          gap: 10px;
        }

        .govara26b-status-card {
          padding: 15px;
          border-radius: 14px;
          background: rgba(255,255,255,.035);
          border: 1px solid rgba(255,255,255,.08);
        }

        .govara26b-status-card strong {
          display: block;
          margin-bottom: 5px;
        }

        .govara26b-status-card small {
          opacity: .55;
        }

        .govara26b-section {
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.025);
        }

        .govara26b-section h2 {
          margin: 0 0 6px;
        }

        .govara26b-desc {
          margin: 0 0 18px;
          opacity: .6;
          font-size: 13px;
        }

        .govara26b-role-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
        }

        .govara26b-role-card {
          padding: 16px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(0,0,0,.13);
        }

        .govara26b-role-head {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
        }

        .govara26b-role-head h3 {
          margin: 0 0 5px;
        }

        .govara26b-role-head p {
          margin: 0;
          font-size: 12px;
          opacity: .55;
        }

        .govara26b-mini-toggle {
          display: flex;
          gap: 6px;
          align-items: center;
          font-size: 11px;
          white-space: nowrap;
        }

        .govara26b-permission-count {
          margin-top: 15px;
          font-size: 11px;
          opacity: .55;
        }

        .govara26b-permission-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }

        .govara26b-permission {
          padding: 5px 7px;
          border-radius: 7px;
          font-size: 10px;
          background: rgba(255,255,255,.06);
        }

        .govara26b-policy-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(270px, 1fr));
          gap: 8px;
        }

        .govara26b-policy {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 13px;
          border-radius: 11px;
          background: rgba(255,255,255,.025);
          border: 1px solid rgba(255,255,255,.06);
        }

        .govara26b-policy strong {
          display: block;
          font-size: 13px;
        }

        .govara26b-policy small {
          opacity: .5;
        }

        .govara26b-security {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }

        .govara26b-security-card {
          padding: 15px;
          border-radius: 12px;
          background: rgba(255,255,255,.035);
          border: 1px solid rgba(255,255,255,.07);
        }

        .govara26b-security-card strong {
          display: block;
          margin-bottom: 6px;
        }

        .govara26b-actions {
          position: sticky;
          bottom: 12px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
          padding: 12px;
          border-radius: 15px;
          background: rgba(10,12,18,.94);
          border: 1px solid rgba(255,255,255,.09);
          backdrop-filter: blur(12px);
        }

        .govara26b-actions button {
          padding: 11px 17px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,.10);
          background: rgba(255,255,255,.06);
          color: inherit;
          cursor: pointer;
          font-weight: 800;
        }

        .govara26b-save {
          background: rgba(70,150,255,.20) !important;
        }

        .govara26b-notice {
          padding: 14px 16px;
          border-radius: 12px;
          background: rgba(255,190,70,.08);
          border: 1px solid rgba(255,190,70,.15);
          font-size: 13px;
        }

        .govara26b-permission-groups {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }

        .govara26b-permission-group {
          padding: 14px;
          border-radius: 12px;
          background: rgba(255,255,255,.025);
          border: 1px solid rgba(255,255,255,.06);
        }

        .govara26b-permission-group h4 {
          margin: 0 0 10px;
        }

        .govara26b-permission-row {
          display: flex;
          gap: 8px;
          align-items: center;
          margin: 7px 0;
          font-size: 12px;
        }

        .govara26b-meta {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          opacity: .5;
          font-size: 11px;
        }

      </style>


      <div class="govara26b-wrap">


        <!-- HEADER -->

        <div class="govara26b-head">

          <div>

            <h1>
              26B — User & Role Control
            </h1>

            <p>
              Central role, permission and user-access
              control for the GoVara platform.
            </p>

          </div>

        </div>


        <!-- STATUS -->

        <div class="govara26b-status">

          <div class="govara26b-status-card">

            <strong>
              ${roles.length}
            </strong>

            <small>
              System Roles
            </small>

          </div>


          <div class="govara26b-status-card">

            <strong>
              ${
                roles.filter(
                  r => c.systemRoles[r].enabled
                ).length
              }
            </strong>

            <small>
              Enabled Roles
            </small>

          </div>


          <div class="govara26b-status-card">

            <strong>
              ${
                validation.valid
                  ? "VALID"
                  : "ERROR"
              }
            </strong>

            <small>
              Configuration
            </small>

          </div>


          <div class="govara26b-status-card">

            <strong>
              BACKEND
            </strong>

            <small>
              Authority
            </small>

          </div>

        </div>


        <!-- NOTICE -->

        <div class="govara26b-notice">

          <strong>
            Access Control Boundary
          </strong>

          <div>
            This module defines frontend administrative
            configuration only. Actual authentication,
            authorization and persistent user records remain
            backend-controlled.
          </div>

        </div>


        <!-- ROLES -->

        <section class="govara26b-section">

          <h2>
            1. System Roles
          </h2>

          <p class="govara26b-desc">
            Core GoVara roles. Customer remains the primary
            booking initiator.
          </p>

          <div class="govara26b-role-grid">

            ${
              roles
                .map(function (roleName) {

                  return roleCard(
                    roleName,
                    c.systemRoles[roleName]
                  );

                })
                .join("")
            }

          </div>

        </section>


        <!-- PERMISSION CATALOG -->

        <section class="govara26b-section">

          <h2>
            2. Permission Catalog
          </h2>

          <p class="govara26b-desc">
            Central permission vocabulary for future role
            mapping. Actual enforcement will remain backend
            authoritative.
          </p>

          <div class="govara26b-permission-groups">

            ${
              PERMISSIONS
                .map(function (group) {

                  return `

                    <div
                      class="govara26b-permission-group"
                    >

                      <h4>
                        ${esc(group.group)}
                      </h4>

                      ${
                        group.items
                          .map(function (item) {

                            return `

                              <label
                                class="govara26b-permission-row"
                              >

                                <input
                                  type="checkbox"
                                  disabled
                                  ${
                                    c.systemRoles.Admin
                                      .permissions
                                      .includes(item[0])
                                      ? "checked"
                                      : ""
                                  }
                                >

                                <span>
                                  ${esc(item[1])}
                                </span>

                              </label>

                            `;

                          })
                          .join("")
                      }

                    </div>

                  `;

                })
                .join("")
            }

          </div>

        </section>


        <!-- USER POLICIES -->

        <section class="govara26b-section">

          <h2>
            3. User & Registration Policies
          </h2>

          <p class="govara26b-desc">
            Global policies controlling how users and roles
            are introduced into the platform.
          </p>


          <div class="govara26b-policy-grid">


            <div class="govara26b-policy">

              <div>
                <strong>
                  User Registration
                </strong>

                <small>
                  Allow new users
                </small>
              </div>

              <input
                type="checkbox"
                id="26b-userRegistration"
                ${
                  c.policies.userRegistration
                    ? "checked"
                    : ""
                }
              >

            </div>


            <div class="govara26b-policy">

              <div>
                <strong>
                  Customer Registration
                </strong>

                <small>
                  Customer onboarding
                </small>
              </div>

              <input
                type="checkbox"
                id="26b-customerRegistration"
                ${
                  c.policies.customerRegistration
                    ? "checked"
                    : ""
                }
              >

            </div>


            <div class="govara26b-policy">

              <div>
                <strong>
                  Vendor Registration
                </strong>

                <small>
                  Vendor/company onboarding
                </small>
              </div>

              <input
                type="checkbox"
                id="26b-vendorRegistration"
                ${
                  c.policies.vendorRegistration
                    ? "checked"
                    : ""
                }
              >

            </div>


            <div class="govara26b-policy">

              <div>
                <strong>
                  Driver Registration
                </strong>

                <small>
                  Driver onboarding
                </small>
              </div>

              <input
                type="checkbox"
                id="26b-driverRegistration"
                ${
                  c.policies.driverRegistration
                    ? "checked"
                    : ""
                }
              >

            </div>


            <div class="govara26b-policy">

              <div>
                <strong>
                  Role Selection
                </strong>

                <small>
                  Allow role selection during onboarding
                </small>
              </div>

              <input
                type="checkbox"
                id="26b-roleSelection"
                ${
                  c.policies.roleSelection
                    ? "checked"
                    : ""
                }
              >

            </div>


            <div class="govara26b-policy">

              <div>
                <strong>
                  Multiple Role Assignment
                </strong>

                <small>
                  More than one role per user
                </small>
              </div>

              <input
                type="checkbox"
                id="26b-multipleRoleAssignment"
                ${
                  c.policies.multipleRoleAssignment
                    ? "checked"
                    : ""
                }
              >

            </div>


            <div class="govara26b-policy">

              <div>
                <strong>
                  Disabled User Login
                </strong>

                <small>
                  Login for disabled accounts
                </small>
              </div>

              <input
                type="checkbox"
                id="26b-disabledUserLogin"
                ${
                  c.policies.disabledUserLogin
                    ? "checked"
                    : ""
                }
              >

            </div>


            <div class="govara26b-policy">

              <div>
                <strong>
                  Disabled Role Login
                </strong>

                <small>
                  Login using disabled role
                </small>
              </div>

              <input
                type="checkbox"
                id="26b-disabledRoleLogin"
                ${
                  c.policies.disabledRoleLogin
                    ? "checked"
                    : ""
                }
              >

            </div>


            <div class="govara26b-policy">

              <div>
                <strong>
                  Admin Approval
                </strong>

                <small>
                  Require administrator approval
                </small>
              </div>

              <input
                type="checkbox"
                id="26b-adminApprovalRequired"
                ${
                  c.policies.adminApprovalRequired
                    ? "checked"
                    : ""
                }
              >

            </div>

          </div>

        </section>


        <!-- KYC -->

        <section class="govara26b-section">

          <h2>
            4. Role-Based KYC Policy
          </h2>

          <p class="govara26b-desc">
            KYC requirement controls are configurable here;
            actual verification remains backend-controlled.
          </p>


          <div class="govara26b-policy-grid">


            <div class="govara26b-policy">

              <div>
                <strong>
                  Customer KYC
                </strong>

                <small>
                  Customer identity verification
                </small>
              </div>

              <input
                type="checkbox"
                id="26b-kycCustomer"
                ${
                  c.policies.kycRequiredForCustomer
                    ? "checked"
                    : ""
                }
              >

            </div>


            <div class="govara26b-policy">

              <div>
                <strong>
                  Vendor KYC
                </strong>

                <small>
                  Vendor/company verification
                </small>
              </div>

              <input
                type="checkbox"
                id="26b-kycVendor"
                ${
                  c.policies.kycRequiredForVendor
                    ? "checked"
                    : ""
                }
              >

            </div>


            <div class="govara26b-policy">

              <div>
                <strong>
                  Driver KYC
                </strong>

                <small>
                  Driver verification
                </small>
              </div>

              <input
                type="checkbox"
                id="26b-kycDriver"
                ${
                  c.policies.kycRequiredForDriver
                    ? "checked"
                    : ""
                }
              >

            </div>

          </div>

        </section>


        <!-- SECURITY -->

        <section class="govara26b-section">

          <h2>
            5. Access Security Boundary
          </h2>

          <p class="govara26b-desc">
            Security controls that define the authority
            boundary between frontend and backend.
          </p>


          <div class="govara26b-security">


            <div class="govara26b-security-card">

              <strong>
                Permission Enforcement
              </strong>

              <span>
                ${
                  c.security.permissionEnforcement
                    ? "ENABLED"
                    : "DISABLED"
                }
              </span>

            </div>


            <div class="govara26b-security-card">

              <strong>
                Session Control
              </strong>

              <span>
                ${
                  c.security.sessionControl
                    ? "ENABLED"
                    : "DISABLED"
                }
              </span>

            </div>


            <div class="govara26b-security-card">

              <strong>
                Role Change Audit
              </strong>

              <span>
                ${
                  c.security.auditRoleChanges
                    ? "ENABLED"
                    : "DISABLED"
                }
              </span>

            </div>


            <div class="govara26b-security-card">

              <strong>
                Permission Audit
              </strong>

              <span>
                ${
                  c.security.auditPermissionChanges
                    ? "ENABLED"
                    : "DISABLED"
                }
              </span>

            </div>


            <div class="govara26b-security-card">

              <strong>
                Frontend Authority
              </strong>

              <span>
                NO
              </span>

            </div>


            <div class="govara26b-security-card">

              <strong>
                Backend Authority
              </strong>

              <span>
                YES
              </span>

            </div>

          </div>

        </section>


        <!-- ACTIONS -->

        <div class="govara26b-actions">

          <button
            type="button"
            id="26b-reload"
          >
            Reload
          </button>

          <button
            type="button"
            id="26b-reset"
          >
            Reset Defaults
          </button>

          <button
            type="button"
            id="26b-save"
            class="govara26b-save"
          >
            Save Configuration
          </button>

        </div>


        <div class="govara26b-meta">

          <span>
            26B — User & Role Control
          </span>

          <span>
            Last Action:
            ${esc(c.lastAction)}
          </span>

          <span>
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

    const c =
      getConfig();


    function checked(id) {

      const el =
        document.getElementById(id);

      return el
        ? !!el.checked
        : false;
    }


    /* ---------- ROLE ENABLE/DISABLE ---------- */

    Object.keys(c.systemRoles)
      .forEach(function (roleName) {

        const selector =
          document.querySelector(
            '.26b-role-enabled[data-role="' +
            roleName +
            '"]'
          );

        if (selector) {
          c.systemRoles[roleName].enabled =
            selector.checked;
        }

      });


    /* ---------- USER POLICIES ---------- */

    c.policies.userRegistration =
      checked("26b-userRegistration");

    c.policies.customerRegistration =
      checked("26b-customerRegistration");

    c.policies.vendorRegistration =
      checked("26b-vendorRegistration");

    c.policies.driverRegistration =
      checked("26b-driverRegistration");

    c.policies.roleSelection =
      checked("26b-roleSelection");

    c.policies.multipleRoleAssignment =
      checked("26b-multipleRoleAssignment");

    c.policies.disabledUserLogin =
      checked("26b-disabledUserLogin");

    c.policies.disabledRoleLogin =
      checked("26b-disabledRoleLogin");

    c.policies.adminApprovalRequired =
      checked("26b-adminApprovalRequired");


    /* ---------- KYC ---------- */

    c.policies.kycRequiredForCustomer =
      checked("26b-kycCustomer");

    c.policies.kycRequiredForVendor =
      checked("26b-kycVendor");

    c.policies.kycRequiredForDriver =
      checked("26b-kycDriver");


    /* ---------- HARD SECURITY ---------- */

    c.security.frontendAuthority =
      false;

    c.security.backendAuthority =
      true;

    c.policies.selfRoleChange =
      false;


    return c;
  }


  /* ==========================================================
     BIND
  ========================================================== */

  function bind() {

    const saveButton =
      document.getElementById("26b-save");

    const resetButton =
      document.getElementById("26b-reset");

    const reloadButton =
      document.getElementById("26b-reload");


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
              "26B validation failed:\n\n" +
              result.validation.errors.join("\n")
            );

            return;
          }


          saveButton.textContent =
            "Saved ✓";


          setTimeout(function () {

            saveButton.textContent =
              "Save Configuration";

          }, 1500);


          renderAndBind();

        };

    }


    /* ---------- RESET ---------- */

    if (resetButton) {

      resetButton.onclick =
        function () {

          if (
            !window.confirm(
              "Reset 26B User & Role Configuration?"
            )
          ) {
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
      document.getElementById("module-26B");

    if (!mount) {

      console.error(
        "GoVara26B: #module-26B mount not found."
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

    validate:
      validate,

    permissions:
      PERMISSIONS,

    STORAGE_KEY:
      STORAGE_KEY

  };

})();
