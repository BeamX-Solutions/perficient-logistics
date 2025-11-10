import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, 
  Car, 
  Waves, 
  Dumbbell, 
  Users, 
  Zap,
  TreePine,
  Camera
} from 'lucide-react';
import amenitiesImage from '@/assets/amenities.jpg';

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secured Environment',
      description: '24/7 security with controlled access and CCTV surveillance'
    },
    {
      icon: Waves,
      title: 'Swimming Pool',
      description: 'Resort-style swimming pool for relaxation and fitness'
    },
    {
      icon: Dumbbell,
      title: 'Fitness Center',
      description: 'Fully equipped gym with modern exercise equipment'
    },
    {
      icon: Users,
      title: 'Children Playground',
      description: 'Safe and fun play area designed for children'
    },
    {
      icon: Car,
      title: 'Ample Parking',
      description: 'Dedicated parking spaces for all residents'
    },
    {
      icon: Zap,
      title: 'Constant Electricity',
      description: 'Reliable power supply with backup generators'
    },
    {
      icon: TreePine,
      title: 'Green Landscape',
      description: 'Beautiful landscaping and green areas throughout'
    },
    {
      icon: Camera,
      title: 'Basketball Court',
      description: 'Professional basketball court for sports enthusiasts'
    }
  ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Premium Amenities & Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience luxury living with world-class amenities designed for comfort, convenience, and lifestyle enhancement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <feature.icon className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Amenities Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-luxury">
              <img 
                src={amenitiesImage} 
                alt="Premium amenities at Rotary Wheels Court"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Premium Amenities</h3>
                <p className="text-white/90">
                  Luxury facilities designed for your comfort and convenience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;