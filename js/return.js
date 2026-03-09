// return.js - All functionality for return page

// ========== PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', function() {
    loadIssuesToReturn();
    loadReturnedBooks();
    
    // Add search listener
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', filterIssues);
    }
});

// ========== LOAD ISSUES TO RETURN ==========
function loadIssuesToReturn() {
    const issues = getCurrentIssues();
    const container = document.getElementById('issuesList');
    
    if (!container) return;
    
    if (issues.length === 0) {
        container.innerHTML = '<div class="no-data">📭 No books to return</div>';
        return;
    }
    
    container.innerHTML = '';
    issues.forEach(issue => {
        container.appendChild(createIssueCard(issue));
    });
}

// ========== CREATE ISSUE CARD ==========
function createIssueCard(issue) {
    const card = document.createElement('div');
    card.className = 'issue-card';
    card.id = `issue-${issue.id}`;
    
    // Check if overdue
    const today = new Date();
    const due = new Date(issue.dueDate);
    const isOverdue = today > due;
    const fine = isOverdue ? calculateFine(issue.id) : 0;
    
    if (isOverdue) {
        card.classList.add('overdue');
    }
    
    card.innerHTML = `
        <h3>${issue.book}</h3>
        <p><strong>Member:</strong> ${issue.member}</p>
        <p><strong>Issued:</strong> ${issue.issueDate}</p>
        <p><strong>Due Date:</strong> ${issue.dueDate}</p>
        ${isOverdue ? `<p class="fine">⚠️ Overdue! Fine: ₹${fine}</p>` : ''}
        <button class="return-btn" onclick="handleReturn(${issue.id})">📦 Return This Book</button>
    `;
    
    return card;
}

// ========== HANDLE RETURN ==========
function handleReturn(issueId) {
    const result = returnBook(issueId);
    
    if (result) {
        showMessage(result);
        loadIssuesToReturn();
        loadReturnedBooks();
    }
}

// ========== SHOW MESSAGE ==========
function showMessage(result) {
    const messageArea = document.getElementById('messageArea');
    let message = `✅ Book "${result.book}" returned successfully!`;
    
    if (result.fine > 0) {
        message += ` Fine collected: ₹${result.fine}`;
    }
    
    messageArea.innerHTML = `<div class="message-success">${message}</div>`;
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        messageArea.innerHTML = '';
    }, 3000);
}

// ========== LOAD RETURNED BOOKS ==========
function loadReturnedBooks() {
    const returned = getReturnedBooks();
    const tbody = document.getElementById('returnedTableBody');
    
    if (!tbody) return;
    
    if (returned.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="no-data">No books returned yet</td></tr>';
        return;
    }
    
    // Show last 5 returned books
    const recentReturns = [...returned].reverse().slice(0, 5);
    
    tbody.innerHTML = '';
    recentReturns.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.book}</td>
            <td>${book.member}</td>
            <td>${book.returnDate || new Date().toLocaleDateString()}</td>
            <td>${book.fine ? '₹' + book.fine : '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

// ========== FILTER ISSUES ==========
function filterIssues() {
    const keyword = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (keyword === '') {
        loadIssuesToReturn();
        return;
    }
    
    const allIssues = getCurrentIssues();
    const filtered = allIssues.filter(issue => 
        issue.book.toLowerCase().includes(keyword) || 
        issue.member.toLowerCase().includes(keyword)
    );
    
    const container = document.getElementById('issuesList');
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="no-data">🔍 No matching books found</div>';
        return;
    }
    
    container.innerHTML = '';
    filtered.forEach(issue => {
        container.appendChild(createIssueCard(issue));
    });
}

// ========== HELPER FUNCTIONS (from issue.js) ==========
function getCurrentIssues() {
    const issues = JSON.parse(localStorage.getItem('issues')) || [];
    return issues.filter(issue => issue.status === 'issued');
}

function getReturnedBooks() {
    const issues = JSON.parse(localStorage.getItem('issues')) || [];
    return issues.filter(issue => issue.status === 'returned');
}

function calculateFine(issueId) {
    const issues = JSON.parse(localStorage.getItem('issues')) || [];
    const issue = issues.find(i => i.id === issueId);
    
    if (!issue || issue.status === 'returned') return 0;
    
    const today = new Date();
    const due = new Date(issue.dueDate);
    
    if (today > due) {
        const daysLate = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
        return daysLate * 5;
    }
    return 0;
}

function returnBook(issueId) {
    const issues = JSON.parse(localStorage.getItem('issues')) || [];
    const issue = issues.find(i => i.id === issueId);
    
    if (!issue || issue.status === 'returned') {
        return null;
    }
    
    const today = new Date();
    const due = new Date(issue.dueDate);
    let fine = 0;
    
    if (today > due) {
        const daysLate = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
        fine = daysLate * 5;
    }
    
    issue.status = 'returned';
    issue.returnDate = today.toLocaleDateString();
    issue.fine = fine;
    
    localStorage.setItem('issues', JSON.stringify(issues));
    
    return issue;
}