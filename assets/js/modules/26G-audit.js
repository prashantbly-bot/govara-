/* ============================================================
   GoVara — 26G AUDIT & MONITORING CONTROL CENTER
   VERSION: GOVARA-26G-V1

   Purpose:
   - Complete Administrator Audit & Monitoring
   - Activity Audit
   - Security Audit
   - KYC / Document Audit
   - Booking / Operations Audit
   - Financial Event Audit
   - Permission / Role Audit
   - Configuration Audit
   - API Audit
   - Error / Exception Audit
   - Login / Authentication Audit
   - Notification Audit
   - Search / Filter / Sorting
   - Severity
   - Status
   - Actor / Role / Module / Action
   - Entity / Entity ID
   - Timestamp
   - IP / Device metadata placeholders
   - Correlation / Request ID
   - Before / After values
   - Reason / Comment
   - Retention controls
   - Local testing audit
   - Backend authority boundary

   IMPORTANT:
   Frontend audit is NOT authoritative.
   Backend remains authoritative audit source.
   Database remains authoritative persistent store.
   ============================================================ */

window.GoVara26G = (function () {

  "use strict";


  /* ============================================================
     CONSTANTS
     ============================================================ */

  const VERSION =
    "GOVARA-26G-V1";

  const STORAGE_KEY =
    "GOVARA_AUDIT_MONITORING_CONTROL_26G_V1";

  const EVENTS_KEY =
    "GOVARA_AUDIT_EVENTS_26G_V1";

  const SESSION_KEY =
    "GOVARA_AUDIT_SESSION_26G_V1";

  const MAX_LOCAL_EVENTS =
    1000;


  /* ============================================================
     DEFAULT CONFIGURATION
     ============================================================ */

  const DEFAULT_CONFIG = {

    environment: {

      mode: "TESTING",

      frontendOnly: true,

      backendRequired: true,

      databaseRequired: true

    },


    /* ----------------------------------------------------------
       AUTHORITY
       ---------------------------------------------------------- */

    authority: {

      frontendAuthority: false,

      backendAuthority: true,

      databaseAuthority: true,

      backendAuditRequired: true,

      frontendAuditIsLocalOnly: true,

      frontendCannotDeleteAuthoritativeAudit: true,

      frontendCannotModifyAuthoritativeAudit: true,

      frontendCannotOverrideBackendAudit: true

    },


    /* ----------------------------------------------------------
       AUDIT SYSTEM
       ---------------------------------------------------------- */

    auditSystem: {

      enabled: true,

      eventLoggingEnabled: true,

      activityLoggingEnabled: true,

      securityLoggingEnabled: true,

      configurationLoggingEnabled: true,

      workflowLoggingEnabled: true,

      financialEventLoggingEnabled: true,

      authenticationLoggingEnabled: true,

      APIEventLoggingEnabled: true,

      errorLoggingEnabled: true,

      notificationLoggingEnabled: true,

      permissionLoggingEnabled: true,

      KYCLoggingEnabled: true,

      documentLoggingEnabled: true,

      operationalLoggingEnabled: true

    },


    /* ----------------------------------------------------------
       ACTOR TYPES
       ---------------------------------------------------------- */

    actorTypes: {

      Admin: true,

      Customer: true,

      Vendor: true,

      Driver: true,

      System: true,

      Backend: true,

      API: true,

      Unknown: true

    },


    /* ----------------------------------------------------------
       MODULES
       ---------------------------------------------------------- */

    modules: {

      System: true,

      Customer: true,

      Vendor: true,

      Driver: true,

      Vehicle: true,

      Booking: true,

      Duty: true,

      Fare: true,

      Transaction: true,

      Wallet: true,

      Ledger: true,

      Settlement: true,

      Billing: true,

      Documents: true,

      KYC: true,

      Admin: true,

      Audit: true,

      Notification: true,

      Authentication: true,

      API: true,

      Security: true

    },


    /* ----------------------------------------------------------
       EVENT CATEGORIES
       ---------------------------------------------------------- */

    categories: {

      AUTHENTICATION: true,

      AUTHORIZATION: true,

      SECURITY: true,

      USER: true,

      ROLE: true,

      PERMISSION: true,

      CONFIGURATION: true,

      DOCUMENT: true,

      KYC: true,

      BOOKING: true,

      OPERATIONS: true,

      DUTY: true,

      VEHICLE: true,

      FARE: true,

      TRANSACTION: true,

      WALLET: true,

      LEDGER: true,

      SETTLEMENT: true,

      BILLING: true,

      NOTIFICATION: true,

      API: true,

      ERROR: true,

      SYSTEM: true,

      ADMIN: true

    },


    /* ----------------------------------------------------------
       SEVERITY
       ---------------------------------------------------------- */

    severity: {

      DEBUG: true,

      INFO: true,

      NOTICE: true,

      WARNING: true,

      ERROR: true,

      CRITICAL: true,

      SECURITY: true

    },


    /* ----------------------------------------------------------
       SECURITY EVENTS
       ---------------------------------------------------------- */

    securityMonitoring: {

      enabled: true,

      failedLogin: true,

      successfulLogin: true,

      logout: true,

      sessionCreated: true,

      sessionExpired: true,

      unauthorizedAccess: true,

      forbiddenAction: true,

      permissionDenied: true,

      roleChange: true,

      permissionChange: true,

      suspiciousActivity: true,

      repeatedFailures: true,

      documentUnauthorizedAccess: true,

      KYCUnauthorizedAccess: true,

      configurationUnauthorizedChange: true,

      APIUnauthorizedRequest: true,

      backendSecurityAuthority: true

    },


    /* ----------------------------------------------------------
       AUTHENTICATION
       ---------------------------------------------------------- */

    authentication: {

      enabled: true,

      loginAudit: true,

      logoutAudit: true,

      failedLoginAudit: true,

      sessionAudit: true,

      roleAudit: true,

      authenticationFailureAudit: true,

      passwordEventAudit: true,

      OTPEventAudit: true,

      accountLockAudit: true,

      accountUnlockAudit: true,

      backendAuthority: true

    },


    /* ----------------------------------------------------------
       USER / ROLE
       ---------------------------------------------------------- */

    userRoleMonitoring: {

      enabled: true,

      userCreated: true,

      userUpdated: true,

      userActivated: true,

      userDeactivated: true,

      userSuspended: true,

      userDeleted: true,

      roleAssigned: true,

      roleChanged: true,

      roleRemoved: true,

      permissionGranted: true,

      permissionRevoked: true,

      backendAuthority: true

    },


    /* ----------------------------------------------------------
       CONFIGURATION AUDIT
       ---------------------------------------------------------- */

    configurationMonitoring: {

      enabled: true,

      configurationViewed: true,

      configurationChanged: true,

      policyChanged: true,

      systemSettingChanged: true,

      operationalSettingChanged: true,

      financialSettingChanged: true,

      KYCSettingChanged: true,

      documentSettingChanged: true,

      notificationSettingChanged: true,

      APISettingChanged: true,

      beforeAfterValues: true,

      changedByRequired: true,

      reasonRequired: true,

      backendAuthority: true

    },


    /* ----------------------------------------------------------
       DOCUMENT / KYC AUDIT
       ---------------------------------------------------------- */

    documentKYCMonitoring: {

      enabled: true,

      documentUploaded: true,

      documentViewed: true,

      documentDownloaded: true,

      documentReplaced: true,

      documentSubmitted: true,

      documentReviewed: true,

      documentApproved: true,

      documentRejected: true,

      documentResubmissionRequested: true,

      documentExpired: true,

      documentRenewed: true,

      documentVerification: true,

      KYCStarted: true,

      KYCSubmitted: true,

      KYCReviewed: true,

      KYCApproved: true,

      KYCRejected: true,

      KYCResubmission: true,

      KYCExpired: true,

      KYCReverified: true,

      unauthorizedDocumentAccess: true,

      backendAuthority: true

    },


    /* ----------------------------------------------------------
       BOOKING / OPERATIONS AUDIT
       ---------------------------------------------------------- */

    operationsMonitoring: {

      enabled: true,

      bookingCreated: true,

      bookingUpdated: true,

      bookingCancelled: true,

      bookingAssigned: true,

      bookingReassigned: true,

      bookingAccepted: true,

      bookingRejected: true,

      tripStarted: true,

      tripCompleted: true,

      driverDutyChanged: true,

      vehicleStatusChanged: true,

      vendorStatusChanged: true,

      dispatchChanged: true,

      escalationCreated: true,

      incidentCreated: true,

      emergencyEvent: true,

      locationEvent: true,

      backendAuthority: true

    },


    /* ----------------------------------------------------------
       FINANCIAL EVENT AUDIT
       ---------------------------------------------------------- */

    financialMonitoring: {

      enabled: true,

      fareCalculated: true,

      fareChanged: true,

      transactionCreated: true,

      transactionUpdated: true,

      walletViewed: true,

      walletChanged: true,

      ledgerCreated: true,

      ledgerUpdated: true,

      billingCreated: true,

      billingUpdated: true,

      settlementCreated: true,

      settlementUpdated: true,

      refundEvent: true,

      financialPolicyChanged: true,

      financialAuthorityBackendOnly: true,

      realMoneyBlockedInFrontend: true,

      realPaymentBlockedInFrontend: true,

      bankTransferBlockedInFrontend: true

    },


    /* ----------------------------------------------------------
       API MONITORING
       ---------------------------------------------------------- */

    apiMonitoring: {

      enabled: true,

      requestStarted: true,

      requestCompleted: true,

      requestFailed: true,

      timeout: true,

      unauthorized: true,

      forbidden: true,

      validationFailure: true,

      serverError: true,

      responseLogged: true,

      correlationId: true,

      requestId: true,

      endpointLogging: true,

      payloadMetadataOnly: true,

      sensitivePayloadExcluded: true,

      backendAuthority: true

    },


    /* ----------------------------------------------------------
       ERROR MONITORING
       ---------------------------------------------------------- */

    errorMonitoring: {

      enabled: true,

      JavaScriptError: true,

      PromiseRejection: true,

      APIError: true,

      ValidationError: true,

      AuthorizationError: true,

      AuthenticationError: true,

      StorageError: true,

      UploadError: true,

      ProcessingError: true,

      UIError: true,

      severityRequired: true,

      stackMetadataAllowed: true,

      sensitiveDataExcluded: true

    },


    /* ----------------------------------------------------------
       NOTIFICATION AUDIT
       ---------------------------------------------------------- */

    notificationMonitoring: {

      enabled: true,

      notificationCreated: true,

      notificationSent: true,

      notificationFailed: true,

      notificationRead: true,

      notificationDismissed: true,

      notificationTypeLogged: true,

      recipientMetadataLogged: true,

      sensitiveContentExcluded: true,

      backendAuthority: true

    },


    /* ----------------------------------------------------------
       AUDIT RECORD STRUCTURE
       ---------------------------------------------------------- */

    eventStructure: {

      eventId: true,

      timestamp: true,

      actorId: true,

      actorType: true,

      actorRole: true,

      category: true,

      action: true,

      module: true,

      entityType: true,

      entityId: true,

      status: true,

      severity: true,

      source: true,

      sessionId: true,

      requestId: true,

      correlationId: true,

      reason: true,

      comment: true,

      beforeValue: true,

      afterValue: true,

      metadata: true,

      result: true,

      errorCode: true,

      errorMessage: true,

      ipMetadata: true,

      deviceMetadata: true

    },


    /* ----------------------------------------------------------
       PRIVACY
       ---------------------------------------------------------- */

    privacySecurity: {

      enabled: true,

      sensitiveDataProtection: true,

      passwordNeverLogged: true,

      OTPNeverLogged: true,

      paymentCredentialsNeverLogged: true,

      bankCredentialsNeverLogged: true,

      fullDocumentContentNeverLogged: true,

      rawDocumentBinaryNeverLogged: true,

      authenticationTokensNeverLogged: true,

      authorizationHeadersNeverLogged: true,

      sensitivePayloadExcluded: true,

      PIIExposureMinimized: true,

      backendSecurityAuthority: true

    },


    /* ----------------------------------------------------------
       RETENTION
       ---------------------------------------------------------- */

    retention: {

      enabled: true,

      localTestingHistory: true,

      maxLocalEvents: 1000,

      localAutoTrim: true,

      backendRetentionRequired: true,

      databaseRetentionRequired: true,

      archivalSupported: true,

      permanentDeletionByFrontend: false,

      retentionPolicyBackendControlled: true

    },


    /* ----------------------------------------------------------
       INTEGRITY
       ---------------------------------------------------------- */

    integrity: {

      enabled: true,

      immutableAuthoritativeAudit: true,

      eventIdRequired: true,

      timestampRequired: true,

      actorRequired: true,

      actionRequired: true,

      moduleRequired: true,

      duplicateDetection: true,

      sequenceMetadata: true,

      backendIntegrityAuthority: true,

      frontendCannotRewriteHistory: true

    },


    /* ----------------------------------------------------------
       ADMIN ACCESS
       ---------------------------------------------------------- */

    adminAccess: {

      auditDashboard: true,

      auditView: true,

      auditSearch: true,

      auditFilter: true,

      auditSort: true,

      auditDetails: true,

      securityDashboard: true,

      errorDashboard: true,

      configurationHistory: true,

      KYCHistory: true,

      documentHistory: true,

      operationalHistory: true,

      financialEventHistory: true,

      APIHistory: true,

      permissionHistory: true,

      exportRequest: true,

      deleteAudit: false,

      modifyAudit: false,

      clearAuthoritativeAudit: false

    },


    /* ----------------------------------------------------------
       ALERTING
       ---------------------------------------------------------- */

    alerting: {

      enabled: true,

      criticalEventAlert: true,

      securityEventAlert: true,

      repeatedFailureAlert: true,

      unauthorizedAccessAlert: true,

      APIFailureAlert: true,

      systemErrorAlert: true,

      KYCFailureAlert: true,

      documentFailureAlert: true,

      operationalIncidentAlert: true,

      financialAnomalyAlert: true,

      backendAlertAuthority: true

    },


    /* ----------------------------------------------------------
       MONITORING
       ---------------------------------------------------------- */

    monitoring: {

      dashboardEnabled: true,

      realtimeReady: true,

      backendRealtimeAuthority: true,

      healthStatus: true,

      eventCounters: true,

      severityCounters: true,

      moduleCounters: true,

      actorCounters: true,

      failureCounters: true,

      securityCounters: true,

      KYCFailures: true,

      documentFailures: true,

      APIFailures: true,

      operationalIncidents: true,

      financialEvents: true

    }

  };


  /* ============================================================
     UTILITIES
     ============================================================ */

  function clone(value) {

    return JSON.parse(
      JSON.stringify(value)
    );

  }


  function deepMerge(
    base,
    incoming
  ) {

    const output =
      clone(base);

    if (
      !incoming ||
      typeof incoming !==
        "object"
    ) {

      return output;

    }


    Object.keys(
      incoming
    ).forEach(
      function (key) {

        if (

          incoming[key] &&

          typeof incoming[key] ===
            "object" &&

          !Array.isArray(
            incoming[key]
          ) &&

          output[key] &&

          typeof output[key] ===
            "object" &&

          !Array.isArray(
            output[key]
          )

        ) {

          output[key] =
            deepMerge(
              output[key],
              incoming[key]
            );

        } else {

          output[key] =
            incoming[key];

        }

      }
    );


    return output;

  }


  function loadConfig() {

    try {

      const raw =
        localStorage.getItem(
          STORAGE_KEY
        );


      if (!raw) {

        return clone(
          DEFAULT_CONFIG
        );

      }


      return deepMerge(

        DEFAULT_CONFIG,

        JSON.parse(raw)

      );

    } catch (error) {

      console.warn(
        "26G config load error:",
        error
      );

      return clone(
        DEFAULT_CONFIG
      );

    }

  }


  function saveConfig(
    config
  ) {

    localStorage.setItem(

      STORAGE_KEY,

      JSON.stringify(
        config
      )

    );

  }


  function generateId(
    prefix
  ) {

    return (

      prefix +

      "-" +

      Date.now() +

      "-" +

      Math.random()
        .toString(36)
        .slice(2, 10)

    );

  }


  function now() {

    return new Date()
      .toISOString();

  }


  /* ============================================================
     SAFETY ENFORCEMENT
     ============================================================ */

  function enforceSafety(
    config
  ) {

    config.environment.mode =
      "TESTING";

    config.environment.frontendOnly =
      true;

    config.environment.backendRequired =
      true;

    config.environment.databaseRequired =
      true;


    config.authority.frontendAuthority =
      false;

    config.authority.backendAuthority =
      true;

    config.authority.databaseAuthority =
      true;

    config.authority.backendAuditRequired =
      true;

    config.authority.frontendAuditIsLocalOnly =
      true;

    config.authority.frontendCannotDeleteAuthoritativeAudit =
      true;

    config.authority.frontendCannotModifyAuthoritativeAudit =
      true;

    config.authority.frontendCannotOverrideBackendAudit =
      true;


    config.privacySecurity.passwordNeverLogged =
      true;

    config.privacySecurity.OTPNeverLogged =
      true;

    config.privacySecurity.paymentCredentialsNeverLogged =
      true;

    config.privacySecurity.bankCredentialsNeverLogged =
      true;

    config.privacySecurity.fullDocumentContentNeverLogged =
      true;

    config.privacySecurity.rawDocumentBinaryNeverLogged =
      true;

    config.privacySecurity.authenticationTokensNeverLogged =
      true;

    config.privacySecurity.authorizationHeadersNeverLogged =
      true;


    config.retention.permanentDeletionByFrontend =
      false;

    config.retention.retentionPolicyBackendControlled =
      true;


    config.integrity.immutableAuthoritativeAudit =
      true;

    config.integrity.backendIntegrityAuthority =
      true;

    config.integrity.frontendCannotRewriteHistory =
      true;


    config.adminAccess.deleteAudit =
      false;

    config.adminAccess.modifyAudit =
      false;

    config.adminAccess.clearAuthoritativeAudit =
      false;


    config.financialMonitoring.realMoneyBlockedInFrontend =
      true;

    config.financialMonitoring.realPaymentBlockedInFrontend =
      true;

    config.financialMonitoring.bankTransferBlockedInFrontend =
      true;

    config.financialMonitoring.financialAuthorityBackendOnly =
      true;


    return config;

  }


  /* ============================================================
     CONFIG VALIDATION
     ============================================================ */

  function validateConfig(
    config
  ) {

    config =
      enforceSafety(
        config ||
        loadConfig()
      );


    const errors = [];

    const warnings = [];


    if (
      !config.environment.frontendOnly
    ) {

      errors.push(
        "26G must remain frontend-only."
      );

    }


    if (
      !config.authority.backendAuthority
    ) {

      errors.push(
        "Backend audit authority must be enabled."
      );

    }


    if (
      !config.authority.databaseAuthority
    ) {

      errors.push(
        "Database audit authority must be enabled."
      );

    }


    if (
      !config.authority.backendAuditRequired
    ) {

      errors.push(
        "Backend authoritative audit is required."
      );

    }


    if (
      !config.privacySecurity.passwordNeverLogged
    ) {

      errors.push(
        "Passwords must never be logged."
      );

    }


    if (
      !config.privacySecurity.OTPNeverLogged
    ) {

      errors.push(
        "OTP values must never be logged."
      );

    }


    if (
      !config.privacySecurity.paymentCredentialsNeverLogged
    ) {

      errors.push(
        "Payment credentials must never be logged."
      );

    }


    if (
      !config.privacySecurity.bankCredentialsNeverLogged
    ) {

      errors.push(
        "Bank credentials must never be logged."
      );

    }


    if (
      !config.privacySecurity.rawDocumentBinaryNeverLogged
    ) {

      errors.push(
        "Raw document binary must never be logged."
      );

    }


    if (
      config.adminAccess.deleteAudit
    ) {

      errors.push(
        "Frontend audit deletion must remain disabled."
      );

    }


    if (
      config.adminAccess.modifyAudit
    ) {

      errors.push(
        "Frontend audit modification must remain disabled."
      );

    }


    if (
      config.retention.permanentDeletionByFrontend
    ) {

      errors.push(
        "Frontend permanent audit deletion must remain disabled."
      );

    }


    if (
      config.financialMonitoring.realMoneyBlockedInFrontend !==
      true
    ) {

      errors.push(
        "Real money must remain blocked in frontend."
      );

    }


    if (
      config.financialMonitoring.realPaymentBlockedInFrontend !==
      true
    ) {

      errors.push(
        "Real payment must remain blocked in frontend."
      );

    }


    if (
      config.financialMonitoring.bankTransferBlockedInFrontend !==
      true
    ) {

      errors.push(
        "Bank transfer must remain blocked in frontend."
      );

    }


    if (
      config.retention.maxLocalEvents <
      100
    ) {

      warnings.push(
        "Local audit history is configured below 100 events."
      );

    }


    return {

      valid:
        errors.length === 0,

      errors:
        errors,

      warnings:
        warnings,

      checkedAt:
        now(),

      version:
        VERSION

    };

  }


  /* ============================================================
     SENSITIVE DATA SANITIZATION
     ============================================================ */

  function sanitize(
    value,
    key
  ) {

    const sensitiveKeys = [

      "password",

      "passcode",

      "otp",

      "token",

      "accessToken",

      "refreshToken",

      "authorization",

      "cookie",

      "secret",

      "apiKey",

      "bankAccount",

      "accountNumber",

      "cardNumber",

      "cvv",

      "upiPin",

      "paymentCredential",

      "rawDocument",

      "documentBinary",

      "fileContent"

    ];


    if (
      key &&
      sensitiveKeys.indexOf(
        String(key)
      ) !== -1
    ) {

      return "[REDACTED]";

    }


    if (
      value === null ||
      value === undefined
    ) {

      return value;

    }


    if (
      typeof value ===
      "string"
    ) {

      if (
        value.length >
        1000
      ) {

        return (
          value.slice(
            0,
            1000
          ) +
          "…[TRUNCATED]"
        );

      }

      return value;

    }


    if (
      Array.isArray(value)
    ) {

      return value.map(
        function (item) {

          return sanitize(
            item
          );

        }
      );

    }


    if (
      typeof value ===
      "object"
    ) {

      const result = {};

      Object.keys(
        value
      ).forEach(
        function (childKey) {

          result[childKey] =
            sanitize(
              value[childKey],
              childKey
            );

        }
      );

      return result;

    }


    return value;

  }


  /* ============================================================
     LOCAL EVENT STORAGE
     ============================================================ */

  function getLocalEvents() {

    try {

      return JSON.parse(

        localStorage.getItem(
          EVENTS_KEY
        ) || "[]"

      );

    } catch (error) {

      return [];

    }

  }


  function saveLocalEvents(
    events
  ) {

    const config =
      loadConfig();


    const max =
      Math.max(

        100,

        Number(
          config.retention
            .maxLocalEvents
        ) || MAX_LOCAL_EVENTS

      );


    const trimmed =
      events.slice(
        0,
        max
      );


    localStorage.setItem(

      EVENTS_KEY,

      JSON.stringify(
        trimmed
      )

    );

  }


  /* ============================================================
     EVENT CREATION
     ============================================================ */

  function recordEvent(
    event
  ) {

    const config =
      enforceSafety(
        loadConfig()
      );


    if (
      !config.auditSystem
        .eventLoggingEnabled
    ) {

      return null;

    }


    const cleanEvent =
      sanitize(
        event || {}
      );


    const record = {

      eventId:
        cleanEvent.eventId ||
        generateId(
          "AUD"
        ),

      timestamp:
        cleanEvent.timestamp ||
        now(),

      actorId:
        cleanEvent.actorId ||
        "UNKNOWN",

      actorType:
        cleanEvent.actorType ||
        "Unknown",

      actorRole:
        cleanEvent.actorRole ||
        "Unknown",

      category:
        cleanEvent.category ||
        "SYSTEM",

      action:
        cleanEvent.action ||
        "UNKNOWN_ACTION",

      module:
        cleanEvent.module ||
        "System",

      entityType:
        cleanEvent.entityType ||
        "",

      entityId:
        cleanEvent.entityId ||
        "",

      status:
        cleanEvent.status ||
        "SUCCESS",

      severity:
        cleanEvent.severity ||
        "INFO",

      source:
        cleanEvent.source ||
        "FRONTEND",

      sessionId:
        cleanEvent.sessionId ||
        getSessionId(),

      requestId:
        cleanEvent.requestId ||
        "",

      correlationId:
        cleanEvent.correlationId ||
        "",

      reason:
        cleanEvent.reason ||
        "",

      comment:
        cleanEvent.comment ||
        "",

      beforeValue:
        cleanEvent.beforeValue ||
        null,

      afterValue:
        cleanEvent.afterValue ||
        null,

      metadata:
        cleanEvent.metadata ||
        {},

      result:
        cleanEvent.result ||
        "",

      errorCode:
        cleanEvent.errorCode ||
        "",

      errorMessage:
        cleanEvent.errorMessage ||
        "",

      ipMetadata:
        cleanEvent.ipMetadata ||
        "BACKEND_REQUIRED",

      deviceMetadata:
        cleanEvent.deviceMetadata ||
        {

          userAgent:
            typeof navigator !==
              "undefined"

              ? navigator.userAgent
              : "",

          platform:
            typeof navigator !==
              "undefined"

              ? navigator.platform
              : ""

        }

    };


    const events =
      getLocalEvents();


    events.unshift(
      record
    );


    saveLocalEvents(
      events
    );


    return record;

  }


  /* ============================================================
     SESSION
     ============================================================ */

  function createSession(
    actorId,
    actorType,
    actorRole
  ) {

    const session = {

      sessionId:
        generateId(
          "SES"
        ),

      actorId:
        actorId ||
        "UNKNOWN",

      actorType:
        actorType ||
        "Unknown",

      actorRole:
        actorRole ||
        "Unknown",

      createdAt:
        now(),

      lastActivityAt:
        now()

    };


    localStorage.setItem(

      SESSION_KEY,

      JSON.stringify(
        session
      )

    );


    recordEvent({

      actorId:
        session.actorId,

      actorType:
        session.actorType,

      actorRole:
        session.actorRole,

      category:
        "AUTHENTICATION",

      action:
        "SESSION_CREATED",

      module:
        "Authentication",

      sessionId:
        session.sessionId,

      status:
        "SUCCESS",

      severity:
        "INFO"

    });


    return session;

  }


  function getSession() {

    try {

      return JSON.parse(

        localStorage.getItem(
          SESSION_KEY
        ) || "null"

      );

    } catch (error) {

      return null;

    }

  }


  function getSessionId() {

    const session =
      getSession();

    return session
      ? session.sessionId
      : "";

  }


  function endSession() {

    const session =
      getSession();


    if (session) {

      recordEvent({

        actorId:
          session.actorId,

        actorType:
          session.actorType,

        actorRole:
          session.actorRole,

        category:
          "AUTHENTICATION",

        action:
          "SESSION_ENDED",

        module:
          "Authentication",

        sessionId:
          session.sessionId,

        status:
          "SUCCESS",

        severity:
          "INFO"

      });

    }


    localStorage.removeItem(
      SESSION_KEY
    );

  }


  /* ============================================================
     CONVENIENCE AUDIT METHODS
     ============================================================ */

  function logLogin(
    actorId,
    actorType,
    actorRole,
    success,
    reason
  ) {

    return recordEvent({

      actorId:
        actorId,

      actorType:
        actorType,

      actorRole:
        actorRole,

      category:
        "AUTHENTICATION",

      action:
        success
          ? "LOGIN_SUCCESS"
          : "LOGIN_FAILED",

      module:
        "Authentication",

      status:
        success
          ? "SUCCESS"
          : "FAILED",

      severity:
        success
          ? "INFO"
          : "SECURITY",

      reason:
        reason || ""

    });

  }


  function logPermissionChange(
    actorId,
    actorRole,
    targetRole,
    permission,
    beforeValue,
    afterValue,
    reason
  ) {

    return recordEvent({

      actorId:
        actorId,

      actorType:
        "Admin",

      actorRole:
        actorRole || "Admin",

      category:
        "PERMISSION",

      action:
        "PERMISSION_CHANGED",

      module:
        "Admin",

      entityType:
        "ROLE_PERMISSION",

      entityId:
        targetRole +
        ":" +
        permission,

      beforeValue:
        beforeValue,

      afterValue:
        afterValue,

      reason:
        reason || "",

      status:
        "SUCCESS",

      severity:
        "NOTICE"

    });

  }


  function logConfigurationChange(
    actorId,
    actorRole,
    module,
    setting,
    beforeValue,
    afterValue,
    reason
  ) {

    return recordEvent({

      actorId:
        actorId,

      actorType:
        "Admin",

      actorRole:
        actorRole || "Admin",

      category:
        "CONFIGURATION",

      action:
        "CONFIGURATION_CHANGED",

      module:
        module || "System",

      entityType:
        "SETTING",

      entityId:
        setting || "",

      beforeValue:
        beforeValue,

      afterValue:
        afterValue,

      reason:
        reason || "",

      status:
        "SUCCESS",

      severity:
        "NOTICE"

    });

  }


  function logDocumentEvent(
    action,
    actorId,
    actorRole,
    entityId,
    status,
    metadata
  ) {

    return recordEvent({

      actorId:
        actorId,

      actorType:
        actorRole === "Admin"
          ? "Admin"
          : actorRole || "Unknown",

      actorRole:
        actorRole || "Unknown",

      category:
        "DOCUMENT",

      action:
        action,

      module:
        "Documents",

      entityType:
        "DOCUMENT",

      entityId:
        entityId || "",

      status:
        status || "SUCCESS",

      severity:
        "NOTICE",

      metadata:
        metadata || {}

    });

  }


  function logKYCEvent(
    action,
    actorId,
    actorRole,
    entityId,
    status,
    reason
  ) {

    return recordEvent({

      actorId:
        actorId,

      actorType:
        actorRole === "Admin"
          ? "Admin"
          : actorRole || "Unknown",

      actorRole:
        actorRole || "Unknown",

      category:
        "KYC",

      action:
        action,

      module:
        "KYC",

      entityType:
        "KYC",

      entityId:
        entityId || "",

      status:
        status || "SUCCESS",

      severity:
        status === "FAILED"
          ? "WARNING"
          : "NOTICE",

      reason:
        reason || ""

    });

  }


  function logFinancialEvent(
    action,
    actorId,
    actorRole,
    entityId,
    status,
    metadata
  ) {

    return recordEvent({

      actorId:
        actorId,

      actorType:
        actorRole || "Unknown",

      actorRole:
        actorRole || "Unknown",

      category:
        "TRANSACTION",

      action:
        action,

      module:
        "Financial",

      entityType:
        "FINANCIAL_EVENT",

      entityId:
        entityId || "",

      status:
        status || "SUCCESS",

      severity:
        "NOTICE",

      metadata:
        metadata || {},

      source:
        "FRONTEND_AUDIT_ONLY"

    });

  }


  function logAPIEvent(
    action,
    endpoint,
    status,
    requestId,
    correlationId,
    metadata
  ) {

    return recordEvent({

      actorId:
        "API",

      actorType:
        "API",

      actorRole:
        "System",

      category:
        "API",

      action:
        action,

      module:
        "API",

      entityType:
        "ENDPOINT",

      entityId:
        endpoint || "",

      status:
        status || "SUCCESS",

      severity:
        status === "FAILED"
          ? "ERROR"
          : "INFO",

      requestId:
        requestId || "",

      correlationId:
        correlationId || "",

      metadata:
        metadata || {}

    });

  }


  function logError(
    action,
    error,
    module,
    metadata
  ) {

    return recordEvent({

      actorId:
        "SYSTEM",

      actorType:
        "System",

      actorRole:
        "System",

      category:
        "ERROR",

      action:
        action || "SYSTEM_ERROR",

      module:
        module || "System",

      status:
        "FAILED",

      severity:
        "ERROR",

      errorMessage:
        error &&
        error.message
          ? error.message
          : String(error || ""),

      metadata:
        metadata || {}

    });

  }


  /* ============================================================
     SEARCH / FILTER
     ============================================================ */

  function queryEvents(
    options
  ) {

    const opts =
      options || {};


    let events =
      getLocalEvents();


    if (
      opts.actorId
    ) {

      events =
        events.filter(
          function (event) {

            return (
              event.actorId ===
              opts.actorId
            );

          }
        );

    }


    if (
      opts.actorRole
    ) {

      events =
        events.filter(
          function (event) {

            return (
              event.actorRole ===
              opts.actorRole
            );

          }
        );

    }


    if (
      opts.actorType
    ) {

      events =
        events.filter(
          function (event) {

            return (
              event.actorType ===
              opts.actorType
            );

          }
        );

    }


    if (
      opts.category
    ) {

      events =
        events.filter(
          function (event) {

            return (
              event.category ===
              opts.category
            );

          }
        );

    }


    if (
      opts.module
    ) {

      events =
        events.filter(
          function (event) {

            return (
              event.module ===
              opts.module
            );

          }
        );

    }


    if (
      opts.action
    ) {

      events =
        events.filter(
          function (event) {

            return (
              event.action ===
              opts.action
            );

          }
        );

    }


    if (
      opts.status
    ) {

      events =
        events.filter(
          function (event) {

            return (
              event.status ===
              opts.status
            );

          }
        );

    }


    if (
      opts.severity
    ) {

      events =
        events.filter(
          function (event) {

            return (
              event.severity ===
              opts.severity
            );

          }
        );

    }


    if (
      opts.entityType
    ) {

      events =
        events.filter(
          function (event) {

            return (
              event.entityType ===
              opts.entityType
            );

          }
        );

    }


    if (
      opts.entityId
    ) {

      events =
        events.filter(
          function (event) {

            return (
              event.entityId ===
              opts.entityId
            );

          }
        );

    }


    if (
      opts.from
    ) {

      const from =
        new Date(
          opts.from
        ).getTime();


      events =
        events.filter(
          function (event) {

            return (
              new Date(
                event.timestamp
              ).getTime() >=
              from
            );

          }
        );

    }


    if (
      opts.to
    ) {

      const to =
        new Date(
          opts.to
        ).getTime();


      events =
        events.filter(
          function (event) {

            return (
              new Date(
                event.timestamp
              ).getTime() <=
              to
            );

          }
        );

    }


    if (
      opts.search
    ) {

      const search =
        String(
          opts.search
        )
        .toLowerCase();


      events =
        events.filter(
          function (event) {

            return (

              JSON.stringify(
                event
              )
              .toLowerCase()
              .indexOf(
                search
              ) !== -1

            );

          }
        );

    }


    if (
      opts.sortBy
    ) {

      const field =
        opts.sortBy;


      events.sort(
        function (
          a,
          b
        ) {

          const av =
            String(
              a[field] || ""
            );

          const bv =
            String(
              b[field] || ""
            );


          if (
            av < bv
          ) {
            return opts.desc
              ? 1
              : -1;
          }


          if (
            av > bv
          ) {
            return opts.desc
              ? -1
              : 1;
          }


          return 0;

        }
      );

    }


    if (
      Number.isFinite(
        opts.limit
      )
    ) {

      events =
        events.slice(
          0,
          opts.limit
        );

    }


    return events;

  }


  /* ============================================================
     STATISTICS
     ============================================================ */

  function getStatistics(
    events
  ) {

    const list =
      Array.isArray(events)
        ? events
        : getLocalEvents();


    const stats = {

      total:
        list.length,

      success:
        0,

      failed:
        0,

      security:
        0,

      warnings:
        0,

      errors:
        0,

      critical:
        0,

      byCategory: {},

      byModule: {},

      byRole: {},

      byAction: {}

    };


    list.forEach(
      function (event) {

        if (
          event.status ===
          "SUCCESS"
        ) {

          stats.success++;

        }


        if (
          event.status ===
          "FAILED"
        ) {

          stats.failed++;

        }


        if (
          event.severity ===
          "SECURITY"
        ) {

          stats.security++;

        }


        if (
          event.severity ===
          "WARNING"
        ) {

          stats.warnings++;

        }


        if (
          event.severity ===
          "ERROR"
        ) {

          stats.errors++;

        }


        if (
          event.severity ===
          "CRITICAL"
        ) {

          stats.critical++;

        }


        stats.byCategory[
          event.category
        ] =

          (
            stats.byCategory[
              event.category
            ] || 0
          ) + 1;


        stats.byModule[
          event.module
        ] =

          (
            stats.byModule[
              event.module
            ] || 0
          ) + 1;


        stats.byRole[
          event.actorRole
        ] =

          (
            stats.byRole[
              event.actorRole
            ] || 0
          ) + 1;


        stats.byAction[
          event.action
        ] =

          (
            stats.byAction[
              event.action
            ] || 0
          ) + 1;

      }
    );


    return stats;

  }


  /* ============================================================
     RENDER HELPERS
     ============================================================ */

  function escapeHTML(
    value
  ) {

    return String(
      value === null ||
      value === undefined
        ? ""
        : value
    )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

  }


  function optionList(
    values,
    selected
  ) {

    return values
      .map(
        function (value) {

          return `

            <option
              value="${escapeHTML(value)}"
              ${
                value === selected
                  ? "selected"
                  : ""
              }
            >
              ${escapeHTML(value)}
            </option>

          `;

        }
      )
      .join("");

  }


  /* ============================================================
     RENDER
     ============================================================ */

  function render() {

    const mount =
      document.getElementById(
        "module-26G"
      );


    if (!mount) {
      return;
    }


    const config =
      enforceSafety(
        loadConfig()
      );


    const validation =
      validateConfig(
        config
      );


    const events =
      getLocalEvents();


    const stats =
      getStatistics(
        events
      );


    const categories =
      Object.keys(
        config.categories
      );


    const modules =
      Object.keys(
        config.modules
      );


    const roles =
      Object.keys(
        config.actorTypes
      );


    const severities =
      Object.keys(
        config.severity
      );


    const recent =
      events.slice(
        0,
        100
      );


    mount.innerHTML = `

      <div class="page-head">

        <h1>
          26G — Audit & Monitoring
        </h1>

        <div class="muted">

          Complete Administrator audit,
          security monitoring,
          activity history,
          configuration tracking,
          KYC/document history,
          operations,
          financial events,
          API events and error monitoring.

        </div>

      </div>


      <!-- SYSTEM STATUS -->

      <section class="card">

        <h2>
          Audit System Status
        </h2>

        <div class="grid four">

          <div>

            <b>
              ${VERSION}
            </b>

            <div class="muted">
              Version
            </div>

          </div>


          <div>

            <b>
              ${
                validation.valid
                  ? "VALID"
                  : "ERROR"
              }
            </b>

            <div class="muted">
              Configuration
            </div>

          </div>


          <div>

            <b>
              BACKEND
            </b>

            <div class="muted">
              Authoritative Audit
            </div>

          </div>


          <div>

            <b>
              ${
                config.auditSystem
                  .eventLoggingEnabled
                  ? "ENABLED"
                  : "DISABLED"
              }
            </b>

            <div class="muted">
              Event Logging
            </div>

          </div>

        </div>

      </section>


      <!-- SECURITY NOTICE -->

      <section class="card">

        <div class="notice success">

          <b>
            Audit Authority:
          </b>

          Frontend stores only local/testing
          audit information.

          <br><br>

          The authoritative audit trail must be
          created and preserved by the Backend
          and Database.

          <br><br>

          Frontend cannot modify, rewrite,
          or permanently delete authoritative
          audit history.

        </div>

      </section>


      <!-- COUNTERS -->

      <section class="card">

        <h2>
          Monitoring Overview
        </h2>

        <div class="grid four">

          <div>

            <b>
              ${stats.total}
            </b>

            <div class="muted">
              Total Local Events
            </div>

          </div>


          <div>

            <b>
              ${stats.success}
            </b>

            <div class="muted">
              Successful
            </div>

          </div>


          <div>

            <b>
              ${stats.failed}
            </b>

            <div class="muted">
              Failed
            </div>

          </div>


          <div>

            <b>
              ${stats.security}
            </b>

            <div class="muted">
              Security Events
            </div>

          </div>


          <div>

            <b>
              ${stats.warnings}
            </b>

            <div class="muted">
              Warnings
            </div>

          </div>


          <div>

            <b>
              ${stats.errors}
            </b>

            <div class="muted">
              Errors
            </div>

          </div>


          <div>

            <b>
              ${stats.critical}
            </b>

            <div class="muted">
              Critical
            </div>

          </div>


          <div>

            <b>
              ${config.retention.maxLocalEvents}
            </b>

            <div class="muted">
              Local Retention Limit
            </div>

          </div>

        </div>

      </section>


      <!-- SEARCH -->

      <section class="card">

        <h2>
          Audit Search & Filter
        </h2>

        <div class="grid four">

          <div>

            <label>
              Search
            </label>

            <input
              id="govara26g-search"
              type="text"
              placeholder="Event, actor, entity..."
            >

          </div>


          <div>

            <label>
              Category
            </label>

            <select
              id="govara26g-category"
            >

              <option value="">
                All Categories
              </option>

              ${optionList(
                categories,
                ""
              )}

            </select>

          </div>


          <div>

            <label>
              Module
            </label>

            <select
              id="govara26g-module"
            >

              <option value="">
                All Modules
              </option>

              ${optionList(
                modules,
                ""
              )}

            </select>

          </div>


          <div>

            <label>
              Actor Role
            </label>

            <select
              id="govara26g-role"
            >

              <option value="">
                All Roles
              </option>

              ${optionList(
                roles,
                ""
              )}

            </select>

          </div>


          <div>

            <label>
              Severity
            </label>

            <select
              id="govara26g-severity"
            >

              <option value="">
                All Severity
              </option>

              ${optionList(
                severities,
                ""
              )}

            </select>

          </div>


          <div>

            <label>
              Status
            </label>

            <select
              id="govara26g-status"
            >

              <option value="">
                All Status
              </option>

              <option value="SUCCESS">
                SUCCESS
              </option>

              <option value="FAILED">
                FAILED
              </option>

            </select>

          </div>


          <div>

            <label>
              Entity ID
            </label>

            <input
              id="govara26g-entity"
              type="text"
              placeholder="Entity ID"
            >

          </div>


          <div
            style="
              display:flex;
              align-items:end;
            "
          >

            <button
              type="button"
              data-26g-action="search"
            >
              Search Audit
            </button>

          </div>

        </div>

        <div
          id="govara26g-search-result"
          style="
            margin-top:16px;
          "
        ></div>

      </section>


      <!-- EVENT TABLE -->

      <section class="card">

        <h2>
          Recent Audit Events
        </h2>

        <div
          style="
            overflow-x:auto;
          "
        >

          <table>

            <thead>

              <tr>

                <th>
                  Time
                </th>

                <th>
                  Event
                </th>

                <th>
                  Actor
                </th>

                <th>
                  Role
                </th>

                <th>
                  Module
                </th>

                <th>
                  Entity
                </th>

                <th>
                  Status
                </th>

                <th>
                  Severity
                </th>

              </tr>

            </thead>

            <tbody>

              ${
                recent.length

                  ? recent
                      .map(
                        function (
                          event
                        ) {

                          return `

                            <tr>

                              <td>
                                ${escapeHTML(
                                  event.timestamp
                                )}
                              </td>

                              <td>
                                <b>
                                  ${escapeHTML(
                                    event.action
                                  )}
                                </b>
                              </td>

                              <td>
                                ${escapeHTML(
                                  event.actorId
                                )}
                              </td>

                              <td>
                                ${escapeHTML(
                                  event.actorRole
                                )}
                              </td>

                              <td>
                                ${escapeHTML(
                                  event.module
                                )}
                              </td>

                              <td>
                                ${escapeHTML(
                                  event.entityId
                                )}
                              </td>

                              <td>
                                ${escapeHTML(
                                  event.status
                                )}
                              </td>

                              <td>
                                ${escapeHTML(
                                  event.severity
                                )}
                              </td>

                            </tr>

                          `;

                        }
                      )
                      .join("")

                  : `

                    <tr>

                      <td
                        colspan="8"
                        style="
                          text-align:center;
                        "
                      >

                        No local audit events yet.

                      </td>

                    </tr>

                  `
              }

            </tbody>

          </table>

        </div>

      </section>


      <!-- MONITORING AREAS -->

      <section class="card">

        <h2>
          Monitoring Areas
        </h2>

        <div class="grid three">

          <div>

            <b>
              Authentication
            </b>

            <div class="muted">
              Login, logout, session,
              failures and account events.
            </div>

          </div>


          <div>

            <b>
              Security
            </b>

            <div class="muted">
              Unauthorized access,
              denied actions and suspicious activity.
            </div>

          </div>


          <div>

            <b>
              User & Roles
            </b>

            <div class="muted">
              User, role and permission changes.
            </div>

          </div>


          <div>

            <b>
              Documents
            </b>

            <div class="muted">
              Upload, view, replacement,
              review and expiry history.
            </div>

          </div>


          <div>

            <b>
              KYC
            </b>

            <div class="muted">
              Submission, review,
              rejection, approval and resubmission.
            </div>

          </div>


          <div>

            <b>
              Operations
            </b>

            <div class="muted">
              Booking, duty, dispatch,
              vehicle and incident activity.
            </div>

          </div>


          <div>

            <b>
              Financial Events
            </b>

            <div class="muted">
              Fare, transaction, wallet,
              ledger, billing and settlement events.
            </div>

          </div>


          <div>

            <b>
              API
            </b>

            <div class="muted">
              Requests, failures,
              timeout, authorization and response metadata.
            </div>

          </div>


          <div>

            <b>
              Errors
            </b>

            <div class="muted">
              JavaScript, validation,
              storage and system errors.
            </div>

          </div>

        </div>

      </section>


      <!-- PRIVACY -->

      <section class="card">

        <h2>
          Audit Privacy & Security
        </h2>

        <div class="grid four">

          <div>

            <b>
              Passwords
            </b>

            <div class="muted">
              NEVER LOGGED
            </div>

          </div>


          <div>

            <b>
              OTP
            </b>

            <div class="muted">
              NEVER LOGGED
            </div>

          </div>


          <div>

            <b>
              Payment Credentials
            </b>

            <div class="muted">
              NEVER LOGGED
            </div>

          </div>


          <div>

            <b>
              Bank Credentials
            </b>

            <div class="muted">
              NEVER LOGGED
            </div>

          </div>


          <div>

            <b>
              Raw Documents
            </b>

            <div class="muted">
              NEVER LOGGED
            </div>

          </div>


          <div>

            <b>
              Authentication Tokens
            </b>

            <div class="muted">
              NEVER LOGGED
            </div>

          </div>


          <div>

            <b>
              Public Audit
            </b>

            <div class="muted">
              BLOCKED
            </div>

          </div>


          <div>

            <b>
              Backend Authority
            </b>

            <div class="muted">
              ENABLED
            </div>

          </div>

        </div>

      </section>


      <!-- INTEGRITY -->

      <section class="card">

        <h2>
          Audit Integrity
        </h2>

        <div class="notice">

          Every authoritative event should contain:

          <br><br>

          Event ID →
          Timestamp →
          Actor →
          Role →
          Category →
          Action →
          Module →
          Entity →
          Status →
          Severity →
          Session →
          Request/Correlation ID →
          Reason/Comment →
          Before/After metadata →
          Result

          <br><br>

          Frontend history is only a testing/local
          mirror. Backend remains the authoritative
          audit source.

        </div>

      </section>


      <!-- FINANCIAL SAFETY -->

      <section class="card">

        <h2>
          Financial Audit Boundary
        </h2>

        <div class="grid three">

          <div>

            <b>
              Real Money
            </b>

            <div class="muted">
              BLOCKED
            </div>

          </div>


          <div>

            <b>
              Real Payment
            </b>

            <div class="muted">
              BLOCKED
            </div>

          </div>


          <div>

            <b>
              Bank Transfer
            </b>

            <div class="muted">
              BLOCKED
            </div>

          </div>

        </div>

        <div class="muted"
             style="
               margin-top:12px;
             ">

          Financial events may be audited,
          but frontend is not the financial authority.

        </div>

      </section>


      <!-- VALIDATION -->

      <section class="card">

        <h2>
          Configuration Validation
        </h2>

        ${
          validation.valid

            ? `

              <div class="notice success">

                26G configuration is valid.

              </div>

            `

            : `

              <div class="notice danger">

                ${
                  validation.errors
                    .map(
                      function (
                        error
                      ) {

                        return (
                          "• " +
                          escapeHTML(
                            error
                          )
                        );

                      }
                    )
                    .join("<br>")
                }

              </div>

            `
        }


        ${
          validation.warnings.length

            ? `

              <div
                class="notice warn"
                style="
                  margin-top:10px;
                "
              >

                ${
                  validation.warnings
                    .map(
                      function (
                        warning
                      ) {

                        return (
                          "• " +
                          escapeHTML(
                            warning
                          )
                        );

                      }
                    )
                    .join("<br>")
                }

              </div>

            `

            : ""
        }


        <div
          style="
            margin-top:16px;
          "
        >

          <button
            type="button"
            data-26g-action="save"
          >
            Save
          </button>


          <button
            type="button"
            data-26g-action="reload"
          >
            Reload
          </button>


          <button
            type="button"
            data-26g-action="validate"
          >
            Validate
          </button>


          <button
            type="button"
            data-26g-action="reset"
          >
            Reset
          </button>

        </div>

      </section>

    `;


    bind();

  }


  /* ============================================================
     BIND
     ============================================================ */

  function bind() {

    document
      .querySelectorAll(
        "[data-26g-action]"
      )
      .forEach(
        function (button) {

          button.addEventListener(

            "click",

            function () {

              const action =
                button.getAttribute(
                  "data-26g-action"
                );


              if (
                action ===
                "save"
              ) {

                save();

                alert(
                  "26G configuration saved."
                );

                render();

                return;

              }


              if (
                action ===
                "reload"
              ) {

                render();

                return;

              }


              if (
                action ===
                "validate"
              ) {

                const result =
                  validate();


                alert(

                  result.valid

                    ? "26G configuration is valid."

                    : result.errors.join(
                        "\n"
                      )

                );

                return;

              }


              if (
                action ===
                "reset"
              ) {

                reset();

                alert(
                  "26G configuration reset."
                );

                render();

                return;

              }


              if (
                action ===
                "search"
              ) {

                runSearch();

              }

            }

          );

        }
      );


    const search =
      document.getElementById(
        "govara26g-search"
      );


    if (search) {

      search.addEventListener(

        "keydown",

        function (event) {

          if (
            event.key ===
            "Enter"
          ) {

            runSearch();

          }

        }

      );

    }

  }


  /* ============================================================
     SEARCH UI
     ============================================================ */

  function runSearch() {

    const resultBox =
      document.getElementById(
        "govara26g-search-result"
      );


    if (!resultBox) {
      return;
    }


    const search =
      document.getElementById(
        "govara26g-search"
      );


    const category =
      document.getElementById(
        "govara26g-category"
      );


    const module =
      document.getElementById(
        "govara26g-module"
      );


    const role =
      document.getElementById(
        "govara26g-role"
      );


    const severity =
      document.getElementById(
        "govara26g-severity"
      );


    const status =
      document.getElementById(
        "govara26g-status"
      );


    const entity =
      document.getElementById(
        "govara26g-entity"
      );


    const events =
      queryEvents({

        search:
          search
            ? search.value
            : "",

        category:
          category
            ? category.value
            : "",

        module:
          module
            ? module.value
            : "",

        actorRole:
          role
            ? role.value
            : "",

        severity:
          severity
            ? severity.value
            : "",

        status:
          status
            ? status.value
            : "",

        entityId:
          entity
            ? entity.value
            : "",

        sortBy:
          "timestamp",

        desc:
          true,

        limit:
          200

      });


    resultBox.innerHTML = `

      <div class="notice">

        <b>
          ${events.length}
        </b>

        audit event(s) found.

      </div>


      ${
        events.length

          ? `

            <div
              style="
                overflow-x:auto;
                margin-top:12px;
              "
            >

              <table>

                <thead>

                  <tr>

                    <th>
                      Time
                    </th>

                    <th>
                      Action
                    </th>

                    <th>
                      Actor
                    </th>

                    <th>
                      Module
                    </th>

                    <th>
                      Entity
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Severity
                    </th>

                  </tr>

                </thead>

                <tbody>

                  ${
                    events
                      .map(
                        function (
                          event
                        ) {

                          return `

                            <tr>

                              <td>
                                ${escapeHTML(
                                  event.timestamp
                                )}
                              </td>

                              <td>
                                ${escapeHTML(
                                  event.action
                                )}
                              </td>

                              <td>
                                ${escapeHTML(
                                  event.actorId
                                )}
                              </td>

                              <td>
                                ${escapeHTML(
                                  event.module
                                )}
                              </td>

                              <td>
                                ${escapeHTML(
                                  event.entityId
                                )}
                              </td>

                              <td>
                                ${escapeHTML(
                                  event.status
                                )}
                              </td>

                              <td>
                                ${escapeHTML(
                                  event.severity
                                )}
                              </td>

                            </tr>

                          `;

                        }
                      )
                      .join("")

                  }

                </tbody>

              </table>

            </div>

          `

          : ""

      }

    `;

  }


  /* ============================================================
     CONFIG API
     ============================================================ */

  function getConfig() {

    return enforceSafety(
      loadConfig()
    );

  }


  function save(
    config
  ) {

    const next =
      enforceSafety(

        config ||
        loadConfig()

      );


    const validation =
      validateConfig(
        next
      );


    if (
      !validation.valid
    ) {

      throw new Error(
        validation.errors.join(
          " "
        )
      );

    }


    saveConfig(
      next
    );


    recordEvent({

      actorId:
        "ADMIN",

      actorType:
        "Admin",

      actorRole:
        "Admin",

      category:
        "CONFIGURATION",

      action:
        "AUDIT_CONFIGURATION_SAVED",

      module:
        "Audit",

      status:
        "SUCCESS",

      severity:
        "NOTICE"

    });


    return {

      success:
        true,

      validation:
        validation

    };

  }


  function reset() {

    const config =
      enforceSafety(

        clone(
          DEFAULT_CONFIG
        )

      );


    saveConfig(
      config
    );


    recordEvent({

      actorId:
        "ADMIN",

      actorType:
        "Admin",

      actorRole:
        "Admin",

      category:
        "CONFIGURATION",

      action:
        "AUDIT_CONFIGURATION_RESET",

      module:
        "Audit",

      status:
        "SUCCESS",

      severity:
        "WARNING"

    });


    return config;

  }


  function reload() {

    return loadConfig();

  }


  function validate() {

    return validateConfig(
      loadConfig()
    );

  }


  function setPolicy(
    path,
    value
  ) {

    const config =
      loadConfig();


    const parts =
      String(
        path
      ).split(".");


    let target =
      config;


    for (
      let i = 0;
      i <
      parts.length - 1;
      i++
    ) {

      if (
        !target[
          parts[i]
        ] ||
        typeof target[
          parts[i]
        ] !==
        "object"
      ) {

        target[
          parts[i]
        ] = {};

      }


      target =
        target[
          parts[i]
        ];

    }


    target[
      parts[
        parts.length - 1
      ]
    ] = value;


    enforceSafety(
      config
    );


    saveConfig(
      config
    );


    recordEvent({

      actorId:
        "ADMIN",

      actorType:
        "Admin",

      actorRole:
        "Admin",

      category:
        "CONFIGURATION",

      action:
        "AUDIT_POLICY_UPDATED",

      module:
        "Audit",

      entityType:
        "POLICY",

      entityId:
        path,

      afterValue:
        value,

      status:
        "SUCCESS",

      severity:
        "NOTICE"

    });


    return config;

  }


  /* ============================================================
     LOCAL AUDIT MANAGEMENT
     ============================================================ */

  function clearLocalTestingEvents() {

    /*
      This only clears local testing data.
      It does NOT clear Backend/Database audit.
    */

    localStorage.removeItem(
      EVENTS_KEY
    );


    recordEvent({

      actorId:
        "ADMIN",

      actorType:
        "Admin",

      actorRole:
        "Admin",

      category:
        "AUDIT",

      action:
        "LOCAL_TEST_HISTORY_CLEARED",

      module:
        "Audit",

      status:
        "SUCCESS",

      severity:
        "WARNING",

      metadata: {

        authoritativeAudit:
          "NOT AFFECTED"

      }

    });

  }


  /* ============================================================
     GLOBAL ERROR MONITORING
     ============================================================ */

  function installErrorMonitoring() {

    if (
      typeof window ===
      "undefined"
    ) {

      return;

    }


    if (
      window.__GOVARA_26G_ERRORS_INSTALLED
    ) {

      return;

    }


    window.__GOVARA_26G_ERRORS_INSTALLED =
      true;


    window.addEventListener(

      "error",

      function (event) {

        try {

          logError(

            "JAVASCRIPT_ERROR",

            event.error ||
            event.message,

            "System",

            {

              filename:
                event.filename ||
                "",

              line:
                event.lineno ||
                "",

              column:
                event.colno ||
                ""

            }

          );

        } catch (
          ignored
        ) {}

      }

    );


    window.addEventListener(

      "unhandledrejection",

      function (event) {

        try {

          logError(

            "UNHANDLED_PROMISE_REJECTION",

            event.reason,

            "System"

          );

        } catch (
          ignored
        ) {}

      }

    );

  }


  /* ============================================================
     INITIALIZATION
     ============================================================ */

  function renderAndBind() {

    render();

  }


  installErrorMonitoring();


  document.addEventListener(

    "DOMContentLoaded",

    function () {

      try {

        const mount =
          document.getElementById(
            "module-26G"
          );


        if (mount) {

          renderAndBind();

        }

      } catch (error) {

        console.error(

          "GoVara 26G initialization error:",

          error

        );

      }

    }

  );


  /* ============================================================
     PUBLIC API
     ============================================================ */

  return {

    VERSION:
      VERSION,

    STORAGE_KEY:
      STORAGE_KEY,

    EVENTS_KEY:
      EVENTS_KEY,

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

    reload:
      reload,

    validate:
      validate,

    setPolicy:
      setPolicy,

    enforceSafety:
      enforceSafety,

    recordEvent:
      recordEvent,

    getLocalEvents:
      getLocalEvents,

    queryEvents:
      queryEvents,

    getStatistics:
      getStatistics,

    createSession:
      createSession,

    getSession:
      getSession,

    endSession:
      endSession,

    logLogin:
      logLogin,

    logPermissionChange:
      logPermissionChange,

    logConfigurationChange:
      logConfigurationChange,

    logDocumentEvent:
      logDocumentEvent,

    logKYCEvent:
      logKYCEvent,

    logFinancialEvent:
      logFinancialEvent,

    logAPIEvent:
      logAPIEvent,

    logError:
      logError,

    clearLocalTestingEvents:
      clearLocalTestingEvents,

    installErrorMonitoring:
      installErrorMonitoring

  };

})();
