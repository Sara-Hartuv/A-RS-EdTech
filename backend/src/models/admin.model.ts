import mongoose from 'mongoose';
import User, { IUser } from '../models/user.model'; 

export interface IAdmin extends IUser {

}

const AdminSchema = new mongoose.Schema<IAdmin>(
  {

  },
  { _id: false } 
);

const Admin = User.discriminator<IAdmin>('Admin', AdminSchema, 'admin');

export default Admin;
