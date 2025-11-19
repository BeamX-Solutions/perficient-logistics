import { Star, User } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      text: 'Reliable and professional company! They picked me from the airport and the entire exerience was smooth from start to finish. The driver arrived early, was courteous, and helped with my luggage without hesitation. The vehicle was spotless and airconditioned, perfect after an 11-hour flight. Communication was excellent.',
      name: 'Obinna Nweke',
      avatar: '/img-1.PNG',
    },
    {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco labor',
      name: 'Name Surname',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80', // Replace with actual image URL
    },
    {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco labor',
      name: 'Name Surname',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80', // Replace with actual image URL
    },
  ];

  return (
    <section id="testimonials" className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-semibold text-center text-gray-900 mb-12">
          What our customers say
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex justify-center mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder icon if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center';
                    fallback.innerHTML = '<svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                    target.parentNode?.insertBefore(fallback, target);
                  }}
                />
              </div>

              <p className="text-gray-700 text-center mb-6 leading-relaxed">
                {testimonial.text}
              </p>

              <div className="text-center">
                <p className="font-bold text-gray-900 mb-2">{testimonial.name}</p>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}