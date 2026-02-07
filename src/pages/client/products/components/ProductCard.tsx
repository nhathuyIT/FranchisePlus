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

			<div className="flex flex-1 flex-col gap-1 p-4">
				<div className="flex flex-col items-start gap-1">
					<h3 className="text-base font-semibold text-neutral-900 line-clamp-2">
						{product.name}
					</h3>
					<span className="mt-1 rounded-full bg-amber-100 px-3 py-1 text-lg font-semibold text-amber-700">
						{product.min_price.toLocaleString("vi-VN")} VND
					</span>
				</div>
			</div>
		</Link>
	);
};

export default ProductCard;
