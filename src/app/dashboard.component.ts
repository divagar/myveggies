import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Routes, Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { HomeComponent } from './home.component';
import { Observable } from 'rxjs/RX';
import { map } from 'rxjs/operator/map';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

declare var jQuery: any;

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  providers: [LoginComponent]
})

export class DashboardComponent implements OnInit, AfterViewInit {

  pageTitle: string = "Dashboard";

  fbBlogs: Observable<any[]>;
  fbBlogDetails: FirebaseObjectObservable<any>;
  fbNewBlog: FirebaseListObservable<any>;

  dAlert: boolean;
  dAlertMsg: string;
  dAlertType: string;

  dashboardForm: FormGroup;

  constructor(
    public af: AngularFire,
    public loginUser: LoginComponent,
    public router: Router,
    private home: HomeComponent,
    private titleService: Title,
    private formBuilder: FormBuilder) {

    //Set page title
    this.titleService.setTitle(this.home.appTitle + " | " + this.pageTitle);
    //get af auth status
    af.auth
      .do(v => this.dashboardLogin(v))
      .subscribe(user => this.dashboardLogin(user))

    //dashboard form
    this.dashboardForm = formBuilder.group({
      'Title': new FormControl("", Validators.required),
      'STitle': new FormControl("", Validators.required),
      'Author': new FormControl("", Validators.required),
      'Content': new FormControl("")
    });
  }

  ngOnInit() { }

  ngAfterViewInit() { }

  dashboardLogin(user) {
    //check user credentials
    this.loginUser.userCredentials(user);
    if (this.loginUser.user == null)
      this.router.navigate(['/login']);
    //else
      //Get Blogs
      //this.getBlogs();
  }


  dashboardLogout() {
    this.loginUser.logoutUser();
  }

  dashboardAlert(type, msg, status) {
    this.dAlertType = type;
    this.dAlertMsg = msg;
    this.dAlert = status;
  }

  closeAlert() {
    this.dAlert = false;
  }
}