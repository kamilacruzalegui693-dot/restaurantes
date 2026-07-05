"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRestaurants } from "@/context/RestaurantContext";
import { ArrowLeftIcon, StarIcon, FoodLogo } from "@/components/icons";

const CUISINES = [
  "Italiana",
  "Japonesa",
  "Mexicana",
  "Carnes y Parrilla",
  "Hamburguesas",
  "Vegana/Vegetariana",
  "Cafetería y Postres",
  "Otros",
];

const PRESET_IMAGES = [
  {
    name: "Pasta/Italiana",
    url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60",
    preview: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=60",
  },
  {
    name: "Sushi/Japonesa",
    url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60",
    preview: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=150&auto=format&fit=crop&q=60",
  },
  {
    name: "Tacos/Mexicana",
    url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=60",
    preview: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=150&auto=format&fit=crop&q=60",
  },
  {
    name: "Parrilla/Carnes",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=60",
    preview: "https://images.unsplash.com/photo-1544025162-d76694265947?w=150&auto=format&fit=crop&q=60",
  },
  {
    name: "Hamburguesas",
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60",
    preview: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=60",
  },
  {
    name: "Cafetería/Postres",
    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=60",
    preview: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=150&auto=format&fit=crop&q=60",
  },
];

export default function RegisterRestaurant() {
  const router = useRouter();
  const { addRestaurant } = useRestaurants();

  // Form states
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState(CUISINES[0]);
  const [customCuisine, setCustomCuisine] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [openTime, setOpenTime] = useState("12:00");
  const [closeTime, setCloseTime] = useState("22:00");
  const [rating, setRating] = useState(5);
  const [priceRange, setPriceRange] = useState("$$");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "El nombre del restaurante es obligatorio.";
    if (cuisine === "Otros" && !customCuisine.trim()) {
      newErrors.cuisine = "Por favor especifica el tipo de cocina.";
    }
    if (!address.trim()) newErrors.address = "La dirección es obligatoria.";
    if (!description.trim()) {
      newErrors.description = "La descripción es obligatoria.";
    } else if (description.length < 20) {
      newErrors.description = "La descripción debe tener al menos 20 caracteres.";
    }

    if (phone && !/^\+?[0-9\s-]{7,15}$/.test(phone)) {
      newErrors.phone = "Formato de teléfono inválido (ej: +51 987 654 321).";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Formato de correo electrónico inválido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const finalCuisine = cuisine === "Otros" ? customCuisine : cuisine;
    const openingHours = `${openTime} - ${closeTime}`;

    addRestaurant({
      name,
      cuisine: finalCuisine,
      address,
      phone,
      email,
      openingHours,
      rating,
      priceRange,
      imageUrl: imageUrl.trim() || undefined,
      description,
    });

    // Redirect to home page
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation back button */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
          >
            <ArrowLeftIcon size={18} />
            <span>Volver al inicio</span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Paso 1 de 1</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 sm:p-10 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-500 text-white p-2 rounded-xl">
                <FoodLogo size={20} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Registrar Nuevo Restaurante
              </h1>
            </div>
            <p className="text-slate-500 text-sm">
              Ingresa los detalles sobre el restaurante para agregarlo a la lista de GastroGuide.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8" id="register-form">
            {/* Seccion 1: Datos basicos */}
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                1. Información Básica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre del Restaurante *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. El Portal del Sabor"
                    className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm transition-all ${
                      errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : "border-slate-200 focus:border-orange-500"
                    }`}
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Cocina */}
                <div>
                  <label htmlFor="cuisine" className="block text-sm font-semibold text-slate-700 mb-2">
                    Tipo de Cocina *
                  </label>
                  <select
                    id="cuisine"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                  >
                    {CUISINES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cocina Personalizada si se elige Otros */}
                {cuisine === "Otros" && (
                  <div>
                    <label htmlFor="customCuisine" className="block text-sm font-semibold text-slate-700 mb-2">
                      Especificar Cocina *
                    </label>
                    <input
                      type="text"
                      id="customCuisine"
                      value={customCuisine}
                      onChange={(e) => setCustomCuisine(e.target.value)}
                      placeholder="Ej. Árabe, Fusión, Coreana"
                      className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm transition-all ${
                        errors.cuisine ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-orange-500"
                      }`}
                    />
                    {errors.cuisine && <p className="mt-1.5 text-xs text-red-500">{errors.cuisine}</p>}
                  </div>
                )}

                {/* Calificación */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Calificación Inicial
                  </label>
                  <div className="flex items-center gap-1.5 h-11">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          rating >= star ? "text-amber-500 hover:text-amber-600" : "text-slate-200 hover:text-slate-300"
                        }`}
                      >
                        <StarIcon size={24} fillType={rating >= star ? "full" : "none"} />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-slate-600 ml-2 bg-slate-100 px-2 py-0.5 rounded-md">
                      {rating}.0
                    </span>
                  </div>
                </div>

                {/* Rango de Precios */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Rango de Precios
                  </label>
                  <div className="grid grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-xl">
                    {["$", "$$", "$$$", "$$$$"].map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setPriceRange(range)}
                        className={`py-2 rounded-lg text-sm font-bold transition-all ${
                          priceRange === range
                            ? "bg-white text-orange-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Seccion 2: Ubicacion y contacto */}
            <div className="pt-6 border-t border-slate-100">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                2. Contacto y Ubicación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dirección */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-2">
                    Dirección Física *
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle, Número, Distrito o Ciudad"
                    className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm transition-all ${
                      errors.address ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-orange-500"
                    }`}
                  />
                  {errors.address && <p className="mt-1.5 text-xs text-red-500">{errors.address}</p>}
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. +51 987 654 321"
                    className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm transition-all ${
                      errors.phone ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-orange-500"
                    }`}
                  />
                  {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@restaurante.com"
                    className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm transition-all ${
                      errors.email ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-orange-500"
                    }`}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Horario de Apertura */}
                <div>
                  <label htmlFor="openTime" className="block text-sm font-semibold text-slate-700 mb-2">
                    Horario de Apertura
                  </label>
                  <input
                    type="time"
                    id="openTime"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                  />
                </div>

                {/* Horario de Cierre */}
                <div>
                  <label htmlFor="closeTime" className="block text-sm font-semibold text-slate-700 mb-2">
                    Horario de Cierre
                  </label>
                  <input
                    type="time"
                    id="closeTime"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Seccion 3: Diseño y Multimedia */}
            <div className="pt-6 border-t border-slate-100">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                3. Imagen y Presentación
              </h2>
              <div className="space-y-6">
                {/* Seleccion de presets */}
                <div>
                  <span className="block text-sm font-semibold text-slate-700 mb-2">
                    Selecciona una imagen de demostración:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.name}
                        type="button"
                        onClick={() => setImageUrl(img.url)}
                        className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                          imageUrl === img.url
                            ? "border-orange-500 ring-2 ring-orange-500/20"
                            : "border-slate-100 hover:border-slate-300"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.preview}
                          alt={img.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] text-white font-medium text-center px-1">
                            {img.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Url Directa */}
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-semibold text-slate-700 mb-2">
                    O ingresa una URL de imagen personalizada
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    Deja vacío para usar una imagen predeterminada si no deseas elegir ninguna.
                  </p>
                </div>

                {/* Descripcion */}
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
                    Descripción del Restaurante *
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Escribe una breve reseña sobre el tipo de comida, especialidad, ambiente..."
                    className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm transition-all ${
                      errors.description ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-orange-500"
                    }`}
                  />
                  <div className="mt-1.5 flex items-center justify-between">
                    {errors.description ? (
                      <p className="text-xs text-red-500">{errors.description}</p>
                    ) : (
                      <span className="text-xs text-slate-400">Mínimo 20 caracteres.</span>
                    )}
                    <span className="text-xs text-slate-400">
                      {description.length} caracteres
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de Envío */}
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto text-center px-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-100 hover:shadow-lg transition-all duration-200"
                id="btn-submit-restaurant"
              >
                Guardar Restaurante
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
