import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid restaurant ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("gastroguide");
    const collection = db.collection("restaurants");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Database error in DELETE /api/restaurants/[id]:", error);
    return NextResponse.json({ error: "Failed to delete restaurant" }, { status: 500 });
  }
}
