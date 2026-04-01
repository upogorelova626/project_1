import {Routes} from '@angular/router';
import {LoginPageComponent} from './common-ui/profile-card/pages/login-page/login-page.component';
import {SearchPageComponent} from './common-ui/profile-card/pages/search-page/search-page.component';
import {ProfilePageComponent} from './common-ui/profile-card/pages/profile-page/profile-page.component';
import {LayoutComponent} from './common-ui/layout/layout.component';
import {canActivateAuth} from './auth/access.guard';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {path: '', component: SearchPageComponent},
            {path: 'profile', component: ProfilePageComponent}
        ],
        canActivate: [canActivateAuth]
    },
    {path: 'login', component: LoginPageComponent}
];
