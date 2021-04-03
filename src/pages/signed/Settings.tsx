import * as React from 'react';
import { useState } from 'react';

import { RouteComponentProps } from '@reach/router';
import PageTransition from '../../components/PageTransition';

import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { Container } from 'react-bootstrap';

import Prefrences from '../../components/PrefrencesSettings';
import MessageBox from '../../components/MessageBox';
import Account from '../../components/AccountSettings';
import ChangePassword from '../../components/ChangePasswordSettings';
import DeleteAccount from '../../components/DeleteAccountSettings';
import withAuth from '../../components/withAuth';

export interface SettingsProps extends RouteComponentProps {}

const Settings: React.FC<SettingsProps> = () => {
  const { user, settings, setSettings } = useAuth();

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

        <Prefrences
          user={user!}
          settings={settings!}
          setSettings={setSettings}
        />

        <Account setMessage={setMessage} />

        <ChangePassword setMessage={setMessage} />

        <DeleteAccount />
      </Container>
    </PageTransition>
  );
};

export default withAuth<SettingsProps>(Settings);
