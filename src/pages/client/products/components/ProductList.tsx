import { PRODUCTS_CLIENT, type ProductClient  } from "@/const/product-client.const";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const activeProducts: ProductClient[] = PRODUCTS_CLIENT.filter(
    (product) => product.is_active,
  );

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
          Our Menu
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
          Signature Coffee Creations
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-neutral-600 sm:text-base">
          Discover our carefully curated selection of handcrafted coffee drinks,
          brewed from premium beans and perfected by our baristas.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {activeProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
