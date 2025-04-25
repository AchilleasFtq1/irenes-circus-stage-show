import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, User, MessageSquare } from "lucide-react";

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSubmit: (data: ContactFormValues) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
}

const ContactForm = ({ onSubmit, error, isSubmitting }: ContactFormProps) => {
  const { register, handleSubmit, reset, formState } = useForm<ContactFormValues>();

  const handleFormSubmit = async (data: ContactFormValues) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-white/80 p-8 rounded-lg shadow-md">
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div>
        <label className="block font-alt text-circus-dark mb-1" htmlFor="name">
          <span className="flex items-center gap-2"><User className="text-circus-gold" size={18}/> Name</span>
        </label>
        <Input 
          id="name"
          className="bg-circus-cream/60 border-circus-gold text-circus-dark placeholder:text-circus-gold"
          placeholder="Your Name"
          {...register("name", { required: true })}
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <label className="block font-alt text-circus-dark mb-1" htmlFor="email">
          <span className="flex items-center gap-2"><Mail className="text-circus-gold" size={18}/> Email</span>
        </label>
        <Input 
          id="email"
          type="email"
          className="bg-circus-cream/60 border-circus-gold text-circus-dark placeholder:text-circus-gold"
          placeholder="you@email.com"
          {...register("email", { required: true })}
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <label className="block font-alt text-circus-dark mb-1" htmlFor="subject">
          <span className="flex items-center gap-2"><MessageSquare className="text-circus-gold" size={18}/> Subject</span>
        </label>
        <Input 
          id="subject"
          className="bg-circus-cream/60 border-circus-gold text-circus-dark placeholder:text-circus-gold"
          placeholder="Subject of your message"
          {...register("subject", { required: true })}
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <label className="block font-alt text-circus-dark mb-1" htmlFor="message">
          Message
        </label>
        <Textarea 
          id="message"
          className="bg-circus-cream/60 border-circus-gold text-circus-dark placeholder:text-circus-gold min-h-[120px]"
          placeholder="Type your message here..."
          {...register("message", { required: true })}
          disabled={isSubmitting}
        />
      </div>
      
      <Button 
        type="submit"
        className="w-full bg-circus-gold text-circus-dark font-bold hover:bg-circus-red hover:text-circus-cream transition-colors"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
};

export default ContactForm;
