## How to merge multiple images to one image

Using Linux Command Line (ImageMagick)
If you are on Linux, ImageMagick is likely already installed. It is incredibly powerful for "one-liner" operations.

Horizontal Merge (Side-by-Side)
Use the +append flag:

magick image1.jpg image2.jpg +append output.jpg

Vertical Merge (Stacked)
Use the -append flag:

```
magick image1.jpg image2.jpg -append output.jpg
```