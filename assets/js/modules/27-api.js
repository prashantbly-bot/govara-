/* ============================================================
   GoVara STEP 27 — Consolidated API Boundary
   Version: GOVARA-CONSOLIDATED-API-V2
   Frontend API Boundary Only
   Backend + Database remain authoritative
   ============================================================ */

window.GoVaraAPI = (function () {

  "use strict";

  /* ==========================================================
     1. CONFIGURATION
     ========================================================== */

  const VERSION = "GOVARA-CONSOLIDATED-API-V2";

  const CONFIG = {
    API_URL:
      (typeof window !== "undefined" && window.GOVARA_API_URL)
        ? String(window.GOVARA_API_URL).trim()
        : "",

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


  /* ==========================================================
     2. API STATE
     ========================================================== */

  const APIState = {
    configured: false,
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
     3. MODULE REGISTRY
     ========================================================== */

  const MODULES = {

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


  /* ==========================================================
     4. ACTION REGISTRY
     ========================================================== */

  const ACTIONS = {

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
     5. SECURITY / SAFETY
     ========================================================== */

  function enforceSafety(payload) {

    const safe = payload && typeof payload === "object"
      ? JSON.parse(JSON.stringify(payload))
      : {};

    /*
     * Frontend must never become financial authority.
     */
    safe.realMoney = false;
    safe.realPayment = false;
    safe.bankTransfer = false;

    safe.frontendFinancialAuthority = false;
    safe.backendFinancialAuthority = true;

    /*
     * KYC authority remains backend.
     */
    safe.frontendKYCAuthority = false;
    safe.backendKYCAuthority = true;

    /*
     * Database remains authoritative store.
     */
    safe.databaseAuthority = true;

    /*
     * Testing environment.
     */
    safe.mode = "TESTING";

    return safe;
  }


  /* ==========================================================
     6. SENSITIVE DATA SANITIZATION
     ========================================================== */

  const SENSITIVE_KEYS = [
    "password",
    "pass",
    "otp",
    "pin",
    "cvv",
    "cardNumber",
    "accountNumber",
    "token",
    "accessToken",
    "refreshToken",
    "secret",
    "privateKey",
    "authorization",
    "rawDocument",
    "documentBinary",
    "fileBinary"
  ];

  function sanitize(value) {

    if (value === null || value === undefined) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map(sanitize);
    }

    if (typeof value !== "object") {
      return value;
    }

    const result = {};

    Object.keys(value).forEach(function (key) {

      const lower = key.toLowerCase();

      const blocked = SENSITIVE_KEYS.some(function (sensitive) {
        return lower === sensitive.toLowerCase();
      });

      if (blocked) {
        result[key] = "[REDACTED]";
      } else {
        result[key] = sanitize(value[key]);
      }
    });

    return result;
  }


  /* ==========================================================
     7. REQUEST ID / CORRELATION ID
     ========================================================== */

  function randomPart() {
    return Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
  }

  function createRequestId() {
    return "GV-REQ-" + Date.now() + "-" + randomPart();
  }

  function createCorrelationId() {
    return "GV-COR-" + Date.now() + "-" + randomPart();
  }


  /* ==========================================================
     8. ERROR CREATION
     ========================================================== */

  function createAPIError(
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

      message: message || "API request failed.",

      action: action || "",

      requestId: requestId || "",

      correlationId: correlationId || "",

      timestamp: new Date().toISOString()
    };
  }


  /* ==========================================================
     9. CONFIG HELPERS
     ========================================================== */

  function getAPIUrl() {
    return CONFIG.API_URL;
  }

  function isConfigured() {
    return !!getAPIUrl();
  }

  function getState() {

    return JSON.parse(JSON.stringify({
      configured: APIState.configured,
      connected: APIState.connected,
      verified: APIState.verified,

      loading: APIState.loading,

      lastAction: APIState.lastAction,
      lastResponse: sanitize(APIState.lastResponse),
      lastError: sanitize(APIState.lastError),

      lastRequestId: APIState.lastRequestId,
      lastCorrelationId: APIState.lastCorrelationId,

      requestCount: APIState.requestCount,
      successCount: APIState.successCount,
      errorCount: APIState.errorCount,

      lastRequestAt: APIState.lastRequestAt,
      lastResponseAt: APIState.lastResponseAt
    }));
  }


  /* ==========================================================
     10. HTTP REQUEST ENGINE
     ========================================================== */

  async function request(action, payload, options) {

    options = options || {};

    const requestId =
      options.requestId || createRequestId();

    const correlationId =
      options.correlationId || createCorrelationId();

    APIState.configured = isConfigured();

    APIState.lastAction = action || "";
    APIState.lastRequestId = requestId;
    APIState.lastCorrelationId = correlationId;
    APIState.lastRequestAt = new Date().toISOString();

    /*
     * Never automatically test an unconfigured API.
     */
    if (!APIState.configured) {

      const error = createAPIError(
        "API endpoint is not configured.",
        "API_NOT_CONFIGURED",
        0,
        action,
        requestId,
        correlationId
      );

      APIState.lastError = error;

      return error;
    }


    /*
     * Hard financial boundary.
     */
    if (
      action === "PAYMENT_EXECUTE" ||
      action === "BANK_TRANSFER_EXECUTE" ||
      action === "REAL_MONEY_TRANSFER"
    ) {

      const error = createAPIError(
        "Real money, real payment and bank transfer are blocked in the frontend.",
        "FINANCIAL_OPERATION_BLOCKED",
        403,
        action,
        requestId,
        correlationId
      );

      APIState.errorCount += 1;
      APIState.lastError = error;

      return error;
    }


    APIState.loading = true;
    APIState.requestCount += 1;

    const controller =
      typeof AbortController !== "undefined"
        ? new AbortController()
        : null;

    let timeoutId = null;

    if (controller) {

      timeoutId = setTimeout(function () {
        controller.abort();
      }, CONFIG.REQUEST_TIMEOUT);
    }


    const safePayload = enforceSafety(
      sanitize(payload || {})
    );


    const body = {
      project: CONFIG.PROJECT,
      version: VERSION,

      action: action,

      requestId: requestId,
      correlationId: correlationId,

      timestamp: new Date().toISOString(),

      environment: CONFIG.ENVIRONMENT,

      payload: safePayload
    };


    try {

      const response = await fetch(
        getAPIUrl(),
        {
          method: options.method || "POST",

          headers: {
            "Content-Type": "text/plain;charset=utf-8",
            "Accept": "application/json"
          },

          body:
            (options.method || "POST") === "GET"
              ? undefined
              : JSON.stringify(body),

          signal:
            controller
              ? controller.signal
              : undefined
        }
      );


      const rawText = await response.text();

      let parsed;

      try {
        parsed = rawText
          ? JSON.parse(rawText)
          : {};
      } catch (parseError) {

        parsed = {
          success: false,
          status: "INVALID_JSON_RESPONSE",
          raw: rawText
        };
      }


      APIState.lastResponseAt =
        new Date().toISOString();


      if (!response.ok) {

        const error = createAPIError(
          parsed.message ||
          parsed.error ||
          ("HTTP request failed with status " + response.status),

          parsed.code ||
          ("HTTP_" + response.status),

          response.status,

          action,

          requestId,

          correlationId
        );

        APIState.errorCount += 1;
        APIState.lastError = error;
        APIState.lastResponse = parsed;

        return error;
      }


      const normalized = normalizeResponse(
        parsed,
        action,
        requestId,
        correlationId,
        response.status
      );


      if (normalized.success === true) {
        APIState.successCount += 1;
      } else {
        APIState.errorCount += 1;
      }


      APIState.lastResponse = normalized;
      APIState.lastError =
        normalized.success === true
          ? null
          : normalized;


      return normalized;

    } catch (error) {

      let code = "NETWORK_ERROR";
      let message =
        error && error.message
          ? error.message
          : "Network request failed.";

      if (error && error.name === "AbortError") {
        code = "REQUEST_TIMEOUT";
        message = "API request timed out.";
      }


      const apiError = createAPIError(
        message,
        code,
        0,
        action,
        requestId,
        correlationId
      );

      APIState.errorCount += 1;
      APIState.lastError = apiError;

      return apiError;

    } finally {

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      APIState.loading = false;
    }
  }


  /* ==========================================================
     11. RESPONSE NORMALIZATION
     ========================================================== */

  function normalizeResponse(
    response,
    action,
    requestId,
    correlationId,
    httpStatus
  ) {

    const source =
      response && typeof response === "object"
        ? response
        : {};


    let success;

    if (typeof source.success === "boolean") {
      success = source.success;
    } else if (
      source.status === "SUCCESS" ||
      source.status === "DATA_SAVED" ||
      source.status === "OK"
    ) {
      success = true;
    } else if (
      source.error ||
      source.errors
    ) {
      success = false;
    } else {
      /*
       * Health endpoints may return project data
       * without an explicit success flag.
       */
      success = true;
    }


    return {
      success: success,

      project:
        source.project || CONFIG.PROJECT,

      version:
        source.version || VERSION,

      action:
        source.action || action,

      status:
        source.status ||
        (success ? "SUCCESS" : "ERROR"),

      code:
        source.code ||
        (success ? "OK" : "API_ERROR"),

      message:
        source.message ||
        source.error ||
        (success ? "Request successful." : "Request failed."),

      data:
        source.data !== undefined
          ? source.data
          : source.payload !== undefined
            ? source.payload
            : source,

      errors:
        source.errors || null,

      requestId:
        source.requestId || requestId,

      correlationId:
        source.correlationId || correlationId,

      httpStatus:
        httpStatus || 200,

      timestamp:
        source.timestamp ||
        new Date().toISOString()
    };
  }


  /* ==========================================================
     12. HEALTH / CONNECTION
     ========================================================== */

  async function testConnection() {

    /*
     * Explicitly called only.
     * Never auto-run.
     */

    if (!isConfigured()) {

      APIState.configured = false;
      APIState.connected = false;
      APIState.verified = false;

      const error = createAPIError(
        "API endpoint is not configured. Connection test skipped.",
        "API_NOT_CONFIGURED",
        0,
        ACTIONS.GET_HEALTH,
        "",
        ""
      );

      APIState.lastError = error;

      return error;
    }


    const result = await request(
      ACTIONS.GET_HEALTH,
      {
        check: "HEALTH",
        project: CONFIG.PROJECT
      }
    );


    if (!result || result.success !== true) {

      APIState.connected = false;
      APIState.verified = false;

      return result;
    }


    APIState.connected = true;


    /*
     * GoVara verification.
     */
    if (
      result.project === CONFIG.PROJECT ||
      (
        result.data &&
        result.data.project === CONFIG.PROJECT
      )
    ) {

      APIState.verified = true;

    } else {

      APIState.verified = false;

      APIState.lastError =
        createAPIError(
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
     13. GENERIC MODULE METHODS
     ========================================================== */

  async function list(module, filters) {

    return request(
      module + "_LIST",
      {
        module: module,
        filters: filters || {}
      }
    );
  }


  async function get(module, id, extra) {

    return request(
      module + "_GET",
      {
        module: module,
        id: id || "",
        ...(extra || {})
      }
    );
  }


  async function save(module, data) {

    return request(
      module + "_SAVE",
      {
        module: module,
        data: sanitize(data || {})
      }
    );
  }


  async function update(module, id, data) {

    return request(
      module + "_UPDATE",
      {
        module: module,
        id: id || "",
        data: sanitize(data || {})
      }
    );
  }


  /* ==========================================================
     14. AUTHENTICATION
     ========================================================== */

  async function authentication(action, data) {

    return request(
      action || ACTIONS.AUTH_SESSION,
      {
        module: MODULES.AUTH,
        data: sanitize(data || {})
      }
    );
  }


  async function login(data) {

    return authentication(
      ACTIONS.AUTH_LOGIN,
      data
    );
  }


  async function register(data) {

    return authentication(
      ACTIONS.AUTH_REGISTER,
      data
    );
  }


  async function logout(data) {

    return authentication(
      ACTIONS.AUTH_LOGOUT,
      data
    );
  }


  async function session(data) {

    return authentication(
      ACTIONS.AUTH_SESSION,
      data
    );
  }


  /* ==========================================================
     15. FARE
     ========================================================== */

  async function fareCalculate(data) {

    return request(
      ACTIONS.FARE_CALCULATE,
      {
        module: MODULES.FARE,
        data: sanitize(data || {})
      }
    );
  }


  /* ==========================================================
     16. TRANSACTION
     ========================================================== */

  async function transactionCreate(data) {

    /*
     * Transaction is allowed only as a backend request.
     * Frontend cannot authorize real money.
     */

    return request(
      ACTIONS.TRANSACTION_CREATE,
      {
        module: MODULES.TRANSACTION,
        data: sanitize(data || {}),

        mode: "TESTING",

        realMoney: false,
        realPayment: false,
        bankTransfer: false
      }
    );
  }


  async function transactionList(filters) {

    return request(
      ACTIONS.TRANSACTION_LIST,
      {
        module: MODULES.TRANSACTION,
        filters: filters || {}
      }
    );
  }


  /* ==========================================================
     17. WALLET
     ========================================================== */

  async function walletGet(data) {

    return request(
      ACTIONS.WALLET_GET,
      {
        module: MODULES.WALLET,
        data: sanitize(data || {})
      }
    );
  }


  async function walletUpdate(data) {

    return request(
      ACTIONS.WALLET_UPDATE,
      {
        module: MODULES.WALLET,
        data: sanitize(data || {}),

        mode: "TESTING",

        realMoney: false,
        realPayment: false,
        bankTransfer: false
      }
    );
  }


  /* ==========================================================
     18. ADMIN
     ========================================================== */

  async function adminGet(data) {

    return request(
      ACTIONS.ADMIN_GET,
      {
        module: MODULES.ADMIN,
        data: sanitize(data || {})
      }
    );
  }


  async function adminUpdate(data) {

    return request(
      ACTIONS.ADMIN_UPDATE,
      {
        module: MODULES.ADMIN,
        data: sanitize(data || {})
      }
    );
  }


  /* ==========================================================
     19. AUDIT
     ========================================================== */

  async function auditList(filters) {

    return request(
      ACTIONS.AUDIT_LIST,
      {
        module: MODULES.AUDIT,
        filters: filters || {}
      }
    );
  }


  /* ==========================================================
     20. DOCUMENTS
     ========================================================== */

  async function documentList(filters) {

    return request(
      ACTIONS.DOCUMENT_LIST,
      {
        module: MODULES.DOCUMENTS,
        filters: filters || {}
      }
    );
  }


  async function documentGet(id, data) {

    return request(
      ACTIONS.DOCUMENT_GET,
      {
        module: MODULES.DOCUMENTS,
        id: id || "",
        data: sanitize(data || {})
      }
    );
  }


  async function documentUpload(data) {

    return request(
      ACTIONS.DOCUMENT_UPLOAD,
      {
        module: MODULES.DOCUMENTS,
        data: sanitize(data || {})
      }
    );
  }


  async function documentReplace(data) {

    return request(
      ACTIONS.DOCUMENT_REPLACE,
      {
        module: MODULES.DOCUMENTS,
        data: sanitize(data || {})
      }
    );
  }


  async function documentReview(data) {

    return request(
      ACTIONS.DOCUMENT_REVIEW,
      {
        module: MODULES.DOCUMENTS,
        data: sanitize(data || {})
      }
    );
  }


  async function documentStatus(data) {

    return request(
      ACTIONS.DOCUMENT_STATUS,
      {
        module: MODULES.DOCUMENTS,
        data: sanitize(data || {})
      }
    );
  }


  /* ==========================================================
     21. KYC
     ========================================================== */

  async function kycGet(data) {

    return request(
      ACTIONS.KYC_GET,
      {
        module: MODULES.KYC,
        data: sanitize(data || {})
      }
    );
  }


  async function kycSubmit(data) {

    return request(
      ACTIONS.KYC_SUBMIT,
      {
        module: MODULES.KYC,
        data: sanitize(data || {})
      }
    );
  }


  async function kycReview(data) {

    return request(
      ACTIONS.KYC_REVIEW,
      {
        module: MODULES.KYC,
        data: sanitize(data || {})
      }
    );
  }


  async function kycStatus(data) {

    return request(
      ACTIONS.KYC_STATUS,
      {
        module: MODULES.KYC,
        data: sanitize(data || {})
      }
    );
  }


  /* ==========================================================
     22. TRAVEL
     ========================================================== */

  async function travel(module, action, data) {

    return request(
      "TRAVEL_" + String(action || "REQUEST").toUpperCase(),
      {
        module: module || MODULES.TRAVEL,
        data: sanitize(data || {})
      }
    );
  }


  /* ==========================================================
     23. WELFARE
     ========================================================== */

  async function welfare(action, data) {

    return request(
      action || ACTIONS.WELFARE_GET,
      {
        module: MODULES.WELFARE,
        data: sanitize(data || {}),

        /*
         * Welfare may contain financial information,
         * but frontend execution remains blocked.
         */
        realMoney: false,
        realPayment: false,
        bankTransfer: false
      }
    );
  }


  /* ==========================================================
     24. LOCATION
     ========================================================== */

  async function location(action, data) {

    return request(
      action || ACTIONS.LOCATION_GET,
      {
        module: MODULES.LOCATION,
        data: sanitize(data || {})
      }
    );
  }


  /* ==========================================================
     25. NOTIFICATIONS
     ========================================================== */

  async function notifications(action, data) {

    return request(
      action || ACTIONS.NOTIFICATION_LIST,
      {
        module: MODULES.NOTIFICATION,
        data: sanitize(data || {})
      }
    );
  }


  /* ==========================================================
     26. CONNECTION RESET
     ========================================================== */

  function resetConnectionState() {

    APIState.connected = false;
    APIState.verified = false;

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
  }


  /* ==========================================================
     27. STATUS
     ========================================================== */

  function getStatus() {

    return {
      version: VERSION,

      configured: isConfigured(),

      connected: APIState.connected,

      verified: APIState.verified,

      environment: CONFIG.ENVIRONMENT,

      frontendFinancialAuthority:
        CONFIG.FRONTEND_FINANCIAL_AUTHORITY,

      backendFinancialAuthority:
        CONFIG.BACKEND_FINANCIAL_AUTHORITY,

      frontendKYCAuthority:
        CONFIG.FRONTEND_KYC_AUTHORITY,

      backendKYCAuthority:
        CONFIG.BACKEND_KYC_AUTHORITY,

      databaseAuthority:
        CONFIG.DATABASE_AUTHORITY,

      realMoney:
        false,

      realPayment:
        false,

      bankTransfer:
        false,

      loading:
        APIState.loading,

      lastAction:
        APIState.lastAction,

      lastError:
        sanitize(APIState.lastError)
    };
  }


  /* ==========================================================
     28. MODULE API MAP
     ========================================================== */

  const ModuleRegistry = {

    CUSTOMER: {
      list: function (filters) {
        return list(MODULES.CUSTOMER, filters);
      },
      get: function (id, extra) {
        return get(MODULES.CUSTOMER, id, extra);
      },
      save: function (data) {
        return save(MODULES.CUSTOMER, data);
      },
      update: function (id, data) {
        return update(MODULES.CUSTOMER, id, data);
      }
    },


    VENDOR: {
      list: function (filters) {
        return list(MODULES.VENDOR, filters);
      },
      get: function (id, extra) {
        return get(MODULES.VENDOR, id, extra);
      },
      save: function (data) {
        return save(MODULES.VENDOR, data);
      },
      update: function (id, data) {
        return update(MODULES.VENDOR, id, data);
      }
    },


    DRIVER: {
      list: function (filters) {
        return list(MODULES.DRIVER, filters);
      },
      get: function (id, extra) {
        return get(MODULES.DRIVER, id, extra);
      },
      save: function (data) {
        return save(MODULES.DRIVER, data);
      },
      update: function (id, data) {
        return update(MODULES.DRIVER, id, data);
      }
    },


    VEHICLE: {
      list: function (filters) {
        return list(MODULES.VEHICLE, filters);
      },
      get: function (id, extra) {
        return get(MODULES.VEHICLE, id, extra);
      },
      save: function (data) {
        return save(MODULES.VEHICLE, data);
      },
      update: function (id, data) {
        return update(MODULES.VEHICLE, id, data);
      }
    },


    BOOKING: {
      list: function (filters) {
        return list(MODULES.BOOKING, filters);
      },
      get: function (id, extra) {
        return get(MODULES.BOOKING, id, extra);
      },
      save: function (data) {
        return save(MODULES.BOOKING, data);
      },
      update: function (id, data) {
        return update(MODULES.BOOKING, id, data);
      }
    },


    DUTY: {
      list: function (filters) {
        return list(MODULES.DUTY, filters);
      },
      get: function (id, extra) {
        return get(MODULES.DUTY, id, extra);
      },
      save: function (data) {
        return save(MODULES.DUTY, data);
      },
      update: function (id, data) {
        return update(MODULES.DUTY, id, data);
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
     29. FRONTEND UI
     ========================================================== */

  function render() {

    const configured =
      isConfigured();

    const connected =
      APIState.connected;

    const verified =
      APIState.verified;


    const endpointText =
      configured
        ? "CONFIGURED"
        : "NOT CONFIGURED";


    const connectionText =
      connected
        ? "CONNECTED"
        : "NOT CONNECTED";


    const verificationText =
      verified
        ? "VERIFIED"
        : "NOT VERIFIED";


    return `
      <div class="page-head">

        <h1>STEP 27 — Consolidated API</h1>

        <div class="muted">
          One API boundary for all GoVara modules.
          Backend and Database remain authoritative.
        </div>

      </div>


      <section class="card">

        <h2>API Boundary Status</h2>

        <div class="grid four">

          <div>
            <b>${endpointText}</b>
            <div class="muted">Endpoint</div>
          </div>

          <div>
            <b>${connectionText}</b>
            <div class="muted">Connection</div>
          </div>

          <div>
            <b>${verificationText}</b>
            <div class="muted">GoVara Verification</div>
          </div>

          <div>
            <b>${APIState.lastAction || "—"}</b>
            <div class="muted">Last Action</div>
          </div>

        </div>

      </section>


      <section class="card">

        <h2>API Environment</h2>

        <div class="grid four">

          <div>
            <b>${VERSION}</b>
            <div class="muted">API Version</div>
          </div>

          <div>
            <b>${CONFIG.ENVIRONMENT}</b>
            <div class="muted">Environment</div>
          </div>

          <div>
            <b>${APIState.requestCount}</b>
            <div class="muted">Requests</div>
          </div>

          <div>
            <b>${APIState.successCount}</b>
            <div class="muted">Successful</div>
          </div>

        </div>

      </section>


      <section class="card">

        <h2>Authority Boundary</h2>

        <div class="grid four">

          <div>
            <b>BACKEND</b>
            <div class="muted">Business Authority</div>
          </div>

          <div>
            <b>DATABASE</b>
            <div class="muted">Authoritative Store</div>
          </div>

          <div>
            <b>BACKEND</b>
            <div class="muted">KYC Authority</div>
          </div>

          <div>
            <b>BACKEND</b>
            <div class="muted">Financial Authority</div>
          </div>

        </div>

      </section>


      <section class="card">

        <h2>Financial Safety Boundary</h2>

        <div class="grid four">

          <div>
            <b>BLOCKED</b>
            <div class="muted">Real Money</div>
          </div>

          <div>
            <b>BLOCKED</b>
            <div class="muted">Real Payment</div>
          </div>

          <div>
            <b>BLOCKED</b>
            <div class="muted">Bank Transfer</div>
          </div>

          <div>
            <b>FALSE</b>
            <div class="muted">Frontend Financial Authority</div>
          </div>

        </div>

      </section>


      <section class="card">

        <h2>Consolidated Modules</h2>

        <div class="grid four">

          <div><b>CUSTOMER</b></div>
          <div><b>VENDOR</b></div>
          <div><b>DRIVER</b></div>
          <div><b>VEHICLE</b></div>

          <div><b>BOOKING</b></div>
          <div><b>DUTY</b></div>
          <div><b>FARE</b></div>
          <div><b>TRANSACTION</b></div>

          <div><b>WALLET</b></div>
          <div><b>LEDGER</b></div>
          <div><b>SETTLEMENT</b></div>
          <div><b>BILLING</b></div>

          <div><b>DOCUMENTS</b></div>
          <div><b>KYC</b></div>
          <div><b>ADMIN</b></div>
          <div><b>AUDIT</b></div>

          <div><b>AUTH</b></div>
          <div><b>NOTIFICATION</b></div>
          <div><b>LOCATION</b></div>
          <div><b>TRAVEL</b></div>

          <div><b>WELFARE</b></div>

        </div>

      </section>


      <section class="card">

        <h2>API Controls</h2>

        <div style="display:flex;gap:10px;flex-wrap:wrap;">

          <button
            type="button"
            class="btn"
            id="govara27-test-connection">
            Test Connection
          </button>

          <button
            type="button"
            class="btn"
            id="govara27-reset-state">
            Reset Connection State
          </button>

        </div>

        <div
          id="govara27-result"
          class="notice"
          style="margin-top:12px;">
          API testing is manual only.
          No automatic connection test is performed.
        </div>

      </section>


      <section class="card">

        <h2>Security Boundary</h2>

        <div class="notice warn">

          Frontend does not become the authority for
          financial transactions, KYC approval, audit truth,
          business policy enforcement or database truth.

          Final authorization and validation remain with
          the Backend and authoritative Database.

        </div>

      </section>


      <section class="card">

        <h2>Current Endpoint</h2>

        <div class="muted">

          ${
            configured
              ? escapeHTML(CONFIG.API_URL)
              : "No API endpoint configured."
          }

        </div>

      </section>
    `;
  }


  /* ==========================================================
     30. HTML ESCAPE
     ========================================================== */

  function escapeHTML(value) {

    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* ==========================================================
     31. UI BINDING
     ========================================================== */

  function bind(root) {

    root =
      root ||
      document.getElementById("module-27") ||
      document;


    const testButton =
      root.querySelector(
        "#govara27-test-connection"
      );


    const resetButton =
      root.querySelector(
        "#govara27-reset-state"
      );


    const resultBox =
      root.querySelector(
        "#govara27-result"
      );


    if (testButton) {

      testButton.addEventListener(
        "click",
        async function () {

          resultBox.textContent =
            "Testing API connection...";


          const result =
            await testConnection();


          if (result.success === true) {

            resultBox.textContent =
              result.message ||
              "API connection successful.";

          } else {

            resultBox.textContent =
              result.message ||
              "API connection failed.";
          }

        }
      );
    }


    if (resetButton) {

      resetButton.addEventListener(
        "click",
        function () {

          resetConnectionState();

          if (
            root &&
            root.id === "module-27"
          ) {
            root.innerHTML = render();
            bind(root);
          }

        }
      );
    }
  }


  /* ==========================================================
     32. RENDER + BIND
     ========================================================== */

  function renderAndBind(root) {

    root =
      root ||
      document.getElementById("module-27");


    if (!root) {
      return;
    }


    root.innerHTML = render();

    bind(root);
  }


  /* ==========================================================
     33. INITIALIZATION
     ========================================================== */

  function initialize() {

    APIState.configured =
      isConfigured();

    /*
     * IMPORTANT:
     * No testConnection() here.
     *
     * STEP 27 must remain NOT CONFIGURED /
     * NOT CONNECTED until the user intentionally
     * configures and tests the backend.
     */

    const mount =
      document.getElementById("module-27");


    if (mount) {
      renderAndBind(mount);
    }
  }


  if (
    typeof document !== "undefined"
  ) {

    if (
      document.readyState === "loading"
    ) {

      document.addEventListener(
        "DOMContentLoaded",
        initialize
      );

    } else {

      initialize();
    }
  }


  /* ==========================================================
     34. PUBLIC API
     ========================================================== */

  return {

    VERSION: VERSION,

    CONFIG: CONFIG,

    MODULES: MODULES,

    ACTIONS: ACTIONS,

    state: APIState,

    ModuleRegistry: ModuleRegistry,

    getAPIUrl: getAPIUrl,

    isConfigured: isConfigured,

    getState: getState,

    getStatus: getStatus,

    enforceSafety: enforceSafety,

    sanitize: sanitize,

    request: request,

    testConnection: testConnection,

    resetConnectionState: resetConnectionState,

    list: list,

    get: get,

    save: save,

    update: update,

    authentication: authentication,

    login: login,

    register: register,

    logout: logout,

    session: session,

    fareCalculate: fareCalculate,

    transactionCreate: transactionCreate,

    transactionList: transactionList,

    walletGet: walletGet,

    walletUpdate: walletUpdate,

    adminGet: adminGet,

    adminUpdate: adminUpdate,

    auditList: auditList,

    documentList: documentList,

    documentGet: documentGet,

    documentUpload: documentUpload,

    documentReplace: documentReplace,

    documentReview: documentReview,

    documentStatus: documentStatus,

    kycGet: kycGet,

    kycSubmit: kycSubmit,

    kycReview: kycReview,

    kycStatus: kycStatus,

    travel: travel,

    welfare: welfare,

    location: location,

    notifications: notifications,

    render: render,

    bind: bind,

    renderAndBind: renderAndBind

  };

})();
