import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { User } from '../models/user.model';
import { JwtService } from '../services/jwt.service';
import { AppConfig } from '../app.config';

@Injectable()
export class UserService {

  constructor(
      private http: Http,
      private appConfig: AppConfig,
      private jwtService: JwtService) {}

  create(user: User) {
    return this.http.post(this.appConfig.urlServer + '/auth/signup', user)
        .map((res: Response) => res.json())
  }

  getUser() {
    const headers = new Headers();
    headers.append('Authorization', 'Token ' + this.jwtService.getToken());

    return this.http.get(this.appConfig.urlServer + '/users', { headers: headers })
        .map((res: Response) => res.json());
  }

}
