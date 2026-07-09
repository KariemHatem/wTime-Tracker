import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { MessageModule } from "primeng/message";
import { AuthService } from "../../services/auth/auth.service";
import { Toater } from "src/app/services/toater";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    TranslatePipe,
  ],
  templateUrl: "./login.html",
  styleUrl: "./login.scss",
})
export class LoginComponent implements OnInit {
  // Priv Prop
  private toastServices = inject(Toater);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // Data Source
  form!: FormGroup;
  loading = signal(false);
  error = signal("");

  // Lifecycle
  ngOnInit(): void {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set("");

    // Location

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.performLogin(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          this.toastServices.errorToaster(err.message);
          this.performLogin(null, null);
        },
        { timeout: 5000, enableHighAccuracy: true },
      );
    } else {
      this.performLogin(null, null);
    }
  }

  private performLogin(
    latitude: number | null,
    longitude: number | null,
  ): void {
    const { email, password } = this.form.value;

    this.auth
      .login(email, password, latitude, longitude)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.loading.set(false);
          this.toastServices.succesToaster("Login successful");
          this.router.navigate(["/dashboard"]);
        },

        // Handle Error
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
