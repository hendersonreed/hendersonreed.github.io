#!/bin/env bash
set -euo pipefail

echo "-------------------------------"
echo "resizing and backing up images."

# Set the directory to search for images
directory="./src"

# Set the maximum size (in kb) you want the images to fit within
max_size="1920"

# Set the directory to copy the original images
backup_dir="./tools/backup_photos/"  # Replace with your desired backup directory

# Find images larger than the maximum file size
find "$directory" -type f -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.bmp" | while read -r image; do
    image_dimensions=$(identify -format "%wx%h" "$image")

    width=$(echo "$image_dimensions" | cut -d'x' -f1)
    height=$(echo "$image_dimensions" | cut -d'x' -f2)
    
    if [ "$width" -gt $max_size ] || [ "$height" -gt $max_size ]; then
        # Create the backup directory if it doesn't exist
        mkdir -p "$backup_dir"

        # Copy the original image to the backup directory, including directory structure
        cp -n --parents "$image" "$backup_dir"

        # Resize the image to fit within the maximum file size
        convert "$image" -resize 1920x1920 "$image"
        echo "Resized and backed up $image"
    fi
done
