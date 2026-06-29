import { inject, Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
  providedIn: "root",
})
export class Toater {
  private messageService = inject(MessageService);

  succesToaster(message: string) {
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: message,
      life:4000,
    });
  }

  errorToaster(message:string){
    this.messageService.add({
      severity: "error",
      summary: "Error",
      detail: message,
      life:4000,
    });
  }

  warToaster(message:string){
    this.messageService.add({
      severity: "warn",
      summary: "Warning",
      detail: message,
      life:4000,
    });
  }

   infoToaster(message: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: message,
      life: 4000,
    });
  }
}
