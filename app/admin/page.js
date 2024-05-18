'use client';
import AdminApproval from './components/AdminApproval';

import withAdminAuth from './components/withAdminAuth';

const AdminPage = () => {
  return (
    <div>
      <AdminApproval />
    </div>
  );
};

export default withAdminAuth(AdminPage);
