# Image Assets Guide

This folder contains all image assets for the Mahii application.

## Folder Structure

```
images/
├── mess/              # Mess food images
│   ├── mess.jpg       # Category card image (400x300px)
│   ├── thali.jpg      # Recommended item image (600x400px)
│   ├── student_mess.jpg   # Popular mess image (600x400px)
│
├── hotel/             # Hotel images
│   ├── hotel.jpg      # Category card image (400x300px)
│   └── royal_spice.jpg    # Popular hotel image (600x400px)
│
├── cafe/              # Café images
│   ├── cafe.jpg       # Category card image (400x300px)
│   └── brewtime.jpg   # Popular café image (600x400px)
│
├── dessert/           # Dessert images
│   └── dessert.jpg    # Category card image (400x300px)
│
├── stall/             # Street food stall images
│   ├── stall.jpg      # Category card image (400x300px)
│   └── burger.jpg     # Food item image (600x400px)
│
└── all-food.jpg       # General food image for "All" category (400x300px)
```

## Image Specifications

### Category Card Images
- **Dimensions**: 400x300px
- **File Names**: `[category].jpg`
- **Used**: Category filter buttons in Explore page and Home page
- **Location**: `/images/[category]/[category].jpg`

### Featured Items & Popular Places
- **Dimensions**: 600x400px
- **File Names**: Descriptive names (e.g., `thali.jpg`, `royal_spice.jpg`)
- **Used**: Recommended items and popular shops sections
- **Location**: `/images/[category]/[filename].jpg`

## How to Add Images

### Step 1: Prepare Your Images

1. Ensure images are in one of these formats:
   - JPG (recommended for photos)
   - PNG (for graphics with transparency)
   - WEBP (for better compression)

2. Optimize image sizes:
   - Category cards: 400x300px
   - Featured items: 600x400px
   - Compress images to reduce file size

### Step 2: Add Images to Folders

1. Navigate to the respective category folder
2. Add your images with the names mentioned in the structure
3. Example:
   - `/images/mess/mess.jpg` - Category cover
   - `/images/mess/thali.jpg` - Recommended dish
   - `/images/mess/student_mess.jpg` - Popular establishment

### Step 3: Verify Images Load

1. Start the application
2. Go to Home page (`/`)
3. Verify category cards show images
4. Check Explore page (`/explore`)
5. Verify all category filters display images

## Fallback Behavior

If an image fails to load:
- Home page: Displays the category name without image
- Explore page: Uses placeholder background from placeholde.co
- A `onError` handler automatically provides a fallback placeholder

## Current Image References

### Home Page (Implemented)
- Categories: `/images/[category]/[category].jpg`
- Recommended items: `/images/mess/thali.jpg`, `/images/stall/burger.jpg`
- Popular places: `/images/hotel/royal_spice.jpg`, `/images/cafe/brewtime.jpg`, `/images/mess/student_mess.jpg`

### Explore Page (Implemented)
- Category buttons: `/images/[category]/[category].jpg`
- All category button: `/images/all-food.jpg`

## Sample Images

For testing, you can add either:

1. **Professional Food Photos**: 
   - Download from Unsplash, Pexels, or Pixabay
   - Resize to required dimensions
   - Save in respective folders

2. **Placeholder Images**:
   - Use online tools to generate placeholder images
   - Save temporarily for testing

## Notes

- All image paths are relative to the `/public/images/` directory
- Images are served as static files by the React development server
- In production, ensure images are optimized for web delivery
- Consider using image CDN for faster loading in production
