/* =========================================================
   GoVara — 26B User & Role Control
   FRONTEND-ONLY ADMINISTRATOR MODULE

   Version: 26B-Roles-V2
   Backend: NOT CONNECTED
   Database: NOT CONNECTED
   API: NOT USED

   IMPORTANT:
   Frontend is NOT the authority.
   Backend remains authoritative.

   Real Money = BLOCKED
   Real Payment = BLOCKED
   Bank Transfer = BLOCKED
   ========================================================= */

window.GoVara26B = (function () {

  "use strict";


  /* =========================================================
     STORAGE
     ========================================================= */

  const STORAGE_KEY =
    "GOVARA_USER_ROLE_CONTROL_26B_V2";


  /* =========================================================
     PERMISSION CATALOG
     ========================================================= */

  const PERMISSIONS = {

    dashboard: [
      "dashboard.view"
    ],

    customer: [
      "customer.view",
      "customer.create",
      "customer.update",
      "customer.booking",
      "customer.fare_estimate",
      "customer.billing",
      "customer.documents",
      "customer.rating"
    ],

    vendor: [
      "vendor.view",
      "vendor.create",
      "vendor.update",
      "vendor.booking",
      "vendor.vehicle",
      "vendor.duty",
      "vendor.documents",
      "vendor.billing"
    ],

    driver: [
      "driver.view",
      "driver.update",
      "driver.booking",
      "driver.duty",
      "driver.documents",
      "driver.location",
      "driver.rating"
    ],

    vehicle: [
      "vehicle.view",
      "vehicle.create",
      "vehicle.update",
      "vehicle.assign"
    ],

    booking: [
      "booking.view",
      "booking.create",
      "booking.update",
      "booking.cancel",
      "booking.assign"
    ],

    fare: [
      "fare.view",
      "fare.estimate",
      "fare.manage"
    ],

    transaction: [
      "transaction.view",
      "transaction.create"
    ],

    wallet: [
      "wallet.view",
      "wallet.manage"
    ],

    ledger: [
      "ledger.view",
      "ledger.manage"
    ],

    settlement: [
      "settlement.view",
      "settlement.manage"
    ],

    billing: [
      "billing.view",
      "billing.create",
      "billing.manage"
    ],

    documents: [
      "documents.view",
      "documents.upload",
      "documents.verify",
      "documents.manage"
    ],

    admin: [
      "admin.dashboard",
      "admin.user_manage",
      "admin.role_manage",
      "admin.permission_manage",
      "admin.policy_manage",
      "admin.operation_manage",
      "admin.financial_manage",
      "admin.document_manage",
      "admin.audit_view"
    ],

    audit: [
      "audit.view",
      "audit.create"
    ]

  };


  /* =========================================================
     FLATTEN PERMISSION CATALOG
     ========================================================= */

  function getPermissionCatalog() {

    const output = [];

    Object.keys(PERMISSIONS).forEach(function (group) {

      PERMISSIONS[group].forEach(function (permission) {

        output.push({
          id: permission,
          group: group
        });

      });

    });

    return output;
  }


  /* =========================================================
     ROLE DEFINITIONS
     ========================================================= */

  const ROLE_DEFINITIONS = {

    Admin: {

      description:
        "Platform administrator with configurable administrative access.",

      defaultPermissions: [
        "dashboard.view",

        "customer.view",
        "customer.create",
        "customer.update",

        "vendor.view",
        "vendor.create",
        "vendor.update",

        "driver.view",
        "driver.update",

        "vehicle.view",
        "vehicle.create",
        "vehicle.update",
        "vehicle.assign",

        "booking.view",
        "booking.create",
        "booking.update",
        "booking.cancel",
        "booking.assign",

        "fare.view",
        "fare.estimate",
        "fare.manage",

        "transaction.view",

        "wallet.view",

        "ledger.view",

        "settlement.view",

        "billing.view",
        "billing.create",

        "documents.view",
        "documents.upload",
        "documents.verify",
        "documents.manage",

        "admin.dashboard",
        "admin.user_manage",
        "admin.role_manage",
        "admin.permission_manage",
        "admin.policy_manage",
        "admin.operation_manage",
        "admin.financial_manage",
        "admin.document_manage",
        "admin.audit_view",

        "audit.view"
      ]

    },


    Customer: {

      description:
        "Customer who initiates booking and uses customer services.",

      defaultPermissions: [
        "dashboard.view",

        "customer.view",
        "customer.create",
        "customer.update",
        "customer.booking",
        "customer.fare_estimate",
        "customer.billing",
        "customer.documents",
        "customer.rating",

        "booking.view",
        "booking.create",

        "fare.view",
        "fare.estimate",

        "billing.view",

        "documents.view",
        "documents.upload"
      ]

    },


    Vendor: {

      description:
        "Vendor or company managing vehicles, bookings and operations.",

      defaultPermissions: [
        "dashboard.view",

        "vendor.view",
        "vendor.create",
        "vendor.update",
        "vendor.booking",
        "vendor.vehicle",
        "vendor.duty",
        "vendor.documents",
        "vendor.billing",

        "vehicle.view",
        "vehicle.create",
        "vehicle.update",
        "vehicle.assign",

        "booking.view",
        "booking.update",
        "booking.assign",

        "fare.view",

        "billing.view",

        "documents.view",
        "documents.upload"
      ]

    },


    Driver: {

      description:
        "Driver operating assigned duties and bookings.",

      defaultPermissions: [
        "dashboard.view",

        "driver.view",
        "driver.update",
        "driver.booking",
        "driver.duty",
        "driver.documents",
        "driver.location",
        "driver.rating",

        "booking.view",
        "booking.update",

        "fare.view",

        "documents.view",
        "documents.upload"
      ]

    }

  };


  /* =========================================================
     DEFAULT CONFIGURATION
     ========================================================= */

  function getDefaultConfig() {

    const roles = {};

    Object.keys(ROLE_DEFINITIONS).forEach(function (role) {

      roles[role] = {

        enabled: true,

        permissions:
          ROLE_DEFINITIONS[role]
            .defaultPermissions
            .slice(),

        registrationAllowed: true,

        adminApprovalRequired:
          role === "Admin" ? true : false,

        kycRequired:
          role === "Admin" ? false : true,

        description:
          ROLE_DEFINITIONS[role].description

      };

    });


    return {

      version: "26B-V2",

      roles: roles,

      policies: {

        userRegistrationEnabled: true,

        customerRegistrationEnabled: true,

        vendorRegistrationEnabled: true,

        driverRegistrationEnabled: true,

        disabledRoleLoginBlocked: true,

        disabledUserLoginBlocked: true,

        multipleRolesAllowed: true,

        adminApprovalEnabled: true,

        roleChangeAuditEnabled: true,

        permissionChangeAuditEnabled: true

      },

      security: {

        permissionEnforcement: true,

        sessionControl: true,

        auditRoleChanges: true,

        auditPermissionChanges: true,

        selfRoleChangeAllowed: false,

        frontendAuthority: false,

        backendAuthority: true,

        realMoney: false,

        realPayment: false,

        bankTransfer: false

      }

    };

  }


  /* =========================================================
     CONFIG LOAD
     ========================================================= */

  function loadConfig() {

    try {

      const raw =
        localStorage.getItem(STORAGE_KEY);

      if (!raw) {

        return getDefaultConfig();

      }

      const saved =
        JSON.parse(raw);

      const defaults =
        getDefaultConfig();


      return mergeConfig(
        defaults,
        saved
      );

    } catch (error) {

      console.error(
        "GoVara26B load error:",
        error
      );

      return getDefaultConfig();

    }

  }


  /* =========================================================
     DEEP MERGE
     ========================================================= */

  function mergeConfig(base, override) {

    if (
      !override ||
      typeof override !== "object"
    ) {

      return base;

    }


    Object.keys(override).forEach(function (key) {

      if (
        override[key] &&
        typeof override[key] === "object" &&
        !Array.isArray(override[key]) &&
        base[key] &&
        typeof base[key] === "object" &&
        !Array.isArray(base[key])
      ) {

        base[key] =
          mergeConfig(
            base[key],
            override[key]
          );

      } else {

        base[key] =
          override[key];

      }

    });


    return base;

  }


  /* =========================================================
     CONFIG
     ========================================================= */

  let config =
    loadConfig();


  let selectedRole =
    "Admin";


  /* =========================================================
     SAVE
     ========================================================= */

  function save() {

    const validation =
      validate();


    if (!validation.valid) {

      alert(
        validation.errors.join("\n")
      );

      return false;

    }


    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(config)
      );


      createAuditEvent(
        "26B_CONFIG_SAVED"
      );


      renderAndBind();


      return true;

    } catch (error) {

      console.error(
        "GoVara26B save error:",
        error
      );

      alert(
        "Unable to save 26B configuration."
      );

      return false;

    }

  }


  /* =========================================================
     RESET
     ========================================================= */

  function reset() {

    const confirmed =
      window.confirm(
        "Reset all 26B User & Role Control settings to defaults?"
      );


    if (!confirmed) {

      return;

    }


    config =
      getDefaultConfig();


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(config)
    );


    createAuditEvent(
      "26B_CONFIG_RESET"
    );


    renderAndBind();

  }


  /* =========================================================
     VALIDATION
     ========================================================= */

  function validate() {

    const errors = [];


    if (
      !config ||
      !config.roles
    ) {

      errors.push(
        "Role configuration is missing."
      );

    }


    Object.keys(
      ROLE_DEFINITIONS
    ).forEach(function (role) {

      if (
        !config.roles[role]
      ) {

        errors.push(
          "Missing role: " + role
        );

      }

    });


    if (
      config.security.frontendAuthority !==
      false
    ) {

      errors.push(
        "Frontend authority must remain false."
      );

    }


    if (
      config.security.backendAuthority !==
      true
    ) {

      errors.push(
        "Backend authority must remain true."
      );

    }


    if (
      config.security.realMoney !==
      false
    ) {

      errors.push(
        "Real Money must remain blocked."
      );

    }


    if (
      config.security.realPayment !==
      false
    ) {

      errors.push(
        "Real Payment must remain blocked."
      );

    }


    if (
      config.security.bankTransfer !==
      false
    ) {

      errors.push(
        "Bank Transfer must remain blocked."
      );

    }


    return {

      valid:
        errors.length === 0,

      errors:
        errors

    };

  }


  /* =========================================================
     AUDIT
     ========================================================= */

  function createAuditEvent(action) {

    const eventsKey =
      "GOVARA_26B_AUDIT_EVENTS";

    let events = [];


    try {

      events =
        JSON.parse(
          localStorage.getItem(
            eventsKey
          ) || "[]"
        );

    } catch (error) {

      events = [];

    }


    events.push({

      action: action,

      module: "26B",

      timestamp:
        new Date().toISOString(),

      frontendAuthority:
        false,

      backendAuthority:
        true

    });


    if (events.length > 100) {

      events =
        events.slice(-100);

    }


    localStorage.setItem(
      eventsKey,
      JSON.stringify(events)
    );

  }


  /* =========================================================
     ROLE PERMISSION HELPERS
     ========================================================= */

  function hasPermission(
    role,
    permission
  ) {

    if (
      !config.roles[role]
    ) {

      return false;

    }


    return config
      .roles[role]
      .permissions
      .includes(permission);

  }


  function addPermission(
    role,
    permission
  ) {

    if (
      !config.roles[role]
    ) {

      return;

    }


    if (
      !permission
    ) {

      return;

    }


    if (
      hasPermission(
        role,
        permission
      )
    ) {

      return;

    }


    config
      .roles[role]
      .permissions
      .push(permission);


    createAuditEvent(
      "26B_PERMISSION_ADDED_" +
      role
    );

  }


  function removePermission(
    role,
    permission
  ) {

    if (
      !config.roles[role]
    ) {

      return;

    }


    config
      .roles[role]
      .permissions =
      config
        .roles[role]
        .permissions
        .filter(function (item) {

          return item !== permission;

        });


    createAuditEvent(
      "26B_PERMISSION_REMOVED_" +
      role
    );

  }


  /* =========================================================
     ESCAPE HTML
     ========================================================= */

  function escapeHtml(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* =========================================================
     PERMISSION LABEL
     ========================================================= */

  function permissionLabel(
    permission
  ) {

    return permission
      .replace(/\./g, " › ")
      .replace(/_/g, " ");

  }


  /* =========================================================
     PERMISSION GROUP
     ========================================================= */

  function renderPermissionGroups(
    role
  ) {

    const roleConfig =
      config.roles[role];


    if (!roleConfig) {

      return "";

    }


    const assigned =
      roleConfig.permissions || [];


    let html = "";


    Object.keys(
      PERMISSIONS
    ).forEach(function (group) {

      const permissions =
        PERMISSIONS[group];


      const assignedCount =
        permissions.filter(
          function (permission) {

            return assigned.includes(
              permission
            );

          }
        ).length;


      html += `

        <div class="card"
             style="margin-top:12px;">

          <div style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:10px;
            margin-bottom:10px;
          ">

            <div>

              <h3 style="margin:0;">
                ${escapeHtml(group)}
              </h3>

              <div class="muted">
                ${assignedCount}
                /
                ${permissions.length}
                assigned
              </div>

            </div>

            <button
              type="button"
              class="btn"
              data-action="group-toggle"
              data-role="${escapeHtml(role)}"
              data-group="${escapeHtml(group)}"
            >
              Toggle Group
            </button>

          </div>


          <div style="
            display:grid;
            grid-template-columns:
              repeat(auto-fit,minmax(220px,1fr));
            gap:8px;
          ">

      `;


      permissions.forEach(
        function (permission) {

          const checked =
            assigned.includes(
              permission
            );


          html += `

            <label
              style="
                display:flex;
                align-items:center;
                gap:9px;
                padding:9px 10px;
                border:1px solid var(--border);
                border-radius:9px;
                background:var(--panel-2);
                cursor:pointer;
              "
            >

              <input
                type="checkbox"
                class="permission-checkbox"
                data-role="${escapeHtml(role)}"
                data-permission="${escapeHtml(permission)}"
                ${checked ? "checked" : ""}
              />

              <span>

                <strong>
                  ${escapeHtml(
                    permissionLabel(
                      permission
                    )
                  )}
                </strong>

                <br />

                <span class="muted">
                  ${escapeHtml(permission)}
                </span>

              </span>

            </label>

          `;

        }
      );


      html += `

          </div>

        </div>

      `;

    });


    return html;

  }


  /* =========================================================
     RENDER ROLE TABS
     ========================================================= */

  function renderRoleTabs() {

    let html = "";


    Object.keys(
      ROLE_DEFINITIONS
    ).forEach(function (role) {

      const active =
        selectedRole === role;


      const enabled =
        config.roles[role].enabled;


      const count =
        config.roles[role]
          .permissions
          .length;


      html += `

        <button
          type="button"
          class="btn ${active ? "primary" : ""}"
          data-action="select-role"
          data-role="${escapeHtml(role)}"
          style="
            min-width:150px;
            text-align:left;
          "
        >

          <strong>
            ${escapeHtml(role)}
          </strong>

          <br />

          <span style="
            font-size:10px;
            opacity:.75;
          ">
            ${enabled ? "ENABLED" : "DISABLED"}
            ·
            ${count} permissions
          </span>

        </button>

      `;

    });


    return html;

  }


  /* =========================================================
     RENDER ADD PERMISSION AREA
     ========================================================= */

  function renderAddPermission(role) {

    const assigned =
      config.roles[role]
        .permissions || [];


    const available =
      getPermissionCatalog()
        .filter(function (item) {

          return !assigned.includes(
            item.id
          );

        });


    let options = "";


    available.forEach(
      function (item) {

        options += `

          <option
            value="${escapeHtml(item.id)}"
          >
            ${escapeHtml(item.id)}
          </option>

        `;

      }
    );


    return `

      <div class="card"
           style="margin-top:16px;">

        <h2>
          Add Permission
        </h2>

        <div class="muted">
          Add another permission from the
          central permission catalog to
          <strong>${escapeHtml(role)}</strong>.
        </div>

        <div style="height:12px;"></div>

        <div style="
          display:flex;
          gap:9px;
          flex-wrap:wrap;
        ">

          <select
            id="permission-add-select"
            style="
              flex:1;
              min-width:240px;
              padding:10px;
              border-radius:9px;
              border:1px solid var(--border);
              background:var(--panel-2);
              color:var(--text);
            "
          >

            <option value="">
              Select permission...
            </option>

            ${options}

          </select>


          <button
            type="button"
            class="btn primary"
            data-action="add-permission"
            data-role="${escapeHtml(role)}"
          >
            + Add Permission
          </button>

        </div>

        ${
          available.length === 0
            ? `
              <div
                class="notice success"
                style="margin-top:12px;"
              >
                All catalog permissions are
                already assigned to this role.
              </div>
            `
            : ""
        }

      </div>

    `;

  }


  /* =========================================================
     RENDER SELECTED ROLE
     ========================================================= */

  function renderSelectedRole() {

    const role =
      selectedRole;


    const roleConfig =
      config.roles[role];


    if (!roleConfig) {

      return "";

    }


    const permissionCount =
      roleConfig.permissions.length;


    const catalogCount =
      getPermissionCatalog().length;


    return `

      <div class="card">

        <div style="
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          gap:15px;
          flex-wrap:wrap;
        ">

          <div>

            <h2>
              ${escapeHtml(role)}
            </h2>

            <div class="muted">
              ${escapeHtml(
                roleConfig.description
              )}
            </div>

          </div>


          <div
            class="notice success"
            style="min-width:180px;"
          >

            <strong>
              ${permissionCount}
            </strong>

            / ${catalogCount}

            <br />

            <span class="muted">
              Assigned Permissions
            </span>

          </div>

        </div>


        <div style="height:16px;"></div>


        <div class="grid four">


          <div class="notice">

            <strong>
              ${roleConfig.enabled
                ? "ENABLED"
                : "DISABLED"}
            </strong>

            <br />

            <span class="muted">
              Role Status
            </span>

          </div>


          <div class="notice">

            <strong>
              ${roleConfig.registrationAllowed
                ? "ALLOWED"
                : "BLOCKED"}
            </strong>

            <br />

            <span class="muted">
              Registration
            </span>

          </div>


          <div class="notice">

            <strong>
              ${roleConfig.adminApprovalRequired
                ? "REQUIRED"
                : "NOT REQUIRED"}
            </strong>

            <br />

            <span class="muted">
              Admin Approval
            </span>

          </div>


          <div class="notice">

            <strong>
              ${roleConfig.kycRequired
                ? "REQUIRED"
                : "NOT REQUIRED"}
            </strong>

            <br />

            <span class="muted">
              Role-based KYC
            </span>

          </div>


        </div>


        <div style="height:16px;"></div>


        <h3>
          Role Controls
        </h3>


        <div class="grid two">


          <label class="notice">

            <input
              type="checkbox"
              data-role-toggle="enabled"
              data-role="${escapeHtml(role)}"
              ${roleConfig.enabled ? "checked" : ""}
            />

            <strong>
              Enable Role
            </strong>

            <div class="muted">
              Disabled roles cannot be used
              for normal login/access.
            </div>

          </label>


          <label class="notice">

            <input
              type="checkbox"
              data-role-toggle="registrationAllowed"
              data-role="${escapeHtml(role)}"
              ${roleConfig.registrationAllowed ? "checked" : ""}
            />

            <strong>
              Allow Registration
            </strong>

            <div class="muted">
              Allow users to register under
              this role.
            </div>

          </label>


          <label class="notice">

            <input
              type="checkbox"
              data-role-toggle="adminApprovalRequired"
              data-role="${escapeHtml(role)}"
              ${roleConfig.adminApprovalRequired ? "checked" : ""}
            />

            <strong>
              Admin Approval Required
            </strong>

            <div class="muted">
              New users under this role require
              administrator approval.
            </div>

          </label>


          <label class="notice">

            <input
              type="checkbox"
              data-role-toggle="kycRequired"
              data-role="${escapeHtml(role)}"
              ${roleConfig.kycRequired ? "checked" : ""}
            />

            <strong>
              KYC Required
            </strong>

            <div class="muted">
              Role-based KYC requirement.
            </div>

          </label>


        </div>

      </div>


      <div style="height:16px;"></div>


      <section>

        <div class="page-head">

          <h1 style="font-size:20px;">
            Permission Assignment
          </h1>

          <div class="muted">
            Select, remove or add permissions
            for ${escapeHtml(role)}.
          </div>

        </div>


        ${renderPermissionGroups(role)}


        ${renderAddPermission(role)}


      </section>

    `;

  }


  /* =========================================================
     RENDER
     ========================================================= */

  function render() {

    return `

      <div class="page-head">

        <h1>
          26B — User & Role Control
        </h1>

        <div class="muted">
          Manage roles, permissions, registration
          policies, KYC requirements and access
          security boundaries.
        </div>

      </div>


      <!-- ==============================================
           ROLE SELECTOR
           ============================================== -->

      <section class="card">

        <h2>
          Roles
        </h2>

        <div class="muted">
          Select a role to manage its controls
          and permissions.
        </div>

        <div style="height:14px;"></div>

        <div
          style="
            display:flex;
            gap:8px;
            flex-wrap:wrap;
          "
        >

          ${renderRoleTabs()}

        </div>

      </section>


      <div style="height:16px;"></div>


      <!-- ==============================================
           SELECTED ROLE
           ============================================== -->

      ${renderSelectedRole()}


      <div style="height:16px;"></div>


      <!-- ==============================================
           PERMISSION CATALOG
           ============================================== -->

      <section class="card">

        <h2>
          Permission Catalog
        </h2>

        <div class="muted">
          Central catalog from which permissions
          can be assigned to each role.
        </div>

        <div style="height:14px;"></div>


        <div class="grid four">

          ${
            Object.keys(PERMISSIONS)
              .map(function (group) {

                return `

                  <div class="notice">

                    <strong>
                      ${escapeHtml(group)}
                    </strong>

                    <br />

                    <span class="muted">
                      ${PERMISSIONS[group].length}
                      permissions
                    </span>

                  </div>

                `;

              })
              .join("")
          }

        </div>

      </section>


      <div style="height:16px;"></div>


      <!-- ==============================================
           USER REGISTRATION POLICY
           ============================================== -->

      <section class="card">

        <h2>
          User Registration Policy
        </h2>

        <div class="muted">
          Frontend configuration for which
          user types may register.
        </div>

        <div style="height:14px;"></div>


        <div class="grid two">


          ${renderPolicyCheckbox(
            "userRegistrationEnabled",
            "User Registration",
            "Allow platform user registration."
          )}


          ${renderPolicyCheckbox(
            "customerRegistrationEnabled",
            "Customer Registration",
            "Allow Customer registration."
          )}


          ${renderPolicyCheckbox(
            "vendorRegistrationEnabled",
            "Vendor Registration",
            "Allow Vendor registration."
          )}


          ${renderPolicyCheckbox(
            "driverRegistrationEnabled",
            "Driver Registration",
            "Allow Driver registration."
          )}


          ${renderPolicyCheckbox(
            "disabledRoleLoginBlocked",
            "Disabled Role Login Block",
            "Prevent login using disabled roles."
          )}


          ${renderPolicyCheckbox(
            "disabledUserLoginBlocked",
            "Disabled User Login Block",
            "Prevent disabled users from logging in."
          )}


          ${renderPolicyCheckbox(
            "multipleRolesAllowed",
            "Multiple Roles Allowed",
            "Allow users to hold multiple roles."
          )}


          ${renderPolicyCheckbox(
            "adminApprovalEnabled",
            "Admin Approval",
            "Enable administrator approval workflow."
          )}

        </div>

      </section>


      <div style="height:16px;"></div>


      <!-- ==============================================
           ROLE BASED KYC
           ============================================== -->

      <section class="card">

        <h2>
          Role-Based KYC
        </h2>

        <div class="muted">
          Configure KYC requirement separately
          for every role.
        </div>

        <div style="height:14px;"></div>


        <div class="grid four">

          ${renderKycCard("Admin")}

          ${renderKycCard("Customer")}

          ${renderKycCard("Vendor")}

          ${renderKycCard("Driver")}

        </div>

      </section>


      <div style="height:16px;"></div>


      <!-- ==============================================
           ACCESS SECURITY BOUNDARY
           ============================================== -->

      <section class="card">

        <h2>
          Access Security Boundary
        </h2>

        <div class="muted">
          Security boundaries are intentionally
          controlled here and remain safe.
        </div>

        <div style="height:14px;"></div>


        <div class="grid two">


          <div class="notice success">

            <strong>
              Permission Enforcement
            </strong>

            <br />

            ${
              config.security.permissionEnforcement
                ? "ENABLED"
                : "DISABLED"
            }

          </div>


          <div class="notice success">

            <strong>
              Session Control
            </strong>

            <br />

            ${
              config.security.sessionControl
                ? "ENABLED"
                : "DISABLED"
            }

          </div>


          <div class="notice success">

            <strong>
              Role Change Audit
            </strong>

            <br />

            ${
              config.security.auditRoleChanges
                ? "ENABLED"
                : "DISABLED"
            }

          </div>


          <div class="notice success">

            <strong>
              Permission Change Audit
            </strong>

            <br />

            ${
              config.security.auditPermissionChanges
                ? "ENABLED"
                : "DISABLED"
            }

          </div>


        </div>


        <div style="height:14px;"></div>


        <div class="notice warn">

          <strong>
            Authority Boundary
          </strong>

          <br /><br />

          Frontend Authority:
          <strong>FALSE</strong>

          <br />

          Backend Authority:
          <strong>TRUE</strong>

          <br /><br />

          Self Role Change:
          <strong>BLOCKED</strong>

        </div>


        <div style="height:14px;"></div>


        <div class="notice danger">

          <strong>
            Financial Safety
          </strong>

          <br /><br />

          Real Money:
          <strong>BLOCKED</strong>

          <br />

          Real Payment:
          <strong>BLOCKED</strong>

          <br />

          Bank Transfer:
          <strong>BLOCKED</strong>

        </div>

      </section>


      <div style="height:18px;"></div>


      <!-- ==============================================
           SAVE / RESET
           ============================================== -->

      <section class="card">

        <div class="button-row">

          <button
            type="button"
            class="btn primary"
            data-action="save"
          >
            Save 26B Configuration
          </button>


          <button
            type="button"
            class="btn warning"
            data-action="reset"
          >
            Reset to Defaults
          </button>


          <button
            type="button"
            class="btn"
            data-action="reload"
          >
            Reload
          </button>

        </div>


        <div style="height:10px;"></div>


        <div class="muted">
          Current configuration is stored locally
          in the browser for frontend testing.
          No backend or database operation is
          executed.
        </div>

      </section>

    `;

  }


  /* =========================================================
     POLICY CHECKBOX
     ========================================================= */

  function renderPolicyCheckbox(
    key,
    title,
    description
  ) {

    const checked =
      config.policies[key];


    return `

      <label class="notice">

        <input
          type="checkbox"
          data-policy="${escapeHtml(key)}"
          ${checked ? "checked" : ""}
        />

        <strong>
          ${escapeHtml(title)}
        </strong>

        <div class="muted">
          ${escapeHtml(description)}
        </div>

      </label>

    `;

  }


  /* =========================================================
     KYC CARD
     ========================================================= */

  function renderKycCard(role) {

    const value =
      config.roles[role]
        .kycRequired;


    return `

      <label class="notice">

        <strong>
          ${escapeHtml(role)}
        </strong>

        <br /><br />

        <input
          type="checkbox"
          data-role-toggle="kycRequired"
          data-role="${escapeHtml(role)}"
          ${value ? "checked" : ""}
        />

        KYC Required

      </label>

    `;

  }


  /* =========================================================
     GROUP TOGGLE
     ========================================================= */

  function toggleGroup(
    role,
    group
  ) {

    const permissions =
      PERMISSIONS[group];


    if (
      !permissions ||
      !config.roles[role]
    ) {

      return;

    }


    const allAssigned =
      permissions.every(
        function (permission) {

          return hasPermission(
            role,
            permission
          );

        }
      );


    if (allAssigned) {

      permissions.forEach(
        function (permission) {

          removePermission(
            role,
            permission
          );

        }
      );

    } else {

      permissions.forEach(
        function (permission) {

          addPermission(
            role,
            permission
          );

        }
      );

    }


    renderAndBind();

  }


  /* =========================================================
     BIND
     ========================================================= */

  function bind() {


    /* -------------------------------------------------------
       ROLE SELECT
       ------------------------------------------------------- */

    document
      .querySelectorAll(
        '[data-action="select-role"]'
      )
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            selectedRole =
              this.dataset.role;

            renderAndBind();

          }
        );

      });


    /* -------------------------------------------------------
       ROLE TOGGLES
       ------------------------------------------------------- */

    document
      .querySelectorAll(
        "[data-role-toggle]"
      )
      .forEach(function (checkbox) {

        checkbox.addEventListener(
          "change",
          function () {

            const role =
              this.dataset.role;

            const key =
              this.dataset.roleToggle;


            if (
              !config.roles[role]
            ) {

              return;

            }


            config
              .roles[role][key] =
              this.checked;


            createAuditEvent(
              "26B_ROLE_SETTING_CHANGED_" +
              role
            );


            renderAndBind();

          }
        );

      });


    /* -------------------------------------------------------
       POLICY TOGGLES
       ------------------------------------------------------- */

    document
      .querySelectorAll(
        "[data-policy]"
      )
      .forEach(function (checkbox) {

        checkbox.addEventListener(
          "change",
          function () {

            const key =
              this.dataset.policy;


            config.policies[key] =
              this.checked;


            createAuditEvent(
              "26B_POLICY_CHANGED_" +
              key
            );


            renderAndBind();

          }
        );

      });


    /* -------------------------------------------------------
       PERMISSION CHECKBOXES
       ------------------------------------------------------- */

    document
      .querySelectorAll(
        ".permission-checkbox"
      )
      .forEach(function (checkbox) {

        checkbox.addEventListener(
          "change",
          function () {

            const role =
              this.dataset.role;

            const permission =
              this.dataset.permission;


            if (
              this.checked
            ) {

              addPermission(
                role,
                permission
              );

            } else {

              removePermission(
                role,
                permission
              );

            }


            renderAndBind();

          }
        );

      });


    /* -------------------------------------------------------
       ADD PERMISSION
       ------------------------------------------------------- */

    document
      .querySelectorAll(
        '[data-action="add-permission"]'
      )
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            const role =
              this.dataset.role;


            const select =
              document.getElementById(
                "permission-add-select"
              );


            if (
              !select ||
              !select.value
            ) {

              alert(
                "Please select a permission first."
              );

              return;

            }


            addPermission(
              role,
              select.value
            );


            renderAndBind();

          }
        );

      });


    /* -------------------------------------------------------
       GROUP TOGGLE
       ------------------------------------------------------- */

    document
      .querySelectorAll(
        '[data-action="group-toggle"]'
      )
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            toggleGroup(
              this.dataset.role,
              this.dataset.group
            );

          }
        );

      });


    /* -------------------------------------------------------
       SAVE
       ------------------------------------------------------- */

    document
      .querySelectorAll(
        '[data-action="save"]'
      )
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            save();

          }
        );

      });


    /* -------------------------------------------------------
       RESET
       ------------------------------------------------------- */

    document
      .querySelectorAll(
        '[data-action="reset"]'
      )
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            reset();

          }
        );

      });


    /* -------------------------------------------------------
       RELOAD
       ------------------------------------------------------- */

    document
      .querySelectorAll(
        '[data-action="reload"]'
      )
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            config =
              loadConfig();

            renderAndBind();

          }
        );

      });

  }


  /* =========================================================
     RENDER + BIND
     ========================================================= */

  function renderAndBind() {

    const mount =
      document.getElementById(
        "module-26B"
      );


    if (!mount) {

      console.error(
        "GoVara26B mount #module-26B not found."
      );

      return;

    }


    mount.innerHTML =
      render();


    bind();

  }


  /* =========================================================
     PUBLIC API
     ========================================================= */

  return {

    render:
      render,

    bind:
      bind,

    renderAndBind:
      renderAndBind,

    getConfig:
      function () {

        return JSON.parse(
          JSON.stringify(config)
        );

      },

    save:
      save,

    reset:
      reset,

    validate:
      validate,

    hasPermission:
      hasPermission,

    addPermission:
      addPermission,

    removePermission:
      removePermission,

    permissions:
      PERMISSIONS,

    roles:
      ROLE_DEFINITIONS,

    STORAGE_KEY:
      STORAGE_KEY

  };


})();
