import {
  OPEN_MENU_ITEM_FORM_MODAL,
  CLOSE_MENU_ITEM_FORM_MODAL,
} from "../actions/modal.actions.const";
import type { MenuItemModalState } from "./menuItemModal.type";
import type { MenuItemModalAction } from "../actions/modal.action.type";

const initialState: MenuItemModalState = {
  isMenuItemFormModalOpen: false,
};

export const menuItemModalReducer = (
  state: MenuItemModalState = initialState,
  action: MenuItemModalAction,
): MenuItemModalState => {
  switch (action.type) {
    case OPEN_MENU_ITEM_FORM_MODAL:
      return {
        ...state,
        isMenuItemFormModalOpen: true,
      };
    case CLOSE_MENU_ITEM_FORM_MODAL:
      return {
        ...state,
        isMenuItemFormModalOpen: false,
      };
    default:
      return state;
  }
};
