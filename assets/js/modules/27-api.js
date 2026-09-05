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
    API_URL:
      'https://script.google.com/macros/s/AKfycbyczzk6Takt3vEArKzPzFfSInkZq-AJ8_gjBp4oC3R4gSREMqHFtGaZXl4RBYT_PRGX9g/exec',

    REQUEST_TIMEOUT: 20000,

    VERSION:
      'GOVARA-CONSOLIDATED-API-V6',

    ENVIRONMENT:
      'TESTING',

    PROJECT:
      'GoVara',

    REAL_MONEY:
      'BLOCKED',

    REAL_PAYMENT:
      'BLOCKED',

    BANK_TRANSFER:
      'BLOCKED'
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
    MODULE:
      'CUSTOMER',

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

    BACKEND_TABLE:
      '16_Customer',

    USER_TABLE:
      '05_User',

    ID_FIELD:
      'Customer_ID'
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
    return (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    );
  }

  function safeString(value) {
    if (
      value === null ||
      value === undefined
    ) {
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
      var raw =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!raw) {
        APIState.configured =
          isConfigured();

        return;
      }

      var saved =
        JSON.parse(raw);

      if (
        saved &&
        typeof saved === 'object'
      ) {
        if (
          saved.API_URL !== undefined
        ) {
          CONFIG.API_URL =
            safeString(
              saved.API_URL
            ).trim();
        }

        if (saved.ENVIRONMENT) {
          CONFIG.ENVIRONMENT =
            safeString(
              saved.ENVIRONMENT
            );
        }

        if (saved.VERSION) {
          CONFIG.VERSION =
            safeString(
              saved.VERSION
            );
        }
      }

    } catch (error) {
      console.warn(
        '[GoVara STEP 27] Unable to load saved API configuration.',
        error
      );
    }

    APIState.configured =
      isConfigured();
  }

  function saveConfiguration(url) {
    var cleanURL =
      safeString(url).trim();

    CONFIG.API_URL =
      cleanURL;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          API_URL:
            cleanURL,

          ENVIRONMENT:
            CONFIG.ENVIRONMENT,

          VERSION:
            CONFIG.VERSION,

          PROJECT:
            CONFIG.PROJECT
        })
      );

    } catch (error) {
      console.warn(
        '[GoVara STEP 27] Unable to save API configuration.',
        error
      );
    }

    APIState.configured =
      cleanURL.length > 0;

    return {
      success:
        true,

      configured:
        APIState.configured,

      apiUrl:
        cleanURL
    };
  }

  function clearConfiguration() {
    CONFIG.API_URL =
      '';

    APIState.configured =
      false;

    APIState.connected =
      false;

    APIState.verified =
      false;

    try {
      localStorage.removeItem(
        STORAGE_KEY
      );

    } catch (error) {
      console.warn(
        '[GoVara STEP 27] Unable to clear saved configuration.',
        error
      );
    }

    return {
      success:
        true,

      configured:
        false
    };
  }

  /* ==========================================================
   * 10. REQUEST VALIDATION
   * ========================================================== */

  function validateAction(action) {
    var cleanAction =
      normalizeAction(action);

    if (
      ACTIONS.indexOf(
        cleanAction
      ) === -1
    ) {
      throw new Error(
        'Unsupported API action: ' +
        cleanAction
      );
    }

    return true;
  }

  function validateModule(module) {
    var cleanModule =
      normalizeModule(module);

    if (!cleanModule) {
      throw new Error(
        'API module is required.'
      );
    }

    if (
      MODULES.indexOf(
        cleanModule
      ) === -1
    ) {
      throw new Error(
        'Unsupported API module: ' +
        cleanModule
      );
    }

    return true;
  }

  function validateRequest(
    action,
    payload
  ) {
    var cleanAction =
      normalizeAction(action);

    validateAction(
      cleanAction
    );

    if (
      cleanAction ===
      'GET_HEALTH'
    ) {
      return true;
    }

    if (
      cleanAction ===
      'CUSTOMER_REGISTER'
    ) {
      return true;
    }

    var module =
      payload &&
      payload.module
        ? payload.module
        : '';

    if (module) {
      validateModule(
        module
      );
    }

    return true;
  }

  /* ==========================================================
   * 11. RESPONSE PARSING
   * ========================================================== */

  async function parseResponse(
    response
  ) {
    var text = '';

    try {
      text =
        await response.text();

    } catch (error) {
      text = '';
    }

    var parsed = null;

    if (text) {
      try {
        parsed =
          JSON.parse(text);

      } catch (error) {
        parsed = {
          success:
            false,

          error:
            'INVALID_JSON_RESPONSE',

          message:
            text
        };
      }

    } else {
      parsed = {
        success:
          false,

        error:
          'EMPTY_RESPONSE',

        message:
          'Backend returned an empty response.'
      };
    }

    if (
      parsed &&
      typeof parsed === 'object'
    ) {
      parsed.httpStatus =
        response.status;

      parsed.httpOk =
        response.ok;
    }

    return parsed;
  }

  /* ==========================================================
   * 12. ERROR EXTRACTION
   * ========================================================== */

  function extractError(
    response
  ) {
    if (!response) {
      return 'Unknown API error.';
    }

    if (response.error) {
      return safeString(
        response.error
      );
    }

    if (response.message) {
      return safeString(
        response.message
      );
    }

    if (
      response.result &&
      response.result.error
    ) {
      return safeString(
        response.result.error
      );
    }

    if (
      response.result &&
      response.result.message
    ) {
      return safeString(
        response.result.message
      );
    }

    return 'API request failed.';
  }

  /* ==========================================================
   * 13. NESTED RESULT SUCCESS
   * ========================================================== */

  function isResponseSuccess(
    response
  ) {
    if (!response) {
      return false;
    }

    if (
      response.result &&
      typeof response.result ===
        'object' &&
      response.result.success ===
        false
    ) {
      return false;
    }

    if (
      response.success ===
      false
    ) {
      return false;
    }

    return (
      response.success ===
      true
    );
  }

  /* ==========================================================
   * 14. CENTRAL REQUEST
   * ========================================================== */

  async function request(
    action,
    payload
  ) {
    var cleanAction =
      normalizeAction(action);

    validateAction(
      cleanAction
    );

    var url =
      getAPIUrl();

    if (!url) {
      throw new Error(
        'Consolidated API endpoint is not configured.'
      );
    }

    payload =
      payload || {};

    validateRequest(
      cleanAction,
      payload
    );

    APIState.lastAction =
      cleanAction;

    APIState.lastError =
      null;

    APIState.requestStartedAt =
      nowISO();

    var requestBody = {
      action:
        cleanAction,

      payload:
        payload,

      version:
        CONFIG.VERSION,

      project:
        CONFIG.PROJECT,

      environment:
        CONFIG.ENVIRONMENT
    };

    /*
     * CUSTOMER_REGISTER backend contract:
     *
     * {
     *   action: "CUSTOMER_REGISTER",
     *   data: {...}
     * }
     */

    if (
      cleanAction ===
      'CUSTOMER_REGISTER'
    ) {
      requestBody.data =
        requestBody.payload;

      delete requestBody.payload;
    }

    var controller =
      null;

    var timeoutId =
      null;

    if (
      typeof AbortController !==
      'undefined'
    ) {
      controller =
        new AbortController();

      timeoutId =
        setTimeout(
          function () {
            try {
              controller.abort();
            } catch (error) {
              // Ignore abort errors.
            }
          },
          CONFIG.REQUEST_TIMEOUT
        );
    }

    try {
      var fetchOptions = {
        method:
          'POST',

        headers: {
          'Content-Type':
            'text/plain;charset=utf-8'
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
          url,
          fetchOptions
        );

      var parsed =
        await parseResponse(
          response
        );

      APIState.responseReceivedAt =
        nowISO();

      APIState.lastResponse =
        parsed;

      if (!response.ok) {
        APIState.connected =
          false;

        APIState.verified =
          false;

        var httpError =
          extractError(
            parsed
          ) ||
          (
            'HTTP ' +
            response.status +
            ' request failed.'
          );

        APIState.lastError =
          httpError;

        throw new Error(
          httpError
        );
      }

      if (
        !isResponseSuccess(
          parsed
        )
      ) {
        var apiError =
          extractError(
            parsed
          );

        APIState.lastError =
          apiError;

        /*
         * IMPORTANT:
         *
         * Do NOT throw here.
         *
         * The caller receives the actual
         * backend response and can display
         * TRUE/FALSE + full response.
         */

        return parsed;
      }

      /*
       * A successful API request means
       * the endpoint responded correctly.
       */

      APIState.connected =
        true;

      APIState.lastError =
        null;

      return parsed;

    } catch (error) {

      APIState.lastError =
        error &&
        error.message
          ? error.message
          : safeString(error);

      throw error;

    } finally {

      if (timeoutId) {
        clearTimeout(
          timeoutId
        );
      }
    }
  }

  /* ==========================================================
   * 15. GET HEALTH
   * ========================================================== */

  async function testConnection() {
    var url =
      getAPIUrl();

    if (!url) {
      APIState.configured =
        false;

      APIState.connected =
        false;

      APIState.verified =
        false;

      throw new Error(
        'Consolidated API endpoint is not configured.'
      );
    }

    APIState.lastAction =
      'GET_HEALTH';

    APIState.lastModule =
      null;

    APIState.lastError =
      null;

    APIState.requestStartedAt =
      nowISO();

    var controller =
      null;

    var timeoutId =
      null;

    if (
      typeof AbortController !==
      'undefined'
    ) {
      controller =
        new AbortController();

      timeoutId =
        setTimeout(
          function () {
            try {
              controller.abort();
            } catch (error) {
              // Ignore.
            }
          },
          CONFIG.REQUEST_TIMEOUT
        );
    }

    try {
      var options = {
        method:
          'GET'
      };

      if (controller) {
        options.signal =
          controller.signal;
      }

      var response =
        await fetch(
          url,
          options
        );

      var parsed =
        await parseResponse(
          response
        );

      APIState.responseReceivedAt =
        nowISO();

      APIState.lastResponse =
        parsed;

      if (!response.ok) {
        APIState.connected =
          false;

        APIState.verified =
          false;

        var httpError =
          extractError(
            parsed
          );

        APIState.lastError =
          httpError;

        throw new Error(
          httpError
        );
      }

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
        safeString(
          project
        ).trim() ===
        'GoVara';

      APIState.connected =
        true;

      APIState.verified =
        verifiedProject;

      if (!verifiedProject) {
        APIState.lastError =
          'Backend project verification failed.';

        throw new Error(
          'Backend project verification failed.'
        );
      }

      return parsed;

    } catch (error) {

      APIState.connected =
        false;

      APIState.verified =
        false;

      APIState.lastError =
        error &&
        error.message
          ? error.message
          : safeString(error);

      throw error;

    } finally {

      if (timeoutId) {
        clearTimeout(
          timeoutId
        );
      }
    }
  }

  /* ==========================================================
   * 16. GENERIC LIST
   * ========================================================== */

  async function list(
    module
  ) {
    var cleanModule =
      normalizeModule(module);

    validateModule(
      cleanModule
    );

    APIState.lastModule =
      cleanModule;

    return request(
      'LIST',
      {
        module:
          cleanModule
      }
    );
  }

  /* ==========================================================
   * 17. GENERIC GET
   * ========================================================== */

  async function get(
    module,
    id
  ) {
    var cleanModule =
      normalizeModule(module);

    validateModule(
      cleanModule
    );

    if (
      !safeString(id).trim()
    ) {
      throw new Error(
        'Record ID is required.'
      );
    }

    APIState.lastModule =
      cleanModule;

    return request(
      'GET',
      {
        module:
          cleanModule,

        id:
          safeString(id).trim()
      }
    );
  }

  /* ==========================================================
   * 18. GENERIC VALIDATE
   * ========================================================== */

  async function validate(
    module,
    data
  ) {
    var cleanModule =
      normalizeModule(module);

    validateModule(
      cleanModule
    );

    APIState.lastModule =
      cleanModule;

    return request(
      'VALIDATE',
      {
        module:
          cleanModule,

        data:
          data || {}
      }
    );
  }

  /* ==========================================================
   * 19. GENERIC CREATE
   * ========================================================== */

  async function create(
    module,
    data
  ) {
    var cleanModule =
      normalizeModule(module);

    validateModule(
      cleanModule
    );

    APIState.lastModule =
      cleanModule;

    return request(
      'CREATE',
      {
        module:
          cleanModule,

        data:
          data || {}
      }
    );
  }

  /* ==========================================================
   * 20. GENERIC UPDATE
   * ========================================================== */

  async function update(
    module,
    id,
    data
  ) {
    var cleanModule =
      normalizeModule(module);

    validateModule(
      cleanModule
    );

    if (
      !safeString(id).trim()
    ) {
      throw new Error(
        'Record ID is required.'
      );
    }

    APIState.lastModule =
      cleanModule;

    return request(
      'UPDATE',
      {
        module:
          cleanModule,

        id:
          safeString(id).trim(),

        data:
          data || {}
      }
    );
  }

  /* ==========================================================
   * 21. CUSTOMER REGISTER
   * ========================================================== */

  async function customerRegister(
    data
  ) {
    data =
      data || {};

    APIState.lastModule =
      'CUSTOMER';

    return request(
      'CUSTOMER_REGISTER',
      data
    );
  }

  /* ==========================================================
   * 22. CUSTOMER LIST
   *
   * Existing records only.
   * No creation.
   * No database/table creation.
   * ========================================================== */

  async function customerList() {

    APIState.lastAction =
      'LIST';

    APIState.lastModule =
      'CUSTOMER';

    return list(
      'CUSTOMER'
    );
  }

  /* ==========================================================
   * 23. CUSTOMER GET
   * ========================================================== */

  async function customerGet(
    customerId
  ) {
    APIState.lastModule =
      'CUSTOMER';

    return get(
      'CUSTOMER',
      customerId
    );
  }

  /* ==========================================================
   * 24. CUSTOMER VALIDATE
   * ========================================================== */

  async function customerValidate(
    data
  ) {
    APIState.lastModule =
      'CUSTOMER';

    return validate(
      'CUSTOMER',
      data || {}
    );
  }

  /* ==========================================================
   * 25. CUSTOMER CREATE
   * ========================================================== */

  async function customerCreate(
    data
  ) {
    APIState.lastModule =
      'CUSTOMER';

    return create(
      'CUSTOMER',
      data || {}
    );
  }

  /* ==========================================================
   * 26. CUSTOMER UPDATE
   * ========================================================== */

  async function customerUpdate(
    customerId,
    data
  ) {
    APIState.lastModule =
      'CUSTOMER';

    return update(
      'CUSTOMER',
      customerId,
      data || {}
    );
  }

  /* ==========================================================
   * 27. FARE
   * ========================================================== */

  async function fareCalculate(
    data
  ) {
    return request(
      'CALCULATE',
      {
        module:
          'CALCULATION',

        data:
          data || {}
      }
    );
  }

  /* ==========================================================
   * 28. TRANSACTION
   * ========================================================== */

  async function transactionCreate(
    data
  ) {
    return create(
      'TRANSACTION',
      data || {}
    );
  }

  /* ==========================================================
   * 29. WALLET GET
   * ========================================================== */

  async function walletGet(
    data
  ) {
    return request(
      'GET',
      {
        module:
          'TRANSACTION',

        type:
          'WALLET',

        data:
          data || {}
      }
    );
  }

  /* ==========================================================
   * 30. WALLET UPDATE
   * ========================================================== */

  async function walletUpdate(
    data
  ) {
    return {
      success:
        false,

      blocked:
        true,

      error:
        'REAL_MONEY_BLOCKED',

      message:
        'Real money wallet operations are blocked.'
    };
  }

  /* ==========================================================
   * 31. ADMIN GET
   * ========================================================== */

  async function adminGet(
    data
  ) {
    return request(
      'GET',
      {
        module:
          'SYSTEM',

        type:
          'ADMIN',

        data:
          data || {}
      }
    );
  }

  /* ==========================================================
   * 32. ADMIN UPDATE
   * ========================================================== */

  async function adminUpdate(
    data
  ) {
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

  async function auditList(
    data
  ) {
    return list(
      'AUDIT_LOG'
    );
  }

  /* ==========================================================
   * 34. TRAVEL MODULES
   * ========================================================== */

  async function flight(
    data
  ) {
    return request(
      'LIST',
      {
        module:
          'SERVICE',

        serviceCategory:
          'FLIGHT',

        data:
          data || {}
      }
    );
  }

  async function train(
    data
  ) {
    return request(
      'LIST',
      {
        module:
          'SERVICE',

        serviceCategory:
          'TRAIN',

        data:
          data || {}
      }
    );
  }

  async function hotel(
    data
  ) {
    return request(
      'LIST',
      {
        module:
          'SERVICE',

        serviceCategory:
          'HOTEL',

        data:
          data || {}
      }
    );
  }

  /* ==========================================================
   * 35. WELFARE
   * ========================================================== */

  async function welfare(
    data
  ) {
    return request(
      'LIST',
      {
        module:
          'WELFARE',

        data:
          data || {}
      }
    );
  }

  /* ==========================================================
   * 36. LOCATION
   * ========================================================== */

  async function location(
    data
  ) {
    return request(
      'LIST',
      {
        module:
          'LOCATION',

        data:
          data || {}
      }
    );
  }

  /* ==========================================================
   * 37. NOTIFICATION
   * ========================================================== */

  async function notifications(
    data
  ) {
    return request(
      'LIST',
      {
        module:
          'NOTIFICATION',

        data:
          data || {}
      }
    );
  }

  /* ==========================================================
   * 38. AUTHENTICATION
   * ========================================================== */

  async function authentication(
    data
  ) {
    return request(
      'GET',
      {
        module:
          'USER',

        data:
          data || {}
      }
    );
  }

  /* ==========================================================
   * 39. API CONFIGURATION
   * ========================================================== */

  function getConfiguration() {
    return {
      apiUrl:
        getAPIUrl(),

      configured:
        isConfigured(),

      version:
        CONFIG.VERSION,

      environment:
        CONFIG.ENVIRONMENT,

      project:
        CONFIG.PROJECT,

      realMoney:
        CONFIG.REAL_MONEY,

      realPayment:
        CONFIG.REAL_PAYMENT,

      bankTransfer:
        CONFIG.BANK_TRANSFER
    };
  }

  function setAPIEndpoint(
    url
  ) {
    return saveConfiguration(
      url
    );
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
      configured:
        APIState.configured,

      connected:
        APIState.connected,

      verified:
        APIState.verified,

      lastAction:
        APIState.lastAction,

      lastModule:
        APIState.lastModule,

      lastResponse:
        APIState.lastResponse,

      lastError:
        APIState.lastError,

      requestStartedAt:
        APIState.requestStartedAt,

      responseReceivedAt:
        APIState.responseReceivedAt,

      configuration:
        getConfiguration()
    };
  }

  /* ==========================================================
   * 41. MODULE REGISTRY ACCESS
   * ========================================================== */

  function getModules() {
    return MODULES.slice();
  }

  function getModule(
    module
  ) {
    var cleanModule =
      normalizeModule(module);

    if (!cleanModule) {
      return null;
    }

    return (
      ModuleRegistry[
        cleanModule
      ] || null
    );
  }

  /* ==========================================================
   * 42. DIAGNOSTICS
   * ========================================================== */

  function diagnostics() {
    return {
      success:
        true,

      project:
        CONFIG.PROJECT,

      version:
        CONFIG.VERSION,

      environment:
        CONFIG.ENVIRONMENT,

      configured:
        isConfigured(),

      connected:
        APIState.connected,

      verified:
        APIState.verified,

      endpoint:
        isConfigured()
          ? getAPIUrl()
          : '',

      moduleCount:
        MODULES.length,

      modules:
        MODULES.slice(),

      customer: {
        module:
          CUSTOMER_CONTRACT.MODULE,

        table:
          CUSTOMER_CONTRACT.BACKEND_TABLE,

        userTable:
          CUSTOMER_CONTRACT.USER_TABLE,

        registrationEnabled:
          true
      },

      safety: {
        realMoney:
          'BLOCKED',

        realPayment:
          'BLOCKED',

        bankTransfer:
          'BLOCKED'
      },

      lastAction:
        APIState.lastAction,

      lastModule:
        APIState.lastModule,

      lastError:
        APIState.lastError
    };
  }

  /* ==========================================================
   * 43. CUSTOMER LIST RESPONSE HELPERS
   * ========================================================== */

  function extractCustomerRows(
    response
  ) {
    if (!response) {
      return [];
    }

    var result =
      response.result;

    /*
     * result directly as array
     */
    if (
      Array.isArray(result)
    ) {
      return result;
    }

    /*
     * result.data
     */
    if (
      result &&
      Array.isArray(
        result.data
      )
    ) {
      return result.data;
    }

    /*
     * result.rows
     */
    if (
      result &&
      Array.isArray(
        result.rows
      )
    ) {
      return result.rows;
    }

    /*
     * result.customers
     */
    if (
      result &&
      Array.isArray(
        result.customers
      )
    ) {
      return result.customers;
    }

    /*
     * result.data.rows
     */
    if (
      result &&
      result.data &&
      Array.isArray(
        result.data.rows
      )
    ) {
      return result.data.rows;
    }

    /*
     * result.data.customers
     */
    if (
      result &&
      result.data &&
      Array.isArray(
        result.data.customers
      )
    ) {
      return result.data.customers;
    }

    /*
     * response.data
     */
    if (
      Array.isArray(
        response.data
      )
    ) {
      return response.data;
    }

    /*
     * response.rows
     */
    if (
      Array.isArray(
        response.rows
      )
    ) {
      return response.rows;
    }

    /*
     * response.customers
     */
    if (
      Array.isArray(
        response.customers
      )
    ) {
      return response.customers;
    }

    /*
     * response.data.rows
     */
    if (
      response.data &&
      Array.isArray(
        response.data.rows
      )
    ) {
      return response.data.rows;
    }

    /*
     * response.data.customers
     */
    if (
      response.data &&
      Array.isArray(
        response.data.customers
      )
    ) {
      return response.data.customers;
    }

    return [];
  }

  /* ==========================================================
   * 44. HTML ESCAPE
   * ========================================================== */

  function escapeHTML(
    value
  ) {
    return safeString(value)
      .replace(
        /&/g,
        '&amp;'
      )
      .replace(
        /</g,
        '&lt;'
      )
      .replace(
        />/g,
        '&gt;'
      )
      .replace(
        /"/g,
        '&quot;'
      )
      .replace(
        /'/g,
        '&#39;'
      );
  }

  /* ==========================================================
   * 45. JSON DISPLAY HELPER
   * ========================================================== */

  function formatResponse(
    response
  ) {
    try {
      return JSON.stringify(
        response,
        null,
        2
      );
    } catch (error) {
      return safeString(
        response
      );
    }
  }

  /* ==========================================================
   * 46. CUSTOMER LIST RENDERER
   * ========================================================== */

  function renderCustomerList(
    container,
    response
  ) {
    var box =
      container.querySelector(
        '#govara-step27-customer-list'
      );

    var status =
      container.querySelector(
        '#govara-step27-customer-status'
      );

    var count =
      container.querySelector(
        '#govara-step27-customer-count'
      );

    var resultBox =
      container.querySelector(
        '#govara-step27-customer-result'
      );

    var rows =
      extractCustomerRows(
        response
      );

    /*
     * Always show raw response.
     */
    if (resultBox) {
      resultBox.textContent =
        formatResponse(
          response
        );
    }

    /*
     * Customer count.
     */
    if (count) {
      count.textContent =
        'Total Customers: ' +
        rows.length;
    }

    if (!box) {
      return;
    }

    /*
     * Backend/API explicitly returned false.
     */
    if (
      response &&
      response.success === false
    ) {
      var errorMessage =
        extractError(
          response
        );

      box.innerHTML =
        '<div style="padding:12px 0;">' +
        '<strong>ERROR</strong>' +
        '<div class="muted" style="margin-top:6px;">' +
        escapeHTML(
          errorMessage
        ) +
        '</div>' +
        '</div>';

      if (status) {
        status.textContent =
          'ERROR — ' +
          errorMessage;
      }

      return;
    }

    /*
     * No records.
     */
    if (!rows.length) {

      box.innerHTML =
        '<div class="muted" style="padding:12px 0;">' +
        'API request completed, but no customer records were returned.' +
        '</div>';

      if (status) {
        status.textContent =
          'SUCCESS — 0 customer records returned.';
      }

      return;
    }

    /*
     * Discover columns dynamically.
     */
    var columns = [];

    rows.forEach(
      function (row) {

        if (
          row &&
          typeof row ===
            'object' &&
          !Array.isArray(row)
        ) {

          Object.keys(row)
            .forEach(
              function (key) {

                if (
                  columns.indexOf(
                    key
                  ) === -1
                ) {
                  columns.push(
                    key
                  );
                }

              }
            );
        }

      }
    );

    /*
     * Unsupported format.
     */
    if (!columns.length) {

      box.innerHTML =
        '<div class="muted" style="padding:12px 0;">' +
        'Customer data returned, but table format is not supported yet.' +
        '</div>';

      if (status) {
        status.textContent =
          'SUCCESS — ' +
          rows.length +
          ' records returned.';
      }

      return;
    }

    /*
     * Build table.
     */
    var html =
      '<div style="overflow:auto;">' +
      '<table style="' +
      'width:100%;' +
      'border-collapse:collapse;' +
      'min-width:700px;' +
      '">';

    /*
     * Header.
     */
    html +=
      '<thead><tr>';

    columns.forEach(
      function (col) {

        html +=
          '<th style="' +
          'text-align:left;' +
          'padding:10px;' +
          'border-bottom:1px solid #ddd;' +
          'white-space:nowrap;' +
          'font-weight:700;' +
          '">' +
          escapeHTML(
            col
          ) +
          '</th>';

      }
    );

    html +=
      '</tr></thead>';

    /*
     * Body.
     */
    html +=
      '<tbody>';

    rows.forEach(
      function (row) {

        html +=
          '<tr>';

        columns.forEach(
          function (col) {

            var value =
              row &&
              row[col] !==
                undefined
                ? row[col]
                : '';

            /*
             * If backend returns an
             * object/array as a cell,
             * show readable JSON.
             */
            if (
              value &&
              typeof value ===
                'object'
            ) {
              try {
                value =
                  JSON.stringify(
                    value
                  );
              } catch (error) {
                value =
                  String(
                    value
                  );
              }
            }

            html +=
              '<td style="' +
              'padding:10px;' +
              'border-bottom:1px solid #eee;' +
              'white-space:nowrap;' +
              '">' +
              escapeHTML(
                value
              ) +
              '</td>';

          }
        );

        html +=
          '</tr>';

      }
    );

    html +=
      '</tbody></table></div>';

    box.innerHTML =
      html;

    if (status) {
      status.textContent =
        'SUCCESS — ' +
        rows.length +
        ' customer records loaded.';
    }
  }

  /* ==========================================================
   * 47. FRONTEND RENDER
   *
   * No automatic API request.
   * ========================================================== */

  function render(
    container
  ) {
    var target =
      container;

    if (
      typeof target ===
      'string'
    ) {
      target =
        document.querySelector(
          target
        );
    }

    if (!target) {
      return false;
    }

    target.innerHTML = `
      <div class="govara-step27-panel">

        <div class="govara-step27-header">

          <div>

            <div style="
              font-size:12px;
              font-weight:700;
              letter-spacing:1px;
              opacity:.7;
              margin-bottom:6px;
            ">
              STEP 27
            </div>

            <h2 style="margin:0;">
              Consolidated API
            </h2>

            <p style="margin:6px 0 0;">
              ONE Frontend API Boundary
            </p>

          </div>

          <div class="govara-step27-status-box">

            <span id="govara-step27-status">
              NOT CONFIGURED
            </span>

          </div>

        </div>

        <!-- ==================================================
             API CONFIGURATION
             ================================================== -->

        <div class="govara-step27-card">

          <h3>
            API Configuration
          </h3>

          <div class="muted">
            Configure the single GoVara Consolidated API endpoint.
          </div>

          <label
            for="govara-step27-endpoint"
            style="
              display:block;
              margin-top:16px;
              margin-bottom:7px;
              font-weight:600;
            "
          >
            Consolidated API Endpoint
          </label>

          <input
            id="govara-step27-endpoint"
            type="url"
            autocomplete="off"
            placeholder="https://script.google.com/macros/s/.../exec"
            style="
              width:100%;
              box-sizing:border-box;
              padding:12px 14px;
              border-radius:8px;
              border:1px solid #ccc;
            "
          />

          <div
            class="govara-step27-actions"
            style="
              display:flex;
              flex-wrap:wrap;
              gap:10px;
              margin-top:14px;
            "
          >

            <button
              type="button"
              id="govara-step27-validate"
            >
              Validate Endpoint
            </button>

            <button
              type="button"
              id="govara-step27-save"
            >
              Save API Configuration
            </button>

            <button
              type="button"
              id="govara-step27-clear"
            >
              Clear API
            </button>

          </div>

        </div>

        <!-- ==================================================
             API CONNECTION TEST
             ================================================== -->

        <div class="govara-step27-card">

          <h3>
            API Connection Test
          </h3>

          <div
            class="muted"
            style="margin-bottom:14px;"
          >
            Run the API health check manually.
            No automatic API request is made on page load.
          </div>

          <button
            type="button"
            id="govara-step27-test"
          >
            Test Connection
          </button>

        </div>

        <!-- ==================================================
             CUSTOMER DATABASE CHECK
             ================================================== -->

        <div class="govara-step27-card">

          <h3>
            Customer Database Check
          </h3>

          <div class="muted">
            Read existing customers through the
            GoVara Consolidated API.
          </div>

          <div
            style="
              display:flex;
              align-items:center;
              flex-wrap:wrap;
              gap:12px;
              margin-top:14px;
            "
          >

            <button
              type="button"
              id="govara-step27-load-customers"
            >
              Load Customer List
            </button>

            <strong
              id="govara-step27-customer-count"
            >
              Total Customers: —
            </strong>

          </div>

          <div
            id="govara-step27-customer-status"
            class="muted"
            style="
              margin-top:12px;
              min-height:20px;
            "
          >
            Customer list has not been loaded.
          </div>

          <div
            id="govara-step27-customer-list"
            style="
              margin-top:14px;
              overflow-x:auto;
            "
          >
          </div>

          <!-- ==================================================
               CUSTOMER API RESPONSE / DEBUG RESULT
               ================================================== -->

          <div
            style="
              margin-top:16px;
            "
          >

            <div
              style="
                font-weight:700;
                margin-bottom:8px;
              "
            >
              Customer API Response
            </div>

            <pre
              id="govara-step27-customer-result"
              style="
                margin:0;
                padding:14px;
                min-height:60px;
                max-height:420px;
                overflow:auto;
                white-space:pre-wrap;
                word-break:break-word;
                box-sizing:border-box;
                border-radius:8px;
                background:rgba(0,0,0,.035);
                border:1px solid rgba(0,0,0,.08);
                font-size:12px;
                line-height:1.5;
              "
            >Customer list request has not been run.</pre>

          </div>

        </div>

        <!-- ==================================================
             API STATUS
             ================================================== -->

        <div class="govara-step27-card">

          <h3>
            API Status
          </h3>

          <div
            style="
              display:grid;
              grid-template-columns:
                repeat(auto-fit,minmax(160px,1fr));
              gap:12px;
              margin-top:14px;
            "
          >

            <div class="govara-step27-info">

              <div class="muted">
                Configured
              </div>

              <strong
                id="govara-step27-configured"
              >
                NO
              </strong>

            </div>

            <div class="govara-step27-info">

              <div class="muted">
                Connected
              </div>

              <strong
                id="govara-step27-connected"
              >
                NO
              </strong>

            </div>

            <div class="govara-step27-info">

              <div class="muted">
                Verified
              </div>

              <strong
                id="govara-step27-verified"
              >
                NO
              </strong>

            </div>

            <div class="govara-step27-info">

              <div class="muted">
                Environment
              </div>

              <strong
                id="govara-step27-environment"
              >
                TESTING
              </strong>

            </div>

          </div>

        </div>

        <!-- ==================================================
             TEST RESULT
             ================================================== -->

        <div class="govara-step27-card">

          <h3>
            Test Result
          </h3>

          <div
            id="govara-step27-diagnostics"
            style="
              margin-top:12px;
              min-height:70px;
              padding:14px;
              border-radius:8px;
              background:rgba(0,0,0,.035);
              white-space:pre-wrap;
              word-break:break-word;
            "
          >
            API test has not been run.
          </div>

        </div>

        <!-- ==================================================
             LAST API ACTIVITY
             ================================================== -->

        <div class="govara-step27-card">

          <h3>
            Last API Activity
          </h3>

          <div
            style="
              display:grid;
              grid-template-columns:
                repeat(auto-fit,minmax(180px,1fr));
              gap:12px;
              margin-top:14px;
            "
          >

            <div class="govara-step27-info">

              <div class="muted">
                Last Action
              </div>

              <strong
                id="govara-step27-last-action"
              >
                —
              </strong>

            </div>

            <div class="govara-step27-info">

              <div class="muted">
                Last Module
              </div>

              <strong
                id="govara-step27-last-module"
              >
                —
              </strong>

            </div>

            <div class="govara-step27-info">

              <div class="muted">
                Last Error
              </div>

              <strong
                id="govara-step27-last-error"
              >
                —
              </strong>

            </div>

          </div>

        </div>

        <!-- ==================================================
             CONSOLIDATED API CONTRACT
             ================================================== -->

        <div class="govara-step27-card">

          <h3>
            Consolidated API Contract
          </h3>

          <div
            class="muted"
            style="margin:8px 0 14px;"
          >
            Single API boundary for GoVara frontend modules.
          </div>

          <div
            style="
              display:flex;
              flex-wrap:wrap;
              gap:8px;
            "
          >

            <span class="govara-step27-contract">
              GET_HEALTH
            </span>

            <span class="govara-step27-contract">
              LIST
            </span>

            <span class="govara-step27-contract">
              GET
            </span>

            <span class="govara-step27-contract">
              VALIDATE
            </span>

            <span class="govara-step27-contract">
              CREATE
            </span>

            <span class="govara-step27-contract">
              UPDATE
            </span>

            <span class="govara-step27-contract">
              CUSTOMER_REGISTER
            </span>

          </div>

        </div>

        <!-- ==================================================
             SAFETY BOUNDARY
             ================================================== -->

        <div class="govara-step27-card">

          <h3>
            Safety Boundary
          </h3>

          <div
            style="
              margin-top:12px;
              line-height:1.8;
            "
          >

            <div>
              Real Money:
              <strong>BLOCKED</strong>
            </div>

            <div>
              Real Payment:
              <strong>BLOCKED</strong>
            </div>

            <div>
              Bank Transfer:
              <strong>BLOCKED</strong>
            </div>

          </div>

          <div
            class="muted"
            style="margin-top:12px;"
          >
            Backend remains authoritative for financial
            and business truth.
          </div>

        </div>

      </div>
    `;

    var endpointInput =
      target.querySelector(
        '#govara-step27-endpoint'
      );

    var savedURL =
      getAPIUrl();

    if (endpointInput) {
      endpointInput.value =
        savedURL || '';
    }

    bindRenderEvents(
      target
    );

    refreshStep27Status(
      target
    );

    return true;
  }

  /* ==========================================================
   * 48. STEP 27 STATUS REFRESH
   * ========================================================== */

  function refreshStep27Status(
    target
  ) {
    if (!target) {
      return;
    }

    var status =
      target.querySelector(
        '#govara-step27-status'
      );

    var configured =
      target.querySelector(
        '#govara-step27-configured'
      );

    var connected =
      target.querySelector(
        '#govara-step27-connected'
      );

    var verified =
      target.querySelector(
        '#govara-step27-verified'
      );

    var environment =
      target.querySelector(
        '#govara-step27-environment'
      );

    var lastAction =
      target.querySelector(
        '#govara-step27-last-action'
      );

    var lastModule =
      target.querySelector(
        '#govara-step27-last-module'
      );

    var lastError =
      target.querySelector(
        '#govara-step27-last-error'
      );

    if (configured) {
      configured.textContent =
        APIState.configured
          ? 'YES'
          : 'NO';
    }

    if (connected) {
      connected.textContent =
        APIState.connected
          ? 'YES'
          : 'NO';
    }

    if (verified) {
      verified.textContent =
        APIState.verified
          ? 'YES'
          : 'NO';
    }

    if (environment) {
      environment.textContent =
        CONFIG.ENVIRONMENT ||
        'TESTING';
    }

    if (lastAction) {
      lastAction.textContent =
        APIState.lastAction ||
        '—';
    }

    if (lastModule) {
      lastModule.textContent =
        APIState.lastModule ||
        '—';
    }

    if (lastError) {
      lastError.textContent =
        APIState.lastError ||
        '—';
    }

    if (status) {

      if (
        APIState.verified
      ) {
        status.textContent =
          'VERIFIED';

      } else if (
        APIState.connected
      ) {
        status.textContent =
          'CONNECTED';

      } else if (
        APIState.configured
      ) {
        status.textContent =
          'CONFIGURED';

      } else {
        status.textContent =
          'NOT CONFIGURED';
      }
    }
  }

  /* ==========================================================
   * 49. RENDERED STATUS
   * ========================================================== */

  function updateRenderedStatus(
    container
  ) {
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

      if (
        !APIState.configured
      ) {
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

    refreshStep27Status(
      container
    );
  }

  /* ==========================================================
   * 50. CUSTOMER ACTIVITY RESULT DISPLAY
   *
   * Keeps Customer List result separate
   * from GET_HEALTH Test Result.
   * ========================================================== */

  function updateCustomerActivityDisplay(
    container,
    response
  ) {
    if (!container) {
      return;
    }

    var status =
      container.querySelector(
        '#govara-step27-customer-status'
      );

    var resultBox =
      container.querySelector(
        '#govara-step27-customer-result'
      );

    if (resultBox) {
      resultBox.textContent =
        formatResponse(
          response
        );
    }

    if (status) {

      if (
        response &&
        response.success ===
          true
      ) {
        status.textContent =
          'TRUE — Customer API request succeeded.';

      } else {
        status.textContent =
          'FALSE — Customer API returned an unsuccessful response.';
      }
    }

    refreshStep27Status(
      container
    );
  }

  /* ==========================================================
   * 51. RENDER EVENT BINDING
   *
   * Customer List:
   *
   * Button
   *   ↓
   * customerList()
   *   ↓
   * LIST
   *   ↓
   * CUSTOMER
   *   ↓
   * Existing backend/database
   *
   * No automatic request.
   * ========================================================== */

  function bindRenderEvents(
    container
  ) {
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

    /* ========================================================
     * SAVE API CONFIGURATION
     * ======================================================== */

    if (saveButton) {

      saveButton.addEventListener(
        'click',
        function () {

          var url =
            endpointInput
              ? endpointInput.value.trim()
              : '';

          saveConfiguration(
            url
          );

          updateRenderedStatus(
            container
          );
        }
      );
    }

    /* ========================================================
     * CLEAR API CONFIGURATION
     * ======================================================== */

    if (clearButton) {

      clearButton.addEventListener(
        'click',
        function () {

          clearConfiguration();

          if (endpointInput) {
            endpointInput.value =
              '';
          }

          updateRenderedStatus(
            container
          );
        }
      );
    }

    /* ========================================================
     * VALIDATE ENDPOINT
     * ======================================================== */

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

            updateRenderedStatus(
              container
            );

            return;
          }

          saveConfiguration(
            url
          );

          try {

            await testConnection();

          } catch (error) {

            console.error(
              '[GoVara STEP 27] API validation failed:',
              error
            );
          }

          updateRenderedStatus(
            container
          );
        }
      );
    }

    /* ========================================================
 * CUSTOMER LIST
 *
 * STEP 27 CUSTOMER LIST UI FIX
 *
 * IMPORTANT:
 * - Backend unchanged.
 * - Database unchanged.
 * - Existing customerList() API unchanged.
 * - Button uses direct onclick binding.
 * - Immediate click feedback is shown.
 * ======================================================== */

    var customerLoadButton =
      container.querySelector(
        '#govara-step27-load-customers'
      );

    if (customerLoadButton) {

      /*
       * Remove any previously assigned onclick
       * before assigning the current handler.
       */

      customerLoadButton.onclick = null;

      customerLoadButton.onclick =
        async function () {

          var button =
            this;

          var customerStatus =
            container.querySelector(
              '#govara-step27-customer-status'
            );

          var customerListBox =
            container.querySelector(
              '#govara-step27-customer-list'
            );

          var customerResultBox =
            container.querySelector(
              '#govara-step27-customer-result'
            );

          /*
           * IMPORTANT:
           * This message appears BEFORE the API call.
           * Therefore, if you see this message,
           * the button itself is definitely working.
           */

          console.log(
            '[GoVara STEP 27] CUSTOMER LIST BUTTON CLICKED'
          );

          /*
           * Clear previous error.
           */

          APIState.lastError =
            null;

          APIState.lastAction =
            'LIST';

          APIState.lastModule =
            'CUSTOMER';

          /*
           * Immediate visible feedback.
           */

          if (customerStatus) {

            customerStatus.textContent =
              'BUTTON CLICKED — Requesting Customer List...';

          }

          if (customerListBox) {

            customerListBox.innerHTML =
              '<div style="padding:12px 0;">' +
              '<strong>REQUESTING...</strong>' +
              '<div class="muted" style="margin-top:6px;">' +
              'Calling LIST / CUSTOMER through Consolidated API...' +
              '</div>' +
              '</div>';

          }

          if (customerResultBox) {

            customerResultBox.textContent =
              'REQUEST STARTED\n\n' +
              'Action: LIST\n' +
              'Module: CUSTOMER\n' +
              'Status: REQUESTING\n' +
              'Time: ' +
              nowISO();

          }

          /*
           * Prevent duplicate clicks.
           */

          button.disabled =
            true;

          var originalButtonText =
            button.textContent;

          button.textContent =
            'Loading...';

          try {

            console.log(
              '[GoVara STEP 27] CUSTOMER LIST REQUEST STARTED'
            );

            /*
             * Actual existing API call.
             *
             * This function is already proven
             * working from browser console.
             */

            var response =
              await customerList();

            /*
             * Keep complete response.
             */

            APIState.lastResponse =
              response;

            /*
             * Determine success.
             */

            var success =
              isResponseSuccess(
                response
              );

            console.log(
              '[GoVara STEP 27] CUSTOMER LIST RESPONSE:',
              response
            );

            /*
             * Render customer table.
             */

            if (success) {

              renderCustomerList(
                container,
                response
              );

            }

            /*
             * TRUE / FALSE result.
             */

            if (customerStatus) {

              if (success) {

                var loadedRows =
                  extractCustomerRows(
                    response
                  );

                customerStatus.textContent =
                  'TRUE — ' +
                  loadedRows.length +
                  ' customer records loaded successfully.';

              } else {

                customerStatus.textContent =
                  'FALSE — Customer List API returned an error: ' +
                  extractError(
                    response
                  );

              }

            }

            /*
             * Successful API response.
             */

            if (success) {

              APIState.connected =
                true;

              APIState.lastError =
                null;

            } else {

              APIState.lastError =
                extractError(
                  response
                );

            }

            /*
             * Always show complete API response.
             */

            if (customerResultBox) {

              customerResultBox.textContent =
                JSON.stringify(
                  response,
                  null,
                  2
                );

            }

            /*
             * If API itself returned FALSE,
             * show a visible error in the list area.
             */

            if (!success &&
                customerListBox) {

              customerListBox.innerHTML =
                '<div style="padding:12px 0;">' +

                '<strong>FALSE — Customer List Failed</strong>' +

                '<div class="muted" style="margin-top:6px;">' +

                escapeHTML(
                  extractError(
                    response
                  )
                ) +

                '</div>' +

                '</div>';

            }

            /*
             * Update activity information.
             */

            updateCustomerActivityDisplay(
              container,
              response
            );

            console.log(
              '[GoVara STEP 27] CUSTOMER LIST REQUEST FINISHED',
              {
                success:
                  success,

                count:
                  success
                    ? extractCustomerRows(
                        response
                      ).length
                    : 0
              }
            );

          } catch (error) {

            /*
             * JavaScript / network / API exception.
             */

            APIState.lastError =
              error &&
              error.message
                ? error.message
                : safeString(
                    error
                  );

            console.error(
              '[GoVara STEP 27] CUSTOMER LIST ERROR:',
              error
            );

            /*
             * Visible error status.
             */

            if (customerStatus) {

              customerStatus.textContent =
                'ERROR — ' +
                APIState.lastError;

            }

            /*
             * Visible list error.
             */

            if (customerListBox) {

              customerListBox.innerHTML =
                '<div style="padding:12px 0;">' +

                '<strong>ERROR — Unable to load customer list.</strong>' +

                '<div class="muted" style="margin-top:6px;">' +

                escapeHTML(
                  APIState.lastError
                ) +

                '</div>' +

                '</div>';

            }

            /*
             * Visible raw error response.
             */

            if (customerResultBox) {

              customerResultBox.textContent =
                JSON.stringify(
                  {
                    success:
                      false,

                    action:
                      'LIST',

                    module:
                      'CUSTOMER',

                    error:
                      APIState.lastError,

                    timestamp:
                      nowISO()

                  },
                  null,
                  2
                );

            }

          } finally {

            /*
             * Restore button.
             */

            button.disabled =
              false;

            button.textContent =
              originalButtonText;

            /*
             * Update Last API Activity.
             */

            refreshStep27Status(
              container
            );

            console.log(
              '[GoVara STEP 27] CUSTOMER LIST BUTTON READY AGAIN'
            );

          }

        };

      /*
       * Confirm binding in Console.
       */

      console.log(
        '[GoVara STEP 27] Customer List button successfully bound.',
        customerLoadButton
      );

    } else {

      /*
       * Button missing from rendered HTML.
       */

      console.error(
        '[GoVara STEP 27] Customer List button NOT FOUND:',
        '#govara-step27-load-customers'
      );

    }
    /* ========================================================
     * TEST CONNECTION
     * ======================================================== */

    var testButton =
      container.querySelector(
        '#govara-step27-test'
      );

    if (testButton) {

      testButton.addEventListener(
        'click',
        async function () {

          var diagnosticsBox =
            container.querySelector(
              '#govara-step27-diagnostics'
            );

          if (diagnosticsBox) {
            diagnosticsBox.textContent =
              'Testing Consolidated API...';
          }

          try {

            var result =
              await testConnection();

            if (diagnosticsBox) {

              diagnosticsBox.textContent =
                typeof result ===
                'string'
                  ? result
                  : JSON.stringify(
                      result,
                      null,
                      2
                    );
            }

          } catch (error) {

            APIState.lastError =
              error &&
              error.message
                ? error.message
                : String(
                    error
                  );

            if (diagnosticsBox) {

              diagnosticsBox.textContent =
                'API TEST FAILED\n\n' +
                APIState.lastError;
            }
          }

          refreshStep27Status(
            container
          );
        }
      );
    }
  }

  /* ==========================================================
   * 52. RENDER + BIND
   * ========================================================== */

  function renderAndBind(
    container
  ) {
    return render(
      container
    );
  }

  /* ==========================================================
   * 53. PUBLIC API
   * ========================================================== */

  var GoVaraAPI = {

    /*
     * Core
     */

    request:
      request,

    testConnection:
      testConnection,

    /*
     * Configuration
     */

    getAPIUrl:
      getAPIUrl,

    getAPIEndpoint:
      getAPIEndpoint,

    setAPIEndpoint:
      setAPIEndpoint,

    clearAPIEndpoint:
      clearAPIEndpoint,

    getConfiguration:
      getConfiguration,

    /*
     * State
     */

    getState:
      getState,

    diagnostics:
      diagnostics,

    /*
     * Modules
     */

    getModules:
      getModules,

    getModule:
      getModule,

    /*
     * Generic
     */

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

    /*
     * Customer
     */

    customerRegister:
      customerRegister,

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

    /*
     * Fare
     */

    fareCalculate:
      fareCalculate,

    /*
     * Transaction
     */

    transactionCreate:
      transactionCreate,

    /*
     * Wallet
     */

    walletGet:
      walletGet,

    walletUpdate:
      walletUpdate,

    /*
     * Admin
     */

    adminGet:
      adminGet,

    adminUpdate:
      adminUpdate,

    /*
     * Audit
     */

    auditList:
      auditList,

    /*
     * Travel
     */

    flight:
      flight,

    train:
      train,

    hotel:
      hotel,

    /*
     * Other modules
     */

    welfare:
      welfare,

    location:
      location,

    notifications:
      notifications,

    authentication:
      authentication,

    /*
     * UI
     */

    render:
      render,

    renderAndBind:
      renderAndBind
  };

  /* ==========================================================
   * 54. STEP 27 PUBLIC OBJECT
   * ========================================================== */

  var GoVara27 = {

    VERSION:
      CONFIG.VERSION,

    CONFIG:
      CONFIG,

    STATE:
      APIState,

    MODULES:
      MODULES,

    ModuleRegistry:
      ModuleRegistry,

    CUSTOMER_CONTRACT:
      CUSTOMER_CONTRACT,

    APIState:
      APIState,

    /*
     * Configuration
     */

    getAPIUrl:
      getAPIUrl,

    setAPIEndpoint:
      setAPIEndpoint,

    getAPIEndpoint:
      getAPIEndpoint,

    clearAPIEndpoint:
      clearAPIEndpoint,

    getConfiguration:
      getConfiguration,

    /*
     * API
     */

    request:
      request,

    testConnection:
      testConnection,

    /*
     * Generic
     */

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

    /*
     * Customer
     */

    customerRegister:
      customerRegister,

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

    /*
     * Business
     */

    fareCalculate:
      fareCalculate,

    transactionCreate:
      transactionCreate,

    walletGet:
      walletGet,

    walletUpdate:
      walletUpdate,

    /*
     * Admin
     */

    adminGet:
      adminGet,

    adminUpdate:
      adminUpdate,

    auditList:
      auditList,

    /*
     * Travel
     */

    flight:
      flight,

    train:
      train,

    hotel:
      hotel,

    /*
     * Other
     */

    welfare:
      welfare,

    location:
      location,

    notifications:
      notifications,

    authentication:
      authentication,

    /*
     * Diagnostics
     */

    getState:
      getState,

    diagnostics:
      diagnostics,

    getModules:
      getModules,

    getModule:
      getModule,

    /*
     * UI
     */

    render:
      render,

    renderAndBind:
      renderAndBind
  };

  /* ==========================================================
   * 55. GLOBAL REGISTRIES
   *
   * Preserve compatibility with existing frontend.
   * ========================================================== */

  window.GoVaraAPI =
    GoVaraAPI;

  window.GoVara27 =
    GoVara27;

  window.GoVaraModules =
    window.GoVaraModules ||
    {};

  window.GoVaraModules['27'] =
    GoVara27;

  window.GoVaraModules['27-api'] =
    GoVara27;

  window.GoVaraModules['STEP 27'] =
    GoVara27;

  window.GoVaraModuleRegistry =
    window.GoVaraModuleRegistry ||
    {};

  window.GoVaraModuleRegistry['27'] =
    GoVara27;

  window.GoVaraModuleRegistry['27-api'] =
    GoVara27;

  window.GoVaraModuleRegistry['STEP 27'] =
    GoVara27;

  /* ==========================================================
   * 56. INITIAL CONFIGURATION LOAD
   *
   * IMPORTANT:
   * Only local configuration is loaded.
   * NO API REQUEST is made automatically.
   * ========================================================== */

  loadSavedConfiguration();

  /* ==========================================================
   * 57. CONSOLE STATUS
   * ========================================================== */

  console.log(
    '[GoVara STEP 27] Consolidated API loaded.',
    {
      version:
        CONFIG.VERSION,

      configured:
        APIState.configured,

      environment:
        CONFIG.ENVIRONMENT,

      realMoney:
        CONFIG.REAL_MONEY,

      realPayment:
        CONFIG.REAL_PAYMENT,

      bankTransfer:
        CONFIG.BANK_TRANSFER
    }
  );

})(window, document);
