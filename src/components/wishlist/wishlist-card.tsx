import { cn } from "@/lib/utils";
import { useAuthRequired } from "@/providers/auth-required-provider";
import { productQueryKeys } from "@/services/product/key";
import { useToggleWishlist } from "@/services/wishlist/queries/useToggleWishlist";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import type { WishlistType } from "@/types/wishlist.type";
import { ImageOff, Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export function WishlistCard({ wishlist }: { wishlist: WishlistType }) {
  const { addItem, setIsOpen } = useCartStore();
  const { mutate: toggleWishlist, isPending } = useToggleWishlist();
  const authUser = useAuthStore((state) => state.authUser);
  const { openAuthRequiredDialog } = useAuthRequired();

  const handleAddToCart = () => {
    if (!authUser) {
      openAuthRequiredDialog({
        title: "Sign in to add products to cart.",
        description: "You need to be logged in to add products to cart.",
      });

      return;
    }

    if (wishlist.product.primaryVariantId) {
      addItem({
        id: wishlist.product.primaryVariantId,
        quantity: 1,
      });
      setIsOpen(true);
    }
  };

  const handleRemoveFromWishlist = () => {
    toggleWishlist({
      id: wishlist.product.id,
      action: "remove",
      queryKey: productQueryKeys.detail(wishlist.product.slug, {
        variant: wishlist.product.primaryVariantSlug,
      }),
    });
  };

  return (
    <Card key={wishlist.id} className="group overflow-hidden pt-0">
      <div className="bg-secondary/50 relative aspect-square overflow-hidden">
        <Link to={`/products/${wishlist.product.slug}`}>
          {wishlist.product.image ? (
            <img
              src={wishlist.product.image}
              alt={wishlist.product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="bg-secondary flex h-full items-center justify-center">
              <ImageOff className="text-muted-foreground h-8 w-8" />
            </div>
          )}
        </Link>
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={handleRemoveFromWishlist}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </Button>
      </div>
      <CardContent className="px-4">
        <p className="text-muted-foreground text-xs">
          {wishlist.product.brand}
        </p>
        <Link to={`/products/${wishlist.product.slug}`}>
          <h3 className="mt-1 line-clamp-1 font-medium hover:underline">
            {wishlist.product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          {wishlist.product.discount ? (
            <>
              <p className="font-semibold">{wishlist.product.discount} MMK</p>
              <p className="text-muted-foreground text-sm line-through">
                {wishlist.product.price} MMK
              </p>
            </>
          ) : (
            <p className="font-semibold">{wishlist.product.price} MMK</p>
          )}
        </div>
        <Button
          className={cn("mt-4 w-full transition-all")}
          size="sm"
          onClick={handleAddToCart}
          disabled={!wishlist.product.primaryVariantId}
        >
          <>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        </Button>
      </CardContent>
    </Card>
  );
}
