import { AppButton } from '@/components/ui/AppButton';
import styles from './style.module.scss';

export function Intro() {
  return (
    <section className={styles.intro}>
      <h2 className="section-title">Về Sulley Flower</h2>
      <p>
        Sulley Flower là cửa hàng hoa tươi chuyên thiết kế những bó hoa, hộp hoa và sản phẩm hoa
        nghệ thuật độc đáo. Với sự sáng tạo và tỉ mỉ, chúng tôi mang đến những tác phẩm hoa đẹp mắt,
        tinh tế và đầy cảm xúc cho mọi dịp đặc biệt của bạn.
      </p>
      <AppButton variant="outline">Câu chuyện của chúng tôi</AppButton>
    </section>
  );
}
