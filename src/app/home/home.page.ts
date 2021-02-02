import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { Plugins } from '@capacitor/core';
const { Network } = Plugins;

import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
    
  apiData : any;
  limit = 2;

  constructor(private http: HttpClient,
              private toastController: ToastController
              ) {}
    
   async presentToast(message: string) {
    const toast =  await this.toastController.create({
      message: message,
      duration: 5000,
      buttons: [
        {
            text: 'OK',
            role: 'cancel',
            handler: () =>{
                console.log('Cancel clicked');
            }
        }
      ]
    });
       toast.present();
  }
    
  async getData(event = undefined){
      
       let status = await Network.getStatus();
       if (!status.connected) {
           this.presentToast("WARNING YOU ARE OFFLINE");
           return;
       }
       
       const URL = "https://picsum.photos/v2/list?limit=" + this.limit;
       this.http.get(URL).subscribe( (data) =>{
           
          this.apiData = data;
          this.apiData.reverse();
          if (event) event.target.complete();
           
          console.log('Données récup : ', data);
      })
   }
    
   doRefresh(event) {
    console.log('Begin async operation');
    this.limit += 2;
    this.getData(event);
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 5000);
  }
    
    
  
  
    
    
  ionViewWillEnter(){
      
      this.getData();
      
      let handler = Network.addListener('networkStatusChange', (status) => {
          
        const message = !status.connected ? "Warning !!! You are Offline" : "Yes !!! You are Online" ;
          
        this.presentToast(message);
          
        console.log("Network status changed", status);
          
      });
      
  } 
    
}
