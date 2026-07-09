import {
  Component,
  OnChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
  input,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import * as L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

@Component({
  selector: "app-location",
  imports: [TranslatePipe],
  templateUrl: "./location.html",
  styleUrl: "./location.scss",
})
export class Location implements OnChanges, AfterViewInit {
  latitude = input<number>(0);
  longitude = input<number>(0);
  city = input<string | null>();
  country = input<string | null>();
  address = input<string | null>();

  @ViewChild("mapContainer") mapContainer!: ElementRef;
  private map?: L.Map;
  private marker?: L.Marker;

  ngAfterViewInit(): void {
    this.initMap();
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 200);
  }

  ngOnChanges(): void {
    this.updateMap();
  }

  private initMap(): void {
    // Initialize map with a default center
    this.map = L.map(this.mapContainer.nativeElement).setView(
      [this.latitude(), this.longitude()],
      12,
    );

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(this.map);
    this.marker = L.marker([this.latitude(), this.longitude()]).addTo(this.map);
  }

  private updateMap() {
    const pos: L.LatLngExpression = [this.latitude(), this.longitude()];
    this.marker?.setLatLng(pos);
    this.map?.setView(pos, 12);
  }
}
