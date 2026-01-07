addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Toma el número desde el secret / variable de entorno expuesta por wrangler (globalThis.PHONE)
  // Formato esperado: "573001234567" (sin +)
  const phoneVal = typeof globalThis.PHONE !== "undefined" && globalThis.PHONE
    ? String(globalThis.PHONE)
    : "573000000000"; // valor por defecto (reemplázalo usando wrangler secret)

  const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Superdeli - Repostería en Sincelejo</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Vue 3 -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        [v-cloak] { display: none; }
        .fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
        .fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
        .list-move, .list-enter-active, .list-leave-active { transition: all 0.5s ease; }
        .list-enter-from, .list-leave-to { opacity: 0; transform: scale(0.9); }
        .product-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .product-card:hover { transform: translateY(-10px); }
    </style>
</head>
<body class="bg-orange-50 text-gray-800">
  <div id="app" v-cloak>
    <!-- (HTML completo como antes — abreviado en este ejemplo por brevedad) -->
  </div>

  <script>
    const { createApp, ref, onMounted, computed, nextTick } = Vue;

    createApp({
      setup() {
        const isMenuOpen = ref(false);
        const activeCategory = ref('todas');
        const scrolled = ref(false);
        // phone se inyecta aquí desde el worker: phoneVal se inserta en el HTML cuando el worker lo sirve
        const phone = "${phoneVal}";

        const refreshIcons = () => {
          nextTick(() => {
            if (window.lucide) window.lucide.createIcons();
          });
        };

        const getWhatsAppLink = (productName = "") => {
          const base = \`https://wa.me/\${phone}?text=\`;
          const msg = productName
            ? \`¡Hola Superdeli! 👋 Me encantaría pedir el artículo: *\${productName}*. ¿Cuál es el precio y disponibilidad?\`
            : "¡Hola Superdeli! 👋 Quisiera información sobre sus productos en Sincelejo.";
          return base + encodeURIComponent(msg);
        };

        const categories = [
          { id: 'todas', label: 'Todas' },
          { id: 'tortas', label: 'Tortas' },
          { id: 'postres', label: 'Postres' },
          { id: 'galletas', label: 'Galletas' },
          { id: 'brownies', label: 'Brownies' }
        ];

        const products = [
          { id: 1, name: "Torta Red Velvet", category: "tortas", price: "$45.000", image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&q=80&w=600", tag: "Favorita" },
          { id: 2, name: "Brownie Melcochudo", category: "brownies", price: "$6.000", image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=600", tag: "Chocolate" },
          { id: 3, name: "Cookies Chocolate", category: "galletas", price: "$4.500", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600", tag: "Caseras" },
          { id: 4, name: "Postre de Maracuyá", category: "postres", price: "$12.000", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600", tag: "Tropical" },
          { id: 5, name: "Torta Chocolate Belga", category: "tortas", price: "$55.000", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600", tag: "Premium" },
          { id: 6, name: "Mix de Galletas", category: "galletas", price: "$18.000", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=600", tag: "Compartir" }
        ];

        const filteredProducts = computed(() => {
          if (activeCategory.value === 'todas') return products;
          return products.filter(p => p.category === activeCategory.value);
        });

        onMounted(() => {
          window.addEventListener('scroll', () => {
            scrolled.value = window.scrollY > 50;
          });
          refreshIcons();
        });

        return {
          isMenuOpen,
          activeCategory,
          scrolled,
          getWhatsAppLink,
          categories,
          filteredProducts,
          refreshIcons
        };
      },
      watch: {
        activeCategory() {
          setTimeout(() => {
            if (window.lucide) window.lucide.createIcons();
          }, 50);
        }
      }
    }).mount('#app');
  </script>
</body>
</html>`;

  return new Response(HTML, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}