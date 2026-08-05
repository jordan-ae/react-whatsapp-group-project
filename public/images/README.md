# Mock images

These back the `imageUrl` fields in `src/data/status.js` and `src/data/messages.js`.
Before this folder existed, every image status rendered as a broken-image icon.

## Source & licence

All photos are from [Unsplash](https://unsplash.com) and are used under the
[Unsplash License](https://unsplash.com/license) — free to use for commercial and
non-commercial purposes, no permission or attribution required.

They were fetched at 1000px wide, quality 80, to keep the repo small
(~1.4 MB total). Please keep any images you add in the same ballpark — this is a
demo app, not a photo gallery.

## Adding a new one

1. Drop the file in this folder.
2. Reference it from mock data as `/images/your-file.jpg` (paths in `public/`
   are served from the site root — no import needed).
3. Keep it under ~250 KB.

## Broken images

Never assume an image URL resolves. Use the shared component:

```jsx
import ImageWithFallback from '../common/ImageWithFallback';

<ImageWithFallback
  src={item.imageUrl}
  alt={item.caption}
  className="your-class"
  fallbackLabel="Couldn't load this image"
/>
```

It renders a neutral placeholder instead of the browser's broken-image icon when
`src` is missing or fails to load.
