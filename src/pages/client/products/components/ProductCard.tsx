import type { ProductClient } from "@/const/product-client.const";
import { Link } from "react-router-dom";
import { createProductSlug } from "@/lib/slugify";
import { useCart } from "../../cart/useCart";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

type ProductCardProps = {
	product: ProductClient;
};

export const ProductCard = ({ product }: ProductCardProps) => {
	const { addItem } = useCart();
	const productSlug = createProductSlug(product.name, product.id);
	const priceDisplay = product.minPrice === product.maxPrice 
		? `${product.minPrice.toLocaleString('vi-VN')}₫`
		: `${product.minPrice.toLocaleString('vi-VN')}₫ - ${product.maxPrice.toLocaleString('vi-VN')}₫`;

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		
		// Use minPrice as default price for adding to cart
		addItem(product.id, product.name, product.minPrice, 1);		
		toast.success(`${product.name} đã được thêm vào giỏ hàng!`, {
		});
	};

	return (
		<Link
			to={`/client/products/${productSlug}`}
			className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200 transition hover:shadow-md"
		>
			<div className="relative overflow-hidden bg-gray-100">
				<img
					src={product.imageUrl || '/placeholder-coffee.jpg'}
					alt={product.name}
					className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
					loading="lazy"
				/>
				
				{/* Add to Cart Button - Top Left Corner */}
				<Button
					onClick={handleAddToCart}
					size="sm"
					className="absolute top-2 left-2 h-8 w-8 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all duration-200 hover:scale-110 z-10 p-0"
					aria-label={`Thêm ${product.name} vào giỏ hàng`}
				>
					<Plus className="h-4 w-4" />
				</Button>
			</div>

			<div className="flex flex-1 flex-col gap-2 p-4">
				<div className="flex flex-col gap-1">
					<h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
						{product.name}
					</h3>
					{product.description && (
						<p className="text-sm text-gray-600 line-clamp-2">
							{product.description}
						</p>
					)}
				</div>
				
				<div className="mt-auto flex items-center justify-between">
					<span className="font-bold text-green-600">
						{priceDisplay}
					</span>
					<span className="text-xs text-gray-400">
						{product.sku}
					</span>
				</div>
			</div>
		</Link>
	);
};

export default ProductCard;

