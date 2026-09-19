import { ContentLayout } from "@/components/admin-panel/content-layout";
import type { HallTicketData } from "@/types/hall-ticket";
import HallTicket from "@/components/hall-ticket/HallTicket";

const mockHallTicketData: HallTicketData = {
  collegeName: "SANT SANDHYA DAS MAHILA COLLEGE",
  centerAddress: "Barh, Patna",
  negativeMarking: false,
  instructions: [
    "Don't carry any electronic gadgets",
    "Candidates must reach the examination centre 30 minutes before the exam",
    "Bring a valid photo ID along with this hall ticket",
    "Use of unfair means will result in cancellation of candidature",
    "Candidates must carry their own pen, pencil, and eraser",
  ],
  candidate: {
    name: "Aditya Singh Suman",
    roll: "101",
    fathers_name: "Asdg hhjjjj",
    category: "SC",
    dob: "13-05-1963",
    gender: "Male",
    profile: undefined,
    signature: undefined,
  },
  exam: {
    name: "Non Teaching Staff Recruitment",
    post: "HEAD CLEARK",
    date: "24-09-2026",
    time: "10:30 AM TO 10:35 AM",
    reporting: "09:20 AM",
    center: "SSDM College",
  },
};

export default function HallTicketPreview() {
  return (
    <ContentLayout title="Hall Ticket">
      <div className="flex justify-center">
        <HallTicket data={mockHallTicketData} />
      </div>
    </ContentLayout>
  );
}
