import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAppointmentServiceItem {
  serviceId: Types.ObjectId;
  serviceName: string;
  durationMinutes: number;
  price: number;
  staffId?: Types.ObjectId;
  staffName?: string;
}

export interface IAppointment extends Document {
  organizationId: Types.ObjectId;
  branchId: Types.ObjectId;
  customerId: Types.ObjectId;
  customerName: string;
  customerPhone: string;
  staffId?: Types.ObjectId;
  staffName?: string;
  serviceId: Types.ObjectId;
  serviceName: string;
  additionalServices: IAppointmentServiceItem[];
  appointmentDate: Date;
  startTime: string; // "10:30"
  endTime: string; // "11:30"
  durationMinutes: number;
  status: 'SCHEDULED' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  source: 'WALK_IN' | 'PHONE' | 'ONLINE_PORTAL' | 'WHATSAPP' | 'APP';
  totalPrice: number;
  notes?: string;
  cancelledReason?: string;
  invoiceId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'StaffProfile', index: true },
    staffName: { type: String },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    serviceName: { type: String, required: true },
    additionalServices: [
      {
        serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
        serviceName: { type: String, required: true },
        durationMinutes: { type: Number, default: 30 },
        price: { type: Number, required: true },
        staffId: { type: Schema.Types.ObjectId, ref: 'StaffProfile' },
        staffName: { type: String },
      },
    ],
    appointmentDate: { type: Date, required: true, index: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    durationMinutes: { type: Number, default: 60 },
    status: {
      type: String,
      enum: ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_SERVICE', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      default: 'SCHEDULED',
      index: true,
    },
    source: { type: String, enum: ['WALK_IN', 'PHONE', 'ONLINE_PORTAL', 'WHATSAPP', 'APP'], default: 'WALK_IN' },
    totalPrice: { type: Number, required: true },
    notes: { type: String },
    cancelledReason: { type: String },
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
  },
  { timestamps: true }
);

AppointmentSchema.index({ branchId: 1, appointmentDate: 1, status: 1 });

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
