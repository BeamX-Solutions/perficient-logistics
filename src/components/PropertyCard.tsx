import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Home, MapPin, Calendar, Banknote } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  title: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  originalPrice?: string;
  paymentPlan: string;
  monthlyPayment: string;
  image: string;
  features: string[];
  isOfferPrice?: boolean;
}

const PropertyCard = ({ 
  title, 
  bedrooms, 
  bathrooms, 
  price, 
  originalPrice,
  paymentPlan, 
  monthlyPayment, 
  image, 
  features,
  isOfferPrice = false
}: PropertyCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-luxury transition-all duration-300 transform hover:-translate-y-2">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <img 
            src={image || '/images/project-aerial.jpg'} 
            alt={title}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {isOfferPrice && (
            <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
              Special Offer
            </Badge>
          )}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90 text-primary">
              Ready 2025
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">
            {title}
          </h3>
          <div className="flex items-center text-muted-foreground text-sm mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            Marshy-Hills Estate, Lekki Lagos
          </div>
        </div>

        {/* Property Details */}
        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Bed className="h-4 w-4" />
            <span>{bedrooms} Beds</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="h-4 w-4" />
            <span>{bathrooms} Baths</span>
          </div>
          <div className="flex items-center space-x-1">
            <Home className="h-4 w-4" />
            <span>BQ</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-primary">{price}</span>
            {originalPrice && (
              <span className="text-lg text-muted-foreground line-through">{originalPrice}</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-accent" />
              <span>{paymentPlan}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Banknote className="h-4 w-4 text-accent" />
              <span>{monthlyPayment}/month</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Key Features:</h4>
          <ul className="grid grid-cols-1 gap-1 text-sm text-muted-foreground">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center">
                <div className="w-1 h-1 bg-accent rounded-full mr-2" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link to="/project">View Project</Link>
        </Button>
        <Button variant="golden" className="flex-1" asChild>
          <Link to="/contact">Show Interest</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;