import type { RootState } from "@/store/reducers/root.reducer";

export const selectUser = (state: RootState) => state.user.user;
export const selectUserRole = (state: RootState) => state.user.user?.role;
