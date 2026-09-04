/* ============================================================
 * GoVara — 28-Customer.js
 * Customer Registration + Profile + KYC/Documents
 *
 * PURPOSE
 * - Customer registration UI
 * - Customer profile information
 * - Optional profile photo
 * - Optional Aadhaar document
 * - Optional PAN document
 * - Optional additional document
 * - Frontend basic validation only
 * - ONE Consolidated API Boundary
 * - Backend-generated Customer_ID
 * - Backend-generated User_ID
 * - No direct database access
 * - No frontend-generated business IDs
 * - Admin-controlled document requirement hooks
 * - Testing Mode / Real Money safety preserved
 *
 * IMPORTANT
 * - Frontend is NOT KYC authority.
 * - Backend remains authoritative.
 * - Actual document storage/verification must be handled
 *   by the backend/document service when its API contract exists.
 * ============================================================ */

(function (window, document) {

  'use strict';

  var GoVaraCustomer = {

    MODULE: 'CUSTOMER',
    ACTION: 'CUSTOMER_REGISTER',

    state: {
      loading: false,
      registered: false,

      customerId: '',
      userId: '',
      session: null,

      error: '',
      success: '',

      /*
       * Admin-controlled requirement hooks.
       *
       * These defaults are OPTIONAL.
       * Backend/Admin policy remains authoritative.
       */
      documentPolicy: {
        profilePhoto: 'OPTIONAL',
        aadhaar: 'OPTIONAL',
        pan: 'OPTIONAL',
        additional: 'OPTIONAL'
      }
    },


    /* ========================================================
     * INITIALIZE
     * ======================================================== */

    init: function () {

      this.registerModule();

      this.render();

      this.bindEvents();

      this.applyDocumentPolicy();
    },


    /* ========================================================
     * MODULE REGISTRATION
     * ======================================================== */

    registerModule: function () {

      window.GoVaraCustomer = this;

      if (!window.GoVaraModules) {
        window.GoVaraModules = {};
      }

      window.GoVaraModules.Customer = this;
    },


    /* ========================================================
     * RENDER
     * ======================================================== */

    render: function () {

      var container =
        document.getElementById('customer-page');

      if (!container) {

        container =
          document.getElementById('main-content');
      }

      if (!container) {
        return;
      }

      container.innerHTML = this.getHTML();
    },


    /* ========================================================
     * HTML
     * ======================================================== */

    getHTML: function () {

      return `
        <section
          class="govara-customer-module"
          data-module="CUSTOMER"
        >

          <div class="govara-module-header">

            <div>
              <h2>Customer Registration</h2>

              <p>
                Register a new GoVara Customer.
                Customer ID and User ID are generated
                by the backend.
              </p>
            </div>

            <div class="govara-status-badge">
              TESTING MODE
            </div>

          </div>


          <div
            id="customer-registration-message"
            class="govara-message"
            style="display:none;"
          ></div>


          <!-- ==================================================
               SUCCESS
          =================================================== -->

          <div
            id="customer-registration-success"
            style="display:none;"
          >

            <div class="govara-success-card">

              <h3>Customer Registered Successfully</h3>

              <div class="govara-id-row">
                <span>Customer ID</span>
                <strong id="customer-generated-id"></strong>
              </div>

              <div class="govara-id-row">
                <span>User ID</span>
                <strong id="customer-generated-user-id"></strong>
              </div>

              <div class="govara-id-row">
                <span>KYC Status</span>
                <strong id="customer-generated-kyc"></strong>
              </div>

              <div class="govara-id-row">
                <span>Status</span>
                <strong id="customer-generated-status"></strong>
              </div>

            </div>

          </div>


          <!-- ==================================================
               REGISTRATION FORM
          =================================================== -->

          <form
            id="customer-registration-form"
            autocomplete="off"
            enctype="multipart/form-data"
          >

            <!-- ================================================
                 BASIC PROFILE
            ================================================= -->

            <div class="govara-section-card">

              <div class="govara-section-title">
                <h3>Basic Profile</h3>
                <span>Customer information</span>
              </div>

              <div class="govara-form-grid">

                <div class="govara-form-group">

                  <label for="customer-name">
                    Full Name
                  </label>

                  <input
                    id="customer-name"
                    name="name"
                    type="text"
                    maxlength="100"
                    required
                    placeholder="Enter full name"
                  />

                </div>


                <div class="govara-form-group">

                  <label for="customer-mobile">
                    Mobile Number
                  </label>

                  <input
                    id="customer-mobile"
                    name="mobile"
                    type="tel"
                    inputmode="numeric"
                    maxlength="15"
                    required
                    placeholder="10 digit mobile number"
                  />

                  <small>
                    Indian mobile number required.
                  </small>

                </div>


                <div class="govara-form-group">

                  <label for="customer-email">
                    Email
                  </label>

                  <input
                    id="customer-email"
                    name="email"
                    type="email"
                    maxlength="150"
                    required
                    placeholder="name@example.com"
                  />

                </div>


                <div class="govara-form-group">

                  <label for="customer-address">
                    Address
                  </label>

                  <textarea
                    id="customer-address"
                    name="address"
                    maxlength="500"
                    required
                    rows="4"
                    placeholder="Enter address"
                  ></textarea>

                </div>

              </div>

            </div>


            <!-- ================================================
                 PROFILE PHOTO
            ================================================= -->

            <div class="govara-section-card">

              <div class="govara-section-title">

                <div>
                  <h3>Profile Photo</h3>

                  <span>
                    Optional — requirement can be controlled
                    by Admin policy.
                  </span>
                </div>

                <span
                  id="customer-photo-policy"
                  class="govara-policy-badge"
                >
                  OPTIONAL
                </span>

              </div>


              <div class="govara-upload-group">

                <label for="customer-profile-photo">
                  Profile Photo
                </label>

                <input
                  id="customer-profile-photo"
                  name="profilePhoto"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                />

                <small>
                  Accepted: JPG, PNG or WebP.
                  Maximum recommended size: 5 MB.
                </small>

                <div
                  id="customer-profile-photo-preview"
                  class="govara-file-preview"
                  style="display:none;"
                ></div>

              </div>

            </div>


            <!-- ================================================
                 IDENTITY DOCUMENTS
            ================================================= -->

            <div class="govara-section-card">

              <div class="govara-section-title">

                <div>
                  <h3>Identity & KYC Documents</h3>

                  <span>
                    Documents are optional by default.
                    Admin policy can control requirements.
                  </span>
                </div>

                <span class="govara-policy-badge">
                  ADMIN CONTROLLED
                </span>

              </div>


              <!-- Aadhaar -->

              <div class="govara-document-card">

                <div class="govara-document-heading">

                  <div>
                    <strong>Aadhaar Card</strong>

                    <small>
                      Optional identity document
                    </small>
                  </div>

                  <span
                    id="customer-aadhaar-policy"
                    class="govara-policy-badge"
                  >
                    OPTIONAL
                  </span>

                </div>


                <div class="govara-form-grid">

                  <div class="govara-form-group">

                    <label for="customer-aadhaar-number">
                      Aadhaar Number
                    </label>

                    <input
                      id="customer-aadhaar-number"
                      name="aadhaarNumber"
                      type="text"
                      inputmode="numeric"
                      maxlength="14"
                      placeholder="XXXX XXXX XXXX"
                    />

                    <small>
                      Enter only if Aadhaar is being provided.
                    </small>

                  </div>


                  <div class="govara-form-group">

                    <label for="customer-aadhaar-file">
                      Aadhaar Document
                    </label>

                    <input
                      id="customer-aadhaar-file"
                      name="aadhaarDocument"
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                    />

                    <small>
                      JPG, PNG or PDF.
                    </small>

                  </div>

                </div>

              </div>


              <!-- PAN -->

              <div class="govara-document-card">

                <div class="govara-document-heading">

                  <div>
                    <strong>PAN Card</strong>

                    <small>
                      Optional identity document
                    </small>
                  </div>

                  <span
                    id="customer-pan-policy"
                    class="govara-policy-badge"
                  >
                    OPTIONAL
                  </span>

                </div>


                <div class="govara-form-grid">

                  <div class="govara-form-group">

                    <label for="customer-pan-number">
                      PAN Number
                    </label>

                    <input
                      id="customer-pan-number"
                      name="panNumber"
                      type="text"
                      maxlength="10"
                      placeholder="ABCDE1234F"
                    />

                    <small>
                      Enter only if PAN is being provided.
                    </small>

                  </div>


                  <div class="govara-form-group">

                    <label for="customer-pan-file">
                      PAN Document
                    </label>

                    <input
                      id="customer-pan-file"
                      name="panDocument"
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                    />

                    <small>
                      JPG, PNG or PDF.
                    </small>

                  </div>

                </div>

              </div>


              <!-- Additional Document -->

              <div class="govara-document-card">

                <div class="govara-document-heading">

                  <div>
                    <strong>Additional Document</strong>

                    <small>
                      Optional supporting document
                    </small>
                  </div>

                  <span
                    id="customer-additional-policy"
                    class="govara-policy-badge"
                  >
                    OPTIONAL
                  </span>

                </div>


                <div class="govara-form-grid">

                  <div class="govara-form-group">

                    <label for="customer-additional-type">
                      Document Type
                    </label>

                    <select
                      id="customer-additional-type"
                      name="additionalDocumentType"
                    >

                      <option value="">
                        Select document type
                      </option>

                      <option value="PASSPORT">
                        Passport
                      </option>

                      <option value="DRIVING_LICENSE">
                        Driving Licence
                      </option>

                      <option value="VOTER_ID">
                        Voter ID
                      </option>

                      <option value="OTHER">
                        Other
                      </option>

                    </select>

                  </div>


                  <div class="govara-form-group">

                    <label for="customer-additional-file">
                      Document File
                    </label>

                    <input
                      id="customer-additional-file"
                      name="additionalDocument"
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                    />

                    <small>
                      JPG, PNG or PDF.
                    </small>

                  </div>

                </div>

              </div>

            </div>


            <!-- ================================================
                 ID NOTE
            ================================================= -->

            <div class="govara-id-note">

              <strong>Customer ID</strong>

              <span>
                Automatically generated by GoVara Backend.
                Frontend does not generate business IDs.
              </span>

            </div>


            <div class="govara-id-note">

              <strong>KYC Authority</strong>

              <span>
                Backend remains authoritative for KYC,
                document verification and final status.
              </span>

            </div>


            <!-- ================================================
                 ACTIONS
            ================================================= -->

            <div class="govara-form-actions">

              <button
                type="submit"
                id="customer-register-button"
              >
                Register Customer
              </button>

              <button
                type="button"
                id="customer-clear-button"
              >
                Clear
              </button>

            </div>

          </form>

        </section>
      `;
    },


    /* ========================================================
     * EVENT BINDING
     * ======================================================== */

    bindEvents: function () {

      var self = this;


      var form =
        document.getElementById(
          'customer-registration-form'
        );

      if (form) {

        form.addEventListener(
          'submit',
          function (event) {

            event.preventDefault();

            self.submit();
          }
        );
      }


      var clearButton =
        document.getElementById(
          'customer-clear-button'
        );

      if (clearButton) {

        clearButton.addEventListener(
          'click',
          function () {

            self.clearForm();
          }
        );
      }


      /*
       * Profile photo preview.
       */
      var photoInput =
        document.getElementById(
          'customer-profile-photo'
        );

      if (photoInput) {

        photoInput.addEventListener(
          'change',
          function () {

            self.previewProfilePhoto(
              photoInput
            );
          }
        );
      }


      /*
       * Aadhaar formatting.
       */
      var aadhaarInput =
        document.getElementById(
          'customer-aadhaar-number'
        );

      if (aadhaarInput) {

        aadhaarInput.addEventListener(
          'input',
          function () {

            aadhaarInput.value =
              self.formatAadhaar(
                aadhaarInput.value
              );
          }
        );
      }


      /*
       * PAN formatting.
       */
      var panInput =
        document.getElementById(
          'customer-pan-number'
        );

      if (panInput) {

        panInput.addEventListener(
          'input',
          function () {

            panInput.value =
              String(
                panInput.value || ''
              )
                .toUpperCase()
                .replace(
                  /[^A-Z0-9]/g,
                  ''
                )
                .substring(0, 10);
          }
        );
      }
    },


    /* ========================================================
     * DOCUMENT POLICY
     * ======================================================== */

    applyDocumentPolicy: function () {

      var policy =
        this.documentPolicy || {};

      this.setPolicyBadge(
        'customer-photo-policy',
        policy.profilePhoto
      );

      this.setPolicyBadge(
        'customer-aadhaar-policy',
        policy.aadhaar
      );

      this.setPolicyBadge(
        'customer-pan-policy',
        policy.pan
      );

      this.setPolicyBadge(
        'customer-additional-policy',
        policy.additional
      );


      /*
       * Default frontend behavior:
       * OPTIONAL documents are not required.
       *
       * If Admin policy is later fetched from backend,
       * this method can be called again with the authoritative
       * policy.
       */
      this.applyRequiredState(
        'customer-profile-photo',
        policy.profilePhoto
      );

      this.applyRequiredState(
        'customer-aadhaar-number',
        policy.aadhaar
      );

      this.applyRequiredState(
        'customer-aadhaar-file',
        policy.aadhaar
      );

      this.applyRequiredState(
        'customer-pan-number',
        policy.pan
      );

      this.applyRequiredState(
        'customer-pan-file',
        policy.pan
      );

      this.applyRequiredState(
        'customer-additional-file',
        policy.additional
      );
    },


    setPolicyBadge: function (
      id,
      value
    ) {

      var element =
        document.getElementById(id);

      if (!element) {
        return;
      }

      element.textContent =
        String(
          value || 'OPTIONAL'
        ).toUpperCase();
    },


    applyRequiredState: function (
      id,
      policy
    ) {

      var element =
        document.getElementById(id);

      if (!element) {
        return;
      }

      element.required =
        String(policy || 'OPTIONAL')
          .toUpperCase() === 'MANDATORY';
    },


    /* ========================================================
     * READ FORM
     * ======================================================== */

    getFormData: function () {

      return {

        name:
          this.getValue(
            'customer-name'
          ),

        mobile:
          this.getValue(
            'customer-mobile'
          ),

        email:
          this.getValue(
            'customer-email'
          ),

        address:
          this.getValue(
            'customer-address'
          ),

        aadhaarNumber:
          this.getValue(
            'customer-aadhaar-number'
          ),

        panNumber:
          this.getValue(
            'customer-pan-number'
          ),

        additionalDocumentType:
          this.getValue(
            'customer-additional-type'
          )
      };
    },


    getValue: function (id) {

      var element =
        document.getElementById(id);

      if (!element) {
        return '';
      }

      return String(
        element.value || ''
      ).trim();
    },


    getFile: function (id) {

      var element =
        document.getElementById(id);

      if (
        !element ||
        !element.files ||
        !element.files.length
      ) {
        return null;
      }

      return element.files[0];
    },


    /* ========================================================
     * MOBILE NORMALIZATION
     * ======================================================== */

    normalizeMobile: function (mobile) {

      var value =
        String(
          mobile || ''
        ).trim();

      value =
        value.replace(
          /[\s-]/g,
          ''
        );

      if (
        value.indexOf('+91') === 0
      ) {

        value =
          value.substring(3);

      } else if (
        value.indexOf('91') === 0 &&
        value.length === 12
      ) {

        value =
          value.substring(2);
      }

      return value;
    },


    /* ========================================================
     * EMAIL VALIDATION
     * ======================================================== */

    isValidEmail: function (email) {

      var value =
        String(
          email || ''
        ).trim();

      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
        .test(value);
    },


    /* ========================================================
     * AADHAAR
     * ======================================================== */

    normalizeAadhaar: function (
      value
    ) {

      return String(
        value || ''
      )
        .replace(
          /[^0-9]/g,
          ''
        )
        .substring(0, 12);
    },


    formatAadhaar: function (
      value
    ) {

      var normalized =
        this.normalizeAadhaar(
          value
        );

      return normalized
        .replace(
          /(\d{4})(?=\d)/g,
          '$1 '
        )
        .trim();
    },


    isValidAadhaar: function (
      value
    ) {

      var normalized =
        this.normalizeAadhaar(
          value
        );

      return (
        !normalized ||
        /^[0-9]{12}$/.test(
          normalized
        )
      );
    },


    /* ========================================================
     * PAN
     * ======================================================== */

    isValidPAN: function (
      value
    ) {

      var normalized =
        String(
          value || ''
        )
          .trim()
          .toUpperCase();

      return (
        !normalized ||
        /^[A-Z]{5}[0-9]{4}[A-Z]$/
          .test(normalized)
      );
    },


    /* ========================================================
     * FILE VALIDATION
     * ======================================================== */

    validateFile: function (
      file,
      options
    ) {

      if (!file) {
        return null;
      }

      options =
        options || {};

      var maxSize =
        options.maxSize ||
        (5 * 1024 * 1024);

      var allowedTypes =
        options.allowedTypes ||
        [
          'image/jpeg',
          'image/png',
          'image/webp',
          'application/pdf'
        ];

      if (
        file.size >
        maxSize
      ) {

        return (
          file.name +
          ' exceeds the maximum allowed size of 5 MB.'
        );
      }

      if (
        allowedTypes.indexOf(
          file.type
        ) === -1
      ) {

        return (
          file.name +
          ' has an unsupported file type.'
        );
      }

      return null;
    },


    /* ========================================================
     * FRONTEND VALIDATION
     * ======================================================== */

    validate: function (data) {

      var errors = [];


      /* Name */

      if (!data.name) {

        errors.push(
          'Name is required.'
        );

      } else if (
        data.name.length < 2
      ) {

        errors.push(
          'Name must contain at least 2 characters.'
        );
      }


      /* Mobile */

      var mobile =
        this.normalizeMobile(
          data.mobile
        );

      if (!mobile) {

        errors.push(
          'Mobile number is required.'
        );

      } else if (
        !/^[6-9][0-9]{9}$/.test(
          mobile
        )
      ) {

        errors.push(
          'Enter a valid 10-digit Indian mobile number.'
        );
      }


      /* Email */

      if (!data.email) {

        errors.push(
          'Email is required.'
        );

      } else if (
        !this.isValidEmail(
          data.email
        )
      ) {

        errors.push(
          'Enter a valid email address.'
        );
      }


      /* Address */

      if (!data.address) {

        errors.push(
          'Address is required.'
        );

      } else if (
        data.address.length < 5
      ) {

        errors.push(
          'Address is too short.'
        );
      }


      /* Aadhaar */

      if (
        !this.isValidAadhaar(
          data.aadhaarNumber
        )
      ) {

        errors.push(
          'Aadhaar number must contain 12 digits.'
        );
      }


      /* PAN */

      if (
        !this.isValidPAN(
          data.panNumber
        )
      ) {

        errors.push(
          'Enter a valid PAN number.'
        );
      }


      /* Files */

      var photo =
        this.getFile(
          'customer-profile-photo'
        );

      var aadhaarFile =
        this.getFile(
          'customer-aadhaar-file'
        );

      var panFile =
        this.getFile(
          'customer-pan-file'
        );

      var additionalFile =
        this.getFile(
          'customer-additional-file'
        );


      var fileError;


      fileError =
        this.validateFile(
          photo,
          {
            allowedTypes: [
              'image/jpeg',
              'image/png',
              'image/webp'
            ]
          }
        );

      if (fileError) {
        errors.push(fileError);
      }


      fileError =
        this.validateFile(
          aadhaarFile
        );

      if (fileError) {
        errors.push(fileError);
      }


      fileError =
        this.validateFile(
          panFile
        );

      if (fileError) {
        errors.push(fileError);
      }


      fileError =
        this.validateFile(
          additionalFile
        );

      if (fileError) {
        errors.push(fileError);
      }


      /*
       * If a document type is selected,
       * an additional document should exist.
       */
      if (
        data.additionalDocumentType &&
        !additionalFile
      ) {

        errors.push(
          'Please upload the selected additional document.'
        );
      }


      /*
       * If Aadhaar number is provided,
       * document upload is not automatically mandatory
       * unless Admin policy makes it mandatory.
       *
       * Backend remains authoritative.
       */


      return {

        valid:
          errors.length === 0,

        errors:
          errors
      };
    },


    /* ========================================================
     * BUILD API PAYLOAD
     * ======================================================== */

    buildRegistrationPayload:
      async function (data) {

        /*
         * IMPORTANT:
         * File objects are NOT JSON serializable.
         *
         * We prepare metadata here.
         * Actual file persistence must be implemented by
         * the backend/document API contract.
         */

        var payload = {

          name:
            data.name,

          mobile:
            this.normalizeMobile(
              data.mobile
            ),

          email:
            data.email,

          address:
            data.address,

          documents: {

            profilePhoto: null,

            aadhaar: {
              number:
                this.normalizeAadhaar(
                  data.aadhaarNumber
                ),
              file: null
            },

            pan: {
              number:
                String(
                  data.panNumber || ''
                )
                  .trim()
                  .toUpperCase(),
              file: null
            },

            additional: {
              type:
                data.additionalDocumentType ||
                '',
              file: null
            }
          }
        };


        var photo =
          this.getFile(
            'customer-profile-photo'
          );

        var aadhaarFile =
          this.getFile(
            'customer-aadhaar-file'
          );

        var panFile =
          this.getFile(
            'customer-pan-file'
          );

        var additionalFile =
          this.getFile(
            'customer-additional-file'
          );


        /*
         * File metadata only.
         *
         * No fake document IDs are generated.
         */
        if (photo) {

          payload.documents.profilePhoto = {
            name: photo.name,
            type: photo.type,
            size: photo.size
          };
        }


        if (aadhaarFile) {

          payload.documents.aadhaar.file = {
            name: aadhaarFile.name,
            type: aadhaarFile.type,
            size: aadhaarFile.size
          };
        }


        if (panFile) {

          payload.documents.pan.file = {
            name: panFile.name,
            type: panFile.type,
            size: panFile.size
          };
        }


        if (additionalFile) {

          payload.documents.additional.file = {
            name: additionalFile.name,
            type: additionalFile.type,
            size: additionalFile.size
          };
        }


        return payload;
      },


    /* ========================================================
     * SUBMIT
     * ======================================================== */

    submit: async function () {

      if (this.state.loading) {
        return;
      }

      this.clearMessage();


      var data =
        this.getFormData();


      /*
       * Frontend validation.
       */
      var validation =
        this.validate(data);

      if (!validation.valid) {

        this.showError(
          validation.errors.join(' ')
        );

        return;
      }


      data.mobile =
        this.normalizeMobile(
          data.mobile
        );


      /*
       * API boundary must exist.
       */
      if (!window.GoVaraAPI) {

        this.showError(
          'GoVara API is not configured.'
        );

        return;
      }


      this.setLoading(true);


      try {

        var payload =
          await this.buildRegistrationPayload(
            data
          );


        var response =
          await this.callCustomerRegister(
            payload
          );


        this.handleResponse(
          response
        );

      } catch (error) {

        this.showError(
          error &&
          error.message
            ? error.message
            : 'Customer registration failed.'
        );

      } finally {

        this.setLoading(false);
      }
    },


    /* ========================================================
     * API CALL
     * ======================================================== */

    callCustomerRegister:
      async function (data) {

        /*
         * Preferred API method.
         */
        if (
          typeof window.GoVaraAPI.customerRegister ===
          'function'
        ) {

          return await
            window.GoVaraAPI.customerRegister(
              data
            );
        }


        /*
         * Generic consolidated API fallback.
         */
        if (
          typeof window.GoVaraAPI.request ===
          'function'
        ) {

          return await
            window.GoVaraAPI.request({

              action:
                this.ACTION,

              module:
                this.MODULE,

              data:
                data
            });
        }


        throw new Error(
          'CUSTOMER_REGISTER API method is not available.'
        );
      },


    /* ========================================================
     * RESPONSE HANDLING
     * ======================================================== */

    handleResponse: function (
      response
    ) {

      if (!response) {

        this.showError(
          'Empty response received from backend.'
        );

        return;
      }


      if (
        response.success !== true
      ) {

        this.showError(
          this.extractError(
            response
          )
        );

        return;
      }


      var result =
        response.result ||
        response;


      this.state.registered =
        true;


      this.state.customerId =
        response.customerId ||
        result.customerId ||
        '';


      this.state.userId =
        response.userId ||
        result.userId ||
        '';


      this.state.session =
        response.session ||
        result.session ||
        null;


      this.state.success =
        'Customer registered successfully.';


      this.showSuccess(
        result,
        response
      );
    },


    /* ========================================================
     * ERROR EXTRACTION
     * ======================================================== */

    extractError: function (
      response
    ) {

      var result =
        response.result ||
        response;


      var validation =
        result.validation ||
        response.validation;


      if (
        validation &&
        Array.isArray(
          validation.errors
        ) &&
        validation.errors.length
      ) {

        var errors =
          validation.errors;


        if (
          errors.indexOf(
            'MOBILE_ALREADY_REGISTERED'
          ) !== -1
        ) {

          return (
            'This mobile number is already registered.'
          );
        }


        if (
          errors.indexOf(
            'EMAIL_ALREADY_REGISTERED'
          ) !== -1
        ) {

          return (
            'This email address is already registered.'
          );
        }


        return errors.join(' ');
      }


      if (response.error) {

        return String(
          response.error
        );
      }


      if (result.error) {

        return String(
          result.error
        );
      }


      if (
        response.status ===
        'UNAUTHORIZED'
      ) {

        return (
          'Registration is not authorized.'
        );
      }


      if (
        response.status ===
        'FORBIDDEN'
      ) {

        return (
          'Registration permission denied.'
        );
      }


      return (
        'Customer registration failed.'
      );
    },


    /* ========================================================
     * SUCCESS UI
     * ======================================================== */

    showSuccess: function (
      result,
      response
    ) {

      var successBox =
        document.getElementById(
          'customer-registration-success'
        );


      var form =
        document.getElementById(
          'customer-registration-form'
        );


      if (successBox) {

        successBox.style.display =
          'block';
      }


      if (form) {

        form.style.display =
          'none';
      }


      this.setText(
        'customer-generated-id',
        this.state.customerId ||
          'Not returned'
      );


      this.setText(
        'customer-generated-user-id',
        this.state.userId ||
          'Not returned'
      );


      this.setText(
        'customer-generated-kyc',
        result.kycStatus ||
          result.KYC_Status ||
          'PENDING'
      );


      this.setText(
        'customer-generated-status',
        result.status ||
          response.status ||
          'ACTIVE'
      );


      this.showMessage(
        'Customer registered successfully.',
        'success'
      );
    },


    /* ========================================================
     * PROFILE PHOTO PREVIEW
     * ======================================================== */

    previewProfilePhoto: function (
      input
    ) {

      var preview =
        document.getElementById(
          'customer-profile-photo-preview'
        );


      if (!preview) {
        return;
      }


      preview.innerHTML = '';


      if (
        !input ||
        !input.files ||
        !input.files.length
      ) {

        preview.style.display =
          'none';

        return;
      }


      var file =
        input.files[0];


      if (
        [
          'image/jpeg',
          'image/png',
          'image/webp'
        ].indexOf(
          file.type
        ) === -1
      ) {

        preview.style.display =
          'none';

        return;
      }


      var url =
        URL.createObjectURL(
          file
        );


      var image =
        document.createElement(
          'img'
        );


      image.src =
        url;

      image.alt =
        'Profile photo preview';

      image.style.maxWidth =
        '120px';

      image.style.maxHeight =
        '120px';

      image.style.borderRadius =
        '12px';


      preview.appendChild(
        image
      );


      preview.style.display =
        'block';
    },


    /* ========================================================
     * TEXT HELPER
     * ======================================================== */

    setText: function (
      id,
      value
    ) {

      var element =
        document.getElementById(id);


      if (element) {

        element.textContent =
          String(
            value || ''
          );
      }
    },


    /* ========================================================
     * LOADING STATE
     * ======================================================== */

    setLoading: function (
      loading
    ) {

      this.state.loading =
        loading;


      var button =
        document.getElementById(
          'customer-register-button'
        );


      if (!button) {
        return;
      }


      button.disabled =
        loading;


      button.textContent =
        loading
          ? 'Registering...'
          : 'Register Customer';
    },


    /* ========================================================
     * CLEAR FORM
     * ======================================================== */

    clearForm: function () {

      var form =
        document.getElementById(
          'customer-registration-form'
        );


      if (form) {

        form.reset();
      }


      var preview =
        document.getElementById(
          'customer-profile-photo-preview'
        );


      if (preview) {

        preview.innerHTML =
          '';

        preview.style.display =
          'none';
      }


      this.clearMessage();
    },


    /* ========================================================
     * MESSAGE
     * ======================================================== */

    showMessage: function (
      message,
      type
    ) {

      var box =
        document.getElementById(
          'customer-registration-message'
        );


      if (!box) {
        return;
      }


      box.style.display =
        'block';


      box.className =
        'govara-message govara-message-' +
        (
          type || 'info'
        );


      box.textContent =
        message;
    },


    showError: function (
      message
    ) {

      this.state.error =
        String(
          message || ''
        );


      this.showMessage(
        message,
        'error'
      );
    },


    clearMessage: function () {

      var box =
        document.getElementById(
          'customer-registration-message'
        );


      if (!box) {
        return;
      }


      box.style.display =
        'none';


      box.textContent =
        '';


      box.className =
        'govara-message';
    }
  };


  /* ==========================================================
   * GLOBAL EXPOSURE
   * ========================================================== */

  window.GoVaraCustomer =
    GoVaraCustomer;


  /*
   * IMPORTANT:
   * No automatic rendering.
   *
   * Master frontend router calls:
   *
   * GoVaraCustomer.init()
   *
   * when STEP 28 is opened.
   */


})(window, document);

