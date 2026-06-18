import AdminEditor from "./admin-editor";
import { adminSessionToken } from "@/lib/auth";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const content = await getSiteContent();

  return <AdminEditor adminToken={adminSessionToken()} initialContent={content} />;
}
