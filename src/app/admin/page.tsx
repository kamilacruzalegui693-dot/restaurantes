"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRestaurants, Restaurant } from "@/context/RestaurantContext";
import {
  FoodLogo,
  TrashIcon,
  SearchIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  ArrowLeftIcon,
} from "@/components/icons";

export default function AdminPage() {
  const { restaurants, deleteRestaurant, isLoading: loadingRestaurants, refreshRestaurants } = useRestaurants();

  // Auth States
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");

  // Dashboard States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRestaurantMenu, setSelectedRestaurantMenu] = useState<Restaurant | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Check auth status on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setCheckingAuth(true);
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        setAdminUsername(data.username || "admin");
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Error comprobando sesión:", err);
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!usernameInput.trim() || !passwordInput) {
      setLoginError("Ingresa tu usuario y contraseña");
      return;
    }

    try {
      setIsSubmittingLogin(true);
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data.message || "Credenciales incorrectas");
        return;
      }

      setIsAuthenticated(true);
      setAdminUsername(data.username || "admin");
      setPasswordInput("");
      refreshRestaurants();
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setLoginError("Error de conexión al servidor");
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (err) {
      console.error("Error cerrando sesión:", err);
    } finally {
      setIsAuthenticated(false);
      setUsernameInput("");
      setPasswordInput("");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente el restaurante "${name}"?`)) {
      return;
    }

    try {
      setIsDeletingId(id);
      await deleteRestaurant(id);
      if (selectedRestaurantMenu?.id === id) {
        setSelectedRestaurantMenu(null);
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar el restaurante.");
    } finally {
      setIsDeletingId(null);
    }
  };

  // Filtered restaurants for admin table
  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalRestaurants = restaurants.length;
  const totalMenuItems = restaurants.reduce((acc, r) => acc + (r.menuItems?.length || 0), 0);
  const avgRating = totalRestaurants > 0
    ? (restaurants.reduce((acc, r) => acc + r.rating, 0) / totalRestaurants).toFixed(1)
    : "0.0";

  // Loading indicator while checking session
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-300">Verificando sesión de administración...</p>
        </div>
      </div>
    );
  }

  // 1. LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-500 text-white p-3.5 rounded-2xl shadow-lg shadow-orange-500/20">
              <FoodLogo size={36} />
            </div>
          </div>
          <h2 className="text-center text-3xl font-black tracking-tight text-white">
            GastroGuide Admin
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Ingresa las credenciales de administración para gestionar restaurantes
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              {loginError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs font-semibold text-red-400 text-center">
                  {loginError}
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Usuario Administrador
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Ej. admin"
                  className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmittingLogin}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-all"
                >
                  {isSubmittingLogin ? "Validando..." : "Iniciar Sesión como Admin"}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800 text-center">
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">
                <ArrowLeftIcon size={14} />
                <span>Volver al sitio público</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Admin Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 text-white p-2 rounded-xl">
              <FoodLogo size={22} />
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tight">GastroGuide</span>
              <span className="ml-2 text-xs font-bold bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-md border border-orange-500/30">
                PANEL ADMIN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Conectado como: <strong className="text-slate-200">{adminUsername}</strong>
            </span>
            <Link
              href="/"
              className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg transition-colors border border-slate-700"
            >
              Ver Sitio Público
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Gestión de Restaurantes</h1>
            <p className="text-slate-400 text-sm mt-1">
              Administra el catálogo de restaurantes registrados y sus cartas de menú.
            </p>
          </div>
          <Link
            href="/registrar"
            className="self-start sm:self-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 transition-all inline-flex items-center gap-1.5"
          >
            + Nuevo Restaurante
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Restaurantes</span>
            <p className="text-3xl font-black text-white mt-2">{totalRestaurants}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Platos / Menú</span>
            <p className="text-3xl font-black text-amber-400 mt-2">{totalMenuItems}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Calificación Promedio</span>
            <p className="text-3xl font-black text-orange-400 mt-2">{avgRating} ★</p>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <SearchIcon size={18} className="text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, cocina o dirección..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Restaurants Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {loadingRestaurants ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Cargando restaurantes desde MongoDB...
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No se encontraron restaurantes registrados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Restaurante</th>
                    <th className="px-6 py-4">Cocina & Precio</th>
                    <th className="px-6 py-4">Ubicación & Contacto</th>
                    <th className="px-6 py-4">Carta Menú</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredRestaurants.map((restaurant) => (
                    <tr key={restaurant.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Name & Cover */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={restaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150"}
                            alt={restaurant.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white leading-tight">{restaurant.name}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-amber-400">
                              <StarIcon size={12} fillType="full" />
                              <span>{restaurant.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cuisine */}
                      <td className="px-6 py-4">
                        <span className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-md font-medium">
                          {restaurant.cuisine}
                        </span>
                        <span className="ml-2 text-xs font-bold text-emerald-400">
                          {restaurant.priceRange}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <MapPinIcon size={14} className="text-slate-400 shrink-0" />
                          <span className="truncate max-w-xs">{restaurant.address}</span>
                        </div>
                        {restaurant.phone && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <PhoneIcon size={14} className="shrink-0" />
                            <span>{restaurant.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Menu Count & View Button */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedRestaurantMenu(restaurant)}
                          className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Ver Carta ({restaurant.menuItems?.length || 0})
                        </button>
                      </td>

                      {/* Delete Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(restaurant.id, restaurant.name)}
                          disabled={isDeletingId === restaurant.id}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 p-2 rounded-lg transition-colors disabled:opacity-40"
                          title="Eliminar restaurante"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* MENU ITEMS MODAL */}
      {selectedRestaurantMenu && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedRestaurantMenu.name}</h3>
                <p className="text-xs text-orange-400 font-semibold mt-0.5">Carta de Menú Registrada</p>
              </div>
              <button
                onClick={() => setSelectedRestaurantMenu(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {!selectedRestaurantMenu.menuItems || selectedRestaurantMenu.menuItems.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  Este restaurante no tiene platos o bebidas registradas en su carta.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedRestaurantMenu.menuItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                          <span className="text-sm font-bold text-white">{item.name}</span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                        )}
                      </div>
                      <span className="text-sm font-bold text-emerald-400 shrink-0">{item.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setSelectedRestaurantMenu(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
