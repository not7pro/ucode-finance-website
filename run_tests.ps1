# Comprehensive Automated End-to-End Test Suite for Ucode Multi-Portal Platform
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   UCODE GLOBAL MARKETING AGENCY - AUTOMATED TEST SUITE   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$testResults = @()

function Test-Assert {
    param(
        [string]$Category,
        [string]$Name,
        [bool]$Condition,
        [string]$Details = ""
    )
    if ($Condition) {
        Write-Host " [PASS] $Category > $Name" -ForegroundColor Green
        $script:testResults += [PSCustomObject]@{ Category = $Category; Test = $Name; Status = "PASS"; Details = $Details }
    } else {
        Write-Host " [FAIL] $Category > $Name - $Details" -ForegroundColor Red
        $script:testResults += [PSCustomObject]@{ Category = $Category; Test = $Name; Status = "FAIL"; Details = $Details }
    }
}

# ----------------------------------------------------
# 1. HTTP Server & Asset Verification
# ----------------------------------------------------
Write-Host "`n1. Testing HTTP Server & Asset Availability..." -ForegroundColor Yellow
$urls = @(
    "http://localhost:5500/",
    "http://localhost:5500/style.css",
    "http://localhost:5500/style-additions.css",
    "http://localhost:5500/theme-ucode.css",
    "http://localhost:5500/script.js",
    "http://localhost:5500/logo.png"
)

foreach ($u in $urls) {
    try {
        $res = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 5
        Test-Assert "HTTP Endpoints" "Endpoint $u" ($res.StatusCode -eq 200) "Status $($res.StatusCode), ContentLength: $($res.Content.Length)"
    } catch {
        Test-Assert "HTTP Endpoints" "Endpoint $u" $false $_.Exception.Message
    }
}

# ----------------------------------------------------
# 2. HTML DOM & Component Integrity
# ----------------------------------------------------
Write-Host "`n2. Testing HTML Structure & Critical DOM Components..." -ForegroundColor Yellow
$htmlContent = Get-Content -Path .\index.html -Raw

$requiredViews = @(
    "dashboard-view",
    "employee-portal-view",
    "growth-studio-view",
    "client-portal-view"
)
foreach ($v in $requiredViews) {
    $exists = $htmlContent -match "id=['`"]$v['`"]"
    Test-Assert "DOM Views" "View Container #$v" $exists "Found in index.html"
}

$requiredModals = @(
    "transaction-modal",
    "project-modal",
    "goal-modal",
    "transfer-modal",
    "smm-client-modal",
    "smm-post-modal",
    "client-new-request-modal",
    "client-bank-slip-modal",
    "client-proofing-comment-modal",
    "client-testimonial-modal",
    "client-print-proof-modal",
    "client-addon-order-modal",
    "client-staging-modal",
    "proposal-generator-modal",
    "staff-submit-modal",
    "staff-log-hours-modal",
    "ai-bot-demo-modal",
    "schedule-print-modal",
    "add-pin-modal"
)
foreach ($m in $requiredModals) {
    $exists = $htmlContent -match "id=['`"]$m['`"]"
    Test-Assert "DOM Modals" "Modal #$m" $exists "Found in index.html"
}

# Role Selector Chips
$chips = @("chip-admin", "chip-staff", "chip-client")
foreach ($c in $chips) {
    $exists = $htmlContent -match "id=['`"]$c['`"]"
    Test-Assert "DOM Auth" "Login Role Chip #$c" $exists "Role selector active"
}

# World Clocks & Operations Ribbon
$clocks = @("agency-ops-ribbon", "clock-dxb", "clock-lon", "clock-nyc", "clock-cmb")
foreach ($clk in $clocks) {
    $exists = $htmlContent -match "id=['`"]$clk['`"]"
    Test-Assert "Operations Ribbon" "Telemetry Element #$clk" $exists "Clock/Ribbon ready"
}

# Pre-Press Proofing Canvas
$proofItems = @("interactive-proof-canvas", "prepress-bleed-overlay", "btn-toggle-bleed")
foreach ($pi in $proofItems) {
    $exists = $htmlContent -match "id=['`"]$pi['`"]"
    Test-Assert "Proofing Suite" "Element #$pi" $exists "Prepress proofing ready"
}

# Physical Print Execution Tracker
$printItems = @("print-tasks-list", "print-task-1", "print-task-2")
foreach ($pti in $printItems) {
    $exists = $htmlContent -match "id=['`"]$pti['`"]"
    Test-Assert "Physical Printing" "Element #$pti" $exists "Print task ready"
}

# ----------------------------------------------------
# 3. JavaScript Architecture & Handlers
# ----------------------------------------------------
Write-Host "`n3. Testing JavaScript Functions & Controllers..." -ForegroundColor Yellow
$jsContent = Get-Content -Path .\script.js -Raw

$requiredFunctions = @(
    "switchPortalRole",
    "playUiSound",
    "updateWorldClocks",
    "toggleProofBleedGuides",
    "openPinModalAt",
    "promptManualPin",
    "openSchedulePrintModal",
    "downloadClientContractPdf",
    "openClientStagingModal",
    "setStagingDevice",
    "openProposalGeneratorModal",
    "updateProposalPricingPreview",
    "openAiBotDemoModal",
    "calculateGrowthSim",
    "moveKanbanTask",
    "filterKanban",
    "updatePrintTaskStatus",
    "openOrderAddonModal",
    "exportGrowthReport"
)

foreach ($fn in $requiredFunctions) {
    $exists = $jsContent -match "\b$fn\b"
    Test-Assert "JS Controller" "Function $fn()" $exists "Defined in script.js"
}

# ----------------------------------------------------
# 4. Live Browser Execution & Runtime Test via Chrome Headless
# ----------------------------------------------------
Write-Host "`n4. Testing Live Browser Execution via Google Chrome..." -ForegroundColor Yellow

$chromeExe = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (Test-Path $chromeExe) {
    $cdpPort = 9222
    $chromeProc = Start-Process -FilePath $chromeExe -ArgumentList `
        "--headless=new", `
        "--no-sandbox", `
        "--disable-gpu", `
        "--remote-debugging-port=$cdpPort", `
        "http://localhost:5500/" `
        -PassThru

    Start-Sleep -Seconds 3

    try {
        $tabs = Invoke-RestMethod -Uri "http://localhost:$cdpPort/json" -UseBasicParsing -TimeoutSec 5
        Test-Assert "Chrome Runtime" "Chrome Headless CDP Connection" ($tabs.Count -gt 0) "Tabs detected: $($tabs.Count)"
        
        $targetTab = $tabs | Where-Object { $_.url -match "localhost:5500" } | Select-Object -First 1
        if ($targetTab) {
            Test-Assert "Chrome Runtime" "Page Loaded Successfully in Chrome" ($targetTab.title -match "Ucode") "Tab title: '$($targetTab.title)'"
            Test-Assert "Chrome Runtime" "Correct Target URL Running" ($targetTab.url -eq "http://localhost:5500/") "URL: $($targetTab.url)"
        }
    } catch {
        Test-Assert "Chrome Runtime" "Chrome Headless Verification" $false $_.Exception.Message
    } finally {
        if ($chromeProc -and -not $chromeProc.HasExited) {
            Stop-Process -Id $chromeProc.Id -Force -ErrorAction SilentlyContinue
        }
    }
} else {
    Write-Host "Chrome executable not found at expected path, skipping CDP step." -ForegroundColor Yellow
}

# ----------------------------------------------------
# Summary
# ----------------------------------------------------
Write-Host "`n==========================================================" -ForegroundColor Cyan
$passed = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$total  = $testResults.Count

Write-Host "   TEST RESULTS: $passed PASSED / $failed FAILED (Total: $total)   " -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================================" -ForegroundColor Cyan

if ($failed -gt 0) {
    exit 1
} else {
    exit 0
}
