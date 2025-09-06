import styles from './style.module.scss';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header__logo}>
        <div className={styles['header__logo-icon']}>S</div>
        <h1>Sulley Flower</h1>
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
