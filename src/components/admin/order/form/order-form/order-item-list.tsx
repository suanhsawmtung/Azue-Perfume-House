import { Button } from "@/components/ui/button";
import { FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useWatch } from "react-hook-form";

export const OrderItemList = ({ fields, remove, variantMap, control, disabled }: { 
  fields: any[]; 
  remove: (index: number) => void;
  variantMap: Record<number, any>;
  control: any;
  disabled?: boolean;
}) => {
  const watchedItems = useWatch({
    control,
    name: "items",
    defaultValue: fields,
  });

  if (fields.length === 0) return null;

  return (
    <div className="space-y-2">
      {fields.map((field, index) => {
        const metadata = variantMap[field.itemId];
        const currentItem = watchedItems?.[index] || field;
        const currentPrice = currentItem.price || 0;
        const currentQty = currentItem.quantity || 0;

        return (
          <div key={field.id} className="flex flex-col md:flex-row md:items-center gap-4 rounded-lg border p-4 bg-background">
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">
                {metadata?.productName || "Unknown Product"}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="bg-muted px-1.5 py-0.5 rounded">{metadata?.sku || "NO-SKU"}</span>
                <span>•</span>
                <span>{metadata?.size}ml</span>
                <span>•</span>
                <span>{metadata?.brandName}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:w-auto items-center">
              <div className="flex flex-col gap-1 w-24">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Price</span>
                <div className="flex flex-col text-sm">
                  {metadata?.originalPrice && Number(metadata.originalPrice) > Number(currentPrice) ? (
                    <div className="flex items-end gap-1">
                      <span className="text-muted-foreground line-through text-[10px]">
                        {formatPrice(metadata.originalPrice)}
                      </span>
                      <span className="font-semibold">{formatPrice(currentPrice)}</span>
                    </div>
                  ) : (
                    <span className="font-semibold">{formatPrice(currentPrice)}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                  Qty
                  {metadata?.stock && ` (${metadata?.stock} left)`}
                </span>
                <FormField
                  control={control}
                  name={`items.${index}.quantity`}
                  render={({ field: qtyField }) => (
                    <>
                      <Input
                        type="number"
                        className="h-8 w-20"
                        {...qtyField}
                        min={1}
                        max={metadata?.stock}
                        disabled={disabled}
                        onChange={(e) =>
                          qtyField.onChange(
                            Math.min(
                              metadata?.stock,
                              Math.max(1, Number(e.target.value)),
                            ),
                          )
                        }
                      />
                      <FormMessage />
                    </>
                  )}
                />
              </div>

              <div className="hidden lg:flex flex-col gap-1 text-right">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Total</span>
                <span className="font-semibold">{formatPrice(currentPrice * currentQty)}</span>
              </div>
            </div>

            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
