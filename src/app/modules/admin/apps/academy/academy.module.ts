import { contactsRoutes } from './../contacts/contacts.routing';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { academyRoutes } from 'app/modules/admin/apps/academy/academy.routing';
import { AcademyComponent } from 'app/modules/admin/apps/academy/academy.component';
import { AcademyDetailsComponent } from 'app/modules/admin/apps/academy/details/details.component';
import { AcademyListComponent } from 'app/modules/admin/apps/academy/list/list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
    declarations: [
        AcademyComponent,
        AcademyDetailsComponent,
        AcademyListComponent
    ],
    imports: [
        RouterModule.forChild(academyRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatTooltipModule,
        FuseFindByKeyPipeModule,
        SharedModule,
        MatTabsModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatRadioModule,
        MatDividerModule
    ]
})
export class AcademyModule
{
}
