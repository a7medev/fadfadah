import * as React from 'react';
import { useState, useContext } from 'react';
import PageTransition from '../../components/PageTransition';
import Prefrences from '../../components/settings/Prefrences';
import MessageBox from '../../components/MessageBox';
import { Container } from 'react-bootstrap';
import { AuthContext } from '../../store/AuthContext';
import { Helmet } from 'react-helmet';
import Account from '../../components/settings/Account';
import ChangePassword from '../../components/settings/ChangePassword';

const Settings: React.FC = () => {
  const { user, userData, setUserData } = useContext(AuthContext)!;

  const [message, setMessage] = useState<string | null>(null);

  return (
    <PageTransition>
      <Helmet>
        <title>الإعدادات | فضفضة</title>
      </Helmet>
      <Container className="pt-2">
        <h4 className="mb-3">الإعدادات</h4>
        <hr />

        <MessageBox
          show={!!message}
          onClose={() => setMessage(null)}
          title="رسالة من الموقع"
          text={message!}
        />

        <Prefrences user={user} userData={userData} setUserData={setUserData} />

        <Account user={user} setMessage={setMessage} />

        <ChangePassword setMessage={setMessage} />
      </Container>
    </PageTransition>
  );
};

export default Settings;
