interface IUserResponseDTO {
  id: string;
  name: string;
  email: string;
  driver_license: string;
  is_admin: boolean;
  avatar: string;
  avatar_url(): string;
}

export { IUserResponseDTO };
