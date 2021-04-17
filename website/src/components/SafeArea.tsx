import styles from './SafeArea.module.scss';

interface SafeAreaProps {
  paddingTop?: string | number;
  noBottomNavbar?: boolean;
}

const SafeArea: React.FC<SafeAreaProps> = ({
  children,
  paddingTop,
  noBottomNavbar
}) => {
  return (
    <div
      className={[
        styles.safeArea,
        noBottomNavbar && styles.noBottonNavbar
      ].join(' ')}
      style={{ paddingTop: paddingTop ?? 0 }}
    >
      {children}
    </div>
  );
};

export default SafeArea;
