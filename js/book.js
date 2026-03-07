/**
 * BOOK.JS - Book Management Functions
 */

// Initialize books page
document.addEventListener('DOMContentLoaded', function() {
    displayBooks();
});

// Display all books
function displayBooks() {
    const books = getBooks();
    const tbody = document.getElementById('booksList');
    
    if (!tbody) return;
    
    if (books.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No books found</td></tr>';
        return;
    }
    
    tbody.innerHTML = books.map(book => `
        <tr>
            <td><strong>${book.title}</strong></td>
            <td>${book.author}</td>
            <td>
                <span class="badge ${book.status === 'available' ? 'badge-available' : 'badge-borrowed'}">
                    ${book.status}
                </span>
            </td>
            <td>
                <button class="btn btn-small" onclick="toggleStatus(${book.id})">🔄</button>
                <button class="btn btn-small btn-danger" onclick="deleteBook(${book.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// Show add book modal
function showAddModal() {
    document.getElementById('bookModal').classList.add('show');
}

// Hide add book modal
function hideAddModal() {
    document.getElementById('bookModal').classList.remove('show');
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookAuthor').value = '';
}

// Save new book
function saveBook() {
    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    
    if (!title || !author) {
        alert('Please enter both title and author');
        return;
    }
    
    const books = getBooks();
    const newBook = {
        id: Date.now(),
        title: title,
        author: author,
        status: 'available'
    };
    
    books.push(newBook);
    saveBooks(books);
    
    hideAddModal();
    displayBooks();
    showAlert('Book added successfully!');
}

// Delete book
function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        const books = getBooks().filter(book => book.id !== id);
        saveBooks(books);
        displayBooks();
        showAlert('Book deleted successfully!');
    }
}

// Toggle book status (available/borrowed)
function toggleStatus(id) {
    const books = getBooks();
    const book = books.find(b => b.id === id);
    
    if (book) {
        book.status = book.status === 'available' ? 'borrowed' : 'available';
        saveBooks(books);
        displayBooks();
        showAlert(`Book marked as ${book.status}`);
    }
}

// Search books
function searchBooks() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const books = getBooks();
    
    if (!query) {
        displayBooks();
        return;
    }
    
    const filtered = books.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query)
    );
    
    const tbody = document.getElementById('booksList');
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No matching books</td></tr>';
    } else {
        tbody.innerHTML = filtered.map(book => `
            <tr>
                <td><strong>${book.title}</strong></td>
                <td>${book.author}</td>
                <td>
                    <span class="badge ${book.status === 'available' ? 'badge-available' : 'badge-borrowed'}">
                        ${book.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-small" onclick="toggleStatus(${book.id})">🔄</button>
                    <button class="btn btn-small btn-danger" onclick="deleteBook(${book.id})">🗑️</button>
                </td>
            </tr>
        `).join('');
    }
}

// Make functions global
window.showAddModal = showAddModal;
window.hideAddModal = hideAddModal;
window.saveBook = saveBook;
window.deleteBook = deleteBook;
window.toggleStatus = toggleStatus;
window.searchBooks = searchBooks;