// sweet_alerts.js
function mostrarEsperaAutomatica() {
  document.addEventListener('DOMContentLoaded', function() {
      Swal.fire({
          title: 'Espera un momento...',
          text: 'Realizando la operación...',
          icon: 'info',
          showConfirmButton: false,
          timer: 1000 // tiempo en milisegundos (1 segundo)
      });
  });
}

function mostrarExitoEliminar() {
  Swal.fire({
      title: '¡Cliente eliminado!',
      text: 'El cliente se ha eliminado correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
  }).then(() => {
      // Después de aceptar el mensaje de éxito, recargar la página
      window.location.reload();
  });
}

function mostrarCancelacionEliminar() {
  Swal.fire({
      title: 'Eliminación cancelada',
      text: 'La eliminación del cliente ha sido cancelada.',
      icon: 'info',
      confirmButtonText: 'Aceptar'
  });
}

function confirmarEliminacion(clientId) {
  Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Una vez eliminado, no podrás recuperar este cliente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
  }).then((result) => {
      if (result.isConfirmed) {
          // Si el usuario confirma la eliminación, realiza la solicitud al servidor para eliminar el cliente
          fetch(`/clients/delete/${clientId}`, {
              method: 'GET'
          }).then(response => {
              // Verifica si la eliminación fue exitosa
              if (response.ok) {
                  // Muestra el Sweet Alert de éxito
                  mostrarExitoEliminar();
              } else {
                  // Si hubo un error al eliminar el cliente, muestra un mensaje de error
                  mostrarError('Hubo un error al eliminar el cliente. Por favor, inténtalo de nuevo.');
              }
          }).catch(error => {
              // Si hubo un error en la solicitud, muestra un mensaje de error
              mostrarError('Hubo un error al eliminar el cliente. Por favor, inténtalo de nuevo.');
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Si el usuario cancela la eliminación, muestra el Sweet Alert de cancelación
          mostrarCancelacionEliminar();
      }
  });
}

function validarFormulario(event) {
  event.preventDefault(); // Detiene el envío del formulario

  const dni = document.getElementById('dni').value;
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const valor = document.getElementById('valor').value;

  if (!Validaciones.esCedulaValida(dni)) {
    mostrarError('El formato del DNI es inválido. Por favor, inténtelo de nuevo.');
  } else if (!Validaciones.soloLetras(nombre) || !Validaciones.soloLetras(apellido)) {
    mostrarError('El formato del nombre o apellido es inválido. Por favor, inténtelo de nuevo.');
  } else if (!Validaciones.soloNumeros(valor)) {
    mostrarError('El formato del valor es inválido. Por favor, inténtelo de nuevo.');
  } else {
    Swal.fire({
      title: '¡Cliente agregado!',
      text: 'El cliente se ha agregado correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      // Después de aceptar el mensaje de éxito, recargar la página
      window.location.reload();
      event.target.submit(); // Envía el formulario si todas las validaciones pasan
    });
  }
}

function mostrarError(mensaje) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: mensaje,
    confirmButtonText: 'Aceptar'
  });
}