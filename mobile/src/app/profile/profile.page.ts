import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit {
  private querySuscription: Subscription;
  private userQuery: QueryRef < any > ;

  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }

  constructor(private apollo: Apollo, private router: Router) {
    this.user = {
      id: '',
      firstName: '',
      lastName: '',
      email: ''
    };
    this.querySuscription = new Subscription();
    this.userQuery = this.apollo.watchQuery < any > ({
      query: gql `
        query user {
          user {
            id,
            firstName,
            lastName,
            email
          }
        }
      `
    });
  }

  ngOnInit() {
    this.querySuscription = this.userQuery.valueChanges.subscribe(({ data }) => {
      this.user = data.user;
    });
  }

  logout() {
    localStorage.removeItem('p');
    this.router.navigate(['/login']);
  }
}
