#!/bin/env bash

# Set the directory to search for images
directory="./src"

# Set the maximum size (in kb) you want the images to fit within
max_file_size="1024"

# Set the directory to copy the original images
backup_dir="./tools/backup_photos"  # Replace with your desired backup directory

# Find images larger than the maximum file size
find "$directory" -type f -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.bmp" | while read -r image; do
    file_size=$(stat -c%s "$image")
    
    if [ "$file_size" -gt "$((max_file_size * 1024))" ]; then
        # Create the backup directory if it doesn't exist
        mkdir -p "$backup_dir"

        # Copy the original image to the backup directory
        cp -n "$image" "$backup_dir/$(basename "$image")"

        # Resize the image to fit within the maximum file size
        convert "$image" -define jpeg:extent="$max_file_size"k "$image"
        echo "Resized and backed up $image"
    fi
done
