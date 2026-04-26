# PowerShell script to download free-to-use images for clients (Unsplash source)
$imagesPath = Join-Path -Path $PSScriptRoot -ChildPath "..\images\clients"
if (-not (Test-Path $imagesPath)) {
    New-Item -ItemType Directory -Path $imagesPath -Force | Out-Null
}

$downloads = @{
    'residential-home-builder.jpg' = 'https://source.unsplash.com/800x600/?residential,house,construction'
    'construction-contractor.jpg' = 'https://source.unsplash.com/800x600/?construction,site,contractor'
    'real-estate-developer.jpg' = 'https://source.unsplash.com/800x600/?real-estate,developer,building'
    'industrial-warehouse-owner.jpg' = 'https://source.unsplash.com/800x600/?warehouse,industrial,storage'
    'commercial-builder.jpg' = 'https://source.unsplash.com/800x600/?commercial,building,construction'
    'manufacturing-company.jpg' = 'https://source.unsplash.com/800x600/?factory,manufacturing,industry'
}

Write-Host "Downloading client images to:`n $imagesPath`n"
foreach ($file in $downloads.Keys) {
    $url = $downloads[$file]
    $out = Join-Path -Path $imagesPath -ChildPath $file
    Write-Host "Downloading $file from $url"
    try {
        Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing -ErrorAction Stop
    } catch {
        Write-Warning "Failed to download $url : $_"
    }
}

Write-Host "Done. If images look large, consider optimizing them for web (resize/compress)."
