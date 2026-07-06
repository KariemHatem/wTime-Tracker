import { Component, input } from "@angular/core";
import { Summary } from "../model";

@Component({
  selector: "app-summary-cards",
  imports: [],
  templateUrl: "./summary-cards.html",
  styleUrl: "./summary-cards.scss",
})
export class SummaryCards {
  cards = input.required<Summary[]>();
}
