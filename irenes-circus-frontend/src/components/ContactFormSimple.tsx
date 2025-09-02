import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, User, MessageSquare, FileText } from "lucide-react";

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

const ContactFormSimple = ({ onSubmit, error, isSubmitting }: ContactFormProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const handleFormSubmit = async (data: ContactFormValues) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-xl border-2 border-circus-gold/30">
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div>
        <label className="block font-bold text-circus-dark mb-2" htmlFor="name">
          <span className="flex items-center gap-2">
            <User className="text-circus-gold" size={18}/>
            Name {errors.name && <span className="text-red-500">*</span>}
          </span>
        </label>
        <Input 
          id="name"
          className="bg-circus-cream border-2 border-circus-gold text-circus-dark placeholder:text-circus-dark/60 focus:border-circus-red focus:ring-2 focus:ring-circus-gold/20 font-medium"
          placeholder="Your Name"
          {...register("name")}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>
      
      <div>
        <label className="block font-bold text-circus-dark mb-2" htmlFor="email">
          <span className="flex items-center gap-2">
            <Mail className="text-circus-gold" size={18}/>
            Email {errors.email && <span className="text-red-500">*</span>}
          </span>
        </label>
        <Input 
          id="email"
          type="email"
          className="bg-circus-cream border-2 border-circus-gold text-circus-dark placeholder:text-circus-dark/60 focus:border-circus-red focus:ring-2 focus:ring-circus-gold/20 font-medium"
          placeholder="you@email.com"
          {...register("email")}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <label className="block font-bold text-circus-dark mb-2" htmlFor="subject">
          <span className="flex items-center gap-2">
            <FileText className="text-circus-gold" size={18}/>
            Subject {errors.subject && <span className="text-red-500">*</span>}
          </span>
        </label>
        <Input 
          id="subject"
          className="bg-circus-cream border-2 border-circus-gold text-circus-dark placeholder:text-circus-dark/60 focus:border-circus-red focus:ring-2 focus:ring-circus-gold/20 font-medium"
          placeholder="What's this about?"
          {...register("subject")}
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>
        )}
      </div>
      
      <div>
        <label className="block font-bold text-circus-dark mb-2" htmlFor="message">
          <span className="flex items-center gap-2">
            <MessageSquare className="text-circus-gold" size={18}/>
            Message {errors.message && <span className="text-red-500">*</span>}
          </span>
        </label>
        <Textarea 
          id="message"
          className="bg-circus-cream border-2 border-circus-gold text-circus-dark placeholder:text-circus-dark/60 min-h-[120px] focus:border-circus-red focus:ring-2 focus:ring-circus-gold/20 font-medium"
          placeholder="Tell us what's on your mind..."
          {...register("message")}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
        )}
      </div>
      
      <Button 
        type="submit"
        className="w-full bg-circus-gold text-circus-dark font-bold hover:bg-circus-red hover:text-circus-cream transition-colors py-3 text-lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-circus-dark border-t-transparent rounded-full animate-spin" />
            Sending...
          </div>
        ) : (
          "🎪 Send Message"
        )}
      </Button>
    </form>
  );
};

export default ContactFormSimple;
