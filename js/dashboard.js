/**
 * DASHBOARD.JS - Dashboard Functions
 */

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    loadRecentBooks();
});

// Update statistics
function updateStats() {
    const books = getBooks();
    
    const total = books.length;
    const available = books.filter(b => b.status === 'available').length;
    const borrowed = books.filter(b => b.status === 'borrowed').length;
    
    document.getElementById('totalBooks').textContent = total;
    document.getElementById('availableBooks').textContent = available;
    document.getElementById('borrowedBooks').textContent = borrowed;
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

// Auto-refresh stats every 30 seconds
setInterval(updateStats, 30000);