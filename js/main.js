'use strict';

function validateAndSubmit(form, successMessage, onSuccess) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const controls = Array.from(form.elements).filter((control) => control.willValidate);
    controls.forEach((control) => control.removeAttribute('aria-invalid'));

    if (!form.checkValidity()) {
      controls.forEach((control) => {
        if (!control.checkValidity()) control.setAttribute('aria-invalid', 'true');
      });
      form.reportValidity();
      return;
    }

    form.reset();
    successMessage.hidden = false;
    if (onSuccess) onSuccess();
  });
}

const dialog = document.getElementById('order-dialog');
const dialogForm = document.getElementById('order-form');
const dialogSuccess = document.getElementById('success-message');

if (dialog && dialogForm && dialogSuccess) {
  const selectedProduct = document.getElementById('selected-product');
  document.querySelectorAll('.product-card__button').forEach((button) => {
    button.addEventListener('click', () => {
      selectedProduct.value = button.dataset.product || '';
      dialog.showModal();
    });
  });

  document.getElementById('close-order-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  validateAndSubmit(dialogForm, dialogSuccess, () => dialog.close());
}

const pageForm = document.getElementById('page-order-form');
const pageSuccess = document.getElementById('page-success-message');

if (pageForm && pageSuccess) {
  const productSelect = document.getElementById('page-product');
  const productFromUrl = new URLSearchParams(window.location.search).get('product');
  if (productFromUrl && Array.from(productSelect.options).some((option) => option.value === productFromUrl)) {
    productSelect.value = productFromUrl;
  }
  validateAndSubmit(pageForm, pageSuccess);
}
