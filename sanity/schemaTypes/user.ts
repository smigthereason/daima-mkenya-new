// sanity/schemaTypes/user.ts
import { PreviewValue } from "sanity";

export const user = {
  name: "user",
  title: "User",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "email",
      title: "Email",
      type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "url",
    },
    {
      name: "password",
      title: "Password",
      type: "string",
      hidden: true,
    },
    {
      name: "emailVerified",
      title: "Email Verified",
      type: "datetime",
    },
    {
      name: "role",
      title: "User Role",
      type: "string",
      description: "Determines user permissions and access level",
      options: {
        list: [
          { title: "Customer", value: "customer" },
          { title: "Admin", value: "admin" },
          { title: "Manager", value: "manager" },
        ],
        layout: "dropdown",
      },
      initialValue: "customer",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "resetToken",
      title: "Reset Token",
      type: "string",
      hidden: true,
    },
    {
      name: "resetTokenExpiry",
      title: "Reset Token Expiry",
      type: "datetime",
      hidden: true,
    },
    {
      name: "paymentMethods",
      title: "Payment Methods",
      type: "array",
      of: [
        {
          type: "object",
          name: "paymentMethod",
          fields: [
            {
              name: "id",
              title: "ID",
              type: "string",
            },
            {
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "PesaPal", value: "pesapal" },
                  { title: "M-Pesa", value: "mpesa" },
                ],
              },
            },
            {
              name: "details",
              title: "Details",
              type: "string",
              description: "Phone number for M-Pesa or account ID for PesaPal",
            },
            {
              name: "isDefault",
              title: "Is Default",
              type: "boolean",
              initialValue: false,
            },
            {
              name: "createdAt",
              title: "Created At",
              type: "datetime",
              initialValue: () => new Date().toISOString(),
            },
          ],
          preview: {
            select: {
              type: "type",
              details: "details",
              isDefault: "isDefault",
            },
            prepare(selection: Record<string, any>) {
              const { type, details, isDefault } = selection;
              return {
                title:
                  type === "mpesa" ? `M-Pesa: ${details}` : "PesaPal Account",
                subtitle: isDefault ? "Default Payment Method" : "",
                media: type === "mpesa" ? "📱" : "💳",
              };
            },
          },
        },
      ],
    },
    {
      name: "addresses",
      title: "Addresses",
      type: "array",
      of: [
        {
          type: "object",
          name: "address",
          fields: [
            {
              name: "id",
              title: "ID",
              type: "string",
            },
            {
              name: "type",
              title: "Address Type",
              type: "string",
              options: {
                list: [
                  { title: "Shipping", value: "shipping" },
                  { title: "Billing", value: "billing" },
                ],
              },
            },
            {
              name: "recipientName",
              title: "Recipient Name",
              type: "string",
            },
            {
              name: "phoneNumber",
              title: "Phone Number",
              type: "string",
            },
            {
              name: "addressLine1",
              title: "Address Line 1",
              type: "string",
            },
            {
              name: "addressLine2",
              title: "Address Line 2",
              type: "string",
            },
            {
              name: "city",
              title: "City",
              type: "string",
            },
            {
              name: "state",
              title: "State/County",
              type: "string",
            },
            {
              name: "postalCode",
              title: "Postal Code",
              type: "string",
            },
            {
              name: "country",
              title: "Country",
              type: "string",
              initialValue: "Kenya",
            },
            {
              name: "isDefault",
              title: "Is Default",
              type: "boolean",
              initialValue: false,
            },
            {
              name: "createdAt",
              title: "Created At",
              type: "datetime",
              initialValue: () => new Date().toISOString(),
            },
          ],
          preview: {
            select: {
              type: "type",
              recipient: "recipientName",
              city: "city",
              isDefault: "isDefault",
            },
            prepare(selection: Record<string, any>) {
              const { type, recipient, city, isDefault } = selection;
              return {
                title: `${type === "shipping" ? "🚚" : "💰"} ${recipient || "Address"}`,
                subtitle:
                  `${city || ""} ${isDefault ? "(Default)" : ""}`.trim(),
              };
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      role: "role",
    },
    prepare(selection: Record<string, any>): PreviewValue {
      const { title, subtitle, role } = selection;
      const roleEmoji =
        role === "admin" ? "👑" : role === "manager" ? "⚙️" : "👤";

      return {
        title: title || "No Name",
        subtitle: `${subtitle || "No Email"} - ${role || "customer"}`,
        media: roleEmoji,
      };
    },
  },
};

export const account = {
  name: "account",
  title: "Account",
  type: "document",
  fields: [
    {
      name: "provider",
      title: "Provider",
      type: "string",
      description: "OAuth provider name (google, facebook, etc.)",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "providerAccountId",
      title: "Provider Account ID",
      type: "string",
      description: "User ID from the OAuth provider",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "type",
      title: "Account Type",
      type: "string",
      description: "Type of account (oauth, email, credentials)",
      options: {
        list: [
          { title: "OAuth", value: "oauth" },
          { title: "Email", value: "email" },
          { title: "Credentials", value: "credentials" },
        ],
      },
    },
    // NextAuth.js standard fields
    {
      name: "accessToken",
      title: "Access Token",
      type: "string",
      description: "OAuth access token",
      hidden: true,
    },
    {
      name: "accessTokenExpires",
      title: "Access Token Expires",
      type: "number",
      description: "Timestamp when access token expires",
      hidden: true,
    },
    {
      name: "refreshToken",
      title: "Refresh Token",
      type: "string",
      description: "OAuth refresh token",
      hidden: true,
    },
    {
      name: "token_type",
      title: "Token Type",
      type: "string",
      description: "OAuth token type (bearer, etc.)",
      hidden: true,
    },
    {
      name: "expires_at",
      title: "Expires At",
      type: "number",
      description: "Alternative expiration timestamp",
      hidden: true,
    },
    {
      name: "refresh_token",
      title: "Refresh Token (alt)",
      type: "string",
      description: "Alternative refresh token field",
      hidden: true,
    },
    {
      name: "scope",
      title: "Scope",
      type: "string",
      description: "OAuth scope",
      hidden: true,
    },
    {
      name: "id_token",
      title: "ID Token",
      type: "string",
      description: "OAuth ID token",
      hidden: true,
    },
    {
      name: "session_state",
      title: "Session State",
      type: "string",
      description: "OAuth session state",
      hidden: true,
    },
    // Fields seen in your unknown fields warning
    {
      name: "providerId",
      title: "Provider ID",
      type: "string",
      description: "Alternative provider identifier",
      hidden: true,
    },
    {
      name: "providerType",
      title: "Provider Type",
      type: "string",
      description: "Type of provider",
      hidden: true,
    },
    {
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      hidden: true,
    },
  ],
  preview: {
    select: {
      provider: "provider",
      providerAccountId: "providerAccountId",
      userEmail: "user.email",
      userName: "user.name",
      createdAt: "createdAt",
    },
    prepare(selection: Record<string, any>): PreviewValue {
      const { provider, providerAccountId, userEmail, userName, createdAt } =
        selection;

      const providerIcons: { [key: string]: string } = {
        google: "🔵",
        facebook: "🔷",
        apple: "🍎",
        credentials: "🔐",
        github: "🐙",
        twitter: "🐦",
      };

      const icon = providerIcons[provider?.toLowerCase()] || "🔗";
      const displayName = userEmail || userName || "Unknown User";
      const date = createdAt ? new Date(createdAt).toLocaleDateString() : "";

      return {
        title: `${icon} ${provider || "Unknown"} Account`,
        subtitle: `${displayName}${providerAccountId ? ` · ID: ${providerAccountId.substring(0, 8)}...` : ""}${date ? ` · ${date}` : ""}`,
      };
    },
  },
};

export const session = {
  name: "session",
  title: "Session",
  type: "document",
  fields: [
    {
      name: "sessionToken",
      title: "Session Token",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "userId",
      title: "User ID",
      type: "string",
    },
    {
      name: "expires",
      title: "Expires",
      type: "datetime",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      hidden: true,
    },
  ],
  preview: {
    select: {
      sessionToken: "sessionToken",
      userEmail: "user.email",
      userName: "user.name",
      expires: "expires",
      createdAt: "createdAt",
    },
    prepare(selection: Record<string, any>): PreviewValue {
      const { sessionToken, userEmail, userName, expires, createdAt } =
        selection;

      const userDisplay = userEmail || userName || "Unknown";
      const expiryDate = expires
        ? new Date(expires).toLocaleDateString()
        : "No expiry";
      const created = createdAt ? new Date(createdAt).toLocaleDateString() : "";

      return {
        title: `🔐 Session: ${userDisplay}`,
        subtitle: `Expires: ${expiryDate}${created ? ` · Created: ${created}` : ""} · Token: ${sessionToken?.substring(0, 12)}...`,
      };
    },
  },
};

export const verificationToken = {
  name: "verificationToken",
  title: "Verification Token",
  type: "document",
  fields: [
    {
      name: "identifier",
      title: "Identifier",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "token",
      title: "Token",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "expires",
      title: "Expires",
      type: "datetime",
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      identifier: "identifier",
      token: "token",
      expires: "expires",
    },
    prepare(selection: Record<string, any>): PreviewValue {
      const { identifier, token, expires } = selection;

      const expiryDate = expires
        ? new Date(expires).toLocaleDateString()
        : "No expiry";

      return {
        title: `✉️ Verification: ${identifier}`,
        subtitle: `Token: ${token?.substring(0, 8)}... · Expires: ${expiryDate}`,
      };
    },
  },
};
