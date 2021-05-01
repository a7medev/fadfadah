import { useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import PageTransition from '../../components/PageTransition';
import MessageBox from '../../components/MessageBox';
import PrefrencesSettings from '../../components/settings/PrefrencesSettings';
import AccountSettings from '../../components/settings/AccountSettings';
import ChangePasswordSettings from '../../components/settings/ChangePasswordSettings';
import DeleteAccount from '../../components/settings/DeleteAccountSettings';
import withAuth from '../../components/auth/withAuth';
import { useAuth } from '../../contexts/AuthContext';

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

        <MessageBox
          show={!!message}
          onClose={() => setMessage(null)}
          title="رسالة من الموقع"
          text={message!}
        />

        <AccountSettings setMessage={setMessage} />

        <PrefrencesSettings
          user={user!}
          settings={settings!}
          setSettings={setSettings}
        />


        <ChangePasswordSettings setMessage={setMessage} />

        <DeleteAccount />
      </Container>
    </PageTransition>
  );
};

export default withAuth<SettingsProps>(Settings);
