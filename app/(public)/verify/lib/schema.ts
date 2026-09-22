import { z } from "zod";

export const createSupportTicketSchema = z.object({
  name: z.string().trim().min(2, "Full Name must be at least 2 characters"),
  fathersName: z.string().trim().min(2, "Father's / Guardian's Name must be at least 2 characters"),
  dob: z.string().trim().min(1, "Date of birth is required"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits"),
  email: z.string().trim().email("Please provide a valid email address").optional().or(z.literal("")),
  issueCategory: z.string().trim().min(1, "Please select an issue category"),
  message: z.string().trim().min(5, "Please explain your issue (at least 5 characters)"),
});

export type CreateSupportTicketInput = z.infer<typeof createSupportTicketSchema>;
