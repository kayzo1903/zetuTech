// app/dashboard/orders/page.tsx (Server Component)
import AdminOrdersList from "@/components/admin/order-list";
import { getServerSession } from "@/lib/server-session";

interface ServerSession {
  isAdmin: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export default async function OrdersPage(){
    const { isAdmin, user } = await getServerSession() as ServerSession;

    // Pass the server-side session data as props
    return (
        <div>
            <AdminOrdersList 
                serverSession={{
                    isAdmin,
                    user
                }}
            />
        </div>
    )
}