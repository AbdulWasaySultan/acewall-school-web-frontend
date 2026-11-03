import CryptoJS from "crypto-js";

// List of fields targeting encryption (synchronized with secureFields.js)
const ENCRYPT_LIST = new Set([
  "firstName",
  "middleName",
  "lastName",
  "email",
  "phone",
  "homeAddress",
  "mailingAddress",
  "guardianEmails",
  // Topics & Subtopics
  "title",
  // Grading Scales
  "grade",
  "min",
  "max",
  "letter",
  "gpa",
  "minPercentage",
  "maxPercentage",
  "points",
  "remarks",
  // Grading Periods
  "startDate",
  "endDate",
  // Student Portal / Teacher Portal Performance & Grading
  "totalScore",
  "latePenaltyApplied",
  "studentPoints",
  "maxPoints",
  "gradePercentage",
  "finalPercentage",
  "finalGPA",
  "deductionValue",
  "selectedAnswer",
  "feedback",
  "marksObtained",
  "pointsAwarded",
  // Course Basics & Curriculum
  "courseTitle",
  "courseDescription",
  "description",
  "language",
  "teachingPoints",
  "requirements",
  "courseCode",
  "thumbnail",
  "syllabus",
  "url",
  "publicId",
  "filename",
  "fileName",
  // Assessments
  "question",
  "options",
  "correctAnswer",
  "concept",
  // Discussions & Forums
  "topic",
  "text",
  "lastMessage",
  // Announcements
  "message",
  // Pacing Chart additional fields
  "week",
  "objectives",
  "resources",
  // Log activity fields
  "pageName",
  "action",
  "details",
]);

const NUMERIC_KEYS = new Set([
  "min",
  "max",
  "gpa",
  "minPercentage",
  "maxPercentage",
  "points",
  "totalScore",
  "latePenaltyApplied",
  "studentPoints",
  "maxPoints",
  "gradePercentage",
  "finalPercentage",
  "finalGPA",
  "deductionValue",
  "marksObtained",
]);

const getEncryptionKey = () => {
  return import.meta.env.VITE_ENCRYPTION_KEY || "dev-encryption-key-must-be-changed";
};

const isEncrypted = (val) => {
  if (typeof val !== "string" || !val) return false;
  const parts = val.split(":");
  return parts.length === 2 && /^[0-9a-fA-F]{32}$/.test(parts[0]);
};

// Encrypt string with randomized IV
export const encryptValue = (plaintext) => {
  if (typeof plaintext !== "string" || !plaintext) return plaintext;
  if (isEncrypted(plaintext)) return plaintext; // Prevent double encryption
  try {
    const key = getEncryptionKey();
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return iv.toString(CryptoJS.enc.Hex) + ":" + encrypted.toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    return plaintext;
  }
};

// Decrypt value containing colon-separated IV
export const decryptValue = (ciphertext) => {
  if (!isEncrypted(ciphertext)) {
    return ciphertext;
  }
  try {
    const key = getEncryptionKey();
    const parts = ciphertext.split(":");
    const iv = CryptoJS.enc.Hex.parse(parts[0]);
    const encryptedData = parts[1];

    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return ciphertext;
  }
};

// Recursively traverse payload to encrypt targets
export const dynamicEncrypt = (data) => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map((item) => dynamicEncrypt(item));
  }
  if (typeof data === "object") {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      if (ENCRYPT_LIST.has(key)) {
        if (typeof value === "string") {
          result[key] = encryptValue(value);
        } else if (typeof value === "number") {
          result[key] = encryptValue(String(value));
        } else if (Array.isArray(value)) {
          result[key] = value.map((item) => {
            if (typeof item === "string") return encryptValue(item);
            if (typeof item === "number") return encryptValue(String(item));
            return dynamicEncrypt(item);
          });
        } else {
          result[key] = dynamicEncrypt(value);
        }
      } else {
        result[key] = dynamicEncrypt(value);
      }
    }
    return result;
  }
  return data;
};

// Recursively traverse payload to decrypt targets
export const dynamicDecrypt = (data) => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map((item) => dynamicDecrypt(item));
  }
  if (typeof data === "object") {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      if (ENCRYPT_LIST.has(key)) {
        if (typeof value === "string") {
          const decrypted = decryptValue(value);
          result[key] = NUMERIC_KEYS.has(key) ? parseFloat(decrypted) : decrypted;
        } else if (Array.isArray(value)) {
          result[key] = value.map((item) => {
            if (typeof item === "string") {
              const decrypted = decryptValue(item);
              return NUMERIC_KEYS.has(key) ? parseFloat(decrypted) : decrypted;
            }
            return dynamicDecrypt(item);
          });
        } else {
          result[key] = dynamicDecrypt(value);
        }
      } else {
        result[key] = dynamicDecrypt(value);
      }
    }
    return result;
  }
  return data;
};
