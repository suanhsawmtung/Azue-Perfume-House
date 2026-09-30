import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart.store";
import { type PlaceOrderFormValues } from "@/types/order.type";
import { ArrowLeft } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";

export function CustomerInfoView({
  form,
  subtotal,
  isSubmitting,
}: {
  form: UseFormReturn<PlaceOrderFormValues>;
  subtotal: number;
  isSubmitting: boolean;
}) {
  const { setStep, items } = useCartStore();
  const customerName = form.watch("customerName");
  const customerPhone = form.watch("customerPhone");
  const customerAddress = form.watch("customerAddress");

  const canContinue =
    items.length > 0 &&
    customerName?.trim().length > 0 &&
    customerPhone?.trim().length > 0 &&
    customerAddress?.trim().length > 0;

  const handleContinue = async () => {
    const isValid = await form.trigger([
      "customerName",
      "customerPhone",
      "customerAddress",
    ]);

    if (isValid && items.length > 0) setStep("checkout");
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mb-4"
          disabled={isSubmitting}
          onClick={() => setStep("cart")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Customer Information</h3>
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. John Doe"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 0123456789"
                      type="tel"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. 123 Main St"
                      className="min-h-[100px] resize-none"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Leave at the door"
                      className="min-h-[100px] resize-none"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
      <SheetFooter className="border-border/50 border-t">
        <div className="h-64 w-full space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-muted-foreground">
                {/* {getTotal() >= 100 ? "Free" : "$10.00"} */}
                Free
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-semibold">
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>

          <Button
            type="button"
            className="w-full"
            size="lg"
            disabled={isSubmitting || !canContinue}
            onClick={handleContinue}
          >
            Continue to Payment
          </Button>
        </div>
      </SheetFooter>
    </>
  );
}
