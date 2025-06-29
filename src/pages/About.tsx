import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Wifi, Car, Utensils, Music } from 'lucide-react';

const About = () => {
  const amenities = [
    {
      icon: Users,
      title: "Flexible Capacity",
      description: "50 to 2,000+ guests with modular spaces"
    },
    {
      icon: Wifi,
      title: "High-Speed WiFi",
      description: "Complimentary enterprise-grade internet"
    },
    {
      icon: Car,
      title: "Free Parking",
      description: "500+ parking spaces available"
    },
    {
      icon: Utensils,
      title: "Catering Services",
      description: "In-house culinary team and bar service"
    },
    {
      icon: Music,
      title: "A/V Equipment",
      description: "State-of-the-art sound and lighting systems"
    },
    {
      icon: MapPin,
      title: "Prime Location",
      description: "Downtown location with easy access"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">About Our Venue</h1>
          <p className="text-base sm:text-lg md:text-xl text-purple-100 max-w-3xl mx-auto">
            For over two decades, Delight Convention Center has been the premier destination for exceptional events in the heart of the city.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-20">
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Our Story</h2>
              <p className="text-base sm:text-lg text-gray-600">
                Established in 2000, Delight Convention Center has hosted thousands of successful events, 
                from intimate corporate meetings to grand wedding celebrations. Our commitment to excellence 
                and attention to detail has made us the trusted choice for event planners across the region.
              </p>
              <p className="text-base sm:text-lg text-gray-600">
                Located in the vibrant downtown district, our facility combines modern amenities with 
                classic elegance. We pride ourselves on providing personalized service that exceeds 
                expectations and creates unforgettable experiences.
              </p>
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Our Mission</h3>
                <p className="text-sm sm:text-base text-gray-700">
                  To provide exceptional venues and services that transform ordinary gatherings into extraordinary memories.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-200 to-blue-200 rounded-2xl h-64 sm:h-80 md:h-96 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">Venue Image</h3>
                <p className="text-sm sm:text-base">Beautiful convention center interior</p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-16 text-gray-800">World-Class Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {amenities.map((amenity, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full">
                        <amenity.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <CardTitle className="text-base sm:text-lg text-gray-800">{amenity.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm sm:text-base text-gray-600">{amenity.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 sm:mt-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 sm:p-12 text-white">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">2000+</div>
                <div className="text-purple-200 text-sm sm:text-base">Events Hosted</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">50,000</div>
                <div className="text-purple-200 text-sm sm:text-base">Happy Guests</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">23</div>
                <div className="text-purple-200 text-sm sm:text-base">Years of Excellence</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">4.9★</div>
                <div className="text-purple-200 text-sm sm:text-base">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;