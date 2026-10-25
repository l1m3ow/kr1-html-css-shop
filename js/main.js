'use strict';

/* Общая проверка демо-формы. Сетевой отправки в учебном проекте нет. */
function validateAndSubmit(form, successMessage, onSuccess) {
  const getControls = () => Array.from(form.elements)
    .filter((control) => control.willValidate);

  const clearState = () => {
    getControls().forEach((control) => {
      control.removeAttribute('aria-invalid');
    });
    successMessage.hidden = true;
  };

  form.addEventListener('reset', clearState);

  // Убираем старый успех и исправленную ошибку при новом вводе.
  const handleChange = (event) => {
    successMessage.hidden = true;
    const control = event.target;
    if (control.willValidate && control.checkValidity()) {
      control.removeAttribute('aria-invalid');
    }
  };
  form.addEventListener('input', handleChange);
  form.addEventListener('change', handleChange);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearState();

    if (!form.checkValidity()) {
      getControls().forEach((control) => {
        if (!control.checkValidity()) {
          control.setAttribute('aria-invalid', 'true');
        }
      });
      form.reportValidity();
      return;
    }

    // reset вызывает clearState, поэтому сообщение показываем после сброса.
    form.reset();
    successMessage.hidden = false;
    if (typeof onSuccess === 'function') onSuccess();
  });
}

const dialog = document.getElementById('order-dialog');
const dialogForm = document.getElementById('order-form');
const dialogSuccess = document.getElementById('success-message');
const selectedProduct = document.getElementById('selected-product');
const closeDialogButton = document.getElementById('close-order-dialog');

if (dialog && dialogForm && dialogSuccess && selectedProduct && closeDialogButton) {
  document.querySelectorAll('.product-card__button').forEach((button) => {
    button.addEventListener('click', () => {
      dialogForm.reset();
      selectedProduct.value = button.dataset.product || '';
      dialog.showModal();
    });
  });

  closeDialogButton.addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;

    // Клик по внутреннему padding окна не должен закрывать форму.
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right
      || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) dialog.close();
  });

  validateAndSubmit(dialogForm, dialogSuccess, () => dialog.close());
}

const pageForm = document.getElementById('page-order-form');
const pageSuccess = document.getElementById('page-success-message');
const productSelect = document.getElementById('page-product');

if (pageForm && pageSuccess && productSelect) {
  const productFromUrl = new URLSearchParams(window.location.search).get('product');
  const option = Array.from(productSelect.options)
    .find((item) => item.value === productFromUrl);

  if (option) {
    // После «Очистить» сохраняется товар из ссылки, остальные поля сбрасываются.
    option.defaultSelected = true;
    productSelect.value = option.value;
  }

  validateAndSubmit(pageForm, pageSuccess);
}
