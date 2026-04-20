import { Phone, MessageCircle } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ContactButtonsProps {
  phoneNumber: string;
  size?: "sm" | "md" | "lg";
  variant?: "inline" | "stacked";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const buttonSizeClasses = {
  sm: "h-9 w-9",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const ContactButtons = ({ phoneNumber, size = "md", variant = "inline" }: ContactButtonsProps) => {
  const safePhone = phoneNumber || "+910000000000";
  // Clean phone number for WhatsApp (remove +, spaces, dashes)
  const cleanPhone = safePhone.replace(/[\s\-()]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}`;
  const callUrl = `tel:${safePhone}`;

  const containerClass = variant === "stacked" 
    ? "flex flex-col gap-2" 
    : "flex items-center gap-2";

  return (
    <div className={containerClass}>
      <TooltipProvider>
        {/* Call Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={callUrl}
              className={`inline-flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-110 shadow-md hover:shadow-lg ${buttonSizeClasses[size]}`}
              aria-label={`Call ${safePhone}`}
            >
              <Phone className={sizeClasses[size]} />
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>Call {safePhone}</p>
          </TooltipContent>
        </Tooltip>

        {/* WhatsApp Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white transition-all hover:scale-110 shadow-md hover:shadow-lg ${buttonSizeClasses[size]}`}
              aria-label={`Chat on WhatsApp with ${safePhone}`}
            >
              <MessageCircle className={sizeClasses[size]} />
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>Chat on WhatsApp</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ContactButtons;
