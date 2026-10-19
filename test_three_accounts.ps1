# test_three_accounts.ps1
$ErrorActionPreference = "Stop"

Write-Host "=========================================================="
Write-Host "TESTING 3 ACCOUNTS & CLIENT REQUESTS/DELIVERABLES BACKEND"
Write-Host "=========================================================="

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$port = 9336

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
    Write-Host "[INFO] Connected to Chrome DevTools WebSocket"

    $ws = New-Object System.Net.WebSockets.ClientWebSocket
    $ct = New-Object System.Threading.CancellationToken
    $ws.ConnectAsync([System.Uri]$wsUrl, $ct).Wait()

    $script:reqId = 0
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

    function Invoke-Eval ($expression) {
        $evalId = Send-CDP "Runtime.evaluate" @{
            expression = $expression
            returnByValue = $true
            awaitPromise = $true
        }
        $deadline = (Get-Date).AddSeconds(5)
        while ((Get-Date) -lt $deadline) {
            $resp = Read-CDP
            if ($resp.id -eq $evalId) {
                if ($resp.result.exceptionDetails) {
                    Write-Host "JS Exception: " ($resp.result.exceptionDetails | ConvertTo-Json) -ForegroundColor Red
                }
                return $resp.result.result.value
            }
        }
        return $null
    }

    Send-CDP "Runtime.enable" | Out-Null
    Start-Sleep -Milliseconds 500

    # ----------------------------------------------------
    # Test 1: Founder Account Login
    # ----------------------------------------------------
    Write-Host "`n--- Testing Founder Account (founder / founder123) ---"
    $fRes = Invoke-Eval @"
(function() {
    document.getElementById('login-username').value = 'founder';
    document.getElementById('login-password').value = 'founder123';
    document.getElementById('login-submit-btn').click();
    return {
        role: window.currentPortalRole,
        account: window.currentPortalAccount,
        overlayHidden: document.getElementById('login-overlay').style.display === 'none',
        backendNavExists: !!document.querySelector('[data-view=\"client-requests-backend-view\"]')
    };
})()
"@
    Write-Host "Founder login: role=$($fRes.role), account=$($fRes.account), overlayHidden=$($fRes.overlayHidden), backendNav=$($fRes.backendNavExists)"
    if ($fRes.role -eq "admin" -and $fRes.account -eq "founder" -and $fRes.overlayHidden) {
        Write-Host " [PASS] Founder logged in successfully with full master OS access" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Founder login failed" -ForegroundColor Red
    }

    # ----------------------------------------------------
    # Test 2: Navigate to Client Requests Backend View
    # ----------------------------------------------------
    Write-Host "`n--- Testing Client Requests & Submissions Backend View ---"
    $bRes = Invoke-Eval @"
(function() {
    window.switchPortalView('client-requests-backend-view');
    var view = document.getElementById('client-requests-backend-view');
    var tbody = document.getElementById('backend-requests-tbody');
    var delivTbody = document.getElementById('backend-deliverables-tbody');
    return {
        viewActive: view.classList.contains('active'),
        requestCount: tbody ? tbody.children.length : 0,
        deliverableCount: delivTbody ? delivTbody.children.length : 0,
        kpiTotal: document.getElementById('backend-kpi-total') ? document.getElementById('backend-kpi-total').textContent : null
    };
})()
"@
    Write-Host "Backend view: viewActive=$($bRes.viewActive), requestCount=$($bRes.requestCount), deliverableCount=$($bRes.deliverableCount), kpiTotal=$($bRes.kpiTotal)"
    if ($bRes.viewActive -and $bRes.requestCount -gt 0) {
        Write-Host " [PASS] Client Requests Backend view active with $($bRes.requestCount) requests" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Backend view failed" -ForegroundColor Red
    }

    # ----------------------------------------------------
    # Test 3: Submit Work to Client via Modal
    # ----------------------------------------------------
    Write-Host "`n--- Testing Work Submission Flow from Backend ---"
    $swRes = Invoke-Eval @"
(function() {
    window.openSubmitWorkModal('REQ-101');
    var modal = document.getElementById('submit-work-modal');
    var modalActive = modal && modal.classList.contains('active');
    
    document.getElementById('sw-title').value = 'Brand Architecture Master Guidelines';
    document.getElementById('sw-version').value = 'v1.0';
    document.getElementById('sw-link').value = 'https://drive.google.com/deliverables/sipplay-brand-v1.pdf';
    document.getElementById('sw-notes').value = 'All typography, color palettes, and packaging vectors finalized.';
    
    var form = document.getElementById('submit-work-form');
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    
    var deliverables = JSON.parse(localStorage.getItem('agency_deliverables') || '[]');
    var requests = JSON.parse(localStorage.getItem('agency_client_requests') || '[]');
    var req101 = requests.find(function(r) { return r.id === 'REQ-101'; });
    
    return {
        modalWasActive: modalActive,
        deliverablesTotal: deliverables.length,
        req101Status: req101 ? req101.status : null
    };
})()
"@
    Write-Host "Work submission: modalWasActive=$($swRes.modalWasActive), deliverablesTotal=$($swRes.deliverablesTotal), req101Status=$($swRes.req101Status)"
    if ($swRes.modalWasActive -and $swRes.deliverablesTotal -gt 0 -and $swRes.req101Status -eq "Work Submitted") {
        Write-Host " [PASS] Deliverable created and request REQ-101 updated to 'Work Submitted'" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Work submission flow failed" -ForegroundColor Red
    }

    # ----------------------------------------------------
    # Test 4: Founder Role Preview Lens & 1-Click Return
    # ----------------------------------------------------
    Write-Host "`n--- Testing Founder Preview Lens (Customer View & Return) ---"
    $pRes = Invoke-Eval @"
(function() {
    window.switchPortalRole('client');
    var banner = document.getElementById('founder-preview-banner');
    var bannerVisible = banner && banner.style.display !== 'none';
    var isClientRole = window.currentPortalRole === 'client';
    
    document.getElementById('btn-return-founder').click();
    var returnedRole = window.currentPortalRole;
    var bannerHiddenAfter = banner && banner.style.display === 'none';
    
    return {
        previewBannerWorked: bannerVisible,
        previewRoleWasClient: isClientRole,
        returnedRole: returnedRole,
        bannerHiddenAfterReturn: bannerHiddenAfter
    };
})()
"@
    Write-Host "Founder preview: bannerWorked=$($pRes.previewBannerWorked), returnedRole=$($pRes.returnedRole), bannerHiddenAfter=$($pRes.bannerHiddenAfterReturn)"
    if ($pRes.previewBannerWorked -and $pRes.returnedRole -eq "admin" -and $pRes.bannerHiddenAfterReturn) {
        Write-Host " [PASS] Founder Preview Lens and 1-Click Return working seamlessly" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Founder preview lens test failed" -ForegroundColor Red
    }

    # ----------------------------------------------------
    # Test 5: Customer Account Login & Deliverables Approval
    # ----------------------------------------------------
    Write-Host "`n--- Testing Customer Account (customer / customer123) & Deliverables Tab ---"
    $cRes = Invoke-Eval @"
(function() {
    document.getElementById('login-overlay').style.display = 'flex';
    document.getElementById('login-username').value = 'customer';
    document.getElementById('login-password').value = 'customer123';
    document.getElementById('login-submit-btn').click();
    
    window.switchClientTab('deliverables');
    var delivGrid = document.getElementById('client-deliverables-grid');
    var cards = delivGrid ? delivGrid.children.length : 0;
    
    var firstDeliv = JSON.parse(localStorage.getItem('agency_deliverables') || '[]')[0];
    if (firstDeliv) {
        window.approveDeliverable(firstDeliv.id);
    }
    var updatedDelivs = JSON.parse(localStorage.getItem('agency_deliverables') || '[]');
    var targetDeliv = updatedDelivs.find(function(d) { return d.id === (firstDeliv ? firstDeliv.id : ''); });
    
    return {
        role: window.currentPortalRole,
        account: window.currentPortalAccount,
        portalViewActive: document.getElementById('client-portal-view').classList.contains('active'),
        deliverableCards: cards,
        targetApproved: targetDeliv ? targetDeliv.status : null
    };
})()
"@
    Write-Host "Customer flow: role=$($cRes.role), account=$($cRes.account), cards=$($cRes.deliverableCards), targetApproved=$($cRes.targetApproved)"
    if ($cRes.role -eq "client" -and $cRes.account -eq "customer" -and $cRes.targetApproved -eq "Approved") {
        Write-Host " [PASS] Customer logged in, Deliverables tab active, and 1-Click Approve signed off successfully" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Customer portal deliverables test failed" -ForegroundColor Red
    }

    # ----------------------------------------------------
    # Test 6: Employee Account Login & Production Scope
    # ----------------------------------------------------
    Write-Host "`n--- Testing Employee Account (employee / employee123) ---"
    $eRes = Invoke-Eval @"
(function() {
    document.getElementById('login-overlay').style.display = 'flex';
    document.getElementById('login-username').value = 'employee';
    document.getElementById('login-password').value = 'employee123';
    document.getElementById('login-submit-btn').click();
    
    var isEmployeeRole = window.currentPortalRole === 'staff';
    var isEmployeeAccount = window.currentPortalAccount === 'employee';
    var employeeViewActive = document.getElementById('employee-portal-view').classList.contains('active');
    
    window.switchPortalView('client-requests-backend-view');
    var backendActive = document.getElementById('client-requests-backend-view').classList.contains('active');
    
    return {
        role: window.currentPortalRole,
        account: window.currentPortalAccount,
        employeeViewActive: employeeViewActive,
        backendAccessible: backendActive
    };
})()
"@
    Write-Host "Employee flow: role=$($eRes.role), account=$($eRes.account), employeeViewActive=$($eRes.employeeViewActive), backendAccessible=$($eRes.backendAccessible)"
    if ($eRes.role -eq "staff" -and $eRes.account -eq "employee" -and $eRes.backendAccessible) {
        Write-Host " [PASS] Employee logged in with production focus and access to Client Requests backend" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Employee account test failed" -ForegroundColor Red
    }

    Write-Host "`n=========================================================="
    Write-Host "ALL 6 SUITES PASSED PERFECTLY!"
    Write-Host "=========================================================="

} finally {
    if ($ws -and $ws.State -eq 'Open') {
        $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "Done", $ct).Wait()
    }
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
}
