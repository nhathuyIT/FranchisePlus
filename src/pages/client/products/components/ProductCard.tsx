import type { CoffeeProduct } from "@/const/coffee.const";
import { Link } from "react-router-dom";

type ProductCardProps = {
	product: CoffeeProduct;
};

export const ProductCard = ({ product }: ProductCardProps) => {
	return (
		<Link
			to={`/client/products/${product.id}`}
			className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md"
		>
			<div className="relative overflow-hidden bg-neutral-100">
				<img
					src={product.image}
					alt={product.name}
					className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
					loading="lazy"
				/>
			</div>

			<div className="flex flex-1 flex-col gap-1 p-4">
				<div className="flex items-center justify-between gap-3">
					<h3 className="text-base font-semibold text-neutral-900 line-clamp-2">
						{product.name}
					</h3>
					<span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
						{product.min_price.toLocaleString("vi-VN")} VND
					</span>
				</div>
			</div>
		</Link>
	);
};

export default ProductCard;

