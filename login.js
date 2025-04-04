// login.js

// Handle login form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
  
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
  
        if (!username) {
          Swal.fire('Oops!', 'Please enter your name!', 'warning');
          return;
        }
  
        if (password !== '123456') {
          Swal.fire('Error', 'Incorrect password. Try "123456".', 'error');
          return;
        }
  
        Swal.fire('Success!', `Welcome, ${username}!`, 'success');
  
        // Toggle sections
        document.getElementById('banner').style.display = 'none';
        document.getElementById('navbar').classList.remove('hidden');
        document.getElementById('vocabulary').classList.remove('hidden');
        document.getElementById('faq').classList.remove('hidden');
        
        // Load lessons after login
        loadLessons();
      });
    }
  });
  
  // Logout function
  function logout() {
    // Hide sections
    document.getElementById('navbar').classList.add('hidden');
    document.getElementById('vocabulary').classList.add('hidden');
    document.getElementById('faq').classList.add('hidden');
    
    // Show banner
    const banner = document.getElementById('banner');
    if (banner) {
        banner.classList.remove('hidden');
        banner.style.display = 'flex';
    }
    
    // Show footer
    const footer = document.querySelector('footer');
    if (footer) {
        footer.classList.remove('hidden');
        footer.style.display = 'flex';
    }
    
    // Show success message
    Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out successfully!',
        timer: 2000,
        showConfirmButton: false
    });
  }
  
  // Scroll to sections
  function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  }