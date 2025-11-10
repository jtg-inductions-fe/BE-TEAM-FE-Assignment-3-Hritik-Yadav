export interface HeaderProps {
  logout: () => void;
  isAuthenticate: boolean;
  isAllowedPage: boolean;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  userName: string | null;
}
