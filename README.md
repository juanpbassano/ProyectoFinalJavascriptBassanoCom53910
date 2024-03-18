#Script para supermercado
***
Se recomienda usar la consola del navegador abierta ya que los productos se muestran en console.table para que quede mejor de ver
 
USUARIO: JuanPablo
CONTRASEÑA: 987

El siguiente script se desarrollo para poder ingresar nuevos productos y luego agregarlos al carrito de compras ingresando un nombre del producto y la cantidad, previamente loggeado correctamente.
En primer lugar se declararon las variables y las constantes globales.
Se utilizo un bucle for para darle 3 intentos al usuario de loggearse. Dentro del for se utilizaron condicionarles if y else para corroborar el usuario y contraseña ingresados. 
Una vez que el log fue correcto te deja presionar los botones del html para que puedan coorer las funciones de agregar nuevos productos y carrito de compra. 
La funcion IngresoDeProductos es la encargada de pedir al usuario algunos parametros ingresados por prompt para crear nuevos objetos junto con la clase constructora (Productos) Estos productos nuevos quedan agregados al array todosLosProductos el cual ya tenia algunos productos predefinidos.
La funcion carritoCompras es la encargada de ejecutar 3 funciones en su interior, la primera carritoDeProductos es la que recolecta por prompt el nombre del producto ingresado y valida si hay un producto con su mismo nombre (todosLosProductos.find). Dentro de esta funcioncion hay otra (validarStock) que valida el stock del producto ingresado. si no hay suficiente stock se borra el ultimo producto ingresado al carrito y vuelve a preguntar si desea agregar otro producto. 
Por ultimo se ejecuta una funcion que suma el valor de los productos ingresados por la cantidad de los mismos dando como resultado el total a pagar. 