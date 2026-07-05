import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DEFAULT_RESTAURANTS = [
  {
    name: "Gusto Italiano",
    cuisine: "Italiana",
    address: "Av. Principal 123, Miraflores",
    phone: "+51 987 654 321",
    email: "contacto@gustoitaliano.com",
    openingHours: "12:00 - 23:00",
    description: "Auténtica pasta artesanal, pizzas al horno de leña y una selecta carta de vinos italianos en un ambiente romántico y acogedor.",
    rating: 5,
    priceRange: "$$$",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60",
    createdAt: new Date(),
  },
  {
    name: "Sushi Master",
    cuisine: "Japonesa",
    address: "Calle Los Cedros 456, San Isidro",
    phone: "+51 912 345 678",
    email: "info@sushimaster.pe",
    openingHours: "12:30 - 22:30",
    description: "Sashimis frescos, makis de autor y el mejor ramen de la ciudad preparado por cocineros especializados en técnicas tradicionales japonesas.",
    rating: 4.8,
    priceRange: "$$$$",
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60",
    createdAt: new Date(),
  },
  {
    name: "Tacos El Rey",
    cuisine: "Mexicana",
    address: "Jr. Ayacucho 789, Centro",
    phone: "+51 955 667 788",
    email: "hola@tacoselrey.com",
    openingHours: "11:00 - 22:00",
    description: "Los mejores tacos al pastor, quesadillas gigantes y margaritas heladas con el sabor callejero más auténtico de México.",
    rating: 4.5,
    priceRange: "$$",
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=60",
    createdAt: new Date(),
  },
  {
    name: "La Parrilla de Juan",
    cuisine: "Carnes y Parrilla",
    address: "Av. El Derby 321, Santiago de Surco",
    phone: "+51 944 332 211",
    email: "reservas@laparrilladejuan.pe",
    openingHours: "12:00 - 23:30",
    description: "Cortes de carne premium importados, cocinados a la brasa a la perfección acompañados de ensaladas orgánicas y papas nativas.",
    rating: 4.7,
    priceRange: "$$$",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=60",
    createdAt: new Date(),
  },
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("gastroguide");
    const collection = db.collection("restaurants");

    // Check if empty and seed
    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(DEFAULT_RESTAURANTS);
    }

    // Fetch and sort by newest
    const data = await collection.find({}).sort({ createdAt: -1 }).toArray();

    // Map database _id to frontend friendly id string
    const restaurants = data.map((doc) => {
      const { _id, ...rest } = doc;
      return {
        id: _id.toString(),
        ...rest,
      };
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Database error in GET /api/restaurants:", error);
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      cuisine,
      address,
      phone,
      email,
      openingHours,
      rating,
      priceRange,
      imageUrl,
      description,
    } = body;

    // Basic validation
    if (!name || !cuisine || !address || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("gastroguide");
    const collection = db.collection("restaurants");

    const newRestaurant = {
      name: name.trim(),
      cuisine: cuisine.trim(),
      address: address.trim(),
      phone: (phone || "").trim(),
      email: (email || "").trim(),
      openingHours: (openingHours || "12:00 - 22:00").trim(),
      rating: Number(rating) || 5,
      priceRange: priceRange || "$$",
      imageUrl: (imageUrl || "").trim() || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
      description: description.trim(),
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newRestaurant);

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        ...newRestaurant,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error in POST /api/restaurants:", error);
    return NextResponse.json({ error: "Failed to create restaurant" }, { status: 500 });
  }
}
