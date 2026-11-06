from PIL import Image
import vtracer

def png_to_svg_trace(input_png_path, output_svg_path):
    # Load image and convert to black & white (binary)
    img = Image.open(input_png_path).convert('L')
    
    # Threshold the image (adjust 128 as needed for contrast)
    threshold = 128
    bw_img = img.point(lambda p: 255 if p > threshold else 0)
    
    # Convert image data into a Potrace bitmap
    bm = potrace.Bitmap(bw_img)
    path = bm.trace()

    # Write paths to SVG format
    with open(output_svg_path, "w") as f:
        f.write(f'<svg xmlns="C:\Users\USER\OneDrive\Desktop\imran schools\we bsite\images" width="{img.width}" height="{img.height}">')
        for curve in path:
            f.write('  <path d="')
            start = curve.start_point
            f.write(f'M {start.x},{start.y} ')
            for segment in curve.segments:
                if segment.is_corner:
                    c = segment.c
                    e = segment.end_point
                    f.write(f'L {c.x},{c.y} L {e.x},{e.y} ')
                else:
                    c1 = segment.c1
                    c2 = segment.c2
                    e = segment.end_point
                    f.write(f'C {c1.x},{c1.y} {c2.x},{c2.y} {e.x},{e.y} ')
            f.write('" fill="#000000" stroke="none" />\n')
        f.write('</svg>')

    print(f"Successfully traced and saved SVG to {output_svg_path}")

png_to_svg_trace("Logo.png", "icon.svg")
# Example usage:
# png_to_svg_trace("input.png", "output.svg")