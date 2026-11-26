export interface IVietnamBank {
  bin: string;
  code: string;
  shortName: string;
  name: string;
  requiresVa?: boolean;
  requiresVaForPersonal?: boolean;
  requiresSevqrPrefix?: boolean;
  sepayNote?: string;
}

export const DEFAULT_BANK_BIN = '970422'; // MBBank

export const VIETNAM_BANKS: IVietnamBank[] = [
  {
    bin: '970422',
    code: 'MB',
    shortName: 'MBBank',
    name: 'Ngân hàng TMCP Quân đội',
    sepayNote:
      'Hỗ trợ nhận tiền trực tiếp ở tài khoản chính và VA (Cá nhân, Hộ kinh doanh, Doanh nghiệp).',
  },
  {
    bin: '970416',
    code: 'ACB',
    shortName: 'ACB',
    name: 'Ngân hàng TMCP Á Châu',
    sepayNote: 'Hỗ trợ nhận tiền trực tiếp ở tài khoản chính và VA.',
  },
  {
    bin: '970436',
    code: 'VCB',
    shortName: 'Vietcombank',
    name: 'Ngân hàng TMCP Ngoại Thương Việt Nam',
    sepayNote: 'Doanh nghiệp / Hộ kinh doanh trên SePay nhận qua VA chính thức.',
  },
  {
    bin: '970415',
    code: 'ICB',
    shortName: 'VietinBank',
    name: 'Ngân hàng TMCP Công thương Việt Nam',
    requiresSevqrPrefix: true,
    sepayNote: 'Tài khoản cá nhân / hộ kinh doanh cần có chuỗi SEVQR trong nội dung chuyển khoản.',
  },
  {
    bin: '970407',
    code: 'TCB',
    shortName: 'Techcombank',
    name: 'Ngân hàng TMCP Kỹ thương Việt Nam',
  },
  {
    bin: '970418',
    code: 'BIDV',
    shortName: 'BIDV',
    name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
    requiresVaForPersonal: true,
    sepayNote: 'Tài khoản cá nhân / hộ kinh doanh kết nối API chỉ nhận giao dịch qua VA.',
  },
  {
    bin: '970432',
    code: 'VPB',
    shortName: 'VPBank',
    name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng',
    sepayNote: 'Hỗ trợ tài khoản chính (tùy cấu hình liên kết) hoặc VA.',
  },
  {
    bin: '970423',
    code: 'TPB',
    shortName: 'TPBank',
    name: 'Ngân hàng TMCP Tiên Phong',
    sepayNote: 'Nhận tiền ở tài khoản chính; hỗ trợ TKP nếu dùng nhiều nhánh.',
  },
  {
    bin: '970403',
    code: 'STB',
    shortName: 'Sacombank',
    name: 'Ngân hàng TMCP Sài Gòn Thương Tín',
    sepayNote: 'Hỗ trợ nhận tiền trực tiếp ở tài khoản chính và VA.',
  },
  {
    bin: '970441',
    code: 'VIB',
    shortName: 'VIB',
    name: 'Ngân hàng TMCP Quốc tế Việt Nam',
  },
  {
    bin: '970426',
    code: 'MSB',
    shortName: 'MSB',
    name: 'Ngân hàng TMCP Hàng Hải Việt Nam',
    requiresVa: true,
    sepayNote: 'Kết nối API trên SePay yêu cầu nhận tiền qua VA chính thức.',
  },
  {
    bin: '970448',
    code: 'OCB',
    shortName: 'OCB',
    name: 'Ngân hàng TMCP Phương Đông',
    requiresVa: true,
    sepayNote: 'Kết nối API trên SePay yêu cầu nhận tiền qua VA chính thức.',
  },
  {
    bin: '970452',
    code: 'KLB',
    shortName: 'KienLongBank',
    name: 'Ngân hàng TMCP Kiên Long',
    requiresVa: true,
    sepayNote: 'Kết nối API trên SePay yêu cầu nhận tiền qua VA chính thức.',
  },
  {
    bin: '970437',
    code: 'HDB',
    shortName: 'HDBank',
    name: 'Ngân hàng TMCP Phát triển TP. Hồ Chí Minh',
  },
  {
    bin: '970449',
    code: 'LPB',
    shortName: 'LPBank',
    name: 'Ngân hàng TMCP Lộc Phát Việt Nam',
  },
  {
    bin: '970440',
    code: 'SEAB',
    shortName: 'SeABank',
    name: 'Ngân hàng TMCP Đông Nam Á',
  },
  {
    bin: '970424',
    code: 'SHBVN',
    shortName: 'ShinhanBank',
    name: 'Ngân hàng TNHH MTV Shinhan Việt Nam',
  },
  {
    bin: '970405',
    code: 'VBA',
    shortName: 'Agribank',
    name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam',
  },
  {
    bin: '970454',
    code: 'VCCB',
    shortName: 'BVBank',
    name: 'Ngân hàng TMCP Bản Việt',
  },
  {
    bin: '970431',
    code: 'EIB',
    shortName: 'Eximbank',
    name: 'Ngân hàng TMCP Xuất Nhập khẩu Việt Nam',
  },
  {
    bin: '970409',
    code: 'BAB',
    shortName: 'BacABank',
    name: 'Ngân hàng TMCP Bắc Á',
  },
  {
    bin: '970425',
    code: 'ABB',
    shortName: 'ABBANK',
    name: 'Ngân hàng TMCP An Bình',
  },
  {
    bin: '970439',
    code: 'PBVN',
    shortName: 'PublicBank',
    name: 'Ngân hàng TNHH MTV Public Việt Nam',
  },
];

export function findVietnamBankByBin(bin?: string): IVietnamBank | undefined {
  if (!bin) return undefined;
  return VIETNAM_BANKS.find((bank) => bank.bin === bin.trim());
}
