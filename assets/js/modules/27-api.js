/* ============================================================
 * GoVara STEP 27
 * CONSOLIDATED API BOUNDARY
 * VERSION: V6.2
 *
 * MASTER FRONTEND API CONTRACT
 *
 * Architecture:
 * Frontend
 *    ↓
 * ONE Consolidated API Boundary
 *    ↓
 * Google Apps Script Web App
 *    ↓
 * Existing GoVara Database
 *
 * IMPORTANT:
 * - Frontend is NOT financial authority.
 * - Backend remains authoritative.
 * - Existing database only.
 * - No database/table creation.
 * - Real Money = BLOCKED
 * - Real Payment = BLOCKED
 * - Bank Transfer = BLOCKED
 * - No automatic API request on page load.
 * ============================================================ */

(function (window, document) {

  'use strict';

  /* ==========================================================
   * 01. CONSTANTS
   * ========================================================== */

  var STORAGE_KEY = 'GOVARA_CONSOLIDATED_API_V6';

  var CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbx5Mc1BuQsb_ssra6Z4INog2vlkIdqImXJOShPZE7sw/dev',
    REQUEST_TIMEOUT: 20000,
    VERSION: 'GOVARA-CONSOLIDATED-API-V6',
    ENVIRONMENT: 'TESTING',
    PROJECT: 'GoVara',

    REAL_MONEY: 'BLOCKED',
    REAL_PAYMENT: 'BLOCKED',
    BANK_TRANSFER: 'BLOCKED'
  };


  /* ==========================================================
   * 02. API STATE
   * ========================================================== */

  var APIState = {
    configured: false,
    connected: false,
    verified: false,

    lastResponse: null,
    lastError: null,
    lastAction: null,
    lastModule: null,

    requestStartedAt: null,
    responseReceivedAt: null
  };


  /* ==========================================================
   * 03. SUPPORTED MODULES
   * ========================================================== */

  var MODULES = [
    'SYSTEM',
    'ORGANIZATION',
    'DEPARTMENT',
    'GROUP',
    'USER',
    'ROLE',
    'PERMISSION',

    'CUSTOMER',
    'VENDOR',
    'DRIVER',
    'VEHICLE',

    'SERVICE',
    'SERVICE_TYPE',
    'DUTY_TYPE',

    'BOOKING',
    'DUTY',

    'RATE',
    'RATE_VERSION',
    'RATE_COMPONENT',

    'CALCULATION',
    'CALCULATION_COMPONENT',

    'TRANSACTION',
    'LEDGER',
    'INVOICE',
    'SETTLEMENT',

    'DOCUMENT_TYPE',
    'DOCUMENT',

    'LOCATION',
    'ROUTE',

    'CALL_CENTER',
    'CALL_CENTER_AGENT',
    'CALL',
    'TICKET',
    'CALL_ASSIGNMENT',
    'CALL_ESCALATION',

    'API_PROVIDER',
    'API_CONNECTOR',
    'API_LOG',

    'NOTIFICATION',

    'WELFARE',
    'WELFARE_FUND',
    'WELFARE_POLICY',
    'WELFARE_CONTRIBUTION',
    'WELFARE_ALLOCATION',
    'WELFARE_BENEFICIARY',

    'AUDIT_LOG',
    'SYSTEM_EVENT'
  ];


  /* ==========================================================
   * 04. SUPPORTED ACTIONS
   * ========================================================== */

  var ACTIONS = [
    'GET_HEALTH',
    'LIST',
    'GET',
    'VALIDATE',
    'CREATE',
    'UPDATE',
    'CUSTOMER_REGISTER'
  ];


  /* ==========================================================
   * 05. PROTECTED ACTIONS
   * ========================================================== */

  var PROTECTED_ACTIONS = [
    'CREATE',
    'UPDATE'
  ];


  /* ==========================================================
   * 06. CUSTOMER MODULE CONTRACT
   * ========================================================== */

  var CUSTOMER_CONTRACT = {
    MODULE: 'CUSTOMER',

    ACTIONS: [
      'LIST',
      'GET',
      'VALIDATE',
      'CREATE',
      'UPDATE',
      'CUSTOMER_REGISTER'
    ],

    REGISTER_FIELDS: [
      'name',
      'mobile',
      'email',
      'address'
    ],

    BACKEND_TABLE: '16_Customer',

    USER_TABLE: '05_User',

    ID_FIELD: 'Customer_ID'
  };


  /* ==========================================================
   * 07. MODULE REGISTRY
   * ========================================================== */

  var ModuleRegistry = {};

  MODULES.forEach(function (moduleName) {
    ModuleRegistry[moduleName] = {
      module: moduleName,
      enabled: true
    };
  });


  /* ==========================================================
   * 08. UTILITY
   * ========================================================== */

  function isObject(value) {
    return value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value);
  }


  function safeString(value) {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value);
  }


  function normalizeModule(module) {
    return safeString(module)
      .trim()
      .toUpperCase();
  }


  function normalizeAction(action) {
    return safeString(action)
      .trim()
      .toUpperCase();
  }


  function getAPIUrl() {
    return (
      CONFIG.API_URL ||
      window.GOVARA_API_URL ||
      ''
    ).trim();
  }


  function isConfigured() {
    return getAPIUrl().length > 0;
  }


  function nowISO() {
    try {
      return new Date().toISOString();
    } catch (error) {
      return '';
    }
  }


  /* ==========================================================
   * 09. STORAGE
   * ========================================================== */

  function loadSavedConfiguration() {

    try {

      var raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        APIState.configured = isConfigured();
        return;
      }

      var saved = JSON.parse(raw);

      if (saved && typeof saved === 'object') {

        if (saved.API_URL !== undefined) {
          CONFIG.API_URL = safeString(saved.API_URL).trim();
        }

        if (saved.ENVIRONMENT) {
          CONFIG.ENVIRONMENT = safeString(saved.ENVIRONMENT);
        }

        if (saved.VERSION) {
          CONFIG.VERSION = safeString(saved.VERSION);
        }
      }

    } catch (error) {

      console.warn(
        '[GoVara STEP 27] Unable to load saved API configuration.',
        error
      );

    }

    APIState.configured = isConfigured();
  }


  function saveConfiguration(url) {

    var cleanURL = safeString(url).trim();

    CONFIG.API_URL = cleanURL;

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          API_URL: cleanURL,
          ENVIRONMENT: CONFIG.ENVIRONMENT,
          VERSION: CONFIG.VERSION,
          PROJECT: CONFIG.PROJECT
        })
      );

    } catch (error) {

      console.warn(
        '[GoVara STEP 27] Unable to save API configuration.',
        error
      );

    }

    APIState.configured = cleanURL.length > 0;

    return {
      success: true,
      configured: APIState.configured,
      apiUrl: cleanURL
    };
  }


  function clearConfiguration() {

    CONFIG.API_URL = '';

    APIState.configured = false;
    APIState.connected = false;
    APIState.verified = false;

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn(
        '[GoVara STEP 27] Unable to clear saved configuration.',
        error
      );
    }

    return {
      success: true,
      configured: false
    };
  }


  /* ==========================================================
   * 10. REQUEST VALIDATION
   * ========================================================== */

  function validateAction(action) {

    var cleanAction = normalizeAction(action);

    if (ACTIONS.indexOf(cleanAction) === -1) {

      throw new Error(
        'Unsupported API action: ' + cleanAction
      );
    }

    return true;
  }


  function validateModule(module) {

    var cleanModule = normalizeModule(module);

    if (!cleanModule) {
      throw new Error('API module is required.');
    }

    if (MODULES.indexOf(cleanModule) === -1) {

      throw new Error(
        'Unsupported API module: ' + cleanModule
      );
    }

    return true;
  }


  function validateRequest(action, payload) {

    var cleanAction = normalizeAction(action);

    validateAction(cleanAction);

    /*
     * GET_HEALTH does not require a module.
     */
    if (cleanAction === 'GET_HEALTH') {
      return true;
    }

    /*
     * CUSTOMER_REGISTER is a public registration action.
     * It does not require module in the backend validation path.
     */
    if (cleanAction === 'CUSTOMER_REGISTER') {
      return true;
    }

    var module =
      payload && payload.module
        ? payload.module
        : '';

    if (module) {
      validateModule(module);
    }

    return true;
  }


  /* ==========================================================
   * 11. RESPONSE PARSING
   * ========================================================== */

  async function parseResponse(response) {

    var text = '';

    try {
      text = await response.text();
    } catch (error) {
      text = '';
    }

    var parsed = null;

    if (text) {

      try {
        parsed = JSON.parse(text);
      } catch (error) {

        parsed = {
          success: false,
          error: 'INVALID_JSON_RESPONSE',
          message: text
        };
      }

    } else {

      parsed = {
        success: false,
        error: 'EMPTY_RESPONSE',
        message: 'Backend returned an empty response.'
      };
    }


    /*
     * Preserve HTTP information.
     */
    if (parsed && typeof parsed === 'object') {

      parsed.httpStatus = response.status;
      parsed.httpOk = response.ok;
    }


    return parsed;
  }


  /* ==========================================================
   * 12. ERROR EXTRACTION
   * ========================================================== */

  function extractError(response) {

    if (!response) {
      return 'Unknown API error.';
    }

    if (response.error) {
      return safeString(response.error);
    }

    if (response.message) {
      return safeString(response.message);
    }

    if (
      response.result &&
      response.result.error
    ) {
      return safeString(response.result.error);
    }

    if (
      response.result &&
      response.result.message
    ) {
      return safeString(response.result.message);
    }

    return 'API request failed.';
  }


  /* ==========================================================
   * 13. NESTED RESULT SUCCESS
   * ========================================================== */

  function isResponseSuccess(response) {

    if (!response) {
      return false;
    }

    /*
     * Backend may return:
     *
     * {
     *   success: true,
     *   result: {
     *      success: true
     *   }
     * }
     */

    if (
      response.result &&
      typeof response.result === 'object' &&
      response.result.success === false
    ) {
      return false;
    }

    if (response.success === false) {
      return false;
    }

    return response.success === true;
  }


  /* ==========================================================
   * 14. CENTRAL REQUEST
   *
   * IMPORTANT FIX:
   *
   * Existing generic API uses:
   *
   * {
   *   action: "...",
   *   payload: {...}
   * }
   *
   * Customer Registration backend expects:
   *
   * {
   *   action: "CUSTOMER_REGISTER",
   *   data: {...}
   * }
   *
   * Therefore only CUSTOMER_REGISTER is translated
   * from payload → data.
   *
   * All other actions retain their existing contract.
   * ========================================================== */

  async function request(action, payload) {

    var cleanAction = normalizeAction(action);

    validateAction(cleanAction);

    var url = getAPIUrl();

    if (!url) {

      throw new Error(
        'Consolidated API endpoint is not configured.'
      );
    }

    payload = payload || {};

    validateRequest(cleanAction, payload);

    APIState.lastAction = cleanAction;
    APIState.lastError = null;
    APIState.requestStartedAt = nowISO();


    /*
     * Existing generic envelope.
     */
    var requestBody = {
      action: cleanAction,
      payload: payload,

      version: CONFIG.VERSION,
      project: CONFIG.PROJECT,
      environment: CONFIG.ENVIRONMENT
    };


    /*
     * ========================================================
     * CUSTOMER REGISTRATION CONTRACT FIX
     * ========================================================
     *
     * Backend:
     * GV_apiExecuteCustomerRegister(request)
     *
     * reads:
     * request.data
     *
     * NOT:
     * request.payload
     *
     * Therefore move only this action's object.
     * ========================================================
     */

    if (cleanAction === 'CUSTOMER_REGISTER') {

      requestBody.data = requestBody.payload;

      delete requestBody.payload;
    }


    var controller = null;
    var timeoutId = null;

    if (typeof AbortController !== 'undefined') {
      controller = new AbortController();

      timeoutId = setTimeout(function () {

        try {
          controller.abort();
        } catch (error) {
          // Ignore abort errors.
        }

      }, CONFIG.REQUEST_TIMEOUT);
    }


    try {

      var fetchOptions = {
        method: 'POST',

        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },

        body: JSON.stringify(requestBody)
      };

      if (controller) {
        fetchOptions.signal = controller.signal;
      }


      var response = await fetch(
        url,
        fetchOptions
      );


      var parsed = await parseResponse(response);

      APIState.responseReceivedAt = nowISO();
      APIState.lastResponse = parsed;


      if (!response.ok) {

        APIState.connected = false;
        APIState.verified = false;

        var httpError =
          extractError(parsed) ||
          (
            'HTTP ' +
            response.status +
            ' request failed.'
          );

        APIState.lastError = httpError;

        throw new Error(httpError);
      }


      /*
       * Successful HTTP response does not automatically mean
       * business operation succeeded.
       *
       * Nested result.success is checked here too.
       */
      if (!isResponseSuccess(parsed)) {

        var apiError = extractError(parsed);

        APIState.lastError = apiError;

        return parsed;
      }


      APIState.lastError = null;

      return parsed;

    } catch (error) {

      APIState.lastError =
        error && error.message
          ? error.message
          : safeString(error);

      throw error;

    } finally {

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }


  /* ==========================================================
   * 15. GET HEALTH
   * ========================================================== */

  async function testConnection() {

    var url = getAPIUrl();

    if (!url) {

      APIState.configured = false;
      APIState.connected = false;
      APIState.verified = false;

      throw new Error(
        'Consolidated API endpoint is not configured.'
      );
    }


    APIState.lastAction = 'GET_HEALTH';
    APIState.lastError = null;
    APIState.requestStartedAt = nowISO();


    var controller = null;
    var timeoutId = null;

    if (typeof AbortController !== 'undefined') {

      controller = new AbortController();

      timeoutId = setTimeout(function () {

        try {
          controller.abort();
        } catch (error) {
          // Ignore.
        }

      }, CONFIG.REQUEST_TIMEOUT);
    }


    try {

      var options = {
        method: 'GET'
      };

      if (controller) {
        options.signal = controller.signal;
      }


      var response = await fetch(
        url,
        options
      );


      var parsed = await parseResponse(response);

      APIState.responseReceivedAt = nowISO();
      APIState.lastResponse = parsed;


      if (!response.ok) {

        APIState.connected = false;
        APIState.verified = false;

        var httpError = extractError(parsed);

        APIState.lastError = httpError;

        throw new Error(httpError);
      }


      /*
       * Backend identity verification.
       *
       * GoVara project must be returned.
       */
      var project =
        parsed &&
        (
          parsed.project ||
          (
            parsed.result &&
            parsed.result.project
          )
        );


      var verifiedProject =
        safeString(project).trim() === 'GoVara';


      APIState.connected = true;
      APIState.verified = verifiedProject;


      if (!verifiedProject) {

        APIState.lastError =
          'Backend project verification failed.';

        throw new Error(
          'Backend project verification failed.'
        );
      }


      return parsed;

    } catch (error) {

      APIState.connected = false;
      APIState.verified = false;

      APIState.lastError =
        error && error.message
          ? error.message
          : safeString(error);

      throw error;

    } finally {

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }


  /* ==========================================================
   * 16. GENERIC LIST
   * ========================================================== */

  async function list(module) {

    var cleanModule = normalizeModule(module);

    validateModule(cleanModule);

    return request(
      'LIST',
      {
        module: cleanModule
      }
    );
  }


  /* ==========================================================
   * 17. GENERIC GET
   * ========================================================== */

  async function get(module, id) {

    var cleanModule = normalizeModule(module);

    validateModule(cleanModule);

    if (!safeString(id).trim()) {
      throw new Error('Record ID is required.');
    }

    return request(
      'GET',
      {
        module: cleanModule,
        id: safeString(id).trim()
      }
    );
  }


  /* ==========================================================
   * 18. GENERIC VALIDATE
   * ========================================================== */

  async function validate(module, data) {

    var cleanModule = normalizeModule(module);

    validateModule(cleanModule);

    return request(
      'VALIDATE',
      {
        module: cleanModule,
        data: data || {}
      }
    );
  }


  /* ==========================================================
   * 19. GENERIC CREATE
   * ========================================================== */

  async function create(module, data) {

    var cleanModule = normalizeModule(module);

    validateModule(cleanModule);

    return request(
      'CREATE',
      {
        module: cleanModule,
        data: data || {}
      }
    );
  }


  /* ==========================================================
   * 20. GENERIC UPDATE
   * ========================================================== */

  async function update(module, id, data) {

    var cleanModule = normalizeModule(module);

    validateModule(cleanModule);

    if (!safeString(id).trim()) {
      throw new Error('Record ID is required.');
    }

    return request(
      'UPDATE',
      {
        module: cleanModule,
        id: safeString(id).trim(),
        data: data || {}
      }
    );
  }


  /* ==========================================================
   * 21. CUSTOMER REGISTER
   *
   * This is the important corrected path.
   * ========================================================== */

  async function customerRegister(data) {

    data = data || {};

    /*
     * Do not silently change the customer's data here.
     * 28-Customer.js already normalizes the mobile.
     *
     * Backend remains authoritative for validation.
     */

    return request(
      'CUSTOMER_REGISTER',
      data
    );
  }


  /* ==========================================================
   * 22. CUSTOMER LIST
   * ========================================================== */

  async function customerList() {

    return list('CUSTOMER');
  }


  /* ==========================================================
   * 23. CUSTOMER GET
   * ========================================================== */

  async function customerGet(customerId) {

    return get(
      'CUSTOMER',
      customerId
    );
  }


  /* ==========================================================
   * 24. CUSTOMER VALIDATE
   * ========================================================== */

  async function customerValidate(data) {

    return validate(
      'CUSTOMER',
      data || {}
    );
  }


  /* ==========================================================
   * 25. CUSTOMER CREATE
   * ========================================================== */

  async function customerCreate(data) {

    return create(
      'CUSTOMER',
      data || {}
    );
  }


  /* ==========================================================
   * 26. CUSTOMER UPDATE
   * ========================================================== */

  async function customerUpdate(customerId, data) {

    return update(
      'CUSTOMER',
      customerId,
      data || {}
    );
  }


  /* ==========================================================
   * 27. FARE
   * ========================================================== */

  async function fareCalculate(data) {

    return request(
      'CALCULATE',
      {
        module: 'CALCULATION',
        data: data || {}
      }
    );
  }


  /* ==========================================================
   * 28. TRANSACTION
   * ========================================================== */

  async function transactionCreate(data) {

    return create(
      'TRANSACTION',
      data || {}
    );
  }


  /* ==========================================================
   * 29. WALLET GET
   *
   * Uses existing transaction/financial boundary.
   * Frontend is not financial authority.
   * ========================================================== */

  async function walletGet(data) {

    return request(
      'GET',
      {
        module: 'TRANSACTION',
        type: 'WALLET',
        data: data || {}
      }
    );
  }


  /* ==========================================================
   * 30. WALLET UPDATE
   *
   * Real-money operations remain blocked.
   * ========================================================== */

  async function walletUpdate(data) {

    return {
      success: false,
      blocked: true,
      error: 'REAL_MONEY_BLOCKED',
      message:
        'Real money wallet operations are blocked.'
    };
  }


  /* ==========================================================
   * 31. ADMIN GET
   * ========================================================== */

  async function adminGet(data) {

    return request(
      'GET',
      {
        module: 'SYSTEM',
        type: 'ADMIN',
        data: data || {}
      }
    );
  }


  /* ==========================================================
   * 32. ADMIN UPDATE
   * ========================================================== */

  async function adminUpdate(data) {

    return update(
      'SYSTEM',
      data && data.id
        ? data.id
        : 'SYSTEM',
      data || {}
    );
  }


  /* ==========================================================
   * 33. AUDIT LIST
   * ========================================================== */

  async function auditList(data) {

    return list('AUDIT_LOG');
  }


  /* ==========================================================
   * 34. TRAVEL MODULES
   * ========================================================== */

  async function flight(data) {

    return request(
      'LIST',
      {
        module: 'SERVICE',
        serviceCategory: 'FLIGHT',
        data: data || {}
      }
    );
  }


  async function train(data) {

    return request(
      'LIST',
      {
        module: 'SERVICE',
        serviceCategory: 'TRAIN',
        data: data || {}
      }
    );
  }


  async function hotel(data) {

    return request(
      'LIST',
      {
        module: 'SERVICE',
        serviceCategory: 'HOTEL',
        data: data || {}
      }
    );
  }


  /* ==========================================================
   * 35. WELFARE
   * ========================================================== */

  async function welfare(data) {

    return request(
      'LIST',
      {
        module: 'WELFARE',
        data: data || {}
      }
    );
  }


  /* ==========================================================
   * 36. LOCATION
   * ========================================================== */

  async function location(data) {

    return request(
      'LIST',
      {
        module: 'LOCATION',
        data: data || {}
      }
    );
  }


  /* ==========================================================
   * 37. NOTIFICATION
   * ========================================================== */

  async function notifications(data) {

    return request(
      'LIST',
      {
        module: 'NOTIFICATION',
        data: data || {}
      }
    );
  }


  /* ==========================================================
   * 38. AUTHENTICATION
   * ========================================================== */

  async function authentication(data) {

    return request(
      'GET',
      {
        module: 'USER',
        data: data || {}
      }
    );
  }


  /* ==========================================================
   * 39. API CONFIGURATION
   * ========================================================== */

  function getConfiguration() {

    return {
      apiUrl: getAPIUrl(),
      configured: isConfigured(),

      version: CONFIG.VERSION,
      environment: CONFIG.ENVIRONMENT,
      project: CONFIG.PROJECT,

      realMoney: CONFIG.REAL_MONEY,
      realPayment: CONFIG.REAL_PAYMENT,
      bankTransfer: CONFIG.BANK_TRANSFER
    };
  }


  function setAPIEndpoint(url) {

    return saveConfiguration(url);
  }


  function getAPIEndpoint() {

    return getAPIUrl();
  }


  function clearAPIEndpoint() {

    return clearConfiguration();
  }


  /* ==========================================================
   * 40. STATE
   * ========================================================== */

  function getState() {

    return {
      configured: APIState.configured,
      connected: APIState.connected,
      verified: APIState.verified,

      lastAction: APIState.lastAction,
      lastModule: APIState.lastModule,

      lastResponse: APIState.lastResponse,
      lastError: APIState.lastError,

      requestStartedAt: APIState.requestStartedAt,
      responseReceivedAt: APIState.responseReceivedAt,

      configuration: getConfiguration()
    };
  }


  /* ==========================================================
   * 41. MODULE REGISTRY ACCESS
   * ========================================================== */

  function getModules() {

    return MODULES.slice();
  }


  function getModule(module) {

    var cleanModule = normalizeModule(module);

    if (!cleanModule) {
      return null;
    }

    return ModuleRegistry[cleanModule] || null;
  }


  /* ==========================================================
   * 42. DIAGNOSTICS
   * ========================================================== */

  function diagnostics() {

    return {
      success: true,

      project: CONFIG.PROJECT,
      version: CONFIG.VERSION,
      environment: CONFIG.ENVIRONMENT,

      configured: isConfigured(),
      connected: APIState.connected,
      verified: APIState.verified,

      endpoint:
        isConfigured()
          ? getAPIUrl()
          : '',

      moduleCount: MODULES.length,

      modules: MODULES.slice(),

      customer: {
        module: CUSTOMER_CONTRACT.MODULE,
        table: CUSTOMER_CONTRACT.BACKEND_TABLE,
        userTable: CUSTOMER_CONTRACT.USER_TABLE,
        registrationEnabled: true
      },

      safety: {
        realMoney: 'BLOCKED',
        realPayment: 'BLOCKED',
        bankTransfer: 'BLOCKED'
      },

      lastAction: APIState.lastAction,
      lastError: APIState.lastError
    };
  }


  /* ==========================================================
   * 43. FRONTEND RENDER
   *
   * No automatic API request.
   * ========================================================== */

  function render(container) {

    var target = container;

    if (typeof target === 'string') {
      target = document.querySelector(target);
    }

    if (!target) {
      return false;
    }


    target.innerHTML =

      '<div class="govara-step27-panel">' +

        '<div class="govara-step27-header">' +

          '<div>' +
            '<h2>STEP 27 — Consolidated API</h2>' +
            '<p>ONE Frontend API Boundary</p>' +
          '</div>' +

          '<div class="govara-step27-status">' +
            '<span id="govara-step27-status">' +
              'NOT CONFIGURED' +
            '</span>' +
          '</div>' +

        '</div>' +


        '<div class="govara-step27-card">' +

          '<label for="govara-step27-endpoint">' +
            'Consolidated API Endpoint' +
          '</label>' +

          '<input ' +
            'id="govara-step27-endpoint" ' +
            'type="url" ' +
            'placeholder="https://script.google.com/macros/s/.../exec"' +
          ' />' +


          '<div class="govara-step27-actions">' +

            '<button ' +
              'type="button" ' +
              'id="govara-step27-validate">' +
              'Validate Endpoint' +
            '</button>' +

            '<button ' +
              'type="button" ' +
              'id="govara-step27-save">' +
              'Save API Configuration' +
            '</button>' +

            '<button ' +
              'type="button" ' +
              'id="govara-step27-clear">' +
              'Clear API' +
            '</button>' +

          '</div>' +

        '</div>' +


        '<div class="govara-step27-card">' +

          '<h3>API Status</h3>' +

          '<div id="govara-step27-diagnostics">' +
            'API test has not been run.' +
          '</div>' +

        '</div>' +


        '<div class="govara-step27-card">' +

          '<h3>Safety Boundary</h3>' +

          '<div>Real Money: <strong>BLOCKED</strong></div>' +
          '<div>Real Payment: <strong>BLOCKED</strong></div>' +
          '<div>Bank Transfer: <strong>BLOCKED</strong></div>' +

        '</div>' +

      '</div>';


    var endpointInput =
      target.querySelector(
        '#govara-step27-endpoint'
      );


    var savedURL = getAPIUrl();

    if (endpointInput) {
      endpointInput.value = savedURL;
    }


    updateRenderedStatus(target);

    bindRenderEvents(target);

    return true;
  }


  /* ==========================================================
   * 44. RENDERED STATUS
   * ========================================================== */

  function updateRenderedStatus(container) {

    if (!container) {
      return;
    }


    var status =
      container.querySelector(
        '#govara-step27-status'
      );


    var diagnosticsBox =
      container.querySelector(
        '#govara-step27-diagnostics'
      );


    if (status) {

      if (!APIState.configured) {

        status.textContent =
          'NOT CONFIGURED';

      } else if (
        APIState.connected &&
        APIState.verified
      ) {

        status.textContent =
          'API CONNECTED';

      } else {

        status.textContent =
          'CONFIGURED';
      }
    }


    if (diagnosticsBox) {

      diagnosticsBox.textContent =
        JSON.stringify(
          diagnostics(),
          null,
          2
        );
    }
  }


  /* ==========================================================
   * 45. RENDER EVENT BINDING
   * ========================================================== */

  function bindRenderEvents(container) {

    var endpointInput =
      container.querySelector(
        '#govara-step27-endpoint'
      );

    var validateButton =
      container.querySelector(
        '#govara-step27-validate'
      );

    var saveButton =
      container.querySelector(
        '#govara-step27-save'
      );

    var clearButton =
      container.querySelector(
        '#govara-step27-clear'
      );


    if (saveButton) {

      saveButton.addEventListener(
        'click',
        function () {

          var url =
            endpointInput
              ? endpointInput.value.trim()
              : '';

          saveConfiguration(url);

          updateRenderedStatus(container);
        }
      );
    }


    if (clearButton) {

      clearButton.addEventListener(
        'click',
        function () {

          clearConfiguration();

          if (endpointInput) {
            endpointInput.value = '';
          }

          updateRenderedStatus(container);
        }
      );
    }


    if (validateButton) {

      validateButton.addEventListener(
        'click',
        async function () {

          var url =
            endpointInput
              ? endpointInput.value.trim()
              : '';

          if (!url) {

            APIState.lastError =
              'API endpoint is required.';

            updateRenderedStatus(container);

            return;
          }


          saveConfiguration(url);


          try {

            await testConnection();

          } catch (error) {

            console.error(
              '[GoVara STEP 27] API validation failed:',
              error
            );
          }


          updateRenderedStatus(container);
        }
      );
    }
  }


  /* ==========================================================
   * 46. RENDER + BIND
   * ========================================================== */

  function renderAndBind(container) {

    return render(container);
  }


  /* ==========================================================
   * 47. PUBLIC API
   * ========================================================== */

  var GoVaraAPI = {

    /*
     * Core
     */
    request: request,
    testConnection: testConnection,

    /*
     * Configuration
     */
    getAPIUrl: getAPIUrl,
    getAPIEndpoint: getAPIEndpoint,
    setAPIEndpoint: setAPIEndpoint,
    clearAPIEndpoint: clearAPIEndpoint,
    getConfiguration: getConfiguration,

    /*
     * State
     */
    getState: getState,
    diagnostics: diagnostics,

    /*
     * Modules
     */
    getModules: getModules,
    getModule: getModule,

    /*
     * Generic
     */
    list: list,
    get: get,
    validate: validate,
    create: create,
    update: update,

    /*
     * Customer
     */
    customerRegister: customerRegister,
    customerList: customerList,
    customerGet: customerGet,
    customerValidate: customerValidate,
    customerCreate: customerCreate,
    customerUpdate: customerUpdate,

    /*
     * Fare
     */
    fareCalculate: fareCalculate,

    /*
     * Transaction
     */
    transactionCreate: transactionCreate,

    /*
     * Wallet
     */
    walletGet: walletGet,
    walletUpdate: walletUpdate,

    /*
     * Admin
     */
    adminGet: adminGet,
    adminUpdate: adminUpdate,

    /*
     * Audit
     */
    auditList: auditList,

    /*
     * Travel
     */
    flight: flight,
    train: train,
    hotel: hotel,

    /*
     * Other modules
     */
    welfare: welfare,
    location: location,
    notifications: notifications,
    authentication: authentication,

    /*
     * UI
     */
    render: render,
    renderAndBind: renderAndBind
  };


  /* ==========================================================
   * 48. STEP 27 PUBLIC OBJECT
   * ========================================================== */

  var GoVara27 = {

    VERSION: CONFIG.VERSION,

    CONFIG: CONFIG,

    STATE: APIState,

    MODULES: MODULES,

    ModuleRegistry: ModuleRegistry,

    CUSTOMER_CONTRACT: CUSTOMER_CONTRACT,

    APIState: APIState,

    /*
     * Configuration
     */
    getAPIUrl: getAPIUrl,
    setAPIEndpoint: setAPIEndpoint,
    getAPIEndpoint: getAPIEndpoint,
    clearAPIEndpoint: clearAPIEndpoint,
    getConfiguration: getConfiguration,

    /*
     * API
     */
    request: request,
    testConnection: testConnection,

    /*
     * Generic
     */
    list: list,
    get: get,
    validate: validate,
    create: create,
    update: update,

    /*
     * Customer
     */
    customerRegister: customerRegister,
    customerList: customerList,
    customerGet: customerGet,
    customerValidate: customerValidate,
    customerCreate: customerCreate,
    customerUpdate: customerUpdate,

    /*
     * Business
     */
    fareCalculate: fareCalculate,
    transactionCreate: transactionCreate,
    walletGet: walletGet,
    walletUpdate: walletUpdate,

    /*
     * Admin
     */
    adminGet: adminGet,
    adminUpdate: adminUpdate,
    auditList: auditList,

    /*
     * Travel
     */
    flight: flight,
    train: train,
    hotel: hotel,

    /*
     * Other
     */
    welfare: welfare,
    location: location,
    notifications: notifications,
    authentication: authentication,

    /*
     * Diagnostics
     */
    getState: getState,
    diagnostics: diagnostics,
    getModules: getModules,
    getModule: getModule,

    /*
     * UI
     */
    render: render,
    renderAndBind: renderAndBind
  };


  /* ==========================================================
   * 49. GLOBAL REGISTRIES
   *
   * Preserve compatibility with existing frontend.
   * ========================================================== */

  window.GoVaraAPI = GoVaraAPI;

  window.GoVara27 = GoVara27;


  window.GoVaraModules =
    window.GoVaraModules || {};

  window.GoVaraModules['27'] =
    GoVara27;

  window.GoVaraModules['27-api'] =
    GoVara27;

  window.GoVaraModules['STEP 27'] =
    GoVara27;


  window.GoVaraModuleRegistry =
    window.GoVaraModuleRegistry || {};

  window.GoVaraModuleRegistry['27'] =
    GoVara27;

  window.GoVaraModuleRegistry['27-api'] =
    GoVara27;

  window.GoVaraModuleRegistry['STEP 27'] =
    GoVara27;


  /* ==========================================================
   * 50. INITIAL CONFIGURATION LOAD
   *
   * IMPORTANT:
   * Only local configuration is loaded.
   * NO API REQUEST is made automatically.
   * ========================================================== */

  loadSavedConfiguration();


  /* ==========================================================
   * 51. CONSOLE STATUS
   * ========================================================== */

  console.log(
    '[GoVara STEP 27] Consolidated API loaded.',
    {
      version: CONFIG.VERSION,
      configured: APIState.configured,
      environment: CONFIG.ENVIRONMENT,
      realMoney: CONFIG.REAL_MONEY,
      realPayment: CONFIG.REAL_PAYMENT,
      bankTransfer: CONFIG.BANK_TRANSFER
    }
  );


})(window, document);
