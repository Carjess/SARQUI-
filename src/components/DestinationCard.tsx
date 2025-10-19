import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DestinationCardProps {
  title: string;
  description: string;
  image: string;
  exploreText: string;
  fullDayText: string;
  exploreLink: string;
  fullDayLink: string;
}

export default function DestinationCard({
  title,
  description,
  image,
  exploreText,
  fullDayText,
  exploreLink,
  fullDayLink
}: DestinationCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-card">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold mb-1">{title}</h3>
        </div>
      </div>
      
      <CardContent className="p-6">
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-col gap-3">
          <Button 
            asChild 
            variant="outline" 
            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link to={exploreLink}>{exploreText}</Link>
          </Button>
          
          <Button 
            asChild 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          >
            <Link to={fullDayLink}>{fullDayText}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}