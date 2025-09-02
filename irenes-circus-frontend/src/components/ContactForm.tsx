import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField, TextareaField, FormActions } from "@/components/FormField";
import { Mail, User, MessageSquare, FileText } from "lucide-react";
import { useToast } from "@/hooks/useToast";

// Validation schema
const contactSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string()
    .email("Please enter a valid email address")
    .max(254, "Email must be less than 254 characters"),
  subject: z.string()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject must be less than 200 characters"),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onSubmit: (data: ContactFormValues) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
}

const ContactForm = ({ onSubmit, error, isSubmitting }: ContactFormProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });
  const { success, error: showError } = useToast();

  const handleFormSubmit = async (data: ContactFormValues) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-white/80 p-8 rounded-lg shadow-md">
      <div className="space-y-6">
        <InputField
          name="name"
          label="Name"
          register={register}
          error={errors.name}
          disabled={isSubmitting}
          required
          icon={<User className="text-circus-gold" size={18} />}
          placeholder="Your Name"
          className="bg-circus-cream/60 border-circus-gold text-circus-dark"
        />

        <InputField
          name="email"
          label="Email"
          type="email"
          register={register}
          error={errors.email}
          disabled={isSubmitting}
          required
          icon={<Mail className="text-circus-gold" size={18} />}
          placeholder="you@email.com"
          helpText="We'll never share your email with anyone else."
        />

        <InputField
          name="subject"
          label="Subject"
          register={register}
          error={errors.subject}
          disabled={isSubmitting}
          required
          icon={<FileText className="text-circus-gold" size={18} />}
          placeholder="What's this about?"
        />

        <TextareaField
          name="message"
          label="Message"
          register={register}
          error={errors.message}
          disabled={isSubmitting}
          required
          rows={6}
          placeholder="Tell us what's on your mind..."
          helpText="Please be as detailed as possible to help us assist you better."
        />
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        submitLabel="🎪 Send Message"
        className="pt-6"
      />
    </form>
  );
};

export default ContactForm;
