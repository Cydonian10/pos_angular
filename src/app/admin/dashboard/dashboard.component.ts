import { Stadistics } from '@/api/interfaces/dashboard.interface';
import { DashBoardService } from '@/api/services/dashboard.service';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AdminTitleComponent],
  templateUrl: './dashboard.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent implements OnInit {
  private dashboardSrv = inject(DashBoardService);

  public stadistics = signal<Stadistics>({} as Stadistics);

  ngOnInit(): void {
    this.getStadistics();
  }

  getStadistics() {
    this.dashboardSrv.getStadistics().subscribe((resp) => {
      this.stadistics.set(resp);
    });
  }
}
