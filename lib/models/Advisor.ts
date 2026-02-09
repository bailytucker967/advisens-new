import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdvisor extends Document {
  email: string;
  password: string;
  role: 'advisor';
  name?: string;
  firm?: string;
  bio?: string;
  /** Full profile for trust & due diligence when revealed to users */
  mobile?: string;
  linkedInUrl?: string;
  location?: { country: string; city: string };
  firmWebsite?: string;
  firmOverview?: string;
  roleTitle?: string;
  primaryClientBase?: string;
  yearsOfExperience?: string;
  areasOfAdvice?: string[];
  typicalClientProfile?: string;
  qualifications?: string;
  jurisdictions?: string[];
  regulatorName?: string;
  licenseNumber?: string;
  hasDisciplinaryActions?: boolean;
  disciplinaryDetails?: string;
  advisoryApproach?: string;
  feePhilosophy?: string;
  tendsToSuit?: string[];
  mayNotSuit?: string[];
  professionalBackground?: string;
  planningFocusAreas?: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdvisorSchema = new Schema<IAdvisor>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['advisor'],
      default: 'advisor',
    },
    name: { type: String, trim: true },
    firm: { type: String, trim: true },
    bio: { type: String, trim: true },
    mobile: { type: String, trim: true },
    linkedInUrl: { type: String, trim: true },
    location: { country: String, city: String },
    firmWebsite: { type: String, trim: true },
    firmOverview: { type: String, trim: true },
    roleTitle: { type: String, trim: true },
    primaryClientBase: { type: String, trim: true },
    yearsOfExperience: { type: String, trim: true },
    areasOfAdvice: [String],
    typicalClientProfile: { type: String, trim: true },
    qualifications: { type: String, trim: true },
    jurisdictions: [String],
    regulatorName: { type: String, trim: true },
    licenseNumber: { type: String, trim: true },
    hasDisciplinaryActions: Boolean,
    disciplinaryDetails: { type: String, trim: true },
    advisoryApproach: { type: String, trim: true },
    feePhilosophy: { type: String, trim: true },
    tendsToSuit: [String],
    mayNotSuit: [String],
    professionalBackground: { type: String, trim: true },
    planningFocusAreas: [String],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
AdvisorSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
AdvisorSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const Advisor: Model<IAdvisor> = mongoose.models.Advisor || mongoose.model<IAdvisor>('Advisor', AdvisorSchema);

export default Advisor;

