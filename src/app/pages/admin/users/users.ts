import { Component, OnInit, inject, DestroyRef, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { PasswordModule } from "primeng/password";
import { CheckboxModule } from "primeng/checkbox";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { User } from "src/app/services/auth/user";
import { AdminUsers } from "src/app/services/users/admin-users";
import { Toater } from "src/app/services/toater";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DAYS } from "src/app/shared/const";
import { AuthService } from "src/app/services/auth/auth.service";
import { HeaderSection } from "src/app/shared/header-section/header-section";
import { DataTable } from "src/app/shared/data-table/data-table/data-table";
import { Badge } from "src/app/shared/badge/badge";

@Component({
  selector: "app-admin-users",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    PasswordModule,
    CheckboxModule,
    ConfirmDialogModule,
    HeaderSection,
    DataTable,
    Badge
],
  templateUrl: "./users.html",
  styleUrl: "./users.scss",
})
export class AdminUsersComponent implements OnInit {
  // Priv Properties
  private usersServices = inject(AdminUsers);
  private destroyRef = inject(DestroyRef);
  private toasterServices = inject(Toater);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private confirm = inject(ConfirmationService);

  // Data
  users = signal<User[]>([]);
  loading = signal(true);
  showDialog = signal(false);
  saving = signal(false);
  editId = signal<number | null>(null);
  workingDays = signal<number[]>([1, 2, 3, 4, 5]);
  form!: FormGroup;
  days = DAYS;

  ngOnInit(): void {
    this.buildForm();
    this.load();
  }

  // List OF Users
  load(): void {
    this.loading.set(true);
    this.usersServices
      .listUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.users.set(res);
          this.loading.set(false);
        },
      });
  }

  // Form
  buildForm(u?: User): void {
    this.form = this.fb.group({
      fullName: [u?.fullName ?? "", Validators.required],
      email: [
        u?.email ?? "",
        [Validators.required, Validators.email, Validators.minLength(10)],
      ],
      password: [
        this.editId() ? "" : "",
        this.editId() ? [] : [Validators.required, Validators.minLength(6)],
      ],
      targetHoursPerDay: [u?.targetHoursPerDay ?? 8, Validators.required],
      isAdmin: [u?.isAdmin ?? false],
    });

    this.workingDays.set(u ? [...u.workingDays] : [1, 2, 3, 4, 5]);
  }

  isWD(d: number): boolean {
    return this.workingDays().includes(d);
  }

  // Working Days
  toggleWD(d: number): void {
    const current = this.workingDays();
    this.workingDays.set(
      this.isWD(d) ? current.filter((x) => x !== d) : [...current, d].sort(),
    );
  }

  // Dialog Edit
  openEdit(u: User): void {
    this.editId.set(u.id);
    this.buildForm(u);
    this.showDialog.set(true);
  }

  // Dialog Create
  openCreate(): void {
    this.editId.set(null);
    this.buildForm();
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
  }

  // Save User
  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const v = this.form.value;
    const id = this.editId();
    const obs = id
      ? this.usersServices.updateUser(id, {
          fullName: v.fullName,
          email: v.email,
          targetHoursPerDay: v.targetHoursPerDay,
          workingDays: this.workingDays(),
          isAdmin: v.isAdmin,
        })
      : this.usersServices.createUser({
          ...v,
          workingDays: this.workingDays(),
        });

    obs.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.showDialog.set(false);
        this.load();

        // Refresh User Data
        if (id && this.auth.currentUser?.id === id) {
          this.auth
            .refreshUser()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        }
        this.toasterServices.succesToaster(
          id ? "User edited successfully." : "User created successfully.",
        );
      },
    });
  }

  // Delete Confirmation
  confirmDelete(u: User): void {
    this.confirm.confirm({
      message: `Delete ${u.fullName}! Are You Sure To Delete this user?`,
      header: "Delete User",
      icon: "pi pi-exclamation-triangle",
      acceptButtonStyleClass: "p-button-danger",
      accept: () =>
        this.usersServices.deleteUser(u.id).subscribe({
          next: () => {
            this.load();
            this.toasterServices.warToaster("User Deleted Successfully.");
          },
        }),
    });
  }

  dayLabels(days: number[]): string {
    return days.map((d) => DAYS.find((x) => x.v === d)?.label ?? "").join(", ");
  }
}
