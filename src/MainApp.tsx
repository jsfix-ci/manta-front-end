// @ts-nocheck
import React from 'react';
import config from 'config';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { SendPage } from 'pages';
import MissingRequiredSoftwareModal from 'components/Modal/missingRequiredSoftwareModal';
import MobileNotSupportedModal from 'components/Modal/mobileNotSupported';
import Sidebar from 'components/Sidebar';
import ThemeToggle from 'components/ThemeToggle';
import userIsMobile from 'utils/ui/userIsMobile';
import NewerSignerVersionRequiredModal from 'components/Modal/newerSignerVersionRequiredModal';
import AccountDisplay from 'components/AccountModalDisplay';
import DowntimeModal from 'components/Modal/downtimeModal';
import signerIsOutOfDate from 'utils/validation/signerIsOutOfDate';
import { usePrivateWallet } from 'contexts/privateWalletContext';

function MainApp() {
  const { signerVersion } = usePrivateWallet();
  const onMobile = userIsMobile();

  let warningModal;
  if (config.DOWNTIME) {
    warningModal = <DowntimeModal />;
  } else if (onMobile) {
    warningModal = <MobileNotSupportedModal />;
  } else if (signerIsOutOfDate(signerVersion)) {
    warningModal = <NewerSignerVersionRequiredModal />;
  } else {
    warningModal = <MissingRequiredSoftwareModal />;
  }

  document.title = config.PAGE_TITLE;

  return (
    <div className="main-app bg-primary flex">
      <Sidebar />
      {warningModal}
      <Switch>
        <Route path="/" render={() => <Redirect to="/transact" />} exact />
        <Route path="/send" render={() => <Redirect to="/transact" />} exact />
        <Route path="/transact" component={SendPage} exact />
      </Switch>
      <div className="p-4 hidden change-theme lg:block fixed right-72 bottom-0">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default withRouter(MainApp);
