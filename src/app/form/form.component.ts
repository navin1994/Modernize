import { Component, signal } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MatChipsModule } from "@angular/material/chips";
import { DiscloseFormComponent } from "../disclosures/disclose-form/disclose-form.component";

export interface User {
  name: string;
}

@Component({
  selector: "app-form-layout",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatChipsModule,
    DiscloseFormComponent
  ],
  templateUrl: "./form.component.html",
})
export class AppFormComponent {
  myControl = new FormControl<string | User>("");
  options = [{ id: 1, name: "Mary" }, { id: 2, name: "Shelley" }, { id: 3, name: "Igor" }];
  filteredOptions: Observable<User[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => {
        const name = typeof value === "string" ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      })
    );
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : "";
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
}
