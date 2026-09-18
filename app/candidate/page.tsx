import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CandidateTableView } from "./_component/candidate-table-view";

export default function CandidatePage() {
  return (
    <ContentLayout title="Candidates">
      <CandidateTableView />
    </ContentLayout>
  );
}