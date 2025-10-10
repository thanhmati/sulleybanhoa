import { AppButton } from '@/components/ui/AppButton';
import styles from './style.module.scss';

export function FeaturedProduct() {
  return (
    <section className={styles['featured-products']}>
      <h2 className="section-title">Sản phẩm nổi bật</h2>
      <div className={styles['products-container']}>
        <div className={`${styles.product} animate-on-scroll`}>
          <div className={styles.product__img}>
            <img
              src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Bó hoa hồng"
            />
          </div>
          <div className={styles.product__content}>
            <h3>Bó hồng nhung sang trọng</h3>
            <p>Bó hoa hồng đỏ truyền thống với thiết kế hiện đại</p>
            <span className="price">1.250.000₫</span>
            <AppButton> Đặt hàng </AppButton>
          </div>
        </div>
        <div className={`${styles.product} animate-on-scroll`}>
          <div className={styles.product__img}>
            <img
              src="https://images.unsplash.com/photo-1584305574647-0cc949a2bb9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Hộp hoa"
            />
          </div>
          <div className={styles.product__content}>
            <h3>Hộp hoa hồng trắng</h3>
            <p>Hộp hoa cao cấp với hoa hồng trắng tinh khiết</p>
            <span className="price">1.500.000₫</span>
            <AppButton> Đặt hàng </AppButton>
          </div>
        </div>
        <div className={`${styles.product} animate-on-scroll`}>
          <div className={styles.product__img}>
            <img
              src="https://images.unsplash.com/photo-1457530378978-8bac673b8062?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Bó hoa lan"
            />
          </div>
          <div className={styles.product__content}>
            <h3>Bó hoa lan tím</h3>
            <p>Phong cách hiện đại với hoa lan tím quý phái</p>
            <span className="price">1.800.000₫</span>
            <AppButton> Đặt hàng </AppButton>
          </div>
        </div>
      </div>
    </section>
  );
}
