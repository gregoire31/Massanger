import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UtilisateursPage } from './utilisateurs.page';

const routes: Routes = [
  {
    path: '',
    component: UtilisateursPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UtilisateursPage]
})
export class UtilisateursPageModule {}
