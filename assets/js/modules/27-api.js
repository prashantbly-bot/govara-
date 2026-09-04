(function (window, document) {
  "use strict";

  var VERSION = "GOVARA-CONSOLIDATED-API-V5";

  var CONFIG = {
    API_URL: "",
    REQUEST_TIMEOUT: 20000,
    PROJECT: "GoVara",
    VERSION: VERSION,
    ENVIRONMENT: "TESTING",

    REAL_MONEY: false,
    REAL_PAYMENT: false,
    BANK_TRANSFER: false,

    FRONTEND_FINANCIAL_AUTHORITY: false,
    BACKEND_FINANCIAL_AUTHORITY: true,

    FRONTEND_KYC_AUTHORITY: false,
    BACKEND_KYC_AUTHORITY: true,

    DATABASE_AUTHORITY: true
  };

  if (
    typeof window.GOVARA_API_URL === "string" &&
    window.GOVARA_API_URL.trim() !== ""
  ) {
    CONFIG.API_URL = window.GOVARA_API_URL.trim();
  }

  var APIState = {
    configured: CONFIG.API_URL !== "",
    connected: false,
    verified: false,
    loading: false,
    lastAction: null,
    lastResponse: null,
    lastError: null,
    requestCount: 0,
    successCount: 0,
    errorCount: 0
  };

  var MODULES = [
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
    "KYC",
    "Admin",
    "Audit",
    "Auth",
    "Notification",
    "Location",
    "Travel",
    "Welfare"
  ];

  var ACTIONS = {
    GET_HEALTH: "GET_HEALTH",
    AUTH_LOGIN: "AUTH_LOGIN",
    AUTH_REGISTER: "AUTH_REGISTER",
    AUTH_LOGOUT: "AUTH_LOGOUT",
    CUSTOMER_SAVE: "CUSTOMER_SAVE",
    CUSTOMER_LIST: "CUSTOMER_LIST",
    BOOKING_SAVE: "BOOKING_SAVE",
    BOOKING_LIST: "BOOKING_LIST",
    FARE_CALCULATE: "FARE_CALCULATE",
    TRANSACTION_CREATE: "TRANSACTION_CREATE",
    WALLET_GET: "WALLET_GET",
    WALLET_UPDATE: "WALLET_UPDATE",
    ADMIN_GET: "ADMIN_GET",
    ADMIN_UPDATE: "ADMIN_UPDATE",
    AUDIT_LIST: "AUDIT_LIST",
    DOCUMENT_LIST: "DOCUMENT_LIST",
    DOCUMENT_SAVE: "DOCUMENT_SAVE",
    KYC_GET: "KYC_GET",
    KYC_SAVE: "KYC_SAVE",
    KYC_REVIEW: "KYC_REVIEW",
    NOTIFICATION_LIST: "NOTIFICATION_LIST",
    LOCATION_GET: "LOCATION_GET",
    WELFARE_GET: "WELFARE_GET",
    PAYMENT_EXECUTE: "PAYMENT_EXECUTE",
    BANK_TRANSFER_EXECUTE: "BANK_TRANSFER_EXECUTE",
    REAL_MONEY_TRANSFER: "REAL_MONEY_TRANSFER"
  };

  function enforceSafety() {
    CONFIG.ENVIRONMENT = "TESTING";
    CONFIG.REAL_MONEY = false;
    CONFIG.REAL_PAYMENT = false;
    CONFIG.BANK_TRANSFER = false;
    CONFIG.FRONTEND_FINANCIAL_AUTHORITY = false;
    CONFIG.BACKEND_FINANCIAL_AUTHORITY = true;
    CONFIG.FRONTEND_KYC_AUTHORITY = false;
    CONFIG.BACKEND_KYC_AUTHORITY = true;
    CONFIG.DATABASE_AUTHORITY = true;

    APIState.configured =
      typeof CONFIG.API_URL === "string" &&
      CONFIG.API_URL.trim() !== "";
  }

  function getMount() {
    return (
      document.getElementById("module-27") ||
      document.getElementById("module-27-api")
    );
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function render() {
    var mount = getMount();

    if (!mount) {
      return false;
    }

    enforceSafety();

    var apiStatus = CONFIG.API_URL
      ? "CONFIGURED"
      : "NOT CONFIGURED";

    var connectionStatus = APIState.connected
      ? "CONNECTED"
      : "NOT CONNECTED";

    var verificationStatus = APIState.verified
      ? "VERIFIED"
      : "NOT VERIFIED";

    mount.innerHTML =
      '<div class="govara27">' +

        '<div class="govara27-header">' +
          '<div>' +
            '<div class="govara27-step">STEP 27</div>' +
            '<h2>Consolidated API Boundary</h2>' +
            '<p>Single API boundary for the GoVara modular frontend.</p>' +
          '</div>' +
          '<div class="govara27-version">' +
            escapeHtml(VERSION) +
          '</div>' +
        '</div>' +

        '<div class="govara27-grid">' +

          '<div class="govara27-card">' +
            '<span>API</span>' +
            '<strong>' + apiStatus + '</strong>' +
          '</div>' +

          '<div class="govara27-card">' +
            '<span>Connection</span>' +
            '<strong>' + connectionStatus + '</strong>' +
          '</div>' +

          '<div class="govara27-card">' +
            '<span>Verification</span>' +
            '<strong>' + verificationStatus + '</strong>' +
          '</div>' +

          '<div class="govara27-card">' +
            '<span>Environment</span>' +
            '<strong>TESTING</strong>' +
          '</div>' +

        '</div>' +

        '<div class="govara27-section">' +
          '<h3>API Endpoint</h3>' +

          '<div class="govara27-endpoint">' +
            '<input id="govara27-api-url" type="text" ' +
              'placeholder="Apps Script Web App URL" ' +
              'value="' + escapeHtml(CONFIG.API_URL) + '">' +

            '<button id="govara27-save-url">' +
              'Save Endpoint' +
            '</button>' +

            '<button id="govara27-test">' +
              'Test Connection' +
            '</button>' +
          '</div>' +

          '<p>Connection testing is manual. No automatic backend request is made.</p>' +
        '</div>' +

        '<div class="govara27-section">' +
          '<h3>Financial Safety</h3>' +

          '<div class="govara27-safety">' +
            '<div>Real Money <b>BLOCKED</b></div>' +
            '<div>Real Payment <b>BLOCKED</b></div>' +
            '<div>Bank Transfer <b>BLOCKED</b></div>' +
            '<div>Frontend Financial Authority <b>DISABLED</b></div>' +
            '<div>Backend Financial Authority <b>AUTHORITATIVE</b></div>' +
          '</div>' +
        '</div>' +

        '<div class="govara27-section">' +
          '<h3>KYC & Database Authority</h3>' +

          '<div class="govara27-safety">' +
            '<div>Frontend KYC Authority <b>DISABLED</b></div>' +
            '<div>Backend KYC Authority <b>AUTHORITATIVE</b></div>' +
            '<div>Database Authority <b>AUTHORITATIVE</b></div>' +
          '</div>' +
        '</div>' +

        '<div class="govara27-section">' +
          '<h3>Consolidated Modules</h3>' +
          '<div class="govara27-modules">' +
            MODULES.map(function (moduleName) {
              return "<span>" +
                escapeHtml(moduleName) +
                "</span>";
            }).join("") +
          '</div>' +
        '</div>' +

        '<div class="govara27-section">' +
          '<h3>Diagnostics</h3>' +

          '<div class="govara27-safety">' +
            '<div>Requests <b>' +
              APIState.requestCount +
            '</b></div>' +

            '<div>Success <b>' +
              APIState.successCount +
            '</b></div>' +

            '<div>Errors <b>' +
              APIState.errorCount +
            '</b></div>' +

            '<div>Last Action <b>' +
              escapeHtml(APIState.lastAction || "—") +
            '</b></div>' +
          '</div>' +
        '</div>' +

        '<div id="govara27-message"></div>' +

      '</div>';

    injectStyles();

    return true;
  }

  function bind() {
    var saveButton =
      document.getElementById("govara27-save-url");

    var testButton =
      document.getElementById("govara27-test");

    var input =
      document.getElementById("govara27-api-url");

    if (saveButton) {
      saveButton.onclick = function () {
        CONFIG.API_URL = input
          ? input.value.trim()
          : "";

        enforceSafety();

        renderAndBind();
      };
    }

    if (testButton) {
      testButton.onclick = function () {
        testConnection();
      };
    }
  }

  function showMessage(message) {
    var box =
      document.getElementById("govara27-message");

    if (box) {
      box.textContent = message;
    }
  }

  function request(action, payload) {
    enforceSafety();

    APIState.lastAction = action;

    if (!CONFIG.API_URL) {
      APIState.errorCount++;

      var result = {
        success: false,
        status: "API_NOT_CONFIGURED",
        action: action,
        message: "API endpoint is not configured."
      };

      APIState.lastResponse = result;

      return Promise.resolve(result);
    }

    if (
      action === ACTIONS.PAYMENT_EXECUTE ||
      action === ACTIONS.BANK_TRANSFER_EXECUTE ||
      action === ACTIONS.REAL_MONEY_TRANSFER
    ) {
      APIState.errorCount++;

      return Promise.resolve({
        success: false,
        status: "BLOCKED",
        action: action,
        message: "Financial execution is blocked."
      });
    }

    APIState.requestCount++;

    return fetch(CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        project: CONFIG.PROJECT,
        version: VERSION,
        environment: CONFIG.ENVIRONMENT,
        action: action,
        payload: payload || {}
      })
    })
      .then(function (response) {
        return response.text().then(function (text) {
          var data;

          try {
            data = JSON.parse(text);
          } catch (error) {
            data = {
              success: false,
              status: "INVALID_JSON_RESPONSE",
              raw: text
            };
          }

          APIState.lastResponse = data;

          if (response.ok && data.success === true) {
            APIState.connected = true;
            APIState.successCount++;
          } else {
            APIState.errorCount++;
          }

          return data;
        });
      })
      .catch(function (error) {
        APIState.errorCount++;
        APIState.lastError = error.message;

        return {
          success: false,
          status: "REQUEST_FAILED",
          action: action,
          message: error.message
        };
      });
  }

  function testConnection() {
    if (!CONFIG.API_URL) {
      showMessage(
        "API is NOT CONFIGURED. No backend request was made."
      );

      renderAndBind();

      return Promise.resolve({
        success: false,
        status: "API_NOT_CONFIGURED"
      });
    }

    return request(ACTIONS.GET_HEALTH, {
      project: CONFIG.PROJECT
    }).then(function (result) {
      if (
        result &&
        result.success === true &&
        result.project === CONFIG.PROJECT
      ) {
        APIState.connected = true;
        APIState.verified = true;
        showMessage("API connection verified.");
      } else {
        APIState.connected = false;
        APIState.verified = false;
        showMessage(
          "Backend verification failed."
        );
      }

      renderAndBind();

      return result;
    });
  }

  function list(moduleName, filters) {
    return request(
      String(moduleName).toUpperCase() + "_LIST",
      filters || {}
    );
  }

  function save(moduleName, data) {
    return request(
      String(moduleName).toUpperCase() + "_SAVE",
      data || {}
    );
  }

  function get(moduleName, id) {
    return request(
      String(moduleName).toUpperCase() + "_GET",
      { id: id }
    );
  }

  function update(moduleName, id, data) {
    return request(
      String(moduleName).toUpperCase() + "_UPDATE",
      {
        id: id,
        data: data || {}
      }
    );
  }

  function fareCalculate(data) {
    return request(
      ACTIONS.FARE_CALCULATE,
      data || {}
    );
  }

  function transactionCreate(data) {
    return request(
      ACTIONS.TRANSACTION_CREATE,
      data || {}
    );
  }

  function walletGet(data) {
    return request(
      ACTIONS.WALLET_GET,
      data || {}
    );
  }

  function walletUpdate(data) {
    return request(
      ACTIONS.WALLET_UPDATE,
      data || {}
    );
  }

  function adminGet(data) {
    return request(
      ACTIONS.ADMIN_GET,
      data || {}
    );
  }

  function adminUpdate(data) {
    return request(
      ACTIONS.ADMIN_UPDATE,
      data || {}
    );
  }

  function auditList(data) {
    return request(
      ACTIONS.AUDIT_LIST,
      data || {}
    );
  }

  function renderAndBind() {
    try {
      var result = render();

      if (result) {
        bind();
      }

      return result;
    } catch (error) {
      console.error(
        "GoVara STEP 27 render error:",
        error
      );

      return false;
    }
  }

  function injectStyles() {
    if (
      document.getElementById(
        "govara27-styles"
      )
    ) {
      return;
    }

    var style =
      document.createElement("style");

    style.id = "govara27-styles";

    style.textContent = `
      .govara27 {
        padding: 24px;
      }

      .govara27-header {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 24px;
      }

      .govara27-step {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 1px;
        opacity: .6;
      }

      .govara27-header h2 {
        margin: 6px 0;
      }

      .govara27-header p {
        opacity: .7;
      }

      .govara27-version {
        font-size: 11px;
        opacity: .5;
      }

      .govara27-grid,
      .govara27-safety {
        display: grid;
        grid-template-columns:
          repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
      }

      .govara27-card,
      .govara27-section {
        border: 1px solid rgba(128,128,128,.25);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
      }

      .govara27-card span {
        display: block;
        font-size: 12px;
        opacity: .6;
        margin-bottom: 6px;
      }

      .govara27-card strong {
        font-size: 14px;
      }

      .govara27-endpoint {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .govara27-endpoint input {
        flex: 1;
        min-width: 240px;
        padding: 10px;
      }

      .govara27-endpoint button {
        padding: 10px 14px;
        cursor: pointer;
      }

      .govara27-safety div {
        padding: 12px;
        border: 1px solid rgba(128,128,128,.2);
        border-radius: 8px;
      }

      .govara27-safety b {
        display: block;
        margin-top: 5px;
      }

      .govara27-modules {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .govara27-modules span {
        padding: 7px 10px;
        border: 1px solid rgba(128,128,128,.25);
        border-radius: 20px;
        font-size: 12px;
      }

      #govara27-message {
        margin-top: 12px;
        opacity: .7;
      }
    `;

    document.head.appendChild(style);
  }

  /*
   * =========================================================
   * MASTER MODULE REGISTRATION
   * =========================================================
   */

  var GoVaraAPI = {
    VERSION: VERSION,

    CONFIG: CONFIG,
    APIState: APIState,

    MODULES: MODULES,
    ACTIONS: ACTIONS,

    render: render,
    bind: bind,
    renderAndBind: renderAndBind,

    request: request,
    testConnection: testConnection,

    list: list,
    get: get,
    save: save,
    update: update,

    fareCalculate: fareCalculate,
    transactionCreate: transactionCreate,
    walletGet: walletGet,
    walletUpdate: walletUpdate,
    adminGet: adminGet,
    adminUpdate: adminUpdate,
    auditList: auditList,

    getAPIUrl: function () {
      return CONFIG.API_URL;
    },

    setAPIUrl: function (url) {
      CONFIG.API_URL =
        typeof url === "string"
          ? url.trim()
          : "";

      enforceSafety();
      renderAndBind();

      return CONFIG.API_URL;
    },

    enforceSafety: enforceSafety
  };

  /*
   * Main API global
   */
  window.GoVaraAPI = GoVaraAPI;

  /*
   * Module registry
   */
  if (!window.GoVaraModules) {
    window.GoVaraModules = {};
  }

  window.GoVaraModules["27"] = GoVaraAPI;
  window.GoVaraModules["27-api"] = GoVaraAPI;
  window.GoVaraModules["STEP 27"] = GoVaraAPI;
  window.GoVaraModules["Consolidated API"] = GoVaraAPI;

  /*
   * Additional registry used by some master routers
   */
  if (!window.GoVaraModuleRegistry) {
    window.GoVaraModuleRegistry = {};
  }

  window.GoVaraModuleRegistry["27"] =
    GoVaraAPI;

  window.GoVaraModuleRegistry["27-api"] =
    GoVaraAPI;

  window.GoVaraModuleRegistry["STEP 27"] =
    GoVaraAPI;

  enforceSafety();

  /*
   * Render after DOM is ready.
   */
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      function () {
        renderAndBind();
      },
      { once: true }
    );
  } else {
    renderAndBind();
  }

})(window, document);
