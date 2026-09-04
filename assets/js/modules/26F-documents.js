/* =========================================================
   GoVara — 26F Documents & KYC Control V2
   ---------------------------------------------------------
   Frontend-only Admin Control Module

   IMPORTANT:
   - Frontend is NOT KYC authority.
   - Frontend is NOT document verification authority.
   - Backend remains authoritative.
   - Database remains authoritative data store.
   - Real Money / Payment / Bank Transfer are unrelated
     to document execution and remain blocked elsewhere.
   - No API / Backend / Database call from this module.
   - STEP 27 will own the consolidated API boundary later.
   ========================================================= */

window.GoVara26F = (function () {

  "use strict";

  const VERSION = "GOVARA-26F-V2";

  const STORAGE_KEY =
    "GOVARA_DOCUMENTS_KYC_CONTROL_26F_V2";

  const AUDIT_KEY =
    "GOVARA_DOCUMENTS_KYC_AUDIT_26F_V2";

  const LEGACY_STORAGE_KEY =
    "GOVARA_DOCUMENTS_KYC_CONTROL_26F_V1";


  /* =========================================================
     DEFAULT CONFIGURATION
     ========================================================= */

  const DEFAULT_CONFIG = {

    version: VERSION,

    environment: "TESTING",

    /* =======================================================
       1. DOCUMENT SYSTEM
       ======================================================= */

    documentSystem: {

      enabled: true,

      documentUploadEnabled: true,

      documentViewEnabled: true,

      documentUpdateEnabled: true,

      documentDeleteRequestEnabled: true,

      documentHistoryEnabled: true,

      documentStatusViewEnabled: true,

      expiryTrackingEnabled: true,

      expiryAlertEnabled: true,

      documentVerificationEnabled: true,

      manualVerificationEnabled: true,

      automaticVerificationEnabled: false,

      backendVerificationRequired: true,

      backendDocumentAuthority: true
    },


    /* =======================================================
       2. KYC MASTER CONTROL
       ======================================================= */

    kyc: {

      enabled: true,

      customerKYCRequired: true,

      vendorKYCRequired: true,

      driverKYCRequired: true,

      vehicleKYCRequired: true,

      manualReviewAllowed: true,

      automaticApprovalAllowed: false,

      reVerificationRequired: true,

      expiredKYCBlocksActivation: true,

      rejectedKYCBlocksActivation: true,

      pendingKYCBlocksActivation: true,

      backendKYCAuthority: true,

      frontendKYCAuthority: false
    },


    /* =======================================================
       3. CUSTOMER KYC
       ======================================================= */

    customerKYC: {

      enabled: true,

      requiredForRegistration: false,

      requiredForBooking: true,

      requiredBeforeTrip: true,

      requiredForWalletFeatures: false,

      requiredForRefundRequest: false,

      requiredForProfileCompletion: true,

      documentUpdateAllowed: true,

      manualReviewRequired: true,

      backendApprovalRequired: true
    },


    /* =======================================================
       4. VENDOR KYC
       ======================================================= */

    vendorKYC: {

      enabled: true,

      requiredForRegistration: true,

      requiredBeforeOperations: true,

      requiredBeforeBookingManagement: true,

      requiredBeforeDriverAssignment: true,

      requiredBeforeVehicleAssignment: true,

      documentUpdateAllowed: true,

      manualReviewRequired: true,

      backendApprovalRequired: true
    },


    /* =======================================================
       5. DRIVER KYC
       ======================================================= */

    driverKYC: {

      enabled: true,

      requiredForRegistration: true,

      requiredBeforeDuty: true,

      requiredBeforeTrip: true,

      requiredBeforeBookingAcceptance: true,

      documentUpdateAllowed: true,

      manualReviewRequired: true,

      backendApprovalRequired: true,

      expiredLicenseBlocksDuty: true
    },


    /* =======================================================
       6. VEHICLE DOCUMENT CONTROL
       ======================================================= */

    vehicleDocuments: {

      enabled: true,

      requiredForVehicleActivation: true,

      requiredBeforeAssignment: true,

      requiredBeforeTrip: true,

      registrationRequired: true,

      insuranceRequired: true,

      fitnessRequired: true,

      permitRequired: false,

      pollutionCertificateRequired: true,

      documentUpdateAllowed: true,

      manualReviewRequired: true,

      backendApprovalRequired: true,

      expiredDocumentBlocksVehicle: true
    },


    /* =======================================================
       7. DOCUMENT TYPES
       ======================================================= */

    documentTypes: {

      identityProof: true,

      addressProof: true,

      profilePhoto: true,

      bankProof: true,

      taxDocument: true,

      businessRegistration: true,

      companyRegistration: true,

      drivingLicense: true,

      vehicleRegistration: true,

      vehicleInsurance: true,

      vehicleFitness: true,

      vehiclePermit: true,

      pollutionCertificate: true,

      authorizationLetter: true,

      otherDocument: true
    },


    /* =======================================================
       8. DOCUMENT STATUS
       ======================================================= */

    documentStatus: {

      pending: true,

      submitted: true,

      underReview: true,

      approved: true,

      rejected: true,

      expired: true,

      replaced: true,

      suspended: true,

      deleted: true
    },


    /* =======================================================
       9. VERIFICATION
       ======================================================= */

    verification: {

      enabled: true,

      manualVerification: true,

      automaticVerification: false,

      backendVerification: true,

      verificationTimestampRequired: true,

      verifierIdentityRequired: true,

      rejectionReasonRequired: true,

      approvalCommentAllowed: true,

      rejectionCommentRequired: true,

      reVerificationAllowed: true,

      verificationHistoryRequired: true,

      frontendCanApprove: false,

      frontendCanReject: false,

      frontendCanMarkVerified: false
    },


    /* =======================================================
       10. EXPIRY CONTROL
       ======================================================= */

    expiry: {

      enabled: true,

      expiryDateRequired: true,

      expiryTrackingEnabled: true,

      expiryAlertEnabled: true,

      alertBeforeDays: 30,

      secondAlertBeforeDays: 7,

      expiredStatusEnabled: true,

      expiredDocumentBlocksActivation: true,

      expiredDocumentBlocksDuty: true,

      expiredDocumentBlocksVehicle: true,

      expiredDocumentBlocksOperations: true,

      backendExpiryAuthority: true
    },


    /* =======================================================
       11. DOCUMENT REPLACEMENT
       ======================================================= */

    replacement: {

      enabled: true,

      replacementAllowed: true,

      oldDocumentHistoryRequired: true,

      oldDocumentDeletionAllowed: false,

      replacementVerificationRequired: true,

      replacementApprovalRequired: true,

      backendReplacementAuthority: true
    },


    /* =======================================================
       12. ACCESS CONTROL
       ======================================================= */

    accessControl: {

      customerCanViewOwnDocuments: true,

      customerCanUploadOwnDocuments: true,

      customerCanReplaceOwnDocuments: true,

      customerCanDeleteOwnDocumentRequest: true,

      vendorCanViewOwnDocuments: true,

      vendorCanUploadOwnDocuments: true,

      vendorCanReplaceOwnDocuments: true,

      driverCanViewOwnDocuments: true,

      driverCanUploadOwnDocuments: true,

      driverCanReplaceOwnDocuments: true,

      adminCanViewDocuments: true,

      adminCanConfigureKYC: true,

      adminCanConfigureDocumentTypes: true,

      adminCanReviewQueue: true,

      frontendCanModifyVerificationResult: false
    },


    /* =======================================================
       13. PRIVACY / SECURITY
       ======================================================= */

    privacySecurity: {

      sensitiveDocumentProtection: true,

      documentAccessControl: true,

      ownerOnlyDocumentAccess: true,

      adminControlledAccess: true,

      unauthorizedAccessBlocked: true,

      publicDocumentUrlAllowed: false,

      publicDocumentListingAllowed: false,

      documentDownloadAuditRequired: true,

      documentViewAuditRequired: true,

      documentUploadAuditRequired: true,

      documentDeleteAuditRequired: true,

      verificationAuditRequired: true,

      backendSecurityAuthority: true
    },


    /* =======================================================
       14. FILE VALIDATION
       ======================================================= */

    fileValidation: {

      enabled: true,

      allowedMimeTypes: [

        "image/jpeg",

        "image/png",

        "application/pdf"
      ],

      maxFileSizeMB: 10,

      minimumFileSizeKB: 1,

      filenameRequired: true,

      extensionValidationRequired: true,

      mimeValidationRequired: true,

      emptyFileBlocked: true,

      corruptedFileCheckRequired: true,

      duplicateFileCheckEnabled: true
    },


    /* =======================================================
       15. DOCUMENT QUALITY
       ======================================================= */

    qualityControl: {

      enabled: true,

      imageQualityCheckEnabled: true,

      documentReadabilityCheckEnabled: true,

      blurDetectionEnabled: true,

      documentCompletenessCheckEnabled: true,

      tamperCheckEnabled: true,

      mismatchCheckEnabled: true,

      qualityFailureRequiresResubmission: true,

      backendQualityAuthority: true
    },


    /* =======================================================
       16. KYC WORKFLOW
       ======================================================= */

    workflow: {

      registrationToKYC: true,

      uploadToReview: true,

      reviewToApproval: true,

      reviewToRejection: true,

      rejectionToResubmission: true,

      expiryToRenewal: true,

      replacementToReview: true,

      approvalActivatesEligibleProfile: true,

      backendWorkflowAuthority: true
    },


    /* =======================================================
       17. DOCUMENT RETENTION
       ======================================================= */

    retention: {

      enabled: true,

      historyEnabled: true,

      approvedDocumentHistoryRequired: true,

      rejectedDocumentHistoryRequired: true,

      replacedDocumentHistoryRequired: true,

      deletedRecordRetentionRequired: true,

      frontendPermanentDeletionAllowed: false,

      backendRetentionAuthority: true
    },


    /* =======================================================
       18. NOTIFICATIONS
       ======================================================= */

    notifications: {

      enabled: true,

      uploadNotification: true,

      reviewStartedNotification: true,

      approvalNotification: true,

      rejectionNotification: true,

      resubmissionNotification: true,

      expiryNotification: true,

      renewalNotification: true,

      replacementNotification: true,

      operationalBlockNotification: true,

      backendNotificationAuthority: true
    },


    /* =======================================================
       19. OPERATIONAL BLOCKS
       ======================================================= */

    operationalBlocks: {

      pendingKYCBlockEnabled: true,

      rejectedKYCBlockEnabled: true,

      expiredDocumentBlockEnabled: true,

      missingRequiredDocumentBlockEnabled: true,

      failedVerificationBlockEnabled: true,

      failedQualityCheckBlockEnabled: true,

      vendorOperationBlockEnabled: true,

      driverDutyBlockEnabled: true,

      vehicleAssignmentBlockEnabled: true,

      tripActivationBlockEnabled: true,

      backendBlockAuthority: true
    },


    /* =======================================================
       20. AUDIT
       ======================================================= */

    audit: {

      enabled: true,

      localHistoryEnabled: true,

      maxLocalEvents: 200
    }
  };


  /* =========================================================
     UTILITY
     ========================================================= */

  function deepClone(value) {

    return JSON.parse(JSON.stringify(value));
  }


  function mergeDeep(target, source) {

    if (!source || typeof source !== "object") {
      return target;
    }

    Object.keys(source).forEach(function (key) {

      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {

        if (
          !target[key] ||
          typeof target[key] !== "object" ||
          Array.isArray(target[key])
        ) {

          target[key] = {};
        }

        mergeDeep(target[key], source[key]);

      } else {

        target[key] = source[key];
      }

    });

    return target;
  }


  /* =========================================================
     LOAD CONFIG
     ========================================================= */

  function loadConfig() {

    let stored = null;

    try {

      stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "null"
      );

    } catch (error) {

      stored = null;
    }


    if (!stored) {

      try {

        const legacy = JSON.parse(
          localStorage.getItem(LEGACY_STORAGE_KEY) || "null"
        );

        if (legacy) {
          stored = legacy;
        }

      } catch (error) {

        stored = null;
      }
    }


    const config = deepClone(DEFAULT_CONFIG);

    if (stored) {
      mergeDeep(config, stored);
    }

    enforceSafety(config);

    return config;
  }


  /* =========================================================
     SAFETY ENFORCEMENT
     ========================================================= */

  function enforceSafety(config) {

    config.version = VERSION;

    config.environment = "TESTING";


    /* -------------------------------------------------------
       Core Authority
       ------------------------------------------------------- */

    config.documentSystem.backendVerificationRequired = true;

    config.documentSystem.backendDocumentAuthority = true;

    config.kyc.backendKYCAuthority = true;

    config.kyc.frontendKYCAuthority = false;


    /* -------------------------------------------------------
       No automatic approval
       ------------------------------------------------------- */

    config.kyc.automaticApprovalAllowed = false;

    config.verification.automaticVerification = false;

    config.verification.frontendCanApprove = false;

    config.verification.frontendCanReject = false;

    config.verification.frontendCanMarkVerified = false;


    /* -------------------------------------------------------
       Security
       ------------------------------------------------------- */

    config.privacySecurity.publicDocumentUrlAllowed = false;

    config.privacySecurity.publicDocumentListingAllowed = false;

    config.privacySecurity.backendSecurityAuthority = true;


    /* -------------------------------------------------------
       Deletion protection
       ------------------------------------------------------- */

    config.replacement.oldDocumentDeletionAllowed = false;

    config.retention.frontendPermanentDeletionAllowed = false;


    /* -------------------------------------------------------
       Operational authority
       ------------------------------------------------------- */

    config.workflow.backendWorkflowAuthority = true;

    config.operationalBlocks.backendBlockAuthority = true;


    /* -------------------------------------------------------
       Backend authorities
       ------------------------------------------------------- */

    config.expiry.backendExpiryAuthority = true;

    config.replacement.backendReplacementAuthority = true;

    config.qualityControl.backendQualityAuthority = true;

    config.retention.backendRetentionAuthority = true;

    config.notifications.backendNotificationAuthority = true;


    return config;
  }


  /* =========================================================
     VALIDATION
     ========================================================= */

  function validateConfig(input) {

    const config = deepClone(
      input || loadConfig()
    );

    const errors = [];

    const warnings = [];


    /* -------------------------------------------------------
       Environment
       ------------------------------------------------------- */

    if (config.environment !== "TESTING") {

      errors.push(
        "26F environment must remain TESTING."
      );
    }


    /* -------------------------------------------------------
       Authority
       ------------------------------------------------------- */

    if (
      config.kyc.frontendKYCAuthority !== false
    ) {

      errors.push(
        "Frontend KYC authority must remain FALSE."
      );
    }


    if (
      config.kyc.backendKYCAuthority !== true
    ) {

      errors.push(
        "Backend KYC authority must remain TRUE."
      );
    }


    if (
      config.documentSystem.backendDocumentAuthority !== true
    ) {

      errors.push(
        "Backend document authority must remain TRUE."
      );
    }


    if (
      config.documentSystem.backendVerificationRequired !== true
    ) {

      errors.push(
        "Backend document verification is required."
      );
    }


    /* -------------------------------------------------------
       Approval Safety
       ------------------------------------------------------- */

    if (
      config.kyc.automaticApprovalAllowed !== false
    ) {

      errors.push(
        "Automatic KYC approval must remain disabled."
      );
    }


    if (
      config.verification.automaticVerification !== false
    ) {

      errors.push(
        "Automatic verification must remain disabled."
      );
    }


    if (
      config.verification.frontendCanApprove !== false
    ) {

      errors.push(
        "Frontend cannot approve KYC."
      );
    }


    if (
      config.verification.frontendCanReject !== false
    ) {

      errors.push(
        "Frontend cannot reject KYC."
      );
    }


    if (
      config.verification.frontendCanMarkVerified !== false
    ) {

      errors.push(
        "Frontend cannot mark documents verified."
      );
    }


    /* -------------------------------------------------------
       Privacy
       ------------------------------------------------------- */

    if (
      config.privacySecurity.publicDocumentUrlAllowed !== false
    ) {

      errors.push(
        "Public document URLs must remain disabled."
      );
    }


    if (
      config.privacySecurity.publicDocumentListingAllowed !== false
    ) {

      errors.push(
        "Public document listing must remain disabled."
      );
    }


    if (
      config.privacySecurity.backendSecurityAuthority !== true
    ) {

      errors.push(
        "Backend security authority is required."
      );
    }


    /* -------------------------------------------------------
       Deletion
       ------------------------------------------------------- */

    if (
      config.replacement.oldDocumentDeletionAllowed !== false
    ) {

      errors.push(
        "Permanent old-document deletion must remain disabled."
      );
    }


    if (
      config.retention.frontendPermanentDeletionAllowed !== false
    ) {

      errors.push(
        "Frontend permanent document deletion must remain disabled."
      );
    }


    /* -------------------------------------------------------
       Workflow
       ------------------------------------------------------- */

    if (
      config.workflow.backendWorkflowAuthority !== true
    ) {

      errors.push(
        "Backend workflow authority is required."
      );
    }


    /* -------------------------------------------------------
       Operational Blocks
       ------------------------------------------------------- */

    if (
      config.operationalBlocks.backendBlockAuthority !== true
    ) {

      errors.push(
        "Backend operational block authority is required."
      );
    }


    /* -------------------------------------------------------
       Expiry
       ------------------------------------------------------- */

    const alertDays =
      Number(config.expiry.alertBeforeDays);

    const secondAlertDays =
      Number(config.expiry.secondAlertBeforeDays);


    if (
      !Number.isFinite(alertDays) ||
      alertDays < 0 ||
      alertDays > 365
    ) {

      errors.push(
        "Primary expiry alert must be between 0 and 365 days."
      );
    }


    if (
      !Number.isFinite(secondAlertDays) ||
      secondAlertDays < 0 ||
      secondAlertDays > 365
    ) {

      errors.push(
        "Second expiry alert must be between 0 and 365 days."
      );
    }


    if (
      secondAlertDays > alertDays
    ) {

      errors.push(
        "Second expiry alert cannot be later than primary alert."
      );
    }


    /* -------------------------------------------------------
       File Validation
       ------------------------------------------------------- */

    const maxFileSize =
      Number(config.fileValidation.maxFileSizeMB);

    const minFileSize =
      Number(config.fileValidation.minimumFileSizeKB);


    if (
      !Number.isFinite(maxFileSize) ||
      maxFileSize <= 0 ||
      maxFileSize > 100
    ) {

      errors.push(
        "Maximum file size must be between 0 and 100 MB."
      );
    }


    if (
      !Number.isFinite(minFileSize) ||
      minFileSize < 0 ||
      minFileSize > 1024
    ) {

      errors.push(
        "Minimum file size must be between 0 and 1024 KB."
      );
    }


    if (
      !Array.isArray(
        config.fileValidation.allowedMimeTypes
      ) ||
      config.fileValidation.allowedMimeTypes.length === 0
    ) {

      errors.push(
        "At least one allowed document MIME type is required."
      );
    }


    /* -------------------------------------------------------
       Required Documents
       ------------------------------------------------------- */

    if (
      config.kyc.driverKYCRequired &&
      !config.documentTypes.drivingLicense
    ) {

      errors.push(
        "Driving License document type is required for Driver KYC."
      );
    }


    if (
      config.vehicleKYC.vehicleKYCRequired === true &&
      !config.documentTypes.vehicleRegistration
    ) {

      errors.push(
        "Vehicle Registration document type is required."
      );
    }


    /* -------------------------------------------------------
       Audit
       ------------------------------------------------------- */

    if (
      config.audit.enabled !== true
    ) {

      errors.push(
        "26F audit must remain enabled."
      );
    }


    if (
      config.audit.localHistoryEnabled !== true
    ) {

      errors.push(
        "26F local audit history must remain enabled."
      );
    }


    if (errors.length === 0) {

      warnings.push(
        "Document and KYC verification authority remains with the backend."
      );
    }


    return {

      valid: errors.length === 0,

      errors: errors,

      warnings: warnings
    };
  }


  /* =========================================================
     AUDIT
     ========================================================= */

  function getAudit() {

    try {

      const data = JSON.parse(
        localStorage.getItem(AUDIT_KEY) || "[]"
      );

      return Array.isArray(data)
        ? data
        : [];

    } catch (error) {

      return [];
    }
  }


  function writeAudit(action, details) {

    const config = loadConfig();

    if (
      !config.audit.enabled ||
      !config.audit.localHistoryEnabled
    ) {

      return;
    }


    const events = getAudit();


    events.unshift({

      id:
        "26F-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2, 8),

      module: "26F",

      action: action,

      timestamp:
        new Date().toISOString(),

      details:
        details || {}
    });


    const limit =
      Number(config.audit.maxLocalEvents) || 200;


    try {

      localStorage.setItem(

        AUDIT_KEY,

        JSON.stringify(
          events.slice(0, limit)
        )
      );

    } catch (error) {

      /* Ignore local storage errors */
    }
  }


  /* =========================================================
     CONFIGURATION METHODS
     ========================================================= */

  function getConfig() {

    return deepClone(
      loadConfig()
    );
  }


  function save(config) {

    const candidate =
      deepClone(
        config || loadConfig()
      );


    enforceSafety(candidate);


    const validation =
      validateConfig(candidate);


    if (!validation.valid) {

      return {

        success: false,

        saved: false,

        validation: validation
      };
    }


    try {

      localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(candidate)
      );


      writeAudit(
        "DOCUMENT_KYC_CONFIG_SAVE",
        {
          version: VERSION
        }
      );


      return {

        success: true,

        saved: true,

        validation: validation,

        config:
          deepClone(candidate)
      };


    } catch (error) {

      return {

        success: false,

        saved: false,

        validation: validation,

        error:
          error.message
      };
    }
  }


  function reset() {

    const config =
      deepClone(
        DEFAULT_CONFIG
      );


    enforceSafety(config);


    try {

      localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(config)
      );


      writeAudit(
        "DOCUMENT_KYC_CONFIG_RESET",
        {
          version: VERSION
        }
      );


      return {

        success: true,

        config:
          deepClone(config)
      };


    } catch (error) {

      return {

        success: false,

        error:
          error.message
      };
    }
  }


  function reload() {

    const config =
      loadConfig();


    writeAudit(
      "DOCUMENT_KYC_CONFIG_RELOAD",
      {
        version: VERSION
      }
    );


    return deepClone(config);
  }


  function setPolicy(path, value) {

    const config =
      loadConfig();


    const parts =
      String(path || "")
        .split(".")
        .filter(Boolean);


    if (!parts.length) {

      return {

        success: false,

        error:
          "Invalid policy path."
      };
    }


    let cursor = config;


    for (
      let i = 0;
      i < parts.length - 1;
      i++
    ) {

      if (
        !cursor[parts[i]] ||
        typeof cursor[parts[i]] !== "object"
      ) {

        cursor[parts[i]] = {};
      }


      cursor =
        cursor[parts[i]];
    }


    cursor[
      parts[parts.length - 1]
    ] = value;


    return save(config);
  }


  /* =========================================================
     STATUS
     ========================================================= */

  function getStatus() {

    const config =
      loadConfig();


    return {

      environment:
        config.environment,

      documentSystemEnabled:
        config.documentSystem.enabled,

      kycEnabled:
        config.kyc.enabled,

      backendKYCAuthority:
        config.kyc.backendKYCAuthority,

      frontendKYCAuthority:
        config.kyc.frontendKYCAuthority,

      backendDocumentAuthority:
        config.documentSystem.backendDocumentAuthority,

      automaticApprovalBlocked:
        config.kyc.automaticApprovalAllowed === false,

      frontendApprovalBlocked:
        config.verification.frontendCanApprove === false,

      publicDocumentsBlocked:
        config.privacySecurity.publicDocumentUrlAllowed === false,

      expiryTracking:
        config.expiry.expiryTrackingEnabled,

      auditEnabled:
        config.audit.enabled
    };
  }


  /* =========================================================
     UI HELPERS
     ========================================================= */

  function escapeHtml(value) {

    return String(value)

      .replace(/&/g, "&amp;")

      .replace(/</g, "&lt;")

      .replace(/>/g, "&gt;")

      .replace(/"/g, "&quot;")

      .replace(/'/g, "&#039;");
  }


  function checked(value) {

    return value
      ? "checked"
      : "";
  }


  function numberValue(value) {

    return escapeHtml(

      Number.isFinite(
        Number(value)
      )

        ? Number(value)

        : 0
    );
  }


  function checkbox(
    path,
    label,
    value
  ) {

    return `

      <label class="govara26f-check">

        <input
          type="checkbox"
          data-26f-path="${escapeHtml(path)}"
          ${checked(value)}
        >

        <span>
          ${escapeHtml(label)}
        </span>

      </label>

    `;
  }


  function numberInput(
    path,
    label,
    value,
    min,
    max,
    step
  ) {

    return `

      <label class="govara26f-field">

        <span>
          ${escapeHtml(label)}
        </span>

        <input
          type="number"
          data-26f-path="${escapeHtml(path)}"
          value="${numberValue(value)}"
          min="${min}"
          max="${max}"
          step="${step || "1"}"
        >

      </label>

    `;
  }


  function section(
    title,
    description,
    content
  ) {

    return `

      <section class="card govara26f-section">

        <div class="govara26f-section-head">

          <div>

            <h2>
              ${escapeHtml(title)}
            </h2>

            <div class="muted">
              ${escapeHtml(description)}
            </div>

          </div>

        </div>

        <div class="govara26f-section-body">

          ${content}

        </div>

      </section>

    `;
  }


  /* =========================================================
     RENDER
     ========================================================= */

  function render() {

    const config =
      loadConfig();


    const validation =
      validateConfig(config);


    return `

      <div class="page-head">

        <h1>
          26F — Documents & KYC
        </h1>

        <div class="muted">

          Document management, KYC policy,
          verification, expiry and document security controls.

        </div>

      </div>


      <!-- ===================================================
           STATUS
           =================================================== -->

      <section class="card govara26f-status-card">

        <h2>
          Documents & KYC Status
        </h2>


        <div class="grid four">

          <div>

            <b>
              TESTING
            </b>

            <div class="muted">
              Environment
            </div>

          </div>


          <div>

            <b>
              KYC ENABLED
            </b>

            <div class="muted">
              Master Control
            </div>

          </div>


          <div>

            <b>
              BACKEND AUTHORITY
            </b>

            <div class="muted">
              Verification Authority
            </div>

          </div>


          <div>

            <b>
              PUBLIC DOCS BLOCKED
            </b>

            <div class="muted">
              Privacy
            </div>

          </div>

        </div>


        <div class="notice warn">

          <strong>
            Authority Boundary
          </strong>

          <div>
            Frontend = Configuration / Upload UI / Display / Request
          </div>

          <div>
            Backend = KYC Verification / Approval / Rejection / Authority
          </div>

          <div>
            Database = Authoritative Document & KYC Records
          </div>

        </div>

      </section>


      <!-- ===================================================
           1
           =================================================== -->

      ${section(

        "1. Document System",

        "Master document-management controls.",

        `

        <div class="grid two">

          <div>

            ${checkbox(
              "documentSystem.enabled",
              "Document System Enabled",
              config.documentSystem.enabled
            )}

            ${checkbox(
              "documentSystem.documentUploadEnabled",
              "Document Upload",
              config.documentSystem.documentUploadEnabled
            )}

            ${checkbox(
              "documentSystem.documentViewEnabled",
              "Document View",
              config.documentSystem.documentViewEnabled
            )}

            ${checkbox(
              "documentSystem.documentUpdateEnabled",
              "Document Update",
              config.documentSystem.documentUpdateEnabled
            )}

            ${checkbox(
              "documentSystem.documentDeleteRequestEnabled",
              "Delete Request",
              config.documentSystem.documentDeleteRequestEnabled
            )}

          </div>


          <div>

            ${checkbox(
              "documentSystem.documentHistoryEnabled",
              "Document History",
              config.documentSystem.documentHistoryEnabled
            )}

            ${checkbox(
              "documentSystem.documentStatusViewEnabled",
              "Document Status View",
              config.documentSystem.documentStatusViewEnabled
            )}

            ${checkbox(
              "documentSystem.expiryTrackingEnabled",
              "Expiry Tracking",
              config.documentSystem.expiryTrackingEnabled
            )}

            ${checkbox(
              "documentSystem.expiryAlertEnabled",
              "Expiry Alerts",
              config.documentSystem.expiryAlertEnabled
            )}

            ${checkbox(
              "documentSystem.documentVerificationEnabled",
              "Document Verification",
              config.documentSystem.documentVerificationEnabled
            )}

            ${checkbox(
              "documentSystem.manualVerificationEnabled",
              "Manual Verification",
              config.documentSystem.manualVerificationEnabled
            )}

            ${checkbox(
              "documentSystem.automaticVerificationEnabled",
              "Automatic Verification",
              config.documentSystem.automaticVerificationEnabled
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           2
           =================================================== -->

      ${section(

        "2. KYC Master Control",

        "Global KYC activation and authority rules.",

        `

        <div class="grid two">

          <div>

            ${checkbox(
              "kyc.enabled",
              "KYC Enabled",
              config.kyc.enabled
            )}

            ${checkbox(
              "kyc.customerKYCRequired",
              "Customer KYC Required",
              config.kyc.customerKYCRequired
            )}

            ${checkbox(
              "kyc.vendorKYCRequired",
              "Vendor KYC Required",
              config.kyc.vendorKYCRequired
            )}

            ${checkbox(
              "kyc.driverKYCRequired",
              "Driver KYC Required",
              config.kyc.driverKYCRequired
            )}

            ${checkbox(
              "kyc.vehicleKYCRequired",
              "Vehicle KYC Required",
              config.kyc.vehicleKYCRequired
            )}

          </div>


          <div>

            ${checkbox(
              "kyc.manualReviewAllowed",
              "Manual Review",
              config.kyc.manualReviewAllowed
            )}

            ${checkbox(
              "kyc.automaticApprovalAllowed",
              "Automatic Approval",
              config.kyc.automaticApprovalAllowed
            )}

            ${checkbox(
              "kyc.reVerificationRequired",
              "Re-verification Required",
              config.kyc.reVerificationRequired
            )}

            ${checkbox(
              "kyc.expiredKYCBlocksActivation",
              "Expired KYC Blocks Activation",
              config.kyc.expiredKYCBlocksActivation
            )}

            ${checkbox(
              "kyc.rejectedKYCBlocksActivation",
              "Rejected KYC Blocks Activation",
              config.kyc.rejectedKYCBlocksActivation
            )}

            ${checkbox(
              "kyc.pendingKYCBlocksActivation",
              "Pending KYC Blocks Activation",
              config.kyc.pendingKYCBlocksActivation
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           3
           =================================================== -->

      ${section(

        "3. Customer KYC",

        "Customer-specific KYC requirements.",

        `

        <div class="grid two">

          <div>

            ${checkbox(
              "customerKYC.enabled",
              "Customer KYC Enabled",
              config.customerKYC.enabled
            )}

            ${checkbox(
              "customerKYC.requiredForRegistration",
              "Required for Registration",
              config.customerKYC.requiredForRegistration
            )}

            ${checkbox(
              "customerKYC.requiredForBooking",
              "Required for Booking",
              config.customerKYC.requiredForBooking
            )}

            ${checkbox(
              "customerKYC.requiredBeforeTrip",
              "Required Before Trip",
              config.customerKYC.requiredBeforeTrip
            )}

          </div>


          <div>

            ${checkbox(
              "customerKYC.requiredForWalletFeatures",
              "Required for Wallet Features",
              config.customerKYC.requiredForWalletFeatures
            )}

            ${checkbox(
              "customerKYC.requiredForRefundRequest",
              "Required for Refund Request",
              config.customerKYC.requiredForRefundRequest
            )}

            ${checkbox(
              "customerKYC.requiredForProfileCompletion",
              "Required for Profile Completion",
              config.customerKYC.requiredForProfileCompletion
            )}

            ${checkbox(
              "customerKYC.documentUpdateAllowed",
              "Document Update Allowed",
              config.customerKYC.documentUpdateAllowed
            )}

            ${checkbox(
              "customerKYC.manualReviewRequired",
              "Manual Review Required",
              config.customerKYC.manualReviewRequired
            )}

            ${checkbox(
              "customerKYC.backendApprovalRequired",
              "Backend Approval Required",
              config.customerKYC.backendApprovalRequired
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           4
           =================================================== -->

      ${section(

        "4. Vendor KYC",

        "Vendor/company verification requirements.",

        `

        <div class="grid two">

          <div>

            ${checkbox(
              "vendorKYC.enabled",
              "Vendor KYC Enabled",
              config.vendorKYC.enabled
            )}

            ${checkbox(
              "vendorKYC.requiredForRegistration",
              "Required for Registration",
              config.vendorKYC.requiredForRegistration
            )}

            ${checkbox(
              "vendorKYC.requiredBeforeOperations",
              "Required Before Operations",
              config.vendorKYC.requiredBeforeOperations
            )}

            ${checkbox(
              "vendorKYC.requiredBeforeBookingManagement",
              "Required Before Booking Management",
              config.vendorKYC.requiredBeforeBookingManagement
            )}

          </div>


          <div>

            ${checkbox(
              "vendorKYC.requiredBeforeDriverAssignment",
              "Required Before Driver Assignment",
              config.vendorKYC.requiredBeforeDriverAssignment
            )}

            ${checkbox(
              "vendorKYC.requiredBeforeVehicleAssignment",
              "Required Before Vehicle Assignment",
              config.vendorKYC.requiredBeforeVehicleAssignment
            )}

            ${checkbox(
              "vendorKYC.documentUpdateAllowed",
              "Document Update Allowed",
              config.vendorKYC.documentUpdateAllowed
            )}

            ${checkbox(
              "vendorKYC.manualReviewRequired",
              "Manual Review Required",
              config.vendorKYC.manualReviewRequired
            )}

            ${checkbox(
              "vendorKYC.backendApprovalRequired",
              "Backend Approval Required",
              config.vendorKYC.backendApprovalRequired
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           5
           =================================================== -->

      ${section(

        "5. Driver KYC",

        "Driver identity, license and operational eligibility.",

        `

        <div class="grid two">

          <div>

            ${checkbox(
              "driverKYC.enabled",
              "Driver KYC Enabled",
              config.driverKYC.enabled
            )}

            ${checkbox(
              "driverKYC.requiredForRegistration",
              "Required for Registration",
              config.driverKYC.requiredForRegistration
            )}

            ${checkbox(
              "driverKYC.requiredBeforeDuty",
              "Required Before Duty",
              config.driverKYC.requiredBeforeDuty
            )}

            ${checkbox(
              "driverKYC.requiredBeforeTrip",
              "Required Before Trip",
              config.driverKYC.requiredBeforeTrip
            )}

          </div>


          <div>

            ${checkbox(
              "driverKYC.requiredBeforeBookingAcceptance",
              "Required Before Booking Acceptance",
              config.driverKYC.requiredBeforeBookingAcceptance
            )}

            ${checkbox(
              "driverKYC.documentUpdateAllowed",
              "Document Update Allowed",
              config.driverKYC.documentUpdateAllowed
            )}

            ${checkbox(
              "driverKYC.manualReviewRequired",
              "Manual Review Required",
              config.driverKYC.manualReviewRequired
            )}

            ${checkbox(
              "driverKYC.backendApprovalRequired",
              "Backend Approval Required",
              config.driverKYC.backendApprovalRequired
            )}

            ${checkbox(
              "driverKYC.expiredLicenseBlocksDuty",
              "Expired License Blocks Duty",
              config.driverKYC.expiredLicenseBlocksDuty
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           6
           =================================================== -->

      ${section(

        "6. Vehicle Documents",

        "Vehicle registration, insurance and compliance documents.",

        `

        <div class="grid two">

          <div>

            ${checkbox(
              "vehicleDocuments.enabled",
              "Vehicle Documents Enabled",
              config.vehicleDocuments.enabled
            )}

            ${checkbox(
              "vehicleDocuments.requiredForVehicleActivation",
              "Required for Vehicle Activation",
              config.vehicleDocuments.requiredForVehicleActivation
            )}

            ${checkbox(
              "vehicleDocuments.requiredBeforeAssignment",
              "Required Before Assignment",
              config.vehicleDocuments.requiredBeforeAssignment
            )}

            ${checkbox(
              "vehicleDocuments.requiredBeforeTrip",
              "Required Before Trip",
              config.vehicleDocuments.requiredBeforeTrip
            )}

            ${checkbox(
              "vehicleDocuments.registrationRequired",
              "Vehicle Registration",
              config.vehicleDocuments.registrationRequired
            )}

            ${checkbox(
              "vehicleDocuments.insuranceRequired",
              "Insurance",
              config.vehicleDocuments.insuranceRequired
            )}

          </div>


          <div>

            ${checkbox(
              "vehicleDocuments.fitnessRequired",
              "Fitness Certificate",
              config.vehicleDocuments.fitnessRequired
            )}

            ${checkbox(
              "vehicleDocuments.permitRequired",
              "Permit",
              config.vehicleDocuments.permitRequired
            )}

            ${checkbox(
              "vehicleDocuments.pollutionCertificateRequired",
              "Pollution Certificate",
              config.vehicleDocuments.pollutionCertificateRequired
            )}

            ${checkbox(
              "vehicleDocuments.documentUpdateAllowed",
              "Document Update Allowed",
              config.vehicleDocuments.documentUpdateAllowed
            )}

            ${checkbox(
              "vehicleDocuments.manualReviewRequired",
              "Manual Review Required",
              config.vehicleDocuments.manualReviewRequired
            )}

            ${checkbox(
              "vehicleDocuments.backendApprovalRequired",
              "Backend Approval Required",
              config.vehicleDocuments.backendApprovalRequired
            )}

            ${checkbox(
              "vehicleDocuments.expiredDocumentBlocksVehicle",
              "Expired Document Blocks Vehicle",
              config.vehicleDocuments.expiredDocumentBlocksVehicle
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           7
           =================================================== -->

      ${section(

        "7. Document Types",

        "Supported document categories.",

        `

        <div class="grid three">

          ${checkbox(
            "documentTypes.identityProof",
            "Identity Proof",
            config.documentTypes.identityProof
          )}

          ${checkbox(
            "documentTypes.addressProof",
            "Address Proof",
            config.documentTypes.addressProof
          )}

          ${checkbox(
            "documentTypes.profilePhoto",
            "Profile Photo",
            config.documentTypes.profilePhoto
          )}

          ${checkbox(
            "documentTypes.bankProof",
            "Bank Proof",
            config.documentTypes.bankProof
          )}

          ${checkbox(
            "documentTypes.taxDocument",
            "Tax Document",
            config.documentTypes.taxDocument
          )}

          ${checkbox(
            "documentTypes.businessRegistration",
            "Business Registration",
            config.documentTypes.businessRegistration
          )}

          ${checkbox(
            "documentTypes.companyRegistration",
            "Company Registration",
            config.documentTypes.companyRegistration
          )}

          ${checkbox(
            "documentTypes.drivingLicense",
            "Driving License",
            config.documentTypes.drivingLicense
          )}

          ${checkbox(
            "documentTypes.vehicleRegistration",
            "Vehicle Registration",
            config.documentTypes.vehicleRegistration
          )}

          ${checkbox(
            "documentTypes.vehicleInsurance",
            "Vehicle Insurance",
            config.documentTypes.vehicleInsurance
          )}

          ${checkbox(
            "documentTypes.vehicleFitness",
            "Vehicle Fitness",
            config.documentTypes.vehicleFitness
          )}

          ${checkbox(
            "documentTypes.vehiclePermit",
            "Vehicle Permit",
            config.documentTypes.vehiclePermit
          )}

          ${checkbox(
            "documentTypes.pollutionCertificate",
            "Pollution Certificate",
            config.documentTypes.pollutionCertificate
          )}

          ${checkbox(
            "documentTypes.authorizationLetter",
            "Authorization Letter",
            config.documentTypes.authorizationLetter
          )}

          ${checkbox(
            "documentTypes.otherDocument",
            "Other Document",
            config.documentTypes.otherDocument
          )}

        </div>

        `
      )}


      <!-- ===================================================
           8
           =================================================== -->

      ${section(

        "8. Document Status",

        "Document lifecycle statuses.",

        `

        <div class="grid four">

          ${checkbox(
            "documentStatus.pending",
            "Pending",
            config.documentStatus.pending
          )}

          ${checkbox(
            "documentStatus.submitted",
            "Submitted",
            config.documentStatus.submitted
          )}

          ${checkbox(
            "documentStatus.underReview",
            "Under Review",
            config.documentStatus.underReview
          )}

          ${checkbox(
            "documentStatus.approved",
            "Approved",
            config.documentStatus.approved
          )}

          ${checkbox(
            "documentStatus.rejected",
            "Rejected",
            config.documentStatus.rejected
          )}

          ${checkbox(
            "documentStatus.expired",
            "Expired",
            config.documentStatus.expired
          )}

          ${checkbox(
            "documentStatus.replaced",
            "Replaced",
            config.documentStatus.replaced
          )}

          ${checkbox(
            "documentStatus.suspended",
            "Suspended",
            config.documentStatus.suspended
          )}

          ${checkbox(
            "documentStatus.deleted",
            "Deleted",
            config.documentStatus.deleted
          )}

        </div>

        `
      )}


      <!-- ===================================================
           9
           =================================================== -->

      ${section(

        "9. Verification",

        "Verification workflow and authority controls.",

        `

        <div class="grid two">

          <div>

            ${checkbox(
              "verification.enabled",
              "Verification Enabled",
              config.verification.enabled
            )}

            ${checkbox(
              "verification.manualVerification",
              "Manual Verification",
              config.verification.manualVerification
            )}

            ${checkbox(
              "verification.automaticVerification",
              "Automatic Verification",
              config.verification.automaticVerification
            )}

            ${checkbox(
              "verification.backendVerification",
              "Backend Verification",
              config.verification.backendVerification
            )}

            ${checkbox(
              "verification.verificationTimestampRequired",
              "Verification Timestamp Required",
              config.verification.verificationTimestampRequired
            )}

            ${checkbox(
              "verification.verifierIdentityRequired",
              "Verifier Identity Required",
              config.verification.verifierIdentityRequired
            )}

          </div>


          <div>

            ${checkbox(
              "verification.rejectionReasonRequired",
              "Rejection Reason Required",
              config.verification.rejectionReasonRequired
            )}

            ${checkbox(
              "verification.approvalCommentAllowed",
              "Approval Comment",
              config.verification.approvalCommentAllowed
            )}

            ${checkbox(
              "verification.rejectionCommentRequired",
              "Rejection Comment Required",
              config.verification.rejectionCommentRequired
            )}

            ${checkbox(
              "verification.reVerificationAllowed",
              "Re-verification Allowed",
              config.verification.reVerificationAllowed
            )}

            ${checkbox(
              "verification.verificationHistoryRequired",
              "Verification History Required",
              config.verification.verificationHistoryRequired
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           10
           =================================================== -->

      ${section(

        "10. Expiry Control",

        "Document expiry monitoring and operational blocking.",

        `

        <div class="grid two">

          <div>

            ${checkbox(
              "expiry.enabled",
              "Expiry Control Enabled",
              config.expiry.enabled
            )}

            ${checkbox(
              "expiry.expiryDateRequired",
              "Expiry Date Required",
              config.expiry.expiryDateRequired
            )}

            ${checkbox(
              "expiry.expiryTrackingEnabled",
              "Expiry Tracking",
              config.expiry.expiryTrackingEnabled
            )}

            ${checkbox(
              "expiry.expiryAlertEnabled",
              "Expiry Alerts",
              config.expiry.expiryAlertEnabled
            )}

            ${numberInput(
              "expiry.alertBeforeDays",
              "Primary Alert Before Days",
              config.expiry.alertBeforeDays,
              0,
              365,
              1
            )}

            ${numberInput(
              "expiry.secondAlertBeforeDays",
              "Second Alert Before Days",
              config.expiry.secondAlertBeforeDays,
              0,
              365,
              1
            )}

          </div>


          <div>

            ${checkbox(
              "expiry.expiredStatusEnabled",
              "Expired Status",
              config.expiry.expiredStatusEnabled
            )}

            ${checkbox(
              "expiry.expiredDocumentBlocksActivation",
              "Expired Document Blocks Activation",
              config.expiry.expiredDocumentBlocksActivation
            )}

            ${checkbox(
              "expiry.expiredDocumentBlocksDuty",
              "Expired Document Blocks Duty",
              config.expiry.expiredDocumentBlocksDuty
            )}

            ${checkbox(
              "expiry.expiredDocumentBlocksVehicle",
              "Expired Document Blocks Vehicle",
              config.expiry.expiredDocumentBlocksVehicle
            )}

            ${checkbox(
              "expiry.expiredDocumentBlocksOperations",
              "Expired Document Blocks Operations",
              config.expiry.expiredDocumentBlocksOperations
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           11
           =================================================== -->

      ${section(

        "11. Document Replacement",

        "Safe replacement without losing document history.",

        `

        <div class="grid two">

          <div>

            ${checkbox(
              "replacement.enabled",
              "Replacement Enabled",
              config.replacement.enabled
            )}

            ${checkbox(
              "replacement.replacementAllowed",
              "Replacement Allowed",
              config.replacement.replacementAllowed
            )}

            ${checkbox(
              "replacement.oldDocumentHistoryRequired",
              "Old Document History Required",
              config.replacement.oldDocumentHistoryRequired
            )}

          </div>


          <div>

            ${checkbox(
              "replacement.oldDocumentDeletionAllowed",
              "Old Document Permanent Deletion",
              config.replacement.oldDocumentDeletionAllowed
            )}

            ${checkbox(
              "replacement.replacementVerificationRequired",
              "Replacement Verification Required",
              config.replacement.replacementVerificationRequired
            )}

            ${checkbox(
              "replacement.replacementApprovalRequired",
              "Replacement Approval Required",
              config.replacement.replacementApprovalRequired
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           12
           =================================================== -->

      ${section(

        "12. Access Control",

        "Role-based document access boundaries.",

        `

        <div class="grid two">

          <div>

            ${checkbox(
              "accessControl.customerCanViewOwnDocuments",
              "Customer — View Own Documents",
              config.accessControl.customerCanViewOwnDocuments
            )}

            ${checkbox(
              "accessControl.customerCanUploadOwnDocuments",
              "Customer — Upload Own Documents",
              config.accessControl.customerCanUploadOwnDocuments
            )}

            ${checkbox(
              "accessControl.customerCanReplaceOwnDocuments",
              "Customer — Replace Own Documents",
              config.accessControl.customerCanReplaceOwnDocuments
            )}

            ${checkbox(
              "accessControl.customerCanDeleteOwnDocumentRequest",
              "Customer — Delete Request",
              config.accessControl.customerCanDeleteOwnDocumentRequest
            )}

            ${checkbox(
              "accessControl.vendorCanViewOwnDocuments",
              "Vendor — View Own Documents",
              config.accessControl.vendorCanViewOwnDocuments
            )}

            ${checkbox(
              "accessControl.vendorCanUploadOwnDocuments",
              "Vendor — Upload Own Documents",
              config.accessControl.vendorCanUploadOwnDocuments
            )}

            ${checkbox(
              "accessControl.vendorCanReplaceOwnDocuments",
              "Vendor — Replace Own Documents",
              config.accessControl.vendorCanReplaceOwnDocuments
            )}

          </div>


          <div>

            ${checkbox(
              "accessControl.driverCanViewOwnDocuments",
              "Driver — View Own Documents",
              config.accessControl.driverCanViewOwnDocuments
            )}

            ${checkbox(
              "accessControl.driverCanUploadOwnDocuments",
              "Driver — Upload Own Documents",
              config.accessControl.driverCanUploadOwnDocuments
            )}

            ${checkbox(
              "accessControl.driverCanReplaceOwnDocuments",
              "Driver — Replace Own Documents",
              config.accessControl.driverCanReplaceOwnDocuments
            )}

            ${checkbox(
              "accessControl.adminCanViewDocuments",
              "Admin — View Documents",
              config.accessControl.adminCanViewDocuments
            )}

            ${checkbox(
              "accessControl.adminCanConfigureKYC",
              "Admin — Configure KYC",
              config.accessControl.adminCanConfigureKYC
            )}

            ${checkbox(
              "accessControl.adminCanConfigureDocumentTypes",
              "Admin — Configure Document Types",
              config.accessControl.adminCanConfigureDocumentTypes
            )}

            ${checkbox(
              "accessControl.adminCanReviewQueue",
              "Admin — Review Queue",
              config.accessControl.adminCanReviewQueue
            )}

            ${checkbox(
              "accessControl.frontendCanModifyVerificationResult",
              "Frontend Can Modify Verification Result",
              config.accessControl.frontendCanModifyVerificationResult
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           13
           =================================================== -->

      ${section(

        "13. Privacy & Security",

        "Sensitive document protection.",

        `

        <div class="grid two">

          <div>

            ${checkbox(
              "privacySecurity.sensitiveDocumentProtection",
              "Sensitive Document Protection",
              config.privacySecurity.sensitiveDocumentProtection
            )}

            ${checkbox(
              "privacySecurity.documentAccessControl",
              "Document Access Control",
              config.privacySecurity.documentAccessControl
            )}

            ${checkbox(
              "privacySecurity.ownerOnlyDocumentAccess",
              "Owner-only Document Access",
              config.privacySecurity.ownerOnlyDocumentAccess
            )}

            ${checkbox(
              "privacySecurity.adminControlledAccess",
              "Admin Controlled Access",
              config.privacySecurity.adminControlledAccess
            )}

            ${checkbox(
              "privacySecurity.unauthorizedAccessBlocked",
              "Unauthorized Access Blocked",
              config.privacySecurity.unauthorizedAccessBlocked
            )}

          </div>


          <div>

            ${checkbox(
              "privacySecurity.publicDocumentUrlAllowed",
              "Public Document URL",
              config.privacySecurity.publicDocumentUrlAllowed
            )}

            ${checkbox(
              "privacySecurity.publicDocumentListingAllowed",
              "Public Document Listing",
              config.privacySecurity.publicDocumentListingAllowed
            )}

            ${checkbox(
              "privacySecurity.documentDownloadAuditRequired",
              "Download Audit Required",
              config.privacySecurity.documentDownloadAuditRequired
            )}

            ${checkbox(
              "privacySecurity.documentViewAuditRequired",
              "View Audit Required",
              config.privacySecurity.documentViewAuditRequired
            )}

            ${checkbox(
              "privacySecurity.documentUploadAuditRequired",
              "Upload Audit Required",
              config.privacySecurity.documentUploadAuditRequired
            )}

            ${checkbox(
              "privacySecurity.documentDeleteAuditRequired",
              "Delete Audit Required",
              config.privacySecurity.documentDeleteAuditRequired
            )}

            ${checkbox(
              "privacySecurity.verificationAuditRequired",
              "Verification Audit Required",
              config.privacySecurity.verificationAuditRequired
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           14
           =================================================== -->

      ${section(

        "14. File Validation",

        "File type, size and integrity controls.",

        `

        <div class="grid two">

          <div>

            ${checkbox(
              "fileValidation.enabled",
              "File Validation Enabled",
              config.fileValidation.enabled
            )}

            ${numberInput(
              "fileValidation.maxFileSizeMB",
              "Maximum File Size (MB)",
              config.fileValidation.maxFileSizeMB,
              1,
              100,
              1
            )}

            ${numberInput(
              "fileValidation.minimumFileSizeKB",
              "Minimum File Size (KB)",
              config.fileValidation.minimumFileSizeKB,
              0,
              1024,
              1
            )}

            ${checkbox(
              "fileValidation.filenameRequired",
              "Filename Required",
              config.fileValidation.filenameRequired
            )}

          </div>


          <div>

            ${checkbox(
              "fileValidation.extensionValidationRequired",
              "Extension Validation",
              config.fileValidation.extensionValidationRequired
            )}

            ${checkbox(
              "fileValidation.mimeValidationRequired",
              "MIME Validation",
              config.fileValidation.mimeValidationRequired
            )}

            ${checkbox(
              "fileValidation.emptyFileBlocked",
              "Empty File Blocked",
              config.fileValidation.emptyFileBlocked
            )}

            ${checkbox(
              "fileValidation.corruptedFileCheckRequired",
              "Corrupted File Check",
              config.fileValidation.corruptedFileCheckRequired
            )}

            ${checkbox(
              "fileValidation.duplicateFileCheckEnabled",
              "Duplicate File Check",
              config.fileValidation.duplicateFileCheckEnabled
            )}

          </div>

        </div>

        <div class="notice">

          Allowed file types:

          <strong>
            ${escapeHtml(
              config.fileValidation.allowedMimeTypes.join(", ")
            )}
          </strong>

        </div>

        `
      )}


      <!-- ===================================================
           15
           =================================================== -->

      ${section(

        "15. Document Quality",

        "Quality and integrity checks before verification.",

        `

        <div class="grid two">

          <div>

            ${checkbox(
              "qualityControl.enabled",
              "Quality Control Enabled",
              config.qualityControl.enabled
            )}

            ${checkbox(
              "qualityControl.imageQualityCheckEnabled",
              "Image Quality Check",
              config.qualityControl.imageQualityCheckEnabled
            )}

            ${checkbox(
              "qualityControl.documentReadabilityCheckEnabled",
              "Readability Check",
              config.qualityControl.documentReadabilityCheckEnabled
            )}

            ${checkbox(
              "qualityControl.blurDetectionEnabled",
              "Blur Detection",
              config.qualityControl.blurDetectionEnabled
            )}

          </div>


          <div>

            ${checkbox(
              "qualityControl.documentCompletenessCheckEnabled",
              "Completeness Check",
              config.qualityControl.documentCompletenessCheckEnabled
            )}

            ${checkbox(
              "qualityControl.tamperCheckEnabled",
              "Tamper Check",
              config.qualityControl.tamperCheckEnabled
            )}

            ${checkbox(
              "qualityControl.mismatchCheckEnabled",
              "Identity/Data Mismatch Check",
              config.qualityControl.mismatchCheckEnabled
            )}

            ${checkbox(
              "qualityControl.qualityFailureRequiresResubmission",
              "Quality Failure Requires Resubmission",
              config.qualityControl.qualityFailureRequiresResubmission
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           16
           =================================================== -->

      ${section(

        "16. KYC Workflow",

        "Lifecycle from submission through approval or resubmission.",

        `

        <div class="grid two">

          <div>

            ${checkbox(
              "workflow.registrationToKYC",
              "Registration → KYC",
              config.workflow.registrationToKYC
            )}

            ${checkbox(
              "workflow.uploadToReview",
              "Upload → Review",
              config.workflow.uploadToReview
            )}

            ${checkbox(
              "workflow.reviewToApproval",
              "Review → Approval",
              config.workflow.reviewToApproval
            )}

            ${checkbox(
              "workflow.reviewToRejection",
              "Review → Rejection",
              config.workflow.reviewToRejection
            )}

          </div>


          <div>

            ${checkbox(
              "workflow.rejectionToResubmission",
              "Rejection → Resubmission",
              config.workflow.rejectionToResubmission
            )}

            ${checkbox(
              "workflow.expiryToRenewal",
              "Expiry → Renewal",
              config.workflow.expiryToRenewal
            )}

            ${checkbox(
              "workflow.replacementToReview",
              "Replacement → Review",
              config.workflow.replacementToReview
            )}

            ${checkbox(
              "workflow.approvalActivatesEligibleProfile",
              "Approval Activates Eligible Profile",
              config.workflow.approvalActivatesEligibleProfile
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           17
           =================================================== -->

      ${section(

        "17. Document Retention",

        "Document history and retention boundaries.",

        `

        <div class="grid two">

          <div>

            ${checkbox(
              "retention.enabled",
              "Retention Enabled",
              config.retention.enabled
            )}

            ${checkbox(
              "retention.historyEnabled",
              "History Enabled",
              config.retention.historyEnabled
            )}

            ${checkbox(
              "retention.approvedDocumentHistoryRequired",
              "Approved History Required",
              config.retention.approvedDocumentHistoryRequired
            )}

            ${checkbox(
              "retention.rejectedDocumentHistoryRequired",
              "Rejected History Required",
              config.retention.rejectedDocumentHistoryRequired
            )}

          </div>


          <div>

            ${checkbox(
              "retention.replacedDocumentHistoryRequired",
              "Replaced History Required",
              config.retention.replacedDocumentHistoryRequired
            )}

            ${checkbox(
              "retention.deletedRecordRetentionRequired",
              "Deleted Record Retention Required",
              config.retention.deletedRecordRetentionRequired
            )}

            ${checkbox(
              "retention.frontendPermanentDeletionAllowed",
              "Frontend Permanent Deletion",
              config.retention.frontendPermanentDeletionAllowed
            )}

            ${checkbox(
              "retention.backendRetentionAuthority",
              "Backend Retention Authority",
              config.retention.backendRetentionAuthority
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           18
           =================================================== -->

      ${section(

        "18. Notifications",

        "Document and KYC lifecycle notifications.",

        `

        <div class="grid three">

          ${checkbox(
            "notifications.enabled",
            "Notifications Enabled",
            config.notifications.enabled
          )}

          ${checkbox(
            "notifications.uploadNotification",
            "Upload",
            config.notifications.uploadNotification
          )}

          ${checkbox(
            "notifications.reviewStartedNotification",
            "Review Started",
            config.notifications.reviewStartedNotification
          )}

          ${checkbox(
            "notifications.approvalNotification",
            "Approval",
            config.notifications.approvalNotification
          )}

          ${checkbox(
            "notifications.rejectionNotification",
            "Rejection",
            config.notifications.rejectionNotification
          )}

          ${checkbox(
            "notifications.resubmissionNotification",
            "Resubmission",
            config.notifications.resubmissionNotification
          )}

          ${checkbox(
            "notifications.expiryNotification",
            "Expiry",
            config.notifications.expiryNotification
          )}

          ${checkbox(
            "notifications.renewalNotification",
            "Renewal",
            config.notifications.renewalNotification
          )}

          ${checkbox(
            "notifications.replacementNotification",
            "Replacement",
            config.notifications.replacementNotification
          )}

          ${checkbox(
            "notifications.operationalBlockNotification",
            "Operational Block",
            config.notifications.operationalBlockNotification
          )}

          ${checkbox(
            "notifications.backendNotificationAuthority",
            "Backend Notification Authority",
            config.notifications.backendNotificationAuthority
          )}

        </div>

        `
      )}


      <!-- ===================================================
           19
           =================================================== -->

      ${section(

        "19. Operational Blocks",

        "Rules preventing unsafe activation or operation.",

        `

        <div class="grid two">

          <div>

            ${checkbox(
              "operationalBlocks.pendingKYCBlockEnabled",
              "Pending KYC Block",
              config.operationalBlocks.pendingKYCBlockEnabled
            )}

            ${checkbox(
              "operationalBlocks.rejectedKYCBlockEnabled",
              "Rejected KYC Block",
              config.operationalBlocks.rejectedKYCBlockEnabled
            )}

            ${checkbox(
              "operationalBlocks.expiredDocumentBlockEnabled",
              "Expired Document Block",
              config.operationalBlocks.expiredDocumentBlockEnabled
            )}

            ${checkbox(
              "operationalBlocks.missingRequiredDocumentBlockEnabled",
              "Missing Required Document Block",
              config.operationalBlocks.missingRequiredDocumentBlockEnabled
            )}

            ${checkbox(
              "operationalBlocks.failedVerificationBlockEnabled",
              "Failed Verification Block",
              config.operationalBlocks.failedVerificationBlockEnabled
            )}

          </div>


          <div>

            ${checkbox(
              "operationalBlocks.failedQualityCheckBlockEnabled",
              "Failed Quality Check Block",
              config.operationalBlocks.failedQualityCheckBlockEnabled
            )}

            ${checkbox(
              "operationalBlocks.vendorOperationBlockEnabled",
              "Vendor Operation Block",
              config.operationalBlocks.vendorOperationBlockEnabled
            )}

            ${checkbox(
              "operationalBlocks.driverDutyBlockEnabled",
              "Driver Duty Block",
              config.operationalBlocks.driverDutyBlockEnabled
            )}

            ${checkbox(
              "operationalBlocks.vehicleAssignmentBlockEnabled",
              "Vehicle Assignment Block",
              config.operationalBlocks.vehicleAssignmentBlockEnabled
            )}

            ${checkbox(
              "operationalBlocks.tripActivationBlockEnabled",
              "Trip Activation Block",
              config.operationalBlocks.tripActivationBlockEnabled
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           VALIDATION
           =================================================== -->

      <section class="card">

        <h2>
          Configuration Validation
        </h2>


        ${
          validation.valid

            ? `

              <div class="notice success">

                <strong>
                  VALID
                </strong>

                <div>
                  26F configuration satisfies the
                  Documents & KYC safety boundary.
                </div>

              </div>

            `

            : `

              <div class="notice danger">

                <strong>
                  INVALID
                </strong>

                <ul>

                  ${
                    validation.errors
                      .map(function (error) {

                        return `
                          <li>
                            ${escapeHtml(error)}
                          </li>
                        `;

                      })
                      .join("")
                  }

                </ul>

              </div>

            `
        }


        ${
          validation.warnings.length

            ? `

              <div class="notice warn">

                ${
                  validation.warnings
                    .map(function (warning) {

                      return `
                        <div>
                          ${escapeHtml(warning)}
                        </div>
                      `;

                    })
                    .join("")
                }

              </div>

            `

            : ""
        }

      </section>


      <!-- ===================================================
           CONTROLS
           =================================================== -->

      <section class="card">

        <h2>
          26F Controls
        </h2>


        <div class="govara26f-actions">

          <button
            type="button"
            class="primary"
            data-26f-action="save"
          >
            Save Configuration
          </button>


          <button
            type="button"
            data-26f-action="reload"
          >
            Reload
          </button>


          <button
            type="button"
            data-26f-action="validate"
          >
            Validate
          </button>


          <button
            type="button"
            data-26f-action="reset"
          >
            Reset Defaults
          </button>

        </div>


        <div
          id="govara26f-message"
          class="govara26f-message"
          aria-live="polite"
        ></div>


        <div class="muted govara26f-version">

          Module Version:
          ${escapeHtml(VERSION)}

        </div>

      </section>

    `;
  }


  /* =========================================================
     READ FORM
     ========================================================= */

  function readForm(root) {

    const config =
      loadConfig();


    if (!root) {
      return config;
    }


    root
      .querySelectorAll(
        "[data-26f-path]"
      )
      .forEach(function (element) {

        const path =
          element.getAttribute(
            "data-26f-path"
          );


        if (!path) {
          return;
        }


        let value;


        if (
          element.type === "checkbox"
        ) {

          value =
            element.checked;

        } else if (
          element.type === "number"
        ) {

          value =
            Number(element.value);

        } else {

          value =
            element.value;
        }


        const parts =
          path
            .split(".")
            .filter(Boolean);


        let cursor =
          config;


        for (
          let i = 0;
          i < parts.length - 1;
          i++
        ) {

          if (
            !cursor[parts[i]] ||
            typeof cursor[parts[i]] !== "object"
          ) {

            cursor[parts[i]] = {};
          }


          cursor =
            cursor[parts[i]];
        }


        cursor[
          parts[parts.length - 1]
        ] = value;

      });


    enforceSafety(config);


    return config;
  }


  /* =========================================================
     BIND
     ========================================================= */

  function bind(root) {

    const container =
      root ||
      document.getElementById(
        "module-26F"
      );


    if (!container) {
      return;
    }


    const message =
      container.querySelector(
        "#govara26f-message"
      );


    function showMessage(
      text,
      type
    ) {

      if (!message) {
        return;
      }


      message.className =
        "govara26f-message " +
        (type || "");


      message.textContent =
        text;
    }


    container
      .querySelectorAll(
        "[data-26f-action]"
      )
      .forEach(function (button) {


        button.addEventListener(
          "click",
          function () {


            const action =
              button.getAttribute(
                "data-26f-action"
              );


            /* ---------------------------------------------
               SAVE
               --------------------------------------------- */

            if (
              action === "save"
            ) {

              const config =
                readForm(
                  container
                );


              const result =
                save(config);


              if (result.success) {

                showMessage(
                  "26F Documents & KYC configuration saved successfully.",
                  "success"
                );

              } else {

                showMessage(
                  "Save blocked: " +
                  result.validation.errors.join(" "),
                  "danger"
                );
              }


              return;
            }


            /* ---------------------------------------------
               RELOAD
               --------------------------------------------- */

            if (
              action === "reload"
            ) {

              renderAndBind();

              return;
            }


            /* ---------------------------------------------
               VALIDATE
               --------------------------------------------- */

            if (
              action === "validate"
            ) {

              const config =
                readForm(
                  container
                );


              const result =
                validateConfig(
                  config
                );


              if (result.valid) {

                showMessage(
                  "26F configuration is VALID.",
                  "success"
                );

              } else {

                showMessage(
                  "Validation failed: " +
                  result.errors.join(" "),
                  "danger"
                );
              }


              return;
            }


            /* ---------------------------------------------
               RESET
               --------------------------------------------- */

            if (
              action === "reset"
            ) {

              const confirmed =
                window.confirm(
                  "Reset 26F Documents & KYC Control to safe defaults?"
                );


              if (!confirmed) {
                return;
              }


              const result =
                reset();


              if (result.success) {

                renderAndBind();

              } else {

                showMessage(
                  "Reset failed: " +
                  result.error,
                  "danger"
                );
              }

            }

          }
        );

      });
  }


  /* =========================================================
     RENDER + BIND
     ========================================================= */

  function renderAndBind() {

    const container =
      document.getElementById(
        "module-26F"
      );


    if (!container) {
      return;
    }


    container.innerHTML =
      render();


    bind(
      container
    );
  }


  /* =========================================================
     PUBLIC API
     ========================================================= */

  return {

    VERSION:
      VERSION,

    STORAGE_KEY:
      STORAGE_KEY,

    render:
      render,

    bind:
      bind,

    renderAndBind:
      renderAndBind,

    getConfig:
      getConfig,

    getStatus:
      getStatus,

    save:
      save,

    reset:
      reset,

    reload:
      reload,

    validate:
      validateConfig,

    setPolicy:
      setPolicy,

    getAudit:
      getAudit,

    enforceSafety:
      enforceSafety
  };

})();


/* =========================================================
   AUTO RENDER
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    if (
      window.GoVara26F &&
      typeof window.GoVara26F.renderAndBind === "function"
    ) {

      window.GoVara26F.renderAndBind();
    }

  }
);
