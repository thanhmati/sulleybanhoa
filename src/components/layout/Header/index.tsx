import styles from './style.module.scss';
import Logo from '../../../assets/img/header/logo.png';
import { useState } from 'react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.header__logo}>
        <div className={styles['header__logo-icon']}>
          <img src={Logo} alt="logo" />
        </div>
        <a href="#">
          <h1>Tiệm hoa trên mây</h1>
        </a>
      </div>

      {/* Nút toggle */}
      <div className={styles['header__menu-toggle']} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Overlay (click để đóng menu) */}
      <div
        className={`${styles.header__overlay} ${isOpen ? styles.active : ''}`}
        onClick={closeMenu}
      ></div>

      {/* Nav */}
      <nav className={isOpen ? styles.active : ''}>
        <ul>
          <li>
            <a href="#" onClick={closeMenu}>
              Trang chủ
            </a>
          </li>
          <li>
            <a href="#" onClick={closeMenu}>
              Bó hoa
            </a>
          </li>
          <li>
            <a href="#" onClick={closeMenu}>
              Hộp hoa
            </a>
          </li>
          <li>
            <a href="#" onClick={closeMenu}>
              Hoa để bàn
            </a>
          </li>
          <li>
            <a href="#" onClick={closeMenu}>
              Liên hệ
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
