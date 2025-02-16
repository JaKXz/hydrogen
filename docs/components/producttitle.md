---
url: /api/hydrogen/components/product-variant/producttitle
title: ProductTitle
description: The ProductTitle component renders a span element (or the type of HTML element specified by the as prop) with the product's title.
---

The `ProductTitle` component renders a `span` element (or the type of
HTML element specified by the `as` prop) with the product's [`title`](/api/storefront/reference/products/product).
It must be a descendent of the `ProductProvider` component.

## Example code

```tsx
import {ProductTitle, ProductProvider} from '@shopify/hydrogen';

export function Product({product}) {
  return (
    <ProductProvider data={product}>
      <ProductTitle />
    </ProductProvider>
  );
}
```

## Props

| Name | Type              | Description                                                                                     |
| ---- | ----------------- | ----------------------------------------------------------------------------------------------- |
| as   | <code>TTag</code> | An HTML tag to wrap the title. If not specified, then the title is wrapped in a `span` element. |

## Component type

The `ProductTitle` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`ProductProvider`](/api/hydrogen/components/product-variant/productprovider)
