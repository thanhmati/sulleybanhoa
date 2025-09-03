import styles from './style.module.scss';
import clsx from 'clsx';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
};

export function Button({ children, variant = 'solid' }: ButtonProps) {
  return (
    <button className={clsx(styles.btn, variant ? styles[`btn-${variant}`] : '')}>
      {children}
    </button>
  );
}
