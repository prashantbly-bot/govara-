/* ============================================================
   GoVara — 26F Documents & KYC Control
   VERSION: GOVARA-26F-V3
   Frontend Configuration + Upload Processing Layer
   ============================================================ */

window.GoVara26F = (function () {

  "use strict";

  const VERSION = "GOVARA-26F-V3";
  const STORAGE_KEY = "GOVARA_DOCUMENTS_KYC_CONTROL_26F_V3";
  const AUDIT_KEY = "GOVARA_DOCUMENTS_KYC_AUDIT_26F_V3";

  const DEFAULT_CONFIG = {

    environment: {
      mode: "TESTING",
      frontendOnly: true,
      backendRequired: true,
      databaseRequired: true
    },

    authority: {
      frontendAuthority: false,
      backendAuthority: true,
      databaseAuthority: true,
      frontendCanApproveKYC: false,
      frontendCanVerifyDocument: false,
      frontendCanRejectDocument: false,
      automaticApproval: false,
      automaticVerification: false
    },

    documentSystem: {
      enabled: true,

      uploadEnabled: true,
      imageUploadEnabled: true,
      pdfUploadEnabled: true,

      viewEnabled: true,
      updateEnabled: true,
      replacementEnabled: true,
      historyEnabled: true,

      expiryTrackingEnabled: true,
      expiryAlertsEnabled: true,

      publicDocumentAccess: false,
      publicDocumentListing: false,

      permanentDeletionEnabled: false,

      backendDocumentAuthority: true
    },

    upload: {

      enabled: true,

      allowImages: true,
      allowPDF: true,

      multipleUpload: true,

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

      maxFileSizeMB: 10,
      minFileSizeKB: 1,

      filenameValidation: true,
      extensionValidation: true,
      mimeValidation: true,

      emptyFileBlocked: true,
      corruptFileBlocked: true,
      duplicateFileCheck: true,

      uploadProgressEnabled: true,

      previewEnabled: true,

      backendFinalValidationRequired: true
    },

    imageProcessing: {

      enabled: true,

      compressionEnabled: true,
      resizeEnabled: true,

      previewBeforeUpload: true,

      preserveAspectRatio: true,

      maxWidth: 2000,
      maxHeight: 2000,

      targetQuality: 0.82,

      targetMaxSizeMB: 2,

      minQuality: 0.55,

      outputFormat: "image/jpeg",

      autoReduceLargeImages: true,

      doNotCompressSmallImages: true,

      originalFileNeverReplacesAuditHistory: true,

      browserProcessingOnly: true,

      backendFinalProcessingAuthority: true
    },

    pdfProcessing: {

      enabled: true,

      allowPDF: true,

      maxFileSizeMB: 10,

      compressionRequested: true,

      browserPDFCompression: false,

      backendPDFProcessingAuthority: true
    },

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

    kyc: {

      enabled: true,

      customerKYCRequired: true,
      vendorKYCRequired: true,
      driverKYCRequired: true,
      vehicleKYCRequired: true,

      manualReview: true,

      automaticApproval: false,
      automaticVerification: false,

      reVerificationEnabled: true,

      pendingBlocksActivation: true,
      rejectedBlocksActivation: true,
      expiredBlocksActivation: true,

      backendApprovalRequired: true,
      backendAuthority: true
    },

    customerKYC: {

      registrationRequirement: true,
      bookingRequirement: false,
      preTripRequirement: false,
      walletRequirement: false,
      refundRequirement: false,

      profileCompletionRequired: true,

      documentUpdateAllowed: true,
      manualReviewRequired: true,

      backendApprovalRequired: true
    },

    vendorKYC: {

      registrationRequirement: true,
      operationsRequirement: true,
      bookingManagementRequirement: true,

      driverAssignmentRequirement: true,
      vehicleAssignmentRequirement: true,

      documentUpdateAllowed: true,
      manualReviewRequired: true,

      backendApprovalRequired: true
    },

    driverKYC: {

      registrationRequirement: true,
      dutyRequirement: true,
      tripRequirement: true,
      bookingAcceptanceRequirement: true,

      documentUpdateAllowed: true,
      manualReviewRequired: true,

      expiredLicenseBlocksDuty: true,

      backendApprovalRequired: true
    },

    vehicleDocuments: {

      activationRequirement: true,
      assignmentRequirement: true,
      tripRequirement: true,

      registrationRequired: true,
      insuranceRequired: true,
      fitnessRequired: true,
      permitRequired: true,
      pollutionCertificateRequired: true,

      documentUpdateAllowed: true,
      manualReviewRequired: true,

      expiredDocumentBlocksVehicle: true,

      backendApprovalRequired: true
    },

    documentStatus: {

      pending: true,
      submitted: true,
      underReview: true,

      approved: true,
      rejected: true,

      expired: true,
      replaced: true,
      suspended: true,

      deleted: false
    },

    verification: {

      enabled: true,

      manualVerification: true,
      automaticVerification: false,

      backendVerificationRequired: true,

      verificationTimestamp: true,
      verifierIdentity: true,

      rejectionReason: true,
      approvalComment: true,
      rejectionComment: true,

      reVerification: true,
      verificationHistory: true,

      frontendApproval: false,
      frontendRejection: false,
      frontendVerification: false
    },

    expiry: {

      enabled: true,

      expiryDateRequired: true,
      trackingEnabled: true,
      alertsEnabled: true,

      primaryAlertDays: 30,
      secondAlertDays: 7,

      expiredStatusEnabled: true,

      operationalBlockOnExpiry: true,

      backendExpiryAuthority: true
    },

    replacement: {

      enabled: true,

      replacementAllowed: true,

      newDocumentReviewRequired: true,

      oldDocumentHistoryRequired: true,

      oldDocumentPermanentDeletion: false,

      backendApprovalRequired: true,

      backendAuthority: true
    },

    accessControl: {

      customerOwnDocumentView: true,
      customerOwnDocumentUpload: true,
      customerOwnDocumentReplace: true,

      vendorOwnDocumentView: true,
      vendorOwnDocumentUpload: true,
      vendorOwnDocumentReplace: true,

      driverOwnDocumentView: true,
      driverOwnDocumentUpload: true,
      driverOwnDocumentReplace: true,

      adminDocumentView: true,
      adminConfiguration: true,
      adminReview: true,

      frontendVerificationModification: false
    },

    privacySecurity: {

      sensitiveDocumentProtection: true,

      accessControlEnabled: true,

      ownerOnlyAccess: true,

      adminControlledAccess: true,

      unauthorizedAccessBlocked: true,

      publicURL: false,
      publicListing: false,

      uploadAudit: true,
      viewAudit: true,
      downloadAudit: true,
      replacementAudit: true,
      deleteAudit: true,
      verificationAudit: true
    },

    fileValidation: {

      enabled: true,

      allowedImageTypes: [
        "image/jpeg",
        "image/png",
        "image/webp"
      ],

      allowedDocumentTypes: [
        "application/pdf"
      ],

      maxImageSizeMB: 10,
      maxPDFSizeMB: 10,

      minFileSizeKB: 1,

      filenameValidation: true,
      extensionValidation: true,
      mimeValidation: true,

      emptyFileBlocked: true,
      corruptFileBlocked: true,

      duplicateCheck: true,

      backendValidationRequired: true
    },

    qualityControl: {

      enabled: true,

      imageQualityCheck: true,
      readabilityCheck: true,

      blurCheck: true,
      completenessCheck: true,

      tamperCheck: true,
      mismatchCheck: true,

      failedQualityRequiresResubmission: true,

      backendQualityAuthority: true
    },

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

    notifications: {

      uploadNotification: true,
      reviewNotification: true,

      approvalNotification: true,
      rejectionNotification: true,

      resubmissionNotification: true,

      expiryNotification: true,
      renewalNotification: true,

      replacementNotification: true,

      operationalBlockNotification: true,

      backendNotificationAuthority: true
    },

    operationalBlocks: {

      pendingKYCBlock: true,
      rejectedKYCBlock: true,
      expiredKYCBlock: true,

      missingDocumentBlock: true,
      failedVerificationBlock: true,
      failedQualityBlock: true,

      vendorOperationBlock: true,
      driverDutyBlock: true,
      vehicleOperationBlock: true,
      tripBlock: true,

      backendAuthority: true
    },

    audit: {

      enabled: true,

      localHistory: true,

      maxEntries: 200
    }
  };


  /* ==========================================================
     Utility
     ========================================================== */

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function deepMerge(base, incoming) {

    if (!incoming || typeof incoming !== "object") {
      return clone(base);
    }

    const output = clone(base);

    Object.keys(incoming).forEach(function (key) {

      if (
        incoming[key] &&
        typeof incoming[key] === "object" &&
        !Array.isArray(incoming[key]) &&
        output[key] &&
        typeof output[key] === "object" &&
        !Array.isArray(output[key])
      ) {
        output[key] = deepMerge(output[key], incoming[key]);
      } else {
        output[key] = incoming[key];
      }

    });

    return output;
  }

  function loadConfig() {

    try {

      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return clone(DEFAULT_CONFIG);
      }

      return deepMerge(
        DEFAULT_CONFIG,
        JSON.parse(raw)
      );

    } catch (error) {

      console.warn(
        "GoVara 26F: configuration load failed.",
        error
      );

      return clone(DEFAULT_CONFIG);
    }
  }

  function saveConfig(config) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(config)
    );
  }

  function addAudit(action, details) {

    try {

      const existing =
        JSON.parse(
          localStorage.getItem(AUDIT_KEY) || "[]"
        );

      existing.unshift({

        timestamp: new Date().toISOString(),

        action: action,

        details: details || {},

        module: "26F",

        version: VERSION
      });

      const limited =
        existing.slice(
          0,
          DEFAULT_CONFIG.audit.maxEntries
        );

      localStorage.setItem(
        AUDIT_KEY,
        JSON.stringify(limited)
      );

    } catch (error) {

      console.warn(
        "GoVara 26F audit error:",
        error
      );
    }
  }


  /* ==========================================================
     Safety Enforcement
     ========================================================== */

  function enforceSafety(config) {

    config = config || loadConfig();

    config.environment.mode = "TESTING";

    config.environment.frontendOnly = true;
    config.environment.backendRequired = true;
    config.environment.databaseRequired = true;

    config.authority.frontendAuthority = false;
    config.authority.backendAuthority = true;
    config.authority.databaseAuthority = true;

    config.authority.frontendCanApproveKYC = false;
    config.authority.frontendCanVerifyDocument = false;
    config.authority.frontendCanRejectDocument = false;

    config.authority.automaticApproval = false;
    config.authority.automaticVerification = false;

    config.documentSystem.publicDocumentAccess = false;
    config.documentSystem.publicDocumentListing = false;
    config.documentSystem.permanentDeletionEnabled = false;

    config.verification.automaticVerification = false;
    config.verification.frontendApproval = false;
    config.verification.frontendRejection = false;
    config.verification.frontendVerification = false;

    config.replacement.oldDocumentPermanentDeletion = false;

    config.accessControl.frontendVerificationModification = false;

    config.privacySecurity.publicURL = false;
    config.privacySecurity.publicListing = false;

    config.retention.frontendPermanentDeletion = false;

    config.workflow.backendWorkflowAuthority = true;

    return config;
  }


  /* ==========================================================
     Validation
     ========================================================== */

  function validateConfig(config) {

    config = enforceSafety(
      config || loadConfig()
    );

    const errors = [];
    const warnings = [];

    if (!config.environment.frontendOnly) {
      errors.push(
        "26F must remain frontend-only."
      );
    }

    if (!config.authority.backendAuthority) {
      errors.push(
        "Backend authority must remain enabled."
      );
    }

    if (!config.authority.databaseAuthority) {
      errors.push(
        "Database authority must remain enabled."
      );
    }

    if (config.authority.frontendCanApproveKYC) {
      errors.push(
        "Frontend KYC approval must remain disabled."
      );
    }

    if (config.authority.frontendCanVerifyDocument) {
      errors.push(
        "Frontend document verification must remain disabled."
      );
    }

    if (config.authority.automaticApproval) {
      errors.push(
        "Automatic KYC approval is not allowed."
      );
    }

    if (config.authority.automaticVerification) {
      errors.push(
        "Automatic document verification is not allowed."
      );
    }

    if (config.documentSystem.publicDocumentAccess) {
      errors.push(
        "Public document access must remain disabled."
      );
    }

    if (config.documentSystem.publicDocumentListing) {
      errors.push(
        "Public document listing must remain disabled."
      );
    }

    if (config.documentSystem.permanentDeletionEnabled) {
      errors.push(
        "Permanent document deletion must remain disabled."
      );
    }

    if (!config.upload.enabled) {
      warnings.push(
        "Document upload is disabled."
      );
    }

    if (
      config.upload.maxFileSizeMB <= 0
    ) {
      errors.push(
        "Maximum upload file size must be greater than zero."
      );
    }

    if (
      config.upload.minFileSizeKB < 0
    ) {
      errors.push(
        "Minimum upload file size cannot be negative."
      );
    }

    if (
      config.imageProcessing.maxWidth <= 0 ||
      config.imageProcessing.maxHeight <= 0
    ) {
      errors.push(
        "Image maximum dimensions must be greater than zero."
      );
    }

    if (
      config.imageProcessing.targetQuality <= 0 ||
      config.imageProcessing.targetQuality > 1
    ) {
      errors.push(
        "Image target quality must be between 0 and 1."
      );
    }

    if (
      config.imageProcessing.minQuality <= 0 ||
      config.imageProcessing.minQuality > 1
    ) {
      errors.push(
        "Image minimum quality must be between 0 and 1."
      );
    }

    if (
      config.imageProcessing.minQuality >
      config.imageProcessing.targetQuality
    ) {
      errors.push(
        "Minimum image quality cannot exceed target quality."
      );
    }

    if (
      config.imageProcessing.targetMaxSizeMB <= 0
    ) {
      errors.push(
        "Image target maximum size must be greater than zero."
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
        "Primary expiry alert should normally be earlier than the second alert."
      );
    }

    if (
      config.kyc.driverKYCRequired === true &&
      !config.documentTypes.drivingLicense
    ) {
      errors.push(
        "Driving License document type is required."
      );
    }

    if (
      config.kyc.vehicleKYCRequired === true &&
      !config.documentTypes.vehicleRegistration
    ) {
      errors.push(
        "Vehicle Registration document type is required."
      );
    }

    if (
      config.vehicleDocuments.insuranceRequired &&
      !config.documentTypes.vehicleInsurance
    ) {
      errors.push(
        "Vehicle Insurance document type is required."
      );
    }

    if (
      config.vehicleDocuments.fitnessRequired &&
      !config.documentTypes.vehicleFitness
    ) {
      errors.push(
        "Vehicle Fitness document type is required."
      );
    }

    if (
      config.vehicleDocuments.permitRequired &&
      !config.documentTypes.vehiclePermit
    ) {
      errors.push(
        "Vehicle Permit document type is required."
      );
    }

    if (
      config.vehicleDocuments.pollutionCertificateRequired &&
      !config.documentTypes.pollutionCertificate
    ) {
      errors.push(
        "Pollution Certificate document type is required."
      );
    }

    return {

      valid: errors.length === 0,

      errors: errors,

      warnings: warnings,

      checkedAt: new Date().toISOString(),

      version: VERSION
    };
  }


  /* ==========================================================
     File Helpers
     ========================================================== */

  function bytesToMB(bytes) {
    return bytes / (1024 * 1024);
  }

  function bytesToKB(bytes) {
    return bytes / 1024;
  }

  function formatFileSize(bytes) {

    if (!Number.isFinite(bytes)) {
      return "0 B";
    }

    if (bytes < 1024) {
      return bytes + " B";
    }

    if (bytes < 1024 * 1024) {
      return (
        (bytes / 1024).toFixed(1) +
        " KB"
      );
    }

    return (
      (bytes / (1024 * 1024)).toFixed(2) +
      " MB"
    );
  }

  function extensionOf(name) {

    if (!name || name.indexOf(".") === -1) {
      return "";
    }

    return (
      "." +
      name
        .split(".")
        .pop()
        .toLowerCase()
    );
  }


  /* ==========================================================
     File Validation
     ========================================================== */

  function validateFile(file) {

    const config = loadConfig();

    const errors = [];

    if (!file) {

      return {
        valid: false,
        errors: ["No file selected."]
      };
    }

    if (
      config.upload.emptyFileBlocked &&
      file.size <= 0
    ) {
      errors.push(
        "Empty files are not allowed."
      );
    }

    const maxBytes =
      file.type === "application/pdf"
        ? config.fileValidation.maxPDFSizeMB *
          1024 *
          1024
        : config.fileValidation.maxImageSizeMB *
          1024 *
          1024;

    if (file.size > maxBytes) {

      errors.push(
        "File exceeds the maximum allowed size of " +
        maxBytes / (1024 * 1024) +
        " MB."
      );
    }

    if (
      file.size <
      config.fileValidation.minFileSizeKB *
      1024
    ) {
      errors.push(
        "File is smaller than the minimum allowed size."
      );
    }

    const allowedMime =
      config.upload.allowedMimeTypes
        .map(function (x) {
          return x.toLowerCase();
        });

    if (
      config.fileValidation.mimeValidation &&
      allowedMime.indexOf(
        String(file.type || "").toLowerCase()
      ) === -1
    ) {
      errors.push(
        "File MIME type is not allowed."
      );
    }

    const extension =
      extensionOf(file.name);

    if (
      config.fileValidation.extensionValidation &&
      config.upload.allowedExtensions.indexOf(
        extension
      ) === -1
    ) {
      errors.push(
        "File extension is not allowed."
      );
    }

    if (
      config.fileValidation.filenameValidation &&
      !/^[a-zA-Z0-9._ -]+$/.test(
        file.name
      )
    ) {
      errors.push(
        "Filename contains unsupported characters."
      );
    }

    return {

      valid: errors.length === 0,

      errors: errors,

      name: file.name,
      type: file.type,
      size: file.size,

      formattedSize:
        formatFileSize(file.size)
    };
  }


  /* ==========================================================
     Image Detection
     ========================================================== */

  function isImageFile(file) {

    return !!(
      file &&
      file.type &&
      file.type.indexOf("image/") === 0
    );
  }

  function isPDFFile(file) {

    return !!(
      file &&
      file.type === "application/pdf"
    );
  }


  /* ==========================================================
     Image Compression
     ========================================================== */

  function loadImage(file) {

    return new Promise(function (
      resolve,
      reject
    ) {

      const reader =
        new FileReader();

      reader.onload = function () {

        const image =
          new Image();

        image.onload = function () {
          resolve(image);
        };

        image.onerror = function () {
          reject(
            new Error(
              "Unable to read image."
            )
          );
        };

        image.src = reader.result;
      };

      reader.onerror = function () {

        reject(
          new Error(
            "Unable to read selected file."
          )
        );
      };

      reader.readAsDataURL(file);
    });
  }


  function calculateDimensions(
    width,
    height,
    maxWidth,
    maxHeight
  ) {

    let newWidth = width;
    let newHeight = height;

    const ratio =
      Math.min(
        maxWidth / width,
        maxHeight / height,
        1
      );

    newWidth =
      Math.round(
        width * ratio
      );

    newHeight =
      Math.round(
        height * ratio
      );

    return {

      width: newWidth,
      height: newHeight
    };
  }


  function canvasToBlob(
    canvas,
    type,
    quality
  ) {

    return new Promise(function (
      resolve,
      reject
    ) {

      canvas.toBlob(
        function (blob) {

          if (!blob) {

            reject(
              new Error(
                "Image compression failed."
              )
            );

            return;
          }

          resolve(blob);

        },
        type,
        quality
      );
    });
  }


  async function compressImage(
    file,
    options
  ) {

    const config =
      loadConfig();

    options =
      options || {};

    const validation =
      validateFile(file);

    if (!validation.valid) {

      throw new Error(
        validation.errors.join(" ")
      );
    }

    if (!isImageFile(file)) {

      return {

        originalFile: file,

        processedFile: file,

        compressed: false,

        resized: false,

        originalSize: file.size,

        processedSize: file.size,

        originalSizeFormatted:
          formatFileSize(file.size),

        processedSizeFormatted:
          formatFileSize(file.size),

        message:
          "Image compression was not required."
      };
    }

    if (
      !config.imageProcessing.enabled ||
      !config.imageProcessing.compressionEnabled
    ) {

      return {

        originalFile: file,

        processedFile: file,

        compressed: false,

        resized: false,

        originalSize: file.size,

        processedSize: file.size
      };
    }

    const image =
      await loadImage(file);

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
      canvas.getContext("2d");

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
      blob.size > targetBytes &&
      quality >
      config.imageProcessing.minQuality
    ) {

      quality -= 0.05;

      blob =
        await canvasToBlob(
          canvas,
          config.imageProcessing.outputFormat,
          quality
        );
    }

    const outputName =
      file.name.replace(
        /\.[^/.]+$/,
        ""
      ) + ".jpg";

    const processedFile =
      new File(
        [blob],
        outputName,
        {
          type:
            config.imageProcessing.outputFormat,
          lastModified:
            Date.now()
        }
      );

    const resized =
      dimensions.width !==
        image.naturalWidth ||
      dimensions.height !==
        image.naturalHeight;

    const compressed =
      processedFile.size <
      file.size;

    addAudit(
      "IMAGE_PROCESSED",
      {
        originalName: file.name,

        originalSize: file.size,

        processedSize:
          processedFile.size,

        originalDimensions: {
          width: image.naturalWidth,
          height: image.naturalHeight
        },

        processedDimensions: {
          width: dimensions.width,
          height: dimensions.height
        },

        quality: quality,

        compressed: compressed,

        resized: resized
      }
    );

    return {

      originalFile: file,

      processedFile: processedFile,

      compressed: compressed,

      resized: resized,

      originalSize: file.size,

      processedSize:
        processedFile.size,

      originalSizeFormatted:
        formatFileSize(file.size),

      processedSizeFormatted:
        formatFileSize(
          processedFile.size
        ),

      originalDimensions: {
        width: image.naturalWidth,
        height: image.naturalHeight
      },

      processedDimensions: {
        width: dimensions.width,
        height: dimensions.height
      },

      quality: quality,

      reductionBytes:
        Math.max(
          0,
          file.size -
          processedFile.size
        ),

      reductionPercent:
        file.size > 0
          ? Math.max(
              0,
              (
                1 -
                processedFile.size /
                  file.size
              ) * 100
            )
          : 0
    };
  }


  /* ==========================================================
     Document Processing
     ========================================================== */

  async function processFile(file) {

    const validation =
      validateFile(file);

    if (!validation.valid) {

      return {

        success: false,

        validation: validation,

        originalFile: file,

        processedFile: null
      };
    }

    try {

      if (isImageFile(file)) {

        const result =
          await compressImage(
            file
          );

        return {

          success: true,

          validation: validation,

          type: "IMAGE",

          ...result
        };
      }

      if (isPDFFile(file)) {

        addAudit(
          "PDF_SELECTED",
          {
            name: file.name,
            size: file.size
          }
        );

        return {

          success: true,

          validation: validation,

          type: "PDF",

          originalFile: file,

          processedFile: file,

          compressed: false,

          resized: false,

          originalSize: file.size,

          processedSize: file.size,

          originalSizeFormatted:
            formatFileSize(
              file.size
            ),

          processedSizeFormatted:
            formatFileSize(
              file.size
            ),

          message:
            "PDF accepted. Final PDF compression/validation remains backend-authoritative."
        };
      }

      return {

        success: false,

        validation: {

          valid: false,

          errors: [
            "Unsupported document type."
          ]
        }
      };

    } catch (error) {

      console.error(
        "GoVara 26F file processing error:",
        error
      );

      return {

        success: false,

        validation: {

          valid: false,

          errors: [
            error.message ||
            "File processing failed."
          ]
        }
      };
    }
  }


  /* ==========================================================
     Upload Queue
     ========================================================== */

  async function processFiles(
    files
  ) {

    const list =
      Array.from(files || []);

    const results = [];

    for (
      let i = 0;
      i < list.length;
      i++
    ) {

      const result =
        await processFile(
          list[i]
        );

      results.push(result);
    }

    return results;
  }


  /* ==========================================================
     Document Record Builder
     ========================================================== */

  function createDocumentRecord(
    processed,
    ownerType,
    ownerId,
    documentType
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
        documentType || "otherDocument",

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

      originalSizeFormatted:
        processed.originalSizeFormatted,

      processedSizeFormatted:
        processed.processedSizeFormatted,

      compressed:
        !!processed.compressed,

      resized:
        !!processed.resized,

      status:
        "pending",

      verificationStatus:
        "PENDING_BACKEND_VERIFICATION",

      uploadedAt:
        new Date().toISOString(),

      expiryDate:
        null,

      replacementOf:
        null,

      backendAuthoritative:
        true,

      frontendCanApprove:
        false,

      frontendCanVerify:
        false
    };
  }


  /* ==========================================================
     UI
     ========================================================== */

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

    mount.innerHTML = `

      <div class="page-head">

        <h1>
          26F — Documents & KYC Control
        </h1>

        <div class="muted">
          Document upload, image compression,
          KYC workflow, expiry and security control.
        </div>

      </div>


      <section class="card">

        <h2>26F Status</h2>

        <div class="grid four">

          <div>
            <b>${VERSION}</b>
            <div class="muted">
              Module Version
            </div>
          </div>

          <div>
            <b>TESTING</b>
            <div class="muted">
              Environment
            </div>
          </div>

          <div>
            <b>
              ${validation.valid
                ? "VALID"
                : "ERROR"}
            </b>
            <div class="muted">
              Configuration
            </div>
          </div>

          <div>
            <b>BACKEND</b>
            <div class="muted">
              Authority
            </div>
          </div>

        </div>

      </section>


      <section class="card">

        <h2>
          Document Upload
        </h2>

        <div class="grid two">

          <div>

            <label>
              Select Documents
            </label>

            <input
              id="govara26f-file-input"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
            />

            <div class="muted">
              JPG, JPEG, PNG, WebP and PDF.
              Maximum ${config.upload.maxFileSizeMB} MB
              before processing.
            </div>

          </div>


          <div>

            <b>
              Image Processing
            </b>

            <div class="muted">

              Images can be automatically resized
              and compressed before upload.

              Maximum dimensions:
              ${config.imageProcessing.maxWidth}
              ×
              ${config.imageProcessing.maxHeight}

              <br>

              Target image size:
              ${config.imageProcessing.targetMaxSizeMB}
              MB

            </div>

          </div>

        </div>


        <div
          id="govara26f-upload-results"
          class="govara26f-upload-results"
          style="margin-top:16px;"
        >
        </div>

      </section>


      <section class="card">

        <h2>
          KYC Authority
        </h2>

        <div class="notice warn">

          Frontend केवल document selection,
          validation, preview और image processing करेगा.

          <br><br>

          KYC approval, verification,
          rejection और final document authority
          Backend के पास रहेगी.

        </div>

      </section>


      <section class="card">

        <h2>
          File Controls
        </h2>

        <div class="grid three">

          <div>
            <b>
              ${config.upload.maxFileSizeMB} MB
            </b>
            <div class="muted">
              Max Upload Size
            </div>
          </div>

          <div>
            <b>
              ${config.imageProcessing.compressionEnabled
                ? "ON"
                : "OFF"}
            </b>
            <div class="muted">
              Image Compression
            </div>
          </div>

          <div>
            <b>
              ${config.imageProcessing.resizeEnabled
                ? "ON"
                : "OFF"}
            </b>
            <div class="muted">
              Image Resize
            </div>
          </div>

        </div>

      </section>


      <section class="card">

        <h2>
          Document Lifecycle
        </h2>

        <div class="notice">

          Upload →
          Validation →
          Image Processing →
          Submission →
          Backend Review →
          Approval / Rejection →
          Active / Resubmission →
          Expiry →
          Renewal / Replacement

        </div>

      </section>


      <section class="card">

        <h2>
          Security
        </h2>

        <div class="grid two">

          <div>

            <b>
              Public Access
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
              Automatic KYC Approval
            </b>

            <div class="muted">
              BLOCKED
            </div>

          </div>

          <div>

            <b>
              Frontend Verification
            </b>

            <div class="muted">
              BLOCKED
            </div>

          </div>

        </div>

      </section>


      <section class="card">

        <h2>
          Configuration
        </h2>

        ${
          validation.errors.length
            ? `
              <div class="notice danger">
                ${validation.errors
                  .map(function (x) {
                    return "• " + x;
                  })
                  .join("<br>")}
              </div>
            `
            : `
              <div class="notice success">
                26F configuration is valid.
              </div>
            `
        }

        ${
          validation.warnings.length
            ? `
              <div class="notice warn">
                ${validation.warnings
                  .map(function (x) {
                    return "• " + x;
                  })
                  .join("<br>")}
              </div>
            `
            : ""
        }

        <div style="margin-top:16px;">

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


  /* ==========================================================
     Bind
     ========================================================== */

  function bind() {

    const input =
      document.getElementById(
        "govara26f-file-input"
      );

    const resultBox =
      document.getElementById(
        "govara26f-upload-results"
      );

    if (input) {

      input.addEventListener(
        "change",
        async function () {

          if (!resultBox) {
            return;
          }

          resultBox.innerHTML =
            "<div class='notice'>Processing files...</div>";

          const results =
            await processFiles(
              input.files
            );

          resultBox.innerHTML =
            results.map(
              function (result) {

                if (!result.success) {

                  return `
                    <div class="notice danger"
                         style="margin-top:8px;">
                      ❌ File rejected:
                      ${
                        result.validation &&
                        result.validation.errors
                          ? result.validation.errors.join(
                              " "
                            )
                          : "Processing failed."
                      }
                    </div>
                  `;
                }

                return `

                  <div
                    class="notice"
                    style="margin-top:8px;"
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
                    ${result.type || "DOCUMENT"}

                    <br>

                    Original:
                    ${
                      result.originalSizeFormatted ||
                      formatFileSize(
                        result.originalSize
                      )
                    }

                    <br>

                    Processed:
                    ${
                      result.processedSizeFormatted ||
                      formatFileSize(
                        result.processedSize
                      )
                    }

                    ${
                      result.reductionPercent
                        ? `
                          <br>
                          Reduced by:
                          ${result.reductionPercent.toFixed(
                            1
                          )}%
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

                    Status:
                    READY FOR BACKEND SUBMISSION

                  </div>

                `;
              }
            ).join("");

        }
      );
    }


    document
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

            if (action === "save") {

              save();

              alert(
                "26F configuration saved."
              );

              render();

            }

            if (action === "reload") {

              render();

            }

            if (action === "validate") {

              const result =
                validate();

              alert(
                result.valid
                  ? "26F configuration is valid."
                  : result.errors.join("\n")
              );

            }

            if (action === "reset") {

              reset();

              render();

            }

          }
        );

      });
  }


  /* ==========================================================
     Public Configuration Methods
     ========================================================== */

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

      version: VERSION,

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

      imageCompressionEnabled:
        config.imageProcessing
          .compressionEnabled,

      imageResizeEnabled:
        config.imageProcessing
          .resizeEnabled,

      maxFileSizeMB:
        config.upload.maxFileSizeMB,

      backendAuthority:
        config.authority.backendAuthority,

      frontendAuthority:
        config.authority.frontendAuthority
    };
  }

  function save(config) {

    config =
      enforceSafety(
        config || loadConfig()
      );

    const validation =
      validateConfig(
        config
      );

    if (!validation.valid) {

      throw new Error(
        validation.errors.join(" ")
      );
    }

    saveConfig(config);

    addAudit(
      "CONFIG_SAVED",
      {
        version: VERSION
      }
    );

    return {
      success: true,
      validation: validation
    };
  }

  function reset() {

    const config =
      enforceSafety(
        clone(DEFAULT_CONFIG)
      );

    saveConfig(config);

    addAudit(
      "CONFIG_RESET",
      {
        version: VERSION
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
      String(path).split(".");

    let target =
      config;

    for (
      let i = 0;
      i < parts.length - 1;
      i++
    ) {

      if (
        !target[parts[i]] ||
        typeof target[parts[i]] !== "object"
      ) {
        target[parts[i]] = {};
      }

      target =
        target[parts[i]];
    }

    target[
      parts[parts.length - 1]
    ] = value;

    enforceSafety(config);

    saveConfig(config);

    addAudit(
      "POLICY_UPDATED",
      {
        path: path,
        value: value
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


  /* ==========================================================
     Initialization
     ========================================================== */

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


  /* ==========================================================
     Public API
     ========================================================== */

  return {

    VERSION: VERSION,

    STORAGE_KEY: STORAGE_KEY,

    AUDIT_KEY: AUDIT_KEY,

    render: render,

    bind: bind,

    renderAndBind: renderAndBind,

    getConfig: getConfig,

    getStatus: getStatus,

    save: save,

    reset: reset,

    reload: reload,

    validate: validate,

    setPolicy: setPolicy,

    getAudit: getAudit,

    enforceSafety: enforceSafety,

    validateFile: validateFile,

    processFile: processFile,

    processFiles: processFiles,

    compressImage: compressImage,

    createDocumentRecord:
      createDocumentRecord,

    formatFileSize:
      formatFileSize
  };

})();
