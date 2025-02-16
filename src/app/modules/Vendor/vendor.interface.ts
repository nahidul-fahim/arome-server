export interface IVendor {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  userId?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
