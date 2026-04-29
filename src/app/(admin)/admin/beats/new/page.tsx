import { requireAdmin } from "@/lib/auth/session";
import { NewBeatForm } from "@/components/admin/new-beat-form";

export default async function NewBeatPage() {
  await requireAdmin();
  return <NewBeatForm />;
}
