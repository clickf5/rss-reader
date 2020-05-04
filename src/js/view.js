import { watch } from 'melanke-watchjs';

const setWatchers = (state, ui) => {
  watch(state.form, 'processState', () => {
    const { processState } = state.form;
    const { submitButton } = ui;
    switch (processState) {
      case 'failed':
        submitButton.disabled = false;
        break;
      case 'filling':
        submitButton.disabled = false;
        break;
      case 'sending':
        submitButton.disabled = true;
        break;
      default:
        throw new Error(`Unknown state: ${processState}`);
    }
  });

  watch(state.form, 'valid', () => {
    const { submitButton } = ui;
    submitButton.disabled = !state.form.valid;
  });
};

export default setWatchers;
