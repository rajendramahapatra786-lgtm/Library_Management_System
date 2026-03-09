// issue.js - Core functions for issuing books

// Initialize storage
function initIssueStorage() {
    if (!localStorage.getItem('issues')) {
        localStorage.setItem('issues', JSON.stringify([]));
    }
}

// Issue a book
function issueBook(bookName, memberName, days) {
    initIssueStorage();
    
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);
    
    const issue = {
        id: Date.now(),
        book: bookName,
        member: memberName,
        issueDate: today.toLocaleDateString(),
        dueDate: dueDate.toLocaleDateString(),
        status: 'issued',
        returnDate: null,
        fine: 0
    };
    
    const issues = JSON.parse(localStorage.getItem('issues'));
    issues.push(issue);
    localStorage.setItem('issues', JSON.stringify(issues));
    
    return issue;
}

// Get all issues
function getAllIssues() {
    initIssueStorage();
    return JSON.parse(localStorage.getItem('issues'));
}

// Add this to issue.js - Get only issued books (not returned)
function getIssuedBooks() {
    const all = getAllIssues();
    return all.filter(issue => issue.status === 'issued');
}