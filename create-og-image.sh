#!/bin/bash
# Run this in your terminal to create og-image.png

# Option A: Using ImageMagick (if installed)
convert -size 1200x630 xc:'#0c2a2a' \
  -fill '#1e3a8a' -font Arial -pointsize 180 -gravity center \
  -annotate 0 "SIBERINFO" \
  og-image.png

# Option B: Using base64 (save as og-image-base64.txt, then: base64 -d og-image-base64.txt > og-image.png)

echo "Done! Og-image.png created in current folder"
# Move it to your GitHub folder:
# mv og-image.png /xampp/htdocs/WebDev/siberinfo/