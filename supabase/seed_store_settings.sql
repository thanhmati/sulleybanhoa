-- Seed Data: Initial Store Settings & Landing Page Content

INSERT INTO public.store_settings (key, value)
VALUES
  ('landing_hero', '{
    "eyebrow": "FLORAL BOUTIQUE COLLECTION 2026",
    "title": "Tô điểm {khoảnh khắc} cùng thiên nhiên.",
    "subtitle": "Những cành hoa được tuyển chọn kỹ lưỡng, cắm nghệ thuật mang phong cách tối giản Hàn Quốc đến không gian sống của bạn.",
    "badge1": "Hoa nhập tươi trong ngày",
    "badge2": "Giao hoa 2H nội thành",
    "badge3": "Đảm bảo hài lòng 100%"
  }'::jsonb),

  ('store_contact', '{
    "phone": "034 908 1629",
    "email": "sulleybanhoa@gmail.com",
    "address": "Quận 1, Thành phố Hồ Chí Minh",
    "zaloUrl": "https://zalo.me",
    "openHours": "08:00 - 21:00 hàng ngày"
  }'::jsonb),

  ('landing_faqs', '[
    {
      "question": "Hoa có đúng mẫu như trên hình không?",
      "answer": "Sulley cam kết hoa thành phẩm giống hình từ 85-95%. Do thuộc tính hoa theo mùa, tiệm sẽ tư vấn hoa thay thế tương đương nếu cần."
    },
    {
      "question": "Tiệm có giao hoa nhanh trong 2 giờ không?",
      "answer": "Có! Đơn hàng hoa bó và giỏ hoa tiêu chuẩn sẽ được giao hỏa tốc nội thành TP.HCM trong 2 giờ."
    },
    {
      "question": "Tôi có được tặng kèm thiệp và viết lời chúc không?",
      "answer": "Tiệm tặng kèm thiệp chúc mừng thiết kế cao cấp và hỗ trợ viết tay lời chúc theo yêu cầu hoàn toàn miễn phí."
    }
  ]'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
