# AI agent với SePay

## Dùng SePay trong AI agent của bạn. Tra cứu giao dịch qua MCP trong ChatGPT, Claude, cài SePay Skills cho agent lập trình, dùng SePay CLI để thử webhook và tự động tra cứu.

AI agent như Claude Code, Codex, Cursor hay ChatGPT làm việc với SePay qua SePay MCP, SePay Skills và SePay CLI. Các công cụ này phục vụ lúc phát triển và tra cứu; ứng dụng của bạn vẫn gọi [SePay API](https://developer.sepay.vn/vi/sepay-api/v2/gioi-thieu) và nhận [SePay Webhooks](https://developer.sepay.vn/vi/sepay-webhooks) như bình thường.

## Chọn SePay MCP, Skills hay CLI

Chọn theo việc bạn muốn agent làm: tra dữ liệu, viết code hay thử tích hợp. Bạn không phải chọn một trong ba: dùng riêng từng công cụ, kết hợp hai, hoặc cả ba tùy nhu cầu, ví dụ Skills để agent viết code và CLI để thử webhook ngay trên máy.

- [SePay MCP](https://developer.sepay.vn/vi/agents/mcp): Để agent tra dữ liệu thật trong tài khoản (giao dịch, webhook gửi lỗi, đơn đã thanh toán chưa) và tài liệu SePay.
  Mặc định chỉ đọc · Cần tài khoản SePay, trừ tra tài liệu
  Claude, ChatGPT, Claude Code, Codex, Cursor và agent hỗ trợ MCP khác
- [SePay Skills](https://developer.sepay.vn/vi/agents/skills): Để ChatGPT, Claude hướng dẫn tích hợp SePay đúng tài liệu, và agent lập trình viết code theo đúng luồng.
  Không cần tài khoản SePay · Không tự đọc dữ liệu tài khoản
  Claude, ChatGPT, Claude Code, Codex, Cursor và ứng dụng hỗ trợ skill khác
- [SePay CLI](https://developer.sepay.vn/vi/agents/cli): Để nhận webhook ngay trên máy, giả lập giao dịch trên sandbox, rồi tra cứu, quản lý dữ liệu sandbox và production bằng dòng lệnh, script hoặc agent.
  Cần tài khoản SePay · Sửa dữ liệu production phải xác nhận
  Dùng trong terminal, script hoặc agent chạy được lệnh

## Tra dữ liệu tài khoản với SePay MCP

Chẳng hạn bạn muốn xem dòng tiền từng tháng, hay biết đơn DH00012 đã được thanh toán chưa, mà không phải mở [my.sepay.vn](https://my.sepay.vn) để tìm.

Bạn có thể dùng SePay MCP để hỏi Claude hoặc ChatGPT bằng câu thường và nhận câu trả lời lấy từ chính tài khoản SePay của bạn. Đang viết code trong Claude Code hay Codex, agent cũng tra được dữ liệu như "Tuần này có webhook nào gửi thất bại không?". Khi bạn hỏi cách tích hợp, agent tra thẳng tài liệu SePay, phần này không cần bật nhóm dữ liệu nào. Agent tự chọn dữ liệu cần đọc, trong phạm vi quyền bạn đã cấp.

Cùng một kết nối dùng được trong ứng dụng chat và agent lập trình:

**Claude**

**Người dùng:** Báo cáo dòng tiền theo từng tháng của tôi trên SePay

_Đã gọi get_cashflow_report_

**AI:** Từ tháng 07 trở đi chưa có phát sinh. Tháng cao điểm là **tháng 05** (vào 15.983.000); thấp nhất là **tháng 06** (vào 13.177.000).

- Tổng tiền vào: 89.652.000
- Tổng tiền ra: 7.120.000
- Ròng: 82.532.000

|          | T1       | T2       | T3       | T4      | T5        | T6        |
| -------- | -------- | -------- | -------- | ------- | --------- | --------- |
| Tiền vào | 15.44 tr | 13.94 tr | 15.31 tr | 15.8 tr | 15.983 tr | 13.177 tr |
| Tiền ra  | 1.24 tr  | 1.06 tr  | 1.14 tr  | 1.35 tr | 1.35 tr   | 0.98 tr   |

**ChatGPT**

**Người dùng:** cho tôi 5 giao dịch mới nhất

_Đã tìm các công cụ khả dụng_

_Đã gọi công cụ_

**AI:** Đây là **5 giao dịch mới nhất** (sắp xếp từ mới đến cũ):

| Thời gian           | Số tiền     | Loại     | Ngân hàng  | Trạng thái           | Nội dung               |
| ------------------- | ----------- | -------- | ---------- | -------------------- | ---------------------- |
| 03/12/2025 01:51:46 | 174.000 VND | Tiền vào | VietinBank | Chưa khớp thanh toán | SEVQR test giao dich 6 |
| 02/12/2025 15:53:25 | 43.000 VND  | Tiền vào | VietinBank | Chưa khớp thanh toán | SEVQR test giao dich 5 |
| 02/12/2025 05:55:03 | 403.000 VND | Tiền vào | VietinBank | Chưa khớp thanh toán | SEVQR test giao dich 4 |
| 01/12/2025 19:56:42 | 272.000 VND | Tiền vào | VietinBank | Chưa khớp thanh toán | SEVQR test giao dich 3 |
| …                   |             |          |            |                      |                        |

**Claude Code**

```console
> /mcp
  ⎿  Authentication successful. Connected to sepay.
> cho tôi 5 giao dịch gần đây
⏺ sepay - list_transactions (MCP)(limit: 5, sort: "desc")
● Đây là 5 giao dịch mới nhất. Tất cả đều là tiền vào, từ 29/10/2026 15:08
  đến 31/10/2026 12:23, tổng cộng 471.147đ, không có tiền ra.
┌───┬──────────────────┬──────────┬───────────────────────┬─────────────────────────────────────────────────────────────┐
│ # │    Thời gian     │ Số tiền  │    Ngân hàng / TK     │                          Nội dung                           │
├───┼──────────────────┼──────────┼───────────────────────┼─────────────────────────────────────────────────────────────┤
│ 1 │ 31/10/2026 12:23 │ 139.000đ │ VPBank ****6789       │ NGUYEN VAN A chuyen tien                                    │
├───┼──────────────────┼──────────┼───────────────────────┼─────────────────────────────────────────────────────────────┤
│ 2 │ 31/10/2026 12:02 │ 2.000đ   │ KienLongBank ****4321 │ TRAN THI B chuyen tien, tới NGUYEN VAN A tại Kien Long Bank │
├───┼──────────────────┼──────────┼───────────────────────┼─────────────────────────────────────────────────────────────┤
│ 3 │ 30/10/2026 21:15 │ 58.000đ  │ VPBank ****6789       │ LE VAN C chuyen tien qua MoMo                               │
├───┼──────────────────┼──────────┼───────────────────────┼─────────────────────────────────────────────────────────────┤
│ 4 │ 30/10/2026 16:50 │ 200.000đ │ VPBank ****6789       │ IBFT PHAM THI D chuyen tien                                 │
├───┼──────────────────┼──────────┼───────────────────────┼─────────────────────────────────────────────────────────────┤
│ 5 │ 29/10/2026 15:08 │ 72.147đ  │ VPBank ****6789       │ CASHOUT 0901234567                                          │
└───┴──────────────────┴──────────┴───────────────────────┴─────────────────────────────────────────────────────────────┘
```

> Kết nối Claude, ChatGPT, Claude Code hoặc Codex với tài khoản SePay của bạn.
>
> [Kết nối SePay MCP](https://developer.sepay.vn/vi/agents/bat-dau-nhanh#ket-noi-sepay-mcp-de-hoi-du-lieu-tai-khoan)

## Hỏi cách tích hợp SePay với SePay Skills

Chẳng hạn bạn muốn website tự xác nhận đơn hàng khi khách chuyển khoản, nhưng chưa rõ bắt đầu từ đâu và làm sao cho đúng.

Thêm SePay Skills vào ChatGPT hoặc Claude, rồi hỏi như hỏi nhân viên hỗ trợ: AI chỉ bạn nên cài plugin hay tự tích hợp, hướng dẫn từng bước trên [my.sepay.vn](https://my.sepay.vn) theo đúng tên nút, giải thích webhook bằng lời thường.

- [Tải sepay.zip](https://github.com/sepayvn/sepay-skills/releases/latest/download/sepay.zip) (Claude, ChatGPT, Gemini, Grok)

Cách thêm tệp vào từng ứng dụng xem ở [Cài SePay Skills vào ứng dụng chat AI](https://developer.sepay.vn/vi/agents/skills/cai-dat#cai-sepay-skills-vao-ung-dung-chat-ai).

Lập trình viên cài được skill vào agent lập trình như Claude Code, Codex, Cursor và các agent khác hỗ trợ skill. Khi bạn nhờ tích hợp SePay, agent viết code theo đúng tài liệu SePay và các quy tắc an toàn: mặc định dùng sandbox, giữ secret key ở server, kiểm tra chữ ký webhook, mỗi giao dịch chỉ xử lý một lần.

> Cài skill SePay cho agent lập trình bạn đang dùng.
>
> [Cài cho agent lập trình](https://developer.sepay.vn/vi/agents/bat-dau-nhanh#trong-agent-lap-trinh)

## Thử tích hợp và tra cứu với SePay CLI

Chẳng hạn bạn đang tích hợp webhook trên máy tính, code nhận webhook chạy ở `localhost:3000`, và muốn thử ngay mà không phải đưa code lên server hay chờ khách chuyển khoản thật.

Bạn có thể dùng SePay CLI: terminal 1 nhận webhook về máy, terminal 2 giả lập một giao dịch tiền vào 50.000 đ có mã đơn `DH1709` (`--bank-account` là mã tài khoản ngân hàng sandbox, xem bằng `sepay bank-account list`). Webhook của giao dịch tới code của bạn, terminal 1 in mã HTTP mà code trả về:

**Terminal 1: nhận webhook**

```console
$ sepay webhook listen --forward localhost:3000
env: sandbox
  Delivering for every bank account of this company.
✓ Listening for sandbox events → http://localhost:3000/   (Ctrl+C to stop · retries+enter to manage)
14:22:07  payment_in   → http://localhost:3000/   200   12ms   txn=a41c9e02-xxxx-xxxx-xxxx-fa163e2f7c98   wh=5f0e2a7b-xxxx-xxxx-xxxx-3c9d81e04b6a
```

**Terminal 2: giả lập giao dịch**

```console
$ sepay sandbox simulate payment_in --bank-account 8f3c2a10-xxxx-xxxx-xxxx-0c4e7b9d2f61 --amount 50000 --code DH1709
env: sandbox
Simulated payment_in event.
a41c9e02-xxxx-xxxx-xxxx-fa163e2f7c98
```

Trên production, bạn dùng cùng bộ lệnh để tra cứu giao dịch, tạo và sửa webhook, cấu hình mã thanh toán, cập nhật tài khoản ngân hàng mà không cần mở [my.sepay.vn](https://my.sepay.vn). Ví dụ, tìm giao dịch có mã đơn `DH1709`:

```console
$ sepay transaction list --env production --search DH1709 --json
[
  {
    "id": "07ad3dc9-xxxx-xxxx-xxxx-0afffe87053b",
    "transaction_date": "2026-10-31 11:24:40",
    "transfer_type": "in",
    "amount_in": 50000,
    "transaction_content": "DH1709 thanh toan don hang",
    "code": "DH1709",
    "bank_brand_name": "ACB",
    ...
  }
]
```

> Cài CLI và nhận webhook đầu tiên trên máy của bạn.
>
> [Cài SePay CLI](https://developer.sepay.vn/vi/agents/bat-dau-nhanh#cai-sepay-cli-de-thu-webhook-tren-may)

## Giới hạn và an toàn

SePay MCP: Mặc định chỉ đọc. Thao tác ghi chỉ chạy khi bạn cấp quyền và xác nhận từng lần. Agent chỉ thấy phần dữ liệu bạn cấp quyền khi kết nối. Bạn đổi hoặc thu hồi quyền bất cứ lúc nào trên trang [AI Agent](https://my.sepay.vn/ai-agent) ([chi tiết](https://developer.sepay.vn/vi/agents/mcp/quyen-va-bao-mat)).

Với SePay CLI, mọi lệnh sửa dữ liệu trên production chỉ chạy khi bạn tự xác nhận trên terminal của mình. AI không tự xác nhận thay bạn: gặp lệnh này, AI đưa lệnh để bạn tự chạy ([luật xác nhận](https://developer.sepay.vn/vi/agents/cli/quy-uoc-chung#lenh-sua-du-lieu-tren-production)).

## Cho agent đọc tài liệu SePay

Agent chưa dùng SePay MCP, Skills hay CLI vẫn đọc được tài liệu SePay dạng văn bản qua các địa chỉ sau:

| Nguồn                       | Địa chỉ                                                                                                                       | Dùng khi                                                                                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mục lục cho AI              | [`/llms.txt`](https://developer.sepay.vn/llms.txt)                                                                            | Agent cần danh sách mọi trang kèm mô tả ngắn                                                                                                     |
| Toàn bộ tài liệu            | [`/llms-full.txt`](https://developer.sepay.vn/llms-full.txt)                                                                  | Công cụ cần nạp cả bộ tài liệu, ví dụ để lập chỉ mục. Tệp rất lớn (vài MB), vượt sức chứa của một phiên agent, nên agent không đọc thẳng tệp này |
| Markdown từng trang         | Thêm `.md` vào cuối URL, ví dụ [`/vi/sepay-webhooks/tong-quan.md`](https://developer.sepay.vn/vi/sepay-webhooks/tong-quan.md) | Agent cần đọc một trang, nhanh và tốn ít chi phí hơn                                                                                             |
| Tool tài liệu của SePay MCP | `list_docs`, `fetch_content`                                                                                                  | Ứng dụng AI đã kết nối và đăng nhập SePay MCP, không cần bật nhóm dữ liệu nào                                                                    |

## Tiếp theo

- Cài đặt và kết nối lần đầu theo [Bắt đầu nhanh](https://developer.sepay.vn/vi/agents/bat-dau-nhanh).
- Xem ứng dụng AI [hỏi được những gì qua SePay MCP](https://developer.sepay.vn/vi/agents/mcp/danh-sach-tool) và cần cấp quyền nào.
- Tra [các lệnh của SePay CLI](https://developer.sepay.vn/vi/agents/cli/danh-sach-lenh).
- Xem [skill SePay hướng dẫn agent những gì](https://developer.sepay.vn/vi/agents/skills).
