import { z } from "zod";

export const bloodRequestSchema = z.object({
  patientName: z.string().min(1, "Patient Name is required"),
  bloodGroup: z.string().min(1, "Blood Group is required"),
  unitsRequired: z.string().min(1, "Required"),
  urgency: z.string().min(1, "Urgency is required"),
  hospitalName: z.string().min(1, "Hospital Name is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  contactNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Valid 10-digit number required"),
  note: z.string().optional(),
  requiredDate: z.date()
});

export type BloodRequestFormValues = z.infer<typeof bloodRequestSchema>;
