import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Save, X, LogOut, FileText, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  preferred_dates: string[];
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  category: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editingBooking, setEditingBooking] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<number | null>(null);
  const [newImage, setNewImage] = useState({ title: '', description: '', category: '' });
  const [showAddImage, setShowAddImage] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminBooking, setShowAdminBooking] = useState(false);
  const [adminBookingForm, setAdminBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    event_type: '',
    preferred_dates: [],
    event_date: '',
    venue_cost: '',
    additional_services: '',
    total_amount: ''
  });

  // Mock gallery data (you can extend this to use Supabase later)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    { id: 1, title: 'Elegant Wedding Reception', description: 'Beautiful ballroom setup for 300 guests', category: 'wedding' },
    { id: 2, title: 'Corporate Gala', description: 'Annual company celebration', category: 'corporate' },
    { id: 3, title: 'Tech Conference 2023', description: '500+ attendees, main auditorium', category: 'conference' },
    { id: 4, title: 'Garden Wedding', description: 'Outdoor ceremony space', category: 'wedding' },
    { id: 5, title: 'Charity Fundraiser', description: 'Community event in main hall', category: 'social' }
  ]);

  // Check if user is authenticated
  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      navigate('/admin-login');
      return;
    }
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load bookings",
          variant: "destructive",
        });
        return;
      }

      const typedBookings: Booking[] = (data || []).map(booking => ({
        ...booking,
        status: booking.status as 'confirmed' | 'pending' | 'cancelled'
      }));

      setBookings(typedBookings);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin-login');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const updateBookingStatus = async (id: string, status: 'confirmed' | 'pending' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating booking:', error);
        toast({
          title: "Error",
          description: "Failed to update booking status",
          variant: "destructive",
        });
        return;
      }

      setBookings(prev => prev.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      ));
      
      toast({
        title: "Booking Updated",
        description: `Booking status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting booking:', error);
        toast({
          title: "Error",
          description: "Failed to delete booking",
          variant: "destructive",
        });
        return;
      }

      setBookings(prev => prev.filter(booking => booking.id !== id));
      toast({
        title: "Booking Deleted",
        description: "The booking has been removed from the system",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const saveBookingEdit = async (id: string, updatedData: Partial<Booking>) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ ...updatedData, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating booking:', error);
        toast({
          title: "Error",
          description: "Failed to save changes",
          variant: "destructive",
        });
        return;
      }

      setBookings(prev => prev.map(booking => 
        booking.id === id ? { ...booking, ...updatedData } : booking
      ));
      
      setEditingBooking(null);
      toast({
        title: "Booking Updated",
        description: "Changes have been saved successfully",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createAdminBooking = async () => {
    if (!adminBookingForm.name || !adminBookingForm.email || !adminBookingForm.phone || 
        !adminBookingForm.event_type || !adminBookingForm.event_date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          name: adminBookingForm.name,
          email: adminBookingForm.email,
          phone: adminBookingForm.phone,
          event_type: adminBookingForm.event_type,
          preferred_dates: [adminBookingForm.event_date],
          status: 'confirmed'
        });

      if (error) {
        console.error('Error creating admin booking:', error);
        toast({
          title: "Error",
          description: "Failed to create booking",
          variant: "destructive",
        });
        return;
      }

      await supabase
        .from('booked_dates')
        .insert({
          date: adminBookingForm.event_date,
          event_name: `${adminBookingForm.event_type} - ${adminBookingForm.name}`
        });

      setAdminBookingForm({
        name: '', email: '', phone: '', event_type: '', preferred_dates: [],
        event_date: '', venue_cost: '', additional_services: '', total_amount: ''
      });
      setShowAdminBooking(false);
      fetchBookings();
      
      toast({
        title: "Booking Created",
        description: "Admin booking has been created successfully",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const generateQuotation = (booking: Booking) => {
    const quotationData = {
      bookingId: booking.id,
      customerName: booking.name,
      eventType: booking.event_type,
      dates: booking.preferred_dates,
      venueCost: 5000,
      additionalServices: 1500,
      totalAmount: 6500
    };

    const quotationContent = `
DELIGHT CONVENTION CENTER
QUOTATION

Customer: ${quotationData.customerName}
Event Type: ${quotationData.eventType}
Event Dates: ${quotationData.dates.join(', ')}

Venue Rental: $${quotationData.venueCost}
Additional Services: $${quotationData.additionalServices}
Total Amount: $${quotationData.totalAmount}

Valid for 30 days from date of issue.
    `;

    const blob = new Blob([quotationContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quotation-${booking.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Quotation Generated",
      description: "Quotation has been downloaded successfully",
    });
  };

 const generateInvoice = (booking: Booking) => {
  const invoiceData = {
    invoiceNumber: `INV-${booking.id.slice(0, 8)}`,
    bookingId: booking.id,
    customerName: booking.name,
    eventType: booking.event_type,
    dates: booking.preferred_dates,
    venueCost: 5000,
    additionalServices: 1500,
    totalAmount: 6500
  };

  const invoiceContent = `
DELIGHT CONVENTION CENTER
INVOICE

Invoice #: ${invoiceData.invoiceNumber}
Customer: ${invoiceData.customerName}
Event Type: ${invoiceData.eventType}
Event Dates: ${invoiceData.dates.join(', ')}

Venue Rental: $${invoiceData.venueCost}
Additional Services: $${invoiceData.additionalServices}
Total Amount: $${invoiceData.totalAmount}

Payment due within 30 days.
    `;

  const blob = new Blob([invoiceContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${invoiceData.invoiceNumber}.txt`;
  a.click();
  URL.revokeObjectURL(url);

  toast({
    title: "Invoice Generated",
    description: "Invoice has been downloaded successfully",
  });
};

  const addGalleryItem = () => {
    if (!newImage.title || !newImage.description || !newImage.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newItem: GalleryItem = {
      id: Math.max(...galleryItems.map(item => item.id)) + 1,
      ...newImage
    };

    setGalleryItems(prev => [...prev, newItem]);
    setNewImage({ title: '', description: '', category: '' });
    setShowAddImage(false);
    toast({
      title: "Image Added",
      description: "New gallery item has been added successfully",
    });
  };

  const updateGalleryItem = (id: number, updatedData: Partial<GalleryItem>) => {
    setGalleryItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updatedData } : item
    ));
    setEditingImage(null);
    toast({
      title: "Gallery Updated",
      description: "Changes have been saved successfully",
    });
  };

  const deleteGalleryItem = (id: number) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Image Deleted",
      description: "The gallery item has been removed",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-600 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(booking => {
    const eventDates = booking.preferred_dates.map(date => new Date(date));
    const today = new Date();
    return eventDates.some(date => date >= today) && booking.status === 'confirmed';
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Admin Dashboard</h1>
              <p className="text-base sm:text-lg md:text-xl text-purple-100">
                Manage bookings, create events, and generate documents
              </p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-purple-600 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </section>

      {/* Admin Content */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="bookings" className="space-y-6 sm:space-y-8">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <TabsTrigger value="bookings" className="text-xs sm:text-sm">Manage Bookings ({bookings.length})</TabsTrigger>
              <TabsTrigger value="upcoming" className="text-xs sm:text-sm">Upcoming Events ({upcomingBookings.length})</TabsTrigger>
              <TabsTrigger value="admin-booking" className="text-xs sm:text-sm">Create Booking</TabsTrigger>
              <TabsTrigger value="gallery" className="text-xs sm:text-sm">Manage Gallery</TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">All Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 sm:space-y-6">
                    {bookings.length === 0 ? (
                      <p className="text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">No bookings found</p>
                    ) : (
                      bookings.map((booking) => (
                        <Card key={booking.id} className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4 sm:p-6">
                            {editingBooking === booking.id ? (
                              <EditBookingForm
                                booking={booking}
                                onSave={(data) => saveBookingEdit(booking.id, data)}
                                onCancel={() => setEditingBooking(null)}
                              />
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                                <div>
                                  <h3 className="font-semibold text-base sm:text-lg">{booking.name}</h3>
                                  <p className="text-gray-600 text-sm sm:text-base">{booking.email}</p>
                                  <p className="text-gray-600 text-sm sm:text-base">{booking.phone}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-sm sm:text-base">{booking.event_type}</p>
                                  <p className="text-gray-600 text-sm sm:text-base">
                                    Dates: {booking.preferred_dates.join(', ')}
                                  </p>
                                  <Badge 
                                    variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'secondary' : 'destructive'}
                                    className="mt-1 text-xs sm:text-sm"
                                  >
                                    {booking.status}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingBooking(booking.id)}
                                    className="text-xs sm:text-sm"
                                  >
                                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                    disabled={booking.status === 'confirmed'}
                                    className="text-xs sm:text-sm"
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => generateQuotation(booking)}
                                    className="text-xs sm:text-sm"
                                  >
                                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                    Quote
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => generateInvoice(booking)}
                                    className="text-xs sm:text-sm"
                                  >
                                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                    Invoice
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => deleteBooking(booking.id)}
                                    className="text-xs sm:text-sm"
                                  >
                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Upcoming Events Tab */}
            <TabsContent value="upcoming" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 sm:space-y-6">
                    {upcomingBookings.length === 0 ? (
                      <p className="text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">No upcoming events</p>
                    ) : (
                      upcomingBookings.map((booking) => (
                        <Card key={booking.id} className="border-l-4 border-l-green-500">
                          <CardContent className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                              <div>
                                <h3 className="font-semibold text-base sm:text-lg">{booking.name}</h3>
                                <p className="text-gray-600 text-sm sm:text-base">{booking.event_type}</p>
                              </div>
                              <div>
                                <p className="font-medium text-green-600 text-sm sm:text-base">
                                  <Calendar className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                  {booking.preferred_dates.join(', ')}
                                </p>
                                <p className="text-gray-600 text-sm sm:text-base">{booking.email}</p>
                                <p className="text-gray-600 text-sm sm:text-base">{booking.phone}</p>
                              </div>
                              <div>
                                <Badge variant="default" className="bg-green-500 text-xs sm:text-sm">
                                  Confirmed
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admin Booking Tab */}
            <TabsContent value="admin-booking" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">Create New Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm sm:text-base">Customer Name *</Label>
                        <Input
                          value={adminBookingForm.name}
                          onChange={(e) => setAdminBookingForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter customer name"
                          className="text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <Label className="text-sm sm:text-base">Email *</Label>
                        <Input
                          type="email"
                          value={adminBookingForm.email}
                          onChange={(e) => setAdminBookingForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="customer@email.com"
                          className="text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <Label className="text-sm sm:text-base">Phone *</Label>
                        <Input
                          value={adminBookingForm.phone}
                          onChange={(e) => setAdminBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="(555) 123-4567"
                          className="text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm sm:text-base">Event Type *</Label>
                        <Input
                          value={adminBookingForm.event_type}
                          onChange={(e) => setAdminBookingForm(prev => ({ ...prev, event_type: e.target.value }))}
                          placeholder="Wedding, Corporate Event, etc."
                          className="text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <Label className="text-sm sm:text-base">Event Date *</Label>
                        <Input
                          type="date"
                          value={adminBookingForm.event_date}
                          onChange={(e) => setAdminBookingForm(prev => ({ ...prev, event_date: e.target.value }))}
                          className="text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <Label className="text-sm sm:text-base">Venue Cost</Label>
                        <Input
                          type="number"
                          value={adminBookingForm.venue_cost}
                          onChange={(e) => setAdminBookingForm(prev => ({ ...prev, venue_cost: e.target.value }))}
                          placeholder="5000"
                          className="text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <Button onClick={createAdminBooking} className="w-full text-sm sm:text-base py-3 sm:py-4">
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Create Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                    <CardTitle className="text-xl sm:text-2xl">Gallery Management</CardTitle>
                    <Button
                      onClick={() => setShowAddImage(true)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Add Image
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showAddImage && (
                    <Card className="mb-4 sm:mb-6 border-dashed border-2">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Add New Gallery Item</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div>
                            <Label className="text-sm sm:text-base">Title</Label>
                            <Input
                              value={newImage.title}
                              onChange={(e) => setNewImage(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Event title"
                              className="text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <Label className="text-sm sm:text-base">Description</Label>
                            <Input
                              value={newImage.description}
                              onChange={(e) => setNewImage(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Event description"
                              className="text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <Label className="text-sm sm:text-base">Category</Label>
                            <Input
                              value={newImage.category}
                              onChange={(e) => setNewImage(prev => ({ ...prev, category: e.target.value }))}
                              placeholder="wedding, corporate, etc."
                              className="text-sm sm:text-base"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={addGalleryItem} className="text-sm sm:text-base">
                            <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Add Item
                          </Button>
                          <Button variant="outline" onClick={() => setShowAddImage(false)} className="text-sm sm:text-base">
                            <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-4 sm:space-y-6">
                    {galleryItems.map((item) => (
                      <Card key={item.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4 sm:p-6">
                          {editingImage === item.id ? (
                            <EditGalleryForm
                              item={item}
                              onSave={(data) => updateGalleryItem(item.id, data)}
                              onCancel={() => setEditingImage(null)}
                            />
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                              <div>
                                <h3 className="font-semibold text-base sm:text-lg">{item.title}</h3>
                                <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
                              </div>
                              <div>
                                <Badge variant="outline" className="capitalize text-xs sm:text-sm">
                                  {item.category}
                                </Badge>
                              </div>
                              <div className="flex gap-2 mt-3 md:mt-0">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingImage(item.id)}
                                  className="text-xs sm:text-sm"
                                >
                                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteGalleryItem(item.id)}
                                  className="text-xs sm:text-sm"
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

// Edit Booking Form Component
const EditBookingForm = ({ booking, onSave, onCancel }: {
  booking: Booking;
  onSave: (data: Partial<Booking>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    event_type: booking.event_type,
    preferred_dates: booking.preferred_dates.join(', ')
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <Label className="text-sm sm:text-base">Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="text-sm sm:text-base"
          />
        </div>
        <div>
          <Label className="text-sm sm:text-base">Email</Label>
          <Input
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="text-sm sm:text-base"
          />
        </div>
        <div>
          <Label className="text-sm sm:text-base">Phone</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="text-sm sm:text-base"
          />
        </div>
        <div>
          <Label className="text-sm sm:text-base">Event Type</Label>
          <Input
            value={formData.event_type}
            onChange={(e) => setFormData(prev => ({ ...prev, event_type: e.target.value }))}
            className="text-sm sm:text-base"
          />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-sm sm:text-base">Preferred Dates (comma-separated)</Label>
          <Input
            value={formData.preferred_dates}
            onChange={(e) => setFormData(prev => ({ ...prev, preferred_dates: e.target.value }))}
            placeholder="2025-01-15, 2025-01-16"
            className="text-sm sm:text-base"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave({
          ...formData,
          preferred_dates: formData.preferred_dates.split(',').map(d => d.trim())
        })} className="text-sm sm:text-base">
          <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel} className="text-sm sm:text-base">
          <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

// Edit Gallery Form Component
const EditGalleryForm = ({ item, onSave, onCancel }: {
  item: GalleryItem;
  onSave: (data: Partial<GalleryItem>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: item.title,
    description: item.description,
    category: item.category
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <Label className="text-sm sm:text-base">Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="text-sm sm:text-base"
          />
        </div>
        <div>
          <Label className="text-sm sm:text-base">Description</Label>
          <Input
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="text-sm sm:text-base"
          />
        </div>
        <div>
          <Label className="text-sm sm:text-base">Category</Label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="text-sm sm:text-base"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onSave(formData)} className="text-sm sm:text-base">
          <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel} className="text-sm sm:text-base">
          <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Admin;