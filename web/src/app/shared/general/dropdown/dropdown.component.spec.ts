// System Utils
import { RouterModule } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Installed Utils
import { TranslateModule } from '@ngx-translate/core';

// App Utils
import { DropdownComponent } from './dropdown.component';

// Test the DropDown component
describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        DropdownComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should render all elements', () => {
    expect(fixture.nativeElement.querySelector('.dropdown')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.dropdown > .button')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.dropdown > .button > div')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.dropdown > .button > app-icon')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.dropdown > .dropdown-menu')).toBeTruthy();
  });

  it('it should display correctly the menu items', () => {

    component.dropdownItems = [
      {
        type: 'link',
        text: 'Settings',
        url: '/admin/settings'
      },
      {
        type: 'link',
        text: 'Sign Out',
        url: '/auth/logout'
      }
    ];
    fixture.detectChanges();
    const itemsElements = fixture.nativeElement.querySelectorAll('.dropdown-menu li');
    expect(itemsElements.length).toBe(2);

  });

  it('it should display correctly the no results found', () => {

    component.dropdownItems = [];
    fixture.detectChanges();
    const itemsElements = fixture.nativeElement.querySelectorAll('.dropdown-menu p');
    expect(itemsElements.length).toBe(1);

  });

});
