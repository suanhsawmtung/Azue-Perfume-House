import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import { formatImagePath, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart.store";
import type { CartItemType } from "@/types/cart.type";
import {
  CreditCard,
  Dot,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link } from "react-router";

interface CartViewProps {
  itemMap: Map<number, CartItemType>;
  isPending: boolean;
  subtotal: number;
  isSubmitting: boolean;
}

export function CartView({
  itemMap,
  isPending,
  subtotal,
  isSubmitting,
}: CartViewProps) {
  const {
    updateQuantity,
    removeItem,
    items: orderItems,
    setStep,
    setIsOpen,
  } = useCartStore();

  if (isPending) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <div className="bg-secondary rounded-full p-6">
          <ShoppingBag className="text-muted-foreground h-8 w-8" />
        </div>
        <div className="text-center">
          <p className="font-medium">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (orderItems.length < 1) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <div className="bg-secondary rounded-full p-6">
          <ShoppingBag className="text-muted-foreground h-8 w-8" />
        </div>
        <div className="text-center">
          <p className="font-medium">Your cart is empty</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Add some fragrances to get started
          </p>
        </div>
        <Link to="/products">
          <Button onClick={() => setIsOpen(false)}>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {orderItems
            .filter((item) => item.quantity > 0)
            .map((item) => {
              const cartItem = itemMap.get(item.productVariantId);

              if (!cartItem) {
                removeItem(item.productVariantId);
                return null;
              }

              return (
                <div key={item.productVariantId} className="flex gap-4 py-3">
                  <div className="bg-secondary/50 relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
                    {cartItem.image && (
                      <img
                        src={formatImagePath(cartItem.image, "product")}
                        alt={cartItem.product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs">
                        {cartItem.product.brand}
                      </p>
                      <p className="line-clamp-1 font-medium">
                        {cartItem.product.name}
                      </p>
                      <div className="gap- flex items-center justify-start">
                        <p className="text-muted-foreground text-xs">
                          {cartItem.size} ml
                        </p>
                        <Dot className="text-muted-foreground" />
                        <p className="text-muted-foreground text-xs">
                          {cartItem.product.concentration}
                        </p>
                        {cartItem.product.isLimited && (
                          <div className="gap- flex items-center">
                            <Dot className="text-muted-foreground" />
                            <p className="text-muted-foreground text-xs">
                              Limited Edition
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            updateQuantity({
                              id: item.productVariantId,
                              quantity: item.quantity - 1,
                            });
                          }}
                          disabled={isSubmitting || item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            updateQuantity({
                              id: item.productVariantId,
                              quantity: item.quantity + 1,
                            });
                          }}
                          disabled={
                            isSubmitting ||
                            item.quantity >= cartItem.stock - cartItem.reserved
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive h-7 w-7"
                        disabled={isSubmitting}
                        onClick={() => removeItem(item.productVariantId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    {cartItem.discount > 0 ? (
                      <div className="flex flex-col items-end">
                        <span className="font-semibold">
                          {cartItem.discount * item.quantity}
                        </span>
                        <span className="text-muted-foreground text-xs line-through">
                          {cartItem.price * item.quantity}
                        </span>
                      </div>
                    ) : (
                      <span className="font-semibold">
                        {cartItem.price * item.quantity}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <SheetFooter className="border-border/50 border-t">
        <div className="w-full space-y-4">
          {/* <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-muted-foreground">
              {getTotal() >= 100 ? "Free" : "$10.00"}
              Free
            </span>
          </div>
          <Separator /> */}
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-lg font-semibold">
              {formatPrice(subtotal)}
            </span>
          </div>
          <Button
            className="w-full"
            size="lg"
            disabled={isSubmitting || orderItems.length === 0}
            onClick={() => {
              if (orderItems.length > 0) setStep("info");
            }}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Proceed to Checkout
          </Button>
        </div>
      </SheetFooter>
    </>
  );
}
