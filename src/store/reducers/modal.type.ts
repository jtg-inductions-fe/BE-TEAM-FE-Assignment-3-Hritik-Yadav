import type { CLOSE_RESTAURANT_FORM_MODAL, OPEN_RESTAURANT_FORM_MODAL } from "./modal.const";

export interface ModalState {
  isRestaurantFormModalOpen: boolean;
}

export type ModalAction =
  | { type: typeof OPEN_RESTAURANT_FORM_MODAL }
  | { type: typeof CLOSE_RESTAURANT_FORM_MODAL };
