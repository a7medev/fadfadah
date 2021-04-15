import styles from './UserDetails.module.css';

const UserDetails = ({ user }) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <p className={styles.paragraph}>سيتم تحويلك إلى موقع فضفضة لمراسلة</p>

        <img src={user.photoURL} className={styles.photo} />
        <h1 className={styles.name}>{user.displayName}</h1>
        <h2 className={styles.username}>
          <span dir="ltr">@{user.username}</span>
        </h2>
      </div>
    </div>
  );
};

export default UserDetails;
