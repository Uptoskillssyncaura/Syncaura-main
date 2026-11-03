import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const rolesEnum = ['user', 'admin', 'co-admin'];

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, minlength: 2, maxlength: 80 },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  
  role: {
  type: String,
  enum:rolesEnum,
  default: "user"
},
googleTokens: {
  access_token: String,
  refresh_token: String,
  scope: String,
  token_type: String,
  expiry_date: Number,
},


  isActive: { type: Boolean, default: true },
  // Password reset
  resetTokenHash: { type: String, default: null },
  resetTokenExpiresAt: { type: Date, default: null },
  // Optional refresh token tracking
  refreshTokenId: { type: String, default: null },
  // OTP for password change
  otpCode: { type: String, default: null },
  otpExpiresAt: { type: Date, default: null }
}, { timestamps: true });

// Indexes
// userSchema.index({ email: 1 }, { unique: true });

// Methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.statics.hashPassword = async function (plain) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plain, salt);
};

const User = mongoose.model('User', userSchema);
export default User;
export { rolesEnum };