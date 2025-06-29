import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, Utensils, Wifi, Car, Music } from 'lucide-react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    {
      url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1920&q=80",
      title: "Elegant Wedding Receptions",
      description: "Create unforgettable moments in our stunning ballroom"
    },
    {
      url: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1920&q=80",
      title: "Corporate Events & Conferences",
      description: "Professional venues for business gatherings"
    },
    {
      url: "https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&w=1920&q=80",
      title: "Special Celebrations",
      description: "From birthdays to anniversaries, we make it special"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const amenities = [
    { icon: Calendar, title: "Flexible Booking", description: "Easy scheduling for your perfect date" },
    { icon: Users, title: "Large Capacity", description: "Accommodate up to 500 guests" },
    { icon: Utensils, title: "Catering Services", description: "Delicious meals by professional chefs" },
    { icon: Wifi, title: "Free Wi-Fi", description: "High-speed internet throughout the venue" },
    { icon: Car, title: "Valet Parking", description: "Convenient parking for all guests" },
    { icon: Music, title: "Audio/Visual", description: "State-of-the-art sound and lighting systems" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Image Slider */}
      <section className="relative h-[60vh] sm:h-[80vh] md:h-screen overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${image.url})` }}
            />
            <div className="absolute inset-0 bg-black/50 sm:bg-black/40" />
            <div className="relative h-full flex items-center justify-center text-center text-white px-4 sm:px-6">
              <div className="max-w-3xl sm:max-w-4xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                  {image.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-200">
                  {image.description}
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
                    <Link to="/booking">Book Your Event</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-gray-800 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
                    <Link to="/gallery">View Gallery</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-gray-800">
            Welcome to Delight Convention Center
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed">
            Where every event becomes an unforgettable experience. Our world-class facilities and 
            dedicated team ensure your special occasions are perfectly executed.
          </p>
          
          {/* Amenities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
            {amenities.map((amenity, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 sm:p-8 text-center">
                  <amenity.icon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-purple-600" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800">{amenity.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{amenity.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Plan Your Event?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-purple-100">
            Let us help you create memories that will last a lifetime
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg" variant="secondary" className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
              <Link to="/booking">Start Booking</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;