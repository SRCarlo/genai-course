$ErrorActionPreference = "Stop"

Write-Host "Installing latest dependencies..."
npm install express@latest dotenv@latest groq-sdk@latest

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host ".env created from .env.example"
    Write-Host "Add your GROQ_API_KEY to .env, then run: npm run dev"
} else {
    Write-Host ".env already exists"
}
