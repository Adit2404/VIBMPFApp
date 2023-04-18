import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CompanyUserFormService, CompanyUserFormGroup } from './company-user-form.service';
import { ICompanyUser } from '../company-user.model';
import { CompanyUserService } from '../service/company-user.service';
import { IAtsUser } from 'app/entities/ats-user/ats-user.model';
import { AtsUserService } from 'app/entities/ats-user/service/ats-user.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';

@Component({
  selector: 'jhi-company-user-update',
  templateUrl: './company-user-update.component.html',
})
export class CompanyUserUpdateComponent implements OnInit {
  isSaving = false;
  companyUser: ICompanyUser | null = null;

  atsUsersCollection: IAtsUser[] = [];
  companiesSharedCollection: ICompany[] = [];

  editForm: CompanyUserFormGroup = this.companyUserFormService.createCompanyUserFormGroup();

  constructor(
    protected companyUserService: CompanyUserService,
    protected companyUserFormService: CompanyUserFormService,
    protected atsUserService: AtsUserService,
    protected companyService: CompanyService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAtsUser = (o1: IAtsUser | null, o2: IAtsUser | null): boolean => this.atsUserService.compareAtsUser(o1, o2);

  compareCompany = (o1: ICompany | null, o2: ICompany | null): boolean => this.companyService.compareCompany(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ companyUser }) => {
      this.companyUser = companyUser;
      if (companyUser) {
        this.updateForm(companyUser);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const companyUser = this.companyUserFormService.getCompanyUser(this.editForm);
    if (companyUser.id !== null) {
      this.subscribeToSaveResponse(this.companyUserService.update(companyUser));
    } else {
      this.subscribeToSaveResponse(this.companyUserService.create(companyUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompanyUser>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(companyUser: ICompanyUser): void {
    this.companyUser = companyUser;
    this.companyUserFormService.resetForm(this.editForm, companyUser);

    this.atsUsersCollection = this.atsUserService.addAtsUserToCollectionIfMissing<IAtsUser>(this.atsUsersCollection, companyUser.atsUser);
    this.companiesSharedCollection = this.companyService.addCompanyToCollectionIfMissing<ICompany>(
      this.companiesSharedCollection,
      companyUser.company
    );
  }

  protected loadRelationshipsOptions(): void {
    this.atsUserService
      .query({ filter: 'companyuser-is-null' })
      .pipe(map((res: HttpResponse<IAtsUser[]>) => res.body ?? []))
      .pipe(
        map((atsUsers: IAtsUser[]) => this.atsUserService.addAtsUserToCollectionIfMissing<IAtsUser>(atsUsers, this.companyUser?.atsUser))
      )
      .subscribe((atsUsers: IAtsUser[]) => (this.atsUsersCollection = atsUsers));

    this.companyService
      .query()
      .pipe(map((res: HttpResponse<ICompany[]>) => res.body ?? []))
      .pipe(
        map((companies: ICompany[]) => this.companyService.addCompanyToCollectionIfMissing<ICompany>(companies, this.companyUser?.company))
      )
      .subscribe((companies: ICompany[]) => (this.companiesSharedCollection = companies));
  }
}
