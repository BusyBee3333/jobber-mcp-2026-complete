import { useState } from 'react';

interface Property {
  id: string;
  address: string;
  city: string;
  province: string;
  clientName: string;
  jobCount: number;
  lat: number;
  lng: number;
}

export default function PropertyMap() {
  const [properties] = useState<Property[]>([
    {
      id: '1',
      address: '123 Main St',
      city: 'New York',
      province: 'NY',
      clientName: 'John Doe',
      jobCount: 5,
      lat: 40.7128,
      lng: -74.0060,
    },
    {
      id: '2',
      address: '456 Oak Ave',
      city: 'Brooklyn',
      province: 'NY',
      clientName: 'Jane Smith',
      jobCount: 3,
      lat: 40.6782,
      lng: -73.9442,
    },
    {
      id: '3',
      address: '789 Pine Rd',
      city: 'Queens',
      province: 'NY',
      clientName: 'Bob Johnson',
      jobCount: 8,
      lat: 40.7282,
      lng: -73.7949,
    },
  ]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl font-bold">Property Map</h1>
        <p className="text-gray-400 mt-1">View all service locations on the map</p>
      </header>

      <div className="grid grid-cols-3 h-[calc(100vh-100px)]">
        <div className="col-span-2 bg-gray-800 relative">
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-xl">Interactive Map View</p>
              <p className="text-sm mt-2">(Map integration placeholder)</p>
            </div>
          </div>
          {properties.map((property) => (
            <div
              key={property.id}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                selectedProperty?.id === property.id
                  ? 'bg-blue-600 ring-4 ring-blue-400'
                  : 'bg-red-600 hover:bg-red-500'
              }`}
              style={{
                left: `${((property.lng + 74.0060) / 0.5) * 100}%`,
                top: `${((40.7282 - property.lat) / 0.1) * 100}%`,
              }}
              onClick={() => setSelectedProperty(property)}
            >
              <span className="text-white text-xs font-bold">{property.jobCount}</span>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Properties ({properties.length})</h2>
          <div className="space-y-4">
            {properties.map((property) => (
              <div
                key={property.id}
                onClick={() => setSelectedProperty(property)}
                className={`bg-gray-800 rounded-lg p-4 border cursor-pointer transition-colors ${
                  selectedProperty?.id === property.id
                    ? 'border-blue-500 bg-gray-750'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <h3 className="font-semibold">{property.address}</h3>
                <p className="text-sm text-gray-400">
                  {property.city}, {property.province}
                </p>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-400">{property.clientName}</span>
                  <span className="text-blue-400">{property.jobCount} jobs</span>
                </div>
              </div>
            ))}
          </div>

          {selectedProperty && (
            <div className="mt-6 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Selected Property</h3>
              <p className="text-sm mb-1">{selectedProperty.address}</p>
              <p className="text-sm text-gray-400 mb-2">
                {selectedProperty.city}, {selectedProperty.province}
              </p>
              <p className="text-sm">Client: {selectedProperty.clientName}</p>
              <p className="text-sm">Total Jobs: {selectedProperty.jobCount}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
