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
      name: "isAdmin",
      title: "Is Admin",
      type: "boolean",
      description: "Grant full administrative access",
      initialValue: false,
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
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      role: "role",
      isAdmin: "isAdmin",
    },
    prepare(selection: any) {
      const { title, subtitle, role, isAdmin } = selection;
      return {
        title: title || "No Name",
        subtitle: `${subtitle || "No Email"} [${role || "customer"}] ${isAdmin ? "⭐ ADMIN" : ""}`,
      };
    },
  },
};

export const account = {
  name: "account",
  title: "Account",
  type: "document",
  fields: [
    { name: "provider", type: "string" },
    { name: "providerAccountId", type: "string" },
    { name: "type", type: "string" },
    { name: "access_token", type: "string" },
    { name: "token_type", type: "string" },
    { name: "expires_at", type: "number" },
    { name: "refresh_token", type: "string" },
    { name: "scope", type: "string" },
    { name: "id_token", type: "string" },
    { name: "session_state", type: "string" },
    {
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
    },
  ],
};

export const session = {
  name: "session",
  title: "Session",
  type: "document",
  fields: [
    { name: "sessionToken", type: "string" },
    { name: "userId", type: "string" },
    { name: "expires", type: "datetime" },
    {
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
    },
  ],
};

export const verificationToken = {
  name: "verificationToken",
  title: "Verification Token",
  type: "document",
  fields: [
    { name: "identifier", type: "string" },
    { name: "token", type: "string" },
    { name: "expires", type: "datetime" },
  ],
};
