import withAdminAuth from '../hoc/withAdminAuth';
import AdminApproval from './AdminApproval';

const AdminPage = () => {
  return (
    <div>
      <AdminApproval />
    </div>
  );
};

export default withAdminAuth(AdminPage);
