"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  description: string;
  rating: number;
  priceRange: string; // "$", "$$", "$$$", "$$$$"
  imageUrl?: string;
}

interface RestaurantContextType {
  restaurants: Restaurant[];
  isLoading: boolean;
  addRestaurant: (restaurant: Omit<Restaurant, "id">) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;
  refreshRestaurants: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/restaurants");
      if (!res.ok) {
        throw new Error("Failed to fetch restaurants");
      }
      const data = await res.json();
      setRestaurants(data);
    } catch (e) {
      console.error("Error loading restaurants from API:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch from MongoDB API on mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const addRestaurant = async (newRest: Omit<Restaurant, "id">) => {
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRest),
      });

      if (!res.ok) {
        throw new Error("Failed to save restaurant");
      }

      const createdRestaurant = await res.json();
      setRestaurants((prev) => [createdRestaurant, ...prev]);
    } catch (e) {
      console.error("Error adding restaurant:", e);
      alert("Error al guardar el restaurante en la base de datos.");
    }
  };

  const deleteRestaurant = async (id: string) => {
    try {
      const res = await fetch(`/api/restaurants/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete restaurant");
      }

      setRestaurants((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error("Error deleting restaurant:", e);
      alert("Error al eliminar el restaurante de la base de datos.");
    }
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        isLoading,
        addRestaurant,
        deleteRestaurant,
        refreshRestaurants: fetchRestaurants,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurants = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurants must be used within a RestaurantProvider");
  }
  return context;
};
