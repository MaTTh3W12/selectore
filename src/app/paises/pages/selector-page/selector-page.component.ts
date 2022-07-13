import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs/operators'

import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';


@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region  : [ '', Validators.required],
    pais    : [ '', Validators.required],
    frontera: [ '', Validators.required],
    // frontera: [ { value: '', disable: true}, Validators.required],
  })

  //  llenar selectores
  regiones : string[]    = [];
  paiseS   : PaisSmall[] = [];
  // fronteras: string[]    = [];
  fronteras: PaisSmall[] = [];

  // UI
  cargando: boolean = false;


  constructor( private fb: FormBuilder,
               private pService: PaisesService
    ) { }

  ngOnInit(): void {

    this.regiones = this.pService.regiones;

    // Cuando cambie la region
    // Forma larga
    // this.miFormulario.get('region')?.valueChanges
    //       .subscribe( region => {
    //         console.log(region);

    //         this.pService.getPaisesPorRegion( region )
    //             .subscribe( paises => {
    //               console.log(paises);
    //               this.paiseS = paises;
    //             })
    //       })
    this.miFormulario.get('region')?.valueChanges
        .pipe(
          tap( ( _ ) => {
            this.miFormulario.get('pais')?.reset('');
            this.cargando = true;
            // this.miFormulario.get('frontera')?.disable();
          }),
          switchMap( r => this.pService.getPaisesPorRegion( r ) )
        )
        .subscribe( paises => {
          this.paiseS = paises;
          this.cargando = false;
        });
        
        this.miFormulario.get('pais')?.valueChanges
          .pipe(
            tap( ( _ ) => {
              this.miFormulario.get('frontera')?.reset('');
              this.cargando = true;
              // this.miFormulario.get('frontera')?.enable();

            }),
            switchMap( codigo => this.pService.getPaisPorCodigo( codigo )),
            switchMap( pais => this.pService.getPaisesPorCodigos( pais?.borders! ))
          )
          .subscribe( paises => {
            // this.fronteras = pais?.borders || [];
            this.fronteras = paises;
            this.cargando = false;
        });

   }
   

  guardar() {
    console.log(this.miFormulario.value)
  }

}
