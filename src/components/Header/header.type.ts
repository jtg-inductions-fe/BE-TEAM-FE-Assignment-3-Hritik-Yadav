export interface HeaderProps {
  logout: () => void;
  isAuthenticate: boolean;
  isAllowedPage: boolean;
  userName: string | null;
}
