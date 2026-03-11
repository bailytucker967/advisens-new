import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdvisorApplication extends Document {
  // Advisor details
  firstName: string;
  lastName: string;
  professionalEmail: string;
  password: string;
  mobile: string;
  linkedInUrl?: string;
  location: {
    country: string;
    city: string;
  };
  primaryClientBase: string;

  // Firm details
  firmName: string;
  firmWebsite?: string;
  roleTitle: string;
  employmentType: string;
  firmType: string;
  firmLocation: string;
  firmOverview?: string;

  // Regulation & standing
  isRegulated: boolean;
  regulatorName?: string;
  licenseNumber?: string;
  jurisdictions?: string[];
  hasDisciplinaryActions: boolean;
  disciplinaryDetails?: string;

  // Experience & focus
  yearsOfExperience: string;
  areasOfAdvice: string[];
  typicalClientProfile?: string;

  // Qualifications
  qualifications: string;
  supportingDocuments?: string[]; // URLs or file paths

  // Platform rules acknowledgement
  acknowledgesNoCommissions: boolean;
  acknowledgesNoContact: boolean;
  acknowledgesHonestResponse: boolean;
  acknowledgesConfidentiality: boolean;
  acknowledgesSelective: boolean;

  // Short answers
  whyJoinAdvisens: string;
  ethicalAdviceMeaning: string;

  // Status
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const AdvisorApplicationSchema = new Schema<IAdvisorApplication>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    professionalEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    mobile: { type: String, required: true, trim: true },
    linkedInUrl: { type: String, trim: true },
    location: {
      country: { type: String, required: true },
      city: { type: String, required: true },
    },
    primaryClientBase: { type: String, required: true },

    firmName: { type: String, required: true, trim: true },
    firmWebsite: { type: String, trim: true },
    roleTitle: { type: String, required: true, trim: true },
    employmentType: { type: String, required: true },
    firmType: { type: String, required: true },
    firmLocation: { type: String, required: true },
    firmOverview: { type: String, trim: true },

    isRegulated: { type: Boolean, required: true },
    regulatorName: { type: String, trim: true },
    licenseNumber: { type: String, trim: true },
    jurisdictions: [String],
    hasDisciplinaryActions: { type: Boolean, required: true },
    disciplinaryDetails: { type: String, trim: true },

    yearsOfExperience: { type: String, required: true },
    areasOfAdvice: [String],
    typicalClientProfile: { type: String, trim: true },

    qualifications: { type: String, required: true, trim: true },
    supportingDocuments: [String],

    acknowledgesNoCommissions: { type: Boolean, required: true },
    acknowledgesNoContact: { type: Boolean, required: true },
    acknowledgesHonestResponse: { type: Boolean, required: true },
    acknowledgesConfidentiality: { type: Boolean, required: true },
    acknowledgesSelective: { type: Boolean, required: true },

    whyJoinAdvisens: { type: String, required: true, trim: true },
    ethicalAdviceMeaning: { type: String, required: true, trim: true },

    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedAt: Date,
    reviewedBy: String,
    reviewNotes: String,
  },
  {
    timestamps: true,
  }
);

const AdvisorApplication: Model<IAdvisorApplication> =
  mongoose.models.AdvisorApplication ||
  mongoose.model<IAdvisorApplication>('AdvisorApplication', AdvisorApplicationSchema);

export default AdvisorApplication;

