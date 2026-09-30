import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/orders/useCart";
import { usePlaceOrder } from "@/services/order/queries/usePlaceOrder";
import { useCartStore, type CheckoutStep } from "@/stores/cart.store";
import { type PlaceOrderFormValues } from "@/types/order.type";
import { placeOrderSchema } from "@/validations/order.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { CartView } from "./cart-view";
import { CheckoutView } from "./checkout-view";
import { CustomerInfoView } from "./customer-info-view";
import { SuccessView } from "./success-view";

export function CartSheet() {
  const { isOpen, setIsOpen, step, items } = useCartStore();

  const titles: Record<CheckoutStep, string> = {
    cart: `Shopping Cart`,
    info: "Customer Contact Info",
    checkout: "Checkout",
    success: "Order Complete",
  };

  const form = useForm<PlaceOrderFormValues>({
    resolver: zodResolver(placeOrderSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerAddress: "",
      customerNotes: "",
      items,
      image: undefined,
    },
  });

  useEffect(() => {
    form.setValue("items", items, { shouldValidate: true });
  }, [form, items]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-md"
        aria-describedby="hello"
      >
        <SheetHeader>
          <SheetTitle>{titles[step]}</SheetTitle>
        </SheetHeader>

        <CheckoutForm form={form} />
      </SheetContent>
    </Sheet>
  );
}

export const CheckoutForm = ({
  form,
}: {
  form: UseFormReturn<PlaceOrderFormValues>;
}) => {
  const { step, setStep, clearCart, items } = useCartStore();

  const { itemMap, isPending, subtotal } = useCart();

  const placeOrderMutation = usePlaceOrder();

  const onSubmit = (values: PlaceOrderFormValues) => {
    const formData = new FormData();
    formData.append("customerName", values.customerName);
    formData.append("customerPhone", values.customerPhone);
    formData.append("customerAddress", values.customerAddress);
    formData.append("items", JSON.stringify(values.items));
    if (values.image) {
      formData.append("image", values.image);
    }

    if (values.customerNotes) {
      formData.append("customerNotes", values.customerNotes);
    }

    placeOrderMutation.mutate(
      { data: formData },
      {
        onSuccess: () => {
          clearCart();
          form.reset();
          setStep("success");
        },
      },
    );
  };

  return (
    <>
      {step === "cart" && (
        <CartView
          itemMap={itemMap}
          isPending={isPending}
          subtotal={subtotal}
          isSubmitting={placeOrderMutation.isPending}
        />
      )}

      {items.length > 0 && (
        <>
          {step !== "success" && step !== "cart" && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex h-full flex-col justify-between"
              >
                {step === "info" && (
                  <CustomerInfoView
                    subtotal={subtotal}
                    form={form}
                    isSubmitting={placeOrderMutation.isPending}
                  />
                )}
                {step === "checkout" && (
                  <CheckoutView
                    form={form}
                    subtotal={subtotal}
                    isSubmitting={placeOrderMutation.isPending}
                  />
                )}
              </form>
            </Form>
          )}
        </>
      )}

      {step === "success" && <SuccessView />}
    </>
  );
};
