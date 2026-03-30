import { Badge } from "@/components/ui/badge";
import type { OrderItem } from "@/pages/admin/orders/models/order-management.type";
import { formatCurrency, getProductImage } from "../order-detail.utils";

interface OrderItemsCardProps {
  items: OrderItem[];
}

export function OrderItemsCard({ items }: OrderItemsCardProps) {
  return (
    <section className="rounded-3xl border border-[#E9DED3] bg-white p-5 shadow-[0_18px_40px_-32px_rgba(117,76,36,0.35)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9A7B67]">
            Order Items
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[#3E2723]">
            Snapshot of everything in the bag
          </h2>
        </div>

        <Badge
          variant="outline"
          className="w-fit border-[#E7C49A] bg-[#FFF4E5] text-[#A65A00]"
        >
          {items.length} items
        </Badge>
      </div>

      <div className="mt-6 space-y-4">
        {items.length > 0 ? (
          items.map((item, index) => (
            <article
              key={item.orderItemId}
              className="rounded-3xl border border-[#EEE2D7] bg-[#FFFCF9] p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="h-24 w-24 overflow-hidden rounded-2xl border border-[#E7DBCF] bg-[#FAF1E7]">
                  <img
                    src={getProductImage(item.productImageUrl)}
                    alt={item.productName}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7B67]">
                        Item {index + 1}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-[#3E2723]">
                        {item.productName}
                      </h3>
                      <p className="mt-2 text-sm text-[#6D4C41]">
                        Quantity {item.quantity} and snapshot price{" "}
                        <span className="font-medium text-[#3E2723]">
                          {formatCurrency(item.priceSnapshot)}
                        </span>
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#F0E1CF] bg-[#FFF7EE] px-4 py-3 text-left md:min-w-[170px] md:text-right">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7B67]">
                        Final line total
                      </p>
                      <p className="mt-1 text-base font-semibold text-[#A65A00]">
                        {formatCurrency(item.finalLineTotal)}
                      </p>
                    </div>
                  </div>

                  {item.options.length > 0 ? (
                    <div className="mt-4 space-y-2 border-t border-[#F0E7DE] pt-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7B67]">
                        Options
                      </p>
                      {item.options.map((option, optionIndex) => (
                        <div
                          key={`${item.orderItemId}-option-${optionIndex}`}
                          className="flex flex-col gap-2 rounded-2xl border border-[#EEE2D7] bg-white px-4 py-3 text-sm text-[#5D4037] sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span>{option.productName}</span>
                          <span>
                            x{option.quantity} •{" "}
                            {formatCurrency(option.finalPrice)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E1D5CB] bg-[#FCFAF7] px-5 py-8 text-sm text-[#8D6E63]">
            No item snapshots were returned for this order.
          </div>
        )}
      </div>
    </section>
  );
}
