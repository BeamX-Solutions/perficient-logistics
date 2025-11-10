export default function Stats() {
  const stats = [
    {
      value: '10k+',
      label: 'Rides Completed',
    },
    {
      value: '4.8/5',
      label: 'Avg Rating',
    },
    {
      value: '50+',
      label: 'Professional Drivers',
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-5xl font-bold text-blue-500">{stat.value}</div>
              <div className="text-gray-700 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
