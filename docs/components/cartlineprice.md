---
url: /api/hydrogen/components/cart/cartlineprice
title: CartLinePrice
description: The CartLinePrice component renders a Money component for the cart line merchandise's price or compare at price.
---

The `CartLinePrice` component renders a `Money` component for the cart line merchandise's price or
compare at price. It must be a descendent of a `CartLineProvider` component.

## Example code

```tsx
import {CartLineProvider, useCart, CartLinePrice} from '@shopify/hydrogen';

export function App() {
  const {lines} = useCart();

  return lines.map((line) => {
    return (
      <CartLineProvider key={line.id} line={line}>
        <CartLinePrice priceType="compareAt" />
      </CartLineProvider>
    );
  });
}
```

## Props

| Name       | Type                                      | Description                                                         |
| ---------- | ----------------------------------------- | ------------------------------------------------------------------- |
| priceType? | <code>"regular" &#124; "compareAt"</code> | The type of price. Valid values:`regular` (default) or `compareAt`. |

## Component type

The `CartLinePrice` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`CartLineProvider`](/api/hydrogen/components/cart/cartlineprovider)
- [`Money`](/api/hydrogen/components/primitive/money)
