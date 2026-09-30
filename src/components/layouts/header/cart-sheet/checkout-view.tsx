import { Button } from "@/components/ui/button";
// import { Form } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import Ayapay from "@/assets/images/ayapay.png";
import Kpay from "@/assets/images/kpay.webp";
import { PaymentProofDialog } from "@/components/order/payment-proof-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { SheetFooter } from "@/components/ui/sheet";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart.store";
import type { PlaceOrderFormValues } from "@/types/order.type";
import {
  ArrowLeft,
  Check,
  CloudUpload,
  Copy,
  CreditCard,
  Eye,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type UseFormReturn } from "react-hook-form";

export function CheckoutView({
  form,
  subtotal,
  isSubmitting,
}: {
  form: UseFormReturn<PlaceOrderFormValues>;
  subtotal: number;
  isSubmitting: boolean;
}) {
  const { setStep, items } = useCartStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = useCallback(() => {
    if (isSubmitting) return;
    fileInputRef.current?.click();
  }, [isSubmitting]);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Store the File object directly
        form.setValue("image", file, { shouldValidate: true });
      }
    },
    [form],
  );

  const handleRemoveImage = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (isSubmitting) return;
      form.resetField("image");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [form, isSubmitting],
  );

  const handlePreviewImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPaymentProofOpen(true);
  };

  const imageFile = form.watch("image");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [paymentProofOpen, setPaymentProofOpen] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setImageUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImageUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const selectedImageName = imageFile?.name ?? "";

  const customerInfoFields = [
    "customerName",
    "customerPhone",
    "customerAddress",
  ] as const;

  const hasCustomerInfo = customerInfoFields.every(
    (field) => form.getValues(field)?.trim().length > 0,
  );
  const canPlaceOrder = items.length > 0 && hasCustomerInfo && !!imageFile;

  return (
    <>
      <div className="w-full flex-1 overflow-y-auto p-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mb-4"
          disabled={isSubmitting}
          onClick={() => setStep("info")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to customer info
        </Button>

        <PaymentMethod isSubmitting={isSubmitting} />

        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem className="my-4 w-full">
              <FormControl>
                <div onClick={handleImageClick}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />

                  {imageUrl ? (
                    <Card className="border-border bg-accent border-2">
                      <CardContent className="flex items-center justify-between gap-x-2.5">
                        <div className="relative aspect-[2/3] h-20 overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={
                              selectedImageName
                                ? `Selected image preview for ${selectedImageName}`
                                : "Selected image preview"
                            }
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        </div>

                        <div className="flex flex-col items-end justify-center gap-y-2">
                          <p className="text-muted-foreground w-62 truncate overflow-hidden text-end text-sm">
                            {selectedImageName}
                          </p>

                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-foreground"
                              onClick={handlePreviewImage}
                              disabled={isSubmitting}
                              aria-label="Preview selected image"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={handleRemoveImage}
                              disabled={isSubmitting}
                              aria-label="Remove selected image"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Button
                      type="button"
                      className="bg-accent hover:bg-accent/80 text-primary w-full"
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center justify-center gap-x-2">
                        <CloudUpload className="h-4 w-4" />
                        Upload Screenshot
                      </div>
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <PaymentProofDialog
        open={paymentProofOpen}
        onOpenChange={setPaymentProofOpen}
        selectedOrderImage={imageFile ? URL.createObjectURL(imageFile) : null}
      />

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
            className="w-full"
            size="lg"
            type="submit"
            disabled={isSubmitting || !canPlaceOrder}
          >
            {isSubmitting ? (
              <>
                <span className="border-background mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                Placing Order...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Place Order
              </>
            )}
          </Button>
        </div>
      </SheetFooter>
    </>
  );
}

const PaymentMethod = ({ isSubmitting }: { isSubmitting: boolean }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "kpay" | "ayapay"
  >("kpay");
  const [isCopied, setIsCopied] = useState(false);

  const paymentMethods: Record<
    "kpay" | "ayapay",
    { src: string; name: string; accountNumber: string; badgeText: string }
  > = {
    kpay: {
      src: Kpay,
      name: "MG SWAM HSAUNG THWAN",
      accountNumber: "09783312791",
      badgeText: "KBZ Pay",
    },
    ayapay: {
      src: Ayapay,
      name: "SUANH SAWM TUNG",
      accountNumber: "09783312791",
      badgeText: "AYA Pay",
    },
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-x-2">
        {Object.entries(paymentMethods).map(([id, value]) => (
          <div
            key={id}
            onClick={() => {
              if (isSubmitting) return;
              setSelectedPaymentMethod(id as "kpay" | "ayapay");
              setIsCopied(false);
            }}
            className={cn(
              "relative flex h-20 cursor-pointer items-center justify-center gap-y-1 rounded-lg border-2",
              isSubmitting && "pointer-events-none opacity-50",
              selectedPaymentMethod === id
                ? "border-primary bg-accent"
                : "border-secondary hover:border-muted-foreground",
            )}
          >
            <div className="h-auto w-2/3">
              <img
                src={value.src}
                alt={id}
                className="z-10 h-full w-full rounded-2xl object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        ))}
      </div>

      <Card className="border-border bg-accent border-2">
        {paymentMethods[selectedPaymentMethod] && (
          <>
            <CardContent className="flex items-end justify-between gap-x-1">
              <div className="space-y-0.5 text-start">
                <p className="text-muted-foreground text-xs tracking-[2px] uppercase">
                  Transfer to
                </p>
                <h3 className="font-semibold tracking-[4px]">
                  {paymentMethods[selectedPaymentMethod].accountNumber}
                </h3>
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={isSubmitting}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(
                    paymentMethods[selectedPaymentMethod].accountNumber,
                  );
                  setIsCopied(true);
                  setTimeout(() => {
                    setIsCopied(false);
                  }, 2000);
                }}
              >
                {isCopied ? (
                  <Check className="h-4 w-4 font-bold" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardContent>

            <CardContent className="flex items-end justify-between gap-x-1">
              <div className="space-y-0.5 text-start">
                <p className="text-muted-foreground text-xs tracking-[2px] uppercase">
                  Account name
                </p>
                <p className="font-semibold">
                  {paymentMethods[selectedPaymentMethod].name}
                </p>
              </div>

              <Badge variant="default">
                {paymentMethods[selectedPaymentMethod].badgeText}
              </Badge>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};
