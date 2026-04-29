import axios from 'axios';

export class AppSheetService {
  constructor(public appId: string, public accessKey: string) {}

  async getTableRow(tableName: string, rowId: string, keyCol: string = 'ma_id') {
    const url = `https://api.appsheet.com/api/v2/apps/${this.appId}/tables/${tableName}/Action`;
    const res = await axios.post(url, { 
      Action: 'Find', 
      Properties: { Locale: 'vi-VN' }, 
      Rows: [{ [keyCol]: rowId }] 
    }, { 
      headers: { ApplicationAccessKey: this.accessKey } 
    });
    return res.data[0];
  }

  async getTable(tableName: string) {
    const url = `https://api.appsheet.com/api/v2/apps/${this.appId}/tables/${tableName}/Action`;
    const res = await axios.post(url, { 
      Action: 'Find', 
      Properties: { Locale: 'vi-VN' }, 
      Rows: [] 
    }, { 
      headers: { ApplicationAccessKey: this.accessKey } 
    });
    return Array.isArray(res.data) ? res.data : [];
  }

  async getColumns(tableName: string) {
    console.log(`[APPSHEET] Fetching columns for table: ${tableName}`);
    const url = `https://api.appsheet.com/api/v2/apps/${this.appId}/tables/${tableName}/Action`;
    const res = await axios.post(url, { 
      Action: 'Find', 
      Properties: { Locale: 'vi-VN', Top: 1 }, 
      Rows: [] 
    }, { 
      headers: { ApplicationAccessKey: this.accessKey } 
    });
    
    if (res.data && res.data.length > 0) {
      return Object.keys(res.data[0]);
    }
    return [];
  }
}
