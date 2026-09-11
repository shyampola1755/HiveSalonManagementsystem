import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IState extends Document {
  organizationId: Types.ObjectId;
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE';
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StateSchema = new Schema<IState>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

StateSchema.index({ organizationId: 1, code: 1 }, { unique: true });

export const State = mongoose.model<IState>('State', StateSchema);

export interface IDistrict extends Document {
  organizationId: Types.ObjectId;
  stateId: Types.ObjectId;
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE';
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DistrictSchema = new Schema<IDistrict>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    stateId: { type: Schema.Types.ObjectId, ref: 'State', required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

DistrictSchema.index({ organizationId: 1, code: 1 }, { unique: true });

export const District = mongoose.model<IDistrict>('District', DistrictSchema);

export interface ICity extends Document {
  organizationId: Types.ObjectId;
  stateId: Types.ObjectId;
  districtId: Types.ObjectId;
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE';
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CitySchema = new Schema<ICity>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    stateId: { type: Schema.Types.ObjectId, ref: 'State', required: true },
    districtId: { type: Schema.Types.ObjectId, ref: 'District', required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

CitySchema.index({ organizationId: 1, code: 1 }, { unique: true });

export const City = mongoose.model<ICity>('City', CitySchema);
