import { PRODUCTS_CLIENT, type ProductClient  } from "@/const/product-client.const";
import ProductCard from "./ProductCard";
import backgroundImage from "@/assets/sergey-kotenev-NzzYGQSdw9Q-unsplash.jpg";

const ProductList = () => {
  const activeProducts: ProductClient[] = PRODUCTS_CLIENT.filter(
    (product) => product.is_active,
  );

  return (
    <div className="w-full">
      {/* Hero Banner Section - 21:9 aspect ratio */}
      <section 
        className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(0.5px)', // Subtle depth of field effect
        }}
      >
        {/* Gradient overlays for modern coffee shop look */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
        
        {/* Hero Content - Clean empty center space */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-amber-400 mb-4">
              Our Menu
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 drop-shadow-lg">
              Signature Coffee Creations
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Discover our carefully curated selection of handcrafted coffee drinks,
              brewed from premium beans and perfected by our baristas.
            </p>
          </div>
        </div>
        
        {/* Bottom darker area for product overlap */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
      </section>

      {/* Product List Section - Overlaps hero by 50% */}
      <section className="relative -mt-24 z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Product cards with backdrop blur effect */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Bottom spacing */}
      <div className="h-16"></div>
    </div>
  );
};

export default ProductList;
