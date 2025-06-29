
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'wedding', name: 'Weddings' },
    { id: 'corporate', name: 'Corporate' },
    { id: 'conference', name: 'Conferences' },
    { id: 'social', name: 'Social Events' }
  ];

  const images = [
    { id: 1, category: 'wedding', title: 'Elegant Wedding Reception', description: 'Beautiful ballroom setup for 300 guests' },
    { id: 2, category: 'corporate', title: 'Corporate Gala', description: 'Annual company celebration' },
    { id: 3, category: 'conference', title: 'Tech Conference 2023', description: '500+ attendees, main auditorium' },
    { id: 4, category: 'wedding', title: 'Garden Wedding', description: 'Outdoor ceremony space' },
    { id: 5, category: 'social', title: 'Charity Fundraiser', description: 'Community event in main hall' },
    { id: 6, category: 'corporate', title: 'Product Launch', description: 'Modern setup with AV equipment' },
    { id: 7, category: 'conference', title: 'Medical Symposium', description: 'Professional conference setup' },
    { id: 8, category: 'social', title: 'Birthday Celebration', description: 'Private party in cocktail lounge' },
    { id: 9, category: 'wedding', title: 'Intimate Wedding', description: 'Small ceremony in chapel' }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Event Gallery</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Discover the magic of past events and envision your perfect celebration
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
                  : "hover:bg-purple-50"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Image Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="aspect-video bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="text-lg font-semibold mb-2">{image.title}</div>
                    <div className="text-sm">{image.description}</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{image.title}</h3>
                  <p className="text-gray-600">{image.description}</p>
                  <div className="mt-4">
                    <span className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {image.category}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
