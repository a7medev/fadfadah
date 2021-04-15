const UserDetails = ({ user }) => {
  return (
    <div>
      <img src={user.photoURL} />
      <h1>{user.displayName}</h1>
      <h2>@{user.username}</h2>
    </div>
  );
};

export default UserDetails;
