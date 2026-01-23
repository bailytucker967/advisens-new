import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdvisor extends Document {
  email: string;
  password: string;
  role: 'advisor';
  name?: string;
  firm?: string;
  bio?: string;
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
    name: {
      type: String,
      trim: true,
    },
    firm: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
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

