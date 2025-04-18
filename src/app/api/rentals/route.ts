import { NextResponse } from "next/server";
import { getSheets, SPREADSHEET_ID, SHEETS } from "@/lib/google-sheets";
import { Rental } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");

    const sheets = await getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.RENTALS}!A2:H`,
    });

    const rows = response.data.values || [];
    const rentals: Rental[] = rows
      .map((row) => ({
        rental_id: row[0],
        device_id: row[1],
        borrower_name: row[2],
        borrower_email: row[3],
        rental_start_date: row[4],
        return_date: row[5],
        purpose: row[6],
        notes: row[7],
      }))
      .filter((rental) => !deviceId || rental.device_id === deviceId);

    return NextResponse.json(rentals);
  } catch (error) {
    console.error("Error fetching rentals:", error);
    return NextResponse.json(
      { error: "Failed to fetch rentals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const rental: Rental = await request.json();
    const sheets = await getSheets();

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.RENTALS}!A:H`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            rental.rental_id,
            rental.device_id,
            rental.borrower_name,
            rental.borrower_email,
            rental.rental_start_date,
            rental.return_date || "",
            rental.notes || "",
          ],
        ],
      },
    });

    // Update device status
    const devicesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.DEVICES}!A:E`,
    });

    const deviceRows = devicesResponse.data.values || [];
    const deviceRowIndex = deviceRows.findIndex(
      (row) => row[0] === rental.device_id
    );

    if (deviceRowIndex === -1) {
      throw new Error("Device not found");
    }

    // deviceRowIndex + 2 because:
    // 1. deviceRowIndex is 0-based
    // 2. We need to account for the header row
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.DEVICES}!E${deviceRowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [["RENTED"]],
      },
    });

    return NextResponse.json(rental);
  } catch (error) {
    console.error("Error creating rental:", error);
    return NextResponse.json(
      { error: "Failed to create rental" },
      { status: 500 }
    );
  }
}
