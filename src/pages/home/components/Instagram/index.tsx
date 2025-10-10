import { AppButton } from '@/components/ui/AppButton';
import { CONTACT } from '../../../../lib/constants/contact.constant';
import styles from './style.module.scss';

export function Instagram() {
  return (
    <section className={styles['instagram-section']}>
      <h2 className="section-title">Theo dõi chúng tôi trên Instagram</h2>
      <p>Khám phá những tác phẩm mới nhất và hình ảnh behind-the-scenes</p>
      <div className={styles['instagram-posts']}>
        <div className={`${styles['instagram-post']} animate-on-scroll`}>
          <img
            src="https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            alt="Instagram post"
          />
        </div>
        <div className={`${styles['instagram-post']} animate-on-scroll`}>
          <img
            src="https://images.unsplash.com/photo-1496661415325-ef852f9e8e7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            alt="Instagram post"
          />
        </div>
        <div className={`${styles['instagram-post']} animate-on-scroll`}>
          <img
            src="https://images.unsplash.com/photo-1530023367847-a683933f4172?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            alt="Instagram post"
          />
        </div>
        <div className={`${styles['instagram-post']} animate-on-scroll`}>
          <img
            src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            alt="Instagram post"
          />
        </div>
      </div>
      <AppButton
        variant="outline"
        className="mt-12 z-10 relative"
        onClick={() => window.open(CONTACT.SOCIAL.instagram, '_blank')}
      >
        {CONTACT.SOCIAL.tag}
      </AppButton>
    </section>
  );
}
