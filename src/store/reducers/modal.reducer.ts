import { CLOSE_RESTAURANT_FORM_MODAL, OPEN_RESTAURANT_FORM_MODAL } from "./modal.const";
import type { ModalAction, ModalState } from "./modal.type";

const initialState: ModalState = {
  isRestaurantFormModalOpen: false,
};

export const modalReducer = (state: ModalState = initialState, action: ModalAction): ModalState => {
  switch (action.type) {
    case OPEN_RESTAURANT_FORM_MODAL:
      return {
        ...state,
        isRestaurantFormModalOpen: true,
      };
    case CLOSE_RESTAURANT_FORM_MODAL:
      return {
        ...state,
        isRestaurantFormModalOpen: false,
      };
    default:
      return state;
  }
};
