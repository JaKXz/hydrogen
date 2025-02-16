---
title: CartCheckoutButton
description: The CartCheckoutButton renders a button that redirects to checkoutUrl for the cart.
---

The `CartCheckoutButton` component renders a button that redirects to the checkout URL for the cart.

> Note:
> It must be a descendent of a `CartProvider` component.

## Component type

The `CartCheckoutButton` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Example code

{% codeblock file %}

```jsx
import {CartCheckoutButton, CartProvider} from '@shopify/hydrogen';

export class MyComponent() {
  return (
    <CartProvider>
      <CartCheckoutButton>Checkout</CartCheckoutButton>
    </CartProvider>
  )
}
```

{% endcodeblock %}

## Props

| Name     | Type                   | Description            |
| -------- | ---------------------- | ---------------------- |
| children | <code>ReactNode</code> | A `ReactNode` element. |

## Related components

- [CartProvider](/api/hydrogen/components/cart/cartprovider)

## Related hooks

- [useCartCheckoutUrl](/api/hydrogen/hooks/cart/usecartcheckouturl)
