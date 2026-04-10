from PIL import Image

def modify():
    try:
        path = '/home/dev-05/FlashBasket_Application/FlashBasket/android/app/src/main/res/drawable/splash_logo.png'
        img = Image.open(path)
        img = img.convert('RGBA')
        pixels = img.load()
        width, height = img.size
        # The text is at 963-992. Let's clear everything below y=800.
        for y in range(800, height):
            for x in range(width):
                # Set to transparent or white depending on background
                # The splash screen background is usually white, let's look at image edges.
                # Assuming background is transparent:
                r, g, b, a = pixels[x, y]
                pixels[x, y] = (255, 255, 255, 0)
        
        img.save(path)
        print("Image modified successfully")
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    modify()
