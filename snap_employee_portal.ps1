param([string]$OutDir = "C:\Users\Administrator\.gemini\antigravity-ide\brain\befb4a1e-77a0-4b63-a48a-5fa2e218a491\scratch\shots", [int]$Width = 1280)
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$cdpPort = 9245
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
    function Shot([string]$name, [int]$maxH = 2200) {
        Start-Sleep -Milliseconds 700
        $h = [int](Js "Math.min($maxH, document.documentElement.scrollHeight)")
        Cdp "Emulation.setDeviceMetricsOverride" @{ width = $Width; height = $h; deviceScaleFactor = 1; mobile = $false } | Out-Null
        Start-Sleep -Milliseconds 400
        $r = Cdp "Page.captureScreenshot" @{ format = "png" }
        [System.IO.File]::WriteAllBytes((Join-Path $OutDir "$name.png"), [Convert]::FromBase64String($r.result.data))
        Cdp "Emulation.setDeviceMetricsOverride" @{ width = $Width; height = 900; deviceScaleFactor = 1; mobile = $false } | Out-Null
        Write-Host "saved $name ($h px)"
    }
    Cdp "Runtime.enable" @{} | Out-Null
    
    # 1. Switch chip to staff & login as employee
    Js "document.getElementById('chip-staff').click()" | Out-Null
    Start-Sleep -Milliseconds 300
    Js "document.getElementById('login-submit-btn').click()" | Out-Null
    Start-Sleep -Milliseconds 600

    # Ensure employee portal is visible and scroll to top
    Js "window.switchPortalRole('staff'); window.scrollTo(0,0)" | Out-Null
    Start-Sleep -Milliseconds 500
    
    # Capture Employee Morning Cockpit
    Shot "05_employee_morning_cockpit" 1600

    # Test toggling task 1 checkbox and capture
    Js "const chk = document.querySelector('#task-card-1 .staff-task-checkbox'); if (chk) { chk.click(); }" | Out-Null
    Start-Sleep -Milliseconds 400
    Shot "05_employee_task_toggled" 1600

    # Test switching specialist to Sarah and capture
    Js "window.setStaffSpecialist('sarah')" | Out-Null
    Start-Sleep -Milliseconds 400
    Shot "05_employee_specialist_sarah" 1600

    Write-Host "Screenshots captured successfully in $OutDir"
} finally {
    if ($ws -and $ws.State -eq [System.Net.WebSockets.WebSocketState]::Open) { $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "Done", $ct).Wait() }
    if ($chromeProc -and -not $chromeProc.HasExited) { Stop-Process -Id $chromeProc.Id -Force }
    if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue }
}
