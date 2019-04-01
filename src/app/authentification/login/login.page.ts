import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase'
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {AngularFireStorage} from '@angular/fire/storage'

//get e164() {
//  const num = this.country + this.area + this.prefix + this.line
//  return `+${num}`
//}


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginVerification : boolean = true
  phoneNumber: string
  email: string
  password: string
  user : any
  windowRef : any
  testVerificationCode : string = "123456"
  verificationCode : string
  appVerifier : any
  nomRegister : string = ""
  myPhoto = ""
  refreshPage : boolean = false
  logosrc: string = ""

  constructor(private userService : UserService, private camera: Camera, private storage : AngularFireStorage ) { }

  ngOnInit() {
    
    let self = this
    this.windowRef = window

    this.storage.ref('icon.png').getDownloadURL().subscribe(link=> {
      this.logosrc = link
    })

    setTimeout(function(){ 
      self.windowRef.recapchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
      self.windowRef.recapchaVerifier.render()
     }, 1);

  }

  goBack() {
    location.reload();
  }

sendLoginCode() {
  const appVerifier = this.windowRef.recapchaVerifier;
  if(this.phoneNumber.length !== 10){
    this.userService.presentToastWithOptionsWithMessage("Numéro incorrect","danger")
  }else{
    const num = `+33${this.phoneNumber}`
    firebase.auth().signInWithPhoneNumber(num,appVerifier)
    .then(result => {
      this.windowRef.confirmationResult = result;
    }).catch(error => this.userService.presentToastWithOptionsWithMessage("Veuillez faire le Captcha","danger"))
  }

}

verifyLoginCode(){

  if(this.loginVerification === true){
    
    this.windowRef.confirmationResult
    .confirm(this.verificationCode)
    .then(user => {
  
      this.userService.setUserOnLine(user.user.uid)
    }).then(()=>{
      this.userService.navigateTo('app')
    })
    .catch(error => this.userService.presentToastWithOptionsWithMessage("Code incorrect","danger"));
  }else{
    let photoURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ynxbF7WkDlJ2FwWIxBfoMWUZ_a1EIIAc9XXxwiSwUua9AcVqzdpAnL0w2Q"
    if(this.myPhoto ==""){
      photoURL = this.myPhoto
    }
    this.windowRef.confirmationResult
    .confirm(this.verificationCode)
    .then(result => {
      this.user = result.user;
      return result
    }).then(user => {
      this.userService.addUserDetails(user.user.uid,this.nomRegister,photoURL)
      user.user.updateProfile({
        displayName: this.nomRegister,
        photoURL: photoURL,
      })
      this.userService.setUserOnLine(user.user.uid)
    }).then(()=>{
      this.userService.navigateTo('app')
    })
    .catch(error => this.userService.presentToastWithOptionsWithMessage("Code incorrect","danger"));
  }
  
}
  authentification(verif : boolean){
    this.loginVerification = verif
  }

  getImage(){
    const options:CameraOptions = {
      quality : 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum : false

    }

    this.camera.getPicture(options).then((imageData)=> {
      this.myPhoto ='data:image/jpeg;base64,'+ imageData
    })
  }


  takeImage(){
    const options:CameraOptions = {
      quality : 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType : this.camera.MediaType.PICTURE,
      correctOrientation : true
      //saveToPhotoAlbum : false

    }

    this.camera.getPicture(options).then((imageData)=> {
      this.myPhoto ='data:image/jpeg;base64,'+ imageData
    }, (err) => {

    })
  }

}
