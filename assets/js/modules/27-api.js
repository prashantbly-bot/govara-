/* ============================================================
   GoVara STEP 27
   Consolidated API Boundary
   V6.1 — MASTER FRONTEND COMPATIBLE
   ============================================================ */

(function (window) {
  "use strict";

  /* ------------------------------------------------------------
     CONFIG
     ------------------------------------------------------------ */

  var STORAGE_KEY = "GOVARA_CONSOLIDATED_API_V6";

  var CONFIG = {
    API_URL: "",
    REQUEST_TIMEOUT: 20000,
    VERSION: "GOVARA-CONSOLIDATED-API-V6",
    ENVIRONMENT: "TESTING",
    PROJECT: "GoVara",

    REAL_MONEY: false,
    REAL_PAYMENT: false,
    BANK_TRANSFER: false,

    FRONTEND_FINANCIAL_AUTHORITY: false,
    BACKEND_FINANCIAL_AUTHORITY: true,

    FRONTEND_KYC_AUTHORITY: false,
    BACKEND_KYC_AUTHORITY: true,

    DATABASE_AUTHORITY: true
  };

  /* ------------------------------------------------------------
     MODULE REGISTRY
     ------------------------------------------------------------ */

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

  /* ------------------------------------------------------------
     STATE
     ------------------------------------------------------------ */

  var APIState = {
    configured: false,
    connected: false,
    verified: false,
    loading: false,

    environment: "TESTING",

    lastAction: "—",
    lastResponse: null,
    lastError: null,

    lastRequestId: null,
    lastRequestAt: null,
    lastSuccessAt: null,
    lastErrorAt: null,

    requestCount: 0,
    successCount: 0,
    errorCount: 0
  };

  /* ------------------------------------------------------------
     CONFIG LOAD
     ------------------------------------------------------------ */

  function loadConfig() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return;
      }

      var saved = JSON.parse(raw);

      if (
        saved &&
        typeof saved.API_URL === "string" &&
        saved.API_URL.trim()
      ) {
        CONFIG.API_URL = saved.API_URL.trim();
      }
    } catch (error) {
      console.warn(
        "GoVara STEP 27 config load failed:",
        error
      );
    }
  }

  function saveConfig() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          API_URL: CONFIG.API_URL
        })
      );
    } catch (error) {
      console.warn(
        "GoVara STEP 27 config save failed:",
        error
      );
    }
  }

  loadConfig();

  /* ------------------------------------------------------------
     BASIC HELPERS
     ------------------------------------------------------------ */

  function getAPIUrl() {
    return String(
      CONFIG.API_URL ||
      window.GOVARA_API_URL ||
      ""
    ).trim();
  }

  function isConfigured() {
    return !!getAPIUrl();
  }

  function requestId() {
    return (
      "GV-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()
    );
  }

  function timestamp() {
    return new Date().toISOString();
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getElement(id) {
    return document.getElementById(id);
  }

  /* ------------------------------------------------------------
     ENVELOPE
     ------------------------------------------------------------ */

  function buildEnvelope(action, payload) {
    return {
      project: CONFIG.PROJECT,
      version: CONFIG.VERSION,
      environment: CONFIG.ENVIRONMENT,
      action: String(action || "").toUpperCase(),
      requestId: requestId(),
      timestamp: timestamp(),
      payload: payload || {}
    };
  }

  /* ------------------------------------------------------------
     CENTRAL REQUEST
     ------------------------------------------------------------ */

  async function request(action, payload) {

    var normalizedAction =
      String(action || "")
        .trim()
        .toUpperCase();

    APIState.lastAction = normalizedAction;
    APIState.lastError = null;

    if (!isConfigured()) {

      var notConfigured = {
        success: false,
        action: normalizedAction,
        code: "API_NOT_CONFIGURED",
        message: "API endpoint is not configured."
      };

      APIState.configured = false;
      APIState.errorCount++;
      APIState.lastError = notConfigured;
      APIState.lastErrorAt = timestamp();

      updateDiagnostics();

      return notConfigured;
    }

    /*
     * Financial safety boundary.
     */
    var blockedActions = [
      "REAL_MONEY",
      "REAL_PAYMENT",
      "BANK_TRANSFER",
      "PAYMENT_CREATE",
      "PAYMENT_UPDATE",
      "WALLET_REAL_UPDATE",
      "TRANSACTION_REAL_CREATE"
    ];

    if (
      blockedActions.indexOf(normalizedAction) !== -1
    ) {

      var blocked = {
        success: false,
        action: normalizedAction,
        code: "FINANCIAL_ACTION_BLOCKED",
        message:
          "Financial action is blocked in TESTING mode."
      };

      APIState.errorCount++;
      APIState.lastError = blocked;
      APIState.lastErrorAt = timestamp();

      updateDiagnostics();

      return blocked;
    }

    var envelope = buildEnvelope(
      normalizedAction,
      payload
    );

    APIState.configured = true;
    APIState.loading = true;

    APIState.lastRequestId =
      envelope.requestId;

    APIState.lastRequestAt =
      envelope.timestamp;

    APIState.requestCount++;

    updateDiagnostics();

    var controller = null;
    var timeout = null;

    try {

      if (
        typeof AbortController !==
        "undefined"
      ) {
        controller =
          new AbortController();

        timeout = setTimeout(
          function () {
            controller.abort();
          },
          CONFIG.REQUEST_TIMEOUT
        );
      }

      var response = await fetch(
        getAPIUrl(),
        {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body: JSON.stringify(
            envelope
          ),

          signal: controller
            ? controller.signal
            : undefined
        }
      );

      if (timeout) {
        clearTimeout(timeout);
      }

      var text =
        await response.text();

      var data;

      try {
        data = JSON.parse(text);
      } catch (parseError) {

        data = {
          success: false,
          action: normalizedAction,
          code: "INVALID_JSON_RESPONSE",
          message:
            "Backend returned a non-JSON response.",
          httpStatus: response.status,
          rawResponse: text
        };
      }

      APIState.lastResponse = data;

      if (
        response.ok &&
        data &&
        data.success === true
      ) {

        APIState.successCount++;
        APIState.lastSuccessAt =
          timestamp();

      } else {

        APIState.errorCount++;
        APIState.lastError = data;
        APIState.lastErrorAt =
          timestamp();
      }

      return data;

    } catch (error) {

      if (timeout) {
        clearTimeout(timeout);
      }

      var networkError = {
        success: false,
        action: normalizedAction,
        code:
          error &&
          error.name === "AbortError"
            ? "REQUEST_TIMEOUT"
            : "NETWORK_ERROR",

        message:
          error &&
          error.name === "AbortError"
            ? "API request timed out."
            : (
                error &&
                error.message
              ) ||
              "Network request failed."
      };

      APIState.errorCount++;
      APIState.lastError =
        networkError;

      APIState.lastErrorAt =
        timestamp();

      return networkError;

    } finally {

      APIState.loading = false;

      updateDiagnostics();
    }
  }

  /* ------------------------------------------------------------
     HEALTH
     ------------------------------------------------------------ */

  async function testConnection() {

    var response =
      await request(
        "GET_HEALTH",
        {}
      );

    if (
      response &&
      response.success === true &&
      String(response.project) ===
        "GoVara"
    ) {

      APIState.connected = true;
      APIState.verified = true;
      APIState.lastError = null;

    } else {

      APIState.connected = false;
      APIState.verified = false;

      APIState.lastError =
        response || {
          success: false,
          code:
            "HEALTH_VERIFICATION_FAILED"
        };
    }

    updateDiagnostics();

    return response;
  }

  /* ------------------------------------------------------------
     GENERIC API
     ------------------------------------------------------------ */

  async function list(module, options) {

    return request(
      "LIST",
      {
        module: module,
        options: options || {}
      }
    );
  }

  async function get(module, id) {

    return request(
      "GET",
      {
        module: module,
        id: id
      }
    );
  }

  async function validate(module, data) {

    return request(
      "VALIDATE",
      {
        module: module,
        data: data || {}
      }
    );
  }

  async function create(module, data) {

    return request(
      "CREATE",
      {
        module: module,
        data: data || {}
      }
    );
  }

  async function update(
    module,
    id,
    data
  ) {

    return request(
      "UPDATE",
      {
        module: module,
        id: id,
        data: data || {}
      }
    );
  }

  /* ------------------------------------------------------------
     CUSTOMER API
     ------------------------------------------------------------ */

  function customerList(options) {
    return list(
      "Customer",
      options || {}
    );
  }

  function customerGet(id) {
    return get(
      "Customer",
      id
    );
  }

  function customerValidate(data) {
    return validate(
      "Customer",
      data
    );
  }

  function customerCreate(data) {
    return create(
      "Customer",
      data
    );
  }

  function customerUpdate(
    id,
    data
  ) {
    return update(
      "Customer",
      id,
      data
    );
  }

  /* ------------------------------------------------------------
     OTHER MODULES
     ------------------------------------------------------------ */

  function vendorList(options) {
    return list(
      "Vendor",
      options || {}
    );
  }

  function driverList(options) {
    return list(
      "Driver",
      options || {}
    );
  }

  function vehicleList(options) {
    return list(
      "Vehicle",
      options || {}
    );
  }

  function bookingList(options) {
    return list(
      "Booking",
      options || {}
    );
  }

  function dutyList(options) {
    return list(
      "Duty",
      options || {}
    );
  }

  function fareCalculate(data) {
    return request(
      "FARE_CALCULATE",
      data || {}
    );
  }

  function walletGet(customerId) {
    return request(
      "WALLET_GET",
      {
        customerId: customerId
      }
    );
  }

  /* ------------------------------------------------------------
     DIAGNOSTICS
     ------------------------------------------------------------ */

  function updateDiagnostics() {

    var root =
      document.getElementById(
        "module-27"
      );

    if (!root) {
      return;
    }

    var requestNode =
      root.querySelector(
        "[data-govara-api-requests]"
      );

    var successNode =
      root.querySelector(
        "[data-govara-api-success]"
      );

    var errorNode =
      root.querySelector(
        "[data-govara-api-errors]"
      );

    var actionNode =
      root.querySelector(
        "[data-govara-api-action]"
      );

    var responseNode =
      root.querySelector(
        "[data-govara-api-response]"
      );

    if (requestNode) {
      requestNode.textContent =
        APIState.requestCount;
    }

    if (successNode) {
      successNode.textContent =
        APIState.successCount;
    }

    if (errorNode) {
      errorNode.textContent =
        APIState.errorCount;
    }

    if (actionNode) {
      actionNode.textContent =
        APIState.lastAction || "—";
    }

    if (responseNode) {

      var diagnostic =
        APIState.lastResponse ||
        APIState.lastError;

      responseNode.textContent =
        diagnostic
          ? JSON.stringify(
              diagnostic,
              null,
              2
            )
          : "";
    }
  }

  /* ------------------------------------------------------------
     CUSTOMER TEST CONSOLE
     ------------------------------------------------------------ */

  function customerFormData() {

    var name =
      getElement(
        "govara-api-customer-name"
      );

    var mobile =
      getElement(
        "govara-api-customer-mobile"
      );

    var email =
      getElement(
        "govara-api-customer-email"
      );

    var address =
      getElement(
        "govara-api-customer-address"
      );

    return {
      name: name
        ? String(name.value || "").trim()
        : "",

      mobile: mobile
        ? String(mobile.value || "").trim()
        : "",

      email: email
        ? String(email.value || "").trim()
        : "",

      address: address
        ? String(address.value || "").trim()
        : "",

      mode: "TESTING"
    };
  }

  function customerIdValue() {

    var input =
      getElement(
        "govara-api-customer-id"
      );

    return input
      ? String(input.value || "").trim()
      : "";
  }

  function showResponse(response) {

    var element =
      getElement(
        "govara-api-response"
      );

    if (!element) {
      return;
    }

    element.textContent =
      JSON.stringify(
        response,
        null,
        2
      );
  }

  function showStatus(message) {

    var element =
      getElement(
        "govara-api-console-status"
      );

    if (element) {
      element.textContent =
        message || "";
    }
  }

  async function runCustomerList() {

    showStatus(
      "Running Customer LIST..."
    );

    var response =
      await customerList();

    showResponse(response);

    showStatus(
      response &&
      response.success === true
        ? "Customer LIST successful."
        : "Customer LIST returned an error."
    );

    return response;
  }

  async function runCustomerGet() {

    var id =
      customerIdValue();

    if (!id) {

      var error = {
        success: false,
        code: "CUSTOMER_ID_REQUIRED",
        message:
          "Enter Customer ID first."
      };

      showResponse(error);

      return error;
    }

    showStatus(
      "Running Customer GET..."
    );

    var response =
      await customerGet(id);

    showResponse(response);

    return response;
  }

  async function runCustomerValidate() {

    var data =
      customerFormData();

    showStatus(
      "Running Customer VALIDATE..."
    );

    var response =
      await customerValidate(
        data
      );

    showResponse(response);

    return response;
  }

  async function runCustomerCreate() {

    var data =
      customerFormData();

    showStatus(
      "Creating Customer..."
    );

    var response =
      await customerCreate(
        data
      );

    showResponse(response);

    return response;
  }

  async function runCustomerUpdate() {

    var id =
      customerIdValue();

    if (!id) {

      var error = {
        success: false,
        code: "CUSTOMER_ID_REQUIRED",
        message:
          "Enter Customer ID first."
      };

      showResponse(error);

      return error;
    }

    var data =
      customerFormData();

    showStatus(
      "Updating Customer..."
    );

    var response =
      await customerUpdate(
        id,
        data
      );

    showResponse(response);

    return response;
  }

  /* ------------------------------------------------------------
     MODULE RENDER
     ------------------------------------------------------------ */

  function renderModule(container) {

    /*
     * IMPORTANT:
     * Master index.html may provide its own
     * module container.
     */

    var root =
      container ||
      document.getElementById(
        "module-27"
      );

    if (!root) {
      return;
    }

    root.innerHTML = `
      <div class="govara-step27">

        <div class="govara-step27-header">
          <div>
            <h2>STEP 27</h2>
            <p>
              Consolidated API Boundary
            </p>
          </div>
        </div>

        <div class="govara-step27-status-grid">

          <div class="govara-step27-card">
            <small>API</small>
            <strong data-govara-api-config>
              ${
                isConfigured()
                  ? "CONFIGURED"
                  : "NOT CONFIGURED"
              }
            </strong>
          </div>

          <div class="govara-step27-card">
            <small>Connection</small>
            <strong data-govara-api-connection>
              ${
                APIState.connected
                  ? "CONNECTED"
                  : "NOT CONNECTED"
              }
            </strong>
          </div>

          <div class="govara-step27-card">
            <small>Verification</small>
            <strong data-govara-api-verification>
              ${
                APIState.verified
                  ? "VERIFIED"
                  : "NOT VERIFIED"
              }
            </strong>
          </div>

          <div class="govara-step27-card">
            <small>Environment</small>
            <strong>
              TESTING
            </strong>
          </div>

        </div>

        <section class="govara-step27-panel">

          <h3>API Configuration</h3>

          <label>
            API Endpoint
          </label>

          <div class="govara-step27-endpoint">

            <input
              id="govara-api-endpoint"
              type="url"
              value="${escapeHTML(
                getAPIUrl()
              )}"
              placeholder="Apps Script Web App /exec URL"
            />

            <button
              type="button"
              id="govara-api-save"
            >
              Save Endpoint
            </button>

            <button
              type="button"
              id="govara-api-test"
            >
              Test Connection
            </button>

            <button
              type="button"
              id="govara-api-reset"
            >
              Reset Endpoint
            </button>

          </div>

          <small>
            Connection testing is manual.
            No automatic backend request is made.
          </small>

        </section>

        <section class="govara-step27-panel">

          <h3>Financial Safety</h3>

          <div class="govara-step27-safety">

            <span>
              Real Money:
              <b>BLOCKED</b>
            </span>

            <span>
              Real Payment:
              <b>BLOCKED</b>
            </span>

            <span>
              Bank Transfer:
              <b>BLOCKED</b>
            </span>

            <span>
              Frontend Financial Authority:
              <b>DISABLED</b>
            </span>

            <span>
              Backend Financial Authority:
              <b>AUTHORITATIVE</b>
            </span>

          </div>

        </section>

        <section class="govara-step27-panel">

          <h3>KYC & Database Authority</h3>

          <div class="govara-step27-safety">

            <span>
              Frontend KYC Authority:
              <b>DISABLED</b>
            </span>

            <span>
              Backend KYC Authority:
              <b>AUTHORITATIVE</b>
            </span>

            <span>
              Database Authority:
              <b>AUTHORITATIVE</b>
            </span>

          </div>

        </section>

        <section class="govara-step27-panel">

          <h3>Consolidated Modules</h3>

          <div class="govara-step27-modules">

            ${MODULES.map(
              function (module) {
                return (
                  "<span>" +
                  escapeHTML(module) +
                  "</span>"
                );
              }
            ).join("")}

          </div>

        </section>

        <section class="govara-step27-panel">

          <h3>
            Customer Integration Test
          </h3>

          <div class="govara-step27-form">

            <div>
              <label>
                Customer ID
              </label>

              <input
                id="govara-api-customer-id"
                type="text"
                placeholder="GV_CUSTOMER_..."
              />
            </div>

            <div>
              <label>
                Name
              </label>

              <input
                id="govara-api-customer-name"
                type="text"
                placeholder="Test Customer"
              />
            </div>

            <div>
              <label>
                Mobile
              </label>

              <input
                id="govara-api-customer-mobile"
                type="text"
                placeholder="9999999999"
              />
            </div>

            <div>
              <label>
                Email
              </label>

              <input
                id="govara-api-customer-email"
                type="email"
                placeholder="customer@example.com"
              />
            </div>

            <div class="full">
              <label>
                Address
              </label>

              <input
                id="govara-api-customer-address"
                type="text"
                placeholder="Testing Address"
              />
            </div>

          </div>

          <div class="govara-step27-actions">

            <button
              type="button"
              id="govara-customer-list"
            >
              LIST Customer
            </button>

            <button
              type="button"
              id="govara-customer-get"
            >
              GET Customer
            </button>

            <button
              type="button"
              id="govara-customer-validate"
            >
              VALIDATE Customer
            </button>

            <button
              type="button"
              id="govara-customer-create"
            >
              CREATE Customer
            </button>

            <button
              type="button"
              id="govara-customer-update"
            >
              UPDATE Customer
            </button>

          </div>

          <div
            id="govara-api-console-status"
            class="govara-step27-status"
          >
            Ready.
          </div>

        </section>

        <section class="govara-step27-panel">

          <h3>Diagnostics</h3>

          <div class="govara-step27-diagnostics">

            <div>
              <small>REQUESTS</small>
              <strong
                data-govara-api-requests
              >
                ${APIState.requestCount}
              </strong>
            </div>

            <div>
              <small>SUCCESS</small>
              <strong
                data-govara-api-success
              >
                ${APIState.successCount}
              </strong>
            </div>

            <div>
              <small>ERRORS</small>
              <strong
                data-govara-api-errors
              >
                ${APIState.errorCount}
              </strong>
            </div>

            <div>
              <small>LAST ACTION</small>
              <strong
                data-govara-api-action
              >
                ${APIState.lastAction}
              </strong>
            </div>

          </div>

          <pre
            id="govara-api-response"
            data-govara-api-response
          ></pre>

        </section>

      </div>
    `;

    bindEvents(root);
  }

  /* ------------------------------------------------------------
     EVENTS
     ------------------------------------------------------------ */

  function bindEvents(root) {

    var endpoint =
      root.querySelector(
        "#govara-api-endpoint"
      );

    var save =
      root.querySelector(
        "#govara-api-save"
      );

    var test =
      root.querySelector(
        "#govara-api-test"
      );

    var reset =
      root.querySelector(
        "#govara-api-reset"
      );

    var listButton =
      root.querySelector(
        "#govara-customer-list"
      );

    var getButton =
      root.querySelector(
        "#govara-customer-get"
      );

    var validateButton =
      root.querySelector(
        "#govara-customer-validate"
      );

    var createButton =
      root.querySelector(
        "#govara-customer-create"
      );

    var updateButton =
      root.querySelector(
        "#govara-customer-update"
      );

    if (save) {

      save.onclick =
        function () {

          CONFIG.API_URL =
            String(
              endpoint.value || ""
            ).trim();

          saveConfig();

          APIState.configured =
            isConfigured();

          APIState.connected =
            false;

          APIState.verified =
            false;

          APIState.lastAction =
            "SAVE_ENDPOINT";

          renderModule(root);
        };
    }

    if (test) {

      test.onclick =
        async function () {

          test.disabled = true;

          try {
            await testConnection();
          } finally {
            test.disabled = false;
          }

          /*
           * Do not rerender the entire module here.
           * Preserve the existing master page lifecycle.
           */
          updateStatusFields(root);
        };
    }

    if (reset) {

      reset.onclick =
        function () {

          CONFIG.API_URL = "";

          try {
            window.localStorage.removeItem(
              STORAGE_KEY
            );
          } catch (error) {
            console.warn(error);
          }

          APIState.configured = false;
          APIState.connected = false;
          APIState.verified = false;
          APIState.loading = false;

          APIState.lastAction =
            "RESET_ENDPOINT";

          APIState.lastResponse =
            null;

          APIState.lastError =
            null;

          APIState.requestCount = 0;
          APIState.successCount = 0;
          APIState.errorCount = 0;

          renderModule(root);
        };
    }

    if (listButton) {
      listButton.onclick =
        runCustomerList;
    }

    if (getButton) {
      getButton.onclick =
        runCustomerGet;
    }

    if (validateButton) {
      validateButton.onclick =
        runCustomerValidate;
    }

    if (createButton) {
      createButton.onclick =
        runCustomerCreate;
    }

    if (updateButton) {
      updateButton.onclick =
        runCustomerUpdate;
    }
  }

  /* ------------------------------------------------------------
     STATUS UPDATE
     ------------------------------------------------------------ */

  function updateStatusFields(root) {

    if (!root) {
      return;
    }

    var configNode =
      root.querySelector(
        "[data-govara-api-config]"
      );

    var connectionNode =
      root.querySelector(
        "[data-govara-api-connection]"
      );

    var verificationNode =
      root.querySelector(
        "[data-govara-api-verification]"
      );

    if (configNode) {
      configNode.textContent =
        isConfigured()
          ? "CONFIGURED"
          : "NOT CONFIGURED";
    }

    if (connectionNode) {
      connectionNode.textContent =
        APIState.connected
          ? "CONNECTED"
          : "NOT CONNECTED";
    }

    if (verificationNode) {
      verificationNode.textContent =
        APIState.verified
          ? "VERIFIED"
          : "NOT VERIFIED";
    }

    updateDiagnostics();
  }

  /* ------------------------------------------------------------
     CSS
     ------------------------------------------------------------ */

  function ensureStyles() {

    if (
      document.getElementById(
        "govara-step27-v61-style"
      )
    ) {
      return;
    }

    var style =
      document.createElement(
        "style"
      );

    style.id =
      "govara-step27-v61-style";

    style.textContent = `
      .govara-step27 {
        display: grid;
        gap: 18px;
      }

      .govara-step27-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .govara-step27-header h2 {
        margin: 0 0 5px;
      }

      .govara-step27-header p {
        margin: 0;
        opacity: .7;
      }

      .govara-step27-status-grid {
        display: grid;
        grid-template-columns:
          repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
      }

      .govara-step27-card {
        padding: 15px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,.10);
        background: rgba(255,255,255,.035);
      }

      .govara-step27-card small {
        display: block;
        opacity: .65;
        margin-bottom: 7px;
      }

      .govara-step27-card strong {
        font-size: 13px;
      }

      .govara-step27-panel {
        padding: 18px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,.10);
        background: rgba(255,255,255,.025);
      }

      .govara-step27-panel h3 {
        margin-top: 0;
      }

      .govara-step27-endpoint {
        display: grid;
        grid-template-columns:
          1fr auto auto auto;
        gap: 8px;
        margin: 10px 0;
      }

      .govara-step27-panel input {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(0,0,0,.20);
        color: inherit;
      }

      .govara-step27-panel button {
        padding: 10px 13px;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.07);
        color: inherit;
        cursor: pointer;
      }

      .govara-step27-panel button:disabled {
        opacity: .5;
        cursor: wait;
      }

      .govara-step27-safety {
        display: grid;
        grid-template-columns:
          repeat(auto-fit, minmax(220px, 1fr));
        gap: 10px;
      }

      .govara-step27-safety span {
        padding: 9px;
        border-radius: 8px;
        background: rgba(255,255,255,.04);
      }

      .govara-step27-safety b {
        display: block;
        margin-top: 4px;
        font-size: 11px;
      }

      .govara-step27-modules {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
      }

      .govara-step27-modules span {
        padding: 7px 10px;
        border-radius: 8px;
        background: rgba(255,255,255,.06);
        font-size: 12px;
      }

      .govara-step27-form {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin: 15px 0;
      }

      .govara-step27-form > div {
        display: grid;
        gap: 6px;
      }

      .govara-step27-form .full {
        grid-column: 1 / -1;
      }

      .govara-step27-form label {
        font-size: 12px;
        opacity: .7;
      }

      .govara-step27-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .govara-step27-status {
        margin-top: 12px;
        padding: 10px;
        border-radius: 8px;
        background: rgba(255,255,255,.04);
      }

      .govara-step27-diagnostics {
        display: grid;
        grid-template-columns:
          repeat(auto-fit, minmax(140px, 1fr));
        gap: 10px;
      }

      .govara-step27-diagnostics > div {
        padding: 12px;
        border-radius: 9px;
        background: rgba(255,255,255,.04);
      }

      .govara-step27-diagnostics small {
        display: block;
        opacity: .65;
        margin-bottom: 5px;
      }

      .govara-step27-diagnostics strong {
        display: block;
      }

      #govara-api-response {
        min-height: 160px;
        max-height: 500px;
        overflow: auto;
        margin-top: 14px;
        padding: 14px;
        border-radius: 10px;
        background: rgba(0,0,0,.25);
        border: 1px solid rgba(255,255,255,.08);
        white-space: pre-wrap;
        word-break: break-word;
        font-size: 12px;
      }

      @media (max-width: 760px) {

        .govara-step27-endpoint {
          grid-template-columns: 1fr;
        }

        .govara-step27-form {
          grid-template-columns: 1fr;
        }

        .govara-step27-form .full {
          grid-column: auto;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ------------------------------------------------------------
     PUBLIC MODULE
     ------------------------------------------------------------ */

  var GoVaraAPI = {

    version:
      CONFIG.VERSION,

    CONFIG:
      CONFIG,

    state:
      APIState,

    modules:
      MODULES,

    getAPIUrl:
      getAPIUrl,

    isConfigured:
      isConfigured,

    testConnection:
      testConnection,

    request:
      request,

    list:
      list,

    get:
      get,

    validate:
      validate,

    create:
      create,

    update:
      update,

    customerList:
      customerList,

    customerGet:
      customerGet,

    customerValidate:
      customerValidate,

    customerCreate:
      customerCreate,

    customerUpdate:
      customerUpdate,

    vendorList:
      vendorList,

    driverList:
      driverList,

    vehicleList:
      vehicleList,

    bookingList:
      bookingList,

    dutyList:
      dutyList,

    fareCalculate:
      fareCalculate,

    walletGet:
      walletGet,

    render:
      renderModule,

    renderAndBind:
      renderModule,

    bind:
      bindEvents
  };

  /* ------------------------------------------------------------
     GLOBAL REGISTRATION
     ------------------------------------------------------------ */

  window.GoVaraAPI =
    GoVaraAPI;

  window.GoVara27 =
    GoVaraAPI;

  window.GoVaraModules =
    window.GoVaraModules || {};

  window.GoVaraModules["27"] =
    GoVaraAPI;

  window.GoVaraModules["27-api"] =
    GoVaraAPI;

  window.GoVaraModules["STEP 27"] =
    GoVaraAPI;

  window.GoVaraModules["Consolidated API"] =
    GoVaraAPI;

  window.GoVaraModuleRegistry =
    window.GoVaraModuleRegistry || {};

  window.GoVaraModuleRegistry["27"] =
    GoVaraAPI;

  window.GoVaraModuleRegistry["27-api"] =
    GoVaraAPI;

  window.GoVaraModuleRegistry["STEP 27"] =
    GoVaraAPI;

  /*
   * IMPORTANT:
   * Do NOT automatically render or call the backend here.
   *
   * The master index.html controls module rendering.
   */

  ensureStyles();

})(window);
