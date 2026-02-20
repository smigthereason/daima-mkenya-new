// sanity/schemaTypes/user.ts

export const user = {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'url',
    },
    {
      name: 'password',
      title: 'Password',
      type: 'string',
      hidden: true, // Don't show password in the Sanity Studio UI
    },
    {
      name: 'emailVerified',
      title: 'Email Verified',
      type: 'datetime',
    },
  ],
};

export const account = {
  name: 'account',
  title: 'Account',
  type: 'document',
  fields: [
    { name: 'provider', type: 'string' },
    { name: 'providerAccountId', type: 'string' },
    { name: 'type', type: 'string' },
    { name: 'access_token', type: 'string' },
    { name: 'token_type', type: 'string' },
    { name: 'expires_at', type: 'number' },
    { name: 'refresh_token', type: 'string' },
    { name: 'scope', type: 'string' },
    { name: 'id_token', type: 'string' },
    { name: 'session_state', type: 'string' },
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
    },
  ],
};

export const session = {
  name: 'session',
  title: 'Session',
  type: 'document',
  fields: [
    { name: 'sessionToken', type: 'string' },
    { name: 'userId', type: 'string' },
    { name: 'expires', type: 'datetime' },
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
    },
  ],
};

export const verificationToken = {
  name: 'verificationToken',
  title: 'Verification Token',
  type: 'document',
  fields: [
    { name: 'identifier', type: 'string' },
    { name: 'token', type: 'string' },
    { name: 'expires', type: 'datetime' },
  ],
};