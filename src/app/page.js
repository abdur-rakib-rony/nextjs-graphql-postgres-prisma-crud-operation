import UserManagement from "./components/UserManagement";
import { getUsers } from "./actions/userActions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const { users, error } = await getUsers();

  if (error) {
    return <div>Error loading users: {error}</div>;
  }

  return <UserManagement users={users} />;
}
