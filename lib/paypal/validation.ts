export type PayPalCapture = {
  id: string;
  status: string;
  amount?: { value: string; currency_code: string };
};

export type PayPalCaptureOrder = {
  status: string;
  purchase_units?: Array<{ payments?: { captures?: PayPalCapture[] } }>;
};

export function captureFromOrder(order: PayPalCaptureOrder) {
  return order.purchase_units?.flatMap((unit) => unit.payments?.captures || [])[0];
}

/** The amount and currency must come from the server-side payment record. */
export function verifiedCapture(
  order: PayPalCaptureOrder,
  expectedAmountMinor: number,
  expectedCurrency: string
) {
  const capture = captureFromOrder(order);
  const amountMinor = capture?.amount ? Math.round(Number(capture.amount.value) * 100) : NaN;
  if (
    order.status !== "COMPLETED" ||
    !capture ||
    capture.status !== "COMPLETED" ||
    capture.amount?.currency_code !== expectedCurrency ||
    amountMinor !== expectedAmountMinor
  ) {
    return null;
  }
  return capture;
}
