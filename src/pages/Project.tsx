import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Bed, Bath, Home, MapPin, Calendar, Banknote, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Project = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const properties = [
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
        'Master Bedroom with Walk-in-closet',
        'Boys Quarter (BQ)',
        'Premium Finishing',
        'Fully Tiled & Painted'
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
        'Master Suite with Walk-in-closet',
        'Boys Quarter (BQ)',
        'Premium Finishing',
        'Modern Architecture'
      ],
      isOfferPrice: true
    }
  ];

  const galleryImages = [
    {
      id: 1,
      src: '/images/project-entrance.jpg',
      title: 'Main Entrance - Rotary Wheels Court',
      category: 'exterior',
      description: 'Grand entrance with Rotary branding and premium architectural design'
    },
    {
      id: 2,
      src: '/images/main-gate-entrance.jpg',
      title: 'Main Gate & Security',
      category: 'exterior',
      description: 'Secured main gate entrance with modern architecture and premium landscaping'
    },
    {
      id: 3,
      src: '/images/victoria-island-sign.jpg',
      title: 'RC Victoria Island Street',
      category: 'exterior',
      description: 'Premium street signage with Rotary branding and reflective water features'
    },
    {
      id: 4,
      src: '/images/rotary-street-logo.jpg',
      title: 'Rotary Emblem Street View',
      category: 'exterior',
      description: 'Rotary International logo embedded in premium street design'
    },
    {
      id: 5,
      src: '/images/victoria-island-entrance.jpg',
      title: 'Victoria Island Entrance View',
      category: 'exterior',
      description: 'Elegant entrance with Victoria Island street signage'
    },
    {
      id: 6,
      src: '/images/row-houses-front.jpg',
      title: 'Terraced Duplex Frontage',
      category: 'exterior',
      description: 'Modern terraced duplexes with yellow accent frames and spacious parking'
    },
    {
      id: 7,
      src: '/images/row-houses-view.jpg',
      title: 'Semi-Detached Units',
      category: 'exterior',
      description: 'Premium semi-detached duplexes with contemporary design and private driveways'
    },
    {
      id: 8,
      src: '/images/project-street-view.jpg',
      title: 'RC Lekki Golden Street View',
      category: 'exterior',
      description: 'Modern street frontage with contemporary design and landscaping'
    },
    {
      id: 9,
      src: '/images/street-recycling.jpg',
      title: 'Street Infrastructure',
      category: 'amenities',
      description: 'Well-planned street layout with eco-friendly waste management systems'
    },
    {
      id: 10,
      src: '/images/side-street-view.jpg',
      title: 'Internal Street View',
      category: 'exterior',
      description: 'Interior street view with premium fencing and green spaces'
    },
    {
      id: 11,
      src: '/images/project-amenities.jpg',
      title: 'Gym & Minimart Facilities',
      category: 'amenities',
      description: 'On-site fitness center and convenience store for residents'
    },
    {
      id: 12,
      src: '/images/project-exterior.jpg',
      title: 'Four-Way Test & Community Area',
      category: 'exterior',
      description: 'Rotary values displayed with modern architecture and open spaces'
    },
    {
      id: 13,
      src: '/images/project-aerial.jpg',
      title: 'Aerial Development View',
      category: 'exterior',
      description: 'Complete estate layout showing blue-roofed luxury duplexes'
    },
    {
      id: 14,
      src: '/images/project-topview.jpg',
      title: 'Individual Units & Pool Area',
      category: 'amenities',
      description: 'Top view showcasing individual properties with private pools and gardens'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Images', count: galleryImages.length },
    { id: 'exterior', label: 'Exterior Views', count: galleryImages.filter(img => img.category === 'exterior').length },
    { id: 'amenities', label: 'Amenities', count: galleryImages.filter(img => img.category === 'amenities').length }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-40 pb-12 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              The Project
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Explore our premium duplex properties and development progress
            </p>
            <p className="text-lg text-white/80">
              Located in Marshy-Hills Estate, Lekki Lagos
            </p>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Available Properties
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our premium duplex homes with flexible payment plans
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {properties.map((property, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-luxury transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {property.isOfferPrice && (
                    <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                      Special Offer
                    </Badge>
                  )}
                  <Badge className="absolute top-4 right-4 bg-white/90 text-primary">
                    Ready 2025
                  </Badge>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-muted-foreground text-sm mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      Marshy-Hills Estate, Lekki Lagos
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Bed className="h-4 w-4" />
                      <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Home className="h-4 w-4" />
                      <span>BQ</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-primary">{property.price}</span>
                      {property.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">{property.originalPrice}</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-accent" />
                        <span>{property.paymentPlan}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Banknote className="h-4 w-4 text-accent" />
                        <span>{property.monthlyPayment}/month</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Key Features:</h4>
                    <ul className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
                      {property.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-1 h-1 bg-accent rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="golden" className="w-full" asChild>
                      <Link to="/contact">Show Interest</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Project Gallery
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the beauty and progress of Rotary Wheels Court
            </p>
          </div>

          {/* Gallery Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'golden' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="relative"
              >
                {category.label}
                <Badge 
                  variant="secondary" 
                  className="ml-2 bg-muted text-muted-foreground text-xs"
                >
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <Card key={image.id} className="group overflow-hidden hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img 
                      src={image.src} 
                      alt={image.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => setSelectedImage(image.src)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-full p-0">
                          <div className="relative">
                            <img 
                              src={image.src} 
                              alt={image.title}
                              className="w-full h-auto max-h-[80vh] object-contain"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                              <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                              <p className="text-white/90">{image.description}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Badge className="absolute top-3 left-3 bg-white/90 text-primary text-xs">
                      {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-primary mb-1 group-hover:text-accent transition-colors">
                      {image.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {image.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* More Images Notice */}
          <div className="mt-12 bg-accent/10 border border-accent/20 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <ImageIcon className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-primary">More Images Coming Soon</h3>
            </div>
            <p className="text-muted-foreground">
              We're continuously updating our gallery with construction progress and new photos
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Project;