import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {SvgIconComponent} from '../svg-icon/svg-icon.component';
import {ProfileService} from '../../data/services/profile.service';
import {AsyncPipe, JsonPipe} from '@angular/common';
import {SubscriberCardComponent} from './subscriber-card/subscriber-card.component';
import {firstValueFrom} from 'rxjs';
import {ImgUrlPipe} from '../../helpers/pipes/img-url.pipe';

@Component({
    selector: 'app-sidebar',
    imports: [
        RouterLink,
        SvgIconComponent,
        AsyncPipe,
        SubscriberCardComponent,
        ImgUrlPipe
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.less'
})
export class SidebarComponent {
    profileService = inject(ProfileService);

    subscribers$ = this.profileService.getSubscribersShortList();

    me = this.profileService.me;

    menuItems = [
        {
            label: 'Моя страница',
            icon: 'home',
            link: ''
        },
        {
            label: 'Чаты',
            icon: 'chat',
            link: 'chat'
        },
        {
            label: 'Поиск',
            icon: 'search',
            link: 'search'
        }
    ];

    ngOnInit() {
        firstValueFrom(this.profileService.getMe());
    }
}
