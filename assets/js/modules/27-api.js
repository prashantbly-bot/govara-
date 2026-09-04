/* ============================================================
   GoVara STEP 27 — Consolidated API Boundary
   Version: GOVARA-CONSOLIDATED-API-V3

   FRONTEND API BOUNDARY ONLY
   Backend + Database remain authoritative.

   IMPORTANT:
   - No automatic API connection test
   - API remains NOT CONFIGURED until intentionally configured
   - Real Money / Payment / Bank Transfer remain BLOCKED
   ============================================================ */

(function () {

  "use strict";

  /* ==========================================================
     1. CONSTANTS
     ========================================================== */

  var VERSION = "GOVARA-CONSOLIDATED-API-V3";

  var MODULES = {
    CUSTOMER: "CUSTOMER",
    VENDOR: "VENDOR",
    DRIVER: "DRIVER",
    VEHICLE: "VEHICLE",
    BOOKING: "BOOKING",
    DUTY: "DUTY",
    FARE: "FARE",
    TRANSACTION: "TRANSACTION",
    WALLET: "WALLET",
    LEDGER: "LEDGER",
    SETTLEMENT: "SETTLEMENT",
    BILLING: "BILLING",
    DOCUMENTS: "DOCUMENTS",
    KYC: "KYC",
    ADMIN: "ADMIN",
    AUDIT: "AUDIT",
    AUTH: "AUTH",
    NOTIFICATION: "NOTIFICATION",
    LOCATION: "LOCATION",
    TRAVEL: "TRAVEL",
    WELFARE: "WELFARE"
  };


  var ACTIONS = {
    GET_HEALTH: "GET_HEALTH",

    AUTH_LOGIN: "AUTH_LOGIN",
    AUTH_LOGOUT: "AUTH_LOGOUT",
    AUTH_SESSION: "AUTH_SESSION",
    AUTH_REGISTER: "AUTH_REGISTER",

    CUSTOMER_LIST: "CUSTOMER_LIST",
    CUSTOMER_GET: "CUSTOMER_GET",
    CUSTOMER_SAVE: "CUSTOMER_SAVE",
    CUSTOMER_UPDATE: "CUSTOMER_UPDATE",

    VENDOR_LIST: "VENDOR_LIST",
    VENDOR_GET: "VENDOR_GET",
    VENDOR_SAVE: "VENDOR_SAVE",
    VENDOR_UPDATE: "VENDOR_UPDATE",

    DRIVER_LIST: "DRIVER_LIST",
    DRIVER_GET: "DRIVER_GET",
    DRIVER_SAVE: "DRIVER_SAVE",
    DRIVER_UPDATE: "DRIVER_UPDATE",

    VEHICLE_LIST: "VEHICLE_LIST",
    VEHICLE_GET: "VEHICLE_GET",
    VEHICLE_SAVE: "VEHICLE_SAVE",
    VEHICLE_UPDATE: "VEHICLE_UPDATE",

    BOOKING_LIST: "BOOKING_LIST",
    BOOKING_GET: "BOOKING_GET",
    BOOKING_SAVE: "BOOKING_SAVE",
    BOOKING_UPDATE: "BOOKING_UPDATE",

    DUTY_LIST: "DUTY_LIST",
    DUTY_GET: "DUTY_GET",
    DUTY_SAVE: "DUTY_SAVE",
    DUTY_UPDATE: "DUTY_UPDATE",

    FARE_CALCULATE: "FARE_CALCULATE",

    TRANSACTION_LIST: "TRANSACTION_LIST",
    TRANSACTION_GET: "TRANSACTION_GET",
    TRANSACTION_CREATE: "TRANSACTION_CREATE",

    WALLET_GET: "WALLET_GET",
    WALLET_UPDATE: "WALLET_UPDATE",

    LEDGER_LIST: "LEDGER_LIST",
    LEDGER_GET: "LEDGER_GET",

    SETTLEMENT_LIST: "SETTLEMENT_LIST",
    SETTLEMENT_GET: "SETTLEMENT_GET",
    SETTLEMENT_CREATE: "SETTLEMENT_CREATE",

    BILLING_LIST: "BILLING_LIST",
    BILLING_GET: "BILLING_GET",

    DOCUMENT_LIST: "DOCUMENT_LIST",
    DOCUMENT_GET: "DOCUMENT_GET",
    DOCUMENT_UPLOAD: "DOCUMENT_UPLOAD",
    DOCUMENT_REPLACE: "DOCUMENT_REPLACE",
    DOCUMENT_REVIEW: "DOCUMENT_REVIEW",
    DOCUMENT_STATUS: "DOCUMENT_STATUS",

    KYC_GET: "KYC_GET",
    KYC_SUBMIT: "KYC_SUBMIT",
    KYC_REVIEW: "KYC_REVIEW",
    KYC_STATUS: "KYC_STATUS",

    ADMIN_GET: "ADMIN_GET",
    ADMIN_UPDATE: "ADMIN_UPDATE",

    AUDIT_LIST: "AUDIT_LIST",

    NOTIFICATION_LIST: "NOTIFICATION_LIST",
    NOTIFICATION_READ: "NOTIFICATION_READ",

    LOCATION_GET: "LOCATION_GET",
    LOCATION_UPDATE: "LOCATION_UPDATE",

    WELFARE_LIST: "WELFARE_LIST",
    WELFARE_GET: "WELFARE_GET"
  };


  /* ==========================================================
     2. CONFIG
     ========================================================== */

  var CONFIG = {

    API_URL: "",

    REQUEST_TIMEOUT: 20000,

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


  /*
   * Read endpoint safely.
   * This does NOT connect to the API.
   */
  function readAPIUrl() {

    try {

      if (
        typeof window !== "undefined" &&
        typeof window.GOVARA_API_URL === "string"
      ) {

        return window.GOVARA_API_URL.trim();

      }

    } catch (e) {
      return "";
    }

    return "";
  }


  CONFIG.API_URL = readAPIUrl();


  /* ==========================================================
     3. STATE
     ========================================================== */

  var APIState = {

    configured: !!CONFIG.API_URL,

    connected: false,

    verified: false,

    loading: false,

    lastAction: "",

    lastResponse: null,

    lastError: null,

    lastRequestId: "",

    lastCorrelationId: "",

    requestCount: 0,

    successCount: 0,

    errorCount: 0,

    lastRequestAt: null,

    lastResponseAt: null
  };


  /* ==========================================================
     4. HELPERS
     ========================================================== */

  function createRandomPart() {

    return Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
  }


  function createRequestId() {

    return "GV-REQ-" +
      Date.now() +
      "-" +
      createRandomPart();
  }


  function createCorrelationId() {

    return "GV-COR-" +
      Date.now() +
      "-" +
      createRandomPart();
  }


  function escapeHTML(value) {

    var text = String(
      value === null || value === undefined
        ? ""
        : value
    );

    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function clone(value) {

    try {

      return JSON.parse(
        JSON.stringify(value)
      );

    } catch (e) {

      return value;
    }
  }


  /* ==========================================================
     5. SENSITIVE DATA PROTECTION
     ========================================================== */

  var SENSITIVE_KEYS = {

    password: true,
    pass: true,
    otp: true,
    pin: true,
    cvv: true,
    cardnumber: true,
    accountnumber: true,
    token: true,
    accesstoken: true,
    refreshtoken: true,
    secret: true,
    privatekey: true,
    authorization: true,
    rawdocument: true,
    documentbinary: true,
    filebinary: true
  };


  function sanitize(value) {

    if (
      value === null ||
      value === undefined
    ) {

      return value;
    }


    if (Array.isArray(value)) {

      return value.map(
        sanitize
      );
    }


    if (
      typeof value !== "object"
    ) {

      return value;
    }


    var result = {};

    Object.keys(value).forEach(
      function (key) {

        var normalized =
          String(key)
            .toLowerCase()
            .replace(/[_-]/g, "");


        if (
          SENSITIVE_KEYS[normalized]
        ) {

          result[key] = "[REDACTED]";

        } else {

          result[key] =
            sanitize(value[key]);
        }

      }
    );


    return result;
  }


  /* ==========================================================
     6. SAFETY ENFORCEMENT
     ========================================================== */

  function enforceSafety(payload) {

    var safe = {};

    if (
      payload &&
      typeof payload === "object"
    ) {

      safe = clone(payload) || {};
    }


    safe.mode = "TESTING";

    safe.realMoney = false;

    safe.realPayment = false;

    safe.bankTransfer = false;

    safe.frontendFinancialAuthority = false;

    safe.backendFinancialAuthority = true;

    safe.frontendKYCAuthority = false;

    safe.backendKYCAuthority = true;

    safe.databaseAuthority = true;


    return safe;
  }


  /* ==========================================================
     7. STATUS
     ========================================================== */

  function getAPIUrl() {

    return CONFIG.API_URL;
  }


  function isConfigured() {

    return !!CONFIG.API_URL;
  }


  function getState() {

    return clone(APIState);
  }


  function getStatus() {

    return {

      version: VERSION,

      configured: APIState.configured,

      connected: APIState.connected,

      verified: APIState.verified,

      loading: APIState.loading,

      environment: CONFIG.ENVIRONMENT,

      realMoney: false,

      realPayment: false,

      bankTransfer: false,

      frontendFinancialAuthority: false,

      backendFinancialAuthority: true,

      frontendKYCAuthority: false,

      backendKYCAuthority: true,

      databaseAuthority: true,

      lastAction: APIState.lastAction,

      lastError: sanitize(
        APIState.lastError
      )
    };
  }


  /* ==========================================================
     8. ERROR OBJECT
     ========================================================== */

  function createError(
    message,
    code,
    status,
    action,
    requestId,
    correlationId
  ) {

    return {

      success: false,

      code: code || "API_ERROR",

      status: status || 0,

      message:
        message ||
        "API request failed.",

      action: action || "",

      requestId:
        requestId || "",

      correlationId:
        correlationId || "",

      timestamp:
        new Date().toISOString()
    };
  }


  /* ==========================================================
     9. RESPONSE NORMALIZATION
     ========================================================== */

  function normalizeResponse(
    source,
    action,
    requestId,
    correlationId,
    httpStatus
  ) {

    source =
      source &&
      typeof source === "object"
        ? source
        : {};


    var success = true;


    if (
      typeof source.success === "boolean"
    ) {

      success = source.success;

    } else if (
      source.error ||
      source.errors
    ) {

      success = false;
    }


    return {

      success: success,

      project:
        source.project ||
        CONFIG.PROJECT,

      version:
        source.version ||
        VERSION,

      action:
        source.action ||
        action,

      status:
        source.status ||
        (
          success
            ? "SUCCESS"
            : "ERROR"
        ),

      code:
        source.code ||
        (
          success
            ? "OK"
            : "API_ERROR"
        ),

      message:
        source.message ||
        source.error ||
        (
          success
            ? "Request successful."
            : "Request failed."
        ),

      data:
        source.data !== undefined
          ? source.data
          : source.payload !== undefined
            ? source.payload
            : source,

      errors:
        source.errors || null,

      requestId:
        source.requestId ||
        requestId,

      correlationId:
        source.correlationId ||
        correlationId,

      httpStatus:
        httpStatus || 200,

      timestamp:
        source.timestamp ||
        new Date().toISOString()
    };
  }


  /* ==========================================================
     10. CENTRAL REQUEST ENGINE
     ========================================================== */

  async function request(
    action,
    payload,
    options
  ) {

    options = options || {};


    var requestId =
      options.requestId ||
      createRequestId();


    var correlationId =
      options.correlationId ||
      createCorrelationId();


    APIState.configured =
      isConfigured();


    APIState.lastAction =
      action || "";


    APIState.lastRequestId =
      requestId;


    APIState.lastCorrelationId =
      correlationId;


    APIState.lastRequestAt =
      new Date().toISOString();


    /*
     * Do not attempt connection when
     * endpoint is not configured.
     */

    if (!APIState.configured) {

      var notConfigured =
        createError(
          "API endpoint is not configured.",
          "API_NOT_CONFIGURED",
          0,
          action,
          requestId,
          correlationId
        );


      APIState.lastError =
        notConfigured;


      return notConfigured;
    }


    /*
     * Hard financial block.
     */

    if (
      action === "PAYMENT_EXECUTE" ||
      action === "BANK_TRANSFER_EXECUTE" ||
      action === "REAL_MONEY_TRANSFER"
    ) {

      var blocked =
        createError(
          "Real money, real payment and bank transfer are blocked.",
          "FINANCIAL_OPERATION_BLOCKED",
          403,
          action,
          requestId,
          correlationId
        );


      APIState.errorCount += 1;

      APIState.lastError =
        blocked;


      return blocked;
    }


    if (
      typeof fetch !== "function"
    ) {

      var fetchError =
        createError(
          "Fetch API is not available.",
          "FETCH_NOT_AVAILABLE",
          0,
          action,
          requestId,
          correlationId
        );


      APIState.errorCount += 1;

      APIState.lastError =
        fetchError;


      return fetchError;
    }


    APIState.loading = true;

    APIState.requestCount += 1;


    var controller = null;

    var timeoutId = null;


    try {

      if (
        typeof AbortController !== "undefined"
      ) {

        controller =
          new AbortController();


        timeoutId =
          setTimeout(
            function () {

              try {
                controller.abort();
              } catch (e) {}

            },
            CONFIG.REQUEST_TIMEOUT
          );
      }


      var requestBody = {

        project: CONFIG.PROJECT,

        version: VERSION,

        action: action,

        requestId: requestId,

        correlationId:
          correlationId,

        timestamp:
          new Date().toISOString(),

        environment:
          CONFIG.ENVIRONMENT,

        payload:
          enforceSafety(
            sanitize(
              payload || {}
            )
          )
      };


      var response =
        await fetch(
          CONFIG.API_URL,
          {

            method:
              options.method || "POST",

            headers: {

              "Content-Type":
                "text/plain;charset=utf-8",

              "Accept":
                "application/json"
            },

            body:
              (
                options.method || "POST"
              ) === "GET"
                ? undefined
                : JSON.stringify(
                    requestBody
                  ),

            signal:
              controller
                ? controller.signal
                : undefined
          }
        );


      var rawText =
        await response.text();


      var parsed = {};


      if (rawText) {

        try {

          parsed =
            JSON.parse(
              rawText
            );

        } catch (parseError) {

          parsed = {

            success: false,

            code:
              "INVALID_JSON_RESPONSE",

            message:
              "Backend returned an invalid JSON response.",

            raw:
              rawText
          };
        }
      }


      APIState.lastResponseAt =
        new Date().toISOString();


      if (!response.ok) {

        var httpError =
          createError(

            parsed.message ||
            parsed.error ||
            (
              "HTTP request failed: " +
              response.status
            ),

            parsed.code ||
            (
              "HTTP_" +
              response.status
            ),

            response.status,

            action,

            requestId,

            correlationId
          );


        APIState.errorCount += 1;

        APIState.lastError =
          httpError;

        APIState.lastResponse =
          parsed;


        return httpError;
      }


      var normalized =
        normalizeResponse(
          parsed,
          action,
          requestId,
          correlationId,
          response.status
        );


      if (
        normalized.success
      ) {

        APIState.successCount += 1;

      } else {

        APIState.errorCount += 1;
      }


      APIState.lastResponse =
        normalized;


      APIState.lastError =
        normalized.success
          ? null
          : normalized;


      return normalized;


    } catch (error) {

      var code =
        "NETWORK_ERROR";


      var message =
        (
          error &&
          error.message
        )
          ? error.message
          : "Network request failed.";


      if (
        error &&
        error.name === "AbortError"
      ) {

        code =
          "REQUEST_TIMEOUT";

        message =
          "API request timed out.";
      }


      var networkError =
        createError(
          message,
          code,
          0,
          action,
          requestId,
          correlationId
        );


      APIState.errorCount += 1;

      APIState.lastError =
        networkError;


      return networkError;


    } finally {

      if (timeoutId) {

        clearTimeout(
          timeoutId
        );
      }


      APIState.loading =
        false;
    }
  }


  /* ==========================================================
     11. HEALTH CHECK
     ========================================================== */

  async function testConnection() {

    /*
     * Manual call only.
     */

    if (!isConfigured()) {

      APIState.configured =
        false;

      APIState.connected =
        false;

      APIState.verified =
        false;


      var error =
        createError(
          "API endpoint is not configured. Connection test skipped.",
          "API_NOT_CONFIGURED",
          0,
          ACTIONS.GET_HEALTH,
          "",
          ""
        );


      APIState.lastError =
        error;


      return error;
    }


    var result =
      await request(
        ACTIONS.GET_HEALTH,
        {
          check: "HEALTH",
          project: CONFIG.PROJECT
        }
      );


    if (
      !result ||
      result.success !== true
    ) {

      APIState.connected =
        false;

      APIState.verified =
        false;


      return result;
    }


    APIState.connected =
      true;


    var responseProject =
      result.project;


    if (
      !responseProject &&
      result.data &&
      typeof result.data === "object"
    ) {

      responseProject =
        result.data.project;
    }


    if (
      responseProject ===
      CONFIG.PROJECT
    ) {

      APIState.verified =
        true;

    } else {

      APIState.verified =
        false;


      APIState.lastError =
        createError(
          "Connected endpoint did not verify as GoVara.",
          "PROJECT_VERIFICATION_FAILED",
          200,
          ACTIONS.GET_HEALTH,
          result.requestId,
          result.correlationId
        );
    }


    return result;
  }


  /* ==========================================================
     12. GENERIC CRUD
     ========================================================== */

  async function list(
    module,
    filters
  ) {

    return request(
      module + "_LIST",
      {
        module: module,
        filters:
          filters || {}
      }
    );
  }


  async function get(
    module,
    id,
    extra
  ) {

    var payload = {

      module: module,

      id: id || ""
    };


    if (
      extra &&
      typeof extra === "object"
    ) {

      Object.keys(extra).forEach(
        function (key) {

          payload[key] =
            sanitize(
              extra[key]
            );

        }
      );
    }


    return request(
      module + "_GET",
      payload
    );
  }


  async function save(
    module,
    data
  ) {

    return request(
      module + "_SAVE",
      {
        module: module,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  async function update(
    module,
    id,
    data
  ) {

    return request(
      module + "_UPDATE",
      {
        module: module,

        id: id || "",

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  /* ==========================================================
     13. AUTH
     ========================================================== */

  async function authentication(
    action,
    data
  ) {

    return request(
      action ||
        ACTIONS.AUTH_SESSION,
      {
        module:
          MODULES.AUTH,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  function login(data) {

    return authentication(
      ACTIONS.AUTH_LOGIN,
      data
    );
  }


  function register(data) {

    return authentication(
      ACTIONS.AUTH_REGISTER,
      data
    );
  }


  function logout(data) {

    return authentication(
      ACTIONS.AUTH_LOGOUT,
      data
    );
  }


  function session(data) {

    return authentication(
      ACTIONS.AUTH_SESSION,
      data
    );
  }


  /* ==========================================================
     14. FARE
     ========================================================== */

  function fareCalculate(data) {

    return request(
      ACTIONS.FARE_CALCULATE,
      {
        module:
          MODULES.FARE,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  /* ==========================================================
     15. TRANSACTION
     ========================================================== */

  function transactionCreate(data) {

    return request(
      ACTIONS.TRANSACTION_CREATE,
      {
        module:
          MODULES.TRANSACTION,

        data:
          sanitize(
            data || {}
          ),

        mode: "TESTING",

        realMoney: false,

        realPayment: false,

        bankTransfer: false
      }
    );
  }


  function transactionList(
    filters
  ) {

    return list(
      MODULES.TRANSACTION,
      filters
    );
  }


  /* ==========================================================
     16. WALLET
     ========================================================== */

  function walletGet(data) {

    return request(
      ACTIONS.WALLET_GET,
      {
        module:
          MODULES.WALLET,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  function walletUpdate(data) {

    return request(
      ACTIONS.WALLET_UPDATE,
      {
        module:
          MODULES.WALLET,

        data:
          sanitize(
            data || {}
          ),

        mode: "TESTING",

        realMoney: false,

        realPayment: false,

        bankTransfer: false
      }
    );
  }


  /* ==========================================================
     17. ADMIN
     ========================================================== */

  function adminGet(data) {

    return request(
      ACTIONS.ADMIN_GET,
      {
        module:
          MODULES.ADMIN,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  function adminUpdate(data) {

    return request(
      ACTIONS.ADMIN_UPDATE,
      {
        module:
          MODULES.ADMIN,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  /* ==========================================================
     18. AUDIT
     ========================================================== */

  function auditList(
    filters
  ) {

    return request(
      ACTIONS.AUDIT_LIST,
      {
        module:
          MODULES.AUDIT,

        filters:
          filters || {}
      }
    );
  }


  /* ==========================================================
     19. DOCUMENTS
     ========================================================== */

  function documentList(
    filters
  ) {

    return request(
      ACTIONS.DOCUMENT_LIST,
      {
        module:
          MODULES.DOCUMENTS,

        filters:
          filters || {}
      }
    );
  }


  function documentGet(
    id,
    data
  ) {

    return request(
      ACTIONS.DOCUMENT_GET,
      {
        module:
          MODULES.DOCUMENTS,

        id: id || "",

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  function documentUpload(
    data
  ) {

    return request(
      ACTIONS.DOCUMENT_UPLOAD,
      {
        module:
          MODULES.DOCUMENTS,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  function documentReplace(
    data
  ) {

    return request(
      ACTIONS.DOCUMENT_REPLACE,
      {
        module:
          MODULES.DOCUMENTS,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  function documentReview(
    data
  ) {

    return request(
      ACTIONS.DOCUMENT_REVIEW,
      {
        module:
          MODULES.DOCUMENTS,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  function documentStatus(
    data
  ) {

    return request(
      ACTIONS.DOCUMENT_STATUS,
      {
        module:
          MODULES.DOCUMENTS,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  /* ==========================================================
     20. KYC
     ========================================================== */

  function kycGet(data) {

    return request(
      ACTIONS.KYC_GET,
      {
        module:
          MODULES.KYC,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  function kycSubmit(data) {

    return request(
      ACTIONS.KYC_SUBMIT,
      {
        module:
          MODULES.KYC,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  function kycReview(data) {

    return request(
      ACTIONS.KYC_REVIEW,
      {
        module:
          MODULES.KYC,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  function kycStatus(data) {

    return request(
      ACTIONS.KYC_STATUS,
      {
        module:
          MODULES.KYC,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  /* ==========================================================
     21. OTHER MODULES
     ========================================================== */

  function travel(
    action,
    data
  ) {

    return request(
      action ||
        "TRAVEL_REQUEST",
      {
        module:
          MODULES.TRAVEL,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  function welfare(
    action,
    data
  ) {

    return request(
      action ||
        ACTIONS.WELFARE_GET,
      {
        module:
          MODULES.WELFARE,

        data:
          sanitize(
            data || {}
          ),

        realMoney: false,

        realPayment: false,

        bankTransfer: false
      }
    );
  }


  function location(
    action,
    data
  ) {

    return request(
      action ||
        ACTIONS.LOCATION_GET,
      {
        module:
          MODULES.LOCATION,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  function notifications(
    action,
    data
  ) {

    return request(
      action ||
        ACTIONS.NOTIFICATION_LIST,
      {
        module:
          MODULES.NOTIFICATION,

        data:
          sanitize(
            data || {}
          )
      }
    );
  }


  /* ==========================================================
     22. MODULE REGISTRY
     ========================================================== */

  var ModuleRegistry = {

    CUSTOMER: {
      list: function (filters) {
        return list(
          MODULES.CUSTOMER,
          filters
        );
      },

      get: function (id, extra) {
        return get(
          MODULES.CUSTOMER,
          id,
          extra
        );
      },

      save: function (data) {
        return save(
          MODULES.CUSTOMER,
          data
        );
      },

      update: function (id, data) {
        return update(
          MODULES.CUSTOMER,
          id,
          data
        );
      }
    },


    VENDOR: {
      list: function (filters) {
        return list(
          MODULES.VENDOR,
          filters
        );
      },

      get: function (id, extra) {
        return get(
          MODULES.VENDOR,
          id,
          extra
        );
      },

      save: function (data) {
        return save(
          MODULES.VENDOR,
          data
        );
      },

      update: function (id, data) {
        return update(
          MODULES.VENDOR,
          id,
          data
        );
      }
    },


    DRIVER: {
      list: function (filters) {
        return list(
          MODULES.DRIVER,
          filters
        );
      },

      get: function (id, extra) {
        return get(
          MODULES.DRIVER,
          id,
          extra
        );
      },

      save: function (data) {
        return save(
          MODULES.DRIVER,
          data
        );
      },

      update: function (id, data) {
        return update(
          MODULES.DRIVER,
          id,
          data
        );
      }
    },


    VEHICLE: {
      list: function (filters) {
        return list(
          MODULES.VEHICLE,
          filters
        );
      },

      get: function (id, extra) {
        return get(
          MODULES.VEHICLE,
          id,
          extra
        );
      },

      save: function (data) {
        return save(
          MODULES.VEHICLE,
          data
        );
      },

      update: function (id, data) {
        return update(
          MODULES.VEHICLE,
          id,
          data
        );
      }
    },


    BOOKING: {
      list: function (filters) {
        return list(
          MODULES.BOOKING,
          filters
        );
      },

      get: function (id, extra) {
        return get(
          MODULES.BOOKING,
          id,
          extra
        );
      },

      save: function (data) {
        return save(
          MODULES.BOOKING,
          data
        );
      },

      update: function (id, data) {
        return update(
          MODULES.BOOKING,
          id,
          data
        );
      }
    },


    DUTY: {
      list: function (filters) {
        return list(
          MODULES.DUTY,
          filters
        );
      },

      get: function (id, extra) {
        return get(
          MODULES.DUTY,
          id,
          extra
        );
      },

      save: function (data) {
        return save(
          MODULES.DUTY,
          data
        );
      },

      update: function (id, data) {
        return update(
          MODULES.DUTY,
          id,
          data
        );
      }
    },


    FARE: {
      calculate: fareCalculate
    },


    TRANSACTION: {
      list: transactionList,
      create: transactionCreate
    },


    WALLET: {
      get: walletGet,
      update: walletUpdate
    },


    ADMIN: {
      get: adminGet,
      update: adminUpdate
    },


    AUDIT: {
      list: auditList
    },


    DOCUMENTS: {
      list: documentList,
      get: documentGet,
      upload: documentUpload,
      replace: documentReplace,
      review: documentReview,
      status: documentStatus
    },


    KYC: {
      get: kycGet,
      submit: kycSubmit,
      review: kycReview,
      status: kycStatus
    }
  };


  /* ==========================================================
     23. RESET
     ========================================================== */

  function resetConnectionState() {

    APIState.connected = false;

    APIState.verified = false;

    APIState.loading = false;

    APIState.lastAction = "";

    APIState.lastResponse = null;

    APIState.lastError = null;

    APIState.lastRequestId = "";

    APIState.lastCorrelationId = "";

    APIState.requestCount = 0;

    APIState.successCount = 0;

    APIState.errorCount = 0;

    APIState.lastRequestAt = null;

    APIState.lastResponseAt = null;

    APIState.configured =
      isConfigured();
  }


  /* ==========================================================
     24. UI
     ========================================================== */

  function render() {

    var configured =
      isConfigured();


    var endpoint =
      configured
        ? "CONFIGURED"
        : "NOT CONFIGURED";


    var connection =
      APIState.connected
        ? "CONNECTED"
        : "NOT CONNECTED";


    var verification =
      APIState.verified
        ? "VERIFIED"
        : "NOT VERIFIED";


    var endpointValue =
      configured
        ? escapeHTML(
            CONFIG.API_URL
          )
        : "No API endpoint configured.";


    return [

      '<div class="page-head">',

        '<h1>STEP 27 — Consolidated API</h1>',

        '<div class="muted">',
          'One API boundary for all GoVara modules.',
        '</div>',

      '</div>',


      '<section class="card">',

        '<h2>API Boundary Status</h2>',

        '<div class="grid four">',

          '<div>',
            '<b>',
              endpoint,
            '</b>',
            '<div class="muted">',
              'Endpoint',
            '</div>',
          '</div>',

          '<div>',
            '<b>',
              connection,
            '</b>',
            '<div class="muted">',
              'Connection',
            '</div>',
          '</div>',

          '<div>',
            '<b>',
              verification,
            '</b>',
            '<div class="muted">',
              'GoVara Verification',
            '</div>',
          '</div>',

          '<div>',
            '<b>',
              escapeHTML(
                APIState.lastAction || "—"
              ),
            '</b>',
            '<div class="muted">',
              'Last Action',
            '</div>',
          '</div>',

        '</div>',

      '</section>',


      '<section class="card">',

        '<h2>Environment</h2>',

        '<div class="grid four">',

          '<div>',
            '<b>',
              VERSION,
            '</b>',
            '<div class="muted">',
              'Version',
            '</div>',
          '</div>',

          '<div>',
            '<b>',
              CONFIG.ENVIRONMENT,
            '</b>',
            '<div class="muted">',
              'Environment',
            '</div>',
          '</div>',

          '<div>',
            '<b>',
              String(
                APIState.requestCount
              ),
            '</b>',
            '<div class="muted">',
              'Requests',
            '</div>',
          '</div>',

          '<div>',
            '<b>',
              String(
                APIState.successCount
              ),
            '</b>',
            '<div class="muted">',
              'Successful',
            '</div>',
          '</div>',

        '</div>',

      '</section>',


      '<section class="card">',

        '<h2>Authority Boundary</h2>',

        '<div class="grid four">',

          '<div>',
            '<b>BACKEND</b>',
            '<div class="muted">',
              'Business Authority',
            '</div>',
          '</div>',

          '<div>',
            '<b>DATABASE</b>',
            '<div class="muted">',
              'Authoritative Store',
            '</div>',
          '</div>',

          '<div>',
            '<b>BACKEND</b>',
            '<div class="muted">',
              'KYC Authority',
            '</div>',
          '</div>',

          '<div>',
            '<b>BACKEND</b>',
            '<div class="muted">',
              'Financial Authority',
            '</div>',
          '</div>',

        '</div>',

      '</section>',


      '<section class="card">',

        '<h2>Financial Safety</h2>',

        '<div class="grid four">',

          '<div>',
            '<b>BLOCKED</b>',
            '<div class="muted">',
              'Real Money',
            '</div>',
          '</div>',

          '<div>',
            '<b>BLOCKED</b>',
            '<div class="muted">',
              'Real Payment',
            '</div>',
          '</div>',

          '<div>',
            '<b>BLOCKED</b>',
            '<div class="muted">',
              'Bank Transfer',
            '</div>',
          '</div>',

          '<div>',
            '<b>FALSE</b>',
            '<div class="muted">',
              'Frontend Financial Authority',
            '</div>',
          '</div>',

        '</div>',

      '</section>',


      '<section class="card">',

        '<h2>Consolidated Modules</h2>',

        '<div class="grid four">',

          '<div><b>CUSTOMER</b></div>',
          '<div><b>VENDOR</b></div>',
          '<div><b>DRIVER</b></div>',
          '<div><b>VEHICLE</b></div>',

          '<div><b>BOOKING</b></div>',
          '<div><b>DUTY</b></div>',
          '<div><b>FARE</b></div>',
          '<div><b>TRANSACTION</b></div>',

          '<div><b>WALLET</b></div>',
          '<div><b>LEDGER</b></div>',
          '<div><b>SETTLEMENT</b></div>',
          '<div><b>BILLING</b></div>',

          '<div><b>DOCUMENTS</b></div>',
          '<div><b>KYC</b></div>',
          '<div><b>ADMIN</b></div>',
          '<div><b>AUDIT</b></div>',

          '<div><b>AUTH</b></div>',
          '<div><b>NOTIFICATION</b></div>',
          '<div><b>LOCATION</b></div>',
          '<div><b>TRAVEL</b></div>',

          '<div><b>WELFARE</b></div>',

        '</div>',

      '</section>',


      '<section class="card">',

        '<h2>API Controls</h2>',

        '<div style="display:flex;gap:10px;flex-wrap:wrap;">',

          '<button',
            ' type="button"',
            ' class="btn"',
            ' id="govara27-test-connection"',
          '>',
            'Test Connection',
          '</button>',

          '<button',
            ' type="button"',
            ' class="btn"',
            ' id="govara27-reset-state"',
          '>',
            'Reset Connection State',
          '</button>',

        '</div>',


        '<div',
          ' id="govara27-result"',
          ' class="notice"',
          ' style="margin-top:12px;"',
        '>',

          'API testing is manual only. ',
          'No automatic connection test is performed.',

        '</div>',

      '</section>',


      '<section class="card">',

        '<h2>Security Boundary</h2>',

        '<div class="notice warn">',

          'Frontend is not the authority for ',
          'business rules, KYC approval, financial ',
          'operations, audit truth or database truth. ',
          'Backend remains authoritative.',

        '</div>',

      '</section>',


      '<section class="card">',

        '<h2>Current Endpoint</h2>',

        '<div class="muted">',
          endpointValue,
        '</div>',

      '</section>'

    ].join("");
  }


  /* ==========================================================
     25. UI BIND
     ========================================================== */

  function bind(root) {

    if (!root) {
      return;
    }


    var testButton =
      root.querySelector(
        "#govara27-test-connection"
      );


    var resetButton =
      root.querySelector(
        "#govara27-reset-state"
      );


    var resultBox =
      root.querySelector(
        "#govara27-result"
      );


    if (testButton) {

      testButton.onclick =
        async function () {

          if (resultBox) {

            resultBox.textContent =
              "Testing API connection...";
          }


          var result =
            await testConnection();


          if (resultBox) {

            resultBox.textContent =
              result &&
              result.message
                ? result.message
                : (
                    result &&
                    result.success
                      ? "API connection successful."
                      : "API connection failed."
                  );
          }

        };
    }


    if (resetButton) {

      resetButton.onclick =
        function () {

          resetConnectionState();


          if (
            root &&
            root.innerHTML !== undefined
          ) {

            root.innerHTML =
              render();

            bind(root);
          }

        };
    }

  }


  /* ==========================================================
     26. RENDER + BIND
     ========================================================== */

  function renderAndBind(root) {

    if (!root) {

      try {

        root =
          document.getElementById(
            "module-27"
          );

      } catch (e) {

        root = null;
      }
    }


    if (!root) {
      return false;
    }


    try {

      root.innerHTML =
        render();

      bind(root);

      return true;

    } catch (error) {

      /*
       * Do not allow STEP 27 rendering
       * to crash the entire GoVara frontend.
       */

      try {

        root.innerHTML =
          '<div class="card">' +
            '<h2>STEP 27 — Consolidated API</h2>' +
            '<div class="notice warn">' +
              'STEP 27 UI could not render safely.' +
            '</div>' +
          '</div>';

      } catch (ignore) {}

      return false;
    }
  }


  /* ==========================================================
     27. PUBLIC OBJECT
     ========================================================== */

  var GoVaraAPI = {

    VERSION: VERSION,

    CONFIG: CONFIG,

    MODULES: MODULES,

    ACTIONS: ACTIONS,

    state: APIState,

    ModuleRegistry:
      ModuleRegistry,

    getAPIUrl:
      getAPIUrl,

    isConfigured:
      isConfigured,

    getState:
      getState,

    getStatus:
      getStatus,

    enforceSafety:
      enforceSafety,

    sanitize:
      sanitize,

    request:
      request,

    testConnection:
      testConnection,

    resetConnectionState:
      resetConnectionState,

    list:
      list,

    get:
      get,

    save:
      save,

    update:
      update,

    authentication:
      authentication,

    login:
      login,

    register:
      register,

    logout:
      logout,

    session:
      session,

    fareCalculate:
      fareCalculate,

    transactionCreate:
      transactionCreate,

    transactionList:
      transactionList,

    walletGet:
      walletGet,

    walletUpdate:
      walletUpdate,

    adminGet:
      adminGet,

    adminUpdate:
      adminUpdate,

    auditList:
      auditList,

    documentList:
      documentList,

    documentGet:
      documentGet,

    documentUpload:
      documentUpload,

    documentReplace:
      documentReplace,

    documentReview:
      documentReview,

    documentStatus:
      documentStatus,

    kycGet:
      kycGet,

    kycSubmit:
      kycSubmit,

    kycReview:
      kycReview,

    kycStatus:
      kycStatus,

    travel:
      travel,

    welfare:
      welfare,

    location:
      location,

    notifications:
      notifications,

    render:
      render,

    bind:
      bind,

    renderAndBind:
      renderAndBind
  };


  /* ==========================================================
     28. GLOBAL EXPORT
     ========================================================== */

  if (
    typeof window !== "undefined"
  ) {

    window.GoVaraAPI =
      GoVaraAPI;
  }


})();
