# Typography Configuration

## Google Fonts Import

Add to your HTML `<head>` or CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

## Font Usage

- **Headings:** Inter (font-semibold)
- **Body text:** Inter (font-normal)
- **Code/technical:** JetBrains Mono — used for cron expressions, log outputs, file paths, and cost values

## Tailwind Configuration

```css
/* In your main CSS file with Tailwind v4 */
@theme {
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```
