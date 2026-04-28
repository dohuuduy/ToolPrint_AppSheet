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
   * Ghi log vào Google Sheet
   */
  async logToSheet(accessToken: string, sheetId: string, values: any[]) {
    const auth = this.getOAuth2Client(accessToken);
    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'nhat_ky_in!A:Z',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values]
      }
    });
  }
};
