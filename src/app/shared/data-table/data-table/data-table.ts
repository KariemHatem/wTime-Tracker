import { Component, input, contentChild, TemplateRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";

@Component({
  selector: "app-data-table",
  imports: [CommonModule, TableModule],
  templateUrl: "./data-table.html",
  styleUrl: "./data-table.css",
})
export class DataTable<T> {
  value = input.required<T[]>();
  loading = input<boolean>(false);
  emptyMessage = input<string>("");
  colspan = input(5);

  headerTpl = contentChild<TemplateRef<any>>("header");
  bodyTpl = contentChild<TemplateRef<any>>("body");
}
