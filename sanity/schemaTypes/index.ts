// sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity'
import { user, account, session, verificationToken } from './user'
import order from './order'

const product: SchemaTypeDefinition = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } },
    { name: 'price', title: 'Price', type: 'string', description: 'e.g., Ksh 8,500' },
    { 
      name: 'category', 
      title: 'Category', 
      type: 'string',
      options: { list: ['Accessories', 'Streetwear', 'Sets', 'Shirts', 'Tops', 'Skirts', 'Dresses', 'Jackets', 'Trousers', 'Knitwear'] }
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'details',
      title: 'Details',
      type: 'object',
      fields: [
        { name: 'material', type: 'string' },
        { name: 'care', type: 'string' },
        { name: 'origin', type: 'string' },
      ]
    },
    {
      name: 'colors',
      title: 'Colors',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string' },
            { name: 'hex', type: 'string' },
          ]
        }
      ]
    },
    { name: 'sizes', title: 'Sizes', type: 'array', of: [{ type: 'string' }] },
    {
      name: 'images',
      title: 'Images',
      type: 'object',
      fields: [
        {
          name: 'hero',
          title: 'Hero Image',
          type: 'image',
          options: { hotspot: true }
        },
        {
          name: 'thumbnails',
          title: 'Thumbnails',
          type: 'array',
          of: [{ type: 'image', options: { hotspot: true } }]
        }
      ]
    },
    {
        name: 'isNew',
        title: 'Is New Arrival',
        type: 'boolean',
        initialValue: false
    }
  ],
}

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, user, account, session, verificationToken, order],
}