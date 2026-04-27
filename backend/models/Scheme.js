const mongoose = require('mongoose');
const { INDIAN_STATES, CATEGORIES, OCCUPATIONS, SCHEME_CATEGORIES } = require('../config/constants');

// ─── Reusable multi-language string schema ─────────────────────────────────────
const multiLangField = (required = false) => ({
  en: { type: String, required: [required, 'English text is required'], trim: true },
  hi: { type: String, trim: true, default: '' },
  mr: { type: String, trim: true, default: '' },
  ta: { type: String, trim: true, default: '' },
  kn: { type: String, trim: true, default: '' },
  pa: { type: String, trim: true, default: '' }
});

const SchemeSchema = new mongoose.Schema(
  {
    schemeCode: { type: String, unique: true, sparse: true, uppercase: true, trim: true },

    name:        { type: multiLangField(true), required: true },
    description: { type: multiLangField(true), required: true },
    benefits:    { type: multiLangField(true), required: true },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: SCHEME_CATEGORIES
    },

    eligibility: {
      minAge:    { type: Number, default: 0,   min: 0 },
      maxAge:    { type: Number, default: 120, max: 150 },
      maxIncome: { type: Number, default: null },
      minIncome: { type: Number, default: 0 },
      allowedStates: {
        type: [String],
        enum: [...INDIAN_STATES, 'All'],
        default: ['All']
      },
      categories: {
        type: [String],
        enum: [...CATEGORIES, 'All'],
        default: ['All']
      },
      allowedGenders: {
        type: [String],
        enum: ['male', 'female', 'other', 'All'],
        default: ['All']
      },
      occupations: {
        type: [String],
        enum: [...OCCUPATIONS, 'All'],
        default: ['All']
      },
      minEducation: {
        type: String,
        enum: ['none','illiterate','primary','secondary','higher_secondary','graduate','post_graduate','doctorate'],
        default: 'none'
      }
    },

    requiredDocuments: { type: [String], default: [] },
    officialLink:      { type: String, trim: true, match: [/^https?:\/\/.+/, 'Please enter a valid URL'] },
    applicationLink:   { type: String, trim: true },
    ministry:          { type: String, trim: true },
    launchYear:        { type: Number, min: 1947 },
    isActive:          { type: Boolean, default: true, index: true },
    createdBy:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────
SchemeSchema.index({ category: 1, isActive: 1 });
SchemeSchema.index({ 'eligibility.allowedStates': 1, isActive: 1 });   // state filter
SchemeSchema.index({ 'eligibility.allowedGenders': 1, isActive: 1 });  // gender filter
SchemeSchema.index({ 'eligibility.categories': 1, isActive: 1 });
SchemeSchema.index({ 'eligibility.maxIncome': 1, isActive: 1 });        // income filter
SchemeSchema.index({ 'name.en': 'text', 'description.en': 'text', 'benefits.en': 'text' });

// ─── Virtual: localized output ─────────────────────────────────────────────────
SchemeSchema.methods.getLocalized = function (lang = 'en') {
  const safeGet = (field) => field[lang] || field['en'] || '';
  return {
    id:                this._id,
    schemeCode:        this.schemeCode,
    name:              safeGet(this.name),
    description:       safeGet(this.description),
    benefits:          safeGet(this.benefits),
    category:          this.category,
    eligibility:       this.eligibility,
    requiredDocuments: this.requiredDocuments,
    officialLink:      this.officialLink,
    applicationLink:   this.applicationLink,
    ministry:          this.ministry,
    launchYear:        this.launchYear,
    isActive:          this.isActive,
    createdAt:         this.createdAt,
    updatedAt:         this.updatedAt
  };
};

module.exports = mongoose.model('Scheme', SchemeSchema);
