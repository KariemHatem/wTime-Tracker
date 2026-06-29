import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Subscription } from "rxjs";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { PasswordModule } from "primeng/password";
import { CheckboxModule } from "primeng/checkbox";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { MessageService, ConfirmationService } from "primeng/api";
import { ApiService } from "../../../services/api.service";
import { User } from "src/app/services/auth/user";

const DAYS = [
  { label: "Sun", v: 0 },
  { label: "Mon", v: 1 },
  { label: "Tue", v: 2 },
  { label: "Wed", v: 3 },
  { label: "Thu", v: 4 },
  { label: "Fri", v: 5 },
  { label: "Sat", v: 6 },
];

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
  ],
  templateUrl: "./users.html",
  styleUrl: "./users.scss",
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading = true;
  showDialog = false;
  editId: number | null = null;
  form!: FormGroup;
  saving = false;
  workingDays: number[] = [1, 2, 3, 4, 5];
  days = DAYS;
  private subs = new Subscription();

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private msg: MessageService,
    private confirm: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.load();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  load(): void {
    this.loading = true;
    this.subs.add(
      this.api.listUsers().subscribe({
        next: (u) => {
          this.users = u;
          this.loading = false;
        },
        error: () => (this.loading = false),
      }),
    );
  }

  buildForm(u?: User): void {
    this.form = this.fb.group({
      fullName: [u?.fullName ?? "", Validators.required],
      email: [u?.email ?? "", [Validators.required, Validators.email]],
      password: [
        this.editId ? "" : "",
        this.editId ? [] : [Validators.required, Validators.minLength(6)],
      ],
      targetHoursPerDay: [u?.targetHoursPerDay ?? 8, Validators.required],
      isAdmin: [u?.isAdmin ?? false],
    });

    this.workingDays = u ? [...u.workingDays] : [1, 2, 3, 4, 5];
  }

  openCreate(): void {
    this.editId = null;
    this.buildForm();
    this.showDialog = true;
  }
  openEdit(u: User): void {
    this.editId = u.id;
    this.buildForm(u);
    this.showDialog = true;
  }
  closeDialog(): void {
    this.showDialog = false;
  }

  isWD(d: number): boolean {
    return this.workingDays.includes(d);
  }
  toggleWD(d: number): void {
    this.workingDays = this.isWD(d)
      ? this.workingDays.filter((x) => x !== d)
      : [...this.workingDays, d].sort();
  }

  save(): void {
    console.log(this.form.value);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const v = this.form.value;
    const obs = this.editId
      ? this.api.updateUser(this.editId, {
          fullName: v.fullName,
          email: v.email,
          targetHoursPerDay: v.targetHoursPerDay,
          workingDays: this.workingDays,
          isAdmin: v.isAdmin,
        })
      : this.api.createUser({ ...v, workingDays: this.workingDays });

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.showDialog = false;
        this.load();
        this.msg.add({
          severity: "success",
          summary: "Saved",
          detail: "User saved.",
        });
      },
      error: (e) => {
        this.saving = false;
        this.msg.add({
          severity: "error",
          summary: "Error",
          detail: e?.error?.message || "Failed to save.",
        });
      },
    });
  }

  confirmDelete(u: User): void {
    this.confirm.confirm({
      message: `Delete ${u.fullName}? This cannot be undone.`,
      header: "Delete User",
      icon: "pi pi-exclamation-triangle",
      acceptButtonStyleClass: "p-button-danger",
      accept: () =>
        this.api.deleteUser(u.id).subscribe({
          next: () => {
            this.load();
            this.msg.add({
              severity: "success",
              summary: "Deleted",
              detail: "User deleted.",
            });
          },
          error: () => {},
        }),
    });
  }

  dayLabels(days: number[]): string {
    return days.map((d) => DAYS.find((x) => x.v === d)?.label ?? "").join(", ");
  }
}
