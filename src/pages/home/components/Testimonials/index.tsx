import styles from './style.module.scss';

export function Testimonials() {
  return (
    <section className={styles.testimonials}>
      <h2 className="section-title">Khách hàng nói gì về chúng tôi</h2>
      <div className={styles.testimonials__container}>
        <div className={`${styles.testimonial} animate-on-scroll`}>
          <i className="fas fa-quote-left"></i>
          <p>
            "Tôi hoàn toàn bất ngờ với bó hoa từ Sulley. Thiếtkế đẹp hơn cả những gì tôi mong đợi và
            hoa tươi rất lâu."
          </p>
          <div className={styles.testimonial__customer}>- Chị Minh Anh, Hà Nội</div>
        </div>
        <div className={`${styles.testimonial} animate-on-scroll`}>
          <i className="fas fa-quote-left"></i>
          <p>
            "Dịch vụ giao hoa rất chuyên nghiệp. Người nhận hoa rất thích thú và gửi lời cảm ơn đến
            Sulley."
          </p>
          <div className={styles.testimonial__customer}>- Anh Tuấn Minh, TP. Hồ Chí Minh</div>
        </div>
        <div className={`${styles.testimonial} animate-on-scroll`}>
          <i className="fas fa-quote-left"></i>
          <p>
            "Hộp hoa của Sulley thực sự là một tác phẩm nghệ thuật. Tôi sẽ tiếp tục ủng hộ cửa hàng
            trong thời gian tới."
          </p>
          <div className={styles.testimonial__customer}>- Chị Ngọc Hà, Đà Nẵng</div>
        </div>
      </div>
    </section>
  );
}
