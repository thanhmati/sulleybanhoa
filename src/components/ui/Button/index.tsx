import styles from './style.module.scss';
import clsx from 'clsx';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, variant = 'solid', className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(styles.btn, variant ? styles[`btn-${variant}`] : '', className)}
    >
      {children}
    </button>
  );
}
