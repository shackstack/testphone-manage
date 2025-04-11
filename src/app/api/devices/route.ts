import { NextResponse } from "next/server";
import { getSheets, SPREADSHEET_ID, SHEETS } from "@/lib/google-sheets";
import { Device } from "@/types";

export async function GET() {
  try {
    const sheets = await getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.DEVICES}!A2:H`,
    });

    const rows = response.data.values || [];
    const devices: Device[] = rows.map((row) => ({
      device_id: row[0],
      model_name: row[1],
      serial_number: row[2],
      os_version: row[3],
      status: row[4],
      purchase_date: row[5],
      last_maintenance_date: row[6],
      notes: row[7],
    }));

    return NextResponse.json(devices);
  } catch (error) {
    console.error("Error fetching devices:", error);
    return NextResponse.json(
      { error: "Failed to fetch devices" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const device: Device = await request.json();
    const sheets = await getSheets();

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.DEVICES}!A:H`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            device.device_id,
            device.model_name,
            device.serial_number,
            device.os_version,
            device.status,
            device.purchase_date,
            device.last_maintenance_date,
            device.notes,
          ],
        ],
      },
    });

    return NextResponse.json(device);
  } catch (error) {
    console.error("Error creating device:", error);
    return NextResponse.json(
      { error: "Failed to create device" },
      { status: 500 }
    );
  }
}
