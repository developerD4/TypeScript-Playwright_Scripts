// 04-json-schema-validation.spec.ts
//
// TOPIC: performing JSON schema validation on API responses
//
// Site used: https://automationexercise.com/api (see sites.txt #4)
//
// tests/05-Assertions & Validations/06-validating-api-responses.spec.ts
// checked individual fields by hand (expect(typeof x.id).toBe('number'),
// one line per field). That works, but doesn't scale to a response with
// 20+ fields, and re-checks the same shape differently in every test that
// happens to touch that endpoint. A JSON SCHEMA describes the whole shape
// ONCE, declaratively, and a validator library (ajv here — the most
// widely used JSON Schema validator in the Node ecosystem) checks a real
// response against it in one call.

import { test, expect } from '@playwright/test';
import Ajv, { type JSONSchemaType } from 'ajv';

const ajv = new Ajv();

interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: { usertype: string };
    category: string;
  };
}

// The schema is the single source of truth for "what a Product looks
// like" — JSONSchemaType<Product> makes TypeScript cross-check the
// schema itself against the Product interface, so the two can't silently
// drift apart.
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
          properties: { usertype: { type: 'string' } },
          required: ['usertype'],
        },
        category: { type: 'string' },
      },
      required: ['usertype', 'category'],
    },
  },
  required: ['id', 'name', 'price', 'brand', 'category'],
  additionalProperties: true, // don't fail on fields the schema doesn't know about yet
};

const productsListSchema = {
  type: 'object',
  properties: {
    responseCode: { type: 'number' },
    products: { type: 'array', items: productSchema },
  },
  required: ['responseCode', 'products'],
  additionalProperties: false,
} as const;

test('every product in the list matches the Product schema', async ({ request }) => {
  const response = await request.get('https://automationexercise.com/api/productsList');
  const body = await response.json();

  const validate = ajv.compile(productsListSchema);
  const valid = validate(body);

  // On failure, validate.errors lists EVERY mismatch — which field,
  // what was expected, what was found — instead of a single generic
  // "shape doesn't match" message.
  expect(validate.errors, JSON.stringify(validate.errors, null, 2)).toBeNull();
  expect(valid).toBe(true);
});

test('validating a single object, without a wrapping list schema', async ({ request }) => {
  const response = await request.get('https://automationexercise.com/api/productsList');
  const body = await response.json();
  const firstProduct = body.products[0];

  const validateProduct = ajv.compile(productSchema);
  const valid = validateProduct(firstProduct);

  expect(valid, JSON.stringify(validateProduct.errors)).toBe(true);
});

test('a schema catches a genuinely malformed response, not just a merely different one', async () => {
  const validate = ajv.compile(productSchema);

  const malformedProduct = {
    id: 'not-a-number', // wrong type
    name: 'Blue Top',
    // price, brand, category are all missing entirely
  };

  const valid = validate(malformedProduct);

  expect(valid).toBe(false);
  expect(validate.errors?.length).toBeGreaterThan(0);

  const errorPaths = validate.errors?.map((e) => e.instancePath || e.params);
  expect(errorPaths).toBeDefined();
});

test('schemas can enforce constraints beyond plain "type", e.g. string patterns', async ({
  request,
}) => {
  // A stricter schema than the ones above — this one insists price
  // matches SauceDemo-shop-style formatting ("Rs. <number>"), which is a
  // real constraint of this specific API's data, not just "it's a string".
  const strictProductSchema = {
    type: 'object',
    properties: {
      price: { type: 'string', pattern: '^Rs\\. \\d+$' },
    },
    required: ['price'],
  } as const;

  const response = await request.get('https://automationexercise.com/api/productsList');
  const body = await response.json();

  const validate = ajv.compile(strictProductSchema);
  for (const product of body.products) {
    expect(validate(product), JSON.stringify(validate.errors)).toBe(true);
  }
});
