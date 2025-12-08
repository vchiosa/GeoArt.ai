"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Send,
  Loader2,
  Phone,
  Mail,
  PhoneIcon as WhatsappIcon,
} from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  subject: z.string().min(2, { message: "Subject is required." }),
  preferredContact: z.enum(["email", "phone", "whatsapp"]),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferredContact: "email",
    },
  });

  const preferredContact = watch("preferredContact");

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Message Sent",
          description:
            "Thank you for your message. We'll get back to you soon!",
          duration: 5000,
        });
        reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Contact us
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-white mb-2 text-sm font-medium"
            >
              Name
            </label>
            <Input
              id="name"
              {...register("name")}
              className="w-full bg-white/20 text-white placeholder-white/60 border-white/30"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-white mb-2 text-sm font-medium"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="w-full bg-white/20 text-white placeholder-white/60 border-white/30"
              placeholder="Your email"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="phone"
              className="block text-white mb-2 text-sm font-medium"
            >
              Phone (optional)
            </label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              className="w-full bg-white/20 text-white placeholder-white/60 border-white/30"
              placeholder="Your phone number"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block text-white mb-2 text-sm font-medium"
            >
              Subject
            </label>
            <Input
              id="subject"
              {...register("subject")}
              className="w-full bg-white/20 text-white placeholder-white/60 border-white/30"
              placeholder="Message subject"
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-red-400">
                {errors.subject.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="preferredContact"
            className="block text-white mb-2 text-sm font-medium"
          >
            Preferred Contact Method
          </label>
          <Select
            onValueChange={(value) =>
              register("preferredContact").onChange({ target: { value } })
            }
          >
            <SelectTrigger className="w-full bg-white/20 text-white border-white/30">
              <SelectValue placeholder="Select contact method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
          {errors.preferredContact && (
            <p className="mt-1 text-xs text-red-400">
              {errors.preferredContact.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-white mb-2 text-sm font-medium"
          >
            Message
          </label>
          <Textarea
            id="message"
            {...register("message")}
            className="w-full bg-white/20 text-white placeholder-white/60 border-white/30"
            placeholder="Your message"
            rows={4}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-400">
              {errors.message.message}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            type="submit"
            className="w-full sm:w-auto bg-white text-blue-600 hover:bg-white/90 transition-colors duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
          <div className="flex gap-4">
            <a
              href="mailto:contact@geoart.com"
              className="text-white hover:text-blue-200 transition-colors duration-300"
            >
              <Mail className="w-6 h-6" />
            </a>
            <a
              href="https://wa.me/351930630880"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-200 transition-colors duration-300"
            >
              <WhatsappIcon className="w-6 h-6" />
            </a>
          </div>
        </div>
      </form>
      {preferredContact === "whatsapp" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 p-4 bg-green-500/20 rounded-lg text-white text-sm"
        >
          <p>
            You can also reach us directly on WhatsApp:{" "}
            <a
              href="https://wa.me/351930630880"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
            >
              +351 930 630 880
            </a>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
