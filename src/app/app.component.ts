import { Component, OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: []
})
export class AppComponent implements OnInit, OnDestroy {
  names = ["Suzy", "Paul", "Laura", "Arnold", "Georgette"];
  nameIndex = 0;
  count = 0;

  private nameInterval?: number;
  private countInterval?: number;

  ngOnInit() {
    this.countInterval = setInterval(() => {
      this.count += 1;
    }, 1500);

    this.nameInterval = setInterval(() => {
      this.nameIndex = (this.nameIndex + 1) % this.names.length;
    }, 4000);
  }

  ngOnDestroy() {
    if (this.countInterval) clearInterval(this.countInterval);
    if (this.nameInterval) clearInterval(this.nameInterval);
  }
}
