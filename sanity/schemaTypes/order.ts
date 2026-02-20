export default {
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    {
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      readOnly: true,
      description: 'Internal reference (e.g., ORD-2026-X)',
    },
    {
      name: 'pesapalOrderTrackingId',
      title: 'PesaPal Tracking ID',
      type: 'string',
      description: 'The ID returned by PesaPal once the order is registered',
    },
    {
      name: 'status',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Completed', value: 'completed' },
          { title: 'Failed', value: 'failed' },
        ],
      },
      initialValue: 'pending',
    },
    {
      name: 'customer',
      title: 'Customer Details',
      type: 'object',
      fields: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'phone', type: 'string' },
        { name: 'address', type: 'string' },
      ],
    },
    {
      name: 'amount',
      title: 'Total Amount',
      type: 'number',
    },
    {
      name: 'items',
      title: 'Ordered Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productName', type: 'string' },
            { name: 'quantity', type: 'number' },
            { name: 'price', type: 'string' },
            { name: 'size', type: 'string' },
            { name: 'color', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
};