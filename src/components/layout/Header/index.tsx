import styles from './style.module.scss';
import Logo from '../../../assets/img/header/logo.png';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header__logo}>
        <div className={styles['header__logo-icon']}>
          <img src={Logo} />
        </div>
        <a href="#">
          <h1>Tiệm hoa trên mây</h1>
        </a>
      </div>
      <nav>
        <ul>
          <li>
            <a href="#">Trang chủ</a>
          </li>
          <li>
            <a href="#">Bó hoa</a>
          </li>
          <li>
            <a href="#">Hộp hoa</a>
          </li>
          <li>
            <a href="#">Hoa để bàn</a>
          </li>
          <li>
            <a href="#">Liên hệ</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
