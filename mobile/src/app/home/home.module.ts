import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { HomePageRoutingModule } from './home-routing.module';
import { DateFilterModule } from '../date-filter/date-filter.module';
import { TransactionsService } from '../services/data/transactions.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    HomePageRoutingModule,
    DateFilterModule
  ],
  declarations: [HomePage],
  providers: [TransactionsService]
})
export class HomePageModule {}
