import axios from 'axios';

const APPSHEET_APP_ID = process.env.APPSHEET_APP_ID;
const APPSHEET_API_KEY = process.env.APPSHEET_API_KEY;

/**
 * Service để gọi API AppSheet
 */
export const AppSheetService = {
  /**
   * Lấy dữ liệu bản ghi từ AppSheet dựa trên ID
   */
  async getRowData(tableName: string, rowId: string) {
    if (!APPSHEET_APP_ID || !APPSHEET_API_KEY) {
      throw new Error('Thiếu cấu hình APPSHEET_APP_ID hoặc APPSHEET_API_KEY');
    }

    const url = `https://api.appsheet.com/api/v1/apps/${APPSHEET_APP_ID}/tables/${tableName}/Action`;

    try {
      const response = await axios.post(url, {
        Action: "Find",
        Properties: {
          Locale: "vi-VN",
          Timezone: "SE Asia Standard Time"
        },
        Rows: [
          {
            ma_id: rowId // Tên cột ID chính trong bảng AppSheet
          }
        ]
      }, {
        headers: {
          'ApplicationToken': APPSHEET_API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error) {
      console.error('Lỗi khi gọi AppSheet API:', error);
      throw error;
    }
  }
};
