import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  organizationId: Types.ObjectId;
  email: string;
  phone?: string;
  passwordHash: string;
  fullName: string;
  avatarUrl?: string;
  role: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'BRANCH_MANAGER' | 'FRONT_DESK' | 'STYLIST' | 'ACCOUNTANT' | 'INVENTORY_MANAGER';
  branches: Types.ObjectId[];
  primaryBranchId?: Types.ObjectId;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    avatarUrl: { type: String },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ORG_ADMIN', 'BRANCH_MANAGER', 'FRONT_DESK', 'STYLIST', 'ACCOUNTANT', 'INVENTORY_MANAGER'],
      default: 'FRONT_DESK',
      index: true,
    },
    branches: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    primaryBranchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    lastLoginAt: { type: Date },
    isActive: { type: Boolean, default: true, index: true },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete (ret as any).passwordHash;
        return ret;
      },
    },
  }
);

UserSchema.index({ organizationId: 1, email: 1 }, { unique: true });

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', UserSchema);

export interface ISession extends Document {
  userId: Types.ObjectId;
  refreshTokenHash: string;
  userAgent?: string;
  ipAddress?: string;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    refreshTokenHash: { type: String, required: true },
    userAgent: { type: String },
    ipAddress: { type: String },
    isRevoked: { type: Boolean, default: false, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Session = mongoose.model<ISession>('Session', SessionSchema);

export interface ICustomRole extends Document {
  organizationId: Types.ObjectId;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CustomRoleSchema = new Schema<ICustomRole>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    permissions: [{ type: String }],
  },
  { timestamps: true }
);

CustomRoleSchema.index({ organizationId: 1, name: 1 }, { unique: true });

export const CustomRole = mongoose.model<ICustomRole>('CustomRole', CustomRoleSchema);
