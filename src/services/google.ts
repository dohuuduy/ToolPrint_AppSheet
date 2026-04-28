import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export class GoogleService {
  private sheets = google.sheets('v4');
  private drive = google.drive('v3');

  constructor(private auth: OAuth2Client) {}

  // Google Sheets CRUD (Database)
  async getRows(spreadsheetId: string, range: string) {
    const response = await this.sheets.spreadsheets.values.get({
      auth: this.auth,
      spreadsheetId,
      range,
    });
    return response.data.values;
  }

  async appendRow(spreadsheetId: string, range: string, values: any[]) {
    await this.sheets.spreadsheets.values.append({
      auth: this.auth,
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [values],
      },
    });
  }

  // Google Drive
  async downloadFile(fileId: string) {
    const response = await this.drive.files.get({
      auth: this.auth,
      fileId: fileId,
      alt: 'media',
    }, { responseType: 'arraybuffer' });
    return response.data as ArrayBuffer;
  }

  async uploadFile(name: string, content: Buffer, mimeType: string, folderId?: string) {
    const response = await this.drive.files.create({
      auth: this.auth,
      requestBody: {
        name,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType,
        body: content,
      },
    });
    return response.data;
  }
}
