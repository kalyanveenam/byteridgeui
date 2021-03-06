import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent implements OnInit {
  @Input() isMobile;
  name: string;

  isLoggedIn: boolean;
  constructor(private httpConnect: HttpService, private router: Router) {
    this.isLoggedIn = localStorage.getItem('isLoggedin') == 'true';
    this.name = localStorage.getItem('username');
    this.isMobile = this.isMobile == 'true';
  }

  ngOnInit(): void {
    console.log('coming here')
    this.isLoggedIn = localStorage.getItem('isLoggedin') == 'true';
    this.name = localStorage.getItem('username');
    this.isMobile = this.isMobile == 'true';
  }
  logout() {
    this.httpConnect.logout().subscribe((response) => {
      if (response) {
        console.log(response)
        localStorage.clear();
            this.router.navigate(['/home']);
        this.isLoggedIn = false;
      }
    });
  }
}
