# Daima Mkenya Africa — Namecheap SMTP Email Patch

This patch removes the Resend provider from the application email paths and routes mail through the existing Namecheap Private Email mailbox.

## Required environment variables

Add these to `.env.local` for local development and to the deployed project's environment variables:

```env
SMTP_HOST=mail.privateemail.com
SMTP_PORT=465
SMTP_USER=info@daimamkenyaafrica.com
SMTP_PASSWORD=YOUR_NAMECHEAP_MAILBOX_OR_APPLICATION_PASSWORD
EMAIL_FROM="Daima Mkenya Africa <info@daimamkenyaafrica.com>"
ORDER_NOTIFICATION_EMAIL=info@daimamkenyaafrica.com
```

`SMTP_PASSWORD` must never be committed to Git.

The email helper also accepts the older `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USER`, and `EMAIL_SERVER_PASSWORD` names for backwards compatibility, but the `SMTP_*` names above are recommended.

For port 465 the application uses SSL/TLS. If you intentionally change `SMTP_PORT` to 587, the helper uses STARTTLS.

## Email paths covered

- Customer contact form -> `info@daimamkenyaafrica.com`
- Admin contact-submission replies -> customer
- Newsletter signup welcome email -> subscriber
- New collection / announcement batch -> customers
- Password-reset email -> user
- Paid-order notification -> store inbox
- Admin order invoice -> customer, with PDF invoice attachment
- Admin price-inquiry reply -> customer

The price-inquiry page previously only logged a communication and showed a success state. It now sends the email first and only records the communication after the SMTP send is accepted.

## Bulk announcement protection

Namecheap Private Email limits a single message to 50 recipients and currently limits paid Private Email mailboxes to 500 outgoing recipients per hour. The shared bulk helper:

- de-duplicates customer addresses;
- sends recipients through BCC so customers cannot see one another's addresses;
- chunks each SMTP message to no more than 50 BCC recipients;
- refuses a single application batch above 500 recipients instead of partially sending an oversized run.

If the mailing list grows beyond that level, use a dedicated marketing/bulk email provider for announcement campaigns while keeping transactional mail on the Namecheap mailbox.

## Resend cleanup

- `resend` has been removed from `package.json` and `package-lock.json`.
- There are no remaining `Resend`, `resend.emails.send`, or `RESEND_API_KEY` code references in the patched application.
- After the SMTP deployment is verified, `RESEND_API_KEY` can be removed from local/deployment environment variables.

## First verification

1. Add the SMTP environment variables.
2. Restart `npm run dev` after changing `.env.local`.
3. Open Admin -> Orders.
4. Find the waiting customer's order.
5. Click **Send Invoice**.
6. Confirm the UI reports success and the customer receives the email with the PDF attachment.
7. Check the sent folder of `info@daimamkenyaafrica.com` and the recipient inbox/spam folder.

Then smoke-test password reset, contact reply, newsletter welcome, and inquiry reply before deployment.
