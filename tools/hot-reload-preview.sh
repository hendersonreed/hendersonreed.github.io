#!/bin/env bash
find src header.html footer.html -type f -regex '.*\.\(md\|js\|html\)' | entr -r "tools/preview.sh"
