// Export selectors engine
var $$ = Dom7;

// Initialize your app
var myApp = new Framework7(
	{
	material: true,
	materialPageLoadDelay: 2,
	animatePages: false,
	smartSelectSearchbar:true
});


var pedidosData = new Array();
// Export selectors engine
var $$ = Dom7;

var mainView = myApp.addView('.view', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    domCache: false //enable inline pages
});

$$(document).on('page:init', '.page[data-page="cargafuego"]', function (e) {
   
   storedData = new Array();
   $$("#cfuego")[0].reset();
   
   $$('#add-materiales').on('click',function(){
      $$("#materiales-form")[0].reset();
      myApp.openModal();
   });

   $$('#btnAgregarMat').on('click',function(){ 
     $$('#lista-materiales').html("");
      myApp.closeModal();
      storedData.push(myApp.formGetData('materiales-form'));
      if(storedData) {
        storedData.forEach(function (elemento, indice, array) {
           $$('#lista-materiales').append('<li class="swipeout"><div class="swipeout-content item-content">'+
            '<div class="item-media">'+elemento.nombremat+'</div><div class="item-inner">'+elemento.cantidadmat+
            '</div></div><div class="swipeout-actions-right">'+
            '<a href="#" class="swipeout-delete" data-confirm="Desea Eliminar este material?"'+
            'data-confirm-title="Delete?">Delete</a></div></li>');          
        });
      }
      else {
        alert('There is no stored data for this form yet. Try to change any field')
      }
   });

   $$('#btnCalcular').on('click',function(){
   });
})

$$(document).on('page:init', '.page[data-page="productos"]', function (e) {

   axios.get('http://www.enodje.e-widux.com/api/tam_productos')
            .then(function (response) {
              $$('.preloader').hide();
              for(var i in response.data) {
                 var data = response.data;
                  $$('#listadoproductos').append(
                    '<li><a href="#" id="'+data[i].id+'" data-nombre="'+data[i].nombre+'" data-pcarga="'+data[i].precio_recarga+'" data-pventa="'+data[i].precio_venta+'"  class="item-link item-content item-compra">'+
                        '<div class="item-media"><img src="img/logo.png" width="80"/></div>'+
                        '<div class="item-inner">'+
                           '<div class="item-title-row">'+
                              '<div class="item-title"><b>'+data[i].nombre+'</b></div>'+
                              '<div class="item-after"></div>'+
                           '</div>'+
                           '<div class="item-subtitle">Categoria: '+data[i].cod_rubro+'</div>'+
                           '<div class="item-text">'+data[i].descripcion+'</div>'+
                           '<div class="item-subtitle"><b>Precio Venta:</b> $'+data[i].precio_venta+'</div>'+
                           '<div class="item-subtitle"><b>Precio Recarga:</b> $'+data[i].precio_recarga+'</div>'+
                        '</div></a></li>');
                  }
                  $$('.item-compra').on('click',function(){
                          debugger;
                           $$("#form-pedidos")[0].reset();
                           var id = $$(this).attr("id");
                           var pcarga = $$(this).data("pcarga");
                           var pventa = $$(this).data("pventa");
                           var nombre = $$(this).data("nombre");
                           console.log(id);
                           console.log(pcarga);
                           console.log(pventa);
                           console.log(nombre);
                           if(pcarga == "null"){
                              $$('#itemrecarga').hide(); 
                           }
                           else{
                              $$('#itemrecarga').show(); 
                           }
                           $$('#id_prod').val(id);
                           $$('#pn_prod').val(pventa);
                           $$('#pc_prod').val(pcarga);
                           $$('#nom_prod').val(nombre);
                           $$('#pf_prod').val(pventa);
                           myApp.pickerModal('.picker-info');
                  });
                  $$('#tipo_prodn').on('change',function(){
                    debugger;
                      var pventa = $$('#pn_prod').val();
                      $$('#pf_prod').val(pventa);
                  });
                  $$('#tipo_prodc').on('change',function(){
                    debugger
                      var pcarga = $$('#pc_prod').val();
                      $$('#pf_prod').val(pcarga);
                  });
            })
            .catch(function (error) {
                  console.log(error);
            });

            

            $$('#btnAgregarProd').on('click',function(){ 
              var cantidad = $$('#cant_prod').val();
              console.log(cantidad);
              if(cantidad != ""){
                  pedidosData.push(myApp.formGetData('form-pedidos'));
                  myApp.addNotification({
                      message: 'Producto agregado al pedido',
                      hold: 1500,
                      button: {
                          text: '',
                          color: 'black',
                          close: false
                      }
                  });
                  var productos_carro = pedidosData.length;
                  $$('#carro_cantidad').html(productos_carro);
                  myApp.closeModal('.picker-info');
                  console.log(pedidosData);
              }
              else{
                 myApp.addNotification({
                      message: 'Debe ingresar la Cantidad',
                      hold: 500,
                      button: {
                          text: '',
                          color: 'black',
                          close: false
                      }
                  });
              }
            });               
});

$$(document).on('page:init', '.page[data-page="carrito"]', function (e) {
      
      if(pedidosData) {
        var total = 0;
        pedidosData.forEach(function (elemento, indice, array) {
           var subtotal = elemento.cant_prod * elemento.pf_prod;
           total = total + subtotal;
           $$('#lista-articulos').append('<li class="swipeout"><div class="swipeout-content item-content">'+
            '<div class="col-80"><div class="item-media">'+elemento.nom_prod+'</div></div>'+
            '<div class="col-10"><div class="item-inner">'+elemento.cant_prod+'</div></div>'+
            '<div class="col-10"><div class="item-inner">$ '+elemento.pf_prod+'</div></div>'+
            '<div class="col-10"><div class="item-inner">$ '+subtotal+'</div></div>'+
            '</div><div class="swipeout-actions-right">'+
            '<a href="#" class="swipeout-delete" data-confirm="Desea Eliminar este Articulo?"'+
            'data-confirm-title="Delete?">Delete</a></div></li>');          
        });
        $$('#total_carro').html("<b>Total: $ "+ total+"</b>");
      }
      else {
        alert('There is no stored data for this form yet. Try to change any field')
      }
})

$$(document).on('page:init', '.page[data-page="checkoutdni"]', function (e) {
            
            debugger
            $$('.preloader').hide();
            $$('#datos_cliente').hide();
            $$("#datos_cliente")[0].reset();
            
            console.log(dni_cliente)
            $$('#btn_buscacliente').on('click',function(){ 
              var dni_cliente = $$('#buscadni_cliente').val();

              console.log(dni_cliente)
              $$('.preloader').show();
                axios.get('http://www.enodje.e-widux.com/api/tam_clientes/5/'+dni_cliente)
                .then(function (response) {
                  
                  $$('.preloader').hide();
                  $$('#busca_cliente').hide();
                  $$('#datos_cliente').show();
                  $$("#datos_cliente")[0].reset();
                  $$('#dni_cliente').val(response.data.nro_documento); 
                  $$('#nombre_cliente').val(response.data.NOMBRE);
                  $$('#apellido_cliente').val(response.data.apellido); 
                  $$('#email_cliente').val(response.data.email);
                  $$('#ca_cliente').val(response.data.caracteristica);
                  $$('#tel_cliente').val(response.data.telefono);
                  $$('#direccion_cliente').val(response.data.calle); 
                  $$('#numero_cliente').val(response.data.numero); 
                  $$('#dpto_cliente').val(response.data.depto); 
                  $$('#piso_cliente').val(response.data.piso); 
                  $$('#mzna_cliente').val(response.data.manzana); 
                  $$('#lote_cliente').val(response.data.lote); 
                  $$('#ciudad_cliente').val(response.data.cod_localidad);
                  $$('#id_cliente').val(response.data.id_cliente);     

                })
                .catch(function (error) {
                  $$('.preloader').hide();
                  $$('#busca_cliente').hide();
                  $$("#datos_cliente")[0].reset();
                  $$('#id_cliente').val("nuevo");
                  $$('#datos_cliente').show();
                  $$('#dni_cliente').val(dni_cliente ); 
                });
            });

             $$('#btnPedido').on('click',function(){
                
                var tilde = $$('#datosOK').is(':checked');
                
                if(tilde){
                   var idCliente = $$('#id_cliente').val();
                   var clienteData = new Array();
                
                    if(idCliente == "nuevo"){  
                        clienteData.push(myApp.formGetData('datos_cliente'));
                        axios.post('http://www.enodje.e-widux.com/api/tam_clientes',
                        {
                                "cod_empresa": 1,
                                "cod_tipo_doc": 5,
                                "apellido": clienteData[0].apellido_cliente,
                                "telefono": clienteData[0].tel_cliente,
                                "caracteristica": clienteData[0].ca_cliente,
                                "email": clienteData[0].email_cliente,
                                "estado": "0",
                                "calle": clienteData[0].direccion_cliente,
                                "numero": clienteData[0].numero_cliente,
                                "depto": clienteData[0].dpto_cliente,
                                "piso": clienteData[0].piso_cliente,
                                "manzana": clienteData[0].mzna_cliente,
                                "lote": clienteData[0].lote_cliente,
                                "cod_localidad": clienteData[0].ciudad_cliente,
                                "NOMBRE": clienteData[0].nombre_cliente,
                                "nro_documento": clienteData[0].dni_cliente
                          })
                          .then(function (response) {
                             $$('#btnokpedido').click();
                             $$("#datos_cliente")[0].reset();
                             $$('#datos_cliente').hide();
                        })
                          .catch(function (error) {
                            console.log(error);
                        });
                      }
                      else{
                        myApp.addNotification({
                              message: 'Los datos seran modificados',
                              hold: 1000,
                              button: {
                                  text: '',
                                  color: 'black',
                                  close: false
                              }
                          });
                        $$('#btnokpedido').click();
                      }    
                    }
                      else{
                         myApp.addNotification({
                              message: 'Debe aceptar los datos',
                              hold: 1000,
                              button: {
                                  text: '',
                                  color: 'black',
                                  close: false
                              }
                          });
                      }
                
             });
})                 