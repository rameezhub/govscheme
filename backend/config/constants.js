const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const CATEGORIES = ['General', 'OBC', 'SC', 'ST'];

const OCCUPATIONS = [
  'farmer', 'student', 'salaried', 'self-employed',
  'business', 'unemployed', 'retired', 'homemaker', 'other'
];

const EDUCATION_LEVELS = [
  'illiterate', 'primary', 'secondary', 'higher_secondary',
  'graduate', 'post_graduate', 'doctorate'
];

const SCHEME_CATEGORIES = [
  'banking', 'farmer', 'education', 'senior_citizen',
  'employment', 'women_child', 'healthcare', 'housing', 'other'
];

const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr', 'ta', 'kn', 'pa'];

const ROLES = { USER: 'user', ADMIN: 'admin' };

module.exports = {
  INDIAN_STATES,
  CATEGORIES,
  OCCUPATIONS,
  EDUCATION_LEVELS,
  SCHEME_CATEGORIES,
  SUPPORTED_LANGUAGES,
  ROLES
};
