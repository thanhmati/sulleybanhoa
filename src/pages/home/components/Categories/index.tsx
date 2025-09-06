import styles from './style.module.scss';

export function Categories() {
  return (
    <section className={styles.categories}>
      <h2 className="section-title">Dịch vụ của chúng tôi</h2>
      <div className={styles.category__container}>
        <div className={`${styles.category} animate-on-scroll`}>
          <div className={styles.category__img}>
            <img
              src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Bó hoa"
            />
          </div>
          <div className={styles.category__content}>
            <h3>Bó hoa nghệ thuật</h3>
            <p>Những bó hoa được thiết kế độc đáo, phù hợp cho mọi dịp</p>
            <a href="#" className={styles.category__btn}>
              Xem thêm →
            </a>
          </div>
        </div>
        <div className={`${styles.category} animate-on-scroll`}>
          <div className={styles.category__img}>
            <img
              src="https://images.unsplash.com/photo-15818a0c0d46d1362ae996f8c7cd22c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Hộp hoa"
            />
          </div>
          <div className={styles.category__content}>
            <h3>Hộp hoa cao cấp</h3>
            <p>Hoa được sắp xếp tinh tế trong những chiếc hộp sang trọng</p>
            <a href="#" className={styles.category__btn}>
              Xem thêm →
            </a>
          </div>
        </div>
        <div className={`${styles.category} animate-on-scroll`}>
          <div className={styles.category__img}>
            <img
              src="https://images.unsplash.com/photo-1484482340112-e3c8d8354c2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Hoa để bàn"
            />
          </div>
          <div className={styles.category__content}>
            <h3>Hoa để bàn</h3>
            <p>Thiết kế hoa trang trí không gian làm việc và sinh hoạt</p>
            <a href="#" className={styles.category__btn}>
              Xem thêm →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
