@echo off
echo Generating favicon files for better search engine visibility...

REM Check if ImageMagick is installed
where magick >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ImageMagick is not installed. Please install it first.
    echo Download from: https://imagemagick.org/script/download.php
    exit /b 1
)

REM Create optimized directory if it doesn't exist
if not exist "assets\optimized" mkdir "assets\optimized"

REM Define source logo
set "SOURCE=assets\optimized\logo.png"

REM Generate favicon.ico with multiple sizes (16, 32, 48)
echo Generating favicon.ico with multiple sizes...
magick "%SOURCE%" -background transparent -define icon:auto-resize=16,32,48 "assets\optimized\favicon.ico"

REM Generate favicon-16x16.png
echo Generating favicon-16x16.png...
magick "%SOURCE%" -background transparent -resize 16x16 "assets\optimized\favicon-16x16.png"

REM Generate favicon-32x32.png
echo Generating favicon-32x32.png...
magick "%SOURCE%" -background transparent -resize 32x32 "assets\optimized\favicon-32x32.png"

REM Generate apple-touch-icon.png (180x180)
echo Generating apple-touch-icon.png...
magick "%SOURCE%" -background transparent -resize 180x180 "assets\optimized\apple-touch-icon.png"

REM Generate android-chrome-192x192.png
echo Generating android-chrome-192x192.png...
magick "%SOURCE%" -background transparent -resize 192x192 "assets\optimized\android-chrome-192x192.png"

REM Generate android-chrome-512x512.png
echo Generating android-chrome-512x512.png...
magick "%SOURCE%" -background transparent -resize 512x512 "assets\optimized\android-chrome-512x512.png"

echo Favicon generation complete!
echo Your site should now appear properly in Google search results.
pause