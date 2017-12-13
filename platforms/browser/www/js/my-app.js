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

// Export selectors engine
var $$ = Dom7;

var mainView = myApp.addView('.view', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    domCache: true //enable inline pages
});

$$(document).on('page:init', '.page[data-page="cargafuego"]', function (e) {
   
   storedData = new Array();
   $$("#cfuego")[0].reset();
   
   $$('#add-materiales').on('click',function(){
      $$("#materiales-form")[0].reset();
      myApp.openModal();
   });

   $$('#btnAgregarMat').on('click',function(){ 
    debugger;
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
              for(var i in response.data) {
                 var data = response.data;
                  $$('#listadoproductos').append(
                    '<li><a href="#" data-id="'+data[i].id+'" class="item-link item-content item-compra">'+
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
                  $$('.item-compra').on('click',function(){
                      debugger;
                      //$$("#productos-form")[0].reset();
                       myApp.pickerModal('.picker-info')
                   });
              }
            })
            .catch(function (error) {
                  console.log(error);
            });               
});                