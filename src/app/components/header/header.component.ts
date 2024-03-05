import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  userAuthenticated: boolean = true
  username: any = ''

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.update()
  }

  update() {
    this.userAuthenticated = this.auth.isAuthenticated()
    this.username = this.auth.getUsername()
  }

  navLogout() {
    this.auth.logout()
    this.router.navigateByUrl('/login')
    this.update()
  }
  
}
