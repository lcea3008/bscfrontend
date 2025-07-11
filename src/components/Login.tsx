"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { authService } from "../services/types"
import { Building2, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Alert, AlertDescription } from "./ui/alert"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login, loginWithUserData } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await authService.login({ email, password })
      console.log("📥 Respuesta del backend:", response)
      
      // Usar la nueva función que guarda los datos completos del usuario
      if (response.user) {
        console.log("✅ Datos del usuario del backend:", response.user)
        loginWithUserData(response.token, response.user)
      } else {
        console.log("⚠️ No hay datos de usuario en la respuesta, usando solo token")
        login(response.token)
      }
      
      navigate("/dashboard")
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Error al iniciar sesión"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding (50%) */}
      <div className="w-1/2 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 relative overflow-hidden flex items-center justify-center">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 right-32 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/20 rounded-full blur-2xl animate-pulse delay-500" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-12">
          {/* Title */}
          <div className="mb-16">
            <h1 className="text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">Balance</h1>
            <h1 className="text-6xl lg:text-7xl font-bold text-red-600 drop-shadow-lg tracking-tight">Scorecard</h1>
          </div>

          {/* Logo */}
          <div className="relative mb-12">
            <div className="w-72 h-72 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border-4 border-red-500 hover:scale-105 transition-all duration-500">
              <div className="text-center">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-8 rounded-full mb-4 mx-auto w-fit shadow-lg">
                  <Building2 className="h-24 w-24 text-white" />
                </div>
                <span className="text-2xl font-bold text-red-600 tracking-wide">Logo</span>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 w-72 h-72 bg-red-400/30 rounded-full blur-2xl animate-pulse" />
          </div>

          {/* Company Name */}
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full border-4 border-red-500 shadow-xl inline-block">
            <span className="text-2xl font-bold text-red-600 tracking-wider">EMPRESA LCE</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form (50%) */}
      <div className="w-1/2 bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          {/* Login Header */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-800 mb-4">Bienvenido</h2>
            <p className="text-gray-600 text-xl">Inicia sesión en tu cuenta</p>
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-yellow-500 mx-auto mt-6 rounded-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <Alert
                variant="destructive"
                className="border-red-300 bg-red-50 animate-in slide-in-from-top-2 duration-300"
              >
                <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
              </Alert>
            )}

            {/* Email Field */}
            <div className="space-y-4">
              <Label htmlFor="email" className="text-xl font-bold text-gray-700 flex items-center gap-3">
                <Mail className="h-6 w-6 text-red-500" />
                Correo Electrónico
              </Label>
              <div className="relative group">
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-16 text-lg bg-gray-50 border-3 border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-yellow-200 rounded-xl transition-all duration-300 pl-6 pr-6 shadow-sm hover:shadow-md hover:border-yellow-400"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-4">
              <Label htmlFor="password" className="text-xl font-bold text-gray-700 flex items-center gap-3">
                <Lock className="h-6 w-6 text-red-500" />
                Contraseña
              </Label>
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-16 text-lg bg-gray-50 border-3 border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-yellow-200 rounded-xl transition-all duration-300 pl-6 pr-16 shadow-sm hover:shadow-md hover:border-yellow-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-yellow-100"
                >
                  {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-red-500 border-2 border-gray-400 rounded focus:ring-yellow-400 focus:ring-2 transition-all"
                />
                <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                  Recordarme
                </span>
              </label>
              <a href="#" className="text-red-500 hover:text-red-600 font-bold transition-colors hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 text-xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group border-2 border-red-600"
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-12 text-center space-y-4">
            <p className="text-gray-600 text-lg">
              ¿Necesitas ayuda?{" "}
              <a href="#" className="text-red-500 hover:text-red-600 font-bold transition-colors hover:underline">
                Contacta soporte técnico
              </a>
            </p>
            <div className="flex items-center justify-center space-x-4 text-gray-500">
              <a href="#" className="hover:text-red-500 transition-colors font-medium">
                Términos
              </a>
              <span className="text-yellow-500">•</span>
              <a href="#" className="hover:text-red-500 transition-colors font-medium">
                Privacidad
              </a>
              <span className="text-yellow-500">•</span>
              <a href="#" className="hover:text-red-500 transition-colors font-medium">
                Ayuda
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
