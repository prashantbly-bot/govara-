/* ============================================================
   GoVara STEP 27
   Consolidated API Boundary
   MASTER FRONTEND API
   Version: V6.2
   Environment: TESTING

   Architecture:
   Frontend
      ↓
   ONE Consolidated API Boundary
      ↓
   Google Apps Script Backend
      ↓
   Existing GoVara Database

   IMPORTANT:
   - Frontend is NOT database authority
   - Frontend is NOT financial authority
   - Frontend is NOT KYC authority
   - Backend remains authoritative
   - No direct database access
   - Real Money BLOCKED
   - Real Payment BLOCKED
   - Bank Transfer BLOCKED
============================================================ */

(function (window) {
  "use strict";

  /* ==========================================================
     CONFIGURATION
  ========================================================== */

  var CONFIG = {
    API_URL: "",
    REQUEST_TIMEOUT: 20000,

    VERSION: "GOVARA-CONSOLIDATED-API-V6.2",
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
     API STATE
  ========================================================== */

  var APIState = {
    configured: false,
    connected: false,
    verified: false,

    lastResponse: null,
    lastError: null,
    lastAction: null,
    lastRequestId: null,
    lastTimestamp: null
  };


  /* ==========================================================
     MODULE REGISTRY
  ========================================================== */

  var MODULES = {

    SYSTEM: "System",

    ORGANIZATION: "Organization",
    DEPARTMENT: "Department",
    GROUP: "Group",

    USER: "User",
    ROLE: "Role",
    PERMISSION: "Permission",

    CUSTOMER: "Customer",
    VENDOR: "Vendor",
    DRIVER: "Driver",
    VEHICLE: "Vehicle",

    SERVICE: "Service",
    SERVICE_TYPE: "Service_Type",
    DUTY_TYPE: "Duty_Type",

    BOOKING: "Booking",
    DUTY: "Duty",

    RATE: "Rate",
    RATE_VERSION: "Rate_Version",
    RATE_COMPONENT: "Rate_Component",

    CALCULATION: "Calculation",
    CALCULATION_COMPONENT: "Calculation_Component",

    TRANSACTION: "Transaction",
    WALLET: "Wallet",
    LEDGER: "Ledger",

    INVOICE: "Invoice",
    SETTLEMENT: "Settlement",

    DOCUMENT_TYPE: "Document_Type",
    DOCUMENT: "Document",
    KYC: "KYC",

    LOCATION: "Location",
    ROUTE: "Route",

    CALL_CENTER: "Call_Center",
    CALL_CENTER_AGENT: "Call_Center_Agent",
    CALL: "Call",
    TICKET: "Ticket",
    CALL_ASSIGNMENT: "Call_Assignment",
    CALL_ESCALATION: "Call_Escalation",

    API_PROVIDER: "API_Provider",
    API_CONNECTOR: "API_Connector",
    API_LOG: "API_Log",

    NOTIFICATION: "Notification",

    WELFARE: "Welfare",
    WELFARE_FUND: "Welfare_Fund",
    WELFARE_POLICY: "Welfare_Policy",
    WELFARE_CONTRIBUTION: "Welfare_Contribution",
    WELFARE_ALLOCATION: "Welfare_Allocation",
    WELFARE_BENEFICIARY: "Welfare_Beneficiary",

    ADMIN: "Admin",
    AUDIT: "Audit",
    AUTH: "Auth",

    TRAVEL: "Travel"
  };


  /* ==========================================================
     PUBLIC CONFIGURATION
  ========================================================== */

  function getConfig() {
    return Object.assign({}, CONFIG);
  }


  function setApiUrl(url) {
    CONFIG.API_URL = String(url || "").trim();

    APIState.configured = !!CONFIG.API_URL;

    return {
      success: true,
      configured: APIState.configured,
      apiUrl: CONFIG.API_URL
    };
  }


  function getApiUrl() {
    if (CONFIG.API_URL) {
      return CONFIG.API_URL;
    }

    if (window.GOVARA_API_URL) {
      return String(window.GOVARA_API_URL).trim();
    }

    return "";
  }


  function isConfigured() {
    return !!getApiUrl();
  }


  /* ==========================================================
     REQUEST ID / TIMESTAMP
  ========================================================== */

  function requestId() {
    return (
      "GV_REQ_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()
    );
  }


  function timestamp() {
    return new Date().toISOString();
  }


  /* ==========================================================
     RESPONSE PARSER
  ========================================================== */

  async function parseResponse(response) {

    var text = "";

    try {
      text = await response.text();
    } catch (error) {
      throw new Error("Unable to read API response.");
    }

    if (!text) {
      throw new Error(
        "Empty response received from GoVara API."
      );
    }

    var data;

    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error(
        "Invalid JSON response from GoVara API."
      );
    }

    if (!response.ok) {

      var serverMessage =
        data &&
        (
          data.message ||
          data.error ||
          data.status
        );

      throw new Error(
        serverMessage ||
        ("API HTTP error " + response.status)
      );
    }

    return data;
  }


  /* ==========================================================
     ERROR NORMALIZATION
  ========================================================== */

  function normalizeError(error) {

    if (!error) {
      return {
        message: "Unknown API error."
      };
    }

    if (typeof error === "string") {
      return {
        message: error
      };
    }

    return {
      message:
        error.message ||
        error.error ||
        "Unknown API error.",

      code:
        error.code ||
        error.status ||
        null
    };
  }


  /* ==========================================================
     FINANCIAL SAFETY
  ========================================================== */

  var BLOCKED_FINANCIAL_ACTIONS = [

    "REAL_MONEY",
    "REAL_PAYMENT",
    "BANK_TRANSFER",

    "LIVE_PAYMENT",
    "LIVE_PAYOUT",
    "LIVE_WITHDRAW",

    "BANK_PAYOUT",
    "BANK_WITHDRAW",

    "PAYMENT_CAPTURE",
    "PAYMENT_REFUND",

    "REAL_TRANSACTION"
  ];


  function isFinancialActionBlocked(action) {

    var normalized =
      String(action || "")
        .trim()
        .toUpperCase();

    return (
      BLOCKED_FINANCIAL_ACTIONS.indexOf(
        normalized
      ) !== -1
    );
  }


  /* ==========================================================
     CENTRAL REQUEST FUNCTION
  ========================================================== */

  async function request(action, payload) {

    var normalizedAction =
      String(action || "")
        .trim()
        .toUpperCase();

    APIState.lastAction = normalizedAction;
    APIState.lastError = null;

    if (!normalizedAction) {

      throw new Error(
        "API action is required."
      );
    }


    /* --------------------------------------------------------
       FINANCIAL SAFETY
    -------------------------------------------------------- */

    if (isFinancialActionBlocked(normalizedAction)) {

      var financialError =
        new Error(
          "Financial action is BLOCKED in frontend."
        );

      APIState.lastError =
        normalizeError(financialError);

      throw financialError;
    }


    /* --------------------------------------------------------
       API URL
    -------------------------------------------------------- */

    var apiUrl = getApiUrl();

    if (!apiUrl) {

      APIState.configured = false;

      var configError =
        new Error(
          "GoVara API is not configured."
        );

      APIState.lastError =
        normalizeError(configError);

      throw configError;
    }

    APIState.configured = true;


    /* --------------------------------------------------------
       REQUEST ENVELOPE
    -------------------------------------------------------- */

    var rid = requestId();
    var ts = timestamp();

    APIState.lastRequestId = rid;
    APIState.lastTimestamp = ts;


    var envelope = {

      project: CONFIG.PROJECT,

      version: CONFIG.VERSION,

      environment:
        CONFIG.ENVIRONMENT,

      action:
        normalizedAction,

      requestId:
        rid,

      timestamp:
        ts,

      payload:
        payload || {}
    };


    /* --------------------------------------------------------
       ABORT / TIMEOUT
    -------------------------------------------------------- */

    var controller = null;
    var timeoutId = null;

    if (
      typeof AbortController !== "undefined"
    ) {
      controller =
        new AbortController();

      timeoutId =
        setTimeout(
          function () {
            controller.abort();
          },
          CONFIG.REQUEST_TIMEOUT
        );
    }


    /* --------------------------------------------------------
       API CALL
    -------------------------------------------------------- */

    try {

      var response =
        await fetch(
          apiUrl,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "text/plain;charset=utf-8"
            },

            body:
              JSON.stringify(envelope),

            signal:
              controller
                ? controller.signal
                : undefined
          }
        );


      var result =
        await parseResponse(response);


      APIState.connected = true;
      APIState.lastResponse = result;
      APIState.lastError = null;


      return result;

    } catch (error) {

      var normalizedError =
        normalizeError(error);

      APIState.lastError =
        normalizedError;

      APIState.connected = false;

      throw error;

    } finally {

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }


  /* ==========================================================
     HEALTH / CONNECTION
  ========================================================== */

  async function testConnection() {

    try {

      var result =
        await request(
          "GET_HEALTH",
          {}
        );


      var project =
        result &&
        (
          result.project ||
          (
            result.data &&
            result.data.project
          ) ||
          (
            result.payload &&
            result.payload.project
          )
        );


      APIState.connected = true;

      APIState.verified =
        project === CONFIG.PROJECT;


      APIState.lastResponse =
        result;


      return {

        success:
          APIState.verified,

        connected:
          APIState.connected,

        verified:
          APIState.verified,

        project:
          project || null,

        response:
          result
      };


    } catch (error) {

      APIState.connected = false;
      APIState.verified = false;

      throw error;
    }
  }


  function getAPIState() {

    return {

      configured:
        APIState.configured ||
        isConfigured(),

      connected:
        APIState.connected,

      verified:
        APIState.verified,

      lastAction:
        APIState.lastAction,

      lastRequestId:
        APIState.lastRequestId,

      lastTimestamp:
        APIState.lastTimestamp,

      lastResponse:
        APIState.lastResponse,

      lastError:
        APIState.lastError
    };
  }


  /* ==========================================================
     GENERIC MODULE API
  ========================================================== */

  async function list(module, options) {

    return request(
      "LIST",
      {
        module:
          module,

        options:
          options || {}
      }
    );
  }


  async function get(module, id) {

    return request(
      "GET",
      {
        module:
          module,

        id:
          id
      }
    );
  }


  async function validate(module, data) {

    return request(
      "VALIDATE",
      {
        module:
          module,

        data:
          data || {}
      }
    );
  }


  async function create(module, data) {

    return request(
      "CREATE",
      {
        module:
          module,

        data:
          data || {}
      }
    );
  }


  async function update(module, id, data) {

    return request(
      "UPDATE",
      {
        module:
          module,

        id:
          id,

        data:
          data || {}
      }
    );
  }


  /* ==========================================================
     CUSTOMER API
  ========================================================== */

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


  /* ----------------------------------------------------------
     CUSTOMER REGISTRATION
     IMPORTANT:
     This is PUBLIC registration.
     It does NOT require an existing session.
  ---------------------------------------------------------- */

  function customerRegister(data) {

    return request(
      "CUSTOMER_REGISTER",
      data || {}
    );
  }


  function customerCreate(data) {

    return create(
      "Customer",
      data
    );
  }


  function customerUpdate(id, data) {

    return update(
      "Customer",
      id,
      data
    );
  }


  /* ==========================================================
     VENDOR API
  ========================================================== */

  function vendorList(options) {

    return list(
      "Vendor",
      options || {}
    );
  }


  function vendorGet(id) {

    return get(
      "Vendor",
      id
    );
  }


  function vendorValidate(data) {

    return validate(
      "Vendor",
      data
    );
  }


  function vendorCreate(data) {

    return create(
      "Vendor",
      data
    );
  }


  function vendorUpdate(id, data) {

    return update(
      "Vendor",
      id,
      data
    );
  }


  /* ==========================================================
     DRIVER API
  ========================================================== */

  function driverList(options) {

    return list(
      "Driver",
      options || {}
    );
  }


  function driverGet(id) {

    return get(
      "Driver",
      id
    );
  }


  function driverValidate(data) {

    return validate(
      "Driver",
      data
    );
  }


  function driverCreate(data) {

    return create(
      "Driver",
      data
    );
  }


  function driverUpdate(id, data) {

    return update(
      "Driver",
      id,
      data
    );
  }


  /* ==========================================================
     VEHICLE API
  ========================================================== */

  function vehicleList(options) {

    return list(
      "Vehicle",
      options || {}
    );
  }


  function vehicleGet(id) {

    return get(
      "Vehicle",
      id
    );
  }


  function vehicleValidate(data) {

    return validate(
      "Vehicle",
      data
    );
  }


  function vehicleCreate(data) {

    return create(
      "Vehicle",
      data
    );
  }


  function vehicleUpdate(id, data) {

    return update(
      "Vehicle",
      id,
      data
    );
  }


  /* ==========================================================
     BOOKING API
  ========================================================== */

  function bookingList(options) {

    return list(
      "Booking",
      options || {}
    );
  }


  function bookingGet(id) {

    return get(
      "Booking",
      id
    );
  }


  function bookingValidate(data) {

    return validate(
      "Booking",
      data
    );
  }


  function bookingCreate(data) {

    return create(
      "Booking",
      data
    );
  }


  function bookingUpdate(id, data) {

    return update(
      "Booking",
      id,
      data
    );
  }


  /* ==========================================================
     DUTY API
  ========================================================== */

  function dutyList(options) {

    return list(
      "Duty",
      options || {}
    );
  }


  function dutyGet(id) {

    return get(
      "Duty",
      id
    );
  }


  function dutyValidate(data) {

    return validate(
      "Duty",
      data
    );
  }


  function dutyCreate(data) {

    return create(
      "Duty",
      data
    );
  }


  function dutyUpdate(id, data) {

    return update(
      "Duty",
      id,
      data
    );
  }


  /* ==========================================================
     FARE / RATE API
  ========================================================== */

  function fareCalculate(data) {

    return request(
      "FARE_CALCULATE",
      data || {}
    );
  }


  function rateList(options) {

    return list(
      "Rate",
      options || {}
    );
  }


  function rateGet(id) {

    return get(
      "Rate",
      id
    );
  }


  function rateValidate(data) {

    return validate(
      "Rate",
      data
    );
  }


  /* ==========================================================
     TRANSACTION API
     Backend remains financial authority.
  ========================================================== */

  function transactionList(options) {

    return list(
      "Transaction",
      options || {}
    );
  }


  function transactionGet(id) {

    return get(
      "Transaction",
      id
    );
  }


  function transactionValidate(data) {

    return validate(
      "Transaction",
      data
    );
  }


  function transactionCreate(data) {

    return create(
      "Transaction",
      data
    );
  }


  /* ==========================================================
     WALLET API
  ========================================================== */

  function walletGet(id) {

    return request(
      "WALLET_GET",
      {
        id:
          id
      }
    );
  }


  function walletUpdate(data) {

    return request(
      "WALLET_UPDATE",
      data || {}
    );
  }


  /* ==========================================================
     LEDGER API
  ========================================================== */

  function ledgerList(options) {

    return list(
      "Ledger",
      options || {}
    );
  }


  function ledgerGet(id) {

    return get(
      "Ledger",
      id
    );
  }


  /* ==========================================================
     BILLING / INVOICE API
  ========================================================== */

  function billingList(options) {

    return list(
      "Invoice",
      options || {}
    );
  }


  function billingGet(id) {

    return get(
      "Invoice",
      id
    );
  }


  function billingValidate(data) {

    return validate(
      "Invoice",
      data
    );
  }


  /* ==========================================================
     SETTLEMENT API
  ========================================================== */

  function settlementList(options) {

    return list(
      "Settlement",
      options || {}
    );
  }


  function settlementGet(id) {

    return get(
      "Settlement",
      id
    );
  }


  /* ==========================================================
     DOCUMENT API
  ========================================================== */

  function documentList(options) {

    return list(
      "Document",
      options || {}
    );
  }


  function documentGet(id) {

    return get(
      "Document",
      id
    );
  }


  function documentValidate(data) {

    return validate(
      "Document",
      data
    );
  }


  function documentCreate(data) {

    return create(
      "Document",
      data
    );
  }


  function documentUpdate(id, data) {

    return update(
      "Document",
      id,
      data
    );
  }


  /* ==========================================================
     KYC API
  ========================================================== */

  function kycList(options) {

    return list(
      "KYC",
      options || {}
    );
  }


  function kycGet(id) {

    return get(
      "KYC",
      id
    );
  }


  function kycValidate(data) {

    return validate(
      "KYC",
      data
    );
  }


  /* ==========================================================
     ADMIN API
  ========================================================== */

  function adminGet(data) {

    return request(
      "ADMIN_GET",
      data || {}
    );
  }


  function adminUpdate(data) {

    return request(
      "ADMIN_UPDATE",
      data || {}
    );
  }


  /* ==========================================================
     AUDIT API
  ========================================================== */

  function auditList(options) {

    return list(
      "Audit",
      options || {}
    );
  }


  /* ==========================================================
     AUTH API
  ========================================================== */

  function authentication(action, data) {

    return request(
      action,
      data || {}
    );
  }


  function authLogin(data) {

    return request(
      "AUTH_LOGIN",
      data || {}
    );
  }


  function authLogout(data) {

    return request(
      "AUTH_LOGOUT",
      data || {}
    );
  }


  function authSession(data) {

    return request(
      "AUTH_SESSION",
      data || {}
    );
  }


  /* ==========================================================
     NOTIFICATION API
  ========================================================== */

  function notificationList(options) {

    return list(
      "Notification",
      options || {}
    );
  }


  function notificationGet(id) {

    return get(
      "Notification",
      id
    );
  }


  /* ==========================================================
     LOCATION API
  ========================================================== */

  function locationList(options) {

    return list(
      "Location",
      options || {}
    );
  }


  function locationGet(id) {

    return get(
      "Location",
      id
    );
  }


  function locationValidate(data) {

    return validate(
      "Location",
      data
    );
  }


  /* ==========================================================
     TRAVEL API
  ========================================================== */

  function travel(action, data) {

    return request(
      action,
      data || {}
    );
  }


  function flightSearch(data) {

    return request(
      "FLIGHT_SEARCH",
      data || {}
    );
  }


  function trainSearch(data) {

    return request(
      "TRAIN_SEARCH",
      data || {}
    );
  }


  function hotelSearch(data) {

    return request(
      "HOTEL_SEARCH",
      data || {}
    );
  }


  /* ==========================================================
     WELFARE API
  ========================================================== */

  function welfareList(options) {

    return list(
      "Welfare",
      options || {}
    );
  }


  function welfareGet(id) {

    return get(
      "Welfare",
      id
    );
  }


  function welfareValidate(data) {

    return validate(
      "Welfare",
      data
    );
  }


  /* ==========================================================
     SERVICE CATALOG API
  ========================================================== */

  function serviceList(options) {

    return list(
      "Service",
      options || {}
    );
  }


  function serviceGet(id) {

    return get(
      "Service",
      id
    );
  }


  function serviceValidate(data) {

    return validate(
      "Service",
      data
    );
  }


  /* ==========================================================
     GENERIC MODULE HELPERS
  ========================================================== */

  function moduleList(module, options) {

    return list(
      module,
      options || {}
    );
  }


  function moduleGet(module, id) {

    return get(
      module,
      id
    );
  }


  function moduleValidate(module, data) {

    return validate(
      module,
      data
    );
  }


  function moduleCreate(module, data) {

    return create(
      module,
      data
    );
  }


  function moduleUpdate(module, id, data) {

    return update(
      module,
      id,
      data
    );
  }


  /* ==========================================================
     API SAFETY STATUS
  ========================================================== */

  function getSafetyPolicy() {

    return {

      frontendFinancialAuthority:
        CONFIG.FRONTEND_FINANCIAL_AUTHORITY,

      backendFinancialAuthority:
        CONFIG.BACKEND_FINANCIAL_AUTHORITY,

      frontendKycAuthority:
        CONFIG.FRONTEND_KYC_AUTHORITY,

      backendKycAuthority:
        CONFIG.BACKEND_KYC_AUTHORITY,

      databaseAuthority:
        CONFIG.DATABASE_AUTHORITY,

      realMoney:
        "BLOCKED",

      realPayment:
        "BLOCKED",

      bankTransfer:
        "BLOCKED",

      directDatabaseWrite:
        "BLOCKED",

      directDatabaseRead:
        "BLOCKED",

      businessIds:
        "BACKEND_GENERATED",

      financialAuthority:
        "BACKEND"
    };
  }


  /* ==========================================================
     PUBLIC API
  ========================================================== */

  window.GoVaraAPI = {

    /* Configuration */
    config:
      getConfig,

    setApiUrl:
      setApiUrl,

    getApiUrl:
      getApiUrl,

    isConfigured:
      isConfigured,


    /* State */
    state:
      getAPIState,

    APIState:
      APIState,


    /* Connection */
    testConnection:
      testConnection,


    /* Core */
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


    /* Modules */
    modules:
      MODULES,


    /* Customer */
    customerList:
      customerList,

    customerGet:
      customerGet,

    customerValidate:
      customerValidate,

    customerRegister:
      customerRegister,

    customerCreate:
      customerCreate,

    customerUpdate:
      customerUpdate,


    /* Vendor */
    vendorList:
      vendorList,

    vendorGet:
      vendorGet,

    vendorValidate:
      vendorValidate,

    vendorCreate:
      vendorCreate,

    vendorUpdate:
      vendorUpdate,


    /* Driver */
    driverList:
      driverList,

    driverGet:
      driverGet,

    driverValidate:
      driverValidate,

    driverCreate:
      driverCreate,

    driverUpdate:
      driverUpdate,


    /* Vehicle */
    vehicleList:
      vehicleList,

    vehicleGet:
      vehicleGet,

    vehicleValidate:
      vehicleValidate,

    vehicleCreate:
      vehicleCreate,

    vehicleUpdate:
      vehicleUpdate,


    /* Booking */
    bookingList:
      bookingList,

    bookingGet:
      bookingGet,

    bookingValidate:
      bookingValidate,

    bookingCreate:
      bookingCreate,

    bookingUpdate:
      bookingUpdate,


    /* Duty */
    dutyList:
      dutyList,

    dutyGet:
      dutyGet,

    dutyValidate:
      dutyValidate,

    dutyCreate:
      dutyCreate,

    dutyUpdate:
      dutyUpdate,


    /* Fare */
    fareCalculate:
      fareCalculate,

    rateList:
      rateList,

    rateGet:
      rateGet,

    rateValidate:
      rateValidate,


    /* Transaction */
    transactionList:
      transactionList,

    transactionGet:
      transactionGet,

    transactionValidate:
      transactionValidate,

    transactionCreate:
      transactionCreate,


    /* Wallet */
    walletGet:
      walletGet,

    walletUpdate:
      walletUpdate,


    /* Ledger */
    ledgerList:
      ledgerList,

    ledgerGet:
      ledgerGet,


    /* Billing */
    billingList:
      billingList,

    billingGet:
      billingGet,

    billingValidate:
      billingValidate,


    /* Settlement */
    settlementList:
      settlementList,

    settlementGet:
      settlementGet,


    /* Documents */
    documentList:
      documentList,

    documentGet:
      documentGet,

    documentValidate:
      documentValidate,

    documentCreate:
      documentCreate,

    documentUpdate:
      documentUpdate,


    /* KYC */
    kycList:
      kycList,

    kycGet:
      kycGet,

    kycValidate:
      kycValidate,


    /* Admin */
    adminGet:
      adminGet,

    adminUpdate:
      adminUpdate,


    /* Audit */
    auditList:
      auditList,


    /* Auth */
    authentication:
      authentication,

    authLogin:
      authLogin,

    authLogout:
      authLogout,

    authSession:
      authSession,


    /* Notification */
    notificationList:
      notificationList,

    notificationGet:
      notificationGet,


    /* Location */
    locationList:
      locationList,

    locationGet:
      locationGet,

    locationValidate:
      locationValidate,


    /* Travel */
    travel:
      travel,

    flightSearch:
      flightSearch,

    trainSearch:
      trainSearch,

    hotelSearch:
      hotelSearch,


    /* Welfare */
    welfareList:
      welfareList,

    welfareGet:
      welfareGet,

    welfareValidate:
      welfareValidate,


    /* Service */
    serviceList:
      serviceList,

    serviceGet:
      serviceGet,

    serviceValidate:
      serviceValidate,


    /* Generic module helpers */
    moduleList:
      moduleList,

    moduleGet:
      moduleGet,

    moduleValidate:
      moduleValidate,

    moduleCreate:
      moduleCreate,

    moduleUpdate:
      moduleUpdate,


    /* Safety */
    getSafetyPolicy:
      getSafetyPolicy
  };


  /* ==========================================================
     INITIAL STATE
  ========================================================== */

  APIState.configured =
    isConfigured();


  /* ==========================================================
     CONSOLE STATUS
  ========================================================== */

  try {

    console.log(
      "GoVara STEP 27 API loaded.",
      {
        version:
          CONFIG.VERSION,

        environment:
          CONFIG.ENVIRONMENT,

        configured:
          APIState.configured,

        customerRegister:
          typeof window.GoVaraAPI.customerRegister ===
          "function",

        financialAuthority:
          "BACKEND",

        realMoney:
          "BLOCKED",

        realPayment:
          "BLOCKED",

        bankTransfer:
          "BLOCKED"
      }
    );

  } catch (error) {
    /* Console logging must never break the API. */
  }


})(window);
