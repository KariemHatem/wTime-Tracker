import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TimerTapVisibilty {
  private originalTitle = document.title;

  updateTitle(text: string): void {
    document.title = text;
  }

  stop(): void {
    document.title = this.originalTitle;
  }
}
