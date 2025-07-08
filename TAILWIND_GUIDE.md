# TailwindCSS Configuration Guide

## ✅ Estado de la Configuración

Tu proyecto **ya tiene TailwindCSS configurado correctamente** con:

- ✅ TailwindCSS v4.1.11 instalado
- ✅ PostCSS configurado
- ✅ Directivas @tailwind en index.css
- ✅ Configuración personalizada en tailwind.config.js
- ✅ Ejemplo funcionando en App.tsx

## 🚀 Cómo usar TailwindCSS

### Clases básicas más usadas:

#### Layout y Espaciado
```html
<!-- Flexbox -->
<div className="flex items-center justify-center">
<div className="flex flex-col space-y-4">

<!-- Grid -->
<div className="grid grid-cols-3 gap-4">

<!-- Padding y Margin -->
<div className="p-4 m-2">        <!-- padding: 1rem, margin: 0.5rem -->
<div className="px-6 py-3">      <!-- padding-x: 1.5rem, padding-y: 0.75rem -->
```

#### Colores y Backgrounds
```html
<!-- Backgrounds -->
<div className="bg-blue-500 bg-gradient-to-r from-blue-400 to-purple-600">

<!-- Text Colors -->
<p className="text-gray-800 text-white">

<!-- Borders -->
<div className="border border-gray-300 border-l-4 border-l-blue-500">
```

#### Typography
```html
<h1 className="text-3xl font-bold text-center">
<p className="text-sm text-gray-600 leading-relaxed">
```

#### Interactive States
```html
<button className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition-colors duration-200">
```

### Responsive Design
```html
<!-- Mobile first approach -->
<div className="w-full md:w-1/2 lg:w-1/3">
<p className="text-sm md:text-base lg:text-lg">
```

### Custom Components with @layer
En `src/index.css` puedes agregar:

```css
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6 border border-gray-100;
  }
}
```

## 🎨 Colores Personalizados

Configurados en `tailwind.config.js`:
- `primary-50`, `primary-500`, `primary-600`, `primary-700`

Úsalos así:
```html
<div className="bg-primary-500 text-white">
```

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📚 Recursos

- [Documentación oficial](https://tailwindcss.com/docs)
- [Cheat Sheet](https://tailwindcomponents.com/cheatsheet/)
- [Componentes gratuitos](https://tailwindui.com/components)
- [Playground](https://play.tailwindcss.com/)

## 🎯 Próximos Pasos

1. **Explora los ejemplos** en `App.tsx` y `ExampleCard.tsx`
2. **Personaliza colores** en `tailwind.config.js`
3. **Crea componentes reutilizables** usando @layer
4. **Instala extensiones útiles** (opcional):
   - TailwindCSS Intellisense para VS Code
   - Headless UI para componentes avanzados

¡Tu configuración está lista! 🎉
