#!/bin/env bash
find src/ | entr -r "tools/preview.sh"
