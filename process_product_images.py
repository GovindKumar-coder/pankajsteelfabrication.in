from PIL import Image
import os

# Input image path
input_path = r"C:\Users\Pankaj Kumar\OneDrive\Desktop\My new Website\img\owner-photo.jpg"

# Output folder (same as input folder)
output_folder = os.path.dirname(input_path)

# Sizes you want to generate (widths in px)
sizes = [600, 900, 1200, 1600, 1920]

# Open original image
img = Image.open(input_path)

# Loop through sizes and save lossless WebP versions
for width in sizes:
    # Calculate proportional height based on original aspect ratio
    aspect_ratio = img.height / img.width
    height = int(width * aspect_ratio)

    # Resize with high-quality filter
    resized = img.resize((width, height), Image.LANCZOS)

    # Build output filename
    base_name = os.path.splitext(os.path.basename(input_path))[0]
    output_path = os.path.join(output_folder, f"{base_name}-{width}.webp")

    # Save as lossless WebP
    resized.save(output_path, format="WEBP", lossless=True)

    print(f"Saved: {output_path} ({width}x{height})")
