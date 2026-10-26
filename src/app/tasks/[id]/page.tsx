import { TaskDetails } from "@/components/tasks/TaskDetails";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function TaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <TaskDetails taskId={id} />
      </main>
      <Footer />
    </div>
  );
}
