"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRestaurants } from "@/context/RestaurantContext";
import {
  FoodLogo,
  PlusIcon,
  SearchIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  TrashIcon,
  FilterIcon,
} from "@/components/icons";

export default function Home() {
  const { restaurants, deleteRestaurant, isLoading } = useRestaurants();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("Todos");
  const [minRating, setMinRating] = useState(0);

  // Extract unique cuisines for filter buttons
  const cuisines = useMemo(() => {
    const list = new Set<string>();
    restaurants.forEach((r) => {
      if (r.cuisine) list.add(r.cuisine);
    });
    return ["Todos", ...Array.from(list)];
  }, [restaurants]);

  // Filter restaurants based on search query, cuisine, and rating
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCuisine = selectedCuisine === "Todos" || r.cuisine === selectedCuisine;
      const matchesRating = r.rating >= minRating;

      return matchesSearch && matchesCuisine && matchesRating;
    });
  }, [restaurants, searchQuery, selectedCuisine, minRating]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 text-white p-2 rounded-xl shadow-md shadow-orange-200">
              <FoodLogo size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              GastroGuide
            </span>
          </div>

          <Link
            href="/registrar"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-2.5 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            id="btn-register-restaurant"
          >
            <PlusIcon size={18} />
            <span>Registrar Restaurante</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden mb-10 bg-slate-900 text-white shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(249,115,22,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-slate-900/50" />
          
          <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16 max-w-2xl">
            <span className="inline-block text-orange-400 font-semibold tracking-wider uppercase text-xs mb-3 bg-orange-950/50 px-3 py-1 rounded-full border border-orange-500/20">
              Experiencias únicas
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
              Tu guía gastronómica personal
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
              Explora una selección curada de los mejores restaurantes o registra tus propios descubrimientos gastronómicos. ¡Comparte tus experiencias con el mundo!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/registrar"
                className="bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-md shadow-orange-900/20"
              >
                Empezar a Registrar
              </Link>
              <a
                href="#restaurantes-list"
                className="bg-slate-800 text-slate-200 font-semibold px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
              >
                Ver Restaurantes
              </a>
            </div>
          </div>
        </section>

        {/* Filter and Search Bar Section */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8" id="filters-section">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <SearchIcon size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, descripción o dirección..."
                className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                id="search-input"
              />
            </div>

            {/* Additional filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                <FilterIcon size={16} />
                <span>Calificación mínima:</span>
              </div>
              <div className="flex items-center gap-1">
                {[0, 3, 4, 5].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      minRating === stars
                        ? "bg-orange-50 border-orange-200 text-orange-600"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {stars === 0 ? "Todas" : `${stars}★ o más`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cuisine Categories Pills */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Filtrar por Cocina
            </span>
            <div className="flex flex-wrap gap-2">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCuisine === cuisine
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Restaurants Grid Section */}
        <section id="restaurantes-list" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Restaurantes Registrados</h2>
              <p className="text-sm text-slate-500 mt-1">
                {isLoading ? "Cargando restaurantes desde MongoDB..." : `Mostrando ${filteredRestaurants.length} de ${restaurants.length} lugares`}
              </p>
            </div>
          </div>

          {isLoading ? (
            /* Loading Skeleton State */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm p-6 space-y-4 animate-pulse">
                  <div className="h-40 bg-slate-200 rounded-xl w-full" />
                  <div className="h-6 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-4 bg-slate-200 rounded-md w-full" />
                  <div className="h-4 bg-slate-200 rounded-md w-5/6" />
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                    <div className="h-3 bg-slate-200 rounded-md w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRestaurants.length === 0 ? (
            /* Empty State */
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
              <div className="mx-auto w-16 h-16 bg-slate-50 text-slate-400 flex items-center justify-center rounded-2xl mb-4">
                <FoodLogo size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No se encontraron restaurantes</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                No hay restaurantes que coincidan con los filtros seleccionados o la búsqueda actual. Intenta buscar de nuevo.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCuisine("Todos");
                  setMinRating(0);
                }}
                className="bg-slate-900 text-white font-medium px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors text-sm"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            /* Grid Layout */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <article
                  key={restaurant.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col group"
                >
                  {/* Card Image Cover */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={restaurant.imageUrl}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      {restaurant.cuisine}
                    </div>
                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <StarIcon size={12} fillType="full" className="text-white" />
                      <span>{restaurant.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-orange-500 transition-colors">
                          {restaurant.name}
                        </h3>
                        <span className="text-emerald-600 font-semibold text-sm shrink-0">
                          {restaurant.priceRange}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 mb-6 leading-relaxed">
                        {restaurant.description}
                      </p>
                    </div>

                    {/* Detailed info & actions */}
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      {/* Location */}
                      <div className="flex items-start gap-2 text-xs text-slate-500">
                        <MapPinIcon size={16} className="text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{restaurant.address}</span>
                      </div>

                      {/* Phone */}
                      {restaurant.phone && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <PhoneIcon size={16} className="text-slate-400 shrink-0" />
                          <span>{restaurant.phone}</span>
                        </div>
                      )}

                      {/* Hours */}
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <ClockIcon size={16} className="text-slate-400 shrink-0" />
                        <span>{restaurant.openingHours}</span>
                      </div>

                      {/* Delete Action button */}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            if (confirm(`¿Estás seguro de que deseas eliminar "${restaurant.name}"?`)) {
                              deleteRestaurant(restaurant.id);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 font-medium px-2 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-200"
                          title="Eliminar restaurante"
                        >
                          <TrashIcon size={14} />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 text-slate-400 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 text-white p-1.5 rounded-lg">
                <FoodLogo size={20} />
              </div>
              <span className="text-white font-bold tracking-tight text-lg">GastroGuide</span>
            </div>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} GastroGuide. Todos los derechos reservados. Diseñado con Next.js y Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
