import styles from './style.module.scss';
import { Button } from '../../../../components/ui/Button';
import { Icon } from '@iconify/react';
import { CONTACT } from '../../../../lib/constants/contact.constant';

export function Contact() {
  return (
    <section className={styles.contact}>
      <h2 className="section-title">Liên hệ với chúng tôi</h2>
      <div className={styles.contact__container}>
        <div className={`${styles.contact__info} animate-on-scroll`}>
          <h3>Thông tin liên hệ</h3>
          <ul>
            <li>
              <Icon className={styles.contact__info__icon} icon="fa-solid:map-marker-alt" />
              {CONTACT.INFO.address}
            </li>
            <li>
              <Icon className={styles.contact__info__icon} icon="fa7-solid:phone" />
              {CONTACT.INFO.phoneNumber}
            </li>
            <li>
              <Icon className={styles.contact__info__icon} icon="fa7-solid:envelope" />
              {CONTACT.INFO.email}
            </li>
            <li>
              <Icon className={styles.contact__info__icon} icon="fa7-solid:clock" />
              {CONTACT.INFO.openingHours}
            </li>
          </ul>
          <div className={`${styles['social-icons']} mt-9`}>
            <a href={CONTACT.SOCIAL.facebook} target="_blank">
              <Icon icon="fa7-brands:facebook-f" />
            </a>
            <a href={CONTACT.SOCIAL.instagram} target="_blank">
              <Icon icon="fa7-brands:instagram" />
            </a>
            <a href={CONTACT.SOCIAL.tiktok} target="_blank">
              <Icon icon={'fa7-brands:tiktok'} />
            </a>
            <a href={CONTACT.SOCIAL.zalo} target="_blank">
              <Icon icon={'simple-icons:zalo'} />
            </a>
          </div>
        </div>
        <div className={`${styles.contact__form} animate-on-scroll`}>
          <h3>Gửi tin nhắn cho chúng tôi</h3>
          <form>
            <div className={styles['form-group']}>
              <label htmlFor="name">Họ và tên</label>
              <input type="text" id="name" placeholder="Nhập họ tên của bạn" />
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Nhập email của bạn" />
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="message">Lời nhắn</label>
              <textarea id="message" placeholder="Nhập lời nhắn của bạn"></textarea>
            </div>
            <Button>Gửi tin nhắn</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
