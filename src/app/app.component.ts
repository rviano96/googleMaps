import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { element } from 'protractor';
import { GoogleMap } from '@angular/google-maps';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {


  displayedColumns: string[] = ['latitud', 'longitud'];

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

  lat;
  lng;
  markers: any[];
  zoom;
  center: google.maps.LatLngLiteral
  title = 'Prueba tecnica Sytex';
  bounds = new google.maps.LatLngBounds();
  coordsGroup: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.markers = []
  }
  ngOnInit() {
    this.coordsGroup = this.formBuilder.group({
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
    });

  }

  ngAfterViewInit(): void {
    this.getCurrentPosition();
  }
  /**
   * Agrega un nuevo marcador a la lista de marcadores
   * @param lat : Parametro con la latitud, es opcional
   * @param lng : Parametro con la longitud, es opcional
   */
  addMarker(lat?: any, lng?: any) {

    let obj;
    if (lat != null && lng != null) {
      obj = { lat: lat, lng: lng };
    } else {
      if (this.coordsGroup.invalid) {
        console.log("invalid");
        return;
      }
      obj = { lat: this.coordsGroup.value.lat, lng: this.coordsGroup.value.lng };
      this.clearInputs();
    }

    this.markers.push(obj);
    this.centerView()
  }
  /**
   * Limpia los inputs
   */
  private clearInputs() {
    this.coordsGroup.reset()
  }
  /**
   * Obtiene la posicion actual y centra el mapa
   */
  private getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      for (let i = 0; i < 3; i++) {
        this.addMarker(this.center.lat + ((Math.random() - 0.5) * 2) / 10, this.center.lng + ((Math.random() - 0.5) * 2) / 10)
      }
    })

  }
  /**
   * Centra la vista del mapa teniendo en cuenta los marcadores
   */
  private centerView() {
    this.zoom = 10;
    for (let i = 0; i < this.markers.length; i++) {
      let loc = new google.maps.LatLng(this.markers[i].lat, this.markers[i].lng);
      this.bounds.extend(loc);

    }
    this.map.fitBounds(this.bounds); //auto - zoom
    this.map.panToBounds(this.bounds); //auto - center
  }
  removeMarker(index) {

    let aux = this.markers;
    this.markers = []
    for (let i = 0; i < aux.length; i++) {
      if (i != index) {
        this.markers.push(aux[i]);
      }
    }

    this.centerView();
  }
  // convenience getter for easy access to form fields
  get f() { return this.coordsGroup.controls; }




}
