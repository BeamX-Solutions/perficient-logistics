export function Gallery() {
  const images = [
    '/gallery-1.png',
    '/gallery-2.png',
    '/gallery-3.png',
    '/gallery-4.png',
    '/gallery-5.png',
    '/gallery-6.png',
  ];

  return (
    <section className="bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
          {images.map((image, index) => (
            <div key={index} className="aspect-square overflow-hidden">
              <img
                src={image}
                alt={`Vehicle ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}