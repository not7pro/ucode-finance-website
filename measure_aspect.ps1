# measure_aspect.ps1
$port = 9338
$outPath = "C:\Users\Administrator\.gemini\antigravity-ide\brain\befb4a1e-77a0-4b63-a48a-5fa2e218a491\scratch\shots\fixed_aspect_live.png"
$p = Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList @(
    "--headless=new",
    "--remote-debugging-port=$port",
    "--window-size=1152,750",
    "--no-sandbox",
    "http://localhost:5500/"
) -PassThru

Start-Sleep -Seconds 2
try {
    $t = (Invoke-RestMethod "http://localhost:$port/json") | Where-Object {$_.type -eq 'page'} | Select-Object -First 1
    $ws = New-Object System.Net.WebSockets.ClientWebSocket
    $ct = [System.Threading.CancellationToken]::None
    $ws.ConnectAsync([uri]$t.webSocketDebuggerUrl, $ct).Wait()

    function Send-CDP([string]$method, $params) {
        $id = 1
        $payload = @{ id = $id; method = $method; params = $params } | ConvertTo-Json -Compress
        $bytes = [Text.Encoding]::UTF8.GetBytes($payload)
        $ws.SendAsync((New-Object ArraySegment[byte] @(,$bytes)), [Net.WebSockets.WebSocketMessageType]::Text, $true, $ct).Wait()
        
        $ms = New-Object System.IO.MemoryStream
        do {
            $buf = New-Object byte[] 1048576
            $r = $ws.ReceiveAsync((New-Object ArraySegment[byte] @(,$buf)), $ct).Result
            $ms.Write($buf, 0, $r.Count)
        } while (-not $r.EndOfMessage)
        $txt = [Text.Encoding]::UTF8.GetString($ms.ToArray())
        return $txt | ConvertFrom-Json
    }

    $js = @"
(function() {
    document.getElementById('login-submit-btn').click();
    window.switchPortalView('client-requests-backend-view');
    var mc = document.querySelector('.main-content');
    return {
        innerWidth: window.innerWidth,
        docScrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        mainWidth: mc.offsetWidth,
        mainScrollWidth: mc.scrollWidth,
        headerWidth: document.querySelector('.top-header').offsetWidth,
        headerScrollWidth: document.querySelector('.top-header').scrollWidth,
        bannerWidth: document.querySelector('.backend-hero-banner').offsetWidth,
        tableContainerWidth: document.querySelector('.table-container') ? document.querySelector('.table-container').offsetWidth : 0,
        tableContainerScrollWidth: document.querySelector('.table-container') ? document.querySelector('.table-container').scrollWidth : 0
    };
})()
"@
    $res = Send-CDP "Runtime.evaluate" @{ expression = $js; awaitPromise = $true; returnByValue = $true }
    Write-Host "MEASUREMENTS WITH CSS STYLESHEET AT 1152px VIEWPORT:"
    $res.result.result.value | Format-List | Out-String | Write-Host

    Start-Sleep -Milliseconds 600
    $shot = Send-CDP "Page.captureScreenshot" @{ format = "png" }
    [IO.File]::WriteAllBytes($outPath, [Convert]::FromBase64String($shot.result.data))
    Write-Host "Screenshot saved to $outPath"

} finally {
    if ($ws -and $ws.State -eq 'Open') { $ws.CloseAsync([Net.WebSockets.WebSocketCloseStatus]::NormalClosure, '', $ct).Wait() }
    Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
}
