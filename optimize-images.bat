@echo off
echo Starting image optimization...

REM Check if ImageMagick is installed
where magick >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ImageMagick is not installed. Please install it first.
    echo Download from: https://imagemagick.org/script/download.php
    exit /b 1
)

REM Create optimized directory if it doesn't exist
if not exist "assets\optimized" mkdir "assets\optimized"

REM Define image size presets
set "HERO_SIZE=1920x1080"
set "FEATURE_SIZE=800x600"
set "ICON_SIZE=120x120"
set "THUMB_SIZE=400x300"

REM Optimize background images
for %%f in (assets\*-bg.jpg) do (
    echo Optimizing background image %%f...
    magick "%%f" -strip -quality 85 -resize "%HERO_SIZE%^>" -sampling-factor 4:2:0 "assets\optimized\%%~nxf"
    magick "%%f" -strip -quality 85 -resize "%HERO_SIZE%^>" -sampling-factor 4:2:0 webp:"assets\optimized\%%~nf.webp"
)

REM Optimize feature images
for %%f in (assets\feature*.png) do (
    echo Optimizing feature image %%f...
    magick "%%f" -strip -quality 85 -resize "%FEATURE_SIZE%^>" "assets\optimized\%%~nxf"
    magick "%%f" -strip -quality 85 -resize "%FEATURE_SIZE%^>" webp:"assets\optimized\%%~nf.webp"
)

REM Optimize logo and icons
for %%f in (assets\logo*.png assets\icon*.png) do (
    echo Optimizing icon %%f...
    magick "%%f" -strip -quality 95 -resize "%ICON_SIZE%^>" "assets\optimized\%%~nxf"
    magick "%%f" -strip -quality 95 -resize "%ICON_SIZE%^>" webp:"assets\optimized\%%~nf.webp"
)

REM Optimize thumbnails and other images
for %%f in (assets\*.jpg assets\*.png) do (
    if not "%%~nf"=="%~nf-bg" if not "%%~nf"=="%~nf\feature*" if not "%%~nf"=="%~nf\logo*" if not "%%~nf"=="%~nf\icon*" (
        echo Optimizing other image %%f...
        magick "%%f" -strip -quality 85 -resize "%THUMB_SIZE%^>" "assets\optimized\%%~nxf"
        magick "%%f" -strip -quality 85 -resize "%THUMB_SIZE%^>" webp:"assets\optimized\%%~nf.webp"
    )
)

REM Copy favicon with minimal compression
if exist "assets\favicon.ico" (
    echo Copying favicon...
    copy "assets\favicon.ico" "assets\optimized\favicon.ico" >nul
)

echo Image optimization complete!
echo WebP versions have been created for modern browsers.
pause