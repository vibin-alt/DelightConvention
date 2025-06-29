
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CheckCircle, XCircle, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Booking = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: ''
  });
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [alternativeDates, setAlternativeDates] = useState<Date[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();

  const eventTypes = [
    'Wedding Reception',
    'Corporate Meeting',
    'Conference',
    'Birthday Party',
    'Anniversary Celebration',
    'Product Launch',
    'Charity Event',
    'Other'
  ];

  // Fetch booked dates from Supabase
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const { data, error } = await supabase
          .from('booked_dates')
          .select('date');

        if (error) {
          console.error('Error fetching booked dates:', error);
          return;
        }

        const dates = data?.map(item => new Date(item.date)) || [];
        setBookedDates(dates);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchBookedDates();
  }, []);

  const checkDateAvailability = (dates: Date[]) => {
    if (dates.length === 0) return true;
    
    const conflictingDates = dates.filter(date => 
      bookedDates.some(bookedDate => 
        bookedDate.toDateString() === date.toDateString()
      )
    );
    
    if (conflictingDates.length > 0) {
      generateAlternativeDates(dates[0]);
      return false;
    } else {
      setAlternativeDates([]);
      return true;
    }
  };

  const generateAlternativeDates = (requestedDate: Date) => {
    const alternatives: Date[] = [];
    let currentDate = new Date(requestedDate);
    
    while (alternatives.length < 5) {
      currentDate.setDate(currentDate.getDate() + 1);
      const isBooked = bookedDates.some(bookedDate => 
        bookedDate.toDateString() === currentDate.toDateString()
      );
      
      if (!isBooked && currentDate > new Date()) {
        alternatives.push(new Date(currentDate));
      }
    }
    
    setAlternativeDates(alternatives);
  };

  const addDate = (date: Date | undefined) => {
    if (date && !selectedDates.some(d => d.toDateString() === date.toDateString())) {
      const newSelectedDates = [...selectedDates, date];
      setSelectedDates(newSelectedDates);
      checkDateAvailability(newSelectedDates);
      setIsCalendarOpen(false);
    }
  };

  const removeDate = (dateToRemove: Date) => {
    const newSelectedDates = selectedDates.filter(date => 
      date.toDateString() !== dateToRemove.toDateString()
    );
    setSelectedDates(newSelectedDates);
    if (newSelectedDates.length > 0) {
      checkDateAvailability(newSelectedDates);
    } else {
      setAlternativeDates([]);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDates.length === 0) {
      toast({
        title: "Please select at least one date",
        description: "Choose your preferred dates for the event.",
        variant: "destructive",
      });
      return;
    }

    if (!checkDateAvailability(selectedDates)) {
      toast({
        title: "Date conflict detected",
        description: "Some of your selected dates are already booked. Please choose different dates.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.name || !formData.email || !formData.phone || !formData.eventType) {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to complete your booking.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Insert booking into Supabase
      const { error } = await supabase
        .from('bookings')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          event_type: formData.eventType,
          preferred_dates: selectedDates.map(date => date.toISOString().split('T')[0])
        });

      if (error) {
        console.error('Booking error:', error);
        toast({
          title: "Booking Failed",
          description: "There was an error submitting your booking. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitted(true);
      toast({
        title: "Booking Submitted!",
        description: `Your booking request has been submitted successfully.`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error submitting your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Booking Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Thank you, {formData.name}! Your {formData.eventType.toLowerCase()} booking request has been submitted.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              We'll send a confirmation email to {formData.email} shortly with next steps.
            </p>
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setSelectedDates([]);
                setFormData({ name: '', email: '', phone: '', eventType: '' });
                setAlternativeDates([]);
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Book Another Event
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasDateConflicts = selectedDates.length > 0 && !checkDateAvailability(selectedDates);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Book Your Event</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Reserve your perfect dates and let us make your event unforgettable
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-2"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-2"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-2"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <Label>Event Type *</Label>
                  <Select value={formData.eventType} onValueChange={(value) => handleInputChange('eventType', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Date Selection */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Select Your Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Add Preferred Dates *</Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-2"
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <Plus className="mr-2 h-4 w-4" />
                        Add a date
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={undefined}
                        onSelect={addDate}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today || bookedDates.some(bookedDate => 
                            bookedDate.toDateString() === date.toDateString()
                          );
                        }}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Selected Dates */}
                {selectedDates.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Dates:</Label>
                    <div className="space-y-2">
                      {selectedDates.map((date, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="font-medium">{format(date, "PPP")}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDate(date)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date Status */}
                {selectedDates.length > 0 && (
                  <div className="space-y-4">
                    {!hasDateConflicts ? (
                      <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Great! All selected dates are available.</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                          <XCircle className="h-5 w-5" />
                          <span className="font-medium">Some selected dates are already booked.</span>
                        </div>
                        
                        {alternativeDates.length > 0 && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-3">Here are alternative available dates:</h4>
                            <div className="space-y-2">
                              {alternativeDates.map((date, index) => (
                                <Button
                                  key={index}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addDate(date)}
                                  className="mr-2 mb-2 border-blue-200 hover:bg-blue-100"
                                >
                                  {format(date, "MMM d, yyyy")}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6"
                  disabled={selectedDates.length === 0 || hasDateConflicts || isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Booking Request'}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Booking;
