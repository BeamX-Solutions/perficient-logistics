import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  User, 
  MessageSquare,
  Calendar,
  Banknote
} from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the data to your backend
    // For now, we'll just show a success message
    toast({
      title: "Interest Registered Successfully!",
      description: "Our team will contact you within 24 hours.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      propertyType: '',
      message: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const rotaryContacts = [
    {
      name: 'RTN. AFOLABI OLUFUNMILAYO',
      phone: '+234 802 320 9322'
    },
    {
      name: 'RTN. AGNES',
      phone: '+234 814 901 7989'
    },
    {
      name: 'RTN. AKINLABI AKINTAYO',
      phone: '+234 809 843 4810'
    },
    {
      name: 'RTN. BUSAYO OWAH',
      phone: '+234 703 497 0389'
    },
    {
      name: 'RTN. OBINNA NWEKE',
      phone: '+234 816 471 1076'
    },
    {
      name: 'RTN. VICTOR ITOTOI',
      phone: '+234 913 779 7198'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Page Header */}
      <section className="pt-40 pb-12 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get In Touch
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Ready to invest in your future? Let's discuss how Rotary Wheels Court can be your next great investment
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-accent text-accent-foreground text-sm px-4 py-2">
                <Calendar className="w-4 h-4 mr-2" />
                Quick Response Guaranteed
              </Badge>
              <Badge className="bg-white/20 text-white text-sm px-4 py-2">
                <Banknote className="w-4 h-4 mr-2" />
                Flexible Payment Plans
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="shadow-luxury">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-primary flex items-center">
                    <MessageSquare className="w-6 h-6 mr-2 text-accent" />
                    Express Your Interest
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below and our team will reach out to you within 24 hours
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Full Name *
                        </label>
                        <Input
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Phone Number *
                        </label>
                        <Input
                          placeholder="+234 xxx xxx xxxx"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Property Interest
                        </label>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          value={formData.propertyType}
                          onChange={(e) => handleInputChange('propertyType', e.target.value)}
                        >
                          <option value="">Select property type</option>
                          <option value="3-bedroom">3 Bedroom Terraced Duplex</option>
                          <option value="4-bedroom">4 Bedroom Semi-Detached</option>
                          <option value="both">Both Property Types</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Message (Optional)
                      </label>
                      <Textarea
                        placeholder="Tell us about your investment goals, preferred payment plan, or any questions you have..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                      />
                    </div>

                    <Button type="submit" variant="golden" size="lg" className="w-full">
                      Submit Interest
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Project Location */}
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-primary flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-accent" />
                    Project Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    <strong>Marshy-Hills Estate</strong><br />
                    Addo Road, Ajah, Lekki<br />
                    Lagos State, Nigeria
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    Site visits available by appointment
                  </div>
                </CardContent>
              </Card>

              {/* Rotary Team Contacts */}
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-primary flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-accent" />
                    Rotary Team Contacts
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Speak directly with our Rotary project team members
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {rotaryContacts.map((contact, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div>
                          <p className="font-medium text-primary text-sm">{contact.name}</p>
                        </div>
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-accent hover:text-accent-hover transition-colors font-medium text-sm"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card className="bg-accent/10 border-accent/20 shadow-golden">
                <CardContent className="p-6">
                  <h3 className="font-bold text-primary mb-4">Why Choose Rotary Wheels Court?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <div className="w-1 h-1 bg-accent rounded-full mr-3" />
                      Zero interest payment plans available
                    </li>
                    <li className="flex items-center">
                      <div className="w-1 h-1 bg-accent rounded-full mr-3" />
                      Rotary quality assurance and ethics
                    </li>
                    <li className="flex items-center">
                      <div className="w-1 h-1 bg-accent rounded-full mr-3" />
                      Prime location in Lekki with growth potential
                    </li>
                    <li className="flex items-center">
                      <div className="w-1 h-1 bg-accent rounded-full mr-3" />
                      Excellent rental income opportunities
                    </li>
                    <li className="flex items-center">
                      <div className="w-1 h-1 bg-accent rounded-full mr-3" />
                      Completion guaranteed by 2025
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;