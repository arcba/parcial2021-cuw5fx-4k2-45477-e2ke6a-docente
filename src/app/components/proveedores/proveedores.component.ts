
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Articulo } from '../../models/articulo';
import { ArticuloFamilia } from '../../models/articulo-familia';
import { MockArticulosService } from '../../services/mock-articulos.service';
import { MockArticulosFamiliasService } from '../../services/mock-articulos-familias.service';
import { ArticulosFamiliasService } from '../../services/articulos-familias.service';
import { ArticulosService } from '../../services/articulos.service';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { Proveedor } from '../../models/proveedor';
import { ProveedoresService } from '../../services/proveedores.service';


@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  Titulo = 'Proveedores';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)'
  };
  AccionABMC = 'L'; // inicialmente inicia en el listado de articulos (buscar con parametros)
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };

  Items: Proveedor[] = null;
  RegistrosTotal: number;
  
  submitted: boolean = false;

  // opciones del combo activo
  // OpcionesActivo = [
  //   { Id: null, Nombre: '' },
  //   { Id: true, Nombre: 'SI' },
  //   { Id: false, Nombre: 'NO' }
  // ];

  FormBusqueda: FormGroup;
  FormRegistro: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private proveedoresService: ProveedoresService ,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    // this.FormBusqueda = this.formBuilder.group({
    //   Nombre: [null],
    //   Activo: [null]
    // });
    this.FormRegistro = this.formBuilder.group({
      ProveedorId: [0],
      ProveedorRazonSocial: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)]
      ],
      ProveedorCodigo: [
        '',
        [ Validators.required,Validators.min(1),Validators.max(100) ]
      ],
      ProveedorFecha: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ],

    });
  }

 

  Alta() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset({ Activo: true, ProveedorId: 0 });
    this.submitted = false;
    this.FormRegistro.markAsUntouched();
  }

  // Buscar segun los filtros, establecidos en FormRegistro
  Buscar() {
    //this.modalDialogService.BloquearPantalla();
    this.proveedoresService
      .get()
     
      .subscribe((res: any) => {
        this.Items = res;
        
      });
  }

  
 
 
  // grabar tanto altas como modificaciones
  Grabar() {
    this.submitted = true;
    if (this.FormRegistro.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.ProveedorFecha.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.ProveedorFecha = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (this.AccionABMC == 'A') {
      //this.modalDialogService.BloquearPantalla();
      this.proveedoresService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
        //this.modalDialogService.DesbloquearPantalla();
      });
    } else {
      // modificar put
      //this.modalDialogService.BloquearPantalla();
      // this.proveedoresService
      //   .put(itemCopy.IdArticulo, itemCopy)
      //   .subscribe((res: any) => {
      //     this.Volver();
      //     this.modalDialogService.Alert('Registro modificado correctamente.');
      //     this.Buscar();
          //this.modalDialogService.DesbloquearPantalla();
        // });
    }
  }



  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = 'L';
  }

  ImprimirListado() {
    this.modalDialogService.Alert('Sin desarrollar...');
  }
}
