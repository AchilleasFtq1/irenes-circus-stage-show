
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, User } from "lucide-react";

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ContactFormValues>();
  const { toast } = useToast();

  const onSubmit = async (data: ContactFormValues) => {
    // No real backend, so just show a toast and reset
    toast({
      title: "Inquiry Sent!",
      description: "Thanks for reaching out. We'll get back to you soon.",
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
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
        className="bg-circus-gold text-circus-dark font-bold hover:bg-circus-red hover:text-circus-cream transition-colors"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Inquiry"}
      </Button>
    </form>
  )
};

export default ContactForm;
