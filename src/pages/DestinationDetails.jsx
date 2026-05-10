import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function DestinationDetails() {
  const { id } = useParams();

  const [destination, setDestination] = useState(null);

  useEffect(() => {
    fetchDestination();
  }, []);

  const fetchDestination = async () => {
    try {
      const response = await api.get(`/destinations/${id}/`);
      setDestination(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!destination) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <img
        src={destination.image}
        alt={destination.city}
        className="w-full h-[400px] object-cover rounded-xl"
      />

      <h1 className="text-4xl font-bold mt-6">
        {destination.city}
      </h1>

      <p className="text-gray-500 text-xl">
        {destination.country}
      </p>

      <p className="mt-4">
        {destination.description}
      </p>

      <div className="mt-4">
        Popularity: {destination.popularity}
      </div>

      <div>
        Estimated Cost: ${destination.cost_estimate}
      </div>
    </div>
  );
}