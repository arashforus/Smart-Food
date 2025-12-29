import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Utensils, Clock, MapPin, Star, Award, Coffee, Pizza, ChefHat, Heart, Users, Calendar, Instagram, Facebook, Twitter } from "lucide-react";
import { mockRestaurant, mockMenuItems } from "@/lib/mockData";
import persianFoodHero from "@assets/Gemini_Generated_Image_b29a2b29a2b29a2b_(1)_1766976174528.png";
import japanesePattern from "@assets/japanese_pattern_1766977216734.png";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const signatureDishes = mockMenuItems.filter(item => item.suggested).slice(0, 3);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="min-h-screen bg-white selection:bg-[#00A5B5]/30">
      {/* Sticky Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: isScrolled ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-[#00A5B5]/10 shadow-sm px-8 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#00A5B5] rounded flex items-center justify-center">
            <Utensils className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tighter uppercase text-[#00A5B5]">{mockRestaurant.name}</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-xs font-bold text-[#00A5B5]/70 hover:text-[#00A5B5] transition-colors uppercase tracking-widest"
            >
              {item.title}
            </button>
          ))}
          <Button size="sm" asChild className="rounded-full bg-[#00A5B5] hover:bg-[#007A87] text-white">
            <Link href="/menu">Menu</Link>
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section - Split Layout */}
      <section className="relative h-screen flex flex-col lg:flex-row overflow-hidden border-b-8 border-[#00A5B5]">
        {/* Left Side - Image with Geometric Pattern Overlay */}
        <div className="lg:w-1/2 relative h-[40vh] lg:h-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${persianFoodHero})`,
            }}
          >
            <div className="absolute inset-0 bg-[#00A5B5]/20 mix-blend-multiply" />
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
          </div>
        </div>

        {/* Right Side - Content & Nav */}
        <div className="lg:w-1/2 flex flex-col bg-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,_#00A5B51a,_transparent)] pointer-events-none" />
          
          <header className="p-8 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00A5B5] rounded-lg flex items-center justify-center shadow-lg shadow-[#00A5B5]/20">
                <Utensils className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tighter uppercase text-[#00A5B5]">{mockRestaurant.name}</span>
            </div>
            
            <nav className="hidden xl:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-semibold text-[#00A5B5]/70 hover:text-[#00A5B5] transition-colors uppercase tracking-widest relative group"
                >
                  {item.title}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00A5B5] transition-all group-hover:w-full" />
                </button>
              ))}
            </nav>
          </header>

          <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12 lg:py-0 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="text-lg px-10 h-14 rounded-full bg-[#00A5B5] hover:bg-[#007A87] text-white shadow-xl shadow-[#00A5B5]/20">
                  <Link href="/menu">Explore Menu</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-10 h-14 rounded-full border-[#00A5B5]/20 text-[#00A5B5] hover:bg-[#00A5B5]/5" onClick={() => scrollToSection('visit-us')}>
                  Book A Table
                </Button>
              </div>
            </motion.div>
          </div>

          
        </div>
      </section>

      {/* Our Story Section - Pattern Background */}
      <section id="story" className="py-32 overflow-hidden bg-white relative">
        <div 
          className="absolute inset-y-0 right-0 w-1/2 opacity-10 pointer-events-none mix-blend-multiply" 
          style={{ 
            backgroundImage: `url(${japanesePattern})`,
            backgroundSize: '300px',
            backgroundColor: '#00A5B5'
          }} 
        />
        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <div className="relative p-4 border-2 border-[#00A5B5]/10 rounded-3xl">
                <div className="grid grid-cols-2 gap-4">
                  <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80" alt="Kitchen" className="rounded-2xl border-4 border-white shadow-xl" />
                  <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" alt="Plating" className="rounded-2xl mt-8 border-4 border-white shadow-xl" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#00A5B5] rounded-full flex items-center justify-center text-white shadow-2xl border-4 border-white">
                  <span className="font-bold text-center leading-tight">ESTD <br /> 1998</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-sm uppercase tracking-[0.4em] text-[#00A5B5] font-bold mb-4">Our Legacy</h2>
              <h3 className="text-5xl font-bold mb-8 leading-tight text-slate-900">A Tradition of Saffron & Silk</h3>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-light">
                Our story began in the ancient bazaars, where the aroma of saffron and fresh naan filled the air. Today, we bring those timeless Iranian flavors to your table, wrapped in a contemporary turquoise elegance that honors our rich geometric heritage.
              </p>
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="p-6 rounded-2xl bg-[#00A5B5]/5 border border-[#00A5B5]/10">
                  <h5 className="text-4xl font-bold mb-2 text-[#00A5B5]">25+</h5>
                  <p className="text-sm uppercase tracking-widest text-slate-500 font-bold">Years of Heritage</p>
                </div>
                <div className="p-6 rounded-2xl bg-[#00A5B5]/5 border border-[#00A5B5]/10">
                  <h5 className="text-4xl font-bold mb-2 text-[#00A5B5]">120k</h5>
                  <p className="text-sm uppercase tracking-widest text-slate-500 font-bold">Honored Guests</p>
                </div>
              </div>
              <Button size="lg" variant="outline" className="rounded-full px-10 border-[#00A5B5] text-[#00A5B5] hover:bg-[#00A5B5]/5">Read Full Story</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Highlight Section - Turquoise Gradient */}
      <section id="menu" className="py-32 bg-[#00A5B5]/5 border-y border-[#00A5B5]/10 relative">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        <div className="container px-4 mx-auto text-center relative z-10">
          <h2 className="text-sm uppercase tracking-[0.4em] text-[#00A5B5] font-bold mb-4">Culinary Masterpieces</h2>
          <h3 className="text-5xl font-bold mb-16 text-slate-900">The Taste of Persia</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {signatureDishes.map((item) => (
              <div key={item.id} className="bg-white p-8 rounded-3xl border-2 border-[#00A5B5]/5 shadow-sm hover:shadow-xl hover:shadow-[#00A5B5]/10 hover:-translate-y-2 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#00A5B5]/5 rounded-bl-3xl -z-0 group-hover:bg-[#00A5B5]/10 transition-colors" />
                <div className="mb-6 relative h-56 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                  <img 
                    src={item.id === '1' ? 'https://images.unsplash.com/photo-1572656631137-7935297eff55?w=600&q=80' : 
                         item.id === '4' ? 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=600&q=80' : 
                         'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80'} 
                    alt={item.name.en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h4 className="text-2xl font-bold mb-2 text-slate-900">{item.name.en}</h4>
                <p className="text-slate-500 mb-6 font-light">{item.shortDescription.en}</p>
                <div className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-[#00A5B5]/10 text-[#00A5B5] font-bold">
                  ${item.price}
                </div>
              </div>
            ))}
          </div>
          
          <Button size="lg" asChild className="rounded-full px-12 h-14 bg-[#00A5B5] text-white shadow-xl shadow-[#00A5B5]/20">
            <Link href="/menu">Explore Full Menu</Link>
          </Button>
        </div>
      </section>

      {/* Chef Section */}
      <section id="chef" className="py-32 bg-white relative">
        <div 
          className="absolute inset-y-0 left-0 w-1/2 opacity-10 pointer-events-none mix-blend-multiply" 
          style={{ 
            backgroundImage: `url(${japanesePattern})`,
            backgroundSize: '300px',
            backgroundColor: '#00A5B5'
          }} 
        />
        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
            <div className="lg:w-1/2 relative group">
              <div className="absolute -inset-4 border-2 border-[#00A5B5]/20 rounded-[44px] group-hover:scale-105 transition-transform duration-500" />
              <img src="https://images.unsplash.com/photo-1583394828560-19804e79f202?w=800&q=80" alt="Chef at work" className="rounded-[40px] shadow-2xl relative z-10 border-4 border-white" />
              <div className="absolute -bottom-10 -left-10 bg-[#00A5B5] p-10 rounded-3xl text-white shadow-2xl z-20">
                <ChefHat className="w-12 h-12 mb-4" />
                <h4 className="text-xl font-bold italic font-serif">"Cooking is a prayer <br /> made visible."</h4>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-sm uppercase tracking-[0.4em] text-[#00A5B5] font-bold mb-4">The Artisan</h2>
              <h3 className="text-5xl font-bold mb-8 leading-tight text-slate-900">Master Chef Alessandro Rossi</h3>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-light">
                Chef Alessandro blends his Italian roots with a profound respect for Persian culinary arts. His dishes are a geometric dance of spice and texture, designed to nourish the body and enchant the soul.
              </p>
              <div className="flex items-center gap-10 p-6 rounded-2xl bg-[#00A5B5]/5 border border-[#00A5B5]/10 inline-flex">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" alt="Alessandro Signature" className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" />
                <div>
                  <p className="font-bold text-xl uppercase tracking-widest text-[#00A5B5]">Alessandro Rossi</p>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Executive Chef • Artisan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section - Turquoise Pattern */}
      <section id="why-us" className="py-32 bg-[#00A5B5] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        <div className="container px-4 mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-sm uppercase tracking-[0.4em] opacity-70 font-bold mb-4">Our Excellence</h2>
            <h3 className="text-5xl font-bold">The Turquoise Standard</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform shadow-lg border border-white/20">
                <Heart className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold mb-4">Authentic Spirit</h4>
              <p className="opacity-80 font-light leading-relaxed">We stay true to the ancient recipes of Isfahan and Shiraz, using only the finest Grade A saffron.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 -rotate-3 group-hover:rotate-0 transition-transform shadow-lg border border-white/20">
                <Users className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold mb-4">Warm Hospitality</h4>
              <p className="opacity-80 font-light leading-relaxed">In Persian culture, the guest is a gift from God. We treat every visitor with unparalleled honor.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 rotate-6 group-hover:rotate-0 transition-transform shadow-lg border border-white/20">
                <Award className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold mb-4">Exquisite Design</h4>
              <p className="opacity-80 font-light leading-relaxed">Our atmosphere is a curated collection of geometric art and turquoise craftsmanship.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Us Section */}
      <section id="meet-us" className="py-32 bg-white relative">
        <div 
          className="absolute inset-y-0 left-0 w-1/2 opacity-10 pointer-events-none mix-blend-multiply" 
          style={{ 
            backgroundImage: `url(${japanesePattern})`,
            backgroundSize: '300px',
            backgroundColor: '#00A5B5'
          }} 
        />
        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-sm uppercase tracking-[0.4em] text-[#00A5B5] font-bold mb-4">The Atmosphere</h2>
              <h3 className="text-5xl font-bold mb-8 leading-tight text-slate-900">A Geometric Sanctuary</h3>
              <p className="text-lg text-slate-600 mb-12 leading-relaxed font-light">
                Escape into a world of turquoise tranquility. Our space is meticulously designed with traditional Iranian geometry to foster connection, peace, and celebration.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {['VIP Sapphire Suite', 'Teahouse & Hookah Lounge', 'Garden of Paradise', 'Open Saffron Kitchen'].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#00A5B5]/5 border border-[#00A5B5]/10">
                    <div className="w-3 h-3 rounded-sm bg-[#00A5B5] rotate-45" />
                    <span className="text-lg font-bold text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80" alt="Dining Room" className="rounded-3xl shadow-xl border-4 border-[#00A5B5]/5" />
              <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80" alt="Bar" className="rounded-3xl mt-12 shadow-xl border-4 border-[#00A5B5]/5" />
            </div>
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section id="visit-us" className="py-32 bg-[#00A5B5]/5 border-t border-[#00A5B5]/10">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="bg-white p-12 rounded-3xl border-2 border-[#00A5B5]/10 text-center shadow-lg hover:shadow-[#00A5B5]/5 transition-all">
              <MapPin className="w-12 h-12 text-[#00A5B5] mx-auto mb-6" />
              <h4 className="text-2xl font-bold mb-4 text-slate-900">Location</h4>
              <p className="text-slate-500 font-light">{mockRestaurant.address}</p>
              <Button variant="ghost" className="mt-4 text-[#00A5B5] font-bold hover:bg-[#00A5B5]/10">GET DIRECTIONS</Button>
            </div>
            
            <div className="bg-white p-12 rounded-3xl border-2 border-[#00A5B5]/10 text-center shadow-lg hover:shadow-[#00A5B5]/5 transition-all">
              <Clock className="w-12 h-12 text-[#00A5B5] mx-auto mb-6" />
              <h4 className="text-2xl font-bold mb-4 text-slate-900">Working Hours</h4>
              <p className="text-slate-500 font-light whitespace-pre-line leading-relaxed">{mockRestaurant.hours.replace(/\|/g, '\n')}</p>
            </div>

            <div className="bg-white p-12 rounded-3xl border-2 border-[#00A5B5]/10 text-center shadow-lg hover:shadow-[#00A5B5]/5 transition-all">
              <Calendar className="w-12 h-12 text-[#00A5B5] mx-auto mb-6" />
              <h4 className="text-2xl font-bold mb-4 text-slate-900">Reservations</h4>
              <p className="text-slate-500 font-light mb-4">Book your Persian experience today.</p>
              <p className="text-3xl font-bold text-[#00A5B5] mb-8">{mockRestaurant.phone}</p>
              <Button size="lg" className="rounded-full w-full bg-[#00A5B5] text-white shadow-xl shadow-[#00A5B5]/20">Book Now</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-20 border-t-8 border-[#00A5B5] bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        <div className="container px-4 mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#00A5B5] rounded-lg flex items-center justify-center">
              <Utensils className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tighter uppercase text-[#00A5B5]">{mockRestaurant.name}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12 mb-10">
            {navItems.map(item => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-xs uppercase tracking-[0.4em] font-bold text-slate-400 hover:text-[#00A5B5] transition-colors">
                {item.title}
              </button>
            ))}
          </div>
          <div className="w-full max-w-md mx-auto h-[1px] bg-[#00A5B5]/10 mb-10" />
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.6em] font-bold">© 2025 {mockRestaurant.name} • Iranian Elegance • All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
