
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
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Our Venue</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            For over two decades, Delight Convention Center has been the premier destination for exceptional events in the heart of the city.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-800">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Established in 2000, Delight Convention Center has hosted thousands of successful events, 
                from intimate corporate meetings to grand wedding celebrations. Our commitment to excellence 
                and attention to detail has made us the trusted choice for event planners across the region.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Located in the vibrant downtown district, our facility combines modern amenities with 
                classic elegance. We pride ourselves on providing personalized service that exceeds 
                expectations and creates unforgettable experiences.
              </p>
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Mission</h3>
                <p className="text-gray-700">
                  To provide exceptional venues and services that transform ordinary gatherings into extraordinary memories.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-200 to-blue-200 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <h3 className="text-2xl font-semibold mb-2">Venue Image</h3>
                <p>Beautiful convention center interior</p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">World-Class Amenities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {amenities.map((amenity, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full">
                        <amenity.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-gray-800">{amenity.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{amenity.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">2000+</div>
                <div className="text-purple-200">Events Hosted</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50,000</div>
                <div className="text-purple-200">Happy Guests</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">23</div>
                <div className="text-purple-200">Years of Excellence</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4.9★</div>
                <div className="text-purple-200">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
