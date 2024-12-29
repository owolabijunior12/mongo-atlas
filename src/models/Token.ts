import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the Token document interface
interface IToken extends Document {
  refreshToken: string;
  ip: string;
  userAgent: string;
  isValid: boolean;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const TokenSchema = new Schema<IToken>(
  {
    refreshToken: { type: String, required: true },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    isValid: { type: Boolean, default: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

  },
  { timestamps: true }
);

// Create the model
const Token: Model<IToken> = mongoose.model<IToken>('Token', TokenSchema);

export default Token;
