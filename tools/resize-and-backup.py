#!/bin/env python3
import os
import subprocess

directory = "./src"
max_size = 1920
backup_dir = "./tools/backup_photos"


def get_image_dimensions(image_path):
    # Uses ImageMagick's 'identify' to get image dimensions
    result = subprocess.run(['identify', '-format', '%wx%h', image_path], capture_output=True, text=True)
    return result.stdout.strip()


def resize_image(image_path):
    # Resizes an image to fit inside a 1920x1920 pixel box (preserves ratio)
    # using ImageMagick's 'convert' (overwrites original image.)
    subprocess.run(['convert', image_path, '-resize', f'{max_size}x{max_size}', image_path])


def copy_to_backup(image_path, backup_path):
    # Copies the image to the backup directory
    os.makedirs(os.path.dirname(backup_path), exist_ok=True)
    subprocess.run(['cp', '-n', '--parents', image_path, backup_path])


def main():
    print("-----------------------------------------------------")
    print("resize-and-backup.py: resizing and backing up images.")

    # Walk through all the image files in the directory
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('jpg', 'jpeg', 'png', 'gif', 'bmp')):
                image_path = os.path.join(root, file)
                backup_image_path = os.path.join(backup_dir, image_path)

                if not os.path.isfile(backup_image_path):  # Check if the image already exists in the backup
                    dimensions = get_image_dimensions(image_path)
                    width, height = map(int, dimensions.split('x'))

                    if width > max_size or height > max_size:
                        copy_to_backup(image_path, backup_image_path)
                        resize_image(image_path)
                        print(f"Resized and backed up {image_path}")
                else:
                    print(f"{image_path} already backed up. Skipping.")


if __name__ == "__main__":
    main()
