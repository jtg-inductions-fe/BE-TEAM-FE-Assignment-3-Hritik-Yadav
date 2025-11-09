import type { NavigateFunction } from "react-router-dom";

export const createBackNavigationHandler = (navigate: NavigateFunction) => () => navigate(-1);
