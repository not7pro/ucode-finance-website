param([string]$OutDir = "C:\Users\Administrator\.gemini\antigravity-ide\brain\4504ca1d-655b-4497-917d-d2c16861ed9a\scratch\shots", [int]$Width = 1440)
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$cdpPort = 9240
$chromeExe = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$tempDir = Join-Path $env:TEMP ("chrome_shot_" + [System.Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $tempDir | Out-Null
$chromeProc = Start-Process -FilePath $chromeExe -ArgumentList "--headless=new","--no-sandbox","--disable-gpu","--hide-scrollbars","--user-data-dir=$tempDir","--remote-debugging-port=$cdpPort","--window-size=$Width,900","http://localhost:5500/" -PassThru
Start-Sleep -Seconds 3
$ct = [System.Threading.CancellationToken]::None
try {
    $tab = (Invoke-RestMethod -Uri "http://localhost:$cdpPort/json") | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
    $ws = New-Object System.Net.WebSockets.ClientWebSocket
    $ws.ConnectAsync([uri]$tab.webSocketDebuggerUrl, $ct).Wait()
    $script:id = 0
    function Cdp([string]$method, $params) {
        $script:id++
        $cur = $script:id
        $payload = @{ id = $cur; method = $method; params = $params } | ConvertTo-Json -Depth 10 -Compress
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
        $ws.SendAsync((New-Object System.ArraySegment[byte] -ArgumentList @(,$bytes)), [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $ct).Wait()
        while ($true) {
            $ms = New-Object System.IO.MemoryStream
            do {
                $buf = New-Object byte[] 1048576
                $r = $ws.ReceiveAsync((New-Object System.ArraySegment[byte] -ArgumentList @(,$buf)), $ct).Result
                $ms.Write($buf, 0, $r.Count)
            } while (-not $r.EndOfMessage)
            $text = [System.Text.Encoding]::UTF8.GetString($ms.ToArray())
            $obj = $text | ConvertFrom-Json
            if ($obj.id -eq $cur) { return $obj }
        }
    }
    function Js([string]$expr) { $r = Cdp "Runtime.evaluate" @{ expression = $expr; returnByValue = $true; awaitPromise = $true }; return $r.result.result.value }
    function Shot([string]$name, [int]$maxH = 4000) {
        Start-Sleep -Milliseconds 900
        $h = [int](Js "Math.min($maxH, document.documentElement.scrollHeight)")
        Cdp "Emulation.setDeviceMetricsOverride" @{ width = $Width; height = $h; deviceScaleFactor = 1; mobile = $false } | Out-Null
        Start-Sleep -Milliseconds 500
        $r = Cdp "Page.captureScreenshot" @{ format = "png" }
        [System.IO.File]::WriteAllBytes((Join-Path $OutDir "$name.png"), [Convert]::FromBase64String($r.result.data))
        Cdp "Emulation.setDeviceMetricsOverride" @{ width = $Width; height = 900; deviceScaleFactor = 1; mobile = $false } | Out-Null
        Write-Host "saved $name ($h px)"
    }
    Cdp "Runtime.enable" @{} | Out-Null
    $errs = Js "(()=>{window.__errs=[];window.addEventListener('error',e=>window.__errs.push(e.message));return 1})()"
    Shot "00_login" 900
    Js "document.getElementById('login-submit-btn').click()" | Out-Null
    Shot "01_admin_overview"
    Js "window.switchPortalView('client-requests-backend-view')" | Out-Null; Shot "01b_backend_requests"
    Js "document.querySelector('#nav-group-admin [data-view=transactions-view]').click()" | Out-Null; Shot "02_admin_transactions"
    Js "document.querySelector('#nav-group-admin [data-view=projects-view]').click()" | Out-Null; Shot "03_admin_projects"
    Js "switchPortalRole('growth')" | Out-Null; Shot "04_growth" 6000
    Js "switchPortalRole('staff')" | Out-Null; Shot "05_staff" 6000
    Js "switchPortalRole('client')" | Out-Null; Shot "06_client_overview" 6000
    foreach ($t in @('tab-deliverables','tab-requests','tab-proofing','tab-printing','tab-billing','tab-store','tab-assets')) {
        Js "window.switchClientTab && switchClientTab('$t'); window.scrollTo(0,0)" | Out-Null
        Shot "07_client_$t" 5000
    }
    Write-Host ("JS errors: " + (Js "JSON.stringify(window.__errs)"))
} finally {
    if ($ws) { try { $ws.Dispose() } catch {} }
    Stop-Process -Id $chromeProc.Id -Force -ErrorAction SilentlyContinue
}
