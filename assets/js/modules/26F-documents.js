/* ============================================================
   GoVara — 26F DOCUMENTS & CENTRAL KYC ENGINE
   VERSION: GOVARA-26F-V5

   Scope:
   - Documents
   - Central KYC Engine
   - Customer KYC
   - Vendor KYC
   - Driver KYC
   - Vehicle Documents / Vehicle KYC
   - Admin document management
   - Role permissions
   - Document permissions
   - Upload / Preview / Compression / Resize
   - Verification workflow
   - Replacement
   - Expiry / Renewal
   - Audit
   - Security
   - KYC Application lifecycle
   - Required / Optional document resolution
   - KYC progress
   - Resubmission
   - Backend-ready submission queue

   Architecture:
   Frontend = Control UI / Local configuration / File preprocessing
   Backend  = Authoritative business + verification authority
   Database = Authoritative persistent document/KYC store

   IMPORTANT:
   - Frontend does NOT become financial/business authority.
   - Frontend cannot perform final KYC approval.
   - Frontend cannot perform final document verification.
   - Backend remains final authoritative authority.
   - Database remains authoritative persistent store.
   - No new database table is created by this module.
   - No automatic API request is performed by this module.
   ============================================================ */

window.GoVara26F = (function () {

  "use strict";

  const VERSION = "GOVARA-26F-V5";

  const STORAGE_KEY =
    "GOVARA_DOCUMENTS_KYC_ADMIN_CONTROL_26F_V5";

  const AUDIT_KEY =
    "GOVARA_DOCUMENTS_KYC_ADMIN_AUDIT_26F_V5";


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

      adminCanManageDocuments: true,

      adminCanPerformReview: true,

      adminCanInitiateVerification: true,

      adminCanRecordAdministrativeDecision: true,

      finalVerificationAuthority: "BACKEND",

      finalKYCAuthority: "BACKEND",

      automaticApproval: false,

      automaticVerification: false,

      frontendCannotOverrideBackend: true
    },


    /* ----------------------------------------------------------
       DOCUMENT SYSTEM
       ---------------------------------------------------------- */

    documentSystem: {

      enabled: true,

      uploadEnabled: true,

      viewEnabled: true,

      updateEnabled: true,

      replacementEnabled: true,

      historyEnabled: true,

      expiryTrackingEnabled: true,

      expiryAlertsEnabled: true,

      documentReviewEnabled: true,

      documentVerificationEnabled: true,

      adminDocumentManagement: true,

      publicDocumentAccess: false,

      publicDocumentListing: false,

      permanentDeletionEnabled: false,

      backendDocumentAuthority: true
    },


    /* ----------------------------------------------------------
       DOCUMENT TYPES
       ---------------------------------------------------------- */

    documentTypes: {

      identityProof: {
        enabled: true,
        label: "Identity Proof",
        customer: true,
        vendor: true,
        driver: true,
        vehicle: false,
        mandatory: false
      },

      addressProof: {
        enabled: true,
        label: "Address Proof",
        customer: true,
        vendor: true,
        driver: true,
        vehicle: false,
        mandatory: false
      },

      profilePhoto: {
        enabled: true,
        label: "Profile Photo",
        customer: true,
        vendor: true,
        driver: true,
        vehicle: false,
        mandatory: false
      },

      bankProof: {
        enabled: true,
        label: "Bank Proof",
        customer: false,
        vendor: true,
        driver: true,
        vehicle: false,
        mandatory: false
      },

      taxDocument: {
        enabled: true,
        label: "Tax Document",
        customer: false,
        vendor: true,
        driver: false,
        vehicle: false,
        mandatory: false
      },

      businessRegistration: {
        enabled: true,
        label: "Business Registration",
        customer: false,
        vendor: true,
        driver: false,
        vehicle: false,
        mandatory: true
      },

      companyRegistration: {
        enabled: true,
        label: "Company Registration",
        customer: false,
        vendor: true,
        driver: false,
        vehicle: false,
        mandatory: false
      },

      drivingLicense: {
        enabled: true,
        label: "Driving License",
        customer: false,
        vendor: false,
        driver: true,
        vehicle: false,
        mandatory: true
      },

      vehicleRegistration: {
        enabled: true,
        label: "Vehicle Registration",
        customer: false,
        vendor: false,
        driver: false,
        vehicle: true,
        mandatory: true
      },

      vehicleInsurance: {
        enabled: true,
        label: "Vehicle Insurance",
        customer: false,
        vendor: false,
        driver: false,
        vehicle: true,
        mandatory: true
      },

      vehicleFitness: {
        enabled: true,
        label: "Vehicle Fitness",
        customer: false,
        vendor: false,
        driver: false,
        vehicle: true,
        mandatory: true
      },

      vehiclePermit: {
        enabled: true,
        label: "Vehicle Permit",
        customer: false,
        vendor: false,
        driver: false,
        vehicle: true,
        mandatory: true
      },

      pollutionCertificate: {
        enabled: true,
        label: "Pollution Certificate",
        customer: false,
        vendor: false,
        driver: false,
        vehicle: true,
        mandatory: true
      },

      authorizationLetter: {
        enabled: true,
        label: "Authorization Letter",
        customer: false,
        vendor: true,
        driver: false,
        vehicle: false,
        mandatory: false
      },

      otherDocument: {
        enabled: true,
        label: "Other Document",
        customer: true,
        vendor: true,
        driver: true,
        vehicle: true,
        mandatory: false
      }
    },


    /* ----------------------------------------------------------
       KYC REQUIREMENTS
       ---------------------------------------------------------- */

    kyc: {

      enabled: true,

      customerKYCRequired: true,

      vendorKYCRequired: true,

      driverKYCRequired: true,

      vehicleKYCRequired: true,

      manualReviewRequired: true,

      automaticApproval: false,

      automaticVerification: false,

      reVerificationEnabled: true,

      rejectedRequiresResubmission: true,

      pendingBlocksActivation: true,

      rejectedBlocksActivation: true,

      expiredBlocksActivation: true,

      missingDocumentBlocksActivation: true,

      backendApprovalRequired: true,

      backendVerificationRequired: true,

      backendAuthority: true
    },


    /* ----------------------------------------------------------
       CUSTOMER KYC
       ---------------------------------------------------------- */

    customerKYC: {

      registrationRequirement: true,

      profileCompletionRequirement: true,

      bookingRequirement: false,

      preTripRequirement: false,

      walletRequirement: false,

      refundRequirement: false,

      documentUploadAllowed: true,

      documentReplaceAllowed: true,

      documentViewAllowed: true,

      documentDownloadAllowed: false,

      submitKYCAllowed: true,

      resubmissionAllowed: true,

      manualReviewRequired: true,

      backendApprovalRequired: true
    },


    /* ----------------------------------------------------------
       VENDOR KYC
       ---------------------------------------------------------- */

    vendorKYC: {

      registrationRequirement: true,

      operationsRequirement: true,

      bookingManagementRequirement: true,

      driverAssignmentRequirement: true,

      vehicleAssignmentRequirement: true,

      documentUploadAllowed: true,

      documentReplaceAllowed: true,

      documentViewAllowed: true,

      documentDownloadAllowed: false,

      submitKYCAllowed: true,

      resubmissionAllowed: true,

      manualReviewRequired: true,

      backendApprovalRequired: true
    },


    /* ----------------------------------------------------------
       DRIVER KYC
       ---------------------------------------------------------- */

    driverKYC: {

      registrationRequirement: true,

      dutyRequirement: true,

      tripRequirement: true,

      bookingAcceptanceRequirement: true,

      documentUploadAllowed: true,

      documentReplaceAllowed: true,

      documentViewAllowed: true,

      documentDownloadAllowed: false,

      submitKYCAllowed: true,

      resubmissionAllowed: true,

      expiredLicenseBlocksDuty: true,

      manualReviewRequired: true,

      backendApprovalRequired: true
    },


    /* ----------------------------------------------------------
       VEHICLE KYC
       ---------------------------------------------------------- */

    vehicleKYC: {

      activationRequirement: true,

      assignmentRequirement: true,

      tripRequirement: true,

      documentUploadAllowed: true,

      documentReplaceAllowed: true,

      documentViewAllowed: true,

      documentDownloadAllowed: false,

      registrationRequired: true,

      insuranceRequired: true,

      fitnessRequired: true,

      permitRequired: true,

      pollutionCertificateRequired: true,

      expiredDocumentBlocksVehicle: true,

      manualReviewRequired: true,

      backendApprovalRequired: true
    },


    /* ----------------------------------------------------------
       ADMIN DOCUMENT PERMISSIONS
       ---------------------------------------------------------- */

    adminPermissions: {

      documentManagement: true,

      documentUpload: true,

      documentUploadForCustomer: true,

      documentUploadForVendor: true,

      documentUploadForDriver: true,

      documentUploadForVehicle: true,

      documentView: true,

      documentDownload: true,

      documentReview: true,

      documentVerificationInitiation: true,

      documentApprovalDecision: true,

      documentRejectionDecision: true,

      rejectionReason: true,

      approvalComment: true,

      rejectionComment: true,

      requestResubmission: true,

      requestReplacement: true,

      expiryManagement: true,

      renewalManagement: true,

      KYCReview: true,

      KYCDecisionRecording: true,

      KYCResubmissionManagement: true,

      auditView: true,

      configurationManagement: true,

      permissionManagement: true,

      permanentDeletion: false,

      backendAuthorityOverride: false
    },


    /* ----------------------------------------------------------
       ROLE-BASED DOCUMENT PERMISSION MATRIX
       ---------------------------------------------------------- */

    rolePermissions: {

      Admin: {

        upload: true,

        view: true,

        download: true,

        replace: true,

        submitKYC: true,

        review: true,

        verify: true,

        approve: true,

        reject: true,

        requestResubmission: true,

        manageExpiry: true,

        manageReplacement: true,

        viewAudit: true,

        configure: true,

        deletePermanently: false
      },


      Customer: {

        upload: true,

        view: true,

        download: false,

        replace: true,

        submitKYC: true,

        review: false,

        verify: false,

        approve: false,

        reject: false,

        requestResubmission: false,

        manageExpiry: false,

        manageReplacement: true,

        viewAudit: false,

        configure: false,

        deletePermanently: false
      },


      Vendor: {

        upload: true,

        view: true,

        download: false,

        replace: true,

        submitKYC: true,

        review: false,

        verify: false,

        approve: false,

        reject: false,

        requestResubmission: false,

        manageExpiry: false,

        manageReplacement: true,

        viewAudit: false,

        configure: false,

        deletePermanently: false
      },


      Driver: {

        upload: true,

        view: true,

        download: false,

        replace: true,

        submitKYC: true,

        review: false,

        verify: false,

        approve: false,

        reject: false,

        requestResubmission: false,

        manageExpiry: false,

        manageReplacement: true,

        viewAudit: false,

        configure: false,

        deletePermanently: false
      },


      Backend: {

        upload: true,

        view: true,

        download: true,

        replace: true,

        submitKYC: true,

        review: true,

        verify: true,

        approve: true,

        reject: true,

        requestResubmission: true,

        manageExpiry: true,

        manageReplacement: true,

        viewAudit: true,

        configure: true,

        deletePermanently: true
      }
    },


    /* ----------------------------------------------------------
       DOCUMENT ACCESS CONTROL
       ---------------------------------------------------------- */

    documentAccess: {

      ownerAccess: true,

      adminAccess: true,

      backendAccess: true,

      vendorCannotAccessCustomerDocuments: true,

      driverCannotAccessCustomerDocuments: true,

      customerCannotAccessVendorDocuments: true,

      customerCannotAccessDriverDocuments: true,

      customerCannotAccessVehicleDocuments: true,

      driverCannotAccessOtherDriverDocuments: true,

      vendorCannotAccessOtherVendorDocuments: true,

      crossRoleAccessRequiresAdmin: true,

      sensitiveDocumentsRestricted: true,

      publicURL: false,

      publicListing: false,

      unauthorizedAccessBlocked: true
    },


    /* ----------------------------------------------------------
       UPLOAD CONTROL
       ---------------------------------------------------------- */

    upload: {

      enabled: true,

      imageUploadEnabled: true,

      pdfUploadEnabled: true,

      multipleUploadEnabled: true,

      previewEnabled: true,

      uploadProgressEnabled: true,

      maxFileSizeMB: 10,

      minFileSizeKB: 1,

      allowedExtensions: [

        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".pdf"
      ],

      allowedMimeTypes: [

        "image/jpeg",

        "image/png",

        "image/webp",

        "application/pdf"
      ],

      filenameValidation: true,

      extensionValidation: true,

      mimeValidation: true,

      emptyFileBlocked: true,

      corruptFileBlocked: true,

      duplicateFileCheck: true,

      backendFinalValidationRequired: true
    },


    /* ----------------------------------------------------------
       IMAGE COMPRESSION / RESIZE
       ---------------------------------------------------------- */

    imageProcessing: {

      enabled: true,

      compressionEnabled: true,

      resizeEnabled: true,

      previewBeforeUpload: true,

      preserveAspectRatio: true,

      maxWidth: 2000,

      maxHeight: 2000,

      targetQuality: 0.82,

      minimumQuality: 0.55,

      targetMaxSizeMB: 2,

      automaticReduction: true,

      doNotCompressSmallImages: true,

      outputFormat: "image/jpeg",

      browserProcessingOnly: true,

      backendFinalProcessingAuthority: true
    },


    /* ----------------------------------------------------------
       PDF CONTROL
       ---------------------------------------------------------- */

    pdfProcessing: {

      enabled: true,

      accepted: true,

      maxSizeMB: 10,

      browserCompression: false,

      backendCompressionAuthority: true,

      backendValidationRequired: true
    },


    /* ----------------------------------------------------------
       STATUS
       ---------------------------------------------------------- */

    documentStatus: {

      pending: true,

      submitted: true,

      underReview: true,

      approved: true,

      rejected: true,

      resubmissionRequired: true,

      expired: true,

      renewalPending: true,

      replacementPending: true,

      replaced: true,

      suspended: true,

      deleted: false
    },


    kycStatus: {

      notStarted: true,

      pending: true,

      submitted: true,

      underReview: true,

      approved: true,

      rejected: true,

      resubmissionRequired: true,

      expired: true,

      suspended: true
    },


    /* ----------------------------------------------------------
       VERIFICATION
       ---------------------------------------------------------- */

    verification: {

      enabled: true,

      manualVerification: true,

      automaticVerification: false,

      adminVerificationInterface: true,

      backendVerificationRequired: true,

      verificationTimestamp: true,

      verifierIdentity: true,

      approvalComment: true,

      rejectionReason: true,

      rejectionComment: true,

      mismatchFlag: true,

      qualityFailureFlag: true,

      expiryFlag: true,

      resubmissionFlag: true,

      verificationHistory: true,

      frontendCannotOverrideBackend: true
    },


    /* ----------------------------------------------------------
       EXPIRY
       ---------------------------------------------------------- */

    expiry: {

      enabled: true,

      expiryDateRequired: true,

      trackingEnabled: true,

      alertsEnabled: true,

      primaryAlertDays: 30,

      secondAlertDays: 7,

      expiredStatusEnabled: true,

      operationalBlockOnExpiry: true,

      renewalEnabled: true,

      backendExpiryAuthority: true
    },


    /* ----------------------------------------------------------
       REPLACEMENT
       ---------------------------------------------------------- */

    replacement: {

      enabled: true,

      replacementAllowed: true,

      oldDocumentHistoryRequired: true,

      oldDocumentPermanentDeletion: false,

      newDocumentReviewRequired: true,

      replacementReasonRequired: true,

      backendApprovalRequired: true,

      backendAuthority: true
    },


    /* ----------------------------------------------------------
       QUALITY CONTROL
       ---------------------------------------------------------- */

    qualityControl: {

      enabled: true,

      readabilityCheck: true,

      imageQualityCheck: true,

      blurCheck: true,

      completenessCheck: true,

      tamperCheck: true,

      mismatchCheck: true,

      failedQualityRequiresResubmission: true,

      backendQualityAuthority: true
    },


    /* ----------------------------------------------------------
       WORKFLOW
       ---------------------------------------------------------- */

    workflow: {

      registrationToKYC: true,

      uploadToSubmission: true,

      submissionToReview: true,

      reviewToApproval: true,

      reviewToRejection: true,

      rejectionToResubmission: true,

      expiryToRenewal: true,

      replacementToReview: true,

      approvalToActivation: true,

      backendWorkflowAuthority: true
    },


    /* ----------------------------------------------------------
       OPERATIONAL BLOCKS
       ---------------------------------------------------------- */

    operationalBlocks: {

      missingDocumentBlock: true,

      pendingKYCBlock: true,

      rejectedKYCBlock: true,

      expiredKYCBlock: true,

      expiredDocumentBlock: true,

      failedVerificationBlock: true,

      failedQualityBlock: true,

      driverDutyBlock: true,

      vehicleOperationBlock: true,

      tripBlock: true,

      vendorOperationBlock: true,

      backendAuthority: true
    },


    /* ----------------------------------------------------------
       NOTIFICATIONS
       ---------------------------------------------------------- */

    notifications: {

      upload: true,

      submitted: true,

      underReview: true,

      approved: true,

      rejected: true,

      resubmission: true,

      expiry: true,

      renewal: true,

      replacement: true,

      operationalBlock: true,

      backendNotificationAuthority: true
    },


    /* ----------------------------------------------------------
       PRIVACY / SECURITY
       ---------------------------------------------------------- */

    privacySecurity: {

      sensitiveDocumentProtection: true,

      accessControlEnabled: true,

      ownerOnlyAccess: true,

      adminControlledAccess: true,

      unauthorizedAccessBlocked: true,

      publicAccess: false,

      publicURL: false,

      publicListing: false,

      uploadAudit: true,

      viewAudit: true,

      downloadAudit: true,

      replacementAudit: true,

      reviewAudit: true,

      verificationAudit: true,

      deletionAudit: true
    },


    /* ----------------------------------------------------------
       RETENTION
       ---------------------------------------------------------- */

    retention: {

      enabled: true,

      historyEnabled: true,

      approvedHistory: true,

      rejectedHistory: true,

      replacedHistory: true,

      deletedHistory: true,

      frontendPermanentDeletion: false,

      backendRetentionAuthority: true
    },


    /* ----------------------------------------------------------
       AUDIT
       ---------------------------------------------------------- */

    audit: {

      enabled: true,

      localHistory: true,

      maxEntries: 500
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


  function deepMerge(base, incoming) {

    if (
      !incoming ||
      typeof incoming !== "object"
    ) {

      return clone(base);
    }

    const output =
      clone(base);

    Object.keys(incoming)
      .forEach(function (key) {

        if (

          incoming[key] &&

          typeof incoming[key] === "object" &&

          !Array.isArray(incoming[key]) &&

          output[key] &&

          typeof output[key] === "object" &&

          !Array.isArray(output[key])

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

      });

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
        "26F configuration load failed:",
        error
      );

      return clone(
        DEFAULT_CONFIG
      );
    }
  }


  function saveConfig(config) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(config)
    );
  }


  function addAudit(
    action,
    details
  ) {

    const config =
      loadConfig();

    if (
      !config.audit.enabled
    ) {
      return;
    }

    try {

      const history =
        JSON.parse(
          localStorage.getItem(
            AUDIT_KEY
          ) || "[]"
        );

      history.unshift({

        timestamp:
          new Date().toISOString(),

        module:
          "26F",

        version:
          VERSION,

        action:
          action,

        details:
          details || {}

      });

      localStorage.setItem(

        AUDIT_KEY,

        JSON.stringify(
          history.slice(
            0,
            Math.max(
              1,
              Number(
                config.audit.maxEntries
              ) || 500
            )
          )
        )

      );

    } catch (error) {

      console.warn(
        "26F audit failed:",
        error
      );
    }
  }


  /* ============================================================
     SAFETY
     ============================================================ */

  function enforceSafety(config) {

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

    config.authority.finalVerificationAuthority =
      "BACKEND";

    config.authority.finalKYCAuthority =
      "BACKEND";

    config.authority.automaticApproval =
      false;

    config.authority.automaticVerification =
      false;

    config.authority.frontendCannotOverrideBackend =
      true;


    config.documentSystem.publicDocumentAccess =
      false;

    config.documentSystem.publicDocumentListing =
      false;

    config.documentSystem.permanentDeletionEnabled =
      false;


    config.kyc.automaticApproval =
      false;

    config.kyc.automaticVerification =
      false;

    config.kyc.backendAuthority =
      true;


    config.verification.automaticVerification =
      false;

    config.verification.frontendCannotOverrideBackend =
      true;


    config.documentAccess.publicURL =
      false;

    config.documentAccess.publicListing =
      false;

    config.documentAccess.unauthorizedAccessBlocked =
      true;


    config.replacement.oldDocumentPermanentDeletion =
      false;


    config.privacySecurity.publicAccess =
      false;

    config.privacySecurity.publicURL =
      false;

    config.privacySecurity.publicListing =
      false;


    config.retention.frontendPermanentDeletion =
      false;


    config.operationalBlocks.backendAuthority =
      true;


    config.workflow.backendWorkflowAuthority =
      true;


    return config;
  }


  /* ============================================================
     CONFIG VALIDATION
     ============================================================ */

  function validateConfig(config) {

    config =
      enforceSafety(
        config || loadConfig()
      );

    const errors = [];

    const warnings = [];


    if (
      !config.environment.frontendOnly
    ) {

      errors.push(
        "26F must remain frontend-only."
      );
    }


    if (
      !config.authority.backendAuthority
    ) {

      errors.push(
        "Backend authority must remain enabled."
      );
    }


    if (
      !config.authority.databaseAuthority
    ) {

      errors.push(
        "Database authority must remain enabled."
      );
    }


    if (
      config.authority.automaticApproval
    ) {

      errors.push(
        "Automatic approval is prohibited."
      );
    }


    if (
      config.authority.automaticVerification
    ) {

      errors.push(
        "Automatic verification is prohibited."
      );
    }


    if (
      config.documentSystem.publicDocumentAccess
    ) {

      errors.push(
        "Public document access must remain disabled."
      );
    }


    if (
      config.documentSystem.publicDocumentListing
    ) {

      errors.push(
        "Public document listing must remain disabled."
      );
    }


    if (
      config.documentSystem.permanentDeletionEnabled
    ) {

      errors.push(
        "Permanent deletion must remain disabled."
      );
    }


    if (
      config.adminPermissions.permanentDeletion
    ) {

      errors.push(
        "Admin permanent deletion must remain disabled."
      );
    }


    if (
      config.upload.maxFileSizeMB <= 0
    ) {

      errors.push(
        "Maximum upload size must be greater than zero."
      );
    }


    if (
      config.upload.minFileSizeKB < 0
    ) {

      errors.push(
        "Minimum upload size cannot be negative."
      );
    }


    if (
      config.imageProcessing.maxWidth <= 0 ||
      config.imageProcessing.maxHeight <= 0
    ) {

      errors.push(
        "Image dimensions must be greater than zero."
      );
    }


    if (
      config.imageProcessing.targetQuality <= 0 ||
      config.imageProcessing.targetQuality > 1
    ) {

      errors.push(
        "Target image quality must be between 0 and 1."
      );
    }


    if (
      config.imageProcessing.minimumQuality <= 0 ||
      config.imageProcessing.minimumQuality > 1
    ) {

      errors.push(
        "Minimum image quality must be between 0 and 1."
      );
    }


    if (
      config.imageProcessing.minimumQuality >
      config.imageProcessing.targetQuality
    ) {

      errors.push(
        "Minimum quality cannot exceed target quality."
      );
    }


    if (
      config.imageProcessing.targetMaxSizeMB <= 0
    ) {

      errors.push(
        "Target image size must be greater than zero."
      );
    }


    if (
      config.kyc.driverKYCRequired &&
      !config.documentTypes.drivingLicense.enabled
    ) {

      errors.push(
        "Driving License document type must be enabled."
      );
    }


    if (
      config.kyc.vehicleKYCRequired &&
      !config.documentTypes.vehicleRegistration.enabled
    ) {

      errors.push(
        "Vehicle Registration document type must be enabled."
      );
    }


    if (
      config.vehicleKYC.insuranceRequired &&
      !config.documentTypes.vehicleInsurance.enabled
    ) {

      errors.push(
        "Vehicle Insurance document type must be enabled."
      );
    }


    if (
      config.vehicleKYC.fitnessRequired &&
      !config.documentTypes.vehicleFitness.enabled
    ) {

      errors.push(
        "Vehicle Fitness document type must be enabled."
      );
    }


    if (
      config.vehicleKYC.permitRequired &&
      !config.documentTypes.vehiclePermit.enabled
    ) {

      errors.push(
        "Vehicle Permit document type must be enabled."
      );
    }


    if (
      config.vehicleKYC.pollutionCertificateRequired &&
      !config.documentTypes.pollutionCertificate.enabled
    ) {

      errors.push(
        "Pollution Certificate document type must be enabled."
      );
    }


    if (
      config.expiry.primaryAlertDays < 0 ||
      config.expiry.secondAlertDays < 0
    ) {

      errors.push(
        "Expiry alert days cannot be negative."
      );
    }


    if (
      config.audit.maxEntries <= 0
    ) {

      errors.push(
        "Audit maximum entries must be greater than zero."
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
        new Date().toISOString(),

      version:
        VERSION

    };
  }


  /* ============================================================
     ROLE PERMISSION
     ============================================================ */

  function hasPermission(
    role,
    permission
  ) {

    const config =
      loadConfig();

    if (
      !config.rolePermissions[role]
    ) {

      return false;
    }

    return (
      config.rolePermissions[role][
        permission
      ] === true
    );
  }


  function getRolePermissions(
    role
  ) {

    const config =
      loadConfig();

    return clone(
      config.rolePermissions[
        role
      ] || {}
    );
  }


  function setRolePermission(
    role,
    permission,
    value
  ) {

    const config =
      loadConfig();

    if (
      !config.rolePermissions[role]
    ) {

      throw new Error(
        "Unknown role: " +
        role
      );
    }

    /*
     * Backend role is intentionally immutable
     * from frontend administration.
     */

    if (
      role === "Backend"
    ) {

      throw new Error(
        "Backend permissions are locked."
      );
    }


    config.rolePermissions[role][
      permission
    ] = Boolean(value);

    enforceSafety(config);

    saveConfig(config);

    addAudit(
      "ROLE_PERMISSION_UPDATED",
      {
        role:
          role,

        permission:
          permission,

        value:
          Boolean(value)
      }
    );

    return config;
  }


  /* ============================================================
     DOCUMENT TYPE ACCESS
     ============================================================ */

  function isDocumentAllowedForRole(
    documentType,
    role
  ) {

    const config =
      loadConfig();

    const type =
      config.documentTypes[
        documentType
      ];

    if (!type) {
      return false;
    }

    if (
      role === "Admin" ||
      role === "Backend"
    ) {

      return true;
    }

    const map = {

      Customer:
        "customer",

      Vendor:
        "vendor",

      Driver:
        "driver",

      Vehicle:
        "vehicle"

    };

    const property =
      map[role];

    return property
      ? type[property] === true
      : false;
  }


  /* ============================================================
     FILE HELPERS
     ============================================================ */

  function formatFileSize(
    bytes
  ) {

    if (
      !Number.isFinite(bytes)
    ) {

      return "0 B";
    }

    if (
      bytes < 1024
    ) {

      return (
        bytes +
        " B"
      );
    }

    if (
      bytes <
      1024 * 1024
    ) {

      return (
        (bytes / 1024)
          .toFixed(1) +
        " KB"
      );
    }

    return (
      (bytes /
        (1024 * 1024))
        .toFixed(2) +
      " MB"
    );
  }


  function extensionOf(
    filename
  ) {

    if (
      !filename ||
      filename.indexOf(".") === -1
    ) {

      return "";
    }

    return (
      "." +
      filename
        .split(".")
        .pop()
        .toLowerCase()
    );
  }


  function isImageFile(
    file
  ) {

    return Boolean(

      file &&

      (
        (
          file.type &&
          file.type.indexOf(
            "image/"
          ) === 0
        ) ||

        (
          [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
          ].indexOf(
            extensionOf(
              file.name
            )
          ) !== -1
        )
      )

    );
  }


  function isPDFFile(
    file
  ) {

    return Boolean(

      file &&

      (
        file.type ===
          "application/pdf" ||

        extensionOf(
          file.name
        ) === ".pdf"
      )

    );
  }


  /* ============================================================
     FILE VALIDATION
     ============================================================ */

  function validateFile(
    file
  ) {

    const config =
      loadConfig();

    const errors = [];

    if (!file) {

      return {

        valid:
          false,

        errors: [
          "No file selected."
        ]

      };
    }


    if (
      config.upload.emptyFileBlocked &&
      file.size <= 0
    ) {

      errors.push(
        "Empty file is not allowed."
      );
    }


    if (
      file.size <
      config.upload.minFileSizeKB *
      1024
    ) {

      errors.push(
        "File is smaller than the minimum allowed size."
      );
    }


    if (
      file.size >
      config.upload.maxFileSizeMB *
      1024 *
      1024
    ) {

      errors.push(
        "File exceeds the " +
        config.upload.maxFileSizeMB +
        " MB maximum upload size."
      );
    }


    const extension =
      extensionOf(
        file.name
      );


    if (
      config.upload.extensionValidation &&
      config.upload.allowedExtensions
        .indexOf(extension) === -1
    ) {

      errors.push(
        "File extension is not allowed."
      );
    }


    /*
     * Some browsers can provide an empty MIME type.
     * Extension validation still remains authoritative
     * at frontend preprocessing level; backend performs
     * final validation.
     */

    if (
      config.upload.mimeValidation &&
      file.type &&
      config.upload.allowedMimeTypes
        .indexOf(
          String(file.type)
            .toLowerCase()
        ) === -1
    ) {

      errors.push(
        "File MIME type is not allowed."
      );
    }


    if (
      config.upload.filenameValidation &&
      !/^[a-zA-Z0-9._ -]+$/.test(
        file.name
      )
    ) {

      errors.push(
        "Filename contains unsupported characters."
      );
    }


    return {

      valid:
        errors.length === 0,

      errors:
        errors,

      name:
        file.name,

      type:
        file.type,

      extension:
        extension,

      size:
        file.size,

      formattedSize:
        formatFileSize(
          file.size
        )

    };
  }


  /* ============================================================
     IMAGE LOADER
     ============================================================ */

  function loadImage(
    file
  ) {

    return new Promise(
      function (
        resolve,
        reject
      ) {

        const reader =
          new FileReader();

        reader.onload =
          function () {

            const image =
              new Image();

            image.onload =
              function () {

                resolve(
                  image
                );
              };

            image.onerror =
              function () {

                reject(
                  new Error(
                    "Image could not be decoded."
                  )
                );
              };

            image.src =
              reader.result;
          };


        reader.onerror =
          function () {

            reject(
              new Error(
                "File could not be read."
              )
            );
          };


        reader.readAsDataURL(
          file
        );
      }
    );
  }


  function calculateDimensions(
    width,
    height,
    maxWidth,
    maxHeight
  ) {

    const ratio =
      Math.min(

        maxWidth / width,

        maxHeight / height,

        1

      );

    return {

      width:
        Math.max(
          1,
          Math.round(
            width * ratio
          )
        ),

      height:
        Math.max(
          1,
          Math.round(
            height * ratio
          )
        )

    };
  }


  function canvasToBlob(
    canvas,
    type,
    quality
  ) {

    return new Promise(
      function (
        resolve,
        reject
      ) {

        canvas.toBlob(
          function (
            blob
          ) {

            if (!blob) {

              reject(
                new Error(
                  "Image compression failed."
                )
              );

              return;
            }

            resolve(
              blob
            );

          },
          type,
          quality
        );

      }
    );
  }


  /* ============================================================
     IMAGE COMPRESSION
     ============================================================ */

  async function compressImage(
    file
  ) {

    const config =
      loadConfig();

    const validation =
      validateFile(
        file
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


    if (
      !isImageFile(file)
    ) {

      return {

        originalFile:
          file,

        processedFile:
          file,

        compressed:
          false,

        resized:
          false,

        originalSize:
          file.size,

        processedSize:
          file.size

      };
    }


    if (
      !config.imageProcessing.enabled ||
      !config.imageProcessing.compressionEnabled
    ) {

      return {

        originalFile:
          file,

        processedFile:
          file,

        compressed:
          false,

        resized:
          false,

        originalSize:
          file.size,

        processedSize:
          file.size

      };
    }


    /*
     * Small images do not need to be recompressed.
     * We still decode them only when processing is required.
     */

    if (
      config.imageProcessing
        .doNotCompressSmallImages &&
      file.size <=
        config.imageProcessing.targetMaxSizeMB *
        1024 *
        1024
    ) {

      return {

        originalFile:
          file,

        processedFile:
          file,

        compressed:
          false,

        resized:
          false,

        originalSize:
          file.size,

        processedSize:
          file.size,

        originalSizeFormatted:
          formatFileSize(
            file.size
          ),

        processedSizeFormatted:
          formatFileSize(
            file.size
          ),

        reductionBytes:
          0,

        reductionPercent:
          0

      };
    }


    const image =
      await loadImage(
        file
      );


    const dimensions =
      config.imageProcessing.resizeEnabled

        ? calculateDimensions(

            image.naturalWidth,

            image.naturalHeight,

            config.imageProcessing.maxWidth,

            config.imageProcessing.maxHeight

          )

        : {

            width:
              image.naturalWidth,

            height:
              image.naturalHeight

          };


    const canvas =
      document.createElement(
        "canvas"
      );


    canvas.width =
      dimensions.width;

    canvas.height =
      dimensions.height;


    const context =
      canvas.getContext(
        "2d"
      );


    if (!context) {

      throw new Error(
        "Canvas processing is not available."
      );
    }


    /*
     * White background prevents transparent PNG
     * documents/photos from becoming black when converted
     * to JPEG.
     */

    context.fillStyle =
      "#ffffff";

    context.fillRect(
      0,
      0,
      dimensions.width,
      dimensions.height
    );


    context.drawImage(

      image,

      0,

      0,

      dimensions.width,

      dimensions.height

    );


    let quality =
      config.imageProcessing.targetQuality;


    let blob =
      await canvasToBlob(

        canvas,

        config.imageProcessing.outputFormat,

        quality

      );


    const targetBytes =
      config.imageProcessing.targetMaxSizeMB *
      1024 *
      1024;


    while (

      blob.size >
      targetBytes &&

      quality >
      config.imageProcessing.minimumQuality

    ) {

      quality =
        Math.max(
          config.imageProcessing.minimumQuality,
          quality - 0.05
        );


      blob =
        await canvasToBlob(

          canvas,

          config.imageProcessing.outputFormat,

          quality

        );
    }


    let processedFile =
      file;


    const shouldReplace =
      !config.imageProcessing
        .doNotCompressSmallImages ||

      blob.size < file.size;


    if (
      shouldReplace
    ) {

      processedFile =
        new File(

          [blob],

          file.name.replace(
            /\.[^/.]+$/,
            ""
          ) + ".jpg",

          {

            type:
              config.imageProcessing
                .outputFormat,

            lastModified:
              Date.now()

          }

        );
    }


    const compressed =
      processedFile.size <
      file.size;


    const resized =

      dimensions.width !==
        image.naturalWidth ||

      dimensions.height !==
        image.naturalHeight;


    const reductionPercent =

      file.size > 0

        ? Math.max(

            0,

            (
              1 -
              processedFile.size /
                file.size
            ) * 100

          )

        : 0;


    addAudit(

      "IMAGE_COMPRESSED",

      {

        originalName:
          file.name,

        originalSize:
          file.size,

        processedSize:
          processedFile.size,

        originalWidth:
          image.naturalWidth,

        originalHeight:
          image.naturalHeight,

        processedWidth:
          dimensions.width,

        processedHeight:
          dimensions.height,

        quality:
          quality,

        compressed:
          compressed,

        resized:
          resized,

        reductionPercent:
          reductionPercent

      }

    );


    return {

      originalFile:
        file,

      processedFile:
        processedFile,

      compressed:
        compressed,

      resized:
        resized,

      originalSize:
        file.size,

      processedSize:
        processedFile.size,

      originalSizeFormatted:
        formatFileSize(
          file.size
        ),

      processedSizeFormatted:
        formatFileSize(
          processedFile.size
        ),

      originalDimensions: {

        width:
          image.naturalWidth,

        height:
          image.naturalHeight

      },

      processedDimensions: {

        width:
          dimensions.width,

        height:
          dimensions.height

      },

      reductionBytes:
        Math.max(
          0,
          file.size -
            processedFile.size
        ),

      reductionPercent:
        reductionPercent,

      quality:
        quality

    };
  }


  /* ============================================================
     FILE PROCESSING
     ============================================================ */

  async function processFile(
    file
  ) {

    const validation =
      validateFile(
        file
      );


    if (
      !validation.valid
    ) {

      return {

        success:
          false,

        validation:
          validation,

        originalFile:
          file,

        processedFile:
          null

      };
    }


    try {

      if (
        isImageFile(file)
      ) {

        const result =
          await compressImage(
            file
          );


        return {

          success:
            true,

          type:
            "IMAGE",

          validation:
            validation,

          ...result

        };
      }


      if (
        isPDFFile(file)
      ) {

        if (
          file.size >
          10 * 1024 * 1024
        ) {

          return {

            success:
              false,

            validation: {

              valid:
                false,

              errors: [

                "PDF exceeds the maximum 10 MB limit."

              ]

            },

            originalFile:
              file,

            processedFile:
              null

          };
        }


        addAudit(

          "PDF_ACCEPTED",

          {

            name:
              file.name,

            size:
              file.size

          }

        );


        return {

          success:
            true,

          type:
            "PDF",

          validation:
            validation,

          originalFile:
            file,

          processedFile:
            file,

          compressed:
            false,

          resized:
            false,

          originalSize:
            file.size,

          processedSize:
            file.size,

          originalSizeFormatted:
            formatFileSize(
              file.size
            ),

          processedSizeFormatted:
            formatFileSize(
              file.size
            ),

          reductionBytes:
            0,

          reductionPercent:
            0

        };
      }


      return {

        success:
          false,

        validation: {

          valid:
            false,

          errors: [

            "Unsupported document type."

          ]

        }

      };


    } catch (
      error
    ) {

      return {

        success:
          false,

        validation: {

          valid:
            false,

          errors: [

            error.message ||
            "File processing failed."

          ]

        }

      };
    }
  }


  async function processFiles(
    files
  ) {

    const list =
      Array.from(
        files || []
      );

    const results = [];


    for (
      let i = 0;
      i < list.length;
      i++
    ) {

      results.push(

        await processFile(
          list[i]
        )

      );
    }


    return results;
  }


  /* ============================================================
     DOCUMENT RECORD
     ============================================================ */

  function createDocumentRecord(
    processed,
    ownerType,
    ownerId,
    documentType,
    uploadedBy
  ) {

    if (
      !processed ||
      !processed.success
    ) {

      return null;
    }


    if (
      !documentType
    ) {

      throw new Error(
        "Document type is required."
      );
    }


    const file =
      processed.processedFile;


    const normalizedOwnerType =
      normalizeKYCType(
        ownerType
      );


    if (
      normalizedOwnerType &&
      !isDocumentAllowedForRole(
        documentType,
        normalizedOwnerType
      )
    ) {

      throw new Error(
        "Document type is not allowed for owner type: " +
        normalizedOwnerType
      );
    }


    return {

      localId:

        "DOC-" +

        Date.now() +

        "-" +

        Math.random()
          .toString(36)
          .slice(2, 8),


      ownerType:
        normalizedOwnerType ||
        ownerType ||
        "",


      ownerId:
        ownerId || "",


      documentType:
        documentType,


      filename:
        file.name,


      mimeType:
        file.type,


      originalFilename:

        processed.originalFile
          ? processed.originalFile.name
          : file.name,


      originalSize:
        processed.originalSize,


      processedSize:
        processed.processedSize,


      compressed:
        Boolean(
          processed.compressed
        ),


      resized:
        Boolean(
          processed.resized
        ),


      uploadedBy:
        uploadedBy ||
        "ADMIN",


      status:
        "SUBMITTED",


      lifecycleStatus:
        "ACTIVE",


      reviewStatus:
        "PENDING",


      verificationStatus:
        "PENDING_BACKEND_VERIFICATION",


      uploadedAt:
        new Date().toISOString(),


      expiryDate:
        null,


      replacementOf:
        null,


      replacementReason:
        "",


      rejectionReason:
        "",


      approvalComment:
        "",


      documentVersion:
        1,


      processingMetadata: {

        compressed:
          Boolean(
            processed.compressed
          ),

        resized:
          Boolean(
            processed.resized
          ),

        originalSize:
          processed.originalSize,

        processedSize:
          processed.processedSize,

        reductionPercent:
          processed.reductionPercent || 0

      },


      backendSubmissionStatus:
        "NOT_SUBMITTED",


      backendDocumentId:
        null,


      backendVerificationStatus:
        "PENDING",


      backendVerificationAt:
        null,


      backendAuthoritative:
        true,


      frontendCanApprove:
        false,


      frontendCanVerify:
        false

    };
  }


  /* ============================================================
     CENTRAL KYC ENGINE — ROLE DEFINITIONS
     ============================================================ */

  const KYC_ROLE_MAP = {

    CUSTOMER:
      "Customer",

    VENDOR:
      "Vendor",

    DRIVER:
      "Driver",

    VEHICLE:
      "Vehicle"

  };


  const KYC_STATUS = {

    NOT_STARTED:
      "NOT_STARTED",

    PENDING:
      "PENDING",

    SUBMITTED:
      "SUBMITTED",

    UNDER_REVIEW:
      "UNDER_REVIEW",

    APPROVED:
      "APPROVED",

    REJECTED:
      "REJECTED",

    RESUBMISSION_REQUIRED:
      "RESUBMISSION_REQUIRED",

    EXPIRED:
      "EXPIRED",

    SUSPENDED:
      "SUSPENDED"

  };


  const DOCUMENT_STATUS = {

    PENDING:
      "PENDING",

    SUBMITTED:
      "SUBMITTED",

    UNDER_REVIEW:
      "UNDER_REVIEW",

    APPROVED:
      "APPROVED",

    REJECTED:
      "REJECTED",

    RESUBMISSION_REQUIRED:
      "RESUBMISSION_REQUIRED",

    EXPIRED:
      "EXPIRED",

    RENEWAL_PENDING:
      "RENEWAL_PENDING",

    REPLACEMENT_PENDING:
      "REPLACEMENT_PENDING",

    REPLACED:
      "REPLACED",

    SUSPENDED:
      "SUSPENDED"

  };


  /* ============================================================
     ROLE NORMALIZATION
     ============================================================ */

  function normalizeKYCType(
    role
  ) {

    const value =
      String(
        role || ""
      )
      .trim()
      .toUpperCase();


    if (
      value === "CUSTOMER"
    ) {

      return "Customer";
    }


    if (
      value === "VENDOR"
    ) {

      return "Vendor";
    }


    if (
      value === "DRIVER"
    ) {

      return "Driver";
    }


    if (
      value === "VEHICLE"
    ) {

      return "Vehicle";
    }


    return null;
  }


  /* ============================================================
     KYC REQUIRED CHECK
     ============================================================ */

  function isKYCRequiredForRole(
    role
  ) {

    const config =
      loadConfig();

    const normalized =
      normalizeKYCType(
        role
      );


    if (
      !normalized
    ) {

      return false;
    }


    const map = {

      Customer:
        "customerKYCRequired",

      Vendor:
        "vendorKYCRequired",

      Driver:
        "driverKYCRequired",

      Vehicle:
        "vehicleKYCRequired"

    };


    return Boolean(
      config.kyc[
        map[normalized]
      ]
    );
  }


  /* ============================================================
     KYC PROFILE
     ============================================================ */

  function getKYCProfile(
    role
  ) {

    const config =
      loadConfig();

    const normalized =
      normalizeKYCType(
        role
      );


    if (
      !normalized
    ) {

      throw new Error(
        "Unsupported KYC role: " +
        role
      );
    }


    const map = {

      Customer:
        "customerKYC",

      Vendor:
        "vendorKYC",

      Driver:
        "driverKYC",

      Vehicle:
        "vehicleKYC"

    };


    return {

      role:
        normalized,

      kycRequired:
        isKYCRequiredForRole(
          normalized
        ),

      settings:
        clone(
          config[
            map[normalized]
          ]
        )

    };
  }


  /* ============================================================
     DOCUMENT TYPES FOR ROLE
     ============================================================ */

  function getDocumentTypesForRole(
    role
  ) {

    const config =
      loadConfig();

    const normalized =
      normalizeKYCType(
        role
      );


    if (
      !normalized
    ) {

      return [];
    }


    const documents = [];


    Object.keys(
      config.documentTypes
    )
    .forEach(
      function (
        key
      ) {

        const type =
          config.documentTypes[
            key
          ];


        if (
          !type ||
          !type.enabled
        ) {

          return;
        }


        if (
          !isDocumentAllowedForRole(
            key,
            normalized
          )
        ) {

          return;
        }


        documents.push({

          key:
            key,

          label:
            type.label,

          mandatory:
            Boolean(
              type.mandatory
            ),

          enabled:
            true

        });

      }
    );


    return documents;
  }


  /* ============================================================
     REQUIRED DOCUMENTS
     ============================================================ */

  function getRequiredDocuments(
    role
  ) {

    const normalized =
      normalizeKYCType(
        role
      );


    if (
      !normalized
    ) {

      return [];
    }


    const config =
      loadConfig();

    const documents = [];


    Object.keys(
      config.documentTypes
    )
    .forEach(
      function (
        key
      ) {

        const type =
          config.documentTypes[
            key
          ];


        if (
          !type ||
          !type.enabled
        ) {

          return;
        }


        if (
          !isDocumentAllowedForRole(
            key,
            normalized
          )
        ) {

          return;
        }


        let mandatory =
          Boolean(
            type.mandatory
          );


        /*
         * Driver-specific requirement
         */

        if (
          normalized === "Driver" &&
          key === "drivingLicense"
        ) {

          mandatory =
            true;
        }


        /*
         * Vehicle-specific operational requirements
         */

        if (
          normalized === "Vehicle"
        ) {

          const vehicleRequiredMap = {

            vehicleRegistration:
              config.vehicleKYC.registrationRequired,

            vehicleInsurance:
              config.vehicleKYC.insuranceRequired,

            vehicleFitness:
              config.vehicleKYC.fitnessRequired,

            vehiclePermit:
              config.vehicleKYC.permitRequired,

            pollutionCertificate:
              config.vehicleKYC
                .pollutionCertificateRequired

          };


          if (
            Object.prototype.hasOwnProperty
              .call(
                vehicleRequiredMap,
                key
              )
          ) {

            mandatory =
              Boolean(
                vehicleRequiredMap[key]
              );
          }
        }


        if (
          mandatory
        ) {

          documents.push({

            key:
              key,

            label:
              type.label,

            mandatory:
              true

          });
        }

      }
    );


    return documents;
  }


  /* ============================================================
     OPTIONAL DOCUMENTS
     ============================================================ */

  function getOptionalDocuments(
    role
  ) {

    const all =
      getDocumentTypesForRole(
        role
      );


    const required =
      getRequiredDocuments(
        role
      );


    const requiredKeys =
      required.map(
        function (
          item
        ) {

          return item.key;
        }
      );


    return all.filter(
      function (
        item
      ) {

        return (
          requiredKeys.indexOf(
            item.key
          ) === -1
        );

      }
    );
  }


  function getRequiredDocumentKeys(
    role
  ) {

    return getRequiredDocuments(
      role
    )
    .map(
      function (
        item
      ) {

        return item.key;
      }
    );
  }


  /* ============================================================
     DOCUMENT NORMALIZATION
     ============================================================ */

  function normalizeDocuments(
    documents
  ) {

    if (
      !Array.isArray(
        documents
      )
    ) {

      return [];
    }


    return documents
      .filter(
        Boolean
      )
      .map(
        function (
          document
        ) {

          return clone(
            document
          );
        }
      );
  }


  /* ============================================================
     FIND LATEST DOCUMENT
     ============================================================ */

  function findLatestDocument(
    documents,
    documentType
  ) {

    const list =
      normalizeDocuments(
        documents
      );


    const matches =
      list.filter(
        function (
          document
        ) {

          return (
            document.documentType ===
            documentType
          );
        }
      );


    if (
      !matches.length
    ) {

      return null;
    }


    matches.sort(
      function (
        a,
        b
      ) {

        return (
          new Date(
            b.uploadedAt || 0
          ) -
          new Date(
            a.uploadedAt || 0
          )
        );
      }
    );


    return matches[0];
  }


  /* ============================================================
     DOCUMENT USABILITY
     ============================================================ */

  function isDocumentUsable(
    document
  ) {

    if (
      !document
    ) {

      return false;
    }


    const status =
      String(
        document.status || ""
      )
      .toUpperCase();


    if (
      status ===
      DOCUMENT_STATUS.APPROVED
    ) {

      return true;
    }


    /*
     * Submitted / under-review documents are included
     * in a submission package but are NOT treated as
     * final backend-approved documents.
     */

    if (
      status ===
        DOCUMENT_STATUS.SUBMITTED ||

      status ===
        DOCUMENT_STATUS.UNDER_REVIEW
    ) {

      return true;
    }


    return false;
  }


  /* ============================================================
     KYC PROGRESS
     ============================================================ */

  function getKYCProgress(
    role,
    documents
  ) {

    const required =
      getRequiredDocuments(
        role
      );


    const list =
      normalizeDocuments(
        documents
      );


    const total =
      required.length;


    let completed = 0;


    const details =
      required.map(
        function (
          requirement
        ) {

          const latest =
            findLatestDocument(
              list,
              requirement.key
            );


          const usable =
            isDocumentUsable(
              latest
            );


          if (
            usable
          ) {

            completed++;
          }


          return {

            documentType:
              requirement.key,

            label:
              requirement.label,

            mandatory:
              true,

            present:
              Boolean(
                latest
              ),

            usable:
              usable,

            status:
              latest
                ? (
                    latest.status ||
                    "UNKNOWN"
                  )
                : "MISSING",

            document:
              latest

          };
        }
      );


    const percentage =
      total === 0

        ? 100

        : Math.round(
            (
              completed /
              total
            ) * 100
          );


    return {

      role:
        normalizeKYCType(
          role
        ),

      totalRequired:
        total,

      completedRequired:
        completed,

      missingRequired:
        Math.max(
          0,
          total -
          completed
        ),

      percentage:
        percentage,

      complete:
        completed === total,

      details:
        details

    };
  }


  /* ============================================================
     KYC STATUS CALCULATION
     ============================================================ */

  function calculateKYCStatus(
    role,
    documents,
    existingStatus
  ) {

    const progress =
      getKYCProgress(
        role,
        documents
      );


    const list =
      normalizeDocuments(
        documents
      );


    const rejected =
      list.some(
        function (
          document
        ) {

          return (
            String(
              document.status || ""
            ).toUpperCase() ===
            DOCUMENT_STATUS.REJECTED
          );
        }
      );


    const resubmission =
      list.some(
        function (
          document
        ) {

          return (
            String(
              document.status || ""
            ).toUpperCase() ===
            DOCUMENT_STATUS.RESUBMISSION_REQUIRED
          );
        }
      );


    const expired =
      list.some(
        function (
          document
        ) {

          return (
            String(
              document.status || ""
            ).toUpperCase() ===
            DOCUMENT_STATUS.EXPIRED
          );
        }
      );


    if (
      existingStatus ===
      KYC_STATUS.APPROVED
    ) {

      if (
        expired
      ) {

        return KYC_STATUS.EXPIRED;
      }


      return KYC_STATUS.APPROVED;
    }


    if (
      resubmission
    ) {

      return KYC_STATUS.RESUBMISSION_REQUIRED;
    }


    if (
      rejected
    ) {

      return KYC_STATUS.REJECTED;
    }


    if (
      expired
    ) {

      return KYC_STATUS.EXPIRED;
    }


    if (
      !progress.complete
    ) {

      return (
        progress.completedRequired > 0

          ? KYC_STATUS.PENDING

          : KYC_STATUS.NOT_STARTED
      );
    }


    return (
      existingStatus ||
      KYC_STATUS.PENDING
    );
  }


  /* ============================================================
     CREATE KYC APPLICATION
     ============================================================ */

  function createKYCApplication(
    role,
    ownerId,
    options
  ) {

    const normalized =
      normalizeKYCType(
        role
      );


    if (
      !normalized
    ) {

      throw new Error(
        "Invalid KYC role."
      );
    }


    if (
      !ownerId
    ) {

      throw new Error(
        "KYC ownerId is required."
      );
    }


    const profile =
      getKYCProfile(
        normalized
      );


    const now =
      new Date().toISOString();


    const application = {

      applicationId:

        "KYC-" +

        normalized.toUpperCase() +

        "-" +

        Date.now() +

        "-" +

        Math.random()
          .toString(36)
          .slice(2, 8),


      role:
        normalized,


      ownerId:
        String(
          ownerId
        ),


      status:
        KYC_STATUS.NOT_STARTED,


      createdAt:
        now,


      updatedAt:
        now,


      submittedAt:
        null,


      reviewedAt:
        null,


      backendDecisionAt:
        null,


      requiredDocuments:
        getRequiredDocuments(
          normalized
        ),


      optionalDocuments:
        getOptionalDocuments(
          normalized
        ),


      documents:
        [],


      documentCount:
        0,


      progress:
        0,


      progressDetails:
        [],


      resubmissionRequired:
        false,


      rejectionReason:
        "",


      reviewComment:
        "",


      replacementPending:
        false,


      expiryPending:
        false,


      backendSubmissionStatus:
        "NOT_SUBMITTED",


      backendDecision:
        null,


      backendAuthoritative:
        true,


      frontendCanApprove:
        false,


      frontendCanVerify:
        false,


      settings:
        clone(
          profile.settings
        ),


      metadata:
        clone(
          options || {}
        )

    };


    addAudit(
      "KYC_APPLICATION_CREATED",
      {

        applicationId:
          application.applicationId,

        role:
          normalized,

        ownerId:
          ownerId

      }
    );


    return application;
  }


  /* ============================================================
     ATTACH DOCUMENTS TO KYC APPLICATION
     ============================================================ */

  function attachKYCDocuments(
    application,
    documents
  ) {

    if (
      !application
    ) {

      throw new Error(
        "KYC application is required."
      );
    }


    const list =
      normalizeDocuments(
        documents
      );


    const progress =
      getKYCProgress(
        application.role,
        list
      );


    const status =
      calculateKYCStatus(
        application.role,
        list,
        application.status
      );


    const output =
      clone(
        application
      );


    output.documents =
      list;


    output.documentCount =
      list.length;


    output.progress =
      progress.percentage;


    output.progressDetails =
      progress.details;


    output.status =
      status;


    output.updatedAt =
      new Date().toISOString();


    return output;
  }


  /* ============================================================
     KYC SUBMISSION READINESS
     ============================================================ */

  function canSubmitKYC(
    role,
    documents
  ) {

    const normalized =
      normalizeKYCType(
        role
      );


    if (
      !normalized
    ) {

      return {

        allowed:
          false,

        reason:
          "Invalid KYC role."

      };
    }


    const profile =
      getKYCProfile(
        normalized
      );


    if (
      !profile.settings.submitKYCAllowed
    ) {

      return {

        allowed:
          false,

        reason:
          "KYC submission is disabled for this role."

      };
    }


    const progress =
      getKYCProgress(
        normalized,
        documents
      );


    if (
      !progress.complete
    ) {

      return {

        allowed:
          false,

        reason:
          "Required documents are missing.",

        progress:
          progress

      };
    }


    return {

      allowed:
        true,

      reason:
        "KYC is ready for submission.",

      progress:
        progress

    };
  }


  /* ============================================================
     BACKEND-READY KYC SUBMISSION
     ============================================================ */

  function submitKYC(
    role,
    ownerId,
    documents,
    application
  ) {

    const normalized =
      normalizeKYCType(
        role
      );


    if (
      !normalized
    ) {

      throw new Error(
        "Invalid KYC role."
      );
    }


    if (
      !ownerId
    ) {

      throw new Error(
        "KYC ownerId is required."
      );
    }


    const readiness =
      canSubmitKYC(
        normalized,
        documents
      );


    if (
      !readiness.allowed
    ) {

      return {

        success:
          false,

        submitted:
          false,

        reason:
          readiness.reason,

        progress:
          readiness.progress ||
          null

      };
    }


    const list =
      normalizeDocuments(
        documents
      );


    const now =
      new Date().toISOString();


    const applicationData =
      application

        ? clone(
            application
          )

        : createKYCApplication(
            normalized,
            ownerId
          );


    applicationData.documents =
      list;


    applicationData.documentCount =
      list.length;


    applicationData.status =
      KYC_STATUS.SUBMITTED;


    applicationData.submittedAt =
      now;


    applicationData.updatedAt =
      now;


    applicationData.progress =
      readiness.progress.percentage;


    applicationData.progressDetails =
      readiness.progress.details;


    applicationData.backendSubmissionStatus =
      "READY_FOR_BACKEND";


    applicationData.backendAuthoritative =
      true;


    applicationData.frontendCanApprove =
      false;


    applicationData.frontendCanVerify =
      false;


    const payload = {

      action:
        "KYC_SUBMIT",

      version:
        VERSION,

      environment:
        "TESTING",

      project:
        "GoVara",

      data: {

        application:
          applicationData,

        role:
          normalized,

        ownerId:
          ownerId,

        documents:
          list

      }

    };


    addAudit(
      "KYC_SUBMISSION_PREPARED",
      {

        applicationId:
          applicationData.applicationId,

        role:
          normalized,

        ownerId:
          ownerId,

        documentCount:
          list.length

      }
    );


    return {

      success:
        true,

      submitted:
        true,

      localApplication:
        applicationData,

      backendPayload:
        payload,

      authoritative:
        "BACKEND",

      note:
        "Frontend prepared the submission package. Backend final submission, verification and KYC decision remain authoritative."

    };
  }


  /* ============================================================
     KYC STATUS
     ============================================================ */

  function getKYCStatus(
    role,
    ownerId,
    documents,
    existingStatus
  ) {

    const normalized =
      normalizeKYCType(
        role
      );


    if (
      !normalized
    ) {

      throw new Error(
        "Invalid KYC role."
      );
    }


    if (
      !ownerId
    ) {

      throw new Error(
        "KYC ownerId is required."
      );
    }


    const list =
      normalizeDocuments(
        documents
      );


    const progress =
      getKYCProgress(
        normalized,
        list
      );


    const status =
      calculateKYCStatus(
        normalized,
        list,
        existingStatus
      );


    return {

      role:
        normalized,

      ownerId:
        String(
          ownerId
        ),

      status:
        status,

      progress:
        progress,

      requiredDocuments:
        getRequiredDocuments(
          normalized
        ),

      optionalDocuments:
        getOptionalDocuments(
          normalized
        ),

      documentCount:
        list.length,

      backendAuthoritative:
        true

    };
  }


  /* ============================================================
     RESUBMISSION REQUEST
     ============================================================ */

  function requestResubmission(
    role,
    ownerId,
    documentType,
    reason,
    application
  ) {

    const normalized =
      normalizeKYCType(
        role
      );


    if (
      !normalized
    ) {

      throw new Error(
        "Invalid KYC role."
      );
    }


    if (
      !ownerId
    ) {

      throw new Error(
        "KYC ownerId is required."
      );
    }


    if (
      !documentType
    ) {

      throw new Error(
        "Document type is required."
      );
    }


    const allowed =
      isDocumentAllowedForRole(
        documentType,
        normalized
      );


    if (
      !allowed
    ) {

      throw new Error(
        "Document type is not allowed for this role."
      );
    }


    const result = {

      success:
        true,

      action:
        "REQUEST_RESUBMISSION",

      role:
        normalized,

      ownerId:
        String(
          ownerId
        ),

      documentType:
        documentType,

      reason:
        reason ||
        "Document resubmission required.",

      status:
        KYC_STATUS.RESUBMISSION_REQUIRED,

      backendAuthoritative:
        true,

      frontendCanApprove:
        false,

      frontendCanVerify:
        false,

      application:
        application
          ? clone(
              application
            )
          : null

    };


    addAudit(
      "KYC_RESUBMISSION_REQUESTED",
      result
    );


    return result;
  }


  /* ============================================================
     DOCUMENT REPLACEMENT
     ============================================================ */

  function createReplacement(
    existingDocument,
    processedDocument,
    reason,
    requestedBy
  ) {

    if (
      !existingDocument
    ) {

      throw new Error(
        "Existing document is required."
      );
    }


    if (
      !processedDocument ||
      !processedDocument.success
    ) {

      throw new Error(
        "A successfully processed replacement document is required."
      );
    }


    const replacement =
      createDocumentRecord(

        processedDocument,

        existingDocument.ownerType,

        existingDocument.ownerId,

        existingDocument.documentType,

        requestedBy ||
        "OWNER"

      );


    replacement.replacementOf =
      existingDocument.localId;


    replacement.status =
      DOCUMENT_STATUS.REPLACEMENT_PENDING;


    replacement.lifecycleStatus =
      "PENDING_REPLACEMENT";


    replacement.verificationStatus =
      "PENDING_BACKEND_VERIFICATION";


    replacement.replacementReason =
      reason ||
      "";


    replacement.backendAuthoritative =
      true;


    addAudit(
      "DOCUMENT_REPLACEMENT_CREATED",
      {

        oldDocumentId:
          existingDocument.localId,

        newDocumentId:
          replacement.localId,

        ownerType:
          existingDocument.ownerType,

        ownerId:
          existingDocument.ownerId,

        documentType:
          existingDocument.documentType

      }
    );


    return replacement;
  }


  /* ============================================================
     EXPIRY CHECK
     ============================================================ */

  function checkDocumentExpiry(
    document,
    referenceDate
  ) {

    if (
      !document
    ) {

      return {

        status:
          "MISSING",

        expired:
          false,

        daysRemaining:
          null

      };
    }


    if (
      !document.expiryDate
    ) {

      return {

        status:
          "NO_EXPIRY_DATE",

        expired:
          false,

        daysRemaining:
          null

      };
    }


    const now =
      referenceDate

        ? new Date(
            referenceDate
          )

        : new Date();


    const expiry =
      new Date(
        document.expiryDate
      );


    if (
      Number.isNaN(
        expiry.getTime()
      )
    ) {

      return {

        status:
          "INVALID_EXPIRY_DATE",

        expired:
          false,

        daysRemaining:
          null

      };
    }


    const difference =
      expiry.getTime() -
      now.getTime();


    const daysRemaining =
      Math.ceil(
        difference /
        (
          1000 *
          60 *
          60 *
          24
        )
      );


    const config =
      loadConfig();


    let status =
      "VALID";


    if (
      daysRemaining < 0
    ) {

      status =
        "EXPIRED";

    } else if (
      daysRemaining <=
      config.expiry.secondAlertDays
    ) {

      status =
        "EXPIRING_SECOND_ALERT";

    } else if (
      daysRemaining <=
      config.expiry.primaryAlertDays
    ) {

      status =
        "EXPIRING_PRIMARY_ALERT";
    }


    return {

      status:
        status,

      expired:
        daysRemaining < 0,

      daysRemaining:
        daysRemaining,

      expiryDate:
        document.expiryDate

    };
  }


  /* ============================================================
     CHECK ALL DOCUMENT EXPIRIES
     ============================================================ */

  function checkDocumentExpiries(
    documents,
    referenceDate
  ) {

    const list =
      normalizeDocuments(
        documents
      );


    return list.map(
      function (
        document
      ) {

        return {

          document:
            document,

          expiry:
            checkDocumentExpiry(
              document,
              referenceDate
            )

        };

      }
    );
  }


  /* ============================================================
     KYC EXPIRY STATUS
     ============================================================ */

  function checkKYCExpiry(
    documents,
    referenceDate
  ) {

    const results =
      checkDocumentExpiries(
        documents,
        referenceDate
      );


    const expired =
      results.filter(
        function (
          item
        ) {

          return item.expiry.expired;
        }
      );


    const expiring =
      results.filter(
        function (
          item
        ) {

          return (

            item.expiry.status ===
              "EXPIRING_PRIMARY_ALERT" ||

            item.expiry.status ===
              "EXPIRING_SECOND_ALERT"

          );

        }
      );


    return {

      total:
        results.length,

      expiredCount:
        expired.length,

      expiringCount:
        expiring.length,

      expired:
        expired,

      expiring:
        expiring,

      all:
        results

    };
  }


  /* ============================================================
     ROLE KYC ACTION PERMISSION
     ============================================================ */

  function canRoleManageKYC(
    role,
    action
  ) {

    const normalized =
      normalizeKYCType(
        role
      );


    if (
      !normalized
    ) {

      return false;
    }


    const permissionMap = {

      upload:
        "upload",

      view:
        "view",

      download:
        "download",

      replace:
        "replace",

      submit:
        "submitKYC",

      submitKYC:
        "submitKYC",

      resubmission:
        "requestResubmission",

      expiry:
        "manageExpiry",

      replacement:
        "manageReplacement"

    };


    const permission =
      permissionMap[
        action
      ];


    if (
      !permission
    ) {

      return false;
    }


    return hasPermission(
      normalized,
      permission
    );
  }


  /* ============================================================
     BACKEND SUBMISSION QUEUE ITEM
     ============================================================ */

  function createSubmissionQueueItem(
    role,
    ownerId,
    documents,
    application
  ) {

    const result =
      submitKYC(
        role,
        ownerId,
        documents,
        application
      );


    if (
      !result.success
    ) {

      return result;
    }


    return {

      queueId:

        "KYCQ-" +

        Date.now() +

        "-" +

        Math.random()
          .toString(36)
          .slice(2, 8),


      createdAt:
        new Date().toISOString(),


      status:
        "READY_FOR_BACKEND",


      role:
        normalizeKYCType(
          role
        ),


      ownerId:
        String(
          ownerId
        ),


      applicationId:
        result.localApplication
          .applicationId,


      payload:
        result.backendPayload,


      backendAuthoritative:
        true

    };
  }


  /* ============================================================
     VEHICLE DOCUMENT PROFILE
     ============================================================ */

  function getVehicleDocumentProfile() {

    const required =
      getRequiredDocuments(
        "Vehicle"
      );


    const optional =
      getOptionalDocuments(
        "Vehicle"
      );


    const config =
      loadConfig();


    return {

      role:
        "Vehicle",

      kycRequired:
        isKYCRequiredForRole(
          "Vehicle"
        ),

      required:
        required,

      optional:
        optional,

      operationalRequirements: {

        registration:
          Boolean(
            config.vehicleKYC
              .registrationRequired
          ),

        insurance:
          Boolean(
            config.vehicleKYC
              .insuranceRequired
          ),

        fitness:
          Boolean(
            config.vehicleKYC
              .fitnessRequired
          ),

        permit:
          Boolean(
            config.vehicleKYC
              .permitRequired
          ),

        pollutionCertificate:
          Boolean(
            config.vehicleKYC
              .pollutionCertificateRequired
          )

      },

      expiryBlocksOperation:
        Boolean(
          config.vehicleKYC
            .expiredDocumentBlocksVehicle
        ),

      backendAuthority:
        true

    };
  }


  /* ============================================================
     CENTRAL ENGINE STATUS
     ============================================================ */

  function getCentralKYCStatus() {

    const config =
      loadConfig();


    return {

      engine:
        "CENTRAL_DOCUMENT_KYC_ENGINE",

      version:
        VERSION,

      enabled:
        Boolean(
          config.kyc.enabled
        ),

      roles: {

        Customer:
          isKYCRequiredForRole(
            "Customer"
          ),

        Vendor:
          isKYCRequiredForRole(
            "Vendor"
          ),

        Driver:
          isKYCRequiredForRole(
            "Driver"
          ),

        Vehicle:
          isKYCRequiredForRole(
            "Vehicle"
          )

      },

      documentProcessing:
        Boolean(
          config.imageProcessing.enabled
        ),

      compression:
        Boolean(
          config.imageProcessing
            .compressionEnabled
        ),

      resize:
        Boolean(
          config.imageProcessing
            .resizeEnabled
        ),

      vehicleDocuments:
        getVehicleDocumentProfile(),

      backendAuthority:
        true,

      automaticApproval:
        false,

      automaticVerification:
        false,

      frontendAuthority:
        false

    };
  }


  /* ============================================================
     ADMIN WORKFLOW ACTIONS
     ============================================================ */

  function adminAction(
    action,
    documentId,
    details
  ) {

    if (
      !hasPermission(
        "Admin",
        action
      )
    ) {

      throw new Error(
        "Admin does not have permission for: " +
        action
      );
    }


    /*
     * These actions are workflow records only.
     * They never override backend authority.
     */

    addAudit(

      "ADMIN_" +
      String(action)
        .toUpperCase(),

      {

        documentId:
          documentId,

        details:
          details || {}

      }

    );


    return {

      success:
        true,

      action:
        action,

      documentId:
        documentId,

      authoritative:
        "BACKEND"

    };
  }


  /* ============================================================
     RENDER
     ============================================================ */

  function render() {

    const mount =
      document.getElementById(
        "module-26F"
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


    const centralStatus =
      getCentralKYCStatus();


    const roles = [

      "Admin",
      "Customer",
      "Vendor",
      "Driver",
      "Backend"

    ];


    const permissionNames = [

      "upload",
      "view",
      "download",
      "replace",
      "submitKYC",
      "review",
      "verify",
      "approve",
      "reject",
      "requestResubmission",
      "manageExpiry",
      "manageReplacement",
      "viewAudit",
      "configure",
      "deletePermanently"

    ];


    const permissionRows =
      roles.map(
        function (
          role
        ) {

          return `

            <tr>

              <td>
                <b>
                  ${role}
                </b>
              </td>

              ${permissionNames
                .map(
                  function (
                    permission
                  ) {

                    const checked =
                      hasPermission(
                        role,
                        permission
                      );


                    return `

                      <td
                        style="
                          text-align:center;
                        "
                      >

                        <input
                          type="checkbox"
                          data-26f-role="${role}"
                          data-26f-permission="${permission}"
                          ${checked ? "checked" : ""}
                          ${
                            role === "Backend"
                              ? "disabled"
                              : ""
                          }
                        >

                      </td>

                    `;
                  }
                )
                .join("")}

            </tr>

          `;
        }
      ).join("");


    const documentTypeRows =
      Object.keys(
        config.documentTypes
      )
      .map(
        function (
          key
        ) {

          const type =
            config.documentTypes[
              key
            ];


          return `

            <tr>

              <td>
                <b>
                  ${type.label}
                </b>
              </td>

              <td>
                ${
                  type.customer
                    ? "YES"
                    : "NO"
                }
              </td>

              <td>
                ${
                  type.vendor
                    ? "YES"
                    : "NO"
                }
              </td>

              <td>
                ${
                  type.driver
                    ? "YES"
                    : "NO"
                }
              </td>

              <td>
                ${
                  type.vehicle
                    ? "YES"
                    : "NO"
                }
              </td>

              <td>
                ${
                  type.mandatory
                    ? "MANDATORY"
                    : "OPTIONAL"
                }
              </td>

            </tr>

          `;
        }
      ).join("");


    const vehicleRequired =
      getRequiredDocuments(
        "Vehicle"
      );


    const vehicleOptional =
      getOptionalDocuments(
        "Vehicle"
      );


    mount.innerHTML = `

      <div class="page-head">

        <h1>
          26F — Documents & Central KYC
          Administrator Control Center
        </h1>

        <div class="muted">

          Central document and KYC engine for
          Customer, Vendor, Driver and Vehicle.

        </div>

      </div>


      <!-- CENTRAL ENGINE STATUS -->

      <section class="card">

        <h2>
          Central KYC Engine Status
        </h2>

        <div class="grid four">

          <div>

            <b>
              ${VERSION}
            </b>

            <div class="muted">
              Engine Version
            </div>

          </div>


          <div>

            <b>
              ENABLED
            </b>

            <div class="muted">
              Central Engine
            </div>

          </div>


          <div>

            <b>
              4 PROFILES
            </b>

            <div class="muted">
              Customer / Vendor / Driver / Vehicle
            </div>

          </div>


          <div>

            <b>
              BACKEND
            </b>

            <div class="muted">
              Final Authority
            </div>

          </div>

        </div>


        <div
          class="notice success"
          style="margin-top:16px;"
        >

          One Central Documents & KYC Engine is active.

          <br><br>

          Customer KYC:
          ${
            centralStatus.roles.Customer
              ? "REQUIRED"
              : "OPTIONAL"
          }

          <br>

          Vendor KYC:
          ${
            centralStatus.roles.Vendor
              ? "REQUIRED"
              : "OPTIONAL"
          }

          <br>

          Driver KYC:
          ${
            centralStatus.roles.Driver
              ? "REQUIRED"
              : "OPTIONAL"
          }

          <br>

          Vehicle KYC:
          ${
            centralStatus.roles.Vehicle
              ? "REQUIRED"
              : "OPTIONAL"
          }

          <br><br>

          Automatic approval:
          BLOCKED

          <br>

          Automatic verification:
          BLOCKED

          <br>

          Final authority:
          BACKEND

        </div>

      </section>


      <!-- SYSTEM STATUS -->

      <section class="card">

        <h2>
          26F System Status
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
              TESTING
            </b>

            <div class="muted">
              Environment
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
              Final Authority
            </div>

          </div>

        </div>

      </section>


      <!-- ADMIN ROLE -->

      <section class="card">

        <h2>
          Administrator Document Control
        </h2>

        <div class="notice success">

          Administrator can manage documents,
          upload documents on behalf of users,
          review submissions,
          initiate verification,
          record administrative workflow decisions,
          request resubmission,
          manage replacement and expiry.

          <br><br>

          Final authoritative verification and
          KYC authority remain Backend controlled.

        </div>

      </section>


      <!-- CENTRAL PROFILE MAP -->

      <section class="card">

        <h2>
          Central KYC Role Distribution
        </h2>

        <div class="grid four">

          <div>

            <b>
              CUSTOMER
            </b>

            <div class="muted">

              ${
                getRequiredDocuments(
                  "Customer"
                ).length
              }
              required documents

            </div>

          </div>


          <div>

            <b>
              VENDOR
            </b>

            <div class="muted">

              ${
                getRequiredDocuments(
                  "Vendor"
                ).length
              }
              required documents

            </div>

          </div>


          <div>

            <b>
              DRIVER
            </b>

            <div class="muted">

              ${
                getRequiredDocuments(
                  "Driver"
                ).length
              }
              required documents

            </div>

          </div>


          <div>

            <b>
              VEHICLE
            </b>

            <div class="muted">

              ${
                vehicleRequired.length
              }
              required documents

            </div>

          </div>

        </div>

      </section>


      <!-- VEHICLE DOCUMENT ENGINE -->

      <section class="card">

        <h2>
          Vehicle Documents — Central Engine
        </h2>

        <div class="notice success">

          Vehicle documents are NOT a separate KYC engine.

          <br><br>

          They are handled by the same Central
          Documents & KYC Engine using:

          <b>
            Profile Type = VEHICLE
          </b>

        </div>


        <div
          style="
            overflow-x:auto;
            margin-top:16px;
          "
        >

          <table>

            <thead>

              <tr>

                <th>
                  Vehicle Required Document
                </th>

                <th>
                  Requirement
                </th>

                <th>
                  Expiry
                </th>

              </tr>

            </thead>

            <tbody>

              ${
                vehicleRequired.length

                  ? vehicleRequired
                      .map(
                        function (
                          item
                        ) {

                          return `

                            <tr>

                              <td>
                                <b>
                                  ${item.label}
                                </b>
                              </td>

                              <td>
                                MANDATORY
                              </td>

                              <td>
                                TRACKED
                              </td>

                            </tr>

                          `;
                        }
                      )
                      .join("")

                  : `

                    <tr>

                      <td colspan="3">
                        No required vehicle documents configured.
                      </td>

                    </tr>

                  `
              }

            </tbody>

          </table>

        </div>


        ${
          vehicleOptional.length

            ? `

              <div
                class="muted"
                style="margin-top:12px;"
              >

                Optional Vehicle Documents:

                ${
                  vehicleOptional
                    .map(
                      function (
                        item
                      ) {

                        return item.label;
                      }
                    )
                    .join(", ")
                }

              </div>

            `

            : ""

        }

      </section>


      <!-- UPLOAD -->

      <section class="card">

        <h2>
          Document Upload & Processing
        </h2>

        <div class="grid two">

          <div>

            <label>
              Select Document(s)
            </label>

            <input
              id="govara26f-file-input"
              type="file"
              multiple
              accept="
                .jpg,
                .jpeg,
                .png,
                .webp,
                .pdf,
                image/jpeg,
                image/png,
                image/webp,
                application/pdf
              "
            >

            <div class="muted">

              Supported:
              JPG, JPEG, PNG, WebP, PDF

              <br>

              Maximum original file:
              ${config.upload.maxFileSizeMB} MB

              <br>

              Image target size:
              ${config.imageProcessing.targetMaxSizeMB} MB

            </div>

          </div>


          <div>

            <b>
              Image Processing
            </b>

            <div class="muted">

              Resize:
              ${
                config.imageProcessing.resizeEnabled
                  ? "ON"
                  : "OFF"
              }

              <br>

              Compression:
              ${
                config.imageProcessing.compressionEnabled
                  ? "ON"
                  : "OFF"
              }

              <br>

              Maximum dimensions:
              ${
                config.imageProcessing.maxWidth
              }
              ×
              ${
                config.imageProcessing.maxHeight
              }

              <br>

              Target quality:
              ${
                config.imageProcessing.targetQuality
              }

            </div>

          </div>

        </div>


        <div
          id="govara26f-upload-results"
          style="margin-top:16px;"
        ></div>

      </section>


      <!-- ROLE PERMISSIONS -->

      <section class="card">

        <h2>
          Role-wise Document & KYC Permissions
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
                  Role
                </th>

                ${permissionNames
                  .map(
                    function (
                      permission
                    ) {

                      return `
                        <th>
                          ${permission}
                        </th>
                      `;
                    }
                  )
                  .join("")}

              </tr>

            </thead>

            <tbody>

              ${permissionRows}

            </tbody>

          </table>

        </div>

        <div
          class="muted"
          style="margin-top:12px;"
        >

          Backend permissions are locked.

          <br>

          Permanent deletion remains disabled
          for frontend administration.

        </div>

      </section>


      <!-- DOCUMENT TYPE MATRIX -->

      <section class="card">

        <h2>
          Central Document Type Matrix
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
                  Document
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Vendor
                </th>

                <th>
                  Driver
                </th>

                <th>
                  Vehicle
                </th>

                <th>
                  Requirement
                </th>

              </tr>

            </thead>

            <tbody>

              ${documentTypeRows}

            </tbody>

          </table>

        </div>

      </section>


      <!-- KYC -->

      <section class="card">

        <h2>
          Central KYC Control
        </h2>

        <div class="grid four">

          <div>

            <b>
              CUSTOMER
            </b>

            <div class="muted">

              ${
                config.kyc.customerKYCRequired
                  ? "KYC REQUIRED"
                  : "OPTIONAL"
              }

            </div>

          </div>


          <div>

            <b>
              VENDOR
            </b>

            <div class="muted">

              ${
                config.kyc.vendorKYCRequired
                  ? "KYC REQUIRED"
                  : "OPTIONAL"
              }

            </div>

          </div>


          <div>

            <b>
              DRIVER
            </b>

            <div class="muted">

              ${
                config.kyc.driverKYCRequired
                  ? "KYC REQUIRED"
                  : "OPTIONAL"
              }

            </div>

          </div>


          <div>

            <b>
              VEHICLE
            </b>

            <div class="muted">

              ${
                config.kyc.vehicleKYCRequired
                  ? "KYC REQUIRED"
                  : "OPTIONAL"
              }

            </div>

          </div>

        </div>

      </section>


      <!-- WORKFLOW -->

      <section class="card">

        <h2>
          Central KYC Workflow
        </h2>

        <div class="notice">

          Registration

          →

          KYC Profile

          →

          Required Documents

          →

          Upload

          →

          Validation

          →

          Compression / Resize

          →

          Document Records

          →

          KYC Progress

          →

          Submission Package

          →

          Backend

          →

          Admin Review

          →

          Backend Verification

          →

          Backend Final Decision

          →

          Approved / Rejected

          →

          Resubmission / Replacement

          →

          Renewal / Expiry

        </div>

      </section>


      <!-- VEHICLE WORKFLOW -->

      <section class="card">

        <h2>
          Vehicle Operational Document Workflow
        </h2>

        <div class="notice">

          Vehicle Registration

          +

          Insurance

          +

          Fitness

          +

          Permit

          +

          Pollution Certificate

          →

          Central KYC Engine

          →

          Document Validation

          →

          Expiry Tracking

          →

          Backend Verification

          →

          Vehicle Activation / Assignment

        </div>

        <div
          class="muted"
          style="margin-top:12px;"
        >

          Expired required vehicle documents can
          create an operational block, but final
          enforcement remains Backend authoritative.

        </div>

      </section>


      <!-- SECURITY -->

      <section class="card">

        <h2>
          Security & Access
        </h2>

        <div class="grid three">

          <div>

            <b>
              Public Documents
            </b>

            <div class="muted">
              BLOCKED
            </div>

          </div>


          <div>

            <b>
              Permanent Delete
            </b>

            <div class="muted">
              BLOCKED
            </div>

          </div>


          <div>

            <b>
              Automatic Approval
            </b>

            <div class="muted">
              BLOCKED
            </div>

          </div>


          <div>

            <b>
              Automatic Verification
            </b>

            <div class="muted">
              BLOCKED
            </div>

          </div>


          <div>

            <b>
              Cross-role Access
            </b>

            <div class="muted">
              ADMIN CONTROLLED
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


      <!-- EXPIRY -->

      <section class="card">

        <h2>
          Expiry & Renewal
        </h2>

        <div class="grid three">

          <div>

            <b>
              ${
                config.expiry.primaryAlertDays
              } Days
            </b>

            <div class="muted">
              Primary Alert
            </div>

          </div>


          <div>

            <b>
              ${
                config.expiry.secondAlertDays
              } Days
            </b>

            <div class="muted">
              Second Alert
            </div>

          </div>


          <div>

            <b>
              ENABLED
            </b>

            <div class="muted">
              Expiry Tracking
            </div>

          </div>

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

                26F configuration is valid.

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
                          error
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
                style="margin-top:10px;"
              >

                ${
                  validation.warnings
                    .map(
                      function (
                        warning
                      ) {

                        return (
                          "• " +
                          warning
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
            data-26f-action="save"
          >
            Save
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

    const input =
      document.getElementById(
        "govara26f-file-input"
      );


    const resultsBox =
      document.getElementById(
        "govara26f-upload-results"
      );


    if (input) {

      input.addEventListener(

        "change",

        async function () {

          if (!resultsBox) {
            return;
          }


          resultsBox.innerHTML =

            `<div class="notice">
              Processing selected documents...
            </div>`;


          const results =
            await processFiles(
              input.files
            );


          resultsBox.innerHTML =

            results
              .map(
                function (
                  result
                ) {

                  if (
                    !result.success
                  ) {

                    return `

                      <div
                        class="notice danger"
                        style="
                          margin-top:8px;
                        "
                      >

                        ❌

                        ${
                          result.validation &&
                          result.validation.errors

                            ? result.validation.errors.join(
                                " "
                              )

                            : "File processing failed."
                        }

                      </div>

                    `;
                  }


                  return `

                    <div
                      class="notice"
                      style="
                        margin-top:8px;
                      "
                    >

                      <b>

                        ${
                          result.originalFile
                            ? result.originalFile.name
                            : "Document"
                        }

                      </b>

                      <br>

                      Type:
                      ${
                        result.type
                      }

                      <br>

                      Original:
                      ${
                        result.originalSizeFormatted
                      }

                      <br>

                      Processed:
                      ${
                        result.processedSizeFormatted
                      }

                      ${
                        result.reductionPercent !==
                        undefined

                          ? `
                            <br>
                            Reduction:
                            ${
                              result.reductionPercent.toFixed(
                                1
                              )
                            }%
                          `

                          : ""
                      }

                      ${
                        result.originalDimensions

                          ? `
                            <br>
                            Dimensions:
                            ${
                              result.originalDimensions.width
                            }
                            ×
                            ${
                              result.originalDimensions.height
                            }

                            →

                            ${
                              result.processedDimensions.width
                            }
                            ×
                            ${
                              result.processedDimensions.height
                            }
                          `

                          : ""
                      }

                      <br>

                      <b>
                        READY FOR DOCUMENT RECORD
                      </b>

                      <br>

                      KYC submission:
                      BACKEND-READY

                      <br>

                      Final verification:
                      BACKEND AUTHORITY

                    </div>

                  `;
                }
              )
              .join("");

        }

      );
    }


    document
      .querySelectorAll(
        "[data-26f-role]"
      )
      .forEach(
        function (
          checkbox
        ) {

          checkbox.addEventListener(

            "change",

            function () {

              const role =
                checkbox.getAttribute(
                  "data-26f-role"
                );


              const permission =
                checkbox.getAttribute(
                  "data-26f-permission"
                );


              if (
                role === "Backend"
              ) {

                checkbox.checked =
                  true;

                return;
              }


              try {

                setRolePermission(

                  role,

                  permission,

                  checkbox.checked

                );

              } catch (
                error
              ) {

                console.error(
                  "26F permission update failed:",
                  error
                );

                checkbox.checked =
                  !checkbox.checked;
              }

            }

          );
        }
      );


    document
      .querySelectorAll(
        "[data-26f-action]"
      )
      .forEach(
        function (
          button
        ) {

          button.addEventListener(

            "click",

            function () {

              const action =
                button.getAttribute(
                  "data-26f-action"
                );


              if (
                action === "save"
              ) {

                save();

                alert(
                  "26F configuration saved."
                );

                render();

                return;
              }


              if (
                action === "reload"
              ) {

                render();

                return;
              }


              if (
                action === "validate"
              ) {

                const result =
                  validate();


                alert(

                  result.valid

                    ? "26F configuration is valid."

                    : result.errors.join(
                        "\n"
                      )

                );

                return;
              }


              if (
                action === "reset"
              ) {

                reset();

                alert(
                  "26F configuration reset."
                );

                render();

              }

            }

          );
        }
      );
  }


  /* ============================================================
     PUBLIC CONFIG API
     ============================================================ */

  function getConfig() {

    return enforceSafety(
      loadConfig()
    );
  }


  function getStatus() {

    const config =
      getConfig();

    const validation =
      validateConfig(
        config
      );


    return {

      version:
        VERSION,

      environment:
        config.environment.mode,

      valid:
        validation.valid,

      errors:
        validation.errors,

      warnings:
        validation.warnings,

      uploadEnabled:
        config.upload.enabled,

      imageCompression:
        config.imageProcessing
          .compressionEnabled,

      imageResize:
        config.imageProcessing
          .resizeEnabled,

      maxFileSizeMB:
        config.upload.maxFileSizeMB,

      adminDocumentManagement:
        config.adminPermissions
          .documentManagement,

      adminReview:
        config.adminPermissions
          .documentReview,

      adminVerification:
        config.adminPermissions
          .documentVerificationInitiation,

      backendAuthority:
        config.authority.backendAuthority,

      frontendAuthority:
        config.authority.frontendAuthority,

      centralKYC:
        true,

      customerKYC:
        config.kyc.customerKYCRequired,

      vendorKYC:
        config.kyc.vendorKYCRequired,

      driverKYC:
        config.kyc.driverKYCRequired,

      vehicleKYC:
        config.kyc.vehicleKYCRequired

    };
  }


  function save(
    config
  ) {

    config =
      enforceSafety(
        config || loadConfig()
      );


    const validation =
      validateConfig(
        config
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
      config
    );


    addAudit(
      "CONFIG_SAVED",
      {
        version:
          VERSION
      }
    );


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


    addAudit(
      "CONFIG_RESET",
      {
        version:
          VERSION
      }
    );


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
      String(path).split(
        "."
      );


    if (
      !parts.length ||
      !parts[0]
    ) {

      throw new Error(
        "Policy path is required."
      );
    }


    let target =
      config;


    for (
      let i = 0;
      i <
      parts.length - 1;
      i++
    ) {

      if (
        !target[parts[i]] ||
        typeof target[parts[i]] !==
          "object"
      ) {

        target[parts[i]] =
          {};
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


    const validation =
      validateConfig(
        config
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
      config
    );


    addAudit(
      "POLICY_UPDATED",
      {

        path:
          path,

        value:
          value

      }
    );


    return config;
  }


  function getAudit() {

    try {

      return JSON.parse(

        localStorage.getItem(
          AUDIT_KEY
        ) || "[]"

      );

    } catch (
      error
    ) {

      return [];
    }
  }


  /* ============================================================
     INITIALIZATION
     ============================================================ */

  function renderAndBind() {

    render();
  }


  document.addEventListener(

    "DOMContentLoaded",

    function () {

      try {

        const mount =
          document.getElementById(
            "module-26F"
          );


        if (mount) {

          renderAndBind();

        }

      } catch (
        error
      ) {

        console.error(

          "GoVara 26F initialization error:",

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

    AUDIT_KEY:
      AUDIT_KEY,


    /* --------------------------------------------------------
       UI
       -------------------------------------------------------- */

    render:
      render,

    bind:
      bind,

    renderAndBind:
      renderAndBind,


    /* --------------------------------------------------------
       CONFIG
       -------------------------------------------------------- */

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
      validate,

    setPolicy:
      setPolicy,

    getAudit:
      getAudit,

    enforceSafety:
      enforceSafety,


    /* --------------------------------------------------------
       ROLE / PERMISSION
       -------------------------------------------------------- */

    hasPermission:
      hasPermission,

    getRolePermissions:
      getRolePermissions,

    setRolePermission:
      setRolePermission,

    isDocumentAllowedForRole:
      isDocumentAllowedForRole,


    /* --------------------------------------------------------
       FILE ENGINE
       -------------------------------------------------------- */

    validateFile:
      validateFile,

    processFile:
      processFile,

    processFiles:
      processFiles,

    compressImage:
      compressImage,

    createDocumentRecord:
      createDocumentRecord,

    adminAction:
      adminAction,

    formatFileSize:
      formatFileSize,


    /* --------------------------------------------------------
       CENTRAL KYC ENGINE
       -------------------------------------------------------- */

    KYC_ROLE_MAP:
      clone(
        KYC_ROLE_MAP
      ),

    KYC_STATUS:
      clone(
        KYC_STATUS
      ),

    DOCUMENT_STATUS:
      clone(
        DOCUMENT_STATUS
      ),

    normalizeKYCType:
      normalizeKYCType,

    isKYCRequiredForRole:
      isKYCRequiredForRole,

    getKYCProfile:
      getKYCProfile,

    getDocumentTypesForRole:
      getDocumentTypesForRole,

    getRequiredDocuments:
      getRequiredDocuments,

    getOptionalDocuments:
      getOptionalDocuments,

    getRequiredDocumentKeys:
      getRequiredDocumentKeys,

    getKYCProgress:
      getKYCProgress,

    calculateKYCStatus:
      calculateKYCStatus,

    createKYCApplication:
      createKYCApplication,

    attachKYCDocuments:
      attachKYCDocuments,

    canSubmitKYC:
      canSubmitKYC,

    submitKYC:
      submitKYC,

    getKYCStatus:
      getKYCStatus,

    requestResubmission:
      requestResubmission,

    createReplacement:
      createReplacement,

    checkDocumentExpiry:
      checkDocumentExpiry,

    checkDocumentExpiries:
      checkDocumentExpiries,

    checkKYCExpiry:
      checkKYCExpiry,

    canRoleManageKYC:
      canRoleManageKYC,

    createSubmissionQueueItem:
      createSubmissionQueueItem,

    getVehicleDocumentProfile:
      getVehicleDocumentProfile,

    getCentralKYCStatus:
      getCentralKYCStatus

  };

})();
