import { Component, effect, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isDark = new FormControl(false, {
    nonNullable: true,
  });

  theme = signal('mydark');

  constructor() {
    const theme = localStorage.getItem('theme');

    if (theme == 'mydark') {
      this.isDark.setValue(true);
      this.theme.set('mydark');
      document.documentElement.setAttribute('data-theme', this.theme());
    } else {
      this.theme.set('cupcake');
      document.documentElement.setAttribute('data-theme', this.theme());
    }

    effect(() => {
      localStorage.setItem('theme', this.theme());
    });

    this.isDark.valueChanges.subscribe((value) => {
      if (value) {
        this.theme.set('mydark');
        document.documentElement.setAttribute('data-theme', this.theme());
      } else {
        this.theme.set('cupcake');
        document.documentElement.setAttribute('data-theme', this.theme());
      }
    });
  }
}
