// Minimal functionality for the email form (demo only)
// In production, connect to your backend/email service
document.querySelector('.notify-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = this.querySelector('input[type="email"]');
  input.disabled = true;
  this.querySelector('button').textContent = "Thank You!";
  setTimeout(() => {
    input.value = "";
    input.disabled = false;
    this.querySelector('button').textContent = "Notify Me";
  }, 2000);
});