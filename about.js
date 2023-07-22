document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the saved theme from the Web Storage API (localStorage)
    var savedTheme = localStorage.getItem('selectedTheme');
  
    // Set the default selected option in the dropdown based on the saved theme
    var themeDropdown = document.getElementById('themeDropdown');
    if (savedTheme === 'dark') {
      themeDropdown.value = 'dark';
    } else {
      themeDropdown.value = 'light';
    }
})
// Add event listener to the dropdown to detect changes in selection
document.getElementById('themeDropdown').addEventListener('change', function() {
  const theme = this.value;
  if (theme === 'dark') {
    localStorage.setItem('selectedTheme', "dark");
    // Set other dark mode styles here
  } else {
    localStorage.setItem('selectedTheme', "light");
    // Set other light mode styles here
  }
});