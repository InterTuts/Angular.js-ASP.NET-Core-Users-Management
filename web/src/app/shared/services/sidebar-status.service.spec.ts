// System Utils
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// App Utils
import { SidebarStatusService } from './sidebar-status.service';

// Test the SidebarStatusService service
describe('SidebarStatusService', () => {
  let service: SidebarStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        SidebarStatusService
      ]
    });
    service = TestBed.inject(SidebarStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
