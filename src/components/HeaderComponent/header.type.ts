export interface HeaderProps {
  logout: () => void;
  isAuthenticate: boolean;
  isAllowedPage: boolean;
  onCreateRestaurant: () => void;
  userName: string | null;
}
