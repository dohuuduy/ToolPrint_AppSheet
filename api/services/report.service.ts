import * as XLSX from 'xlsx';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export class ReportService {
  static formatValue(val: any): any {
    if (val === null || val === undefined) return '';
    
    if (Array.isArray(val)) {
      return val.map(item => this.formatValue(item));
    }

    if (typeof val === 'object' && !(val instanceof Date)) {
      const formattedObj: any = {};
      Object.keys(val).forEach(key => {
        formattedObj[key] = this.formatValue(val[key]);
      });
      return formattedObj;
    }
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}/; 
    const mdDateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}/;

    if (typeof val === 'string' && (dateRegex.test(val) || mdDateRegex.test(val))) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      }
    }

    if (typeof val === 'number' || (!isNaN(Number(val)) && typeof val === 'string' && val.trim() !== '' && !val.includes('/'))) {
      const num = Number(val);
      return new Intl.NumberFormat('vi-VN', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 2 
      }).format(num);
    }

    return String(val);
  }

  static async mergeWord(templateBuffer: Buffer, data: any): Promise<Buffer> {
    const zip = new PizZip(templateBuffer);
    const formattedData = this.formatValue(data);
    const doc = new Docxtemplater(zip, { 
      paragraphLoop: true, 
      linebreaks: true 
    });
    doc.render(formattedData);
    return doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
  }

  static async mergeExcel(templateBuffer: Buffer, data: any): Promise<Buffer> {
    const workbook = XLSX.read(templateBuffer, { type: 'buffer' });
    
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) return;

      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      const newRows: any[][] = [];
      const childKeys = Object.keys(data).filter(k => Array.isArray(data[k]));
      
      rows.forEach((row) => {
        let isRepeatingRow = false;
        let repeatingKey = '';

        row.forEach((cell) => {
          if (typeof cell === 'string') {
            childKeys.forEach(key => {
              if (cell.includes(`{${key}.`)) {
                isRepeatingRow = true;
                repeatingKey = key;
              }
            });
          }
        });

        if (isRepeatingRow && repeatingKey) {
          const childData = data[repeatingKey] || [];
          if (childData.length === 0) {
            const newRow = row.map(cell => {
              if (typeof cell !== 'string') return cell;
              let newVal = cell;
              childKeys.forEach(ck => {
                const regex = new RegExp(`\\{${ck}\\.[^\\}]+\\}`, 'g');
                newVal = newVal.replace(regex, '');
              });
              return newVal;
            });
            newRows.push(newRow);
          } else {
            childData.forEach((item: any) => {
              const newRow = row.map(cell => {
                if (typeof cell !== 'string') return cell;
                let newVal = cell;
                Object.keys(item).forEach(fKey => {
                  const token = `{${repeatingKey}.${fKey}}`;
                  if (newVal.includes(token)) {
                    newVal = newVal.replace(new RegExp(token, 'g'), this.formatValue(item[fKey]));
                  }
                });
                Object.keys(data).forEach(pKey => {
                  if (!Array.isArray(data[pKey])) {
                    const token = `{${pKey}}`;
                    if (newVal.includes(token)) {
                      newVal = newVal.replace(new RegExp(token, 'g'), this.formatValue(data[pKey]));
                    }
                  }
                });
                return newVal;
              });
              newRows.push(newRow);
            });
          }
        } else {
          const newRow = row.map(cell => {
            if (typeof cell !== 'string') return cell;
            let newVal = cell;
            Object.keys(data).forEach(pKey => {
              if (!Array.isArray(data[pKey])) {
                const token = `{${pKey}}`;
                if (newVal.includes(token)) {
                  newVal = newVal.replace(new RegExp(token, 'g'), this.formatValue(data[pKey]));
                }
              }
            });
            return newVal;
          });
          newRows.push(newRow);
        }
      });

      const newSheet = XLSX.utils.aoa_to_sheet(newRows);
      if (sheet['!merges']) newSheet['!merges'] = sheet['!merges'];
      workbook.Sheets[sheetName] = newSheet;
    });

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}
