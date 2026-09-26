import { UserHasApplicationScopeHasUserRoleResponseDTO } from '../userHasApplicationScopeHasUserRole/UserHasApplicationScopeHasUserRoleResponseDTO';

export interface UserDetailsResponseDTO {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  realm: string;
  application: string;
  role: string;
  componentList: string[];
}
