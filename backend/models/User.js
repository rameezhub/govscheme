const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  INDIAN_STATES, CATEGORIES, OCCUPATIONS,
  EDUCATION_LEVELS, SUPPORTED_LANGUAGES, ROLES
} = require('../config/constants');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [1, 'Age must be at least 1'],
      max: [120, 'Age cannot exceed 120']
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['male', 'female', 'other']
    },
    annualIncome: {
      type: Number,
      required: [true, 'Annual income is required'],
      min: [0, 'Annual income cannot be negative']
    },
    occupation: {
      type: String,
      required: [true, 'Occupation is required'],
      enum: OCCUPATIONS
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      enum: INDIAN_STATES
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: CATEGORIES
    },
    educationLevel: {
      type: String,
      required: [true, 'Education level is required'],
      enum: EDUCATION_LEVELS
    },
    preferredLanguage: {
      type: String,
      enum: SUPPORTED_LANGUAGES,
      default: 'en'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    savedSchemes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scheme'
      }
    ],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpire: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ─── Indexes ───────────────────────────────────────────────────────────────────
// ❌ Removed duplicate email index
UserSchema.index({ state: 1, category: 1 });

// ─── Pre-save: Hash password ───────────────────────────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;
  next();
});

// ─── Instance Methods ──────────────────────────────────────────────────────────
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateJWT = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

UserSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtTimestamp < changedTime;
  }
  return false;
};

module.exports = mongoose.model('User', UserSchema);