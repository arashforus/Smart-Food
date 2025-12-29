import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Utensils, Clock, MapPin, Star, ChevronRight, Award, Coffee, Pizza } from "lucide-react";
import { mockRestaurant, mockMenuItems } from "@/lib/mockData";

export default function LandingPage() {
  const signatureDishes = mockMenuItems.filter(item => item.suggested).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>
        
        <div className="container relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              {mockRestaurant.name}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              {mockRestaurant.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 h-12">
                <Link href="/menu">View Menu</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 h-12 bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm">
                <Link href="/qr">Find Location</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm uppercase tracking-widest">Scroll to explore</span>
            <div className="w-[1px] h-12 bg-white/30" />
          </div>
        </motion.div>
      </section>

      {/* Signature Dishes */}
      <section className="py-24 bg-card/50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-bold mb-4">Chef's Recommendations</h2>
            <h3 className="text-4xl font-bold">Signature Dishes</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {signatureDishes.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-xl bg-background border hover-elevate"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.id === '1' ? 'https://images.unsplash.com/photo-1572656631137-7935297eff55?w=600&q=80' : 
                         item.id === '4' ? 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=600&q=80' : 
                         'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80'} 
                    alt={item.name.en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2">{item.name.en}</h4>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {item.shortDescription.en}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">${item.price}</span>
                    <Button variant="ghost" size="sm" className="group/btn">
                      Order Now <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80" 
                  alt="Restaurant Interior"
                  className="rounded-2xl shadow-2xl relative z-10"
                />
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary rounded-2xl -z-0 opacity-20" />
                <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-primary rounded-2xl -z-0" />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-bold mb-4">Our Story</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Crafting Culinary Memories Since 1998</h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Nestled in the heart of the city, {mockRestaurant.name} has been a cornerstone of fine dining for over two decades. 
                Our journey began with a simple philosophy: use the freshest ingredients to create authentic dishes that celebrate the rich heritage of Mediterranean flavors.
              </p>
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Award className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold mb-1">Award Winning</h5>
                    <p className="text-sm text-muted-foreground">Voted best restaurant 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Utensils className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold mb-1">Fresh Ingredients</h5>
                    <p className="text-sm text-muted-foreground">Sourced from local farms</p>
                  </div>
                </div>
              </div>
              <Button size="lg" variant="outline" className="px-8">Learn More About Us</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Grid */}
      <section className="py-24 border-t">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Clock className="text-primary w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-4">Opening Hours</h4>
              <p className="text-muted-foreground whitespace-pre-line">
                {mockRestaurant.hours.replace(/\|/g, '\n')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <MapPin className="text-primary w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-4">Our Location</h4>
              <p className="text-muted-foreground">
                {mockRestaurant.address}
              </p>
              <Button variant="ghost" className="mt-2 text-primary">Get Directions</Button>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Star className="text-primary w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-4">Reservations</h4>
              <p className="text-muted-foreground mb-4">
                Planning a special evening? Book your table in advance.
              </p>
              <p className="font-bold text-lg">{mockRestaurant.phone}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to experience true flavor?</h2>
          <Button size="lg" variant="secondary" asChild className="text-lg px-12 h-14 rounded-full">
            <Link href="/menu">Browse Our Menu</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
