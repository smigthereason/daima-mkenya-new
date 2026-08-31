# Daima Mkenya Africa — Invoice redesign async fix

This patch fixes the admin invoice send failure introduced when the redesigned invoice generator became asynchronous in order to load the Daima Mkenya Africa logo.

## Root cause

`buildInvoicePdfBase64()` returns `Promise<string>`, but `sendOrderInvoice()` was passing that Promise into `Buffer.from(...)` instead of awaiting it.

## Fix

- `sendOrderInvoice()` now waits for both the PDF and invoice email HTML before sending:
  - `buildInvoicePdfBase64(order)`
  - `buildInvoiceEmailHtml(order)`
- Uses `Promise.all(...)` so both assets are prepared concurrently.
- Keeps Namecheap SMTP via the shared `sendEmail()` transport.
- Keeps the redesigned invoice styling aligned with the existing Daima Mkenya reply emails.
- Uses the active Sanity logo with `/public/assets/Logo_no-bg.png` as fallback.
- Keeps the PDF attachment as a real `Buffer` after the awaited base64 result is available.

## Files replaced

- `app/admin/orders/actions.ts`
- `lib/orderInvoice.ts`

No checkout/shipping files are changed.
