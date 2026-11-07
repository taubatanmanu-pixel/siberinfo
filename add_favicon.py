with open(r'C:\xampp\htdocs\WebDev\siberinfo\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the first occurrence of X-Content-Type-Options
idx = html.find('<meta http-equiv="X-Content-Type-Options" content="nosniff">')
if idx >= 0:
    end_idx = html.find('\n', idx)
    insert_pos = end_idx + 1
    
    favicon_code = '''  <!-- Favicon & PWA -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90' font-family='Georgia,serif' font-weight='900'%3ES%3C/text%3E%3Ccircle cx='82' cy='88' r='10' fill='%23dc2626'/%3E%3C/svg%3E">
  <link rel="apple-touch-icon" href="https://siberinfo.id/logo.png">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#dc2626">

  <!-- Canonical URL -->'''
  
  html = html[:insert_pos] + favicon_code + '\n' + html[insert_pos:]
  
  with open(r'C:\xampp\htdocs\WebDev\siberinfo\index.html', 'w', encoding='utf-8') as f:
      f.write(html)
  print("Favicon & PWA links added ✅")
else:
    print("Pattern not found")