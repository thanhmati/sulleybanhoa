import { Button } from '../../../../components/ui/Button';
import styles from './style.module.scss';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.hero__content}>
        <h2>Nghệ thuật kết hoa Sulley</h2>
        <p>Mang đến những tác phẩm hoa tươi đầy cảm hứng và sáng tạo</p>
        <Button>Khám phá bộ sưu tập</Button>
      </div>
    </section>
  );
}
