/* ============================================================
   GoVara — 26F DOCUMENTS & KYC ADMIN CONTROL CENTER
   VERSION: GOVARA-26F-V4

   Scope:
   - Documents
   - KYC
   - Admin document management
   - Role permissions
   - Document permissions
   - Upload / Preview / Compression / Resize
   - Verification workflow
   - Replacement
   - Expiry / Renewal
   - Audit
   - Security

   Architecture:
   Frontend = Control UI / Local configuration / File preprocessing
   Backend  = Authoritative business + verification authority
   Database = Authoritative persistent document/KYC store

   IMPORTANT:
   Frontend approval actions are administrative workflow controls.
   Final authoritative verification remains Backend controlled.
   ============================================================ */

window.GoVara26F = (function () {

  "use strict";

  const VERSION = "GOVARA-26F-V4";

  const STORAGE_KEY =
    "GOVARA_DOCUMENTS_KYC_ADMIN_CONTROL_26F_V4";

  const AUDIT_KEY =
    "GOVARA_DOCUMENTS_KYC_ADMIN_AUDIT_26F_V4";


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

    if (
      !DEFAULT_CONFIG.audit.enabled
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

        module: "26F",

        version: VERSION,

        action: action,

        details:
          details || {}
      });

      localStorage.setItem(

        AUDIT_KEY,

        JSON.stringify(
          history.slice(
            0,
            DEFAULT_CONFIG.audit.maxEntries
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
      config.expiry.primaryAlertDays <
      config.expiry.secondAlertDays
    ) {

      warnings.push(
        "Primary expiry alert is normally expected to be earlier than the second alert."
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

    config.rolePermissions[role][
      permission
    ] = Boolean(value);

    enforceSafety(config);

    saveConfig(config);

    addAudit(
      "ROLE_PERMISSION_UPDATED",
      {
        role: role,
        permission: permission,
        value: Boolean(value)
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

      Customer: "customer",

      Vendor: "vendor",

      Driver: "driver",

      Vehicle: "vehicle"
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

    if (bytes < 1024) {

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

      file.type &&

      file.type.indexOf(
        "image/"
      ) === 0

    );
  }


  function isPDFFile(
    file
  ) {

    return Boolean(

      file &&

      file.type ===
        "application/pdf"

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

        valid: false,

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


    if (
      config.upload.mimeValidation &&
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


    const image =
      await loadImage(
        file
      );


    const dimensions =
      calculateDimensions(

        image.naturalWidth,

        image.naturalHeight,

        config.imageProcessing.maxWidth,

        config.imageProcessing.maxHeight

      );


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

      quality -= 0.05;

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
      !config.imageProcessing.doNotCompressSmallImages ||
      blob.size < file.size;


    if (shouldReplace) {

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
            )
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


    const file =
      processed.processedFile;


    return {

      localId:

        "DOC-" +

        Date.now() +

        "-" +

        Math.random()
          .toString(36)
          .slice(2, 8),


      ownerType:
        ownerType || "",


      ownerId:
        ownerId || "",


      documentType:
        documentType ||
        "otherDocument",


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


      verificationStatus:
        "PENDING_BACKEND_VERIFICATION",


      uploadedAt:
        new Date().toISOString(),


      expiryDate:
        null,


      replacementOf:
        null,


      rejectionReason:
        "",


      approvalComment:
        "",


      backendAuthoritative:
        true,


      frontendCanApprove:
        false,


      frontendCanVerify:
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
        function (role) {

          return `

            <tr>

              <td>
                <b>
                  ${role}
                </b>
              </td>

              ${permissionNames
                .map(
                  function (permission) {

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
        function (key) {

          const type =
            config.documentTypes[key];


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


    mount.innerHTML = `

      <div class="page-head">

        <h1>
          26F — Documents & KYC
          Administrator Control Center
        </h1>

        <div class="muted">

          Complete document upload,
          KYC management,
          administrator permissions,
          verification workflow,
          image processing,
          expiry and audit control.

        </div>

      </div>


      <!-- STATUS -->

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
          record approval/rejection decisions,
          request resubmission,
          manage replacement and expiry.

          <br><br>

          Final authoritative verification and
          KYC authority remain Backend controlled.

        </div>

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

              Target size:
              ${
                config.imageProcessing.targetMaxSizeMB
              }
              MB

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
                    function (permission) {

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

        <div class="muted"
             style="margin-top:12px;">

          Backend permissions are locked.
          Permanent deletion remains disabled
          for frontend administration.

        </div>

      </section>


      <!-- DOCUMENT TYPE MATRIX -->

      <section class="card">

        <h2>
          Document Type Matrix
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
          KYC Control
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
          Administrator KYC Workflow
        </h2>

        <div class="notice">

          Registration

          →
          
          Document Upload

          →

          Submission

          →

          Admin Review

          →

          Verification

          →

          Administrative Decision

          →

          Backend Final Authority

          →

          Approved / Rejected

          →

          Resubmission if required

          →

          Renewal / Replacement on expiry

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
                      function (error) {

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

              <div class="notice warn"
                   style="margin-top:10px;">

                ${
                  validation.warnings
                    .map(
                      function (warning) {

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
                function (result) {

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
                        READY FOR ADMIN SUBMISSION
                      </b>

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
        function (checkbox) {

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

              } catch (error) {

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
        function (button) {

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
        config.imageProcessing.compressionEnabled,

      imageResize:
        config.imageProcessing.resizeEnabled,

      maxFileSizeMB:
        config.upload.maxFileSizeMB,

      adminDocumentManagement:
        config.adminPermissions.documentManagement,

      adminReview:
        config.adminPermissions.documentReview,

      adminVerification:
        config.adminPermissions.documentVerificationInitiation,

      backendAuthority:
        config.authority.backendAuthority,

      frontendAuthority:
        config.authority.frontendAuthority
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

    } catch (error) {

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

      } catch (error) {

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
      validate,

    setPolicy:
      setPolicy,

    getAudit:
      getAudit,

    enforceSafety:
      enforceSafety,

    hasPermission:
      hasPermission,

    getRolePermissions:
      getRolePermissions,

    setRolePermission:
      setRolePermission,

    isDocumentAllowedForRole:
      isDocumentAllowedForRole,

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
      formatFileSize
  };

})();
