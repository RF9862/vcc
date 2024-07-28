import dotenv from "dotenv";

dotenv.config({});

export const PORT = process.env.PORT ?? 8000;
export const SERVER_URL = process.env.SERVER_URL;
export const EXPOSED_URL = process.env.PORT ?? "http://localhost:8000";

export const MONGODB_HOST = process.env.MONGODB_HOST ?? "localhost";
export const MONGODB_PORT = process.env.MONGODB_PORT ?? 27017;
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE ?? "vcc_agency";

export const PASSPORT_SECRET_KEY =
  process.env.PASSPORT_SECRET_KEY ?? "vcc_agency_app";

export const COINPAYMENT_PUBLIC_KEY = process.env.COINPAYMENT_PUBLIC_KEY;
export const COINPAYMENT_PRIVATE_KEY = process.env.COINPAYMENT_PRIVATE_KEY;
export const COINPAYMENT_IPN_SECRET = process.env.COINPAYMENT_IPN_SECRET;
export const COINPAYMENT_MERCHANT_ID = process.env.COINPAYMENT_MERCHANT_ID;

export const VCC_AGENCY_APP_SECRET_KEY = process.env.VCC_AGENCY_APP_SECRET_KEY;
export const VCC_AGENCY_APP_USER = process.env.VCC_AGENCY_APP_USER;

export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const FRONTEND_EXPOSED_URL = process.env.FRONTEND_EXPOSED_URL;
