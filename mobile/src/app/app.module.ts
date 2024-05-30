import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

import { environment } from '../environments/environment';
import { setContext } from '@apollo/client/link/context';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ApolloModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        const http = httpLink.create({ uri: environment.graphqlUrl });
        const auth = setContext((_, { headers }) => {
          const token = localStorage.getItem('p');
          return {
            headers: {
              ...headers,
              authorization: token ? `Bearer ${token}` : "",
            }
          };
        });
        return {
          link: auth.concat(http),
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink]
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
