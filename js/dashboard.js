// Initialize dashboard - Single DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', function () {
    updateStats();
    loadRecentBooks();
    updateMemberCount(); // Add member count update
    updateIssuedBooks(); // Add issued books count update
    updateReturnedToday(); 
});

// Update statistics
function updateStats() {
    const books = getBooks();

    const total = books.length;
    const available = books.filter(b => b.status === 'available').length;
    const borrowed = books.filter(b => b.status === 'borrowed').length;

    document.getElementById('totalBooks').textContent = total;
    document.getElementById('availableBooks').textContent = available;
    document.getElementById('issuedBooks').textContent = borrowed;
}

// Load recent books
function loadRecentBooks() {
    const books = getBooks().slice(0, 5);
    const container = document.getElementById('recentBooks');

    if (!container) return;

    if (books.length === 0) {
        container.innerHTML = '<p class="text-center">No books added yet</p>';
        return;
    }

    container.innerHTML = books.map(book => `
        <div class="book-item">
            <span><strong>${book.title}</strong> by ${book.author}</span>
            <span class="badge ${book.status === 'available' ? 'badge-available' : 'badge-borrowed'}">
                ${book.status}
            </span>
        </div>
    `).join('');
}

// Update member count for dashboard
function updateMemberCount() {
    const members = JSON.parse(localStorage.getItem('members')) || [];
    const memberCount = document.getElementById('totalMembers');
    if (memberCount) {
        memberCount.textContent = members.length;
    }
}
//count of issued books
function updateIssuedBooks() {

    const issuedBooks = getIssuedBooks();

    const issuedElement = document.getElementById('issuedBooks');

    if (issuedElement) {
        issuedElement.textContent = issuedBooks.length;
    }

}

function updateReturnedToday() {

    const issues = JSON.parse(localStorage.getItem('issues')) || [];

    const today = new Date().toLocaleDateString();

    const returnedToday = issues.filter(issue =>
        issue.status === "returned" && issue.returnDate === today
    );

    const element = document.getElementById("returnedToday");

    if (element) {
        element.textContent = returnedToday.length;
    }

}

// Auto-refresh stats every 30 seconds
setInterval(function () {
    updateStats();
    updateMemberCount(); // Also refresh member count
}, 30000);

const books = JSON.parse(localStorage.getItem('issuedBooks')) || [];
// Then display these books in your table