import os
from PIL import Image

# Paths
source_folder = r"C:\Users\Pankaj Kumar\OneDrive\Desktop\pankajsteelfabrication.in\img\Products\steel-gates\source"
build_folder = r"C:\Users\Pankaj Kumar\OneDrive\Desktop\pankajsteelfabrication.in\img\Products\steel-gates\build"

# Target max dimensions (aspect ratio preserved)
variants = {
    "display": (900, 1200),
    "thumbs": (260, 350),
    "zoom-desktop": (1200, 1600),
    "zoom-tablet": (1024, 1365),
    "zoom-mobile": (900, 1200),
    "webp-original": None
}

# Create subfolders if not exist
for v in variants.keys():
    os.makedirs(os.path.join(build_folder, v), exist_ok=True)

print("Script started...")

# Process images
for idx, filename in enumerate(sorted(os.listdir(source_folder)), start=1):
    if filename.lower().endswith((".jpg", ".jpeg", ".png")):
        file_path = os.path.join(source_folder, filename)
        img = Image.open(file_path).convert("RGB")

        new_base = f"steel-gates-{idx:03d}.webp"
        orig_w, orig_h = img.size

        for variant, max_size in variants.items():
            new_path = os.path.join(build_folder, variant, new_base)

            if max_size:
                max_w, max_h = max_size
                img_copy = img.copy()
                img_copy.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
                img_copy.save(new_path, "webp", lossless=True)
            else:
                img.save(new_path, "webp", lossless=True)

        print(f"Processed: {filename} → {new_base} ({orig_w}x{orig_h})")

print("✅ All images converted and saved into build folders.")
