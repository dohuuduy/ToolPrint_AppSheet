import { google } from 'googleapis';

/**
 * Service để tương tác với Google Drive và Sheets
 */
export const GoogleService = {
  /**
   * Tạo client OAuth2 từ token
   */
  getOAuth2Client(accessToken: string) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    return oauth2Client;
  },

  /**
   * Tải file từ Google Drive
   */
  async downloadFile(accessToken: string, fileId: string) {
    const auth = this.getOAuth2Client(accessToken);
    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.get({
      fileId,
      alt: 'media'
    }, { responseType: 'arraybuffer' });

    return Buffer.from(response.data as ArrayBuffer);
  },

  /**
   * Đọc dữ liệu từ một range trong Google Sheet
   */
  async getSheetData(accessToken: string, sheetId: string, range: string) {
    const auth = this.getOAuth2Client(accessToken);
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });
    
    return response.data.values;
  },

  /**
   * Thêm một dòng mới vào Google Sheet
   */
  async appendRow(accessToken: string, sheetId: string, sheetName: string, values: any[]) {
    const auth = this.getOAuth2Client(accessToken);
    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values]
      }
    });
  },

  /**
   * Cập nhật bản ghi trong Google Sheet (giả định cột A là ma_id)
   */
  async updateRow(accessToken: string, sheetId: string, sheetName: string, rowId: string, values: any[]) {
    const auth = this.getOAuth2Client(accessToken);
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Tìm dòng có ID tương ứng
    const currentData = await this.getSheetData(accessToken, sheetId, `${sheetName}!A:A`);
    const rowIndex = currentData?.findIndex(row => row[0] === rowId);
    
    if (rowIndex === undefined || rowIndex === -1) throw new Error('Không tìm thấy bản ghi để cập nhật');
    
    const actualRowIndex = rowIndex + 1; // Sheets là 1-indexed

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!A${actualRowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values]
      }
    });
  },

  /**
   * Ghi log vào Google Sheet
   */
  async logToSheet(accessToken: string, sheetId: string, values: any[]) {
    await this.appendRow(accessToken, sheetId, 'nhat_ky_in', values);
  }
};
