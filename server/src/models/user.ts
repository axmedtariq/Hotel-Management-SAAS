import mongoose, { Schema, Document } from 'mongoose';

// Interface for TypeScript type safety
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'receptionist' | 'guest';
  lastLogin?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // This will be hashed (encrypted)
  role: { 
    type: String, 
    enum: ['admin', 'receptionist', 'guest'], 
    default: 'guest' 
  },
  lastLogin: { type: Date }
}, { 
  timestamps: true 
});

// Export the model
const User = mongoose.model<IUser>('User', userSchema);
export default User;