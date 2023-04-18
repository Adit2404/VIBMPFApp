import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'experience',
        data: { pageTitle: 'vibmpfApp.experience.home.title' },
        loadChildren: () => import('./experience/experience.module').then(m => m.ExperienceModule),
      },
      {
        path: 'vacancy',
        data: { pageTitle: 'vibmpfApp.vacancy.home.title' },
        loadChildren: () => import('./vacancy/vacancy.module').then(m => m.VacancyModule),
      },
      {
        path: 'company',
        data: { pageTitle: 'vibmpfApp.company.home.title' },
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule),
      },
      {
        path: 'education',
        data: { pageTitle: 'vibmpfApp.education.home.title' },
        loadChildren: () => import('./education/education.module').then(m => m.EducationModule),
      },
      {
        path: 'candidate',
        data: { pageTitle: 'vibmpfApp.candidate.home.title' },
        loadChildren: () => import('./candidate/candidate.module').then(m => m.CandidateModule),
      },
      {
        path: 'company-user',
        data: { pageTitle: 'vibmpfApp.companyUser.home.title' },
        loadChildren: () => import('./company-user/company-user.module').then(m => m.CompanyUserModule),
      },
      {
        path: 'ats-user',
        data: { pageTitle: 'vibmpfApp.atsUser.home.title' },
        loadChildren: () => import('./ats-user/ats-user.module').then(m => m.AtsUserModule),
      },
      {
        path: 'company-application-status',
        data: { pageTitle: 'vibmpfApp.companyApplicationStatus.home.title' },
        loadChildren: () =>
          import('./company-application-status/company-application-status.module').then(m => m.CompanyApplicationStatusModule),
      },
      {
        path: 'ats-application',
        data: { pageTitle: 'vibmpfApp.atsApplication.home.title' },
        loadChildren: () => import('./ats-application/ats-application.module').then(m => m.AtsApplicationModule),
      },
      {
        path: 'remark',
        data: { pageTitle: 'vibmpfApp.remark.home.title' },
        loadChildren: () => import('./remark/remark.module').then(m => m.RemarkModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
