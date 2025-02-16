const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!")
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }

  return { error: null };
};

const validateEditProfileData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "photoUrl", "about", "age", "gender", "skills"];

  const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

  return isEditAllowed;
};

// const validateEditProfileData = (req) => {
//   const allowedEditFields = ["firstName", "lastName", "photoUrl", "about", "age", "gender", "skills"];

//   if (!Object.keys(req.body).every((field) => allowedEditFields.includes(field))) {
//     return { isValid: false, error: "Invalid fields in request." };
//   }

//   const { firstName, lastName, photoUrl, about, age, gender, skills } = req.body;

//   const nameRegex = /^[A-Za-z\s]{3,}$/;
//   if (firstName && !nameRegex.test(firstName)) return { isValid: false, error: "Invalid first name." };
//   if (lastName && !nameRegex.test(lastName)) return { isValid: false, error: "Invalid last name." };

//   const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/;
//   if (photoUrl && !urlRegex.test(photoUrl)) return { isValid: false, error: "Invalid photo URL." };

//   // Validate about section (Optional, max 500 characters)
//   if (about && about.length > 500) return { isValid: false, error: "About section too long (max 500 chars)." };

//   // Validate age (Must be a number between 10 and 100)
//   if (age && (!Number.isInteger(age) || age < 18 || age > 50)) return { isValid: false, error: "Invalid age." };

//   // Validate gender (Must be 'male', 'female', 'other')
//   const validGenders = ["male", "female", "other"];
//   if (gender && !validGenders.includes(gender)) return { isValid: false, error: "Invalid gender." };

//   // Validate skills (Optional, must be an array of strings)
//   if (skills && (!Array.isArray(skills) || !skills.every(skill => typeof skill === "string"))) {
//     return { isValid: false, error: "Invalid skills format. Must be an array of strings." };
//   }

//   return { isValid: true };
// };


const validateProfilePassword = (req) => {
  const { password, confirmPassword } = req.body;

  // Ensure only 'password' and 'confirmPassword' are present
  const allowedEditFields = ["password", "confirmPassword"];
  const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

  if (!isEditAllowed) return false;

  // Ensure both fields exist
  if (!password || !confirmPassword) return false;

  // Ensure passwords match
  if (password !== confirmPassword) return false;

  // Validate password strength (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) return false;

  return true;
};


module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateProfilePassword
}