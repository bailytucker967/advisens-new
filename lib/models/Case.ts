import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICase extends Document {
  caseId: string;
  userId: Types.ObjectId;
  submittedAt: Date;
  
  // Context fields
  basedIn?: string;
  timeHorizon?: string;
  hadAdviceBefore?: string;
  perspectives: string[];
  
  // Situation fields
  situation: string;
  unclear: string;
  lookingFor?: string;
  areas: string[];
  
  // Status
  status: 'submitted' | 'responded' | 'profile_revealed' | 'closed';

  // When advisor reveals user profile (user gets notified)
  userRevealedTo: Array<{
    advisorId: Types.ObjectId;
    revealedAt: Date;
  }>;
  
  // Responses
  responses: Array<{
    advisorId: Types.ObjectId;
    advisorName?: string;
    advisorFirm?: string;
    /** Legacy: single text response. Used when responseSections is not set. */
    response?: string;
    /** Structured response sections for richer advisor responses */
    responseSections?: {
      approach?: string;
      clarifyBeforeAdvice?: string;
      howDecisionsMade?: string;
      feePhilosophy?: string;
      whoThisSuits?: string;
    };
    submittedAt: Date;
    profileRevealed: boolean;
    profileRevealedAt?: Date;
  }>;
  
  createdAt: Date;
  updatedAt: Date;
}

const CaseSchema = new Schema<ICase>(
  {
    caseId: {
      type: String,
      unique: true,
      index: true,
      // Not required in schema - generated in pre-save hook
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    basedIn: String,
    timeHorizon: String,
    hadAdviceBefore: String,
    perspectives: [String],
    situation: {
      type: String,
      required: true,
    },
    unclear: String,
    lookingFor: String,
    areas: [String],
    status: {
      type: String,
      enum: ['submitted', 'responded', 'profile_revealed', 'closed'],
      default: 'submitted',
    },
    userRevealedTo: [
      {
        advisorId: { type: Schema.Types.ObjectId, ref: 'Advisor', required: true },
        revealedAt: { type: Date, default: Date.now },
      },
    ],
    responses: [
      {
        advisorId: {
          type: Schema.Types.ObjectId,
          ref: 'Advisor',
          required: true,
        },
        advisorName: String,
        advisorFirm: String,
        response: String,
        responseSections: {
          approach: String,
          clarifyBeforeAdvice: String,
          howDecisionsMade: String,
          feePhilosophy: String,
          whoThisSuits: String,
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
        profileRevealed: {
          type: Boolean,
          default: false,
        },
        profileRevealedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Generate caseId before saving - always generate if not present
CaseSchema.pre('save', async function () {
  // Always ensure caseId is set (for new documents or if somehow missing)
  if (!this.caseId) {
    try {
      // Use this.constructor to get the model
      const CaseModel = this.constructor as Model<ICase>;
      
      // Generate case-XXX format
      let count = await CaseModel.countDocuments();
      let caseId = `case-${String(count + 1).padStart(3, '0')}`;
      
      // Ensure uniqueness
      let exists = await CaseModel.findOne({ caseId });
      let attempts = 0;
      while (exists && attempts < 100) {
        count++;
        caseId = `case-${String(count + 1).padStart(3, '0')}`;
        exists = await CaseModel.findOne({ caseId });
        attempts++;
      }
      
      this.caseId = caseId;
    } catch (error) {
      // Fallback if count fails - use timestamp-based ID
      const timestamp = Date.now().toString().slice(-6);
      this.caseId = `case-${timestamp}`;
    }
  }
});

const Case: Model<ICase> = mongoose.models.Case || mongoose.model<ICase>('Case', CaseSchema);

export default Case;

