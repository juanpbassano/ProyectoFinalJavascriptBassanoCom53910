#Script para minimercado
***
El siguiente script se desarrollo de forma dinamica con javascript simulando un ecomerce para poder realizar una compra de distintos productos de mercado.
En primer lugar se declararon las variables y las constantes globales.
Se realizo un formulario para crear un usuario el cual es guardado en el session storage, el cual es necesario para poder logearte en la pagina principal y tener acceso a los botones del html.
En el mismo se pueden filtrar productos por si no se encuentran visualmente en el html. Los productos cargados en el html son traidos de una base de datos ficticia creada en un archivo tipo JSON. Los productos son cargados de forma dinamica con su respectivo stock. 
Una vez que el log fue correcto se pueden presionar los botones del html para que puedan agregar productos al carrito y luego realizar el pago. 
Al crearse dinamicamente las cards se anido todo en funciones para que no tenga conflictos con los productos que aun no estaban creados. 
Los productos del carrito se guardan en el local storage al igual que el inicio de sesion, ya que al cambiar de pagina para realizar el pago los productos queden guardado ante cualquier cierre o refresco de pagina. Los productos del carrito se pueden borrar uno por uno o todos al mismo tiempo borrando tambien del local storage.
Se uso la libreria sweet alert2 para reemplazar los convensionales alert.
