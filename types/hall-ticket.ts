/**
 * Type definitions for Hall Ticket data,
 * derived from candidateTable and examDetailsTable schemas.
 *
 * candidateTable fields:
 *   id, exam_id, name, roll, fathers_name, address, phone,
 *   category (General|EBC|BC|SC|ST), email, dob,
 *   eligiblity (ELIGIBLE|NOT_ELIGIBLE), signature, profile,
 *   created_at, updated_at
 *
 * examDetailsTable fields:
 *   id, name, post, date, time, reporting, center
 */

export type CastCategory = "General" | "EBC" | "BC" | "SC" | "ST";

export type ExamDetails = {
  name: string;
  post: string;
  date: string;
  time: string;
  reporting: string;
  center: string;
};

export type CandidateData = {
  name: string;
  roll: string;
  fathers_name: string;
  category: CastCategory;
  dob: string;
  gender: string;
  profile?: string; // URL to candidate photo
  signature?: string; // URL to candidate signature
};

export type HallTicketData = {
  candidate: CandidateData;
  exam: ExamDetails;
  instructions: string[];
  negativeMarking: boolean;
  collegeName: string;
  centerAddress: string;
};
