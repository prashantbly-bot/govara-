/************************************************************
 * GoVara — 28-Customer.js
 * Customer Registration Module
 *
 * PURPOSE:
 * - Customer registration UI
 * - Frontend validation
 * - Profile photo preview
 * - Aadhaar / PAN basic validation
 * - Admin document policy display
 * - Consolidated API registration
 *
 * AUTHORITY:
 * - Frontend does NOT write database directly
 * - Backend generates Customer_ID / User_ID
 * - Backend remains authoritative
 * - CUSTOMER_REGISTER is handled by GoVaraAPI
 *
 * IMPORTANT:
 * - Registration payload contains only fields currently
 *   supported by backend Customer Registration Service:
 *
 *   name
 *   mobile
 *   email
 *   address
 *
 * - Documents are NOT falsely persisted from frontend.
 ************************************************************/

(function () {
  'use strict';

  /* ========================================================
     1. MODULE CONFIGURATION
     ======================================================== */

  var MODULE_NAME = 'CUSTOMER';
  var ACTION = 'CUSTOMER_REGISTER';

  var state = {
    submitting: false,
    lastResponse: null,
    profilePhotoData: '',
    documentPolicy: {
      aadhaar: 'OPTIONAL',
      pan: 'OPTIONAL',
      other: 'OPTIONAL'
    }
  };

  /* ========================================================
     2. SAFE HELPERS
     ======================================================== */

  function byId(id) {
    return document.getElementById(id);
  }

  function valueByIds(ids) {
    for (var i = 0; i < ids.length; i++) {
      var el = byId(ids[i]);

      if (el && typeof el.value !== 'undefined') {
        var value = String(el.value || '').trim();

        if (value !== '') {
          return value;
        }
      }
    }

    return '';
  }

  function setText(ids, value) {
    for (var i = 0; i < ids.length; i++) {
      var el = byId(ids[i]);

      if (el) {
        el.textContent = value;
        return;
      }
    }
  }

  function showMessage(message, type) {
    var box =
      byId('customer-message') ||
      byId('customer-status') ||
      byId('customerResult') ||
      byId('customer-result');

    if (!box) {
      console.log('[GoVara Customer]', message);
      return;
    }

    box.textContent = message;

    box.dataset.type = type || 'info';

    if (type === 'success') {
      box.className = 'customer-message success';
    } else if (type === 'error') {
      box.className = 'customer-message error';
    } else {
      box.className = 'customer-message info';
    }
  }

  function stringifyResponse(response) {
    try {
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return String(response || '');
    }
  }

  function showResponse(response) {
    var output =
      byId('customer-api-response') ||
      byId('customer-response') ||
      byId('customerResult') ||
      byId('customer-result');

    if (!output) {
      return;
    }

    output.textContent = stringifyResponse(response);
  }

  /* ========================================================
     3. FIELD READERS
     ======================================================== */

  function getName() {
    return valueByIds([
      'customer-name',
      'customerName',
      'full-name',
      'fullName',
      'name'
    ]);
  }

  function getMobile() {
    return valueByIds([
      'customer-mobile',
      'customerMobile',
      'mobile-number',
      'mobileNumber',
      'mobile',
      'phone'
    ]);
  }

  function getEmail() {
    return valueByIds([
      'customer-email',
      'customerEmail',
      'email-address',
      'emailAddress',
      'email'
    ]);
  }

  function getAddress() {
    return valueByIds([
      'customer-address',
      'customerAddress',
      'address'
    ]);
  }

  function getProfilePhotoElement() {
    return (
      byId('customer-profile-photo') ||
      byId('profile-photo') ||
      byId('profilePhoto') ||
      byId('customerPhoto')
    );
  }

  function getAadhaar() {
    return valueByIds([
      'customer-aadhaar',
      'customerAadhaar',
      'aadhaar-number',
      'aadhaarNumber',
      'aadhaar'
    ]);
  }

  function getPAN() {
    return valueByIds([
      'customer-pan',
      'customerPAN',
      'pan-number',
      'panNumber',
      'pan'
    ]);
  }

  function getOtherDocument() {
    return valueByIds([
      'customer-other-document',
      'customerOtherDocument',
      'other-document',
      'otherDocument'
    ]);
  }

  /* ========================================================
     4. NORMALIZATION
     ======================================================== */

  function normalizeName(value) {
    return String(value || '')
      .trim()
      .replace(/\s+/g, ' ');
  }

  function normalizeMobile(value) {
    var mobile = String(value || '')
      .trim()
      .replace(/[\s()-]/g, '');

    if (mobile.indexOf('+91') === 0) {
      mobile = mobile.substring(3);
    } else if (mobile.indexOf('91') === 0 && mobile.length === 12) {
      mobile = mobile.substring(2);
    }

    return mobile;
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

  /* ========================================================
     5. VALIDATION
     ======================================================== */

  function validateName(name) {
    if (!name) {
      return 'Full Name is required.';
    }

    if (name.length < 2) {
      return 'Full Name must contain at least 2 characters.';
    }

    if (name.length > 150) {
      return 'Full Name is too long.';
    }

    return '';
  }

  function validateMobile(mobile) {
    if (!mobile) {
      return 'Mobile number is required.';
    }

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      return 'Enter a valid Indian mobile number.';
    }

    return '';
  }

  function validateEmail(email) {
    if (!email) {
      return 'Email is required.';
    }

    if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      return 'Enter a valid email address.';
    }

    return '';
  }

  function validateAddress(address) {
    if (!address) {
      return 'Address is required.';
    }

    if (address.length > 500) {
      return 'Address cannot exceed 500 characters.';
    }

    return '';
  }

  function validateAadhaar(aadhaar) {
    if (!aadhaar) {
      return '';
    }

    var clean = aadhaar.replace(/\s+/g, '');

    if (!/^[0-9]{12}$/.test(clean)) {
      return 'Aadhaar must contain 12 digits.';
    }

    return '';
  }

  function validatePAN(pan) {
    if (!pan) {
      return '';
    }

    var clean = pan.toUpperCase().replace(/\s+/g, '');

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(clean)) {
      return 'Enter a valid PAN number.';
    }

    return '';
  }

  function validateForm() {
    var name = normalizeName(getName());
    var mobile = normalizeMobile(getMobile());
    var email = normalizeEmail(getEmail());
    var address = normalizeAddress(getAddress());
    var aadhaar = getAadhaar();
    var pan = getPAN();

    var error = '';

    error = validateName(name);
    if (error) {
      return {
        valid: false,
        error: error
      };
    }

    error = validateMobile(mobile);
    if (error) {
      return {
        valid: false,
        error: error
      };
    }

    error = validateEmail(email);
    if (error) {
      return {
        valid: false,
        error: error
      };
    }

    error = validateAddress(address);
    if (error) {
      return {
        valid: false,
        error: error
      };
    }

    error = validateAadhaar(aadhaar);
    if (error) {
      return {
        valid: false,
        error: error
      };
    }

    error = validatePAN(pan);
    if (error) {
      return {
        valid: false,
        error: error
      };
    }

    return {
      valid: true,
      data: {
        name: name,
        mobile: mobile,
        email: email,
        address: address
      }
    };
  }

  /* ========================================================
     6. REGISTRATION PAYLOAD
     ======================================================== */

  function buildRegistrationPayload() {
    var name = normalizeName(getName());
    var mobile = normalizeMobile(getMobile());
    var email = normalizeEmail(getEmail());
    var address = normalizeAddress(getAddress());

    /*
     * IMPORTANT:
     *
     * These exact lowercase property names match
     * GV_registerCustomer() backend expectations.
     *
     * Do NOT send Name / Mobile / Email / Address here.
     * Backend registration service expects:
     *
     * name
     * mobile
     * email
     * address
     */

    var payload = {
      name: name,
      mobile: mobile,
      email: email,
      address: address
    };

    console.log(
      '[GoVara Customer] Registration payload:',
      JSON.stringify(payload)
    );

    return payload;
  }

  /* ========================================================
     7. API CALL
     ======================================================== */

  function callCustomerRegister(data) {
    if (
      window.GoVaraAPI &&
      typeof window.GoVaraAPI.customerRegister === 'function'
    ) {
      return window.GoVaraAPI.customerRegister(data);
    }

    if (
      window.GoVaraAPI &&
      typeof window.GoVaraAPI.request === 'function'
    ) {
      return window.GoVaraAPI.request({
        action: ACTION,
        module: MODULE_NAME,
        data: data
      });
    }

    if (
      window.GoVara27 &&
      typeof window.GoVara27.customerRegister === 'function'
    ) {
      return window.GoVara27.customerRegister(data);
    }

    throw new Error(
      'GoVara Consolidated API is not available.'
    );
  }

  /* ========================================================
     8. RESPONSE HANDLING
     ======================================================== */

  function handleRegistrationResponse(response) {
    state.lastResponse = response;

    showResponse(response);

    if (!response) {
      showMessage(
        'No response received from API.',
        'error'
      );

      return false;
    }

    /*
     * API-level failure
     */
    if (response.success !== true) {
      var apiError =
        response.error ||
        (
          response.validation &&
          response.validation.errors &&
          response.validation.errors.join(', ')
        ) ||
        response.status ||
        'Customer registration failed.';

      showMessage(apiError, 'error');

      return false;
    }

    /*
     * Business/service-level failure
     *
     * CUSTOMER_REGISTER can have:
     *
     * response.success === true
     * result.success === false
     *
     * Therefore both levels must be checked.
     */

    var result = response.result || {};

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
        response.status ||
        'Customer registration failed.';

      showMessage(
        businessError,
        'error'
      );

      return false;
    }

    /*
     * Successful registration
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

    var successMessage =
      'Customer registered successfully.';

    if (customerId) {
      successMessage +=
        ' Customer ID: ' + customerId;
    }

    if (userId) {
      successMessage +=
        ' User ID: ' + userId;
    }

    showMessage(
      successMessage,
      'success'
    );

    setText(
      [
        'customer-id',
        'customerId',
        'registered-customer-id'
      ],
      customerId || '-'
    );

    setText(
      [
        'customer-user-id',
        'customerUserId',
        'registered-user-id'
      ],
      userId || '-'
    );

    setText(
      [
        'customer-registration-status',
        'customerRegistrationStatus'
      ],
      status
    );

    return true;
  }

  /* ========================================================
     9. SUBMIT
     ======================================================== */

  async function submit() {
    if (state.submitting) {
      return;
    }

    var validation = validateForm();

    if (!validation.valid) {
      showMessage(
        validation.error,
        'error'
      );

      return;
    }

    /*
     * Build payload again immediately before API call.
     * This guarantees current form values are used.
     */
    var payload = buildRegistrationPayload();

    /*
     * Safety check:
     * Do not call backend if payload is empty.
     */
    if (
      !payload.name ||
      !payload.mobile ||
      !payload.email ||
      !payload.address
    ) {
      showMessage(
        'Customer registration data is incomplete.',
        'error'
      );

      console.error(
        '[GoVara Customer] Invalid registration payload:',
        payload
      );

      return;
    }

    state.submitting = true;

    showMessage(
      'Registering customer...',
      'info'
    );

    try {
      var response =
        await Promise.resolve(
          callCustomerRegister(payload)
        );

      handleRegistrationResponse(response);

    } catch (error) {
      console.error(
        '[GoVara Customer] Registration error:',
        error
      );

      showMessage(
        String(error.message || error),
        'error'
      );

    } finally {
      state.submitting = false;
    }
  }

  /* ========================================================
     10. PROFILE PHOTO
     ======================================================== */

  function handleProfilePhoto(event) {
    var file =
      event &&
      event.target &&
      event.target.files
        ? event.target.files[0]
        : null;

    if (!file) {
      state.profilePhotoData = '';
      return;
    }

    if (!file.type || file.type.indexOf('image/') !== 0) {
      showMessage(
        'Please select a valid image file.',
        'error'
      );

      event.target.value = '';
      return;
    }

    var reader = new FileReader();

    reader.onload = function (e) {
      state.profilePhotoData =
        e.target.result || '';

      var preview =
        byId('customer-photo-preview') ||
        byId('profile-photo-preview') ||
        byId('profilePreview') ||
        byId('customerProfilePreview');

      if (preview) {
        if (preview.tagName === 'IMG') {
          preview.src =
            state.profilePhotoData;
          preview.style.display = 'block';
        } else {
          preview.style.backgroundImage =
            'url("' +
            state.profilePhotoData +
            '")';
          preview.style.backgroundSize =
            'cover';
          preview.style.backgroundPosition =
            'center';
        }
      }
    };

    reader.readAsDataURL(file);
  }

  /* ========================================================
     11. INPUT FORMATTING
     ======================================================== */

  function formatAadhaarInput(event) {
    var input = event.target;

    if (!input) {
      return;
    }

    var value =
      String(input.value || '')
        .replace(/[^0-9]/g, '')
        .slice(0, 12);

    var formatted =
      value.match(/.{1,4}/g);

    input.value =
      formatted
        ? formatted.join(' ')
        : '';
  }

  function formatPANInput(event) {
    var input = event.target;

    if (!input) {
      return;
    }

    input.value =
      String(input.value || '')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 10);
  }

  function formatMobileInput(event) {
    var input = event.target;

    if (!input) {
      return;
    }

    input.value =
      String(input.value || '')
        .replace(/[^0-9+]/g, '')
        .slice(0, 13);
  }

  /* ========================================================
     12. DOCUMENT POLICY
     ======================================================== */

  function getDocumentPolicy() {
    return {
      aadhaar:
        state.documentPolicy.aadhaar,
      pan:
        state.documentPolicy.pan,
      other:
        state.documentPolicy.other
    };
  }

  function setDocumentPolicy(policy) {
    policy = policy || {};

    if (policy.aadhaar) {
      state.documentPolicy.aadhaar =
        String(policy.aadhaar).toUpperCase();
    }

    if (policy.pan) {
      state.documentPolicy.pan =
        String(policy.pan).toUpperCase();
    }

    if (policy.other) {
      state.documentPolicy.other =
        String(policy.other).toUpperCase();
    }

    renderDocumentPolicy();
  }

  function policyLabel(value) {
    value =
      String(value || 'OPTIONAL')
        .toUpperCase();

    if (value === 'MANDATORY') {
      return 'Mandatory';
    }

    if (value === 'DISABLED') {
      return 'Disabled';
    }

    return 'Optional';
  }

  function renderDocumentPolicy() {
    setText(
      [
        'aadhaar-policy',
        'customer-aadhaar-policy'
      ],
      policyLabel(
        state.documentPolicy.aadhaar
      )
    );

    setText(
      [
        'pan-policy',
        'customer-pan-policy'
      ],
      policyLabel(
        state.documentPolicy.pan
      )
    );

    setText(
      [
        'other-document-policy',
        'customer-other-document-policy'
      ],
      policyLabel(
        state.documentPolicy.other
      )
    );
  }

  /* ========================================================
     13. DOM EVENT BINDING
     ======================================================== */

  function bindSubmitButtons() {
    var ids = [
      'customer-register-btn',
      'customerRegisterBtn',
      'register-customer-btn',
      'registerCustomerBtn',
      'customer-submit',
      'customerSubmit',
      'btn-customer-register'
    ];

    for (var i = 0; i < ids.length; i++) {
      var button = byId(ids[i]);

      if (!button) {
        continue;
      }

      if (button.dataset.govaraCustomerBound === '1') {
        continue;
      }

      button.dataset.govaraCustomerBound = '1';

      button.addEventListener(
        'click',
        function (event) {
          event.preventDefault();
          submit();
        }
      );
    }
  }

  function bindInputFormatting() {
    var aadhaarIds = [
      'customer-aadhaar',
      'customerAadhaar',
      'aadhaar-number',
      'aadhaarNumber',
      'aadhaar'
    ];

    for (var i = 0; i < aadhaarIds.length; i++) {
      var aadhaar = byId(aadhaarIds[i]);

      if (
        aadhaar &&
        aadhaar.dataset.govaraAadhaarBound !== '1'
      ) {
        aadhaar.dataset.govaraAadhaarBound = '1';

        aadhaar.addEventListener(
          'input',
          formatAadhaarInput
        );
      }
    }

    var panIds = [
      'customer-pan',
      'customerPAN',
      'pan-number',
      'panNumber',
      'pan'
    ];

    for (var j = 0; j < panIds.length; j++) {
      var pan = byId(panIds[j]);

      if (
        pan &&
        pan.dataset.govaraPanBound !== '1'
      ) {
        pan.dataset.govaraPanBound = '1';

        pan.addEventListener(
          'input',
          formatPANInput
        );
      }
    }

    var mobileIds = [
      'customer-mobile',
      'customerMobile',
      'mobile-number',
      'mobileNumber',
      'mobile',
      'phone'
    ];

    for (var k = 0; k < mobileIds.length; k++) {
      var mobile = byId(mobileIds[k]);

      if (
        mobile &&
        mobile.dataset.govaraMobileBound !== '1'
      ) {
        mobile.dataset.govaraMobileBound = '1';

        mobile.addEventListener(
          'input',
          formatMobileInput
        );
      }
    }
  }

  function bindProfilePhoto() {
    var photo =
      getProfilePhotoElement();

    if (!photo) {
      return;
    }

    if (
      photo.dataset.govaraPhotoBound === '1'
    ) {
      return;
    }

    photo.dataset.govaraPhotoBound = '1';

    photo.addEventListener(
      'change',
      handleProfilePhoto
    );
  }

  function bindForm() {
    bindSubmitButtons();
    bindInputFormatting();
    bindProfilePhoto();
    renderDocumentPolicy();
  }

  /* ========================================================
     14. PUBLIC MODULE
     ======================================================== */

  var GoVaraCustomer = {

    module: MODULE_NAME,

    action: ACTION,

    state: state,

    init: function () {
      bindForm();

      console.log(
        '[GoVara Customer] Module initialized.'
      );

      return true;
    },

    submit: submit,

    register: submit,

    buildRegistrationPayload:
      buildRegistrationPayload,

    validate: validateForm,

    getDocumentPolicy:
      getDocumentPolicy,

    setDocumentPolicy:
      setDocumentPolicy,

    getLastResponse: function () {
      return state.lastResponse;
    }
  };

  /* ========================================================
     15. GLOBAL REGISTRATION
     ======================================================== */

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

  /* ========================================================
     16. AUTO INITIALIZATION
     ======================================================== */

  function initialize() {
    bindForm();
  }

  if (
    document.readyState === 'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      initialize
    );
  } else {
    initialize();
  }

})();
