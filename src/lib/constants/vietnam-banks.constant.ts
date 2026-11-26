export interface IVietnamBank {
  bin: string;
  code: string;
  shortName: string;
  name: string;
  requiresVa?: boolean;
  requiresVaForPersonal?: boolean;
  providerNote?: string;
  isWarning?: boolean;
}

export const DEFAULT_BANK_BIN = '970422'; // MBBank

export const VIETNAM_BANKS: IVietnamBank[] = [
  {
    bin: '970422',
    code: 'MB',
    shortName: 'MBBank',
    name: 'Ngân hàng TMCP Quân đội',
    providerNote:
      'ApiPay hỗ trợ liên kết tự động qua OTP cho cả Cá nhân, Hộ kinh doanh (dùng CCCD chủ hộ) và Doanh nghiệp.',
  },
  {
    bin: '970416',
    code: 'ACB',
    shortName: 'ACB',
    name: 'Ngân hàng TMCP Á Châu',
    providerNote:
      'ApiPay hỗ trợ liên kết tự động qua OTP (HKD/Doanh nghiệp cần thêm tên đăng nhập ACB Onebiz).',
  },
  {
    bin: '970436',
    code: 'VCB',
    shortName: 'Vietcombank',
    name: 'Ngân hàng TMCP Ngoại Thương Việt Nam',
    providerNote:
      'Cá nhân xác nhận qua app VCB; Hộ kinh doanh / Doanh nghiệp cần gửi yêu cầu kích hoạt trên ApiPay.',
  },
  {
    bin: '970415',
    code: 'ICB',
    shortName: 'VietinBank',
    name: 'Ngân hàng TMCP Công thương Việt Nam',
    isWarning: true,
    providerNote:
      'Lưu ý ApiPay: Giao dịch về VietinBank không kèm nội dung chuyển khoản nên không tự khớp được theo mã đơn hàng.',
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
    providerNote:
      'Cá nhân / Hộ kinh doanh liên kết tự động qua OTP; Doanh nghiệp cần yêu cầu kích hoạt.',
  },
  {
    bin: '970432',
    code: 'VPB',
    shortName: 'VPBank',
    name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng',
    providerNote:
      'Cá nhân / Hộ kinh doanh (dùng CCCD chủ hộ) liên kết tự động qua OTP; Doanh nghiệp cần yêu cầu kích hoạt.',
  },
  {
    bin: '970423',
    code: 'TPB',
    shortName: 'TPBank',
    name: 'Ngân hàng TMCP Tiên Phong',
    providerNote: 'Xác nhận liên kết trực tiếp trên ứng dụng TPBank.',
  },
  {
    bin: '970403',
    code: 'STB',
    shortName: 'Sacombank',
    name: 'Ngân hàng TMCP Sài Gòn Thương Tín',
    providerNote:
      'ApiPay hỗ trợ Cá nhân & Hộ kinh doanh tự động qua OTP (chưa hỗ trợ Doanh nghiệp).',
  },
  {
    bin: '970441',
    code: 'VIB',
    shortName: 'VIB',
    name: 'Ngân hàng TMCP Quốc tế Việt Nam',
    providerNote:
      'Cần bật tính năng "Nhận loa" trên ứng dụng VIB Business trước khi liên kết ApiPay.',
  },
  {
    bin: '970426',
    code: 'MSB',
    shortName: 'MSB',
    name: 'Ngân hàng TMCP Hàng Hải Việt Nam',
    isWarning: true,
    providerNote:
      'Cần gửi yêu cầu kích hoạt trên ApiPay; tài khoản Doanh nghiệp phải bật MSB Merchant tại quầy trước.',
  },
  {
    bin: '970448',
    code: 'OCB',
    shortName: 'OCB',
    name: 'Ngân hàng TMCP Phương Đông',
    providerNote: 'Cá nhân & Hộ kinh doanh tự động qua OTP; Doanh nghiệp cần yêu cầu kích hoạt.',
  },
  {
    bin: '970452',
    code: 'KLB',
    shortName: 'KienLongBank',
    name: 'Ngân hàng TMCP Kiên Long',
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
    providerNote: 'Tài khoản cần đăng ký thanh toán thương mại điện tử với ngân hàng trước.',
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
