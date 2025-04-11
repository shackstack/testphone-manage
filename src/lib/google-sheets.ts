import { google } from "googleapis";
import { JWT } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export async function getAuthClient() {
  const auth = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: SCOPES,
  });

  return auth;
}

export async function getSheets() {
  const auth = await getAuthClient();
  return google.sheets({ version: "v4", auth });
}

export const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

export const SHEETS = {
  DEVICES: "Devices",
  RENTALS: "Rentals",
  MAINTENANCE: "Maintenance",
} as const;
