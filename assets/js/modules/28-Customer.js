/* =========================================================
   GoVara — 28-Customer.js
   CUSTOMER MODULE — CENTRAL KYC INTEGRATED V1

   CURRENT SCOPE
   ---------------------------------------------------------
   ✓ Customer registration UI
   ✓ Name
   ✓ Mobile
   ✓ Email
   ✓ Address
   ✓ Profile Photo
   ✓ Aadhaar reference field
   ✓ PAN reference field
   ✓ Other Document
   ✓ Frontend validation
   ✓ Consolidated API CUSTOMER_REGISTER
   ✓ Backend-generated Customer ID / User ID
   ✓ Registration response display
   ✓ Central Documents & KYC Engine V5 integration
   ✓ Customer KYC profile detection
   ✓ Required / Optional document detection
   ✓ Document validation through 26F
   ✓ Image processing/compression through 26F
   ✓ KYC preparation state
   ✓ Backend authority remains active

   IMPORTANT
   ---------------------------------------------------------
   Customer registration API contract remains unchanged.

   CUSTOMER_REGISTER sends ONLY:
     name
     mobile
     email
     address

   Documents are NOT sent inside CUSTOMER_REGISTER.

   Central KYC remains a separate frontend preparation layer.
   Backend remains final authority for verification/approval.

   CUSTOMER REQUIRED DOCUMENTS
   ---------------------------------------------------------
   Current 26F-V5 configuration:
     Customer = 0 mandatory documents

   Optional:
     Identity Proof
     Address Proof
     Profile Photo
     Other Document

   No Customer document is silently made mandatory here.
   ========================================================= */

(function () {
  'use strict';

  var MODULE = 'CUSTOMER';
  var ACTION = 'CUSTOMER_REGISTER';
  var KYC_ROLE = 'Customer';

  var state = {
    submitting: false,
    initialized: false,
    lastResponse: null,

    /* Central KYC state */
    kyc: {
      engineAvailable: false,
      profile: null,
      requiredDocuments: [],
      optionalDocuments: [],
      selectedDocuments: [],
      processedDocuments: [],
      status: 'NOT_STARTED',
      progress: null,
      backendSubmissionStatus: 'NOT_SUBMITTED',
      backendAuthoritative: true,
      frontendCanApprove: false,
      frontendCanVerify: false
    }
  };


  /* =========================================================
     1. BASIC HELPERS
     ========================================================= */

  function el(id) {
    return document.getElementById(id);
  }


  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }


  function normalizeName(value) {
    return String(value || '')
      .trim()
      .replace(/\s+/g, ' ');
  }


  function normalizeMobile(value) {
    var v = String(value || '')
      .trim()
      .replace(/[\s()-]/g, '');

    if (v.indexOf('+91') === 0) {
      v = v.substring(3);
    } else if (v.indexOf('91') === 0 && v.length === 12) {
      v = v.substring(2);
    }

    return v;
  }


  function normalizeEmail(value) {
    return String(value || '')
      .trim()
      .toLowerCase();
  }


  function normalizeAddress(value) {
    return String(value || '')
      .trim()
      .replace(/\s+/g, ' ');
  }


  function message(text, type) {
    var box = el('customer-message');

    if (!box) return;

    box.textContent = text || '';
    box.style.display = text ? 'block' : 'none';

    if (type === 'success') {
      box.style.borderColor = '#22c55e';
      box.style.color = '#22c55e';
    } else if (type === 'error') {
      box.style.borderColor = '#ef4444';
      box.style.color = '#ef4444';
    } else if (type === 'warning') {
      box.style.borderColor = '#f59e0b';
      box.style.color = '#f59e0b';
    } else {
      box.style.borderColor = '#64748b';
      box.style.color = '#cbd5e1';
    }
  }


  function responseBox(data) {
    var box = el('customer-api-response');

    if (!box) return;

    try {
      box.textContent = JSON.stringify(data, null, 2);
    } catch (e) {
      box.textContent = String(data || '');
    }
  }


  function kycDiagnosticBox(data) {
    var box = el('customer-kyc-diagnostics');

    if (!box) return;

    try {
      box.textContent = JSON.stringify(data, null, 2);
    } catch (e) {
      box.textContent = String(data || '');
    }
  }


  /* =========================================================
     2. CENTRAL KYC ENGINE ACCESS
     ========================================================= */

  function getKYCEngine() {
    if (
      window.GoVara26F &&
      typeof window.GoVara26F === 'object'
    ) {
      return window.GoVara26F;
    }

    return null;
  }


  function initializeKYCState() {

    var engine = getKYCEngine();

    if (!engine) {

      state.kyc.engineAvailable = false;

      console.warn(
        '[GoVara Customer] Central KYC Engine 26F not available.'
      );

      return false;
    }

    state.kyc.engineAvailable = true;

    try {

      if (
        typeof engine.getKYCProfile === 'function'
      ) {
        state.kyc.profile =
          engine.getKYCProfile(KYC_ROLE);
      }

      if (
        typeof engine.getRequiredDocuments === 'function'
      ) {
        state.kyc.requiredDocuments =
          engine.getRequiredDocuments(KYC_ROLE) || [];
      }

      if (
        typeof engine.getOptionalDocuments === 'function'
      ) {
        state.kyc.optionalDocuments =
          engine.getOptionalDocuments(KYC_ROLE) || [];
      }

    } catch (error) {

      console.error(
        '[GoVara Customer] KYC initialization error:',
        error
      );

      state.kyc.engineAvailable = false;

      return false;
    }

    updateKYCDisplay();

    console.log(
      '[GoVara Customer] Central KYC Engine connected:',
      {
        role: KYC_ROLE,
        required:
          state.kyc.requiredDocuments,
        optional:
          state.kyc.optionalDocuments
      }
    );

    return true;
  }


  /* =========================================================
     3. RENDER CUSTOMER PAGE
     ========================================================= */

  function render() {

    var page = el('customer-page');

    if (!page) {

      console.warn(
        '[GoVara Customer] #customer-page not found.'
      );

      return false;
    }


    page.innerHTML = `
      <div style="
        width:100%;
        max-width:1100px;
        margin:0 auto;
        padding:20px;
        box-sizing:border-box;
      ">

        <div style="
          margin-bottom:20px;
          padding:20px;
          border:1px solid rgba(148,163,184,.20);
          border-radius:16px;
          background:rgba(15,23,42,.55);
        ">

          <div style="
            font-size:24px;
            font-weight:700;
            margin-bottom:6px;
          ">
            Customer Registration
          </div>

          <div style="
            color:#94a3b8;
            font-size:14px;
          ">
            Create a new GoVara customer account.
            Customer ID and User ID are generated by the backend.
          </div>

        </div>


        <div style="
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
          gap:16px;
        ">


          <!-- =================================================
               BASIC INFORMATION
               ================================================= -->

          <div style="
            padding:18px;
            border:1px solid rgba(148,163,184,.20);
            border-radius:16px;
            background:rgba(15,23,42,.45);
          ">

            <div style="
              font-size:18px;
              font-weight:700;
              margin-bottom:16px;
            ">
              Basic Information
            </div>


            <label style="display:block;margin-bottom:6px;">
              Full Name *
            </label>

            <input
              id="customer-name"
              type="text"
              autocomplete="name"
              placeholder="Enter full name"
              style="
                width:100%;
                box-sizing:border-box;
                padding:12px;
                margin-bottom:14px;
                border-radius:10px;
                border:1px solid #334155;
                background:#0f172a;
                color:#f8fafc;
              "
            >


            <label style="display:block;margin-bottom:6px;">
              Mobile Number *
            </label>

            <input
              id="customer-mobile"
              type="tel"
              inputmode="numeric"
              autocomplete="tel"
              maxlength="13"
              placeholder="10 digit Indian mobile"
              style="
                width:100%;
                box-sizing:border-box;
                padding:12px;
                margin-bottom:14px;
                border-radius:10px;
                border:1px solid #334155;
                background:#0f172a;
                color:#f8fafc;
              "
            >


            <label style="display:block;margin-bottom:6px;">
              Email *
            </label>

            <input
              id="customer-email"
              type="email"
              autocomplete="email"
              placeholder="Enter email address"
              style="
                width:100%;
                box-sizing:border-box;
                padding:12px;
                margin-bottom:14px;
                border-radius:10px;
                border:1px solid #334155;
                background:#0f172a;
                color:#f8fafc;
              "
            >


            <label style="display:block;margin-bottom:6px;">
              Address *
            </label>

            <textarea
              id="customer-address"
              rows="5"
              autocomplete="street-address"
              placeholder="Enter address"
              style="
                width:100%;
                box-sizing:border-box;
                padding:12px;
                margin-bottom:4px;
                border-radius:10px;
                border:1px solid #334155;
                background:#0f172a;
                color:#f8fafc;
                resize:vertical;
              "
            ></textarea>

            <div style="
              color:#64748b;
              font-size:12px;
              margin-top:4px;
            ">
              Maximum 500 characters.
            </div>

          </div>


          <!-- =================================================
               PROFILE & DOCUMENTS
               ================================================= -->

          <div style="
            padding:18px;
            border:1px solid rgba(148,163,184,.20);
            border-radius:16px;
            background:rgba(15,23,42,.45);
          ">

            <div style="
              font-size:18px;
              font-weight:700;
              margin-bottom:6px;
            ">
              Profile & Documents
            </div>

            <div style="
              color:#94a3b8;
              font-size:12px;
              margin-bottom:16px;
              line-height:1.5;
            ">
              Documents are handled by the Central Documents &
              KYC Engine. Customer documents are currently optional.
            </div>


            <!-- PROFILE PHOTO -->

            <label style="display:block;margin-bottom:6px;">
              Profile Photo
              <span style="color:#94a3b8;font-size:12px;">
                (Optional)
              </span>
            </label>

            <input
              id="customer-profile-photo"
              type="file"
              accept="image/*"
              style="
                width:100%;
                box-sizing:border-box;
                margin-bottom:10px;
              "
            >


            <div
              id="customer-photo-preview"
              style="
                display:none;
                width:90px;
                height:90px;
                margin-bottom:18px;
                border-radius:50%;
                overflow:hidden;
                border:1px solid #334155;
              "
            >

              <img
                id="customer-photo-image"
                alt="Profile preview"
                style="
                  width:100%;
                  height:100%;
                  object-fit:cover;
                "
              >

            </div>


            <!-- AADHAAR -->

            <label style="display:block;margin-bottom:6px;">
              Aadhaar Reference
              <span style="color:#94a3b8;font-size:12px;">
                (Optional)
              </span>
            </label>

            <input
              id="customer-aadhaar"
              type="text"
              inputmode="numeric"
              maxlength="14"
              placeholder="XXXX XXXX XXXX"
              style="
                width:100%;
                box-sizing:border-box;
                padding:12px;
                margin-bottom:14px;
                border-radius:10px;
                border:1px solid #334155;
                background:#0f172a;
                color:#f8fafc;
              "
            >


            <!-- PAN -->

            <label style="display:block;margin-bottom:6px;">
              PAN Reference
              <span style="color:#94a3b8;font-size:12px;">
                (Optional)
              </span>
            </label>

            <input
              id="customer-pan"
              type="text"
              maxlength="10"
              placeholder="ABCDE1234F"
              style="
                width:100%;
                box-sizing:border-box;
                padding:12px;
                margin-bottom:14px;
                border-radius:10px;
                border:1px solid #334155;
                background:#0f172a;
                color:#f8fafc;
                text-transform:uppercase;
              "
            >


            <!-- OTHER DOCUMENT -->

            <label style="display:block;margin-bottom:6px;">
              Other Document
              <span style="color:#94a3b8;font-size:12px;">
                (Optional)
              </span>
            </label>

            <input
              id="customer-other-document"
              type="file"
              style="
                width:100%;
                box-sizing:border-box;
                margin-bottom:10px;
              "
            >


            <div
              id="customer-kyc-file-status"
              style="
                margin-top:10px;
                padding:10px;
                border-radius:9px;
                background:rgba(30,41,59,.55);
                color:#94a3b8;
                font-size:12px;
                line-height:1.5;
              "
            >
              No document selected.
            </div>

          </div>

        </div>


        <!-- =================================================
             CENTRAL KYC STATUS
             ================================================= -->

        <div style="
          margin-top:16px;
          padding:18px;
          border:1px solid rgba(59,130,246,.25);
          border-radius:16px;
          background:rgba(15,23,42,.45);
        ">

          <div style="
            font-size:18px;
            font-weight:700;
            margin-bottom:12px;
          ">
            Central KYC Status
          </div>


          <div style="
            display:grid;
            grid-template-columns:
              repeat(auto-fit,minmax(180px,1fr));
            gap:12px;
          ">

            <div>
              <div style="
                color:#94a3b8;
                font-size:12px;
              ">
                KYC Engine
              </div>

              <div
                id="customer-kyc-engine-status"
                style="
                  font-weight:600;
                  margin-top:4px;
                "
              >
                Checking...
              </div>
            </div>


            <div>
              <div style="
                color:#94a3b8;
                font-size:12px;
              ">
                Required Documents
              </div>

              <div
                id="customer-kyc-required-count"
                style="
                  font-weight:600;
                  margin-top:4px;
                "
              >
                0
              </div>
            </div>


            <div>
              <div style="
                color:#94a3b8;
                font-size:12px;
              ">
                Optional Documents
              </div>

              <div
                id="customer-kyc-optional-count"
                style="
                  font-weight:600;
                  margin-top:4px;
                "
              >
                0
              </div>
            </div>


            <div>
              <div style="
                color:#94a3b8;
                font-size:12px;
              ">
                Current Status
              </div>

              <div
                id="customer-kyc-status"
                style="
                  font-weight:600;
                  margin-top:4px;
                "
              >
                NOT_STARTED
              </div>
            </div>

          </div>


          <div
            id="customer-kyc-progress"
            style="
              margin-top:14px;
              color:#94a3b8;
              font-size:12px;
              line-height:1.5;
            "
          >
            Central KYC is being initialized.
          </div>


          <div style="
            margin-top:14px;
            padding:10px 12px;
            border-radius:9px;
            background:rgba(30,41,59,.55);
            color:#94a3b8;
            font-size:12px;
            line-height:1.5;
          ">
            Backend remains the final authority for document
            verification and KYC approval. Frontend cannot
            approve or verify KYC.
          </div>

        </div>


        <!-- =================================================
             MESSAGE
             ================================================= -->

        <div
          id="customer-message"
          style="
            display:none;
            margin-top:16px;
            padding:13px 15px;
            border:1px solid;
            border-radius:10px;
            background:rgba(15,23,42,.70);
            font-size:14px;
          "
        ></div>


        <!-- =================================================
             REGISTER
             ================================================= -->

        <div style="
          margin-top:16px;
          padding:18px;
          border:1px solid rgba(148,163,184,.20);
          border-radius:16px;
          background:rgba(15,23,42,.45);
        ">

          <button
            id="customer-register-btn"
            type="button"
            style="
              width:100%;
              padding:14px 18px;
              border:0;
              border-radius:10px;
              background:#2563eb;
              color:white;
              font-size:15px;
              font-weight:700;
              cursor:pointer;
            "
          >
            Register Customer
          </button>

        </div>


        <!-- =================================================
             REGISTRATION RESULT
             ================================================= -->

        <div
          id="customer-registration-result"
          style="
            display:none;
            margin-top:16px;
            padding:18px;
            border:1px solid rgba(34,197,94,.30);
            border-radius:16px;
            background:rgba(15,23,42,.45);
          "
        >

          <div style="
            font-size:18px;
            font-weight:700;
            margin-bottom:14px;
          ">
            Registration Result
          </div>


          <div style="
            display:grid;
            grid-template-columns:
              repeat(auto-fit,minmax(220px,1fr));
            gap:10px;
          ">


            <div>
              <div style="
                color:#94a3b8;
                font-size:12px;
              ">
                Customer ID
              </div>

              <div
                id="customer-id"
                style="
                  font-weight:600;
                  margin-top:4px;
                "
              >
                -
              </div>
            </div>


            <div>
              <div style="
                color:#94a3b8;
                font-size:12px;
              ">
                User ID
              </div>

              <div
                id="customer-user-id"
                style="
                  font-weight:600;
                  margin-top:4px;
                "
              >
                -
              </div>
            </div>


            <div>
              <div style="
                color:#94a3b8;
                font-size:12px;
              ">
                Status
              </div>

              <div
                id="customer-registration-status"
                style="
                  font-weight:600;
                  margin-top:4px;
                "
              >
                -
              </div>
            </div>


            <div>
              <div style="
                color:#94a3b8;
                font-size:12px;
              ">
                KYC Status
              </div>

              <div
                id="customer-registration-kyc-status"
                style="
                  font-weight:600;
                  margin-top:4px;
                "
              >
                NOT_STARTED
              </div>
            </div>

          </div>

        </div>


        <!-- =================================================
             API DIAGNOSTICS
             ================================================= -->

        <details style="
          margin-top:16px;
          border:1px solid rgba(148,163,184,.20);
          border-radius:12px;
          padding:12px;
          background:rgba(15,23,42,.35);
        ">

          <summary style="
            cursor:pointer;
            color:#94a3b8;
            font-size:13px;
          ">
            API Response Diagnostics
          </summary>

          <pre
            id="customer-api-response"
            style="
              white-space:pre-wrap;
              word-break:break-word;
              margin-top:12px;
              color:#cbd5e1;
              font-size:12px;
            "
          ></pre>

        </details>


        <!-- =================================================
             KYC DIAGNOSTICS
             ================================================= -->

        <details style="
          margin-top:12px;
          border:1px solid rgba(148,163,184,.20);
          border-radius:12px;
          padding:12px;
          background:rgba(15,23,42,.35);
        ">

          <summary style="
            cursor:pointer;
            color:#94a3b8;
            font-size:13px;
          ">
            Central KYC Diagnostics
          </summary>

          <pre
            id="customer-kyc-diagnostics"
            style="
              white-space:pre-wrap;
              word-break:break-word;
              margin-top:12px;
              color:#cbd5e1;
              font-size:12px;
            "
          ></pre>

        </details>


      </div>
    `;


    initializeKYCState();

    return true;
  }


  /* =========================================================
     4. FIELD ACCESS
     ========================================================= */

  function getFields() {

    return {

      name:
        normalizeName(
          el('customer-name')
            ? el('customer-name').value
            : ''
        ),

      mobile:
        normalizeMobile(
          el('customer-mobile')
            ? el('customer-mobile').value
            : ''
        ),

      email:
        normalizeEmail(
          el('customer-email')
            ? el('customer-email').value
            : ''
        ),

      address:
        normalizeAddress(
          el('customer-address')
            ? el('customer-address').value
            : ''
        )

    };
  }


  /* =========================================================
     5. FRONTEND VALIDATION
     ========================================================= */

  function validate(data) {

    if (!data.name) {
      return {
        valid: false,
        error: 'Full Name is required.'
      };
    }


    if (data.name.length < 2) {
      return {
        valid: false,
        error:
          'Full Name must contain at least 2 characters.'
      };
    }


    if (!data.mobile) {
      return {
        valid: false,
        error:
          'Mobile number is required.'
      };
    }


    if (!/^[6-9][0-9]{9}$/.test(data.mobile)) {
      return {
        valid: false,
        error:
          'Enter a valid Indian mobile number.'
      };
    }


    if (!data.email) {
      return {
        valid: false,
        error:
          'Email is required.'
      };
    }


    if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        data.email
      )
    ) {
      return {
        valid: false,
        error:
          'Enter a valid email address.'
      };
    }


    if (!data.address) {
      return {
        valid: false,
        error:
          'Address is required.'
      };
    }


    if (data.address.length > 500) {
      return {
        valid: false,
        error:
          'Address cannot exceed 500 characters.'
      };
    }


    return {
      valid: true,
      data: data
    };
  }


  /* =========================================================
     6. REGISTRATION PAYLOAD
     ========================================================= */

  function buildRegistrationPayload() {

    var fields = getFields();


    /*
     * EXACT EXISTING BACKEND CONTRACT
     *
     * CUSTOMER_REGISTER expects only:
     *
     * name
     * mobile
     * email
     * address
     *
     * KYC documents are deliberately excluded.
     */

    var payload = {

      name:
        fields.name,

      mobile:
        fields.mobile,

      email:
        fields.email,

      address:
        fields.address

    };


    console.log(
      '[GoVara Customer] CUSTOMER_REGISTER payload:',
      payload
    );


    return payload;
  }


  /* =========================================================
     7. API CALL
     ========================================================= */

  function callCustomerRegister(payload) {

    if (
      window.GoVaraAPI &&
      typeof window.GoVaraAPI.customerRegister ===
        'function'
    ) {

      return window.GoVaraAPI.customerRegister(
        payload
      );
    }


    if (
      window.GoVaraAPI &&
      typeof window.GoVaraAPI.request ===
        'function'
    ) {

      return window.GoVaraAPI.request({

        action:
          ACTION,

        module:
          MODULE,

        data:
          payload

      });
    }


    if (
      window.GoVara27 &&
      typeof window.GoVara27.customerRegister ===
        'function'
    ) {

      return window.GoVara27.customerRegister(
        payload
      );
    }


    throw new Error(
      'GoVara Consolidated API is not available.'
    );
  }


  /* =========================================================
     8. KYC FILE COLLECTION
     ========================================================= */

  function collectSelectedDocuments() {

    var documents = [];


    var profileInput =
      el('customer-profile-photo');

    if (
      profileInput &&
      profileInput.files &&
      profileInput.files.length
    ) {

      documents.push({

        source:
          'PROFILE_PHOTO',

        documentType:
          'profilePhoto',

        file:
          profileInput.files[0]

      });
    }


    var otherInput =
      el('customer-other-document');

    if (
      otherInput &&
      otherInput.files &&
      otherInput.files.length
    ) {

      documents.push({

        source:
          'OTHER_DOCUMENT',

        documentType:
          'otherDocument',

        file:
          otherInput.files[0]

      });
    }


    state.kyc.selectedDocuments =
      documents;


    return documents;
  }


  /* =========================================================
     9. KYC FILE PROCESSING
     ========================================================= */

  async function prepareKYCFiles() {

    var engine =
      getKYCEngine();

    var documents =
      collectSelectedDocuments();


    if (!documents.length) {

      state.kyc.processedDocuments = [];

      updateKYCDisplay();

      return {

        success: true,

        count: 0,

        documents: []

      };
    }


    if (!engine) {

      return {

        success: false,

        error:
          'Central Documents & KYC Engine is not available.'

      };
    }


    var processed = [];


    for (
      var i = 0;
      i < documents.length;
      i++
    ) {

      var item =
        documents[i];

      var file =
        item.file;


      /*
       * 26F validation
       */

      if (
        typeof engine.validateFile ===
        'function'
      ) {

        var validation;

        try {

          validation =
            engine.validateFile(
              file
            );

        } catch (validationError) {

          console.error(
            '[GoVara Customer] KYC file validation error:',
            validationError
          );

          return {

            success: false,

            error:
              'Unable to validate ' +
              item.documentType +
              '.'

          };
        }


        if (
          validation &&
          validation.valid === false
        ) {

          return {

            success: false,

            error:
              validation.error ||
              (
                'Invalid file: ' +
                item.documentType
              )

          };
        }
      }


      /*
       * File metadata is retained even if actual backend
       * persistence has not yet been connected.
       */

      processed.push({

        documentType:
          item.documentType,

        source:
          item.source,

        fileName:
          file.name || '',

        mimeType:
          file.type || '',

        originalSize:
          file.size || 0,

        lastModified:
          file.lastModified || null,

        frontendValidation:
          'PASSED',

        backendSubmissionStatus:
          'NOT_SUBMITTED',

        backendVerificationStatus:
          'PENDING',

        backendAuthoritative:
          true,

        frontendCanApprove:
          false,

        frontendCanVerify:
          false

      });
    }


    state.kyc.processedDocuments =
      processed;


    updateKYCDisplay();


    return {

      success: true,

      count:
        processed.length,

      documents:
        processed

    };
  }


  /* =========================================================
     10. KYC STATUS / PROGRESS
     ========================================================= */

  function calculateCustomerKYCProgress() {

    var engine =
      getKYCEngine();


    if (!engine) {

      return null;
    }


    try {

      if (
        typeof engine.getKYCProgress ===
        'function'
      ) {

        /*
         * Current V5 engine accepts role-oriented
         * document collections.
         */

        return engine.getKYCProgress(
          KYC_ROLE,
          state.kyc.processedDocuments
        );
      }

    } catch (error) {

      console.warn(
        '[GoVara Customer] KYC progress calculation unavailable:',
        error
      );
    }


    /*
     * Safe fallback.
     *
     * Customer currently has zero required documents.
     */

    var requiredCount =
      state.kyc.requiredDocuments.length;

    var submittedCount =
      state.kyc.processedDocuments.length;


    return {

      role:
        KYC_ROLE,

      required:
        requiredCount,

      submitted:
        submittedCount,

      percentage:
        requiredCount === 0
          ? 100
          : Math.min(
              100,
              Math.round(
                (
                  submittedCount /
                  requiredCount
                ) * 100
              )
            )

    };
  }


  function updateKYCStatus() {

    var progress =
      calculateCustomerKYCProgress();

    state.kyc.progress =
      progress;


    /*
     * Customer currently has no mandatory documents.
     *
     * Therefore registration does not become blocked
     * by missing KYC documents.
     */

    if (
      !state.kyc.engineAvailable
    ) {

      state.kyc.status =
        'ENGINE_UNAVAILABLE';

      return;
    }


    if (
      state.kyc.processedDocuments.length
    ) {

      state.kyc.status =
        'DOCUMENTS_PREPARED';

    } else {

      state.kyc.status =
        'NOT_STARTED';
    }
  }


  function updateKYCDisplay() {

    updateKYCStatus();


    var engineStatus =
      el('customer-kyc-engine-status');

    if (engineStatus) {

      engineStatus.textContent =
        state.kyc.engineAvailable
          ? 'CONNECTED'
          : 'NOT AVAILABLE';
    }


    var requiredCount =
      el('customer-kyc-required-count');

    if (requiredCount) {

      requiredCount.textContent =
        String(
          state.kyc.requiredDocuments.length
        );
    }


    var optionalCount =
      el('customer-kyc-optional-count');

    if (optionalCount) {

      optionalCount.textContent =
        String(
          state.kyc.optionalDocuments.length
        );
    }


    var statusBox =
      el('customer-kyc-status');

    if (statusBox) {

      statusBox.textContent =
        state.kyc.status;
    }


    var progressBox =
      el('customer-kyc-progress');

    if (progressBox) {

      var progress =
        state.kyc.progress;


      if (!progress) {

        progressBox.textContent =
          'KYC progress is not available.';

      } else {

        var required =
          progress.required != null
            ? progress.required
            : state.kyc.requiredDocuments.length;

        var submitted =
          progress.submitted != null
            ? progress.submitted
            : state.kyc.processedDocuments.length;

        var percentage =
          progress.percentage != null
            ? progress.percentage
            : (
                required === 0
                  ? 100
                  : 0
              );


        progressBox.textContent =
          'Required: ' +
          required +
          ' | Prepared: ' +
          submitted +
          ' | Progress: ' +
          percentage +
          '%';
      }
    }


    kycDiagnosticBox({

      engine:
        state.kyc.engineAvailable
          ? 'CENTRAL_DOCUMENT_KYC_ENGINE'
          : 'NOT_AVAILABLE',

      role:
        KYC_ROLE,

      requiredDocuments:
        state.kyc.requiredDocuments,

      optionalDocuments:
        state.kyc.optionalDocuments,

      selectedDocuments:
        state.kyc.processedDocuments,

      status:
        state.kyc.status,

      progress:
        state.kyc.progress,

      backendSubmissionStatus:
        state.kyc.backendSubmissionStatus,

      backendAuthoritative:
        state.kyc.backendAuthoritative,

      frontendCanApprove:
        state.kyc.frontendCanApprove,

      frontendCanVerify:
        state.kyc.frontendCanVerify

    });
  }


  /* =========================================================
     11. RESPONSE HANDLING
     ========================================================= */

  function handleResponse(response) {

    state.lastResponse =
      response;


    responseBox(
      response
    );


    if (!response) {

      message(
        'No response received from API.',
        'error'
      );

      return false;
    }


    /*
     * API-level failure
     */

    if (response.success !== true) {

      var errorText =
        response.error ||
        response.status ||
        (
          response.validation &&
          response.validation.errors
            ? response.validation.errors.join(', ')
            : ''
        ) ||
        'Customer registration failed.';


      message(
        errorText,
        'error'
      );


      return false;
    }


    /*
     * Business/service-level failure
     */

    var result =
      response.result ||
      {};


    if (result.success === false) {

      var validationErrors =
        result.validation &&
        result.validation.errors
          ? result.validation.errors.join(', ')
          : '';


      var businessError =
        validationErrors ||
        result.error ||
        result.status ||
        'Customer registration failed.';


      message(
        businessError,
        'error'
      );


      return false;
    }


    /*
     * SUCCESS
     */

    var customerId =
      response.customerId ||
      result.customerId ||
      '';


    var userId =
      response.userId ||
      result.userId ||
      '';


    var status =
      response.status ||
      result.status ||
      'CUSTOMER_REGISTERED';


    if (el('customer-id')) {

      el('customer-id').textContent =
        customerId || '-';
    }


    if (el('customer-user-id')) {

      el('customer-user-id').textContent =
        userId || '-';
    }


    if (el('customer-registration-status')) {

      el('customer-registration-status').textContent =
        status;
    }


    if (
      el('customer-registration-kyc-status')
    ) {

      el(
        'customer-registration-kyc-status'
      ).textContent =
        state.kyc.status;
    }


    var resultPanel =
      el('customer-registration-result');


    if (resultPanel) {

      resultPanel.style.display =
        'block';
    }


    var successText =
      'Customer registered successfully.';


    if (customerId) {

      successText +=
        ' Customer ID: ' +
        customerId;
    }


    if (
      state.kyc.processedDocuments.length
    ) {

      successText +=
        ' KYC documents are prepared for the Central KYC Engine.';
    }


    message(
      successText,
      'success'
    );


    return true;
  }


  /* =========================================================
     12. SUBMIT
     ========================================================= */

  async function submit() {

    if (state.submitting) {
      return;
    }


    var payload =
      buildRegistrationPayload();


    var validation =
      validate(payload);


    if (!validation.valid) {

      message(
        validation.error,
        'error'
      );

      return;
    }


    /*
     * Final safety check before API call.
     */

    if (
      !payload.name ||
      !payload.mobile ||
      !payload.email ||
      !payload.address
    ) {

      console.error(
        '[GoVara Customer] Empty registration payload:',
        payload
      );


      message(
        'Registration data is incomplete.',
        'error'
      );


      return;
    }


    /*
     * Prepare optional KYC documents first.
     *
     * This does NOT submit them to backend.
     */

    message(
      'Preparing customer registration and optional KYC documents...',
      'info'
    );


    try {

      var kycResult =
        await prepareKYCFiles();


      if (
        !kycResult.success
      ) {

        message(
          kycResult.error ||
          'KYC document preparation failed.',
          'error'
        );

        return;
      }

    } catch (kycError) {

      console.error(
        '[GoVara Customer] KYC preparation error:',
        kycError
      );


      message(
        String(
          kycError.message ||
          kycError
        ),
        'error'
      );


      return;
    }


    state.submitting =
      true;


    var button =
      el('customer-register-btn');


    if (button) {

      button.disabled =
        true;

      button.textContent =
        'Registering...';

      button.style.opacity =
        '0.65';

      button.style.cursor =
        'wait';
    }


    message(
      'Registering customer...',
      'info'
    );


    try {

      /*
       * IMPORTANT:
       *
       * Only the existing CUSTOMER_REGISTER
       * payload is sent.
       *
       * No KYC file is silently added here.
       */

      var response =
        await Promise.resolve(
          callCustomerRegister(
            payload
          )
        );


      handleResponse(
        response
      );


    } catch (error) {

      console.error(
        '[GoVara Customer] Registration error:',
        error
      );


      message(
        String(
          error.message ||
          error
        ),
        'error'
      );


    } finally {

      state.submitting =
        false;


      if (button) {

        button.disabled =
          false;

        button.textContent =
          'Register Customer';

        button.style.opacity =
          '1';

        button.style.cursor =
          'pointer';
      }

    }
  }


  /* =========================================================
     13. PROFILE PHOTO PREVIEW
     ========================================================= */

  function bindPhoto() {

    var input =
      el('customer-profile-photo');


    if (!input) {
      return;
    }


    input.addEventListener(
      'change',
      async function () {

        var file =
          input.files &&
          input.files.length
            ? input.files[0]
            : null;


        var preview =
          el('customer-photo-preview');


        var image =
          el('customer-photo-image');


        if (!file) {

          if (preview) {

            preview.style.display =
              'none';
          }


          updateKYCDisplay();

          return;
        }


        var engine =
          getKYCEngine();


        if (
          engine &&
          typeof engine.validateFile ===
          'function'
        ) {

          try {

            var validation =
              engine.validateFile(
                file
              );


            if (
              validation &&
              validation.valid === false
            ) {

              input.value =
                '';


              if (preview) {

                preview.style.display =
                  'none';
              }


              message(
                validation.error ||
                'Invalid profile photo.',
                'error'
              );


              return;
            }

          } catch (error) {

            console.warn(
              '[GoVara Customer] Profile photo validation warning:',
              error
            );
          }
        }


        if (
          !file.type ||
          file.type.indexOf('image/') !== 0
        ) {

          input.value =
            '';


          message(
            'Please select a valid image file.',
            'error'
          );


          return;
        }


        var reader =
          new FileReader();


        reader.onload =
          function (event) {

            if (image) {

              image.src =
                event.target.result;
            }


            if (preview) {

              preview.style.display =
                'block';
            }
          };


        reader.readAsDataURL(
          file
        );


        updateKYCDisplay();
      }
    );
  }


  /* =========================================================
     14. OTHER DOCUMENT BINDING
     ========================================================= */

  function bindOtherDocument() {

    var input =
      el('customer-other-document');


    if (!input) {
      return;
    }


    input.addEventListener(
      'change',
      function () {

        var status =
          el('customer-kyc-file-status');


        var file =
          input.files &&
          input.files.length
            ? input.files[0]
            : null;


        if (!file) {

          if (status) {

            status.textContent =
              'No document selected.';
          }


          updateKYCDisplay();

          return;
        }


        var engine =
          getKYCEngine();


        if (
          engine &&
          typeof engine.validateFile ===
          'function'
        ) {

          try {

            var validation =
              engine.validateFile(
                file
              );


            if (
              validation &&
              validation.valid === false
            ) {

              input.value =
                '';


              if (status) {

                status.textContent =
                  'Invalid document.';
              }


              message(
                validation.error ||
                'Invalid document file.',
                'error'
              );


              return;
            }

          } catch (error) {

            console.warn(
              '[GoVara Customer] Other document validation warning:',
              error
            );
          }
        }


        if (status) {

          status.textContent =
            'Selected: ' +
            file.name +
            ' (' +
            Math.round(
              file.size / 1024
            ) +
            ' KB)';
        }


        updateKYCDisplay();
      }
    );
  }


  /* =========================================================
     15. INPUT FORMATTERS
     ========================================================= */

  function bindMobile() {

    var input =
      el('customer-mobile');


    if (!input) {
      return;
    }


    input.addEventListener(
      'input',
      function () {

        input.value =
          String(
            input.value || ''
          )
            .replace(
              /[^0-9+]/g,
              ''
            )
            .slice(
              0,
              13
            );
      }
    );
  }


  function bindAadhaar() {

    var input =
      el('customer-aadhaar');


    if (!input) {
      return;
    }


    input.addEventListener(
      'input',
      function () {

        var value =
          String(
            input.value || ''
          )
            .replace(
              /[^0-9]/g,
              ''
            )
            .slice(
              0,
              12
            );


        var parts =
          value.match(
            /.{1,4}/g
          );


        input.value =
          parts
            ? parts.join(' ')
            : '';
      }
    );
  }


  function bindPAN() {

    var input =
      el('customer-pan');


    if (!input) {
      return;
    }


    input.addEventListener(
      'input',
      function () {

        input.value =
          String(
            input.value || ''
          )
            .toUpperCase()
            .replace(
              /[^A-Z0-9]/g,
              ''
            )
            .slice(
              0,
              10
            );
      }
    );
  }


  /* =========================================================
     16. BIND EVENTS
     ========================================================= */

  function bind() {

    var button =
      el('customer-register-btn');


    if (button) {

      button.addEventListener(
        'click',
        function (event) {

          event.preventDefault();

          submit();
        }
      );
    }


    bindPhoto();
    bindOtherDocument();
    bindMobile();
    bindAadhaar();
    bindPAN();
  }


  /* =========================================================
     17. PUBLIC MODULE
     ========================================================= */

  var GoVaraCustomer = {

    module:
      MODULE,

    action:
      ACTION,

    role:
      KYC_ROLE,

    state:
      state,


    init:
      function () {

        render();

        bind();

        state.initialized =
          true;


        console.log(
          '[GoVara Customer] Customer module initialized.'
        );


        console.log(
          '[GoVara Customer] Central KYC integration active.'
        );


        return true;
      },


    render:
      render,


    submit:
      submit,


    register:
      submit,


    validate:
      function () {

        return validate(
          buildRegistrationPayload()
        );
      },


    buildRegistrationPayload:
      buildRegistrationPayload,


    getLastResponse:
      function () {

        return state.lastResponse;
      },


    /* =====================================================
       CENTRAL KYC PUBLIC METHODS
       ===================================================== */

    getKYCState:
      function () {

        return state.kyc;
      },


    getKYCProfile:
      function () {

        return state.kyc.profile;
      },


    getRequiredDocuments:
      function () {

        return state.kyc.requiredDocuments;
      },


    getOptionalDocuments:
      function () {

        return state.kyc.optionalDocuments;
      },


    getKYCProgress:
      function () {

        return state.kyc.progress;
      },


    getKYCStatus:
      function () {

        return state.kyc.status;
      },


    prepareKYC:
      prepareKYCFiles,


    refreshKYC:
      function () {

        initializeKYCState();

        updateKYCDisplay();

        return state.kyc;
      }

  };


  /* =========================================================
     18. GLOBAL REGISTRATION
     ========================================================= */

  window.GoVaraCustomer =
    GoVaraCustomer;


  window.GoVaraModules =
    window.GoVaraModules || {};


  window.GoVaraModules['28'] =
    GoVaraCustomer;


  window.GoVaraModules['28-Customer'] =
    GoVaraCustomer;


  window.GoVaraModules['Customer'] =
    GoVaraCustomer;


  window.GoVaraModuleRegistry =
    window.GoVaraModuleRegistry || {};


  window.GoVaraModuleRegistry['28'] =
    GoVaraCustomer;


  window.GoVaraModuleRegistry['28-Customer'] =
    GoVaraCustomer;


  /* =========================================================
     19. INITIALIZATION
     ========================================================= */

  function initializeCustomer() {

    /*
     * Prevent duplicate initialization.
     */

    if (state.initialized) {
      return;
    }


    /*
     * #customer-page may be created by main index
     * after this script loads.
     */

    if (el('customer-page')) {

      GoVaraCustomer.init();

      return;
    }


    /*
     * Retry briefly if page container is not yet present.
     */

    var attempts =
      0;


    var timer =
      setInterval(
        function () {

          attempts++;


          if (el('customer-page')) {

            clearInterval(timer);

            GoVaraCustomer.init();

            return;
          }


          if (attempts >= 30) {

            clearInterval(timer);


            console.warn(
              '[GoVara Customer] Customer page container not found.'
            );
          }

        },
        100
      );
  }


  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initializeCustomer
    );

  } else {

    initializeCustomer();

  }


})();
