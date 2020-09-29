import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormControl
} from '@angular/forms';
import {
  Validators
} from '@angular/forms';
import {
  HttpService
} from 'src/app/http.service';
import {
  Router
} from '@angular/router';
import {
  NgxSpinnerService
} from "ngx-spinner";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public isValidCredentials: boolean = false;
  public userNotFound;
  public isFp: boolean;
  panelOpenState = false;
  constructor(private http: HttpService, private router: Router, private spinner: NgxSpinnerService) {
    this.isFp = false;

  }
  get emailControl() {
    return this.loginForm.get('email')
  }
  get passwordControl() {
    return this.loginForm.get('password')
  }
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*\\d).{8,}$')
    ])
  });
  public email;
  onSubmit = () => {
    if (!this.isFp) {
      localStorage.setItem('isLoggedin', 'true');
      this.spinner.show();
      let value = this.loginForm.value;
      var currentTime = new Date();
var currentOffset = currentTime.getTimezoneOffset();
var ISTOffset = 330;   
var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
var hoursIST = ISTTime.getHours()
var minutesIST = ISTTime.getMinutes()
let Time=`${hoursIST}:${minutesIST} IST`
console.log(Time);
      this.http.signin(value.email, value.password).subscribe(
        (result) => {
          localStorage.setItem('authToken', result['data']['token']['token'])
          localStorage.setItem('id', result['data']['userDetails']['_id'])
          localStorage.setItem('name', result['data']['userDetails']['name'])

          this.http.loguserDetails(result['data']['userDetails']['name'],"Auditor",Time).subscribe((result)=>{
          localStorage.setItem('sessionId',result['data']['_id']);
          })

          this.spinner.hide();
          this.router.navigate(['/list'])

        },
        (error) => {
          this.spinner.hide();
          this.userNotFound = error.error.error.data;

          this.isValidCredentials = true;
        }
      )


    } else {
      this.http.forgotPassword(this.loginForm.value.email).subscribe(
        (response) => {
          if ((response['status'] = '200')) {
            this.spinner.hide();

            this.router.navigate(['user']);
            this.isFp = false;
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }
  ngOnInit(): void {
    if (localStorage.getItem('isLoggedin') == 'true') {
      this.router.navigate(['dashboard']);
    }
    this.isFp = false;
  }
  public forgotPassword() {
    this.isFp = true;
  }

  public fpHandler() {

  }
}
