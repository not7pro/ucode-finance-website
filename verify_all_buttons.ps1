$cdpPort = 9222
$chromeExe = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$tempDir = Join-Path $env:TEMP ("chrome_btn_test_" + [System.Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $tempDir | Out-Null

$chromeProc = Start-Process -FilePath $chromeExe -ArgumentList `
    "--headless=new", "--no-sandbox", "--disable-gpu", "--user-data-dir=$tempDir", `
    "--remote-debugging-port=$cdpPort", "http://localhost:5500/" -PassThru

Start-Sleep -Seconds 3

try {
    $tabs = Invoke-RestMethod -Uri "http://localhost:$cdpPort/json" -UseBasicParsing
    $tab = $tabs | Where-Object { $_.url -match "localhost:5500" } | Select-Object -First 1

    $ws = New-Object System.Net.WebSockets.ClientWebSocket
    $ws.ConnectAsync([uri]$tab.webSocketDebuggerUrl, [System.Threading.CancellationToken]::None).Wait()

    # Enable Runtime
    $enableCmd = [System.Text.Encoding]::UTF8.GetBytes('{"id":1,"method":"Runtime.enable"}')
    $ws.SendAsync((New-Object System.ArraySegment[byte] -ArgumentList @(,$enableCmd)), [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [System.Threading.CancellationToken]::None).Wait()
    $dummy = New-Object byte[] 4096
    $ws.ReceiveAsync((New-Object System.ArraySegment[byte] -ArgumentList @(,$dummy)), [System.Threading.CancellationToken]::None).Wait()

    $msgId = 100
    function Eval-Expression([string]$jsExpr) {
        $script:msgId++
        $curId = $script:msgId
        $jsonCode = $jsExpr | ConvertTo-Json
        $payload = "{`"id`":$curId,`"method`":`"Runtime.evaluate`",`"params`":{`"expression`":$jsonCode,`"returnByValue`":true}}"
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
        $ws.SendAsync((New-Object System.ArraySegment[byte] -ArgumentList @(,$bytes)), [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [System.Threading.CancellationToken]::None).Wait()

        $buf = New-Object byte[] 65536
        while ($true) {
            $recvRes = $ws.ReceiveAsync((New-Object System.ArraySegment[byte] -ArgumentList @(,$buf)), [System.Threading.CancellationToken]::None)
            $recvRes.Wait()
            $text = [System.Text.Encoding]::UTF8.GetString($buf, 0, $recvRes.Result.Count)
            $parsed = $text | ConvertFrom-Json
            if ($parsed.id -eq $curId) {
                if ($parsed.result.exceptionDetails) {
                    return "EXCEPTION: " + $parsed.result.exceptionDetails.text + " " + $parsed.result.exceptionDetails.exception.description
                }
                return $parsed.result.result.value
            }
        }
    }

    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host "LIVE IN-BROWSER BUTTON VERIFICATION TEST" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan

    # 1. Login Gate Button
    $t1 = Eval-Expression @"
    (() => {
        document.getElementById('login-submit-btn').click();
        const overlay = document.getElementById('login-overlay');
        const app = document.getElementById('app-container');
        return (overlay.style.display === 'none' && app.style.display === 'flex');
    })()
"@
    Write-Host "[1. Login Gate Submit] Verified: $t1" -ForegroundColor Green

    # 2. Navigation to Projects View
    $t2 = Eval-Expression @"
    (() => {
        document.querySelector('[data-view=\"projects-view\"]').click();
        return document.getElementById('projects-view').classList.contains('active');
    })()
"@
    Write-Host "[2. Nav: Projects View] Verified: $t2" -ForegroundColor Green

    # 3. Contextual + New Record Button on Projects View
    $t3 = Eval-Expression @"
    (() => {
        document.getElementById('open-add-modal').click();
        const isOpen = document.getElementById('project-modal').classList.contains('active');
        document.getElementById('close-project-modal').click();
        return isOpen;
    })()
"@
    Write-Host "[3. Contextual + New Record (Project Modal)] Verified: $t3" -ForegroundColor Green

    # 4. Switch to Growth Studio
    $t4 = Eval-Expression @"
    (() => {
        switchPortalRole('growth');
        return document.getElementById('growth-studio-view').classList.contains('active');
    })()
"@
    Write-Host "[4. Switcher: Growth Studio] Verified: $t4" -ForegroundColor Green

    # 5. Proposal Generator Modal in Growth Studio
    $t5 = Eval-Expression @"
    (() => {
        openProposalGeneratorModal();
        const isOpen = document.getElementById('proposal-generator-modal').classList.contains('active');
        document.getElementById('close-proposal-modal').click();
        return isOpen;
    })()
"@
    Write-Host "[5. Growth Studio: Proposal Generator Modal] Verified: $t5" -ForegroundColor Green

    # 6. Switch to Team Engine
    $t6 = Eval-Expression @"
    (() => {
        switchPortalRole('staff');
        return document.getElementById('employee-portal-view').classList.contains('active');
    })()
"@
    Write-Host "[6. Switcher: Team Engine] Verified: $t6" -ForegroundColor Green

    # 7. Team Engine: Log Sprint Hours Modal
    $t7 = Eval-Expression @"
    (() => {
        openStaffLogHoursModal();
        const isOpen = document.getElementById('staff-log-hours-modal').classList.contains('active');
        document.getElementById('close-staff-hours-modal').click();
        return isOpen;
    })()
"@
    Write-Host "[7. Team Engine: Log Hours Modal] Verified: $t7" -ForegroundColor Green

    # 8. Switch to VIP Client Portal
    $t8 = Eval-Expression @"
    (() => {
        switchPortalRole('client');
        return document.getElementById('client-portal-view').classList.contains('active');
    })()
"@
    Write-Host "[8. Switcher: VIP Client Portal] Verified: $t8" -ForegroundColor Green

    # 9. Client Subnav: Design Proofing Tab
    $t9 = Eval-Expression @"
    (() => {
        switchClientTab('tab-proofing');
        return document.getElementById('pane-tab-proofing').classList.contains('active');
    })()
"@
    Write-Host "[9. Client Subnav: Proofing Tab] Verified: $t9" -ForegroundColor Green

    # 10. Proofing Canvas: Prepress Bleed Overlay Toggle
    $t10 = Eval-Expression @"
    (() => {
        toggleProofBleedGuides();
        const isShown = document.getElementById('prepress-bleed-overlay').style.display === 'block';
        toggleProofBleedGuides(); // toggle off
        return isShown;
    })()
"@
    Write-Host "[10. Proofing Suite: Pre-Press Bleed Toggle] Verified: $t10" -ForegroundColor Green

    # 11. Client Subnav: Print & Execution Tab
    $t11 = Eval-Expression @"
    (() => {
        switchClientTab('tab-printing');
        return document.getElementById('pane-tab-printing').classList.contains('active');
    })()
"@
    Write-Host "[11. Client Subnav: Print & Execution Tab] Verified: $t11" -ForegroundColor Green

    # 12. Schedule Print Run Modal
    $t12 = Eval-Expression @"
    (() => {
        openSchedulePrintModal();
        const isOpen = document.getElementById('schedule-print-modal').classList.contains('active');
        document.getElementById('close-schedule-print-modal').click();
        return isOpen;
    })()
"@
    Write-Host "[12. Physical Printing: Schedule Print Run Modal] Verified: $t12" -ForegroundColor Green

    # 13. Operations Ribbon: AI WhatsApp Bot Demo Modal
    $t13 = Eval-Expression @"
    (() => {
        openAiBotDemoModal();
        const isOpen = document.getElementById('ai-bot-demo-modal').classList.contains('active');
        document.getElementById('close-ai-bot-modal').click();
        return isOpen;
    })()
"@
    Write-Host "[13. Operations Ribbon: AI WhatsApp Bot Modal] Verified: $t13" -ForegroundColor Green

    # 14. Operations Ribbon: Live Web Staging Simulator Modal
    $t14 = Eval-Expression @"
    (() => {
        openClientStagingModal();
        const isOpen = document.getElementById('client-staging-modal').classList.contains('active');
        document.getElementById('close-staging-modal').click();
        return isOpen;
    })()
"@
    Write-Host "[14. Operations Ribbon: Live Web Staging Simulator Modal] Verified: $t14" -ForegroundColor Green

    # 15. Audio Micro-Interactions Synthesis
    $t15 = Eval-Expression @"
    (() => {
        try {
            playUiSound('click');
            playUiSound('success');
            playUiSound('pop');
            playUiSound('coin');
            return true;
        } catch (e) {
            return false;
        }
    })()
"@
    Write-Host "[15. Audio Synthesis Engine (4 Acoustic Profiles)] Verified: $t15" -ForegroundColor Green

} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    if ($chromeProc -and -not $chromeProc.HasExited) { Stop-Process -Id $chromeProc.Id -Force }
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
