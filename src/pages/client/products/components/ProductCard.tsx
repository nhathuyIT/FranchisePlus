import type { ProductClient } from "@/const/product-client.const";
import { Link } from "react-router-dom";
import { createProductSlug } from "@/lib/slugify";

type ProductCardProps = {
	product: ProductClient;
};

export const ProductCard = ({ product }: ProductCardProps) => {
	const productSlug = createProductSlug(product.name, product.id);
	const priceDisplay = product.min_price === product.max_price 
		? `${product.min_price.toLocaleString('vi-VN')}₫`
		: `${product.min_price.toLocaleString('vi-VN')}₫ - ${product.max_price.toLocaleString('vi-VN')}₫`;

	return (
		<Link
			to={`/client/products/${productSlug}`}
			className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200 transition hover:shadow-md"
		>
			<div className="relative overflow-hidden bg-gray-100">
				<img
					src={product.image}
					alt={product.name}
					className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
					loading="lazy"
				/>
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
						{product.SKU}
					</span>
				</div>
			</div>
		</Link>
	);
};

export default ProductCard;

