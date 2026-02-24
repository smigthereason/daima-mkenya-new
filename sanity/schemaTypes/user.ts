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
    // Payment Methods
    {
      name: 'paymentMethods',
      title: 'Payment Methods',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'paymentMethod',
          fields: [
            {
              name: 'id',
              title: 'ID',
              type: 'string',
            },
            {
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'PesaPal', value: 'pesapal' },
                  { title: 'M-Pesa', value: 'mpesa' }
                ]
              }
            },
            {
              name: 'details',
              title: 'Details',
              type: 'string',
              description: 'Phone number for M-Pesa or account ID for PesaPal'
            },
            {
              name: 'isDefault',
              title: 'Is Default',
              type: 'boolean',
              initialValue: false
            },
            {
              name: 'createdAt',
              title: 'Created At',
              type: 'datetime',
              initialValue: () => new Date().toISOString()
            }
          ],
          preview: {
            select: {
              type: 'type',
              details: 'details',
              isDefault: 'isDefault'
            },
            prepare({ type, details, isDefault }: { type: string; details: string; isDefault: boolean }) {
              return {
                title: type === 'mpesa' ? `M-Pesa: ${details}` : 'PesaPal Account',
                subtitle: isDefault ? 'Default Payment Method' : '',
                media: type === 'mpesa' ? '📱' : '💳'
              };
            }
          }
        }
      ]
    },
    // Addresses
    {
      name: 'addresses',
      title: 'Addresses',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'address',
          fields: [
            {
              name: 'id',
              title: 'ID',
              type: 'string',
            },
            {
              name: 'type',
              title: 'Address Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Shipping', value: 'shipping' },
                  { title: 'Billing', value: 'billing' }
                ]
              }
            },
            {
              name: 'recipientName',
              title: 'Recipient Name',
              type: 'string',
            },
            {
              name: 'phoneNumber',
              title: 'Phone Number',
              type: 'string',
            },
            {
              name: 'addressLine1',
              title: 'Address Line 1',
              type: 'string',
            },
            {
              name: 'addressLine2',
              title: 'Address Line 2',
              type: 'string',
            },
            {
              name: 'city',
              title: 'City',
              type: 'string',
            },
            {
              name: 'state',
              title: 'State/County',
              type: 'string',
            },
            {
              name: 'postalCode',
              title: 'Postal Code',
              type: 'string',
            },
            {
              name: 'country',
              title: 'Country',
              type: 'string',
              initialValue: 'Kenya'
            },
            {
              name: 'isDefault',
              title: 'Is Default',
              type: 'boolean',
              initialValue: false
            },
            {
              name: 'createdAt',
              title: 'Created At',
              type: 'datetime',
              initialValue: () => new Date().toISOString()
            }
          ],
          preview: {
            select: {
              type: 'type',
              recipient: 'recipientName',
              city: 'city',
              isDefault: 'isDefault'
            },
            prepare({ type, recipient, city, isDefault }: { type: string; recipient: string; city: string; isDefault: boolean }) {
              return {
                title: `${type === 'shipping' ? '🚚' : '💰'} ${recipient || 'Address'}`,
                subtitle: `${city || ''} ${isDefault ? '(Default)' : ''}`.trim(),
              };
            }
          }
        }
      ]
    }
  ],
  // FIXED: User preview with emoji instead of image URL
  preview: {
    select: {
      title: 'name',
      subtitle: 'email'
    },
    prepare({ title, subtitle }: { title: string; subtitle: string }) {
      return {
        title,
        subtitle,
        media: '👤' // Simple emoji, not a URL
      };
    }
  }
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