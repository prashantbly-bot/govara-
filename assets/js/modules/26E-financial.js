/* =========================================================
   GoVara — 26E Financial Control V2
   ---------------------------------------------------------
   Frontend Financial Control / Safety Boundary

   IMPORTANT:
   - Frontend is NOT financial authority.
   - Backend remains financial authority.
   - Database remains authoritative data store.
   - Real Money = BLOCKED
   - Real Payment = BLOCKED
   - Bank Transfer = BLOCKED
   - No API / Backend / Database call in this module.
   - STEP 27 will own the API boundary later.
   ========================================================= */

window.GoVara26E = (function () {

  "use strict";

  const VERSION = "GOVARA-26E-V2";

  const STORAGE_KEY = "GOVARA_FINANCIAL_CONTROL_26E_V2";
  const AUDIT_KEY = "GOVARA_FINANCIAL_CONTROL_AUDIT_26E_V2";

  const LEGACY_STORAGE_KEY = "GOVARA_FINANCIAL_CONTROL_26E_V1";

  /* ---------------------------------------------------------
     Default Configuration
     --------------------------------------------------------- */

  const DEFAULT_CONFIG = {

    version: VERSION,

    environment: "TESTING",

    /* =======================================================
       1. FINANCIAL ENVIRONMENT
       ======================================================= */

    financialEnvironment: {
      mode: "TESTING",
      demoModeEnabled: true,
      productionFinancialExecutionEnabled: false
    },

    /* =======================================================
       2. GLOBAL FINANCIAL SAFETY
       ======================================================= */

    financialSafety: {

      realMoney: false,

      realPayment: false,

      bankTransfer: false,

      cashSettlement: false,

      frontendFinancialAuthority: false,

      backendFinancialAuthority: true,

      backendTransactionAuthority: true,

      backendLedgerAuthority: true,

      backendSettlementAuthority: true,

      backendBillingAuthority: true,

      backendRefundAuthority: true,

      financialExecutionFromFrontend: false
    },

    /* =======================================================
       3. WALLET CONTROL
       ======================================================= */

    wallet: {

      enabled: true,

      customerWalletEnabled: true,

      vendorWalletEnabled: true,

      driverWalletEnabled: true,

      balanceViewEnabled: true,

      transactionHistoryEnabled: true,

      demoAddMoneyEnabled: true,

      demoWithdrawEnabled: true,

      walletAdjustmentEnabled: false,

      negativeBalanceAllowed: false,

      backendBalanceAuthority: true,

      backendWalletPostingAuthority: true
    },

    /* =======================================================
       4. TRANSACTION CONTROL
       ======================================================= */

    transaction: {

      enabled: true,

      creditEnabled: true,

      debitEnabled: true,

      refundEnabled: true,

      reversalEnabled: true,

      transactionHistoryEnabled: true,

      duplicateProtectionEnabled: true,

      idempotencyRequired: true,

      frontendPostingAllowed: false,

      backendPostingRequired: true,

      backendStatusAuthority: true
    },

    /* =======================================================
       5. FARE / BILL / TRANSACTION BOUNDARY
       ======================================================= */

    fareBillingBoundary: {

      fareEstimateEnabled: true,

      fareEstimateDisplayOnly: true,

      finalFareBackendControlled: true,

      finalBillBackendControlled: true,

      transactionBackendControlled: true,

      customerCanViewEstimate: true,

      customerCanViewFinalBill: true,

      frontendCanOverrideFinalFare: false,

      frontendCanOverrideFinalBill: false,

      frontendCanPostTransaction: false
    },

    /* =======================================================
       6. ADVANCE / PAYMENT CONTROL
       ======================================================= */

    advancePayment: {

      advanceEnabled: true,

      minimumPercent: 0,

      maximumPercent: 100,

      defaultPercent: 20,

      paymentDisplayEnabled: true,

      paymentExecutionEnabled: false,

      realPaymentExecutionEnabled: false,

      advanceAdjustmentEnabled: true,

      advanceRefundEnabled: true,

      backendAdvanceAuthority: true,

      backendPaymentAuthority: true
    },

    /* =======================================================
       7. REFUND CONTROL
       ======================================================= */

    refund: {

      enabled: true,

      refundRequestEnabled: true,

      refundEligibilityCheckEnabled: true,

      refundApprovalRequired: true,

      automaticRefundApproval: false,

      frontendRefundExecution: false,

      backendRefundExecution: true,

      refundToWalletAllowed: true,

      refundToOriginalPaymentAllowed: false,

      bankRefundAllowed: false
    },

    /* =======================================================
       8. LEDGER CONTROL
       ======================================================= */

    ledger: {

      enabled: true,

      customerLedgerViewEnabled: true,

      vendorLedgerViewEnabled: true,

      driverLedgerViewEnabled: true,

      ledgerHistoryEnabled: true,

      frontendLedgerPosting: false,

      frontendLedgerAdjustment: false,

      backendLedgerPosting: true,

      backendLedgerAuthority: true,

      immutablePostingRequired: true
    },

    /* =======================================================
       9. SETTLEMENT CONTROL
       ======================================================= */

    settlement: {

      enabled: true,

      vendorSettlementEnabled: true,

      driverSettlementEnabled: true,

      settlementViewEnabled: true,

      settlementCalculationEnabled: true,

      frontendSettlementCalculationOnly: true,

      frontendSettlementPosting: false,

      settlementApprovalRequired: true,

      automaticSettlementApproval: false,

      backendSettlementCalculation: true,

      backendSettlementPosting: true,

      bankSettlementEnabled: false
    },

    /* =======================================================
       10. BILLING CONTROL
       ======================================================= */

    billing: {

      enabled: true,

      customerBillingEnabled: true,

      vendorBillingEnabled: true,

      driverBillingEnabled: true,

      invoiceViewEnabled: true,

      billingHistoryEnabled: true,

      invoiceGenerationEnabled: true,

      frontendInvoiceGeneration: false,

      backendInvoiceGeneration: true,

      finalBillAuthorityBackend: true
    },

    /* =======================================================
       11. FINANCIAL LIMITS
       ======================================================= */

    limits: {

      minimumTransactionAmount: 0,

      maximumTransactionAmount: 100000,

      maximumWalletBalance: 1000000,

      maximumDemoAddMoney: 100000,

      maximumDemoWithdraw: 100000,

      maximumRefundAmount: 100000,

      negativeBalanceAllowed: false,

      duplicateTransactionProtection: true,

      idempotencyRequired: true
    },

    /* =======================================================
       12. FINANCIAL SAFETY RULES
       ======================================================= */

    safetyRules: {

      blockRealMoney: true,

      blockRealPayment: true,

      blockBankTransfer: true,

      blockFrontendPosting: true,

      requireBackendAuthority: true,

      requireBackendValidation: true,

      requireBackendTransactionPosting: true,

      requireBackendLedgerPosting: true,

      requireBackendSettlementPosting: true,

      requireBackendBillingAuthority: true,

      requireAuditTrail: true,

      preventNegativeBalance: true,

      preventDuplicateTransaction: true,

      requireIdempotency: true
    },

    /* =======================================================
       13. AUDIT
       ======================================================= */

    audit: {

      enabled: true,

      localHistoryEnabled: true,

      maxLocalEvents: 100
    }
  };


  /* ---------------------------------------------------------
     Utility
     --------------------------------------------------------- */

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

  function loadConfig() {

    let stored = null;

    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch (error) {
      stored = null;
    }

    /*
     * Optional legacy migration.
     * We never trust legacy safety flags over current V2 defaults.
     */
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


  /* ---------------------------------------------------------
     Safety Enforcement
     --------------------------------------------------------- */

  function enforceSafety(config) {

    config.version = VERSION;

    config.environment = "TESTING";

    /* Global financial locks */
    config.financialEnvironment.mode = "TESTING";
    config.financialEnvironment.demoModeEnabled = true;
    config.financialEnvironment.productionFinancialExecutionEnabled = false;

    config.financialSafety.realMoney = false;
    config.financialSafety.realPayment = false;
    config.financialSafety.bankTransfer = false;
    config.financialSafety.cashSettlement = false;

    config.financialSafety.frontendFinancialAuthority = false;
    config.financialSafety.backendFinancialAuthority = true;

    config.financialSafety.backendTransactionAuthority = true;
    config.financialSafety.backendLedgerAuthority = true;
    config.financialSafety.backendSettlementAuthority = true;
    config.financialSafety.backendBillingAuthority = true;
    config.financialSafety.backendRefundAuthority = true;

    config.financialSafety.financialExecutionFromFrontend = false;

    /* Wallet */
    config.wallet.walletAdjustmentEnabled = false;
    config.wallet.backendBalanceAuthority = true;
    config.wallet.backendWalletPostingAuthority = true;

    /* Transaction */
    config.transaction.frontendPostingAllowed = false;
    config.transaction.backendPostingRequired = true;
    config.transaction.backendStatusAuthority = true;

    /* Fare / Billing */
    config.fareBillingBoundary.fareEstimateDisplayOnly = true;
    config.fareBillingBoundary.finalFareBackendControlled = true;
    config.fareBillingBoundary.finalBillBackendControlled = true;
    config.fareBillingBoundary.transactionBackendControlled = true;
    config.fareBillingBoundary.frontendCanOverrideFinalFare = false;
    config.fareBillingBoundary.frontendCanOverrideFinalBill = false;
    config.fareBillingBoundary.frontendCanPostTransaction = false;

    /* Payment */
    config.advancePayment.paymentExecutionEnabled = false;
    config.advancePayment.realPaymentExecutionEnabled = false;
    config.advancePayment.backendAdvanceAuthority = true;
    config.advancePayment.backendPaymentAuthority = true;

    /* Refund */
    config.refund.frontendRefundExecution = false;
    config.refund.backendRefundExecution = true;
    config.refund.refundToOriginalPaymentAllowed = false;
    config.refund.bankRefundAllowed = false;

    /* Ledger */
    config.ledger.frontendLedgerPosting = false;
    config.ledger.frontendLedgerAdjustment = false;
    config.ledger.backendLedgerPosting = true;
    config.ledger.backendLedgerAuthority = true;

    /* Settlement */
    config.settlement.frontendSettlementPosting = false;
    config.settlement.backendSettlementCalculation = true;
    config.settlement.backendSettlementPosting = true;
    config.settlement.bankSettlementEnabled = false;

    /* Billing */
    config.billing.frontendInvoiceGeneration = false;
    config.billing.backendInvoiceGeneration = true;
    config.billing.finalBillAuthorityBackend = true;

    /* Limits */
    config.limits.negativeBalanceAllowed = false;

    /* Safety rules */
    config.safetyRules.blockRealMoney = true;
    config.safetyRules.blockRealPayment = true;
    config.safetyRules.blockBankTransfer = true;
    config.safetyRules.blockFrontendPosting = true;

    config.safetyRules.requireBackendAuthority = true;
    config.safetyRules.requireBackendValidation = true;
    config.safetyRules.requireBackendTransactionPosting = true;
    config.safetyRules.requireBackendLedgerPosting = true;
    config.safetyRules.requireBackendSettlementPosting = true;
    config.safetyRules.requireBackendBillingAuthority = true;

    config.safetyRules.preventNegativeBalance = true;
    config.safetyRules.preventDuplicateTransaction = true;
    config.safetyRules.requireIdempotency = true;

    return config;
  }


  /* ---------------------------------------------------------
     Validation
     --------------------------------------------------------- */

  function validateConfig(input) {

    const config = deepClone(input || loadConfig());

    const errors = [];
    const warnings = [];

    /* Environment */
    if (config.environment !== "TESTING") {
      errors.push("Financial environment must remain TESTING.");
    }

    if (config.financialEnvironment.mode !== "TESTING") {
      errors.push("Financial mode must remain TESTING.");
    }

    if (config.financialEnvironment.productionFinancialExecutionEnabled) {
      errors.push("Production financial execution must remain disabled.");
    }

    /* Authority */
    if (config.financialSafety.frontendFinancialAuthority !== false) {
      errors.push("Frontend financial authority must be FALSE.");
    }

    if (config.financialSafety.backendFinancialAuthority !== true) {
      errors.push("Backend financial authority must be TRUE.");
    }

    if (config.financialSafety.backendTransactionAuthority !== true) {
      errors.push("Backend transaction authority must be TRUE.");
    }

    if (config.financialSafety.backendLedgerAuthority !== true) {
      errors.push("Backend ledger authority must be TRUE.");
    }

    if (config.financialSafety.backendSettlementAuthority !== true) {
      errors.push("Backend settlement authority must be TRUE.");
    }

    if (config.financialSafety.backendBillingAuthority !== true) {
      errors.push("Backend billing authority must be TRUE.");
    }

    if (config.financialSafety.backendRefundAuthority !== true) {
      errors.push("Backend refund authority must be TRUE.");
    }

    /* Real-money safety */
    if (config.financialSafety.realMoney !== false) {
      errors.push("Real Money must remain BLOCKED.");
    }

    if (config.financialSafety.realPayment !== false) {
      errors.push("Real Payment must remain BLOCKED.");
    }

    if (config.financialSafety.bankTransfer !== false) {
      errors.push("Bank Transfer must remain BLOCKED.");
    }

    if (config.financialSafety.cashSettlement !== false) {
      errors.push("Cash settlement must remain BLOCKED.");
    }

    if (config.financialSafety.financialExecutionFromFrontend !== false) {
      errors.push("Frontend financial execution must remain disabled.");
    }

    /* Wallet */
    if (config.wallet.negativeBalanceAllowed !== false) {
      errors.push("Negative wallet balance must remain disabled.");
    }

    if (config.wallet.backendBalanceAuthority !== true) {
      errors.push("Backend wallet balance authority is required.");
    }

    /* Transactions */
    if (config.transaction.frontendPostingAllowed !== false) {
      errors.push("Frontend transaction posting must remain disabled.");
    }

    if (config.transaction.backendPostingRequired !== true) {
      errors.push("Backend transaction posting is required.");
    }

    if (config.transaction.idempotencyRequired !== true) {
      errors.push("Transaction idempotency is required.");
    }

    /* Fare / Bill */
    if (config.fareBillingBoundary.finalFareBackendControlled !== true) {
      errors.push("Final fare must be backend controlled.");
    }

    if (config.fareBillingBoundary.finalBillBackendControlled !== true) {
      errors.push("Final bill must be backend controlled.");
    }

    if (config.fareBillingBoundary.transactionBackendControlled !== true) {
      errors.push("Transaction must be backend controlled.");
    }

    if (config.fareBillingBoundary.frontendCanOverrideFinalFare !== false) {
      errors.push("Frontend cannot override final fare.");
    }

    if (config.fareBillingBoundary.frontendCanOverrideFinalBill !== false) {
      errors.push("Frontend cannot override final bill.");
    }

    if (config.fareBillingBoundary.frontendCanPostTransaction !== false) {
      errors.push("Frontend cannot post transactions.");
    }

    /* Advance */
    const minAdvance = Number(config.advancePayment.minimumPercent);
    const maxAdvance = Number(config.advancePayment.maximumPercent);
    const defaultAdvance = Number(config.advancePayment.defaultPercent);

    if (
      !Number.isFinite(minAdvance) ||
      !Number.isFinite(maxAdvance) ||
      !Number.isFinite(defaultAdvance)
    ) {
      errors.push("Advance percentages must be valid numbers.");
    } else {

      if (minAdvance < 0 || minAdvance > 100) {
        errors.push("Minimum advance must be between 0 and 100.");
      }

      if (maxAdvance < 0 || maxAdvance > 100) {
        errors.push("Maximum advance must be between 0 and 100.");
      }

      if (minAdvance > maxAdvance) {
        errors.push("Minimum advance cannot exceed maximum advance.");
      }

      if (
        defaultAdvance < minAdvance ||
        defaultAdvance > maxAdvance
      ) {
        errors.push(
          "Default advance must be within minimum and maximum advance."
        );
      }
    }

    if (config.advancePayment.paymentExecutionEnabled !== false) {
      errors.push("Payment execution must remain disabled.");
    }

    if (config.advancePayment.realPaymentExecutionEnabled !== false) {
      errors.push("Real payment execution must remain disabled.");
    }

    /* Refund */
    if (config.refund.frontendRefundExecution !== false) {
      errors.push("Frontend refund execution must remain disabled.");
    }

    if (config.refund.backendRefundExecution !== true) {
      errors.push("Backend refund execution must remain enabled.");
    }

    if (config.refund.bankRefundAllowed !== false) {
      errors.push("Bank refund must remain disabled.");
    }

    /* Ledger */
    if (config.ledger.frontendLedgerPosting !== false) {
      errors.push("Frontend ledger posting must remain disabled.");
    }

    if (config.ledger.frontendLedgerAdjustment !== false) {
      errors.push("Frontend ledger adjustment must remain disabled.");
    }

    if (config.ledger.backendLedgerPosting !== true) {
      errors.push("Backend ledger posting is required.");
    }

    /* Settlement */
    if (config.settlement.frontendSettlementPosting !== false) {
      errors.push("Frontend settlement posting must remain disabled.");
    }

    if (config.settlement.backendSettlementPosting !== true) {
      errors.push("Backend settlement posting is required.");
    }

    if (config.settlement.bankSettlementEnabled !== false) {
      errors.push("Bank settlement must remain disabled.");
    }

    /* Billing */
    if (config.billing.frontendInvoiceGeneration !== false) {
      errors.push("Frontend invoice generation must remain disabled.");
    }

    if (config.billing.backendInvoiceGeneration !== true) {
      errors.push("Backend invoice generation must remain enabled.");
    }

    if (config.billing.finalBillAuthorityBackend !== true) {
      errors.push("Backend must remain final billing authority.");
    }

    /* Limits */
    const minimum = Number(config.limits.minimumTransactionAmount);
    const maximum = Number(config.limits.maximumTransactionAmount);

    if (!Number.isFinite(minimum) || !Number.isFinite(maximum)) {
      errors.push("Transaction limits must be valid numbers.");
    } else {

      if (minimum < 0) {
        errors.push("Minimum transaction amount cannot be negative.");
      }

      if (maximum <= 0) {
        errors.push("Maximum transaction amount must be greater than zero.");
      }

      if (minimum > maximum) {
        errors.push(
          "Minimum transaction amount cannot exceed maximum transaction amount."
        );
      }
    }

    /* Safety */
    const safety = config.safetyRules;

    if (safety.blockRealMoney !== true) {
      errors.push("Real Money safety lock must be enabled.");
    }

    if (safety.blockRealPayment !== true) {
      errors.push("Real Payment safety lock must be enabled.");
    }

    if (safety.blockBankTransfer !== true) {
      errors.push("Bank Transfer safety lock must be enabled.");
    }

    if (safety.blockFrontendPosting !== true) {
      errors.push("Frontend posting safety lock must be enabled.");
    }

    if (safety.requireBackendAuthority !== true) {
      errors.push("Backend authority requirement must be enabled.");
    }

    if (safety.requireBackendValidation !== true) {
      errors.push("Backend validation requirement must be enabled.");
    }

    if (safety.requireBackendTransactionPosting !== true) {
      errors.push("Backend transaction posting requirement must be enabled.");
    }

    if (safety.requireBackendLedgerPosting !== true) {
      errors.push("Backend ledger posting requirement must be enabled.");
    }

    if (safety.requireBackendSettlementPosting !== true) {
      errors.push("Backend settlement posting requirement must be enabled.");
    }

    if (safety.requireBackendBillingAuthority !== true) {
      errors.push("Backend billing authority requirement must be enabled.");
    }

    if (safety.preventNegativeBalance !== true) {
      errors.push("Negative balance protection must be enabled.");
    }

    if (safety.preventDuplicateTransaction !== true) {
      errors.push("Duplicate transaction protection must be enabled.");
    }

    if (safety.requireIdempotency !== true) {
      errors.push("Idempotency requirement must be enabled.");
    }

    if (errors.length === 0) {
      warnings.push(
        "Frontend financial controls are configuration-only. Backend remains authoritative."
      );
    }

    return {
      valid: errors.length === 0,
      errors: errors,
      warnings: warnings
    };
  }


  /* ---------------------------------------------------------
     Audit
     --------------------------------------------------------- */

  function getAudit() {

    try {
      const data = JSON.parse(
        localStorage.getItem(AUDIT_KEY) || "[]"
      );

      return Array.isArray(data) ? data : [];

    } catch (error) {
      return [];
    }
  }

  function writeAudit(action, details) {

    const config = loadConfig();

    if (!config.audit.enabled || !config.audit.localHistoryEnabled) {
      return;
    }

    const events = getAudit();

    events.unshift({
      id:
        "26E-" +
        Date.now() +
        "-" +
        Math.random().toString(36).slice(2, 8),

      module: "26E",

      action: action,

      timestamp: new Date().toISOString(),

      details: details || {}
    });

    const limit = Number(config.audit.maxLocalEvents) || 100;

    try {
      localStorage.setItem(
        AUDIT_KEY,
        JSON.stringify(events.slice(0, limit))
      );
    } catch (error) {
      /* Ignore localStorage failure */
    }
  }


  /* ---------------------------------------------------------
     Public Configuration Methods
     --------------------------------------------------------- */

  function getConfig() {
    return deepClone(loadConfig());
  }

  function save(config) {

    const candidate = deepClone(config || loadConfig());

    enforceSafety(candidate);

    const validation = validateConfig(candidate);

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

      writeAudit("FINANCIAL_CONFIG_SAVE", {
        version: VERSION
      });

      return {
        success: true,
        saved: true,
        validation: validation,
        config: deepClone(candidate)
      };

    } catch (error) {

      return {
        success: false,
        saved: false,
        validation: validation,
        error: error.message
      };
    }
  }


  function reset() {

    const config = deepClone(DEFAULT_CONFIG);

    enforceSafety(config);

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(config)
      );

      writeAudit("FINANCIAL_CONFIG_RESET", {
        version: VERSION
      });

      return {
        success: true,
        config: deepClone(config)
      };

    } catch (error) {

      return {
        success: false,
        error: error.message
      };
    }
  }


  function reload() {

    const config = loadConfig();

    writeAudit("FINANCIAL_CONFIG_RELOAD", {
      version: VERSION
    });

    return deepClone(config);
  }


  function setPolicy(path, value) {

    const config = loadConfig();

    const parts = String(path || "")
      .split(".")
      .filter(Boolean);

    if (!parts.length) {
      return {
        success: false,
        error: "Invalid policy path."
      };
    }

    let cursor = config;

    for (let i = 0; i < parts.length - 1; i++) {

      if (
        !cursor[parts[i]] ||
        typeof cursor[parts[i]] !== "object"
      ) {
        cursor[parts[i]] = {};
      }

      cursor = cursor[parts[i]];
    }

    cursor[parts[parts.length - 1]] = value;

    return save(config);
  }


  /* ---------------------------------------------------------
     Financial Safety Status
     --------------------------------------------------------- */

  function getSafetyStatus() {

    const config = loadConfig();

    return {

      environment: config.environment,

      realMoneyBlocked:
        config.financialSafety.realMoney === false,

      realPaymentBlocked:
        config.financialSafety.realPayment === false,

      bankTransferBlocked:
        config.financialSafety.bankTransfer === false,

      frontendFinancialAuthority:
        config.financialSafety.frontendFinancialAuthority,

      backendFinancialAuthority:
        config.financialSafety.backendFinancialAuthority,

      frontendPostingBlocked:
        config.safetyRules.blockFrontendPosting,

      backendTransactionAuthority:
        config.financialSafety.backendTransactionAuthority,

      backendLedgerAuthority:
        config.financialSafety.backendLedgerAuthority,

      backendSettlementAuthority:
        config.financialSafety.backendSettlementAuthority,

      backendBillingAuthority:
        config.financialSafety.backendBillingAuthority,

      backendRefundAuthority:
        config.financialSafety.backendRefundAuthority
    };
  }


  /* ---------------------------------------------------------
     UI Helpers
     --------------------------------------------------------- */

  function escapeHtml(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function checked(value) {
    return value ? "checked" : "";
  }


  function numberValue(value) {

    return escapeHtml(
      Number.isFinite(Number(value)) ? Number(value) : 0
    );
  }


  function checkbox(path, label, value) {

    return `
      <label class="govara26e-check">
        <input
          type="checkbox"
          data-26e-path="${escapeHtml(path)}"
          ${checked(value)}
        >
        <span>${escapeHtml(label)}</span>
      </label>
    `;
  }


  function numberInput(path, label, value, min, max, step) {

    return `
      <label class="govara26e-field">
        <span>${escapeHtml(label)}</span>
        <input
          type="number"
          data-26e-path="${escapeHtml(path)}"
          value="${numberValue(value)}"
          min="${min}"
          max="${max}"
          step="${step || "1"}"
        >
      </label>
    `;
  }


  function section(title, description, content) {

    return `
      <section class="card govara26e-section">
        <div class="govara26e-section-head">
          <div>
            <h2>${escapeHtml(title)}</h2>
            <div class="muted">
              ${escapeHtml(description)}
            </div>
          </div>
        </div>

        <div class="govara26e-section-body">
          ${content}
        </div>
      </section>
    `;
  }


  /* ---------------------------------------------------------
     Render
     --------------------------------------------------------- */

  function render() {

    const config = loadConfig();

    const validation = validateConfig(config);

    return `

      <div class="page-head">
        <h1>26E — Financial Control</h1>

        <div class="muted">
          Financial configuration and safety boundary.
          Backend remains the financial authority.
        </div>
      </div>


      <!-- ===================================================
           STATUS
           =================================================== -->

      <section class="card govara26e-status-card">

        <h2>Financial Control Status</h2>

        <div class="grid four">

          <div>
            <b>TESTING</b>
            <div class="muted">Environment</div>
          </div>

          <div>
            <b>REAL MONEY BLOCKED</b>
            <div class="muted">Money execution</div>
          </div>

          <div>
            <b>REAL PAYMENT BLOCKED</b>
            <div class="muted">Payment execution</div>
          </div>

          <div>
            <b>BANK TRANSFER BLOCKED</b>
            <div class="muted">Bank execution</div>
          </div>

        </div>

        <div class="notice warn govara26e-authority-notice">

          <strong>Authority Boundary</strong>

          <div>
            Frontend = Configuration / Display / Control
          </div>

          <div>
            Backend = Financial Authority
          </div>

          <div>
            Database = Authoritative Data Store
          </div>

        </div>

      </section>


      <!-- ===================================================
           1. FINANCIAL ENVIRONMENT
           =================================================== -->

      ${section(
        "1. Financial Environment",
        "Environment and production execution controls.",
        `

        <div class="grid two">

          <div>
            <label class="govara26e-field">
              <span>Environment</span>
              <select data-26e-path="environment">
                <option value="TESTING" selected>TESTING</option>
              </select>
            </label>
          </div>

          <div>
            ${checkbox(
              "financialEnvironment.demoModeEnabled",
              "Demo / Testing Mode Enabled",
              config.financialEnvironment.demoModeEnabled
            )}

            ${checkbox(
              "financialEnvironment.productionFinancialExecutionEnabled",
              "Production Financial Execution",
              config.financialEnvironment.productionFinancialExecutionEnabled
            )}
          </div>

        </div>

        `
      )}


      <!-- ===================================================
           2. GLOBAL SAFETY
           =================================================== -->

      ${section(
        "2. Global Financial Safety",
        "Non-negotiable financial execution boundaries.",
        `

        <div class="grid two">

          <div>
            ${checkbox(
              "financialSafety.realMoney",
              "Real Money",
              config.financialSafety.realMoney
            )}

            ${checkbox(
              "financialSafety.realPayment",
              "Real Payment",
              config.financialSafety.realPayment
            )}

            ${checkbox(
              "financialSafety.bankTransfer",
              "Bank Transfer",
              config.financialSafety.bankTransfer
            )}

            ${checkbox(
              "financialSafety.cashSettlement",
              "Cash Settlement",
              config.financialSafety.cashSettlement
            )}

            ${checkbox(
              "financialSafety.financialExecutionFromFrontend",
              "Financial Execution From Frontend",
              config.financialSafety.financialExecutionFromFrontend
            )}
          </div>

          <div>
            ${checkbox(
              "financialSafety.frontendFinancialAuthority",
              "Frontend Financial Authority",
              config.financialSafety.frontendFinancialAuthority
            )}

            ${checkbox(
              "financialSafety.backendFinancialAuthority",
              "Backend Financial Authority",
              config.financialSafety.backendFinancialAuthority
            )}

            ${checkbox(
              "financialSafety.backendTransactionAuthority",
              "Backend Transaction Authority",
              config.financialSafety.backendTransactionAuthority
            )}

            ${checkbox(
              "financialSafety.backendLedgerAuthority",
              "Backend Ledger Authority",
              config.financialSafety.backendLedgerAuthority
            )}

            ${checkbox(
              "financialSafety.backendSettlementAuthority",
              "Backend Settlement Authority",
              config.financialSafety.backendSettlementAuthority
            )}

            ${checkbox(
              "financialSafety.backendBillingAuthority",
              "Backend Billing Authority",
              config.financialSafety.backendBillingAuthority
            )}

            ${checkbox(
              "financialSafety.backendRefundAuthority",
              "Backend Refund Authority",
              config.financialSafety.backendRefundAuthority
            )}
          </div>

        </div>

        `
      )}


      <!-- ===================================================
           3. WALLET
           =================================================== -->

      ${section(
        "3. Wallet Control",
        "Wallet visibility and demo operations.",
        `

        <div class="grid two">

          <div>

            ${checkbox(
              "wallet.enabled",
              "Wallet Enabled",
              config.wallet.enabled
            )}

            ${checkbox(
              "wallet.customerWalletEnabled",
              "Customer Wallet",
              config.wallet.customerWalletEnabled
            )}

            ${checkbox(
              "wallet.vendorWalletEnabled",
              "Vendor Wallet",
              config.wallet.vendorWalletEnabled
            )}

            ${checkbox(
              "wallet.driverWalletEnabled",
              "Driver Wallet",
              config.wallet.driverWalletEnabled
            )}

            ${checkbox(
              "wallet.balanceViewEnabled",
              "Balance View",
              config.wallet.balanceViewEnabled
            )}

            ${checkbox(
              "wallet.transactionHistoryEnabled",
              "Transaction History",
              config.wallet.transactionHistoryEnabled
            )}

          </div>

          <div>

            ${checkbox(
              "wallet.demoAddMoneyEnabled",
              "Demo Add Money",
              config.wallet.demoAddMoneyEnabled
            )}

            ${checkbox(
              "wallet.demoWithdrawEnabled",
              "Demo Withdraw",
              config.wallet.demoWithdrawEnabled
            )}

            ${checkbox(
              "wallet.walletAdjustmentEnabled",
              "Wallet Adjustment",
              config.wallet.walletAdjustmentEnabled
            )}

            ${checkbox(
              "wallet.negativeBalanceAllowed",
              "Negative Balance Allowed",
              config.wallet.negativeBalanceAllowed
            )}

            ${checkbox(
              "wallet.backendBalanceAuthority",
              "Backend Balance Authority",
              config.wallet.backendBalanceAuthority
            )}

            ${checkbox(
              "wallet.backendWalletPostingAuthority",
              "Backend Wallet Posting Authority",
              config.wallet.backendWalletPostingAuthority
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           4. TRANSACTION
           =================================================== -->

      ${section(
        "4. Transaction Control",
        "Transaction lifecycle and posting authority.",
        `

        <div class="grid two">

          <div>

            ${checkbox(
              "transaction.enabled",
              "Transactions Enabled",
              config.transaction.enabled
            )}

            ${checkbox(
              "transaction.creditEnabled",
              "Credit",
              config.transaction.creditEnabled
            )}

            ${checkbox(
              "transaction.debitEnabled",
              "Debit",
              config.transaction.debitEnabled
            )}

            ${checkbox(
              "transaction.refundEnabled",
              "Refund",
              config.transaction.refundEnabled
            )}

            ${checkbox(
              "transaction.reversalEnabled",
              "Reversal",
              config.transaction.reversalEnabled
            )}

          </div>

          <div>

            ${checkbox(
              "transaction.transactionHistoryEnabled",
              "Transaction History",
              config.transaction.transactionHistoryEnabled
            )}

            ${checkbox(
              "transaction.duplicateProtectionEnabled",
              "Duplicate Protection",
              config.transaction.duplicateProtectionEnabled
            )}

            ${checkbox(
              "transaction.idempotencyRequired",
              "Idempotency Required",
              config.transaction.idempotencyRequired
            )}

            ${checkbox(
              "transaction.frontendPostingAllowed",
              "Frontend Posting Allowed",
              config.transaction.frontendPostingAllowed
            )}

            ${checkbox(
              "transaction.backendPostingRequired",
              "Backend Posting Required",
              config.transaction.backendPostingRequired
            )}

            ${checkbox(
              "transaction.backendStatusAuthority",
              "Backend Status Authority",
              config.transaction.backendStatusAuthority
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           5. FARE / BILLING BOUNDARY
           =================================================== -->

      ${section(
        "5. Fare → Bill → Transaction Boundary",
        "Frontend may display estimates; backend controls final financial truth.",
        `

        <div class="grid two">

          <div>

            ${checkbox(
              "fareBillingBoundary.fareEstimateEnabled",
              "Fare Estimate",
              config.fareBillingBoundary.fareEstimateEnabled
            )}

            ${checkbox(
              "fareBillingBoundary.fareEstimateDisplayOnly",
              "Fare Estimate Display Only",
              config.fareBillingBoundary.fareEstimateDisplayOnly
            )}

            ${checkbox(
              "fareBillingBoundary.customerCanViewEstimate",
              "Customer Can View Estimate",
              config.fareBillingBoundary.customerCanViewEstimate
            )}

            ${checkbox(
              "fareBillingBoundary.customerCanViewFinalBill",
              "Customer Can View Final Bill",
              config.fareBillingBoundary.customerCanViewFinalBill
            )}

          </div>

          <div>

            ${checkbox(
              "fareBillingBoundary.finalFareBackendControlled",
              "Final Fare — Backend Controlled",
              config.fareBillingBoundary.finalFareBackendControlled
            )}

            ${checkbox(
              "fareBillingBoundary.finalBillBackendControlled",
              "Final Bill — Backend Controlled",
              config.fareBillingBoundary.finalBillBackendControlled
            )}

            ${checkbox(
              "fareBillingBoundary.transactionBackendControlled",
              "Transaction — Backend Controlled",
              config.fareBillingBoundary.transactionBackendControlled
            )}

            ${checkbox(
              "fareBillingBoundary.frontendCanOverrideFinalFare",
              "Frontend Can Override Final Fare",
              config.fareBillingBoundary.frontendCanOverrideFinalFare
            )}

            ${checkbox(
              "fareBillingBoundary.frontendCanOverrideFinalBill",
              "Frontend Can Override Final Bill",
              config.fareBillingBoundary.frontendCanOverrideFinalBill
            )}

            ${checkbox(
              "fareBillingBoundary.frontendCanPostTransaction",
              "Frontend Can Post Transaction",
              config.fareBillingBoundary.frontendCanPostTransaction
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           6. ADVANCE / PAYMENT
           =================================================== -->

      ${section(
        "6. Advance & Payment Control",
        "Advance policy is configurable; actual payment execution remains blocked.",
        `

        <div class="grid two">

          <div>

            ${checkbox(
              "advancePayment.advanceEnabled",
              "Advance Enabled",
              config.advancePayment.advanceEnabled
            )}

            ${numberInput(
              "advancePayment.minimumPercent",
              "Minimum Advance %",
              config.advancePayment.minimumPercent,
              0,
              100,
              1
            )}

            ${numberInput(
              "advancePayment.maximumPercent",
              "Maximum Advance %",
              config.advancePayment.maximumPercent,
              0,
              100,
              1
            )}

            ${numberInput(
              "advancePayment.defaultPercent",
              "Default Advance %",
              config.advancePayment.defaultPercent,
              0,
              100,
              1
            )}

            ${checkbox(
              "advancePayment.advanceAdjustmentEnabled",
              "Advance Adjustment",
              config.advancePayment.advanceAdjustmentEnabled
            )}

            ${checkbox(
              "advancePayment.advanceRefundEnabled",
              "Advance Refund",
              config.advancePayment.advanceRefundEnabled
            )}

          </div>

          <div>

            ${checkbox(
              "advancePayment.paymentDisplayEnabled",
              "Payment Display",
              config.advancePayment.paymentDisplayEnabled
            )}

            ${checkbox(
              "advancePayment.paymentExecutionEnabled",
              "Payment Execution",
              config.advancePayment.paymentExecutionEnabled
            )}

            ${checkbox(
              "advancePayment.realPaymentExecutionEnabled",
              "Real Payment Execution",
              config.advancePayment.realPaymentExecutionEnabled
            )}

            ${checkbox(
              "advancePayment.backendAdvanceAuthority",
              "Backend Advance Authority",
              config.advancePayment.backendAdvanceAuthority
            )}

            ${checkbox(
              "advancePayment.backendPaymentAuthority",
              "Backend Payment Authority",
              config.advancePayment.backendPaymentAuthority
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           7. REFUND
           =================================================== -->

      ${section(
        "7. Refund Control",
        "Refund requests may be configured, but execution remains backend controlled.",
        `

        <div class="grid two">

          <div>

            ${checkbox(
              "refund.enabled",
              "Refund Enabled",
              config.refund.enabled
            )}

            ${checkbox(
              "refund.refundRequestEnabled",
              "Refund Request",
              config.refund.refundRequestEnabled
            )}

            ${checkbox(
              "refund.refundEligibilityCheckEnabled",
              "Refund Eligibility Check",
              config.refund.refundEligibilityCheckEnabled
            )}

            ${checkbox(
              "refund.refundApprovalRequired",
              "Refund Approval Required",
              config.refund.refundApprovalRequired
            )}

            ${checkbox(
              "refund.automaticRefundApproval",
              "Automatic Refund Approval",
              config.refund.automaticRefundApproval
            )}

          </div>

          <div>

            ${checkbox(
              "refund.frontendRefundExecution",
              "Frontend Refund Execution",
              config.refund.frontendRefundExecution
            )}

            ${checkbox(
              "refund.backendRefundExecution",
              "Backend Refund Execution",
              config.refund.backendRefundExecution
            )}

            ${checkbox(
              "refund.refundToWalletAllowed",
              "Refund to Wallet",
              config.refund.refundToWalletAllowed
            )}

            ${checkbox(
              "refund.refundToOriginalPaymentAllowed",
              "Refund to Original Payment",
              config.refund.refundToOriginalPaymentAllowed
            )}

            ${checkbox(
              "refund.bankRefundAllowed",
              "Bank Refund",
              config.refund.bankRefundAllowed
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           8. LEDGER
           =================================================== -->

      ${section(
        "8. Ledger Control",
        "Ledger is viewable from frontend but posting remains backend controlled.",
        `

        <div class="grid two">

          <div>

            ${checkbox(
              "ledger.enabled",
              "Ledger Enabled",
              config.ledger.enabled
            )}

            ${checkbox(
              "ledger.customerLedgerViewEnabled",
              "Customer Ledger View",
              config.ledger.customerLedgerViewEnabled
            )}

            ${checkbox(
              "ledger.vendorLedgerViewEnabled",
              "Vendor Ledger View",
              config.ledger.vendorLedgerViewEnabled
            )}

            ${checkbox(
              "ledger.driverLedgerViewEnabled",
              "Driver Ledger View",
              config.ledger.driverLedgerViewEnabled
            )}

            ${checkbox(
              "ledger.ledgerHistoryEnabled",
              "Ledger History",
              config.ledger.ledgerHistoryEnabled
            )}

          </div>

          <div>

            ${checkbox(
              "ledger.frontendLedgerPosting",
              "Frontend Ledger Posting",
              config.ledger.frontendLedgerPosting
            )}

            ${checkbox(
              "ledger.frontendLedgerAdjustment",
              "Frontend Ledger Adjustment",
              config.ledger.frontendLedgerAdjustment
            )}

            ${checkbox(
              "ledger.backendLedgerPosting",
              "Backend Ledger Posting",
              config.ledger.backendLedgerPosting
            )}

            ${checkbox(
              "ledger.backendLedgerAuthority",
              "Backend Ledger Authority",
              config.ledger.backendLedgerAuthority
            )}

            ${checkbox(
              "ledger.immutablePostingRequired",
              "Immutable Posting Required",
              config.ledger.immutablePostingRequired
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           9. SETTLEMENT
           =================================================== -->

      ${section(
        "9. Settlement Control",
        "Vendor and Driver settlement controls.",
        `

        <div class="grid two">

          <div>

            ${checkbox(
              "settlement.enabled",
              "Settlement Enabled",
              config.settlement.enabled
            )}

            ${checkbox(
              "settlement.vendorSettlementEnabled",
              "Vendor Settlement",
              config.settlement.vendorSettlementEnabled
            )}

            ${checkbox(
              "settlement.driverSettlementEnabled",
              "Driver Settlement",
              config.settlement.driverSettlementEnabled
            )}

            ${checkbox(
              "settlement.settlementViewEnabled",
              "Settlement View",
              config.settlement.settlementViewEnabled
            )}

            ${checkbox(
              "settlement.settlementCalculationEnabled",
              "Settlement Calculation",
              config.settlement.settlementCalculationEnabled
            )}

          </div>

          <div>

            ${checkbox(
              "settlement.frontendSettlementCalculationOnly",
              "Frontend Calculation Only",
              config.settlement.frontendSettlementCalculationOnly
            )}

            ${checkbox(
              "settlement.frontendSettlementPosting",
              "Frontend Settlement Posting",
              config.settlement.frontendSettlementPosting
            )}

            ${checkbox(
              "settlement.settlementApprovalRequired",
              "Settlement Approval Required",
              config.settlement.settlementApprovalRequired
            )}

            ${checkbox(
              "settlement.automaticSettlementApproval",
              "Automatic Settlement Approval",
              config.settlement.automaticSettlementApproval
            )}

            ${checkbox(
              "settlement.backendSettlementCalculation",
              "Backend Settlement Calculation",
              config.settlement.backendSettlementCalculation
            )}

            ${checkbox(
              "settlement.backendSettlementPosting",
              "Backend Settlement Posting",
              config.settlement.backendSettlementPosting
            )}

            ${checkbox(
              "settlement.bankSettlementEnabled",
              "Bank Settlement",
              config.settlement.bankSettlementEnabled
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           10. BILLING
           =================================================== -->

      ${section(
        "10. Billing Control",
        "Customer, Vendor and Driver billing visibility and authority.",
        `

        <div class="grid two">

          <div>

            ${checkbox(
              "billing.enabled",
              "Billing Enabled",
              config.billing.enabled
            )}

            ${checkbox(
              "billing.customerBillingEnabled",
              "Customer Billing",
              config.billing.customerBillingEnabled
            )}

            ${checkbox(
              "billing.vendorBillingEnabled",
              "Vendor Billing",
              config.billing.vendorBillingEnabled
            )}

            ${checkbox(
              "billing.driverBillingEnabled",
              "Driver Billing",
              config.billing.driverBillingEnabled
            )}

            ${checkbox(
              "billing.invoiceViewEnabled",
              "Invoice View",
              config.billing.invoiceViewEnabled
            )}

            ${checkbox(
              "billing.billingHistoryEnabled",
              "Billing History",
              config.billing.billingHistoryEnabled
            )}

          </div>

          <div>

            ${checkbox(
              "billing.invoiceGenerationEnabled",
              "Invoice Generation",
              config.billing.invoiceGenerationEnabled
            )}

            ${checkbox(
              "billing.frontendInvoiceGeneration",
              "Frontend Invoice Generation",
              config.billing.frontendInvoiceGeneration
            )}

            ${checkbox(
              "billing.backendInvoiceGeneration",
              "Backend Invoice Generation",
              config.billing.backendInvoiceGeneration
            )}

            ${checkbox(
              "billing.finalBillAuthorityBackend",
              "Final Bill Authority — Backend",
              config.billing.finalBillAuthorityBackend
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           11. LIMITS
           =================================================== -->

      ${section(
        "11. Financial Limits",
        "Safety limits for testing and controlled financial operations.",
        `

        <div class="grid two">

          <div>

            ${numberInput(
              "limits.minimumTransactionAmount",
              "Minimum Transaction Amount (₹)",
              config.limits.minimumTransactionAmount,
              0,
              100000000,
              1
            )}

            ${numberInput(
              "limits.maximumTransactionAmount",
              "Maximum Transaction Amount (₹)",
              config.limits.maximumTransactionAmount,
              1,
              100000000,
              1
            )}

            ${numberInput(
              "limits.maximumWalletBalance",
              "Maximum Wallet Balance (₹)",
              config.limits.maximumWalletBalance,
              0,
              1000000000,
              1
            )}

          </div>

          <div>

            ${numberInput(
              "limits.maximumDemoAddMoney",
              "Maximum Demo Add Money (₹)",
              config.limits.maximumDemoAddMoney,
              0,
              100000000,
              1
            )}

            ${numberInput(
              "limits.maximumDemoWithdraw",
              "Maximum Demo Withdraw (₹)",
              config.limits.maximumDemoWithdraw,
              0,
              100000000,
              1
            )}

            ${numberInput(
              "limits.maximumRefundAmount",
              "Maximum Refund Amount (₹)",
              config.limits.maximumRefundAmount,
              0,
              100000000,
              1
            )}

            ${checkbox(
              "limits.negativeBalanceAllowed",
              "Negative Balance Allowed",
              config.limits.negativeBalanceAllowed
            )}

            ${checkbox(
              "limits.duplicateTransactionProtection",
              "Duplicate Transaction Protection",
              config.limits.duplicateTransactionProtection
            )}

            ${checkbox(
              "limits.idempotencyRequired",
              "Idempotency Required",
              config.limits.idempotencyRequired
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           12. SAFETY RULES
           =================================================== -->

      ${section(
        "12. Financial Safety Rules",
        "Mandatory safety gates that protect the backend authority boundary.",
        `

        <div class="grid two">

          <div>

            ${checkbox(
              "safetyRules.blockRealMoney",
              "Block Real Money",
              config.safetyRules.blockRealMoney
            )}

            ${checkbox(
              "safetyRules.blockRealPayment",
              "Block Real Payment",
              config.safetyRules.blockRealPayment
            )}

            ${checkbox(
              "safetyRules.blockBankTransfer",
              "Block Bank Transfer",
              config.safetyRules.blockBankTransfer
            )}

            ${checkbox(
              "safetyRules.blockFrontendPosting",
              "Block Frontend Posting",
              config.safetyRules.blockFrontendPosting
            )}

            ${checkbox(
              "safetyRules.requireBackendAuthority",
              "Require Backend Authority",
              config.safetyRules.requireBackendAuthority
            )}

            ${checkbox(
              "safetyRules.requireBackendValidation",
              "Require Backend Validation",
              config.safetyRules.requireBackendValidation
            )}

          </div>

          <div>

            ${checkbox(
              "safetyRules.requireBackendTransactionPosting",
              "Require Backend Transaction Posting",
              config.safetyRules.requireBackendTransactionPosting
            )}

            ${checkbox(
              "safetyRules.requireBackendLedgerPosting",
              "Require Backend Ledger Posting",
              config.safetyRules.requireBackendLedgerPosting
            )}

            ${checkbox(
              "safetyRules.requireBackendSettlementPosting",
              "Require Backend Settlement Posting",
              config.safetyRules.requireBackendSettlementPosting
            )}

            ${checkbox(
              "safetyRules.requireBackendBillingAuthority",
              "Require Backend Billing Authority",
              config.safetyRules.requireBackendBillingAuthority
            )}

            ${checkbox(
              "safetyRules.preventNegativeBalance",
              "Prevent Negative Balance",
              config.safetyRules.preventNegativeBalance
            )}

            ${checkbox(
              "safetyRules.preventDuplicateTransaction",
              "Prevent Duplicate Transaction",
              config.safetyRules.preventDuplicateTransaction
            )}

            ${checkbox(
              "safetyRules.requireIdempotency",
              "Require Idempotency",
              config.safetyRules.requireIdempotency
            )}

          </div>

        </div>

        `
      )}


      <!-- ===================================================
           VALIDATION
           =================================================== -->

      <section class="card">

        <h2>Configuration Validation</h2>

        ${
          validation.valid
            ? `
              <div class="notice success">
                <strong>VALID</strong>
                <div>
                  Financial configuration satisfies the 26E safety boundary.
                </div>
              </div>
            `
            : `
              <div class="notice danger">
                <strong>INVALID</strong>
                <ul>
                  ${validation.errors
                    .map(function (error) {
                      return `<li>${escapeHtml(error)}</li>`;
                    })
                    .join("")}
                </ul>
              </div>
            `
        }

        ${
          validation.warnings.length
            ? `
              <div class="notice warn">
                ${validation.warnings
                  .map(function (warning) {
                    return `<div>${escapeHtml(warning)}</div>`;
                  })
                  .join("")}
              </div>
            `
            : ""
        }

      </section>


      <!-- ===================================================
           CONTROLS
           =================================================== -->

      <section class="card">

        <h2>26E Controls</h2>

        <div class="govara26e-actions">

          <button
            type="button"
            class="primary"
            data-26e-action="save"
          >
            Save Configuration
          </button>

          <button
            type="button"
            data-26e-action="reload"
          >
            Reload
          </button>

          <button
            type="button"
            data-26e-action="validate"
          >
            Validate
          </button>

          <button
            type="button"
            data-26e-action="reset"
          >
            Reset Defaults
          </button>

        </div>

        <div
          id="govara26e-message"
          class="govara26e-message"
          aria-live="polite"
        ></div>

        <div class="muted govara26e-version">
          Module Version: ${escapeHtml(VERSION)}
        </div>

      </section>

    `;
  }


  /* ---------------------------------------------------------
     Read UI → Configuration
     --------------------------------------------------------- */

  function readForm(root) {

    const config = loadConfig();

    if (!root) {
      return config;
    }

    root
      .querySelectorAll("[data-26e-path]")
      .forEach(function (element) {

        const path = element.getAttribute("data-26e-path");

        if (!path) {
          return;
        }

        let value;

        if (element.type === "checkbox") {

          value = element.checked;

        } else if (element.type === "number") {

          value = Number(element.value);

        } else {

          value = element.value;
        }

        const parts = path
          .split(".")
          .filter(Boolean);

        let cursor = config;

        for (let i = 0; i < parts.length - 1; i++) {

          if (
            !cursor[parts[i]] ||
            typeof cursor[parts[i]] !== "object"
          ) {
            cursor[parts[i]] = {};
          }

          cursor = cursor[parts[i]];
        }

        cursor[parts[parts.length - 1]] = value;

      });

    enforceSafety(config);

    return config;
  }


  /* ---------------------------------------------------------
     Bind
     --------------------------------------------------------- */

  function bind(root) {

    const container =
      root ||
      document.getElementById("module-26E");

    if (!container) {
      return;
    }

    const message =
      container.querySelector("#govara26e-message");


    function showMessage(text, type) {

      if (!message) {
        return;
      }

      message.className =
        "govara26e-message " +
        (type || "");

      message.textContent = text;
    }


    container
      .querySelectorAll("[data-26e-action]")
      .forEach(function (button) {

        button.addEventListener("click", function () {

          const action =
            button.getAttribute("data-26e-action");

          if (action === "save") {

            const config = readForm(container);

            const result = save(config);

            if (result.success) {

              showMessage(
                "26E Financial configuration saved successfully.",
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


          if (action === "reload") {

            renderAndBind();

            return;
          }


          if (action === "validate") {

            const config = readForm(container);

            const result = validateConfig(config);

            if (result.valid) {

              showMessage(
                "26E configuration is VALID.",
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


          if (action === "reset") {

            const confirmed =
              window.confirm(
                "Reset 26E Financial Control to safe defaults?"
              );

            if (!confirmed) {
              return;
            }

            const result = reset();

            if (result.success) {

              renderAndBind();

            } else {

              showMessage(
                "Reset failed: " + result.error,
                "danger"
              );
            }

          }

        });

      });
  }


  /* ---------------------------------------------------------
     Render + Bind
     --------------------------------------------------------- */

  function renderAndBind() {

    const container =
      document.getElementById("module-26E");

    if (!container) {
      return;
    }

    container.innerHTML = render();

    bind(container);
  }


  /* ---------------------------------------------------------
     Public API
     --------------------------------------------------------- */

  return {

    VERSION: VERSION,

    STORAGE_KEY: STORAGE_KEY,

    render: render,

    bind: bind,

    renderAndBind: renderAndBind,

    getConfig: getConfig,

    getSafetyStatus: getSafetyStatus,

    save: save,

    reset: reset,

    reload: reload,

    validate: validateConfig,

    setPolicy: setPolicy,

    getAudit: getAudit,

    enforceSafety: enforceSafety

  };

})();


/* =========================================================
   Auto Render
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  if (
    window.GoVara26E &&
    typeof window.GoVara26E.renderAndBind === "function"
  ) {
    window.GoVara26E.renderAndBind();
  }

});
