import Admin, { IAdmin } from '../models/admin.model';


export const createAdmin = async (adminData: Partial<IAdmin>): Promise<IAdmin> => {
  const newAdmin = new Admin(adminData);
  return await newAdmin.save();
};
