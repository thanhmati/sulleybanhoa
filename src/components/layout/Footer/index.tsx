import styles from './style.module.scss';
import { Icon } from '@iconify/react';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__content}>
        <div className={styles.footer__section}>
          <h3>Về Sulley Flower</h3>
          <p>
            Chuyên thiết kế và cung cấp các sản phẩm hoa tươi nghệ thuật, độc đáo cho mọi dịp đặc
            biệt.
          </p>
        </div>
        <div className={styles.footer__section}>
          <h3>Liên kết nhanh</h3>
          <ul>
            <li>
              <a href="#">Trang chủ</a>
            </li>
            <li>
              <a href="#">Sản phẩm</a>
            </li>
            <li>
              <a href="#">Dịch vụ</a>
            </li>
            <li>
              <a href="#">Liên hệ</a>
            </li>
          </ul>
        </div>
        <div className={styles.footer__section}>
          <h3>Theo dõi chúng tôi</h3>
          <p>Đăng ký để nhận thông tin về các chương trình khuyến mãi</p>
          <div className={styles['social-icons']}>
            <a href="#">
              <Icon icon="fa7-brands:facebook-f" />
            </a>
            <a href="https://www.instagram.com/sulleybanhoa/">
              <Icon icon="fa7-brands:instagram" />
            </a>
            <a href="#">
              <Icon icon={'fa7-brands:tiktok'} />
            </a>
            <a href="#">
              <Icon icon={'fa7-brands:youtube'} />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.footer__bottom}>
        <p>&copy; 2023 Sulley Flower. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  );
}
