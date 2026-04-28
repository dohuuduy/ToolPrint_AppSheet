import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export class ReportService {
  static async mergeWord(templateBuffer: ArrayBuffer, data: any): Promise<Buffer> {
    const zip = new PizZip(templateBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render(data);

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    return buf;
  }
}
