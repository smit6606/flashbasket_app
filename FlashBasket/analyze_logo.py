import sys
from PIL import Image

def analyze_image(path):
    try:
        img = Image.open(path)
        img = img.convert('RGB')
    except Exception as e:
        print(f"Error opening image: {e}")
        return

    width, height = img.size
    print(f"Size: {width}x{height}")

    # Let's find rows that have non-white pixels
    # Since the background is white, we look for pixels that are not close to (255,255,255)
    def is_white(r, g, b, threshold=245):
        return r > threshold and g > threshold and b > threshold

    pixels = img.load()

    row_content = []
    for y in range(height):
        has_content = False
        for x in range(width):
            r, g, b = pixels[x, y]
            if not is_white(r, g, b):
                has_content = True
                break
        row_content.append(has_content)

    start_y = -1
    regions = []
    for y in range(height):
        if row_content[y] and start_y == -1:
            start_y = y
        elif not row_content[y] and start_y != -1:
            regions.append((start_y, y - 1))
            start_y = -1
    if start_y != -1:
        regions.append((start_y, height - 1))

    print("Regions with content (start_y, end_y):")
    for r in regions:
        print(r)

if __name__ == '__main__':
    analyze_image('/home/dev-05/FlashBasket_Application/FlashBasket/android/app/src/main/res/drawable/splash_logo.png')
