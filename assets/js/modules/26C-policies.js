/* =========================================================
   GoVara — 26C Business Policies
   VERSION: GOVARA-26C-V2

   Frontend-only policy configuration.

   Scope:
   - Fare / Rates / Charges
   - Discount
   - Advance
   - KYC Policy
   - Rating Policy
   - Cancellation Policy
   - Booking Policy
   - Customer Policy
   - Vendor Policy
   - Driver Policy
   - Notification Policy
   - Welfare Policy

   Authority:
   - Backend remains authoritative.
   - Frontend is NOT business authority.
   - API belongs to STEP 27.
   - Database remains separate.

   Financial Safety:
   - Real Money = BLOCKED
   - Real Payment = BLOCKED
   - Bank Transfer = BLOCKED
   ========================================================= */

window.GoVara26C = (function () {

  "use strict";

  /* =======================================================
     CONSTANTS
     ======================================================= */

  const VERSION = "GOVARA-26C-V2";

  const STORAGE_KEY =
    "GOVARA_BUSINESS_POLICIES_26C_V2";

  const AUDIT_KEY =
    "GOVARA_BUSINESS_POLICY_AUDIT_26C_V2";

  const LEGACY_STORAGE_KEY =
    "GOVARA_BUSINESS_POLICIES_26C_V1";


  /* =======================================================
     DEFAULT CONFIGURATION
     ======================================================= */

  const DEFAULT_CONFIG = {

    version: VERSION,

    environment: "TESTING",

    policyControlEnabled: true,

    /* -----------------------------------------------
       Fare / Rates
       ----------------------------------------------- */

    fare: {

      baseFare: 0,

      minimumFare: 0,

      perKmRate: 0,

      perMinuteRate: 0,

      waitingChargePerMinute: 0,

      nightChargeEnabled: false,

      nightChargePercent: 0,

      peakChargeEnabled: false,

      peakChargePercent: 0,

      serviceChargePercent: 0,

      platformChargePercent: 0,

      taxPercent: 0,

      roundingMode: "NEAREST",

      currency: "INR"

    },


    /* -----------------------------------------------
       Discount
       ----------------------------------------------- */

    discount: {

      enabled: true,

      maximumPercent: 100,

      maximumFlatAmount: 0,

      couponEnabled: true,

      promotionalDiscountEnabled: true,

      stackableDiscountEnabled: false,

      customerSpecificDiscountEnabled: true,

      vendorSpecificDiscountEnabled: true

    },


    /* -----------------------------------------------
       Advance
       ----------------------------------------------- */

    advance: {

      enabled: true,

      minimumPercent: 0,

      maximumPercent: 100,

      defaultPercent: 0,

      refundable: true,

      adjustmentAgainstFinalBill: true

    },


    /* -----------------------------------------------
       KYC
       ----------------------------------------------- */

    kyc: {

      enabled: true,

      customerRequired: false,

      vendorRequired: true,

      driverRequired: true,

      vehicleRequired: true,

      documentExpiryCheck: true,

      manualReviewAllowed: true,

      autoApprovalAllowed: false,

      reVerificationRequired: false

    },


    /* -----------------------------------------------
       Rating
       ----------------------------------------------- */

    rating: {

      enabled: true,

      scaleMin: 1,

      scaleMax: 5,

      customerCanRateDriver: true,

      customerCanRateVendor: true,

      customerCanRateGoVara: true,

      vendorCanRateDriver: true,

      driverCanRateCustomer: false,

      driverCanRateVendor: false,

      reviewRequired: false,

      anonymousReviewAllowed: false

    },


    /* -----------------------------------------------
       Booking
       ----------------------------------------------- */

    booking: {

      enabled: true,

      minimumAdvanceBookingMinutes: 0,

      maximumAdvanceBookingDays: 365,

      customerCanCancel: true,

      vendorCanReject: true,

      driverCanReject: true,

      reassignmentAllowed: true,

      duplicateBookingProtection: true,

      fareEstimateRequired: true,

      finalFareBackendControlled: true

    },


    /* -----------------------------------------------
       Cancellation
       ----------------------------------------------- */

    cancellation: {

      enabled: true,

      customerCancellationAllowed: true,

      vendorCancellationAllowed: true,

      driverCancellationAllowed: true,

      freeCancellationMinutes: 0,

      customerCancellationChargePercent: 0,

      vendorCancellationChargePercent: 0,

      driverCancellationChargePercent: 0,

      noShowChargePercent: 0,

      refundPolicyEnabled: true

    },


    /* -----------------------------------------------
       Customer
       ----------------------------------------------- */

    customer: {

      registrationEnabled: true,

      profileEditEnabled: true,

      bookingEnabled: true,

      fareEstimateEnabled: true,

      walletViewEnabled: true,

      billingHistoryEnabled: true,

      documentViewEnabled: true,

      ratingEnabled: true

    },


    /* -----------------------------------------------
       Vendor
       ----------------------------------------------- */

    vendor: {

      registrationEnabled: true,

      profileEditEnabled: true,

      bookingManagementEnabled: true,

      driverAssignmentEnabled: true,

      vehicleAssignmentEnabled: true,

      settlementViewEnabled: true,

      documentManagementEnabled: true,

      ratingEnabled: true

    },


    /* -----------------------------------------------
       Driver
       ----------------------------------------------- */

    driver: {

      registrationEnabled: true,

      profileEditEnabled: true,

      dutyManagementEnabled: true,

      assignedBookingEnabled: true,

      tripUpdateEnabled: true,

      locationUpdateEnabled: true,

      documentManagementEnabled: true,

      ratingEnabled: true

    },


    /* -----------------------------------------------
       Notification
       ----------------------------------------------- */

    notification: {

      enabled: true,

      bookingNotification: true,

      assignmentNotification: true,

      cancellationNotification: true,

      tripNotification: true,

      paymentNotification: true,

      billingNotification: true,

      documentNotification: true,

      operationalNotification: true

    },


    /* -----------------------------------------------
       Welfare
       ----------------------------------------------- */

    welfare: {

      enabled: true,

      masterControl: true,

      eligibilityCheckEnabled: true,

      benefitDisplayEnabled: true,

      claimSubmissionEnabled: true,

      approvalBackendControlled: true,

      financialExecutionBlocked: true

    },


    /* -----------------------------------------------
       Authority
       ----------------------------------------------- */

    authority: {

      frontendAuthority: false,

      backendAuthority: true,

      backendPolicyEnforcement: true,

      backendFinalFareAuthority: true,

      backendFinancialAuthority: true,

      apiAuthority: "STEP 27 — CONSOLIDATED API"

    },


    /* -----------------------------------------------
       Financial Safety
       ----------------------------------------------- */

    financialSafety: {

      realMoney: false,

      realPayment: false,

      bankTransfer: false,

      frontendFinancialAuthority: false,

      backendFinancialAuthority: true

    },


    /* -----------------------------------------------
       Audit
       ----------------------------------------------- */

    audit: {

      enabled: true,

      localHistoryEnabled: true,

      maxLocalEvents: 100

    },


    lastAction: "INITIALIZED",

    lastUpdated: null

  };


  /* =======================================================
     STATE
     ======================================================= */

  let config = loadInitialConfig();


  /* =======================================================
     CLONE
     ======================================================= */

  function clone(value) {

    return JSON.parse(
      JSON.stringify(value)
    );

  }


  /* =======================================================
     MERGE
     ======================================================= */

  function mergeConfig(base, incoming) {

    if (
      !incoming ||
      typeof incoming !== "object"
    ) {

      return base;

    }

    Object.keys(incoming)
      .forEach(function (key) {

        if (
          incoming[key] &&
          typeof incoming[key] === "object" &&
          !Array.isArray(incoming[key]) &&
          base[key] &&
          typeof base[key] === "object" &&
          !Array.isArray(base[key])
        ) {

          base[key] =
            mergeConfig(
              base[key],
              incoming[key]
            );

        } else {

          base[key] =
            incoming[key];

        }

      });

    return base;

  }


  /* =======================================================
     LOAD INITIAL CONFIG
     ======================================================= */

  function loadInitialConfig() {

    try {

      const current =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (current) {

        return enforceSafety(
          mergeConfig(
            clone(DEFAULT_CONFIG),
            JSON.parse(current)
          )
        );

      }


      const legacy =
        localStorage.getItem(
          LEGACY_STORAGE_KEY
        );

      if (legacy) {

        const migrated =
          enforceSafety(
            mergeConfig(
              clone(DEFAULT_CONFIG),
              JSON.parse(legacy)
            )
          );

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(migrated)
        );

        return migrated;

      }

    } catch (error) {

      console.warn(
        "GoVara 26C: configuration load failed.",
        error
      );

    }

    return clone(DEFAULT_CONFIG);

  }


  /* =======================================================
     SAFETY ENFORCEMENT
     ======================================================= */

  function enforceSafety(input) {

    const safe =
      clone(
        input || DEFAULT_CONFIG
      );


    safe.version =
      VERSION;

    safe.environment =
      "TESTING";


    /* -----------------------------------------------
       Authority
       ----------------------------------------------- */

    safe.authority.frontendAuthority =
      false;

    safe.authority.backendAuthority =
      true;

    safe.authority.backendPolicyEnforcement =
      true;

    safe.authority.backendFinalFareAuthority =
      true;

    safe.authority.backendFinancialAuthority =
      true;

    safe.authority.apiAuthority =
      "STEP 27 — CONSOLIDATED API";


    /* -----------------------------------------------
       Financial Safety
       ----------------------------------------------- */

    safe.financialSafety.realMoney =
      false;

    safe.financialSafety.realPayment =
      false;

    safe.financialSafety.bankTransfer =
      false;

    safe.financialSafety.frontendFinancialAuthority =
      false;

    safe.financialSafety.backendFinancialAuthority =
      true;


    /* -----------------------------------------------
       Welfare financial execution
       ----------------------------------------------- */

    safe.welfare.financialExecutionBlocked =
      true;


    /* -----------------------------------------------
       Fare safety
       ----------------------------------------------- */

    safe.fare.baseFare =
      nonNegativeNumber(
        safe.fare.baseFare
      );

    safe.fare.minimumFare =
      nonNegativeNumber(
        safe.fare.minimumFare
      );

    safe.fare.perKmRate =
      nonNegativeNumber(
        safe.fare.perKmRate
      );

    safe.fare.perMinuteRate =
      nonNegativeNumber(
        safe.fare.perMinuteRate
      );

    safe.fare.waitingChargePerMinute =
      nonNegativeNumber(
        safe.fare.waitingChargePerMinute
      );

    safe.fare.nightChargePercent =
      percent(
        safe.fare.nightChargePercent
      );

    safe.fare.peakChargePercent =
      percent(
        safe.fare.peakChargePercent
      );

    safe.fare.serviceChargePercent =
      percent(
        safe.fare.serviceChargePercent
      );

    safe.fare.platformChargePercent =
      percent(
        safe.fare.platformChargePercent
      );

    safe.fare.taxPercent =
      percent(
        safe.fare.taxPercent
      );


    /* -----------------------------------------------
       Discount safety
       ----------------------------------------------- */

    safe.discount.maximumPercent =
      percent(
        safe.discount.maximumPercent
      );

    safe.discount.maximumFlatAmount =
      nonNegativeNumber(
        safe.discount.maximumFlatAmount
      );


    /* -----------------------------------------------
       Advance safety
       ----------------------------------------------- */

    safe.advance.minimumPercent =
      percent(
        safe.advance.minimumPercent
      );

    safe.advance.maximumPercent =
      percent(
        safe.advance.maximumPercent
      );

    safe.advance.defaultPercent =
      percent(
        safe.advance.defaultPercent
      );


    if (
      safe.advance.minimumPercent >
      safe.advance.maximumPercent
    ) {

      safe.advance.minimumPercent =
        0;

      safe.advance.maximumPercent =
        100;

    }

    if (
      safe.advance.defaultPercent <
      safe.advance.minimumPercent
    ) {

      safe.advance.defaultPercent =
        safe.advance.minimumPercent;

    }

    if (
      safe.advance.defaultPercent >
      safe.advance.maximumPercent
    ) {

      safe.advance.defaultPercent =
        safe.advance.maximumPercent;

    }


    /* -----------------------------------------------
       Rating safety
       ----------------------------------------------- */

    safe.rating.scaleMin =
      integerAtLeast(
        safe.rating.scaleMin,
        1
      );

    safe.rating.scaleMax =
      integerAtLeast(
        safe.rating.scaleMax,
        safe.rating.scaleMin
      );


    /* -----------------------------------------------
       Booking safety
       ----------------------------------------------- */

    safe.booking.minimumAdvanceBookingMinutes =
      integerAtLeast(
        safe.booking.minimumAdvanceBookingMinutes,
        0
      );

    safe.booking.maximumAdvanceBookingDays =
      integerAtLeast(
        safe.booking.maximumAdvanceBookingDays,
        1
      );


    /* -----------------------------------------------
       Cancellation safety
       ----------------------------------------------- */

    safe.cancellation.freeCancellationMinutes =
      integerAtLeast(
        safe.cancellation.freeCancellationMinutes,
        0
      );

    safe.cancellation.customerCancellationChargePercent =
      percent(
        safe.cancellation.customerCancellationChargePercent
      );

    safe.cancellation.vendorCancellationChargePercent =
      percent(
        safe.cancellation.vendorCancellationChargePercent
      );

    safe.cancellation.driverCancellationChargePercent =
      percent(
        safe.cancellation.driverCancellationChargePercent
      );

    safe.cancellation.noShowChargePercent =
      percent(
        safe.cancellation.noShowChargePercent
      );


    return safe;

  }


  /* =======================================================
     NUMBER HELPERS
     ======================================================= */

  function nonNegativeNumber(value) {

    const number =
      Number(value);

    if (
      !Number.isFinite(number) ||
      number < 0
    ) {

      return 0;

    }

    return number;

  }


  function percent(value) {

    const number =
      Number(value);

    if (
      !Number.isFinite(number)
    ) {

      return 0;

    }

    return Math.min(
      100,
      Math.max(
        0,
        number
      )
    );

  }


  function integerAtLeast(
    value,
    minimum
  ) {

    const number =
      Number(value);

    if (
      !Number.isFinite(number)
    ) {

      return minimum;

    }

    return Math.max(
      minimum,
      Math.floor(number)
    );

  }


  /* =======================================================
     GET CONFIG
     ======================================================= */

  function getConfig() {

    return clone(config);

  }


  /* =======================================================
     VALIDATION
     ======================================================= */

  function validateConfig(input) {

    const target =
      enforceSafety(
        input || config
      );

    const errors = [];


    if (
      target.environment !==
      "TESTING"
    ) {

      errors.push(
        "26C must remain in TESTING mode."
      );

    }


    if (
      target.authority.frontendAuthority !==
      false
    ) {

      errors.push(
        "Frontend cannot be business authority."
      );

    }


    if (
      target.authority.backendAuthority !==
      true
    ) {

      errors.push(
        "Backend must remain authoritative."
      );

    }


    if (
      target.authority.backendPolicyEnforcement !==
      true
    ) {

      errors.push(
        "Backend policy enforcement must remain enabled."
      );

    }


    if (
      target.authority.backendFinalFareAuthority !==
      true
    ) {

      errors.push(
        "Backend must remain final fare authority."
      );

    }


    if (
      target.financialSafety.realMoney !==
      false
    ) {

      errors.push(
        "Real Money must remain BLOCKED."
      );

    }


    if (
      target.financialSafety.realPayment !==
      false
    ) {

      errors.push(
        "Real Payment must remain BLOCKED."
      );

    }


    if (
      target.financialSafety.bankTransfer !==
      false
    ) {

      errors.push(
        "Bank Transfer must remain BLOCKED."
      );

    }


    if (
      target.financialSafety.frontendFinancialAuthority !==
      false
    ) {

      errors.push(
        "Frontend financial authority must remain disabled."
      );

    }


    if (
      target.financialSafety.backendFinancialAuthority !==
      true
    ) {

      errors.push(
        "Backend must remain financial authority."
      );

    }


    if (
      target.welfare.financialExecutionBlocked !==
      true
    ) {

      errors.push(
        "Welfare financial execution must remain blocked."
      );

    }


    if (
      target.advance.minimumPercent >
      target.advance.maximumPercent
    ) {

      errors.push(
        "Advance minimum cannot exceed maximum."
      );

    }


    if (
      target.advance.defaultPercent <
      target.advance.minimumPercent ||
      target.advance.defaultPercent >
      target.advance.maximumPercent
    ) {

      errors.push(
        "Advance default must be within the configured range."
      );

    }


    if (
      target.rating.scaleMin >=
      target.rating.scaleMax
    ) {

      errors.push(
        "Rating maximum must be greater than minimum."
      );

    }


    return {

      valid:
        errors.length === 0,

      errors:
        errors

    };

  }


  /* =======================================================
     SAVE
     ======================================================= */

  function save(nextConfig) {

    const candidate =
      enforceSafety(
        mergeConfig(
          clone(config),
          nextConfig || {}
        )
      );


    const validation =
      validateConfig(
        candidate
      );


    if (!validation.valid) {

      return {

        success: false,

        errors:
          validation.errors

      };

    }


    candidate.lastAction =
      "POLICY_CONFIGURATION_SAVED";

    candidate.lastUpdated =
      new Date().toISOString();


    config =
      candidate;


    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(config)
      );


      createAuditEvent(
        "POLICY_CONFIGURATION_SAVED",
        "26C business policies saved locally."
      );


    } catch (error) {

      console.error(
        "GoVara 26C: save failed.",
        error
      );


      return {

        success: false,

        errors: [
          "Unable to save 26C configuration locally."
        ]

      };

    }


    renderAndBind();


    return {

      success: true,

      config:
        getConfig()

    };

  }


  /* =======================================================
     RESET
     ======================================================= */

  function reset() {

    config =
      enforceSafety(
        clone(DEFAULT_CONFIG)
      );


    config.lastAction =
      "POLICY_CONFIGURATION_RESET";

    config.lastUpdated =
      new Date().toISOString();


    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(config)
      );


      createAuditEvent(
        "POLICY_CONFIGURATION_RESET",
        "26C business policies reset to defaults."
      );


    } catch (error) {

      console.warn(
        "GoVara 26C: reset failed.",
        error
      );

    }


    renderAndBind();


    return getConfig();

  }


  /* =======================================================
     RELOAD
     ======================================================= */

  function reload() {

    try {

      const stored =
        localStorage.getItem(
          STORAGE_KEY
        );


      if (stored) {

        config =
          enforceSafety(
            JSON.parse(stored)
          );

      } else {

        config =
          enforceSafety(
            clone(DEFAULT_CONFIG)
          );

      }


    } catch (error) {

      console.warn(
        "GoVara 26C: reload failed.",
        error
      );


      config =
        enforceSafety(
          clone(DEFAULT_CONFIG)
        );

    }


    renderAndBind();


    return getConfig();

  }


  /* =======================================================
     UPDATE POLICY
     ======================================================= */

  function setPolicy(
    section,
    key,
    value
  ) {

    if (
      !config[section] ||
      typeof config[section] !== "object"
    ) {

      return {

        success: false,

        error:
          "Unknown policy section."

      };

    }


    if (
      !Object.prototype.hasOwnProperty.call(
        config[section],
        key
      )
    ) {

      return {

        success: false,

        error:
          "Unknown policy field."

      };

    }


    config[section][key] =
      value;


    config =
      enforceSafety(config);


    const validation =
      validateConfig(config);


    if (!validation.valid) {

      return {

        success: false,

        errors:
          validation.errors

      };

    }


    config.lastAction =
      "POLICY_UPDATED";

    config.lastUpdated =
      new Date().toISOString();


    createAuditEvent(
      "POLICY_UPDATED",
      section +
      "." +
      key +
      " updated.",
      {
        section: section,
        key: key,
        value: value
      }
    );


    return save(config);

  }


  /* =======================================================
     AUDIT
     ======================================================= */

  function createAuditEvent(
    action,
    description,
    metadata
  ) {

    if (
      !config.audit.enabled ||
      !config.audit.localHistoryEnabled
    ) {

      return null;

    }


    const event = {

      id:
        "26C-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2, 8),

      module:
        "26C",

      action:
        action || "UNKNOWN_ACTION",

      description:
        description || "",

      metadata:
        metadata || {},

      environment:
        "TESTING",

      timestamp:
        new Date().toISOString()

    };


    let history =
      getAuditHistory();


    history.unshift(event);


    const maximum =
      Number(
        config.audit.maxLocalEvents
      ) || 100;


    history =
      history.slice(
        0,
        maximum
      );


    try {

      localStorage.setItem(
        AUDIT_KEY,
        JSON.stringify(history)
      );

    } catch (error) {

      console.warn(
        "GoVara 26C: audit save failed.",
        error
      );

    }


    return event;

  }


  /* =======================================================
     GET AUDIT
     ======================================================= */

  function getAuditHistory() {

    try {

      const stored =
        localStorage.getItem(
          AUDIT_KEY
        );


      if (!stored) {

        return [];

      }


      const parsed =
        JSON.parse(stored);


      return Array.isArray(parsed)
        ? parsed
        : [];

    } catch (error) {

      return [];

    }

  }


  /* =======================================================
     CLEAR AUDIT
     ======================================================= */

  function clearAuditHistory() {

    try {

      localStorage.removeItem(
        AUDIT_KEY
      );

      return true;

    } catch (error) {

      console.warn(
        "GoVara 26C: audit clear failed.",
        error
      );

      return false;

    }

  }


  /* =======================================================
     HTML ESCAPE
     ======================================================= */

  function esc(value) {

    return String(
      value === undefined ||
      value === null
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


  /* =======================================================
     BOOLEAN CONTROL
     ======================================================= */

  function boolControl(
    section,
    key,
    label,
    checked
  ) {

    return `

      <label class="govara26c-control">

        <input
          type="checkbox"
          data-26c-boolean="${esc(section)}.${esc(key)}"
          ${checked ? "checked" : ""}
        >

        <span>
          ${esc(label)}
        </span>

      </label>

    `;

  }


  /* =======================================================
     NUMBER CONTROL
     ======================================================= */

  function numberControl(
    section,
    key,
    label,
    value,
    step
  ) {

    return `

      <label>

        <span>
          ${esc(label)}
        </span>

        <input
          type="number"
          min="0"
          step="${esc(step || "0.01")}"
          data-26c-number="${esc(section)}.${esc(key)}"
          value="${esc(value)}"
        >

      </label>

    `;

  }


  /* =======================================================
     FARE SECTION
     ======================================================= */

  function renderFare() {

    return `

      <section class="card">

        <h2>
          Fare / Rates / Charges
        </h2>

        <div class="grid two">

          ${numberControl(
            "fare",
            "baseFare",
            "Base Fare",
            config.fare.baseFare
          )}

          ${numberControl(
            "fare",
            "minimumFare",
            "Minimum Fare",
            config.fare.minimumFare
          )}

          ${numberControl(
            "fare",
            "perKmRate",
            "Per KM Rate",
            config.fare.perKmRate
          )}

          ${numberControl(
            "fare",
            "perMinuteRate",
            "Per Minute Rate",
            config.fare.perMinuteRate
          )}

          ${numberControl(
            "fare",
            "waitingChargePerMinute",
            "Waiting Charge / Minute",
            config.fare.waitingChargePerMinute
          )}

          ${numberControl(
            "fare",
            "nightChargePercent",
            "Night Charge %",
            config.fare.nightChargePercent
          )}

          ${numberControl(
            "fare",
            "peakChargePercent",
            "Peak Charge %",
            config.fare.peakChargePercent
          )}

          ${numberControl(
            "fare",
            "serviceChargePercent",
            "Service Charge %",
            config.fare.serviceChargePercent
          )}

          ${numberControl(
            "fare",
            "platformChargePercent",
            "Platform Charge %",
            config.fare.platformChargePercent
          )}

          ${numberControl(
            "fare",
            "taxPercent",
            "Tax %",
            config.fare.taxPercent
          )}

        </div>

        <div class="grid two">

          ${boolControl(
            "fare",
            "nightChargeEnabled",
            "Night Charge Enabled",
            config.fare.nightChargeEnabled
          )}

          ${boolControl(
            "fare",
            "peakChargeEnabled",
            "Peak Charge Enabled",
            config.fare.peakChargeEnabled
          )}

        </div>

        <div class="notice">

          Fare estimate may be displayed by the frontend,
          but final fare remains backend authoritative.

        </div>

      </section>

    `;

  }


  /* =======================================================
     DISCOUNT
     ======================================================= */

  function renderDiscount() {

    return `

      <section class="card">

        <h2>
          Discount Policy
        </h2>

        <div class="grid two">

          ${boolControl(
            "discount",
            "enabled",
            "Discount Enabled",
            config.discount.enabled
          )}

          ${boolControl(
            "discount",
            "couponEnabled",
            "Coupon Enabled",
            config.discount.couponEnabled
          )}

          ${boolControl(
            "discount",
            "promotionalDiscountEnabled",
            "Promotional Discount",
            config.discount.promotionalDiscountEnabled
          )}

          ${boolControl(
            "discount",
            "stackableDiscountEnabled",
            "Stackable Discount",
            config.discount.stackableDiscountEnabled
          )}

          ${boolControl(
            "discount",
            "customerSpecificDiscountEnabled",
            "Customer Specific Discount",
            config.discount.customerSpecificDiscountEnabled
          )}

          ${boolControl(
            "discount",
            "vendorSpecificDiscountEnabled",
            "Vendor Specific Discount",
            config.discount.vendorSpecificDiscountEnabled
          )}

          ${numberControl(
            "discount",
            "maximumPercent",
            "Maximum Discount %",
            config.discount.maximumPercent
          )}

          ${numberControl(
            "discount",
            "maximumFlatAmount",
            "Maximum Flat Discount",
            config.discount.maximumFlatAmount
          )}

        </div>

      </section>

    `;

  }


  /* =======================================================
     ADVANCE
     ======================================================= */

  function renderAdvance() {

    return `

      <section class="card">

        <h2>
          Advance Payment Policy
        </h2>

        <div class="grid two">

          ${boolControl(
            "advance",
            "enabled",
            "Advance Enabled",
            config.advance.enabled
          )}

          ${boolControl(
            "advance",
            "refundable",
            "Advance Refundable",
            config.advance.refundable
          )}

          ${boolControl(
            "advance",
            "adjustmentAgainstFinalBill",
            "Adjust Against Final Bill",
            config.advance.adjustmentAgainstFinalBill
          )}

          ${numberControl(
            "advance",
            "minimumPercent",
            "Minimum Advance %",
            config.advance.minimumPercent
          )}

          ${numberControl(
            "advance",
            "maximumPercent",
            "Maximum Advance %",
            config.advance.maximumPercent
          )}

          ${numberControl(
            "advance",
            "defaultPercent",
            "Default Advance %",
            config.advance.defaultPercent
          )}

        </div>

        <div class="notice warn">

          Actual financial collection,
          payment confirmation and settlement
          remain backend controlled.

        </div>

      </section>

    `;

  }


  /* =======================================================
     KYC
     ======================================================= */

  function renderKYC() {

    return `

      <section class="card">

        <h2>
          KYC Policy
        </h2>

        <div class="grid two">

          ${boolControl(
            "kyc",
            "enabled",
            "KYC Enabled",
            config.kyc.enabled
          )}

          ${boolControl(
            "kyc",
            "customerRequired",
            "Customer KYC Required",
            config.kyc.customerRequired
          )}

          ${boolControl(
            "kyc",
            "vendorRequired",
            "Vendor KYC Required",
            config.kyc.vendorRequired
          )}

          ${boolControl(
            "kyc",
            "driverRequired",
            "Driver KYC Required",
            config.kyc.driverRequired
          )}

          ${boolControl(
            "kyc",
            "vehicleRequired",
            "Vehicle KYC Required",
            config.kyc.vehicleRequired
          )}

          ${boolControl(
            "kyc",
            "documentExpiryCheck",
            "Document Expiry Check",
            config.kyc.documentExpiryCheck
          )}

          ${boolControl(
            "kyc",
            "manualReviewAllowed",
            "Manual Review Allowed",
            config.kyc.manualReviewAllowed
          )}

          ${boolControl(
            "kyc",
            "autoApprovalAllowed",
            "Auto Approval Allowed",
            config.kyc.autoApprovalAllowed
          )}

          ${boolControl(
            "kyc",
            "reVerificationRequired",
            "Re-verification Required",
            config.kyc.reVerificationRequired
          )}

        </div>

      </section>

    `;

  }


  /* =======================================================
     RATING
     ======================================================= */

  function renderRating() {

    return `

      <section class="card">

        <h2>
          Rating Policy
        </h2>

        <div class="grid two">

          ${boolControl(
            "rating",
            "enabled",
            "Rating Enabled",
            config.rating.enabled
          )}

          ${boolControl(
            "rating",
            "customerCanRateDriver",
            "Customer → Driver",
            config.rating.customerCanRateDriver
          )}

          ${boolControl(
            "rating",
            "customerCanRateVendor",
            "Customer → Vendor",
            config.rating.customerCanRateVendor
          )}

          ${boolControl(
            "rating",
            "customerCanRateGoVara",
            "Customer → GoVara",
            config.rating.customerCanRateGoVara
          )}

          ${boolControl(
            "rating",
            "vendorCanRateDriver",
            "Vendor → Driver",
            config.rating.vendorCanRateDriver
          )}

          ${boolControl(
            "rating",
            "driverCanRateCustomer",
            "Driver → Customer",
            config.rating.driverCanRateCustomer
          )}

          ${boolControl(
            "rating",
            "driverCanRateVendor",
            "Driver → Vendor",
            config.rating.driverCanRateVendor
          )}

          ${boolControl(
            "rating",
            "reviewRequired",
            "Review Required",
            config.rating.reviewRequired
          )}

          ${boolControl(
            "rating",
            "anonymousReviewAllowed",
            "Anonymous Review",
            config.rating.anonymousReviewAllowed
          )}

          ${numberControl(
            "rating",
            "scaleMin",
            "Rating Minimum",
            config.rating.scaleMin,
            "1"
          )}

          ${numberControl(
            "rating",
            "scaleMax",
            "Rating Maximum",
            config.rating.scaleMax,
            "1"
          )}

        </div>

      </section>

    `;

  }


  /* =======================================================
     BOOKING
     ======================================================= */

  function renderBooking() {

    return `

      <section class="card">

        <h2>
          Booking Policy
        </h2>

        <div class="grid two">

          ${boolControl(
            "booking",
            "enabled",
            "Booking Enabled",
            config.booking.enabled
          )}

          ${boolControl(
            "booking",
            "customerCanCancel",
            "Customer Cancellation",
            config.booking.customerCanCancel
          )}

          ${boolControl(
            "booking",
            "vendorCanReject",
            "Vendor Rejection",
            config.booking.vendorCanReject
          )}

          ${boolControl(
            "booking",
            "driverCanReject",
            "Driver Rejection",
            config.booking.driverCanReject
          )}

          ${boolControl(
            "booking",
            "reassignmentAllowed",
            "Reassignment Allowed",
            config.booking.reassignmentAllowed
          )}

          ${boolControl(
            "booking",
            "duplicateBookingProtection",
            "Duplicate Booking Protection",
            config.booking.duplicateBookingProtection
          )}

          ${boolControl(
            "booking",
            "fareEstimateRequired",
            "Fare Estimate Required",
            config.booking.fareEstimateRequired
          )}

          ${numberControl(
            "booking",
            "minimumAdvanceBookingMinutes",
            "Minimum Advance Booking Minutes",
            config.booking.minimumAdvanceBookingMinutes,
            "1"
          )}

          ${numberControl(
            "booking",
            "maximumAdvanceBookingDays",
            "Maximum Advance Booking Days",
            config.booking.maximumAdvanceBookingDays,
            "1"
          )}

        </div>

        <div class="notice">

          Final booking validation and final fare
          remain backend controlled.

        </div>

      </section>

    `;

  }


  /* =======================================================
     CANCELLATION
     ======================================================= */

  function renderCancellation() {

    return `

      <section class="card">

        <h2>
          Cancellation Policy
        </h2>

        <div class="grid two">

          ${boolControl(
            "cancellation",
            "enabled",
            "Cancellation Policy Enabled",
            config.cancellation.enabled
          )}

          ${boolControl(
            "cancellation",
            "customerCancellationAllowed",
            "Customer Cancellation",
            config.cancellation.customerCancellationAllowed
          )}

          ${boolControl(
            "cancellation",
            "vendorCancellationAllowed",
            "Vendor Cancellation",
            config.cancellation.vendorCancellationAllowed
          )}

          ${boolControl(
            "cancellation",
            "driverCancellationAllowed",
            "Driver Cancellation",
            config.cancellation.driverCancellationAllowed
          )}

          ${boolControl(
            "cancellation",
            "refundPolicyEnabled",
            "Refund Policy Enabled",
            config.cancellation.refundPolicyEnabled
          )}

          ${numberControl(
            "cancellation",
            "freeCancellationMinutes",
            "Free Cancellation Minutes",
            config.cancellation.freeCancellationMinutes,
            "1"
          )}

          ${numberControl(
            "cancellation",
            "customerCancellationChargePercent",
            "Customer Cancellation Charge %",
            config.cancellation.customerCancellationChargePercent
          )}

          ${numberControl(
            "cancellation",
            "vendorCancellationChargePercent",
            "Vendor Cancellation Charge %",
            config.cancellation.vendorCancellationChargePercent
          )}

          ${numberControl(
            "cancellation",
            "driverCancellationChargePercent",
            "Driver Cancellation Charge %",
            config.cancellation.driverCancellationChargePercent
          )}

          ${numberControl(
            "cancellation",
            "noShowChargePercent",
            "No-Show Charge %",
            config.cancellation.noShowChargePercent
          )}

        </div>

      </section>

    `;

  }


  /* =======================================================
     ROLE BUSINESS POLICIES
     ======================================================= */

  function renderRolePolicies() {

    return `

      <section class="card">

        <h2>
          Customer Policy
        </h2>

        <div class="grid two">

          ${boolControl(
            "customer",
            "registrationEnabled",
            "Registration",
            config.customer.registrationEnabled
          )}

          ${boolControl(
            "customer",
            "profileEditEnabled",
            "Profile Edit",
            config.customer.profileEditEnabled
          )}

          ${boolControl(
            "customer",
            "bookingEnabled",
            "Booking",
            config.customer.bookingEnabled
          )}

          ${boolControl(
            "customer",
            "fareEstimateEnabled",
            "Fare Estimate",
            config.customer.fareEstimateEnabled
          )}

          ${boolControl(
            "customer",
            "walletViewEnabled",
            "Wallet View",
            config.customer.walletViewEnabled
          )}

          ${boolControl(
            "customer",
            "billingHistoryEnabled",
            "Billing History",
            config.customer.billingHistoryEnabled
          )}

          ${boolControl(
            "customer",
            "documentViewEnabled",
            "Document View",
            config.customer.documentViewEnabled
          )}

          ${boolControl(
            "customer",
            "ratingEnabled",
            "Rating",
            config.customer.ratingEnabled
          )}

        </div>

      </section>


      <section class="card">

        <h2>
          Vendor Policy
        </h2>

        <div class="grid two">

          ${boolControl(
            "vendor",
            "registrationEnabled",
            "Registration",
            config.vendor.registrationEnabled
          )}

          ${boolControl(
            "vendor",
            "profileEditEnabled",
            "Profile Edit",
            config.vendor.profileEditEnabled
          )}

          ${boolControl(
            "vendor",
            "bookingManagementEnabled",
            "Booking Management",
            config.vendor.bookingManagementEnabled
          )}

          ${boolControl(
            "vendor",
            "driverAssignmentEnabled",
            "Driver Assignment",
            config.vendor.driverAssignmentEnabled
          )}

          ${boolControl(
            "vendor",
            "vehicleAssignmentEnabled",
            "Vehicle Assignment",
            config.vendor.vehicleAssignmentEnabled
          )}

          ${boolControl(
            "vendor",
            "settlementViewEnabled",
            "Settlement View",
            config.vendor.settlementViewEnabled
          )}

          ${boolControl(
            "vendor",
            "documentManagementEnabled",
            "Document Management",
            config.vendor.documentManagementEnabled
          )}

          ${boolControl(
            "vendor",
            "ratingEnabled",
            "Rating",
            config.vendor.ratingEnabled
          )}

        </div>

      </section>


      <section class="card">

        <h2>
          Driver Policy
        </h2>

        <div class="grid two">

          ${boolControl(
            "driver",
            "registrationEnabled",
            "Registration",
            config.driver.registrationEnabled
          )}

          ${boolControl(
            "driver",
            "profileEditEnabled",
            "Profile Edit",
            config.driver.profileEditEnabled
          )}

          ${boolControl(
            "driver",
            "dutyManagementEnabled",
            "Duty Management",
            config.driver.dutyManagementEnabled
          )}

          ${boolControl(
            "driver",
            "assignedBookingEnabled",
            "Assigned Booking",
            config.driver.assignedBookingEnabled
          )}

          ${boolControl(
            "driver",
            "tripUpdateEnabled",
            "Trip Update",
            config.driver.tripUpdateEnabled
          )}

          ${boolControl(
            "driver",
            "locationUpdateEnabled",
            "Location Update",
            config.driver.locationUpdateEnabled
          )}

          ${boolControl(
            "driver",
            "documentManagementEnabled",
            "Document Management",
            config.driver.documentManagementEnabled
          )}

          ${boolControl(
            "driver",
            "ratingEnabled",
            "Rating",
            config.driver.ratingEnabled
          )}

        </div>

      </section>

    `;

  }


  /* =======================================================
     NOTIFICATION
     ======================================================= */

  function renderNotifications() {

    return `

      <section class="card">

        <h2>
          Notification Policy
        </h2>

        <div class="grid two">

          ${boolControl(
            "notification",
            "enabled",
            "Notifications Enabled",
            config.notification.enabled
          )}

          ${boolControl(
            "notification",
            "bookingNotification",
            "Booking",
            config.notification.bookingNotification
          )}

          ${boolControl(
            "notification",
            "assignmentNotification",
            "Assignment",
            config.notification.assignmentNotification
          )}

          ${boolControl(
            "notification",
            "cancellationNotification",
            "Cancellation",
            config.notification.cancellationNotification
          )}

          ${boolControl(
            "notification",
            "tripNotification",
            "Trip",
            config.notification.tripNotification
          )}

          ${boolControl(
            "notification",
            "paymentNotification",
            "Payment",
            config.notification.paymentNotification
          )}

          ${boolControl(
            "notification",
            "billingNotification",
            "Billing",
            config.notification.billingNotification
          )}

          ${boolControl(
            "notification",
            "documentNotification",
            "Document",
            config.notification.documentNotification
          )}

          ${boolControl(
            "notification",
            "operationalNotification",
            "Operational",
            config.notification.operationalNotification
          )}

        </div>

      </section>

    `;

  }


  /* =======================================================
     WELFARE
     ======================================================= */

  function renderWelfare() {

    return `

      <section class="card">

        <h2>
          Welfare Policy
        </h2>

        <div class="grid two">

          ${boolControl(
            "welfare",
            "enabled",
            "Welfare Enabled",
            config.welfare.enabled
          )}

          ${boolControl(
            "welfare",
            "masterControl",
            "Welfare Master Control",
            config.welfare.masterControl
          )}

          ${boolControl(
            "welfare",
            "eligibilityCheckEnabled",
            "Eligibility Check",
            config.welfare.eligibilityCheckEnabled
          )}

          ${boolControl(
            "welfare",
            "benefitDisplayEnabled",
            "Benefit Display",
            config.welfare.benefitDisplayEnabled
          )}

          ${boolControl(
            "welfare",
            "claimSubmissionEnabled",
            "Claim Submission",
            config.welfare.claimSubmissionEnabled
          )}

          ${boolControl(
            "welfare",
            "approvalBackendControlled",
            "Backend Approval",
            config.welfare.approvalBackendControlled
          )}

        </div>

        <div class="notice warn">

          Financial execution through welfare
          remains BLOCKED in the frontend.

        </div>

      </section>

    `;

  }


  /* =======================================================
     SAFETY STATUS
     ======================================================= */

  function renderSafety() {

    return `

      <section class="card">

        <h2>
          Business & Financial Authority
        </h2>

        <div class="grid four">

          <div>

            <b>
              BACKEND
            </b>

            <div class="muted">
              Business Policy Authority
            </div>

          </div>

          <div>

            <b>
              BACKEND
            </b>

            <div class="muted">
              Final Fare Authority
            </div>

          </div>

          <div>

            <b>
              BLOCKED
            </b>

            <div class="muted">
              Real Money
            </div>

          </div>

          <div>

            <b>
              BLOCKED
            </b>

            <div class="muted">
              Real Payment
            </div>

          </div>

        </div>

        <div class="grid four">

          <div>

            <b>
              BLOCKED
            </b>

            <div class="muted">
              Bank Transfer
            </div>

          </div>

          <div>

            <b>
              NOT AUTHORITY
            </b>

            <div class="muted">
              Frontend
            </div>

          </div>

          <div>

            <b>
              AUTHORITATIVE
            </b>

            <div class="muted">
              Backend
            </div>

          </div>

          <div>

            <b>
              STEP 27
            </b>

            <div class="muted">
              API Boundary
            </div>

          </div>

        </div>

      </section>

    `;

  }


  /* =======================================================
     AUDIT RENDER
     ======================================================= */

  function renderAudit() {

    const history =
      getAuditHistory();


    if (!history.length) {

      return `

        <div class="notice">

          No local 26C audit events yet.

        </div>

      `;

    }


    return history
      .slice(0, 10)
      .map(
        function (event) {

          return `

            <div class="govara26c-audit-row">

              <div>

                <b>
                  ${esc(event.action)}
                </b>

                <div class="muted">

                  ${esc(event.description)}

                </div>

              </div>

              <div class="muted">

                ${esc(event.timestamp)}

              </div>

            </div>

          `;

        }
      )
      .join("");

  }


  /* =======================================================
     MAIN RENDER
     ======================================================= */

  function render() {

    const validation =
      validateConfig(config);


    return `

      <div class="page-head">

        <h1>
          26C — Business Policies
        </h1>

        <div class="muted">

          Central business policy configuration
          for GoVara.

        </div>

      </div>


      <!-- ================================================
           STATUS
           ================================================ -->

      <section class="card">

        <h2>
          Policy Control Status
        </h2>

        <div class="grid four">

          <div>

            <b>
              ENABLED
            </b>

            <div class="muted">
              Policy Control
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
              ${validation.valid
                ? "VALID"
                : "INVALID"}
            </b>

            <div class="muted">
              Validation
            </div>

          </div>

          <div>

            <b>
              BACKEND
            </b>

            <div class="muted">
              Authority
            </div>

          </div>

        </div>

      </section>


      <!-- ================================================
           POLICY SECTIONS
           ================================================ -->

      ${renderFare()}

      ${renderDiscount()}

      ${renderAdvance()}

      ${renderKYC()}

      ${renderRating()}

      ${renderBooking()}

      ${renderCancellation()}

      ${renderRolePolicies()}

      ${renderNotifications()}

      ${renderWelfare()}

      ${renderSafety()}


      <!-- ================================================
           VALIDATION
           ================================================ -->

      <section class="card">

        <h2>
          Configuration Validation
        </h2>

        ${
          validation.valid

            ? `

              <div class="notice">

                26C configuration is valid.

              </div>

            `

            : `

              <div class="notice danger">

                ${validation.errors
                  .map(
                    function (error) {

                      return `
                        <div>
                          ${esc(error)}
                        </div>
                      `;

                    }
                  )
                  .join("")}

              </div>

            `
        }

      </section>


      <!-- ================================================
           AUDIT
           ================================================ -->

      <section class="card">

        <div class="row between">

          <div>

            <h2>
              26C Local Audit
            </h2>

            <div class="muted">

              Frontend policy configuration
              audit history.

            </div>

          </div>

          <button
            type="button"
            class="secondary"
            data-26c-action="clear-audit"
          >

            Clear Local Audit

          </button>

        </div>

        <div class="govara26c-audit-list">

          ${renderAudit()}

        </div>

      </section>


      <!-- ================================================
           ACTIONS
           ================================================ -->

      <section class="card">

        <div class="row gap">

          <button
            type="button"
            class="primary"
            data-26c-action="save"
          >

            Save Configuration

          </button>


          <button
            type="button"
            class="secondary"
            data-26c-action="reload"
          >

            Reload

          </button>


          <button
            type="button"
            class="secondary"
            data-26c-action="reset"
          >

            Reset Defaults

          </button>

        </div>

      </section>


      <div class="muted govara26c-version">

        ${esc(VERSION)}

      </div>

    `;

  }


  /* =======================================================
     READ FORM
     ======================================================= */

  function readForm(root) {

    const next =
      clone(config);


    /* -----------------------------------------------
       Boolean controls
       ----------------------------------------------- */

    root
      .querySelectorAll(
        "[data-26c-boolean]"
      )
      .forEach(
        function (element) {

          const path =
            element.getAttribute(
              "data-26c-boolean"
            );


          const parts =
            path.split(".");


          if (
            parts.length !== 2
          ) {

            return;

          }


          const section =
            parts[0];

          const key =
            parts[1];


          if (
            next[section] &&
            Object.prototype.hasOwnProperty.call(
              next[section],
              key
            )
          ) {

            next[section][key] =
              element.checked;

          }

        }
      );


    /* -----------------------------------------------
       Number controls
       ----------------------------------------------- */

    root
      .querySelectorAll(
        "[data-26c-number]"
      )
      .forEach(
        function (element) {

          const path =
            element.getAttribute(
              "data-26c-number"
            );


          const parts =
            path.split(".");


          if (
            parts.length !== 2
          ) {

            return;

          }


          const section =
            parts[0];

          const key =
            parts[1];


          if (
            next[section] &&
            Object.prototype.hasOwnProperty.call(
              next[section],
              key
            )
          ) {

            next[section][key] =
              Number(element.value);

          }

        }
      );


    return enforceSafety(next);

  }


  /* =======================================================
     BIND
     ======================================================= */

  function bind() {

    const root =
      document.getElementById(
        "module-26C"
      );


    if (!root) {

      console.warn(
        "GoVara 26C: mount #module-26C not found."
      );

      return;

    }


    /* -----------------------------------------------
       Save
       ----------------------------------------------- */

    const saveButton =
      root.querySelector(
        '[data-26c-action="save"]'
      );


    if (saveButton) {

      saveButton.addEventListener(
        "click",
        function () {

          const next =
            readForm(root);


          const result =
            save(next);


          if (!result.success) {

            alert(
              "26C configuration could not be saved:\n\n" +
              result.errors.join("\n")
            );

            return;

          }


          alert(
            "26C Business Policies saved successfully."
          );

        }
      );

    }


    /* -----------------------------------------------
       Reload
       ----------------------------------------------- */

    const reloadButton =
      root.querySelector(
        '[data-26c-action="reload"]'
      );


    if (reloadButton) {

      reloadButton.addEventListener(
        "click",
        function () {

          reload();

        }
      );

    }


    /* -----------------------------------------------
       Reset
       ----------------------------------------------- */

    const resetButton =
      root.querySelector(
        '[data-26c-action="reset"]'
      );


    if (resetButton) {

      resetButton.addEventListener(
        "click",
        function () {

          const confirmed =
            window.confirm(
              "Reset 26C Business Policies to defaults?"
            );


          if (!confirmed) {

            return;

          }


          reset();

        }
      );

    }


    /* -----------------------------------------------
       Clear audit
       ----------------------------------------------- */

    const clearAuditButton =
      root.querySelector(
        '[data-26c-action="clear-audit"]'
      );


    if (clearAuditButton) {

      clearAuditButton.addEventListener(
        "click",
        function () {

          const confirmed =
            window.confirm(
              "Clear local 26C audit history?"
            );


          if (!confirmed) {

            return;

          }


          clearAuditHistory();

          renderAndBind();

        }
      );

    }

  }


  /* =======================================================
     RENDER + BIND
     ======================================================= */

  function renderAndBind() {

    const mount =
      document.getElementById(
        "module-26C"
      );


    if (!mount) {

      console.warn(
        "GoVara 26C: mount #module-26C not found."
      );

      return;

    }


    try {

      mount.innerHTML =
        render();


      bind();

    } catch (error) {

      console.error(
        "GoVara 26C render error:",
        error
      );


      mount.innerHTML = `

        <div class="notice danger">

          <b>
            26C Business Policies Error
          </b>

          <div>
            ${esc(error.message)}
          </div>

        </div>

      `;

    }

  }


  /* =======================================================
     PUBLIC API
     ======================================================= */

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

    save:
      save,

    reset:
      reset,

    reload:
      reload,

    validate:
      validateConfig,

    validateConfig:
      validateConfig,

    setPolicy:
      setPolicy,

    getAuditHistory:
      getAuditHistory,

    createAuditEvent:
      createAuditEvent,

    clearAuditHistory:
      clearAuditHistory

  };


})();

/* =========================================================
   END — GoVara 26C V2
   ========================================================= */
