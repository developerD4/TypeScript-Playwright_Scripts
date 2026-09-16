import { test, expect } from '@playwright/test';
import Ajv, { type JSONSchemaType } from 'ajv';

/*
 * JSON Schema:
 * Describes the expected structure and data types of an API response.
 *
 * AJV:
 * A library that validates real JSON data against a JSON Schema.
 *
 * Why use schema validation?
 * Checking many fields one by one becomes repetitive.
 * A schema lets us describe the expected structure once.
 */

const ajv = new Ajv();

interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: {
      usertype: string;
    };
    category: string;
  };
}

// This schema describes what one Product should look like.
const productSchema: JSONSchemaType<Product> = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    price: { type: 'string' },
    brand: { type: 'string' },
    category: {
      type: 'object',
      properties: {
        usertype: {
          type: 'object',
          properties: {
            usertype: { type: 'string' },
          },
          required: ['usertype'],
        },
        category: { type: 'string' },
      },
      required: ['usertype', 'category'],
    },
  },
  required: ['id', 'name', 'price', 'brand', 'category'],
  additionalProperties: true,
};

const productsListSchema = {
  type: 'object',
  properties: {
    responseCode: { type: 'number' },
    products: {
      type: 'array',
      items: productSchema,
    },
  },
  required: ['responseCode', 'products'],
  additionalProperties: false,
} as const;

test('validate the complete products response with JSON Schema', async ({ request }) => {
  const response = await request.get(
    'https://automationexercise.com/api/productsList'
  );

  const body = await response.json();

  // compile() creates a validator function from the schema.
  const validate = ajv.compile(productsListSchema);

  // The validator returns true when the response matches the schema.
  const valid = validate(body);

  // validate.errors gives useful details when validation fails.
  expect(validate.errors, JSON.stringify(validate.errors, null, 2)).toBeNull();
  expect(valid).toBe(true);
});

test('validate one product with the same schema', async ({ request }) => {
  const response = await request.get(
    'https://automationexercise.com/api/productsList'
  );

  const body = await response.json();
  const firstProduct = body.products[0];

  const validate = ajv.compile(productSchema);

  expect(validate(firstProduct), JSON.stringify(validate.errors)).toBe(true);
});

test('schema detects incorrect data', async () => {
  const validate = ajv.compile(productSchema);

  // This object intentionally does not match Product.
  const invalidProduct = {
    id: 'not-a-number',
    name: 'Test Product',
  };

  expect(validate(invalidProduct)).toBe(false);
  expect(validate.errors?.length).toBeGreaterThan(0);
});
