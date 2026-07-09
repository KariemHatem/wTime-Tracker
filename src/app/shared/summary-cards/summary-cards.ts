import { Component, input } from "@angular/core";
import { Summary } from "../model";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-summary-cards",
  imports: [TranslatePipe],
  templateUrl: "./summary-cards.html",
  styleUrl: "./summary-cards.scss",
})
export class SummaryCards {
  cards = input.required<Summary[]>();
}
