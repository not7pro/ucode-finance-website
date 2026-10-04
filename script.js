document.addEventListener('DOMContentLoaded', () => {
    // === Authentication Gate ===
    const loginOverlay = document.getElementById('login-overlay');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    if (sessionStorage.getItem('agency_authenticated') === 'true') {
        if(loginOverlay) loginOverlay.style.display = 'none';
        if(appContainer) appContainer.style.display = 'flex';
    } else {
        if(loginOverlay) loginOverlay.style.display = 'flex';
        if(appContainer) appContainer.style.display = 'none';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('login-username').value;
            const pass = document.getElementById('login-password').value;
            
            if (user === 'Ucode' && pass === 'Ucode@123') {
                sessionStorage.setItem('agency_authenticated', 'true');
                loginOverlay.style.display = 'none';
                appContainer.style.display = 'flex';
                loginError.style.display = 'none';
            } else {
                loginError.style.display = 'block';
            }
        });
    }

    // === Central State & LocalStorage ===
    let transactions = JSON.parse(localStorage.getItem('agency_transactions_v2')) || [];
    let projects = JSON.parse(localStorage.getItem('agency_projects')) || [];
    let goals = JSON.parse(localStorage.getItem('agency_goals')) || [];
    let smmClients = JSON.parse(localStorage.getItem('agency_smm_clients')) || [];
    let smmPosts = JSON.parse(localStorage.getItem('agency_smm_posts')) || [];

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

    if (!localStorage.getItem('agency_seed_august')) {
        const seedDate = '2026-08-15';
        
        projects.push({ id: Date.now()+1, name: 'Natures Treasure', desc: 'Client Project', budget: 25000, spent: 25000, status: 'completed' });
        projects.push({ id: Date.now()+2, name: 'Sip n Play', desc: 'Client Project', budget: 118000, spent: 62200, status: 'pending' });
        
        transactions.push({ id: Date.now()+3, title: 'NatureTreasure', subtitle: 'INV-000000000', amount: 10000, date: seedDate, type: 'income', category: 'Web Development', status: 'completed', account: 'Abdullah Savings' });
        transactions.push({ id: Date.now()+4, title: 'Zip n Co Advance', subtitle: 'INV-000000001', amount: 50000, date: seedDate, type: 'income', category: 'Web Development', status: 'completed', account: 'Umar Savings' });
        transactions.push({ id: Date.now()+5, title: 'Zip n Co PPT', subtitle: 'INV-000000002', amount: 13000, date: seedDate, type: 'income', category: 'Web Development', status: 'completed', account: 'umar Savings' });
        transactions.push({ id: Date.now()+6, title: 'NaturesTreasure Social Media', subtitle: 'INV-000000003', amount: 20000, date: seedDate, type: 'income', category: 'SMM Retainers', status: 'completed', account: 'umar Savings' });
        transactions.push({ id: Date.now()+7, title: 'Natures Treasure Web Maintain', subtitle: 'INV-000000004', amount: 5000, date: seedDate, type: 'income', category: 'Web Development', status: 'completed', account: 'umar Savings' });
        
        transactions.push({ id: Date.now()+8, title: 'Sadaqa', subtitle: 'Donation', amount: -10000, date: seedDate, type: 'expense', category: 'Consulting', status: 'completed', account: 'ashad' });
        transactions.push({ id: Date.now()+9, title: 'anti gravity', subtitle: 'Tooling', amount: -650, date: seedDate, type: 'expense', category: 'SaaS Tools', status: 'completed', account: 'google' });
        
        localStorage.setItem('agency_seed_august', 'true');
        localStorage.setItem('agency_invoice_counter', '5');
        saveProjects();
        saveTransactions();
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
            
            const viewId = item.getAttribute('data-view');
            const targetView = document.getElementById(viewId);
            if (targetView) {
                targetView.classList.add('active');
                pageTitle.textContent = item.querySelector('span').textContent;
            }
            
            if (sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
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

    // Real-time sync: pick up changes made in another tab/window instantly
    window.addEventListener('storage', (e) => {
        if (e.key && !e.key.startsWith('agency_')) return;
        transactions = JSON.parse(localStorage.getItem('agency_transactions_v2')) || [];
        projects = JSON.parse(localStorage.getItem('agency_projects')) || [];
        goals = JSON.parse(localStorage.getItem('agency_goals')) || [];
        smmClients = JSON.parse(localStorage.getItem('agency_smm_clients')) || [];
        smmPosts = JSON.parse(localStorage.getItem('agency_smm_posts')) || [];
        currentCurrency = localStorage.getItem('agency_currency') || 'LKR';
        updateCurrencyButtons();
        updateData();
    });

    // Initial load
    updateData();
});

