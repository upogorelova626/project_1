import {Component, inject} from '@angular/core';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {RouterOutlet} from '@angular/router';
import {ProfileService} from '../../data/services/profile.service';

@Component({
    selector: 'app-layout',
    imports: [RouterOutlet, SidebarComponent],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.less'
})
export class LayoutComponent {}
