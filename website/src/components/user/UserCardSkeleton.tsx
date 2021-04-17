import { Card } from 'react-bootstrap';

export interface UserCardSkeletonProps {}

const UserCardSkeleton: React.FC<UserCardSkeletonProps> = () => {
  return (
    <Card className="mb-2 user-card-skeleton">
      <Card.Body className="d-flex user-data">
        <div className="d-flex align-items-center flex-grow-1">
          <div className="skeleton profile-photo" />

          <div className="mr-3">
            <Card.Title className="skeleton display-name"></Card.Title>
            <Card.Subtitle className="skeleton username"></Card.Subtitle>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserCardSkeleton;
