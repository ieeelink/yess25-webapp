import os
import concurrent.futures
import subprocess

# Set the directory containing images
INPUT_DIR = "images"  # Change this to your folder path

# WebP compression settings
QUALITY = 85  # Adjust for balance between size and quality
METHOD = 6     # Compression method (higher = better but slower)

# Supported formats for conversion
SUPPORTED_FORMATS = (".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".JPG	")

def compress_webp(image_path):
    """Compress an existing WebP image using cwebp with optimal settings."""
    command = [
        "cwebp", image_path, "-q", str(QUALITY), "-m", str(METHOD), "-sharp_yuv", "-o", image_path
    ]
    
    try:
        subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"✔ Compressed: {image_path}")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error compressing {image_path}: {e}")

def convert_to_webp(image_path):
    """Convert non-WebP images (JPG, PNG, etc.) to WebP and compress them."""
    webp_path = os.path.splitext(image_path)[0] + ".webp"
    command = [
        "cwebp", image_path, "-q", str(QUALITY), "-m", str(METHOD), "-sharp_yuv", "-o", webp_path
    ]
    
    try:
        subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"🔄 Converted: {image_path} → {webp_path}")
        os.remove(image_path)  # Remove original file after conversion
    except subprocess.CalledProcessError as e:
        print(f"❌ Error converting {image_path}: {e}")

def find_images(directory):
    """Recursively find all images in the directory and subdirectories."""
    images = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(".webp") or file.lower().endswith(SUPPORTED_FORMATS):
                images.append(os.path.join(root, file))
    return images

def process_image(image_path):
    """Determine whether to compress or convert an image."""
    if image_path.lower().endswith(".webp"):
        compress_webp(image_path)
    else:
        convert_to_webp(image_path)

def main():
    # Get all images in the folder and subfolders
    images = find_images(INPUT_DIR)
    
    if not images:
        print("No images found.")
        return

    print(f"Found {len(images)} images. Processing...")

    # Use multi-threading to speed up compression and conversion
    with concurrent.futures.ThreadPoolExecutor() as executor:
        executor.map(process_image, images)

    print("✅ All images processed!")

if __name__ == "__main__":
    main()
