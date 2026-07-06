import { Component, input } from "@angular/core";

@Component({
  selector: "app-badge",
  imports: [],
  templateUrl: "./badge.html",
  styleUrl: "./badge.scss",
})
export class Badge {
  background = input.required<string>();
  color = input.required<string>();
  label = input.required<string>();
}
