import axios from 'axios';

export class AppSheetService {
  private appId: string;
  private accessKey: string;
  private baseUrl: string = 'https://api.appsheet.com/api/v2/apps';

  constructor(appId: string, accessKey: string) {
    this.appId = appId;
    this.accessKey = accessKey;
  }

  async getTableRow(tableName: string, rowId: string) {
    const url = `${this.baseUrl}/${this.appId}/tables/${tableName}/Action`;
    const response = await axios.post(url, {
      Action: 'Find',
      Properties: {
         Locale: 'vi-VN',
         Timezone: 'SE Asia Standard Time'
      },
      Rows: [
        { ma_id: rowId } // Giả định cột khóa chính là ma_id theo quy tắc người dùng
      ]
    }, {
      headers: {
        ApplicationAccessKey: this.accessKey
      }
    });

    return response.data[0];
  }
}
