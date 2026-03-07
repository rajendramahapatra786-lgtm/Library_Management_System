/**
 * SCRIPT.JS - Shared Functions
 */

// Initialize data when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
});

// Initialize localStorage with sample data
function initializeData() {
    if (!localStorage.getItem('books')) {
        const sampleBooks = [
            { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', status: 'available' },
            { id: 2, title: '1984', author: 'George Orwell', status: 'available' },
            { id: 3, title: 'Clean Code', author: 'Robert Martin', status: 'borrowed' }
        ];
        localStorage.setItem('books', JSON.stringify(sampleBooks));
    }
}

// Get all books
function getBooks() {
    return JSON.parse(localStorage.getItem('books')) || [];
}

// Save books
function saveBooks(books) {
    localStorage.setItem('books', JSON.stringify(books));
}

// Show alert message
function showAlert(message, type = 'success') {
    alert(message); // Simple alert for now
}

// Make functions global
window.getBooks = getBooks;
window.saveBooks = saveBooks;
window.showAlert = showAlert;