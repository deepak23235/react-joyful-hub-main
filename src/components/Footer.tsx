import { MapPin } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-card mt-auto">
    <div className="container py-8 text-center">
      <div className="flex items-center justify-center gap-2 text-lg font-display font-semibold text-foreground mb-2">
        <MapPin className="h-4 w-4 text-accent" />
        ModelDir
      </div>
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} ModelDir. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
