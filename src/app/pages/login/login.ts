import { Component, inject } from "@angular/core";
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
  ],
  templateUrl: "./login.html",
  styleUrl: "./login.scss",
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = "";

  private toast = inject(Toater);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = "";
    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next: (res: any) => {
        this.toast.succesToaster("Login successful");
        this.router.navigate(["/dashboard"]);
      },
      error: () => {
        this.error = "Invalid credentials.";
        this.toast.errorToaster("Invalid credentials");
        this.loading = false;
      },
    });
  }
}
