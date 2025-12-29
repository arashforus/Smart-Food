import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Utensils, Clock, MapPin, Star, Award, Coffee, Pizza, ChefHat, Heart, Users, Calendar, Instagram, Facebook, Twitter } from "lucide-react";
import { mockRestaurant, mockMenuItems } from "@/lib/mockData";

export default function LandingPage() {
  const signatureDishes = mockMenuItems.filter(item => item.suggested).slice(0, 3);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { title: "Our Story", id: "story" },
    { title: "Menu", id: "menu" },
    { title: "Chef", id: "chef" },
    { title: "Why Us", id: "why-us" },
    { title: "Meet Us", id: "meet-us" },
    { title: "Visit Us", id: "visit-us" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Split Layout */}
      <section className="relative h-screen flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side - Image */}
        <div className="lg:w-1/2 relative h-[40vh] lg:h-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1550966842-2849a2830a28?w=1600&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>

        {/* Right Side - Content & Nav */}
        <div className="lg:w-1/2 flex flex-col bg-card relative">
          {/* Header/Nav Overlay */}
          <header className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Utensils className="text-primary-foreground w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tighter uppercase">{mockRestaurant.name}</span>
            </div>
            
            <nav className="hidden xl:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest"
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </header>

          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12 lg:py-0">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight">
                Authentic <br />
                <span className="text-primary italic">Fine Dining</span> <br />
                Experience
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-xl font-light leading-relaxed">
                Experience the art of Mediterranean cuisine crafted with passion and served with elegance in the heart of the city.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="text-lg px-8 h-14 rounded-full">
                  <Link href="/menu">Explore Menu</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-full" onClick={() => scrollToSection('visit-us')}>
                  Book A Table
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Bottom Socials */}
          <div className="p-8 flex items-center gap-6 text-muted-foreground">
            <Facebook className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
            <Twitter className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
            <div className="h-[1px] w-12 bg-border ml-2" />
            <span className="text-xs uppercase tracking-[0.3em]">Follow Our Journey</span>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="story" className="py-32 overflow-hidden bg-background">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80" alt="Kitchen" className="rounded-2xl" />
                  <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" alt="Plating" className="rounded-2xl mt-8" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-2xl border-4 border-background">
                  <span className="font-bold text-center leading-tight">ESTD <br /> 1998</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-sm uppercase tracking-[0.4em] text-primary font-bold mb-4">The Heritage</h2>
              <h3 className="text-5xl font-bold mb-8 leading-tight">A Legacy of Culinary Excellence</h3>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Our story began over two decades ago with a single goal: to share the vibrant, honest flavors of the Mediterranean with our community. Every dish we serve is a chapter of our family's history, crafted with time-honored techniques and modern innovation.
              </p>
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div>
                  <h5 className="text-4xl font-bold mb-2">25+</h5>
                  <p className="text-sm uppercase tracking-widest text-muted-foreground">Years of Passion</p>
                </div>
                <div>
                  <h5 className="text-4xl font-bold mb-2">120k</h5>
                  <p className="text-sm uppercase tracking-widest text-muted-foreground">Happy Guests</p>
                </div>
              </div>
              <Button size="lg" variant="outline" className="rounded-full px-10">Read Full Story</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Highlight Section */}
      <section id="menu" className="py-32 bg-card/50">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-sm uppercase tracking-[0.4em] text-primary font-bold mb-4">Seasonal Selections</h2>
          <h3 className="text-5xl font-bold mb-16">Taste the Season</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {signatureDishes.map((item) => (
              <div key={item.id} className="bg-background p-8 rounded-3xl border hover-elevate group cursor-pointer">
                <div className="mb-6 relative h-48 rounded-2xl overflow-hidden">
                  <img 
                    src={item.id === '1' ? 'https://images.unsplash.com/photo-1572656631137-7935297eff55?w=600&q=80' : 
                         item.id === '4' ? 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=600&q=80' : 
                         'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80'} 
                    alt={item.name.en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h4 className="text-2xl font-bold mb-2">{item.name.en}</h4>
                <p className="text-muted-foreground mb-6">{item.shortDescription.en}</p>
                <div className="text-xl font-bold text-primary">${item.price}</div>
              </div>
            ))}
          </div>
          
          <Button size="lg" asChild className="rounded-full px-12 h-14">
            <Link href="/menu">View Full Menu</Link>
          </Button>
        </div>
      </section>

      {/* Chef Section */}
      <section id="chef" className="py-32">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
            <div className="lg:w-1/2 relative">
              <img src="https://images.unsplash.com/photo-1583394828560-19804e79f202?w=800&q=80" alt="Chef at work" className="rounded-[40px] shadow-2xl" />
              <div className="absolute -bottom-10 -left-10 bg-primary p-10 rounded-3xl text-primary-foreground">
                <ChefHat className="w-12 h-12 mb-4" />
                <h4 className="text-xl font-bold italic">"Food is an expression <br /> of pure soul."</h4>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-sm uppercase tracking-[0.4em] text-primary font-bold mb-4">The Visionary</h2>
              <h3 className="text-5xl font-bold mb-8 leading-tight">Chef Alessandro Rossi</h3>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                With three Michelin stars and a lifelong obsession with coastal flavors, Chef Alessandro brings a world-class perspective to every plate. His philosophy is rooted in "simplicity through complexity" — letting the natural beauty of seasonal produce shine through masterful technique.
              </p>
              <div className="flex items-center gap-10">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" alt="Alessandro Signature" className="w-32 opacity-80" />
                <div>
                  <p className="font-bold text-xl uppercase tracking-widest">Alessandro Rossi</p>
                  <p className="text-primary font-medium uppercase tracking-widest text-xs">Executive Chef</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-32 bg-primary text-primary-foreground overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm uppercase tracking-[0.4em] opacity-80 font-bold mb-4">The Difference</h2>
            <h3 className="text-5xl font-bold">Why Dine With Us?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform">
                <Heart className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold mb-4">Sourced With Love</h4>
              <p className="opacity-80">90% of our ingredients come from local organic farms within a 50-mile radius.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-8 -rotate-3 hover:rotate-0 transition-transform">
                <Users className="text-white w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold mb-4">Exceptional Service</h4>
              <p className="opacity-80">Our team is dedicated to creating a warm, personalized dining experience for every guest.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-8 rotate-6 hover:rotate-0 transition-transform">
                <Award className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold mb-4">Global Recognition</h4>
              <p className="opacity-80">Proudly holding accolades for our wine list and innovative approach to traditional recipes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Us Section */}
      <section id="meet-us" className="py-32">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-sm uppercase tracking-[0.4em] text-primary font-bold mb-4">The Atmosphere</h2>
              <h3 className="text-5xl font-bold mb-8 leading-tight">A Space Designed for Connection</h3>
              <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                Whether it's an intimate date, a business gathering, or a family celebration, our restaurant offers diverse settings from the lively bar area to the tranquil garden terrace.
              </p>
              <div className="space-y-6">
                {['Private Dining Rooms', 'Cocktail Bar & Lounge', 'Outdoor Garden Terrace', 'Open Kitchen Experience'].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xl font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80" alt="Dining Room" className="rounded-3xl" />
              <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80" alt="Bar" className="rounded-3xl mt-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section id="visit-us" className="py-32 bg-card">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="bg-background p-12 rounded-3xl border text-center">
              <MapPin className="w-10 h-10 text-primary mx-auto mb-6" />
              <h4 className="text-2xl font-bold mb-4">Location</h4>
              <p className="text-muted-foreground">{mockRestaurant.address}</p>
              <Button variant="link" className="mt-4 text-primary font-bold">GET DIRECTIONS</Button>
            </div>
            
            <div className="bg-background p-12 rounded-3xl border text-center">
              <Clock className="w-10 h-10 text-primary mx-auto mb-6" />
              <h4 className="text-2xl font-bold mb-4">Working Hours</h4>
              <p className="text-muted-foreground whitespace-pre-line">{mockRestaurant.hours.replace(/\|/g, '\n')}</p>
            </div>

            <div className="bg-background p-12 rounded-3xl border text-center">
              <Calendar className="w-10 h-10 text-primary mx-auto mb-6" />
              <h4 className="text-2xl font-bold mb-4">Reservations</h4>
              <p className="text-muted-foreground mb-4">Call us or book online for guaranteed seating.</p>
              <p className="text-2xl font-bold text-primary mb-6">{mockRestaurant.phone}</p>
              <Button size="lg" className="rounded-full w-full">Book Now</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-20 border-t bg-background">
        <div className="container px-4 mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Utensils className="text-primary-foreground w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase">{mockRestaurant.name}</span>
          </div>
          <div className="flex justify-center gap-10 mb-10">
            {navItems.map(item => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-xs uppercase tracking-[0.3em] font-bold hover:text-primary transition-colors">
                {item.title}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-[0.5em]">© 2025 {mockRestaurant.name}. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
