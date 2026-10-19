$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$port = 9333

# Start chrome headless with remote debugging
$proc = Start-Process -FilePath $chromePath -ArgumentList @(
    "--headless=new",
    "--remote-debugging-port=$port",
    "--disable-gpu",
    "--no-sandbox",
    "--user-data-dir=$env:TEMP\chrome_dbg_$port",
    "http://localhost:5500/"
) -PassThru

Start-Sleep -Seconds 2

try {
    $version = Invoke-RestMethod -Uri "http://127.0.0.1:$port/json/list" -Method Get
    $page = $version | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
    $wsUrl = $page.webSocketDebuggerUrl

    $ws = New-Object System.Net.WebSockets.ClientWebSocket
    $ct = New-Object System.Threading.CancellationToken
    $ws.ConnectAsync([System.Uri]$wsUrl, $ct).Wait()

    function Send-CDP ($method, $params = @{}) {
        $id = [System.Threading.Interlocked]::Increment([ref]$script:reqId)
        $msg = @{ id = $id; method = $method; params = $params } | ConvertTo-Json -Compress -Depth 10
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
        $segment = New-Object System.ArraySegment[byte] -ArgumentList @(,$bytes)
        $ws.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $ct).Wait()
        return $id
    }

    function Read-CDP {
        $buffer = New-Object byte[] 65536
        $segment = New-Object System.ArraySegment[byte] -ArgumentList @(,$buffer)
        $result = $ws.ReceiveAsync($segment, $ct).Result
        $text = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $result.Count)
        return $text | ConvertFrom-Json
    }

    $script:reqId = 0
    Send-CDP "Runtime.enable" | Out-Null
    Send-CDP "Console.enable" | Out-Null
    Send-CDP "Page.enable" | Out-Null

    Start-Sleep -Seconds 1

    # Evaluate any errors on page
    $evalId = Send-CDP "Runtime.evaluate" @{
        expression = @"
(function() {
    return {
        appContainerVisible: document.getElementById('app-container').style.display !== 'none',
        loginOverlayVisible: document.getElementById('login-overlay').style.display !== 'none',
        roleChips: document.querySelectorAll('.role-chip').length,
        buttons: document.querySelectorAll('button').length,
        navItems: document.querySelectorAll('.nav-item').length,
        hasGlobalError: typeof window.__lastError !== 'undefined' ? window.__lastError : null
    };
})()
"@
        returnByValue = $true
    }

    $deadline = (Get-Date).AddSeconds(5)
    $evalRes = $null
    while ((Get-Date) -lt $deadline) {
        $resp = Read-CDP
        if ($resp.id -eq $evalId) {
            $evalRes = $resp.result.result.value
            break
        }
    }

    Write-Host "Page State Assessment:"
    $evalRes | Format-List | Out-String | Write-Host

} finally {
    if ($ws -and $ws.State -eq 'Open') {
        $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "Done", $ct).Wait()
    }
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
}
