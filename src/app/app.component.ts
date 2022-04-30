import { Component } from '@angular/core';
import {Elgamal} from './Elgamal'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'elgamal';
  public simpleText: number;
  public cipherText:Map<string,number>;
  public InputedCipherText:number;
  public privateKey:number;
  public showKeys:boolean = false;
  public showCipherText:boolean = false;
  public showDecipheredText = false;
  public elgamal:Elgamal;
  public keys:Map<string,number>;
  public C1:number;
  public C2:number;
  public decipheredText: number;
  public prime_list:number[];
  constructor()
  {
    this.prime_list = this.sieve(1000000);
  }
  sieve(n:number){
    let prime = Array.from({length: n+1}, (_, i) => true);
    let prime_list = Array<number>();
    for (let i = 2; i*i <=n; i++){
      if (prime[i] == true)
      {
        for(let j = i*i ; j<=n;j+=i)
        {
          prime[j] = false
        }
    }
    }
    for(let i =2 ;i<=n;i++)
    {
      if (prime[i] == true)
      {
        prime_list.push(i);
      }
    }
    return prime_list;
  }
  generateKeys()
  {
      let q = this.prime_list[Math.floor(Math.random()*this.prime_list.length)];
      this.elgamal = new Elgamal(q);
      this.keys= this.elgamal.generateKeys();
      this.showKeys = true;
  }
  encrypt(){
    this.cipherText = this.elgamal.encrypt(this.keys,this.simpleText);
    this.showCipherText = true;

  }

  decrypt(){
    let cipherText = new Map<string,number>();
    cipherText.set("C1",this.C1);
    cipherText.set("C2",this.C2);
    this.decipheredText = this.elgamal.decrypt(cipherText,this.privateKey);
    this.showDecipheredText = true;
  }
}
