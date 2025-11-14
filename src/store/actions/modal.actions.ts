import { CLOSE_RESTAURANT_FORM_MODAL, OPEN_RESTAURANT_FORM_MODAL } from "./modal.actions.const";

export const openRestaurantFormModal = () => ({
  type: OPEN_RESTAURANT_FORM_MODAL,
});

export const closeRestaurantFormModal = () => ({
  type: CLOSE_RESTAURANT_FORM_MODAL,
});
