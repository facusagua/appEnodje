// Export selectors engine
var $$ = Dom7;

// Initialize your app
var myApp = new Framework7(
	{
	material: true,
	materialPageLoadDelay: 2,
	animatePages: true,
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
   $$('#informecalculofuego').hide();
   $$('#valmat').on('change',function(){
      var nombre = $('#valmat option:selected').html();
      var poder = $('#valmat option:selected').data("poder");
      console.log(poder);
      $$('#nombremat').val(nombre);
      $$('#podermat').val(poder);
   });

   $$('#add-materiales').on('click',function(){
      $$("#materiales-form")[0].reset();
      myApp.pickerModal('.picker-info');
   });

   $$('#btnAgregarMat').on('click',function(){ 
     $$('#lista-materiales').html("");
      myApp.closeModal();
      console.log(storedData);
      storedData.push(myApp.formGetData('materiales-form'));
      if(storedData) {
        storedData.forEach(function (elemento, indice, array) {
           $$('#lista-materiales').append('<li class="swipeout"><div class="swipeout-content item-content">'+
            '<div class="col-60"><div class="item-media">'+ elemento.nombremat+' ('+elemento.valmat+')</div></div>'+
            '<div class="col-20"><div class="item-inner">'+elemento.podermat+ 'KC/Kg</div></div>'+
            '<div class="col-20"><div class="item-inner">'+elemento.cantidadmat+ 'Kg.</div>'+
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
      var superficie = $$('#superficieFuego').val();
      console.log(superficie);
      if(superficie != "" && storedData.length > 0){
      $$('#datoscalculofuego').hide();
      var poderCalTorA = 0;
      var poderCalTorB = 0;
      if(storedData) {
        storedData.forEach(function (elemento, indice, array) {
          if(elemento.valmat == "A"){
           poderCalTorA += parseInt(elemento.cantidadmat) * parseInt(elemento.podermat);  
           $$('#cargaA').append('<li class="item-content">'+
                '<div class="item-inner">'+
                  '<div class="item-title">'+ elemento.nombremat +'</div>'+
                  '<div class="item-after">'+elemento.cantidadmat+ 'Kg.</div>'+
                '</div>'+
              '</li>');
           console.log(poderCalTorB);
           }
           else{
            poderCalTorB += parseInt(elemento.cantidadmat) * parseInt(elemento.podermat);  
            $$('#cargaB').append('<li class="item-content">'+
                '<div class="item-inner">'+
                  '<div class="item-title">'+ elemento.nombremat +'</div>'+
                  '<div class="item-after">'+elemento.cantidadmat+ 'Kg.</div>'+
                '</div>'+
              '</li>');
            console.log(poderCalTorB);
           }             
        });
        var total_cargaA = Math.round((poderCalTorA/parseInt(superficie))/ 4400);
        var total_cargaB = Math.round((poderCalTorB/parseInt(superficie))/ 4400);
        console.log(total_cargaA);
        console.log(total_cargaB);
        $$('#total_cargaA').html('<b> Resultado: '+total_cargaA+' Kg/m2</b>');
        $$('#total_cargaB').html('<b> Resultado: '+total_cargaB+' Kg/m2</b>');
        $$('#superficiefuego').html("Superficie Total: " + superficie + ' Mts2');
      }
      else {
        alert('There is no stored data for this form yet. Try to change any field')
      }

      $$('#informecalculofuego').show();
    }
    else{
      myApp.addNotification({
                      message: 'Faltan Ingresar Datos',
                      hold: 500,
                      button: {
                          text: '',
                          color: 'black',
                          close: false
                      }
                  });
    }
   });
})

function NaN2Zero(n){
    return isNaN( n ) ? 0 : n; 
}

function Null2Zero(n){
    if( n == null ){
      return 0;
    }
    else{
      return n;
    } 

}

$$(document).on('page:init', '.page[data-page="productos"]', function (e) {

   axios.get('http://www.enodje.ewidux.com/api/tam_productos')
            .then(function (response) {
              $$('.preloader').hide();
              for(var i in response.data) {
                 var data = response.data;
                  $$('#listadoproductos').append(
                    '<li><a href="#" id="'+data[i].id+'" data-nombre="'+data[i].nombre+'" data-pcarga="'+Null2Zero(data[i].precio_recarga)+'" data-pventa="'+Null2Zero(data[i].precio_venta)+'"  class="item-link item-content item-compra">'+
                        '<div class="item-media"><img src="img/logo.png" width="80"/></div>'+
                        '<div class="item-inner">'+
                           '<div class="item-title-row">'+
                              '<div class="item-title"><b>'+data[i].nombre+'</b></div>'+
                              '<div class="item-after"></div>'+
                           '</div>'+
                           '<div class="item-subtitle"><b>Precio Venta:</b> $'+Null2Zero(data[i].precio_venta)+'</div>'+
                           '<div class="item-subtitle"><b>Precio Recarga:</b> $'+Null2Zero(data[i].precio_recarga)+'</div>'+
                        '</div></a></li>');
                  }
                  $$('.item-compra').on('click',function(){
                          $$("#form-pedidos")[0].reset();
                           var id = $$(this).attr("id");
                           var pcarga = $$(this).data("pcarga");
                           var pventa = $$(this).data("pventa");
                           var nombre = $$(this).data("nombre");

                           
                           $$('#id_prod').val(id);
                           $$('#pn_prod').val(pventa);
                           $$('#pc_prod').val(pcarga);
                           $$('#nom_prod').val(nombre);
                           $$('#pf_prod').val(pventa);
                           if(pventa == 0){
                              $$('#itemcompra').hide();
                              $$('#tipo_prodn').prop('checked', false);  
                           }
                           else{
                              $$('#itemcompra').show();
                              $$('#tipo_prodn').prop('checked', true);
                              $$('#pf_prod').val(pventa); 
                           }

                           if(pcarga == 0){
                              $$('#itemrecarga').hide();
                              $$('#tipo_prodc').prop('checked', false); 
                           }
                           else{
                              $$('#itemrecarga').show();
                              if(pventa == 0){
                                $$('#tipo_prodc').prop('checked', true);
                                $$('#pf_prod').val(pcarga);
                              }    
                           }
                           myApp.pickerModal('.picker-info');
                  });

                  $$('#tipo_prodn').on('change',function(){
                      var pventa = $$('#pn_prod').val();
                      $$('#pf_prod').val(pventa);
                  });
                  $$('#tipo_prodc').on('change',function(){
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



$$(document).on('page:init', '.page[data-page="ph"]', function (e) {
    
  $$('#calculos').hide();

  $$('#btncalph').on('click',function(){
     var abc5 = 0;
     var co2 = 0;

     var pisoc = NaN2Zero(parseInt($$('#pisoc').val()));
     var pisos = NaN2Zero(parseInt($$('#pisos').val()));
     var sumc = NaN2Zero(parseInt($$('#sumc').val()));
     var sums = NaN2Zero(parseInt($$('#sums').val()));
     var cocherac = NaN2Zero(parseInt($$('#cocherac').val()));
     var salamaqc = NaN2Zero(parseInt($$('#salamaqc').val()));
     var gasc = NaN2Zero(parseInt($$('#gasc').val()));

     var cantpiso  = parseInt(Math.ceil(pisos/200))  * parseInt(pisoc);
     var cantsum   = parseInt(Math.ceil(sums/200)) * parseInt(sumc);
     var cantconch = parseInt(Math.ceil(cocherac/5));
     
     abc5 = parseInt(cantpiso) + parseInt(cantsum) + parseInt(cantconch) + parseInt(gasc);
     co2 = salamaqc;

     $$('#pisodat').html(cantpiso);
     $$('#sumdat').html(cantsum);
     $$('#cochdat').html(cantconch);
     $$('#salamaqdat').html(salamaqc);
     $$('#gasdat').html(gasc);
     $$('#totalABC').html(abc5);
     $$('#totalCO2').html(co2);


     $$('#tomadatos').hide();
     $$('#calculos').show();  
 });
})

$$(document).on('page:init', '.page[data-page="vivienda"]', function (e) {
      
  $$('#calculos').hide();

  $$('#btncalviv').on('click',function(){
     var abc5 = 0;
     
     var pisos = NaN2Zero(parseInt($$('#pisos').val()));
     var cocherac = NaN2Zero(parseInt($$('#cocherac').val()));
     
     var cantpiso  = parseInt(Math.ceil(pisos/200));
     var cantconch = parseInt(Math.ceil(cocherac/5));
     
     abc5 = parseInt(cantpiso) + parseInt(cantconch);
     
     $$('#pisodat').html(cantpiso);
     $$('#cochdat').html(cantconch);
     $$('#totalABC').html(abc5);

     $$('#tomadatos').hide();
     $$('#calculos').show();  
 });
})

$$(document).on('page:init', '.page[data-page="oficina"]', function (e) {
      
  $$('#calculos').hide();

  $$('#btncalofi').on('click',function(){
     var abc5 = 0;
     var co2 = 0;
     var halo = 0;

     var genc = NaN2Zero(parseInt($$('#genc').val()));
     var gens = NaN2Zero(parseInt($$('#gens').val()));
     var arcc = NaN2Zero(parseInt($$('#arcc').val()));
     var arcs = NaN2Zero(parseInt($$('#arcs').val()));
     var comc = NaN2Zero(parseInt($$('#comc').val()));
     var coms = NaN2Zero(parseInt($$('#coms').val()));
     var reuc = NaN2Zero(parseInt($$('#reuc').val()));
     var reus = NaN2Zero(parseInt($$('#reus').val()));

     var cocherac = NaN2Zero(parseInt($$('#cocherac').val()));
     var salamaqc = NaN2Zero(parseInt($$('#salamaqc').val()));
     var salaserc = NaN2Zero(parseInt($$('#salserc').val()));

     var cantgen   =  parseInt(Math.ceil(gens/200))  * parseInt(genc);
     var cantarc   =  parseInt(Math.ceil(arcs/200)) * parseInt(arcc);
     var cantcom   =  parseInt(Math.ceil(coms/200)) * parseInt(comc);
     var cantreu   =  parseInt(Math.ceil(reus/200)) * parseInt(reuc);
     var cantconch =  parseInt(Math.ceil(cocherac/5));
     
     abc5 = parseInt(cantarc) + parseInt(cantcom) + parseInt(cantconch) + parseInt(cantreu);
     co2 = salamaqc;
     halo = parseInt(cantgen) + parseInt(salaserc);

     $$('#gendat').html(cantgen);
     $$('#arcdat').html(cantarc);
     $$('#comdat').html(cantcom);
     $$('#reudat').html(cantreu);
     
     $$('#cocheradat').html(cantconch);
     $$('#maqdat').html(salamaqc);
     $$('#serdat').html(salaserc);
     

     $$('#totalABC').html(abc5);
     $$('#totalCO2').html(co2);
     $$('#totalHalo').html(halo);

     $$('#tomadatos').hide();
     $$('#calculos').show();  
 });
})

$$(document).on('page:init', '.page[data-page="clinica"]', function (e) {
      
  $$('#calculos').hide();

  $$('#btncalclinica').on('click',function(){
     var abc5 = 0;
     var co2 = 0;
     var halo = 0;
     var ak = 0;

     var genc = NaN2Zero(parseInt($$('#genc').val()));
     var gens = NaN2Zero(parseInt($$('#gens').val()));
     
     var admc = NaN2Zero(parseInt($$('#admc').val()));
     var adms = NaN2Zero(parseInt($$('#adms').val()));

     var resc = NaN2Zero(parseInt($$('#resc').val()));
     var ress = NaN2Zero(parseInt($$('#ress').val()));

     var farc = NaN2Zero(parseInt($$('#farc').val()));
     var fars = NaN2Zero(parseInt($$('#fars').val()));

     var infc = NaN2Zero(parseInt($$('#infc').val()));
     var infs = NaN2Zero(parseInt($$('#infs').val()));

     var ropc = NaN2Zero(parseInt($$('#ropc').val()));
     var rops = NaN2Zero(parseInt($$('#rops').val()));      

     var hisc = NaN2Zero(parseInt($$('#hisc').val()));
     var hiss = NaN2Zero(parseInt($$('#hiss').val()));

     var lavc = NaN2Zero(parseInt($$('#lavc').val()));
     var lavs = NaN2Zero(parseInt($$('#lavs').val()));

     var comc = NaN2Zero(parseInt($$('#comc').val()));
     var coms = NaN2Zero(parseInt($$('#coms').val()));

     var reuc = NaN2Zero(parseInt($$('#reuc').val()));
     var reus = NaN2Zero(parseInt($$('#reus').val()));

     var alic = NaN2Zero(parseInt($$('#alic').val()));
     var alis = NaN2Zero(parseInt($$('#alis').val()));

     var cocc  = NaN2Zero(parseInt($$('#cocc').val()));
     var ecomc = NaN2Zero(parseInt($$('#ecomc').val()));
     var cocherac = NaN2Zero(parseInt($$('#cocherac').val()));
     var salamaqc = NaN2Zero(parseInt($$('#salamaqc').val()));
     var salaserc = NaN2Zero(parseInt($$('#salserc').val()));

     var cantgen   =  parseInt(Math.ceil(gens/200))  * parseInt(genc);
     var cantadm   =  parseInt(Math.ceil(adms/200)) * parseInt(admc);
     var cantres   =  parseInt(Math.ceil(ress/200)) * parseInt(resc);
     var cantfar   =  parseInt(Math.ceil(fars/200)) * parseInt(farc);
     var cantinf   =  parseInt(Math.ceil(infs/200)) * parseInt(infc);
     var cantrop   =  parseInt(Math.ceil(rops/200)) * parseInt(ropc);
     var canthis   =  parseInt(Math.ceil(hiss/200)) * parseInt(hisc);
     var cantlav   =  parseInt(Math.ceil(lavs/200)) * parseInt(lavc);
     var cantcom   =  parseInt(Math.ceil(coms/200)) * parseInt(comc);
     var cantreu   =  parseInt(Math.ceil(reus/200)) * parseInt(reuc);
     var cantali   =  parseInt(Math.ceil(alis/200)) * parseInt(alic);
     var cantconch =  parseInt(Math.ceil(cocherac/5));
     
     abc5 = parseInt(cantgen) + parseInt(cantres) + parseInt(cantfar) + parseInt(cantinf) + parseInt(cantrop) + parseInt(canthis) + parseInt(cantlav) + parseInt(cantcom) + parseInt(cantreu)  + parseInt(cantali)  + parseInt(cantconch);
     co2 = salamaqc;
     halo = parseInt(cantadm) + parseInt(ecomc) + parseInt(salaserc);
     ak = parseInt(cocc);

     $$('#gendat').html(cantgen);
     $$('#admdat').html(cantadm);
     $$('#resdat').html(cantres);
     $$('#fardat').html(cantfar);
     $$('#infdat').html(cantinf);
     $$('#ropdat').html(cantrop);
     $$('#hisdat').html(canthis);
     $$('#lavdat').html(cantlav);
     $$('#comdat').html(cantcom);
     $$('#reudat').html(cantreu);
     $$('#alidat').html(cantali);
     $$('#ecomdat').html(ecomc);
     $$('#cocdat').html(cocc);
     
     $$('#cocheradat').html(cantconch);
     $$('#maqdat').html(salamaqc);
     $$('#serdat').html(salaserc);
     

     $$('#totalABC').html(abc5);
     $$('#totalCO2').html(co2);
     $$('#totalHalo').html(halo);
     $$('#totalAK').html(ak);

     $$('#tomadatos').hide();
     $$('#calculos').show();  
 });
})

$$(document).on('page:init', '.page[data-page="teatro"]', function (e) {
      
  $$('#calculos').hide();

  $$('#btncalteatro').on('click',function(){
     var abc5 = 0;
     var co2 = 0;
     var halo = 0;
     var ak = 0;

     var genc = NaN2Zero(parseInt($$('#genc').val()));
     var gens = NaN2Zero(parseInt($$('#gens').val()));
     
     var admc = NaN2Zero(parseInt($$('#admc').val()));
     var adms = NaN2Zero(parseInt($$('#adms').val()));

     var resc = NaN2Zero(parseInt($$('#resc').val()));
     var ress = NaN2Zero(parseInt($$('#ress').val()));

     var farc = NaN2Zero(parseInt($$('#farc').val()));
     var fars = NaN2Zero(parseInt($$('#fars').val()));

     var infc = NaN2Zero(parseInt($$('#infc').val()));
     var infs = NaN2Zero(parseInt($$('#infs').val()));

     var ropc = NaN2Zero(parseInt($$('#ropc').val()));
     var rops = NaN2Zero(parseInt($$('#rops').val()));      

     var hisc = NaN2Zero(parseInt($$('#hisc').val()));
     var hiss = NaN2Zero(parseInt($$('#hiss').val()));

     var cocc  = NaN2Zero(parseInt($$('#cocc').val()));
     var cocherac = NaN2Zero(parseInt($$('#cocherac').val()));
     var salamaqc = NaN2Zero(parseInt($$('#salamaqc').val()));
     
     var cantgen   =  parseInt(Math.ceil(gens/200))  * parseInt(genc);
     var cantadm   =  parseInt(Math.ceil(adms/200)) * parseInt(admc);
     var cantres   =  parseInt(Math.ceil(ress/200)) * parseInt(resc);
     var cantfar   =  parseInt(Math.ceil(fars/200)) * parseInt(farc);
     var cantinf   =  parseInt(Math.ceil(infs/200)) * parseInt(infc);
     var cantrop   =  parseInt(Math.ceil(rops/200)) * parseInt(ropc);
     var canthis   =  parseInt(Math.ceil(hiss/200)) * parseInt(hisc);
     
     var cantconch =  parseInt(Math.ceil(cocherac/5));
     
     abc5 = parseInt(cantgen) + parseInt(cantres) + parseInt(cantfar) + parseInt(cantinf) + parseInt(cantrop) + parseInt(canthis)  + parseInt(cantconch);
     co2 = salamaqc;
     halo = parseInt(cantadm);
     ak = parseInt(cocc);

     $$('#gendat').html(cantgen);
     $$('#admdat').html(cantadm);
     $$('#resdat').html(cantres);
     $$('#fardat').html(cantfar);
     $$('#infdat').html(cantinf);
     $$('#ropdat').html(cantrop);
     $$('#hisdat').html(canthis);
     $$('#cocdat').html(cocc);
     
     $$('#cocheradat').html(cantconch);
     $$('#maqdat').html(salamaqc); 

     $$('#totalABC').html(abc5);
     $$('#totalCO2').html(co2);
     $$('#totalHalo').html(halo);
     $$('#totalAK').html(ak);

     $$('#tomadatos').hide();
     $$('#calculos').show();  
 });
})

$$(document).on('page:init', '.page[data-page="bares"]', function (e) {
      
  $$('#calculos').hide();

  $$('#btncalbares').on('click',function(){ 
     var abc5 = 0;
     var co2 = 0;
     var halo = 0;
     var ak = 0;

     var genc = NaN2Zero(parseInt($$('#genc').val()));
     var gens = NaN2Zero(parseInt($$('#gens').val()));
     
     var admc = NaN2Zero(parseInt($$('#admc').val()));
     var adms = NaN2Zero(parseInt($$('#adms').val()));

     var resc = NaN2Zero(parseInt($$('#resc').val()));
     var ress = NaN2Zero(parseInt($$('#ress').val()));

     var cocc  = NaN2Zero(parseInt($$('#cocc').val()));
     var cocherac = NaN2Zero(parseInt($$('#cocherac').val()));
     var salamaqc = NaN2Zero(parseInt($$('#salamaqc').val()));
     
     var cantgen   =  parseInt(Math.ceil(gens/200))  * parseInt(genc);
     var cantadm   =  parseInt(Math.ceil(adms/200)) * parseInt(admc);
     var cantres   =  parseInt(Math.ceil(ress/200)) * parseInt(resc);
     
     var cantconch =  parseInt(Math.ceil(cocherac/5));
     
     abc5 = parseInt(cantgen) + parseInt(cantadm) + parseInt(cantres) + parseInt(cantconch);
     co2 = salamaqc;
     ak = parseInt(cocc);

     $$('#gendat').html(cantgen);
     $$('#admdat').html(cantadm);
     $$('#resdat').html(cantres);
     $$('#cocdat').html(cocc);
     
     $$('#cocheradat').html(cantconch);
     $$('#maqdat').html(salamaqc); 

     $$('#totalABC').html(abc5);
     $$('#totalCO2').html(co2);
     $$('#totalAK').html(ak);

     $$('#tomadatos').hide();
     $$('#calculos').show();  
 });
})

$$(document).on('page:init', '.page[data-page="colegio"]', function (e) {
      
  $$('#calculos').hide();

  $$('#btncalcolegio').on('click',function(){
     var abc5 = 0;
     var co2 = 0;
     var halo = 0;
     var ak = 0;

     var genc = NaN2Zero(parseInt($$('#genc').val()));
     var gens = NaN2Zero(parseInt($$('#gens').val()));
     
     var admc = NaN2Zero(parseInt($$('#admc').val()));
     var adms = NaN2Zero(parseInt($$('#adms').val()));

     var resc = NaN2Zero(parseInt($$('#resc').val()));
     var ress = NaN2Zero(parseInt($$('#ress').val()));

     var farc = NaN2Zero(parseInt($$('#farc').val()));
     var fars = NaN2Zero(parseInt($$('#fars').val()));

     var infc = NaN2Zero(parseInt($$('#infc').val()));
     var infs = NaN2Zero(parseInt($$('#infs').val()));

     var ropc = NaN2Zero(parseInt($$('#ropc').val()));
     var rops = NaN2Zero(parseInt($$('#rops').val()));      

     var hisc = NaN2Zero(parseInt($$('#hisc').val()));
     var hiss = NaN2Zero(parseInt($$('#hiss').val()));

     var lavc = NaN2Zero(parseInt($$('#lavc').val()));
     var lavs = NaN2Zero(parseInt($$('#lavs').val()));

     var comc = NaN2Zero(parseInt($$('#comc').val()));
     var coms = NaN2Zero(parseInt($$('#coms').val()));

     var cocc  = NaN2Zero(parseInt($$('#cocc').val()));
     var cocherac = NaN2Zero(parseInt($$('#cocherac').val()));
     var salamaqc = NaN2Zero(parseInt($$('#salamaqc').val()));
     
     var cantgen   =  parseInt(Math.ceil(gens/200))  * parseInt(genc);
     var cantadm   =  parseInt(Math.ceil(adms/200)) * parseInt(admc);
     var cantres   =  parseInt(Math.ceil(ress/200)) * parseInt(resc);
     var cantfar   =  parseInt(Math.ceil(fars/200)) * parseInt(farc);
     var cantinf   =  parseInt(Math.ceil(infs/200)) * parseInt(infc);
     var cantrop   =  parseInt(Math.ceil(rops/200)) * parseInt(ropc);
     var canthis   =  parseInt(Math.ceil(hiss/200)) * parseInt(hisc);
     var cantlav   =  parseInt(Math.ceil(lavs/200)) * parseInt(lavc);
     var cantcom   =  parseInt(Math.ceil(coms/200)) * parseInt(comc);
     
     var cantconch =  parseInt(Math.ceil(cocherac/5));
     
     abc5 = parseInt(cantgen) + parseInt(cantadm) + parseInt(cantres) + parseInt(cantfar) + parseInt(cantinf) + parseInt(cantrop) + parseInt(canthis) + parseInt(cantlav)  + parseInt(cantconch);
     co2 = salamaqc;
     halo = parseInt(cantcom);
     ak = parseInt(cocc);

     $$('#gendat').html(cantgen);
     $$('#admdat').html(cantadm);
     $$('#resdat').html(cantres);
     $$('#fardat').html(cantfar);
     $$('#infdat').html(cantinf);
     $$('#ropdat').html(cantrop);
     $$('#hisdat').html(canthis);
     $$('#lavdat').html(cantlav);
     $$('#equdat').html(cantcom);
     
     $$('#cocdat').html(cocc);
     $$('#cocheradat').html(cantconch);
     $$('#maqdat').html(salamaqc);
     

     $$('#totalABC').html(abc5);
     $$('#totalCO2').html(co2);
     $$('#totalHalo').html(halo);
     $$('#totalAK').html(ak);

     $$('#tomadatos').hide();
     $$('#calculos').show();  
 });
})

$$(document).on('page:init', '.page[data-page="comercio"]', function (e) {
      
  $$('#calculos').hide();

  $$('#btncalcomercio').on('click',function(){
     var abc5 = 0;
     var co2 = 0;
     var halo = 0;

     var pisoc = NaN2Zero(parseInt($$('#pisoc').val()));
     var pisos = NaN2Zero(parseInt($$('#pisos').val()));
     var sumc = NaN2Zero(parseInt($$('#sumc').val()));
     var sums = NaN2Zero(parseInt($$('#sums').val()));
     var cocherac = NaN2Zero(parseInt($$('#cocherac').val()));
     var salamaqc = NaN2Zero(parseInt($$('#salamaqc').val()));
     var gasc = NaN2Zero(parseInt($$('#gasc').val()));

     var cantpiso  = parseInt(Math.ceil(pisos/200))  * parseInt(pisoc);
     var cantsum   =  parseInt(Math.ceil(sums/200)) * parseInt(sumc);
     var cantconch = parseInt(Math.ceil(cocherac/5));
     
     abc5 = parseInt(cantpiso) + parseInt(cantsum) + parseInt(cantconch);
     co2 = salamaqc;
     halo = parseInt(gasc);

     $$('#pisodat').html(cantpiso);
     $$('#sumdat').html(cantsum);
     $$('#cochdat').html(cantconch);
     $$('#salamaqdat').html(salamaqc);
     $$('#gasdat').html(gasc);
     $$('#totalABC').html(abc5);
     $$('#totalCO2').html(co2);
     $$('#totalHalo').html(halo);

     $$('#tomadatos').hide();
     $$('#calculos').show();  
 });
})

$$(document).on('page:init', '.page[data-page="checkoutdni"]', function (e) {
            
            $$('.preloader').hide();
            $$('#datos_cliente').hide();
            $$("#datos_cliente")[0].reset();
            
            console.log(dni_cliente)
            $$('#btn_buscacliente').on('click',function(){ 
              var dni_cliente = $$('#buscadni_cliente').val();

              console.log(dni_cliente)
              $$('.preloader').show();
                axios.get('http://www.enodje.ewidux.com/api/tam_clientes/5/'+dni_cliente)
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
                    clienteData.push(myApp.formGetData('datos_cliente'));
                    
//CLIENTE NUEVO SE REALIZA ESTA ACCION
                    if(idCliente == "nuevo"){  
                        
                        axios.post('http://www.enodje.ewidux.com/api/tam_clientes',
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
                                 var listadoPedido = new Array();
                                 pedidosData.forEach(function (elemento, indice, array) {
                                  var itemsPedido = {"tipo": elemento.tipo_prod ,
                                      "cantidad": elemento.cant_prod , "precio": elemento.pf_prod ,
                                      "total":  elemento.cant_prod*elemento.pf_prod ,"id_producto": elemento.id_prod};
                                      listadoPedido.push(itemsPedido);          
                                    });

                                   var pedidos2 = {"cod_empresa": 1,"id_cliente": response.data.id_cliente,
                                      "estado": "0","calle": response.data.calle,"numero": response.data.numero,
                                      "depto": response.data.depto,"piso": response.data.piso,"manzana": response.data.manzana,
                                      "lote": response.data.lote,"cod_localidad": response.data.cod_localidad,
                                      "tar_pedidos_detall": listadoPedido
                                    };   
                                     
                                 axios.post('http://www.enodje.ewidux.com/api/tam_pedidos', pedidos2)
                                  .then(function (response) {
                                    console.log("seha creado el pedido");
                                    console.log(response);
                                    
                                  })
                                  .catch(function (error) {
                                    console.log(error);
                                  });
                                   $$('#btnokpedido').click();
                                   $$("#datos_cliente")[0].reset();
                                   $$('#datos_cliente').hide();
                                   pedidosData.length=0;
                                   $$('#carro_cantidad').html();
                                })
                          .catch(function (error) {
                                myApp.addNotification({
                                  message: 'Hay datos incorrectos',
                                  hold: 1000,
                                  button: {
                                      text: '',
                                      color: 'black',
                                      close: false
                                  }
                              });
                        });
                      }
//SI EL CLIENTE YA EXISTE SE REALIZA ESTA ACCION                      
                      else{ 
                                var listadoPedido = new Array();
                                 pedidosData.forEach(function (elemento, indice, array) {
                                  var itemsPedido = {"tipo": elemento.tipo_prod ,
                                      "cantidad": elemento.cant_prod , "precio": elemento.pf_prod ,
                                      "total":  elemento.cant_prod*elemento.pf_prod ,"id_producto": elemento.id_prod};
                                      listadoPedido.push(itemsPedido);          
                                    });

                                   var pedidos2 = {"cod_empresa": 1,"id_cliente": idCliente,
                                      "estado": "0","calle": clienteData[0].direccion_cliente,"numero": clienteData[0].numero_cliente,
                                      "depto": clienteData[0].dpto_cliente,"piso": clienteData[0].piso_cliente,"manzana": clienteData[0].manzana_cliente,
                                      "lote": clienteData[0].lote_cliente,"cod_localidad": clienteData[0].ciudad_cliente,
                                      "tar_pedidos_detall": listadoPedido
                                    };   
                                     
                                 axios.post('http://www.enodje.ewidux.com/api/tam_pedidos', pedidos2)
                                  .then(function (response) {
                                    console.log("se ha creado el pedido");
                                    console.log(response);
                                    $$("#datos_cliente")[0].reset();
                                    $$('#datos_cliente').hide();
                                    $$('#btnokpedido').click();
                                    pedidosData.length=0;
                                    $$('#carro_cantidad').html();
                                  })
                                  .catch(function (error) {
                                    console.log(error);
                                  });
                      }

                    }
  //SI NO TILDO ACEPTAR QUE LOS DATOS SEAN GUARDADOS                 
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
