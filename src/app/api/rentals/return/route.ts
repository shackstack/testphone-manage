import { NextResponse } from "next/server";
import { getSheets, SPREADSHEET_ID, SHEETS } from "@/lib/google-sheets";

export async function POST(request: Request) {
  try {
    const { deviceId, email } = await request.json();

    // 대여 이력 조회
    const sheets = await getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.RENTALS}!A2:H`,
    });

    const rows = response.data.values || [];
    const rentalIndex = rows.findIndex(
      (row) => row[1] === deviceId && row[3] === email
    );

    if (rentalIndex === -1) {
      return NextResponse.json(
        { error: "대여 이력이 없거나 반납 권한이 없습니다." },
        { status: 400 }
      );
    }

    // 대여 이력 업데이트 (반납일 추가)
    const return_date = new Date().toISOString();
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.RENTALS}!F${rentalIndex + 2}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[return_date]],
      },
    });

    // 기기 상태 업데이트
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.DEVICES}!E${rentalIndex + 2}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [["AVAILABLE"]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error returning device:", error);
    return NextResponse.json(
      { error: "Failed to return device" },
      { status: 500 }
    );
  }
}
