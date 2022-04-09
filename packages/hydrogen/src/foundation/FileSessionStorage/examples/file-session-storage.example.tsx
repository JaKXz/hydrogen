import {
  renderHydrogen,
  FileSessionStorage,
} from '@shopify/hydrogen/FileSessionStorage';
export default renderHydrogen(App, {
  routes,
  shopifyConfig,
  session: MemorySessionStorage('__session', '/home/dev/sessions', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
  }),
});
