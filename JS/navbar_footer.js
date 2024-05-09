document.addEventListener('DOMContentLoaded', function() {
  fetch('../HTML/navbar_footer.html')
      .then(response => response.text())
      .then(data => document.body.innerHTML = data + document.body.innerHTML)
      .catch(error => console.error('Error al cargar la barra de navegación:', error));
});
