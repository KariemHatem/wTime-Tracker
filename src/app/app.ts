import { Component, HostListener } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { enviromentProd } from "src/enviroments/enviroment.prod";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class AppComponent {
  @HostListener("contextmenu", ["$event"])
  onRightClick(event: MouseEvent) {
    if (enviromentProd.production) {
      event.preventDefault();
    }
  }

  @HostListener("document:keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    const isF12 = event.keyCode === 123 || event.key === "F12";

    const isDevToolsShortcut =
      event.ctrlKey &&
      event.shiftKey &&
      (event.key === "I" ||
        event.key === "J" ||
        event.key === "C" ||
        event.key === "i" ||
        event.key === "j" ||
        event.key === "c");

    const isViewSource =
      event.ctrlKey && (event.key === "U" || event.key === "u");

    if (
      (isF12 || isDevToolsShortcut || isViewSource) &&
      enviromentProd.production
    ) {
      event.preventDefault();
    }
  }
}
