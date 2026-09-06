import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

// Helper to check if requested time falls within restaurant operating hours
function isTimeWithinOperatingHours(
  reservationTime: string,
  openingHoursStr: string
): { valid: boolean; reason?: string; openStr?: string; closeStr?: string } {
  if (!openingHoursStr) return { valid: true };

  const times = openingHoursStr.match(/\b([0-1]?[0-9]|2[0-3]):[0-5][0-9]\b/g);
  if (!times || times.length < 2) {
    return { valid: true };
  }

  const [openStr, closeStr] = times;
  const [openH, openM] = openStr.split(":").map(Number);
  const [closeH, closeM] = closeStr.split(":").map(Number);
  const [reqH, reqM] = reservationTime.split(":").map(Number);

  const openMinutes = openH * 60 + openM;
  let closeMinutes = closeH * 60 + closeM;
  let reqMinutes = reqH * 60 + reqM;

  // Handle closing hours after midnight (e.g. 18:00 to 02:00)
  if (closeMinutes < openMinutes) {
    closeMinutes += 24 * 60;
    if (reqMinutes < openMinutes && reqMinutes <= (closeH * 60 + closeM)) {
      reqMinutes += 24 * 60;
    }
  }

  if (reqMinutes < openMinutes || reqMinutes > closeMinutes) {
    return {
      valid: false,
      reason: `La hora seleccionada (${reservationTime}) está fuera del horario de atención del restaurante (${openStr} - ${closeStr}).`,
      openStr,
      closeStr,
    };
  }

  return { valid: true, openStr, closeStr };
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("gastroguide");
    const collection = db.collection("reservations");

    const data = await collection.find({}).sort({ date: 1, time: 1 }).toArray();

    const reservations = data.map((doc) => {
      const { _id, ...rest } = doc;
      return {
        id: _id.toString(),
        ...rest,
      };
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Database error in GET /api/reservations:", error);
    return NextResponse.json({ error: "Fallo al obtener las reservas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      restaurantId,
      customerName,
      customerPhone,
      customerEmail,
      date,
      time,
      guests,
      notes,
    } = body;

    if (!restaurantId || !customerName || !customerPhone || !date || !time || !guests) {
      return NextResponse.json(
        { error: "Por favor completa los campos requeridos para la reserva." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("gastroguide");

    // Fetch restaurant to get opening hours & name
    let restaurant = null;
    if (ObjectId.isValid(restaurantId)) {
      restaurant = await db.collection("restaurants").findOne({ _id: new ObjectId(restaurantId) });
    }

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurante no encontrado" }, { status: 404 });
    }

    // Validate operating hours
    const timeCheck = isTimeWithinOperatingHours(time, restaurant.openingHours || "");
    if (!timeCheck.valid) {
      return NextResponse.json({ error: timeCheck.reason }, { status: 400 });
    }

    const newReservation = {
      restaurantId,
      restaurantName: restaurant.name,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: (customerEmail || "").trim(),
      date,
      time,
      guests: Number(guests) || 1,
      notes: (notes || "").trim(),
      status: "pending",
      createdAt: new Date(),
    };

    const result = await db.collection("reservations").insertOne(newReservation);

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        ...newReservation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error in POST /api/reservations:", error);
    return NextResponse.json({ error: "Fallo al procesar la reserva" }, { status: 500 });
  }
}
