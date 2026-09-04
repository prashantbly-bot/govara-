/*
 * ============================================================
 * GoVara — STEP 27
 * Consolidated API Boundary
 * VERSION: V6
 * ============================================================
 *
 * PURPOSE
 * ------------------------------------------------------------
 * One consolidated API boundary for the complete GoVara
 * modular frontend.
 *
 * IMPORTANT SAFETY RULES
 * ------------------------------------------------------------
 * Frontend is NOT the authority for:
 * - Financial truth
 * - Real money
 * - Real payment
 * - Bank transfer
 * - Final KYC authority
 * - Database truth
 *
 * Backend + Database remain authoritative.
 *
 * No automatic connection test.
 * No automatic backend request.
 *
 * ============================================================
 */

(function () {

  "use strict";


  /* ==========================================================
     VERSION
     ========================================================== */

  var VERSION =
    "GOVARA-CONSOLIDATED-API-V6";


  /* ==========================================================
     MODULES
     ========================================================== */

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


  /* ==========================================================
     ACTIONS
     ========================================================== */

  var ACTIONS = {

    HEALTH:
      "GET_HEALTH",

    AUTH_LOGIN:
      "AUTH_LOGIN",

    AUTH_REGISTER:
      "AUTH_REGISTER",

    AUTH_LOGOUT:
      "AUTH_LOGOUT",

    CUSTOMER_LIST:
      "CUSTOMER_LIST",

    CUSTOMER_GET:
      "CUSTOMER_GET",

    CUSTOMER_SAVE:
      "CUSTOMER_SAVE",

    CUSTOMER_UPDATE:
      "CUSTOMER_UPDATE",

    VENDOR_LIST:
      "VENDOR_LIST",

    VENDOR_GET:
      "VENDOR_GET",

    VENDOR_SAVE:
      "VENDOR_SAVE",

    VENDOR_UPDATE:
      "VENDOR_UPDATE",

    DRIVER_LIST:
      "DRIVER_LIST",

    DRIVER_GET:
      "DRIVER_GET",

    DRIVER_SAVE:
      "DRIVER_SAVE",

    DRIVER_UPDATE:
      "DRIVER_UPDATE",

    VEHICLE_LIST:
      "VEHICLE_LIST",

    VEHICLE_GET:
      "VEHICLE_GET",

    VEHICLE_SAVE:
      "VEHICLE_SAVE",

    VEHICLE_UPDATE:
      "VEHICLE_UPDATE",

    BOOKING_LIST:
      "BOOKING_LIST",

    BOOKING_GET:
      "BOOKING_GET",

    BOOKING_SAVE:
      "BOOKING_SAVE",

    BOOKING_UPDATE:
      "BOOKING_UPDATE",

    DUTY_LIST:
      "DUTY_LIST",

    DUTY_GET:
      "DUTY_GET",

    DUTY_SAVE:
      "DUTY_SAVE",

    DUTY_UPDATE:
      "DUTY_UPDATE",

    FARE_CALCULATE:
      "FARE_CALCULATE",

    TRANSACTION_LIST:
      "TRANSACTION_LIST",

    TRANSACTION_GET:
      "TRANSACTION_GET",

    TRANSACTION_CREATE:
      "TRANSACTION_CREATE",

    WALLET_GET:
      "WALLET_GET",

    WALLET_UPDATE:
      "WALLET_UPDATE",

    LEDGER_LIST:
      "LEDGER_LIST",

    SETTLEMENT_LIST:
      "SETTLEMENT_LIST",

    SETTLEMENT_GET:
      "SETTLEMENT_GET",

    BILLING_LIST:
      "BILLING_LIST",

    BILLING_GET:
      "BILLING_GET",

    DOCUMENT_LIST:
      "DOCUMENT_LIST",

    DOCUMENT_GET:
      "DOCUMENT_GET",

    DOCUMENT_SAVE:
      "DOCUMENT_SAVE",

    KYC_GET:
      "KYC_GET",

    KYC_SAVE:
      "KYC_SAVE",

    KYC_SUBMIT:
      "KYC_SUBMIT",

    KYC_REVIEW:
      "KYC_REVIEW",

    KYC_APPROVE:
      "KYC_APPROVE",

    KYC_REJECT:
      "KYC_REJECT",

    ADMIN_GET:
      "ADMIN_GET",

    ADMIN_UPDATE:
      "ADMIN_UPDATE",

    AUDIT_LIST:
      "AUDIT_LIST",

    NOTIFICATION_LIST:
      "NOTIFICATION_LIST",

    NOTIFICATION_CREATE:
      "NOTIFICATION_CREATE",

    LOCATION_GET:
      "LOCATION_GET",

    LOCATION_UPDATE:
      "LOCATION_UPDATE",

    TRAVEL_SEARCH:
      "TRAVEL_SEARCH",

    TRAVEL_BOOK:
      "TRAVEL_BOOK",

    WELFARE_LIST:
      "WELFARE_LIST"

  };


  /* ==========================================================
     CONFIGURATION
     ========================================================== */

  var CONFIG = {

    API_URL: "",

    REQUEST_TIMEOUT: 20000,

    ENVIRONMENT: "TESTING",

    PROJECT: "GoVara",

    VERSION: VERSION,

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
     SAFE API URL LOAD
     ========================================================== */

  try {

    if (
      typeof window !== "undefined" &&
      typeof window.GOVARA_API_URL === "string"
    ) {

      CONFIG.API_URL =
        window.GOVARA_API_URL.trim();

    }

  } catch (error) {

    CONFIG.API_URL = "";

  }


  /* ==========================================================
     STORAGE
     ========================================================== */

  var STORAGE_KEY =
    "GOVARA_CONSOLIDATED_API_V6";


  /* ==========================================================
     STATE
     ========================================================== */

  var APIState = {

    configured: false,

    connected: false,

    verified: false,

    loading: false,

    lastAction: "—",

    lastResponse: null,

    lastError: null,

    lastRequestId: null,

    requestCount: 0,

    successCount: 0,

    errorCount: 0,

    lastRequestAt: null,

    lastSuccessAt: null,

    lastErrorAt: null,

    startedAt:
      new Date().toISOString()

  };


  /* ==========================================================
     SECURITY
     ========================================================== */

  var BLOCKED_ACTION_PATTERNS = [

    "REAL_MONEY",

    "REAL_PAYMENT",

    "BANK_TRANSFER",

    "PAYMENT_CAPTURE",

    "CARD_CHARGE",

    "BANK_DEBIT",

    "WITHDRAW_REAL",

    "DEPOSIT_REAL"

  ];


  var SENSITIVE_KEYS = [

    "password",

    "pass",

    "otp",

    "token",

    "accessToken",

    "refreshToken",

    "secret",

    "apiKey",

    "authorization",

    "cardNumber",

    "cvv",

    "pin",

    "bankAccount",

    "accountNumber",

    "ifsc",

    "rawDocument",

    "documentBinary"

  ];


  /* ==========================================================
     SAFETY ENFORCEMENT
     ========================================================== */

  function enforceSafety() {

    CONFIG.ENVIRONMENT =
      "TESTING";

    CONFIG.REAL_MONEY =
      false;

    CONFIG.REAL_PAYMENT =
      false;

    CONFIG.BANK_TRANSFER =
      false;

    CONFIG.FRONTEND_FINANCIAL_AUTHORITY =
      false;

    CONFIG.BACKEND_FINANCIAL_AUTHORITY =
      true;

    CONFIG.FRONTEND_KYC_AUTHORITY =
      false;

    CONFIG.BACKEND_KYC_AUTHORITY =
      true;

    CONFIG.DATABASE_AUTHORITY =
      true;

  }


  enforceSafety();


  /* ==========================================================
     STRING HELPERS
     ========================================================== */

  function safeString(value) {

    if (
      value === null ||
      value === undefined
    ) {

      return "";

    }

    return String(value);

  }


  function upper(value) {

    return safeString(value)
      .trim()
      .toUpperCase();

  }


  /* ==========================================================
     REQUEST ID
     ========================================================== */

  function createRequestId() {

    return (
      "GV-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2, 9)
        .toUpperCase()
    );

  }


  /* ==========================================================
     DATE
     ========================================================== */

  function nowISO() {

    return new Date().toISOString();

  }


  /* ==========================================================
     SENSITIVE DATA SANITIZER
     ========================================================== */

  function sanitize(value) {

    if (
      value === null ||
      value === undefined
    ) {

      return value;

    }


    if (
      typeof value === "string"
    ) {

      return value;

    }


    if (
      Array.isArray(value)
    ) {

      return value.map(
        function (item) {

          return sanitize(item);

        }
      );

    }


    if (
      typeof value === "object"
    ) {

      var output = {};

      Object.keys(value)
        .forEach(
          function (key) {

            var lower =
              key.toLowerCase();

            var blocked =
              SENSITIVE_KEYS.some(
                function (sensitiveKey) {

                  return lower ===
                    sensitiveKey.toLowerCase();

                }
              );


            if (blocked) {

              output[key] =
                "[REDACTED]";

            } else {

              output[key] =
                sanitize(value[key]);

            }

          }
        );

      return output;

    }


    return value;

  }


  /* ==========================================================
     ERROR NORMALIZER
     ========================================================== */

  function normalizeError(
    error,
    action
  ) {

    var message =
      "Unknown API error.";

    if (
      error &&
      error.message
    ) {

      message =
        error.message;

    } else if (
      typeof error === "string"
    ) {

      message =
        error;

    }


    return {

      success: false,

      project:
        CONFIG.PROJECT,

      version:
        VERSION,

      action:
        action || "UNKNOWN",

      status:
        "ERROR",

      message:
        message,

      timestamp:
        nowISO()

    };

  }


  /* ==========================================================
     RESPONSE NORMALIZER
     ========================================================== */

  function normalizeResponse(
    data,
    action,
    requestId
  ) {

    var response =
      data;


    if (
      typeof response === "string"
    ) {

      try {

        response =
          JSON.parse(response);

      } catch (ignore) {

        response = {

          success: true,

          status: "RAW_RESPONSE",

          data: data

        };

      }

    }


    if (
      !response ||
      typeof response !== "object"
    ) {

      response = {

        success: true,

        status: "SUCCESS",

        data: response

      };

    }


    if (
      response.success === undefined
    ) {

      response.success =
        true;

    }


    response.project =
      response.project ||
      CONFIG.PROJECT;

    response.version =
      response.version ||
      VERSION;

    response.action =
      response.action ||
      action;

    response.requestId =
      response.requestId ||
      requestId;

    response.timestamp =
      response.timestamp ||
      nowISO();


    return response;

  }


  /* ==========================================================
     CONFIGURATION
     ========================================================== */

  function isConfigured() {

    return (
      typeof CONFIG.API_URL === "string" &&
      CONFIG.API_URL.trim().length > 0
    );

  }


  function validateURL(url) {

    if (
      typeof url !== "string" ||
      !url.trim()
    ) {

      return {

        valid: false,

        message:
          "API URL is empty."

      };

    }


    var value =
      url.trim();


    try {

      var parsed =
        new URL(value);

      if (
        parsed.protocol !== "https:"
      ) {

        return {

          valid: false,

          message:
            "API URL must use HTTPS."

        };

      }


      return {

        valid: true,

        url: value

      };

    } catch (error) {

      return {

        valid: false,

        message:
          "Invalid API URL."

      };

    }

  }


  function saveEndpoint(url) {

    var validation =
      validateURL(url);


    if (!validation.valid) {

      return {

        success: false,

        status:
          "INVALID_API_URL",

        message:
          validation.message

      };

    }


    CONFIG.API_URL =
      validation.url;


    APIState.configured =
      true;

    APIState.connected =
      false;

    APIState.verified =
      false;


    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          apiUrl:
            CONFIG.API_URL
        })
      );

    } catch (error) {

      console.warn(
        "GoVara API localStorage save failed.",
        error
      );

    }


    return {

      success: true,

      status:
        "API_ENDPOINT_SAVED",

      apiUrl:
        CONFIG.API_URL

    };

  }


  function loadEndpoint() {

    try {

      var saved =
        localStorage.getItem(
          STORAGE_KEY
        );


      if (saved) {

        var parsed =
          JSON.parse(saved);


        if (
          parsed &&
          typeof parsed.apiUrl ===
          "string"
        ) {

          CONFIG.API_URL =
            parsed.apiUrl.trim();

        }

      }

    } catch (error) {

      console.warn(
        "GoVara API endpoint load failed.",
        error
      );

    }


    APIState.configured =
      isConfigured();


    return CONFIG.API_URL;

  }


  function resetEndpoint() {

    CONFIG.API_URL = "";

    APIState.configured =
      false;

    APIState.connected =
      false;

    APIState.verified =
      false;

    APIState.lastResponse =
      null;

    APIState.lastError =
      null;

    APIState.lastAction =
      "RESET_ENDPOINT";


    try {

      localStorage.removeItem(
        STORAGE_KEY
      );

    } catch (error) {

      console.warn(
        "GoVara API reset storage failed.",
        error
      );

    }


    return {

      success: true,

      status:
        "API_ENDPOINT_RESET"

    };

  }


  loadEndpoint();


  /* ==========================================================
     ACTION SAFETY
     ========================================================== */

  function isBlockedAction(action) {

    var name =
      upper(action);


    return BLOCKED_ACTION_PATTERNS.some(
      function (pattern) {

        return name.indexOf(
          pattern
        ) !== -1;

      }
    );

  }


  /* ==========================================================
     CENTRAL REQUEST ENGINE
     ========================================================== */

  async function request(
    action,
    payload
  ) {

    enforceSafety();


    var requestId =
      createRequestId();


    APIState.lastRequestId =
      requestId;

    APIState.lastAction =
      action || "UNKNOWN";

    APIState.lastRequestAt =
      nowISO();


    /*
     * No endpoint = NO NETWORK REQUEST.
     */

    if (!isConfigured()) {

      var notConfigured = {

        success: false,

        project:
          CONFIG.PROJECT,

        version:
          VERSION,

        action:
          action || "UNKNOWN",

        status:
          "API_NOT_CONFIGURED",

        message:
          "API endpoint is not configured. No backend request was made.",

        requestId:
          requestId,

        timestamp:
          nowISO()

      };


      APIState.lastResponse =
        notConfigured;

      APIState.lastError =
        notConfigured;

      return notConfigured;

    }


    /*
     * Hard financial safety block.
     */

    if (
      isBlockedAction(action)
    ) {

      var blocked = {

        success: false,

        project:
          CONFIG.PROJECT,

        version:
          VERSION,

        action:
          action,

        status:
          "BLOCKED",

        message:
          "This financial action is blocked in frontend testing mode.",

        requestId:
          requestId,

        timestamp:
          nowISO()

      };


      APIState.lastResponse =
        blocked;

      APIState.lastError =
        blocked;

      APIState.errorCount += 1;

      APIState.lastErrorAt =
        nowISO();


      return blocked;

    }


    APIState.loading =
      true;

    APIState.requestCount += 1;


    var controller =
      null;

    var timeoutId =
      null;


    try {

      if (
        typeof AbortController !==
        "undefined"
      ) {

        controller =
          new AbortController();


        timeoutId =
          setTimeout(
            function () {

              try {

                controller.abort();

              } catch (ignore) {}

            },
            CONFIG.REQUEST_TIMEOUT
          );

      }


      var requestBody = {

        project:
          CONFIG.PROJECT,

        version:
          VERSION,

        environment:
          CONFIG.ENVIRONMENT,

        action:
          action,

        requestId:
          requestId,

        timestamp:
          nowISO(),

        payload:
          sanitize(
            payload || {}
          )

      };


      var fetchOptions = {

        method:
          "POST",

        headers: {

          "Content-Type":
            "text/plain;charset=utf-8"

        },

        body:
          JSON.stringify(
            requestBody
          )

      };


      if (controller) {

        fetchOptions.signal =
          controller.signal;

      }


      var response =
        await fetch(
          CONFIG.API_URL,
          fetchOptions
        );


      var text =
        await response.text();


      var parsed;


      try {

        parsed =
          JSON.parse(text);

      } catch (parseError) {

        parsed = {

          success:
            response.ok,

          status:
            response.ok
              ? "SUCCESS"
              : "HTTP_ERROR",

          raw:
            text

        };

      }


      var normalized =
        normalizeResponse(
          parsed,
          action,
          requestId
        );


      if (!response.ok) {

        normalized.success =
          false;

        normalized.status =
          normalized.status ||
          "HTTP_ERROR";

      }


      APIState.lastResponse =
        normalized;


      if (
        normalized.success === true &&
        response.ok
      ) {

        APIState.connected =
          true;

        APIState.successCount += 1;

        APIState.lastSuccessAt =
          nowISO();

        APIState.lastError =
          null;

      } else {

        APIState.errorCount += 1;

        APIState.lastError =
          normalized;

        APIState.lastErrorAt =
          nowISO();

      }


      return normalized;

    } catch (error) {

      var normalizedError =
        normalizeError(
          error,
          action
        );


      normalizedError.requestId =
        requestId;


      APIState.lastResponse =
        normalizedError;

      APIState.lastError =
        normalizedError;

      APIState.errorCount += 1;

      APIState.lastErrorAt =
        nowISO();


      return normalizedError;

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
     HEALTH / CONNECTION
     ========================================================== */

  async function testConnection() {

    enforceSafety();


    if (!isConfigured()) {

      var result = {

        success: false,

        status:
          "API_NOT_CONFIGURED",

        message:
          "Configure the API endpoint before testing the connection."

      };


      APIState.connected =
        false;

      APIState.verified =
        false;

      APIState.lastAction =
        ACTIONS.HEALTH;

      APIState.lastResponse =
        result;

      APIState.lastError =
        result;


      return result;

    }


    var response =
      await request(
        ACTIONS.HEALTH,
        {

          source:
            "GoVara STEP 27",

          mode:
            "MANUAL_HEALTH_CHECK"

        }
      );


    if (
      response &&
      response.success === true &&
      response.project ===
        CONFIG.PROJECT
    ) {

      APIState.connected =
        true;

      APIState.verified =
        true;


      return {

        success: true,

        status:
          "API_VERIFIED",

        message:
          "GoVara Consolidated API verified successfully.",

        project:
          CONFIG.PROJECT,

        version:
          VERSION,

        response:
          response

      };

    }


    APIState.connected =
      false;

    APIState.verified =
      false;


    return {

      success: false,

      status:
        "API_VERIFICATION_FAILED",

      message:
        "API responded but GoVara project verification failed.",

      response:
        response

    };

  }


  /* ==========================================================
     GENERIC CRUD
     ========================================================== */

  async function list(
    moduleName,
    filters
  ) {

    return request(
      upper(moduleName) +
      "_LIST",
      filters || {}
    );

  }


  async function get(
    moduleName,
    id
  ) {

    return request(
      upper(moduleName) +
      "_GET",
      {
        id: id
      }
    );

  }


  async function save(
    moduleName,
    data
  ) {

    return request(
      upper(moduleName) +
      "_SAVE",
      data || {}
    );

  }


  async function update(
    moduleName,
    data
  ) {

    return request(
      upper(moduleName) +
      "_UPDATE",
      data || {}
    );

  }


  /* ==========================================================
     AUTH
     ========================================================== */

  function authLogin(data) {

    return request(
      ACTIONS.AUTH_LOGIN,
      data || {}
    );

  }


  function authRegister(data) {

    return request(
      ACTIONS.AUTH_REGISTER,
      data || {}
    );

  }


  function authLogout(data) {

    return request(
      ACTIONS.AUTH_LOGOUT,
      data || {}
    );

  }


  /* ==========================================================
     FARE
     ========================================================== */

  function fareCalculate(data) {

    return request(
      ACTIONS.FARE_CALCULATE,
      data || {}
    );

  }


  /* ==========================================================
     TRANSACTION
     ========================================================== */

  function transactionCreate(data) {

    return request(
      ACTIONS.TRANSACTION_CREATE,
      data || {}
    );

  }


  function transactionList(filters) {

    return request(
      ACTIONS.TRANSACTION_LIST,
      filters || {}
    );

  }


  function transactionGet(id) {

    return request(
      ACTIONS.TRANSACTION_GET,
      {
        id: id
      }
    );

  }


  /* ==========================================================
     WALLET
     ========================================================== */

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


  /* ==========================================================
     ADMIN
     ========================================================== */

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


  /* ==========================================================
     AUDIT
     ========================================================== */

  function auditList(filters) {

    return request(
      ACTIONS.AUDIT_LIST,
      filters || {}
    );

  }


  /* ==========================================================
     DOCUMENTS
     ========================================================== */

  function documentsList(filters) {

    return request(
      ACTIONS.DOCUMENT_LIST,
      filters || {}
    );

  }


  function documentGet(id) {

    return request(
      ACTIONS.DOCUMENT_GET,
      {
        id: id
      }
    );

  }


  function documentSave(data) {

    return request(
      ACTIONS.DOCUMENT_SAVE,
      data || {}
    );

  }


  /* ==========================================================
     KYC
     ========================================================== */

  function kycGet(data) {

    return request(
      ACTIONS.KYC_GET,
      data || {}
    );

  }


  function kycSave(data) {

    return request(
      ACTIONS.KYC_SAVE,
      data || {}
    );

  }


  function kycSubmit(data) {

    return request(
      ACTIONS.KYC_SUBMIT,
      data || {}
    );

  }


  function kycReview(data) {

    return request(
      ACTIONS.KYC_REVIEW,
      data || {}
    );

  }


  function kycApprove(data) {

    /*
     * Frontend cannot become KYC authority.
     * Request is allowed only as a backend workflow
     * instruction; backend remains final authority.
     */

    return request(
      ACTIONS.KYC_APPROVE,
      data || {}
    );

  }


  function kycReject(data) {

    return request(
      ACTIONS.KYC_REJECT,
      data || {}
    );

  }


  /* ==========================================================
     NOTIFICATION
     ========================================================== */

  function notificationList(filters) {

    return request(
      ACTIONS.NOTIFICATION_LIST,
      filters || {}
    );

  }


  function notificationCreate(data) {

    return request(
      ACTIONS.NOTIFICATION_CREATE,
      data || {}
    );

  }


  /* ==========================================================
     LOCATION
     ========================================================== */

  function locationGet(data) {

    return request(
      ACTIONS.LOCATION_GET,
      data || {}
    );

  }


  function locationUpdate(data) {

    return request(
      ACTIONS.LOCATION_UPDATE,
      data || {}
    );

  }


  /* ==========================================================
     TRAVEL
     ========================================================== */

  function travelSearch(data) {

    return request(
      ACTIONS.TRAVEL_SEARCH,
      data || {}
    );

  }


  function travelBook(data) {

    return request(
      ACTIONS.TRAVEL_BOOK,
      data || {}
    );

  }


  /* ==========================================================
     WELFARE
     ========================================================== */

  function welfareList(filters) {

    return request(
      ACTIONS.WELFARE_LIST,
      filters || {}
    );

  }


  /* ==========================================================
     MODULE REGISTRY
     ========================================================== */

  var ModuleRegistry = {

    Customer: {

      list:
        function (filters) {
          return list(
            "Customer",
            filters
          );
        },

      get:
        function (id) {
          return get(
            "Customer",
            id
          );
        },

      save:
        function (data) {
          return save(
            "Customer",
            data
          );
        },

      update:
        function (data) {
          return update(
            "Customer",
            data
          );
        }

    },

    Vendor: {

      list:
        function (filters) {
          return list(
            "Vendor",
            filters
          );
        },

      get:
        function (id) {
          return get(
            "Vendor",
            id
          );
        },

      save:
        function (data) {
          return save(
            "Vendor",
            data
          );
        },

      update:
        function (data) {
          return update(
            "Vendor",
            data
          );
        }

    },

    Driver: {

      list:
        function (filters) {
          return list(
            "Driver",
            filters
          );
        },

      get:
        function (id) {
          return get(
            "Driver",
            id
          );
        },

      save:
        function (data) {
          return save(
            "Driver",
            data
          );
        },

      update:
        function (data) {
          return update(
            "Driver",
            data
          );
        }

    },

    Vehicle: {

      list:
        function (filters) {
          return list(
            "Vehicle",
            filters
          );
        },

      get:
        function (id) {
          return get(
            "Vehicle",
            id
          );
        },

      save:
        function (data) {
          return save(
            "Vehicle",
            data
          );
        },

      update:
        function (data) {
          return update(
            "Vehicle",
            data
          );
        }

    },

    Booking: {

      list:
        function (filters) {
          return list(
            "Booking",
            filters
          );
        },

      get:
        function (id) {
          return get(
            "Booking",
            id
          );
        },

      save:
        function (data) {
          return save(
            "Booking",
            data
          );
        },

      update:
        function (data) {
          return update(
            "Booking",
            data
          );
        }

    },

    Duty: {

      list:
        function (filters) {
          return list(
            "Duty",
            filters
          );
        },

      get:
        function (id) {
          return get(
            "Duty",
            id
          );
        },

      save:
        function (data) {
          return save(
            "Duty",
            data
          );
        },

      update:
        function (data) {
          return update(
            "Duty",
            data
          );
        }

    },

    Fare: {

      calculate:
        fareCalculate

    },

    Transaction: {

      list:
        transactionList,

      get:
        transactionGet,

      create:
        transactionCreate

    },

    Wallet: {

      get:
        walletGet,

      update:
        walletUpdate

    },

    Ledger: {

      list:
        function (filters) {
          return list(
            "Ledger",
            filters
          );
        }

    },

    Settlement: {

      list:
        function (filters) {
          return list(
            "Settlement",
            filters
          );
        },

      get:
        function (id) {
          return get(
            "Settlement",
            id
          );
        }

    },

    Billing: {

      list:
        function (filters) {
          return list(
            "Billing",
            filters
          );
        },

      get:
        function (id) {
          return get(
            "Billing",
            id
          );
        }

    },

    Documents: {

      list:
        documentsList,

      get:
        documentGet,

      save:
        documentSave

    },

    KYC: {

      get:
        kycGet,

      save:
        kycSave,

      submit:
        kycSubmit,

      review:
        kycReview,

      approve:
        kycApprove,

      reject:
        kycReject

    },

    Admin: {

      get:
        adminGet,

      update:
        adminUpdate

    },

    Audit: {

      list:
        auditList

    },

    Auth: {

      login:
        authLogin,

      register:
        authRegister,

      logout:
        authLogout

    },

    Notification: {

      list:
        notificationList,

      create:
        notificationCreate

    },

    Location: {

      get:
        locationGet,

      update:
        locationUpdate

    },

    Travel: {

      search:
        travelSearch,

      book:
        travelBook

    },

    Welfare: {

      list:
        welfareList

    }

  };


  /* ==========================================================
     DIAGNOSTICS
     ========================================================== */

  function getDiagnostics() {

    return {

      version:
        VERSION,

      configured:
        isConfigured(),

      connected:
        APIState.connected,

      verified:
        APIState.verified,

      loading:
        APIState.loading,

      environment:
        CONFIG.ENVIRONMENT,

      requests:
        APIState.requestCount,

      success:
        APIState.successCount,

      errors:
        APIState.errorCount,

      lastAction:
        APIState.lastAction,

      lastRequestId:
        APIState.lastRequestId,

      lastRequestAt:
        APIState.lastRequestAt,

      lastSuccessAt:
        APIState.lastSuccessAt,

      lastErrorAt:
        APIState.lastErrorAt,

      lastResponse:
        sanitize(
          APIState.lastResponse
        ),

      lastError:
        sanitize(
          APIState.lastError
        )

    };

  }


  /* ==========================================================
     STATE RESET
     ========================================================== */

  function resetConnectionState() {

    APIState.connected =
      false;

    APIState.verified =
      false;

    APIState.loading =
      false;

    APIState.lastResponse =
      null;

    APIState.lastError =
      null;

    APIState.lastAction =
      "RESET_CONNECTION_STATE";


    return getDiagnostics();

  }


  /* ==========================================================
     UI RENDER
     ========================================================== */

  function render() {

    var configured =
      isConfigured();


    var connectionText =
      APIState.connected
        ? "CONNECTED"
        : "NOT CONNECTED";


    var verificationText =
      APIState.verified
        ? "VERIFIED"
        : "NOT VERIFIED";


    var endpointValue =
      safeString(
        CONFIG.API_URL
      );


    var modulesHTML =
      MODULES.map(
        function (moduleName) {

          return `
            <span
              style="
                display:inline-flex;
                align-items:center;
                padding:7px 10px;
                margin:3px;
                border:1px solid #3b4a61;
                border-radius:8px;
                background:#1d2a3d;
                color:#e2e8f0;
                font-size:12px;
                font-weight:700;
              "
            >
              ${moduleName}
            </span>
          `;

        }
      ).join("");


    return `

      <div
        class="govara27-wrapper"
        style="
          width:100%;
          color:#f8fafc;
        "
      >

        <div
          style="
            margin-bottom:20px;
          "
        >

          <div
            style="
              color:#93c5fd;
              font-size:11px;
              font-weight:900;
              letter-spacing:1px;
              text-transform:uppercase;
            "
          >
            STEP 27
          </div>

          <h1
            style="
              margin:6px 0 0;
              font-size:30px;
              line-height:1.2;
            "
          >
            Consolidated API Boundary
          </h1>

          <p
            style="
              margin:8px 0 0;
              color:#b8c4d6;
              font-size:14px;
              line-height:1.6;
            "
          >
            Single API boundary for the GoVara
            modular frontend.
          </p>

        </div>


        <div
          style="
            display:grid;
            grid-template-columns:
              repeat(
                4,
                minmax(0,1fr)
              );
            gap:12px;
            margin-bottom:18px;
          "
        >

          <div
            style="
              padding:16px;
              border:1px solid #3b4a61;
              border-radius:12px;
              background:#172033;
            "
          >

            <div
              style="
                color:#aebbd0;
                font-size:11px;
                font-weight:800;
                text-transform:uppercase;
              "
            >
              API
            </div>

            <strong
              style="
                display:block;
                margin-top:8px;
                color:${configured
                  ? "#86efac"
                  : "#fde68a"};
                font-size:18px;
              "
            >
              ${configured
                ? "CONFIGURED"
                : "NOT CONFIGURED"}
            </strong>

          </div>


          <div
            style="
              padding:16px;
              border:1px solid #3b4a61;
              border-radius:12px;
              background:#172033;
            "
          >

            <div
              style="
                color:#aebbd0;
                font-size:11px;
                font-weight:800;
                text-transform:uppercase;
              "
            >
              Connection
            </div>

            <strong
              style="
                display:block;
                margin-top:8px;
                color:#e2e8f0;
                font-size:18px;
              "
            >
              ${connectionText}
            </strong>

          </div>


          <div
            style="
              padding:16px;
              border:1px solid #3b4a61;
              border-radius:12px;
              background:#172033;
            "
          >

            <div
              style="
                color:#aebbd0;
                font-size:11px;
                font-weight:800;
                text-transform:uppercase;
              "
            >
              Verification
            </div>

            <strong
              style="
                display:block;
                margin-top:8px;
                color:#e2e8f0;
                font-size:18px;
              "
            >
              ${verificationText}
            </strong>

          </div>


          <div
            style="
              padding:16px;
              border:1px solid #3b4a61;
              border-radius:12px;
              background:#172033;
            "
          >

            <div
              style="
                color:#aebbd0;
                font-size:11px;
                font-weight:800;
                text-transform:uppercase;
              "
            >
              Environment
            </div>

            <strong
              style="
                display:block;
                margin-top:8px;
                color:#a5f3fc;
                font-size:18px;
              "
            >
              TESTING
            </strong>

          </div>

        </div>


        <div
          style="
            padding:20px;
            margin-bottom:16px;
            border:1px solid #3b4a61;
            border-radius:14px;
            background:#172033;
          "
        >

          <h2
            style="
              margin:0 0 14px;
              font-size:18px;
            "
          >
            API Configuration
          </h2>


          <label
            style="
              display:block;
              margin-bottom:7px;
              color:#cbd5e1;
              font-size:12px;
              font-weight:800;
            "
          >
            API Endpoint
          </label>


          <input
            id="govara27-api-url"
            type="url"
            value="${endpointValue
              .replace(/"/g, "&quot;")}"
            placeholder="Apps Script Web App URL"
            autocomplete="off"
            style="
              width:100%;
              min-height:44px;
              padding:10px 12px;
              border:1px solid #45566f;
              border-radius:9px;
              background:#111b2b;
              color:#f8fafc;
              outline:none;
            "
          />


          <div
            style="
              display:flex;
              gap:9px;
              flex-wrap:wrap;
              margin-top:12px;
            "
          >

            <button
              type="button"
              id="govara27-save-endpoint"
              style="
                padding:10px 14px;
                border:1px solid #3973b8;
                border-radius:9px;
                background:#1d4f91;
                color:#ffffff;
                font-weight:800;
              "
            >
              Save Endpoint
            </button>


            <button
              type="button"
              id="govara27-test-connection"
              style="
                padding:10px 14px;
                border:1px solid #3b6f5b;
                border-radius:9px;
                background:#153321;
                color:#bbf7d0;
                font-weight:800;
              "
            >
              Test Connection
            </button>


            <button
              type="button"
              id="govara27-reset-endpoint"
              style="
                padding:10px 14px;
                border:1px solid #68313d;
                border-radius:9px;
                background:#351923;
                color:#fecdd3;
                font-weight:800;
              "
            >
              Reset Endpoint
            </button>

          </div>


          <div
            id="govara27-message"
            style="
              margin-top:12px;
              color:#b8c4d6;
              font-size:12px;
              line-height:1.5;
            "
          >
            Connection testing is manual.
            No automatic backend request is made.
          </div>

        </div>


        <div
          style="
            display:grid;
            grid-template-columns:
              repeat(
                2,
                minmax(0,1fr)
              );
            gap:16px;
          "
        >


          <div
            style="
              padding:20px;
              border:1px solid #68313d;
              border-radius:14px;
              background:#172033;
            "
          >

            <h2
              style="
                margin:0 0 15px;
                font-size:18px;
              "
            >
              Financial Safety
            </h2>


            <div
              style="
                display:grid;
                gap:9px;
              "
            >

              <div>
                Real Money:
                <strong
                  style="color:#fda4af;"
                >
                  BLOCKED
                </strong>
              </div>

              <div>
                Real Payment:
                <strong
                  style="color:#fda4af;"
                >
                  BLOCKED
                </strong>
              </div>

              <div>
                Bank Transfer:
                <strong
                  style="color:#fda4af;"
                >
                  BLOCKED
                </strong>
              </div>

              <div>
                Frontend Financial Authority:
                <strong
                  style="color:#fda4af;"
                >
                  DISABLED
                </strong>
              </div>

              <div>
                Backend Financial Authority:
                <strong
                  style="color:#86efac;"
                >
                  AUTHORITATIVE
                </strong>
              </div>

            </div>

          </div>


          <div
            style="
              padding:20px;
              border:1px solid #2c6070;
              border-radius:14px;
              background:#172033;
            "
          >

            <h2
              style="
                margin:0 0 15px;
                font-size:18px;
              "
            >
              KYC & Database Authority
            </h2>


            <div
              style="
                display:grid;
                gap:9px;
              "
            >

              <div>
                Frontend KYC Authority:
                <strong
                  style="color:#fda4af;"
                >
                  DISABLED
                </strong>
              </div>

              <div>
                Backend KYC Authority:
                <strong
                  style="color:#86efac;"
                >
                  AUTHORITATIVE
                </strong>
              </div>

              <div>
                Database Authority:
                <strong
                  style="color:#86efac;"
                >
                  AUTHORITATIVE
                </strong>
              </div>

            </div>

          </div>


        </div>


        <div
          style="
            margin-top:16px;
            padding:20px;
            border:1px solid #3b4a61;
            border-radius:14px;
            background:#172033;
          "
        >

          <h2
            style="
              margin:0 0 12px;
              font-size:18px;
            "
          >
            Consolidated Modules
          </h2>


          <div>
            ${modulesHTML}
          </div>

        </div>


        <div
          style="
            margin-top:16px;
            padding:20px;
            border:1px solid #3b4a61;
            border-radius:14px;
            background:#172033;
          "
        >

          <h2
            style="
              margin:0 0 15px;
              font-size:18px;
            "
          >
            Diagnostics
          </h2>


          <div
            style="
              display:grid;
              grid-template-columns:
                repeat(
                  4,
                  minmax(0,1fr)
                );
              gap:10px;
            "
          >

            <div
              style="
                padding:12px;
                border:1px solid #34445b;
                border-radius:9px;
                background:#1d2a3d;
              "
            >
              <div
                style="
                  color:#9eacc0;
                  font-size:10px;
                  font-weight:800;
                "
              >
                REQUESTS
              </div>

              <strong
                id="govara27-requests"
                style="
                  display:block;
                  margin-top:5px;
                  font-size:20px;
                "
              >
                ${APIState.requestCount}
              </strong>
            </div>


            <div
              style="
                padding:12px;
                border:1px solid #34445b;
                border-radius:9px;
                background:#1d2a3d;
              "
            >
              <div
                style="
                  color:#9eacc0;
                  font-size:10px;
                  font-weight:800;
                "
              >
                SUCCESS
              </div>

              <strong
                id="govara27-success"
                style="
                  display:block;
                  margin-top:5px;
                  color:#86efac;
                  font-size:20px;
                "
              >
                ${APIState.successCount}
              </strong>
            </div>


            <div
              style="
                padding:12px;
                border:1px solid #34445b;
                border-radius:9px;
                background:#1d2a3d;
              "
            >
              <div
                style="
                  color:#9eacc0;
                  font-size:10px;
                  font-weight:800;
                "
              >
                ERRORS
              </div>

              <strong
                id="govara27-errors"
                style="
                  display:block;
                  margin-top:5px;
                  color:#fda4af;
                  font-size:20px;
                "
              >
                ${APIState.errorCount}
              </strong>
            </div>


            <div
              style="
                padding:12px;
                border:1px solid #34445b;
                border-radius:9px;
                background:#1d2a3d;
              "
            >
              <div
                style="
                  color:#9eacc0;
                  font-size:10px;
                  font-weight:800;
                "
              >
                LAST ACTION
              </div>

              <strong
                id="govara27-last-action"
                style="
                  display:block;
                  margin-top:5px;
                  font-size:12px;
                  word-break:break-word;
                "
              >
                ${safeString(
                  APIState.lastAction
                )}
              </strong>
            </div>

          </div>


          <pre
            id="govara27-diagnostics"
            style="
              margin-top:14px;
              padding:14px;
              max-height:260px;
              overflow:auto;
              border:1px solid #34445b;
              border-radius:9px;
              background:#0f172a;
              color:#cbd5e1;
              font-size:11px;
              line-height:1.5;
              white-space:pre-wrap;
              word-break:break-word;
            "
          >${safeString(
            JSON.stringify(
              getDiagnostics(),
              null,
              2
            )
          )}</pre>

        </div>


      </div>

    `;

  }


  /* ==========================================================
     UI BIND
     ========================================================== */

  function bind() {

    var urlInput =
      document.getElementById(
        "govara27-api-url"
      );


    var saveButton =
      document.getElementById(
        "govara27-save-endpoint"
      );


    var testButton =
      document.getElementById(
        "govara27-test-connection"
      );


    var resetButton =
      document.getElementById(
        "govara27-reset-endpoint"
      );


    var message =
      document.getElementById(
        "govara27-message"
      );


    function refreshDiagnostics() {

      var diagnostics =
        getDiagnostics();


      var requests =
        document.getElementById(
          "govara27-requests"
        );

      var success =
        document.getElementById(
          "govara27-success"
        );

      var errors =
        document.getElementById(
          "govara27-errors"
        );

      var lastAction =
        document.getElementById(
          "govara27-last-action"
        );

      var output =
        document.getElementById(
          "govara27-diagnostics"
        );


      if (requests) {

        requests.textContent =
          diagnostics.requests;

      }


      if (success) {

        success.textContent =
          diagnostics.success;

      }


      if (errors) {

        errors.textContent =
          diagnostics.errors;

      }


      if (lastAction) {

        lastAction.textContent =
          diagnostics.lastAction;

      }


      if (output) {

        output.textContent =
          JSON.stringify(
            diagnostics,
            null,
            2
          );

      }

    }


    if (saveButton) {

      saveButton.addEventListener(
        "click",
        function () {

          var value =
            urlInput
              ? urlInput.value.trim()
              : "";


          var result =
            saveEndpoint(value);


          if (message) {

            message.textContent =
              result.success
                ? "API endpoint saved successfully."
                : result.message;

            message.style.color =
              result.success
                ? "#86efac"
                : "#fda4af";

          }


          refreshDiagnostics();

        }
      );

    }


    if (testButton) {

      testButton.addEventListener(
        "click",
        async function () {

          if (message) {

            message.textContent =
              "Testing API connection...";

            message.style.color =
              "#a5f3fc";

          }


          var result =
            await testConnection();


          if (message) {

            message.textContent =
              result.message ||
              result.status ||
              "Connection test completed.";

            message.style.color =
              result.success
                ? "#86efac"
                : "#fda4af";

          }


          refreshDiagnostics();

        }
      );

    }


    if (resetButton) {

      resetButton.addEventListener(
        "click",
        function () {

          var result =
            resetEndpoint();


          if (urlInput) {

            urlInput.value =
              "";

          }


          if (message) {

            message.textContent =
              "API endpoint reset. No backend request was made.";

            message.style.color =
              "#fde68a";

          }


          refreshDiagnostics();

        }
      );

    }


    refreshDiagnostics();

  }


  /* ==========================================================
     RENDER + BIND
     ========================================================== */

  function renderAndBind() {

    var mount =
      document.getElementById(
        "module-27"
      );


    if (!mount) {

      console.error(
        "GoVara STEP 27 mount not found."
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

  var GoVaraAPI = {

    VERSION:
      VERSION,

    MODULES:
      MODULES,

    ACTIONS:
      ACTIONS,

    CONFIG:
      CONFIG,

    APIState:
      APIState,

    ModuleRegistry:
      ModuleRegistry,

    modules:
      ModuleRegistry,

    render:
      render,

    bind:
      bind,

    renderAndBind:
      renderAndBind,

    request:
      request,

    testConnection:
      testConnection,

    getAPIUrl:
      function () {

        return CONFIG.API_URL;

      },

    setAPIUrl:
      saveEndpoint,

    saveEndpoint:
      saveEndpoint,

    loadEndpoint:
      loadEndpoint,

    resetEndpoint:
      resetEndpoint,

    isConfigured:
      isConfigured,

    validateURL:
      validateURL,

    getDiagnostics:
      getDiagnostics,

    resetConnectionState:
      resetConnectionState,

    enforceSafety:
      enforceSafety,

    sanitize:
      sanitize,

    list:
      list,

    get:
      get,

    save:
      save,

    update:
      update,

    auth:
      {

        login:
          authLogin,

        register:
          authRegister,

        logout:
          authLogout

      },

    authLogin:
      authLogin,

    authRegister:
      authRegister,

    authLogout:
      authLogout,

    fareCalculate:
      fareCalculate,

    transactionCreate:
      transactionCreate,

    transactionList:
      transactionList,

    transactionGet:
      transactionGet,

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

    documentsList:
      documentsList,

    documentGet:
      documentGet,

    documentSave:
      documentSave,

    kycGet:
      kycGet,

    kycSave:
      kycSave,

    kycSubmit:
      kycSubmit,

    kycReview:
      kycReview,

    kycApprove:
      kycApprove,

    kycReject:
      kycReject,

    notificationList:
      notificationList,

    notificationCreate:
      notificationCreate,

    locationGet:
      locationGet,

    locationUpdate:
      locationUpdate,

    travelSearch:
      travelSearch,

    travelBook:
      travelBook,

    welfareList:
      welfareList

  };


  /* ==========================================================
     GLOBAL EXPOSURE
     ========================================================== */

  window.GoVaraAPI =
    GoVaraAPI;


  /*
   * MASTER INDEX.HTML EXPECTS THIS.
   */

  window.GoVara27 =
    GoVaraAPI;


  /* ==========================================================
     MODULE REGISTRIES
     ========================================================== */

  if (
    !window.GoVaraModules
  ) {

    window.GoVaraModules =
      {};

  }


  window.GoVaraModules["27"] =
    GoVaraAPI;

  window.GoVaraModules["27-api"] =
    GoVaraAPI;

  window.GoVaraModules["STEP 27"] =
    GoVaraAPI;

  window.GoVaraModules[
    "Consolidated API"
  ] =
    GoVaraAPI;


  if (
    !window.GoVaraModuleRegistry
  ) {

    window.GoVaraModuleRegistry =
      {};

  }


  window.GoVaraModuleRegistry["27"] =
    GoVaraAPI;

  window.GoVaraModuleRegistry["27-api"] =
    GoVaraAPI;

  window.GoVaraModuleRegistry["STEP 27"] =
    GoVaraAPI;


  /* ==========================================================
     FINAL SAFETY ENFORCEMENT
     ========================================================== */

  enforceSafety();


  /* ==========================================================
     LOAD MESSAGE
     ========================================================== */

  console.log(
    "GoVara Consolidated API V6 loaded successfully."
  );

  console.log(
    "API status:",
    isConfigured()
      ? "CONFIGURED"
      : "NOT CONFIGURED"
  );

  console.log(
    "Testing mode:",
    CONFIG.ENVIRONMENT
  );

  console.log(
    "Real Money:",
    CONFIG.REAL_MONEY
      ? "ENABLED"
      : "BLOCKED"
  );

  console.log(
    "Real Payment:",
    CONFIG.REAL_PAYMENT
      ? "ENABLED"
      : "BLOCKED"
  );

  console.log(
    "Bank Transfer:",
    CONFIG.BANK_TRANSFER
      ? "ENABLED"
      : "BLOCKED"
  );


})();
