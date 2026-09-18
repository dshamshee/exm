import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ExamTableView } from "./_component/exam-table-view";

export default function ExamPage() {
  return (
    <ContentLayout title="Exams">
      <ExamTableView />
    </ContentLayout>
  );
}
