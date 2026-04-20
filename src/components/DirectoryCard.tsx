import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface DirectoryCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
  count?: number;
  countLabel?: string;
}

const DirectoryCard = ({ title, description, image, href, count, countLabel }: DirectoryCardProps) => (
  <Link to={href} className="group block rounded-lg overflow-hidden bg-card card-elevated">
    <div className="aspect-[16/10] overflow-hidden">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-display font-semibold text-card-foreground group-hover:text-accent transition-colors">
          {title}
        </h3>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      {count !== undefined && (
        <span className="mt-3 inline-block text-xs font-medium text-accent">
          {count} {countLabel || "items"}
        </span>
      )}
    </div>
  </Link>
);

export default DirectoryCard;
