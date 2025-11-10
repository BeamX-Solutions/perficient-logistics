import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/FeaturesSection';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Award, Users, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const featuredProperties = [
    {
      title: '3 Bedroom Terraced Duplex with BQ',
      bedrooms: 3,
      bathrooms: 4,
      price: '₦65M',
      originalPrice: '₦70M',
      paymentPlan: '16-18 Months',
      monthlyPayment: '₦3.3M',
      image: '/images/project-exterior.jpg',
      features: [
        'All Ensuite with Ante-room',
        'Living Room & Dining',
        'Master Bedroom with Walk-in-closet'
      ],
      isOfferPrice: true
    },
    {
      title: '4 Bedroom Semi-Detached Duplex with BQ',
      bedrooms: 4,
      bathrooms: 5,
      price: '₦75M',
      originalPrice: '₦80M',
      paymentPlan: '16-18 Months',
      monthlyPayment: '₦3.6M',
      image: '/images/project-aerial.jpg',
      features: [
        'All Ensuite with Ante-room',
        'Spacious Living Areas',
        'Master Suite with Walk-in-closet'
      ],
      isOfferPrice: true
    }
  ];

  const rotaryValues = [
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Rotary standards ensure premium construction and finishing'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Built for Rotary members and like-minded investors'
    },
    {
      icon: TrendingUp,
      title: 'Investment Growth',
      description: 'Prime Lekki location with excellent appreciation potential'
    },
    {
      icon: Shield,
      title: 'Trust & Ethics',
      description: 'Backed by Rotary Club of Lekki Golden reputation'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Rotary Values Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              The Rotary Advantage
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the difference of investing with Rotary Club of Lekki Golden - where ethics, quality, and community come together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rotaryValues.map((value, index) => (
              <Card key={index} className="group text-center hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                    <value.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our premium duplex homes designed for luxury living and excellent investment returns
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {featuredProperties.map((property, index) => (
              <PropertyCard
                key={index}
                title={property.title}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                price={property.price}
                originalPrice={property.originalPrice}
                paymentPlan={property.paymentPlan}
                monthlyPayment={property.monthlyPayment}
                image={property.image}
                features={property.features}
                isOfferPrice={property.isOfferPrice}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="golden" size="lg" asChild>
              <Link to="/project">
                View The Project <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 bg-gradient-luxury text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Invest in Your Future?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join the exclusive community of Rotary Wheels Court. Limited units available with flexible payment plans and zero interest options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="golden" size="lg" className="text-lg px-8" asChild>
                <Link to="/contact">
                  Show Interest Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary"
                asChild
              >
                <Link to="/project">View Project</Link>
              </Button>
            </div>
            <div className="mt-8 text-sm text-white/70">
              <p>Project completion: October - November 2025</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
