import { ScrollViewStyleReset } from 'expo-router/html';
import type { ReactNode } from 'react';

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
html, body, #root {
  height: 100%;
}
body {
  background-color: #E4EBE6;
}
#root {
  display: flex;
  max-width: 560px;
  margin: 0 auto;
  background-color: #F3F6F4;
  box-shadow: 0 0 0 1px #C5D2CA;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #080C0A;
  }
  #root {
    background-color: #0E1612;
    box-shadow: 0 0 0 1px #33463C;
  }
}`;
