/* ============================================================
 * GoVara — 28-Customer.js
 * Customer Registration Frontend Module
 *
 * PURPOSE
 * - Customer registration UI
 * - Frontend basic validation
 * - ONE Consolidated API Boundary
 * - Backend-generated Customer_ID
 * - Backend-generated User_ID
 * - No direct database access
 * - No frontend-generated business IDs
 * - Testing Mode / Real Money safety preserved
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
      success: ''
    },

    /* ========================================================
     * INITIALIZE
     * ======================================================== */

    init: function () {

      this.registerModule();

      this.render();

      this.bindEvents();
    },


    /* ========================================================
     * MODULE REGISTRATION
     * ======================================================== */

    registerModule: function () {

      window.GoVaraCustomer = this;

      if (!window.GoVaraModules) {
        window.GoVaraModules = {};
      }

      window.GoVaraModules.Customer =
        this;
    },


    /* ========================================================
     * RENDER
     * ======================================================== */

    render: function () {

      var container =
        document.getElementById(
          'customer-page'
        );

      if (!container) {

        container =
          document.getElementById(
            'main-content'
          );
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


          <div
            id="customer-registration-success"
            style="display:none;"
          >

            <div class="govara-success-card">

              <h3>Customer Registered Successfully</h3>

              <div class="govara-id-row">

                <span>Customer ID</span>

                <strong
                  id="customer-generated-id"
                ></strong>

              </div>

              <div class="govara-id-row">

                <span>User ID</span>

                <strong
                  id="customer-generated-user-id"
                ></strong>

              </div>

              <div class="govara-id-row">

                <span>KYC Status</span>

                <strong
                  id="customer-generated-kyc"
                ></strong>

              </div>

              <div class="govara-id-row">

                <span>Status</span>

                <strong
                  id="customer-generated-status"
                ></strong>

              </div>

            </div>

          </div>


          <form
            id="customer-registration-form"
            autocomplete="off"
          >

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
                  maxlength="10"
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


            <div class="govara-id-note">

              <strong>Customer ID</strong>

              <span>
                Automatically generated by GoVara Backend
              </span>

            </div>


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

      if (value.indexOf('+91') === 0) {

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
     * FRONTEND VALIDATION
     * ======================================================== */

    validate: function (data) {

      var errors = [];

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


      var mobile =
        this.normalizeMobile(
          data.mobile
        );

      if (!mobile) {

        errors.push(
          'Mobile number is required.'
        );

      } else if (
        !/^[6-9][0-9]{9}$/.test(mobile)
      ) {

        errors.push(
          'Enter a valid 10-digit Indian mobile number.'
        );
      }


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


      return {
        valid:
          errors.length === 0,

        errors:
          errors
      };
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


      /*
       * Normalize mobile before sending.
       */
      data.mobile =
        this.normalizeMobile(
          data.mobile
        );


      /*
       * API boundary must exist.
       */
      if (
        !window.GoVaraAPI
      ) {

        this.showError(
          'GoVara API is not configured.'
        );

        return;
      }


      /*
       * CUSTOMER_REGISTER must go
       * through ONE Consolidated API.
       */
      this.setLoading(true);

      try {

        var response =
          await this.callCustomerRegister(
            data
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

    callCustomerRegister: async function (data) {

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
       *
       * This does NOT access the database directly.
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

    handleResponse: function (response) {

      if (!response) {

        this.showError(
          'Empty response received from backend.'
        );

        return;
      }


      if (
        response.success !== true
      ) {

        var errorMessage =
          this.extractError(
            response
          );

        this.showError(
          errorMessage
        );

        return;
      }


      var result =
        response.result ||
        response;


      /*
       * Successful registration.
       */
      this.state.registered = true;

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

    extractError: function (response) {

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


      if (
        response.error
      ) {

        return String(
          response.error
        );
      }


      if (
        result.error
      ) {

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


  /* ==========================================================
   * AUTO INITIALIZATION
   *
   * If the main application has its own navigation lifecycle,
   * it can call:
   *
   * GoVaraCustomer.init()
   *
   * directly.
   * ========================================================== */

  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      function () {

        /*
         * Do not force-render over an existing
         * application page.
         *
         * The module is initialized when
         * Customer navigation opens it.
         */
      }
    );

  }


})(window, document);
