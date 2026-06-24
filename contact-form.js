(function () {
  'use strict';

  function getConfig() {
    return (window.AQBAR_CONTACT_CONFIG && window.AQBAR_CONTACT_CONFIG.webAppUrl) || '';
  }

  function getFormData(form) {
    return {
      inquiryType: form.dataset.inquiryType || 'poc',
      name: (form.querySelector('[name="name"]') || {}).value || '',
      email: (form.querySelector('[name="email"]') || {}).value || '',
      company: (form.querySelector('[name="company"]') || {}).value || '',
      source: document.body.classList.contains('m-page') ? 'mobile' : 'desktop'
    };
  }

  function setButtonLoading(button, isLoading) {
    if (!button) return;
    if (isLoading) {
      button.dataset.originalText = button.textContent;
      button.textContent = '전송 중...';
      button.disabled = true;
      button.style.opacity = '0.7';
      return;
    }
    button.textContent = button.dataset.originalText || button.textContent;
    button.style.opacity = '';
  }

  function markSubmitted(activeBtn, siblingBtn) {
    activeBtn.textContent = '전송되었습니다 ✓';
    activeBtn.disabled = true;
    activeBtn.style.background = '#1fae6b';
    activeBtn.style.color = '#fff';
    activeBtn.style.opacity = '1';
    if (activeBtn.classList.contains('m-btn--ghost')) {
      activeBtn.style.borderColor = '#1fae6b';
    }
    if (siblingBtn) siblingBtn.disabled = true;
  }

  function markSubmitError(button) {
    button.textContent = '전송 실패 · 다시 시도';
    button.disabled = false;
    button.style.background = '';
    button.style.color = '';
    button.style.borderColor = '';
    button.style.opacity = '1';
  }

  function submitToSheet(form, activeBtn, siblingBtn) {
    var webAppUrl = getConfig();
    if (!webAppUrl) {
      console.warn('[AQbar] contact-config.js에 webAppUrl을 설정해 주세요.');
      markSubmitted(activeBtn, siblingBtn);
      return;
    }

    setButtonLoading(activeBtn, true);

    fetch(webAppUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getFormData(form))
    })
      .then(function () {
        markSubmitted(activeBtn, siblingBtn);
      })
      .catch(function (error) {
        console.error('[AQbar] 문의 전송 실패:', error);
        markSubmitError(activeBtn);
      });
  }

  function bindForm(form) {
    if (!form || form.dataset.contactBound === 'true') return;

    var submitBtn = form.querySelector('[type="submit"]');
    var pricingBtn = form.querySelector('[data-pricing-inquiry], [data-scroll-pricing]');

    function isFormValid() {
      if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
        if (typeof form.reportValidity === 'function') form.reportValidity();
        return false;
      }
      return true;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!isFormValid()) return;
      form.dataset.inquiryType = 'poc';
      submitToSheet(form, submitBtn, pricingBtn);
    });

    if (pricingBtn) {
      pricingBtn.addEventListener('click', function () {
        if (!isFormValid()) return;
        form.dataset.inquiryType = 'pricing';
        submitToSheet(form, pricingBtn, submitBtn);
      });
    }

    form.dataset.contactBound = 'true';
  }

  function init() {
    document.querySelectorAll('.aq-contact-form, .m-form').forEach(bindForm);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
