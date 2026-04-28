import axios from 'axios';

interface AppSheetParams {
  appId: string;
  tableName: string;
  apiKey: string;
  rowId: string;
}

export const AppSheetService = {
  /**
   * Lấy dữ liệu một dòng từ AppSheet
   */
  async getRowData({ appId, tableName, apiKey, rowId }: AppSheetParams) {
    const url = `https://api.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/Action`;
    
    try {
      const response = await axios.post(
        url,
        {
          Action: "Find",
          Properties: {
            Locale: "vi-VN",
            Timezone: "SE Asia Standard Time",
          },
          Rows: [
            {
              ma_id: rowId // AppSheet API yêu cầu ID để tìm
            }
          ]
        },
        {
          headers: {
            'ApplicationToken': apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      // AppSheet trả về mảng các dòng
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      }
      
      // Một số trường hợp trả về object lồng nhau tùy version API
      if (data.Rows && Array.isArray(data.Rows) && data.Rows.length > 0) {
        return data.Rows[0];
      }

      return null;
    } catch (error: any) {
      console.error('AppSheet API Error:', error.response?.data || error.message);
      throw new Error('Không thể kết nối với AppSheet API');
    }
  }
};
