document.addEventListener('DOMContentLoaded', () => {

    // === Multi-Portal Authentication Gate & Routing ===
    const loginOverlay = document.getElementById('login-overlay');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const chipAdmin = document.getElementById('chip-admin');
    const chipStaff = document.getElementById('chip-staff');
    const chipClient = document.getElementById('chip-client');
    const loginUser = document.getElementById('login-username');
    const loginPass = document.getElementById('login-password');
    const loginHint = document.getElementById('login-hint-text');
    const logoutBtn = document.getElementById('logout-btn');
    const navGroupAdmin = document.getElementById('nav-group-admin');
    const navGroupStaff = document.getElementById('nav-group-staff');
    const navGroupClient = document.getElementById('nav-group-client');
    const sidebarAvatar = document.getElementById('sidebar-avatar');
    const sidebarUsername = document.getElementById('sidebar-username');
    const sidebarRoleBadge = document.getElementById('sidebar-role-badge');
    const headerRight = document.querySelector('.header-right');

    // === Billion-Dollar Web Audio API Sound Effects Engine ===
    window.playUiSound = function(type = 'click') {
        if (localStorage.getItem('agency_sound_enabled') === 'false') return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;
            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1000, now);
                osc.frequency.exponentialRampToValueAtTime(450, now + 0.04);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.start(now);
                osc.stop(now + 0.04);
            } else if (type === 'success') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.setValueAtTime(659.25, now + 0.07);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
                osc.start(now);
                osc.stop(now + 0.28);
            } else if (type === 'pop') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.exponentialRampToValueAtTime(620, now + 0.03);
                gain.gain.setValueAtTime(0.07, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
                osc.start(now);
                osc.stop(now + 0.03);
            } else if (type === 'coin') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1400, now);
                osc.frequency.setValueAtTime(2100, now + 0.06);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            }
        } catch(e) {}
    };

    // Sound toggle in footer
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');
    const soundLabel = document.getElementById('sound-label');
    if (soundToggleBtn) {
        const isMuted = localStorage.getItem('agency_sound_enabled') === 'false';
        if (isMuted) {
            if (soundIcon) soundIcon.className = 'ph ph-speaker-slash';
            if (soundLabel) soundLabel.textContent = 'Audio: Off';
        }
        soundToggleBtn.addEventListener('click', () => {
            const currentlyOff = localStorage.getItem('agency_sound_enabled') === 'false';
            if (currentlyOff) {
                localStorage.setItem('agency_sound_enabled', 'true');
                if (soundIcon) soundIcon.className = 'ph ph-speaker-high';
                if (soundLabel) soundLabel.textContent = 'Audio: On';
                playUiSound('success');
            } else {
                localStorage.setItem('agency_sound_enabled', 'false');
                if (soundIcon) soundIcon.className = 'ph ph-speaker-slash';
                if (soundLabel) soundLabel.textContent = 'Audio: Off';
            }
        });
    }

    // Portal quick switcher trigger
    const switcherTrigger = document.getElementById('portal-switch-trigger');
    const switcherMenu = document.getElementById('portal-dropdown-menu');
    if (switcherTrigger && switcherMenu) {
        switcherTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            switcherMenu.classList.toggle('active');
            playUiSound('pop');
        });
        document.addEventListener('click', () => {
            switcherMenu.classList.remove('active');
        });
    }

    // Check URL parameters for direct link / magic access (e.g. ?portal=backend, ?portal=admin, ?portal=staff, ?portal=client)
    const urlParams = new URLSearchParams(window.location.search);
    const pRole = urlParams.get('portal') || urlParams.get('role');
    const pView = urlParams.get('view') || urlParams.get('tab');

    if (pRole === 'admin' || pRole === 'backend' || pRole === 'founder') {
        sessionStorage.setItem('agency_authenticated', 'true');
        sessionStorage.setItem('agency_user_role', 'admin');
    } else if (pRole === 'staff' || pRole === 'team' || pRole === 'production') {
        sessionStorage.setItem('agency_authenticated', 'true');
        sessionStorage.setItem('agency_user_role', 'staff');
    } else if (pRole === 'growth' || pRole === 'studies') {
        sessionStorage.setItem('agency_authenticated', 'true');
        sessionStorage.setItem('agency_user_role', 'growth');
    } else if (urlParams.get('client') || pRole === 'client') {
        sessionStorage.setItem('agency_authenticated', 'true');
        sessionStorage.setItem('agency_user_role', 'client');
        sessionStorage.setItem('agency_client_id', urlParams.get('client') || 'sipandplay');
    }

    // Global Master Switcher
    window.switchPortalRole = function(role) {
        window.currentPortalRole = role;
        window.currentPortalAccount = sessionStorage.getItem('agency_account_type') || (role === 'admin' ? 'founder' : (role === 'staff' ? 'employee' : 'customer'));
        playUiSound('click');
        sessionStorage.setItem('agency_user_role', role);

        if (switcherMenu) switcherMenu.classList.remove('active');

        // Check if the authenticated account is a Founder previewing another role
        const authenticatedAccount = sessionStorage.getItem('agency_account_type') || (sessionStorage.getItem('agency_user_role') === 'admin' ? 'founder' : '');
        const previewBanner = document.getElementById('founder-preview-banner');
        const previewName = document.getElementById('preview-role-name');

        if (authenticatedAccount === 'founder' && (role === 'staff' || role === 'client')) {
            if (previewBanner) previewBanner.style.display = 'flex';
            if (previewName) previewName.textContent = (role === 'staff' ? 'Employee (Team Engine)' : 'Customer (Client Portal)');
        } else {
            if (previewBanner) previewBanner.style.display = 'none';
        }

        // Update active class in dropdown items
        document.querySelectorAll('.portal-dropdown-menu .dropdown-item').forEach(it => {
            if (it.getAttribute('data-portal') === role) it.classList.add('active');
            else it.classList.remove('active');
        });

        const activeLabel = document.getElementById('portal-active-label');
        const labels = {
            'admin': '👑 Founder Master OS',
            'growth': '🔮 Growth & Studies',
            'staff': '👥 Employee (Team)',
            'client': '🌟 Customer Workspace'
        };
        if (activeLabel) activeLabel.textContent = labels[role] || 'Founder OS';

        const pageTitle = document.getElementById('page-title');
        document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));

        if (role === 'client') {
            if (navGroupAdmin) navGroupAdmin.style.display = 'none';
            if (navGroupStaff) navGroupStaff.style.display = 'none';
            if (navGroupClient) navGroupClient.style.display = 'block';
            if (sidebarAvatar) sidebarAvatar.textContent = 'S';
            if (sidebarUsername) sidebarUsername.textContent = 'Sip and Play (Vivian)';
            if (sidebarRoleBadge) {
                sidebarRoleBadge.textContent = 'Customer Workspace';
                sidebarRoleBadge.style.color = 'var(--primary)';
            }
            const clientView = document.getElementById('client-portal-view');
            if (clientView) clientView.classList.add('active');
            if (pageTitle) pageTitle.textContent = 'Sip and Play • Client Collaboration Portal';
            if (typeof window.renderCustomerDeliverables === 'function') window.renderCustomerDeliverables();
            if (typeof window.renderCustomerRequests === 'function') window.renderCustomerRequests();
        } else if (role === 'staff') {
            if (navGroupAdmin) navGroupAdmin.style.display = 'none';
            if (navGroupStaff) navGroupStaff.style.display = 'block';
            if (navGroupClient) navGroupClient.style.display = 'none';
            if (sidebarAvatar) sidebarAvatar.textContent = 'E';
            if (sidebarUsername) sidebarUsername.textContent = 'Ucode Team Engine';
            if (sidebarRoleBadge) {
                sidebarRoleBadge.textContent = 'Employee Workspace';
                sidebarRoleBadge.style.color = 'var(--info)';
            }
            const staffView = document.getElementById('employee-portal-view');
            if (staffView) staffView.classList.add('active');
            if (pageTitle) pageTitle.textContent = 'Agency Production Engine';
            if (typeof window.renderBackendRequests === 'function') window.renderBackendRequests();
            if (typeof window.renderBackendDeliverables === 'function') window.renderBackendDeliverables();
        } else if (role === 'growth') {
            if (navGroupAdmin) navGroupAdmin.style.display = 'block';
            if (navGroupStaff) navGroupStaff.style.display = 'none';
            if (navGroupClient) navGroupClient.style.display = 'none';
            if (sidebarAvatar) sidebarAvatar.textContent = 'G';
            if (sidebarUsername) sidebarUsername.textContent = 'Strategic Growth Studio';
            if (sidebarRoleBadge) {
                sidebarRoleBadge.textContent = 'Executive Insights';
                sidebarRoleBadge.style.color = 'var(--accent-gold)';
            }
            const growthView = document.getElementById('growth-studio-view');
            if (growthView) growthView.classList.add('active');
            if (pageTitle) pageTitle.textContent = 'Strategic Growth & Market Studies';
            if (window.calculateGrowthSim) calculateGrowthSim();
        } else {
            // Founder Admin role - has access to ALL
            if (navGroupAdmin) navGroupAdmin.style.display = 'block';
            if (navGroupStaff) navGroupStaff.style.display = 'none';
            if (navGroupClient) navGroupClient.style.display = 'none';
            if (sidebarAvatar) sidebarAvatar.textContent = 'U';
            if (sidebarUsername) sidebarUsername.textContent = 'Founder (Umar & Abdullah)';
            if (sidebarRoleBadge) {
                sidebarRoleBadge.textContent = '👑 Founder (Master Access)';
                sidebarRoleBadge.style.color = 'var(--primary)';
            }
            const dashView = document.getElementById('dashboard-view');
            if (dashView) dashView.classList.add('active');
            if (pageTitle) pageTitle.textContent = 'Founder Executive OS';
            if (typeof window.renderBackendRequests === 'function') window.renderBackendRequests();
            if (typeof window.renderBackendDeliverables === 'function') window.renderBackendDeliverables();
        }
    };

    window.applyUserRole = function(role) {
        switchPortalRole(role);
    };

    window.switchPortalView = function(viewId) {
        const navItems = document.querySelectorAll('.nav-item');
        const viewSections = document.querySelectorAll('.view-section');
        const targetNav = document.querySelector(`.nav-item[data-view="${viewId}"]`);
        const targetView = document.getElementById(viewId);
        
        if (targetView) {
            navItems.forEach(nav => nav.classList.remove('active'));
            viewSections.forEach(section => section.classList.remove('active'));
            if (targetNav) targetNav.classList.add('active');
            targetView.classList.add('active');
            const pageTitle = document.getElementById('page-title');
            if (targetNav && pageTitle) pageTitle.textContent = targetNav.querySelector('span')?.textContent || '';
            const calContainer = document.getElementById('header-calendar-container');
            if (calContainer) {
                calContainer.style.display = (viewId === 'dashboard-view' || viewId === 'transactions-view') ? 'flex' : 'none';
            }
            playUiSound('click');
        }
    };

    let currentRole = sessionStorage.getItem('agency_user_role') || 'admin';

    if (sessionStorage.getItem('agency_authenticated') === 'true') {
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (appContainer) appContainer.style.display = 'flex';
        applyUserRole(currentRole);
        if (pView) {
            setTimeout(() => {
                if (pView === 'backend' || pView === 'requests') {
                    document.querySelector('[data-view="client-requests-backend-view"]')?.click();
                } else if (pView === 'projects' || pView === 'orders') {
                    document.querySelector('#nav-group-admin [data-view="projects-view"]')?.click();
                } else if (pView === 'transactions' || pView === 'invoices') {
                    document.querySelector('#nav-group-admin [data-view="transactions-view"]')?.click();
                } else if (pView.startsWith('tab-') || ['requests', 'deliverables', 'proofing', 'printing', 'billing', 'store', 'assets'].includes(pView)) {
                    if (window.switchClientTab) window.switchClientTab(pView);
                }
            }, 60);
        }
    } else {
        if (loginOverlay) loginOverlay.style.display = 'flex';
        if (appContainer) appContainer.style.display = 'none';
    }

    // Role switcher chips on login card (3 chips)
    const setChipActive = (activeChip, userVal, passVal, hintVal) => {
        [chipAdmin, chipStaff, chipClient].forEach(c => {
            if (c) {
                c.classList.remove('active');
                c.style.background = 'var(--bg-hover)';
                c.style.color = 'var(--text-muted)';
            }
        });
        if (activeChip) {
            activeChip.classList.add('active');
            activeChip.style.background = 'var(--primary)';
            activeChip.style.color = 'white';
        }
        if (loginUser) loginUser.value = userVal;
        if (loginPass) loginPass.value = passVal;
        if (loginHint) loginHint.textContent = hintVal;
        playUiSound('click');
    };

    if (chipAdmin) {
        chipAdmin.addEventListener('click', () => {
            setChipActive(chipAdmin, 'founder', 'founder123', 'Founder Account: Full master access across Agency Financials, Equity, Requests Backend, & Team.');
        });
    }
    if (chipStaff) {
        chipStaff.addEventListener('click', () => {
            setChipActive(chipStaff, 'employee', 'employee123', 'Employee Account: Production Kanban, Work Logging & Client Deliverables Submission.');
        });
    }
    if (chipClient) {
        chipClient.addEventListener('click', () => {
            setChipActive(chipClient, 'customer', 'customer123', 'Customer Account: Submit Creative Briefs, Review & Approve Agency Deliverables.');
        });
    }

    function quickLogin(role, accountType) {
        sessionStorage.setItem('agency_authenticated', 'true');
        sessionStorage.setItem('agency_user_role', role);
        sessionStorage.setItem('agency_account_type', accountType || (role === 'admin' ? 'founder' : (role === 'staff' ? 'employee' : 'customer')));
        if (role === 'client') sessionStorage.setItem('agency_client_id', 'sipandplay');
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (appContainer) appContainer.style.display = 'flex';
        if (loginError) loginError.style.display = 'none';
        playUiSound('success');
        applyUserRole(role);
    }

    const qFounder = document.getElementById('quick-enter-founder');
    const qTeam = document.getElementById('quick-enter-team');
    const qClient = document.getElementById('quick-enter-client');
    if (qFounder) qFounder.addEventListener('click', () => quickLogin('admin', 'founder'));
    if (qTeam) qTeam.addEventListener('click', () => quickLogin('staff', 'employee'));
    if (qClient) qClient.addEventListener('click', () => quickLogin('client', 'customer'));

    // Return to Founder OS button on preview banner
    const btnReturnFounder = document.getElementById('btn-return-founder');
    if (btnReturnFounder) {
        btnReturnFounder.addEventListener('click', () => {
            switchPortalRole('admin');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('login-username').value.trim();
            const pass = document.getElementById('login-password').value.trim();

            const isFounder = (user.toLowerCase() === 'founder' && pass === 'founder123') || (user === 'Ucode' && pass === 'Ucode@123');
            const isEmployee = (user.toLowerCase() === 'employee' && pass === 'employee123') || (user.toLowerCase() === 'staff' && pass === 'staff123') || ['imran', 'alex', 'sarah', 'bilal'].includes(user.toLowerCase());
            const isCustomer = (user.toLowerCase() === 'customer' && pass === 'customer123') || (user.toLowerCase() === 'client' && pass === 'client123') || user.toUpperCase() === 'SIPPLAY' || user.toLowerCase() === 'sipandplay';

            if (isFounder) {
                sessionStorage.setItem('agency_authenticated', 'true');
                sessionStorage.setItem('agency_user_role', 'admin');
                sessionStorage.setItem('agency_account_type', 'founder');
                window.currentPortalRole = 'admin';
                window.currentPortalAccount = 'founder';
                loginOverlay.style.display = 'none';
                appContainer.style.display = 'flex';
                loginError.style.display = 'none';
                playUiSound('success');
                applyUserRole('admin');
            } else if (isEmployee) {
                sessionStorage.setItem('agency_authenticated', 'true');
                sessionStorage.setItem('agency_user_role', 'staff');
                sessionStorage.setItem('agency_account_type', 'employee');
                window.currentPortalRole = 'staff';
                window.currentPortalAccount = 'employee';
                loginOverlay.style.display = 'none';
                appContainer.style.display = 'flex';
                loginError.style.display = 'none';
                playUiSound('success');
                applyUserRole('staff');
            } else if (isCustomer) {
                sessionStorage.setItem('agency_authenticated', 'true');
                sessionStorage.setItem('agency_user_role', 'client');
                sessionStorage.setItem('agency_account_type', 'customer');
                sessionStorage.setItem('agency_client_id', 'sipandplay');
                window.currentPortalRole = 'client';
                window.currentPortalAccount = 'customer';
                loginOverlay.style.display = 'none';
                appContainer.style.display = 'flex';
                loginError.style.display = 'none';
                playUiSound('success');
                applyUserRole('client');
            } else {
                loginError.style.display = 'block';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            playUiSound('pop');
            sessionStorage.removeItem('agency_authenticated');
            sessionStorage.removeItem('agency_user_role');
            sessionStorage.removeItem('agency_account_type');
            sessionStorage.removeItem('agency_client_id');
            window.location.href = window.location.pathname; // reload cleanly to login
        });
    }

    // === Central State & LocalStorage ===
    let transactions = JSON.parse(localStorage.getItem('agency_transactions_v2')) || [];
    let projects = JSON.parse(localStorage.getItem('agency_projects')) || [];
    let goals = JSON.parse(localStorage.getItem('agency_goals')) || [];
    let smmClients = JSON.parse(localStorage.getItem('agency_smm_clients')) || [];
    let smmPosts = JSON.parse(localStorage.getItem('agency_smm_posts')) || [];
    let invoices = JSON.parse(localStorage.getItem('agency_invoices')) || {};

    // === Currency & Exchange Rate State ===
    let currentCurrency = localStorage.getItem('agency_currency') || 'LKR';
    let sarRate = 0.0125; // fallback rate

    async function fetchExchangeRate() {
        try {
            const res = await fetch('https://open.er-api.com/v6/latest/LKR');
            const data = await res.json();
            if (data && data.rates && data.rates.SAR) {
                sarRate = data.rates.SAR;
            }
        } catch (err) {
            console.error('Failed to fetch live exchange rate:', err);
        }
        updateData(); // Re-render once rate is fetched
    }

    function formatCurrency(amount, skipFractions = false) {
        let value = amount;
        let currencyStr = 'LKR';
        let localeStr = 'en-LK';
        
        if (currentCurrency === 'SAR') {
            value = amount * sarRate;
            currencyStr = 'SAR';
            localeStr = 'en-SA';
        }
        
        const options = { style: 'currency', currency: currencyStr };
        if (skipFractions) {
            options.maximumFractionDigits = 0;
        }
        
        return new Intl.NumberFormat(localeStr, options).format(value);
    }
    
    // Fetch live rate on load
    fetchExchangeRate();

    // Toggle Handlers
    const btnLkr = document.getElementById('curr-lkr');
    const btnSar = document.getElementById('curr-sar');
    
    function updateCurrencyButtons() {
        if (!btnLkr || !btnSar) return;
        if (currentCurrency === 'LKR') {
            btnLkr.classList.add('active');
            btnLkr.style.backgroundColor = 'var(--primary)';
            btnLkr.style.color = 'white';
            btnSar.classList.remove('active');
            btnSar.style.backgroundColor = 'transparent';
            btnSar.style.color = 'var(--text-main)';
        } else {
            btnSar.classList.add('active');
            btnSar.style.backgroundColor = 'var(--primary)';
            btnSar.style.color = 'white';
            btnLkr.classList.remove('active');
            btnLkr.style.backgroundColor = 'transparent';
            btnLkr.style.color = 'var(--text-main)';
        }
    }
    
    if (btnLkr && btnSar) {
        updateCurrencyButtons();
        btnLkr.addEventListener('click', () => {
            currentCurrency = 'LKR';
            localStorage.setItem('agency_currency', 'LKR');
            updateCurrencyButtons();
            updateData();
        });
        btnSar.addEventListener('click', () => {
            currentCurrency = 'SAR';
            localStorage.setItem('agency_currency', 'SAR');
            updateCurrencyButtons();
            updateData();
        });
    }

    function saveTransactions() { localStorage.setItem('agency_transactions_v2', JSON.stringify(transactions)); }
    function saveProjects() { localStorage.setItem('agency_projects', JSON.stringify(projects)); }
    function saveGoals() { localStorage.setItem('agency_goals', JSON.stringify(goals)); }
    function saveSMM() {
        localStorage.setItem('agency_smm_clients', JSON.stringify(smmClients));
        localStorage.setItem('agency_smm_posts', JSON.stringify(smmPosts));
    }
    function saveInvoices() { localStorage.setItem('agency_invoices', JSON.stringify(invoices)); }

    if (!localStorage.getItem('agency_seed_v3')) {
        const payload = {"transactions":[{"id":1791124742859,"title":"NatureTreasure","subtitle":"INV-000000000","amount":10000,"date":"2026-08-15","type":"income","category":"Web Development","status":"completed","account":"Abdullah's Account","projectId":"1791124742857"},{"id":1791124742860,"title":"Zip n Co Advance","subtitle":"INV-000000001","amount":50000,"date":"2026-08-15","type":"income","category":"Web Development","status":"completed","account":"Umar's Account","projectId":"1791124742858"},{"id":1791124742861,"title":"Zip n Co PPT","subtitle":"INV-000000002","amount":13000,"date":"2026-08-15","type":"income","category":"Web Development","status":"completed","account":"Umar's Account","projectId":"1791124742858"},{"id":1791124742862,"title":"NaturesTreasure Social Media","subtitle":"INV-000000003","amount":20000,"date":"2026-08-15","type":"income","category":"SMM Retainers","status":"completed","account":"Umar's Account","projectId":"1791124742857"},{"id":1791124742863,"title":"Natures Treasure Web Maintain","subtitle":"INV-000000004","amount":5000,"date":"2026-08-15","type":"income","category":"Web Development","status":"completed","account":"Umar's Account","projectId":"1791124742857"},{"id":1791124742864,"title":"Sadaqa","subtitle":"Donation","amount":-10000,"date":"2026-08-15","type":"expense","category":"Consulting","status":"completed","account":"Abdullah's Account"},{"id":1791124742865,"title":"anti gravity","subtitle":"Tooling","amount":-650,"date":"2026-08-15","type":"expense","category":"SaaS Tools","status":"completed","account":"Umar's Account"},{"id":1791127745145,"title":"Oh donuts","subtitle":"INV-000000005","amount":100000,"date":"2026-10-03","type":"income","category":"Marketing","status":"completed","account":"Umar's Account","projectId":"1791127644687"},{"id":1791127891490,"title":"Sip and  play","subtitle":"INV-000000006","amount":73300,"date":"2026-10-04","type":"income","category":"Web Development","status":"pending","account":"Umar's Account","projectId":"1791124742858"},{"id":1791128209901,"title":"Sip and  play","subtitle":"INV-000000007","amount":15000,"date":"2026-10-04","type":"income","category":"Content Creation","status":"pending","account":"Umar's Account","projectId":null},{"id":1791128923076,"title":"Sip n Play Addon","subtitle":"INV-000000008","amount":5000,"date":"2026-10-04","type":"income","category":"Web Development","status":"pending","account":"Umar's Account","projectId":"1791124742858"}],"projects":[{"id":1791124742857,"name":"Natures Treasure","desc":"Client Project","budget":25000,"spent":35000,"status":"completed","opening":0,"pending":0},{"id":1791124742858,"name":"Sip n Play","desc":"Client Project","budget":118000,"spent":63000,"status":"completed","opening":0,"pending":78300},{"id":1791127644687,"name":"oh donuts ","desc":"Full marketing ","service":"Marketing","budget":100000,"spent":100000,"status":"completed","opening":0,"pending":0}],"goals":[],"smmClients":[{"id":1791124742957,"name":"Natures Treasure","platforms":["instagram","facebook"],"package":"Growth","fee":20000,"postsPerMonth":12,"adBudget":0,"status":"active"},{"id":1791127686193,"name":"Oh donuts","platforms":["instagram","facebook","tiktok"],"package":"Custom","fee":100000,"postsPerMonth":5,"adBudget":-0.07,"status":"active"}],"smmPosts":[{"id":1791125053138,"clientId":1791124742957,"title":"Test reel","platform":"instagram","type":"Post","date":"2026-10-04","status":"idea"}]};
        
        transactions = payload.transactions || [];
        projects = payload.projects || [];
        goals = payload.goals || [];
        smmClients = payload.smmClients || [];
        smmPosts = payload.smmPosts || [];
        
        saveTransactions();
        saveProjects();
        saveGoals();
        saveSMM();
        localStorage.setItem('agency_seed_v3', 'true');
        localStorage.setItem('agency_seed_august', 'true');
    }

    if (!localStorage.getItem('agency_migrated_projectIds_v1')) {
        let migrationOccurred = false;
        
        const naturesProject = projects.find(p => p.name === 'Natures Treasure');
        const sipProject = projects.find(p => p.name === 'Sip n Play');
        
        transactions.forEach(t => {
            if (!t.projectId) {
                const titleLower = t.title.toLowerCase();
                if (titleLower.includes('nature') && naturesProject) {
                    t.projectId = String(naturesProject.id);
                    migrationOccurred = true;
                } else if (titleLower.includes('zip') && sipProject) {
                    t.projectId = String(sipProject.id);
                    migrationOccurred = true;
                }
            }
        });
        
        if (migrationOccurred) saveTransactions();
        localStorage.setItem('agency_migrated_projectIds_v1', 'true');
    }

    if (!localStorage.getItem('agency_migrated_accounts_v1')) {
        let accountsMigrated = false;
        transactions.forEach(t => {
            if (t.category !== 'Partner Transfer') {
                const acc = (t.account || '').toLowerCase();
                if (acc.includes('abdullah') || acc.includes('ashad') || acc.includes('arshad')) {
                    if (t.account !== "Abdullah's Account") {
                        t.account = "Abdullah's Account";
                        accountsMigrated = true;
                    }
                } else {
                    if (t.account !== "Umar's Account") {
                        t.account = "Umar's Account";
                        accountsMigrated = true;
                    }
                }
            }
        });
        if (accountsMigrated) saveTransactions();
        localStorage.setItem('agency_migrated_accounts_v1', 'true');
    }

    // Seed the first Social Media client from the existing Natures Treasure retainer
    if (!localStorage.getItem('agency_seed_smm_v1')) {
        if (smmClients.length === 0) {
            smmClients.push({ id: Date.now() + 100, name: 'Natures Treasure', platforms: ['instagram', 'facebook'], package: 'Growth', fee: 20000, postsPerMonth: 12, adBudget: 0, status: 'active' });
            saveSMM();
        }
        localStorage.setItem('agency_seed_smm_v1', 'true');
    }

    // Projects: "spent" is now derived live from linked paid income + an opening balance
    let projectsMigrated = false;
    projects.forEach(p => { if (p.opening === undefined) { p.opening = 0; projectsMigrated = true; } });
    if (projectsMigrated) saveProjects();

    function syncProjectTotals() {
        projects.forEach(p => {
            const linkedCompleted = transactions
                .filter(t => t.projectId == p.id && t.type === 'income' && t.status === 'completed')
                .reduce((sum, t) => sum + t.amount, 0);
            const linkedPending = transactions
                .filter(t => t.projectId == p.id && t.type === 'income' && t.status === 'pending')
                .reduce((sum, t) => sum + t.amount, 0);
            p.spent = (p.opening || 0) + linkedCompleted;
            p.pending = linkedPending;
        });
    }

    // === Global Month Filter Setup ===
    const globalMonthFilter = document.getElementById('global-month-filter');
    let selectedMonth = 'all';

    function populateMonthFilter() {
        const months = new Set();
        transactions.forEach(t => {
            const dateStr = t.date.substring(0, 7);
            months.add(dateStr);
        });
        
        const sortedMonths = Array.from(months).sort().reverse();
        const currentSelection = globalMonthFilter.value;
        
        globalMonthFilter.innerHTML = '<option value="all">All Time</option>';
        
        sortedMonths.forEach(monthStr => {
            const [year, month] = monthStr.split('-');
            const dateObj = new Date(year, month - 1);
            const label = dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });
            
            const option = document.createElement('option');
            option.value = monthStr;
            option.textContent = label;
            globalMonthFilter.appendChild(option);
        });

        if (sortedMonths.includes(currentSelection) || currentSelection === 'all') {
            globalMonthFilter.value = currentSelection;
            selectedMonth = currentSelection;
        } else {
            globalMonthFilter.value = 'all';
            selectedMonth = 'all';
        }
    }

    globalMonthFilter.addEventListener('change', (e) => {
        selectedMonth = e.target.value;
        updateData();
    });

    function getFilteredTransactions() {
        if (selectedMonth === 'all') return transactions;
        return transactions.filter(t => t.date.startsWith(selectedMonth));
    }

    // === Navigation (SPA Logic) ===
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            viewSections.forEach(section => section.classList.remove('active'));
            
            item.classList.add('active');
            
            const clientTab = item.getAttribute('data-client-tab');
            if (clientTab) {
                const clientView = document.getElementById('client-portal-view');
                if (clientView) clientView.classList.add('active');
                if (typeof window.switchClientTab === 'function') {
                    window.switchClientTab(clientTab);
                }
                if (pageTitle) pageTitle.textContent = 'Sip and Play • ' + item.querySelector('span').textContent;
                const calContainer = document.getElementById('header-calendar-container');
                if (calContainer) calContainer.style.display = 'none';
            } else {
                const viewId = item.getAttribute('data-view');
                const targetView = document.getElementById(viewId);
                if (targetView) {
                    targetView.classList.add('active');
                    if (pageTitle) pageTitle.textContent = item.querySelector('span').textContent;
                }
                const calContainer = document.getElementById('header-calendar-container');
                if (calContainer) {
                    calContainer.style.display = (viewId === 'dashboard-view' || viewId === 'transactions-view') ? 'flex' : 'none';
                }
            }
            
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                if (overlay) overlay.classList.remove('active');
            }
        });
    });

    const viewAllBtn = document.getElementById('view-all-transactions');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            document.querySelector('[data-view="transactions-view"]').click();
        });
    }

    // === Sidebar & Theme ===
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    toggleSidebarBtn.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.add('mobile-open');
        overlay.classList.add('active');
    });
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
    });

    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const themeText = themeToggleBtn.querySelector('span');
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.setAttribute('data-theme', 'dark');
        updateThemeUI(true);
    }

    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            updateThemeUI(false);
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateThemeUI(true);
        }
        renderCharts(getFilteredTransactions());
    });

    function updateThemeUI(isDark) {
        if (isDark) {
            themeIcon.classList.replace('ph-moon', 'ph-sun');
            if(themeText) themeText.textContent = 'Light Mode';
        } else {
            themeIcon.classList.replace('ph-sun', 'ph-moon');
            if(themeText) themeText.textContent = 'Dark Mode';
        }
    }

    // === UI Render Logic ===
    const categoryConfig = {
        'Web Development': { icon: 'ph-code', class: 'housing', color: 'primary' },
        'SMM Retainers': { icon: 'ph-share-network', class: 'food', color: 'warning' },
        'Consulting': { icon: 'ph-lightbulb', class: 'entertainment', color: 'info' },
        'SaaS Tools': { icon: 'ph-cloud', class: 'subscriptions', color: 'danger' },
        'Ad Spend': { icon: 'ph-megaphone', class: 'subscriptions', color: 'danger' },
        'Contractors': { icon: 'ph-users', class: 'entertainment', color: 'info' },
        'Payroll': { icon: 'ph-money', class: 'housing', color: 'primary' },
        'Admin': { icon: 'ph-files', class: 'food', color: 'warning' },
        'Partner Transfer': { icon: 'ph-arrows-left-right', class: 'entertainment', color: 'info' },
        'Content Creation': { icon: 'ph-camera', class: 'entertainment', color: 'info' },
        'Influencer': { icon: 'ph-star', class: 'subscriptions', color: 'danger' },
        'Marketing': { icon: 'ph-megaphone-simple', class: 'food', color: 'warning' }
    };

    function renderTransactionsTable(transactionsToRender, tbodyId) {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (transactionsToRender.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="6"><div class="empty-table">No records found for the selected period.</div></td>`;
            tbody.appendChild(tr);
            return;
        }

        const sortedTrx = [...transactionsToRender].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedTrx.forEach(trx => {
            const tr = document.createElement('tr');
            const conf = categoryConfig[trx.category] || { icon: 'ph-wallet', class: 'housing', color: 'primary' };
            const formattedAmount = formatCurrency(Math.abs(trx.amount));
            const amountClass = trx.type === 'income' ? 'amount positive' : 'amount';
            const sign = trx.type === 'income' ? '+' : '-';
            const statusClass = trx.status === 'completed' ? 's-posted' : 's-progress';

            tr.innerHTML = `
                <td>${new Date(trx.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</td>
                <td>
                    <div class="transaction-desc">
                        <div class="desc-icon ${conf.class}" style="background-color: rgba(0,0,0,0.05); color: var(--text-main);">
                            <i class="ph ${conf.icon}"></i>
                        </div>
                        <div class="desc-info">
                            <span class="desc-title">${trx.title}</span>
                            <span class="desc-subtitle">${trx.subtitle || ''}${trx.account ? ' • ' + trx.account : ''}</span>
                        </div>
                    </div>
                </td>
                <td><span class="badge ${conf.class}">${trx.category}</span></td>
                <td>
                    <select class="post-status-select ${statusClass} trx-status-select" data-id="${trx.id}">
                        <option value="completed" ${trx.status === 'completed' ? 'selected' : ''}>Paid / Received</option>
                        <option value="pending" ${trx.status !== 'completed' ? 'selected' : ''}>Pending / Sent</option>
                    </select>
                </td>
                <td class="text-right">
                    <span class="${amountClass}">${sign}${formattedAmount}</span>
                </td>
                <td>
                    <div style="display: flex; gap: 0.25rem; justify-content: flex-end;">
                        ${trx.type === 'income' ? `<button class="invoice-btn" data-id="${trx.id}" title="Generate / View Invoice"><i class="ph ph-receipt"></i></button>` : ''}
                        <button class="edit-btn" data-type="transaction" data-id="${trx.id}" title="Edit Record"><i class="ph ph-pencil-simple"></i></button>
                        <button class="delete-btn" data-type="transaction" data-id="${trx.id}" title="Delete Record">
                            <i class="ph ph-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderProjects() {
        const container = document.getElementById('projects-container');
        if (!container) return;
        
        let totalExpected = 0;
        let totalReceived = 0;

        const formatter = { format: (val) => formatCurrency(val, true) };

        if (projects.length === 0) {
            document.getElementById('proj-kpi-expected').textContent = formatter.format(0);
            document.getElementById('proj-kpi-received').textContent = formatter.format(0);
            document.getElementById('proj-kpi-split').textContent = formatter.format(0) + ' each';
            
            const overviewExpected = document.getElementById('kpi-total-expected');
            const overviewReceived = document.getElementById('kpi-total-received');
            if (overviewExpected) overviewExpected.textContent = formatter.format(0);
            if (overviewReceived) overviewReceived.textContent = formatter.format(0);
            
            container.innerHTML = `<div class="empty-state-message" style="grid-column: 1 / -1;">No active projects. Add a project to get started.</div>`;
            return;
        }

        container.innerHTML = '';
        projects.forEach(proj => {
            totalExpected += proj.budget;
            totalReceived += proj.spent;
            
            const progress = (proj.spent / proj.budget) * 100 || 0;
            const progressColor = progress > 100 ? 'var(--danger)' : progress === 100 ? 'var(--success)' : 'var(--primary)';
            const statusClass = proj.status === 'completed' ? 'status-completed' : 'status-pending';
            const statusText = proj.status === 'completed' ? 'Completed / Active' : 'In Progress';
            const remaining = proj.pending || 0;

            container.innerHTML += `
                <div class="card project-card">
                    <button class="delete-card-btn delete-btn" data-type="project" data-id="${proj.id}" title="Delete Project"><i class="ph ph-trash"></i></button>
                    <button class="delete-card-btn edit-btn" style="right: 3rem;" data-type="project" data-id="${proj.id}" title="Edit Project"><i class="ph ph-pencil-simple"></i></button>
                    <div class="project-header">
                        <h3 style="padding-right: 4.5rem;">${esc(proj.name)}</h3>
                        <select class="post-status-select ${proj.status === 'completed' ? 's-posted' : 's-progress'} project-status-select" data-id="${proj.id}">
                            <option value="pending" ${proj.status !== 'completed' ? 'selected' : ''}>In Progress</option>
                            <option value="completed" ${proj.status === 'completed' ? 'selected' : ''}>Completed / Active</option>
                        </select>
                    </div>
                    <p class="project-desc">${esc(proj.desc)}</p>
                    <span class="badge housing" style="align-self: flex-start;">${esc(proj.service || 'Web Development')}</span>
                    <div class="project-stats">
                        <div class="stat"><span>Contract Value</span><strong>${formatter.format(proj.budget)}</strong></div>
                        <div class="stat text-right"><span style="text-align: right;">Received</span><strong>${formatter.format(proj.spent)}</strong></div>
                    </div>
                    <div class="project-stats" style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed var(--border-color);">
                        <div class="stat"><span>Remaining to receive</span><strong style="color: var(--warning);">${formatter.format(remaining)}</strong></div>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${Math.min(progress, 100)}%; background-color: ${progressColor};"></div>
                    </div>
                </div>
            `;
        });
        
        document.getElementById('proj-kpi-expected').textContent = formatter.format(totalExpected);
        document.getElementById('proj-kpi-received').textContent = formatter.format(totalReceived);
        document.getElementById('proj-kpi-split').textContent = formatter.format(totalReceived / 2) + ' each';
    }

    function renderGoals(totalIncome) {
        const container = document.getElementById('goals-container');
        if (!container) return;

        if (goals.length === 0) {
            container.innerHTML = `<div class="empty-state-message">No active revenue targets. Add a goal to track your growth.</div>`;
            return;
        }

        container.innerHTML = '';
        goals.forEach(goal => {
            const progress = (totalIncome / goal.target) * 100 || 0;
            const isCompleted = progress >= 100;
            const progressColor = isCompleted ? 'var(--success)' : 'var(--primary)';
            
            const formatter = { format: (val) => formatCurrency(val, true) };

            container.innerHTML += `
                <div class="card goal-card-container" style="margin-bottom: 2rem;">
                    <button class="delete-card-btn delete-btn" data-type="goal" data-id="${goal.id}" title="Delete Goal"><i class="ph ph-trash"></i></button>
                    <div class="card-header">
                        <h3>${goal.title}</h3>
                    </div>
                    <div class="kpi-body" style="margin-top: 1rem;">
                        <h2>${formatter.format(totalIncome)} / ${formatter.format(goal.target)}</h2>
                        <div class="progress-bar-container" style="height: 12px;">
                            <div class="progress-bar" style="width: ${Math.min(progress, 100)}%; background-color: ${progressColor};"></div>
                        </div>
                        <p style="color: var(--text-muted); margin-top: 0.5rem; font-size: 0.875rem;">
                            ${isCompleted ? 'Target achieved! Incredible work!' : 'You are ' + Math.floor(progress) + '% towards your goal. Keep pushing!'}
                        </p>
                    </div>
                </div>
            `;
        });
    }

    // === Social Media Marketing ===
    const platformConfig = {
        instagram: { icon: 'ph-instagram-logo', label: 'Instagram' },
        facebook: { icon: 'ph-facebook-logo', label: 'Facebook' },
        tiktok: { icon: 'ph-tiktok-logo', label: 'TikTok' },
        linkedin: { icon: 'ph-linkedin-logo', label: 'LinkedIn' },
        youtube: { icon: 'ph-youtube-logo', label: 'YouTube' },
        x: { icon: 'ph-x-logo', label: 'X' },
        snapchat: { icon: 'ph-snapchat-logo', label: 'Snapchat' }
    };

    function esc(str) {
        const d = document.createElement('div');
        d.textContent = str == null ? '' : String(str);
        return d.innerHTML;
    }

    function currentMonthKey() {
        const n = new Date();
        return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0');
    }

    function postsDeliveredFor(clientId) {
        const key = currentMonthKey();
        return smmPosts.filter(p => p.clientId == clientId && p.status === 'posted' && p.date.startsWith(key)).length;
    }

    function renderSMM() {
        const fmt = (v) => formatCurrency(v, true);
        const active = smmClients.filter(c => c.status === 'active');
        const monthlyValue = active.reduce((s, c) => s + c.fee, 0);
        const adBudget = active.reduce((s, c) => s + (c.adBudget || 0), 0);
        const target = active.reduce((s, c) => s + c.postsPerMonth, 0);
        const delivered = active.reduce((s, c) => s + postsDeliveredFor(c.id), 0);

        const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setText('smm-kpi-clients', active.length);
        setText('smm-kpi-revenue', fmt(monthlyValue));
        setText('smm-kpi-posts', delivered + ' / ' + target);
        setText('smm-kpi-ads', fmt(adBudget));
        setText('kpi-smm-clients', active.length);
        setText('kpi-smm-posts', delivered + ' / ' + target);

        // Client cards
        const container = document.getElementById('smm-clients-container');
        if (container) {
            if (smmClients.length === 0) {
                container.innerHTML = '<div class="empty-state-message" style="grid-column: 1 / -1;">No social media clients yet. Use "New Record" to add your first client.</div>';
            } else {
                container.innerHTML = smmClients.map(c => {
                    const done = postsDeliveredFor(c.id);
                    const pct = c.postsPerMonth > 0 ? Math.min((done / c.postsPerMonth) * 100, 100) : 0;
                    const statusClass = c.status === 'active' ? 'status-completed' : 'status-pending';
                    const icons = (c.platforms || []).map(p => platformConfig[p] ? `<span title="${platformConfig[p].label}"><i class="ph ${platformConfig[p].icon}"></i></span>` : '').join('');
                    return `
                        <div class="card smm-card">
                            <button class="delete-card-btn delete-btn" data-type="smm-client" data-id="${c.id}" title="Delete Client"><i class="ph ph-trash"></i></button>
                            <button class="delete-card-btn edit-btn" style="right: 3rem;" data-type="smm-client" data-id="${c.id}" title="Edit Client"><i class="ph ph-pencil-simple"></i></button>
                            <div class="smm-card-top">
                                <div class="smm-avatar">${esc(c.name.charAt(0).toUpperCase())}</div>
                                <div>
                                    <h3>${esc(c.name)}</h3>
                                    <span class="smm-package">${esc(c.package)} package</span>
                                </div>
                            </div>
                            <div class="platform-icons">${icons}</div>
                            <div class="smm-meta">
                                <div>Retainer<strong>${fmt(c.fee)}</strong></div>
                                <div style="text-align:right;">Ad budget<strong>${fmt(c.adBudget || 0)}</strong></div>
                            </div>
                            <div>
                                <div class="smm-progress-label"><span>Posts this month</span><span>${done} / ${c.postsPerMonth}</span></div>
                                <div class="progress-bar-container" style="margin-top: 0.4rem;"><div class="progress-bar" style="width: ${pct}%;"></div></div>
                            </div>
                            <select class="post-status-select ${c.status === 'active' ? 's-posted' : 's-progress'} smm-status-select" data-id="${c.id}" style="align-self:flex-start;">
                                <option value="active" ${c.status === 'active' ? 'selected' : ''}>Active</option>
                                <option value="paused" ${c.status !== 'active' ? 'selected' : ''}>Paused</option>
                            </select>
                        </div>`;
                }).join('');
            }
        }

        // Content pipeline
        const body = document.getElementById('smm-posts-body');
        if (body) {
            if (smmPosts.length === 0) {
                body.innerHTML = '<tr><td colspan="7"><div class="empty-table">No content planned yet. Click "Add Content" to start your pipeline.</div></td></tr>';
            } else {
                const statuses = { idea: 'Idea', progress: 'In Production', scheduled: 'Scheduled', posted: 'Posted' };
                body.innerHTML = [...smmPosts].sort((a, b) => new Date(a.date) - new Date(b.date)).map(p => {
                    const client = smmClients.find(c => c.id == p.clientId);
                    const plat = platformConfig[p.platform] || { icon: 'ph-globe', label: p.platform };
                    const options = Object.keys(statuses).map(k => `<option value="${k}" ${p.status === k ? 'selected' : ''}>${statuses[k]}</option>`).join('');
                    return `
                        <tr>
                            <td>${new Date(p.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                            <td><strong>${esc(p.title)}</strong></td>
                            <td>${client ? esc(client.name) : '<span style="color: var(--text-muted);">Removed client</span>'}</td>
                            <td><span class="platform-pill"><i class="ph ${plat.icon}"></i> ${plat.label}</span></td>
                            <td>${esc(p.type)}</td>
                            <td><select class="post-status-select s-${p.status}" data-post-id="${p.id}">${options}</select></td>
                            <td><button class="delete-btn" data-type="smm-post" data-id="${p.id}" title="Delete Content"><i class="ph ph-trash"></i></button></td>
                        </tr>`;
                }).join('');
            }
        }
    }

    // Inline status change for content pipeline
    document.body.addEventListener('change', (e) => {
        const sel = e.target.closest('.post-status-select');
        if (!sel) return;
        const post = smmPosts.find(p => p.id == sel.getAttribute('data-post-id'));
        if (post) {
            post.status = sel.value;
            saveSMM();
            updateData();
        }
    });

    function updateData() {
        syncProjectTotals();
        populateMonthFilter();
        const activeData = getFilteredTransactions();

        // 1. Render Transaction Tables
        renderTransactionsTable(activeData.slice(0, 5), 'recent-transactions-body'); 
        
        const statusFilterVal = document.getElementById('filter-status') ? document.getElementById('filter-status').value : 'all';
        let allPageData = activeData;
        if (statusFilterVal !== 'all') {
            allPageData = activeData.filter(t => t.status === statusFilterVal);
        }
        renderTransactionsTable(allPageData, 'all-transactions-body'); 
        
        // 2. Calculate KPIs
        let totalIncome = 0;
        let totalPendingIncome = 0;
        let totalExpenses = 0;
        let totalTransferred = 0;
        
        let umarCash = 0;
        let abdullahCash = 0;
        
        activeData.forEach(trx => {
            if (trx.status === 'completed') {
                if (trx.category === 'Partner Transfer') {
                    totalTransferred += Math.abs(trx.amount);
                    umarCash -= Math.abs(trx.amount);
                    abdullahCash += Math.abs(trx.amount);
                } else if (trx.type === 'income') {
                    totalIncome += trx.amount;
                    if (trx.account === "Abdullah's Account") abdullahCash += trx.amount;
                    else umarCash += trx.amount;
                }
                else {
                    totalExpenses += Math.abs(trx.amount);
                    if (trx.account === "Abdullah's Account") abdullahCash -= Math.abs(trx.amount);
                    else umarCash -= Math.abs(trx.amount);
                }
            } else if (trx.status === 'pending') {
                if (trx.category === 'Partner Transfer') {
                    // Ignored in totals
                } else if (trx.type === 'income') {
                    totalPendingIncome += trx.amount;
                }
            }
        });

        const currentBalance = totalIncome - totalExpenses;
        const totalExpectedRevenue = totalIncome + totalPendingIncome;

        // Calculate "This Month Rev" independent of the filter
        const currentMonthStr = currentMonthKey();
        let thisMonthRev = 0;
        transactions.forEach(trx => {
            if (trx.status === 'completed' && trx.type === 'income' && trx.date.startsWith(currentMonthStr)) {
                thisMonthRev += trx.amount;
            }
        });

        document.getElementById('kpi-balance').textContent = formatCurrency(currentBalance);
        
        const umarBalEl = document.getElementById('kpi-balance-umar');
        const abdullahBalEl = document.getElementById('kpi-balance-abdullah');
        if (umarBalEl) umarBalEl.textContent = formatCurrency(umarCash, true);
        if (abdullahBalEl) abdullahBalEl.textContent = formatCurrency(abdullahCash, true);
        
        document.getElementById('kpi-income').textContent = formatCurrency(thisMonthRev); 
        document.getElementById('kpi-expenses').textContent = formatCurrency(totalExpenses);

        const overviewExpected = document.getElementById('kpi-total-expected');
        if (overviewExpected) overviewExpected.textContent = formatCurrency(totalExpectedRevenue);
        const overviewReceived = document.getElementById('kpi-total-received');
        if (overviewReceived) overviewReceived.textContent = formatCurrency(totalIncome);

        const partnerShare = totalIncome / 2;
        const abdullahEl = document.getElementById('partner-abdullah');
        const umarEl = document.getElementById('partner-umar');
        if (abdullahEl) abdullahEl.textContent = formatCurrency(partnerShare);
        if (umarEl) umarEl.textContent = formatCurrency(partnerShare);

        const transferredEl = document.getElementById('umar-transferred');
        const balanceEl = document.getElementById('abdullah-balance');
        if (transferredEl) transferredEl.textContent = formatCurrency(totalTransferred);
        if (balanceEl) balanceEl.textContent = formatCurrency(partnerShare - totalTransferred);

        renderCharts(activeData);
        
        // 3. Render Projects & Goals
        renderProjects();
        renderGoals(totalExpectedRevenue);
        renderSMM();

        // 4. Sync Real Data to Growth Studio & Client Portal
        syncGrowthStudioData();
        syncClientPortalData();
    }

    function syncGrowthStudioData() {
        const serviceBody = document.getElementById('growth-service-body');
        const healthBody = document.getElementById('growth-health-body');
        const clientCountEl = document.getElementById('growth-client-count');

        if (!serviceBody && !healthBody) return;

        // 1. Group transactions by category (income only)
        const categories = {};
        let totalAllReceived = 0;
        transactions.forEach(t => {
            if (t.type === 'income' && t.category !== 'Partner Transfer') {
                const cat = t.category || 'General Services';
                if (!categories[cat]) categories[cat] = { name: cat, count: 0, received: 0, pending: 0 };
                categories[cat].count++;
                if (t.status === 'completed') {
                    categories[cat].received += t.amount;
                    totalAllReceived += t.amount;
                } else {
                    categories[cat].pending += t.amount;
                }
            }
        });

        if (serviceBody) {
            const catKeys = Object.keys(categories);
            if (catKeys.length === 0) {
                serviceBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-muted);">No services recorded yet.</td></tr>';
            } else {
                serviceBody.innerHTML = catKeys.map(k => {
                    const c = categories[k];
                    const pct = totalAllReceived > 0 ? Math.round((c.received / totalAllReceived) * 100) : 0;
                    return `
                        <tr>
                            <td><strong style="color: #fff; font-size: 0.92rem;">${esc(c.name)}</strong></td>
                            <td><span class="invoice-count-badge">${c.count} invoice${c.count > 1 ? 's' : ''}</span></td>
                            <td class="num" style="color: var(--primary); font-weight: 700; font-size: 0.92rem;">${formatCurrency(c.received)}</td>
                            <td class="num" style="color: ${c.pending > 0 ? '#fbbf24' : '#64748b'}; font-weight: 600;">${c.pending > 0 ? formatCurrency(c.pending) : '—'}</td>
                            <td>
                                <div class="share-bar-container">
                                    <div class="share-bar-track">
                                        <div class="share-bar-fill" style="width: ${pct}%;"></div>
                                    </div>
                                    <span class="share-bar-label">${pct}%</span>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }

        // 2. High-End Client Health Radar (Canonical Active Accounts)
        if (healthBody) {
            const clientDefs = [
                {
                    key: 'sipnplay',
                    name: 'Sip & Play Cafe',
                    subtitle: 'Hospitality & Gaming Lounge',
                    projectId: '1791124742858',
                    matchWords: ['sip', 'zip'],
                    services: ['Web Development', 'Content Creation']
                },
                {
                    key: 'naturestreasure',
                    name: "Nature's Treasure",
                    subtitle: 'Luxury Oud & Fragrances',
                    projectId: '1791124742857',
                    matchWords: ['nature'],
                    services: ['Web Development', 'SMM Retainers']
                },
                {
                    key: 'ohdonuts',
                    name: 'Oh Donuts',
                    subtitle: 'Gourmet F&B Retail Brand',
                    projectId: '1791127644687',
                    matchWords: ['donut'],
                    services: ['Marketing Retainer']
                }
            ];

            const clientMap = {};
            clientDefs.forEach(d => {
                clientMap[d.key] = {
                    name: d.name,
                    subtitle: d.subtitle,
                    services: [...d.services],
                    billed: 0,
                    received: 0,
                    pending: 0
                };
            });

            // Reconcile from actual projects
            projects.forEach(p => {
                const nameLow = p.name.toLowerCase();
                let matched = clientDefs.find(d => d.projectId === String(p.id) || d.matchWords.some(w => nameLow.includes(w)));
                if (matched) {
                    const c = clientMap[matched.key];
                    c.billed = Math.max(c.billed, p.budget || 0, (p.spent || 0) + (p.pending || 0));
                    c.received = Math.max(c.received, p.spent || 0);
                    c.pending = Math.max(c.pending, p.pending || 0);
                }
            });

            // Reconcile from transactions to capture all payments
            transactions.forEach(t => {
                if (t.type === 'income' && t.category !== 'Partner Transfer') {
                    const titleLow = t.title.toLowerCase();
                    let matched = clientDefs.find(d => (t.projectId && d.projectId === String(t.projectId)) || d.matchWords.some(w => titleLow.includes(w)));
                    if (matched) {
                        const c = clientMap[matched.key];
                        if (t.category && !c.services.includes(t.category)) {
                            c.services.push(t.category);
                        }
                    }
                }
            });

            const clientList = Object.values(clientMap).filter(c => (c.billed > 0 || c.received > 0 || c.pending > 0));
            if (clientCountEl) clientCountEl.innerHTML = `<i class="ph ph-users"></i> ${clientList.length} Active Clients`;

            if (clientList.length === 0) {
                healthBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">No active clients recorded.</td></tr>';
            } else {
                healthBody.innerHTML = clientList.map(c => {
                    const isPending = c.pending > 0;
                    const statusTag = isPending 
                        ? '<span class="status-indicator-amber">Pending Payment</span>' 
                        : '<span class="status-indicator-green"><i class="ph ph-check"></i> Up to Date</span>';
                    return `
                        <tr>
                            <td>
                                <div class="client-name-cell">
                                    <strong>${esc(c.name)}</strong>
                                    <span>${esc(c.subtitle)}</span>
                                </div>
                            </td>
                            <td>
                                <div class="service-tag-list">
                                    ${c.services.map(s => `<span class="service-tag-pill">${esc(s)}</span>`).join('')}
                                </div>
                            </td>
                            <td class="num"><strong style="color: #fff; font-size: 0.92rem;">${formatCurrency(c.billed)}</strong></td>
                            <td class="num" style="color: var(--primary); font-weight: 700; font-size: 0.92rem;">${formatCurrency(c.received)}</td>
                            <td class="num" style="color: ${isPending ? '#fbbf24' : '#64748b'}; font-weight: 700; font-size: 0.92rem;">${isPending ? formatCurrency(c.pending) : '0.00 LKR'}</td>
                            <td>${statusTag}</td>
                        </tr>
                    `;
                }).join('');
            }
        }
    }

    function syncClientPortalData() {
        const sipProject = projects.find(p => p.name.toLowerCase().includes('sip')) || { budget: 118000, spent: 63000, pending: 78300 };
        const sipTrxs = transactions.filter(t => t.title.toLowerCase().includes('sip'));

        const pendingDue = sipProject.pending || 78300;
        const pendingEl = document.getElementById('client-pending-amount');
        if (pendingEl) pendingEl.textContent = formatCurrency(pendingDue);

        const pctEl = document.getElementById('client-project-pct');
        const barEl = document.getElementById('client-progress-bar');
        const pctVal = sipProject.budget > 0 ? Math.round((sipProject.spent / sipProject.budget) * 100) : 75;
        if (pctEl) pctEl.textContent = `${pctVal}% Completed`;
        if (barEl) barEl.style.width = `${pctVal}%`;

        // Render Invoices table inside client portal billing pane
        const invTableBody = document.getElementById('client-invoices-tbody');
        if (invTableBody && sipTrxs.length > 0) {
            invTableBody.innerHTML = sipTrxs.map(t => {
                const isPaid = t.status === 'completed';
                const invNum = esc(t.subtitle || 'INV-' + t.id);
                const scope = esc(t.category || 'Deliverables');
                return `
                    <tr>
                        <td><strong>${invNum}</strong></td>
                        <td>${esc(t.date || '2026-10-04')}</td>
                        <td><span style="color: ${isPaid ? 'var(--text-muted)' : 'var(--accent-gold)'}; font-weight: 600;">30/10/2026</span></td>
                        <td>${scope}</td>
                        <td style="font-weight: 700;">${formatCurrency(t.amount)}</td>
                        <td>
                            <span class="${isPaid ? 'status-indicator-green' : 'status-indicator-amber'}">
                                ${isPaid ? 'Paid in Full ✓' : 'Pending Payment'}
                            </span>
                        </td>
                        <td>
                            <button class="btn-invoice-download" onclick="viewClientInvoiceDirect('${invNum}', ${t.amount}, '${scope}')">
                                <i class="ph ph-file-pdf"></i> <span>View &amp; Download PDF</span>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }

    // === Dynamic Modal Routing Logic ===
    const transactionModal = document.getElementById('transaction-modal');
    const projectModal = document.getElementById('project-modal');
    const goalModal = document.getElementById('goal-modal');
    const openAddBtn = document.getElementById('open-add-modal');
    
    openAddBtn.addEventListener('click', () => {
        // Determine which view is currently active
        const activeView = document.querySelector('.view-section.active').id;
        
        if (activeView === 'projects-view') {
            editingProjectId = null;
            projectModal.querySelector('form').reset();
            setModalMode(projectModal, 'Add Project', 'Save Project');
            projectModal.classList.add('active');
        } else if (activeView === 'smm-view') {
            editingSmmId = null;
            const smmModal = document.getElementById('smm-client-modal');
            smmModal.querySelector('form').reset();
            setModalMode(smmModal, 'Add Social Media Client', 'Save Client');
            smmModal.classList.add('active');
        } else if (activeView === 'goals-view') {
            goalModal.classList.add('active');
        } else {
            editingTrxId = null;
            setModalMode(transactionModal, 'Add Record', 'Save Record');
            transactionModal.classList.add('active');
            document.getElementById('trx-date').valueAsDate = new Date();
            
            // Populate Linked Project Dropdown
            const projectSelect = document.getElementById('trx-project');
            projectSelect.innerHTML = '<option value="">-- None --</option>';
            projects.forEach(p => {
                projectSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
            });
            
            // Auto-generate sequential 9-digit invoice number starting from 0
            let currentCounter = parseInt(localStorage.getItem('agency_invoice_counter')) || 0;
            let paddedCounter = String(currentCounter).padStart(9, '0');
            document.getElementById('trx-subtitle').value = 'INV-' + paddedCounter;
        }
    });

    // Close logic for all modals
    document.querySelectorAll('.close-modal, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const activeModal = e.target.closest('.modal-overlay');
            if (activeModal) {
                activeModal.classList.remove('active');
                activeModal.querySelector('form').reset();
            }
        });
    });

    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                modal.querySelector('form')?.reset();
            }
        });
    });

    document.body.addEventListener('click', (e) => {
        // Handle Project Card Clicks
        const projectCard = e.target.closest('.project-card');
        if (projectCard && !e.target.closest('.delete-btn, .edit-btn, select')) {
            const deleteBtn = projectCard.querySelector('.delete-btn');
            if (deleteBtn) {
                const projectId = deleteBtn.getAttribute('data-id');
                openProjectDetails(projectId);
            }
        }
        
        // Handle Delete Buttons
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            const type = deleteBtn.getAttribute('data-type');
            const id = parseInt(deleteBtn.getAttribute('data-id'));
            
            if (confirm(`Are you sure you want to delete this ${type.replace('smm-', 'social media ')}?`)) {
                if (type === 'transaction') {
                    transactions = transactions.filter(t => t.id !== id);
                    saveTransactions();
                } else if (type === 'project') {
                    projects = projects.filter(p => p.id !== id);
                    transactions.forEach(t => { if (t.projectId == id) t.projectId = null; });
                    saveProjects();
                    saveTransactions();
                } else if (type === 'goal') {
                    goals = goals.filter(g => g.id !== id);
                    saveGoals();
                } else if (type === 'smm-client') {
                    smmClients = smmClients.filter(c => c.id !== id);
                    smmPosts = smmPosts.filter(p => p.clientId != id);
                    saveSMM();
                } else if (type === 'smm-post') {
                    smmPosts = smmPosts.filter(p => p.id !== id);
                    saveSMM();
                }
                updateData();
            }
        }
    });

    function openProjectDetails(projectId) {
        const project = projects.find(p => p.id == projectId);
        if (!project) return;
        
        const formatter = { format: (val) => formatCurrency(val, true) };
        const remaining = project.pending || 0;
        
        document.getElementById('pd-title').textContent = project.name;
        document.getElementById('pd-budget').textContent = formatter.format(project.budget);
        document.getElementById('pd-spent').textContent = formatter.format(project.spent);
        document.getElementById('pd-remaining').textContent = formatter.format(remaining);
        
        const pdTransactionsBody = document.getElementById('pd-transactions-body');
        pdTransactionsBody.innerHTML = '';
        
        const projectTransactions = transactions.filter(t => t.projectId == projectId);
        
        if (projectTransactions.length === 0) {
            pdTransactionsBody.innerHTML = '<tr><td colspan="3" class="text-center" style="padding: 1.5rem; color: var(--text-muted);">No transactions linked to this project yet.</td></tr>';
        } else {
            projectTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(t => {
                const amountClass = t.amount >= 0 ? 'text-success' : '';
                pdTransactionsBody.innerHTML += `
                    <tr>
                        <td style="color: var(--text-muted); font-size: 0.875rem;">${new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>
                            <div style="display: flex; flex-direction: column;">
                                <strong>${t.title}</strong>
                                <span style="font-size: 0.8rem; color: var(--text-muted);">${t.subtitle || ''}${t.account ? ' • ' + t.account : ''}</span>
                            </div>
                        </td>
                        <td class="${amountClass}" style="text-align: right; font-weight: 600;">
                            ${formatter.format(t.amount)}
                        </td>
                    </tr>
                `;
            });
        }
        
        document.getElementById('project-details-modal').classList.add('active');
    }

    // === Editing & inline status changes ===
    let editingTrxId = null;
    let editingProjectId = null;
    let editingSmmId = null;

    function setModalMode(modal, title, buttonText) {
        modal.querySelector('.modal-header h2').textContent = title;
        modal.querySelector('button[type="submit"]').textContent = buttonText;
    }

    // Inline status dropdowns
    document.body.addEventListener('change', (e) => {
        const t = e.target;
        if (t.classList.contains('trx-status-select')) {
            const trx = transactions.find(x => x.id == t.getAttribute('data-id'));
            if (trx) {
                trx.status = t.value;
                saveTransactions();
                updateData();
            }
        } else if (t.classList.contains('project-status-select')) {
            const proj = projects.find(x => x.id == t.getAttribute('data-id'));
            if (proj) { proj.status = t.value; saveProjects(); updateData(); }
        } else if (t.classList.contains('smm-status-select')) {
            const client = smmClients.find(x => x.id == t.getAttribute('data-id'));
            if (client) { client.status = t.value; saveSMM(); updateData(); }
        }
    });

    // Edit buttons
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.edit-btn');
        if (!btn) return;
        const type = btn.getAttribute('data-type');
        const id = parseInt(btn.getAttribute('data-id'), 10);

        if (type === 'transaction') {
            const t = transactions.find(x => x.id === id);
            if (!t) return;
            editingTrxId = id;
            const projectSelect = document.getElementById('trx-project');
            projectSelect.innerHTML = '<option value="">-- None --</option>' + projects.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('');
            document.getElementById('trx-title').value = t.title;
            document.getElementById('trx-subtitle').value = t.subtitle || '';
            document.getElementById('trx-amount').value = Math.abs(t.amount);
            document.getElementById('trx-date').value = t.date;
            document.getElementById('trx-type').value = t.type;
            document.getElementById('trx-category').value = t.category;
            document.getElementById('trx-status').value = t.status;
            document.getElementById('trx-account').value = t.account || '';
            projectSelect.value = t.projectId || '';
            setModalMode(transactionModal, 'Edit Record', 'Update Record');
            transactionModal.classList.add('active');
        } else if (type === 'project') {
            const p = projects.find(x => x.id === id);
            if (!p) return;
            editingProjectId = id;
            document.getElementById('proj-name').value = p.name;
            document.getElementById('proj-desc').value = p.desc;
            document.getElementById('proj-service').value = p.service || 'Web Development';
            document.getElementById('proj-budget').value = p.budget;
            document.getElementById('proj-spent').value = p.opening || 0;
            document.getElementById('proj-status').value = p.status;
            setModalMode(projectModal, 'Edit Project', 'Update Project');
            projectModal.classList.add('active');
        } else if (type === 'smm-client') {
            const c = smmClients.find(x => x.id === id);
            if (!c) return;
            editingSmmId = id;
            const smmModal = document.getElementById('smm-client-modal');
            document.getElementById('smm-name').value = c.name;
            document.querySelectorAll('input[name="smm-platform"]').forEach(cb => { cb.checked = (c.platforms || []).includes(cb.value); });
            document.getElementById('smm-package').value = c.package;
            document.getElementById('smm-status').value = c.status;
            document.getElementById('smm-fee').value = c.fee;
            document.getElementById('smm-posts-target').value = c.postsPerMonth;
            document.getElementById('smm-ad-budget').value = c.adBudget || '';
            setModalMode(smmModal, 'Edit Social Media Client', 'Update Client');
            smmModal.classList.add('active');
        }
    });

    // === Form Submissions ===
    document.getElementById('add-transaction-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('trx-title').value;
        const subtitle = document.getElementById('trx-subtitle').value;
        let amount = parseFloat(document.getElementById('trx-amount').value);
        const date = document.getElementById('trx-date').value;
        const type = document.getElementById('trx-type').value;
        const category = document.getElementById('trx-category').value;
        const status = document.getElementById('trx-status').value;
        const account = document.getElementById('trx-account').value;
        const projectId = document.getElementById('trx-project').value || null;

        if (type === 'expense') amount = -Math.abs(amount);
        else amount = Math.abs(amount);

        if (editingTrxId) {
            const existing = transactions.find(x => x.id === editingTrxId);
            if (existing) {
                Object.assign(existing, { title, subtitle, amount, date, type, category, status, account, projectId });
                saveTransactions();
            }
            editingTrxId = null;
        } else {
            transactions.push({ id: Date.now(), title, subtitle, amount, date, type, category, status, account, projectId });
            saveTransactions();

            // Increment global invoice counter
            let currentCounter = parseInt(localStorage.getItem('agency_invoice_counter')) || 0;
            localStorage.setItem('agency_invoice_counter', currentCounter + 1);
        }
        
        const newMonth = date.substring(0, 7);
        if(selectedMonth !== 'all' && selectedMonth !== newMonth) {
            selectedMonth = newMonth;
        }
        
        updateData();
        transactionModal.classList.remove('active');
        e.target.reset();
    });

    document.getElementById('add-transfer-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const amount = parseFloat(document.getElementById('transfer-amount').value);
        const date = document.getElementById('transfer-date').value;
        const note = document.getElementById('transfer-note').value;
        
        transactions.push({
            id: Date.now(),
            title: 'Partner Transfer',
            subtitle: note,
            amount: Math.abs(amount),
            date: date,
            type: 'expense',
            category: 'Partner Transfer',
            status: 'completed',
            account: 'Umar -> Abdullah',
            projectId: null
        });
        
        saveTransactions();
        
        const newMonth = date.substring(0, 7);
        if(selectedMonth !== 'all' && selectedMonth !== newMonth) {
            selectedMonth = newMonth;
            if(document.getElementById('global-month-filter')) {
                document.getElementById('global-month-filter').value = selectedMonth;
            }
        }
        
        updateData();
        document.getElementById('transfer-modal').classList.remove('active');
        e.target.reset();
    });

    document.getElementById('add-project-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('proj-name').value;
        const desc = document.getElementById('proj-desc').value;
        const budget = parseFloat(document.getElementById('proj-budget').value) || 0;
        const spent = parseFloat(document.getElementById('proj-spent').value) || 0;
        const status = document.getElementById('proj-status').value;

        const service = document.getElementById('proj-service').value;
        if (editingProjectId) {
            const p = projects.find(x => x.id === editingProjectId);
            if (p) Object.assign(p, { name, desc, service, budget, opening: spent, status });
            editingProjectId = null;
        } else {
            projects.push({ id: Date.now(), name, desc, service, budget, opening: spent, spent, status });
        }
        saveProjects();
        updateData();
        projectModal.classList.remove('active');
        e.target.reset();
    });

    document.getElementById('add-goal-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('goal-title').value;
        const target = parseFloat(document.getElementById('goal-target').value) || 0;

        goals.push({ id: Date.now(), title, target });
        saveGoals();
        updateData();
        goalModal.classList.remove('active');
        e.target.reset();
    });

    // === Social Media: open content modal & form submits ===
    const postModal = document.getElementById('smm-post-modal');
    document.getElementById('open-post-modal').addEventListener('click', () => {
        if (smmClients.length === 0) {
            alert('Add a social media client first.');
            return;
        }
        document.getElementById('post-client').innerHTML = smmClients.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
        document.getElementById('post-date').valueAsDate = new Date();
        postModal.classList.add('active');
    });

    document.getElementById('add-smm-client-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const platforms = Array.from(document.querySelectorAll('input[name="smm-platform"]:checked')).map(i => i.value);
        if (platforms.length === 0) { alert('Select at least one platform.'); return; }

        const clientData = {
            name: document.getElementById('smm-name').value.trim(),
            platforms,
            package: document.getElementById('smm-package').value,
            fee: parseFloat(document.getElementById('smm-fee').value) || 0,
            postsPerMonth: parseInt(document.getElementById('smm-posts-target').value, 10) || 0,
            adBudget: parseFloat(document.getElementById('smm-ad-budget').value) || 0,
            status: document.getElementById('smm-status').value
        };
        if (editingSmmId) {
            const c = smmClients.find(x => x.id === editingSmmId);
            if (c) Object.assign(c, clientData);
            editingSmmId = null;
        } else {
            smmClients.push({ id: Date.now(), ...clientData });
        }
        saveSMM();
        updateData();
        document.getElementById('smm-client-modal').classList.remove('active');
        e.target.reset();
    });

    document.getElementById('add-smm-post-form').addEventListener('submit', (e) => {
        e.preventDefault();
        smmPosts.push({
            id: Date.now(),
            clientId: parseInt(document.getElementById('post-client').value, 10),
            title: document.getElementById('post-title').value.trim(),
            platform: document.getElementById('post-platform').value,
            type: document.getElementById('post-type').value,
            date: document.getElementById('post-date').value,
            status: document.getElementById('post-status').value
        });
        saveSMM();
        updateData();
        postModal.classList.remove('active');
        e.target.reset();
    });

    // === Status Filter Logic ===
    const filterSelect = document.getElementById('filter-status');
    if (filterSelect) {
        filterSelect.addEventListener('change', () => { updateData(); });
    }

    // === Export & Import Data ===
    document.getElementById('export-data-btn').addEventListener('click', () => {
        const data = {
            transactions: JSON.parse(localStorage.getItem('agency_transactions_v2')) || [],
            projects: JSON.parse(localStorage.getItem('agency_projects')) || [],
            goals: JSON.parse(localStorage.getItem('agency_goals')) || [],
            smmClients: JSON.parse(localStorage.getItem('agency_smm_clients')) || [],
            smmPosts: JSON.parse(localStorage.getItem('agency_smm_posts')) || [],
            invoices: JSON.parse(localStorage.getItem('agency_invoices')) || {}
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ucode_finance_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById('import-file-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.transactions) localStorage.setItem('agency_transactions_v2', JSON.stringify(data.transactions));
                if (data.projects) localStorage.setItem('agency_projects', JSON.stringify(data.projects));
                if (data.goals) localStorage.setItem('agency_goals', JSON.stringify(data.goals));
                if (data.smmClients) localStorage.setItem('agency_smm_clients', JSON.stringify(data.smmClients));
                if (data.smmPosts) localStorage.setItem('agency_smm_posts', JSON.stringify(data.smmPosts));
                if (data.invoices) localStorage.setItem('agency_invoices', JSON.stringify(data.invoices));
                alert('Data imported successfully!');
                window.location.reload();
            } catch (err) {
                alert('Invalid backup file. Could not import data.');
            }
        };
        reader.readAsText(file);
    });

    // === Charts Initialization ===
    let cashflowChartInstance = null;
    let spendingChartInstance = null;

    function renderCharts(activeData) {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#94a3b8' : '#64748b';
        const gridColor = isDark ? '#334155' : '#e2e8f0';
        
        const categoryTotals = {};
        activeData.forEach(trx => {
            if (trx.type === 'expense' && trx.status === 'completed') {
                categoryTotals[trx.category] = (categoryTotals[trx.category] || 0) + Math.abs(trx.amount);
            }
        });
        const spendData = Object.values(categoryTotals);
        const spendLabels = Object.keys(categoryTotals);

        let currentMonthIncome = 0;
        let currentMonthExpense = 0;
        activeData.forEach(trx => {
            if (trx.status === 'completed') {
                if(trx.type === 'income') currentMonthIncome += trx.amount;
                if(trx.type === 'expense') currentMonthExpense += Math.abs(trx.amount);
            }
        });
        
        const cashFlowLabels = selectedMonth === 'all' 
            ? ['Current Filter'] 
            : [document.getElementById('global-month-filter').options[document.getElementById('global-month-filter').selectedIndex].text];
            
        const cashflowCtx = document.getElementById('cashflowChart');
        if(cashflowCtx) {
            if (cashflowChartInstance) cashflowChartInstance.destroy();
            cashflowChartInstance = new Chart(cashflowCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: cashFlowLabels,
                    datasets: [
                        {
                            type: 'line',
                            label: 'Net Balance',
                            data: [currentMonthIncome - currentMonthExpense],
                            borderColor: isDark ? '#34e0a1' : '#0b5a3a',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: false,
                            yAxisID: 'y1',
                        },
                        {
                            type: 'bar',
                            label: 'Invoices Paid',
                            data: [currentMonthIncome],
                            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.8)' : '#10b981',
                            borderRadius: 4,
                            yAxisID: 'y',
                        },
                        {
                            type: 'bar',
                            label: 'Agency Expenses',
                            data: [currentMonthExpense],
                            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.8)' : '#ef4444',
                            borderRadius: 4,
                            yAxisID: 'y',
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                        legend: { position: 'top', labels: { color: textColor, usePointStyle: true, boxWidth: 8 } },
                        tooltip: { backgroundColor: isDark ? '#1e293b' : '#ffffff', titleColor: isDark ? '#f8fafc' : '#0f172a', bodyColor: isDark ? '#94a3b8' : '#64748b', borderColor: gridColor, borderWidth: 1, padding: 12 }
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: textColor } },
                        y: { type: 'linear', display: true, position: 'left', grid: { color: gridColor }, ticks: { color: textColor } },
                        y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { color: textColor } }
                    }
                }
            });
        }

        const spendingCtx = document.getElementById('spendingChart');
        if (spendingCtx) {
            if (spendingChartInstance) spendingChartInstance.destroy();
            
            const isSpendEmpty = spendData.length === 0;
            
            spendingChartInstance = new Chart(spendingCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: isSpendEmpty ? ['No Data'] : spendLabels,
                    datasets: [{
                        data: isSpendEmpty ? [1] : spendData,
                        backgroundColor: isSpendEmpty ? [gridColor] : ['#0b5a3a', '#34e0a1', '#118a58', '#f59e0b', '#06b6d4', '#a855f7', '#e11d48'],
                        borderWidth: 0,
                        hoverOffset: isSpendEmpty ? 0 : 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: { position: 'right', labels: { color: textColor, usePointStyle: true, padding: 20, font: { family: "'Inter', sans-serif", size: 12 } } },
                        tooltip: {
                            enabled: !isSpendEmpty,
                            backgroundColor: isDark ? '#1e293b' : '#ffffff', titleColor: isDark ? '#f8fafc' : '#0f172a', bodyColor: isDark ? '#94a3b8' : '#64748b', borderColor: gridColor, borderWidth: 1, padding: 12,
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) { label += ': '; }
                                    if (context.parsed !== null) { label += formatCurrency(context.parsed); }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // ==========================================================
    // === UCODE STUDIO INVOICE GENERATOR CONTROLLER ===
    // ==========================================================
    let currentInvoiceTrxId = null;
    let invoiceItems = [];

    function formatInvoiceNumber(num, withDecimals = false) {
        const val = parseFloat(num) || 0;
        const parts = (withDecimals ? val.toFixed(2) : Math.round(val).toString()).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        return parts.join('.');
    }

    function renderInvoiceItemsEditor() {
        const container = document.getElementById('inv-items-editor-list');
        if (!container) return;
        container.innerHTML = invoiceItems.map((item, idx) => `
            <div class="inv-item-row-edit" data-idx="${idx}">
                <input type="text" class="item-desc-input" placeholder="Description" value="${esc(item.description)}">
                <input type="number" class="item-qty-input" min="1" placeholder="Qty" value="${item.qty}">
                <input type="number" step="0.01" class="item-price-input" placeholder="Price" value="${item.price}">
                <button type="button" class="inv-item-delete-btn" title="Remove Item"><i class="ph ph-trash"></i></button>
            </div>
        `).join('');
    }

    function syncInvoicePreview() {
        const clientName = document.getElementById('inv-input-client').value.trim() || 'CLIENT NAME';
        const companyName = document.getElementById('inv-input-company').value.trim() || '';
        const contact = document.getElementById('inv-input-contact').value.trim() || '';
        const dateRaw = document.getElementById('inv-input-date').value;
        const invNumber = document.getElementById('inv-input-number').value.trim() || '0000000001';
        const currency = document.getElementById('inv-input-currency').value || 'LKR';
        const prepaid = parseFloat(document.getElementById('inv-input-prepaid').value) || 0;

        const bank = document.getElementById('inv-input-bank').value.trim() || 'Commercial Bank, Dehiwala';
        const accNo = document.getElementById('inv-input-acc-no').value.trim() || '8029132085';
        const accName = document.getElementById('inv-input-acc-name').value.trim() || 'Ahamed Umar Hunais';
        const terms = document.getElementById('inv-input-terms').value.trim() || 'Please send payment within 30 days of receiving this invoice.';
        const signerName = document.getElementById('inv-input-signer-name').value.trim() || 'Abdullah Arshad';
        const signerTitle = document.getElementById('inv-input-signer-title').value.trim() || 'Founder and CEO';

        let formattedDate = dateRaw;
        if (dateRaw && dateRaw.includes('-')) {
            const [y, m, d] = dateRaw.split('-');
            formattedDate = `${d}/${m}/${y}`;
        }

        let subtotal = 0;
        const tbody = document.getElementById('view-items-tbody');
        if (tbody) {
            if (invoiceItems.length === 0) {
                tbody.innerHTML = `<div class="sheet-table-row" style="color: rgba(255,255,255,0.4);"><div class="c-desc">No line items added yet</div><div class="c-qty">0</div><div class="c-price">0</div><div class="c-total">0 ${currency}</div></div>`;
            } else {
                tbody.innerHTML = invoiceItems.map(item => {
                    const qty = parseFloat(item.qty) || 1;
                    const price = parseFloat(item.price) || 0;
                    const lineTotal = qty * price;
                    subtotal += lineTotal;
                    return `
                        <div class="sheet-table-row">
                            <div class="c-desc">${esc(item.description || 'Service')}</div>
                            <div class="c-qty">${qty}</div>
                            <div class="c-price">${formatInvoiceNumber(price)}</div>
                            <div class="c-total">${formatInvoiceNumber(lineTotal)} ${currency}</div>
                        </div>
                    `;
                }).join('');
            }
        }

        const grandTotal = Math.max(0, subtotal - prepaid);

        const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        const setHtml = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };

        setTxt('view-client-name', clientName.toUpperCase());
        setTxt('view-client-company', companyName);
        setHtml('view-client-contact', esc(contact).replace(/\n/g, '<br>'));
        setTxt('view-inv-date', formattedDate);
        setTxt('view-inv-no', invNumber);
        setTxt('view-total-due', formatInvoiceNumber(grandTotal, true));

        setTxt('view-bank-name', 'Bank Name: ' + bank);
        setTxt('view-acc-no', 'Account No : ' + accNo);
        setTxt('view-acc-name', 'Account Name: ' + accName);

        setTxt('view-subtotal', formatInvoiceNumber(subtotal));
        setTxt('view-prepaid', formatInvoiceNumber(prepaid));
        setTxt('view-grand-total', `${formatInvoiceNumber(grandTotal, true)} ${currency}`);

        setTxt('view-terms', terms);
        setTxt('view-signer-name', signerName);
        setTxt('view-signer-title', signerTitle);
    }

    function openInvoiceStudio(trxId = null) {
        currentInvoiceTrxId = trxId;
        const modal = document.getElementById('invoice-modal');
        if (!modal) return;

        let existingTrx = null;
        if (trxId) {
            existingTrx = transactions.find(t => t.id === trxId);
        }

        let savedInvoice = trxId && invoices[trxId] ? invoices[trxId] : null;

        if (savedInvoice) {
            document.getElementById('inv-input-client').value = savedInvoice.client || '';
            document.getElementById('inv-input-company').value = savedInvoice.company || '';
            document.getElementById('inv-input-contact').value = savedInvoice.contact || "universalcode.site\n109 Quarry road, Dehiwala\n0760595115";
            document.getElementById('inv-input-date').value = savedInvoice.date || new Date().toISOString().slice(0, 10);
            document.getElementById('inv-input-number').value = savedInvoice.number || '0000000007';
            document.getElementById('inv-input-currency').value = savedInvoice.currency || 'LKR';
            document.getElementById('inv-input-prepaid').value = savedInvoice.prepaid || 0;
            document.getElementById('inv-input-bank').value = savedInvoice.bank || 'Commercial Bank, Dehiwala';
            document.getElementById('inv-input-acc-no').value = savedInvoice.accNo || '8029132085';
            document.getElementById('inv-input-acc-name').value = savedInvoice.accName || 'Ahamed Umar Hunais';
            document.getElementById('inv-input-terms').value = savedInvoice.terms || 'Please send payment within 30 days of receiving this invoice.';
            document.getElementById('inv-input-signer-name').value = savedInvoice.signerName || 'Abdullah Arshad';
            document.getElementById('inv-input-signer-title').value = savedInvoice.signerTitle || 'Founder and CEO';
            invoiceItems = savedInvoice.items && savedInvoice.items.length > 0 ? JSON.parse(JSON.stringify(savedInvoice.items)) : [{ description: 'Presentation', qty: 1, price: 15000 }];
        } else if (existingTrx) {
            const titleLower = existingTrx.title.toLowerCase();
            const subLower = (existingTrx.subtitle || '').toLowerCase();
            
            if (titleLower.includes('sip') || subLower.includes('000000007') || existingTrx.id === 1791128209901) {
                // Exact reference match from user's invoice screenshot
                document.getElementById('inv-input-client').value = 'VIVIAN';
                document.getElementById('inv-input-company').value = 'Sip and Play';
                document.getElementById('inv-input-contact').value = "universalcode.site\n109 Quarry road, Dehiwala\n0760595115";
                document.getElementById('inv-input-date').value = existingTrx.date || '2026-10-04';
                document.getElementById('inv-input-number').value = '0000000007';
                document.getElementById('inv-input-currency').value = 'LKR';
                document.getElementById('inv-input-prepaid').value = 0;
                invoiceItems = [
                    { description: 'Presentation', qty: 1, price: 15000 },
                    { description: 'Coffee Beans Packaging', qty: 2, price: 5000 }
                ];
            } else {
                document.getElementById('inv-input-client').value = existingTrx.title;
                document.getElementById('inv-input-company').value = existingTrx.category || '';
                document.getElementById('inv-input-contact').value = "universalcode.site\n109 Quarry road, Dehiwala\n0760595115";
                document.getElementById('inv-input-date').value = existingTrx.date || new Date().toISOString().slice(0, 10);
                
                let invNum = existingTrx.subtitle || '';
                if (invNum.startsWith('INV-')) invNum = invNum.replace('INV-', '');
                if (!invNum) invNum = String(parseInt(localStorage.getItem('agency_invoice_counter')) || 7).padStart(10, '0');
                document.getElementById('inv-input-number').value = invNum;
                
                document.getElementById('inv-input-currency').value = 'LKR';
                document.getElementById('inv-input-prepaid').value = 0;
                invoiceItems = [
                    { description: existingTrx.title + ' (' + existingTrx.category + ')', qty: 1, price: Math.abs(existingTrx.amount) }
                ];
            }
        } else {
            // New invoice
            let counter = parseInt(localStorage.getItem('agency_invoice_counter')) || 7;
            document.getElementById('inv-input-client').value = 'VIVIAN';
            document.getElementById('inv-input-company').value = 'Sip and Play';
            document.getElementById('inv-input-contact').value = "universalcode.site\n109 Quarry road, Dehiwala\n0760595115";
            document.getElementById('inv-input-date').value = new Date().toISOString().slice(0, 10);
            document.getElementById('inv-input-number').value = String(counter).padStart(10, '0');
            document.getElementById('inv-input-currency').value = 'LKR';
            document.getElementById('inv-input-prepaid').value = 0;
            invoiceItems = [
                { description: 'Presentation', qty: 1, price: 15000 },
                { description: 'Coffee Beans Packaging', qty: 2, price: 5000 }
            ];
        }

        renderInvoiceItemsEditor();
        syncInvoicePreview();
        modal.classList.add('active');
    }

    // Modal Triggers
    const openInvoiceBuilderBtn = document.getElementById('open-invoice-builder-btn');
    if (openInvoiceBuilderBtn) {
        openInvoiceBuilderBtn.addEventListener('click', () => {
            openInvoiceStudio(null);
        });
    }

    // Table click delegation for .invoice-btn
    document.body.addEventListener('click', (e) => {
        const invBtn = e.target.closest('.invoice-btn');
        if (invBtn) {
            const trxId = parseInt(invBtn.getAttribute('data-id'), 10);
            openInvoiceStudio(trxId);
        }
    });

    // Close invoice modal
    const closeInvBtn = document.getElementById('close-invoice-modal');
    if (closeInvBtn) {
        closeInvBtn.addEventListener('click', () => {
            document.getElementById('invoice-modal').classList.remove('active');
        });
    }

    // Add Line Item
    const addItemBtn = document.getElementById('inv-add-item-btn');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', () => {
            invoiceItems.push({ description: '', qty: 1, price: 0 });
            renderInvoiceItemsEditor();
            syncInvoicePreview();
        });
    }

    // Editor inputs live-sync
    const invoiceEditorForm = document.getElementById('invoice-editor-form');
    if (invoiceEditorForm) {
        invoiceEditorForm.addEventListener('input', (e) => {
            const row = e.target.closest('.inv-item-row-edit');
            if (row) {
                const idx = parseInt(row.getAttribute('data-idx'), 10);
                if (invoiceItems[idx]) {
                    if (e.target.classList.contains('item-desc-input')) {
                        invoiceItems[idx].description = e.target.value;
                    } else if (e.target.classList.contains('item-qty-input')) {
                        invoiceItems[idx].qty = parseFloat(e.target.value) || 0;
                    } else if (e.target.classList.contains('item-price-input')) {
                        invoiceItems[idx].price = parseFloat(e.target.value) || 0;
                    }
                }
            }
            syncInvoicePreview();
        });

        invoiceEditorForm.addEventListener('change', () => {
            syncInvoicePreview();
        });
    }

    // Delete Line Item
    const itemsEditorList = document.getElementById('inv-items-editor-list');
    if (itemsEditorList) {
        itemsEditorList.addEventListener('click', (e) => {
            const delBtn = e.target.closest('.inv-item-delete-btn');
            if (delBtn) {
                const row = delBtn.closest('.inv-item-row-edit');
                const idx = parseInt(row.getAttribute('data-idx'), 10);
                invoiceItems.splice(idx, 1);
                renderInvoiceItemsEditor();
                syncInvoicePreview();
            }
        });
    }

    // Print Invoice Handler
    const printInvBtn = document.getElementById('inv-print-btn');
    if (printInvBtn) {
        printInvBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Download PDF Handler
    const downloadPdfBtn = document.getElementById('inv-download-pdf-btn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            const sheet = document.getElementById('invoice-sheet');
            if (!sheet) return;

            const client = document.getElementById('inv-input-client').value.trim() || 'Client';
            const invNo = document.getElementById('inv-input-number').value.trim() || 'Invoice';
            const filename = `Ucode_Invoice_${invNo}_${client.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

            if (typeof html2pdf !== 'undefined') {
                downloadPdfBtn.disabled = true;
                downloadPdfBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> <span>Generating...</span>';

                const opt = {
                    margin: 0,
                    filename: filename,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { 
                        scale: 2, 
                        useCORS: true, 
                        logging: false, 
                        backgroundColor: '#022417',
                        scrollY: 0
                    },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };

                html2pdf().set(opt).from(sheet).save().then(() => {
                    downloadPdfBtn.disabled = false;
                    downloadPdfBtn.innerHTML = '<i class="ph ph-file-pdf"></i> <span>Download PDF</span>';
                }).catch(err => {
                    console.error('PDF generation error:', err);
                    downloadPdfBtn.disabled = false;
                    downloadPdfBtn.innerHTML = '<i class="ph ph-file-pdf"></i> <span>Download PDF</span>';
                    alert('PDF export completed. If download did not start, you can also use the Print button to Save as PDF.');
                });
            } else {
                window.print();
            }
        });
    }

    // Save & Sync to Financial Records
    const syncRecordBtn = document.getElementById('inv-sync-record-btn');
    if (syncRecordBtn) {
        syncRecordBtn.addEventListener('click', () => {
            const client = document.getElementById('inv-input-client').value.trim();
            if (!client) {
                alert('Please enter a Client Name.');
                return;
            }

            const company = document.getElementById('inv-input-company').value.trim();
            const contact = document.getElementById('inv-input-contact').value.trim();
            const date = document.getElementById('inv-input-date').value;
            const number = document.getElementById('inv-input-number').value.trim();
            const currency = document.getElementById('inv-input-currency').value;
            const prepaid = parseFloat(document.getElementById('inv-input-prepaid').value) || 0;
            const bank = document.getElementById('inv-input-bank').value.trim();
            const accNo = document.getElementById('inv-input-acc-no').value.trim();
            const accName = document.getElementById('inv-input-acc-name').value.trim();
            const terms = document.getElementById('inv-input-terms').value.trim();
            const signerName = document.getElementById('inv-input-signer-name').value.trim();
            const signerTitle = document.getElementById('inv-input-signer-title').value.trim();

            let subtotal = 0;
            invoiceItems.forEach(i => {
                subtotal += (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0);
            });
            const grandTotal = Math.max(0, subtotal - prepaid);

            const invoiceRecord = {
                client, company, contact, date, number, currency, prepaid,
                bank, accNo, accName, terms, signerName, signerTitle,
                items: JSON.parse(JSON.stringify(invoiceItems)),
                total: grandTotal
            };

            if (currentInvoiceTrxId) {
                invoices[currentInvoiceTrxId] = invoiceRecord;
                const trx = transactions.find(t => t.id === currentInvoiceTrxId);
                if (trx) {
                    trx.title = client;
                    trx.subtitle = 'INV-' + number;
                    trx.amount = grandTotal;
                    trx.date = date;
                    saveTransactions();
                }
            } else {
                const newId = Date.now();
                invoices[newId] = invoiceRecord;
                transactions.push({
                    id: newId,
                    title: client,
                    subtitle: 'INV-' + number,
                    amount: grandTotal,
                    date: date,
                    type: 'income',
                    category: company || 'Content Creation',
                    status: 'completed',
                    account: "Umar's Account",
                    projectId: null
                });
                saveTransactions();

                let currentCounter = parseInt(localStorage.getItem('agency_invoice_counter')) || 0;
                localStorage.setItem('agency_invoice_counter', currentCounter + 1);
            }

            updateData();
            document.getElementById('invoice-modal').classList.remove('active');
            alert('Invoice saved and synced to financial records!');
        });
    }

    // ==========================================================
    // === BILLION-DOLLAR UCODE CLIENT COLLABORATION CONTROLLER ===
    // ==========================================================

    // 1. Tab Switching Function
    window.switchClientTab = function(tabName) {
        const targetId = tabName.startsWith('tab-') ? tabName : 'tab-' + tabName;
        const paneId = 'pane-' + targetId;

        document.querySelectorAll('.subnav-tab-btn').forEach(btn => {
            if (btn.getAttribute('data-subtab') === targetId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        document.querySelectorAll('.client-tab-pane').forEach(pane => {
            if (pane.id === paneId) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });

        document.querySelectorAll('#nav-group-client .nav-item').forEach(item => {
            if (item.getAttribute('data-client-tab') === targetId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };

    // ==============================================================
    // === CLIENT REQUESTS & DELIVERABLES BACKEND & CUSTOMER SYNC ===
    // ==============================================================

    const DEFAULT_CLIENT_REQUESTS = [
        {
            id: 'REQ-101',
            clientId: 'sipandplay',
            clientName: 'Sip and Play Cafe',
            title: 'Autumn Menu Refresh & Acrylic Table Standees',
            category: 'Print & Branding',
            description: 'Double-sided laminated autumn beverage menu and tabletop acrylic QR standees for digital table ordering.',
            deadline: '2026-10-25',
            priority: 'Urgent',
            refUrl: 'https://figma.com/file/sipandplay-menu',
            status: 'Work Submitted',
            assignedTo: 'Imran (Senior Designer)',
            createdAt: '2026-10-18'
        },
        {
            id: 'REQ-102',
            clientId: 'sipandplay',
            clientName: 'Sip and Play Cafe',
            title: 'Table Reservation & Tournament Booking Engine',
            category: 'Web Development',
            description: 'Online booking flow for weekend board game tournaments and private room bookings.',
            deadline: '2026-10-30',
            priority: 'High',
            refUrl: 'https://github.com/ucode-agency/sip-and-play-web',
            status: 'In Progress',
            assignedTo: 'Alex (Fullstack Dev)',
            createdAt: '2026-10-17'
        },
        {
            id: 'REQ-103',
            clientId: 'sipandplay',
            clientName: 'Sip and Play Cafe',
            title: 'Weekly Instagram Reels & Story Motion Templates',
            category: 'Social Media',
            description: 'Deliver 6x 9:16 animated reels showcasing game nights and seasonal drink menu items.',
            deadline: '2026-10-22',
            priority: 'Normal',
            refUrl: 'https://drive.google.com/drive/folders/ucode-smm-sip',
            status: 'Approved',
            assignedTo: 'Sarah (Motion Designer)',
            createdAt: '2026-10-14'
        }
    ];

    const DEFAULT_DELIVERABLES = [
        {
            id: 'DELIV-201',
            requestId: 'REQ-101',
            clientId: 'sipandplay',
            clientName: 'Sip and Play Cafe',
            title: 'Autumn Menu High-Res Vector Pack & Table QR Mockups',
            version: 'v1.0',
            type: 'Print / Vector CMYK',
            url: 'https://drive.google.com/drive/folders/sipandplay-autumn-v1',
            notes: 'Complete CMYK 300 DPI print files prepared with 3mm bleed, Fogra39 profile, and tested QR vectors for acrylic laser cut standees.',
            submittedBy: 'Imran (Senior Designer)',
            submittedAt: '2026-10-19 09:30',
            status: 'Awaiting Client Review',
            clientFeedback: ''
        },
        {
            id: 'DELIV-202',
            requestId: 'REQ-103',
            clientId: 'sipandplay',
            clientName: 'Sip and Play Cafe',
            title: 'Reels & Story Graphics Pack (October Batch 1)',
            version: 'v1.0',
            type: 'Social Media Pack',
            url: 'https://drive.google.com/drive/folders/ucode-smm-sip',
            notes: '6x 1080x1920 high-energy reels with audio cues and animated subtitles ready for publishing.',
            submittedBy: 'Sarah (Motion Designer)',
            submittedAt: '2026-10-16 14:15',
            status: 'Approved',
            clientFeedback: 'Looks vibrant and engaging! Approved for publication.'
        }
    ];

    window.showAgencyToast = function(message, type = 'success') {
        let container = document.getElementById('agency-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'agency-toast-container';
            container.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 99999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = 'agency-toast ' + type;
        toast.style.cssText = 'background: rgba(18, 24, 38, 0.95); backdrop-filter: blur(14px); border: 1px solid var(--primary); color: #fff; padding: 12px 18px; border-radius: 10px; font-size: 0.88rem; font-weight: 600; box-shadow: 0 10px 25px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 10px; pointer-events: auto; max-width: 420px;';
        toast.innerHTML = `<i class="ph-bold ph-check-circle" style="color: var(--primary); font-size: 1.25rem;"></i> <span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    window.getClientRequests = function() {
        const stored = localStorage.getItem('agency_client_requests');
        if (!stored) {
            localStorage.setItem('agency_client_requests', JSON.stringify(DEFAULT_CLIENT_REQUESTS));
            return DEFAULT_CLIENT_REQUESTS;
        }
        try {
            return JSON.parse(stored) || [];
        } catch (e) {
            return DEFAULT_CLIENT_REQUESTS;
        }
    };

    window.saveClientRequests = function(arr) {
        localStorage.setItem('agency_client_requests', JSON.stringify(arr));
    };

    window.getDeliverables = function() {
        const stored = localStorage.getItem('agency_deliverables');
        if (!stored) {
            localStorage.setItem('agency_deliverables', JSON.stringify(DEFAULT_DELIVERABLES));
            return DEFAULT_DELIVERABLES;
        }
        try {
            return JSON.parse(stored) || [];
        } catch (e) {
            return DEFAULT_DELIVERABLES;
        }
    };

    window.saveDeliverables = function(arr) {
        localStorage.setItem('agency_deliverables', JSON.stringify(arr));
    };

    // Render Backend Requests Table (for Founder & Employee)
    window.renderBackendRequests = function() {
        const requests = window.getClientRequests();
        const deliverables = window.getDeliverables();
        const tbody = document.getElementById('backend-requests-tbody');
        if (!tbody) return;

        const searchVal = (document.getElementById('backend-search-input')?.value || '').toLowerCase().trim();
        const clientVal = document.getElementById('backend-client-filter')?.value || 'all';
        const statusVal = document.getElementById('backend-status-filter')?.value || 'all';

        // Update Client Filter dropdown options
        const clientFilterEl = document.getElementById('backend-client-filter');
        if (clientFilterEl && clientFilterEl.options.length <= 2) {
            const clientMap = new Map();
            requests.forEach(r => {
                if (r.clientId && r.clientName) clientMap.set(r.clientId, r.clientName);
            });
            clientMap.forEach((name, id) => {
                let optExists = false;
                for (let i = 0; i < clientFilterEl.options.length; i++) {
                    if (clientFilterEl.options[i].value === id) { optExists = true; break; }
                }
                if (!optExists) {
                    const opt = document.createElement('option');
                    opt.value = id;
                    opt.textContent = name;
                    clientFilterEl.appendChild(opt);
                }
            });
        }

        // Calculate KPIs
        const total = requests.length;
        const inProg = requests.filter(r => r.status === 'In Progress' || r.status === 'New').length;
        const submitted = requests.filter(r => r.status === 'Work Submitted').length;
        const approved = requests.filter(r => r.status === 'Approved').length;

        const elTot = document.getElementById('backend-kpi-total');
        const elProg = document.getElementById('backend-kpi-in-progress');
        const elSub = document.getElementById('backend-kpi-submitted');
        const elApp = document.getElementById('backend-kpi-approved');
        const countBadge = document.getElementById('count-backend-requests');

        if (elTot) elTot.textContent = total;
        if (elProg) elProg.textContent = inProg;
        if (elSub) elSub.textContent = submitted;
        if (elApp) elApp.textContent = approved;
        if (countBadge) countBadge.textContent = total;

        // Filter requests
        const filtered = requests.filter(r => {
            if (clientVal !== 'all' && r.clientId !== clientVal) return false;
            if (statusVal !== 'all' && r.status !== statusVal) return false;
            if (searchVal) {
                const haystack = (r.id + ' ' + r.title + ' ' + r.clientName + ' ' + r.category + ' ' + r.description).toLowerCase();
                if (!haystack.includes(searchVal)) return false;
            }
            return true;
        });

        tbody.innerHTML = '';
        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);"><i class="ph ph-folder-open" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>No client requests match your filter.</td></tr>`;
            return;
        }

        filtered.forEach(r => {
            const tr = document.createElement('tr');
            
            // Priority pill class
            const prioClass = (r.priority || '').toLowerCase().includes('urgent') ? 'urgent' : ((r.priority || '').toLowerCase().includes('high') ? 'high' : 'normal');

            // Status pill badge class
            let statusPill = '';
            if (r.status === 'Work Submitted') {
                statusPill = `<span class="status-pill-badge submitted"><i class="ph-bold ph-paper-plane-tilt"></i> Work Submitted</span>`;
            } else if (r.status === 'Approved') {
                statusPill = `<span class="status-pill-badge approved"><i class="ph-bold ph-check-circle"></i> Approved ✓</span>`;
            } else if (r.status === 'Revision Requested') {
                statusPill = `<span class="status-pill-badge revision"><i class="ph-bold ph-arrow-counter-clockwise"></i> Revision Needed</span>`;
            } else if (r.status === 'In Progress') {
                statusPill = `<span class="status-pill-badge in-progress"><i class="ph-bold ph-circle"></i> In Production</span>`;
            } else {
                statusPill = `<span class="status-pill-badge new"><i class="ph-bold ph-sparkle"></i> New Brief</span>`;
            }

            // Find if there is a deliverable with feedback
            const relatedDeliv = deliverables.find(d => d.requestId === r.id && d.status === 'Changes Requested');
            const feedbackSnippet = relatedDeliv && relatedDeliv.clientFeedback ? 
                `<div style="font-size: 0.76rem; color: #f59e0b; margin-top: 4px; background: rgba(245, 158, 11, 0.1); padding: 3px 6px; border-radius: 4px; border-left: 2px solid #f59e0b;">
                    <i class="ph ph-chat-circle-dots"></i> <strong>Client Feedback:</strong> "${esc(relatedDeliv.clientFeedback)}"
                 </div>` : '';

            tr.innerHTML = `
                <td><span class="ticket-id-badge">${esc(r.id)}</span></td>
                <td>
                    <div style="font-weight: 700; color: var(--text-main); font-size: 0.88rem;">${esc(r.clientName || 'Sip & Play')}</div>
                    <span style="font-size: 0.74rem; color: var(--text-muted);"><i class="ph ph-calendar"></i> ${esc(r.createdAt || 'Oct 18')}</span>
                </td>
                <td>
                    <div style="font-weight: 700; color: var(--text-main); font-size: 0.88rem;">${esc(r.title)}</div>
                    <div style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.35; margin-top: 2px;">${esc(r.description || '')}</div>
                    ${feedbackSnippet}
                    ${r.refUrl ? `<a href="${esc(r.refUrl)}" target="_blank" style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.75rem; color: var(--primary); font-weight: 600; margin-top: 4px;"><i class="ph ph-arrow-square-out"></i> Reference Link</a>` : ''}
                </td>
                <td><span class="cat-pill ${r.category.toLowerCase().includes('web') ? 'web' : 'poster'}">${esc(r.category)}</span></td>
                <td><span style="font-size: 0.82rem; font-weight: 600; color: var(--text-main);"><i class="ph ph-calendar-blank"></i> ${esc(r.deadline || 'Flexible')}</span></td>
                <td><span class="pill-priority ${prioClass}">${esc(r.priority || 'Normal')}</span></td>
                <td>${statusPill}</td>
                <td style="text-align: right; white-space: nowrap;">
                    <button type="button" class="btn-primary" onclick="window.openSubmitWorkModal('${r.id}')" style="padding: 0.4rem 0.75rem; font-size: 0.78rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;" title="Submit work directly to this client">
                        <i class="ph ph-paper-plane-tilt"></i> <span>Submit Work</span>
                    </button>
                    <select onchange="window.updateRequestStatus('${r.id}', this.value)" class="form-control" style="display: inline-block; width: auto; padding: 0.35rem 0.5rem; font-size: 0.76rem; border-radius: 6px; margin-left: 4px;" title="Update Status">
                        <option value="New" ${r.status === 'New' ? 'selected' : ''}>New</option>
                        <option value="In Progress" ${r.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Work Submitted" ${r.status === 'Work Submitted' ? 'selected' : ''}>Work Submitted</option>
                        <option value="Revision Requested" ${r.status === 'Revision Requested' ? 'selected' : ''}>Revision Needed</option>
                        <option value="Approved" ${r.status === 'Approved' ? 'selected' : ''}>Approved</option>
                    </select>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    // Render Backend Deliverables Log
    window.renderBackendDeliverables = function() {
        const deliverables = window.getDeliverables();
        const tbody = document.getElementById('backend-deliverables-tbody');
        const countBadge = document.getElementById('count-backend-deliverables');
        if (countBadge) countBadge.textContent = deliverables.length;
        if (!tbody) return;

        tbody.innerHTML = '';
        if (deliverables.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);"><i class="ph ph-package" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>No deliverables submitted yet. Click "Submit Work to Client" to send work.</td></tr>`;
            return;
        }

        deliverables.forEach(d => {
            const tr = document.createElement('tr');
            
            let statusBadge = '';
            if (d.status === 'Approved') {
                statusBadge = `<span class="status-pill-badge approved"><i class="ph-bold ph-check"></i> Approved by Client</span>`;
            } else if (d.status === 'Changes Requested') {
                statusBadge = `<span class="status-pill-badge revision"><i class="ph-bold ph-warning"></i> Revision Requested</span>
                               <div style="font-size: 0.75rem; color: #f59e0b; margin-top: 3px;">"${esc(d.clientFeedback || 'Changes requested')}"</div>`;
            } else {
                statusBadge = `<span class="status-pill-badge submitted"><i class="ph-bold ph-hourglass-medium"></i> Awaiting Client Review</span>`;
            }

            tr.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span class="deliverable-version-tag">${esc(d.version || 'v1.0')}</span>
                        <strong style="color: var(--text-main); font-size: 0.88rem;">${esc(d.title)}</strong>
                    </div>
                    <span style="font-size: 0.74rem; color: var(--text-muted);">${esc(d.type || 'Asset Package')}</span>
                </td>
                <td>
                    <span class="ticket-id-badge" style="font-size: 0.72rem;">#${esc(d.requestId || '')}</span>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">${esc(d.clientName || 'Sip & Play')}</div>
                </td>
                <td>
                    <div style="font-weight: 600; color: var(--text-main); font-size: 0.82rem;">${esc(d.submittedBy || 'Ucode Team')}</div>
                    <span style="font-size: 0.74rem; color: var(--text-muted);">${esc(d.submittedAt || '')}</span>
                </td>
                <td>
                    <a href="${esc(d.url)}" target="_blank" class="btn-text" style="font-weight: 700; color: var(--primary); display: inline-flex; align-items: center; gap: 4px;">
                        <i class="ph ph-arrow-square-out"></i> <span>Open Asset</span>
                    </a>
                </td>
                <td>
                    <div style="font-size: 0.8rem; color: var(--text-main); max-width: 240px; line-height: 1.35;">${esc(d.notes || '')}</div>
                </td>
                <td>${statusBadge}</td>
                <td style="text-align: right;">
                    <button type="button" class="btn-secondary" onclick="window.openSubmitWorkModal('${d.requestId}', '${d.version}')" style="padding: 0.35rem 0.65rem; font-size: 0.76rem; font-weight: 600;">
                        <i class="ph ph-arrow-counter-clockwise"></i> Re-submit
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    // Render Deliverables in Customer Portal
    window.renderCustomerDeliverables = function() {
        const deliverables = window.getDeliverables();
        const container = document.getElementById('customer-deliverables-container');
        const badge = document.getElementById('badge-deliverables');
        
        const pendingCount = deliverables.filter(d => d.status === 'Awaiting Client Review').length;
        if (badge) badge.textContent = pendingCount;

        if (!container) return;
        container.innerHTML = '';

        if (deliverables.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
                    <i class="ph ph-package" style="font-size: 2.5rem; color: var(--primary); display: block; margin-bottom: 0.75rem;"></i>
                    <h3 style="margin: 0 0 0.25rem 0; color: var(--text-main);">No Deliverables Pending Review</h3>
                    <p style="margin: 0; font-size: 0.85rem;">The Ucode Creative & Engineering team is currently working on your sprint assets. Once deliverables are prepared, they will appear here for your review and 1-click sign-off.</p>
                </div>
            `;
            return;
        }

        deliverables.forEach(d => {
            const card = document.createElement('div');
            card.className = 'client-deliverable-card';

            let actionHtml = '';
            if (d.status === 'Approved') {
                actionHtml = `
                    <div class="deliverable-actions-bar" style="justify-content: space-between;">
                        <span class="status-pill-badge approved" style="font-size: 0.82rem;"><i class="ph-bold ph-check"></i> Milestone Approved</span>
                        <a href="${esc(d.url)}" target="_blank" class="btn-secondary" style="padding: 0.45rem 0.85rem; font-size: 0.8rem; font-weight: 700;">
                            <i class="ph ph-download-simple"></i> Download Files
                        </a>
                    </div>
                `;
            } else if (d.status === 'Changes Requested') {
                actionHtml = `
                    <div class="deliverable-actions-bar" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                            <span class="status-pill-badge revision"><i class="ph-bold ph-arrow-counter-clockwise"></i> Revision in Progress by Ucode</span>
                            <a href="${esc(d.url)}" target="_blank" class="btn-text" style="font-size: 0.8rem; color: var(--primary);"><i class="ph ph-arrow-square-out"></i> View Link</a>
                        </div>
                        <div style="font-size: 0.78rem; color: #f59e0b; background: rgba(245, 158, 11, 0.08); padding: 0.5rem 0.75rem; border-radius: 6px; width: 100%; border-left: 2px solid #f59e0b;">
                            <strong>Your Revision Request:</strong> "${esc(d.clientFeedback)}"
                        </div>
                    </div>
                `;
            } else {
                actionHtml = `
                    <div class="deliverable-actions-bar" style="justify-content: space-between;">
                        <a href="${esc(d.url)}" target="_blank" class="btn-secondary" style="padding: 0.5rem 0.85rem; font-size: 0.82rem; font-weight: 700;">
                            <i class="ph ph-arrow-square-out"></i> Review Files
                        </a>
                        <div style="display: flex; gap: 6px;">
                            <button type="button" class="btn-secondary" onclick="window.openRevisionModal('${d.id}')" style="padding: 0.5rem 0.85rem; font-size: 0.82rem; font-weight: 700; color: #f59e0b; border-color: rgba(245, 158, 11, 0.3);">
                                <i class="ph ph-arrow-counter-clockwise"></i> Request Revision
                            </button>
                            <button type="button" class="btn-primary" onclick="window.approveDeliverable('${d.id}')" style="padding: 0.5rem 1.1rem; font-size: 0.82rem; font-weight: 700; background: #10b981; border-color: #10b981;">
                                <i class="ph-bold ph-check"></i> Approve Work
                            </button>
                        </div>
                    </div>
                `;
            }

            card.innerHTML = `
                <div>
                    <div class="client-deliverable-header">
                        <div>
                            <span class="deliverable-version-tag">${esc(d.version || 'v1.0')}</span>
                            <span style="font-size: 0.74rem; color: var(--text-muted); margin-left: 6px;">#${esc(d.requestId || '')}</span>
                            <h4 style="margin: 0.4rem 0 0.15rem 0; font-size: 1.05rem; font-weight: 800; color: var(--text-main);">${esc(d.title)}</h4>
                            <span style="font-size: 0.74rem; color: var(--text-muted);"><i class="ph ph-user"></i> Submitted by <strong>${esc(d.submittedBy || 'Ucode')}</strong> &bull; ${esc(d.submittedAt || '')}</span>
                        </div>
                        <span class="cat-pill" style="border-color: rgba(52,224,161,0.3); color: var(--primary);">${esc(d.type || 'Deliverable')}</span>
                    </div>

                    <div style="margin: 0.85rem 0;">
                        <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); font-weight: 700; margin-bottom: 0.3rem;">Agency Notes & Instructions:</div>
                        <div class="deliverable-notes-box">
                            ${esc(d.notes || 'Please review and confirm sign-off.')}
                        </div>
                    </div>
                </div>

                ${actionHtml}
            `;
            container.appendChild(card);
        });
    };

    // Render Requests Table in Customer Portal (#client-requests-tbody)
    window.renderCustomerRequests = function() {
        const requests = window.getClientRequests();
        const tbody = document.getElementById('client-requests-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        requests.forEach(r => {
            const tr = document.createElement('tr');
            const isRush = (r.priority || '').toLowerCase().includes('urgent');

            let statusIndicator = `<span class="status-indicator-green">${esc(r.status)}</span>`;
            if (r.status === 'Revision Requested') {
                statusIndicator = `<span class="status-indicator-amber" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; padding: 2px 8px; border-radius: 999px; font-weight: 700; font-size: 0.75rem;">Revision in Progress</span>`;
            } else if (r.status === 'Work Submitted') {
                statusIndicator = `<span style="background: rgba(168, 85, 247, 0.15); color: #a855f7; padding: 2px 8px; border-radius: 999px; font-weight: 700; font-size: 0.75rem;">Ready for Review</span>`;
            }

            tr.innerHTML = `
                <td><span class="ticket-id-badge">${esc(r.id)}</span></td>
                <td><span class="cat-pill ${r.category.toLowerCase().includes('web') ? 'web' : 'poster'}">${esc(r.category)}</span></td>
                <td>
                    <div class="table-bold-title">${esc(r.title)}</div>
                    <div class="table-desc-snippet">${esc((r.description || '').substring(0, 70))}${(r.description || '').length > 70 ? '...' : ''}</div>
                </td>
                <td><span class="deadline-tag ${isRush ? 'rush' : ''}"><i class="ph ph-calendar"></i> ${esc(r.deadline)} ${isRush ? '(⚡ Rush)' : ''}</span></td>
                <td><span class="attach-badge">${r.refUrl ? '<i class="ph ph-link"></i> Link Attached' : '<i class="ph ph-check"></i> Brief Logged'}</span></td>
                <td>${statusIndicator}</td>
                <td>
                    <a href="https://wa.me/94760595115?text=${encodeURIComponent('Hi Ucode Team, I have a question regarding request ' + r.id + ' (' + r.title + ')')}" target="_blank" class="action-btn-wa" title="WhatsApp Ucode about this ticket">
                        <i class="ph-fill ph-whatsapp-logo"></i>
                    </a>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    // Open Submit Work Modal
    window.openSubmitWorkModal = function(requestId, currentVersion) {
        const modal = document.getElementById('submit-work-modal');
        const select = document.getElementById('sw-request-id');
        const versionInput = document.getElementById('sw-version');
        const titleInput = document.getElementById('sw-title');

        if (!modal || !select) return;

        const requests = window.getClientRequests();
        select.innerHTML = '';
        requests.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.id;
            opt.textContent = `${r.id} • ${r.clientName || 'Sip & Play'} - ${r.title}`;
            select.appendChild(opt);
        });

        if (requestId) {
            select.value = requestId;
            const targetReq = requests.find(r => r.id === requestId);
            if (targetReq && titleInput) {
                titleInput.value = targetReq.title + ' Deliverable';
            }
        }

        if (currentVersion && versionInput) {
            const verNum = parseFloat(currentVersion.replace('v', '')) || 1.0;
            versionInput.value = 'v' + (verNum + 0.1).toFixed(1);
        } else if (versionInput) {
            versionInput.value = 'v1.0';
        }

        modal.classList.add('active');
        playUiSound('pop');
    };

    // Open Revision Modal (for Customer)
    window.openRevisionModal = function(deliverableId) {
        const modal = document.getElementById('client-revision-modal');
        const hiddenId = document.getElementById('rev-deliverable-id');
        const subtitle = document.getElementById('revision-modal-subtitle');
        if (!modal) return;

        const deliverables = window.getDeliverables();
        const d = deliverables.find(item => item.id === deliverableId);

        if (hiddenId) hiddenId.value = deliverableId;
        if (subtitle && d) subtitle.textContent = `Feedback for: ${d.title} (${d.version})`;

        modal.classList.add('active');
        playUiSound('pop');
    };

    // Approve Deliverable (1-Click Customer Approval)
    window.approveDeliverable = function(deliverableId) {
        const deliverables = window.getDeliverables();
        const requests = window.getClientRequests();

        const deliv = deliverables.find(d => d.id === deliverableId);
        if (!deliv) return;

        deliv.status = 'Approved';
        window.saveDeliverables(deliverables);

        // Update associated request
        const req = requests.find(r => r.id === deliv.requestId);
        if (req) {
            req.status = 'Approved';
            window.saveClientRequests(requests);
        }

        playUiSound('success');
        window.renderCustomerDeliverables();
        window.renderCustomerRequests();
        window.renderBackendRequests();
        window.renderBackendDeliverables();
        window.showAgencyToast(`🎉 Deliverable Approved! Client sign-off logged and synced across portals.`);
    };

    // Quick Update Request Status from Backend Dropdown
    window.updateRequestStatus = function(requestId, newStatus) {
        const requests = window.getClientRequests();
        const req = requests.find(r => r.id === requestId);
        if (req) {
            req.status = newStatus;
            window.saveClientRequests(requests);
            playUiSound('coin');
            window.renderBackendRequests();
            window.renderCustomerRequests();
        }
    };

    // Setup Submit Work Modal & Form Listeners
    const btnOpenSubmitWork = document.getElementById('btn-open-submit-work-modal');
    const modalSubmitWork = document.getElementById('submit-work-modal');
    const closeSubmitWork = document.getElementById('close-submit-work-modal');
    const cancelSubmitWork = document.getElementById('cancel-submit-work-btn');
    const formSubmitWork = document.getElementById('submit-work-form');

    if (btnOpenSubmitWork) {
        btnOpenSubmitWork.addEventListener('click', () => window.openSubmitWorkModal());
    }
    if (closeSubmitWork && modalSubmitWork) {
        closeSubmitWork.addEventListener('click', () => modalSubmitWork.classList.remove('active'));
    }
    if (cancelSubmitWork && modalSubmitWork) {
        cancelSubmitWork.addEventListener('click', () => modalSubmitWork.classList.remove('active'));
    }

    if (formSubmitWork) {
        formSubmitWork.addEventListener('submit', (e) => {
            e.preventDefault();
            const requestId = document.getElementById('sw-request-id').value;
            const title = document.getElementById('sw-title').value.trim();
            const version = document.getElementById('sw-version').value.trim();
            const type = document.getElementById('sw-type').value;
            const submittedBy = document.getElementById('sw-submitted-by').value.trim();
            const link = document.getElementById('sw-link').value.trim();
            const notes = document.getElementById('sw-notes').value.trim();

            const requests = window.getClientRequests();
            const deliverables = window.getDeliverables();

            const targetReq = requests.find(r => r.id === requestId);
            const clientName = targetReq ? targetReq.clientName : 'Sip and Play Cafe';
            const clientId = targetReq ? targetReq.clientId : 'sipandplay';

            const newDelivId = 'DELIV-' + Math.floor(200 + Math.random() * 800);
            const newDeliv = {
                id: newDelivId,
                requestId: requestId,
                clientId: clientId,
                clientName: clientName,
                title: title,
                version: version,
                type: type,
                url: link,
                notes: notes,
                submittedBy: submittedBy,
                submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'Awaiting Client Review',
                clientFeedback: ''
            };

            deliverables.unshift(newDeliv);
            window.saveDeliverables(deliverables);

            // Update request status to Work Submitted
            if (targetReq) {
                targetReq.status = 'Work Submitted';
                window.saveClientRequests(requests);
            }

            modalSubmitWork.classList.remove('active');
            formSubmitWork.reset();
            playUiSound('success');
            window.renderBackendRequests();
            window.renderBackendDeliverables();
            window.renderCustomerDeliverables();
            window.renderCustomerRequests();
            window.showAgencyToast(`🚀 Work Submitted! "${title}" (${version}) is now live in the client portal.`);
        });
    }

    // Setup Revision Modal & Form Listeners
    const modalRevision = document.getElementById('client-revision-modal');
    const closeRevision = document.getElementById('close-revision-modal');
    const cancelRevision = document.getElementById('cancel-revision-btn');
    const formRevision = document.getElementById('client-revision-form');

    if (closeRevision && modalRevision) {
        closeRevision.addEventListener('click', () => modalRevision.classList.remove('active'));
    }
    if (cancelRevision && modalRevision) {
        cancelRevision.addEventListener('click', () => modalRevision.classList.remove('active'));
    }

    if (formRevision) {
        formRevision.addEventListener('submit', (e) => {
            e.preventDefault();
            const delivId = document.getElementById('rev-deliverable-id').value;
            const feedbackText = document.getElementById('rev-feedback-text').value.trim();

            const deliverables = window.getDeliverables();
            const requests = window.getClientRequests();

            const d = deliverables.find(item => item.id === delivId);
            if (d) {
                d.status = 'Changes Requested';
                d.clientFeedback = feedbackText;
                window.saveDeliverables(deliverables);

                const r = requests.find(item => item.id === d.requestId);
                if (r) {
                    r.status = 'Revision Requested';
                    window.saveClientRequests(requests);
                }
            }

            modalRevision.classList.remove('active');
            formRevision.reset();
            playUiSound('pop');
            window.renderCustomerDeliverables();
            window.renderCustomerRequests();
            window.renderBackendRequests();
            window.renderBackendDeliverables();
            window.showAgencyToast(`📝 Revision Request Received! Changes logged for production team.`);
        });
    }

    // Backend View Tabs (Requests Queue vs Deliverables Log)
    const tabBtnBackendReq = document.getElementById('tab-btn-backend-requests');
    const tabBtnBackendDeliv = document.getElementById('tab-btn-backend-deliverables');
    const paneBackendReq = document.getElementById('pane-backend-requests');
    const paneBackendDeliv = document.getElementById('pane-backend-deliverables');

    if (tabBtnBackendReq && tabBtnBackendDeliv) {
        tabBtnBackendReq.addEventListener('click', () => {
            tabBtnBackendReq.classList.add('active');
            tabBtnBackendReq.style.background = 'var(--primary)';
            tabBtnBackendReq.style.color = 'white';
            tabBtnBackendDeliv.classList.remove('active');
            tabBtnBackendDeliv.style.background = 'var(--bg-hover)';
            tabBtnBackendDeliv.style.color = 'var(--text-muted)';
            if (paneBackendReq) paneBackendReq.style.display = 'block';
            if (paneBackendDeliv) paneBackendDeliv.style.display = 'none';
            playUiSound('click');
        });

        tabBtnBackendDeliv.addEventListener('click', () => {
            tabBtnBackendDeliv.classList.add('active');
            tabBtnBackendDeliv.style.background = 'var(--primary)';
            tabBtnBackendDeliv.style.color = 'white';
            tabBtnBackendReq.classList.remove('active');
            tabBtnBackendReq.style.background = 'var(--bg-hover)';
            tabBtnBackendReq.style.color = 'var(--text-muted)';
            if (paneBackendReq) paneBackendReq.style.display = 'none';
            if (paneBackendDeliv) paneBackendDeliv.style.display = 'block';
            playUiSound('click');
            window.renderBackendDeliverables();
        });
    }

    // Backend Search & Filters
    const backendSearchInput = document.getElementById('backend-search-input');
    const backendClientFilter = document.getElementById('backend-client-filter');
    const backendStatusFilter = document.getElementById('backend-status-filter');

    if (backendSearchInput) backendSearchInput.addEventListener('input', () => window.renderBackendRequests());
    if (backendClientFilter) backendClientFilter.addEventListener('change', () => window.renderBackendRequests());
    if (backendStatusFilter) backendStatusFilter.addEventListener('change', () => window.renderBackendRequests());

    // Connect Log Client Request Button on Backend
    const btnBackendCreateReq = document.getElementById('btn-backend-create-request');
    if (btnBackendCreateReq) {
        btnBackendCreateReq.addEventListener('click', () => {
            const modal = document.getElementById('client-new-request-modal');
            if (modal) modal.classList.add('active');
        });
    }

    // 2. Client Quick Request Modal Triggers & Form Submission (Customer & Backend)
    const btnOpenClientRequest = document.getElementById('btn-open-client-request');
    const modalClientRequest = document.getElementById('client-new-request-modal');
    const closeClientRequestModal = document.getElementById('close-client-request-modal');
    const cancelClientRequestBtn = document.getElementById('cancel-client-request-btn');

    if (btnOpenClientRequest && modalClientRequest) {
        btnOpenClientRequest.addEventListener('click', () => {
            modalClientRequest.classList.add('active');
            const d = new Date();
            d.setDate(d.getDate() + 3); // default 3 days out
            const dateInput = document.getElementById('req-deadline');
            if (dateInput) dateInput.value = d.toISOString().split('T')[0];
        });
    }

    if (closeClientRequestModal) {
        closeClientRequestModal.addEventListener('click', () => {
            modalClientRequest.classList.remove('active');
        });
    }
    if (cancelClientRequestBtn) {
        cancelClientRequestBtn.addEventListener('click', () => {
            modalClientRequest.classList.remove('active');
        });
    }

    // Handle Client Request Submission
    const clientRequestForm = document.getElementById('client-request-form');
    if (clientRequestForm) {
        clientRequestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const category = document.getElementById('req-category').value;
            const deadline = document.getElementById('req-deadline').value;
            const title = document.getElementById('req-title').value.trim();
            const desc = document.getElementById('req-description').value.trim();
            const refUrl = document.getElementById('req-ref-url').value.trim();
            const isRush = document.getElementById('req-rush-check').checked;

            const ticketId = '#REQ-' + Math.floor(100 + Math.random() * 900);

            const requests = window.getClientRequests();
            const newReq = {
                id: ticketId,
                clientId: 'sipandplay',
                clientName: 'Sip and Play Cafe',
                title: title,
                category: category,
                description: desc,
                deadline: deadline,
                priority: isRush ? 'Urgent' : 'Normal',
                refUrl: refUrl,
                status: 'New',
                assignedTo: 'Imran (Senior Designer)',
                createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            };

            requests.unshift(newReq);
            window.saveClientRequests(requests);

            modalClientRequest.classList.remove('active');
            clientRequestForm.reset();
            playUiSound('success');
            window.renderCustomerRequests();
            window.renderBackendRequests();

            alert(`🎉 Success! Request ${ticketId} has been submitted directly to the Ucode Creative & Engineering Team!`);
            if (typeof window.switchClientTab === 'function') switchClientTab('tab-requests');
        });
    }

    // 3. Bank Slip Modal Triggers & Upload
    const btnOpenBankSlip = document.getElementById('btn-open-bank-slip');
    const modalBankSlip = document.getElementById('client-bank-slip-modal');
    const closeBankSlipModal = document.getElementById('close-bank-slip-modal');
    const cancelBankSlipBtn = document.getElementById('cancel-bank-slip-btn');

    if (btnOpenBankSlip && modalBankSlip) {
        btnOpenBankSlip.addEventListener('click', () => {
            modalBankSlip.classList.add('active');
        });
    }
    if (closeBankSlipModal) {
        closeBankSlipModal.addEventListener('click', () => {
            modalBankSlip.classList.remove('active');
        });
    }
    if (cancelBankSlipBtn) {
        cancelBankSlipBtn.addEventListener('click', () => {
            modalBankSlip.classList.remove('active');
        });
    }

    window.handleSlipSelected = function(input) {
        if (input.files && input.files[0]) {
            const label = document.getElementById('slip-file-text');
            if (label) label.textContent = '✓ ' + input.files[0].name + ' selected';
        }
    };

    const clientBankSlipForm = document.getElementById('client-bank-slip-form');
    if (clientBankSlipForm) {
        clientBankSlipForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inv = document.getElementById('slip-invoice-select').value;

            // Update billing badge
            const statusEl = document.getElementById('client-billing-status');
            if (statusEl) {
                statusEl.textContent = 'Verification in Progress';
                statusEl.className = 'status-indicator-green';
            }

            modalBankSlip.classList.remove('active');
            clientBankSlipForm.reset();
            alert(`✅ Bank transfer slip for ${inv} has been uploaded! Abdullah & Umar will verify the Commercial Bank transfer and issue your official receipt.`);
            switchClientTab('tab-billing');
        });
    }

    // 4. One-Click Copy Account Number
    const btnCopyAcc = document.getElementById('btn-copy-acc');
    if (btnCopyAcc) {
        btnCopyAcc.addEventListener('click', () => {
            navigator.clipboard.writeText('8029132085').then(() => {
                btnCopyAcc.innerHTML = '<i class="ph ph-check"></i> Copied!';
                setTimeout(() => {
                    btnCopyAcc.innerHTML = '<i class="ph ph-copy"></i> Copy';
                }, 2000);
            });
        });
    }

    // 5. Design Proofing Actions: Request Changes & 1-Click Approve
    const modalProofingFeedback = document.getElementById('client-proofing-comment-modal');
    const closeProofingModal = document.getElementById('close-proofing-modal');
    const cancelProofingBtn = document.getElementById('cancel-proofing-btn');

    window.openProofingFeedbackModal = function(draftName, version) {
        if (modalProofingFeedback) {
            const draftLbl = document.getElementById('proofing-modal-draft-name');
            if (draftLbl) draftLbl.textContent = `${draftName} (${version})`;
            modalProofingFeedback.classList.add('active');
        }
    };

    if (closeProofingModal) closeProofingModal.addEventListener('click', () => modalProofingFeedback.classList.remove('active'));
    if (cancelProofingBtn) cancelProofingBtn.addEventListener('click', () => modalProofingFeedback.classList.remove('active'));

    const clientProofingFeedbackForm = document.getElementById('client-proofing-feedback-form');
    if (clientProofingFeedbackForm) {
        clientProofingFeedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            modalProofingFeedback.classList.remove('active');
            clientProofingFeedbackForm.reset();
            alert(`✏️ Thank you, Vivian! Your revision notes have been dispatched to the designer. Revision Round 2 will be uploaded for your review shortly.`);
        });
    }

    // Approve Proofing Item with Confetti & 5-Star Testimonial Modal
    const modalTestimonial = document.getElementById('client-testimonial-modal');
    window.approveProofingItem = function(draftName) {
        if (confirm(`Approve and lock "${draftName}" as final sign-off?`)) {
            if (modalTestimonial) {
                modalTestimonial.classList.add('active');
            }
        }
    };

    const btnSubmitTestimonial = document.getElementById('btn-submit-testimonial');
    if (btnSubmitTestimonial) {
        btnSubmitTestimonial.addEventListener('click', () => {
            if (modalTestimonial) modalTestimonial.classList.remove('active');
            alert(`🎉 Success! Design is officially signed off and archived to your Final Asset Locker.`);
        });
    }

    // Star rating picker
    document.querySelectorAll('.star-item').forEach(star => {
        star.addEventListener('click', function() {
            const val = parseInt(this.getAttribute('data-val'), 10);
            document.querySelectorAll('.star-item').forEach(s => {
                const sVal = parseInt(s.getAttribute('data-val'), 10);
                s.style.color = sVal <= val ? '#fbbf24' : 'rgba(255,255,255,0.2)';
            });
        });
    });

    // 6. Physical Marketing & Print Tracker Controller
    window.updatePrintTaskStatus = function(taskId, newStatus) {
        const statusMap = {
            'not_started': '⚪ Not Started',
            'sent_printer': '🟡 Sent to Printer / In Production',
            'proof_checked': '🟠 Physical Proof Approved',
            'completed': '🟢 Printed & Installed in Cafe'
        };
        alert(`Physical print task #${taskId} status updated to: ${statusMap[newStatus] || newStatus}`);
    };

    const modalPrintProof = document.getElementById('client-print-proof-modal');
    const closePrintProofModal = document.getElementById('close-print-proof-modal');
    const cancelPrintProofBtn = document.getElementById('cancel-print-proof-btn');
    let currentPrintTaskId = 1;

    window.openPrintProofModal = function(taskId) {
        currentPrintTaskId = taskId;
        if (modalPrintProof) modalPrintProof.classList.add('active');
    };

    if (closePrintProofModal) closePrintProofModal.addEventListener('click', () => modalPrintProof.classList.remove('active'));
    if (cancelPrintProofBtn) cancelPrintProofBtn.addEventListener('click', () => modalPrintProof.classList.remove('active'));

    window.handlePrintPhotoSelected = function(input) {
        if (input.files && input.files[0]) {
            const label = document.getElementById('print-photo-text');
            if (label) label.textContent = '✓ ' + input.files[0].name + ' selected';
        }
    };

    const clientPrintProofForm = document.getElementById('client-print-proof-form');
    if (clientPrintProofForm) {
        clientPrintProofForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const vendor = document.getElementById('print-vendor-name').value.trim() || 'Local Printer';
            modalPrintProof.classList.remove('active');
            clientPrintProofForm.reset();

            const previewEl = document.getElementById(`print-proof-preview-${currentPrintTaskId}`);
            if (previewEl) previewEl.style.display = 'block';

            alert(`📸 Photo proof uploaded! Ucode Agency has logged vendor execution (${vendor}) and verified the physical print output.`);
        });
    }

    // 7. Client Asset Drag & Drop Upload
    window.handleClientAssetUpload = function(files) {
        if (!files || files.length === 0) return;
        const names = Array.from(files).map(f => f.name).join(', ');
        alert(`📁 Uploaded ${files.length} asset file(s): ${names}. Ucode Creative Team has received the files.`);
    };

    // 8. Add-On Store Modal
    const modalAddon = document.getElementById('client-addon-order-modal');
    const closeAddonModal = document.getElementById('close-addon-modal');
    const cancelAddonBtn = document.getElementById('cancel-addon-btn');

    window.openOrderAddonModal = function(title, price) {
        const titleEl = document.getElementById('addon-modal-title');
        const priceEl = document.getElementById('addon-modal-price');
        if (titleEl) titleEl.textContent = title;
        if (priceEl) priceEl.textContent = formatInvoiceNumber(price) + ' LKR';
        if (modalAddon) modalAddon.classList.add('active');
    };

    if (closeAddonModal) closeAddonModal.addEventListener('click', () => modalAddon.classList.remove('active'));
    if (cancelAddonBtn) cancelAddonBtn.addEventListener('click', () => modalAddon.classList.remove('active'));

    const clientAddonOrderForm = document.getElementById('client-addon-order-form');
    if (clientAddonOrderForm) {
        clientAddonOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('addon-modal-title').textContent;
            modalAddon.classList.remove('active');
            clientAddonOrderForm.reset();
            alert(`🚀 Success! Your add-on order for "${title}" has been fast-tracked and assigned to Ucode Production.`);
        });
    }

    // 9. View Client Invoice Directly in Studio Sheet
    window.viewClientInvoiceDirect = function(invNumber, amount, scope) {
        const invModal = document.getElementById('invoice-modal');
        if (!invModal) return;

        const clientInput = document.getElementById('inv-input-client');
        const companyInput = document.getElementById('inv-input-company');
        const numInput = document.getElementById('inv-input-number');
        const dateInput = document.getElementById('inv-input-date');

        if (clientInput) clientInput.value = 'Vivian';
        if (companyInput) companyInput.value = 'Sip and Play';
        if (numInput) numInput.value = invNumber.replace('INV-', '');
        if (dateInput) dateInput.value = '2026-10-04';

        invoiceItems = [
            { description: scope + ' - Professional Agency Deliverables', qty: 1, price: amount }
        ];

        renderInvoiceItemsEditor();
        syncInvoicePreview();

        invModal.classList.add('active');
    };

    // ==============================================================
    // === 10. STRATEGIC GROWTH & MONTE CARLO SIMULATOR CONTROLLER ===
    // ==============================================================
    window.calculateGrowthSim = function() {
        const smmCount = parseInt(document.getElementById('sim-slider-smm')?.value || 4, 10);
        const webCount = parseInt(document.getElementById('sim-slider-web')?.value || 2, 10);
        const gulfCount = parseInt(document.getElementById('sim-slider-gulf')?.value || 1, 10);
        const aiCount = parseInt(document.getElementById('sim-slider-ai')?.value || 3, 10);

        const smmValEl = document.getElementById('sim-slider-smm-val');
        const webValEl = document.getElementById('sim-slider-web-val');
        const gulfValEl = document.getElementById('sim-slider-gulf-val');
        const aiValEl = document.getElementById('sim-slider-ai-val');

        if (smmValEl) smmValEl.textContent = `${smmCount} Client${smmCount > 1 ? 's' : ''}`;
        if (webValEl) webValEl.textContent = `${webCount} Project${webCount > 1 ? 's' : ''} / mo`;
        if (gulfValEl) gulfValEl.textContent = `${gulfCount} Client${gulfCount > 1 ? 's' : ''}`;
        if (aiValEl) aiValEl.textContent = `${aiCount} Active Bot${aiCount > 1 ? 's' : ''}`;

        const gross = (smmCount * 50000) + (webCount * 175000) + (gulfCount * 280000) + (aiCount * 25000);
        const arr = gross * 12;
        const cogs = Math.round(gross * 0.22);
        const net = gross - cogs;
        const split = Math.round(net / 2);

        const formatNum = (n) => n.toLocaleString('en-US');

        const grossEl = document.getElementById('sim-projected-gross');
        const arrEl = document.getElementById('sim-projected-arr');
        const abdEl = document.getElementById('sim-split-abdullah');
        const umarEl = document.getElementById('sim-split-umar');
        const cogsEl = document.getElementById('sim-cogs-val');

        if (grossEl) grossEl.textContent = `${formatNum(gross)} LKR`;
        if (arrEl) arrEl.textContent = `⚡ Annual Run Rate (ARR): ${(arr / 1000000).toFixed(2)} Million LKR`;
        if (abdEl) abdEl.textContent = `${formatNum(split)} LKR`;
        if (umarEl) umarEl.textContent = `${formatNum(split)} LKR`;
        if (cogsEl) cogsEl.textContent = `${formatNum(cogs)} LKR`;
    };

    // ==============================================================
    // === 11. PRODUCTION KANBAN CONTROLLER ===
    // ==============================================================
    window.moveKanbanTask = function(btn, nextColId) {
        if (window.playUiSound) playUiSound('success');
        const card = btn.closest('.kanban-card');
        if (!card) return;
        const cols = document.querySelectorAll('.kanban-col');
        const colTargets = {
            'prod': cols[1]?.querySelector('.kanban-cards-stack'),
            'qa': cols[2]?.querySelector('.kanban-cards-stack'),
            'staging': cols[3]?.querySelector('.kanban-cards-stack')
        };

        const targetStack = colTargets[nextColId];
        if (targetStack) {
            if (nextColId === 'qa') {
                btn.textContent = 'Push to Client →';
                btn.className = 'k-action-btn approved';
                btn.onclick = function() { moveKanbanTask(this, 'staging'); };
            } else if (nextColId === 'staging') {
                card.classList.add('completed');
                btn.parentElement.innerHTML = '<span class="k-assignee"><i class="ph ph-check"></i> Ready for Approval</span>';
            }
            targetStack.appendChild(card);
            alert('🚀 Task moved successfully in production pipeline!');
        }
    };

    window.filterKanban = function(filter) {
        if (window.playUiSound) playUiSound('click');
        document.querySelectorAll('.kanban-card').forEach(card => {
            const client = card.querySelector('.k-client')?.textContent.toLowerCase() || '';
            if (filter === 'all' || client.includes('sip')) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // ==============================================================
    // === 12. STAGING SIMULATOR MODAL CONTROLLER ===
    // ==============================================================
    const modalStaging = document.getElementById('client-staging-modal');
    const closeStagingModal = document.getElementById('close-staging-modal');

    window.openClientStagingModal = function() {
        if (window.playUiSound) playUiSound('pop');
        if (modalStaging) modalStaging.classList.add('active');
    };

    if (closeStagingModal) {
        closeStagingModal.addEventListener('click', () => {
            if (modalStaging) modalStaging.classList.remove('active');
        });
    }

    window.setStagingDevice = function(mode) {
        if (window.playUiSound) playUiSound('click');
        const vp = document.getElementById('staging-browser-viewport');
        const btnDesk = document.getElementById('btn-device-desktop');
        const btnMob = document.getElementById('btn-device-mobile');

        if (mode === 'mobile') {
            if (vp) vp.className = 'staging-browser-viewport mobile';
            if (btnDesk) { btnDesk.style.background = 'transparent'; btnDesk.style.color = 'var(--text-muted)'; }
            if (btnMob) { btnMob.style.background = 'var(--primary)'; btnMob.style.color = '#021a0f'; }
        } else {
            if (vp) vp.className = 'staging-browser-viewport desktop';
            if (btnMob) { btnMob.style.background = 'transparent'; btnMob.style.color = 'var(--text-muted)'; }
            if (btnDesk) { btnDesk.style.background = 'var(--primary)'; btnDesk.style.color = '#021a0f'; }
        }
    };

    // ==============================================================
    // === 13. PROPOSAL GENERATOR CONTROLLER ===
    // ==============================================================
    const modalProposal = document.getElementById('proposal-generator-modal');
    const closeProposalModal = document.getElementById('close-proposal-modal');
    const cancelProposalBtn = document.getElementById('cancel-proposal-btn');
    const proposalForm = document.getElementById('proposal-generator-form');

    window.openProposalGeneratorModal = function() {
        if (window.playUiSound) playUiSound('pop');
        if (modalProposal) modalProposal.classList.add('active');
        updateProposalPricingPreview();
    };

    if (closeProposalModal) closeProposalModal.addEventListener('click', () => modalProposal.classList.remove('active'));
    if (cancelProposalBtn) cancelProposalBtn.addEventListener('click', () => modalProposal.classList.remove('active'));

    window.updateProposalPricingPreview = function() {
        const tier = document.getElementById('prop-tier')?.value || 'scale';
        const dur = parseInt(document.getElementById('prop-duration')?.value || 6, 10);
        const rates = { 'growth': 65000, 'scale': 145000, 'enterprise': 320000 };
        const monthly = rates[tier] || 145000;
        const total = monthly * dur;
        const each = Math.round(total / 2);

        const tcvEl = document.getElementById('prop-preview-tcv');
        const sharesEl = document.getElementById('prop-preview-shares');
        if (tcvEl) tcvEl.textContent = `${total.toLocaleString()} LKR`;
        if (sharesEl) sharesEl.textContent = `Abdullah & Umar 50/50 Share: ${each.toLocaleString()} LKR each`;
    };

    if (proposalForm) {
        proposalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const clientName = document.getElementById('prop-client-name').value;
            const tcv = document.getElementById('prop-preview-tcv').textContent;
            if (window.playUiSound) playUiSound('coin');
            modalProposal.classList.remove('active');
            alert(`📜 Contract Proposal for "${clientName}" (${tcv}) generated & ready for digital signature! A PDF pitch copy has been prepared for presentation.`);
        });
    }

    // ==============================================================
    // === 14. STAFF SUBMIT & LOG HOURS CONTROLLERS ===
    // ==============================================================
    const modalStaffSub = document.getElementById('staff-submit-modal');
    const closeStaffSubModal = document.getElementById('close-staff-submit-modal');
    const cancelStaffSubBtn = document.getElementById('cancel-staff-submit-btn');
    const staffSubForm = document.getElementById('staff-submit-form');

    window.openStaffSubmitModal = function() {
        if (window.playUiSound) playUiSound('pop');
        if (modalStaffSub) modalStaffSub.classList.add('active');
    };

    if (closeStaffSubModal) closeStaffSubModal.addEventListener('click', () => modalStaffSub.classList.remove('active'));
    if (cancelStaffSubBtn) cancelStaffSubBtn.addEventListener('click', () => modalStaffSub.classList.remove('active'));

    if (staffSubForm) {
        staffSubForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('staff-sub-title').value;
            const ver = document.getElementById('staff-sub-version').value;
            if (window.playUiSound) playUiSound('success');
            modalStaffSub.classList.remove('active');
            staffSubForm.reset();
            alert(`✅ Deliverable "${title}" (${ver}) submitted! Abdullah & Umar will review and notify the client.`);
        });
    }

    const modalStaffHours = document.getElementById('staff-log-hours-modal');
    const closeStaffHoursModal = document.getElementById('close-staff-hours-modal');
    const cancelStaffHoursBtn = document.getElementById('cancel-staff-hours-btn');
    const staffHoursForm = document.getElementById('staff-log-hours-form');

    window.openStaffLogHoursModal = function() {
        if (window.playUiSound) playUiSound('pop');
        const dateInput = document.getElementById('hours-date');
        if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
        if (modalStaffHours) modalStaffHours.classList.add('active');
    };

    if (closeStaffHoursModal) closeStaffHoursModal.addEventListener('click', () => modalStaffHours.classList.remove('active'));
    if (cancelStaffHoursBtn) cancelStaffHoursBtn.addEventListener('click', () => modalStaffHours.classList.remove('active'));

    if (staffHoursForm) {
        staffHoursForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const specialist = document.getElementById('hours-specialist').value;
            const hrs = document.getElementById('hours-count').value;
            if (window.playUiSound) playUiSound('coin');
            modalStaffHours.classList.remove('active');
            staffHoursForm.reset();
            alert(`⏱️ Logged ${hrs} hours for ${specialist}. Payout ledger updated successfully.`);
        });
    }

    // ==============================================================
    // === 15. INTERACTIVE AI WHATSAPP BOT DEMO CONTROLLER ===
    // ==============================================================
    const modalAiBot = document.getElementById('ai-bot-demo-modal');
    const closeAiBotModal = document.getElementById('close-ai-bot-modal');
    const aiChatForm = document.getElementById('ai-chat-input-form');
    const aiChatMsgInput = document.getElementById('ai-chat-user-msg');
    const aiChatThread = document.getElementById('ai-chat-thread');

    window.openAiBotDemoModal = function() {
        if (window.playUiSound) playUiSound('pop');
        if (modalAiBot) modalAiBot.classList.add('active');
    };

    if (closeAiBotModal) {
        closeAiBotModal.addEventListener('click', () => {
            if (modalAiBot) modalAiBot.classList.remove('active');
        });
    }

    if (aiChatForm && aiChatMsgInput && aiChatThread) {
        aiChatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = aiChatMsgInput.value.trim();
            if (!text) return;
            aiChatMsgInput.value = '';

            const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Append user message
            const userMsg = document.createElement('div');
            userMsg.style.cssText = 'align-self: flex-end; background: #005c4b; color: #e9edef; padding: 8px 12px; border-radius: 8px; max-width: 85%; font-size: 0.85rem; line-height: 1.4;';
            userMsg.innerHTML = `${esc(text)}<div style="font-size: 0.65rem; color: #8696a0; text-align: right; margin-top: 4px;">${timeNow} ✓✓</div>`;
            aiChatThread.appendChild(userMsg);
            aiChatThread.scrollTop = aiChatThread.scrollHeight;

            if (window.playUiSound) playUiSound('pop');

            // Formulate AI response
            const lower = text.toLowerCase();
            let botReply = '';
            if (lower.includes('menu') || lower.includes('drink') || lower.includes('coffee') || lower.includes('food')) {
                botReply = `🍵 <strong>Sip & Play Menu Highlights:</strong><br>• Iced Matcha Cloud Latte — 1,250 LKR<br>• Salted Caramel Cold Brew — 1,100 LKR<br>• Belgian Nutella Waffles — 1,450 LKR<br><br>Would you like to reserve a gaming table for today?`;
            } else if (lower.includes('hour') || lower.includes('time') || lower.includes('open')) {
                botReply = `⏰ We are open <strong>Tuesday through Sunday from 11:00 AM to 11:30 PM</strong>. Mondays are closed for deep cleaning and staff tournaments!`;
            } else if (lower.includes('reserve') || lower.includes('table') || lower.includes('book')) {
                botReply = `🎲 Fantastic! We'd love to host you. What day and time are you planning to visit, and how many players are in your crew?`;
            } else if (lower.includes('location') || lower.includes('where') || lower.includes('address')) {
                botReply = `📍 We are located at <strong>109 Quarry Road, Dehiwala</strong> (just 3 mins from Galle Road). Free guest parking is available!`;
            } else {
                botReply = `✨ Thank you for messaging Sip & Play! I am your 24/7 AI concierge powered by Ucode. You can ask for our dynamic menu, table reservations, location, or opening hours!`;
            }

            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.style.cssText = 'align-self: flex-start; background: #202c33; color: #e9edef; padding: 8px 12px; border-radius: 8px; max-width: 85%; font-size: 0.85rem; line-height: 1.4;';
                botMsg.innerHTML = `${botReply}<div style="font-size: 0.65rem; color: #8696a0; text-align: right; margin-top: 4px;">${timeNow}</div>`;
                aiChatThread.appendChild(botMsg);
                aiChatThread.scrollTop = aiChatThread.scrollHeight;
                if (window.playUiSound) playUiSound('click');
            }, 500);
        });
    }

    // ==============================================================
    // === 16. MARKET STUDIES HELPERS ===
    // ==============================================================
    window.openGulfPitchModal = function() {
        if (window.playUiSound) playUiSound('pop');
        alert("📊 Saudi Arabia & UAE Market Study:\n\n• Average SME Retainer: 4,000 SAR (~320,000 LKR/mo)\n• Key Sectors: Riyadh Season Cafes, Jeddah Luxury D2C, Dubai Real Estate\n• High margin profile (86.4% net margin)\n• Click 'Generate Client Proposal' to issue an SAR proposal.");
    };

    window.openHospitalityStudyModal = function() {
        if (window.playUiSound) playUiSound('pop');
        alert("☕ Hospitality Compounding Retainer Playbook:\n\n• Converts 1-time menu design into 75,000 LKR/mo retainer.\n• Includes: Dynamic QR menu updates, monthly reel campaigns, in-store table tents, and local SEO.\n• Average client lifetime: 11.4 months.");
    };

    window.exportGrowthReport = function() {
        if (window.playUiSound) playUiSound('coin');
        alert("📥 Strategic Growth Market Study & Scaling Projections exported as Ucode_Agency_Expansion_Masterplan.pdf!");
    };

    // ==============================================================
    // === 17. BILLION-DOLLAR WORLD CLOCKS & TELEMETRY ===
    // ==============================================================
    function updateWorldClocks() {
        const now = new Date();
        const fmt = (tz) => {
            try {
                return new Intl.DateTimeFormat('en-GB', {
                    timeZone: tz,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }).format(now);
            } catch (e) {
                return now.toLocaleTimeString();
            }
        };

        const clkDxb = document.getElementById('clock-dxb');
        const clkLon = document.getElementById('clock-lon');
        const clkNyc = document.getElementById('clock-nyc');
        const clkCmb = document.getElementById('clock-cmb');

        if (clkDxb) clkDxb.textContent = fmt('Asia/Dubai');
        if (clkLon) clkLon.textContent = fmt('Europe/London');
        if (clkNyc) clkNyc.textContent = fmt('America/New_York');
        if (clkCmb) clkCmb.textContent = fmt('Asia/Colombo');
    }
    setInterval(updateWorldClocks, 1000);
    updateWorldClocks();

    // ==============================================================
    // === 18. PREPRESS BLEED & INTERACTIVE PROOFING PINPOINTS ===
    // ==============================================================
    window.toggleProofBleedGuides = function() {
        const overlay = document.getElementById('prepress-bleed-overlay');
        const btn = document.getElementById('btn-toggle-bleed');
        if (!overlay) return;
        const isShown = overlay.style.display !== 'none';
        overlay.style.display = isShown ? 'none' : 'block';
        if (btn) btn.classList.toggle('active', !isShown);
        if (window.playUiSound) playUiSound('click');
    };

    let pinCounter = 2;
    const proofCanvas = document.getElementById('interactive-proof-canvas');
    const modalAddPin = document.getElementById('add-pin-modal');
    const closePinModal = document.getElementById('close-pin-modal');
    const cancelPinBtn = document.getElementById('cancel-pin-btn');
    const addPinForm = document.getElementById('add-pin-form');
    const pinXVal = document.getElementById('pin-x-val');
    const pinYVal = document.getElementById('pin-y-val');
    const pinNoteText = document.getElementById('pin-note-text');
    const pinCoordsLabel = document.getElementById('pin-coords-label');

    function openPinModalAt(xPct, yPct) {
        if (pinXVal) pinXVal.value = xPct.toFixed(1);
        if (pinYVal) pinYVal.value = yPct.toFixed(1);
        if (pinCoordsLabel) pinCoordsLabel.textContent = `Pinpoint Location: ${xPct.toFixed(1)}%, ${yPct.toFixed(1)}%`;
        if (modalAddPin) modalAddPin.classList.add('active');
        if (pinNoteText) {
            pinNoteText.value = '';
            setTimeout(() => pinNoteText.focus(), 100);
        }
        if (window.playUiSound) playUiSound('pop');
    }

    window.promptManualPin = function() {
        openPinModalAt(50, 50);
    };

    if (proofCanvas) {
        proofCanvas.addEventListener('click', (e) => {
            if (e.target.closest('.proofing-pin-marker') || e.target.closest('.btn-proof-tool') || e.target.closest('.proof-prepress-toolbar')) return;
            const rect = proofCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xPct = Math.max(5, Math.min(95, (x / rect.width) * 100));
            const yPct = Math.max(5, Math.min(95, (y / rect.height) * 100));
            openPinModalAt(xPct, yPct);
        });
    }

    if (closePinModal) closePinModal.addEventListener('click', () => modalAddPin.classList.remove('active'));
    if (cancelPinBtn) cancelPinBtn.addEventListener('click', () => modalAddPin.classList.remove('active'));

    if (addPinForm) {
        addPinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const note = pinNoteText.value.trim();
            if (!note) return;
            const x = pinXVal.value;
            const y = pinYVal.value;
            pinCounter++;

            const newPin = document.createElement('div');
            newPin.className = 'proofing-pin-marker';
            newPin.id = `proof-pin-${pinCounter}`;
            newPin.style.cssText = `position: absolute; top: ${y}%; left: ${x}%;`;
            newPin.innerHTML = `
                <span class="pin-dot" style="background: #38bdf8; box-shadow: 0 0 14px rgba(56, 189, 248, 0.7);">${pinCounter}</span>
                <div class="pin-bubble">${esc(note)}</div>
            `;
            proofCanvas.appendChild(newPin);

            const countBadge = document.getElementById('canvas-pins-count');
            if (countBadge) countBadge.innerHTML = `<i class="ph ph-check-circle"></i> ${pinCounter} Visual Pins Active`;

            modalAddPin.classList.remove('active');
            if (window.playUiSound) playUiSound('success');
            alert(`📌 Revision Pin #${pinCounter} attached at (${x}%, ${y}%).\n\n"${note}"\n\nOur creative director has received your annotation!`);
        });
    }

    // ==============================================================
    // === 19. SCHEDULE PHYSICAL PRINT RUN CONTROLLER ===
    // ==============================================================
    const modalSchedPrint = document.getElementById('schedule-print-modal');
    const closeSchedPrint = document.getElementById('close-schedule-print-modal');
    const cancelSchedPrint = document.getElementById('cancel-schedule-print-btn');
    const schedPrintForm = document.getElementById('schedule-print-form');

    window.openSchedulePrintModal = function() {
        if (window.playUiSound) playUiSound('pop');
        const dateInput = document.getElementById('print-run-date');
        if (dateInput && !dateInput.value) {
            const d = new Date();
            d.setDate(d.getDate() + 7);
            dateInput.value = d.toISOString().split('T')[0];
        }
        if (modalSchedPrint) modalSchedPrint.classList.add('active');
    };

    if (closeSchedPrint) closeSchedPrint.addEventListener('click', () => modalSchedPrint.classList.remove('active'));
    if (cancelSchedPrint) cancelSchedPrint.addEventListener('click', () => modalSchedPrint.classList.remove('active'));

    let printTaskIndex = 2;
    if (schedPrintForm) {
        schedPrintForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('print-run-title').value.trim();
            const qty = document.getElementById('print-run-qty').value;
            const vendor = document.getElementById('print-run-vendor').value;
            const dims = document.getElementById('print-run-dims').value;
            const specs = document.getElementById('print-run-specs').value;
            const date = document.getElementById('print-run-date').value;

            printTaskIndex++;
            const container = document.getElementById('print-tasks-list');
            if (container) {
                const card = document.createElement('div');
                card.className = 'print-task-card';
                card.id = `print-task-${printTaskIndex}`;
                card.innerHTML = `
                    <div class="print-task-header">
                        <div class="print-task-icon" style="background: rgba(245, 158, 11, 0.15); color: var(--accent-gold);"><i class="ph ph-package"></i></div>
                        <div class="print-task-info">
                            <div class="print-specs-pill">${esc(dims)} • ${esc(qty)} Units</div>
                            <h4>${esc(title)}</h4>
                            <p>Assigned Vendor: <strong>${esc(vendor)}</strong> • Target Delivery: <strong>${esc(date)}</strong></p>
                        </div>
                        <div class="print-task-status-box">
                            <label>Current Status:</label>
                            <select class="print-status-select" onchange="updatePrintTaskStatus(${printTaskIndex}, this.value)">
                                <option value="not_started">⚪ Not Started</option>
                                <option value="sent_printer" selected>🟡 Sent to Printer / In Production</option>
                                <option value="proof_checked">🟠 Physical Proof Approved</option>
                                <option value="completed">🟢 Printed & Delivered</option>
                            </select>
                        </div>
                    </div>
                    <div class="print-specs-grid">
                        <div class="spec-unit"><span class="spec-lbl">Specs</span><span class="spec-val">${esc(specs)}</span></div>
                        <div class="spec-unit"><span class="spec-lbl">Color Mode</span><span class="spec-val">CMYK Fogra39</span></div>
                        <div class="spec-unit"><span class="spec-lbl">Resolution</span><span class="spec-val">300 DPI Vector</span></div>
                        <div class="spec-unit"><span class="spec-lbl">Bleed</span><span class="spec-val">3mm Margin Included</span></div>
                    </div>
                    <div class="print-actions-bar">
                        <div class="print-file-download">
                            <a href="logo.png" download="${esc(title)}_PrintReady_CMYK.png" class="btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 0.85rem;">
                                <i class="ph ph-download-simple"></i> <span>Download Vector Print File</span>
                            </a>
                        </div>
                        <div class="print-photo-proof">
                            <button class="btn-primary" onclick="openPrintProofModal(${printTaskIndex})" style="font-size: 0.85rem; padding: 0.4rem 0.85rem;">
                                <i class="ph ph-camera"></i> <span>Upload Photo Proof</span>
                            </button>
                        </div>
                    </div>
                `;
                container.prepend(card);
            }

            modalSchedPrint.classList.remove('active');
            schedPrintForm.reset();
            if (window.playUiSound) playUiSound('coin');
            alert(`🖨️ Print Run Dispatched!\n\n• Item: ${title}\n• Quantity: ${qty} units\n• Vendor: ${vendor}\n\nTask added to your Physical Execution Tracker.`);
        });
    }

    // ==============================================================
    // === 20. MASTER AGENCY AGREEMENT & CONTRACT PDF GENERATOR ===
    // ==============================================================
    window.downloadClientContractPdf = function() {
        if (window.playUiSound) playUiSound('coin');

        const opt = {
            margin: 10,
            filename: 'Ucode_Master_Agency_Agreement_SipAndPlay.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const template = document.createElement('div');
        template.style.cssText = 'padding: 35px; font-family: sans-serif; color: #0f172a; background: #ffffff; line-height: 1.5; max-width: 800px; margin: 0 auto;';
        template.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #00e599; padding-bottom: 18px; margin-bottom: 20px;">
                <div>
                    <h1 style="font-size: 22px; font-weight: 800; color: #021a0f; margin: 0; letter-spacing: -0.02em;">UCODE GLOBAL CREATIVE AGENCY</h1>
                    <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0;">Master Creative Services & Growth Retainer Agreement</p>
                </div>
                <div style="text-align: right;">
                    <span style="display: inline-block; background: #ecfdf5; color: #059669; font-weight: 700; font-size: 11px; padding: 4px 10px; border-radius: 4px; border: 1px solid #a7f3d0;">CONTRACT # UCD-2026-SP01</span>
                    <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0;">Executed: October 04, 2026</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; background: #f8fafc; padding: 14px; border-radius: 8px;">
                <div>
                    <strong style="font-size: 11px; color: #059669; text-transform: uppercase;">Agency Service Provider:</strong>
                    <div style="font-size: 13px; font-weight: 700; margin-top: 4px;">Ucode Media (Pvt) Ltd</div>
                    <div style="font-size: 11px; color: #475569;">Equity Partners: Abdullah Arshad & Umar Hunais</div>
                    <div style="font-size: 11px; color: #475569;">Colombo, Sri Lanka • Dubai, UAE</div>
                </div>
                <div>
                    <strong style="font-size: 11px; color: #059669; text-transform: uppercase;">Retainer Client:</strong>
                    <div style="font-size: 13px; font-weight: 700; margin-top: 4px;">Sip and Play Cafe</div>
                    <div style="font-size: 11px; color: #475569;">Authorized Representative: Vivian</div>
                    <div style="font-size: 11px; color: #475569;">Project: Omnichannel Web & Social Retainer</div>
                </div>
            </div>

            <h3 style="font-size: 13px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">1. Scope of Work & Deliverables</h3>
            <ul style="font-size: 11px; color: #334155; padding-left: 20px; margin-bottom: 16px;">
                <li><strong>Dynamic Web Application:</strong> Complete UI/UX design, custom responsive development, online drinks/food menu, board game catalog, table reservation engine, and mobile responsiveness.</li>
                <li><strong>Social Media Retainer:</strong> 12x high-converting reels & posts per month, copywriting, on-brand graphics, and campaign management.</li>
                <li><strong>Print & Physical Collateral:</strong> 500x A5 Table Tents, Entrance Roll-up Banners, Window vinyls, and 300 DPI Fogra39 pre-press production files.</li>
            </ul>

            <h3 style="font-size: 13px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">2. Financial Retainer & Milestones</h3>
            <div style="font-size: 11px; color: #334155; margin-bottom: 16px;">
                Total Contract Retainer: <strong>88,300.00 LKR</strong> (Initial Deposit of 73,300.00 LKR Paid; Final Balance of 15,000.00 LKR due on launch milestone Oct 30, 2026).
            </div>

            <h3 style="font-size: 13px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">3. Intellectual Property & Transfer</h3>
            <p style="font-size: 11px; color: #64748b; margin-bottom: 25px;">
                Upon receipt of final milestone payment, all final vector assets, web codebase, and production files transfer fully to Sip and Play Cafe under perpetual commercial license.
            </p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 25px; border-top: 1px dashed #cbd5e1; padding-top: 20px;">
                <div>
                    <div style="font-family: cursive; font-size: 18px; color: #059669;">Abdullah Arshad</div>
                    <div style="border-top: 1px solid #0f172a; margin-top: 5px; padding-top: 4px; font-size: 11px; font-weight: 700;">Abdullah Arshad & Umar Hunais</div>
                    <div style="font-size: 10px; color: #64748b;">Managing Partners, Ucode Agency</div>
                </div>
                <div>
                    <div style="font-family: cursive; font-size: 18px; color: #2563eb;">Vivian Vance</div>
                    <div style="border-top: 1px solid #0f172a; margin-top: 5px; padding-top: 4px; font-size: 11px; font-weight: 700;">Vivian (Authorized Signatory)</div>
                    <div style="font-size: 10px; color: #64748b;">Director, Sip and Play Cafe</div>
                </div>
            </div>

            <div style="text-align: center; margin-top: 30px; font-size: 10px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 10px;">
                UCODE ENTERPRISE VAULT • VERIFIED VIA SHA-256 DIGITAL FINGERPRINT • ALL RIGHTS RESERVED 2026
            </div>
        `;

        if (window.html2pdf) {
            html2pdf().from(template).set(opt).save();
        } else {
            alert("Contract generated successfully: Ucode_Master_Agency_Agreement_SipAndPlay.pdf");
        }
    };
    // ==============================================================
    // === UCODE EMPLOYEE MORNING COCKPIT & MOTIVATION CONTROLLER ===
    // ==============================================================
    const MOTIVATION_QUOTES = [
        { quote: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },
        { quote: "Simplicity is about subtracting the obvious and adding the meaningful.", author: "John Maeda" },
        { quote: "Don’t find customers for your products, find products for your customers.", author: "Seth Godin" },
        { quote: "Make it simple. Make it memorable. Make it inviting to look at.", author: "Leo Burnett" },
        { quote: "Excellence is not a skill. It is an attitude.", author: "Ralph Marston" },
        { quote: "Good design is obvious. Great design is transparent.", author: "Joe Sparano" }
    ];

    let currentQuoteIndex = 0;
    window.shuffleMotivationQuote = function() {
        currentQuoteIndex = (currentQuoteIndex + 1) % MOTIVATION_QUOTES.length;
        const q = MOTIVATION_QUOTES[currentQuoteIndex];
        const quoteEl = document.getElementById('staff-quote-text');
        const authorEl = document.getElementById('staff-quote-author');
        if (quoteEl && authorEl) {
            quoteEl.style.opacity = '0';
            authorEl.style.opacity = '0';
            setTimeout(() => {
                quoteEl.textContent = `"${q.quote}"`;
                authorEl.textContent = `— ${q.author}`;
                quoteEl.style.opacity = '1';
                authorEl.style.opacity = '1';
            }, 180);
        }
        playUiSound('pop');
    };

    const SPECIALIST_PROFILES = {
        imran: {
            name: 'Imran',
            initials: 'IF',
            role: 'Senior Full-Stack Web Dev',
            color: 'linear-gradient(135deg, #14a06a, #0b5a3a)'
        },
        sarah: {
            name: 'Sarah',
            initials: 'SL',
            role: 'Lead Brand & UI Designer',
            color: 'linear-gradient(135deg, #10b981, #059669)'
        },
        alex: {
            name: 'Alex',
            initials: 'AR',
            role: 'Senior Video & Motion Editor',
            color: 'linear-gradient(135deg, #ef4444, #b91c1c)'
        },
        bilal: {
            name: 'Bilal',
            initials: 'BS',
            role: 'Performance Marketing Lead',
            color: 'linear-gradient(135deg, #c084fc, #9333ea)'
        }
    };

    window.getGreetingTime = function() {
        const hour = new Date().getHours();
        if (hour < 12) return { text: 'Good morning', emoji: '☀️' };
        if (hour < 18) return { text: 'Good afternoon', emoji: '⚡' };
        return { text: 'Good evening', emoji: '🌙' };
    };

    window.setStaffSpecialist = function(specKey) {
        const spec = SPECIALIST_PROFILES[specKey] || SPECIALIST_PROFILES.imran;
        const avatar = document.getElementById('staff-avatar-circle');
        const greeting = document.getElementById('staff-greeting-text');
        const roleTitle = document.getElementById('staff-role-title');

        document.querySelectorAll('.staff-specialist-chip').forEach(c => {
            if (c.getAttribute('data-specialist') === specKey) c.classList.add('active');
            else c.classList.remove('active');
        });

        const timeGreeting = window.getGreetingTime();
        if (avatar) {
            avatar.textContent = spec.initials;
            avatar.style.background = spec.color;
        }
        if (greeting) {
            greeting.innerHTML = `${timeGreeting.text}, ${spec.name}! ${timeGreeting.emoji}`;
        }
        if (roleTitle) {
            roleTitle.innerHTML = `<i class="ph ph-laptop"></i> ${spec.role}`;
        }

        playUiSound('pop');
    };

    window.toggleStaffTask = function(checkbox, cardId) {
        const card = document.getElementById(cardId);
        if (card) {
            if (checkbox.checked) card.classList.add('completed');
            else card.classList.remove('completed');
        }

        const allBoxes = document.querySelectorAll('.staff-task-checkbox');
        const total = allBoxes.length;
        let checked = 0;
        allBoxes.forEach(b => { if (b.checked) checked++; });

        const pct = Math.round((checked / (total || 1)) * 100);
        const countText = document.getElementById('staff-task-count-text');
        if (countText) {
            countText.textContent = `${checked} of ${total} Completed (${pct}% Velocity)`;
        }

        playUiSound(checkbox.checked ? 'success' : 'click');
    };

    // Live studio clock & Focus Sprint Pomodoro Timer
    function updateStaffClock() {
        const clockEl = document.getElementById('staff-live-clock');
        if (clockEl) {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        }
    }
    setInterval(updateStaffClock, 1000);
    updateStaffClock();

    let sprintTimerInterval = null;
    let sprintSecondsRemaining = 25 * 60;
    const timerDisplay = document.getElementById('staff-timer-val');
    const timerBtn = document.getElementById('btn-toggle-sprint-timer');
    const timerIcon = document.getElementById('staff-timer-icon');
    const resetTimerBtn = document.getElementById('btn-reset-sprint-timer');

    function renderSprintTimer() {
        const mins = Math.floor(sprintSecondsRemaining / 60);
        const secs = sprintSecondsRemaining % 60;
        if (timerDisplay) {
            timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    }

    if (timerBtn) {
        timerBtn.addEventListener('click', () => {
            if (sprintTimerInterval) {
                clearInterval(sprintTimerInterval);
                sprintTimerInterval = null;
                if (timerIcon) timerIcon.className = 'ph-fill ph-play';
                playUiSound('pop');
            } else {
                playUiSound('coin');
                if (timerIcon) timerIcon.className = 'ph-fill ph-pause';
                sprintTimerInterval = setInterval(() => {
                    if (sprintSecondsRemaining > 0) {
                        sprintSecondsRemaining--;
                        renderSprintTimer();
                    } else {
                        clearInterval(sprintTimerInterval);
                        sprintTimerInterval = null;
                        if (timerIcon) timerIcon.className = 'ph-fill ph-play';
                        playUiSound('success');
                        if (window.showAgencyToast) window.showAgencyToast('🎉 25-min Sprint Complete! Log your billable hours.');
                    }
                }, 1000);
            }
        });
    }

    if (resetTimerBtn) {
        resetTimerBtn.addEventListener('click', () => {
            if (sprintTimerInterval) {
                clearInterval(sprintTimerInterval);
                sprintTimerInterval = null;
            }
            sprintSecondsRemaining = 25 * 60;
            renderSprintTimer();
            if (timerIcon) timerIcon.className = 'ph-fill ph-play';
            playUiSound('click');
        });
    }

    // Set greeting dynamically on load
    const initialGreeting = window.getGreetingTime();
    const greetEl = document.getElementById('staff-greeting-text');
    if (greetEl) {
        greetEl.innerHTML = `${initialGreeting.text}, Imran! ${initialGreeting.emoji}`;
    }

    // Initial load
    updateData();
    if (typeof window.renderBackendRequests === 'function') window.renderBackendRequests();
    if (typeof window.renderBackendDeliverables === 'function') window.renderBackendDeliverables();
    if (typeof window.renderCustomerDeliverables === 'function') window.renderCustomerDeliverables();
    if (typeof window.renderCustomerRequests === 'function') window.renderCustomerRequests();
});

