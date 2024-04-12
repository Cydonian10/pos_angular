import { UserStore } from '@/core/store/user.store';
import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './profile.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfileComponent {
  readonly userStore = inject(UserStore);
}
