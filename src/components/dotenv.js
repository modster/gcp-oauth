import "dotenv/config";

const PRIVACY_EMAIL = process.env.PRIVACY_EMAIL || "privacy@example.com";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@example.com";
const BUSINESS_ADDRESS = process.env.BUSINESS_ADDRESS || "Your address";
const BUSINESS_CITY = process.env.BUSINESS_CITY || "Your city";
const BUSINESS_COUNTRY = process.env.BUSINESS_COUNTRY || "Your country";
const BUSINESS_NAME = process.env.BUSINESS_NAME || "Your business name";

export {
    PRIVACY_EMAIL,
    SUPPORT_EMAIL,
    BUSINESS_ADDRESS,
    BUSINESS_CITY,
    BUSINESS_COUNTRY,
    BUSINESS_NAME
};