#!/bin/bash
# Script: Deploy Semua OG Fix untuk Siberinfo
# Run this in C:\xampp\htdocs\WebDev\siberinfo\

echo "🔧 Step 1: Create og-image.png from SVG..."
convert -size 1200x630 xc:'#0c2a2a' -fill '#1e3a8a' -font Arial -pointsize 180 -gravity center -annotate 0 "SIBERINFO" og-image.png 2>/dev/null || echo "ImageMagick not available, using SVG"

echo "📁 Step 2: Check files..."
ls -la og-image.svg og-image.png 2>/dev/null || echo "Note: You need to create og-image.png manually"

echo "📝 Step 3: Update OG tags in index.html..."

# Update og:title, og:description, og:image
sed -i 's/<meta property="og:title" content="Siberinfo - Portal Berita Minimalis">/<meta property="og:title" content="SIBERINFO">/g' index.html
sed -i 's/<meta property="og:description" content="Portal berita minimalis.../g' index.html
sed -i 's|<meta property="og:image" content="https://siberinfo.com/og-image.jpg"/>|<meta property="og:image" content="https://siberinfo.id/og-image.png"/>|g' index.html

echo "💾 Step 4: Git commit & push..."
git add og-image.svg og-image.png index.html 2>/dev/null
git commit -m "Fix OG tags: Dynamic preview for social media"
git push origin main

echo "✅ Done! Refresh in 5-10 minutes."