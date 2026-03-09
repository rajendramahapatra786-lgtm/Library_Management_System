// Initialize members data
document.addEventListener('DOMContentLoaded', function() {
    initializeMembers();
    displayMembers();
    updateMemberStats();
});

// Initialize localStorage with sample members
function initializeMembers() {
    if (!localStorage.getItem('members')) {
        const sampleMembers = [
            {
                id: 'LIB001',
                name: 'John Smith',
                email: 'john.smith@email.com',
                phone: '+1234567890',
                type: 'Student',
                joinDate: '2025-01-15',
                booksBorrowed: 2,
                status: 'active'
            },
            {
                id: 'LIB002',
                name: 'Sarah Johnson',
                email: 'sarah.j@email.com',
                phone: '+1234567891',
                type: 'Teacher',
                joinDate: '2025-02-01',
                booksBorrowed: 1,
                status: 'active'
            }
        ];
        localStorage.setItem('members', JSON.stringify(sampleMembers));
    }
}

// Get all members
function getMembers() {
    return JSON.parse(localStorage.getItem('members')) || [];
}

// Save members
function saveMembers(members) {
    localStorage.setItem('members', JSON.stringify(members));
}

// Display members in table
function displayMembers(membersToShow = null) {
    const members = membersToShow || getMembers();
    const tbody = document.getElementById('membersList');
    
    if (members.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">No members found</td></tr>';
        return;
    }
    
    tbody.innerHTML = members.map((member, index) => `
        <tr>
            <td><strong>${member.id}</strong></td>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td><span class="member-type type-${member.type.toLowerCase()}">${member.type}</span></td>
            <td>${formatDate(member.joinDate)}</td>
            <td><span class="books-count">${member.booksBorrowed || 0}</span></td>
            <td><span class="status-${member.status || 'active'}">${member.status || 'active'}</span></td>
            <td class="action-btns">
                <button class="btn btn-icon btn-edit" onclick="editMember(${index})">✏️ Edit</button>
                <button class="btn btn-icon btn-delete" onclick="deleteMember(${index})">🗑️ Delete</button>
            </td>
        </tr>
    `).join('');
}

// Format date to readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Show add member modal
function showAddMemberModal() {
    // Clear form
    document.getElementById('memberId').value = generateMemberId();
    document.getElementById('memberName').value = '';
    document.getElementById('memberEmail').value = '';
    document.getElementById('memberPhone').value = '';
    document.getElementById('memberType').value = '';
    document.getElementById('joinDate').value = new Date().toISOString().split('T')[0];
    
    document.getElementById('memberModal').classList.add('show');
}

// Hide add member modal
function hideAddMemberModal() {
    document.getElementById('memberModal').classList.remove('show');
}

// Generate unique member ID
function generateMemberId() {
    const members = getMembers();
    const lastId = members.length > 0 
        ? parseInt(members[members.length - 1].id.replace('LIB', '')) 
        : 0;
    const newId = (lastId + 1).toString().padStart(3, '0');
    return `LIB${newId}`;
}

// Save new member
function saveMember() {
    const memberId = document.getElementById('memberId').value;
    const name = document.getElementById('memberName').value;
    const email = document.getElementById('memberEmail').value;
    const phone = document.getElementById('memberPhone').value;
    const type = document.getElementById('memberType').value;
    const joinDate = document.getElementById('joinDate').value;
    
    // Validation
    if (!memberId || !name || !email || !phone || !type || !joinDate) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    if (!validatePhone(phone)) {
        alert('Please enter a valid phone number');
        return;
    }
    
    // Check if member ID already exists
    const members = getMembers();
    if (members.some(m => m.id === memberId)) {
        alert('Member ID already exists. Please use a different ID.');
        return;
    }
    
    // Create new member
    const newMember = {
        id: memberId,
        name: name,
        email: email,
        phone: phone,
        type: type,
        joinDate: joinDate,
        booksBorrowed: 0,
        status: 'active'
    };
    
    members.push(newMember);
    saveMembers(members);
    
    hideAddMemberModal();
    displayMembers();
    updateMemberStats();
    showAlert('Member added successfully!');
}

// Validate email format
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate phone format (simple)
function validatePhone(phone) {
    return /^[\d\s\+\-\(\)]{10,}$/.test(phone);
}

// Edit member
function editMember(index) {
    const members = getMembers();
    const member = members[index];
    
    document.getElementById('editMemberIndex').value = index;
    document.getElementById('editMemberId').value = member.id;
    document.getElementById('editMemberName').value = member.name;
    document.getElementById('editMemberEmail').value = member.email;
    document.getElementById('editMemberPhone').value = member.phone;
    document.getElementById('editMemberType').value = member.type;
    document.getElementById('editJoinDate').value = member.joinDate;
    
    document.getElementById('editMemberModal').classList.add('show');
}

// Hide edit member modal
function hideEditMemberModal() {
    document.getElementById('editMemberModal').classList.remove('show');
}

// Update member
function updateMember() {
    const index = document.getElementById('editMemberIndex').value;
    const members = getMembers();
    
    const updatedMember = {
        id: document.getElementById('editMemberId').value,
        name: document.getElementById('editMemberName').value,
        email: document.getElementById('editMemberEmail').value,
        phone: document.getElementById('editMemberPhone').value,
        type: document.getElementById('editMemberType').value,
        joinDate: document.getElementById('editJoinDate').value,
        booksBorrowed: members[index].booksBorrowed,
        status: members[index].status
    };
    
    // Validation
    if (!updatedMember.name || !updatedMember.email || !updatedMember.phone) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!validateEmail(updatedMember.email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    members[index] = updatedMember;
    saveMembers(members);
    
    hideEditMemberModal();
    displayMembers();
    updateMemberStats();
    showAlert('Member updated successfully!');
}

// Delete member
function deleteMember(index) {
    if (confirm('Are you sure you want to delete this member?')) {
        const members = getMembers();
        members.splice(index, 1);
        saveMembers(members);
        displayMembers();
        updateMemberStats();
        showAlert('Member deleted successfully!');
    }
}

// Search members
function searchMembers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const members = getMembers();
    
    if (!searchTerm) {
        displayMembers(members);
        return;
    }
    
    const filtered = members.filter(member => 
        member.name.toLowerCase().includes(searchTerm) ||
        member.id.toLowerCase().includes(searchTerm) ||
        member.email.toLowerCase().includes(searchTerm) ||
        member.phone.includes(searchTerm)
    );
    
    displayMembers(filtered);
}

// Filter members by type
function filterMembers() {
    const filterType = document.getElementById('typeFilter').value;
    const members = getMembers();
    
    if (filterType === 'all') {
        displayMembers(members);
    } else {
        const filtered = members.filter(member => member.type === filterType);
        displayMembers(filtered);
    }
}

// Update member statistics
function updateMemberStats() {
    const members = getMembers();
    
    document.getElementById('totalMembers').textContent = members.length;
    document.getElementById('totalStudents').textContent = members.filter(m => m.type === 'Student').length;
    document.getElementById('totalTeachers').textContent = members.filter(m => m.type === 'Teacher').length;
    document.getElementById('activeMembers').textContent = members.filter(m => m.status === 'active').length;
}

// Make functions global
window.showAddMemberModal = showAddMemberModal;
window.hideAddMemberModal = hideAddMemberModal;
window.saveMember = saveMember;
window.editMember = editMember;
window.hideEditMemberModal = hideEditMemberModal;
window.updateMember = updateMember;
window.deleteMember = deleteMember;
window.searchMembers = searchMembers;
window.filterMembers = filterMembers;