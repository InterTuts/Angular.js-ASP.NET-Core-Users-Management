// System Utils
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { of } from 'rxjs';

// App Utils
import { UsersService } from './users.service';
import { CreateUser, User } from '../shared/models/user.model';
import ApiResponse from '../shared/models/api-response.model';
import { environment } from '../../environment';
import List from '../shared/models/list.model';

describe('UsersService', () => {
  let service: UsersService;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(UsersService);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new user', (done) => {

    const mockUser: CreateUser = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      password: '12345678'
    };

    const mockApiResponse: ApiResponse<null> = {
      content: null,
      success: true,
      message: ''
    };

    spyOn(httpClient, 'post').and.returnValue(of(mockApiResponse));

    service.createUser(mockUser).subscribe(response => {
      expect(httpClient.post).toHaveBeenCalledWith(`${environment.apiUrl}api/v1.0/admin/users/create`, mockUser);
      expect(response).toEqual(mockApiResponse);
      done();
    });

  });

  it('getUsers should update userListSubject with the response on successful HTTP request', () => {
    const mockApiResponse: List<User[]> = {
      items: [{
        id: 1,
        role: 0,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: '12345678',
        date_joined: '',
        token: '',
        phone: '',
        sidebar: false
      }],
      page: 1,
      total: 1
    };

    service.getUsers(1, 'test');

    const req = httpMock.expectOne(`${environment.apiUrl}api/v1.0/admin/users/list?page=1&search=test`);

    expect(req.request.method).toBe('GET');

    req.flush(mockApiResponse);

    service.usersList.subscribe((users) => {
      expect(users).toEqual(mockApiResponse);
    });

  });

  it('should delete a user', (done) => {

    const mockApiResponse: ApiResponse<null> = {
      content: null,
      success: true,
      message: ''
    };

    spyOn(httpClient, 'delete').and.returnValue(of(mockApiResponse));

    service.deleteUser(2).subscribe(response => {
      expect(httpClient.delete).toHaveBeenCalledWith(`${environment.apiUrl}api/v1.0/admin/users/2/delete`);
      expect(response).toEqual(mockApiResponse);
      done();
    });

  });

});
