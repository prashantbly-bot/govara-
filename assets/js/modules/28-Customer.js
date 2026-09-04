/* ============================================================
   GoVara — STEP 28 Customer Module
   Registration Contract Safe Version
   ============================================================ */

(function () {
  'use strict';

  var Customer = {

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
      documentPolicy: {
        profilePhoto: 'OPTIONAL',
        aadhaar: 'OPTIONAL',
        pan: 'OPTIONAL',
        additional: 'OPTIONAL'
      },
      files: {
        profilePhoto: null,
        aadhaar: null,
        pan: null,
        additional: null
      }
    },

    init: function () {
      this.registerModule();
      this.render();
      this.bindEvents();
    },

    registerModule: function () {
      window.GoVaraCustomer = this;
    },

    render: function () {
      var root =
        document.getElementById('customer-page') ||
        document.getElementById('main-content');

      if (!root) return;

      root.innerHTML = this.getHTML();
      this.applyDocumentPolicy();
    },

    getHTML: function () {
      return `
        <div class="module-card" style="max-width:900px;margin:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
            <div>
              <h2 style="margin:0;">Customer Registration</h2>
              <div class="muted">Register a new GoVara Customer.</div>
            </div>
            <span class="status-badge">TESTING MODE</span>
          </div>

          <div id="customer-message" style="margin-top:16px;"></div>

          <form id="customer-registration-form" style="margin-top:18px;">

            <h3>Basic Profile</h3>

            <div class="form-grid">
              <div>
                <label>Full Name *</label>
                <input id="customer-name" type="text"
                       maxlength="150" autocomplete="name"
                       placeholder="Enter full name">
              </div>

              <div>
                <label>Mobile Number *</label>
                <input id="customer-mobile" type="tel"
                       maxlength="13" autocomplete="tel"
                       placeholder="10-digit Indian mobile">
              </div>

              <div>
                <label>Email *</label>
                <input id="customer-email" type="email"
                       maxlength="150" autocomplete="email"
                       placeholder="name@example.com">
              </div>

              <div>
                <label>Address *</label>
                <textarea id="customer-address"
                          maxlength="500"
                          placeholder="Enter address"></textarea>
              </div>
            </div>

            <hr>

            <h3>
              Documents
              <span class="muted" style="font-size:12px;">
                Admin controlled
              </span>
            </h3>

            <div class="document-box">
              <div class="document-row">
                <div>
                  <strong>Profile Photo</strong>
                  <div id="profile-photo-policy" class="muted">OPTIONAL</div>
                </div>
                <input id="profile-photo" type="file"
                       accept="image/jpeg,image/png,image/webp">
              </div>

              <div id="profile-preview" style="margin-top:8px;"></div>

              <div class="document-row">
                <div>
                  <strong>Aadhaar Card</strong>
                  <div id="aadhaar-policy" class="muted">OPTIONAL</div>
                </div>
                <div>
                  <input id="aadhaar-number" type="text"
                         maxlength="14"
                         placeholder="XXXX XXXX XXXX">
                  <input id="aadhaar-file" type="file"
                         accept=".jpg,.jpeg,.png,.pdf">
                </div>
              </div>

              <div class="document-row">
                <div>
                  <strong>PAN Card</strong>
                  <div id="pan-policy" class="muted">OPTIONAL</div>
                </div>
                <div>
                  <input id="pan-number" type="text"
                         maxlength="10"
                         placeholder="ABCDE1234F">
                  <input id="pan-file" type="file"
                         accept=".jpg,.jpeg,.png,.pdf">
                </div>
              </div>

              <div class="document-row">
                <div>
                  <strong>Other Document</strong>
                  <div id="additional-policy" class="muted">OPTIONAL</div>
                </div>
                <div>
                  <input id="additional-type" type="text"
                         maxlength="100"
                         placeholder="Document type">
                  <input id="additional-file" type="file"
                         accept=".jpg,.jpeg,.png,.pdf">
                </div>
              </div>
            </div>

            <div class="muted" style="margin-top:12px;">
              Documents are collected in the Customer UI only.
              They are NOT sent inside CUSTOMER_REGISTER until the
              backend Document Service contract is connected.
            </div>

            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px;">
              <button id="customer-register-btn" type="submit">
                Register Customer
              </button>
              <button id="customer-clear-btn" type="button">
                Clear
              </button>
            </div>

          </form>
        </div>
      `;
    },

    bindEvents: function () {
      var self = this;

      var form = document.getElementById('customer-registration-form');
      var clear = document.getElementById('customer-clear-btn');
      var photo = document.getElementById('profile-photo');

      if (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          self.submit();
        });
      }

      if (clear) {
        clear.addEventListener('click', function () {
          self.clear();
        });
      }

      if (photo) {
        photo.addEventListener('change', function () {
          self.state.files.profilePhoto =
            photo.files && photo.files[0] ? photo.files[0] : null;
          self.previewProfilePhoto();
        });
      }

      var aadhaarFile = document.getElementById('aadhaar-file');
      var panFile = document.getElementById('pan-file');
      var additionalFile = document.getElementById('additional-file');

      if (aadhaarFile) {
        aadhaarFile.addEventListener('change', function () {
          self.state.files.aadhaar =
            aadhaarFile.files && aadhaarFile.files[0]
              ? aadhaarFile.files[0] : null;
        });
      }

      if (panFile) {
        panFile.addEventListener('change', function () {
          self.state.files.pan =
            panFile.files && panFile.files[0]
              ? panFile.files[0] : null;
        });
      }

      if (additionalFile) {
        additionalFile.addEventListener('change', function () {
          self.state.files.additional =
            additionalFile.files && additionalFile.files[0]
              ? additionalFile.files[0] : null;
        });
      }
    },

    getFormData: function () {
      return {
        name: (document.getElementById('customer-name') || {}).value || '',
        mobile: (document.getElementById('customer-mobile') || {}).value || '',
        email: (document.getElementById('customer-email') || {}).value || '',
        address: (document.getElementById('customer-address') || {}).value || ''
      };
    },

    normalizeMobile: function (mobile) {
      var value = String(mobile || '').trim();
      value = value.replace(/[\s-]/g, '');

      if (value.indexOf('+91') === 0) {
        value = value.substring(3);
      } else if (value.indexOf('91') === 0 && value.length === 12) {
        value = value.substring(2);
      }

      return value;
    },

    validate: function (data) {
      var errors = [];

      if (!data.name || data.name.trim().length < 2) {
        errors.push('Enter a valid full name.');
      }

      data.mobile = this.normalizeMobile(data.mobile);

      if (!/^[6-9][0-9]{9}$/.test(data.mobile)) {
        errors.push('Enter a valid 10-digit Indian mobile number.');
      }

      if (
        !data.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
      ) {
        errors.push('Enter a valid email address.');
      }

      if (!data.address || data.address.trim().length < 3) {
        errors.push('Enter a valid address.');
      }

      if (data.address.length > 500) {
        errors.push('Address cannot exceed 500 characters.');
      }

      return errors;
    },

    applyDocumentPolicy: function () {
      var p = this.state.documentPolicy;

      this.setPolicyBadge('profile-photo-policy', p.profilePhoto);
      this.setPolicyBadge('aadhaar-policy', p.aadhaar);
      this.setPolicyBadge('pan-policy', p.pan);
      this.setPolicyBadge('additional-policy', p.additional);

      this.applyRequiredState('profile-photo', p.profilePhoto);
      this.applyRequiredState('aadhaar-file', p.aadhaar);
      this.applyRequiredState('pan-file', p.pan);
      this.applyRequiredState('additional-file', p.additional);
    },

    setPolicyBadge: function (id, value) {
      var el = document.getElementById(id);
      if (el) el.textContent = value;
    },

    applyRequiredState: function (id, policy) {
      var el = document.getElementById(id);
      if (!el) return;

      el.required = policy === 'MANDATORY';
      el.disabled = policy === 'DISABLED';

      if (policy === 'DISABLED') {
        el.value = '';
      }
    },

    previewProfilePhoto: function () {
      var root = document.getElementById('profile-preview');
      var file = this.state.files.profilePhoto;

      if (!root) return;

      root.innerHTML = '';

      if (!file) return;

      if (!/^image\//.test(file.type)) {
        root.textContent = 'Profile photo must be an image.';
        return;
      }

      var url = URL.createObjectURL(file);

      root.innerHTML =
        '<img src="' + url +
        '" alt="Profile Preview" ' +
        'style="width:90px;height:90px;object-fit:cover;border-radius:8px;">';
    },

    validateDocuments: function () {
      var errors = [];
      var p = this.state.documentPolicy;
      var f = this.state.files;

      if (p.profilePhoto === 'MANDATORY' && !f.profilePhoto) {
        errors.push('Profile Photo is mandatory.');
      }

      if (p.aadhaar === 'MANDATORY' && !f.aadhaar) {
        errors.push('Aadhaar document is mandatory.');
      }

      if (p.pan === 'MANDATORY' && !f.pan) {
        errors.push('PAN document is mandatory.');
      }

      if (p.additional === 'MANDATORY' && !f.additional) {
        errors.push('Additional document is mandatory.');
      }

      var aadhaar =
        (document.getElementById('aadhaar-number') || {}).value || '';

      aadhaar = aadhaar.replace(/\s/g, '');

      if (aadhaar && !/^[2-9][0-9]{11}$/.test(aadhaar)) {
        errors.push('Enter a valid 12-digit Aadhaar number.');
      }

      var pan =
        (document.getElementById('pan-number') || {}).value || '';

      pan = pan.trim().toUpperCase();

      if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
        errors.push('Enter a valid PAN number.');
      }

      return errors;
    },

    /*
     * IMPORTANT:
     * Registration payload deliberately contains ONLY the fields
     * supported by the current backend CUSTOMER_REGISTER contract.
     *
     * Do NOT add documents here until Document Service is connected.
     */
    buildRegistrationPayload: function () {
      var data = this.getFormData();

      return {
        name: data.name.trim(),
        mobile: this.normalizeMobile(data.mobile),
        email: data.email.trim().toLowerCase(),
        address: data.address.trim()
      };
    },

    submit: function () {
      var self = this;
      var data = this.getFormData();
      var errors = this.validate(data);

      if (!errors.length) {
        errors = this.validateDocuments();
      }

      if (errors.length) {
        this.showError(errors.join('<br>'));
        return;
      }

      if (this.state.loading) return;

      this.state.loading = true;
      this.state.error = '';
      this.state.success = '';
      this.setButtonState(true);

      this.callCustomerRegister(this.buildRegistrationPayload())
        .then(function (response) {
          self.handleResponse(response);
        })
        .catch(function (error) {
          self.showError(self.extractError(error));
        })
        .finally(function () {
          self.state.loading = false;
          self.setButtonState(false);
        });
    },

    callCustomerRegister: function (data) {
      var api = window.GoVaraAPI;

      if (!api) {
        return Promise.reject(new Error('GoVara API is not available.'));
      }

      if (typeof api.customerRegister === 'function') {
        return Promise.resolve(api.customerRegister(data));
      }

      if (typeof api.request === 'function') {
        return Promise.resolve(
          api.request({
            action: 'CUSTOMER_REGISTER',
            module: 'CUSTOMER',
            data: data
          })
        );
      }

      return Promise.reject(
        new Error('CUSTOMER_REGISTER API method is not available.')
      );
    },

    handleResponse: function (response) {
      var result = response && response.result
        ? response.result
        : response;

      if (!result || result.success !== true) {
        var message =
          result && (
            result.message ||
            result.error ||
            result.status
          );

        if (
          result &&
          result.validation &&
          result.validation.errors &&
          result.validation.errors.length
        ) {
          message = result.validation.errors.join('<br>');
        }

        this.showError(message || 'Customer registration failed.');
        return;
      }

      this.state.registered = true;
      this.state.customerId = result.customerId || '';
      this.state.userId = result.userId || '';
      this.state.session = result.session || null;

      this.state.success =
        'Customer registered successfully.' +
        '<br><strong>Customer ID:</strong> ' +
        (this.state.customerId || 'Generated by Backend') +
        '<br><strong>User ID:</strong> ' +
        (this.state.userId || 'Generated by Backend');

      this.showSuccess(this.state.success);
    },

    extractError: function (error) {
      if (!error) return 'Customer registration failed.';

      if (typeof error === 'string') return error;

      return (
        error.message ||
        error.error ||
        'Customer registration failed.'
      );
    },

    showError: function (message) {
      var box = document.getElementById('customer-message');
      if (!box) return;

      box.innerHTML =
        '<div class="error-box">' + message + '</div>';
    },

    showSuccess: function (message) {
      var box = document.getElementById('customer-message');
      if (!box) return;

      box.innerHTML =
        '<div class="success-box">' + message + '</div>';
    },

    setButtonState: function (loading) {
      var btn = document.getElementById('customer-register-btn');

      if (!btn) return;

      btn.disabled = loading;
      btn.textContent = loading
        ? 'Registering...'
        : 'Register Customer';
    },

    clear: function () {
      var form = document.getElementById('customer-registration-form');

      if (form) form.reset();

      this.state.registered = false;
      this.state.customerId = '';
      this.state.userId = '';
      this.state.session = null;
      this.state.error = '';
      this.state.success = '';

      this.state.files = {
        profilePhoto: null,
        aadhaar: null,
        pan: null,
        additional: null
      };

      var preview = document.getElementById('profile-preview');
      if (preview) preview.innerHTML = '';

      var message = document.getElementById('customer-message');
      if (message) message.innerHTML = '';

      this.applyDocumentPolicy();
    }
  };

  window.GoVaraCustomer = Customer;

})();
