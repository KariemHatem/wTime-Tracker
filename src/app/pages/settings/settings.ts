import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { PasswordModule } from "primeng/password";
import { CheckboxModule } from "primeng/checkbox";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { AuthService } from "../../services/auth.service";

const DAYS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    PasswordModule,
    CheckboxModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: "./settings.html",
  styleUrl: "./settings.scss",
})
export class SettingsComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  savingProfile = false;
  savingPassword = false;
  passwordError = "";
  days = DAYS;
  workingDays: number[] = [];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private msg: MessageService,
  ) {}

  get user() {
    return this.auth.currentUser;
  }

  ngOnInit(): void {
    const u = this.user!;
    this.workingDays = [...(u.workingDays ?? [])];
    this.profileForm = this.fb.group({
      fullName: [u.fullName, Validators.required],
      email: [u.email, [Validators.required, Validators.email]],
      targetHoursPerDay: [
        u.targetHoursPerDay,
        [Validators.required, Validators.min(1)],
      ],
    });
    this.passwordForm = this.fb.group({
      currentPassword: ["", Validators.required],
      newPassword: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required],
    });
  }

  isWorkingDay(d: number): boolean {
    return this.workingDays.includes(d);
  }
  toggleDay(d: number): void {
    this.workingDays = this.workingDays.includes(d)
      ? this.workingDays.filter((x) => x !== d)
      : [...this.workingDays, d].sort();
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.savingProfile = true;
    this.auth
      .updateProfile({
        ...this.profileForm.value,
        workingDays: this.workingDays,
      })
      .subscribe({
        next: () => {
          this.savingProfile = false;
          this.msg.add({
            severity: "success",
            summary: "Saved",
            detail: "Profile updated.",
          });
        },
        error: () => {
          this.savingProfile = false;
          this.msg.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to save.",
          });
        },
      });
  }

  savePassword(): void {
    this.passwordError = "";
    const { currentPassword, newPassword, confirmPassword } =
      this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.passwordError = "Passwords do not match.";
      return;
    }
    this.savingPassword = true;
    this.auth.updateProfile({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.savingPassword = false;
        this.passwordForm.reset();
        this.msg.add({
          severity: "success",
          summary: "Updated",
          detail: "Password changed.",
        });
      },
      error: (e) => {
        this.savingPassword = false;
        this.passwordError = e?.error?.message || "Failed to update password.";
      },
    });
  }
}
