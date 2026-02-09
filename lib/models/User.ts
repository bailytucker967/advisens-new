import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'user';
  /** Profile overview - editable by user, some auto-filled from case submissions */
  profile?: {
    basedIn?: string;
    timeHorizon?: string;
    hadAdviceBefore?: string;
    perspectives?: string[];
    situation?: string;
    unclear?: string;
    lookingFor?: string;
    areas?: string[];
    /** Editable: Region (e.g. GCC) */
    region?: string;
    /** Editable: Residency outlook (short_term, medium_term, long_term, unsure) */
    residencyOutlook?: string;
    /** Editable: What matters in an advisor relationship */
    advisorPreferences?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
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
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['user'],
      default: 'user',
    },
    profile: {
      basedIn: String,
      timeHorizon: String,
      hadAdviceBefore: String,
      perspectives: [String],
      situation: String,
      unclear: String,
      lookingFor: String,
      areas: [String],
      region: String,
      residencyOutlook: String,
      advisorPreferences: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

