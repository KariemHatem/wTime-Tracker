import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
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
import { AuthService } from "../../services/auth/auth.service";
import { Users } from "src/app/services/profile/users";
import { DAYS } from "src/app/shared/const";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Toater } from "src/app/services/toater";
import { UserInfo } from "./user-info/user-info";
import { HeaderSection } from "src/app/shared/header-section/header-section";
import { TranslatePipe } from "@ngx-translate/core";
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
    UserInfo,
    HeaderSection,
    TranslatePipe,
  ],
  providers: [MessageService],
  templateUrl: "./settings.html",
  styleUrl: "./settings.scss",
})
export class SettingsComponent implements OnInit {
  // Priv Properties
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private profile = inject(Users);
  private detroyref = inject(DestroyRef);
  private toasterServices = inject(Toater);

  // private msg: MessageService,

  // Data
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  savingProfile = signal(false);
  savingPassword = signal(false);
  passwordError = signal("");
  days = DAYS;
  workingDays = signal<number[]>([]);

  get user() {
    return this.authService.currentUser;
  }

  ngOnInit(): void {
    this.profileBuild();
  }

  profileBuild() {
    const u = this.user!;
    this.workingDays.set([...(u.workingDays ?? [])]);
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
    return this.workingDays().includes(d);
  }

  toggleDay(d: number): void {
    this.workingDays.update((days) =>
      days.includes(d)
        ? days.filter((x) => x !== d)
        : [...days, d].sort((a, b) => a - b),
    );
  }

  // Refresh User
  refreshUser(): void {
    this.authService
      .refreshUser()
      .pipe(takeUntilDestroyed(this.detroyref))
      .subscribe();
  }

  // Save Profile
  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.savingProfile.set(true);
    this.profile
      .updateProfile({
        ...this.profileForm.value,
        workingDays: this.workingDays,
      })
      .pipe(takeUntilDestroyed(this.detroyref))
      .subscribe({
        next: () => {
          this.savingProfile.set(false);
          this.toasterServices.succesToaster("Profile Updated Successfully.");
        },
        error: () => {
          this.savingProfile.set(false);
        },
      });
  }

  savePassword(): void {
    this.passwordError.set("");
    const { currentPassword, newPassword, confirmPassword } =
      this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.passwordError.set("SETTINGS.ERRORS.PASSWORDS_DO_NOT_MATCH");
      return;
    }
    this.savingPassword.set(true);
    this.profile
      .updateProfile({ currentPassword, newPassword })
      .pipe(takeUntilDestroyed(this.detroyref))
      .subscribe({
        next: () => {
          this.savingPassword.set(false);
          this.passwordForm.reset();
          this.toasterServices.succesToaster("Password Updated Successfully.");
        },
        error: (e) => {
          this.savingPassword.set(false);
          this.toasterServices.warToaster("Failed to update password.");
        },
      });
  }
}
