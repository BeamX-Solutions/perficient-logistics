import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, TrendingUp, Shield, Target, Heart, Building2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  const rotaryValues = [
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Every aspect of Rotary Wheels Court is built to the highest standards, ensuring premium construction quality and superior finishing that stands the test of time.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Designed specifically for Rotary members and like-minded investors who value ethics, quality, and community-driven development.'
    },
    {
      icon: TrendingUp,
      title: 'Investment Growth',
      description: 'Strategically located in prime Lekki, offering excellent appreciation potential and strong rental income opportunities for investors.'
    },
    {
      icon: Shield,
      title: 'Trust & Ethics',
      description: 'Backed by the reputation and ethical standards of Rotary Club of Lekki Golden, ensuring transparency and accountability throughout.'
    }
  ];

  const milestones = [
    {
      year: '2023',
      title: 'Project Conception',
      description: 'RC Lekki Golden identified the need for quality, affordable housing for members and investors'
    },
    {
      year: '2024',
      title: 'Development Phase',
      description: 'Construction commenced with focus on premium quality and timely delivery'
    },
    {
      year: '2025',
      title: 'Project Completion',
      description: 'Expected completion in October-November 2025, ready for handover to investors'
    }
  ];

  const whyChooseUs = [
    'Developed by trusted Rotary Club of Lekki Golden',
    'Prime location in Marshy-Hills Estate, Lekki',
    'Flexible payment plans with zero interest options',
    'High rental yield potential in premium location',
    'Quality construction with premium finishes',
    'Ready for occupation by end of 2025',
    'Excellent investment appreciation potential',
    'Community-focused development'
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-40 pb-12 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About Rotary Wheels Court
            </h1>
            <p className="text-xl text-white/90 mb-6">
              A premium real estate service project by Rotary Club of Lekki Golden
            </p>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              We are committed to providing quality, affordable housing solutions for our members and discerning investors, 
              combining the Rotary principles of service, ethics, and excellence with modern real estate development.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-accent/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To create exceptional living spaces that embody the Rotary values of service, integrity, and excellence, 
                  while providing our members and investors with premium real estate opportunities in prime Lagos locations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To deliver high-quality, affordable housing solutions that meet the needs of Rotary members and investors, 
                  ensuring transparency, ethical practices, and exceptional value in every project we undertake.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rotary Values */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              The Rotary Advantage
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the difference of investing with Rotary Club of Lekki Golden
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

      {/* Project Timeline */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Project Timeline
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our journey in creating Rotary Wheels Court
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {milestone.year}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-1 h-full bg-accent/30 mt-2" />
                    )}
                  </div>
                  <Card className="flex-1">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-primary mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Why Choose Rotary Wheels Court?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Investing with us means joining a community built on trust, quality, and shared values
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {whyChooseUs.map((reason, index) => (
              <Card key={index} className="group hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-4 flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-muted-foreground">{reason}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-luxury text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Discover the Rotary difference and secure your premium property today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="golden" size="lg" className="text-lg px-8" asChild>
                <Link to="/project">View Properties</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary"
                asChild
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;