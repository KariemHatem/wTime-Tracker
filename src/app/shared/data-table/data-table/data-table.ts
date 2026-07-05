import {
  Component,
  input,
  contentChild,
  TemplateRef,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { PaginatorState } from "primeng/paginator";

@Component({
  selector: "app-data-table",
  imports: [CommonModule, TableModule],
  templateUrl: "./data-table.html",
  styleUrl: "./data-table.css",
})
export class DataTable<T> {
  // Table Inputs
  value = input.required<T[]>();
  loading = input<boolean>(false);
  emptyMessage = input<string>("");
  colspan = input(5);

  // Pagination Inputs
  paginated = input<boolean>(false);
  pageSize = signal<number>(10);
  pageNumber = signal<number>(0);
  showCurrentPageReport = input<boolean>(true);
  rowsPerPageOptions = input<number[]>([5, 10, 25, 50]);

  onPageChange(event: PaginatorState) {
    this.pageSize.set(event.rows ?? this.pageSize());
    this.pageNumber.set(event.first ?? 0);
  }

  headerTpl = contentChild<TemplateRef<any>>("header");
  bodyTpl = contentChild<TemplateRef<any>>("body");
}
