#!/bin/bash

# setup-app-dev.sh
# Master script to install all dependencies for VibeStudio app, submodule, and Roo Code
# This script runs all necessary installation commands in sequence

set -e  # Exit immediately if a command exits with a non-zero status

# Function to display messages with formatting
print_message() {
  echo -e "\n\033[1;36m==>\033[0m \033[1m$1\033[0m"
}

# Function to handle errors
handle_error() {
  echo -e "\n\033[1;31mERROR: $1\033[0m"
  exit 1
}

# Store the root directory
ROOT_DIR="$(pwd)"

# Step 1: Install VibeStudio Roo Code dependencies
print_message "Installing VibeStudio Roo Code dependencies..."
cd "$ROOT_DIR/VibeStudio-Roo-Code" || handle_error "Could not navigate to VibeStudio-Roo-Code directory"
npm run install:all || handle_error "Failed to install VibeStudio Roo Code dependencies"
print_message "VibeStudio Roo Code dependencies installed successfully!"

# Step 2: Install and build VibeStudio submodule
print_message "Installing and building VibeStudio submodule..."
cd "$ROOT_DIR/vibestudio-submodule" || handle_error "Could not navigate to vibestudio-submodule directory"
./scripts/install-and-build.sh || handle_error "Failed to install and build VibeStudio submodule"
print_message "VibeStudio submodule installed and built successfully!"

# Step 3: Install VibeStudio app dependencies
print_message "Installing VibeStudio app dependencies..."
cd "$ROOT_DIR/vibestudio-app" || handle_error "Could not navigate to vibestudio-app directory"
npm install || handle_error "Failed to install VibeStudio app dependencies"
print_message "VibeStudio app dependencies installed successfully!"

# Return to root directory
cd "$ROOT_DIR" || handle_error "Could not navigate back to root directory"

print_message "All installations completed successfully!"
echo "The VibeStudio app, submodule, and Roo Code are now set up and ready for development."

