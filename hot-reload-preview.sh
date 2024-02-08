#!/bin/env bash
find src/ header.html footer.html | entr -r "tools/preview.sh"
