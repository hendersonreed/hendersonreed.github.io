#!/bin/env python3
import sys
import os
import shutil
import subprocess
import threading


# config variables
image_viewer = "eog"


usage = f"""
pram: preview, rename, and move

for each file in stdin, pram will:
    - preview it using {image_viewer}
    - prompt the user for a new name (hit enter to skip)
    - move it to the destination directory with a new name.

example:
    pram.py --directory <path to destination directory> <image files>
"""


def image_preview(image_files):
    try:
        subprocess.run([image_viewer, *image_files])
    except subprocess.CalledProcessError as e:
        print(f"Error running {image_viewer}: {e}")


def preview_rename_move(image_path, destination_dir):
    try:
        # Open the image for preview
        # subprocess.run([image_viewer, image_path], check=True)

        # Get new file name from user input
        new_name = input(
            f"Enter new name for {os.path.basename(image_path)} (Press Enter to skip): ").strip()

        # If the user provides a new name, move the file
        if new_name:
            new_path = os.path.join(destination_dir, new_name)
            shutil.move(image_path, new_path)
            print(f"Moved '{os.path.basename(image_path)}' to '{new_name}'")
        else:
            print(f"Skipped '{os.path.basename(image_path)}'")

    except subprocess.CalledProcessError as e:
        print(f"Error running {image_viewer}: {e}")
    except Exception as e:
        print(f"Error processing {os.path.basename(image_path)}: {e}")


def main():
    if len(sys.argv) < 4 or sys.argv[1] != "--destination":
        print(usage)
        sys.exit(1)

    destination_dir = sys.argv[2]
    image_files = sys.argv[3:]

    preview_thread = threading.Thread(
        target=image_preview, args=(image_files,))
    preview_thread.start()

    for image_path in image_files:
        preview_rename_move(image_path, destination_dir)

    print("Finished renaming files, please quit image previewer to exit program.")

    preview_thread.join()


if __name__ == "__main__":
    main()
